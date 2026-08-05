from __future__ import annotations

import json
from datetime import UTC, datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..import_schemas import SessionImportResult
from ..models import (
    CaseRecord,
    EntityRecord,
    EvidenceItemRecord,
    ObservationRecord,
    QueryRecord,
    SourceRecord,
)


def import_session_payload(
    session: Session,
    *,
    case: CaseRecord,
    owner_subject: str,
    payload: dict[str, Any],
) -> SessionImportResult:
    schema = str(payload.get("schema", ""))
    result = SessionImportResult(schema=schema)

    if schema == "cmx-osint-session-v1":
        import_osint(session, case, owner_subject, payload, result)
    elif schema == "cmx-phone-session-v1":
        import_phone(session, case, owner_subject, payload, result)
    elif schema == "cmx-search-session-v1":
        import_search(session, case, owner_subject, payload, result)
    elif schema == "cmx-metadata-session-v1":
        import_metadata(session, case, owner_subject, payload, result)
    elif schema == "cmx-missing-case-v1":
        import_missing(session, case, owner_subject, payload, result)
    return result


def import_osint(
    session: Session,
    case: CaseRecord,
    owner: str,
    payload: dict[str, Any],
    result: SessionImportResult,
) -> None:
    entity_data = as_dict(payload.get("entity"))
    entity = None
    if entity_data:
        entity, created = ensure_entity(
            session,
            case,
            owner,
            entity_type=safe_slug(entity_data.get("type"), "unknown"),
            normalized_value=safe_text(entity_data.get("value"), 5000),
            display_value=safe_text(entity_data.get("input") or entity_data.get("value"), 5000),
            confidence=confidence_value(entity_data.get("confidence")),
            attributes={"imported_schema": result.schema, "scope": safe_text(entity_data.get("scope"), 2000)},
        )
        result.entities_created += int(created)

    for item in as_list(payload.get("observations"))[:500]:
        observation = as_dict(item)
        value = safe_text(observation.get("value"), 20000)
        if not value:
            result.warnings.append("Skipped an OSINT observation without a value.")
            continue
        source = safe_text(observation.get("source"), 500)
        note = safe_text(observation.get("note"), 18000)
        create_observation(
            session,
            case,
            owner,
            kind=safe_slug(observation.get("kind"), "observation"),
            value=value,
            note=join_note(source, note),
            entity_id=entity.id if entity else None,
            observed_at=parse_datetime(observation.get("timestamp")),
        )
        result.observations_created += 1

    for item in as_list(payload.get("dns"))[:100]:
        dns = as_dict(item)
        query = as_dict(dns.get("query"))
        create_observation(
            session,
            case,
            owner,
            kind="dns_snapshot",
            value=safe_json(dns, 20000),
            note=f"DNS question: {safe_text(query.get('name'), 253)} {safe_text(query.get('type'), 20)}".strip(),
            entity_id=entity.id if entity else None,
            observed_at=parse_datetime(payload.get("exportedAt")),
        )
        result.observations_created += 1


def import_phone(
    session: Session,
    case: CaseRecord,
    owner: str,
    payload: dict[str, Any],
    result: SessionImportResult,
) -> None:
    phone = as_dict(payload.get("phone"))
    entity = None
    e164 = safe_text(phone.get("e164"), 80)
    if e164:
        entity, created = ensure_entity(
            session,
            case,
            owner,
            entity_type="phone",
            normalized_value=e164,
            display_value=safe_text(phone.get("international") or e164, 200),
            confidence=confidence_value(phone.get("confidence")),
            attributes={
                "imported_schema": result.schema,
                "country": safe_text(phone.get("country"), 300),
                "calling_code": safe_text(phone.get("callingCode"), 30),
                "inferred_from": safe_text(phone.get("inferredFrom"), 100),
            },
        )
        result.entities_created += int(created)

    for item in as_list(payload.get("observations"))[:500]:
        observation = as_dict(item)
        value = safe_text(observation.get("value"), 20000) or e164
        if not value:
            continue
        create_observation(
            session,
            case,
            owner,
            kind=safe_slug(observation.get("kind"), "phone_observation"),
            value=value,
            note=join_note(safe_text(observation.get("source"), 500), safe_text(observation.get("note"), 18000)),
            entity_id=entity.id if entity else None,
            observed_at=parse_datetime(observation.get("timestamp")),
        )
        result.observations_created += 1


