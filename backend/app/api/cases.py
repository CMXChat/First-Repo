from __future__ import annotations

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, Query, Request, Response, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from ..db import get_db_session
from ..models import CaseRecord
from ..schemas import CaseCreate, CaseDetail, CaseRead, CaseUpdate
from ..security import AccessIdentity
from ..services.cases import get_owned_case, record_audit

router = APIRouter(prefix="/api/cases", tags=["cases"])


@router.post("", response_model=CaseRead, status_code=status.HTTP_201_CREATED)
def create_case(
    payload: CaseCreate,
    request: Request,
    session: Session = Depends(get_db_session),
) -> CaseRecord:
    identity: AccessIdentity = request.state.identity
    case = CaseRecord(owner_subject=identity.subject, **payload.model_dump())
    session.add(case)
    session.flush()
    record_audit(
        session,
        owner_subject=identity.subject,
        case_id=case.id,
        action="case.created",
        object_type="case",
        object_id=case.id,
        request_id=request.state.request_id,
        details={"case_type": case.case_type, "urgency": case.urgency, "status": case.status},
    )
    session.commit()
    return case


@router.get("", response_model=list[CaseRead])
def list_cases(
    request: Request,
    case_status: str | None = Query(default=None, alias="status", max_length=40),
    limit: int = Query(default=50, ge=1, le=200),
    offset: int = Query(default=0, ge=0, le=100000),
    session: Session = Depends(get_db_session),
) -> list[CaseRecord]:
    identity: AccessIdentity = request.state.identity
    statement = (
        select(CaseRecord)
        .where(CaseRecord.owner_subject == identity.subject, CaseRecord.deleted_at.is_(None))
        .order_by(CaseRecord.updated_at.desc())
        .limit(limit)
        .offset(offset)
    )
    if case_status:
        statement = statement.where(CaseRecord.status == case_status)
    return list(session.scalars(statement).all())


@router.get("/count")
def count_cases(
    request: Request,
    session: Session = Depends(get_db_session),
) -> dict[str, int]:
    identity: AccessIdentity = request.state.identity
    count = session.scalar(
        select(func.count()).select_from(CaseRecord).where(
            CaseRecord.owner_subject == identity.subject,
            CaseRecord.deleted_at.is_(None),
        )
    )
    return {"count": int(count or 0)}


@router.get("/{case_id}", response_model=CaseDetail)
def get_case(
    case_id: str,
    request: Request,
    session: Session = Depends(get_db_session),
) -> CaseRecord:
    identity: AccessIdentity = request.state.identity
    statement = (
        select(CaseRecord)
        .options(
            selectinload(CaseRecord.entities),
            selectinload(CaseRecord.observations),
            selectinload(CaseRecord.sources),
            selectinload(CaseRecord.queries),
            selectinload(CaseRecord.evidence_items),
            selectinload(CaseRecord.relationships),
            selectinload(CaseRecord.notes),
        )
        .where(
            CaseRecord.id == case_id,
            CaseRecord.owner_subject == identity.subject,
            CaseRecord.deleted_at.is_(None),
        )
    )
    case = session.scalar(statement)
    if case is None:
        get_owned_case(session, case_id, identity.subject)
    return case


@router.patch("/{case_id}", response_model=CaseRead)
def update_case(
    case_id: str,
    payload: CaseUpdate,
    request: Request,
    session: Session = Depends(get_db_session),
) -> CaseRecord:
    identity: AccessIdentity = request.state.identity
    case = get_owned_case(session, case_id, identity.subject)
    changed_fields = payload.model_dump(exclude_unset=True)
    for field, value in changed_fields.items():
        setattr(case, field, value)
    case.updated_at = datetime.now(UTC)
    record_audit(
        session,
        owner_subject=identity.subject,
        case_id=case.id,
        action="case.updated",
        object_type="case",
        object_id=case.id,
        request_id=request.state.request_id,
        details={"fields": sorted(changed_fields)},
    )
    session.commit()
    return case


@router.delete("/{case_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_case(
    case_id: str,
    request: Request,
    session: Session = Depends(get_db_session),
) -> Response:
    identity: AccessIdentity = request.state.identity
    case = get_owned_case(session, case_id, identity.subject)
    case.deleted_at = datetime.now(UTC)
    case.status = "archived"
    case.updated_at = datetime.now(UTC)
    record_audit(
        session,
        owner_subject=identity.subject,
        case_id=case.id,
        action="case.soft_deleted",
        object_type="case",
        object_id=case.id,
        request_id=request.state.request_id,
    )
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
