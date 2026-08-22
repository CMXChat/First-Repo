# Continuum Frontend — CURRENT

Authority: **FRONTEND IMPLEMENTATION / WIRING TRUTH**
Last verified: **2026-08-22**
Repository: `CMXChat/First-Repo`

For overall production/source status, read `PROJECT-STATUS-CURRENT.md` first.

This document answers:

> Which canonical pages exist, which ones really call the backend, which parts are still browser-local previews, and how the surfaces connect to one another?

It supersedes older frontend-week/source-truth checkpoint summaries for current wiring questions. Those files remain useful history/evidence and must not be deleted casually.

## Frontend design rule

**One backend, many interfaces.**

Pages are projections over the same durable IDs and services, not separate databases or separate execution engines.

The desired user-visible chain is:

`Directory → Library → Automation → Runtime → receipt/Why → Control`

with Email and Requests acting as concrete interfaces over the same objects.

## Status terms

- **LIVE** — deployed and verified.
- **WIRED** — the frontend actually calls the real protected backend contract.
- **STACKED** — the backend contract/source exists but is not production-deployed.
- **PREVIEW** — local/sample product behavior, not durable backend truth.
- **PLANNED** — not implemented yet.

A route may be `WIRED + STACKED`.

## Shared protected browser transport

Primary shared proof adapter:

`assets/continuum-operator-api-v1.js`

On `db.cmxchat.com` it targets:

`https://api.cmxchat.com/api/v1`

Development defaults to:

`http://localhost:8000/api/v1`

Security behavior:

- protected cookie session from backend;
- `credentials: include`;
- `cache: no-store`;
- protected mutations obtain CSRF from the operator session and send `X-CSRF-Token`;
- exact allowed Origin remains backend-enforced;
- operator key is submitted directly to backend and cleared;
- no operator key, CSRF, provider credential or canonical protected record is intentionally stored as browser-owned truth.

Current shared operations include:

- session/unlock/logout;
- Person list/create/update;
- ContactMethod list/create/lifecycle;
- Connection list;
- SenderIdentity list;
- Connection readiness;
- Library list/create/read/Draft update/Version save;
- Automation list/create/read/Draft update/preflight/Review/Publish;
- Runtime list/request/process/read/receipt.

The static adapters are proving infrastructure. The final official React application should use the generated `jay-app` OpenAPI client and ordinary server-state architecture.

## `/checkin/`

Classification: **LIVE**

The protected Check In frontend talks to the production Phase 1 backend for:

- switch state;
- policy/timing;
- Incident state;
- operator session;
- protected records/activity/audit behavior supported by Phase 1.

Important boundary:

A triggered Incident does not mean Email/Runtime/AI work occurred. Production currently lacks the broader stacked execution stack.

Do not blur Check In's genuinely LIVE boundary with the STACKED status of newer domains.

## `/directory/`

Classification: **WIRED + STACKED**, with richer **PREVIEW** concepts

Protected lane:

- reads backend People;
- creates/updates Person records;
- lists/creates email ContactMethods;
- updates ContactMethod lifecycle;
- preserves backend UUID identity;
- renders backend errors/conflicts instead of inventing local success;
- uses the shared operator session transport;
- supports exact focus through `?person_id=<UUID>` after protected data loads.

Browser/local concepts that are not yet equivalent backend truth include richer Organizations, Groups, Labels/audiences and broader relationship behavior.

If the production operator session works but Directory endpoints return 404, the page must show an unavailable/not-deployed state rather than creating fake server People.

Key current docs:

- `docs/continuum-directory-server-proof-CURRENT.md`
- `docs/continuum-directory-standalone-CURRENT.md`

## `/library/`

Classification: **WIRED + STACKED**, with separate **PREVIEW** workspace

Protected durable-memory lane:

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

Current browser integration can:

- list backend content;
- create ContentAsset + Draft;
- read Content details;
- update Draft with exact `expected_revision`;
- treat stale revision as backend `409` rather than overwrite;
- preserve unsaved text while the user deliberately reloads/reconciles;
- freeze immutable ContentVersion;
- show exact IDs/revision/checksum/dependency facts returned by backend;
- focus an exact protected ContentAsset from `?content_id=<UUID>`.

