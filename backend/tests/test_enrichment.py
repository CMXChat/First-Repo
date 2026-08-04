from __future__ import annotations

import asyncio
import json

import httpx
import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.main import app
from app.services.enrichment import (
    EnrichmentBlockedTarget,
    EnrichmentResponseTooLarge,
    EnrichmentService,
    EnrichmentValidationError,
    classify_rdap_target,
    normalize_ct_payload,
    parse_http_headers,
    select_rdap_service,
    validate_probe_url,
)


def test_rdap_target_classification_blocks_non_public_addresses() -> None:
    assert classify_rdap_target("example.com") == ("domain", "example.com")
    assert classify_rdap_target("AS13335") == ("asn", "13335")
    assert classify_rdap_target("8.8.8.8") == ("ip", "8.8.8.8")

    with pytest.raises(EnrichmentBlockedTarget):
        classify_rdap_target("127.0.0.1")
    with pytest.raises(EnrichmentBlockedTarget):
        classify_rdap_target("10.0.0.1")
    with pytest.raises(EnrichmentValidationError):
        classify_rdap_target("localhost")


def test_http_probe_url_requires_standard_public_http_or_https() -> None:
    target = validate_probe_url("https://example.com/path?q=one")
    assert target.scheme == "https"
    assert target.host == "example.com"
    assert target.port == 443
    assert target.request_target == "/path?q=one"

    with pytest.raises(EnrichmentValidationError):
        validate_probe_url("ftp://example.com/file")
    with pytest.raises(EnrichmentValidationError):
        credentialed_url = "https://" + "user:pass" + "@example.com/"
        validate_probe_url(credentialed_url)
    with pytest.raises(EnrichmentValidationError):
        validate_probe_url("https://example.com:8443/")
    with pytest.raises(EnrichmentBlockedTarget):
        validate_probe_url("http://192.168.1.10/")


def test_http_header_parser_returns_only_selected_headers() -> None:
    parsed = parse_http_headers(
        b"HTTP/1.1 302 Found\r\n"
        b"Location: https://example.net/next\r\n"
        b"Content-Security-Policy: default-src 'self'\r\n"
        b"Set-Cookie: secret=value\r\n"
        b"X-Content-Type-Options: nosniff\r\n\r\n"
    )
    assert parsed["status_code"] == 302
    assert parsed["redirect_location"] == "https://example.net/next"
    assert parsed["headers"]["content-security-policy"] == "default-src 'self'"
    assert parsed["headers"]["x-content-type-options"] == "nosniff"
    assert "set-cookie" not in parsed["headers"]


def test_iana_bootstrap_selection_prefers_specific_network_and_asn_ranges() -> None:
    domain_bootstrap = {
        "services": [
            [["net"], ["https://rdap.net.example/"]],
            [["com"], ["https://rdap.com.example/"]],
        ]
    }
    ip_bootstrap = {
        "services": [
            [["8.0.0.0/8"], ["https://wide.example/"]],
            [["8.8.8.0/24"], ["https://specific.example/"]],
        ]
    }
    asn_bootstrap = {
        "services": [
            [["1-64495"], ["https://broad.example/"]],
            [["13335-13335"], ["https://exact.example/"]],
        ]
    }

    assert select_rdap_service(domain_bootstrap, "domain", "example.com") == "https://rdap.com.example/"
    assert select_rdap_service(ip_bootstrap, "ip", "8.8.8.8") == "https://specific.example/"
    assert select_rdap_service(asn_bootstrap, "asn", "13335") == "https://exact.example/"


def test_certificate_transparency_normalization_deduplicates_and_limits() -> None:
    records, observed = normalize_ct_payload(
        [
            {
                "id": 1,
                "issuer_name": "Example CA",
                "common_name": "example.com",
                "name_value": "example.com\nwww.example.com",
                "not_before": "2026-01-01T00:00:00",
                "not_after": "2026-04-01T00:00:00",
                "serial_number": "abc",
            },
            {
                "id": 2,
                "issuer_name": "Example CA",
                "common_name": "example.com",
                "name_value": "www.example.com\nexample.com",
                "not_before": "2026-01-01T00:00:00",
                "not_after": "2026-04-01T00:00:00",
                "serial_number": "abc",
            },
            {
                "id": 3,
                "issuer_name": "Other CA",
                "common_name": "api.example.com",
                "name_value": "api.example.com",
                "not_before": "2026-02-01T00:00:00",
                "not_after": "2026-05-01T00:00:00",
                "serial_number": "def",
            },
        ],
        1,
    )
    assert observed == 2
    assert len(records) == 1
    assert records[0]["names"] == ["example.com", "www.example.com"]


