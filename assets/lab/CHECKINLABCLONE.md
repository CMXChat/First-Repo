# Check In Lab Clone / Official Project Migration Blueprint

Last updated: 2026-08-16

## Purpose

This file exists for one future job: move the useful product work from `/lab` into the official Check In project without copying Lab-only shortcuts, mock persistence, static-clone compatibility code, or browser-side authority into production.

`LAB-HANDOFF.md` explains how to continue building `/lab`.

`CHECKINLABCLONE.md` explains how to eventually extract and rebuild the approved Lab work inside the official project.

The destination repository/application is intentionally **TBD** until the user identifies the official Check In project. Do not guess the destination repo.

Update this file after every major Lab phase or acceptance round that introduces behavior or migration lessons we may eventually port.

## Migration principle

Treat `/lab` as a product prototype and behavior specification, not production source code to copy wholesale.

Port these things:

- information architecture
- interaction patterns
- visual language
- field definitions
- workflow semantics
- state machines
- timing rules
- decision rules
- relationship models
- audit/version semantics
- search/navigation behavior
- accessibility/mobile behavior
- acceptance-test expectations
- backend contracts documented in the handoff files

Do not blindly port these things:

- `lab/index.html` boot/snapshot shell
- `lab-loader.js`
- `lab-acceptance.js`
- HTML string rewriting
- Lab CSP rewriting
- the Lab `style-src 'unsafe-inline'` compatibility exception
- `lab-mock-api.js`
- localStorage as authoritative persistence
- browser-side eligibility/execution authority
- browser-side audit authority
- browser-side assurance authority
- browser-local universal search as an authorization model
- hash routing as the official router
- DOM-click quick-create/navigation adapters
- synthetic delivery claims
- Lab sample people, organizations, documents, assets, actions, incidents, or audit entries
- code whose only job is adapting the old static `/checkin` page into Lab

The official project should reproduce approved behavior using its native frontend, API client, FastAPI/backend, PostgreSQL, scheduler/workers, authentication/authorization, object storage, secrets layer, and deployment architecture.

## Current Lab source layers

The current Lab prototype is composed of:

- `lab-loader.js` plus the minimal `lab/index.html` boot shell
- `lab-crm.js` / `lab-crm.css`
- `lab-inventory.js` / `lab-inventory.css`
- `lab-actions.js` / `lab-actions.css`
- `lab-timeline-live.js` / timeline CSS
- `lab-decisions.js` / `lab-decisions-events.js` / decision CSS
- `lab-audit-bootstrap.js`
- `lab-audit.js` / `lab-audit.css`
- `lab-command.js` / `lab-command.css`
- `lab-acceptance.js` / `lab-acceptance.css`
- Lab safety/mock layers

These files are useful references for behavior and product intent. The official application should split approved behavior into proper frontend components, API services, backend domain services, database models, schedulers, workers, and provider adapters.

`lab-loader.js` and `lab-acceptance.js` are explicitly compatibility/stabilization scaffolding. They are not architectural templates for the official project.

## Product areas prototyped so far

### 1. Safe simulation / Lab isolation

Useful behavior to preserve:

- safe simulation environment separated from real execution
- unmistakable environment indicator
- no production side effects during testing

Official-project target:

- dedicated backend environment or explicit server-side simulation mode
- separate credentials/provider adapters
- environment-level safety enforcement
- deterministic fake providers for simulation
- never depend only on browser blocking

### 2. People + Organizations

Prototype behavior:

- clean CRM-style directory
- People and Organization profiles
- search/filter/sort
- People to Organization relationships
- notes/activity
- contextual relationship pane
- mobile drill-in

Official-project target:

- frontend routes/components
- generated API client calls
- FastAPI CRUD/services
- PostgreSQL people/organizations/relationship tables
- authenticated audit trail

### 3. Documents + Digital Assets

Prototype behavior:

- document metadata and categories
- sensitivity/status/review dates
- Digital Assets such as domains, sites, hosting, cloud, repositories, social accounts, devices, service accounts
- relationships to People/Organizations/Actions
- `secret_ref` boundary

Official-project target:

- PostgreSQL metadata
- object storage for file bytes
- proper document versions/checksums
- secret-management reference only
- never store passwords/tokens/keys in ordinary records

Read `BACKEND-HANDOFF.md`.

### 4. Action Builder

Prototype behavior:

- SMS
- Email
- Social post
- AI task
- Organization notice
- Publish/release
- Webhook/API
- Digital account action
- Custom action
- Scheduled task
- guided multi-step builder
- stable target IDs
- risk classes
- guardrails
- approval requirements
- configurable trigger boundaries

