# Continuum live frontend acceptance - CURRENT

Last updated: 2026-08-21
Purpose: practical browser checklist for the existing PR #120 + PR #121 frontend integration. This is not a backend architecture or API contract document.

## Scope

Accept only the frontend that already exists:

- `/lab/directory`: protected Person + email ContactMethod persistence proof from PR #120
- `/lab/automations`: SERVER-BACKED Automation Draft, typed preflight, Review/Publish, immutable Version, fake Runtime Runs/Attempts/Why and pending cancellation from PR #121

Do not use this run for reconciliation, real-provider UI, Authority, Check In product work, AI/Planner, Organizations/Groups backend work, another Automations route, or production React migration.

## Environment prerequisites

Before calling anything live acceptance:

- The deployed backend must include the exact protected Directory, Automation, Library and fake Runtime/cancel endpoints already consumed by PR #121. Later provider/reconciliation/Authority work is not required for this acceptance and must not be inferred.
- Backend migrations required by that deployed stack must be current. Record the migration head in the evidence template.
- Production Lab API base must resolve to `https://api.cmxchat.com/api/v1`. Local development uses `http://localhost:8000/api/v1`.
- `db.cmxchat.com` must be able to reach the API origin under the backend's allowed Origin/CORS policy.
- A valid protected Check In operator session cookie must exist. Reads use that cookie. Mutations first read `/checkin/operator/session`, obtain `csrf_token`, then send `X-CSRF-Token`.
- No provider credentials, SMTP secrets, tokens or other backend secrets should appear in browser source, storage, request payloads or responses.
- Required frontend stack is PR #118 -> PR #120 -> PR #121, using the latest reviewed PR #121 head. PR #121 is stacked on PR #120 and includes the Directory proof.
- The current PR #121 acceptance target is the fake-provider/manual Runtime contract. Do not send a real email during this run.
- Because backend work is still moving, compare the deployed backend release with the canonical backend API handbook once that handbook is declared current. If it differs from the endpoints consumed by PR #121, stop and reconcile contracts before testing. Do not guess.

## Before authentication

1. Open `/lab/directory` without a valid protected operator session.
2. Expected: People shows a truthful protected-server unavailable state.
3. Expected: no browser-local Person is substituted as canonical server data.
4. Organizations/Groups may remain visibly local Lab concepts, but they must not be presented as the missing protected People result.
5. Unlock/authenticate through the existing protected Check In flow.
6. Return to Directory and use `Reload server` or reload the page.
7. Expected: protected People load from the API.

If the pre-auth state shows local People as though they came from the server, stop. That is a failure.

## Directory acceptance

### Person create and durable identity

1. In People, choose `New person`.
2. Enter a recognizable temporary acceptance name.
3. Save.
4. Record the returned backend `person_id` from the UI/network response.
5. Expected: the selected Person is the server-created record and its backend UUID is the canonical identity.
6. Edit the Person display name and save.
7. Expected: only presentation data changes; `person_id` remains identical.
8. Reload the page.
9. Locate/select the same Person.
10. Expected: the same `person_id` is returned after reload and the renamed display name persists.

PASS evidence: one stable `person_id` before and after rename + reload.

### Email ContactMethod create and lifecycle

1. On the accepted Person, choose `Add email`.
2. Add a valid temporary test email address.
3. Save.
4. Record the returned backend `contact_method_id` from the success UI/network response.
5. Expected: address is presentation data; `contact_method_id` is canonical identity.
6. Reload Directory and reopen the same Person.
7. Expected: the same email ContactMethod returns from the protected backend with the same `contact_method_id`.
8. Choose `Disable`.
9. Expected: lifecycle becomes `disabled`; the ContactMethod is not recreated under a new ID.
10. Reload and verify the disabled state persists.
11. Choose `Reactivate`.
12. Expected: lifecycle becomes `active` again with the same `contact_method_id`.
13. Reload once more and verify active state persists.

If the ContactMethod request itself fails, the UI must say ContactMethods are unavailable. A failed request must not be interpreted as `0` contacts or `Not set`.

PASS evidence: one stable `contact_method_id` across create, reload, disable, reload, reactivate and reload.

## Automations acceptance

Open `/lab/automations` after the Directory proof is green.

### Server lane and Automation identity

1. Confirm the dashboard visibly separates `SERVER-BACKED / Real Automations` from the existing LOCAL LAB prototypes.
2. Create a new real Automation.
3. Record the returned backend `automation_id`.
4. Expected: no record with that identity is written into `cmx-lab-automations-v1`.
5. Exit/reload Automations.
6. Reopen the same server-backed Automation.
7. Expected: the same `automation_id` and backend Draft return.

### Progressive Draft and resource identity

Use the existing `WHEN -> IF -> DO -> WAIT -> TEST` flow.

