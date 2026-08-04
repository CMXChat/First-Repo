from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base
from .models import new_id, utc_now


class EvidenceCustodyEventRecord(Base):
    __tablename__ = "evidence_custody_events"
    __table_args__ = (
        Index("ix_custody_owner_case", "owner_subject", "case_id"),
        Index("ix_custody_evidence_occurred", "evidence_id", "occurred_at"),
    )

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_id)
    case_id: Mapped[str] = mapped_column(ForeignKey("cases.id", ondelete="CASCADE"), nullable=False, index=True)
    evidence_id: Mapped[str] = mapped_column(ForeignKey("evidence_items.id", ondelete="CASCADE"), nullable=False, index=True)
    owner_subject: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    recorded_by: Mapped[str] = mapped_column(String(255), nullable=False)
    event_type: Mapped[str] = mapped_column(String(60), nullable=False, index=True)
    custodian: Mapped[str] = mapped_column(String(300), nullable=False)
    location: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    note: Mapped[str] = mapped_column(Text, nullable=False, default="")
    observed_sha256: Mapped[str | None] = mapped_column(String(64), nullable=True)
    integrity_state: Mapped[str] = mapped_column(String(30), nullable=False, default="not_checked")
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, nullable=False)
