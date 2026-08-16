# Check In Lab Clone / Official Project Migration Blueprint

Last updated: 2026-08-16

## Purpose

This file exists for one future job: move the useful product work from `/lab` into the official Check In project without copying Lab-only shortcuts, mock persistence, or browser-side authority into production.

`LAB-HANDOFF.md` explains how to continue building `/lab`.

`CHECKINLABCLONE.md` explains how to eventually extract and rebuild the approved Lab work inside the official project.

The destination repository/application is intentionally **TBD** until the user identifies the official Check In project. Do not guess the destination repo.

Update this file after every major Lab phase that introduces something we may eventually port.

## Migration principle

Treat `/lab` as a product prototype and behavior specification, not as production source code to copy wholesale.

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
- accessibility/mobile behavior
- backend contracts documented in the handoff files

Do **not** blindly port these things:

- `lab/index.html` snapshot loader
- HTML string rewriting
- Lab CSP rewriting
- `lab-mock-api.js`
- localStorage as authoritative persistence
- browser-side eligibility/execution authority
- browser-side audit authority
- synthetic delivery claims
- Lab sample people, organizations, documents, assets, or actions
- any code whose only job is adapting the old static `/checkin` page into Lab

The official project should reproduce the approved behavior using its native frontend, FastAPI/backend, PostgreSQL, worker, authentication, and deployment architecture.

## Current Lab source layers

The current Lab prototype is composed of:

- `lab-crm.js` / `lab-crm.css`
- `lab-inventory.js` / `lab-inventory.css`
- `lab-actions.js` / `lab-actions.css`
- `lab-timeline-live.js` / timeline CSS
- `lab-decisions.js` / `lab-decisions-events.js` / decision CSS
- `lab-audit-bootstrap.js`
- `lab-audit.js` / `lab-audit.css`
- Lab safety/mock layers

These files are useful references for product behavior, but the official application should split them into proper frontend components, API services, backend domain services, database models, and workers.

## Product areas approved/prototyped so far

### 1. Lab isolation model

Useful concept to preserve:

- safe simulation environment separated from real execution
- unmistakable environment indicator
- no production side effects during testing

Official-project version:

- dedicated backend environment or server-side simulation mode
- separate credentials/provider adapters
- environment-level safety enforcement
- never depend only on browser blocking

### 2. People + Organizations

Prototype behavior:

- clean CRM-style directory
- People and Organization profiles
- search/filter/sort
- People ↔ Organization relationships
- notes/activity
- contextual relationship pane
- mobile drill-in

Official-project target:

- frontend route/components for records
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

- proof-of-life interval configurable from 1 hour to 30 days
- hours/days input
- grace window 0–24 hours
- rolling repeat or one-shot
- deadline and final-trigger calculation
- visual Sequence timeline
- synthetic incident clock
- simulated eligibility/execution

Official-project target:

- versioned switch policy
- server-authoritative clock
- real incident/cycle model
- server scheduler calculates eligibility
- policy snapshot frozen into each opened incident

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

Frontend must not directly own execution truth, incident truth, audit truth, credentials, or database access.

## Best migration order when the official project is ready

### Stage A — Freeze and inventory the Lab

1. Pick the approved Lab commit/tag.
2. Stop feature work temporarily.
3. Capture screenshots/mobile states and behavior notes.
4. Build a feature matrix from this file and `LAB-HANDOFF.md`.
5. Identify which Lab interactions are approved, rejected, or still experimental.

### Stage B — Define official backend contracts

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

Use the four backend handoff files as the starting specification.

### Stage C — Implement backend vertical slices

Do not build every database table first and every UI screen last.

Port in working slices:

1. People/Organizations end to end
2. Documents/Assets end to end
3. switch policy + incident status
4. Action Builder persistence
5. Sequence read model
6. decision evaluation
7. audit/version history
8. simulation mode
9. real provider adapters only after simulation is reliable

Each slice should include model → service → API → generated client → frontend → tests.

### Stage D — Rebuild the Lab UX natively

Use `/lab` as visual/behavior reference, then rebuild with official components and routing.

Do not preserve awkward static-page compatibility code just because it exists in Lab.

### Stage E — Simulation before execution

The official project should have a genuine server-side simulation mode before real providers are enabled.

Simulation should use the same rule engine and timing calculations as production but swap side-effect adapters for deterministic fake providers.

### Stage F — Provider rollout

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
- official API contract exists
- persistent database model exists
- authorization enforced server-side
- timestamps server-authoritative
- audit event emitted
- revisions/snapshots handled where required
- errors and empty states handled
- simulation test exists
- production side effects are not browser-owned
- Lab sample data was not copied as real user data

## Files to read before migration

Read all of these together:

- `assets/lab/LAB-HANDOFF.md`
- `assets/lab/CHECKINLABCLONE.md`
- `assets/lab/BACKEND-HANDOFF.md`
- `assets/lab/ACTIONS-BACKEND-HANDOFF.md`
- `assets/lab/DECISIONS-BACKEND-HANDOFF.md`
- `assets/lab/AUDIT-BACKEND-HANDOFF.md`

## Current destination status

Official Check In destination repo/application: **TBD**.

When the user identifies it, update this section with:

- repository
- relevant frontend path
- backend path
- database/migration path
- API-client generation path
- deployment environment
- authentication model
- current production Check In schema/endpoints

Then convert the migration stages above into concrete issues/PR slices for that project.

## Ongoing rule

At the end of every major `/lab` round:

1. update `LAB-HANDOFF.md` with how to continue the prototype;
2. update `CHECKINLABCLONE.md` if the round adds or changes something we eventually want in the official project;
3. keep Lab-only implementation details clearly separated from the production target architecture.
