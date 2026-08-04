from fastapi.testclient import TestClient

from app.main import app

HEADERS = {"X-CMX-Dev-User": "importer@example.test"}


def create_case(client: TestClient, title: str) -> str:
    response = client.post(
        "/api/cases",
        headers=HEADERS,
        json={
            "case_type": "import_test",
            "title": title,
            "authorization_basis": "Authorized automated import test",
        },
    )
    assert response.status_code == 201, response.text
    return response.json()["id"]


def import_payload(client: TestClient, case_id: str, payload: dict) -> dict:
    response = client.post(
        f"/api/cases/{case_id}/imports",
        headers=HEADERS,
        json={"payload": payload},
    )
    assert response.status_code == 201, response.text
    return response.json()


def test_imports_all_supported_cmx_session_schemas() -> None:
    with TestClient(app) as client:
        osint_case = create_case(client, "OSINT import")
        result = import_payload(
            client,
            osint_case,
            {
                "schema": "cmx-osint-session-v1",
                "exportedAt": "2026-08-04T04:00:00Z",
                "entity": {
                    "type": "domain",
                    "value": "example.com",
                    "input": "Example.com",
                    "confidence": "High",
                    "scope": "Public DNS name",
                },
                "observations": [
                    {
                        "kind": "analysis",
                        "value": "example.com",
                        "source": "CMX local analyzer",
                        "note": "Normalized locally",
                        "timestamp": "2026-08-04T04:00:00Z",
                    }
                ],
                "dns": [
                    {
                        "query": {"name": "example.com", "type": "A"},
                        "status": 0,
                        "answers": [{"name": "example.com.", "type": 1, "ttl": 300, "data": "93.184.216.34"}],
                    }
                ],
            },
        )
        assert result["entities_created"] == 1
        assert result["observations_created"] == 2

        phone_case = create_case(client, "Phone import")
        result = import_payload(
            client,
            phone_case,
            {
                "schema": "cmx-phone-session-v1",
                "phone": {
                    "e164": "+12125550100",
                    "international": "+1 212 555 0100",
                    "country": "North American Numbering Plan (+1), country unresolved",
                    "callingCode": "+1",
                    "confidence": "Medium",
                    "inferredFrom": "international calling code",
                },
                "observations": [
                    {
                        "kind": "analysis",
                        "value": "+12125550100",
                        "source": "CMX local normalizer",
                        "note": "Formatting only",
                        "timestamp": "2026-08-04T04:00:00Z",
                    }
                ],
            },
        )
        assert result["entities_created"] == 1
        assert result["observations_created"] == 1

        search_case = create_case(client, "Search import")
        result = import_payload(
            client,
            search_case,
            {
                "schema": "cmx-search-session-v1",
                "entries": [
                    {
                        "savedAt": "2026-08-04T04:00:00Z",
                        "engine": "Google",
                        "purpose": "Exact public mention",
                        "query": '"example.com"',
                        "url": "https://www.google.com/search?q=%22example.com%22",
                    }
                ],
            },
        )
        assert result["queries_created"] == 1

        metadata_case = create_case(client, "Metadata import")
        result = import_payload(
            client,
            metadata_case,
            {
                "schema": "cmx-metadata-session-v1",
                "exportedAt": "2026-08-04T04:00:00Z",
                "entries": [
                    {
                        "id": "file-1",
                        "type": "text",
                        "status": "complete",
                        "warnings": [],
                        "metadata": {
                            "name": "sample.txt",
                            "size": 4,
                            "type": "text/plain",
                            "sha256": "a" * 64,
                        },
                    }
                ],
            },
        )
        assert result["evidence_created"] == 1

        missing_case = create_case(client, "Missing import")
        result = import_payload(
            client,
            missing_case,
            {
                "schema": "cmx-missing-case-v1",
                "case": {
                    "subjectLabel": "Internal reference",
                    "officialReportStatus": "filed",
                    "lastSeenAt": "2026-08-03T21:00:00Z",
                    "lastSeenLocation": "General area",
                    "coordinator": "Authority reference",
                    "createdAt": "2026-08-04T04:00:00Z",
                },
                "sources": [
                    {
                        "id": "source-1",
                        "label": "Official notice",
                        "url": "https://example.com/notice",
                        "notes": "Test source",
                        "accessedAt": "2026-08-04T04:00:00Z",
                    }
                ],
                "facts": [
                    {
                        "id": "fact-1",
                        "text": "Confirmed test fact",
                        "confidence": "confirmed",
                        "sourceReference": "source-1",
                        "recordedAt": "2026-08-04T04:00:00Z",
                    }
                ],
                "leads": [
                    {
                        "id": "lead-1",
                        "text": "Unverified test lead",
                        "status": "unverified",
                        "sourceReference": "source-1",
                        "recordedAt": "2026-08-04T04:00:00Z",
                    }
                ],
                "timeline": [
                    {
                        "id": "event-1",
                        "occurredAt": "2026-08-03T21:00:00Z",
                        "location": "General area",
                        "description": "Last confirmed event",
                        "sourceReference": "source-1",
                        "recordedAt": "2026-08-04T04:00:00Z",
                    }
                ],
            },
        )
        assert result["sources_created"] == 1
        assert result["observations_created"] == 4

        for case_id in (osint_case, phone_case, search_case, metadata_case, missing_case):
            response = client.get(f"/api/cases/{case_id}", headers=HEADERS)
            assert response.status_code == 200, response.text


def test_import_rejects_unknown_or_oversized_schema() -> None:
    with TestClient(app) as client:
        case_id = create_case(client, "Rejected import")
        unknown = client.post(
            f"/api/cases/{case_id}/imports",
            headers=HEADERS,
            json={"payload": {"schema": "unknown-v1"}},
        )
        assert unknown.status_code == 422

        oversized = client.post(
            f"/api/cases/{case_id}/imports",
            headers=HEADERS,
            json={
                "payload": {
                    "schema": "cmx-search-session-v1",
                    "entries": [{"query": "x" * 2_100_000}],
                }
            },
        )
        assert oversized.status_code == 422
