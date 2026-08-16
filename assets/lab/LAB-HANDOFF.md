# Check In Lab Handoff

Last updated: 2026-08-16

Read this file first when resuming work on `/lab`.

## Purpose

`/lab` is the isolated frontend sandbox for the Check In dead-man-switch project. It exists so interface, record-model, action-builder, timing, simulation, decision-routing, audit, versioning, and incident-snapshot work can be tested without modifying production `/checkin`.

Production `/checkin` must remain untouched unless the user explicitly asks to port an approved Lab change back.

## Safety boundary

The Lab must never perform protected production Check In operations.

Current safeguards:

- `lab/index.html` rewrites the cloned CSP to `connect-src 'self';`.
- `assets/lab/lab-mock-api.js` intercepts requests aimed at `https://api.cmxchat.com`.
- The synthetic public status request is answered locally.
- Other production Check In API requests return a Lab-safe 403.
- The page visibly identifies itself as Lab/mock mode.
- People, Organizations, Documents, Digital Assets, Actions, switch policy, simulations, decision state, audit state, versions, and incident snapshots are browser-local mock data.
- Phase 6 decision logic cannot execute arbitrary code or external actions.
- Phase 7 fingerprints are visual Lab fingerprints only and are not cryptographic assurance.

Do not weaken this boundary to make a demo easier.

## Current loader

`lab/index.html`

The loader fetches the frozen Check In HTML snapshot, rewrites production asset URLs to `/assets/lab/`, removes production API connectivity, and loads the Lab layers.

### Lab JavaScript boot order

1. `lab-crm.js`
2. `lab-inventory.js`
3. `lab-actions.js`
4. `lab-timeline-live.js`
5. `lab-decisions.js`
6. `lab-decisions-events.js`
7. `lab-audit.js`

`lab-audit.js` intentionally loads last so it can observe future local mock mutations from the other Lab modules and version/audit them.

### Lab CSS layers

1. `lab-safety.css`
2. `lab-crm.css`
3. `lab-inventory.css`
4. `lab-actions.css`
5. `lab-timeline.css`
6. `lab-timeline-responsive.css`
7. `lab-decisions.css`
8. `lab-audit.css`

## Local mock storage keys

These are temporary browser adapters, not production persistence contracts.

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

A future FastAPI/PostgreSQL implementation should replace these adapters without forcing a visual rewrite.

## Completed phases

### Phase 1 — Lab isolation

Completed.

- production API blocked
- synthetic public switch status
- explicit Lab presentation
- `/checkin` separate from Lab

### Phase 2 — People + Organizations CRM

Completed.

- Pipedrive-style directory workspace
- People and Organization records
- search/filter/sort
- profile/detail/context panes
- notes/activity
- People ↔ Organization linking
- add/edit flows
- mobile drill-in
- local mock persistence

Primary files:

- `lab-crm.js`
- `lab-crm.css`

### Phase 3 — Documents + Digital Assets

Completed.

Documents include metadata, status, sensitivity, review dates, notes, tags, activity, and links to People/Organizations/Assets.

Digital Assets include domains, websites, cloud accounts, hosting, repositories, social accounts, devices, service accounts, owners, organizations, notes, tags, and `secret_ref` placeholders.

Important rule: passwords, tokens, private keys, recovery codes, MFA secrets, cookies, or other credentials do not belong in the record model.

Primary files:

- `lab-inventory.js`
- `lab-inventory.css`
- `BACKEND-HANDOFF.md`

### Phase 4 — Action Builder

Completed.

Supported action families:

- SMS
- Email
- Social post
- AI task
- Organization notice
- Publish / release
- Webhook / API
- Digital account action
- Custom action
- Scheduled task

Builder sequence:

1. Action
2. Configure
3. Targets
4. Trigger
5. Guardrails
6. Review

Actions reference People, Organizations, Documents, and Digital Assets by stable IDs.

Current definition states:

- Draft
- Enabled
- Suspended

Risk levels:

- Informational
- Important
- Critical
- Destructive

Destructive definitions require simulated operator approval in Lab. Production must enforce stronger policy independently of the browser.

Primary files:

- `lab-actions.js`
- `lab-actions.css`
- `ACTIONS-BACKEND-HANDOFF.md`

### Phase 5 — Configurable switch policy + Sequence simulator

Completed.

The proof-of-life window is not permanently hardcoded to 72 hours in Lab presentation.

Switch policy supports:

- user-selected duration
- hours or days
- minimum 1 hour
- maximum 30 days
- grace from 0 to 24 hours
- rolling repeat
- one-shot

Semantics:

- `rolling repeat`: an accepted future check-in rearms a new cycle
- `one-shot`: completion requires an explicit future rearm

Sequence includes:

- Safe → Deadline → Grace → Final Trigger visualization
- action markers from the selected policy
- simulated incident clock
- Reset clock
- Jump to deadline
- +1 hour
- +6 hours
- Jump to final trigger
- execution queue
- WAITING / ELIGIBLE / AWAITING APPROVAL / EXECUTING / SUCCEEDED / FAILED / RETRY QUEUED states
- synthetic success/failure outcomes
- simulated approval
- next-event panel
- execution trace
- recent simulation history
- horizontal desktop timeline
- vertical mobile chronology

The old Timeline navigation target is exposed as `Sequence` in Lab.

Primary files:

- `lab-timeline-live.js`
- `lab-timeline.css`
- `lab-timeline-responsive.css`
- `lab-mock-api.js`

### Phase 6 — Conditions, dependencies, fallbacks, acknowledgements

Completed.

Phase 6 adds a typed decision layer over the Phase 5 incident clock. Do not turn this into arbitrary executable expressions.

Current typed conditions:

- `switch_overdue`
- `grace_expired`
- `action_state`
- `asset_status`

Conditions support `AND` / `OR`.

Outcome routes:

- success
- final failure
- acknowledged
- no acknowledgement
- approval denied

Important behavior:

- delivery and acknowledgement are separate states
- acknowledgement may have a timeout
- retry attempts are incident runtime state
- final failure routes only after retries are exhausted
- sibling outcome branches may be exclusive
- dependency cycles are rejected before saving

Decision states include:

- `BLOCKED`
- `ELIGIBLE`
- `AWAITING APPROVAL`
- `EXECUTING`
- `RETRY QUEUED`
- `AWAITING ACKNOWLEDGEMENT`
- `ACKNOWLEDGED`
- `NO ACKNOWLEDGEMENT`
- `SUCCEEDED`
- `FAILED`
- `APPROVAL DENIED`
- `CANCELLED`

Sequence includes a Logic & Routing Map and Decision Inspector. The Action workspace gets a compact Logic control/card instead of a giant extra form.

Current seeded demonstration chain:

```text
AI contingency briefing
  ↓ success
Business continuity email
  ↓ delivered
Acknowledgement gate
  ├─ acknowledged → stop escalation
  └─ final failure / no acknowledgement → SMS legal escalation

Primary domain handoff
  → independently waits for final trigger + operator approval
```

Primary files:

- `lab-decisions.js`
- `lab-decisions-events.js`
- `lab-decisions.css`
- `DECISIONS-BACKEND-HANDOFF.md`

### Phase 7 — Audit history + definition versioning + incident snapshots

Completed in the Lab frontend.

Phase 7 replaces the old Activity presentation with an `Activity & assurance` workspace.

Tabs:

- Audit
- Incidents
- Versions
- Health

#### Audit

The Lab now records structured global definition/audit events including:

- switch-policy revisions
- action revisions
- decision-policy revisions
- document metadata revisions
- digital-asset revisions
- organization revisions
- person create/update audit events
- definition removal/tombstone events
- incident snapshot creation
- historical-version restore events

Each audit event includes Lab actor/source, timestamp, category, severity, object reference, optional incident, optional revision, and metadata.

#### Definition versions

Current versioned objects:

- switch policy
- Actions
- Decision Policies
- Documents
- Digital Assets
- Organizations

Initial browser state is captured as baseline v1 without flooding the audit stream.

Every later changed payload creates another immutable-looking Lab revision with:

- version number
- object type/id
- label
- timestamp
- Lab actor/source
- reason
- payload snapshot
- Lab fingerprint

