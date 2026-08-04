from __future__ import annotations

import os
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import text

from app.main import app

pytestmark = pytest.mark.skipif(
    not os.environ.get("CMX_DATABASE_URL", "").startswith("postgresql+psycopg://"),
    reason="PostgreSQL smoke test requires CMX_DATABASE_URL",
)


def test_postgres_case_round_trip_and_cleanup() -> None:
    user = f"postgres-smoke-{uuid.uuid4()}@example.test"
    headers = {"X-CMX-Dev-User": user}

    with TestClient(app) as client:
        ready = client.get("/api/health/ready", headers=headers)
        assert ready.status_code == 200, ready.text
        assert ready.json()["database"] == "ready"

        created = client.post(
            "/api/cases",
            headers=headers,
            json={
                "case_type": "postgres_smoke",
                "title": "PostgreSQL smoke record",
                "authorization_basis": "Automated PostgreSQL integration test",
                "summary": "Disposable test data",
            },
        )
        assert created.status_code == 201, created.text
        case_id = created.json()["id"]

        entity = client.post(
            f"/api/cases/{case_id}/entities",
            headers=headers,
            json={
                "entity_type": "domain",
                "normalized_value": "postgres-smoke.example",
                "display_value": "postgres-smoke.example",
                "confidence": "confirmed",
                "attributes": {"database": "postgresql", "json": True},
            },
        )
        assert entity.status_code == 201, entity.text

        detail = client.get(f"/api/cases/{case_id}", headers=headers)
        assert detail.status_code == 200, detail.text
        assert detail.json()["entities"][0]["attributes"]["database"] == "postgresql"

        deleted = client.delete(f"/api/cases/{case_id}", headers=headers)
        assert deleted.status_code == 204

        purged = client.post(
            f"/api/cases/{case_id}/purge",
            headers=headers,
            json={"confirmation": case_id, "reason": "Dispose PostgreSQL smoke record"},
        )
        assert purged.status_code == 204

        with app.state.session_factory() as session:
            remaining = session.execute(
                text("SELECT COUNT(*) FROM cases WHERE id = :case_id"),
                {"case_id": case_id},
            ).scalar_one()
            assert remaining == 0