1. Save at least one intentionally incomplete Draft state before filling every required field.
2. Expected: backend accepts progressive/incomplete authoring where allowed by the current contract.
3. In DO, add an Email action.
4. Select the same Directory Person by `person_id`.
5. Select that Person's exact email ContactMethod by `contact_method_id`.
6. Select a real protected Connection by `connection_id`.
7. Select one of that Connection's SenderIdentities by `sender_identity_id`.
8. Select existing Library content by `content_asset_id`.
9. Complete the currently supported trigger/start/finish fields as needed for preflight.
10. Observe the Draft revision after a successful save.
11. Make another change.
12. Expected: the backend-returned Draft revision increments and becomes the next `expected_revision` source.
13. Reload and reopen the Automation.
14. Expected: selections persist as backend IDs and resolve back to human labels.

If a protected Person/ContactMethod/Connection/Sender/Content selector request fails, the UI must expose the selector/resource failure. Do not treat a failed resource request as proof that the option does not exist.

### Stale Draft revision / HTTP 409

Use two browser tabs so the stale state is real rather than fabricated.

1. Open the same SERVER-BACKED Automation in Tab A and Tab B at the same Draft revision `N`.
2. In Tab A, make one valid Draft change and let it save.
3. Confirm Tab A now shows revision `N+1`.
4. Without reloading Tab B, make a Draft change there.
5. Expected network result: `PUT .../draft` returns HTTP 409 because Tab B sent stale `expected_revision: N`.
6. Expected UI: `Draft changed elsewhere` remains visible. It must not say `Saved` and must not silently overwrite the server Draft.
7. Choose `Reload server Draft` in Tab B.
8. Expected: Tab B rereads the current server Draft, clears conflict state and shows the backend revision/current definition.

PASS evidence: observed 409 plus explicit recovery without silent overwrite.

### Save failure truth

During acceptance, if a non-409 Draft mutation fails because of auth/network/validation:

- the UI must say `Save failed` / `Draft save failed`;
- it must not label that mutation `Saved`;
- while one Draft save is in flight, the mutation surface must not accept a second edit that can be silently dropped.

This is a correctness check, not a requirement to manufacture a network outage.

## Preflight acceptance

1. Go to TEST.
2. Refresh backend preflight.
3. Expected when backend preflight is readable: header says backend preflight is authoritative.
4. For every blocker, verify the UI preserves the backend issue `code` and `description`.
5. Where supplied, verify `step_id`, `resource_type` and `resource_id` remain available in the presentation.
6. Fix blockers through the supported current controls.
7. Repeat until backend reports ready.
8. Expected: local Lab readiness never overrides a backend blocker.
9. If the preflight request itself fails, expected UI is `BACKEND PREFLIGHT · UNAVAILABLE`; Review and Publish stay disabled. A transport/auth failure must not be presented as a typed backend blocker.

PASS evidence: one real blocker-to-ready cycle, or a ready result with the backend response recorded if no blocker can safely be produced.

## Review and Publish acceptance

1. With authoritative preflight ready, choose `Move to Review`.
2. Expected: protected Review operation succeeds and lifecycle reflects server state.
3. Choose `Publish immutable Version`.
4. Record `automation_version_id`.
5. Record the frozen `content_version_id` shown in the published receipt.
6. Expected: receipt is read-only and visibly immutable.
7. Record its source Draft revision.
8. Make a later Draft edit after publication if the backend lifecycle permits it.
9. Reopen History/Overview.
10. Expected: the prior AutomationVersion still shows its original IDs and frozen ContentVersion. Later Draft/content edits do not visually rewrite that Version.

PASS evidence: immutable `automation_version_id` + exact frozen `content_version_id` remain unchanged after later Draft work.

## Runtime acceptance

Use only the fake/manual Runtime controls exposed by PR #121.

### Fake success

1. Select `SUCCESS · accepted`.
2. Request a manual Run.
3. Record `run_id` and the published `automation_version_id` used by the Run.
4. Before processing, verify Run is pending and a frozen execution snapshot exists.
5. Choose `Process fake work`.
6. Expected: Run reaches success according to the backend response.
7. Inspect Attempts.
8. Expected: attempt number, worker, outcome, retryability and fake delivery/receipt data are preserved when supplied.
9. Inspect `WHY · RUNTIME EVENTS`.
10. Expected: durable event history explains the Run transition.

### Fail once

1. Select `FAIL ONCE · transient then success`.
2. Request a new Run.
3. Process once.
4. Expected: first Attempt records a retryable/transient failure and Run remains eligible for another manual process under the current fake contract.
5. Inspect Attempts and Why before the second process.
6. Process again.
7. Expected: a second Attempt is appended; earlier failure history remains; Run reaches success.
8. Verify attempt 1 was not overwritten by attempt 2.

### Permanent failure

1. Select `PERMANENT FAILURE`.
2. Request a new Run.
3. Process once.
4. Expected: Run becomes terminally failed.
5. Verify Attempt outcome is non-retryable as returned by backend.
6. Verify failure class/message and Why history remain visible.
7. `Retry failed step` must remain disabled because PR #121 consumes no such endpoint.