def import_search(
    session: Session,
    case: CaseRecord,
    owner: str,
    payload: dict[str, Any],
    result: SessionImportResult,
) -> None:
    for item in as_list(payload.get("entries"))[:1000]:
        entry = as_dict(item)
        query_text = safe_text(entry.get("query"), 20000)
        if not query_text:
            result.warnings.append("Skipped a Search entry without a query.")
            continue
        url = safe_http_url(entry.get("url"))
        session.add(
            QueryRecord(
                case_id=case.id,
                owner_subject=owner,
                provider=safe_text(entry.get("engine"), 120) or "Unknown",
                query_text=query_text,
                result_url=url,
                purpose=safe_text(entry.get("purpose"), 4000),
                executed_at=parse_datetime(entry.get("savedAt")),
            )
        )
        result.queries_created += 1


def import_metadata(
    session: Session,
    case: CaseRecord,
    owner: str,
    payload: dict[str, Any],
    result: SessionImportResult,
) -> None:
    for item in as_list(payload.get("entries"))[:500]:
        entry = as_dict(item)
        metadata = as_dict(entry.get("metadata"))
        sha256 = safe_text(metadata.get("sha256"), 64).lower()
        if len(sha256) != 64 or any(char not in "0123456789abcdef" for char in sha256):
            result.warnings.append("Skipped a Metadata entry without a valid SHA-256 hash.")
            continue
        filename = safe_text(metadata.get("name") or entry.get("id") or "unnamed", 500)
        duplicate = session.scalar(
            select(EvidenceItemRecord.id).where(
                EvidenceItemRecord.case_id == case.id,
                EvidenceItemRecord.owner_subject == owner,
                EvidenceItemRecord.filename == filename,
                EvidenceItemRecord.sha256 == sha256,
            )
        )
        if duplicate:
            result.warnings.append(f"Skipped duplicate evidence registration for {filename}.")
            continue
        session.add(
            EvidenceItemRecord(
                case_id=case.id,
                owner_subject=owner,
                filename=filename,
                media_type=safe_text(metadata.get("mimeDeclared") or metadata.get("type"), 200) or "application/octet-stream",
                size_bytes=safe_int(metadata.get("size"), 0, 10_000_000_000),
                sha256=sha256,
                storage_key="",
                metadata_json={
                    "imported_schema": result.schema,
                    "entry_type": safe_text(entry.get("type"), 100),
                    "status": safe_text(entry.get("status"), 100),
                    "warnings": as_list(entry.get("warnings"))[:100],
                    "metadata": metadata,
                },
                captured_at=parse_datetime(payload.get("exportedAt")),
            )
        )
        result.evidence_created += 1


def import_missing(
    session: Session,
    case: CaseRecord,
    owner: str,
    payload: dict[str, Any],
    result: SessionImportResult,
) -> None:
    source_map: dict[str, str] = {}
    for item in as_list(payload.get("sources"))[:500]:
        source = as_dict(item)
        label = safe_text(source.get("label"), 300)
        if not label:
            continue
        record = SourceRecord(
            case_id=case.id,
            owner_subject=owner,
            label=label,
            source_type="missing_case_import",
            url=safe_http_url(source.get("url")),
            notes=safe_text(source.get("notes"), 10000),
            accessed_at=parse_datetime(source.get("accessedAt")),
        )
        session.add(record)
        session.flush()
        old_id = safe_text(source.get("id"), 100)
        if old_id:
            source_map[old_id] = record.id
        result.sources_created += 1

    for item in as_list(payload.get("facts"))[:1000]:
        fact = as_dict(item)
        value = safe_text(fact.get("text"), 20000)
        if not value:
            continue
        create_observation(
            session,
            case,
            owner,
            kind="fact",
            value=value,
            note=source_reference_note(fact),
            confidence=confidence_value(fact.get("confidence")),
            observed_at=parse_datetime(fact.get("recordedAt")),
        )
        result.observations_created += 1

    for item in as_list(payload.get("leads"))[:1000]:
        lead = as_dict(item)
        value = safe_text(lead.get("text"), 20000)
        if not value:
            continue
        status = safe_text(lead.get("status"), 100)
        confidence = "strong" if status == "corroborated" else "limited"
        create_observation(
            session,
            case,
            owner,
            kind="lead",
            value=value,
            note=join_note(f"Lead status: {status}", source_reference_note(lead)),
            confidence=confidence,
            observed_at=parse_datetime(lead.get("recordedAt")),
        )
        result.observations_created += 1

    for item in as_list(payload.get("timeline"))[:2000]:
        event = as_dict(item)
        value = safe_text(event.get("description"), 20000)
        if not value:
            continue
        create_observation(
            session,
            case,
            owner,
            kind="timeline",
            value=value,
            note=join_note(
                f"Location: {safe_text(event.get('location'), 500)}" if event.get("location") else "",
                source_reference_note(event),
            ),
            observed_at=parse_datetime(event.get("occurredAt") or event.get("recordedAt")),
        )
        result.observations_created += 1

    case_data = as_dict(payload.get("case"))
    if case_data:
        imported_summary = {
            "subject_label": safe_text(case_data.get("subjectLabel"), 300),
            "official_report_status": safe_text(case_data.get("officialReportStatus"), 100),
            "last_seen_at": safe_text(case_data.get("lastSeenAt"), 100),
            "last_seen_location": safe_text(case_data.get("lastSeenLocation"), 500),
            "coordinator": safe_text(case_data.get("coordinator"), 500),
        }
        session.add(
            ObservationRecord(
                case_id=case.id,
                owner_subject=owner,
                kind="missing_case_header",
                value_text=safe_json(imported_summary, 20000),
                note="Imported case header. Existing authorization and case title were not overwritten.",
                confidence="unrated",
                observed_at=parse_datetime(case_data.get("updatedAt") or case_data.get("createdAt")) or datetime.now(UTC),
            )
        )
        result.observations_created += 1


