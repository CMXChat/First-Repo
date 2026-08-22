# Continuum Requests — CURRENT

Last updated: 2026-08-22
Route: `/requests/`
Status: **V2 FRONTEND SLICE — protected Directory writes + typed Email safe simulation + exact Runtime history handoff**

## Purpose

`/requests/` is a bounded operator doorway over Continuum's existing authenticated backend APIs.

It is **not** a direct PostgreSQL console, a second Email engine, arbitrary HTTP proxy or general AI execution bridge.

Requests v2 currently has two useful operation modes:

1. batch Person + email ContactMethod creation;
2. typed Email request resolution and approved **safe simulation** through the existing Library → Automation → Runtime contract.

The backend remains authoritative for durable identity, readiness, validation, immutable publication, Runtime execution and receipts.

## Protected session

Requests uses `assets/continuum-operator-api-v1.js`.

- unlock sends the operator key directly to the backend;
- session state is carried by the backend cookie;
- mutations require exact Origin + CSRF;
- operator key is immediately cleared;
- operator key, CSRF and canonical private backend records are not stored in localStorage/sessionStorage.

## Production boundary

The Check In/operator-session foundation is production-live.

The Directory, Connection/SenderIdentity, Library, Automation, Runtime, provider and receipt contracts used by Requests remain stacked backend implementation until deliberately merged, migrated and deployed.

A live page may therefore:

`unlock successfully → required newer capability returns 404 → Requests reports NOT DEPLOYED`

That is a deployment boundary, not permission for browser-local substitute success.

## Mode 1 — batch contacts

Supported deterministic formats include:

- `Name <email@example.com>`
- `Name, email@example.com`
- `Name | email@example.com`
- tab-separated name/email
- `Name email@example.com`

Preview is local/read-only. Duplicate normalized emails inside the pasted batch are blocked before approval.

### Preview-before-write invariant

Typing and **Preview request** perform no backend mutation.

Only **Approve & write to backend** starts writes.

For each approved row Requests:

1. creates a Person;
2. creates that Person's email ContactMethod;
3. reports exact durable IDs;
4. reports partial state if Person succeeds and ContactMethod fails;
5. never silently retries conflicts, expired sessions or failed writes.

These calls are sequential, not one database transaction.

## Mode 2 — typed Email request

Requests v2 accepts bounded typed fields:

- From email;
- To email;
- subject;
- message;
- simulated provider behavior (`accepted`, `transient_once`, `permanent_failure`).

This is deliberately not a general natural-language AI parser yet.

### Email preview is read-only

**Preview Email request** performs protected reads only.

It resolves:

- exactly one active Person + active email ContactMethod for the recipient;
- exactly one active SenderIdentity on a Connection for the sender;
- authoritative Connection/Sender readiness;
- safe-simulation availability.

The preview shows exact UUIDs and the proposed message before Email mutations occur. Missing/ambiguous identities keep approval blocked.

A string such as `team@cmxchat.com` is not authority by itself. The backend SenderIdentity/Connection/readiness facts must resolve correctly.

### Explicit approval and canonical execution

**Approve & run safe simulation** performs the existing backend chain:

1. create action-scoped ContentAsset + Draft;
2. update Draft using `expected_revision`;
3. freeze immutable ContentVersion;
4. create manual Email Automation Draft;
5. update the Draft with exact Connection, SenderIdentity, Person, ContactMethod and ContentAsset UUIDs;
6. call backend preflight;
7. Review and Publish immutable AutomationVersion if ready;
8. request Runtime Run with `provider_mode: "fake"` and unique idempotency key;
9. explicitly process where the development route exists;
10. read the typed Runtime receipt.

Requests does not implement another sender or another Runtime.

If preflight blocks, execution stops before Review/Publish/Run. If a later API is unavailable, Requests reports the exact stopping boundary. Earlier successful writes may remain durable; Requests does not hide that partial state.

## Safe simulation

