from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..db import get_db_session
from ..models import (
    AnalystNoteRecord,
    EntityRecord,
    EvidenceItemRecord,
    ObservationRecord,
    QueryRecord,
    RelationshipRecord,
    SourceRecord,
)
from ..schemas import (
    EntityCreate,
    EntityRead,
    EvidenceRead,
    EvidenceRegisterCreate,
    NoteCreate,
    NoteRead,
    ObservationCreate,
    ObservationRead,
    QueryCreate,
    QueryRead,
    RelationshipCreate,
    RelationshipRead,
    SourceCreate,
    SourceRead,
)
from ..security import AccessIdentity
from ..services.cases import get_owned_case, get_owned_entity, get_owned_source, record_audit

router = APIRouter(prefix="/api/cases/{case_id}", tags=["case records"])


def owner(request: Request) -> str:
    identity: AccessIdentity = request.state.identity
    return identity.subject


def commit_created(
    session: Session,
    request: Request,
    item,
    *,
    case_id: str,
    action: str,
    object_type: str,
    details: dict | None = None,
):
    session.add(item)
    session.flush()
    record_audit(
        session,
        owner_subject=owner(request),
        case_id=case_id,
        action=action,
        object_type=object_type,
        object_id=item.id,
        request_id=request.state.request_id,
        details=details,
    )
    session.commit()
    return item


@router.post("/entities", response_model=EntityRead, status_code=status.HTTP_201_CREATED)
def create_entity(
    case_id: str,
    payload: EntityCreate,
    request: Request,
    session: Session = Depends(get_db_session),
) -> EntityRecord:
    subject = owner(request)
    get_owned_case(session, case_id, subject)
    item = EntityRecord(case_id=case_id, owner_subject=subject, **payload.model_dump())
    try:
        return commit_created(
            session,
            request,
            item,
            case_id=case_id,
            action="entity.created",
            object_type="entity",
            details={"entity_type": item.entity_type, "confidence": item.confidence},
        )
    except IntegrityError as exc:
        session.rollback()
        raise conflict("This normalized entity already exists in the case") from exc


@router.get("/entities", response_model=list[EntityRead])
def list_entities(
    case_id: str,
    request: Request,
    limit: int = Query(default=200, ge=1, le=500),
    session: Session = Depends(get_db_session),
) -> list[EntityRecord]:
    subject = owner(request)
    get_owned_case(session, case_id, subject)
    return list(
        session.scalars(
            select(EntityRecord)
            .where(EntityRecord.case_id == case_id, EntityRecord.owner_subject == subject)
            .order_by(EntityRecord.created_at.desc())
            .limit(limit)
        ).all()
    )


@router.post("/sources", response_model=SourceRead, status_code=status.HTTP_201_CREATED)
def create_source(
    case_id: str,
    payload: SourceCreate,
    request: Request,
    session: Session = Depends(get_db_session),
) -> SourceRecord:
    subject = owner(request)
    get_owned_case(session, case_id, subject)
    item = SourceRecord(case_id=case_id, owner_subject=subject, **payload.model_dump())
    return commit_created(
        session,
        request,
        item,
        case_id=case_id,
        action="source.created",
        object_type="source",
        details={"source_type": item.source_type, "has_url": bool(item.url)},
    )


@router.get("/sources", response_model=list[SourceRead])
def list_sources(
    case_id: str,
    request: Request,
    limit: int = Query(default=200, ge=1, le=500),
    session: Session = Depends(get_db_session),
) -> list[SourceRecord]:
    subject = owner(request)
    get_owned_case(session, case_id, subject)
    return list(
        session.scalars(
            select(SourceRecord)
            .where(SourceRecord.case_id == case_id, SourceRecord.owner_subject == subject)
            .order_by(SourceRecord.created_at.desc())
            .limit(limit)
        ).all()
    )


@router.post("/observations", response_model=ObservationRead, status_code=status.HTTP_201_CREATED)
def create_observation(
    case_id: str,
    payload: ObservationCreate,
    request: Request,
    session: Session = Depends(get_db_session),
) -> ObservationRecord:
    subject = owner(request)
    get_owned_case(session, case_id, subject)
    if payload.entity_id:
        get_owned_entity(session, case_id, payload.entity_id, subject)
    if payload.source_id:
        get_owned_source(session, case_id, payload.source_id, subject)
    values = payload.model_dump(exclude_none=True)
    item = ObservationRecord(case_id=case_id, owner_subject=subject, **values)
    return commit_created(
        session,
        request,
        item,
        case_id=case_id,
        action="observation.created",
        object_type="observation",
        details={"kind": item.kind, "confidence": item.confidence, "has_entity": bool(item.entity_id), "has_source": bool(item.source_id)},
    )


@router.get("/observations", response_model=list[ObservationRead])
def list_observations(
    case_id: str,
    request: Request,
    limit: int = Query(default=300, ge=1, le=1000),
    session: Session = Depends(get_db_session),
) -> list[ObservationRecord]:
    subject = owner(request)
    get_owned_case(session, case_id, subject)
    return list(
        session.scalars(
            select(ObservationRecord)
            .where(ObservationRecord.case_id == case_id, ObservationRecord.owner_subject == subject)
            .order_by(ObservationRecord.observed_at.desc())
            .limit(limit)
        ).all()
    )