def ensure_entity(
    session: Session,
    case: CaseRecord,
    owner: str,
    *,
    entity_type: str,
    normalized_value: str,
    display_value: str,
    confidence: str,
    attributes: dict[str, Any],
) -> tuple[EntityRecord, bool]:
    existing = session.scalar(
        select(EntityRecord).where(
            EntityRecord.case_id == case.id,
            EntityRecord.owner_subject == owner,
            EntityRecord.entity_type == entity_type,
            EntityRecord.normalized_value == normalized_value,
        )
    )
    if existing:
        return existing, False
    entity = EntityRecord(
        case_id=case.id,
        owner_subject=owner,
        entity_type=entity_type,
        normalized_value=normalized_value,
        display_value=display_value,
        confidence=confidence,
        attributes=attributes,
    )
    session.add(entity)
    session.flush()
    return entity, True


def create_observation(
    session: Session,
    case: CaseRecord,
    owner: str,
    *,
    kind: str,
    value: str,
    note: str,
    entity_id: str | None = None,
    confidence: str = "unrated",
    observed_at: datetime | None = None,
) -> None:
    session.add(
        ObservationRecord(
            case_id=case.id,
            owner_subject=owner,
            entity_id=entity_id,
            kind=kind,
            value_text=value,
            note=note,
            confidence=confidence,
            observed_at=observed_at or datetime.now(UTC),
        )
    )


def as_dict(value: Any) -> dict[str, Any]:
    return value if isinstance(value, dict) else {}


def as_list(value: Any) -> list[Any]:
    return value if isinstance(value, list) else []


def safe_text(value: Any, limit: int) -> str:
    return str(value or "").strip()[:limit]


def safe_slug(value: Any, fallback: str) -> str:
    candidate = "".join(char for char in safe_text(value, 80).lower() if char.isalnum() or char in "_-")
    return candidate or fallback


def safe_http_url(value: Any) -> str:
    candidate = safe_text(value, 4000)
    return candidate if candidate.lower().startswith(("https://", "http://")) else ""


def safe_int(value: Any, minimum: int, maximum: int) -> int:
    try:
        number = int(value)
    except (TypeError, ValueError):
        return minimum
    return max(minimum, min(maximum, number))


def safe_json(value: Any, limit: int) -> str:
    encoded = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    return encoded[:limit]


def parse_datetime(value: Any) -> datetime | None:
    text = safe_text(value, 100)
    if not text:
        return None
    try:
        parsed = datetime.fromisoformat(text.replace("Z", "+00:00"))
        return parsed if parsed.tzinfo else parsed.replace(tzinfo=UTC)
    except ValueError:
        return None


def confidence_value(value: Any) -> str:
    normalized = safe_text(value, 40).lower()
    mapping = {
        "low": "low",
        "limited": "limited",
        "medium": "medium",
        "strong": "strong",
        "high": "high",
        "confirmed": "confirmed",
    }
    return mapping.get(normalized, "unrated")


def join_note(*parts: str) -> str:
    return "\n".join(part for part in parts if part)[:20000]


def source_reference_note(record: dict[str, Any]) -> str:
    return join_note(
        f"Source reference: {safe_text(record.get('sourceReference'), 500)}" if record.get("sourceReference") else "",
        f"Imported record ID: {safe_text(record.get('id'), 100)}" if record.get("id") else "",
    )
