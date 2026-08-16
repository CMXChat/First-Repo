# Check In Lab Backend Handoff

This file documents the intended backend boundary for `/lab` while the current UI is still a safe browser-only prototype.

## Current Lab rule

The Lab must never call the production Check In API. People, organizations, documents, and digital assets use synthetic data stored in `localStorage`. File selection in the document editor reads only the browser-provided file name, MIME type, and size. The file bytes are discarded.

## Production data model

Use PostgreSQL as the source of truth for metadata and relationships. A practical first schema:

- `checkin_people`
- `checkin_organizations`
- `checkin_documents`
- `checkin_digital_assets`
- `checkin_record_links`
- `checkin_record_activity`
- `checkin_document_versions`

`checkin_record_links` should be generic enough to link a source entity to a target entity. Examples:

- document → person
- document → organization
- document → digital asset
- action → person
- action → organization
- action → document
- action → digital asset

Do not duplicate relationship columns for every future entity type if a typed join model can safely support the graph.

## Documents

PostgreSQL should store document metadata only:

- id
- title
- category
- status
- sensitivity
- review_at
- current_version_id
- created_at
- updated_at
- created_by / updated_by

File bytes belong in private durable object storage. A version record can store:

- document_id
- object_key
- original_filename
- MIME type
- byte size
- checksum
- storage status
- uploaded_at
- uploaded_by

The backend should calculate checksums and timestamps. Do not trust browser-supplied integrity values.

Recommended flow:

1. Client requests an authenticated upload intent.
2. Backend authorizes the operator and creates a pending version.
3. File is uploaded to private object storage.
4. Backend verifies storage completion, size, MIME policy, and checksum.
5. Backend marks the version available.
6. Activity event is appended.

## Digital assets

Digital assets are inventory metadata for domains, websites, cloud accounts, hosting, repositories, social accounts, devices, service accounts, and future digital property.

Never store:

- passwords
- API tokens
- private keys
- recovery codes
- raw session cookies
- MFA seeds

Use a `secret_ref` only. That reference should point to a dedicated secret-management layer with its own access policy.

Useful fields:

- id
- name
- asset_type
- identifier
- provider
- environment
- status
- sensitivity
- owner_person_id
- organization_id
- secret_ref
- notes
- created_at
- updated_at

## API shape

Suggested authenticated operator endpoints:

```text
GET    /api/v1/checkin/operator/inventory?kind=document|asset
POST   /api/v1/checkin/operator/documents
GET    /api/v1/checkin/operator/documents/{document_id}
PATCH  /api/v1/checkin/operator/documents/{document_id}
POST   /api/v1/checkin/operator/documents/{document_id}/file
POST   /api/v1/checkin/operator/assets
GET    /api/v1/checkin/operator/assets/{asset_id}
PATCH  /api/v1/checkin/operator/assets/{asset_id}
POST   /api/v1/checkin/operator/inventory/{kind}/{id}/links
DELETE /api/v1/checkin/operator/inventory/{kind}/{id}/links/{link_id}
GET    /api/v1/checkin/operator/inventory/{kind}/{id}/activity
```

Every write should require the existing private operator session and CSRF protection.

## Audit behavior

The server appends audit/activity events. The browser may request a mutation, but it should not submit authoritative actor names, timestamps, checksums, verification states, or delivery outcomes.

At minimum record:

- actor/operator id
- action
- entity type
- entity id
- timestamp
- changed field summary
- request/correlation id
- previous version where appropriate

## Action Builder integration

Phase 4 should select these records by stable IDs. An action can reference people, organizations, documents, and digital assets through the relationship table. The action configuration should store references, not copied contact/account metadata, so edits to a record can be reasoned about centrally.

Before an action executes, the backend should snapshot the exact resolved targets/inputs into the execution record for auditability.

## Lab-to-production migration

Keep the Lab UI contract intentionally close to the future API response shape, but do not promote localStorage data into production automatically. When backend endpoints exist, replace the storage adapter and preserve the presentation layer. Synthetic Lab records should remain isolated from real records.
