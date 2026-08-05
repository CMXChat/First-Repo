from __future__ import annotations

import asyncio
import json
from urllib.parse import parse_qs

import httpx
import pytest
from fastapi.testclient import TestClient

from app.config import Settings
from app.main import app
from app.services.enrichment import (
    EnrichmentBlockedTarget,
    EnrichmentResponseTooLarge,
    EnrichmentValidationError,
)
from app.services.routing import (
    RoutingService,
    normalize_asn,
    normalize_network_resource,
)


def ripestat_response(data: dict) -> httpx.Response:
    return httpx.Response(
        200,
        json={
            "status": "ok",
            "status_code": 200,
            "data_call_status": "supported",
            "data": data,
        },
    )


def test_routing_target_validation_rejects_private_and_overbroad_resources() -> None:
    assert normalize_network_resource("8.8.8.8", allow_ip=True, allow_prefix=True) == ("8.8.8.8", "ip")
    assert normalize_network_resource("8.8.8.0/24", allow_ip=True, allow_prefix=True) == ("8.8.8.0/24", "prefix")
    assert normalize_asn("AS13335") == "13335"

    with pytest.raises(EnrichmentBlockedTarget):
        normalize_network_resource("127.0.0.1", allow_ip=True, allow_prefix=True)
    with pytest.raises(EnrichmentBlockedTarget):
        normalize_network_resource("10.0.0.0/8", allow_ip=True, allow_prefix=True)
    with pytest.raises(EnrichmentBlockedTarget):
        normalize_network_resource("0.0.0.0/0", allow_ip=True, allow_prefix=True)
    with pytest.raises(EnrichmentValidationError):
        normalize_asn("AS0")
    with pytest.raises(EnrichmentValidationError):
        normalize_asn("operator")


def test_network_origin_uses_fixed_ripestat_endpoint_and_cache() -> None:
    requests: list[httpx.Request] = []

    def handler(request: httpx.Request) -> httpx.Response:
        requests.append(request)
        assert request.url.host == "stat.ripe.net"
        assert request.url.path == "/data/network-info/data.json"
        query = parse_qs(request.url.query.decode())
        assert query["resource"] == ["8.8.8.8"]
        assert query["sourceapp"] == ["cmx-restricted-node"]
        return ripestat_response({"prefix": "8.8.8.0/24", "asns": [15169, "AS15169", "bad"]})

    async def exercise() -> tuple[dict, bool, bool]:
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            service = RoutingService(client, Settings(enrichment_cache_ttl_seconds=300))
            first, first_hit = await service.origin("8.8.8.8")
            second, second_hit = await service.origin("8.8.8.8")
            assert second == first
            return first, first_hit, second_hit

    result, first_hit, second_hit = asyncio.run(exercise())
    assert first_hit is False
    assert second_hit is True
    assert result["provider"] == "RIPEstat Data API"
    assert result["result"]["matched_prefix"] == "8.8.8.0/24"
    assert result["result"]["origin_asns"] == [15169]
    assert result["result"]["routed"] is True
    assert len(requests) == 1


def test_announced_prefixes_are_bounded_and_report_truncation() -> None:
    def handler(_: httpx.Request) -> httpx.Response:
        return ripestat_response({
            "prefixes": [
                {"prefix": "8.8.8.0/24", "timelines": [{"starttime": "2026-08-01", "endtime": "2026-08-04"}]},
                {"prefix": "8.8.4.0/24", "timelines": []},
                {"prefix": "10.0.0.0/8", "timelines": []},
            ],
            "query_starttime": "2026-08-01",
            "query_endtime": "2026-08-04",
            "earliest_time": "2001-01-01",
            "latest_time": "2026-08-04",
        })

    async def exercise() -> dict:
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            service = RoutingService(client, Settings(enrichment_max_records=1))
            result, _ = await service.announced_prefixes("AS15169")
            return result

    result = asyncio.run(exercise())
    assert result["result"]["asn"] == "15169"
    assert result["result"]["returned_records"] == 1
    assert result["result"]["provider_record_count"] == 3
    assert result["result"]["truncated"] is True
    assert result["result"]["prefixes"][0]["prefix"] == "8.8.8.0/24"


