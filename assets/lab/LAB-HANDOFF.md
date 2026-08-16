# Check In Lab Handoff

Last updated: 2026-08-16

Read this file first when resuming work on `/lab`.

## Purpose

`/lab` is the isolated product sandbox for the Check In dead-man-switch project. It is where the UI, records model, Action Builder, switch timing, simulation, decisions, audit/version history, search/navigation, mobile behavior, light/dark themes, long-range planning, and testing UX are designed before anything is considered for the official Check In project.

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
- long-range Plan playback is a presentation clock, not a production scheduler.
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
12. `lab-plan.js`
13. `lab-experience.js`
14. `lab-acceptance.js`

Ownership rules:

- `lab-crm.js` owns People/Organizations mock state.
- `lab-inventory.js` owns Documents/Digital Assets mock state.
- `lab-actions.js` owns reusable Action definitions.
- `lab-timeline-live.js` owns switch policy presentation and the short-horizon synthetic incident clock/state.
- `lab-decisions.js` owns typed decision simulation state.
- `lab-audit.js` owns Lab audit/version/incident adapters.
- `lab-command.js` owns search/navigation integration only.
- `lab-test-center.js` orchestrates existing Sequence/Decision controls. It is not another simulator.
- `lab-product-polish.js` restores Status hierarchy and broad mobile presentation only.
- `lab-plan.js` adds long-horizon scheduling metadata and Plan projection. It does not execute providers and is not production scheduling authority.
- `lab-experience.js` owns product-language/progressive-disclosure presentation only. It does not own domain truth.
- `lab-acceptance.js` remains the final compatibility/stabilization layer.

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
13. `lab-experience.css`
14. `lab-plan.css`
15. `lab-plan-overrides.css`

The later experience/Plan layers correct older prototype density without changing the original domain stores.

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
- `cmx-lab-plan-ui-v1`

`cmx-lab-plan-ui-v1` is presentation preference/state only: Plan/Run mode, zoom, preview clock, and preview speed. It must never become execution authority.

No separate execution store was added for Test Center or the user-experience layer.

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

## Browser acceptance / hardening

Completed after a real Android device exposed the inline-loader parser bug.

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

## Productization round — user-friendly UX, themes, long-range Plan

Current round. Do not claim live until the exact final SHA passes Lab validation and Pages deployment.

Primary new files:

- `lab-experience.js`
- `lab-experience.css`
- `lab-plan.js`
- `lab-plan.css`
- `lab-plan-overrides.css`
- `SCHEDULING-BACKEND-HANDOFF.md`

### Product-language rule

The user should not need implementation instructions to understand the interface.

`lab-experience.js` progressively simplifies presentation:

- `Trigger actions` becomes `Actions`
- `Contingency sequence` becomes `Sequence`
- decision terminology becomes `Logic`, `Waiting on`, `Then`, and `What happened`
- Activity uses human-facing Activity / Tests language before deeper provenance terminology
- Test Center becomes `Test the plan`
- Plan Health copy is shortened
- `PHASE N` prototype badges are hidden from normal product presentation
- repeated safety/developer paragraphs are reduced because the environment badge already establishes Lab context

Technical detail remains available in selected/detail views where it is useful.

### Progressive disclosure

Mobile no longer attempts to show every Action definition field simultaneously.

For selected Actions:

- core identity, state, timing, Logic, linked records, and safety remain visible
- Summary and History are secondary on phone
- `More details` reveals secondary cards
- Decision graph becomes a vertical node list on phone
- Activity is event-first; provenance is shown after opening an event

### Theme tokens

`lab-experience.css` introduces shared Lab `--lx-*` theme tokens instead of allowing every new phase to invent its own hardcoded black/white surface colors.

Dark and Light define separate values for:

- background
- primary/raised/soft surfaces
- normal/strong borders
- primary/muted text
- blue/cyan structure
- safe/warning/danger states
- violet accent
- shadows
- luminous top edges

