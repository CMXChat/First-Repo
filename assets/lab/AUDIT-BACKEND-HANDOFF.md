# Check In Lab Phase 7 · Audit / Versioning Backend Handoff

This document describes the intended production replacement for the browser-local Phase 7 audit, revision, incident-snapshot, replay, and configuration-health layer.

## Non-negotiable production rules

- The browser is never authoritative for audit events, actors, timestamps, revision numbers, incident state, execution state, or integrity hashes.
- Definition history is append-only. Editing creates a new revision.
- Restoring an older definition creates another new revision copied from the historical payload. It does not delete or rewind later revisions.
- Incident snapshots are immutable after creation. Corrections are appended as new events.
- Operational deletion should normally archive/tombstone a definition while preserving historical references.
- An incident snapshots the exact versions it starts with. Future definition edits do not change an open or archived incident.
- Use server-authoritative time and cryptographic hashes over canonical payloads.
- Execution attempts and decision evaluations must be independently auditable.

## Suggested PostgreSQL tables

### `checkin_definition_versions`

Stores immutable versions for versioned operational objects.

Suggested fields:

- `id UUID PK`
- `switch_id UUID`
- `object_type TEXT`
- `object_id UUID/TEXT`
- `version_number INTEGER`
- `status TEXT` such as `draft`, `published`, `archived`
- `payload JSONB`
- `payload_sha256 TEXT`
- `created_at TIMESTAMPTZ`
- `created_by_user_id UUID NULL`
- `source TEXT`
- `reason TEXT NULL`
- `restored_from_version_id UUID NULL`
- unique `(switch_id, object_type, object_id, version_number)`

Initially version at least:

- switch policy
- action definitions
- decision policies
- document metadata
- digital asset metadata
- critical organization metadata where operational references depend on it

### `checkin_audit_events`

Append-only global audit ledger.

Suggested fields:

- `id UUID PK`
- `switch_id UUID`
- `event_type TEXT`
- `category TEXT`
- `severity TEXT`
- `occurred_at TIMESTAMPTZ`
- `actor_user_id UUID NULL`
- `actor_type TEXT`
- `source TEXT`
- `object_type TEXT NULL`
- `object_id TEXT NULL`
- `definition_version_id UUID NULL`
- `incident_id UUID NULL`
- `summary TEXT`
- `metadata JSONB`
- `previous_event_hash TEXT NULL` if hash chaining is later desired
- `event_hash TEXT`

Audit events should cover definition edits, publication, archive, restores, policy changes, access-sensitive events, incident lifecycle changes, approvals, acknowledgements, routing, retries, and execution outcomes.

### `checkin_incidents`

One row per real switch incident/cycle.

Suggested fields:

- `id UUID PK`
- `switch_id UUID`
- `opened_at TIMESTAMPTZ`
- `deadline_at TIMESTAMPTZ`
- `final_trigger_at TIMESTAMPTZ`
- `closed_at TIMESTAMPTZ NULL`
- `state TEXT`
- `policy_version_id UUID`
- `snapshot_sha256 TEXT`
- `opened_by_event_id UUID NULL`
- `closed_reason TEXT NULL`

### `checkin_incident_definition_snapshots`

References the exact definition versions used by an incident.

Suggested fields:

- `incident_id UUID`
- `object_type TEXT`
- `object_id TEXT`
- `definition_version_id UUID`
- `resolved_snapshot JSONB NULL`
- `snapshot_sha256 TEXT`
- primary key `(incident_id, object_type, object_id)`

Snapshot at incident creation:

- switch policy version
- every enabled action version
- decision-policy version for every enabled action
- referenced document versions
- referenced digital asset versions
- stable record references needed to explain the execution plan

Do not silently replace these version references after incident creation.

### `checkin_incident_events`

Append-only incident-specific event stream.

Suggested fields:

- `id UUID PK`
- `incident_id UUID`
- `event_type TEXT`
- `occurred_at TIMESTAMPTZ`
- `relative_offset_ms BIGINT`
- `action_id TEXT NULL`
- `source TEXT`
- `severity TEXT`
- `summary TEXT`
- `metadata JSONB`
- `event_hash TEXT`

Examples:

- `INCIDENT_OPENED`
- `DEADLINE_REACHED`
- `GRACE_EXPIRED`
- `ACTION_ELIGIBLE`
- `ACTION_BLOCKED`
- `APPROVAL_REQUIRED`
- `APPROVAL_GRANTED`
- `APPROVAL_DENIED`
- `EXECUTION_STARTED`
- `EXECUTION_SUCCEEDED`
- `EXECUTION_FAILED`
- `RETRY_QUEUED`
- `ACK_REQUIRED`
- `ACKNOWLEDGED`
- `ACK_TIMEOUT`
- `ROUTE_ACTIVATED`
- `BRANCH_CANCELLED`
- `INCIDENT_CLOSED`

### `checkin_execution_attempts`

Each provider/action attempt should be a durable row.

Suggested fields:

- `id UUID PK`
- `incident_id UUID`
- `action_id TEXT`
- `action_version_id UUID`
- `attempt_number INTEGER`
- `started_at TIMESTAMPTZ`
- `finished_at TIMESTAMPTZ NULL`
- `status TEXT`
- `provider TEXT NULL`
- `idempotency_key TEXT`
- `input_snapshot JSONB`
- `input_sha256 TEXT`
- `result_snapshot JSONB NULL`
- `error_code TEXT NULL`
- `error_detail TEXT NULL`

### `checkin_condition_evaluations`

If not already modeled separately by Phase 6, persist every important typed-rule evaluation.

Suggested fields:

- `id UUID PK`
- `incident_id UUID`
- `action_id TEXT`
- `decision_version_id UUID`
- `condition_id TEXT`
- `evaluated_at TIMESTAMPTZ`
- `input_snapshot JSONB`
- `result BOOLEAN`
- `reason TEXT`

### `checkin_change_sets`

Optional publication/review layer for multiple related definition changes.

Suggested fields:

- `id UUID PK`
- `switch_id UUID`
- `status TEXT` (`draft`, `review`, `published`, `rejected`)
- `created_by_user_id UUID`
- `created_at TIMESTAMPTZ`
- `published_at TIMESTAMPTZ NULL`
- `reason TEXT NULL`

A future UI can group policy/action/decision edits into one reviewed change set before publication.

## API direction

Suggested authenticated operator endpoints:

```text
GET  /checkin/operator/audit
GET  /checkin/operator/incidents
GET  /checkin/operator/incidents/{incident_id}
GET  /checkin/operator/incidents/{incident_id}/events
GET  /checkin/operator/incidents/{incident_id}/snapshot
GET  /checkin/operator/versions?object_type=&object_id=
GET  /checkin/operator/versions/{version_id}
GET  /checkin/operator/versions/compare?from=&to=
POST /checkin/operator/versions/{version_id}/restore
GET  /checkin/operator/configuration-health
```

`restore` creates a new current revision and should return the new version ID. It never makes the historical version row mutable.

## Draft / published model

A production-quality system should separate editing from the active contingency plan.

Recommended lifecycle:

```text
DRAFT → REVIEW → PUBLISHED → ARCHIVED
```

An incident should reference only the currently published versions that were active when it opened.

## Changed-since-last-simulation / test assurance

The Phase 7 Lab UI compares the current version references with the latest captured incident snapshot.

Production should calculate configuration health server-side:

- current published version IDs
- latest completed full-test incident version IDs
- definitions changed since that test
- enabled actions never tested
- success/failure/acknowledgement/fallback branches tested per action
- drafts pending publication
- definitions with review dates or validation warnings

Do not reduce this to a cosmetic score. Return the actual reasons and changed version IDs.

## Incident replay

Replay is read-only presentation over immutable event data.

The backend returns ordered incident events and snapshot references. The browser may scrub through the event sequence, but must not alter historical state.

## Integrity

The Lab uses a lightweight non-cryptographic fingerprint only for visual prototyping.

Production recommendation:

1. canonicalize the payload deterministically
2. hash with SHA-256 or stronger approved primitive
3. store the hash with each definition version and incident snapshot
4. optionally hash-chain audit/incident events if tamper-evidence is a requirement
5. sign/export reports only through a server-controlled process

No blockchain is needed.

## Authorization

Audit and incident data can reveal sensitive operational structure even when secrets are absent.

Recommended controls:

- operator-only access by default
- separate permissions for audit read, incident read, restore/publish, approval, and export
- no credential payloads in audit metadata
- redact provider secrets/tokens before event persistence
- audit access to highly sensitive incident/document history where appropriate

## Migration from Lab

Current Lab keys are temporary adapters:

- `cmx-lab-audit-v1`
- `cmx-lab-versions-v1`
- `cmx-lab-incidents-v1`

When FastAPI/PostgreSQL exists, preserve the UI concepts but replace storage access with API adapters. The browser-local ledger must not become the production source of truth.
