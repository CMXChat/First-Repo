from __future__ import annotations

import asyncio
import re
import time
from dataclasses import dataclass
from typing import Any, Literal

import httpx

from ..config import Settings

DnsType = Literal["A", "AAAA", "CNAME", "MX", "NS", "TXT", "CAA", "SOA"]
ALLOWED_DNS_TYPES: set[str] = {"A", "AAAA", "CNAME", "MX", "NS", "TXT", "CAA", "SOA"}
DNS_NAME_PATTERN = re.compile(
    r"^(?=.{1,253}\.?$)(?:_?[a-z0-9](?:[a-z0-9_-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}\.?$",
    re.IGNORECASE,
)


@dataclass(slots=True)
class CacheEntry:
    expires_at: float
    value: dict[str, Any]


class DnsResolverService:
    """Small same-origin gateway for Google Public DNS JSON responses."""

    def __init__(self, client: httpx.AsyncClient, settings: Settings) -> None:
        self.client = client
        self.settings = settings
        self._cache: dict[tuple[str, str], CacheEntry] = {}
        self._lock = asyncio.Lock()

    async def resolve(self, name: str, record_type: str) -> tuple[dict[str, Any], bool]:
        normalized_name = validate_dns_name(name)
        normalized_type = validate_dns_type(record_type)
        key = (normalized_name, normalized_type)
        now = time.monotonic()

        async with self._lock:
            cached = self._cache.get(key)
            if cached and cached.expires_at > now:
                return cached.value, True
            if cached:
                self._cache.pop(key, None)

        response = await self.client.get(
            "https://dns.google/resolve",
            params={"name": normalized_name, "type": normalized_type, "cd": "false", "do": "true"},
            headers={"accept": "application/dns-json"},
            timeout=self.settings.dns_timeout_seconds,
        )
        response.raise_for_status()
        payload = response.json()
        value = normalize_dns_payload(normalized_name, normalized_type, payload)

        if self.settings.dns_cache_ttl_seconds > 0:
            async with self._lock:
                self._cache[key] = CacheEntry(
                    expires_at=now + self.settings.dns_cache_ttl_seconds,
                    value=value,
                )
        return value, False


def validate_dns_name(value: str) -> str:
    normalized = value.strip().lower().rstrip(".")
    if not DNS_NAME_PATTERN.fullmatch(normalized):
        raise ValueError("Invalid DNS name")
    return normalized


def validate_dns_type(value: str) -> str:
    normalized = value.strip().upper()
    if normalized not in ALLOWED_DNS_TYPES:
        raise ValueError("Unsupported DNS record type")
    return normalized


def normalize_dns_payload(name: str, record_type: str, payload: Any) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise ValueError("Resolver returned an invalid JSON object")

    answers = []
    for answer in payload.get("Answer", []) if isinstance(payload.get("Answer"), list) else []:
        if not isinstance(answer, dict):
            continue
        answers.append(
            {
                "name": str(answer.get("name", name)),
                "type": int(answer.get("type", 0)),
                "ttl": int(answer["TTL"]) if answer.get("TTL") is not None else None,
                "data": str(answer.get("data", "")),
            }
        )

    return {
        "question": {"name": name, "type": record_type},
        "status": int(payload.get("Status", -1)),
        "authenticated_data": payload.get("AD") is True,
        "truncated": payload.get("TC") is True,
        "recursion_available": payload.get("RA") is True,
        "comment": str(payload.get("Comment", "")),
        "answers": answers,
    }
