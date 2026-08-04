from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException, Query, Request, status

from ..security import AccessIdentity
from ..services.enrichment import (
    EnrichmentBlockedTarget,
    EnrichmentResponseTooLarge,
    EnrichmentService,
    EnrichmentUpstreamError,
    EnrichmentValidationError,
)

router = APIRouter(prefix="/api/enrichment", tags=["enrichment"])


@router.get("/rdap")
async def rdap_lookup(
    request: Request,
    target: str = Query(min_length=1, max_length=253),
) -> dict[str, Any]:
    service = enrichment_service(request)
    try:
        result, cache_hit = await service.rdap(target)
    except Exception as exc:
        raise enrichment_http_error(exc) from exc
    return response_payload(request, result, cache_hit)


@router.get("/http")
async def inspect_http_headers(
    request: Request,
    url: str = Query(min_length=1, max_length=4096),
) -> dict[str, Any]:
    service = enrichment_service(request)
    try:
        result, cache_hit = await service.http_headers(url)
    except Exception as exc:
        raise enrichment_http_error(exc) from exc
    return response_payload(request, result, cache_hit)


@router.get("/tls")
async def inspect_tls_certificate(
    request: Request,
    host: str = Query(min_length=1, max_length=253),
    port: int = Query(default=443, ge=1, le=65535),
) -> dict[str, Any]:
    service = enrichment_service(request)
    try:
        result, cache_hit = await service.tls_certificate(host, port)
    except Exception as exc:
        raise enrichment_http_error(exc) from exc
    return response_payload(request, result, cache_hit)


@router.get("/ct")
async def certificate_transparency_lookup(
    request: Request,
    domain: str = Query(min_length=1, max_length=253),
    include_subdomains: bool = Query(default=True),
) -> dict[str, Any]:
    service = enrichment_service(request)
    try:
        result, cache_hit = await service.certificate_transparency(
            domain,
            include_subdomains=include_subdomains,
        )
    except Exception as exc:
        raise enrichment_http_error(exc) from exc
    return response_payload(request, result, cache_hit)


def enrichment_service(request: Request) -> EnrichmentService:
    return request.app.state.enrichment_service


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


def enrichment_http_error(exc: Exception) -> HTTPException:
    if isinstance(exc, EnrichmentValidationError):
        return HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc))
    if isinstance(exc, EnrichmentBlockedTarget):
        return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc))
    if isinstance(exc, EnrichmentResponseTooLarge):
        return HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc))
    if isinstance(exc, TimeoutError):
        return HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=str(exc))
    if isinstance(exc, EnrichmentUpstreamError):
        return HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc))
    return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Enrichment request failed")