@router.post("/queries", response_model=QueryRead, status_code=status.HTTP_201_CREATED)
def create_query(
    case_id: str,
    payload: QueryCreate,
    request: Request,
    session: Session = Depends(get_db_session),
) -> QueryRecord:
    subject = owner(request)
    get_owned_case(session, case_id, subject)
    if payload.entity_id:
        get_owned_entity(session, case_id, payload.entity_id, subject)
    item = QueryRecord(case_id=case_id, owner_subject=subject, **payload.model_dump())
    return commit_created(
        session,
        request,
        item,
        case_id=case_id,
        action="query.created",
        object_type="query",
        details={"provider": item.provider, "has_entity": bool(item.entity_id), "executed": item.executed_at is not None},
    )


@router.get("/queries", response_model=list[QueryRead])
def list_queries(
    case_id: str,
    request: Request,
    limit: int = Query(default=300, ge=1, le=1000),
    session: Session = Depends(get_db_session),
) -> list[QueryRecord]:
    subject = owner(request)
    get_owned_case(session, case_id, subject)
    return list(
        session.scalars(
            select(QueryRecord)
            .where(QueryRecord.case_id == case_id, QueryRecord.owner_subject == subject)
            .order_by(QueryRecord.created_at.desc())
            .limit(limit)
        ).all()
    )


@router.post("/evidence", response_model=EvidenceRead, status_code=status.HTTP_201_CREATED)
def register_evidence(
    case_id: str,
    payload: EvidenceRegisterCreate,
    request: Request,
    session: Session = Depends(get_db_session),
) -> EvidenceItemRecord:
    subject = owner(request)
    get_owned_case(session, case_id, subject)
    if payload.source_id:
        get_owned_source(session, case_id, payload.source_id, subject)
    values = payload.model_dump()
    values["sha256"] = values["sha256"].lower()
    item = EvidenceItemRecord(case_id=case_id, owner_subject=subject, **values)
    return commit_created(
        session,
        request,
        item,
        case_id=case_id,
        action="evidence.registered",
        object_type="evidence",
        details={"media_type": item.media_type, "size_bytes": item.size_bytes, "sha256_prefix": item.sha256[:12], "stored": bool(item.storage_key)},
    )


@router.get("/evidence", response_model=list[EvidenceRead])
def list_evidence(
    case_id: str,
    request: Request,
    limit: int = Query(default=200, ge=1, le=500),
    session: Session = Depends(get_db_session),
) -> list[EvidenceItemRecord]:
    subject = owner(request)
    get_owned_case(session, case_id, subject)
    return list(
        session.scalars(
            select(EvidenceItemRecord)
            .where(EvidenceItemRecord.case_id == case_id, EvidenceItemRecord.owner_subject == subject)
            .order_by(EvidenceItemRecord.created_at.desc())
            .limit(limit)
        ).all()
    )


@router.post("/relationships", response_model=RelationshipRead, status_code=status.HTTP_201_CREATED)
def create_relationship(
    case_id: str,
    payload: RelationshipCreate,
    request: Request,
    session: Session = Depends(get_db_session),
) -> RelationshipRecord:
    subject = owner(request)
    get_owned_case(session, case_id, subject)
    get_owned_entity(session, case_id, payload.from_entity_id, subject)
    get_owned_entity(session, case_id, payload.to_entity_id, subject)
    item = RelationshipRecord(case_id=case_id, owner_subject=subject, **payload.model_dump())
    return commit_created(
        session,
        request,
        item,
        case_id=case_id,
        action="relationship.created",
        object_type="relationship",
        details={"relationship_type": item.relationship_type, "confidence": item.confidence},
    )


@router.get("/relationships", response_model=list[RelationshipRead])
def list_relationships(
    case_id: str,
    request: Request,
    limit: int = Query(default=300, ge=1, le=1000),
    session: Session = Depends(get_db_session),
) -> list[RelationshipRecord]:
    subject = owner(request)
    get_owned_case(session, case_id, subject)
    return list(
        session.scalars(
            select(RelationshipRecord)
            .where(RelationshipRecord.case_id == case_id, RelationshipRecord.owner_subject == subject)
            .order_by(RelationshipRecord.created_at.desc())
            .limit(limit)
        ).all()
    )


@router.post("/notes", response_model=NoteRead, status_code=status.HTTP_201_CREATED)
def create_note(
    case_id: str,
    payload: NoteCreate,
    request: Request,
    session: Session = Depends(get_db_session),
) -> AnalystNoteRecord:
    subject = owner(request)
    get_owned_case(session, case_id, subject)
    item = AnalystNoteRecord(case_id=case_id, owner_subject=subject, note=payload.note)
    return commit_created(
        session,
        request,
        item,
        case_id=case_id,
        action="note.created",
        object_type="note",
        details={"length": len(item.note)},
    )


@router.get("/notes", response_model=list[NoteRead])
def list_notes(
    case_id: str,
    request: Request,
    limit: int = Query(default=200, ge=1, le=500),
    session: Session = Depends(get_db_session),
) -> list[AnalystNoteRecord]:
    subject = owner(request)
    get_owned_case(session, case_id, subject)
    return list(
        session.scalars(
            select(AnalystNoteRecord)
            .where(AnalystNoteRecord.case_id == case_id, AnalystNoteRecord.owner_subject == subject)
            .order_by(AnalystNoteRecord.created_at.desc())
            .limit(limit)
        ).all()
    )


def conflict(message: str):
    from fastapi import HTTPException

    return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=message)
