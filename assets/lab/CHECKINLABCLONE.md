# Check In Lab Clone / Official Project Migration Blueprint

Last updated: 2026-08-16

## Purpose

This is the migration blueprint for eventually rebuilding approved `/lab` work inside the official Check In project.

`LAB-HANDOFF.md` explains how to continue the prototype.

`CHECKINLABCLONE.md` explains what product behavior should survive migration, what Lab scaffolding must be discarded, and the safest order to rebuild it.

The destination repository/application is intentionally **TBD** until the user identifies the official Check In project. Do not guess it.

## Migration principle

Treat `/lab` as a product/behavior specification, not production code to copy wholesale.

Carry forward:

- information architecture
- visual hierarchy and mobile behavior
- People/Organization/Document/Digital Asset models
- Action Builder semantics
- configurable switch policy
- timing/incident state model
- typed decisions/dependencies/routes
- delivery vs acknowledgement separation
- audit/version/incident snapshot semantics
- search/command/deep-navigation behavior
- plan-health assurance concepts
- guided testing/simulation UX
- accessibility and acceptance-test expectations
- backend contracts from the handoff Markdown files

Do not blindly port:

- `lab/index.html` snapshot shell
- `lab-loader.js`
- `lab-mock-api.js`
- `lab-acceptance.js`
- `lab-product-polish.js`
- DOM-click orchestration from `lab-test-center.js`
- HTML string rewriting
- CSP rewrite hacks
- the Lab `style-src 'unsafe-inline'` compatibility exception
- localStorage as authoritative persistence
- browser-side action/decision/audit/assurance authority
- the local universal-search index as a security model
- `#lab=` hash routing as the official router
- DOM selector navigation/quick-create adapters
- synthetic sample records or delivery claims

The official project should reproduce approved behavior with native frontend components/routing, generated API clients, FastAPI/application services, PostgreSQL, object storage, secrets references, scheduler/workers, authentication/authorization, and provider adapters.

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

Preserve SMS, Email, Social, AI, Organization Notice, Publish/Release, Webhook/API, Digital Account, Custom, and Scheduled Task definitions, stable target IDs, risk classes, guardrails, and approval requirements.

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

### 6. Typed decision engine

Preserve conditions, AND/OR, dependencies, retries, acknowledgement timeout, exclusive branches, outcome routes, cycle validation, and Decision Inspector explainability.

Official target:

- typed database-backed rules
- server evaluation
- immutable condition-evaluation records
- cycle rejection server-side
- delivery and acknowledgement as distinct states

Read `DECISIONS-BACKEND-HANDOFF.md`.

### 7. Audit / versions / incidents / plan health

Preserve:

- append-only audit concept
- immutable definition revisions
- restore-old-version → create-new-revision behavior
- immutable incident snapshots
- read-only replay
- changed-since-last-test signal
- per-action path coverage

Official target:

- server actor/time authority
- durable execution attempts/events
- canonical hashes
- server-calculated plan-health read model

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

The current Lab acceptance/polish pass established an important product rule: mobile cannot be a shrunken desktop operations console.

Approved direction:

- Live Switch / countdown is the Status hero
- Plan Health is secondary and compact
- overview metrics use short labels
- mobile warnings show the actionable statement first
- long helper text moves behind inspection/detail surfaces
- normal mobile operational copy should not rely on 5–8px typography
- major forms keep tap targets around 42–44px or larger
- desktop can remain dense, but mobile gets simpler hierarchy and fewer simultaneous words
- Decision graphs become a readable vertical chronology/inspector experience on phones
- Activity/Audit uses readable event cards instead of tiny table-console type

`lab-product-polish.js` and `lab-product-polish.css` are prototype adapters. Rebuild the approved hierarchy natively in the official component system.

### 10. Test Center / simulation UX

The Lab now has guided scenarios:

- Deadline
- No reply
- Failure
- Final trigger
- Full guided chain

The UX idea should survive migration. The implementation should not.

Official target:

```text
Browser requests test scenario
  → FastAPI creates simulation incident
  → same timing + decision engine used by production
  → deterministic fake provider adapters return controlled outcomes
  → incident/audit/version evidence is written server-side
  → frontend streams/renders results
```

The official Test Center should support scenario templates, chosen outcomes, repeatable test runs, pass/fail assertions, and a concise post-test report.

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
scheduler / decision engine / simulation engine / execution workers
  ↓
real provider adapters OR deterministic fake providers
```

Frontend must not own execution truth, incident truth, audit truth, credentials, or security-sensitive search authorization.

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

### Plan health

Status and Activity Health should use one backend read model containing:

- active policy/version
- enabled action count
- latest valid simulation snapshot
- changed definitions since that snapshot
- per-action path coverage
- review-due records
- blocking configuration warnings

Do not reimplement this separately in browser components.

### Test summary

A simulation/test read model should return:

- scenario/run ID
- policy + definition snapshot IDs
- start/end time
- action states
- routes taken
- approvals/acknowledgements
- retries
- assertions/pass-fail results
- unresolved warnings
- coverage gained by the run

## Best migration order

### Stage A — Freeze the approved Lab candidate

1. choose an approved Lab commit/tag
2. capture desktop/mobile screenshots and flows
3. mark each prototype behavior approved/rejected/experimental
4. preserve handoff docs and acceptance expectations

### Stage B — Define authoritative backend contracts

1. auth/authorization
2. People/Organizations
3. Documents/Assets
4. policy/incidents
5. Actions/targets
6. decisions/routes/ack/approvals
7. audit/versions/snapshots
8. search
9. plan-health read model
10. simulation/test-run contract
11. scheduler/workers/providers

### Stage C — Vertical slices

Build model → service → API → generated client → UI → tests for each slice:

1. People/Organizations
2. Documents/Assets
3. policy/status/incident
4. Actions
5. Sequence
6. decisions
7. audit/version history
8. server-side simulation/Test Center
9. search/deep navigation
10. plan health
11. real providers last

### Stage D — Rebuild approved UX natively

Use `/lab` as visual/behavior reference, not a source tree to transplant.

### Stage E — Simulation before execution

The official project must have trustworthy server-side simulation before any real provider is enabled.

### Stage F — Provider rollout

Recommended order:

1. Email/SMS notifications
2. delivery/ack callbacks
3. webhooks/integrations
4. AI actions with strict permissions
5. publishing/social
6. destructive account actions last

Every provider needs authorization, idempotency, retries, secret management, audit, and failure tests.

## Official-project acceptance-test baseline

Before calling a migrated slice complete, verify:

- approved desktop behavior reproduced
- approved mobile hierarchy reproduced
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
- localStorage is not authoritative domain state
- search is authorization-aware
- Plan Health uses the authoritative backend read model
- test scenarios use the server simulation engine, not UI DOM automation

The Lab’s current CI baseline also demonstrates the value of real browser checks: source syntax alone once passed a page that mobile Chrome could not parse.

## Before migration begins

1. finish live-device Lab review
2. identify the official destination repo/architecture
3. freeze an approved Lab commit/tag
4. capture screenshots and core flows
5. review all backend handoffs
6. choose which experimental behaviors survive
7. create the official vertical-slice plan

## Maintenance rule

After every major Lab round:

1. update `LAB-HANDOFF.md`
2. update this file when product behavior or migration lessons change
3. keep prototype scaffolding clearly separated from official architecture
4. never imply browser simulation equals production security/execution
