from __future__ import annotations

import hashlib
import json
from datetime import UTC, datetime
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..custody_models import EvidenceCustodyEventRecord
from ..models import EvidenceItemRecord, SourceRecord

INTERPRETATION = (
    "This manifest records evidence metadata, hashes, provenance references, and operator-entered custody events. "
    "It does not prove the truth of the source contents, identity, ownership, authorization outside the recorded case, "
    "or uninterrupted physical control of an item."
)


def get_owned_evidence(
    session: Session,
    case_id: str,
    evidence_id: str,
    owner_subject: str,
) -> EvidenceItemRecord:
    evidence = session.scalar(
        select(EvidenceItemRecord).where(
            EvidenceItemRecord.id == evidence_id,
            EvidenceItemRecord.case_id == case_id,
            EvidenceItemRecord.owner_subject == owner_subject,
        )
    )
    if evidence is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evidence item not found",
        )
    return evidence


def integrity_state(expected_sha256: str, observed_sha256: str | None) -> str:
    if not observed_sha256:
        return "not_checked"
    return "match" if observed_sha256.lower() == expected_sha256.lower() else "mismatch"


def list_owned_custody_events(
    session: Session,
    case_id: str,
    evidence_id: str,
    owner_subject: str,
    *,
    limit: int = 500,
) -> list[EvidenceCustodyEventRecord]:
    return list(
        session.scalars(
            select(EvidenceCustodyEventRecord)
            .where(
                EvidenceCustodyEventRecord.case_id == case_id,
                EvidenceCustodyEventRecord.evidence_id == evidence_id,
                EvidenceCustodyEventRecord.owner_subject == owner_subject,
            )
            .order_by(
                EvidenceCustodyEventRecord.occurred_at.asc(),
                EvidenceCustodyEventRecord.created_at.asc(),
                EvidenceCustodyEventRecord.id.asc(),
            )
            .limit(limit)
        ).all()
    )


def get_manifest_source(
    session: Session,
    evidence: EvidenceItemRecord,
    owner_subject: str,
) -> SourceRecord | None:
    if not evidence.source_id:
        return None
    return session.scalar(
        select(SourceRecord).where(
            SourceRecord.id == evidence.source_id,
            SourceRecord.case_id == evidence.case_id,
            SourceRecord.owner_subject == owner_subject,
        )
    )


def build_manifest(
    evidence: EvidenceItemRecord,
    source: SourceRecord | None,
    events: list[EvidenceCustodyEventRecord],
) -> dict[str, Any]:
    canonical_payload: dict[str, Any] = {
        "schema": "cmx-evidence-manifest-v1",
        "case_id": evidence.case_id,
        "evidence": {
            "id": evidence.id,
            "filename": evidence.filename,
            "media_type": evidence.media_type,
            "size_bytes": evidence.size_bytes,
            "sha256": evidence.sha256.lower(),
            "storage_key": evidence.storage_key,
            "metadata_json": evidence.metadata_json,
            "captured_at": iso8601(evidence.captured_at),
            "registered_at": iso8601(evidence.created_at),
        },
        "source": source_payload(source),
        "custody_events": [event_payload(event) for event in events],
        "interpretation": INTERPRETATION,
    }
    encoded = json.dumps(
        canonical_payload,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")
    return {
        **canonical_payload,
        "manifest_sha256": hashlib.sha256(encoded).hexdigest(),
        "generated_at": datetime.now(UTC),
    }


def source_payload(source: SourceRecord | None) -> dict[str, Any] | None:
    if source is None:
        return None
    return {
        "id": source.id,
        "label": source.label,
        "source_type": source.source_type,
        "url": source.url,
        "accessed_at": iso8601(source.accessed_at),
    }


def event_payload(event: EvidenceCustodyEventRecord) -> dict[str, Any]:
    return {
        "id": event.id,
        "case_id": event.case_id,
        "evidence_id": event.evidence_id,
        "recorded_by": event.recorded_by,
        "event_type": event.event_type,
        "custodian": event.custodian,
        "location": event.location,
        "note": event.note,
        "observed_sha256": event.observed_sha256,
        "integrity_state": event.integrity_state,
        "occurred_at": iso8601(event.occurred_at),
        "created_at": iso8601(event.created_at),
    }


def iso8601(value: datetime | None) -> str | None:
    if value is None:
        return None
    if value.tzinfo is None:
        value = value.replace(tzinfo=UTC)
    return value.astimezone(UTC).isoformat().replace("+00:00", "Z")
