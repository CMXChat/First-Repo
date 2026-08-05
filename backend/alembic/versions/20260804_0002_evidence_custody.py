"""Add immutable evidence custody events.

Revision ID: 20260804_0002
Revises: 20260804_0001
Create Date: 2026-08-04
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260804_0002"
down_revision: Union[str, Sequence[str], None] = "20260804_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "evidence_custody_events",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("case_id", sa.String(length=36), nullable=False),
        sa.Column("evidence_id", sa.String(length=36), nullable=False),
        sa.Column("owner_subject", sa.String(length=255), nullable=False),
        sa.Column("recorded_by", sa.String(length=255), nullable=False),
        sa.Column("event_type", sa.String(length=60), nullable=False),
        sa.Column("custodian", sa.String(length=300), nullable=False),
        sa.Column("location", sa.String(length=500), nullable=False),
        sa.Column("note", sa.Text(), nullable=False),
        sa.Column("observed_sha256", sa.String(length=64), nullable=True),
        sa.Column("integrity_state", sa.String(length=30), nullable=False),
        sa.Column("occurred_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["case_id"], ["cases.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["evidence_id"], ["evidence_items.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_evidence_custody_events_case_id", "evidence_custody_events", ["case_id"])
    op.create_index("ix_evidence_custody_events_evidence_id", "evidence_custody_events", ["evidence_id"])
    op.create_index("ix_evidence_custody_events_owner_subject", "evidence_custody_events", ["owner_subject"])
    op.create_index("ix_evidence_custody_events_event_type", "evidence_custody_events", ["event_type"])
    op.create_index("ix_custody_owner_case", "evidence_custody_events", ["owner_subject", "case_id"])
    op.create_index("ix_custody_evidence_occurred", "evidence_custody_events", ["evidence_id", "occurred_at"])


def downgrade() -> None:
    op.drop_table("evidence_custody_events")
