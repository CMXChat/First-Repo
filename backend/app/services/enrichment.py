from __future__ import annotations

import asyncio
import hashlib
import ipaddress
import json
import re
import socket
import ssl
import tempfile
import time
from dataclasses import dataclass
from datetime import UTC, datetime
from pathlib import Path
from typing import Any, Awaitable, Callable
from urllib.parse import quote, urljoin, urlsplit, urlunsplit

import httpx

from ..config import Settings

DOMAIN_PATTERN = re.compile(
    r"^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$",
    re.IGNORECASE,
)
ASN_PATTERN = re.compile(r"^(?:AS)?([0-9]{1,10})$", re.IGNORECASE)
HTTP_STATUS_PATTERN = re.compile(r"^HTTP/(\d(?:\.\d)?)\s+(\d{3})(?:\s+(.*))?$")
BOOTSTRAP_URLS = {
    "domain": "https://data.iana.org/rdap/dns.json",
    "ipv4": "https://data.iana.org/rdap/ipv4.json",
    "ipv6": "https://data.iana.org/rdap/ipv6.json",
    "asn": "https://data.iana.org/rdap/asn.json",
}
SELECTED_HTTP_HEADERS = {
    "server",
    "date",
    "content-type",
    "content-length",
    "location",
    "strict-transport-security",
    "content-security-policy",
    "x-content-type-options",
    "x-frame-options",
    "referrer-policy",
    "permissions-policy",
    "cache-control",
    "etag",
    "last-modified",
}


class EnrichmentError(Exception):
    """Base class for bounded enrichment failures."""


class EnrichmentValidationError(EnrichmentError):
    pass


class EnrichmentBlockedTarget(EnrichmentError):
    pass


class EnrichmentUpstreamError(EnrichmentError):
    pass


class EnrichmentResponseTooLarge(EnrichmentError):
    pass


@dataclass(slots=True)
class CacheEntry:
    expires_at: float
    value: dict[str, Any]


@dataclass(frozen=True, slots=True)
class ProbeTarget:
    scheme: str
    host: str
    port: int
    request_target: str
    normalized_url: str


