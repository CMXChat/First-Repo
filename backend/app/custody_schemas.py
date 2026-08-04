from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

CustodyEventType = Literal[
    "received",
    "transferred",
    "stored",
    "accessed",
    "verified",
    "released",
    "returned",
    "disposed",
    "note",
]
IntegrityState = Literal["not_checked", "match", "mismatch"]


class CustodyOrmModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class CustodyEventCreate(BaseModel):
    event_type: CustodyEventType
    custodian: str = Field(min_length=1, max_length=300)
    location: str = Field(default="", max_length=500)
    note: str = Field(default="", max_length=10000)
    observed_sha256: str | None = Field(default=None, pattern=r"^[a-fA-F0-9]{64}$")
    occurred_at: datetime | None = None

    @model_validator(mode="after")
    def require_hash_for_verification(self) -> "CustodyEventCreate":
        if self.event_type == "verified" and not self.observed_sha256:
            raise ValueError("verified custody events require an observed SHA-256")
        return self


class CustodyEventRead(CustodyOrmModel):
    id: str
    case_id: str
    evidence_id: str
    recorded_by: str
    event_type: str
    custodian: str
    location: str
    note: str
    observed_sha256: str | None
    integrity_state: str
    occurred_at: datetime
    created_at: datetime


class EvidenceManifestEvidence(BaseModel):
    id: str
    filename: str
    media_type: str
    size_bytes: int
    sha256: str
    storage_key: str
    metadata_json: dict[str, Any]
    captured_at: datetime | None
    registered_at: datetime


class EvidenceManifestSource(BaseModel):
    id: str
    label: str
    source_type: str
    url: str
    accessed_at: datetime | None


class EvidenceManifestRead(BaseModel):
    schema: Literal["cmx-evidence-manifest-v1"]
    manifest_sha256: str = Field(pattern=r"^[a-f0-9]{64}$")
    generated_at: datetime
    case_id: str
    evidence: EvidenceManifestEvidence
    source: EvidenceManifestSource | None
    custody_events: list[CustodyEventRead]
    interpretation: str
