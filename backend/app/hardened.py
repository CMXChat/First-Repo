from __future__ import annotations

from collections.abc import Awaitable, Callable
from typing import Any

from starlette.requests import Request
from starlette.types import ASGIApp, Message, Receive, Scope, Send

from .main import app as fastapi_app
from .write_security import validate_state_changing_request


class WriteSecurityMiddleware:
    """Apply browser write-request policy before the FastAPI application."""

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] == "http":
            request = Request(scope, receive=receive)
            rejection = validate_state_changing_request(request)
            if rejection is not None:
                await rejection(scope, receive, send)
                return
        await self.app(scope, receive, send)


app = WriteSecurityMiddleware(fastapi_app)