### Cancel pending

1. Request a fresh manual fake Run.
2. Do not process it.
3. Confirm status is pending.
4. Choose `Cancel pending Run`.
5. Expected: backend cancellation succeeds and Run becomes cancelled according to the current contract.
6. Reload Runs.
7. Expected: cancelled Run remains in durable history with its events; cancellation does not erase the Run.
8. Pause, Resume and Retry failed step remain disabled.

### Runtime failure truth

If the protected Runtime list/detail reload fails, the UI must show Runtime unavailable and must not keep old cached Run history on screen as though it were current. Restore access and use `Refresh` to reread backend truth.

## Expected network calls

The exact endpoint inventory consumed by PR #121 is already maintained in:

`docs/continuum-automations-real-backend-integration-CURRENT.md` -> `## Exact backend endpoints consumed`

Use that list during DevTools/network inspection. Do not duplicate schemas from the backend into this runbook.

For acceptance, expect calls in these existing groups only:

- protected operator session / CSRF
- Directory People + ContactMethods
- Automations list/create/details/Draft/preflight/Review/Publish
- Connections + SenderIdentities
- Library list + current ContentVersion save when required by existing preflight handling
- Runs list/detail/request/process/cancel

Any new reconciliation, provider-mode, Authority, Planner or other endpoint call is outside this runbook and should be treated as unexpected until a later reviewed frontend slice.

## Failure diagnostics

| Symptom | Check first | Required frontend behavior |
|---|---|---|
| 401 / 403 | operator session, cookie, exact Origin/CORS, CSRF session/token | show protected access failure; never substitute local canonical data |
| mutation CSRF failure | `/checkin/operator/session`, returned `csrf_token`, `X-CSRF-Token`, Origin | mutation remains failed and visible |
| 404 | deployed backend stack/version and requested object ID | show API/object unavailable; do not invent support |
| Draft 409 | competing tab/client changed Draft revision | show `Draft changed elsewhere`; require explicit server reload |
| 422 | backend validation or typed preflight blocker | display backend detail/code; do not duplicate backend rule logic |
| preflight request failure | auth/API reachability | show preflight unavailable; keep Review/Publish disabled |
| empty selector with failed request | Person/Contact/Connection/Sender/Library network call | treat as unavailable, not confirmed empty |
| Runtime refresh failure | API/session/CORS/reachability | hide stale cached Runtime history as current; require refresh after recovery |
| generic network failure | `api.cmxchat.com` reachability, TLS/DNS/CORS | truthful unavailable state; never local persistence fallback |

## What counts as PASS

### WIRED AGAINST CONTRACT

Means source/tests prove the frontend calls and models the currently committed protected contract, preserves stable IDs, uses protected session/CSRF, keeps backend readiness authoritative, keeps LOCAL LAB separate, and preserves accepted desktop/mobile UX.

PR #120 and PR #121 can be `WIRED AGAINST CONTRACT` before the target backend is deployed.

### LIVE ACCEPTANCE PROVEN

Requires an actual reachable target backend plus a browser execution of this checklist demonstrating durable create/reload identity, Draft revisions and real 409 recovery, authoritative preflight, real Review/Publish with immutable Version/ContentVersion, fake success/fail-once/permanent Runtime behavior, cancellation, Attempts/Why and preserved history.

Do not mark LIVE ACCEPTANCE PROVEN from source inspection, unit tests, mocked network behavior or CI rendering alone.

## Acceptance evidence template

Copy this block into the acceptance record after a real run:

```text
DATE:

FRONTEND HEAD:

BACKEND HEAD / RELEASE:

BACKEND MIGRATION HEAD:

BROWSER / DEVICE:

DIRECTORY PASS/FAIL:
- person_id:
- contact_method_id:
- reload/lifecycle notes:

AUTOMATION DRAFT PASS/FAIL:
- automation_id:
- starting revision:
- ending revision:
- stale 409 observed: YES/NO

PREFLIGHT PASS/FAIL:
- blocker codes observed:
- ready result observed: YES/NO

PUBLISH PASS/FAIL:
- automation_version_id:
- content_version_id:
- source Draft revision:

RUNTIME SUCCESS PASS/FAIL:
- run_id:

RUNTIME FAIL-ONCE PASS/FAIL:
- run_id:
- attempt count:

RUNTIME PERMANENT PASS/FAIL:
- run_id:
- failure class:

CANCEL PASS/FAIL:
- run_id:
- final status:

NOTES:
```

## Stop rule

If this checklist exposes a frontend defect inside the existing PR #120/#121 contract, fix that defect and rerun preservation tests. If it exposes a backend/API mismatch, stop and compare against the canonical backend API handbook/release before changing frontend calls.

Do not use live acceptance as permission to start another product slice.
