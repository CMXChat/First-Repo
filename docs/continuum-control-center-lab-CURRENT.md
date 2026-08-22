# Continuum Control Center — CURRENT

Date: 2026-08-22
Route: `/control/`
Status: **MIXED TRUTH SURFACE — protected Runtime history proof + explicit sample operational preview**

## Role

Control is the human-readable history and explanation surface for durable Continuum actions.

The core question is:

> What happened, why did it happen, and which exact durable objects were involved?

The current proof-driven frontend week now has:

`Directory = durable identity`

`Library = durable memory`

`Email / Requests = durable action orchestration`

`Control = durable action explanation / receipt navigation`

## Current truth split

Canonical `/control/` deliberately contains two truth lanes.

### Protected Runtime history lane

History injects a read-only protected Runtime/receipt lane using the shared operator session and the existing stacked backend contracts.

When those backend routes are deployed, Control reads:

`Automation list → Runtime Runs → exact frozen Runtime receipt`

It does not start/process Runs, cancel work, retry Attempts, reconcile ambiguity, resend effects or create another Runtime.

### Operational preview lane

The existing Now, Upcoming, sample connection/source health, quiet-state preview, continuity examples and local simulation remain explicit **sample/proving UI**.

Those panels do not become production truth merely because protected Runtime history exists beside them.

## Backend contract

Canonical backend handbook:

`CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md`

Current stacked ref remains `dev/durable-trigger-consumption` / draft backend PR #24.

Protected reads used by Control include:

- `GET /api/v1/checkin/operator/automations`;
- `GET /api/v1/checkin/operator/automations/{automation_id}/runs`;
- `GET /api/v1/checkin/operator/automations/{automation_id}/runs/{run_id}/receipt`.

The shared protected transport is `assets/continuum-operator-api-v1.js`.

## Production boundary

The operator-session / Check In foundation is production-live.

The newer Automation, Runtime and receipt routes are stacked implementation until deliberately merged/migrated/deployed.

This is therefore a valid production state:

`protected session connected → Runtime route returns 404 → Control reports NOT DEPLOYED`

Frontend readiness does not turn a stacked route into a live route.

## What a frozen Runtime receipt explains

When present, Control renders exact execution facts including:

- Run ID;
- Automation ID;
- immutable AutomationVersion ID;
- Person ID and frozen display name;
- ContactMethod ID and frozen recipient address;
- Connection ID and frozen display name;
- SenderIdentity ID and frozen sender identity/address;
- ContentAsset ID;
- immutable ContentVersion ID;
- Content checksum / content subject;
- provider mode;
- Run/action state;
- manual-owner vs exact authority mode;
- optional AuthorityGrant / AuthorityGrantVersion;
- optional Check In Incident / TriggerOccurrence;
- Attempts;
- Why/events;
- provider-operation reconciliation evidence where relevant.

Historical execution is rendered from the frozen receipt, **not** from mutable current Directory/Library state.

## Cross-surface exact references — landed

Control no longer merely prints IDs.

Exact receipt references navigate to canonical surfaces:

`Person ID → /directory/?person_id=<exact UUID>`

`ContentAsset ID → /library/?content_id=<exact UUID>`

`Automation → /automations/`

The Directory/Library exact-reference frontend now waits for their normal protected data to load and focuses the exact requested backend object. The handoff uses the existing protected page; it performs no mutation and does not create a local substitute object.

If the exact object does not exist in the protected response, the destination reports that reference as missing rather than fabricating it.

## Reverse receipt handoff — Email / Requests → Control

Email and Requests now expose the reverse direction after a typed receipt is read:

`Open this Run in Control`

using only:

`/control/?automation_id=<exact Automation UUID>&run_id=<exact Run UUID>`

Control already understands these IDs and loads that exact receipt through the protected backend session.

Important security rule: the URL is a **pointer, not permission**.

It contains opaque Automation/Run IDs only. It does not contain operator keys, CSRF values, message content, recipient/sender addresses or provider credentials. Control still requires normal backend authentication and remains read-only for this history lane.