class EnrichmentService:
    """Bounded public-infrastructure adapters with explicit provenance."""

    def __init__(self, client: httpx.AsyncClient, settings: Settings) -> None:
        self.client = client
        self.settings = settings
        self._cache: dict[tuple[str, str], CacheEntry] = {}
        self._bootstrap_cache: dict[str, CacheEntry] = {}
        self._lock = asyncio.Lock()

    async def rdap(self, target: str) -> tuple[dict[str, Any], bool]:
        target_type, normalized = classify_rdap_target(target)
        return await self._cached(
            ("rdap", f"{target_type}:{normalized}"),
            lambda: self._collect_rdap(target_type, normalized),
        )

    async def certificate_transparency(
        self,
        domain: str,
        *,
        include_subdomains: bool = True,
    ) -> tuple[dict[str, Any], bool]:
        normalized = normalize_domain(domain)
        key = ("ct", f"{normalized}:{int(include_subdomains)}")
        return await self._cached(
            key,
            lambda: self._collect_certificate_transparency(normalized, include_subdomains),
        )

    async def http_headers(self, url: str) -> tuple[dict[str, Any], bool]:
        target = validate_probe_url(url)
        return await self._cached(
            ("http", target.normalized_url),
            lambda: self._collect_http_headers(target),
        )

    async def tls_certificate(self, host: str, port: int = 443) -> tuple[dict[str, Any], bool]:
        normalized_host = normalize_public_host(host)
        if port != 443:
            raise EnrichmentValidationError("TLS inspection currently permits port 443 only")
        return await self._cached(
            ("tls", f"{normalized_host}:{port}"),
            lambda: self._collect_tls_certificate(normalized_host, port),
        )

    async def _cached(
        self,
        key: tuple[str, str],
        producer: Callable[[], Awaitable[dict[str, Any]]],
    ) -> tuple[dict[str, Any], bool]:
        now = time.monotonic()
        async with self._lock:
            cached = self._cache.get(key)
            if cached and cached.expires_at > now:
                return cached.value, True
            if cached:
                self._cache.pop(key, None)

        value = await producer()
        if self.settings.enrichment_cache_ttl_seconds > 0:
            async with self._lock:
                self._cache[key] = CacheEntry(
                    expires_at=time.monotonic() + self.settings.enrichment_cache_ttl_seconds,
                    value=value,
                )
        return value, False

    async def _collect_rdap(self, target_type: str, target: str) -> dict[str, Any]:
        bootstrap_kind = target_type if target_type != "ip" else ip_bootstrap_kind(target)
        bootstrap = await self._get_bootstrap(bootstrap_kind)
        service_base = select_rdap_service(bootstrap, target_type, target)
        endpoint_type = "autnum" if target_type == "asn" else target_type
        source_url = urljoin(ensure_trailing_slash(service_base), f"{endpoint_type}/{quote(target, safe=':')}")
        validate_provider_url(source_url)
        payload = await self._fetch_json(source_url, expected_container=dict)
        return {
            "adapter": "rdap",
            "provider": provider_label(source_url),
            "source_url": source_url,
            "collected_at": utc_now(),
            "target": target,
            "target_type": target_type,
            "result": normalize_rdap_payload(target_type, payload),
        }

    async def _collect_certificate_transparency(
        self,
        domain: str,
        include_subdomains: bool,
    ) -> dict[str, Any]:
        query = f"%.{domain}" if include_subdomains else domain
        source_url = f"https://crt.sh/?q={quote(query, safe='')}&output=json"
        payload = await self._fetch_json(
            "https://crt.sh/",
            params={"q": query, "output": "json"},
            expected_container=list,
        )
        records, total = normalize_ct_payload(payload, self.settings.enrichment_max_records)
        return {
            "adapter": "certificate_transparency",
            "provider": "crt.sh Certificate Search",
            "source_url": source_url,
            "collected_at": utc_now(),
            "target": domain,
            "include_subdomains": include_subdomains,
            "result": {
                "records": records,
                "returned_records": len(records),
                "observed_records": total,
                "truncated": total > len(records),
                "interpretation": "Certificate Transparency observations show certificate issuance, not current host ownership or active service availability.",
            },
        }

    async def _collect_http_headers(self, target: ProbeTarget) -> dict[str, Any]:
        addresses = await resolve_public_addresses(target.host, target.port)
        value = await asyncio.to_thread(
            probe_http_headers,
            target,
            addresses,
            self.settings.enrichment_timeout_seconds,
            self.settings.enrichment_max_header_bytes,
        )
        return {
            "adapter": "http_headers",
            "provider": "Direct public endpoint inspection",
            "source_url": target.normalized_url,
            "collected_at": utc_now(),
            "target": target.normalized_url,
            "result": value,
        }

    async def _collect_tls_certificate(self, host: str, port: int) -> dict[str, Any]:
        addresses = await resolve_public_addresses(host, port)
        value = await asyncio.to_thread(
            inspect_tls_certificate,
            host,
            port,
            addresses,
            self.settings.enrichment_timeout_seconds,
        )
        return {
            "adapter": "tls_certificate",
            "provider": "Direct TLS handshake",
            "source_url": f"tls://{host}:{port}",
            "collected_at": utc_now(),
            "target": host,
            "result": value,
        }

    async def _get_bootstrap(self, kind: str) -> dict[str, Any]:
        now = time.monotonic()
        async with self._lock:
            cached = self._bootstrap_cache.get(kind)
            if cached and cached.expires_at > now:
                return cached.value
            if cached:
                self._bootstrap_cache.pop(kind, None)

        url = BOOTSTRAP_URLS[kind]
        payload = await self._fetch_json(url, expected_container=dict)
        async with self._lock:
            self._bootstrap_cache[kind] = CacheEntry(
                expires_at=time.monotonic() + self.settings.enrichment_bootstrap_ttl_seconds,
                value=payload,
            )
        return payload

    async def _fetch_json(
        self,
        url: str,
        *,
        params: dict[str, str] | None = None,
        expected_container: type[dict] | type[list],
    ) -> Any:
        try:
            async with self.client.stream(
                "GET",
                url,
                params=params,
                headers={"accept": "application/rdap+json, application/json"},
                timeout=self.settings.enrichment_timeout_seconds,
                follow_redirects=False,
            ) as response:
                if response.status_code >= 400:
                    raise EnrichmentUpstreamError(f"Provider returned HTTP {response.status_code}")
                if 300 <= response.status_code < 400:
                    raise EnrichmentUpstreamError("Provider redirect was not followed")
                body = bytearray()
                async for chunk in response.aiter_bytes():
                    body.extend(chunk)
                    if len(body) > self.settings.enrichment_max_response_bytes:
                        raise EnrichmentResponseTooLarge("Provider response exceeded the configured size limit")
        except httpx.TimeoutException as exc:
            raise TimeoutError("Enrichment provider timed out") from exc
        except httpx.HTTPError as exc:
            raise EnrichmentUpstreamError("Enrichment provider request failed") from exc

        try:
            payload = json.loads(body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise EnrichmentUpstreamError("Provider returned invalid JSON") from exc
        if not isinstance(payload, expected_container):
            raise EnrichmentUpstreamError("Provider returned an unexpected JSON structure")
        return payload


def classify_rdap_target(value: str) -> tuple[str, str]:
    candidate = value.strip()
    if not candidate:
        raise EnrichmentValidationError("RDAP target is required")

    try:
        address = ipaddress.ip_address(candidate)
    except ValueError:
        address = None
    if address is not None:
        ensure_public_ip(address)
        return "ip", address.compressed

    asn_match = ASN_PATTERN.fullmatch(candidate)
    if asn_match:
        asn = int(asn_match.group(1))
        if not 1 <= asn <= 4_294_967_295:
            raise EnrichmentValidationError("ASN is outside the supported range")
        return "asn", str(asn)

    return "domain", normalize_domain(candidate)


def normalize_domain(value: str) -> str:
    candidate = value.strip().lower().rstrip(".")
    if not candidate:
        raise EnrichmentValidationError("Domain is required")
    try:
        ascii_domain = candidate.encode("idna").decode("ascii")
    except UnicodeError as exc:
        raise EnrichmentValidationError("Domain could not be normalized") from exc
    if not DOMAIN_PATTERN.fullmatch(ascii_domain):
        raise EnrichmentValidationError("Enter a valid public domain name")
    return ascii_domain


def normalize_public_host(value: str) -> str:
    candidate = value.strip().strip("[]")
    try:
        address = ipaddress.ip_address(candidate)
    except ValueError:
        return normalize_domain(candidate)
    ensure_public_ip(address)
    return address.compressed


def ensure_public_ip(address: ipaddress.IPv4Address | ipaddress.IPv6Address) -> None:
    if not address.is_global or any(
        (
            address.is_private,
            address.is_loopback,
            address.is_link_local,
            address.is_multicast,
            address.is_reserved,
            address.is_unspecified,
        )
    ):
        raise EnrichmentBlockedTarget("Target must resolve to a permitted public IP address")


def validate_probe_url(value: str) -> ProbeTarget:
    candidate = value.strip()
    if len(candidate) > 4096:
        raise EnrichmentValidationError("URL is too long")
    try:
        parsed = urlsplit(candidate)
    except ValueError as exc:
        raise EnrichmentValidationError("Enter a valid HTTP or HTTPS URL") from exc
    if parsed.scheme not in {"http", "https"}:
        raise EnrichmentValidationError("Only HTTP and HTTPS URLs are permitted")
    if parsed.username or parsed.password:
        raise EnrichmentValidationError("User information is not permitted in the URL")
    if parsed.fragment:
        raise EnrichmentValidationError("URL fragments are not sent to servers and must be removed")
    if not parsed.hostname:
        raise EnrichmentValidationError("URL host is required")

    host = normalize_public_host(parsed.hostname)
    default_port = 443 if parsed.scheme == "https" else 80
    try:
        port = parsed.port or default_port
    except ValueError as exc:
        raise EnrichmentValidationError("URL port is invalid") from exc
    if port != default_port:
        raise EnrichmentValidationError("Only standard HTTP and HTTPS ports are permitted")

    path = parsed.path or "/"
    request_target = path + (f"?{parsed.query}" if parsed.query else "")
    if len(request_target) > 4096:
        raise EnrichmentValidationError("URL path and query are too long")
    display_host = f"[{host}]" if ":" in host else host
    normalized_url = urlunsplit((parsed.scheme, display_host, path, parsed.query, ""))
    return ProbeTarget(
        scheme=parsed.scheme,
        host=host,
        port=port,
        request_target=request_target,
        normalized_url=normalized_url,
    )


async def resolve_public_addresses(host: str, port: int) -> list[str]:
    loop = asyncio.get_running_loop()
    try:
        records = await loop.getaddrinfo(host, port, type=socket.SOCK_STREAM)
    except socket.gaierror as exc:
        raise EnrichmentUpstreamError("Public host could not be resolved") from exc

    addresses: list[str] = []
    for family, _, _, _, sockaddr in records:
        if family not in {socket.AF_INET, socket.AF_INET6}:
            continue
        value = sockaddr[0]
        address = ipaddress.ip_address(value)
        ensure_public_ip(address)
        if address.compressed not in addresses:
            addresses.append(address.compressed)
    if not addresses:
        raise EnrichmentBlockedTarget("Target did not resolve to a permitted public IP address")
    return addresses


def probe_http_headers(
    target: ProbeTarget,
    addresses: list[str],
    timeout_seconds: float,
    max_header_bytes: int,
) -> dict[str, Any]:
    errors: list[str] = []
    for address in addresses:
        try:
            with socket.create_connection((address, target.port), timeout=timeout_seconds) as connection:
                stream: socket.socket = connection
                if target.scheme == "https":
                    context = ssl.create_default_context()
                    stream = context.wrap_socket(connection, server_hostname=target.host)
                host_header = f"[{target.host}]" if ":" in target.host else target.host
                request = (
                    f"HEAD {target.request_target} HTTP/1.1\r\n"
                    f"Host: {host_header}\r\n"
                    "User-Agent: CMX-Restricted-Node/0.3\r\n"
                    "Accept: */*\r\n"
                    "Connection: close\r\n\r\n"
                ).encode("ascii")
                stream.sendall(request)
                raw_headers = read_http_headers(stream, max_header_bytes)
                parsed = parse_http_headers(raw_headers)
                parsed.update(
                    {
                        "resolved_ip": address,
                        "scheme": target.scheme,
                        "host": target.host,
                        "port": target.port,
                        "request_method": "HEAD",
                        "redirect_followed": False,
                        "body_read": False,
                    }
                )
                if isinstance(stream, ssl.SSLSocket):
                    parsed["tls_version"] = stream.version()
                    cipher = stream.cipher()
                    parsed["cipher"] = cipher[0] if cipher else ""
                return parsed
        except (OSError, ssl.SSLError, EnrichmentError) as exc:
            errors.append(f"{address}: {type(exc).__name__}")
    raise EnrichmentUpstreamError(
        f"HTTP header inspection failed for all permitted addresses ({', '.join(errors[:3])})"
    )


def read_http_headers(stream: socket.socket, max_header_bytes: int) -> bytes:
    payload = bytearray()
    while b"\r\n\r\n" not in payload:
        chunk = stream.recv(min(4096, max_header_bytes + 1 - len(payload)))
        if not chunk:
            break
        payload.extend(chunk)
        if len(payload) > max_header_bytes:
            raise EnrichmentResponseTooLarge("HTTP response headers exceeded the configured size limit")
    marker = payload.find(b"\r\n\r\n")
    if marker < 0:
        raise EnrichmentUpstreamError("HTTP endpoint did not return a complete header block")
    return bytes(payload[: marker + 4])


def parse_http_headers(value: bytes) -> dict[str, Any]:
    lines = value.decode("iso-8859-1").split("\r\n")
    match = HTTP_STATUS_PATTERN.fullmatch(lines[0].strip()) if lines else None
    if not match:
        raise EnrichmentUpstreamError("HTTP endpoint returned an invalid status line")
    selected: dict[str, str] = {}
    for line in lines[1:]:
        if not line or ":" not in line:
            continue
        name, raw_value = line.split(":", 1)
        normalized_name = name.strip().lower()
        if normalized_name in SELECTED_HTTP_HEADERS:
            selected[normalized_name] = raw_value.strip()[:4096]
    status_code = int(match.group(2))
    return {
        "http_version": match.group(1),
        "status_code": status_code,
        "reason": (match.group(3) or "")[:200],
        "headers": selected,
        "redirect_location": selected.get("location", "") if 300 <= status_code < 400 else "",
    }


def inspect_tls_certificate(
    host: str,
    port: int,
    addresses: list[str],
    timeout_seconds: float,
) -> dict[str, Any]:
    errors: list[str] = []
    for address in addresses:
        try:
            return tls_handshake(host, port, address, timeout_seconds, verify=True)
        except ssl.SSLCertVerificationError as exc:
            try:
                result = tls_handshake(host, port, address, timeout_seconds, verify=False)
                result["verified"] = False
                result["verification_error"] = str(exc)[:1000]
                return result
            except (OSError, ssl.SSLError, EnrichmentError) as nested:
                errors.append(f"{address}: {type(nested).__name__}")
        except (OSError, ssl.SSLError, EnrichmentError) as exc:
            errors.append(f"{address}: {type(exc).__name__}")
    raise EnrichmentUpstreamError(
        f"TLS inspection failed for all permitted addresses ({', '.join(errors[:3])})"
    )


def tls_handshake(
    host: str,
    port: int,
    address: str,
    timeout_seconds: float,
    *,
    verify: bool,
) -> dict[str, Any]:
    context = ssl.create_default_context() if verify else ssl._create_unverified_context()
    with socket.create_connection((address, port), timeout=timeout_seconds) as connection:
        with context.wrap_socket(connection, server_hostname=host) as secure:
            der = secure.getpeercert(binary_form=True)
            if not der:
                raise EnrichmentUpstreamError("TLS endpoint did not provide a certificate")
            decoded = secure.getpeercert() if verify else decode_der_certificate(der)
            cipher = secure.cipher()
            return {
                "resolved_ip": address,
                "host": host,
                "port": port,
                "verified": verify,
                "verification_error": "",
                "tls_version": secure.version() or "",
                "cipher": cipher[0] if cipher else "",
                "alpn_protocol": secure.selected_alpn_protocol() or "",
                "sha256_fingerprint": hashlib.sha256(der).hexdigest(),
                "serial_number": str(decoded.get("serialNumber", "")),
                "subject": flatten_certificate_name(decoded.get("subject", ())),
                "issuer": flatten_certificate_name(decoded.get("issuer", ())),
                "not_before": certificate_time(decoded.get("notBefore")),
                "not_after": certificate_time(decoded.get("notAfter")),
                "subject_alt_names": [
                    {"type": str(kind), "value": str(value)}
                    for kind, value in decoded.get("subjectAltName", ())[:100]
                ],
                "subject_alt_name_count": len(decoded.get("subjectAltName", ())),
            }


def decode_der_certificate(value: bytes) -> dict[str, Any]:
    path: Path | None = None
    try:
        with tempfile.NamedTemporaryFile("w", encoding="ascii", delete=False) as handle:
            handle.write(ssl.DER_cert_to_PEM_cert(value))
            path = Path(handle.name)
        decoder = getattr(ssl._ssl, "_test_decode_cert", None)
        if decoder is None:
            return {}
        decoded = decoder(str(path))
        return decoded if isinstance(decoded, dict) else {}
    finally:
        if path is not None:
            path.unlink(missing_ok=True)


def flatten_certificate_name(value: Any) -> dict[str, str]:
    result: dict[str, str] = {}
    if not isinstance(value, tuple):
        return result
    for relative_name in value:
        if not isinstance(relative_name, tuple):
            continue
        for pair in relative_name:
            if isinstance(pair, tuple) and len(pair) == 2:
                result[str(pair[0])] = str(pair[1])
    return result


def certificate_time(value: Any) -> str:
    if not isinstance(value, str) or not value:
        return ""
    try:
        timestamp = ssl.cert_time_to_seconds(value)
    except ValueError:
        return value[:200]
    return datetime.fromtimestamp(timestamp, tz=UTC).isoformat()


def ip_bootstrap_kind(value: str) -> str:
    return "ipv4" if ipaddress.ip_address(value).version == 4 else "ipv6"


def select_rdap_service(bootstrap: dict[str, Any], target_type: str, target: str) -> str:
    services = bootstrap.get("services")
    if not isinstance(services, list):
        raise EnrichmentUpstreamError("IANA bootstrap data did not contain services")

    matches: list[tuple[int, str]] = []
    for service in services:
        if not isinstance(service, list) or len(service) < 2:
            continue
        keys, urls = service[0], service[1]
        if not isinstance(keys, list) or not isinstance(urls, list):
            continue
        https_urls = [str(url) for url in urls if str(url).startswith("https://")]
        if not https_urls:
            continue
        score = rdap_service_score(keys, target_type, target)
        if score >= 0:
            matches.append((score, https_urls[0]))
    if not matches:
        raise EnrichmentUpstreamError("No RDAP service was found in the IANA bootstrap data")
    matches.sort(key=lambda item: item[0], reverse=True)
    validate_provider_url(matches[0][1])
    return matches[0][1]


def rdap_service_score(keys: list[Any], target_type: str, target: str) -> int:
    if target_type == "domain":
        tld = target.rsplit(".", 1)[-1].lower()
        return 1 if any(str(key).lower() == tld for key in keys) else -1
    if target_type == "asn":
        asn = int(target)
        for key in keys:
            text = str(key)
            try:
                start_text, end_text = (text.split("-", 1) + [text])[:2] if "-" in text else (text, text)
                start, end = int(start_text), int(end_text)
            except ValueError:
                continue
            if start <= asn <= end:
                return 64 - (end - start).bit_length()
        return -1

    address = ipaddress.ip_address(target)
    best = -1
    for key in keys:
        try:
            network = ipaddress.ip_network(str(key), strict=False)
        except ValueError:
            continue
        if address in network:
            best = max(best, network.prefixlen)
    return best


def validate_provider_url(value: str) -> None:
    parsed = urlsplit(value)
    if parsed.scheme != "https" or not parsed.hostname or parsed.username or parsed.password:
        raise EnrichmentUpstreamError("Provider URL failed the HTTPS boundary")
    if parsed.port not in {None, 443}:
        raise EnrichmentUpstreamError("Provider URL used a non-standard port")


def normalize_rdap_payload(target_type: str, payload: dict[str, Any]) -> dict[str, Any]:
    common = {
        "object_class_name": string_value(payload.get("objectClassName")),
        "handle": string_value(payload.get("handle")),
        "status": string_list(payload.get("status"), 30),
        "events": normalize_rdap_events(payload.get("events")),
        "entities": normalize_rdap_entities(payload.get("entities")),
        "notices": normalize_rdap_notices(payload.get("notices")),
    }
    if target_type == "domain":
        common.update(
            {
                "ldh_name": string_value(payload.get("ldhName")),
                "unicode_name": string_value(payload.get("unicodeName")),
                "nameservers": [
                    string_value(item.get("ldhName"))
                    for item in payload.get("nameservers", [])[:100]
                    if isinstance(item, dict) and string_value(item.get("ldhName"))
                ],
                "secure_dns": {
                    "delegation_signed": bool((payload.get("secureDNS") or {}).get("delegationSigned"))
                    if isinstance(payload.get("secureDNS"), dict)
                    else False,
                    "zone_signed": bool((payload.get("secureDNS") or {}).get("zoneSigned"))
                    if isinstance(payload.get("secureDNS"), dict)
                    else False,
                },
            }
        )
    elif target_type == "ip":
        common.update(
            {
                "start_address": string_value(payload.get("startAddress")),
                "end_address": string_value(payload.get("endAddress")),
                "ip_version": string_value(payload.get("ipVersion")),
                "name": string_value(payload.get("name")),
                "network_type": string_value(payload.get("type")),
                "country": string_value(payload.get("country")),
                "parent_handle": string_value(payload.get("parentHandle")),
            }
        )
    else:
        common.update(
            {
                "start_autnum": payload.get("startAutnum"),
                "end_autnum": payload.get("endAutnum"),
                "name": string_value(payload.get("name")),
                "autnum_type": string_value(payload.get("type")),
                "country": string_value(payload.get("country")),
            }
        )
    return common


def normalize_rdap_events(value: Any) -> list[dict[str, str]]:
    if not isinstance(value, list):
        return []
    result: list[dict[str, str]] = []
    for item in value[:50]:
        if not isinstance(item, dict):
            continue
        result.append(
            {
                "action": string_value(item.get("eventAction")),
                "date": string_value(item.get("eventDate")),
                "actor": string_value(item.get("eventActor")),
            }
        )
    return result


def normalize_rdap_entities(value: Any) -> list[dict[str, Any]]:
    if not isinstance(value, list):
        return []
    result: list[dict[str, Any]] = []
    for item in value[:40]:
        if not isinstance(item, dict):
            continue
        result.append(
            {
                "handle": string_value(item.get("handle")),
                "roles": string_list(item.get("roles"), 20),
                "name": rdap_vcard_name(item.get("vcardArray")),
            }
        )
    return result


def rdap_vcard_name(value: Any) -> str:
    if not isinstance(value, list) or len(value) < 2 or not isinstance(value[1], list):
        return ""
    for field in value[1]:
        if isinstance(field, list) and len(field) >= 4 and field[0] == "fn":
            return string_value(field[3])
    return ""


def normalize_rdap_notices(value: Any) -> list[dict[str, Any]]:
    if not isinstance(value, list):
        return []
    result: list[dict[str, Any]] = []
    for item in value[:20]:
        if not isinstance(item, dict):
            continue
        result.append(
            {
                "title": string_value(item.get("title")),
                "description": string_list(item.get("description"), 10),
            }
        )
    return result


def normalize_ct_payload(value: list[Any], limit: int) -> tuple[list[dict[str, Any]], int]:
    records: list[dict[str, Any]] = []
    seen: set[tuple[str, str, str]] = set()
    for item in value:
        if not isinstance(item, dict):
            continue
        names = sorted(
            {
                name.strip().lower()
                for name in str(item.get("name_value", "")).splitlines()
                if name.strip()
            }
        )
        key = (
            string_value(item.get("serial_number")),
            string_value(item.get("not_before")),
            "\n".join(names),
        )
        if key in seen:
            continue
        seen.add(key)
        if len(records) < limit:
            records.append(
                {
                    "certificate_id": item.get("id"),
                    "issuer_name": string_value(item.get("issuer_name")),
                    "common_name": string_value(item.get("common_name")),
                    "names": names[:100],
                    "entry_timestamp": string_value(item.get("entry_timestamp")),
                    "not_before": string_value(item.get("not_before")),
                    "not_after": string_value(item.get("not_after")),
                    "serial_number": string_value(item.get("serial_number")),
                }
            )
    return records, len(seen)


def provider_label(value: str) -> str:
    hostname = urlsplit(value).hostname or "RDAP provider"
    return f"IANA-bootstrapped RDAP service ({hostname})"


def ensure_trailing_slash(value: str) -> str:
    return value if value.endswith("/") else f"{value}/"


def string_value(value: Any) -> str:
    return str(value)[:4000] if value is not None else ""


def string_list(value: Any, limit: int) -> list[str]:
    if not isinstance(value, list):
        return []
    return [string_value(item) for item in value[:limit]]


def utc_now() -> str:
    return datetime.now(UTC).isoformat()