Official-project target:

- action definitions stored in PostgreSQL
- validated FastAPI mutation endpoints
- provider/worker execution server-side
- secrets resolved through connection refs
- action execution never performed by browser JavaScript

Read `ACTIONS-BACKEND-HANDOFF.md`.

### 5. Configurable switch policy + Sequence

Prototype behavior:

- proof-of-life interval configurable from 1 hour to 30 days / 720 hours
- hours/days input
- grace window 0 to 24 hours
- rolling repeat or one-shot
- deadline and final-trigger calculation
- visual Sequence timeline
- synthetic incident clock
- simulated eligibility/execution

Acceptance lesson:

The configurable timing contract must be configurable end to end. A UI that accepts six hours while a downstream schema still assumes exactly 72 hours is broken even if the page looks correct. The Lab acceptance pass found and fixed exactly that mismatch in the cloned status contract.

Official-project target:

- one versioned switch-policy schema shared by API, scheduler, generated client, Status, Sequence, and tests
- server-authoritative clock
- real incident/cycle model
- server scheduler calculates eligibility
- policy snapshot frozen into each opened incident
- unit conversion validated at the API/domain boundary

Do not reintroduce a hardcoded 72-hour assumption. `72h + 24h` is only the historical/default example.

### 6. Decision engine

Prototype behavior:

- typed conditions
- AND/OR logic
- dependencies
- success/failure/ack/no-ack/approval-denied routes
- retries
- acknowledgement timeout
- exclusive branches
- dependency cycle detection
- Decision Inspector
- visual routing map

Official-project target:

- typed database-backed rules
- server-side validation and evaluation
- no arbitrary browser expressions
- immutable condition evaluation records
- server-side cycle validation
- delivery and acknowledgement remain separate states

Read `DECISIONS-BACKEND-HANDOFF.md`.

### 7. Audit, versions, incidents, assurance

Prototype behavior:

- structured Audit workspace
- definition versions
- before/after comparison
- restore old payload as a new version
- incident snapshots
- read-only replay
- `changed since last simulation`
- per-action simulation-path coverage
- legacy incident provenance warning

Official-project target:

- append-only audit rows
- immutable definition revisions
- immutable incident snapshots
- server actor/time/version authority
- cryptographic canonical hashes
- durable execution attempts/events
- server-calculated configuration health

Read `AUDIT-BACKEND-HANDOFF.md`.

### 8. Universal search, command palette, deep navigation, Status assurance

Prototype behavior:

- universal local Lab search across People, Organizations, Documents, Digital Assets, Actions, Incidents, Versions, and Audit events
- `Cmd/Ctrl+K` command palette
- `/` search shortcut outside editors
- grouped search results
- recently viewed records
- commands mixed into search results
- quick-create commands
- top-bar `Search` and `New` controls
- deep jump to exact People, Organizations, Documents, Assets, Actions, Incidents, Versions, and Audit events
- browser back/forward support through a Lab hash adapter
- saved views for Critical actions, Documents needing review, Untested action paths, and Changed since simulation
- Status `Contingency assurance` block
- surfaced `PLAN CURRENT`, `TEST REQUIRED`, `RETEST REQUIRED`, and `COVERAGE INCOMPLETE` states
- dark/light treatment
- mobile command/create sheets
- keyboard focus and reduced-motion support

Acceptance hardening added:

- focus containment inside the open command palette
- keyboard/ARIA semantics for quick create
- safe behavior when `Note current record` has no valid current record
- stale-deep-link fallback
- removal of the copied legacy hash router from Lab mode so it cannot fight `#lab=` exact routes
- additional small-screen top-bar/touch treatment

Official-project target:

- native application router routes every object with stable URL state
- server/API-backed search with authorization-aware filtering
- generated API client for search and mutations
- no DOM-click navigation adapters
- quick create calls native components/services
- recent navigation may be client-local but stores IDs/labels only, never protected payloads
- saved views become typed query/filter definitions
- Status health comes from backend-calculated version/simulation/audit state
- search must not reveal unauthorized objects through labels, snippets, counts, existence, or timing differences

Important Phase 8 migration rule:

`lab-command.js` is a behavior prototype, not production infrastructure. Reproduce its UX with official components and routing. Do not copy its localStorage indexing, DOM querying, or hash adapter into the official application.

### 9. Acceptance / stabilization lessons

The Android acceptance pass exposed a parser bug where `/lab` rendered JavaScript source and `LAB SNAPSHOT UNAVAILABLE`.

