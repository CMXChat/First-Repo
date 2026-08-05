from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

import httpx
from fastapi import APIRouter, HTTPException, Query, Request, status

from ..security import AccessIdentity
from ..services.dns import DnsResolverService

router = APIRouter(prefix="/api", tags=["dns"])


@router.get("/dns")
async def resolve_dns(
    request: Request,
    name: str = Query(min_length=1, max_length=253),
    record_type: str = Query(default="A", alias="type", min_length=1, max_length=8),
) -> dict[str, Any]:
    service: DnsResolverService = request.app.state.dns_resolver
    identity: AccessIdentity = request.state.identity
    try:
        result, cache_hit = await service.resolve(name, record_type)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc
    except httpx.TimeoutException as exc:
        raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail="DNS resolver timed out") from exc
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="DNS resolver request failed") from exc

    compatibility_answers = [
        {
            "name": answer["name"],
            "type": answer["type"],
            "TTL": answer["ttl"],
            "data": answer["data"],
        }
        for answer in result["answers"]
    ]
    return {
        "source": "Google Public DNS JSON API",
        "queried_at": datetime.now(UTC).isoformat(),
        "cache_hit": cache_hit,
        "requested_by": identity.subject,
        **result,
        "Status": result["status"],
        "AD": result["authenticated_data"],
        "TC": result["truncated"],
        "RA": result["recursion_available"],
        "Comment": result["comment"],
        "Answer": compatibility_answers,
    }
