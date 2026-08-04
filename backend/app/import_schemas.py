from __future__ import annotations

import json
from typing import Any

from pydantic import BaseModel, Field, field_validator

SUPPORTED_SESSION_SCHEMAS = {
    "cmx-osint-session-v1",
    "cmx-phone-session-v1",
    "cmx-search-session-v1",
    "cmx-metadata-session-v1",
    "cmx-missing-case-v1",
}


class SessionImportRequest(BaseModel):
    payload: dict[str, Any] = Field(default_factory=dict)

    @field_validator("payload")
    @classmethod
    def validate_payload(cls, value: dict[str, Any]) -> dict[str, Any]:
        schema = str(value.get("schema", ""))
        if schema not in SUPPORTED_SESSION_SCHEMAS:
            raise ValueError("unsupported CMX session schema")
        encoded = json.dumps(value, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        if len(encoded) > 2_000_000:
            raise ValueError("session import exceeds the 2 MB JSON limit")
        if nesting_depth(value) > 20:
            raise ValueError("session import is nested too deeply")
        return value


class SessionImportResult(BaseModel):
    schema: str
    entities_created: int = 0
    observations_created: int = 0
    sources_created: int = 0
    queries_created: int = 0
    evidence_created: int = 0
    notes_created: int = 0
    warnings: list[str] = Field(default_factory=list)


def nesting_depth(value: Any, current: int = 0) -> int:
    if not isinstance(value, (dict, list)):
        return current
    if not value:
        return current + 1
    children = value.values() if isinstance(value, dict) else value
    return max(nesting_depth(child, current + 1) for child in children)
