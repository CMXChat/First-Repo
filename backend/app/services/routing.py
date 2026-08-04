from __future__ import annotations

import asyncio
import json
import time
from collections import OrderedDict
from dataclasses import dataclass
from datetime import UTC, datetime
from ipaddress import ip_address, ip_network
from typing import Any, Awaitable, Callable
from urllib.parse import urlencode

import httpx

from ..config import Settings
from .enrichment import (
    EnrichmentBlockedTarget,
    EnrichmentResponseTooLarge,
    EnrichmentUpstreamError,
    EnrichmentValidationError,
)

RIPESTAT_BASE = "https://stat.ripe.net/data"
SOURCE_APP = "cmx-restricted-node"
CACHE_MAX_ENTRIES = 512


@dataclass(slots=True)
class RoutingCacheEntry:
    expires_at: float
    value: dict[str, Any]


class RoutingService:
    """Bounded RIPEstat routing and RPKI adapters with fixed provider endpoints."""

    def __init__(self, client: httpx.AsyncClient, settings: Settings) -> None:
        self.client = client
        self.settings = settings
        self._cache: OrderedDict[tuple[str, str], RoutingCacheEntry] = OrderedDict()
        self._lock = asyncio.Lock()

    async def origin(self, resource: str) -> tuple[dict[str, Any], bool]:
        normalized, resource_type = normalize_network_resource(resource, allow_ip=True, allow_prefix=True)
        adapter = "network_info" if resource_type == "ip" else "prefix_overview"
        endpoint = "network-info" if resource_type == "ip" else "prefix-overview"
        return await self._cached(
            ("origin", normalized),
            lambda: self._collect_origin(endpoint, adapter, normalized, resource_type),
        )

    async def announced_prefixes(self, asn: str) -> tuple[dict[str, Any], bool]:
        normalized = normalize_asn(asn)
        return await self._cached(
            ("announced_prefixes", normalized),
            lambda: self._collect_announced_prefixes(normalized),
        )

    async def visibility(self, resource: str) -> tuple[dict[str, Any], bool]:
        normalized, resource_type = normalize_network_resource(resource, allow_ip=True, allow_prefix=True)
        return await self._cached(
            ("visibility", normalized),
            lambda: self._collect_visibility(normalized, resource_type),
        )

    async def rpki(self, prefix: str, asn: str) -> tuple[dict[str, Any], bool]:
        normalized_prefix, resource_type = normalize_network_resource(prefix, allow_ip=False, allow_prefix=True)
        if resource_type != "prefix":
            raise EnrichmentValidationError("RPKI validation requires a public IP prefix")
        normalized_asn = normalize_asn(asn)
        return await self._cached(
            ("rpki", f"{normalized_prefix}:{normalized_asn}"),
            lambda: self._collect_rpki(normalized_prefix, normalized_asn),
        )

    async def _cached(
        self,
        key: tuple[str, str],
        producer: Callable[[], Awaitable[dict[str, Any]]],
    ) -> tuple[dict[str, Any], bool]:
        now = time.monotonic()
        async with self._lock:
            self._prune(now)
            cached = self._cache.get(key)
            if cached is not None:
                self._cache.move_to_end(key)
                return cached.value, True

        value = await asyncio.wait_for(
            producer(),
            timeout=self.settings.enrichment_timeout_seconds,
        )
        if self.settings.enrichment_cache_ttl_seconds > 0:
            async with self._lock:
                self._prune(time.monotonic())
                self._cache[key] = RoutingCacheEntry(
                    expires_at=time.monotonic() + self.settings.enrichment_cache_ttl_seconds,
                    value=value,
                )
                self._cache.move_to_end(key)
                while len(self._cache) > CACHE_MAX_ENTRIES:
                    self._cache.popitem(last=False)
        return value, False

    def _prune(self, now: float) -> None:
        expired = [key for key, entry in self._cache.items() if entry.expires_at <= now]
        for key in expired:
            self._cache.pop(key, None)

    async def _collect_origin(
        self,
        endpoint: str,
        adapter: str,
        resource: str,
        resource_type: str,
    ) -> dict[str, Any]:
        source_url = ripestat_url(endpoint, resource=resource)
        payload = await self._fetch_data(source_url)
        if adapter == "network_info":
            prefix = safe_prefix(payload.get("prefix"))
            asns = normalize_asn_list(payload.get("asns"))
            result = {
                "resource": resource,
                "resource_type": resource_type,
                "matched_prefix": prefix,
                "origin_asns": asns,
                "routed": bool(prefix and asns),
            }
        else:
            asns = normalize_asn_objects(payload.get("asns"))
            result = {
                "resource": safe_text(payload.get("resource"), 200) or resource,
                "resource_type": resource_type,
                "announced": bool(payload.get("announced")),
                "origin_asns": asns,
                "is_less_specific": bool(payload.get("is_less_specific")),
                "related_prefixes": normalize_prefix_list(payload.get("related_prefixes")),
                "actual_related_count": safe_int(payload.get("actual_num_related"), 0, 1_000_000),
                "filtered_count": safe_int(payload.get("num_filtered_out"), 0, 1_000_000),
                "query_time": safe_text(payload.get("query_time"), 100),
            }
        return routing_envelope(adapter, source_url, resource, result)

    async def _collect_announced_prefixes(self, asn: str) -> dict[str, Any]:
        source_url = ripestat_url("announced-prefixes", resource=f"AS{asn}")
        payload = await self._fetch_data(source_url)
        records: list[dict[str, Any]] = []
        for item in as_list(payload.get("prefixes"))[: self.settings.enrichment_max_records]:
            if not isinstance(item, dict):
                continue
            prefix = safe_prefix(item.get("prefix"))
            if not prefix:
                continue
            timelines = []
            for timeline in as_list(item.get("timelines"))[:10]:
                if not isinstance(timeline, dict):
                    continue
                timelines.append({
                    "start": safe_text(timeline.get("starttime"), 100),
                    "end": safe_text(timeline.get("endtime"), 100),
                })
            records.append({"prefix": prefix, "timelines": timelines})
        result = {
            "asn": asn,
            "prefixes": records,
            "returned_records": len(records),
            "provider_record_count": len(as_list(payload.get("prefixes"))),
            "query_start": safe_text(payload.get("query_starttime"), 100),
            "query_end": safe_text(payload.get("query_endtime"), 100),
            "earliest_time": safe_text(payload.get("earliest_time"), 100),
            "latest_time": safe_text(payload.get("latest_time"), 100),
            "truncated": len(as_list(payload.get("prefixes"))) > len(records),
        }
        return routing_envelope("announced_prefixes", source_url, f"AS{asn}", result)

    async def _collect_visibility(self, resource: str, resource_type: str) -> dict[str, Any]:
        source_url = ripestat_url("looking-glass", resource=resource, look_back_limit="86400")
        payload = await self._fetch_data(source_url)
        collectors: list[dict[str, Any]] = []
        peer_budget = self.settings.enrichment_max_records
        for collector in as_list(payload.get("rrcs"))[:20]:
            if not isinstance(collector, dict) or peer_budget <= 0:
                continue
            peers = []
            for peer in as_list(collector.get("peers")):
                if not isinstance(peer, dict) or peer_budget <= 0:
                    break
                as_path = [safe_int(value, 1, 4_294_967_295) for value in as_list(peer.get("as_path"))[:100]]
                as_path = [value for value in as_path if value]
                peers.append({
                    "peer": safe_text(peer.get("peer"), 100),
                    "prefix": safe_prefix(peer.get("prefix")),
                    "origin_asn": safe_int(peer.get("asn_origin") or peer.get("asn_orgin"), 0, 4_294_967_295),
                    "origin_type": safe_text(peer.get("origin"), 40),
                    "as_path": as_path,
                    "last_updated": safe_text(peer.get("last_updated"), 100),
                    "latest_time": safe_text(peer.get("latest_time"), 100),
                })
                peer_budget -= 1
            collectors.append({
                "rrc": safe_text(collector.get("rrc"), 40),
                "location": safe_text(collector.get("location"), 200),
                "peers": peers,
            })
        result = {
            "resource": resource,
            "resource_type": resource_type,
            "latest_time": safe_text(payload.get("latest_time"), 100),
            "collectors": collectors,
            "collector_count": len(collectors),
            "peer_records": sum(len(item["peers"]) for item in collectors),
            "truncated": peer_budget <= 0,
        }
        return routing_envelope("route_visibility", source_url, resource, result)

    async def _collect_rpki(self, prefix: str, asn: str) -> dict[str, Any]:
        source_url = ripestat_url("rpki-validation", resource=asn, prefix=prefix)
        payload = await self._fetch_data(source_url)
        provider_status = safe_text(payload.get("status"), 80).lower()
        state_map = {
            "valid": "valid",
            "invalid_asn": "invalid",
            "invalid_length": "invalid",
            "unknown": "not_found",
        }
        result = {
            "prefix": safe_prefix(payload.get("prefix")) or prefix,
            "asn": normalize_asn(payload.get("resource") or asn),
            "state": state_map.get(provider_status, "unavailable"),
            "provider_status": provider_status or "unavailable",
            "description": safe_text(payload.get("description"), 2000),
        }
        return routing_envelope("rpki_validation", source_url, f"{prefix} AS{asn}", result)

    async def _fetch_data(self, source_url: str) -> dict[str, Any]:
        try:
            async with self.client.stream(
                "GET",
                source_url,
                timeout=self.settings.enrichment_timeout_seconds,
                headers={"accept": "application/json"},
            ) as response:
                if 300 <= response.status_code < 400:
                    raise EnrichmentUpstreamError("RIPEstat redirect was refused")
                if response.status_code != 200:
                    raise EnrichmentUpstreamError(f"RIPEstat returned HTTP {response.status_code}")
                body = bytearray()
                async for chunk in response.aiter_bytes():
                    body.extend(chunk)
                    if len(body) > self.settings.enrichment_max_response_bytes:
                        raise EnrichmentResponseTooLarge("RIPEstat response exceeded the configured size limit")
        except httpx.TimeoutException as exc:
            raise TimeoutError("RIPEstat request timed out") from exc
        except httpx.HTTPError as exc:
            raise EnrichmentUpstreamError("RIPEstat request failed") from exc

        try:
            payload = json.loads(body)
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise EnrichmentUpstreamError("RIPEstat returned invalid JSON") from exc
        if not isinstance(payload, dict):
            raise EnrichmentUpstreamError("RIPEstat returned an unexpected response")
        if payload.get("status") != "ok" or not isinstance(payload.get("data"), dict):
            message = safe_text(payload.get("message"), 500) or "RIPEstat reported an unavailable result"
            raise EnrichmentUpstreamError(message)
        return payload["data"]


