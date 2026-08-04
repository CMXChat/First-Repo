import hashlib
import json
import uuid

from fastapi.testclient import TestClient

from app.main import app

USER_A = {"X-CMX-Dev-User": "custody-a@example.test"}
USER_B = {"X-CMX-Dev-User": "custody-b@example.test"}


def create_case_source_evidence(client: TestClient) -> tuple[dict, dict, dict]:
    case_response = client.post(
        "/api/cases",
        headers=USER_A,
        json={
            "case_type": "evidence_review",
            "title": f"Custody test {uuid.uuid4()}",
            "authorization_basis": "Authorized evidence custody regression",
        },
    )
    assert case_response.status_code == 201, case_response.text
    case = case_response.json()

    source_response = client.post(
        f"/api/cases/{case['id']}/sources",
        headers=USER_A,
        json={
            "label": "Original local acquisition",
            "source_type": "local_file",
            "url": "",
            "notes": "Registered by the automated custody test",
        },
    )
    assert source_response.status_code == 201, source_response.text
    source = source_response.json()

    evidence_response = client.post(
        f"/api/cases/{case['id']}/evidence",
        headers=USER_A,
        json={
            "source_id": source["id"],
            "filename": "sample-evidence.txt",
            "media_type": "text/plain",
            "size_bytes": 12,
            "sha256": "a" * 64,
            "storage_key": "",
            "metadata_json": {"parser": "local-hash-only", "bytes_uploaded": False},
        },
    )
    assert evidence_response.status_code == 201, evidence_response.text
    return case, source, evidence_response.json()


def canonical_manifest_digest(payload: dict) -> str:
    canonical = dict(payload)
    canonical.pop("manifest_sha256", None)
    canonical.pop("generated_at", None)
    encoded = json.dumps(
        canonical,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def test_custody_events_and_manifest_are_owner_scoped_and_deterministic() -> None:
    with TestClient(app) as client:
        case, source, evidence = create_case_source_evidence(client)
        base = f"/api/cases/{case['id']}/evidence/{evidence['id']}"

        missing_hash = client.post(
            f"{base}/custody",
            headers=USER_A,
            json={
                "event_type": "verified",
                "custodian": "Evidence operator",
            },
        )
        assert missing_hash.status_code == 422

        verified = client.post(
            f"{base}/custody",
            headers=USER_A,
            json={
                "event_type": "verified",
                "custodian": "Evidence operator",
                "location": "Controlled evidence volume",
                "note": "Hash checked before analysis",
                "observed_sha256": "A" * 64,
                "occurred_at": "2026-08-04T18:00:00Z",
            },
        )
        assert verified.status_code == 201, verified.text
        verified_payload = verified.json()
        assert verified_payload["integrity_state"] == "match"
        assert verified_payload["observed_sha256"] == "a" * 64
        assert verified_payload["recorded_by"] == "custody-a@example.test"

        mismatch = client.post(
            f"{base}/custody",
            headers=USER_A,
            json={
                "event_type": "transferred",
                "custodian": "Secondary review queue",
                "location": "Read-only review mount",
                "note": "Unexpected hash recorded and preserved for escalation",
                "observed_sha256": "b" * 64,
                "occurred_at": "2026-08-04T18:05:00Z",
            },
        )
        assert mismatch.status_code == 201, mismatch.text
        assert mismatch.json()["integrity_state"] == "mismatch"

        event_list = client.get(f"{base}/custody", headers=USER_A)
        assert event_list.status_code == 200, event_list.text
        assert [item["event_type"] for item in event_list.json()] == ["verified", "transferred"]

        first_manifest_response = client.get(f"{base}/manifest", headers=USER_A)
        second_manifest_response = client.get(f"{base}/manifest", headers=USER_A)
        assert first_manifest_response.status_code == 200, first_manifest_response.text
        assert second_manifest_response.status_code == 200, second_manifest_response.text
        first_manifest = first_manifest_response.json()
        second_manifest = second_manifest_response.json()

        assert first_manifest["schema"] == "cmx-evidence-manifest-v1"
        assert first_manifest["case_id"] == case["id"]
        assert first_manifest["evidence"]["id"] == evidence["id"]
        assert first_manifest["evidence"]["sha256"] == "a" * 64
        assert first_manifest["source"]["id"] == source["id"]
        assert first_manifest["source"]["label"] == "Original local acquisition"
        assert len(first_manifest["custody_events"]) == 2
        assert first_manifest["manifest_sha256"] == canonical_manifest_digest(first_manifest)
        assert second_manifest["manifest_sha256"] == first_manifest["manifest_sha256"]

        other_manifest = client.get(f"{base}/manifest", headers=USER_B)
        other_events = client.get(f"{base}/custody", headers=USER_B)
        assert other_manifest.status_code == 404
        assert other_events.status_code == 404

        immutable = client.put(
            f"{base}/custody/{verified_payload['id']}",
            headers=USER_A,
            json={"note": "Attempted edit"},
        )
        assert immutable.status_code == 405

        audit_response = client.get(f"/api/cases/{case['id']}/audit", headers=USER_A)
        assert audit_response.status_code == 200, audit_response.text
        custody_audit = [
            event for event in audit_response.json()
            if event["action"] == "evidence.custody_recorded"
        ]
        assert len(custody_audit) == 2
        serialized_details = json.dumps(custody_audit)
        assert "Hash checked before analysis" not in serialized_details
        assert "Secondary review queue" not in serialized_details
        assert "bbbbbbbbbbbbbbbb" not in serialized_details
        assert {event["details"]["integrity_state"] for event in custody_audit} == {"match", "mismatch"}
