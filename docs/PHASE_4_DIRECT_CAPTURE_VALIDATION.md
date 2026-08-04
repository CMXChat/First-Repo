# Phase 4 Validation: Direct Source and Finding Capture

Validated implementation head before branch synchronization: `dd45e46be4cd093ad5e6812e67ac983ac9df4b16`.

## Completed workflow

The shared active-case interface now provides a direct capture drawer on:

- `/osint`
- `/phone`
- `/search`
- `/metadata`
- `/missing`

An operator can write one deliberate record to the selected persistent case without exporting and importing a complete tool session.

The drawer supports:

1. Source registration
2. Finding or observation capture
3. Query result provenance

No record is written automatically. Each save uses one existing owner-scoped FastAPI record endpoint and one database transaction.

## Source registration

The source form supports:

- source label
- HTTP or HTTPS URL
- source type
- access time
- source notes

The entered URL is stored as provenance only. The browser does not request, archive, screenshot, parse, or copy the third-party page.

## Finding capture

The finding form supports:

- finding type
- observed value
- optional linked entity
- optional linked source
- confidence
- observed time
- analyst note

The operator must state the observed value explicitly. The interface does not generate a conclusion, raise confidence automatically, or convert an external page into a finding.

## Query provenance

The query form supports:

- provider
- exact query text
- result URL
- purpose
- optional linked entity
- execution time

The result URL is a provenance reference. Saving it does not fetch or preserve the result page.

## Duplicate review

Before each write, the browser reloads the latest selected-case detail and performs an exact duplicate preflight.

The current preflight checks:

- sources by URL, or by label and type when no URL is present
- findings by type, observed value, linked entity and linked source
- queries by provider, query text, result URL and linked entity

When a possible duplicate is found:

- the existing-record warning is visible
- the save action is disabled
- the operator must explicitly confirm that another record is intentional

This is an operator preflight. It does not claim that every semantically similar record is a duplicate or replace server-side data-quality controls.

## Field disclosure and case isolation

Before save, the drawer shows the exact fields that will enter the case. Empty optional fields remain empty.

If the active case changes:

- unsaved capture fields are cleared
- cached case references are discarded
- the new case detail must load before duplicate review and write

Only the active case identifier remains in session storage. Source, finding and query contents are not stored in browser persistence.

## Protected and local-only modes

Direct capture is available only when:

- the FastAPI identity endpoint confirms protected mode
- an owned persistent case is selected

When the backend is unavailable or no case is selected, the capture control is disabled. Existing local tool analysis and explicit file export remain separate.

## Safe browser implementation

The shared client:

- renders dynamic values through text nodes
- contains no dynamic HTML insertion sink
- contains no local-storage research persistence
- sends writes only to same-origin case-record endpoints
- does not contain a third-party fetch path
- keeps each source, finding or query write explicit and independent

## Browser validation

Desktop and mobile Chromium coverage creates an isolated persistent case and verifies:

- source creation with URL, type and notes
- exact duplicate detection before a second source write
- save disablement until duplicate review is acknowledged
- linked finding creation using the saved source
- confidence persistence
- query provenance creation
- result URL persistence without page retrieval
- zero browser requests to the entered third-party source and result host
- the existing active-case session-import workflows remain green

## Workflow result

Every workflow group passed on the validated implementation head:

- OSINT source, syntax and direct-capture policy
- privacy and secret scans
- static, navigation and terminal-theme checks
- backend, lifecycle and write-security tests
- Alembic upgrade, downgrade and re-upgrade
- container build and Compose validation
- PostgreSQL 18 migration and API integration
- hardened and final platform entry-point tests
- full Chromium desktop platform suite
- full Chromium mobile platform suite

## Release state

This validation completes direct source, finding and query-provenance capture for the current research tools. It does not approve production deployment.

PR #28 must remain draft until protected staging verifies Cloudflare Access identity enforcement, Tunnel-only origin access, response headers, structured logs, encrypted off-host backup validation and rollback procedures.
