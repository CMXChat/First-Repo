from fastapi.testclient import TestClient

from app.main import app


def test_live_health_is_available() -> None:
    with TestClient(app) as client:
        response = client.get("/api/health/live")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "cmx-restricted-node"}
    assert response.headers["x-content-type-options"] == "nosniff"


def test_development_identity_is_exposed_without_secrets() -> None:
    with TestClient(app) as client:
        response = client.get("/api/whoami", headers={"X-CMX-Dev-User": "operator@example.test"})
    assert response.status_code == 200
    payload = response.json()
    assert payload["email"] == "operator@example.test"
    assert payload["subject"] == "development:operator@example.test"
    assert "claims" not in payload


def test_static_tool_route_is_served() -> None:
    with TestClient(app) as client:
        response = client.get("/osint")
    assert response.status_code == 200
    assert "CMX OSINT Console" in response.text
    assert response.headers["cache-control"] == "no-store"
