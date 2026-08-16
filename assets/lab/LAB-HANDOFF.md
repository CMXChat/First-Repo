# Check In Lab Handoff

Last updated: 2026-08-16

Read this file first when resuming work on `/lab`.

## Purpose

`/lab` is the isolated product sandbox for the Check In dead-man-switch project. It is where the UI, records model, action builder, switch timing, simulation, decisions, audit/version history, search/navigation, mobile behavior, and testing UX are designed before anything is considered for the official Check In project.

Production `/checkin` stays frozen unless the user explicitly asks to port approved Lab work.

For eventual migration into the official project, also read `CHECKINLABCLONE.md`.

## Safety boundary

The Lab must never execute protected production Check In operations.

Current safety rules:

- `lab/index.html` is only a loading/error shell.
- `assets/lab/lab-loader.js` transforms the frozen production snapshot into a Lab-only page.
- production asset paths are rewritten to `/assets/lab/`.
- transformed CSP keeps `connect-src 'self';` so the Lab cannot connect to the production API.
- `lab-mock-api.js` intercepts attempted `https://api.cmxchat.com` Check In calls and returns synthetic Lab responses / safe 403s.
- the Lab uses synthetic browser-local data.
- SMS, email, social, AI, webhook, publishing, account, and destructive operations do not execute externally.
- the Test Center drives existing simulation controls only.
- audit fingerprints are illustrative Lab fingerprints, not cryptographic assurance.

Do not weaken this boundary for convenience.

### Lab CSP compatibility

The transformed Lab currently uses:

```text
script-src 'self'
connect-src 'self'
style-src 'self' 'unsafe-inline'
```

The inline-style exception exists because this static prototype still positions timeline/action graphics through `element.style`. It is not a production recommendation.

## Loader architecture

### `lab/index.html`

Minimal boot shell. It loads only:

```text
/assets/lab/lab-loader.js
```

Do not move the snapshot transform back into inline JavaScript. An older inline loader contained literal `</script>` strings and caused mobile Chrome to terminate the script early, print JavaScript source on the page, and show `LAB SNAPSHOT UNAVAILABLE`.

### Current JavaScript boot order

0. `lab-loader.js`
1. `lab-crm.js`
2. `lab-inventory.js`
3. `lab-actions.js`
4. `lab-timeline-live.js`
5. `lab-decisions.js`
6. `lab-decisions-events.js`
7. `lab-audit-bootstrap.js`
8. `lab-audit.js`
9. `lab-command.js`
10. `lab-test-center.js`
11. `lab-product-polish.js`
12. `lab-acceptance.js`

Ownership rules:

- `lab-crm.js` owns People/Organizations mock state.
- `lab-inventory.js` owns Documents/Digital Assets mock state.
- `lab-actions.js` owns Action definitions.
- `lab-timeline-live.js` owns switch policy presentation and simulation clock/state.
- `lab-decisions.js` owns typed decision simulation state.
- `lab-audit.js` owns Lab audit/version/incident adapters.
- `lab-command.js` owns search/navigation integration only.
- `lab-test-center.js` orchestrates existing Sequence/Decision controls. It is not another simulator.
- `lab-product-polish.js` changes hierarchy/copy/presentation only. It owns no domain state.
- `lab-acceptance.js` is the final compatibility/stabilization layer.

### Current CSS layers

1. `lab-safety.css`
2. `lab-crm.css`
3. `lab-inventory.css`
4. `lab-actions.css`
5. `lab-timeline.css`
6. `lab-timeline-responsive.css`
7. `lab-decisions.css`
8. `lab-audit.css`
9. `lab-command.css`
10. `lab-test-center.css`
11. `lab-acceptance.css`
12. `lab-product-polish.css`

`lab-product-polish.css` intentionally loads last so mobile readability/hierarchy overrides earlier high-density prototype CSS.

## Local mock storage keys

These are browser adapters only, not production persistence contracts:

- `cmx-lab-crm-v1`
- `cmx-lab-inventory-v1`
- `cmx-lab-actions-v1`
- `cmx-lab-switch-policy-v1`
- `cmx-lab-simulations-v1`
- `cmx-lab-decisions-v1`
- `cmx-lab-decision-runtime-v1`
- `cmx-lab-audit-v1`
- `cmx-lab-versions-v1`
- `cmx-lab-incidents-v1`
- `cmx-lab-navigation-v1`

