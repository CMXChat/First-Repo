from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class LifecycleRequest(BaseModel):
    confirmation: str = Field(min_length=1, max_length=100)
    reason: str = Field(min_length=1, max_length=2000)


class AuditRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    case_id: str | None
    action: str
    object_type: str
    object_id: str
    request_id: str
    details: dict[str, Any]
    created_at: datetime