Light mode is treated as a first-class theme. Newer Actions, Sequence, Decision, Audit, forms, Test Center, and Plan surfaces receive explicit light-mode contrast and visible borders instead of inheriting accidental dark-mode panels.

### Mobile readability rule

Phones get larger type and fewer words, not a desktop console scaled down.

The experience layer raises important mobile operational text into readable ranges and hides low-value explanatory copy at overview/list level.

Important UI should not depend on 5–8px text on phone-sized viewports.

### Sequence Plan / Run distinction

Sequence now has two user concepts in one main section:

- **Plan** — what is configured to happen over time
- **Run / Test** — what happens in one synthetic simulation/incident

No new bottom-navigation destination was added.

`Run / Test` continues to use the existing Phase 5/6 simulator and Test Center.

`Plan` uses `lab-plan.js` to project the configured plan over a much longer horizon.

### Long-running Action schedule metadata

`lab-plan.js` extends a Lab Action with optional `action.schedule` metadata:

```json
{
  "mode": "instant | running",
  "delayHours": 0,
  "durationHours": 0,
  "repeatEveryHours": 0,
  "repeatLimit": 0,
  "lane": "notifications | ai | digital | tasks"
}
```

Meanings:

- `delayHours`: wait after the Action first becomes eligible
- `durationHours`: how long a running Action remains active
- `repeatEveryHours`: cadence while the Action is active
- `repeatLimit`: optional maximum number of occurrences; zero means duration controls the preview
- `lane`: presentation grouping only

The Lab planner allows a visual horizon up to roughly two years so month-long or longer concepts can be modeled. This is not a production limit or execution promise.

### Outcome-driven handoffs

Long-running timing does not replace Phase 6 routing.

Existing Decision Policy routes remain the graph. Plan projects positive success/acknowledgement dependencies and shows failure destinations in the Action timing card.

Conceptually:

```text
eligible
→ optional delay
→ starts
→ optional recurring occurrences while running
→ ends successfully OR reaches a terminal failure
→ existing Decision route activates the next Action
```

The official server must own actual completion conditions and terminal outcomes.

### Multi-scale Plan

Plan supports:

- Auto
- Hours
- Days
- Weeks
- Months

Desktop uses horizontal time lanes. Actions in the same category stack vertically so overlapping long-running windows remain readable.

Mobile turns those lanes into readable vertical cards instead of forcing a huge horizontal graph into the phone viewport.

Plan includes:

- Messages / AI / Digital / Tasks lanes
- start and end span for running Actions
- repeating pattern for recurring Actions
- success/failure branch cues
- `Up next` list
- `Next event`
- Play / Pause preview
- Slow / Normal / Fast preview speed

The Plan preview clock is UI-only. It does not mutate the real/mock incident runtime.

### Action Timing editor

Selected Actions now receive a Timing card with:

- Start
- Runs for
- Repeat
- Ends
- failure route
- Edit timing

The timing editor supports:

- delay after eligibility
- instant vs running
- duration in hours/days/weeks/months
- recurring cadence in hours/days/weeks/months
- optional maximum run count
- presentation lane
- current success/failure route preview

Read `SCHEDULING-BACKEND-HANDOFF.md` before changing these semantics.

### Test Center relationship

The existing Test Center remains the incident-level test experience.

Plan adds long-range preview controls and a `Preview long plan` shortcut. The official project should eventually unify both through one server scheduling engine with an accelerated fake clock and deterministic fake providers.

Read `SCHEDULING-BACKEND-HANDOFF.md`.

### Readiness markers

This round adds:

```text
data-lab-plan="ready"
data-lab-experience="ready"
```

Existing markers remain:

```text
data-lab-test-center="ready"
data-lab-product-polish="ready"
data-lab-acceptance="ready"
```

## Production direction

Never execute contingency Actions from browser JavaScript.

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

For long-running / recurring Actions:

