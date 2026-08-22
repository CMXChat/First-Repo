# Continuum Requests — CURRENT

Last updated: 2026-08-22
Route: `/requests/`
Status: **FIRST FRONTEND SLICE — protected batch Directory writes**

## Purpose

`/requests/` is the beginning of a general operator doorway over Continuum's existing authenticated backend APIs.

It is **not** a direct PostgreSQL console and it is **not** arbitrary AI execution.

Version 1 proves a narrow, useful operation:

`reviewed contact lines → protected Person creation → protected email ContactMethod creation → durable backend IDs/results`

## Current backend dependency

The page consumes existing `jay-app` Directory contracts:

- `POST /api/v1/checkin/operator/unlock`
- `GET /api/v1/checkin/operator/session`
- `DELETE /api/v1/checkin/operator/session`
- `GET /api/v1/checkin/operator/directory/people`
- `POST /api/v1/checkin/operator/directory/people`
- `POST /api/v1/checkin/operator/directory/people/{person_id}/contact-methods`

Protected reads require the operator session cookie. Mutations require the cookie, exact allowed Origin and `X-CSRF-Token`.

The operator key is submitted directly to the backend and immediately cleared. It is never stored in localStorage, sessionStorage or canonical browser state.

## Production boundary

The protected Check In/operator session foundation is the production-live foundation.

Person/ContactMethod Directory APIs remain part of the stacked backend source until that stack is deliberately reviewed, merged, migrated and deployed.

Therefore `/requests/` may successfully unlock against `api.cmxchat.com` and then correctly report that Directory create capability is not deployed yet.

The frontend must not replace that gap with browser fake records.

## Version 1 input contract

The static page contains no AI model. It supports deterministic contact-entry formats only:

- `Name <email@example.com>`
- `Name, email@example.com`
- `Name | email@example.com`
- tab-separated `Name<TAB>email@example.com`
- `Name email@example.com`

The page validates syntax for preview and rejects duplicate normalized email addresses inside the same pasted batch.

Parsing is presentation logic only. The backend remains authoritative for Person identity, email normalization/collisions, lifecycle and durable IDs.

## Preview-before-write invariant

No backend mutation happens when the user types or presses **Preview request**.

The user must explicitly press **Approve & write to backend** after every row parses cleanly and the protected Directory API is available.

This is the core Requests invariant:

`human intent → typed preview → explicit approval → authenticated backend API`

## Write behavior

For each approved row, v1 performs:

1. `POST /directory/people` with `{ display_name }`.
2. If Person creation succeeds, `POST /directory/people/{person_id}/contact-methods` with `{ channel:"email", address }`.
3. Show exact durable Person/ContactMethod IDs on success.
4. Show a truthful partial result if Person succeeds but ContactMethod creation fails.
5. Do not automatically retry session failures, conflicts or other mutation errors.

The two calls are sequential and are not one database transaction. A successfully created Person remains durable even if its following ContactMethod write fails. The UI says this before approval and reports the partial result afterward.

The frontend never treats display-name equality as Person identity and never silently merges People.

## Security and storage

Never persist:

- operator key;
- CSRF token;
- canonical private People/ContactMethods;
- batch write results as browser-owned server truth.

No direct database credentials or database connection exist in this page.

## Future direction

`/requests/` is intended to grow by adding **typed adapters for backend capabilities that already exist**.

Possible future adapters, only after their API contracts are verified:

- create/update Library objects;
- prepare Automation Drafts;
- lifecycle operations;
- protected lookup/reporting;
- other bounded administrative work.

Broad natural-language interpretation belongs to a later authenticated assistant/AI bridge. That bridge must propose typed operations and pass the same preview/approval/backend rules; AI is not permission.

A future scheduling request also requires a real durable server-side scheduling layer. Requests v1 does not pretend that capability exists.

## Files

- `requests/index.html`
- `assets/requests/requests-v1.css`
- `assets/requests/requests-v1.js`
- `assets/continuum-operator-api-v1.js`
- `tests/continuum-requests-v1.test.js`
- `docs/continuum-frontend-roadmap-CURRENT.md`

## Recovery

Frontend recovery order:

1. `docs/continuum-frontend-roadmap-CURRENT.md`
2. this file
3. `requests/index.html`
4. `assets/requests/requests-v1.js`
5. `assets/continuum-operator-api-v1.js`
6. current `jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md`

Do not add direct PostgreSQL writes as a frontend workaround.
