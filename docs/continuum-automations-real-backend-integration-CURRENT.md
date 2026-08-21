# Continuum Automations real backend integration - CURRENT

Last updated: 2026-08-21, Checkpoint 4
Status: frontend integration proof on a stacked draft PR. Wired against protected backend contracts. Live/deployed acceptance is not claimed.

## Current checkpoint

- Repository: `CMXChat/First-Repo`
- Branch: `agent/lab-automations-real-backend-integration`
- Draft PR: `#121 - Connect Automations Lab to real backend contracts`
- Base: `agent/directory-server-proof-v1` / PR #120
- Checkpoint 4 starting head: `0551760446c98a0a011fc1e88aaa8f911e34611c`
- Checkpoint 1: `9bb848059e79b7787fa83f5bb114b7871e038514` - Automation identity, selectors, Draft persistence and revision conflicts
- Checkpoint 2: `3107707a1f751b340740f9f55468b476f7e330f8` - backend preflight, Review/Publish and immutable Version presentation
- Checkpoint 3: `0551760446c98a0a011fc1e88aaa8f911e34611c` - Runtime Runs, fake behaviors, Attempts, Why and pending cancellation
- Checkpoint 4: this handoff, focused contract, validation workflow and transport cleanup. Read PR #121 branch history for its exact commit SHA.

This file is the durable frontend recovery point. Do not reconstruct this work from chat history.

## Stack

1. PR #118 is the mature `/lab/automations` prototype and seven-section object/control surface.
2. PR #120 is the real `/lab/directory` Person + email ContactMethod persistence proof.
3. PR #121 adds real Automation/Draft/Version/Runtime integration inside the existing `/lab/automations` experience.

PR #121 does not modify `jay-app` backend source and does not create another Automations page.

## Classification

### REUSED

- `/lab/automations` route and visual language
- Overview, Definition, Runs, Permissions, Related, History, Settings
- `WHEN -> IF -> DO -> WAIT -> TEST`
- Action-card add/reorder/duplicate/remove interaction
- existing shell, theme, navigation and desktop/mobile behavior
- Check In cookie/session/CSRF pattern proven by PR #120

### CONSOLIDATED / ADDED

- separate `SERVER-BACKED` lane inside the existing dashboard
- Directory Person/ContactMethod, Connection/SenderIdentity and Library selectors
- one server Draft state controller with optimistic revision writes
- authoritative typed backend preflight
- real Review/Publish and immutable AutomationVersion receipts
- Runtime list/read/request/process/cancel
- Attempts, frozen execution snapshot and Why/RuntimeEvent presentation
- disposable static-Lab transport only for operations this proof consumes

### REPLACED for SERVER-BACKED Automations

- browser-generated Automation identity -> backend `automation_id`
- local canonical Draft -> backend `AutomationDraft`
- local readiness heuristic -> backend typed preflight
- local publish simulation -> backend Review/Publish + immutable `AutomationVersion`
- local simulation history -> backend Runtime Runs/Attempts/Events

### REMAINS LOCAL LAB

`cmx-lab-automations-v1` still belongs to the separate LOCAL LAB cards. Local prototypes can still contain broader unsupported Conditions, richer timing/recurrence, broader Action families, Planner/AI previews and local simulation ideas. Those concepts do not become server truth until matching typed backend contracts exist.

## Source of truth and localStorage boundary

For a SERVER-BACKED Automation, the backend owns Automation identity, `AutomationDraft`, revision, optimistic concurrency, preflight, Review, publication, immutable `AutomationVersion`, exact frozen `ContentVersion`, Runtime Run identity/status, frozen execution snapshot, Attempts, retryability/failures, Runtime/Why events and cancellation state.

Names, email addresses and labels are presentation. Stable IDs are identity.

`cmx-lab-automations-v1` must never become a cache or mirror for a SERVER-BACKED Automation, Draft, Version or Run. Browser memory may hold normal presentation state such as selected tab/stage/Run. The theme key is presentation only. Auth/API failure shows an unavailable/error state and never falls back to local canonical persistence.

## Exact file ownership

