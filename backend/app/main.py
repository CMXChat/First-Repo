from __future__ import annotations

import asyncio
import logging
import time
import uuid
from collections import defaultdict, deque
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Awaitable, Callable

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles
from starlette.middleware.trustedhost import TrustedHostMiddleware

from .api.cases import router as cases_router
from .api.dns import router as dns_router
from .api.records import router as records_router
from .api.system import router as system_router
from .config import Settings, get_settings
from .db import create_database_engine, create_session_factory, initialize_database
from .logging import configure_logging
from .security import AccessIdentity, authenticate_request
from .services.dns import DnsResolverService

configure_logging()
logger = logging.getLogger("cmx.request")
settings: Settings = get_settings()


class InMemoryRateLimiter:
    """Per-process API limiter. Cloudflare edge limits remain the production authority."""

    def __init__(self, limit: int, window_seconds: int = 60) -> None:
        self.limit = limit
        self.window_seconds = window_seconds
        self._events: dict[str, deque[float]] = defaultdict(deque)
        self._lock = asyncio.Lock()

    async def allow(self, key: str) -> tuple[bool, int]:
        now = time.monotonic()
        cutoff = now - self.window_seconds
        async with self._lock:
            events = self._events[key]
            while events and events[0] <= cutoff:
                events.popleft()
            if len(events) >= self.limit:
                retry_after = max(1, int(self.window_seconds - (now - events[0])))
                return False, retry_after
            events.append(now)
            return True, 0


rate_limiter = InMemoryRateLimiter(settings.api_rate_limit_per_minute)


@asynccontextmanager
async def lifespan(app: FastAPI):
    database_engine = create_database_engine(settings)
    initialize_database(database_engine, settings)
    app.state.database_engine = database_engine
    app.state.session_factory = create_session_factory(database_engine)

    client = httpx.AsyncClient(
        headers={"User-Agent": "CMX-Restricted-Node/0.2"},
        follow_redirects=False,
        limits=httpx.Limits(max_connections=20, max_keepalive_connections=10),
    )
    app.state.http_client = client
    app.state.dns_resolver = DnsResolverService(client, settings)
    logger.info("application_started", extra={"event": "application_started"})
    yield
    await client.aclose()
    database_engine.dispose()
    logger.info("application_stopped", extra={"event": "application_stopped"})


app = FastAPI(
    title="CMX Restricted Node API",
    version="0.2.0",
    docs_url=None if settings.environment == "production" else "/api/docs",
    redoc_url=None,
    openapi_url=None if settings.environment == "production" else "/api/openapi.json",
    lifespan=lifespan,
)
app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.allowed_hosts)


@app.middleware("http")
async def access_and_security_boundary(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    started_at = time.perf_counter()
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))[:128]
    request.state.request_id = request_id
    identity: AccessIdentity | None = None

    if request.url.path != "/api/health/live":
        try:
            identity = await authenticate_request(request, settings)
            request.state.identity = identity
        except HTTPException as exc:
            response = secured_response(
                JSONResponse(status_code=exc.status_code, content={"detail": exc.detail}),
                request_id,
            )
            log_request(request, response, started_at, request_id, None, "access_denied")
            return response

    if request.url.path.startswith("/api/") and request.url.path != "/api/health/live":
        client_key = (
            identity.subject
            if identity
            else request.headers.get("CF-Connecting-IP")
            or (request.client.host if request.client else "unknown")
        )
        allowed, retry_after = await rate_limiter.allow(client_key)
        if not allowed:
            response = secured_response(
                JSONResponse(
                    status_code=429,
                    content={"detail": "API rate limit exceeded"},
                    headers={"Retry-After": str(retry_after)},
                ),
                request_id,
            )
            log_request(request, response, started_at, request_id, identity, "rate_limited")
            return response

    try:
        response = await call_next(request)
    except Exception:
        logger.exception(
            "request_failed",
            extra={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "identity": identity.subject if identity else "anonymous",
                "event": "unhandled_exception",
            },
        )
        response = JSONResponse(status_code=500, content={"detail": "Internal server error"})

    response = secured_response(response, request_id, request.url.path)
    log_request(request, response, started_at, request_id, identity, "request_completed")
    return response


def log_request(
    request: Request,
    response: Response,
    started_at: float,
    request_id: str,
    identity: AccessIdentity | None,
    event: str,
) -> None:
    logger.info(
        event,
        extra={
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "duration_ms": round((time.perf_counter() - started_at) * 1000, 2),
            "identity": identity.subject if identity else "anonymous",
            "event": event,
        },
    )


def secured_response(response: Response, request_id: str, path: str = "") -> Response:
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=(), payment=()"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "base-uri 'self'; "
        "frame-ancestors 'none'; "
        "form-action 'self'; "
        "script-src 'self' 'unsafe-inline'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: https:; "
        "font-src 'self' data:; "
        "connect-src 'self' https://dns.google"
    )
    response.headers["Cache-Control"] = "public, max-age=3600" if path.startswith("/assets/") else "no-store"
    if settings.environment == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


app.include_router(system_router)
app.include_router(dns_router)
app.include_router(cases_router)
app.include_router(records_router)

site_root = settings.site_root
assets_dir = site_root / "assets"
if not assets_dir.is_dir():
    raise RuntimeError(f"Static assets directory not found: {assets_dir}")
app.mount("/assets", StaticFiles(directory=assets_dir, check_dir=True), name="assets")

PAGE_ROUTES: dict[str, str] = {
    "/": "index.html",
    "/directory": "directory/index.html",
    "/osint": "osint/index.html",
    "/phone": "phone/index.html",
    "/metadata": "metadata/index.html",
    "/search": "search/index.html",
    "/missing": "missing/index.html",
    "/resources": "resources/index.html",
}


def page_handler(relative_path: str):
    path = (site_root / relative_path).resolve()
    if site_root not in path.parents and path != site_root:
        raise RuntimeError("Static page path escaped the repository root")

    async def serve_page() -> FileResponse:
        if not path.is_file():
            raise HTTPException(status_code=404, detail="Page not found")
        return FileResponse(path, media_type="text/html")

    return serve_page


for route, relative_path in PAGE_ROUTES.items():
    handler = page_handler(relative_path)
    name = "root_page" if route == "/" else f"page_{route.strip('/').replace('/', '_')}"
    app.add_api_route(route, handler, methods=["GET", "HEAD"], include_in_schema=False, name=name)
    if route != "/":
        app.add_api_route(f"{route}/", handler, methods=["GET", "HEAD"], include_in_schema=False, name=f"{name}_slash")
