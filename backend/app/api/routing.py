from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Query, Request

from ..security import AccessIdentity
from ..services.routing import RoutingService
from .enrichment import enrichment_http_error

router = APIRouter(prefix="/api/routing", tags=["routing"])


@router.get("/origin")
async def routing_origin(
    request: Request,
    resource: str = Query(min_length=1, max_length=200),
) -> dict[str, Any]:
    service = routing_service(request)
    try:
        result, cache_hit = await service.origin(resource)
    except Exception as exc:
        raise enrichment_http_error(exc) from exc
    return response_payload(request, result, cache_hit)


@router.get("/prefixes")
async def routing_announced_prefixes(
    request: Request,
    asn: str = Query(min_length=1, max_length=40),
) -> dict[str, Any]:
    service = routing_service(request)
    try:
        result, cache_hit = await service.announced_prefixes(asn)
    except Exception as exc:
        raise enrichment_http_error(exc) from exc
    return response_payload(request, result, cache_hit)


@router.get("/visibility")
async def routing_visibility(
    request: Request,
    resource: str = Query(min_length=1, max_length=200),
) -> dict[str, Any]:
    service = routing_service(request)
    try:
        result, cache_hit = await service.visibility(resource)
    except Exception as exc:
        raise enrichment_http_error(exc) from exc
    return response_payload(request, result, cache_hit)


@router.get("/rpki")
async def routing_rpki(
    request: Request,
    prefix: str = Query(min_length=1, max_length=200),
    asn: str = Query(min_length=1, max_length=40),
) -> dict[str, Any]:
    service = routing_service(request)
    try:
        result, cache_hit = await service.rpki(prefix, asn)
    except Exception as exc:
        raise enrichment_http_error(exc) from exc
    return response_payload(request, result, cache_hit)


def routing_service(request: Request) -> RoutingService:
    return request.app.state.routing_service


def response_payload(
    request: Request,
    result: dict[str, Any],
    cache_hit: bool,
) -> dict[str, Any]:
    identity: AccessIdentity = request.state.identity
    return {
        **result,
        "cache_hit": cache_hit,
        "requested_by": identity.subject,
    }