```text
reusable Action schedule
  → incident schedule snapshot
  → persisted next_run_at / ends_at
  → durable occurrence rows
  → idempotent queued workers
  → terminal outcome
  → typed Decision route
```

Do not keep a worker or browser timer sleeping for weeks/months.

The official product should have a server-backed simulation mode using the same timing/decision/scheduling engine as production but deterministic fake providers and an accelerated clock.

## Backend / migration handoffs

- `BACKEND-HANDOFF.md`
- `ACTIONS-BACKEND-HANDOFF.md`
- `DECISIONS-BACKEND-HANDOFF.md`
- `AUDIT-BACKEND-HANDOFF.md`
- `SCHEDULING-BACKEND-HANDOFF.md`
- `CHECKINLABCLONE.md`

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
- Test Center, product-polish, Plan, experience, and acceptance layers remain ordered correctly
- backend/migration handoffs remain present
- headless desktop boot
- exact Action deep link
- selected Action receives Timing card
- Sequence receives Plan / Run controls and long-range board
- 390×844 mobile boot
- acceptance/product-polish/Test-Center/Plan/Experience readiness markers

## Known Lab limitations

- all domain data remains browser-local mock state
- document bytes are not stored
- no external Action executes
- simulation outcomes are synthetic
- repeat/rearm has no real incident API
- decision evaluation is browser-only simulation
- old simulations can lack exact version provenance and are marked legacy
- Lab fingerprints are not cryptographic
- local hard delete is still possible for some prototype records; official product should prefer archive/soft-delete
- search authorization is not a production model
- `#lab=` routing is not official-app architecture
- Test Center uses DOM-control orchestration and must be replaced with a server-backed test API in the official project
- `lab-product-polish.js` and `lab-experience.js` are presentation adapters and must not be ported as architecture
- `lab-plan.js` is a long-horizon definition projection, not the authoritative existing Run/Test incident engine
- long-running completion conditions are represented through duration + existing terminal outcome routes; the Lab does not yet run a real month-long incident scheduler
- calendar scheduling still depends on Lab-local timestamps
- inline-style CSP is a prototype exception

## Next work after this round

1. validate the exact final SHA in CI and Pages
2. inspect Dark and Light on the user’s actual Android phone
3. inspect Records, Actions, Activity, Sequence Plan, and Sequence Run/Test for remaining dense wording
4. configure at least one Action to run for weeks/months and verify Plan zoom/stacking
5. run Test Center scenarios and verify Activity/Health evidence remains consistent
6. tighten any device-specific visual problems found from screenshots
7. after product approval, consider freezing a migration candidate before backend work

Do not begin production backend migration merely because the prototype looks polished.

## Resume checklist

1. Read this file first.
2. Read `CHECKINLABCLONE.md` for official-project/migration work.
3. Fetch latest `main` before editing.
4. Keep `/checkin` frozen unless explicitly asked otherwise.
5. Confirm `lab/index.html` stays a small external-loader shell.
6. Confirm Lab CSP/API isolation.
7. Check latest `Check In Lab Validation` and Pages run for the exact final SHA.
8. Preserve delivery vs acknowledgement separation.
9. Preserve typed Decision rules and dependency-cycle rejection.
10. Preserve immutable incident snapshot/version semantics.
11. Preserve restore-old-version → create-new-revision semantics.
12. Never claim Lab fingerprints are cryptographic.
13. Never let `lab-command.js`, `lab-test-center.js`, `lab-product-polish.js`, `lab-plan.js`, `lab-experience.js`, or `lab-acceptance.js` become real external execution authority.
14. Keep `cmx-lab-plan-ui-v1` as UI preference/preview state only.
15. Preserve Phase 8 ownership of `#lab=` routes.
16. Do not move the snapshot transform back into inline JavaScript.
17. Read `SCHEDULING-BACKEND-HANDOFF.md` before changing long-running/recurring semantics.
18. Update this file after every major Lab round.
19. Update `CHECKINLABCLONE.md` whenever behavior/lessons should be carried into the official project.
