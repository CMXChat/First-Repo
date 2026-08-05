"""Create the initial CMX operator data model.

Revision ID: 20260804_0001
Revises:
Create Date: 2026-08-04
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "20260804_0001"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "cases",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("owner_subject", sa.String(length=255), nullable=False),
        sa.Column("case_type", sa.String(length=80), nullable=False),
        sa.Column("title", sa.String(length=240), nullable=False),
        sa.Column("status", sa.String(length=40), nullable=False),
        sa.Column("urgency", sa.String(length=40), nullable=False),
        sa.Column("authorization_basis", sa.Text(), nullable=False),
        sa.Column("summary", sa.Text(), nullable=False),
        sa.Column("retention_until", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_cases_owner_subject", "cases", ["owner_subject"])
    op.create_index("ix_cases_status", "cases", ["status"])
    op.create_index("ix_cases_deleted_at", "cases", ["deleted_at"])

    op.create_table(
        "entities",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("case_id", sa.String(length=36), nullable=False),
        sa.Column("owner_subject", sa.String(length=255), nullable=False),
        sa.Column("entity_type", sa.String(length=80), nullable=False),
        sa.Column("normalized_value", sa.Text(), nullable=False),
        sa.Column("display_value", sa.Text(), nullable=False),
        sa.Column("confidence", sa.String(length=40), nullable=False),
        sa.Column("attributes", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["case_id"], ["cases.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("case_id", "entity_type", "normalized_value", name="uq_entity_case_type_value"),
    )
    op.create_index("ix_entities_case_id", "entities", ["case_id"])
    op.create_index("ix_entities_owner_subject", "entities", ["owner_subject"])
    op.create_index("ix_entities_entity_type", "entities", ["entity_type"])
    op.create_index("ix_entities_owner_case", "entities", ["owner_subject", "case_id"])

    op.create_table(
        "sources",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("case_id", sa.String(length=36), nullable=False),
        sa.Column("owner_subject", sa.String(length=255), nullable=False),
        sa.Column("label", sa.String(length=300), nullable=False),
        sa.Column("source_type", sa.String(length=80), nullable=False),
        sa.Column("url", sa.Text(), nullable=False),
        sa.Column("notes", sa.Text(), nullable=False),
        sa.Column("accessed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["case_id"], ["cases.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_sources_case_id", "sources", ["case_id"])
    op.create_index("ix_sources_owner_subject", "sources", ["owner_subject"])
    op.create_index("ix_sources_owner_case", "sources", ["owner_subject", "case_id"])

    op.create_table(
        "observations",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("case_id", sa.String(length=36), nullable=False),
        sa.Column("entity_id", sa.String(length=36), nullable=True),
        sa.Column("source_id", sa.String(length=36), nullable=True),
        sa.Column("owner_subject", sa.String(length=255), nullable=False),
        sa.Column("kind", sa.String(length=80), nullable=False),
        sa.Column("value_text", sa.Text(), nullable=False),
        sa.Column("note", sa.Text(), nullable=False),
        sa.Column("confidence", sa.String(length=40), nullable=False),
        sa.Column("observed_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["case_id"], ["cases.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["entity_id"], ["entities.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["source_id"], ["sources.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_observations_case_id", "observations", ["case_id"])
    op.create_index("ix_observations_entity_id", "observations", ["entity_id"])
    op.create_index("ix_observations_source_id", "observations", ["source_id"])
    op.create_index("ix_observations_owner_subject", "observations", ["owner_subject"])
    op.create_index("ix_observations_kind", "observations", ["kind"])
    op.create_index("ix_observations_owner_case", "observations", ["owner_subject", "case_id"])

    op.create_table(
        "queries",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("case_id", sa.String(length=36), nullable=False),
        sa.Column("entity_id", sa.String(length=36), nullable=True),
        sa.Column("owner_subject", sa.String(length=255), nullable=False),
        sa.Column("provider", sa.String(length=120), nullable=False),
        sa.Column("query_text", sa.Text(), nullable=False),
        sa.Column("result_url", sa.Text(), nullable=False),
        sa.Column("purpose", sa.Text(), nullable=False),
        sa.Column("executed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["case_id"], ["cases.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["entity_id"], ["entities.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_queries_case_id", "queries", ["case_id"])
    op.create_index("ix_queries_entity_id", "queries", ["entity_id"])
    op.create_index("ix_queries_owner_subject", "queries", ["owner_subject"])
    op.create_index("ix_queries_owner_case", "queries", ["owner_subject", "case_id"])

    op.create_table(
        "evidence_items",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("case_id", sa.String(length=36), nullable=False),
        sa.Column("source_id", sa.String(length=36), nullable=True),
        sa.Column("owner_subject", sa.String(length=255), nullable=False),
        sa.Column("filename", sa.String(length=500), nullable=False),
        sa.Column("media_type", sa.String(length=200), nullable=False),
        sa.Column("size_bytes", sa.BigInteger(), nullable=False),
        sa.Column("sha256", sa.String(length=64), nullable=False),
        sa.Column("storage_key", sa.String(length=1000), nullable=False),
        sa.Column("metadata_json", sa.JSON(), nullable=False),
        sa.Column("captured_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["case_id"], ["cases.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["source_id"], ["sources.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_evidence_items_case_id", "evidence_items", ["case_id"])
    op.create_index("ix_evidence_items_source_id", "evidence_items", ["source_id"])
    op.create_index("ix_evidence_items_owner_subject", "evidence_items", ["owner_subject"])
    op.create_index("ix_evidence_owner_case", "evidence_items", ["owner_subject", "case_id"])
    op.create_index("ix_evidence_sha256", "evidence_items", ["sha256"])

    op.create_table(
        "relationships",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("case_id", sa.String(length=36), nullable=False),
        sa.Column("owner_subject", sa.String(length=255), nullable=False),
        sa.Column("from_entity_id", sa.String(length=36), nullable=False),
        sa.Column("to_entity_id", sa.String(length=36), nullable=False),
        sa.Column("relationship_type", sa.String(length=120), nullable=False),
        sa.Column("confidence", sa.String(length=40), nullable=False),
        sa.Column("note", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["case_id"], ["cases.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["from_entity_id"], ["entities.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["to_entity_id"], ["entities.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_relationships_case_id", "relationships", ["case_id"])
    op.create_index("ix_relationships_owner_subject", "relationships", ["owner_subject"])
    op.create_index("ix_relationships_from_entity_id", "relationships", ["from_entity_id"])
    op.create_index("ix_relationships_to_entity_id", "relationships", ["to_entity_id"])
    op.create_index("ix_relationships_owner_case", "relationships", ["owner_subject", "case_id"])

    op.create_table(
        "analyst_notes",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("case_id", sa.String(length=36), nullable=False),
        sa.Column("owner_subject", sa.String(length=255), nullable=False),
        sa.Column("note", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.ForeignKeyConstraint(["case_id"], ["cases.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_analyst_notes_case_id", "analyst_notes", ["case_id"])
    op.create_index("ix_analyst_notes_owner_subject", "analyst_notes", ["owner_subject"])
    op.create_index("ix_notes_owner_case", "analyst_notes", ["owner_subject", "case_id"])

    op.create_table(
        "audit_events",
        sa.Column("id", sa.String(length=36), nullable=False),
        sa.Column("owner_subject", sa.String(length=255), nullable=False),
        sa.Column("case_id", sa.String(length=36), nullable=True),
        sa.Column("action", sa.String(length=120), nullable=False),
        sa.Column("object_type", sa.String(length=80), nullable=False),
        sa.Column("object_id", sa.String(length=36), nullable=False),
        sa.Column("request_id", sa.String(length=128), nullable=False),
        sa.Column("details", sa.JSON(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_audit_events_owner_subject", "audit_events", ["owner_subject"])
    op.create_index("ix_audit_events_case_id", "audit_events", ["case_id"])
    op.create_index("ix_audit_events_action", "audit_events", ["action"])
    op.create_index("ix_audit_owner_created", "audit_events", ["owner_subject", "created_at"])
    op.create_index("ix_audit_case_created", "audit_events", ["case_id", "created_at"])


def downgrade() -> None:
    op.drop_table("audit_events")
    op.drop_table("analyst_notes")
    op.drop_table("relationships")
    op.drop_table("evidence_items")
    op.drop_table("queries")
    op.drop_table("observations")
    op.drop_table("sources")
    op.drop_table("entities")
    op.drop_table("cases")
