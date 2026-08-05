from __future__ import annotations

from urllib.parse import urlsplit

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.responses import Response

STATE_CHANGING_METHODS = {"POST", "PUT", "PATCH", "DELETE"}
JSON_BODY_METHODS = {"POST", "PUT", "PATCH"}
MAX_API_BODY_BYTES = 2_500_000


def validate_state_changing_request(request: Request) -> Response | None:
    """Reject browser cross-site writes and unexpected API body formats."""

    if not request.url.path.startswith("/api/") or request.method.upper() not in STATE_CHANGING_METHODS:
        return None

    fetch_site = request.headers.get("Sec-Fetch-Site", "").strip().lower()
    if fetch_site and fetch_site not in {"same-origin", "none"}:
        return rejection(403, "Cross-site API writes are not allowed.")

    origin = request.headers.get("Origin", "").strip()
    if origin and not origin_matches_host(origin, request.headers.get("Host", "")):
        return rejection(403, "API write origin does not match this host.")

    content_length = request.headers.get("Content-Length", "").strip()
    if content_length:
        try:
            if int(content_length) > MAX_API_BODY_BYTES:
                return rejection(413, "API request body exceeds the 2.5 MB transport limit.")
        except ValueError:
            return rejection(400, "Invalid Content-Length header.")

    if request.method.upper() in JSON_BODY_METHODS:
        content_type = request.headers.get("Content-Type", "").split(";", 1)[0].strip().lower()
        if content_type != "application/json":
            return rejection(415, "State-changing API requests must use application/json.")

    return None


def origin_matches_host(origin: str, host_header: str) -> bool:
    try:
        parsed = urlsplit(origin)
    except ValueError:
        return False
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        return False
    return parsed.netloc.lower() == host_header.strip().lower()


def rejection(status_code: int, detail: str) -> JSONResponse:
    return JSONResponse(status_code=status_code, content={"detail": detail})
