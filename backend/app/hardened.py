from __future__ import annotations

import uuid
from collections.abc import Awaitable, Callable
from typing import Any

from starlette.requests import Request
from starlette.types import ASGIApp, Message, Receive, Scope, Send

from .main import app as fastapi_app, secured_response
from .write_security import MAX_API_BODY_BYTES, STATE_CHANGING_METHODS, rejection, validate_state_changing_request


class WriteSecurityMiddleware:
    """Apply browser write-request policy and an actual transport-byte limit before FastAPI."""

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        request = Request(scope, receive=receive)
        policy_rejection = validate_state_changing_request(request)
        if policy_rejection is not None:
            await self._send_rejection(scope, receive, send, request, policy_rejection)
            return

        if request.url.path.startswith("/api/") and request.method.upper() in STATE_CHANGING_METHODS:
            buffered = await buffer_request_messages(receive)
            if buffered is None:
                oversized = rejection(413, "API request body exceeds the 2.5 MB transport limit.")
                await self._send_rejection(scope, receive, send, request, oversized)
                return
            receive = replay_messages(buffered)

        await self.app(scope, receive, send)

    async def _send_rejection(
        self,
        scope: Scope,
        receive: Receive,
        send: Send,
        request: Request,
        response,
    ) -> None:
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))[:128]
        secured = secured_response(response, request_id, request.url.path)
        await secured(scope, receive, send)


async def buffer_request_messages(receive: Receive) -> list[Message] | None:
    """Buffer at most the configured API body limit so chunked bodies cannot bypass it."""

    messages: list[Message] = []
    total = 0
    while True:
        message = await receive()
        messages.append(message)
        if message["type"] == "http.disconnect":
            break
        if message["type"] != "http.request":
            continue
        total += len(message.get("body", b""))
        if total > MAX_API_BODY_BYTES:
            return None
        if not message.get("more_body", False):
            break
    return messages


def replay_messages(messages: list[Message]) -> Receive:
    queue = list(messages)

    async def receive() -> Message:
        if queue:
            return queue.pop(0)
        return {"type": "http.disconnect"}

    return receive


app = WriteSecurityMiddleware(fastapi_app)
