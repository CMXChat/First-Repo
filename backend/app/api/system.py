from __future__ import annotations

from datetime import UTC, datetime

from fastapi import APIRouter, Request

from ..config import Settings, get_settings
from ..security import AccessIdentity

router = APIRouter(tags=["system"])


@router.get("/api/health/live", include_in_schema=False)
async def live() -> dict[str, str]:
    return {"status": "ok", "service": "cmx-restricted-node"}


@router.get("/api/health/ready")
async def ready(request: Request) -> dict[str, str]:
    settings: Settings = get_settings()
    identity: AccessIdentity | None = getattr(request.state, "identity", None)
    return {
        "status": "ready",
        "service": "cmx-restricted-node",
        "environment": settings.environment,
        "auth_mode": settings.auth_mode,
        "identity": identity.email if identity else "health-check",
        "time": datetime.now(UTC).isoformat(),
    }


@router.get("/api/whoami")
async def whoami(request: Request) -> dict[str, object]:
    identity: AccessIdentity = request.state.identity
    return {
        "subject": identity.subject,
        "email": identity.email,
        "name": identity.name,
        "audience": identity.audience,
        "issued_at": identity.issued_at,
        "expires_at": identity.expires_at,
    }
