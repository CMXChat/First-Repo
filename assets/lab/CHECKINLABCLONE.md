# Check In Lab Clone / Official Project Migration Blueprint

Last updated: 2026-08-16

## Purpose

This is the migration blueprint for eventually rebuilding approved `/lab` work inside the official Check In project.

`LAB-HANDOFF.md` explains how to continue the prototype.

`CHECKINLABCLONE.md` explains what product behavior should survive migration, what Lab scaffolding must be discarded, and the safest order to rebuild it.

The destination repository/application is intentionally **TBD** until the user identifies the official Check In project. Do not guess it.

## Migration principle

Treat `/lab` as a product/behavior specification, not production source code to copy wholesale.

Carry forward:

- information architecture
- visual hierarchy and mobile behavior
- dark/light design language and shared theme tokens
- People/Organization/Document/Digital Asset models
- Action Builder semantics
- configurable switch policy
- short and long-running timing concepts
- recurring Action semantics
- Plan / Run Sequence model
- typed decisions/dependencies/routes
- delivery vs acknowledgement separation
- audit/version/incident snapshot semantics
- search/command/deep-navigation behavior
- Plan Health assurance concepts
- guided testing/simulation UX
- accessibility and acceptance-test expectations
- backend contracts from the handoff Markdown files

Do not blindly port:

- `lab/index.html` snapshot shell
- `lab-loader.js`
- `lab-mock-api.js`
- `lab-acceptance.js`
- `lab-product-polish.js`
- `lab-experience.js`
- `lab-plan.js` as a production scheduler
- DOM-click orchestration from `lab-test-center.js`
- HTML string rewriting
- CSP rewrite hacks
- the Lab `style-src 'unsafe-inline'` compatibility exception
- localStorage as authoritative persistence
- browser-side Action/Decision/Audit/assurance authority
- browser-side long-range scheduling authority
- the local universal-search index as a security model
- `#lab=` hash routing as the official router
- DOM selector navigation/quick-create adapters
- synthetic sample records or delivery claims

The official project should reproduce approved behavior with native frontend components/routing, generated API clients, FastAPI/application services, PostgreSQL, object storage, secret references, durable schedulers/workers, authentication/authorization, and provider adapters.

## Current Lab product references

Behavior references:

- `lab-crm.js` / `lab-crm.css`
- `lab-inventory.js` / `lab-inventory.css`
- `lab-actions.js` / `lab-actions.css`
- `lab-timeline-live.js` / timeline CSS
- `lab-decisions.js` / decision CSS
- `lab-audit.js` / `lab-audit.css`
- `lab-command.js` / `lab-command.css`
- `lab-test-center.js` / `lab-test-center.css`
- `lab-product-polish.js` / `lab-product-polish.css`
- `lab-plan.js` / `lab-plan.css`
- `lab-experience.js` / `lab-experience.css`
- backend handoff Markdown files
- `LAB-HANDOFF.md`

Static-clone scaffolding to retire:

- `lab-loader.js`
- `lab-mock-api.js`
- `lab-audit-bootstrap.js`
- `lab-acceptance.js`
- localStorage monkey-patching/adapters
- local hash/DOM routing adapters
- DOM-click test orchestration

`lab-product-polish.js`, `lab-experience.js`, and `lab-plan.js` are useful behavior references. Their DOM adaptation/local scheduling mechanics are not official architecture.

## Product areas to rebuild

### 1. Safe simulation environment

Preserve the clear distinction between real execution and test mode.

Official target:

- explicit server-side simulation mode or dedicated environment
- deterministic fake providers
- separate provider credentials/config
- environment-level execution guards
- no dependence on a browser blocker for safety

### 2. People + Organizations

Preserve the CRM-style directory, relationship navigation, notes/activity, and mobile drill-in.

Official target:

- stable routes/IDs
- FastAPI CRUD/services
- PostgreSQL relationships
- generated client
- authenticated audit trail

### 3. Documents + Digital Assets

Preserve metadata/status/sensitivity/review dates, relationships, version intent, and the `secret_ref` boundary.

Official target:

- PostgreSQL metadata
- private object storage for file bytes
- checksums/version rows
- access control
- secret manager references only

Read `BACKEND-HANDOFF.md`.

