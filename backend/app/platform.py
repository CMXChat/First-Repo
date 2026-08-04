from __future__ import annotations

from pathlib import Path

from fastapi import HTTPException
from fastapi.responses import FileResponse

from .hardened import WriteSecurityMiddleware
from .main import app as fastapi_app

site_root = Path(__file__).resolve().parents[2]
lifecycle_page = (site_root / "cases" / "lifecycle" / "index.html").resolve()


async def serve_case_lifecycle() -> FileResponse:
    if not lifecycle_page.is_file():
        raise HTTPException(status_code=404, detail="Lifecycle page not found")
    return FileResponse(lifecycle_page, media_type="text/html")


fastapi_app.add_api_route(
    "/cases/lifecycle",
    serve_case_lifecycle,
    methods=["GET", "HEAD"],
    include_in_schema=False,
    name="case_lifecycle",
)
fastapi_app.add_api_route(
    "/cases/lifecycle/",
    serve_case_lifecycle,
    methods=["GET", "HEAD"],
    include_in_schema=False,
    name="case_lifecycle_slash",
)

app = WriteSecurityMiddleware(fastapi_app)
