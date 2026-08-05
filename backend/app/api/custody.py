from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy.orm import Session

from ..custody_models import EvidenceCustodyEventRecord
from ..custody_schemas import CustodyEventCreate, CustodyEventRead, EvidenceManifestRead
from ..db import get_db_session
from ..models import utc_now
from ..security import AccessIdentity
from ..services.cases import get_owned_case, record_audit
from ..services.custody import (
    build_manifest,
    get_manifest_source,
    get_owned_evidence,
    integrity_state,
    list_owned_custody_events,
)

router = APIRouter(
    prefix="/api/cases/{case_id}/evidence/{evidence_id}",
    tags=["evidence custody"],
)


def owner(request: Request) -> str:
    identity: AccessIdentity = request.state.identity
    return identity.subject


@router.post("/custody", response_model=CustodyEventRead, status_code=status.HTTP_201_CREATED)
def create_custody_event(
    case_id: str,
    evidence_id: str,
    payload: CustodyEventCreate,
    request: Request,
    session: Session = Depends(get_db_session),
) -> EvidenceCustodyEventRecord:
    subject = owner(request)
    get_owned_case(session, case_id, subject)
    evidence = get_owned_evidence(session, case_id, evidence_id, subject)
    observed_sha256 = payload.observed_sha256.lower() if payload.observed_sha256 else None
    item = EvidenceCustodyEventRecord(
        case_id=case_id,
        evidence_id=evidence_id,
        owner_subject=subject,
        recorded_by=subject,
        event_type=payload.event_type,
        custodian=payload.custodian,
        location=payload.location,
        note=payload.note,
        observed_sha256=observed_sha256,
        integrity_state=integrity_state(evidence.sha256, observed_sha256),
        occurred_at=payload.occurred_at or utc_now(),
    )
    session.add(item)
    session.flush()
    record_audit(
        session,
        owner_subject=subject,
        case_id=case_id,
        action="evidence.custody_recorded",
        object_type="evidence_custody",
        object_id=item.id,
        request_id=request.state.request_id,
        details={
            "evidence_id": evidence_id,
            "event_type": item.event_type,
            "integrity_state": item.integrity_state,
            "hash_checked": bool(item.observed_sha256),
            "has_location": bool(item.location),
            "has_note": bool(item.note),
        },
    )
    session.commit()
    return item


@router.get("/custody", response_model=list[CustodyEventRead])
def list_custody_events(
    case_id: str,
    evidence_id: str,
    request: Request,
    limit: int = Query(default=500, ge=1, le=500),
    session: Session = Depends(get_db_session),
) -> list[EvidenceCustodyEventRecord]:
    subject = owner(request)
    get_owned_case(session, case_id, subject)
    get_owned_evidence(session, case_id, evidence_id, subject)
    return list_owned_custody_events(
        session,
        case_id,
        evidence_id,
        subject,
        limit=limit,
    )


@router.get("/manifest", response_model=EvidenceManifestRead)
def get_evidence_manifest(
    case_id: str,
    evidence_id: str,
    request: Request,
    session: Session = Depends(get_db_session),
) -> dict:
    subject = owner(request)
    get_owned_case(session, case_id, subject)
    evidence = get_owned_evidence(session, case_id, evidence_id, subject)
    source = get_manifest_source(session, evidence, subject)
    events = list_owned_custody_events(
        session,
        case_id,
        evidence_id,
        subject,
        limit=500,
    )
    return build_manifest(evidence, source, events)
