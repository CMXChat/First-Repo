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

## Completed slice 5: Bounded infrastructure enrichment

The protected OSINT workspace now provides same-origin server adapters for:

1. RDAP
2. HTTP response headers
3. TLS certificate metadata
4. Certificate Transparency

### RDAP

Implemented:

- domain, public IP, and ASN targets
- IANA bootstrap provider selection
- HTTPS provider boundary
- redirect refusal
- bounded JSON collection
- normalized registration, network, autonomous-system, event, entity, nameserver, secure-DNS, status, and notice fields
- provider, source URL, collection time, requester, and cache disclosure

### HTTP response inspection

Implemented:

- HTTP and HTTPS URLs only
- standard ports only
- embedded-credential and fragment rejection
- public-address resolution and validation
- pinned resolved-address connection
- validated Host header and TLS SNI preservation
- one `HEAD` request
- bounded selected-header reading
- no response-body read
- no redirect following
- cookie exclusion

### TLS certificate inspection

Implemented:

- public domain or public IP targets
- port 443 only
- handshake without an HTTP request
- protocol, cipher, ALPN, verification state, verification error, SHA-256 fingerprint, serial number, subject, issuer, validity, and bounded Subject Alternative Names
- explicit unverified state when certificate validation fails

### Certificate Transparency

Implemented:

- fixed server-side `crt.sh` provider
- normalized public domains
- optional subdomain inclusion
- bounded provider response and record count
- certificate-record deduplication
- provider provenance and collection time
- explicit limitation that certificate issuance does not prove current ownership or service availability

### Network and SSRF safeguards

Implemented:

- rejection of private, loopback, link-local, multicast, reserved, unspecified, and otherwise non-global IP addresses
- pre-resolution and validation of every candidate target address
- connection to a pre-resolved permitted address
- no automatic target redirects
- bounded request time, response bytes, HTTP header bytes, cache lifetime, and normalized records
- same-origin browser API use only
- no general-purpose proxy or browser provider fetch path
- logging rules that exclude query strings, targets, and provider payloads

### Operator save and UX safeguards

Implemented:

- current-entity target prefill
- explicit adapter actions
- pending, completed, cancelled, and failed states
- request cancellation and stale-result rejection
- normalized provenance and JSON display
- explicit save-field disclosure
- `unrated` confidence by default
- fresh selected-case duplicate preflight before write
- explicit acknowledgement before an intentional duplicate
- one owner-scoped observation transaction per saved result
- provider output never becomes an automatic identity, ownership, causation, reputation, or current-service conclusion
- pointer-transparent decorative CMX status chrome so fixed UI cannot block page controls
- desktop, mobile, backend, PostgreSQL, privacy, secret, source-policy, container, and migration regressions

See `docs/PHASE_5_ENRICHMENT_VALIDATION.md` for the validated implementation head and detailed network boundary.

## Next slice: BGP and RPKI context

Extend the protected infrastructure boundary with routing context while preserving the current conservative interpretation model.

The first pass should support:

- prefix-to-origin ASN lookup
- ASN-to-announced-prefix lookup
- BGP route visibility from a fixed, reviewed public provider
- RPKI Route Origin Authorization state
- valid, invalid, not-found, and unavailable result states
- provider, source URL, collection time, cache state, and query target disclosure
- bounded timeouts, response bytes, and record counts
- public IP, prefix, and ASN validation
- no arbitrary URL input for routing providers
- explicit operator save into the active case with `unrated` confidence
- restrained relationship suggestions that require operator review before creation
- desktop, mobile, backend, PostgreSQL, privacy, and source-policy regressions

The interface must separate observed routing data from conclusions about ownership, control, compromise, attribution, or malicious activity.

## Later slices

1. Add isolated deep metadata and OCR workers.
2. Add evidence manifests, screenshots, hashes and custody notes.
3. Add explicit analyst-state editing for verified, inferred, conflicting, ruled-out and unverified records.
4. Add restrained relationship comparison views.
5. Add a local inline SVG icon set and compact first-use header treatment.
6. Add persistent banners for disconnected, partial, unsaved and failed platform states.

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
