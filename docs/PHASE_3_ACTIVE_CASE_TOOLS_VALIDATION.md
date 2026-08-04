# Phase 3 Validation: Active Case Context Across Research Tools

Validated implementation head: `d8c3009c89fea7458b64cc4a39f754626bad4833`.

## Completed workflow

The protected active-case bar now loads across:

- `/osint`
- `/phone`
- `/search`
- `/metadata`
- `/missing`

Each tool can select an existing persistent case, show protected or local-only operating mode, identify unsaved work, save one explicit snapshot and return directly to the selected case.

Research contents are not saved automatically. The active case identifier is the only case-context value retained in session storage.

## Shared client

`assets/cmx-case-context.js` is now a schema-driven client instead of an OSINT-only implementation. It uses the existing protected endpoints:

- `GET /api/whoami`
- `GET /api/cases?limit=100`
- `POST /api/cases/{case_id}/imports`

The shared client supports all five approved CMX import schemas:

- `cmx-osint-session-v1`
- `cmx-phone-session-v1`
- `cmx-search-session-v1`
- `cmx-metadata-session-v1`
- `cmx-missing-case-v1`

Every save submits one complete schema payload through one backend transaction. A completed save disables the action until the current tool state changes.

## Tool behavior

### Phone

The Phone workspace reads its current `cmx-phone-session-v1` JSON directly from the rendered session record. Saving creates or reuses the normalized phone entity and imports the current phone observations.

The workflow does not add carrier, subscriber, line-type, reachability, precise-location or local-time claims.

### Search

The Search workspace persists only entries the operator explicitly saved to the temporary research log. The shared client captures the exact existing `cmx-search-session-v1` export payload while suppressing the duplicate file download during case saving.

Generated but unsaved queries are not persisted to the case.

### Metadata

The Metadata workspace captures the exact existing `cmx-metadata-session-v1` export payload while suppressing the duplicate file download during case saving.

Only completed metadata entries with valid SHA-256 values become evidence registrations. The source file bytes are not included in the case import and are not uploaded by the browser workflow.

### Missing Person

The Missing Person workspace reads its current `cmx-missing-case-v1` JSON directly from the rendered case record. The save action remains unavailable until a subject label and authorization basis have been recorded.

The import preserves the existing persistent case title and authorization basis while adding the missing-person header, sources, facts, leads and timeline records supported by the schema.

### OSINT

The existing OSINT workflow remains unchanged in outcome. Domain snapshots remain blocked while DNS collection is incomplete, and the same-origin authenticated DNS gateway remains preferred.

## Static transition behavior

When FastAPI identity or case persistence is unavailable:

- the bar displays local-only mode
- the case selector is disabled
- case saving is disabled
- local analysis and explicit JSON export remain available

The browser passphrase remains transition interface design and is not treated as the production security boundary.

## Source and privacy policy

The source checker now requires:

- all five active-case routes
- the shared context JavaScript and stylesheet loader
- all five approved schema identifiers
- exact Search and Metadata export capture
- safe JavaScript syntax
- no dynamic HTML sinks in the shared client
- no research persistence through local storage
- the active-case browser regression suite

## Browser validation

Desktop and mobile Chromium tests create isolated persistent cases and verify the complete browser-to-backend loop for:

- Phone entity and observation persistence
- Search query persistence from the saved research log
- Metadata SHA-256 evidence registration
- Missing Person header, source and fact persistence

The tests also confirm:

- protected identity state
- exact requested case selection
- explicit save enablement
- successful save status
- save disablement after success
- compatibility with the existing OSINT, Cases, lifecycle, import and adversarial-rendering regressions

## Workflow result

Every workflow group passed on the validated implementation head:

- OSINT platform source and syntax policy
- privacy and secret scans
- static, navigation and terminal-theme checks
- backend, lifecycle and write-security tests
- PostgreSQL 18 migration and API integration
- container and Compose validation
- hardened and final platform entry-point tests
- full Chromium desktop platform suite
- full Chromium mobile platform suite

## Release state

This validation completes the active-case browser workflow across the current research tools. It does not approve production deployment.

PR #28 must remain draft until protected staging verifies Cloudflare Access identity enforcement, Tunnel-only origin access, response headers, structured logs, encrypted off-host backup validation and rollback procedures.