Root cause:

- the old static Lab loader was inline JavaScript
- that JavaScript constructed HTML strings containing raw `</script>` tags
- the HTML parser terminated the outer script at the raw end tag even though it appeared inside a JavaScript string

Lab fix:

- move the transform into external `lab-loader.js`
- keep `lab/index.html` as a minimal boot/retry shell
- generate and validate the transformed snapshot in CI
- boot the complete result in headless Chromium

Official-project lesson:

Do not carry the snapshot-loader architecture forward at all. A native application should render its own components and routes. The useful migration artifact is the product behavior plus the browser acceptance tests.

The Lab also currently grants `style-src 'unsafe-inline'` because older prototype visualizations use inline position styles. This is another reason to rebuild those visuals natively instead of copying the static clone. Tighten the official CSP and make the components work within it.

## Recommended official-project architecture mapping

The exact destination architecture must be confirmed before migration. If the official project follows the existing CMX learning stack, the conceptual mapping is:

```text
Browser / React UI
        ↓ generated API client
FastAPI routes
        ↓
domain/application services
        ↓
PostgreSQL + object storage + secrets layer
        ↓
scheduler / decision engine / execution workers
        ↓
provider adapters (SMS, email, AI, social, webhooks, etc.)
```

Frontend must not directly own execution truth, incident truth, audit truth, credentials, database access, or security-sensitive search authorization.

## Suggested official frontend route model

Exact paths are TBD, but preserve stable object addressing conceptually:

```text
/checkin/status
/checkin/records/people/:personId
/checkin/records/organizations/:organizationId
/checkin/records/documents/:documentId
/checkin/records/assets/:assetId
/checkin/actions/:actionId
/checkin/sequence
/checkin/incidents/:incidentId
/checkin/activity/audit/:eventId
/checkin/activity/versions/:objectType/:objectId
/checkin/activity/health
```

The official router should own browser history and deep linking. The Lab `#lab=...` adapter must not survive migration.

## Suggested search contract

A future authenticated endpoint could conceptually expose:

```text
GET /checkin/search?q=...
```

Response items should return only authorized objects and minimal result metadata:

- stable object type
- stable ID
- display label
- safe subtitle/snippet
- destination route descriptor
- optional ranking metadata

Search permission checks must happen before results are returned.

For larger datasets, use server-side ranking/filtering and pagination. Do not download every protected record into the browser to build the index.

## Suggested plan-health read model

The official Status page should not calculate assurance by independently reimplementing audit logic in the browser.

A backend read model should return values such as:

- active policy/version
- enabled action count
- latest valid simulation snapshot
- changed definition count since that simulation
- action coverage summaries
- review-due document count
- blocking configuration warnings

Then Status and Activity Health render the same authoritative read model.

## Official-project acceptance-test baseline

Do not rely only on unit tests or source checks. The Lab parser failure proved that valid JavaScript can still produce a broken page at the HTML/browser layer.

At minimum, the official implementation should automate:

- application boot in a real browser engine
- authenticated/authorized route loading
- a non-default switch interval such as 6 hours
- maximum interval and grace boundaries
- exact deep link to a specific Action
- browser back/forward navigation
- mobile viewport boot around 390×844
- command palette keyboard navigation/focus behavior
- quick-create entry points
- dark/light critical flows
- simulation with success and failure branches
- changed-since-test assurance state
- no production provider side effects in simulation mode

Security-sensitive search and execution paths also require backend integration tests.

## Best migration order when the official project is ready

### Stage A: Freeze and inventory the Lab

1. Pick the approved Lab commit/tag.
2. Stop Lab feature work temporarily.
3. Capture desktop/mobile screenshots and behavior notes.
4. Build a feature matrix from this file and `LAB-HANDOFF.md`.
5. Mark each behavior approved, rejected, or still experimental.
6. Capture the expected Cmd/Ctrl+K, deep-link, mobile and Status-assurance flows.
7. Record the final Lab browser acceptance-test cases as migration requirements.

### Stage B: Define official backend contracts

Before porting polished UI, define:

1. authentication/authorization model
2. People + Organizations models
3. Documents + Digital Assets models
4. switch policy + incident model
5. Action definitions/targets
6. decision rules/routes
7. approvals/acknowledgements
8. audit/version/snapshot tables
9. scheduler/worker responsibilities
10. object-storage and secrets boundaries
11. search authorization and result contract
12. plan-health read model

Use the backend handoff files as the starting specification.

### Stage C: Implement backend vertical slices

Do not build every database table first and every UI screen last.