No new authoritative storage key was added for the Test Center or product-polish layer.

## Completed product phases

### Phase 1 — Lab isolation

Complete. Production API blocked, synthetic status, Lab indicators, `/checkin` separate.

### Phase 2 — People + Organizations CRM

Complete. Directory, People, Organizations, links, notes, activity, filters, create/edit, mobile drill-in.

### Phase 3 — Documents + Digital Assets

Complete. Metadata, sensitivity/status/review dates, relationships, notes/tags/activity, Digital Asset records, `secret_ref` boundary. File bytes are not stored in Lab.

Read `BACKEND-HANDOFF.md`.

### Phase 4 — Action Builder

Complete. SMS, Email, Social, AI, Organization Notice, Publish/Release, Webhook/API, Digital Account, Custom, Scheduled Task. Guided builder, stable target IDs, risk classes, guardrails, approvals.

Read `ACTIONS-BACKEND-HANDOFF.md`.

### Phase 5 — Configurable policy + Sequence

Complete.

Switch policy supports:

- 1 to 720 hours / 30 days
- hours or days input
- 0 to 24 hours grace
- rolling repeat or one-shot

Timing:

```text
deadline = last_checkin + interval
final_trigger = deadline + grace
```

Sequence contains the incident clock, timeline, action queue, simulated outcomes, next event, trace, and run history.

The Lab status contract accepts non-72-hour policies. `72 + 24` is only the default example.

### Phase 6 — Decisions / dependencies / acknowledgement

Complete.

Typed conditions:

- `switch_overdue`
- `grace_expired`
- `action_state`
- `asset_status`

Routes:

- success
- final failure
- acknowledged
- no acknowledgement
- approval denied

Delivery and acknowledgement remain separate states. Retries, exclusive branches, timeouts, approval state, route signals, and dependency-cycle rejection are simulated.

Read `DECISIONS-BACKEND-HANDOFF.md`.

### Phase 7 — Audit / versions / incidents / assurance

Complete.

Activity includes Audit, Incidents, Versions, Health. Definitions receive revisions. Restoring an old version creates a new revision. New simulations get immutable Lab incident-definition snapshots. Pre-Phase-7 simulations may be labeled legacy instead of inventing provenance.

Health tracks changed definitions and Action path coverage.

Read `AUDIT-BACKEND-HANDOFF.md`.

### Phase 8 — Search / command palette / deep navigation

Complete.

- universal Lab search
- Cmd/Ctrl+K
- `/` shortcut outside editors
- exact People/Org/Document/Asset/Action/Incident/Version/Audit jumps
- recent items
- quick create
- saved views
- browser back/forward through Lab `#lab=` adapter
- Status assurance readout

The official app must replace the local index/hash/DOM-click adapters with authorized API search and its native router.

## Acceptance / browser hardening

Complete after a real Android device exposed the inline-loader parser bug.

Current checks include:

- JS syntax
- generated snapshot contract
- CSP/production isolation
- configurable timing contract
- complete headless Chromium boot
- exact Action deep link
- 390×844 mobile viewport boot
- `data-lab-acceptance="ready"`

Do not regress CI to source-string checks only.

## Current mobile-first polish round

Completed in code; validate exact final SHA before claiming live.

Primary files:

- `lab-product-polish.js`
- `lab-product-polish.css`
- `lab-test-center.js`
- `lab-test-center.css`

### Status hierarchy

The live switch is again the primary visual surface:

1. current switch state
2. countdown / check in
3. last + next due
4. Test Plan shortcut
5. compact switch metrics
6. compact Plan Health
7. warnings / recent activity

The old large `Contingency assurance` report is still backed by the same Phase 7 evidence, but presentation is shortened to `Plan health` and moved below the core switch metrics.

Mobile Plan Health uses a 2×2 metric grid and hides low-value helper copy. Warnings keep the actionable title while long explanatory text is hidden on phones.

### Mobile typography rule

Several Phase 4–7 styles originally used 5–8px text to create a dense desktop control-console look. That is no longer acceptable on mobile.

`lab-product-polish.css` increases mobile type and reduces simultaneous detail across:

