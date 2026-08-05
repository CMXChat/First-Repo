from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

Confidence = Literal["unrated", "low", "limited", "medium", "strong", "high", "confirmed"]


class OrmModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class CaseCreate(BaseModel):
    case_type: str = Field(default="general", min_length=1, max_length=80, pattern=r"^[a-z0-9_-]+$")
    title: str = Field(min_length=1, max_length=240)
    urgency: Literal["standard", "time-sensitive", "urgent"] = "standard"
    authorization_basis: str = Field(min_length=1, max_length=4000)
    summary: str = Field(default="", max_length=10000)
    retention_until: datetime | None = None


class CaseUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=240)
    status: Literal["open", "paused", "closed", "archived"] | None = None
    urgency: Literal["standard", "time-sensitive", "urgent"] | None = None
    authorization_basis: str | None = Field(default=None, min_length=1, max_length=4000)
    summary: str | None = Field(default=None, max_length=10000)
    retention_until: datetime | None = None


class CaseRead(OrmModel):
    id: str
    case_type: str
    title: str
    status: str
    urgency: str
    authorization_basis: str
    summary: str
    retention_until: datetime | None
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None


class EntityCreate(BaseModel):
    entity_type: str = Field(min_length=1, max_length=80, pattern=r"^[a-z0-9_-]+$")
    normalized_value: str = Field(min_length=1, max_length=5000)
    display_value: str = Field(default="", max_length=5000)
    confidence: Confidence = "unrated"
    attributes: dict[str, Any] = Field(default_factory=dict)


class EntityRead(OrmModel):
    id: str
    case_id: str
    entity_type: str
    normalized_value: str
    display_value: str
    confidence: str
    attributes: dict[str, Any]
    created_at: datetime
    updated_at: datetime


class SourceCreate(BaseModel):
    label: str = Field(min_length=1, max_length=300)
    source_type: str = Field(default="web", min_length=1, max_length=80, pattern=r"^[a-z0-9_-]+$")
    url: str = Field(default="", max_length=2000)
    notes: str = Field(default="", max_length=10000)
    accessed_at: datetime | None = None

    @field_validator("url")
    @classmethod
    def validate_url_scheme(cls, value: str) -> str:
        if value and not value.lower().startswith(("https://", "http://")):
            raise ValueError("source URL must use HTTP or HTTPS")
        return value


class SourceRead(OrmModel):
    id: str
    case_id: str
    label: str
    source_type: str
    url: str
    notes: str
    accessed_at: datetime | None
    created_at: datetime


class ObservationCreate(BaseModel):
    entity_id: str | None = Field(default=None, max_length=36)
    source_id: str | None = Field(default=None, max_length=36)
    kind: str = Field(min_length=1, max_length=80, pattern=r"^[a-z0-9_-]+$")
    value_text: str = Field(min_length=1, max_length=20000)
    note: str = Field(default="", max_length=20000)
    confidence: Confidence = "unrated"
    observed_at: datetime | None = None


class ObservationRead(OrmModel):
    id: str
    case_id: str
    entity_id: str | None
    source_id: str | None
    kind: str
    value_text: str
    note: str
    confidence: str
    observed_at: datetime
    created_at: datetime


class QueryCreate(BaseModel):
    entity_id: str | None = Field(default=None, max_length=36)
    provider: str = Field(min_length=1, max_length=120)
    query_text: str = Field(min_length=1, max_length=20000)
    result_url: str = Field(default="", max_length=4000)
    purpose: str = Field(default="", max_length=4000)
    executed_at: datetime | None = None

    @field_validator("result_url")
    @classmethod
    def validate_result_url(cls, value: str) -> str:
        if value and not value.lower().startswith(("https://", "http://")):
            raise ValueError("result URL must use HTTP or HTTPS")
        return value


class QueryRead(OrmModel):
    id: str
    case_id: str
    entity_id: str | None
    provider: str
    query_text: str
    result_url: str
    purpose: str
    executed_at: datetime | None
    created_at: datetime


class EvidenceRegisterCreate(BaseModel):
    source_id: str | None = Field(default=None, max_length=36)
    filename: str = Field(min_length=1, max_length=500)
    media_type: str = Field(default="application/octet-stream", min_length=1, max_length=200)
    size_bytes: int = Field(default=0, ge=0, le=10_000_000_000)
    sha256: str = Field(pattern=r"^[a-fA-F0-9]{64}$")
    storage_key: str = Field(default="", max_length=1000)
    metadata_json: dict[str, Any] = Field(default_factory=dict)
    captured_at: datetime | None = None


class EvidenceRead(OrmModel):
    id: str
    case_id: str
    source_id: str | None
    filename: str
    media_type: str
    size_bytes: int
    sha256: str
    storage_key: str
    metadata_json: dict[str, Any]
    captured_at: datetime | None
    created_at: datetime


class RelationshipCreate(BaseModel):
    from_entity_id: str = Field(min_length=36, max_length=36)
    to_entity_id: str = Field(min_length=36, max_length=36)
    relationship_type: str = Field(min_length=1, max_length=120, pattern=r"^[a-z0-9_-]+$")
    confidence: Confidence = "unrated"
    note: str = Field(default="", max_length=10000)


class RelationshipRead(OrmModel):
    id: str
    case_id: str
    from_entity_id: str
    to_entity_id: str
    relationship_type: str
    confidence: str
    note: str
    created_at: datetime


class NoteCreate(BaseModel):
    note: str = Field(min_length=1, max_length=20000)


class NoteRead(OrmModel):
    id: str
    case_id: str
    note: str
    created_at: datetime
    updated_at: datetime


class CaseDetail(CaseRead):
    entities: list[EntityRead] = Field(default_factory=list)
    observations: list[ObservationRead] = Field(default_factory=list)
    sources: list[SourceRead] = Field(default_factory=list)
    queries: list[QueryRead] = Field(default_factory=list)
    evidence_items: list[EvidenceRead] = Field(default_factory=list)
    relationships: list[RelationshipRead] = Field(default_factory=list)
    notes: list[NoteRead] = Field(default_factory=list)
