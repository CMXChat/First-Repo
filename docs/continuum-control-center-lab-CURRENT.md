# Continuum Control Center — CURRENT

Date: 2026-08-22
Route: `/control/`
Status: **MIXED TRUTH SURFACE — protected Runtime history frontend proof + explicit sample operational preview**

## Role

Control is where Continuum should make durable action history understandable.

The useful question is no longer only “what does the dashboard look like?” It is:

> What happened, why did it happen, and which exact durable objects were involved?

The current proof-driven frontend week now has three strong primitives:

`Directory = durable identity`

`Library = durable memory`

`Email / Requests = durable action orchestration`

Control’s next job is to make the resulting action history legible across those primitives.

## Current truth split

Canonical `/control/` deliberately contains two different truth lanes.

### 1. Protected Runtime history lane

The **History** view now injects a read-only protected Runtime/receipt lane using the shared operator session and existing stacked backend contracts.

When those backend routes are deployed, the lane reads:

`Automation list → Runtime Runs → exact frozen Runtime receipt`

It does not start or process Runs.

It does not cancel work.

It does not retry Attempts.

It does not reconcile provider ambiguity.

It does not resend an external effect.

It does not create a second Runtime.

### 2. Operational preview lane

The existing Now, Upcoming, sample connection/source health, quiet-state preview, continuity-health examples and local simulation remain **sample/proving UI**.

Those panels do not become production truth merely because the protected Runtime history lane exists beside them.

The page must keep that distinction visible.

## Backend contract used

The current canonical backend handbook is:

`CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md`

on the active stacked backend ref `dev/durable-trigger-consumption` / draft PR #24.

Relevant protected reads:

- `GET /api/v1/checkin/operator/automations`
- `GET /api/v1/checkin/operator/automations/{automation_id}/runs`
- `GET /api/v1/checkin/operator/automations/{automation_id}/runs/{run_id}/receipt`

The frontend uses `assets/continuum-operator-api-v1.js` for the protected cookie-session contract and error classification.

## Production boundary

The operator session / Check In foundation is production-live.

The newer Automation, Runtime and receipt contracts used by the protected History lane remain **stacked implementation**, not production deployment.

Therefore this is a valid production state:

`protected session connected → Automation/Runtime route returns 404 → Control says NOT DEPLOYED`

That is a deployment boundary.

It must not cause Control to invent local Runtime records.

Frontend readiness is not a claim that production currently exposes Runtime history.

## What the Runtime receipt proves

The stacked backend `RuntimeExecutionReceiptPublic` freezes the exact execution references needed for a trustworthy explanation.

The Control history lane renders, when present:

- Run ID;
- Automation ID;
- immutable AutomationVersion ID;
- Person ID and frozen display name;
- ContactMethod ID and frozen recipient address;
- Connection ID and frozen display name;
- SenderIdentity ID and frozen sender address/display name;
- ContentAsset ID;
- immutable ContentVersion ID;
- Content checksum;
- content subject;
- provider mode;
- Run/action status;
- manual-owner vs exact Check In authority mode;
- optional AuthorityGrant / AuthorityGrantVersion;
- optional Check In Incident;
- optional TriggerOccurrence;
- Attempts;
- Runtime events / Why timeline;
- provider-operation reconciliation state where relevant.

The important rule is:

**historical execution is rendered from the frozen receipt, not from whatever Directory or Library happens to say today.**

A Person can later be renamed and a Draft can later change. The receipt still explains the identity/content snapshot used for that exact Run.

## Cross-surface reference direction

Control now exposes exact-reference navigation where the corresponding canonical surface exists.

Examples:

`Person ID → /directory/?person_id=<exact UUID>`

`ContentAsset ID → /library/?content_id=<exact UUID>`

`Automation → /automations/`

The query parameters are a frontend navigation hint only. They do not grant access or authority. The destination must still load the protected object from the backend and handle missing/not-deployed state normally.

A follow-up slice can make Directory and Library actively focus the requested exact ID after their protected data loads.

## Protected session behavior

Control uses the same protected session model as Email, Requests, Directory and Library:

1. backend-issued secure cookie establishes the operator session;
2. exact allowed Origin is enforced by the backend;
3. mutations elsewhere require CSRF;
4. this Runtime history lane performs reads only.

If locked, Control shows an inline operator unlock form.

The operator key is sent directly to the backend and cleared immediately.

No operator key, CSRF token, frozen receipt, protected IDs or private addresses are intentionally persisted to localStorage/sessionStorage by this lane.

Control may still retain its old route-local theme preference. A visual preference is not canonical protected Runtime truth.

## Files

Current protected Runtime history slice:

- `control/index.html`
- `assets/continuum-operator-api-v1.js`
- `assets/control/control-runtime-history-v1.js`
- `assets/control/control-runtime-history-v1.css`
- `tests/continuum-control-runtime-history-v1.test.js`
- `tests/continuum-control-runtime-history-v1-browser.js`
- `.github/workflows/control-center-lab-validation.yml`

Existing Control sample/proving implementation remains in:

- `assets/lab/control-center-v1.js`
- `assets/lab/control-center-v1.css`
- `assets/lab/control-center-mobile-polish-v2.css`
- `assets/lab/control-center-interaction-v3.css`
- `assets/lab/control-center-focus-v4.js`
- `assets/lab/control-center-focus-v4.css`

The `assets/lab/` filename is implementation history. The active route is `/control/`.

## Validation target

Focused validation should prove:

- canonical active navigation uses `/control/`, `/directory/`, `/library/` and `/automations/`;
- desktop and mobile can go locked → unlock → protected Automation/Run listing;
- selecting a Run fetches the typed frozen receipt;
- exact Person/ContactMethod/Connection/Sender/Content/Automation/Run IDs render;
- Attempts and Why events render;
- exact Person and ContentAsset navigation hints are preserved;
- the operator key is cleared;
- protected values do not enter localStorage/sessionStorage;
- no Runtime mutation occurs from the history lane;
- a 404 is shown as a truthful not-deployed boundary rather than fake history;
- the existing local simulation remains isolated from protected Runtime truth.

Browser proof uses a mocked API boundary. It proves frontend orchestration and rendering semantics, not production deployment.

## Why this matters

Without a receipt surface, a user sees “Email succeeded” and has to trust a vague sentence.

With the durable chain, Continuum can explain:

`Person 444… → ContactMethod 555… → ContentVersion 999… → AutomationVersion 222… → Run 333… → Attempt → receipt`

That is much more than a log line. It means the system can answer:

- who was involved;
- which address was used;
- which exact frozen content was used;
- which immutable Automation definition ran;
- who/what initiated it;
- whether authority was manual or delegated;
- what the provider boundary reported;
- whether retries happened;
- whether ambiguity/reconciliation exists;
- what the Runtime recorded and why.

That is the beginning of explainable durable action.

## Current product loop

The proof-driven frontend loop is now:

`Requests → Directory identity → Library durable memory → Email/Automations define work → Runtime → Control receipt / Why`

The next high-value frontend step is to make the exact Person/Content links actively focus those same protected objects on Directory and Library, then add an “Open in Control” handoff from Email/Requests receipts where a Run exists.

Avoid changing the active Automation editor while First-Repo PR #131 remains open unless that work is deliberately reconciled first.

## No-go shortcuts

Do not use Control to:

- create browser-local fake Runtime history;
- execute or process Runs as a hidden side effect of viewing history;
- automatically retry ambiguous provider work;
- manufacture Authority from receipt context;
- mutate PostgreSQL directly;
- store protected receipt truth in browser persistence;
- claim stacked backend routes are production-live;
- collapse the local simulation preview into canonical Runtime execution.

## Recovery order

When resuming Control work:

1. `docs/continuum-frontend-roadmap-CURRENT.md`
2. `docs/continuum-frontend-week-CURRENT.md`
3. `docs/continuum-source-truth-CURRENT.md`
4. this file
5. `control/index.html`
6. `assets/continuum-operator-api-v1.js`
7. `assets/control/control-runtime-history-v1.js`
8. current First-Repo main / open PRs
9. current `CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md` on the active stacked backend ref

Never infer production deployment from frontend support or mocked browser proof.
