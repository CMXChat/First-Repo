# Phase 7 Validation: Evidence Manifests and Custody Notes

Validated synchronized implementation head: `c4c23f62c36dceb2936f235306a6d8075068547e`.

This implementation head was zero commits behind `main` when validated.

## Outcome

Phase 7 adds an owner-scoped, append-only evidence custody ledger and a deterministic evidence manifest to the existing Cases Evidence workspace.

The implementation extends the existing evidence registration model. It does not create a competing evidence store and does not upload source file bytes.

The custody workflow records operator assertions about handling, storage, access, transfer, verification, release, return, disposal, or contextual notes. These records do not independently prove source truth, identity, ownership, authorization outside the selected case, or uninterrupted physical control.

Deep metadata extraction and OCR remain deferred to a later isolated-worker phase.

## Persistent custody model

Alembic revision `20260804_0002` creates `evidence_custody_events` with:

- owner-scoped case ID
- evidence ID
- authenticated recording subject
- event type
- custodian
- optional physical or logical location
- optional custody note
- optional observed SHA-256
- server-calculated integrity state
- operator-supplied occurrence time
- immutable creation time

Indexes support:

- owner and case lookup
- evidence chronology
- event-type review

The table uses cascade deletion with its owning case and evidence item. No update or delete route exists for individual custody events.

## Protected API

The platform adds:

- `POST /api/cases/{case_id}/evidence/{evidence_id}/custody`
- `GET /api/cases/{case_id}/evidence/{evidence_id}/custody`
- `GET /api/cases/{case_id}/evidence/{evidence_id}/manifest`

Every route requires the authenticated owner of the case and evidence item.

An unmatched owner receives a not-found response before evidence or custody details leave the database.

### Custody event types

The first bounded event vocabulary is:

- `received`
- `transferred`
- `stored`
- `accessed`
- `verified`
- `released`
- `returned`
- `disposed`
- `note`

A `verified` event requires a complete SHA-256 value.

Other custody events may optionally include an observed SHA-256 when a hash was checked during that event.

## Server-calculated integrity states

The client cannot choose an integrity result.

The server compares the normalized observed SHA-256 with the registered evidence SHA-256 and stores one of:

- `not_checked`
- `match`
- `mismatch`

Uppercase hexadecimal input is normalized to lowercase before persistence and comparison.

A mismatch remains visible in the ledger. It is not converted into an automatic conclusion about tampering, compromise, malicious activity, operator conduct, or the truth of the evidence.

## Deterministic evidence manifest

The manifest schema is:

`cmx-evidence-manifest-v1`

The manifest includes:

- case ID
- evidence registration ID
- filename
- media type
- size in bytes
- registered SHA-256
- storage reference
- evidence metadata
- capture and registration times
- linked source provenance when present
- complete owner-scoped custody chronology
- interpretation limitation

The server builds a canonical JSON payload using:

- UTF-8 encoding
- sorted object keys
- compact deterministic separators
- normalized UTC timestamps
- stable custody ordering by occurrence time, creation time, and record ID

`manifest_sha256` is the SHA-256 digest of that canonical payload.

`generated_at` is excluded from the digest so repeated reads of unchanged evidence and custody records produce the same manifest hash.

The manifest hash protects the exported metadata structure. It does not hash or archive the underlying evidence bytes beyond the evidence SHA-256 already registered by the operator workflow.

## Source provenance

When an evidence item is linked to a source in the same owner-scoped case, the manifest includes:

- source ID
- label
- source type
- URL reference
- access time

A third-party source URL remains a provenance reference. The custody client does not fetch, archive, screenshot, parse, or copy the referenced page.

## Audit behavior

Creating a custody event records `evidence.custody_recorded` in the case audit stream.

Audit details contain only bounded operational facts:

- evidence ID
- event type
- integrity state
- whether a hash was checked
- whether a location was provided
- whether a note was provided

