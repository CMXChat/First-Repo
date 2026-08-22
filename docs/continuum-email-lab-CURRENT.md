# Continuum Email — CURRENT

Last updated: 2026-08-22
Canonical route: `/email/`
Frontend generation: **v3 backend-session integration**

## Purpose

`/email/` is the protected manual Email workspace. It is now intentionally wired to the current backend contract instead of treating a missing protected session or undeployed stacked capability as one generic failure.

The connected model remains:

`Person → email ContactMethod → Connection → SenderIdentity/readiness → ContentAsset/Draft → immutable ContentVersion → Automation Draft/preflight/Review/Publish → manual Runtime Run → typed receipt/Why`

The backend remains authoritative. The frontend never writes directly to PostgreSQL, invents readiness, reconstructs historical truth from mutable objects or substitutes browser fake records for unavailable APIs.

## Approved roadmap relationship

Master frontend plan: `docs/continuum-frontend-roadmap-CURRENT.md`.

Current execution order starts with real `/email/` integration, then `/requests/`, then systematic backend projection/polish across the other Continuum surfaces.

## Operator unlock/session UX

Email v3 adds a real backend unlock flow.

On load:

1. `GET /api/v1/checkin/operator/session` checks for an existing protected session.
2. If the session is valid, Email loads backend capabilities immediately.
3. If the session is missing/expired, the page exposes **Unlock backend**.
4. The operator key is sent directly to `POST /api/v1/checkin/operator/unlock` and immediately cleared from the input.
5. The key is never saved in localStorage, sessionStorage, IndexedDB or page-owned canonical state.
6. The server-owned HttpOnly cookie carries authentication. Mutations use the backend CSRF contract.
7. **End protected session** calls the protected session DELETE and returns the workspace to the locked state.

Shared transport for protected operator/session behavior lives in `assets/continuum-operator-api-v1.js` so `/email/` and `/requests/` can follow the same rules.

## Backend-state classification

Email now distinguishes at least these states:

- **LOCKED** — no valid protected session; unlock is required.
- **CONNECTED** — protected session and probed Email dependencies are available.
- **PARTIAL** — session works but one or more Email dependencies are unavailable.
- **NOT DEPLOYED** — session works while newer stacked Email dependency routes return 404/unsupported on the deployed API.
- **DENIED** — protected access/Origin was rejected.
- **OFFLINE / UNAVAILABLE** — network/server failure.

This matters because current production and current stacked source are not the same thing.

## Production vs stacked truth

Canonical backend handbook: `CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md` on draft PR #24.

Current source truth when Email v3 was started:

- T001–T006 complete;
- migration head `c0d1e2f3a4b5`;
- full backend regression 170 passed, 89% coverage;
- PR #24 remains draft/unmerged;
- production remains on the older documented Phase 1 boundary.

Therefore the live `/email/` page may legitimately:

`unlock successfully → report Directory/Connection/Library/Automation/Runtime capability as not deployed`

That is not treated as a frontend success or as missing canonical data. It is a deployment boundary.

## Directory recipient

After a valid protected session:

- list real People;
- show active People only;
- when a Person is selected, list that Person's ContactMethods;
- show active `channel=email` methods only;
- preserve exact Person and ContactMethod UUIDs for the Automation definition.

Email address is not Person identity.

## Connection and SenderIdentity

The sender path loads real Connections, real SenderIdentities and authoritative backend readiness.

The page consumes server facts for fake-provider availability, real SMTP availability, configuration binding/availability and typed readiness issues. The browser never reads provider credentials or decides SMTP permission itself.

## Message / Library

The rich composer remains presentation-only.

`assets/lab/lab-email-workspace-v2.js` sanitizes the rich editor and projects normalized message text into the hidden backend text field. No private message content is stored in browser storage.

**Freeze message version** performs the real backend chain:

`create ContentAsset+Draft → PUT Draft with expected_revision → POST immutable ContentVersion`

A stale Draft revision is a backend `409`; the UI reports the conflict rather than blindly overwriting.

No HTML-email backend contract is invented here.

## Automation

When recipient, sender and frozen content are ready, Email v3 creates a manual Email Automation Draft with exact backend IDs, then calls authoritative preflight.

The current definition remains:

- `schema_version: 1`
- `trigger: { type: "manual" }`
- no conditions
- one typed Email action
- exact Connection/SenderIdentity/Person/ContactMethod/ContentAsset IDs
- immediate start
- finish

Review and Publish create immutable AutomationVersion truth. Publishing is not provider delivery.

## Runtime acceptance mode

The current frontend acceptance pass intentionally enables **safe simulation only**.

"Safe simulation" means:

- the Person, ContentVersion, Automation, Run, Attempt, Why and receipt records are real backend/runtime data;
- the final provider boundary is simulated;
- zero external email is sent.

Current supported simulated behaviors remain `accepted`, `transient_once` and `permanent_failure`.

The explicit development Process control remains visible where the backend exposes it. If that development-only route is not deployed, Email says so directly.

## Real SMTP boundary

Real SMTP is intentionally disabled in this frontend acceptance pass even though the stacked backend has a narrowly bounded manual-owner SMTP contract.

A later explicit acceptance decision is required before enabling a real-send control.

Browser invariants remain:

- never talk directly to SMTP;
- never receive provider credentials;
- never bypass backend sender/recipient/readiness restrictions;
- never automatically retry an ambiguous external outcome.

## Receipt

After a Run exists, Email reads the typed Runtime receipt and renders frozen execution facts instead of reconstructing history from mutable Directory state.

The receipt presentation includes current backend facts such as:

- Run and AutomationVersion identity/state;
- manual-owner authority mode;
- provider mode;
- frozen recipient/sender/content references;
- Attempts;
- Why/events;
- ambiguity and reconciliation state.

Direct manual Email Runs do not invent TriggerOccurrence/Authority provenance when it is absent.

## Unsupported by design in this pass

- real SMTP execution from the browser UI;
- CC/BCC;
- attachments;
- bulk delivery;
- arbitrary-recipient bypass;
- schedules;
- recurring sends;
- AI initiation;
- generic Authority controls;
- automatic retry of ambiguous provider effects.

## Canonical files

- `email/index.html`
- `assets/continuum-operator-api-v1.js`
- `assets/lab/lab-email-api-v1.js`
- `assets/lab/lab-email-v3.js`
- `assets/lab/lab-email-workspace-v2.js`
- `assets/lab/lab-email-v1.css`
- `assets/lab/lab-email-desktop-scale-v1.css`
- `assets/lab/lab-email-backend-v3.css`
- `tests/continuum-email-lab-v1.test.js`
- `.github/workflows/continuum-email-lab-validation.yml`

`assets/lab/lab-email-v1.js` remains historical implementation source but is no longer the canonical orchestrator once v3 is merged.

## Acceptance target

Safe frontend/backend proof target:

`unlock → load backend Directory/Connections → freeze ContentVersion → create/preflight/review/publish AutomationVersion → request fake Runtime Run → explicitly process where development endpoint exists → read typed receipt`

If current production stops before that because the newer stacked backend is not deployed, record the exact boundary. Do not fake the remainder.

## Recovery

1. `docs/continuum-frontend-roadmap-CURRENT.md`
2. this file
3. `email/index.html`
4. `assets/lab/lab-email-v3.js`
5. `assets/continuum-operator-api-v1.js`
6. `assets/lab/lab-email-workspace-v2.js`
7. `assets/lab/lab-email-api-v1.js`
8. current backend integration handbook in `CMXChat/jay-app`

Do not recreate `/lab/email/` and do not move Email canonical truth into browser storage.