## Protected session behavior

Control follows the same protected session model as Email, Requests, Directory and Library:

1. backend-issued secure cookie establishes the operator session;
2. backend validates the exact allowed Origin;
3. protected mutations elsewhere require CSRF;
4. Runtime history here performs reads only.

If locked, Control shows inline unlock. The operator key is sent directly to the backend and cleared immediately.

No operator key, CSRF token, frozen receipt or protected IDs are intentionally persisted as browser-owned canonical state by the history lane.

## Validation evidence

Focused browser/source validation proves:

- canonical active navigation;
- desktop/mobile locked → unlock → protected Run history;
- selecting a Run reads the typed frozen receipt;
- exact Person/ContactMethod/Connection/Sender/Content/Automation/Run references render;
- Attempts and Why render;
- Control → exact Directory Person handoff;
- Control → exact Library ContentAsset handoff;
- Email/Requests receipt → exact Control Run handoff;
- protected query links do not mutate backend state;
- operator keys/protected receipt truth do not become browser-storage canonical state;
- 404 remains truthful NOT DEPLOYED;
- local Control simulation stays isolated from protected Runtime history.

Browser proofs mock the backend boundary. They prove frontend integration behavior, not production deployment.

## Why this matters

Without a receipt chain, “Email succeeded” is vague.

With durable references Continuum can explain:

`Person → ContactMethod → exact ContentVersion → AutomationVersion → Run → Attempt → receipt`

That answers:

- who was involved;
- which address was used;
- which exact frozen content was used;
- which immutable Automation ran;
- who/what initiated it;
- whether authority was manual/delegated;
- what provider boundary reported;
- whether retries occurred;
- whether ambiguity/reconciliation exists;
- what Runtime recorded and why.

The stable IDs also let the user move between interfaces while staying on the **same object**.

## Current product loop

The proof loop is now navigable in both directions:

`Requests / Email → Runtime receipt → Control → exact Directory Person / exact Library Content`

and:

`Directory / Library durable objects → Email/Automation action → Runtime → Control history`

This is the strongest current frontend demonstration of **one durable Continuum with multiple interfaces** rather than unrelated mini-apps.

## Files

Protected Runtime history:

- `control/index.html`
- `assets/continuum-operator-api-v1.js`
- `assets/control/control-runtime-history-v1.js`
- `assets/control/control-runtime-history-v1.css`
- `assets/continuum-exact-reference-v1.js`
- `assets/continuum-runtime-receipt-link-v1.js`
- `tests/continuum-control-runtime-history-v1.test.js`
- `tests/continuum-control-runtime-history-v1-browser.js`
- `tests/continuum-exact-reference-v1-browser.js`
- `tests/continuum-runtime-receipt-control-link-v1-browser.js`
- `.github/workflows/control-center-lab-validation.yml`

Existing sample/proving Control implementation remains under `assets/lab/control-center-*`.

`assets/lab/` is implementation history. The active route is `/control/`.

## No-go shortcuts

Do not use Control to:

- invent local Runtime history;
- execute/process Runs as a side effect of reading history;
- automatically retry ambiguous provider work;
- manufacture Authority from receipt context;
- mutate PostgreSQL directly;
- store protected receipt truth in browser persistence;
- claim stacked backend routes are production-live;
- collapse sample simulation into canonical Runtime execution.

## Recovery order

1. `docs/continuum-frontend-roadmap-CURRENT.md`
2. `docs/continuum-frontend-week-CURRENT.md`
3. `docs/continuum-source-truth-CURRENT.md`
4. this file
5. `control/index.html`
6. `assets/continuum-operator-api-v1.js`
7. `assets/control/control-runtime-history-v1.js`
8. `assets/continuum-exact-reference-v1.js`
9. `assets/continuum-runtime-receipt-link-v1.js`
10. current First-Repo main / open PRs
11. current `jay-app` frontend/backend integration handbook

Never infer production deployment from frontend support or mocked browser proof.
