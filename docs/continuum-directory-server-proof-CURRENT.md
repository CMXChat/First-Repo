# Continuum Directory protected Person persistence proof — CURRENT

Date: 2026-08-21
Status: Frontend Lab integration proof. Frontend-only. No backend changes.

## Goal

Keep the accepted `/lab/directory` product surface and prove one durable backend loop:

`Directory Person UI → protected Person → protected email ContactMethod → reload → same stable backend identities`

This slice stops before Automations integration.

## Change classification

### REUSED

- `/lab/directory/` shell, navigation, toolbar, list/detail/context layout, dialogs, mobile layout and Continuum styling.
- existing `directory-app-v1.js` for Organizations, Groups, command palette, theme and unsupported Lab concepts.
- existing Check In static-frontend protected request pattern: `api.cmxchat.com/api/v1`, `credentials: include`, operator-session CSRF retrieval and `X-CSRF-Token` on mutations.
- backend-owned Person and ContactMethod IDs and lifecycle values.

### CONSOLIDATED

- People rendering now projects protected Person records into the existing Directory list/detail/context containers.
- email ContactMethods live under the selected protected Person instead of being copied into the legacy local Person object.
- error presentation uses backend HTTP/detail responses instead of local duplicate/readiness guesses.

### REPLACED

For the People surface only:

- browser-local Person creation is replaced by `POST /checkin/operator/directory/people`.
- browser-local Person display-name edits are replaced by `PATCH /checkin/operator/directory/people/{person_id}`.
- browser-local email creation is replaced by `POST /checkin/operator/directory/people/{person_id}/contact-methods`.
- browser-local email active state is replaced by `PATCH /checkin/operator/directory/contact-methods/{contact_method_id}`.
- reload hydration comes from backend list/contact endpoints, not `cmx-lab-crm-v1`.
- local exact-email duplicate checks are not used for protected email creation; backend `409`/`422` responses are authoritative.

### GENUINELY NEW

- `assets/lab/directory-api-v1.js`: a deliberately tiny development transport adapter for the existing static Lab.
- `assets/lab/directory-server-proof-v1.js`: a product bridge that projects real Person/ContactMethod records into the existing Directory DOM without changing production frontend architecture.
- protected-data loading/error states and email lifecycle controls inside the existing Directory UI.
- source-contract validation for the transport boundary.

## Why this transport exists

`First-Repo` `/lab` is static HTML/JS. `jay-app/frontend` is the canonical React/TypeScript application and already owns the generated OpenAPI client.

Copying the generated SDK into `First-Repo` would create a second permanent client architecture. This proof does not do that.

The Lab transport is intentionally small and hand-written because it serves one development-only bridge:

- six Directory domain calls;
- one operator-session read used to authorize mutations;
- one shared JSON request helper;
- the already-established protected Check In session/CSRF pattern;
- no domain cache;
- no schema registry;
- no generated types;
- no production claim.

When this UX moves into the canonical React frontend, use the generated OpenAPI client there and retire this Lab transport.

## Files

- `lab/directory/index.html`
  - existing UI retained;
  - existing standalone product copy/contracts retained;
  - CSP permits the protected CMX API connection plus local backend development;
  - loads the thin transport and server projection after the existing Directory app.
- `assets/lab/directory-api-v1.js`
  - development transport only;
  - no localStorage;
  - no Organizations/Groups endpoints;
  - fetches operator session for CSRF before every mutation.
- `assets/lab/directory-server-proof-v1.js`
  - server-backed People projection;
  - keeps stable backend IDs in memory as canonical identity;
  - fetches People on page load and again after mutations/reload;
  - fetches ContactMethods for the selected Person;
  - reuses existing Directory containers/dialogs/CSS classes;
  - switches runtime truth labels between protected People and local Organizations/Groups.
- `tests/continuum-directory-server-proof-v1.test.js`
  - prevents accidental local canonical storage or API-surface widening.
- `.github/workflows/directory-server-proof-validation.yml`
  - parses the new JS and runs the focused source contract.

## Protected API contract used

Current backend development contract from `jay-app` Directory slice. The proof uses these six domain calls:

- `GET /api/v1/checkin/operator/directory/people`
- `POST /api/v1/checkin/operator/directory/people`
- `PATCH /api/v1/checkin/operator/directory/people/{person_id}`
- `GET /api/v1/checkin/operator/directory/people/{person_id}/contact-methods`
- `POST /api/v1/checkin/operator/directory/people/{person_id}/contact-methods`
- `PATCH /api/v1/checkin/operator/directory/contact-methods/{contact_method_id}`

Mutations additionally read:

- `GET /api/v1/checkin/operator/session`

