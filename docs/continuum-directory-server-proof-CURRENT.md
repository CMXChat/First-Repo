# Continuum Directory protected persistence — CURRENT

Last updated: 2026-08-22
Route: `/directory/`
Status: **FRONTEND-READY PROTECTED DIRECTORY — production data routes still depend on stacked backend deployment**

## Purpose

`/directory/` is the canonical Continuum surface for durable People and email ContactMethods.

The current frontend loop is:

`shared operator session → protected Person list/create/update → protected email ContactMethod list/create/lifecycle → stable backend IDs → reload from backend`

Organizations, Groups, relationship labels and the planner preview remain local/unintegrated concepts. The frontend must never present them as protected backend truth.

## Current checkpoint

This slice keeps the accepted Directory product layout while removing one important frontend inconsistency: Directory now uses the same protected operator session transport and inline unlock pattern as `/email/` and `/requests/`.

Directory no longer owns a second fetch/CSRF implementation.

The page loads:

1. `assets/continuum-operator-api-v1.js` — shared protected cookie/session/CSRF transport;
2. `assets/lab/directory-api-v1.js` — a very small Directory compatibility adapter over that shared transport;
3. `assets/lab/directory-session-v2.js` — inline session state/unlock/logout UX;
4. `assets/lab/directory-server-proof-v1.js` — projection of real Person/ContactMethod records into the accepted Directory UI.

The shared transport is also used by Requests and is compatible with the Email protected-session contract.

## Protected session behavior

Directory now shows explicit backend session state near the top of the canonical page.

Possible states include:

- checking;
- connected;
- locked;
- browser Origin denied;
- backend unreachable;
- operator session service unavailable.

When locked, the user can enter the operator key directly on `/directory/`.

The operator key:

- is sent directly to `POST /api/v1/checkin/operator/unlock`;
- is cleared from the input immediately;
- is never written to localStorage, sessionStorage, IndexedDB or canonical page state.

Successful unlock reloads the Directory projection so People are fetched using the new protected cookie session. Ending the session uses the protected `DELETE /api/v1/checkin/operator/session` contract and reloads the page so already-rendered private data is not treated as current after logout.

## Backend authentication contract

The current `jay-app` integration handbook is authoritative.

Session foundation:

- `POST /api/v1/checkin/operator/unlock` — exact allowed Origin + operator key;
- `GET /api/v1/checkin/operator/session` — protected cookie read;
- `DELETE /api/v1/checkin/operator/session` — cookie + exact Origin + `X-CSRF-Token`.

The backend sets the protected operator cookie under `/api/v1/checkin`, which includes all `/api/v1/checkin/operator/...` Directory, Connection, Library, Automation and Runtime routes.

Protected mutations use the same CSRF rule as Email and Requests. The browser does not invent an alternate authentication mechanism.

## Directory API contract used

The frontend consumes these existing protected routes:

- `GET/POST /api/v1/checkin/operator/directory/people`
- `GET/PATCH /api/v1/checkin/operator/directory/people/{person_id}`
- `GET/POST /api/v1/checkin/operator/directory/people/{person_id}/contact-methods`
- `PATCH /api/v1/checkin/operator/directory/contact-methods/{contact_method_id}`

Supported Person facts:

- stable `id`;
- `display_name`;
- lifecycle;
- timestamps.

Supported email ContactMethod facts:

- stable `id`;
- stable `person_id`;
- channel;
- address / normalized address;
- lifecycle;
- timestamps.

Email address is presentation/contact data, not Person identity. Backend UUIDs are canonical identity.

## Shared transport consolidation

`assets/continuum-operator-api-v1.js` now exposes the Directory mutations required by this surface:

- `listPeople`;
- `createPerson`;
- `updatePerson`;
- `listContacts`;
- `createContact`;
- `setContactLifecycle`.

`directory-api-v1.js` delegates to those helpers. It contains no direct `fetch()`, no second session cache and no second CSRF implementation.

This matters because protected pages should not slowly grow separate interpretations of authentication, errors and mutation safety.

## Persistence behavior

Create Person:

1. submit display name;
2. backend returns a Person UUID;
3. UUID becomes the selected identity;
4. People are re-read from backend.

Edit Person:

1. PATCH the stable Person UUID;
2. re-read People;
3. display name may change while identity remains stable.

Add email:

1. POST under the stable Person UUID;
2. backend returns a ContactMethod UUID;
3. contact list is re-read;
4. address is presentation data while ContactMethod UUID remains canonical identity.

Disable/reactivate email:

1. PATCH lifecycle to `disabled` or `active`;
2. re-read ContactMethods;
3. lifecycle remains durable across reload.

Failed ContactMethod reads remain **unavailable**, not an inferred empty list. The UI does not keep stale contacts and pretend they are current.

## Duplicate/conflict behavior

The frontend does not duplicate backend normalization or uniqueness rules.

Backend errors remain authoritative:

- `401` — unlock again;
- `403` — protected Origin/access denied;
- `404` — resource or capability unavailable on the current API;
- `409` — collision/conflict;
- `422` — typed validation failure.

No collision silently merges People.

## Production boundary

The protected operator-session foundation is production-live.

The Person/ContactMethod backend implementation remains part of the stacked `jay-app` development stack until that backend is deliberately reviewed, merged, migrated and deployed.

Therefore production `/directory/` may correctly show:

`protected session connected → Directory capability unavailable/not deployed`

That is a deployment boundary, not permission to fall back to browser-local People as canonical truth.

## Canonical navigation

The Directory source now links directly to canonical routes such as:

- `/control/`;
- `/checkin/`;
- `/directory/`;
- `/automations/`;
- `/spaces/`.

Do not recreate `/lab/directory/` or `/lab/automations/` as active product navigation. Legacy route redirects exist only for compatibility.

## What remains local-only

Unchanged local preview concepts:

- Organizations;
- Groups / saved audiences;
- relationship labels and memberships;
- Planner preview;
- unsupported rich Person profile fields.

When a real backend Person is selected, those concepts are not silently attached to it.

## Validation

Focused Directory validation now checks:

- shared operator API parseability;
- Directory adapter parseability;
- session UX parseability;
- server projection parseability;
- no local/session storage for protected session/domain truth;
- canonical Directory navigation;
- no second direct HTTP transport in the Directory adapter;
- stable backend ID usage;
- contact-read failure vs real empty-list distinction;
- desktop and mobile browser flow from locked → inline unlock → reload → protected Person projection.

The browser proof mocks the backend boundary. It verifies frontend orchestration and session behavior; it does not make the stacked Directory backend production-live.

## Product loop

Directory is one part of the visible Continuum chain:

`Requests → Directory identity → Library content → Email/Automation definition → Runtime → Receipt`

A Person created through `/requests/` and a Person shown in `/directory/` are intended to be the same backend Person UUID, not copies owned by each page.

## Recovery order

When resuming Directory work:

1. `docs/continuum-frontend-roadmap-CURRENT.md`
2. `docs/continuum-frontend-week-CURRENT.md`
3. this file
4. `directory/index.html`
5. `assets/continuum-operator-api-v1.js`
6. `assets/lab/directory-api-v1.js`
7. `assets/lab/directory-session-v2.js`
8. `assets/lab/directory-server-proof-v1.js`
9. current `CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md`

Never infer that Person/ContactMethod routes are production-live simply because this frontend and its mocked browser proof are complete.
