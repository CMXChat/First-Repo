from __future__ import annotations

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db_session
from ..lifecycle_schemas import AuditRead, LifecycleRequest
from ..models import AuditEventRecord, CaseRecord
from ..schemas import CaseRead
from ..security import AccessIdentity
from ..services.cases import record_audit

router = APIRouter(prefix="/api/cases", tags=["case lifecycle"])


@router.get("/deleted", response_model=list[CaseRead])
def list_deleted_cases(
    request: Request,
    limit: int = Query(default=50, ge=1, le=200),
    session: Session = Depends(get_db_session),
) -> list[CaseRecord]:
    identity: AccessIdentity = request.state.identity
    return list(
        session.scalars(
            select(CaseRecord)
            .where(
                CaseRecord.owner_subject == identity.subject,
                CaseRecord.deleted_at.is_not(None),
            )
            .order_by(CaseRecord.deleted_at.desc())
            .limit(limit)
        ).all()
    )


@router.get("/retention-due", response_model=list[CaseRead])
def list_retention_due_cases(
    request: Request,
    before: datetime | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=500),
    session: Session = Depends(get_db_session),
) -> list[CaseRecord]:
    identity: AccessIdentity = request.state.identity
    cutoff = before or datetime.now(UTC)
    return list(
        session.scalars(
            select(CaseRecord)
            .where(
                CaseRecord.owner_subject == identity.subject,
                CaseRecord.deleted_at.is_(None),
                CaseRecord.retention_until.is_not(None),
                CaseRecord.retention_until <= cutoff,
            )
            .order_by(CaseRecord.retention_until.asc())
            .limit(limit)
        ).all()
    )


@router.get("/{case_id}/audit", response_model=list[AuditRead])
def list_case_audit(
    case_id: str,
    request: Request,
    limit: int = Query(default=200, ge=1, le=1000),
    session: Session = Depends(get_db_session),
) -> list[AuditEventRecord]:
    identity: AccessIdentity = request.state.identity
    assert_owned_case_exists(session, case_id, identity.subject)
    return list(
        session.scalars(
            select(AuditEventRecord)
            .where(
                AuditEventRecord.case_id == case_id,
                AuditEventRecord.owner_subject == identity.subject,
            )
            .order_by(AuditEventRecord.created_at.desc())
            .limit(limit)
        ).all()
    )


@router.post("/{case_id}/restore", response_model=CaseRead)
def restore_case(
    case_id: str,
    payload: LifecycleRequest,
    request: Request,
    session: Session = Depends(get_db_session),
) -> CaseRecord:
    identity: AccessIdentity = request.state.identity
    case = session.scalar(
        select(CaseRecord).where(
            CaseRecord.id == case_id,
            CaseRecord.owner_subject == identity.subject,
            CaseRecord.deleted_at.is_not(None),
        )
    )
    if case is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deleted case not found")
    if payload.confirmation != case.id:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Confirmation must match the case ID")

    case.deleted_at = None
    case.status = "open"
    case.updated_at = datetime.now(UTC)
    record_audit(
        session,
        owner_subject=identity.subject,
        case_id=case.id,
        action="case.restored",
        object_type="case",
        object_id=case.id,
        request_id=request.state.request_id,
        details={"reason_length": len(payload.reason)},
    )
    session.commit()
    return case


@router.post("/{case_id}/purge", status_code=status.HTTP_204_NO_CONTENT)
def purge_case(
    case_id: str,
    payload: LifecycleRequest,
    request: Request,
    session: Session = Depends(get_db_session),
) -> Response:
    identity: AccessIdentity = request.state.identity
    case = session.scalar(
        select(CaseRecord).where(
            CaseRecord.id == case_id,
            CaseRecord.owner_subject == identity.subject,
            CaseRecord.deleted_at.is_not(None),
        )
    )
    if case is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Only a soft-deleted case can be purged")
    if payload.confirmation != case.id:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Confirmation must match the case ID")

    record_audit(
        session,
        owner_subject=identity.subject,
        case_id=case.id,
        action="case.purged",
        object_type="case",
        object_id=case.id,
        request_id=request.state.request_id,
        details={"reason_length": len(payload.reason)},
    )
    session.delete(case)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


def assert_owned_case_exists(session: Session, case_id: str, owner_subject: str) -> CaseRecord:
    case = session.scalar(
        select(CaseRecord).where(
            CaseRecord.id == case_id,
            CaseRecord.owner_subject == owner_subject,
        )
    )
    if case is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Case not found")
    return case
