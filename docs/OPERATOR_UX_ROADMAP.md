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

### Validation

The completed Cases slice passes:

- strict source and syntax checks
- unsafe-rendering and browser-persistence checks
- backend and PostgreSQL integration tests
- full Chromium desktop regressions
- full Chromium mobile regressions

See `docs/PHASE_2_CASES_VALIDATION.md` for the validated implementation head and detailed test scope.

## Next slice: Active-case context across remaining tools

Apply the protected active-case workflow to:

1. Phone
2. Search
3. Metadata
4. Missing Person

Each tool must:

- show authenticated or local-only operating mode
- allow selection of an existing persistent case
- never save research automatically
- save through one atomic case transaction where a supported CMX import schema exists
- block incomplete or invalid snapshots
- show saved, unsaved, partial and failed states clearly
- return directly to the selected case
- preserve tool-specific provider and confidence disclosures
- pass desktop and mobile browser regressions

## Later slices

1. Add direct capture of sources and external findings.
2. Add server-side RDAP, ASN, BGP, RPKI, TLS, Certificate Transparency and HTTP adapters.
3. Add isolated deep metadata and OCR workers.
4. Add evidence manifests, screenshots, hashes and custody notes.
5. Add explicit analyst-state editing for verified, inferred, conflicting, ruled-out and unverified records.
6. Add restrained relationship comparison views.
7. Add a local inline SVG icon set and compact first-use header treatment.
8. Add persistent banners for disconnected, partial, unsaved and failed platform states.

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