def test_route_visibility_discards_malformed_path_identifiers_and_bounds_peers() -> None:
    def handler(_: httpx.Request) -> httpx.Response:
        return ripestat_response({
            "latest_time": "2026-08-04T19:00:00Z",
            "rrcs": [
                {
                    "rrc": "rrc00",
                    "location": "Amsterdam",
                    "peers": [
                        {
                            "peer": "193.0.0.1",
                            "prefix": "8.8.8.0/24",
                            "asn_orgin": 15169,
                            "origin": "IGP",
                            "as_path": [3333, "bad", -2, 15169, 999999999999],
                            "last_updated": "2026-08-04T18:59:00Z",
                            "lastest_time": "2026-08-04T19:00:00Z",
                        },
                        {
                            "peer": "193.0.0.2",
                            "prefix": "8.8.8.0/24",
                            "asn_origin": 15169,
                            "as_path": [64500, 15169],
                        },
                    ],
                }
            ],
        })

    async def exercise() -> dict:
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            service = RoutingService(client, Settings(enrichment_max_records=1))
            result, _ = await service.visibility("8.8.8.8")
            return result

    result = asyncio.run(exercise())
    peer = result["result"]["collectors"][0]["peers"][0]
    assert peer["as_path"] == [3333, 15169]
    assert peer["origin_asn"] == 15169
    assert peer["latest_time"] == "2026-08-04T19:00:00Z"
    assert result["result"]["peer_records"] == 1
    assert result["result"]["provider_peer_count"] == 2
    assert result["result"]["truncated"] is True


@pytest.mark.parametrize(
    ("provider_status", "state"),
    [
        ("valid", "valid"),
        ("invalid_asn", "invalid"),
        ("invalid_length", "invalid"),
        ("unknown", "not_found"),
        ("maintenance", "unavailable"),
    ],
)
def test_rpki_states_remain_explicit(provider_status: str, state: str) -> None:
    def handler(_: httpx.Request) -> httpx.Response:
        return ripestat_response({
            "prefix": "8.8.8.0/24",
            "resource": "15169",
            "status": provider_status,
            "description": "Synthetic RPKI result",
        })

    async def exercise() -> dict:
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            service = RoutingService(client, Settings())
            result, _ = await service.rpki("8.8.8.0/24", "AS15169")
            return result

    result = asyncio.run(exercise())
    assert result["result"]["state"] == state
    assert result["result"]["provider_status"] == provider_status
    assert "ownership" in result["limitation"]


def test_routing_response_size_limit_is_enforced() -> None:
    body = json.dumps({
        "status": "ok",
        "data_call_status": "supported",
        "data": {"prefixes": ["x" * 70_000]},
    }).encode()

    def handler(_: httpx.Request) -> httpx.Response:
        return httpx.Response(200, content=body)

    async def exercise() -> None:
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as client:
            service = RoutingService(client, Settings(enrichment_max_response_bytes=65_536))
            await service.announced_prefixes("AS15169")

    with pytest.raises(EnrichmentResponseTooLarge, match="size limit"):
        asyncio.run(exercise())


def test_routing_api_exposes_requester_cache_and_private_target_denial() -> None:
    class FakeRoutingService:
        async def origin(self, resource: str):
            return (
                {
                    "adapter": "network_info",
                    "provider": "RIPEstat Data API",
                    "source_url": "https://stat.ripe.net/data/network-info/data.json?resource=8.8.8.8",
                    "collected_at": "2026-08-04T19:00:00+00:00",
                    "target": resource,
                    "result": {"matched_prefix": "8.8.8.0/24", "origin_asns": [15169]},
                    "limitation": "Routing evidence is not ownership evidence.",
                },
                True,
            )

    with TestClient(app) as client:
        real_service = app.state.routing_service
        try:
            app.state.routing_service = FakeRoutingService()
            response = client.get(
                "/api/routing/origin",
                params={"resource": "8.8.8.8"},
                headers={"X-CMX-Dev-User": "routing@example.test"},
            )
        finally:
            app.state.routing_service = real_service

        blocked = client.get(
            "/api/routing/origin",
            params={"resource": "127.0.0.1"},
            headers={"X-CMX-Dev-User": "routing@example.test"},
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["requested_by"] == "development:routing@example.test"
    assert payload["cache_hit"] is True
    assert payload["provider"] == "RIPEstat Data API"
    assert blocked.status_code == 403
