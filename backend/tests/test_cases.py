from fastapi.testclient import TestClient

from app.main import app

USER_A = {"X-CMX-Dev-User": "operator-a@example.test"}
USER_B = {"X-CMX-Dev-User": "operator-b@example.test"}


def create_case(client: TestClient) -> dict:
    response = client.post(
        "/api/cases",
        headers=USER_A,
        json={
            "case_type": "osint",
            "title": "Test case",
            "urgency": "standard",
            "authorization_basis": "Authorized automated test",
            "summary": "",
        },
    )
    assert response.status_code == 201, response.text
    return response.json()


def test_cases_are_scoped_to_authenticated_subject() -> None:
    with TestClient(app) as client:
        case = create_case(client)

        own_list = client.get("/api/cases", headers=USER_A)
        assert own_list.status_code == 200
        assert [item["id"] for item in own_list.json()] == [case["id"]]

        other_list = client.get("/api/cases", headers=USER_B)
        assert other_list.status_code == 200
        assert other_list.json() == []

        other_get = client.get(f"/api/cases/{case['id']}", headers=USER_B)
        assert other_get.status_code == 404


def test_complete_case_record_chain_and_soft_delete() -> None:
    with TestClient(app) as client:
        case = create_case(client)
        case_id = case["id"]

        entity = client.post(
            f"/api/cases/{case_id}/entities",
            headers=USER_A,
            json={
                "entity_type": "domain",
                "normalized_value": "example.com",
                "display_value": "example.com",
                "confidence": "high",
                "attributes": {"source": "test"},
            },
        )
        assert entity.status_code == 201, entity.text
        entity_id = entity.json()["id"]

        second_entity = client.post(
            f"/api/cases/{case_id}/entities",
            headers=USER_A,
            json={
                "entity_type": "ip",
                "normalized_value": "203.0.113.10",
                "display_value": "203.0.113.10",
                "confidence": "limited",
            },
        )
        assert second_entity.status_code == 201, second_entity.text
        second_entity_id = second_entity.json()["id"]

        duplicate = client.post(
            f"/api/cases/{case_id}/entities",
            headers=USER_A,
            json={"entity_type": "domain", "normalized_value": "example.com"},
        )
        assert duplicate.status_code == 409

        source = client.post(
            f"/api/cases/{case_id}/sources",
            headers=USER_A,
            json={
                "label": "Official test source",
                "source_type": "web",
                "url": "https://example.com/",
                "notes": "Test source",
            },
        )
        assert source.status_code == 201, source.text
        source_id = source.json()["id"]

        observation = client.post(
            f"/api/cases/{case_id}/observations",
            headers=USER_A,
            json={
                "entity_id": entity_id,
                "source_id": source_id,
                "kind": "dns",
                "value_text": "A record observed",
                "note": "Test observation",
                "confidence": "confirmed",
            },
        )
        assert observation.status_code == 201, observation.text

        query = client.post(
            f"/api/cases/{case_id}/queries",
            headers=USER_A,
            json={
                "entity_id": entity_id,
                "provider": "Google",
                "query_text": "site:example.com",
                "result_url": "https://www.google.com/search?q=site%3Aexample.com",
                "purpose": "Test query",
            },
        )
        assert query.status_code == 201, query.text

        evidence = client.post(
            f"/api/cases/{case_id}/evidence",
            headers=USER_A,
            json={
                "source_id": source_id,
                "filename": "sample.txt",
                "media_type": "text/plain",
                "size_bytes": 4,
                "sha256": "a" * 64,
                "metadata_json": {"local": True},
            },
        )
        assert evidence.status_code == 201, evidence.text

        relationship = client.post(
            f"/api/cases/{case_id}/relationships",
            headers=USER_A,
            json={
                "from_entity_id": entity_id,
                "to_entity_id": second_entity_id,
                "relationship_type": "resolves_to",
                "confidence": "limited",
                "note": "Test relationship",
            },
        )
        assert relationship.status_code == 201, relationship.text

        note = client.post(
            f"/api/cases/{case_id}/notes",
            headers=USER_A,
            json={"note": "Private analyst note"},
        )
        assert note.status_code == 201, note.text

        detail = client.get(f"/api/cases/{case_id}", headers=USER_A)
        assert detail.status_code == 200, detail.text
        payload = detail.json()
        assert len(payload["entities"]) == 2
        assert len(payload["sources"]) == 1
        assert len(payload["observations"]) == 1
        assert len(payload["queries"]) == 1
        assert len(payload["evidence_items"]) == 1
        assert len(payload["relationships"]) == 1
        assert len(payload["notes"]) == 1

        deleted = client.delete(f"/api/cases/{case_id}", headers=USER_A)
        assert deleted.status_code == 204
        assert client.get(f"/api/cases/{case_id}", headers=USER_A).status_code == 404