The Versions UI supports:

- object directory
- revision history
- two-version comparison
- field-level before/after diff
- historical fingerprint display
- actor/reason/source metadata
- `Restore as new version`

Restoring never rewinds history. The old payload is copied into a new current revision.

#### Incident snapshots

When a new Lab simulation/incident is seen after Phase 7 is active, `lab-audit.js` snapshots the current plan.

Snapshot includes:

- current switch policy
- version references for the current plan
- every enabled Action payload and revision
- Decision Policy payload/revision for enabled Actions
- stable target references used by enabled Actions
- snapshot fingerprint

Later definition edits do not rewrite this snapshot.

Simulation runs that existed before Phase 7 can appear as `legacy` incidents. They keep their historical trace, but the UI must clearly state that exact definition-version provenance was unavailable at the time they were created.

#### Incident event ledger / replay

Sequence traces and Decision traces are normalized into incident event history.

Incident detail includes:

- policy snapshot
- version count
- action snapshot provenance
- current-plan changed-since count
- Lab fingerprint
- ordered incident events
- read-only incident replay slider

Replay is presentation only. It never mutates the archived incident.

#### Changed since latest simulation

This is a primary assurance signal.

Lab compares current version references with the latest non-legacy incident snapshot and reports definitions changed since that snapshot.

If definitions changed, Health shows `RETEST` and lists which current revision differs from the incident baseline.

This is the current implementation of the earlier `changed since last simulation` idea.

#### Action test coverage

Health derives Lab testing coverage from captured incident events for each Action:

- success path
- failure path
- acknowledgement path
- fallback/routed path

Current display is `x/4` per action.

This is intentionally evidence-based from captured Lab events. It should not claim provider delivery or real production testing.

#### Phase 7 storage

- `cmx-lab-audit-v1`: structured global audit events
- `cmx-lab-versions-v1`: immutable-looking local definition revisions
- `cmx-lab-incidents-v1`: incident snapshots and normalized incident events

#### Phase 7 backend direction

Read `AUDIT-BACKEND-HANDOFF.md` before changing Phase 7 semantics.

Production intent:

- append-only server audit
- immutable definition revisions
- immutable incident snapshots
- server-authoritative actor/time/version numbers
- cryptographic payload hashes
- execution attempts as durable rows
- typed condition evaluation history
- restore creates new revision
- archived/tombstone operational deletes
- read-only replay
- server-calculated configuration health

Primary files:

- `lab-audit.js`
- `lab-audit.css`
- `AUDIT-BACKEND-HANDOFF.md`

## Switch-policy source of truth in Lab

`cmx-lab-switch-policy-v1`

Shape:

```json
{
  "version": 1,
  "intervalHours": 72,
  "graceHours": 24,
  "repeat": true,
  "preferredUnit": "hours",
  "updatedAt": "ISO-8601"
}
```

The values above are defaults only.

Timing model:

```text
deadline_at = last_checkin_at + interval
final_trigger_at = deadline_at + grace
```

Action timing modes:

- deadline
- grace offset
- grace expiration
- calendar scheduled
- manual

## Decision-policy source of truth in Lab

`cmx-lab-decisions-v1` stores reusable Action decision definitions.

`cmx-lab-decision-runtime-v1` stores simulation-specific state overrides, attempts, acknowledgement deadlines, approvals, route signals, and decision traces.

Production must keep reusable definitions separate from incident runtime state.

## Decision evaluation order

Current intent:

1. Action enabled for incident
2. timing boundary reached
3. inbound route gate satisfied when applicable
4. typed conditions evaluate
5. approval satisfied if required
6. Action becomes eligible
7. execution attempt occurs
8. retries accounted for
9. success either completes or waits for acknowledgement
10. terminal outcome emits route signal
11. downstream Actions re-evaluate

## Phase 7 version/snapshot rule

A definition version is reusable configuration history.

An incident snapshot is the exact version set used by one incident.

They must stay separate.

Production example:

```text
Action current definition: v9
Incident INC-123 snapshot: Action v7
```

Editing Action v9 must never change what INC-123 says it used.

