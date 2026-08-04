from __future__ import annotations

from typing import Any, TypeVar

from fastapi import HTTPException, status
from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from ..models import (
    AuditEventRecord,
    CaseRecord,
    EntityRecord,
    SourceRecord,
)

OwnedRecord = TypeVar("OwnedRecord", EntityRecord, SourceRecord)


def get_owned_case(session: Session, case_id: str, owner_subject: str) -> CaseRecord:
    case = session.scalar(
        select(CaseRecord).where(
            CaseRecord.id == case_id,
            CaseRecord.owner_subject == owner_subject,
            CaseRecord.deleted_at.is_(None),
        )
    )
    if case is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")
    return case


def get_owned_entity(session: Session, case_id: str, entity_id: str, owner_subject: str) -> EntityRecord:
    entity = session.scalar(
        select(EntityRecord).where(
            EntityRecord.id == entity_id,
            EntityRecord.case_id == case_id,
            EntityRecord.owner_subject == owner_subject,
        )
    )
    if entity is None:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Entity does not belong to this case")
    return entity


def get_owned_source(session: Session, case_id: str, source_id: str, owner_subject: str) -> SourceRecord:
    source = session.scalar(
        select(SourceRecord).where(
            SourceRecord.id == source_id,
            SourceRecord.case_id == case_id,
            SourceRecord.owner_subject == owner_subject,
        )
    )
    if source is None:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Source does not belong to this case")
    return source


def owned_case_children(statement: Select, model, case_id: str, owner_subject: str) -> Select:
    return statement.where(model.case_id == case_id, model.owner_subject == owner_subject)


def record_audit(
    session: Session,
    *,
    owner_subject: str,
    action: str,
    object_type: str,
    object_id: str,
    request_id: str,
    case_id: str | None = None,
    details: dict[str, Any] | None = None,
) -> AuditEventRecord:
    event = AuditEventRecord(
        owner_subject=owner_subject,
        case_id=case_id,
        action=action,
        object_type=object_type,
        object_id=object_id,
        request_id=request_id,
        details=details or {},
    )
    session.add(event)
    return event