### `assets/lab/lab-automations-api-v1.js`

HTTP contract only. Chooses API base, uses `credentials: include`, reads operator session for CSRF, sends `X-CSRF-Token`, translates backend detail, and exposes only operations currently consumed by PR #121. No domain cache and no localStorage. It must remain disposable, not become a second SDK.

### `assets/lab/lab-automations-server-v1.js`

Single SERVER-BACKED Automation/Draft state owner: dashboard list/create/open, `automation_id`, resource selectors, five-stage server projection, Draft save with `expected_revision`, 409 conflict state, explicit reload, and stable Action `step_id` add/reorder/duplicate/remove.

### `assets/lab/lab-automations-server-lifecycle-v1.js`

Preflight/lifecycle/version/object-section projection: typed backend preflight, issue metadata, ContentVersion save helper, Review, Publish, immutable Version receipt, and server truth in Overview/Permissions/Related/History/Settings.

### `assets/lab/lab-automations-server-runtime-v1.js`

Runs/Attempts/Why only: list/read/request/process/cancel, fake behavior selection, frozen snapshot, Attempts/outcome/retryability/worker/lease, RuntimeEvent history and pending cancellation. Pause/Resume/Retry stay disabled.

Supporting files:

- `lab/automations/index.html` loads the accepted Lab stack first, then the server integration.
- `tests/continuum-automations-real-backend-integration.test.js` is the Checkpoint 4 source contract.
- `.github/workflows/automations-real-backend-validation.yml` runs new + preservation checks.

## Transport

On `db.cmxchat.com`, API base is `https://api.cmxchat.com/api/v1`. Elsewhere for development it is `http://localhost:8000/api/v1`.

Reads use `credentials: include` and `cache: no-store`. Mutations first read `GET /checkin/operator/session`, then send its `csrf_token` as `X-CSRF-Token`. Backend cookie/session, Origin and CSRF enforcement remain authoritative.

This adapter is disposable because First-Repo is a static proving surface. The canonical production React frontend must use the generated `jay-app` OpenAPI client and normal React server-state architecture. Do not port this static adapter/controller architecture unchanged into production.

## Exact backend endpoints consumed

Paths are relative to `/api/v1`.

| Method | Path | Purpose | Type / CSRF | Important identity / errors |
|---|---|---|---|---|
| GET | `/checkin/operator/session` | obtain protected session + CSRF | read / no | 401 if private session unavailable |
| GET | `/checkin/operator/automations` | list Automations | read / no | `automation_id`; auth/environment errors |
| POST | `/checkin/operator/automations` | create Automation + Draft | mutation / yes | returns `automation_id`; 422 validation |
| GET | `/checkin/operator/automations/{automation_id}` | details, Draft, Versions | read / no | 404 missing Automation |
| PUT | `/checkin/operator/automations/{automation_id}/draft` | save Draft | mutation / yes | `expected_revision`; 409 stale; 422 validation |
| GET | `/checkin/operator/automations/{automation_id}/preflight` | typed readiness | read / no | issue code/description/step/resource metadata |
| POST | `/checkin/operator/automations/{automation_id}/review` | move ready Draft to Review | mutation / yes | 409/422 lifecycle/readiness |
| POST | `/checkin/operator/automations/{automation_id}/publish` | immutable Version | mutation / yes | `automation_version_id`, `content_version_id` |
| POST | `/checkin/operator/automations/{automation_id}/archive` | archive Automation | mutation / yes | no duplicate/delete/restore endpoint consumed |
| GET | `/checkin/operator/directory/people` | Person selector | read / no | stable `person_id` |
| GET | `/checkin/operator/directory/people/{person_id}/contact-methods` | email selector | read / no | stable `contact_method_id`; backend owns relationship |
| GET | `/checkin/operator/connections` | Connection selector | read / no | stable `connection_id`, readiness/lifecycle |
| GET | `/checkin/operator/connections/{connection_id}/sender-identities` | sender selector | read / no | stable `sender_identity_id` |
| GET | `/checkin/operator/library` | list ContentAssets | read / no | stable `content_asset_id`, current version metadata |
| POST | `/checkin/operator/library/content/{content_asset_id}/versions` | save immutable ContentVersion | mutation / yes | returns `content_version_id`; 409/422 possible |
| GET | `/checkin/operator/automations/{automation_id}/runs` | list Runs | read / no | stable `run_id` |
| GET | `/checkin/operator/automations/{automation_id}/runs/{run_id}` | Run detail | read / no | Attempts, events, snapshot, lease/status |
| POST | `/checkin/operator/automations/{automation_id}/runs` | request manual Run | mutation / yes | `run_id`; published Version required |
| POST | `/checkin/operator/automations/{automation_id}/runs/{run_id}/process` | process fake attempt | mutation / yes | worker/attempt/outcome; 409/422 possible |
| POST | `/checkin/operator/automations/{automation_id}/runs/{run_id}/cancel` | cancel pending Run | mutation / yes | preserves history; 409 if no longer cancellable |

