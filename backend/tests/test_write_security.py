from fastapi.testclient import TestClient

from app.hardened import app

HEADERS = {"X-CMX-Dev-User": "write-security@example.test"}
CASE_PAYLOAD = {
    "case_type": "security_test",
    "title": "Write security test",
    "authorization_basis": "Authorized write-security test",
}


def test_same_origin_json_write_is_allowed() -> None:
    headers = {
        **HEADERS,
        "Origin": "http://testserver",
        "Sec-Fetch-Site": "same-origin",
    }
    with TestClient(app) as client:
        response = client.post("/api/cases", headers=headers, json=CASE_PAYLOAD)
    assert response.status_code == 201, response.text


def test_cross_site_write_is_rejected() -> None:
    headers = {
        **HEADERS,
        "Origin": "https://attacker.example",
        "Sec-Fetch-Site": "cross-site",
        "Content-Type": "application/json",
    }
    with TestClient(app) as client:
        response = client.post("/api/cases", headers=headers, json=CASE_PAYLOAD)
    assert response.status_code == 403
    assert response.json()["detail"] == "Cross-site API writes are not allowed."
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert response.headers["Cache-Control"] == "no-store"
    assert response.headers.get("X-Request-ID")


def test_same_site_sibling_origin_is_rejected() -> None:
    headers = {
        **HEADERS,
        "Origin": "https://other.example.test",
        "Sec-Fetch-Site": "same-site",
        "Content-Type": "application/json",
    }
    with TestClient(app) as client:
        response = client.post("/api/cases", headers=headers, json=CASE_PAYLOAD)
    assert response.status_code == 403


def test_non_json_write_is_rejected() -> None:
    headers = {
        **HEADERS,
        "Origin": "http://testserver",
        "Sec-Fetch-Site": "same-origin",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    with TestClient(app) as client:
        response = client.post("/api/cases", headers=headers, content="title=test")
    assert response.status_code == 415


def test_declared_oversized_write_is_rejected() -> None:
    headers = {
        **HEADERS,
        "Origin": "http://testserver",
        "Sec-Fetch-Site": "same-origin",
        "Content-Type": "application/json",
        "Content-Length": "2500001",
    }
    with TestClient(app) as client:
        response = client.post("/api/cases", headers=headers, content="{}")
    assert response.status_code == 413


def test_actual_oversized_write_is_rejected_when_content_length_understates_body() -> None:
    headers = {
        **HEADERS,
        "Origin": "http://testserver",
        "Sec-Fetch-Site": "same-origin",
        "Content-Type": "application/json",
        "Content-Length": "1",
    }
    with TestClient(app) as client:
        response = client.post("/api/cases", headers=headers, content=b"x" * 2_500_001)
    assert response.status_code == 413
    assert response.json()["detail"] == "API request body exceeds the 2.5 MB transport limit."
    assert response.headers["Cache-Control"] == "no-store"


def test_delete_without_body_content_type_remains_supported() -> None:
    headers = {
        **HEADERS,
        "Origin": "http://testserver",
        "Sec-Fetch-Site": "same-origin",
    }
    with TestClient(app) as client:
        created = client.post("/api/cases", headers=headers, json=CASE_PAYLOAD)
        assert created.status_code == 201, created.text
        response = client.delete(f"/api/cases/{created.json()['id']}", headers=headers)
    assert response.status_code == 204
