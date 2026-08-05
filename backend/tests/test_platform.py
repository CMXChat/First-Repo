from fastapi.testclient import TestClient

from app.platform import app

HEADERS = {
    "X-CMX-Dev-User": "platform@example.test",
    "Origin": "http://testserver",
    "Sec-Fetch-Site": "same-origin",
}


def test_platform_serves_lifecycle_workspace() -> None:
    with TestClient(app) as client:
        response = client.get("/cases/lifecycle")
    assert response.status_code == 200
    assert "CMX Case Lifecycle" in response.text
    assert response.headers["cache-control"] == "no-store"


def test_platform_lifecycle_round_trip() -> None:
    with TestClient(app) as client:
        created = client.post(
            "/api/cases",
            headers=HEADERS,
            json={
                "case_type": "platform_test",
                "title": "Platform lifecycle test",
                "authorization_basis": "Authorized platform integration test",
            },
        )
        assert created.status_code == 201, created.text
        case_id = created.json()["id"]

        deleted = client.delete(f"/api/cases/{case_id}", headers=HEADERS)
        assert deleted.status_code == 204

        deleted_cases = client.get("/api/cases/deleted", headers=HEADERS)
        assert deleted_cases.status_code == 200
        assert case_id in {item["id"] for item in deleted_cases.json()}

        restored = client.post(
            f"/api/cases/{case_id}/restore",
            headers=HEADERS,
            json={"confirmation": case_id, "reason": "Platform restore test"},
        )
        assert restored.status_code == 200, restored.text

        client.delete(f"/api/cases/{case_id}", headers=HEADERS)
        purged = client.post(
            f"/api/cases/{case_id}/purge",
            headers=HEADERS,
            json={"confirmation": case_id, "reason": "Platform purge test"},
        )
        assert purged.status_code == 204
