# Continuum Requests — CURRENT

Last updated: 2026-08-22
Route: `/requests/`
Status: **V2 FRONTEND SLICE — protected Directory writes + Email safe simulation**

## Purpose

`/requests/` is the operator doorway over Continuum's existing authenticated backend APIs.

It is **not** a direct PostgreSQL console, a second Email engine, or arbitrary AI execution.

Requests v2 has two bounded operation modes:

1. batch Person + email ContactMethod creation;
2. typed Email request resolution and approved **safe simulation** through the existing Library → Automation → Runtime contract.

The backend remains authoritative for durable identity, readiness, validation, immutable publication, Runtime execution and receipts.

## Protected session

Requests uses the shared protected operator transport in `assets/continuum-operator-api-v1.js`.

- `POST /api/v1/checkin/operator/unlock` submits the operator key directly to the backend.
- `GET /api/v1/checkin/operator/session` restores/validates the HttpOnly protected session.
- Mutations require the protected cookie, exact allowed Origin and `X-CSRF-Token`.
- The operator key is immediately cleared and is never written to localStorage/sessionStorage.
- Requests never stores canonical private backend records as browser-owned truth.

## Production boundary

The operator session / Check In foundation is production-live.

The Directory, Connection/SenderIdentity, Library, Automation, Runtime, provider and receipt contracts used by Requests remain part of the stacked `jay-app` implementation until deliberately reviewed, merged, migrated and deployed.

Therefore the live page may successfully unlock and then truthfully report that a required capability is not deployed. That is a backend deployment boundary, not permission to create a browser-local substitute.

## Mode 1 — batch contacts

Supported deterministic input formats:

- `Name <email@example.com>`
- `Name, email@example.com`
- `Name | email@example.com`
- tab-separated `Name<TAB>email@example.com`
- `Name email@example.com`

Preview is local and read-only. Duplicate normalized emails inside the pasted batch are rejected before approval.

### Preview-before-write invariant

No backend mutation happens when the user types or presses **Preview request**.

The user must explicitly press **Approve & write to backend**.

For each approved row:

1. create the Person;
2. create that Person's email ContactMethod;
3. show exact durable IDs on success;
4. show a truthful partial result if Person creation succeeds but ContactMethod creation fails;
5. never silently retry a conflict, expired session or failed mutation.

The two calls are sequential and are not one database transaction.

## Mode 2 — Email request

Requests v2 adds a typed Email request form with:

- From email;
- To email;
- subject;
- message;
- simulated provider behavior (`accepted`, `transient_once`, `permanent_failure`).

This is deliberately not an arbitrary natural-language parser yet. A future authenticated assistant bridge may translate normal language into these typed fields.

### Email preview is read-only

Pressing **Preview Email request** performs protected reads only.

The page resolves:

- exactly one active Directory Person + active email ContactMethod matching the requested recipient address;
- exactly one active SenderIdentity on a Connection matching the requested sender address;
- authoritative Connection/Sender readiness facts;
- safe-simulation availability.

Preview shows the exact backend UUIDs and message before any Email mutation or Runtime Run is requested.

If the sender or recipient is missing or ambiguous, approval stays blocked.

### Email approval and execution

Pressing **Approve & run safe simulation** authorizes a bounded multi-step backend operation:

1. create action-scoped `ContentAsset` + Draft;
2. update Draft with `expected_revision` and the requested source text;
3. freeze immutable `ContentVersion`;
4. create a manual Email Automation Draft;
5. update the Draft with exact Connection, SenderIdentity, Person, ContactMethod and ContentAsset UUIDs;
6. call authoritative server preflight;
7. if ready, Review and Publish immutable `AutomationVersion`;
8. request a manual Runtime Run with `provider_mode:"fake"` and a unique idempotency key;
9. where the development process API exists, explicitly process through canonical Runtime;
10. read and render the typed Runtime receipt.

The Automation definition is the same manual Email shape used by `/email/`. Requests does not create an alternate sending path.

If preflight blocks, Requests stops before Review/Publish/Run and reports the server issues. If a later API is not deployed, it reports the exact stopping boundary.

Because the operation is multi-step, earlier successful writes may remain durable if a later step fails. Requests says this before approval and never hides that state.

## What safe simulation means

Safe simulation is real internal backend work with the final provider side effect simulated.

Real backend facts may include:

- Person/ContactMethod;
- ContentAsset/Draft/ContentVersion;
- Automation/AutomationVersion;
- Runtime Run and Attempts;
- Why/provenance;
- typed receipt.

The external email provider is not contacted. **No external email is sent.**

Requests v2 never offers `real_smtp` and never talks directly to SMTP.

The current stacked provider proof contract names `team@cmxchat.com` as the exact configured proof sender and `cmxchat@gmail.com` as the bounded proof recipient, but Requests still resolves live backend identities/readiness rather than trusting those strings as authority. Production provider use remains a separate later acceptance decision.

## Failure / retry rules

- `401`: protected session expired; stop and require re-unlock.
- `403`: Origin/access rejected; stop.
- `404`: a required route/resource may be unavailable on the current API; stop and report the boundary.
- `409`: conflict/revision/idempotency semantics are backend-owned; do not overwrite blindly.
- `422`: show backend validation failure.
- provider ambiguity: never automatically retry.

Requests does not automatically replay a partially completed Email operation after an error.

## Security and storage

Never persist in browser storage:

- operator key;
- CSRF token;
- canonical People/ContactMethods;
- message content as server truth;
- provider credentials;
- Runtime receipts as an alternate canonical history.

No direct database credentials or database connection exist in this page.

## Future direction

Continue adding typed adapters only for backend capabilities that have a verified contract.

Possible future Requests operations include:

- Library creation/update;
- Automation lifecycle operations;
- protected lookups/reporting;
- reconciliation inspection;
- other bounded administrative work.

Broad normal-language interpretation belongs to a later authenticated assistant/AI bridge. AI may translate intent into typed operations; it is not permission and must not bypass preview, backend policy or Runtime.

Durable scheduling still requires a real server-side scheduling layer. Requests v2 does not simulate one.

## Canonical files

- `requests/index.html`
- `assets/requests/requests-v1.css`
- `assets/requests/requests-v2.css`
- `assets/requests/requests-v1.js`
- `assets/continuum-operator-api-v1.js`
- `tests/continuum-requests-v1.test.js`
- `.github/workflows/continuum-requests-validation.yml`

## Recovery

1. `docs/continuum-frontend-roadmap-CURRENT.md`
2. `docs/continuum-frontend-week-CURRENT.md`
3. this file
4. `requests/index.html`
5. `assets/requests/requests-v1.js`
6. `assets/continuum-operator-api-v1.js`
7. `docs/continuum-email-lab-CURRENT.md`
8. current `CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md`

Do not add direct PostgreSQL writes, browser SMTP, real-provider shortcuts or an alternate Runtime as a frontend workaround.