def normalize_network_resource(
    value: Any,
    *,
    allow_ip: bool,
    allow_prefix: bool,
) -> tuple[str, str]:
    text = safe_text(value, 200)
    if not text:
        raise EnrichmentValidationError("Enter a public IP address or prefix")
    if "/" in text:
        if not allow_prefix:
            raise EnrichmentValidationError("This routing lookup does not accept prefixes")
        try:
            network = ip_network(text, strict=False)
        except ValueError as exc:
            raise EnrichmentValidationError("Enter a valid IP prefix") from exc
        if network.prefixlen == 0 or not network.network_address.is_global:
            raise EnrichmentBlockedTarget("Routing lookups permit public global prefixes only")
        return str(network), "prefix"
    if not allow_ip:
        raise EnrichmentValidationError("Enter a public IP prefix")
    try:
        address = ip_address(text)
    except ValueError as exc:
        raise EnrichmentValidationError("Enter a valid public IP address") from exc
    if not address.is_global:
        raise EnrichmentBlockedTarget("Routing lookups permit public global IP addresses only")
    return str(address), "ip"


def normalize_asn(value: Any) -> str:
    text = safe_text(value, 40).upper()
    if text.startswith("AS"):
        text = text[2:]
    if not text.isdigit():
        raise EnrichmentValidationError("Enter an ASN such as AS13335")
    number = int(text)
    if number < 1 or number > 4_294_967_295:
        raise EnrichmentValidationError("ASN is outside the supported public range")
    return str(number)


