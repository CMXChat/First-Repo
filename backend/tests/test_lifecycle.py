from datetime import UTC, datetime, timedelta

from fastapi.testclient import TestClient

from app.main import app

HEADERS = {"X-CMX-Dev-User": "lifecycle@example.test"}


def create_case(client: TestClient, *, retention_due: bool = False) -> dict:
    retention = datetime.now(UTC) - timedelta(days=1) if retention_due else None
    response = client.post(
        "/api/cases",
        headers=HEADERS,
        json={
            "case_type": "lifecycle_test",
            "title": "Lifecycle test",
            "authorization_basis": "Authorized lifecycle test",
            "retention_until": retention.isoformat() if retention else None,
        },
    )
    assert response.status_code == 201, response.text
    return response.json()


def test_retention_audit_restore_and_permanent_purge() -> None:
    with TestClient(app) as client:
        case = create_case(client, retention_due=True)
        case_id = case["id"]

        due = client.get("/api/cases/retention-due", headers=HEADERS)
        assert due.status_code == 200, due.text
        assert [item["id"] for item in due.json()] == [case_id]

        audit = client.get(f"/api/cases/{case_id}/audit", headers=HEADERS)
        assert audit.status_code == 200, audit.text
        assert audit.json()[0]["action"] == "case.created"
        assert "title" not in audit.json()[0]["details"]

        deleted = client.delete(f"/api/cases/{case_id}", headers=HEADERS)
        assert deleted.status_code == 204

        deleted_list = client.get("/api/cases/deleted", headers=HEADERS)
        assert deleted_list.status_code == 200, deleted_list.text
        assert [item["id"] for item in deleted_list.json()] == [case_id]

        bad_restore = client.post(
            f"/api/cases/{case_id}/restore",
            headers=HEADERS,
            json={"confirmation": "wrong", "reason": "Test restore"},
        )
        assert bad_restore.status_code == 422

        restored = client.post(
            f"/api/cases/{case_id}/restore",
            headers=HEADERS,
            json={"confirmation": case_id, "reason": "Test restore"},
        )
        assert restored.status_code == 200, restored.text
        assert restored.json()["deleted_at"] is None
        assert restored.json()["status"] == "open"

        client.delete(f"/api/cases/{case_id}", headers=HEADERS)
        bad_purge = client.post(
            f"/api/cases/{case_id}/purge",
            headers=HEADERS,
            json={"confirmation": "wrong", "reason": "Test purge"},
        )
        assert bad_purge.status_code == 422

        purged = client.post(
            f"/api/cases/{case_id}/purge",
            headers=HEADERS,
            json={"confirmation": case_id, "reason": "Test purge"},
        )
        assert purged.status_code == 204
        assert client.get(f"/api/cases/{case_id}", headers=HEADERS).status_code == 404
        assert client.get("/api/cases/deleted", headers=HEADERS).json() == []
