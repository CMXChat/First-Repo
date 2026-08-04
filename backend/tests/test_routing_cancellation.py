from __future__ import annotations

import asyncio

import httpx

from app.config import Settings
from app.services.routing import RoutingService


class DelayedRoutingTransport(httpx.AsyncBaseTransport):
    async def handle_async_request(self, request: httpx.Request) -> httpx.Response:
        await asyncio.sleep(0.08)
        return httpx.Response(
            200,
            request=request,
            json={
                "status": "ok",
                "data_call_status": "supported",
                "data": {"prefix": "8.8.8.0/24", "asns": [15169]},
            },
        )


def test_cancelled_routing_caller_does_not_retain_completed_provider_task() -> None:
    async def exercise() -> None:
        async with httpx.AsyncClient(transport=DelayedRoutingTransport()) as client:
            service = RoutingService(
                client,
                Settings(enrichment_timeout_seconds=1.0, enrichment_cache_ttl_seconds=0),
            )
            caller = asyncio.create_task(service.origin("8.8.8.8"))
            await asyncio.sleep(0.01)
            caller.cancel()
            try:
                await caller
            except asyncio.CancelledError:
                pass
            await asyncio.sleep(0.12)
            assert service._inflight == {}

    asyncio.run(exercise())