## Production execution rule

Never execute contingency actions from browser JavaScript.

Production direction:

```text
Browser
  → FastAPI
  → PostgreSQL
  → eligibility/decision scheduler
  → execution workers
  → provider adapters
```

Every real side effect needs authorization, idempotency, audit events, version provenance, failure handling, and execution snapshots.

## Backend handoff documents

Read as needed:

- `BACKEND-HANDOFF.md`
- `ACTIONS-BACKEND-HANDOFF.md`
- `DECISIONS-BACKEND-HANDOFF.md`
- `AUDIT-BACKEND-HANDOFF.md`

## CI / validation

Workflow:

`.github/workflows/checkin-lab-validation.yml`

It should continue checking:

- Lab JavaScript syntax
- production API isolation
- required Lab assets
- `/checkin` has no Lab references
- backend handoff documents remain present
- switch-policy/Sequence files remain wired
- Decision files remain wired
- Audit/version files remain wired
- append-only/version/snapshot handoff language remains present
- persistent handoff includes the current phase

When adding a major Lab layer, add it to this validator.

## Design direction

Keep one cohesive app:

- black / charcoal primary surfaces
- electric / icy blue structural accents
- restrained red for real danger/failure
- amber for waiting/review/retest boundaries
- green only for actual successful/matching Lab state
- dense operational layout
- Pipedrive-like clarity for records
- strong mobile usability
- serious secure-control feel
- no cyberpunk clutter
- no fake security claims
- no invented backend/provider verification states

## Known Lab limitations

- Everything is browser-local mock state.
- Document bytes are not stored.
- No real SMS/email/social/AI/webhook/account operation executes.
- Simulation outcomes are synthetic.
- Repeat/one-shot behavior has no real incident/rearm API yet.
- Decision evaluation is browser simulation only.
- Asset-status conditions read mock Digital Asset state.
- The condition catalog is intentionally typed and limited.
- Action Builder internals originated from a 72h + 24h default; Phase 5 adapts visible timing presentation to the current Lab policy.
- Calendar-scheduled actions are not projected onto the incident-relative timeline.
- Exact version provenance is unavailable for simulations created before Phase 7; those are labeled legacy.
- Phase 7 observes future localStorage writes after `lab-audit.js` loads. It seeds current definitions as a baseline when first enabled.
- Phase 7 Lab fingerprints are non-cryptographic and must never be presented as real tamper-proof validation.
- Existing modules can still physically remove local mock definitions. Phase 7 preserves the historical revisions/audit tombstone, but production should prefer archive/soft-delete behavior.

## Next phase

### Phase 8 — Global search, command palette, dashboard assurance, and final UX integration

Recommended order:

1. global entity/action/document/audit search
2. Cmd/Ctrl+K command palette
3. deep-link/jump actions between Records, Actions, Sequence, Activity
4. dashboard `Current plan` assurance block
5. surfaced changed-since-test / untested warnings on Status
6. quick create menu for Person / Organization / Document / Asset / Action
7. saved filters / recently viewed
8. keyboard navigation
9. mobile navigation polish
10. accessibility / contrast / focus-state pass
11. empty-state cleanup
12. final consistency pass across dark/light themes

Do not start production backend wiring just because Phase 8 finishes. The user is still using `/lab` to validate the product/data model first.

## Resume checklist for another context

1. Read this file first.
2. Inspect latest `main` before editing because another context may have touched the repo.
3. Confirm `/checkin` contains no `/assets/lab/` references.
4. Confirm `lab/index.html` still strips production API connectivity.
5. Inspect latest Lab validation workflow result.
6. Work only inside Lab unless explicitly asked to port to production.
7. Read the relevant backend handoff before changing data semantics.
8. Preserve delivery vs acknowledgement as separate states.
9. Preserve typed conditions and server-authoritative production intent.
10. Preserve immutable incident-snapshot semantics.
11. Preserve `restore old version → create new revision` semantics.
12. Do not claim Lab fingerprints are cryptographic assurance.
13. Update this file at the end of every major Lab round with changed files, new storage/API assumptions, known limitations, and next work.

Update this file at the end of every major Lab round.