Safe simulation means real internal Continuum workflow with only the final external provider effect simulated.

Where the backend routes are deployed, durable facts can include:

- Person / ContactMethod;
- ContentAsset / Draft / ContentVersion;
- Automation / AutomationVersion;
- Runtime Run / Attempts;
- Why/provenance;
- typed receipt.

No external email is sent.

Requests v2 never offers `real_smtp` and never connects directly to SMTP.

The stacked proof contract currently names `team@cmxchat.com` as the exact configured proof sender and `cmxchat@gmail.com` as the bounded proof recipient, but Requests still resolves backend identity/readiness rather than treating those strings as permission.

## Receipt continuity — Open in Control

After Requests reads a typed Runtime receipt, the frontend exposes:

`Open this Run in Control`

with:

`/control/?automation_id=<exact Automation UUID>&run_id=<exact Run UUID>`

This closes the product-history loop. Control receives only opaque navigation IDs, then uses the normal protected backend session to read the canonical frozen receipt/Why history.

The link does **not** contain:

- operator key;
- CSRF token;
- recipient/sender addresses;
- message subject/body;
- provider credentials.

The query parameters do not grant authority and do not mutate Runtime state.

## Failure / retry rules

- `401`: stop and require re-unlock;
- `403`: stop on Origin/access rejection;
- `404`: report unavailable/not-deployed route/resource;
- `409`: backend owns conflict/revision/idempotency semantics; do not overwrite blindly;
- `422`: show validation failure;
- provider ambiguity: never automatically retry.

Requests never automatically replays a partially completed Email operation after an error.

## Security / storage

Never persist as browser-owned canonical truth:

- operator key;
- CSRF token;
- People/ContactMethods;
- message content;
- provider credentials;
- Runtime receipts.

No direct database credential or database connection exists in Requests.

## Current browser proof

Focused validation now proves both:

- contact + Email previews make zero writes before approval;
- approved Email safe simulation follows the canonical Library → Automation → Runtime sequence;
- safe simulation uses `provider_mode: "fake"`;
- protected mutations carry CSRF;
- no `real_smtp` payload appears;
- typed receipt reads work;
- the exact Automation/Run receipt can be handed to `/control/` without leaking private fields into the URL.

These tests use a mocked backend boundary. They prove frontend orchestration, not production deployment.

## Future direction

Continue adding typed adapters only where a verified protected backend contract exists.

Broad natural-language interpretation belongs to a later authenticated assistant/AI bridge. AI may translate intent into typed proposed operations; it is not permission and must not bypass preview, backend policy or Runtime.

Durable scheduling requires a server-side scheduler. Requests does not simulate one in an open browser tab.

## Canonical files

- `requests/index.html`
- `assets/requests/requests-v1.css`
- `assets/requests/requests-v2.css`
- `assets/requests/requests-v1.js`
- `assets/continuum-operator-api-v1.js`
- `assets/continuum-runtime-receipt-link-v1.js`
- `tests/continuum-requests-v1.test.js`
- `tests/continuum-runtime-receipt-control-link-v1-browser.js`
- `.github/workflows/continuum-requests-validation.yml`
- `.github/workflows/continuum-runtime-receipt-navigation-validation.yml`

## Recovery

1. `docs/continuum-frontend-roadmap-CURRENT.md`
2. `docs/continuum-frontend-week-CURRENT.md`
3. this file
4. `requests/index.html`
5. `assets/requests/requests-v1.js`
6. `assets/continuum-operator-api-v1.js`
7. `assets/continuum-runtime-receipt-link-v1.js`
8. `docs/continuum-email-lab-CURRENT.md`
9. `docs/continuum-control-center-lab-CURRENT.md`
10. current backend integration handbook in `CMXChat/jay-app`

Do not add direct PostgreSQL, browser SMTP, real-provider shortcuts, an alternate Runtime or a secret AI permission bypass as frontend workarounds.