### 4. Action Builder

Preserve SMS, Email, Social, AI, Organization Notice, Publish/Release, Webhook/API, Digital Account, Custom, and Scheduled Task definitions, stable target IDs, risk classes, guardrails, approval requirements, and human-readable review.

Official target:

- PostgreSQL definitions/versions/targets
- server validation
- provider workers
- idempotent execution
- secrets resolved server-side

Read `ACTIONS-BACKEND-HANDOFF.md`.

### 5. Configurable switch policy + Sequence

Preserve:

- 1 to 720 hours / 30 days
- hours/days input
- 0 to 24 hours grace
- rolling repeat / one-shot
- deadline and final-trigger calculations
- visual Sequence and incident clock

Acceptance lesson: configurable timing must be configurable end to end. The Lab once allowed custom timing in UI while the copied status contract still required 72 hours. The official project should have one shared/versioned timing contract across API, scheduler, generated client, Status, Sequence, and tests.

Do not reintroduce a hardcoded 72-hour assumption.

### 6. Typed Decision engine

Preserve conditions, AND/OR, dependencies, retries, acknowledgement timeout, exclusive branches, outcome routes, cycle validation, and Decision Inspector explainability.

Official target:

- typed database-backed rules
- server evaluation
- immutable condition-evaluation records
- cycle rejection server-side
- delivery and acknowledgement as distinct states

Read `DECISIONS-BACKEND-HANDOFF.md`.

### 7. Audit / versions / incidents / Plan Health

Preserve:

- append-only audit concept
- immutable definition revisions
- restore-old-version → create-new-revision behavior
- immutable incident snapshots
- read-only replay
- changed-since-last-test signal
- per-Action path coverage

Official target:

- server actor/time authority
- durable execution attempts/events
- canonical hashes
- server-calculated Plan Health read model

Read `AUDIT-BACKEND-HANDOFF.md`.

### 8. Search / commands / deep navigation

Preserve the user experience of universal search, Cmd/Ctrl+K, recent items, saved views, quick create, and exact object navigation.

Official target:

- native application router
- authorization-aware API search
- generated client
- no unauthorized existence/count/snippet/timing leakage
- stable URLs for People, Organizations, Documents, Assets, Actions, Incidents, Audit events, Versions, and Health

`lab-command.js` is behavior reference only.

### 9. Mobile-first product hierarchy

The Lab established an important product rule: mobile cannot be a shrunken desktop operations console.

Approved direction:

- Live Switch / countdown is the Status hero
- Plan Health is secondary and compact
- overview metrics use short labels
- mobile warnings show the actionable statement first
- long helper text moves behind inspection/detail surfaces
- normal mobile operational copy does not rely on 5–8px typography
- major forms keep comfortable tap targets
- desktop can remain dense while mobile gets fewer simultaneous words
- Action detail uses progressive disclosure
- Decision graphs become a readable vertical list/inspector on phones
- Activity/Audit is event-first on phones, with provenance inside detail
- long-range Plan turns desktop horizontal lanes into readable vertical Action cards on phones

Rebuild the approved hierarchy natively in the official component system.

### 10. Product language and progressive disclosure

The prototype accumulated engineering labels while phases were being built. The productization pass intentionally simplifies the user-facing language.

Preserve the principle:

- say `Actions`, not internal phase terminology
- say `Logic`, `Waiting on`, `Then`, and `What happened` before implementation terminology
- show core state first
- expose raw IDs, versions, fingerprints, route internals, and audit provenance only when inspecting details
- avoid repeated instructional paragraphs when the controls can communicate their purpose

`lab-experience.js` is a prototype adapter only. Copy the resulting behavior/copy decisions into native components instead of porting DOM rewrites.

### 11. Dark / Light theme system

The original `/checkin` works best when components derive from semantic theme variables instead of hardcoded surfaces. Later Lab phases temporarily drifted into hardcoded near-black panels, which made Light mode inconsistent.

The new Lab experience layer introduces shared theme tokens for:

- app background
- primary/raised/soft surfaces
- normal/strong edges
- primary/muted text
- structural blue/cyan
- safe / warning / danger states
- accent colors
- shadows
- luminous top-edge treatment

Official target:

- one typed design-token/theme layer used by every component
- dark and light values defined centrally
- no component hardcodes a dark surface that survives into Light mode
- Light mode gets intentional borders, dark navy text, visible muted text, and controlled shadows
- theme contrast is tested independently in both modes
- status/risk semantics remain distinguishable without depending only on color

The phrase `theme tokens` should refer to the official design system, not the Lab CSS variables themselves.

### 12. Long-running and recurring Actions

This is now an explicit product concept.

An Action can conceptually be:

```text
eligible
→ optional start delay
→ starts
→ runs for hours / days / weeks / months
→ optionally repeats while active
→ reaches a terminal outcome
→ typed Decision route activates downstream Action(s)
```

Lab schedule metadata currently models:

- start delay
- instant vs running
- duration
- recurring cadence
- optional max recurrence count
- display lane

The existing Decision Policy remains the terminal outcome graph. Timing must not become a second competing dependency engine.

Example:

```text
Final trigger
→ wait 2 days
→ monitor daily for 45 days
→ success → Action B
→ terminal failure → Action C
```

Official target:

- reusable schedule definition in PostgreSQL
- incident-level schedule snapshot
- persisted `eligible_at`, `starts_at`, `ends_at`, and `next_run_at`
- durable occurrence rows for recurring runs
- separate occurrence retries from recurrence cadence
- idempotency per occurrence/attempt
- typed terminal outcomes
- route activation through the Decision engine
- explicit cancellation/suspension behavior
- server restart safety

Never implement a month-long Action as one browser timer, one open HTTP request, or one worker process sleeping for weeks.

Read `SCHEDULING-BACKEND-HANDOFF.md`.

### 13. Sequence Plan / Run model

Sequence should remain one main product area with two modes:

- **Plan**: what the current definition set is configured to do
- **Run / Test**: what one incident/test is doing or did

Plan is definition-oriented. Run is incident-oriented.

Approved Plan UX:

- Auto / Hours / Days / Weeks / Months zoom
- long-duration spans
- recurring visual pattern
- Messages / AI / Digital / Tasks lanes or equivalent grouping
- overlapping Actions remain readable
- Up Next rail
- Next Event
- accelerated preview playback
- Action click-through
- outcome cues

The official API should expose a Plan read model rather than making the browser reconstruct scheduling truth independently from raw tables.

### 14. Test Center / simulation UX

The Lab has guided scenarios:

- Deadline
- No reply
- Failure
- Final trigger
- Full guided chain

The UX idea should survive migration. The DOM-click implementation should not.

Official target:

```text
Browser requests test scenario
  → FastAPI creates simulation incident
  → same timing + decision + scheduling engine used by production
  → deterministic fake provider adapters return controlled outcomes
  → incident/audit/version evidence is written server-side
  → frontend streams/renders results
```

For long plans, simulation should support an accelerated fake clock, `Next event`, and deterministic playback so a 90-day plan can be tested in seconds while preserving calculated event timestamps/order.

The official Test Center should support scenario templates, chosen outcomes, repeatable test runs, pass/fail assertions, concise post-test reports, and coverage gained by the run.

Do not port the Lab’s DOM-click orchestration.

## Recommended official architecture

Conceptually:

```text
React frontend
  ↓ generated API client
FastAPI routes
  ↓
application/domain services
  ↓
PostgreSQL + object storage + secrets references
  ↓
switch scheduler / Action scheduler / Decision engine / simulation engine / execution workers
  ↓
real provider adapters OR deterministic fake providers
```

Frontend must not own execution truth, incident truth, audit truth, credentials, scheduling truth, or security-sensitive search authorization.

## Suggested official route model

Exact paths are TBD, but stable object routes should conceptually cover:

```text
/checkin/status
/checkin/records/people/:personId
/checkin/records/organizations/:organizationId
/checkin/records/documents/:documentId
/checkin/records/assets/:assetId
/checkin/actions/:actionId
/checkin/sequence
/checkin/tests
/checkin/tests/:testRunId
/checkin/incidents/:incidentId
/checkin/activity/audit/:eventId
/checkin/activity/versions/:objectType/:objectId
/checkin/activity/health
```

## Suggested backend read models

### Search