The proof only uses supported fields:

- Person: `id`, `display_name`, `lifecycle`, timestamps.
- ContactMethod: `id`, `person_id`, `channel=email`, `address`, `normalized_address`, `lifecycle`, timestamps.

Role, title, phone, location, timezone, labels, notes, Organizations, Groups, relationship links and saved audiences are not written to the protected Person API in this slice.

## Auth / session / CSRF requirements

Protected reads require an active `cmx_checkin_operator` operator cookie.

Protected mutations also require:

1. exact allowed Origin;
2. active operator cookie;
3. `cmx_checkin_csrf` cookie;
4. matching `X-CSRF-Token` header.

The Lab obtains the header value from:

`GET /api/v1/checkin/operator/session`

On `db.cmxchat.com`, the transport calls `https://api.cmxchat.com/api/v1` with `credentials: include`.

For local frontend/backend development it targets `http://localhost:8000/api/v1`. The backend `CHECKIN_PUBLIC_ORIGIN` must match the frontend origin for local mutation testing; the production default is `https://db.cmxchat.com`.

The Directory page does not create a new authentication mechanism. If operator access is missing or expired, it shows that protected People are unavailable and does not silently fall back to local People as canonical truth.

## Persistence behavior

Create Person:

1. submit display name;
2. backend returns `PersonPublic` with UUID;
3. UUID becomes selected identity;
4. People list is re-read from backend.

Edit Person:

1. PATCH the stable UUID;
2. re-read People;
3. name changes while identity remains the same.

Add email:

1. POST under the stable Person UUID;
2. backend returns ContactMethod UUID;
3. contact list is re-read;
4. email address is presentation data, ContactMethod UUID is identity.

Disable/reactivate:

1. PATCH ContactMethod lifecycle to `disabled` or `active`;
2. re-read contacts;
3. lifecycle survives reload because it is server state.

Reload:

- People are fetched from the backend again.
- selected Person contacts are fetched from the backend again.
- the bridge does not read/write `cmx-lab-crm-v1` for protected Person/contact truth.

## Duplicate/conflict behavior

The frontend does not duplicate backend normalization or uniqueness rules.

If email creation conflicts with an existing normalized address, the backend decides the result. `409`, `422`, auth and CSRF errors are surfaced using the backend detail text where supplied.

## What remains local-only

Unchanged browser-local Lab concepts:

- Organizations;
- Groups / saved audiences;
- relationship labels and membership previews;
- local Planner preview;
- local Automation references;
- unsupported Person profile fields in the legacy sample model.

When viewing a real server Person, those local concepts are not attached to the protected Person and are labeled accordingly.

## How to continue frontend editing

For this proof:

- UI/product work stays in `First-Repo`.
- keep `directory-app-v1.js` as the accepted local prototype layer for unsupported concepts.
- change protected People behavior in `directory-server-proof-v1.js`.
- change only HTTP transport details in `directory-api-v1.js` when the backend contract changes.
- do not add Organization/Group calls until matching backend APIs exist.
- do not copy the `jay-app/frontend/src/client` generated SDK into this repo.

For the eventual production frontend:

- implement the accepted Directory interaction in `jay-app/frontend` React components;
- consume the generated OpenAPI client;
- use TanStack Query/server state instead of this DOM bridge;
- retire the two Lab proof files after the product behavior has migrated.

## Validation

Current frontend validation on PR #120:

- focused Directory server-proof JS/source contract: passing;
- existing standalone Directory contract: passing;
- existing shared Continuum shell contract: passing.

These checks prove the frontend transport boundary, parseability and preservation of the accepted Directory shell. They do not fabricate a live backend persistence result.

## Acceptance boundary

This slice is complete when a protected environment containing the Directory backend can demonstrate:

1. create Person;
2. retain backend `person_id`;
3. rename Person;
4. reload and observe the same Person;
5. add email ContactMethod;
6. retain backend `contact_method_id`;
7. reload and observe the same email;
8. disable email;
9. reload and observe disabled lifecycle;
10. reactivate email;
11. see backend duplicate/conflict errors truthfully.

The frontend implementation for that flow is present. Full live acceptance cannot be claimed from this branch alone because the required Directory backend remains an open `jay-app` development PR and this frontend task does not deploy or modify it. Until that backend is available in the environment being tested, the Lab should truthfully show the protected API as unavailable.

## Stop point

Do not start Automations integration from this branch.

Next review slice, only after this proof is accepted:

`existing /lab/automations → same real Person/ContactMethod → AutomationDraft persistence → backend preflight → Review/Publish → Runtime Runs/Attempts/Why as actually implemented`