## Stable IDs

Canonical identities used by this proof:

- `automation_id`
- `person_id`
- `contact_method_id`
- `connection_id`
- `sender_identity_id`
- `content_asset_id`
- `content_version_id`
- `step_id`
- `automation_version_id`
- `run_id`
- attempt ID / attempt number
- Runtime event IDs when returned

Never substitute a display name or email string for these IDs.

## Draft revision and stale 409 flow

1. Read Automation details and current `draft.revision`.
2. User edits an incomplete or complete Draft.
3. Send `PUT .../draft` with `{ expected_revision, definition }`.
4. On success replace in-memory Draft with the returned Draft/revision.
5. On HTTP 409 show `Draft changed elsewhere`, retain attempted definition in memory as conflict context, and do not silently overwrite.
6. `Reload server Draft` explicitly rereads current backend state and clears the conflict.

Draft save does not Review, Publish or execute. Incomplete Drafts remain editable/saveable.

## Preflight flow

TEST requests backend preflight. Backend `ready` and typed issues are authoritative. Render `code` and `description`, retain `step_id`, `resource_type`, `resource_id` where supplied, and use display labels only for comprehension. Local Lab readiness never overrides this result.

The consumed backend slice rejects non-empty Conditions, so SERVER-BACKED IF remains visible but persists `conditions: []` until typed Conditions exist.

## Review, Publish and immutable Version flow

1. Draft can remain incomplete while authoring.
2. Backend preflight must be ready.
3. Protected Review changes lifecycle to Review.
4. Protected Publish creates immutable `AutomationVersion`.
5. Refresh details and render a read-only publication receipt.
6. Publish freezes the exact current `ContentVersion` plus Person, ContactMethod, Connection, SenderIdentity, ContentAsset and Action step IDs.
7. Later Draft/content edits do not visually mutate an old published Version.

## Runtime, cancel, Attempts and Why

Current PR #121 Runtime UX is manual and primarily fake-provider proof:

1. Automation needs a current published Version.
2. Choose fake behavior.
3. Request manual Run.
4. Backend creates durable Run + frozen execution snapshot.
5. List/read Run.
6. Process one backend attempt at a time.
7. Render status, Attempts, lease/worker data and Why events.
8. Cancel only while pending through the real cancel mutation, then reread state.

The current fake Runtime contract executes exactly one published Email Action per Run. Draft UI can retain multi-action editing; Runs states the execution limit truthfully.

Supported fake behaviors:

- `accepted` - success / fake logical delivery
- `transient_once` - one retryable failure, then a later successful attempt when processed again
- `permanent_failure` - terminal failure

Runs presents Run ID/status, AutomationVersion ID, action status, attempt count, lease owner/expiry when available, frozen Person/contact, Connection/SenderIdentity, exact ContentVersion, provider/fake-side-effect indication, Attempt outcome/retryability/worker/failure/receipt, RuntimeEvent type/time/summary, and cancellation/failure state. Raw JSON is secondary under Developer details.

Unsupported controls remain disabled until matching protected APIs exist: Pause, Resume, Retry failed step, protected duplicate/delete/restore, metadata update and broader unattended/Authority controls.

## Auth/session failure behavior