An authenticated search endpoint should return only authorized result metadata:

- object type
- stable ID
- safe label/snippet
- route descriptor
- ranking/pagination metadata

### Plan Health

Status and Activity Health should use one backend read model containing:

- active policy/version
- enabled Action count
- latest valid simulation snapshot
- changed definitions since that snapshot
- per-Action path coverage
- review-due records
- blocking configuration warnings

Do not reimplement this independently in browser components.

### Sequence Plan

A server-generated Plan read model should include:

- current switch boundaries
- Action ID/version/type/risk/status
- schedule revision
- projected/scheduled start and end
- recurrence summary
- route/dependency summary
- lane/category hint
- next meaningful events
- warnings such as cycles, missing targets, or unschedulable rules

### Test summary

A simulation/test read model should return:

- scenario/run ID
- policy + definition snapshot IDs
- start/end time
- Action states
- routes taken
- approvals/acknowledgements
- recurring occurrences
- retries
- assertions/pass-fail results
- unresolved warnings
- coverage gained by the run

## Best migration order

### Stage A — Freeze the approved Lab candidate

1. choose an approved Lab commit/tag
2. capture dark/light desktop/mobile screenshots and flows
3. mark each prototype behavior approved/rejected/experimental
4. preserve handoff docs and acceptance expectations

### Stage B — Define authoritative backend contracts

1. auth/authorization
2. People/Organizations
3. Documents/Assets
4. policy/incidents
5. Actions/targets
6. Action schedules / recurring occurrences
7. decisions/routes/ack/approvals
8. audit/versions/snapshots
9. search
10. Plan Health read model
11. Sequence Plan read model
12. simulation/test-run contract
13. schedulers/workers/providers

### Stage C — Vertical slices

Build model → service → API → generated client → UI → tests for each slice:

1. People/Organizations
2. Documents/Assets
3. policy/status/incident
4. Actions
5. long-running/recurring scheduling
6. Sequence Plan
7. Sequence Run
8. decisions
9. audit/version history
10. server-side simulation/Test Center
11. search/deep navigation
12. Plan Health
13. real providers last

### Stage D — Rebuild approved UX natively

Use `/lab` as visual/behavior reference, not a source tree to transplant.

### Stage E — Simulation before execution

The official project must have trustworthy server-side simulation before any real provider is enabled.

### Stage F — Provider rollout

Recommended order:

1. Email/SMS notifications
2. delivery/ack callbacks
3. webhooks/integrations
4. AI Actions with strict permissions
5. publishing/social
6. destructive account Actions last

Every provider needs authorization, idempotency, retries, secret management, audit, and failure tests.

## Official-project acceptance-test baseline

Before calling a migrated slice complete, verify:

- approved desktop behavior reproduced
- approved mobile hierarchy reproduced
- Dark and Light both intentionally designed
- no tiny unreadable operational text on phone-sized viewports
- keyboard/accessibility behavior works
- stable native route exists
- API contract exists
- persistent model exists where needed
- authorization enforced server-side
- timestamps/server state authoritative
- audit/version/snapshot rules preserved
- simulation test exists
- browser does not own production side effects
- browser does not own long-running/recurring scheduling truth
- localStorage is not authoritative domain state
- search is authorization-aware
- Plan Health uses the authoritative backend read model
- Plan uses authoritative schedule projections
- recurring occurrence/retry/idempotency behavior is tested
- test scenarios use the server simulation engine, not UI DOM automation

The Lab’s browser CI also demonstrates why source syntax alone is insufficient: an earlier page passed source checks while mobile Chrome could not parse it correctly.

## Before migration begins

1. finish live-device Lab review in Dark and Light
2. configure and test representative instant, long-running, and recurring Actions
3. identify the official destination repo/architecture
4. freeze an approved Lab commit/tag
5. capture screenshots and core flows
6. review every backend handoff, including `SCHEDULING-BACKEND-HANDOFF.md`
7. choose which experimental behaviors survive
8. create the official vertical-slice plan

## Maintenance rule

After every major Lab round:

1. update `LAB-HANDOFF.md`
2. update this file when product behavior or migration lessons change
3. keep prototype scaffolding clearly separated from official architecture
4. never imply browser simulation equals production security/execution/scheduling