Port in working slices:

1. People/Organizations end to end
2. Documents/Assets end to end
3. switch policy + incident status
4. Action Builder persistence
5. Sequence read model
6. decision evaluation
7. audit/version history
8. server-side simulation mode
9. universal search + authorized deep-link results
10. plan-health read model
11. real provider adapters only after simulation is reliable

Each slice should include model → service → API → generated client → frontend → tests.

### Stage D: Rebuild the Lab UX natively

Use `/lab` as visual/behavior reference, then rebuild with official components and routing.

Do not preserve awkward static-page compatibility code just because it exists in Lab.

### Stage E: Simulation before execution

The official project should have a genuine server-side simulation mode before real providers are enabled.

Simulation should use the same timing and decision engine as production but swap side-effect adapters for deterministic fake providers.

### Stage F: Provider rollout

Enable providers one at a time:

1. Email/SMS style low-complexity notifications
2. acknowledgements/delivery callbacks
3. webhooks/integrations
4. AI actions with strict permissions
5. publishing/social
6. destructive account actions last

Each provider requires authorization, idempotency, retries, audit, secret management, and failure tests.

## Porting checklist per feature

Before calling a Lab feature migrated, confirm:

- UI behavior reproduced
- mobile behavior reproduced
- accessibility checked
- stable official route exists where applicable
- official API contract exists
- persistent database model exists where applicable
- authorization enforced server-side
- timestamps server-authoritative
- audit event emitted where required
- revisions/snapshots handled where required
- errors and empty states handled
- simulation test exists
- production side effects are not browser-owned
- Lab sample data was not copied
- localStorage is not being treated as authoritative backend state
- security-sensitive search/filtering is authorization-aware
- Status assurance uses the authoritative backend read model
- non-default switch intervals pass end-to-end tests
- browser-level acceptance tests pass on desktop and mobile viewports

## Files that are product references vs Lab scaffolding

### Product behavior references

Use these to understand approved UX/semantics:

- `lab-crm.js` / `lab-crm.css`
- `lab-inventory.js` / `lab-inventory.css`
- `lab-actions.js` / `lab-actions.css`
- `lab-timeline-live.js` / timeline CSS
- `lab-decisions.js` / decision CSS
- `lab-audit.js` / `lab-audit.css`
- `lab-command.js` / `lab-command.css`
- relevant user-visible behavior in `lab-acceptance.js` / `lab-acceptance.css`
- `LAB-HANDOFF.md`
- backend handoff Markdown files

### Lab scaffolding to retire during migration

Do not preserve these as architecture:

- `lab-loader.js`
- static snapshot-loader approach
- HTML asset-string rewrites
- CSP rewrite hack / inline-style compatibility exception
- mock production API interception
- browser localStorage domain persistence
- audit monkey-patching of localStorage
- provenance bootstrap for pre-audit browser state
- hash deep-link adapter
- DOM selector clicking for navigation and quick-create
- local universal index over all protected objects
- `lab-acceptance.js` DOM patching/readiness marker

Their behaviors and test cases may inspire official features, but the implementations are prototype scaffolding.

## Migration acceptance target

When the official implementation is ready, a user should be able to perform the same approved flows without knowing the Lab existed:

1. configure their check-in window from the supported range and choose repeat/one-shot behavior
2. build People/Organizations and protected records
3. create Actions and decision logic
4. simulate the full contingency sequence safely
5. inspect why actions did or did not run
6. review incidents, versions, and audit history
7. see whether definitions changed since the last meaningful test
8. search globally with Cmd/Ctrl+K
9. deep-link directly to exact records/actions/incidents
10. use quick create and saved views
11. use the app comfortably on mobile and keyboard
12. eventually enable real providers through backend-controlled execution

## Before beginning the official migration

Do not migrate just because `/lab` looks polished.

First:

1. finish the Lab acceptance/bug pass
2. have the user verify the repaired Lab on their real phone/browser
3. identify the official destination repo and architecture
4. freeze an approved Lab commit/tag
5. capture screenshots and core flows
6. review all backend handoff documents
7. decide which prototype behaviors are truly desired
8. create the official implementation plan by vertical slice

At that point this file becomes the migration checklist.

## Maintenance rule

After every major Lab round:

1. update `LAB-HANDOFF.md` with the current prototype architecture
2. update this file if the round introduced behavior or migration lessons worth porting
3. keep Lab-only hacks clearly separated from official-project recommendations
4. carry forward useful browser acceptance cases, not static-clone implementation hacks
5. never let this document imply that local browser simulation equals production security or execution