- 401: private operator access required
- 403: protected rejection/detail
- 404: API/object unavailable
- 409: explicit stale/conflict state
- 422: backend validation/detail

There is no canonical local persistence fallback for a failed server request.

## Real provider backend context - document only

Later stacked `jay-app` work, including PR #20, proves bounded real SMTP behind the same durable Runtime boundary with protected Connection binding and exact SenderIdentity. It distinguishes accepted, retryable failure, permanent failure and ambiguous provider outcomes. Ambiguous acceptance fails closed and must not be auto-retried as though delivery were known absent.

PR #121 does not add real-provider browser logic, does not send email and does not claim real-provider backend work is deployed. Its current Runtime UI is validated primarily around the manual fake-provider contract already consumed here. Future frontend work should consume the canonical backend API handbook/generated client when that stack is approved, not add SMTP-specific browser logic.

## Intended acceptance demo

When the required backend stack is actually available:

1. open `/lab/directory`
2. create/select real Person
3. create/select real email ContactMethod
4. open `/lab/automations`
5. create SERVER-BACKED Automation
6. receive stable `automation_id`
7. choose the same Person/contact
8. choose Connection
9. choose SenderIdentity
10. choose Content
11. save incomplete Draft
12. reload
13. reopen the same Draft
14. run preflight
15. fix blockers
16. Review
17. Publish
18. inspect immutable AutomationVersion
19. request manual fake Run
20. process success / fail-once / permanent-failure scenarios
21. inspect Attempts/Why
22. cancel a pending Run when applicable

`WIRED AGAINST REAL CONTRACT` means the frontend calls/models the actual protected contract. `LIVE ACCEPTANCE PROVEN` additionally requires the target backend stack to be deployed/reachable and the end-to-end browser flow to have actually been exercised there. Do not infer the second from the first.

## Validation and preservation

Checkpoint 4 requires:

- new real-backend Automations source contract
- syntax checks for API/server/lifecycle/runtime controllers
- existing v10/v10.1 Automations contracts
- v5 model/flow/sequence/scenario parse checks
- desktop/mobile object/navigation preservation
- all seven object sections
- `WHEN -> IF -> DO -> WAIT -> TEST`
- PR #120 Directory server-proof contract
- standalone Directory contract
- shared Continuum shell contract
- `git diff --check`

Do not weaken an accepted assertion to make integration work pass. Fix the integration if preservation fails.

## Continuing without Codex

Change HTTP calls only in `assets/lab/lab-automations-api-v1.js`.

Change server Automation/Draft state, selectors or builder persistence only in `assets/lab/lab-automations-server-v1.js`.

Change preflight, Review/Publish and Version/history/related presentation only in `assets/lab/lab-automations-server-lifecycle-v1.js`.

Change Runs, Attempts, Why or cancellation presentation only in `assets/lab/lab-automations-server-runtime-v1.js`.

Guardrails:

- DO NOT put canonical server objects into localStorage.
- DO NOT duplicate backend readiness/business rules in the browser.
- DO NOT create a second Automations page.
- DO NOT add backend/provider calls outside the thin transport.
- DO NOT turn names/emails into identity.
- DO NOT claim unsupported controls work.
- DO NOT port this static adapter/controller architecture unchanged into final React.
- Final React uses the generated `jay-app` OpenAPI client and normal React server-state architecture.

## Known gaps after Checkpoint 4

- backend stack may not be deployed to `api.cmxchat.com`; live acceptance remains separate
- current fake Runtime executes exactly one published Email Action per Run
- typed Conditions remain unsupported in the consumed slice
- no protected Pause/Resume/manual Retry UI endpoint
- no protected Automation duplicate/delete/restore/metadata-update endpoint in consumed contract
- no Authority UI or unattended execution in PR #121
- real-provider/reconciliation UI intentionally not started
- canonical React migration intentionally not started

## Stop boundary

Checkpoint 4 ends this PR #121 frontend slice. Do not start real-provider UI, reconciliation UI, Authority UI, Check In integration, AI/Planner, Organizations/Groups backend integration, final `/automations`, or another redesign without a new reviewed frontend task.