def ripestat_url(endpoint: str, **params: str) -> str:
    query = urlencode({**params, "sourceapp": SOURCE_APP})
    return f"{RIPESTAT_BASE}/{endpoint}/data.json?{query}"


def routing_envelope(adapter: str, source_url: str, target: str, result: dict[str, Any]) -> dict[str, Any]:
    return {
        "adapter": adapter,
        "provider": "RIPEstat Data API",
        "source_url": source_url,
        "collected_at": datetime.now(UTC).isoformat(),
        "target": target,
        "result": result,
        "limitation": "Routing observations describe public control-plane visibility and RPKI state. They do not establish ownership, control, attribution, compromise, or malicious activity.",
    }


def normalize_asn_list(value: Any) -> list[int]:
    output = []
    for item in as_list(value)[:100]:
        try:
            number = int(str(item).removeprefix("AS"))
        except ValueError:
            continue
        if 1 <= number <= 4_294_967_295 and number not in output:
            output.append(number)
    return output


def normalize_asn_objects(value: Any) -> list[dict[str, Any]]:
    output = []
    for item in as_list(value)[:100]:
        if isinstance(item, dict):
            asn = safe_int(item.get("asn"), 0, 4_294_967_295)
            if asn:
                output.append({"asn": asn, "holder": safe_text(item.get("holder"), 500)})
        else:
            asn = safe_int(item, 0, 4_294_967_295)
            if asn:
                output.append({"asn": asn, "holder": ""})
    return output


def normalize_prefix_list(value: Any) -> list[str]:
    output = []
    for item in as_list(value)[:100]:
        candidate = item.get("prefix") if isinstance(item, dict) else item
        prefix = safe_prefix(candidate)
        if prefix and prefix not in output:
            output.append(prefix)
    return output


def safe_prefix(value: Any) -> str:
    text = safe_text(value, 200)
    if not text:
        return ""
    try:
        return str(ip_network(text, strict=False))
    except ValueError:
        return ""


def safe_text(value: Any, limit: int) -> str:
    return str(value or "").strip()[:limit]


def safe_int(value: Any, minimum: int, maximum: int) -> int:
    try:
        number = int(value)
    except (TypeError, ValueError):
        return minimum
    return max(minimum, min(maximum, number))


def as_list(value: Any) -> list[Any]:
    return value if isinstance(value, list) else []
