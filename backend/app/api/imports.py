from __future__ import annotations

from datetime import UTC, datetime

from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from ..db import get_db_session
from ..import_schemas import SessionImportRequest, SessionImportResult
from ..security import AccessIdentity
from ..services.cases import get_owned_case, record_audit
from ..services.imports import import_session_payload

router = APIRouter(prefix="/api/cases/{case_id}", tags=["case imports"])


@router.post("/imports", response_model=SessionImportResult, status_code=status.HTTP_201_CREATED)
def import_session(
    case_id: str,
    request_payload: SessionImportRequest,
    request: Request,
    session: Session = Depends(get_db_session),
) -> SessionImportResult:
    identity: AccessIdentity = request.state.identity
    case = get_owned_case(session, case_id, identity.subject)
    try:
        result = import_session_payload(
            session,
            case=case,
            owner_subject=identity.subject,
            payload=request_payload.payload,
        )
        case.updated_at = datetime.now(UTC)
        record_audit(
            session,
            owner_subject=identity.subject,
            case_id=case.id,
            action="case.session_imported",
            object_type="case",
            object_id=case.id,
            request_id=request.state.request_id,
            details={
                "schema": result.schema,
                "entities_created": result.entities_created,
                "observations_created": result.observations_created,
                "sources_created": result.sources_created,
                "queries_created": result.queries_created,
                "evidence_created": result.evidence_created,
                "notes_created": result.notes_created,
                "warning_count": len(result.warnings),
            },
        )
        session.commit()
        return result
    except SQLAlchemyError:
        session.rollback()
        raise
