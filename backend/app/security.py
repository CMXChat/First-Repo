from __future__ import annotations

from functools import lru_cache
from typing import Any

import jwt
from fastapi import HTTPException, Request, status
from fastapi.concurrency import run_in_threadpool
from jwt import PyJWKClient
from jwt.exceptions import PyJWTError
from pydantic import BaseModel, Field

from .config import Settings


class AccessIdentity(BaseModel):
    subject: str
    email: str = ""
    name: str = ""
    audience: list[str] = Field(default_factory=list)
    issued_at: int | None = None
    expires_at: int | None = None
    claims: dict[str, Any] = Field(default_factory=dict)


@lru_cache(maxsize=8)
def _jwks_client(jwks_url: str) -> PyJWKClient:
    return PyJWKClient(jwks_url, cache_keys=True, lifespan=3600)


def _decode_access_token(token: str, settings: Settings) -> dict[str, Any]:
    client = _jwks_client(settings.access_jwks_url)
    signing_key = client.get_signing_key_from_jwt(token)
    claims = jwt.decode(
        token,
        signing_key.key,
        algorithms=["RS256"],
        audience=settings.cloudflare_access_audience,
        issuer=settings.access_issuer,
        options={
            "require": ["exp", "iat", "iss", "aud", "sub"],
            "verify_signature": True,
            "verify_aud": True,
            "verify_iss": True,
        },
    )
    return dict(claims)


async def authenticate_request(request: Request, settings: Settings) -> AccessIdentity:
    """Authenticate one request using development mode or Cloudflare Access."""

    if settings.auth_mode == "development":
        dev_user = request.headers.get("X-CMX-Dev-User", "local-admin@localhost").strip()
        return AccessIdentity(
            subject=f"development:{dev_user}",
            email=dev_user,
            name="Local development user",
            audience=["development"],
            claims={"mode": "development"},
        )

    token = request.headers.get("Cf-Access-Jwt-Assertion", "").strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cloudflare Access application token is required.",
        )

    try:
        claims = await run_in_threadpool(_decode_access_token, token, settings)
    except PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cloudflare Access token validation failed.",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Cloudflare Access signing keys are temporarily unavailable.",
        ) from exc

    audience_claim = claims.get("aud", [])
    audience = [audience_claim] if isinstance(audience_claim, str) else list(audience_claim or [])
    identity = AccessIdentity(
        subject=str(claims.get("sub", "")),
        email=str(claims.get("email", "")),
        name=str(claims.get("name", "")),
        audience=audience,
        issued_at=int(claims["iat"]) if claims.get("iat") is not None else None,
        expires_at=int(claims["exp"]) if claims.get("exp") is not None else None,
        claims=claims,
    )
    request.state.identity = identity
    return identity