The older mixed-media/folders/files/import/browser workspace remains a separate PREVIEW unless backed by an explicit server contract. Binary object storage is not implied by the text/ContentVersion backend.

Key current doc:

- `docs/continuum-library-lab-CURRENT.md`

## `/automations/`

Classification: **WIRED + STACKED** for the SERVER-BACKED lane; broader editor capabilities remain partly **PREVIEW**

The canonical route loads the mature builder/prototype stack plus the backend integration controllers.

Backend adapter:

`assets/lab/lab-automations-api-v1.js`

Server-backed state owner:

`assets/lab/lab-automations-server-v1.js`

Lifecycle/version projection:

`assets/lab/lab-automations-server-lifecycle-v1.js`

Runtime projection:

`assets/lab/lab-automations-server-runtime-v1.js`

### Server-backed Automation truth

The backend owns:

- `automation_id`;
- Automation lifecycle;
- mutable AutomationDraft and revision;
- stale-write `409` behavior;
- typed preflight;
- Review;
- immutable AutomationVersion Publish;
- exact frozen ContentVersion/reference IDs;
- Runtime Run IDs/status;
- Attempts;
- Why/events;
- cancellation state where supported.

Server-backed frontend operations include:

- list/create/open Automation;
- save Draft with `expected_revision`;
- choose protected Person/ContactMethod/Connection/SenderIdentity/Content resources;
- call authoritative preflight;
- Review/Publish;
- list/read/request/process/cancel development Runtime work;
- inspect Attempts/Why.

### Local preview truth

The richer workflow builder still contains browser/prototype concepts that do not all have matching backend contracts, including parts of:

- richer Conditions;
- advanced IF/WAIT sequencing;
- Audience beyond implemented Person/email identity;
- Planner previews;
- broader Action families;
- Signals/Observation concepts;
- some lifecycle/management operations.

`cmx-lab-automations-v1` may remain for explicitly local cards. It must never become a fallback cache for a failed SERVER-BACKED Automation.

The final React application must migrate accepted semantics, not copy the current DOM/localStorage/static-controller architecture.

Current detailed server integration handoff:

- `docs/continuum-automations-real-backend-integration-CURRENT.md`

Important stale-history warning:

- `docs/checkin-automations-frontend-CURRENT.md` describes an older Lab-era checkpoint and must not override the canonical route/backend integration truth in this document.

### Open visual redesign

PR #131 contains the owner-approved direction to give the Definition builder more viewport space. At the checked state it is behind/conflicted with current main and must be reconciled rather than force-merged.

## `/email/`

Classification: **WIRED + STACKED**

Email is the flagship manual action proof.

Current intended frontend chain:

`protected session`
→ `Person + email ContactMethod`
→ `Connection + SenderIdentity + readiness`
→ `ContentAsset + Draft`
→ `immutable ContentVersion`
→ `manual Email Automation Draft`
→ `preflight`
→ `Review`
→ `Publish AutomationVersion`
→ `Runtime Run(provider_mode=fake)`
→ `explicit development process where available`
→ `typed frozen receipt`

Browser never talks directly to SMTP or receives provider credentials.

Current frontend acceptance is safe simulation: internal durable workflow is real at the API boundary used by the proof while the final provider effect is simulated.

The stacked backend also contains bounded real SMTP under direct manual-owner initiation, but that does not make real SMTP production-live or authorize unattended SMTP.

Receipt handoff:

`Open this Run in Control`

→ `/control/?automation_id=<UUID>&run_id=<UUID>`

Only opaque IDs are placed in the URL.

Key current doc:

- `docs/continuum-email-lab-CURRENT.md`

## `/requests/`

Classification: **WIRED + STACKED**

Requests is a bounded operator doorway, not a direct DB console, generic HTTP proxy or unrestricted AI agent.

### Contacts mode

`paste`
→ deterministic local parse
→ preview with zero writes
→ explicit approval
→ backend Person create
→ backend email ContactMethod create
→ exact durable IDs/failure result

Sequential writes are not falsely described as one transaction. Partial durable progress is surfaced.

### Email mode

Preview performs reads only and resolves exact:

- Person;
- email ContactMethod;
- Connection;
- SenderIdentity;
- readiness.

Approval uses the same canonical Library → Automation → Runtime safe-simulation chain as `/email/`.

Requests never offers `real_smtp` in the current browser workflow.

After a typed receipt is read it can open the exact Run in Control.

General natural-language AI interpretation remains PLANNED. Future AI may translate intent into typed proposed operations, but it does not gain permission or bypass preview/Authority/backend validation.

Key current doc:

- `docs/continuum-requests-CURRENT.md`

## `/control/`

Classification: **WIRED + STACKED** for protected history; operational dashboard remains partly **PREVIEW**

Control deliberately has two truth lanes.

### Protected Runtime history

Read-only flow:

`Automation list → Runs → exact frozen Runtime receipt`

It can render:

- Run and Automation IDs;
- immutable AutomationVersion;
- exact Person/ContactMethod;
- Connection/SenderIdentity;
- ContentAsset/ContentVersion/checksum;
- provider mode;
- manual vs exact Authority mode;
- optional AuthorityGrant/AuthorityGrantVersion;
- optional Incident/TriggerOccurrence;
- Attempts;
- Why/events;
- reconciliation evidence.

This lane does not request/process/cancel/retry/reconcile/resend work.

### Sample operational preview

Now/Upcoming/attention/connection-health/simulation cards remain explicit sample/proving UI and must not be interpreted as production operational state.

### Exact-reference navigation

Control can point to:

- `/directory/?person_id=<UUID>`
- `/library/?content_id=<UUID>`
- `/automations/`

Email and Requests can point back to the exact Run in Control.

Key current doc:

- `docs/continuum-control-center-lab-CURRENT.md`

## `/spaces/`

Classification: primarily **PREVIEW**

Spaces is the context/briefing experience. Preserve the product direction, but do not invent backend integration just to make it match other pages. Connect features only when a real typed contract exists.

## `/doc/`

Classification: product explanation

`/doc/` is not an operational backend client. It explains Continuum and may show LIVE/STACKED/PREVIEW/PLANNED capability status, but must not turn future architecture into a deployment claim.

Open PR #130 contains useful vision-refresh ideas, but its checked branch state is behind/conflicted and must be reconciled against current main before any merge.

## Cross-surface exact identity

The most important frontend convergence already landed is that the same durable object can be followed between views.

Current links:

`Email / Requests receipt`
→ `/control/?automation_id=<Automation UUID>&run_id=<Run UUID>`

`Control Person reference`
→ `/directory/?person_id=<Person UUID>`

`Control Content reference`
→ `/library/?content_id=<ContentAsset UUID>`

These query parameters are navigation pointers only. The destination still requires normal protected session/authorization.

## Production failure behavior

A valid current state is:

`operator unlock works`
→ `newer domain endpoint returns 404`
→ page says `NOT DEPLOYED`

That means the frontend and production-live Check In session foundation are working while the newer stacked backend route has not been deployed.

Never replace that with local fake server success.

## Current frontend validation evidence

The merged frontend program through PR #144 records focused green validation for the newer connected slices, including:

- Email validation;
- Requests validation;
- Runtime receipt navigation validation;
- Control protected Runtime browser proof;
- Directory server proof;
- Library validation;
- source-truth/static/navigation/archive/secret checks.

Browser proofs that mock the backend validate browser orchestration and safety behavior. They do not prove the production backend is deployed.

Known unrelated repository-wide baseline checks may still fail and should be investigated on their own merits rather than used to rewrite a passing domain contract blindly.

## What frontend work should do next

Prefer convergence over new disconnected surfaces:

1. keep shared protected-session/deployment-state language consistent;
2. reconcile PR #131 with current main and visually validate the Automation builder layout;
3. reconcile `/doc/` vision work without losing current accepted explanation;
4. improve understandability of Runtime/receipt/history relationships;
5. add Requests adapters only for already-verified typed backend contracts;
6. connect Check In to newer domains only when the backend production/release boundary permits it;
7. maintain a classified production-vs-stacked gap list for backend deployment work.

Do not compensate for a missing backend endpoint by inventing browser authority, execution, persistence or scheduling.