- Status
- Records
- Actions
- Sequence
- Decision Inspector / routing map
- Activity / Audit / Incidents / Versions / Health
- dialogs/forms

Mobile should show fewer words at once and expose detail after selection/inspection instead of shrinking every explanation.

### Test Center

`lab-test-center.js` adds guided synthetic scenarios on top of the existing Sequence + Decision engine:

- Deadline
- No reply
- Failure
- Final trigger
- Full guided chain

The Full guided chain exercises the seeded demonstration path approximately as:

```text
Deadline
→ AI success
→ continuity email delivery
→ no acknowledgement
→ SMS fallback
→ acknowledgement
→ final trigger
→ approval-gated final action
```

Important: Test Center has no separate runtime store and no execution engine. It drives existing `data-sequence-*`, `data-decision-*`, acknowledgement, and approval controls. Audit/version/incident evidence therefore comes from the same existing Lab state machines.

Status `Run contingency test` and Plan Health `Run test` open the Sequence Test Center.

Browser readiness markers:

```text
data-lab-test-center="ready"
data-lab-product-polish="ready"
```

## Production direction

Never execute contingency actions from browser JavaScript.

Target architecture remains:

```text
Browser / React
  → generated API client
FastAPI
  → domain/application services
PostgreSQL + object storage + secrets references
  → scheduler / decision engine / execution workers
provider adapters
```

The official product should eventually have a server-backed simulation mode using the same timing/decision engine as production but deterministic fake providers.

## CI / validation

Workflow:

`.github/workflows/checkin-lab-validation.yml`

It must continue validating:

- `/checkin` has no Lab references
- production API remains blocked in Lab
- all Lab JS syntax
- timing contract supports custom intervals
- loader generates all expected Lab assets
- mock API loads before copied client
- Test Center and mobile-polish layers are present
- backend/migration handoffs remain present
- headless desktop boot
- exact Action deep link
- 390×844 mobile boot
- acceptance/product-polish/Test-Center readiness markers

## Known Lab limitations

- all domain data remains browser-local mock state
- document bytes are not stored
- no external action executes
- simulation outcomes are synthetic
- repeat/rearm has no real incident API
- decision evaluation is browser-only simulation
- calendar-scheduled actions are not fully projected into incident-relative Sequence timing
- old simulations can lack exact version provenance and are marked legacy
- Lab fingerprints are not cryptographic
- local hard delete is still possible for some prototype records; official product should prefer archive/soft-delete
- search authorization is not a production model
- `#lab=` routing is not official-app architecture
- Test Center uses DOM-control orchestration and must be replaced with a server-backed test API in the official project
- `lab-product-polish.js` is a compatibility/presentation adapter and must not be ported as architecture
- inline-style CSP is a prototype exception

## Next work

After this mobile/Test Center round:

1. inspect the exact live build on the user’s Android phone
2. verify Status top hierarchy and scroll position
3. manually inspect Records, Actions, Activity, and Sequence for any remaining tiny or overly verbose UI
4. run each Test Center scenario and confirm the expected Incident/Audit/Health changes
5. fix device-specific layout issues found from screenshots
6. only after user approval, consider freezing a Lab migration candidate

Do not begin production backend migration just because the Lab looks polished.

## Resume checklist

1. Read this file first.
2. Read `CHECKINLABCLONE.md` for official-project/migration work.
3. Fetch latest `main` before editing.
4. Keep `/checkin` frozen unless explicitly asked otherwise.
5. Confirm `lab/index.html` stays a small external-loader shell.
6. Confirm Lab CSP/API isolation.
7. Check latest `Check In Lab Validation` and Pages run for the exact final SHA.
8. Preserve delivery vs acknowledgement separation.
9. Preserve typed decision rules and cycle rejection.
10. Preserve immutable incident snapshot/version semantics.
11. Preserve restore-old-version → create-new-revision semantics.
12. Never claim Lab fingerprints are cryptographic.
13. Never let `lab-command.js`, `lab-test-center.js`, `lab-product-polish.js`, or `lab-acceptance.js` become authoritative domain stores.
14. Preserve Phase 8 ownership of `#lab=` routes.
15. Do not move the snapshot transform back into inline JavaScript.
16. Update this file after every major Lab round.
17. Update `CHECKINLABCLONE.md` whenever behavior/lessons should be carried into the official project.