The audit event does not copy:

- custody notes
- custodian text
- location text
- observed hashes
- evidence contents

## Cases Evidence workspace

The protected Cases Evidence view now provides:

- evidence selector
- manifest SHA-256
- registered evidence SHA-256
- custody event count
- latest checked integrity state
- append-only custody form
- required hash validation for verification events
- chronological custody ledger
- safe text-only rendering
- deterministic manifest JSON preview
- explicit manifest JSON download
- static-mode write denial
- stale case and evidence response rejection
- case and evidence pinning during each request

The workspace uses same-origin API routes only.

It does not store evidence, custody, or manifest contents in local storage.

## Privacy issue found during synchronization

The synchronized `/doc` Personal OS route was registered as gated and used the black-prompt gate, but the privacy workflow did not recognize that gate type and the page lacked the repository's static no-store hint.

Fixed by:

- registering `/doc/` as an approved black-prompt custom gate in the privacy audit
- verifying its declared gate ID and exact gate assets
- adding a static `Cache-Control: no-store` meta hint
- retaining FastAPI's live `Cache-Control: no-store` response header for all non-asset routes

No Personal OS document content was changed by that privacy correction.

## Regression coverage

Backend coverage verifies:

- required SHA-256 for `verified` events
- uppercase hash normalization
- server-calculated match and mismatch states
- immutable custody events
- unchanged records after an attempted undefined update
- owner-scoped event and manifest reads
- linked source provenance
- deterministic manifest hashes across repeated reads
- independent recomputation of the canonical manifest digest
- audit-detail redaction
- case and evidence not-found behavior for another owner

Browser coverage verifies on desktop and mobile:

- exact selected case and evidence
- custody workspace visibility
- initial deterministic manifest load
- matching verification event
- mismatching transfer event
- visible integrity-state changes
- safe ledger rendering
- manifest download filename
- downloaded schema, evidence ID, registered hash, event count, integrity states, and manifest hash

Source policy verifies:

- required custody files
- JavaScript syntax
- no unsafe HTML sinks
- no local evidence persistence
- no direct external browser request
- same-origin custody API markers
- deterministic service markers
- mandatory desktop and mobile browser inclusion

## Workflow result

All eleven workflow groups passed on synchronized implementation head `c4c23f62c36dceb2936f235306a6d8075068547e`:

- PostgreSQL integration
- Hardened API entry point
- CMX Terminal Theme Guard
- CMX Static Validation
- CMX Navigation Link Guard
- Case lifecycle source policy
- Operations scripts
- OSINT platform checks
- CMX Privacy Audit
- CMX Secret Scan
- Final platform entry point

The final platform workflow passed the complete desktop and complete mobile Chromium projects.

PostgreSQL 18 validation applied the custody migration, ran the API smoke test, downgraded the migration chain, and reapplied it successfully.

## Release state

This validation does not approve production deployment.

PR #28 remains draft. Production remains unchanged.

Protected staging must still verify:

- Cloudflare Access identity enforcement
- denial of unmatched identities
- Tunnel-only origin reachability
- no direct application or PostgreSQL exposure
- live no-store and other security headers
- structured logs without evidence or custody contents
- evidence manifest download through the protected hostname
- custody writes under a real Access subject
- PostgreSQL backup after the second migration
- temporary restore validation
- application rollback

## Next bounded slice

The next implementation slice should add isolated deep metadata and OCR workers.

That phase must preserve:

- explicit operator authorization and upload action
- strict file-size and media-type limits
- isolated execution without network access
- CPU, memory, process, and wall-clock limits
- temporary encrypted or memory-backed working storage
- source-byte deletion after the bounded job
- SHA-256 continuity with the evidence registration
- parser and OCR provenance
- explicit save into the selected case
- no automatic confidence elevation
- no automatic identity or attribution conclusions
- desktop, mobile, backend, container, migration, privacy, and protected-staging regressions