def test_rdap_service_uses_iana_bootstrap_and_cache() -> None:
    requests: list[str] = []

    def handler(request: httpx.Request) -> httpx.Response:
        requests.append(str(request.url))
        if request.url.host == "data.iana.org":
            return httpx.Response(
                200,
                json={"services": [[["com"], ["https://rdap.registry.example/"]]]},
            )
        if request.url.host == "rdap.registry.example":
            return httpx.Response(
                200,
                json={
                    "objectClassName": "domain",
                    "handle": "EXAMPLE-COM",
                    "ldhName": "EXAMPLE.COM",
                    "status": ["active"],
                    "nameservers": [{"ldhName": "A.IANA-SERVERS.NET"}],
                    "events": [{"eventAction": "registration", "eventDate": "1995-08-14T04:00:00Z"}],
                },
            )
        return httpx.Response(404)

    async def exercise() -> tuple[dict, bool, bool]:
        transport = httpx.MockTransport(handler)
        async with httpx.AsyncClient(transport=transport) as client:
            service = EnrichmentService(client, Settings(enrichment_cache_ttl_seconds=300))
            first, first_hit = await service.rdap("example.com")
            second, second_hit = await service.rdap("example.com")
            assert second == first
            return first, first_hit, second_hit

    result, first_hit, second_hit = asyncio.run(exercise())
    assert first_hit is False
    assert second_hit is True
    assert result["provider"].startswith("IANA-bootstrapped RDAP service")
    assert result["result"]["ldh_name"] == "EXAMPLE.COM"
    assert result["result"]["nameservers"] == ["A.IANA-SERVERS.NET"]
    assert len(requests) == 2


def test_enrichment_api_maps_private_target_and_exposes_provenance() -> None:
    class FakeService:
        async def rdap(self, target: str):
            return (
                {
                    "adapter": "rdap",
                    "provider": "Test RDAP",
                    "source_url": "https://rdap.example/domain/example.com",
                    "collected_at": "2026-08-04T18:00:00+00:00",
                    "target": target,
                    "target_type": "domain",
                    "result": {"ldh_name": "example.com"},
                },
                False,
            )

    with TestClient(app) as client:
        real_service = app.state.enrichment_service
        try:
            app.state.enrichment_service = FakeService()
            response = client.get(
                "/api/enrichment/rdap",
                params={"target": "example.com"},
                headers={"X-CMX-Dev-User": "analyst@example.test"},
            )
        finally:
            app.state.enrichment_service = real_service

        blocked = client.get(
            "/api/enrichment/http",
            params={"url": "http://127.0.0.1/"},
            headers={"X-CMX-Dev-User": "analyst@example.test"},
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["requested_by"] == "development:analyst@example.test"
    assert payload["cache_hit"] is False
    assert payload["provider"] == "Test RDAP"
    assert blocked.status_code == 403
    assert "public IP" in blocked.json()["detail"]


def test_json_size_limit_rejects_oversized_provider_payload() -> None:
    oversized = json.dumps({"data": "x" * 70000}).encode()

    def handler(_: httpx.Request) -> httpx.Response:
        return httpx.Response(200, content=oversized)

    async def exercise() -> None:
        transport = httpx.MockTransport(handler)
        async with httpx.AsyncClient(transport=transport) as client:
            service = EnrichmentService(
                client,
                Settings(enrichment_max_response_bytes=65536),
            )
            await service._fetch_json(
                "https://example.test/data.json",
                expected_container=dict,
            )

    with pytest.raises(EnrichmentResponseTooLarge, match="size limit"):
        asyncio.run(exercise())
