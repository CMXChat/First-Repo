# CMX Operator UX Roadmap

## Completed slice 1: OSINT active-case workflow

The first case-centered operator pass is implemented on `/osint`:

- authenticated same-origin DNS gateway is preferred
- direct Google Public DNS is limited to a labeled static fallback
- stale DNS requests are cancelled and cannot replace a newer entity
- DNS results render progressively with resolver provenance
- active protected identity and local-only mode are visible
- an operator can select an active persistent case
- current OSINT sessions save atomically through the case import transaction
- domain snapshots cannot be saved while DNS collection is incomplete
- `/cases?case=<id>` opens the exact selected case
- desktop and mobile regressions cover the complete loop

## Completed slice 2: Cases information architecture

The persistent `/cases` workspace now uses eight case-level views:

1. Overview
2. Timeline
3. Entities
4. Sources
5. Evidence
6. Relationships
7. Notes
8. Audit

The current case remains selected while moving between views. Case contents are not persisted in browser storage by the operator layer.

### Overview

Implemented:

- status and urgency
- authorization basis and summary
- retention review date
- record totals
- recent chronological activity
- review prompts for weak confidence, duplicates, missing sources, missing notes, retention review and registration-only evidence
- import and export controls

### Timeline

Implemented a single chronological view across:

- observations
- sources
- queries
- evidence registrations
- relationships
- analyst notes
- audit events

Each row states its record type and available time/context. Timeline ordering is display only and does not imply causation.

### Entity workspace

Implemented:

- entity-type and confidence filters
- normalized-value search
- duplicate review
- direct links into supported CMX tools
- verified, inferred and unverified display states
- relationship creation between entities in the same case
- readable relationship endpoint labels and analyst notes

Explicit conflicting and ruled-out state editing remains a later record-editing improvement. Existing explicit analyst-state values are displayed conservatively when present.

### Mobile and density

Implemented:

- stacked case and detail sections
- wrapped case-view controls
- stable import and relationship controls
- non-sticky case navigation on narrow screens
- comfortable and compact density modes
- separate lifecycle workspace for destructive restore and purge actions
- explicit confirmation for archive, restore and purge

See `docs/PHASE_2_CASES_VALIDATION.md` for the validated implementation head and detailed test scope.

## Completed slice 3: Active-case context across research tools

The shared protected active-case workflow now covers:

1. OSINT
2. Phone
3. Search
4. Metadata
5. Missing Person

Implemented across the five tools:

- authenticated or local-only operating mode
- persistent case selection through the requested case parameter or session continuity
- explicit save action with no automatic research persistence
- one atomic case import transaction per save
- schema validation before writing
- unsaved, saving, saved and failed state messages
- direct return to the selected persistent case
- save disablement after success until the tool state changes
- desktop and mobile browser regressions

### Schema handling

The shared client supports:

- `cmx-osint-session-v1`
- `cmx-phone-session-v1`
- `cmx-search-session-v1`
- `cmx-metadata-session-v1`
- `cmx-missing-case-v1`

Phone, OSINT and Missing Person read their current rendered schema JSON directly. Search and Metadata reuse their exact existing export payloads while suppressing the duplicate file download during case saving.

Generated but unsaved Search queries are excluded. Metadata case imports register completed SHA-256 evidence records without uploading the original file bytes.

See `docs/PHASE_3_ACTIVE_CASE_TOOLS_VALIDATION.md` for the validated implementation head and detailed test scope.

## Completed slice 4: Direct source and finding capture

The shared active-case interface now includes a responsive capture drawer on all five research tools.

An operator can write one deliberate record at a time without exporting and importing a complete session:

1. Source registration
2. Finding or observation capture
3. Query result provenance

### Source registration

Implemented fields:

- source label
- HTTP or HTTPS URL
- source type
- access time
- source notes

Entered URLs remain provenance references. The browser does not request, archive, screenshot, parse, or copy the page.

### Finding capture

Implemented fields:

- finding type
- observed value
- optional linked entity
- optional linked source
- confidence
- observed time
- analyst note

The operator must enter the observation explicitly. The interface does not generate conclusions or raise confidence automatically.

### Query provenance

Implemented fields:

- provider
- exact query text
- result URL
- purpose
- optional linked entity
- execution time

Saving a result URL records provenance only and does not fetch or preserve the result page.

### Duplicate and case safeguards

Implemented:

- fresh selected-case detail before each write
- exact duplicate preflight for sources, findings and queries
- visible duplicate warning
- disabled save until explicit operator acknowledgement
- complete field disclosure before write
- unsaved field clearing when the active case changes
- one owner-scoped API transaction per individual record
- protected-mode and selected-case requirements
- desktop and mobile browser regressions
- explicit test coverage proving entered third-party URLs are never requested

See `docs/PHASE_4_DIRECT_CAPTURE_VALIDATION.md` for the validated implementation head and detailed test scope.

## Next slice: Server-side domain and network enrichment

Add bounded server-side adapters that collect structured public infrastructure data without placing provider credentials or unrestricted network access in the browser.

The first pass should support:

- RDAP for domains, IP addresses and autonomous system numbers
- HTTP response status and selected security headers
- TLS certificate subject, issuer, validity and fingerprint summaries
- Certificate Transparency lookups with provider provenance
- bounded timeouts, response-size limits and allowlisted protocols
- cache state, collection time and provider identity on every result
- rate limits and cancellation-safe browser behavior
- explicit operator save into the active case
- no automatic conversion of enrichment output into a verified conclusion
- desktop, mobile, backend and PostgreSQL regressions

BGP and RPKI views should follow after the RDAP, HTTP, TLS and Certificate Transparency adapter boundary is stable.

## Later slices

1. Add BGP and RPKI adapters and restrained network relationship views.
2. Add isolated deep metadata and OCR workers.
3. Add evidence manifests, screenshots, hashes and custody notes.
4. Add explicit analyst-state editing for verified, inferred, conflicting, ruled-out and unverified records.
5. Add restrained relationship comparison views.
6. Add a local inline SVG icon set and compact first-use header treatment.
7. Add persistent banners for disconnected, partial, unsaved and failed platform states.

## Safety and release gate

Every slice must preserve:

- Cloudflare Access identity enforcement
- owner-scoped records
- explicit save actions
- no automatic browser persistence of research contents
- safe text rendering
- provider disclosure
- bounded imports and uploads
- desktop and mobile browser regressions
- protected staging before production promotion
