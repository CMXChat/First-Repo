from __future__ import annotations

import re
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..models import CaseRecord, ObservationRecord, SourceRecord

_IMPORTED_ID_PATTERN = re.compile(r"(?:^|\n)Imported record ID: ([^\n]+)")


def link_missing_import_sources(
    session: Session,
    *,
    case: CaseRecord,
    owner_subject: str,
    payload: dict[str, Any],
) -> int:
    """Attach imported missing-case observations to their persistent source rows.

    The session importer preserves the legacy source reference in each observation note.
    This pass resolves that reference to the SourceRecord created in the same atomic import.
    """

    if payload.get("schema") != "cmx-missing-case-v1":
        return 0

    source_ids: dict[str, str] = {}
    for raw_source in payload.get("sources", []):
        if not isinstance(raw_source, dict):
            continue
        imported_id = _text(raw_source.get("id"), 100)
        label = _text(raw_source.get("label"), 300)
        if not imported_id or not label:
            continue

        source = session.scalar(
            select(SourceRecord)
            .where(
                SourceRecord.case_id == case.id,
                SourceRecord.owner_subject == owner_subject,
                SourceRecord.source_type == "missing_case_import",
                SourceRecord.label == label,
                SourceRecord.url == _safe_http_url(raw_source.get("url")),
                SourceRecord.notes == _text(raw_source.get("notes"), 10000),
            )
            .order_by(SourceRecord.created_at.desc(), SourceRecord.id.desc())
            .limit(1)
        )
        if source is not None:
            source_ids[imported_id] = source.id

    record_sources: dict[str, str] = {}
    for collection in ("facts", "leads", "timeline"):
        for raw_record in payload.get(collection, []):
            if not isinstance(raw_record, dict):
                continue
            imported_id = _text(raw_record.get("id"), 100)
            source_reference = _text(raw_record.get("sourceReference"), 100)
            source_id = source_ids.get(source_reference)
            if imported_id and source_id:
                record_sources[imported_id] = source_id

    linked = 0
    for item in list(session.new):
        if not isinstance(item, ObservationRecord):
            continue
        if item.case_id != case.id or item.owner_subject != owner_subject or item.source_id:
            continue
        match = _IMPORTED_ID_PATTERN.search(item.note or "")
        if not match:
            continue
        source_id = record_sources.get(match.group(1).strip())
        if source_id:
            item.source_id = source_id
            linked += 1
    return linked


def _text(value: Any, limit: int) -> str:
    return str(value or "").strip()[:limit]


def _safe_http_url(value: Any) -> str:
    candidate = _text(value, 4000)
    return candidate if candidate.lower().startswith(("https://", "http://")) else ""
