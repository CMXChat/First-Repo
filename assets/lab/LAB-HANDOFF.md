# Check In Lab Handoff

Last updated: 2026-08-16

Read this file first when resuming work on `/lab`.

## Purpose

`/lab` is the isolated frontend sandbox for the Check In dead-man-switch project. It exists so interface, data-model, action-builder, timing, simulation, and decision-routing work can be tested without modifying the production `/checkin` experience.

Production `/checkin` should remain untouched unless the user explicitly asks to port an approved Lab change back.

## Safety boundary

The Lab must never call the production Check In API for switch mutations or protected operations.

Current safeguards:

- `lab/index.html` rewrites the cloned CSP to `connect-src 'self';`.
- `assets/lab/lab-mock-api.js` intercepts requests aimed at `https://api.cmxchat.com`.
- Only the synthetic public status request is answered locally.
- Other production API requests return a Lab-safe 403 response.
- The page visibly identifies itself as Lab/mock mode.
- Lab records/actions/simulations/decision state are browser-local mock data.
- Phase 6 decision logic cannot execute arbitrary code or external actions.

Do not weaken this boundary to make a feature easier to demo.

## Current loader

`lab/index.html`

The loader fetches the frozen Check In HTML snapshot, rewrites production asset URLs to `/assets/lab/`, blocks production API connectivity, and adds Lab-only layers.

Current Lab-only JavaScript layers loaded after the cloned Check In scripts:

1. `lab-crm.js`
2. `lab-inventory.js`
3. `lab-actions.js`
4. `lab-timeline-live.js`
5. `lab-decisions.js`
6. `lab-decisions-events.js`

Current Lab-only CSS layers:

1. `lab-safety.css`
2. `lab-crm.css`
3. `lab-inventory.css`
4. `lab-actions.css`
5. `lab-timeline.css`
6. `lab-timeline-responsive.css`
7. `lab-decisions.css`

`lab-decisions-events.js` is a small UI event-boundary helper. `lab-decisions.js` uses document-level delegation so Logic controls survive Action-workspace re-renders, while the graph also uses local delegation. The helper stops already-handled graph clicks before they bubble into the document delegate a second time.

## Local mock storage keys

These are not production persistence contracts. They are temporary browser adapters.

- `cmx-lab-crm-v1`
- `cmx-lab-inventory-v1`
- `cmx-lab-actions-v1`
- `cmx-lab-switch-policy-v1`
- `cmx-lab-simulations-v1`
- `cmx-lab-decisions-v1`
- `cmx-lab-decision-runtime-v1`

A later FastAPI/PostgreSQL implementation should replace these adapters without forcing a visual rewrite.

## Completed phases

### Phase 1 — Lab isolation

Completed.

- production API blocked
- synthetic public switch status
- explicit Lab presentation
- `/checkin` remains separate

### Phase 2 — People + Organizations CRM

Completed in the Lab frontend.

- Pipedrive-style directory workspace
- People and Organization records
- search/filter/sort
- profile/detail/context panes
- notes/activity
- linked People ↔ Organizations
- add/edit flows
- mobile drill-in
- local mock persistence

Primary files:

- `lab-crm.js`
- `lab-crm.css`

### Phase 3 — Documents + Digital Assets

Completed in the Lab frontend.

Documents include metadata, status, sensitivity, review dates, notes, tags, activity, and links to People/Organizations/Assets.

Digital Assets include domains, websites, cloud accounts, hosting, repositories, social accounts, devices, service accounts, owners, organizations, notes, tags, and `secret_ref` placeholders.

Important rule: real passwords, private keys, tokens, recovery codes, MFA secrets, cookies, or other credentials do not belong in the record model.

Primary files:

- `lab-inventory.js`
- `lab-inventory.css`
- `BACKEND-HANDOFF.md`

### Phase 4 — Action Builder

Completed in the Lab frontend.

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

Actions reference People, Organizations, Documents, and Digital Assets by stable record IDs.

Current action states:

- Draft
- Enabled
- Suspended

Current risk levels:

- Informational
- Important
- Critical
- Destructive

Destructive-risk definitions force simulated operator approval in the Lab UI. Production backend policy must enforce this independently.

Primary files:

- `lab-actions.js`
- `lab-actions.css`
- `ACTIONS-BACKEND-HANDOFF.md`

### Phase 5 — Configurable switch policy + sequence simulator

Completed.

The primary proof-of-life window is not permanently fixed to 72 hours inside Lab presentation.

Switch policy supports:

- user-selected proof-of-life duration
- hours or days input
- minimum 1 hour
- maximum 30 days
- configurable grace period from 0 to 24 hours
- rolling repeat mode
- one-shot mode

Current semantics:

- `rolling repeat`: an accepted future check-in rearms a new cycle
- `one-shot`: completion does not automatically create another cycle and a future backend would require explicit rearm

The Lab mock API reads this same policy, so the cloned status screen receives the selected `interval_hours`, `grace_hours`, and `repeat_enabled` values.

The sequence simulator includes:

- Safe → Deadline → Grace → Final Trigger visualization
- action markers positioned from the current policy
- configurable deadline location instead of a fixed 72/96-hour visual
- simulated incident clock
- Reset clock
- Jump to deadline
- +1 hour
- +6 hours
- Jump to final trigger
- execution queue
- WAITING / ELIGIBLE / AWAITING APPROVAL / EXECUTING / SUCCEEDED / FAILED / RETRY QUEUED states
- simulated success/failure outcomes
- simulated approval path
- Run eligible control
- next-event panel
- execution trace
- simulation run history
- Lab simulation trace mirrored into Activity
- horizontal desktop timeline
- vertical mobile chronology

The old hidden Timeline nav is exposed as `Sequence` only in Lab.

Primary files:

- `lab-timeline-live.js`
- `lab-timeline.css`
- `lab-timeline-responsive.css`
- `lab-mock-api.js`

### Phase 6 — Conditions, dependencies, fallbacks, acknowledgements

Completed in the Lab frontend.

Phase 6 adds a typed decision layer over the existing Phase 5 incident clock. It does not introduce arbitrary executable rules.

Current condition types:

- `switch_overdue`
- `grace_expired`
- `action_state`
- `asset_status`

Conditions can be combined with `AND` or `OR`.

Current outcome routes:

- success
- final failure
- acknowledged
- no acknowledgement
- approval denied

Decision policies can also mark sibling branches as exclusive so unresolved alternative branches are cancelled when one route is selected.

Acknowledgement behavior:

- delivery/execution success and human acknowledgement are separate states
- an action may require acknowledgement after synthetic delivery
- acknowledgement policy has a timeout in minutes
- the simulator supports Acknowledge and No response controls
- advancing the simulated incident clock beyond an acknowledgement deadline triggers the no-acknowledgement branch

Retry behavior:

- retry attempts are incident runtime state
- configured retries are consumed by simulated attempts
- the failure route fires only after attempts are exhausted

New runtime states used by the decision layer:

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

Decision graph:

- Sequence now includes a visual Logic & Routing Map
- enabled actions render as nodes
- outcome routes render as directional connections
- action-state dependencies render as dependency connections
- route types have distinct visual treatment
- mobile collapses to a vertical node chronology

Decision Inspector:

- select an action node to inspect it
- shows whether the time boundary passed
- shows whether the route gate passed
- evaluates each typed condition
- explains the current blocking reason
- shows acknowledgement policy
- shows attempt count
- shows outcome routes
- maintains a separate decision trace

Action workspace integration:

- selected actions receive a `Logic` control
- selected actions receive a compact Decision Policy card
- Configure Logic opens the Phase 6 policy editor

Decision policy editor supports:

- AND/OR logic
- add/remove typed conditions
- selected upstream action + required state
- selected Digital Asset + required status
- acknowledgement required toggle
- acknowledgement timeout
- route targets for each supported outcome
- exclusive sibling-branch behavior
- dependency-cycle validation before save

Cycle detection builds a directed graph from outcome routes plus action-state dependencies and rejects circular definitions in Lab. Production must repeat this validation server-side.

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

## Switch-policy source of truth in Lab

Current local policy shape:

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

The values above are defaults only. The UI can change them.

Production recommendation:

- store a versioned policy in PostgreSQL
- use server-authoritative time
- snapshot the policy into each opened incident/cycle
- changing future policy must not silently rewrite an active incident
- server workers determine eligibility and execution
- browser only renders state and requests authorized mutations

## Decision-policy source of truth in Lab

`cmx-lab-decisions-v1` stores reusable action decision definitions.

Conceptual shape:

```json
{
  "version": 1,
  "policies": {
    "action-id": {
      "logic": "AND",
      "conditions": [],
      "acknowledgement": {
        "required": false,
        "timeoutMinutes": 30
      },
      "routes": {
        "success": "",
        "failure": "",
        "acknowledged": "",
        "no_ack": "",
        "approval_denied": ""
      },
      "branchExclusive": true
    }
  }
}
```

`cmx-lab-decision-runtime-v1` is incident/simulation-specific runtime state and stores state overrides, attempts, acknowledgement deadlines, approvals, route signals, and decision trace events.

Production must split reusable definitions from incident runtime state in PostgreSQL.

## Timing model

For an incident opened at `last_checkin_at`:

```text
deadline_at = last_checkin_at + interval
final_trigger_at = deadline_at + grace
```

Action timing modes currently include:

- deadline
- grace offset
- grace expiration
- calendar scheduled
- manual

The Phase 5 compatibility layer updates the Lab Action Builder presentation from the old fixed 72/24 labels to the currently selected switch policy.

## Decision evaluation order

Current Lab intent mirrors the recommended future backend order:

1. action is enabled for the incident
2. action timing boundary has been reached
3. inbound route gate has been activated when applicable
4. typed conditions evaluate
5. operator approval is satisfied if required
6. action becomes eligible
7. synthetic execution attempt occurs
8. retries are accounted for
9. successful delivery either completes or waits for acknowledgement
10. terminal outcome emits a route signal
11. affected downstream actions are re-evaluated

## Production execution rule

Never execute contingency actions from browser JavaScript.

Production should use:

Browser → FastAPI → PostgreSQL → eligibility/decision scheduler → execution workers → provider adapters

Provider adapters can later cover SMS, email, AI, social, webhooks, account operations, etc., but every side effect needs server-side authorization, idempotency, audit records, and failure handling.

## Existing backend notes

Read these alongside this file:

- `assets/lab/BACKEND-HANDOFF.md`
- `assets/lab/ACTIONS-BACKEND-HANDOFF.md`
- `assets/lab/DECISIONS-BACKEND-HANDOFF.md`

They contain the proposed record tables, relationship rules, document storage boundaries, action execution models, decision tables, acknowledgements, approvals, snapshots, and API direction.

## CI / validation

Workflow:

`.github/workflows/checkin-lab-validation.yml`

It should continue checking:

- Lab JavaScript syntax
- production API isolation
- required Lab assets
- `/checkin` contains no Lab references
- backend handoff notes remain present
- switch-policy and sequence files remain wired
- decision-engine files remain wired
- decision backend handoff remains present
- persistent Lab handoff includes the current phase

When adding a new major Lab layer, add it to this validator.

## Current design direction

Keep the app visually cohesive with the existing Check In interface:

- black / charcoal primary surfaces
- electric / icy blue structural accents
- restrained red for contingency danger
- amber for waiting/decision boundaries where appropriate
- dense operational layout
- strong mobile usability
- serious secure-control feel
- no cyberpunk clutter
- no fake security claims
- no invented backend verification states

People/Organizations should remain clean and CRM-like. Trigger actions and final contingency boundaries can feel more dangerous, but visual severity should still map to real state/risk.

## Known Lab limitations

- All People/Organization/Document/Asset/Action/Decision data is mock browser-local storage.
- Document bytes are not actually stored.
- No real SMS/email/social/AI/webhook/account operation executes.
- Simulation outcomes are synthetic.
- Repeat/one-shot behavior is modeled but not backed by a real incident/rearm API yet.
- Decision evaluation is browser-only simulation. Production must move all eligibility/routing/acknowledgement authority server-side.
- Asset-status conditions currently read the mock Digital Asset status directly from local storage.
- Phase 6 initial condition catalog is intentionally typed and limited. Do not replace it with arbitrary executable expressions.
- Existing Action Builder internals were originally authored around a 72h + 24h default. Phase 5 dynamically adapts visible timing labels/positions to current Lab policy. When action timing moves to FastAPI, remove that compatibility layer and make action trigger responses policy-aware directly.
- Calendar scheduled actions are shown as calendar-controlled and are not currently projected onto the incident-relative timeline.
- Phase 6 route graph currently visualizes enabled actions. A future backend graph can include disabled/draft nodes with explicit filters.

## Next phase

### Phase 7 — Audit history + definition versioning

Recommended build order:

1. unified incident timeline across switch, action, decision, acknowledgement, and approval events
2. immutable-looking Lab revision history for action/decision definitions
3. compare two action-definition revisions
4. show who/what changed a definition in mock audit data
5. simulation/incident summary pages
6. execution snapshot viewer
7. exportable human-readable incident report mock
8. backend handoff for append-only audit records and version tables

After Phase 7, continue with the earlier roadmap for global search, command palette, dashboards, and final mobile polish.

## Resume checklist for another context

1. Read this file.
2. Inspect latest `main` before editing because multiple contexts may have touched the repo.
3. Confirm `/checkin` is still free of `/assets/lab/` references.
4. Confirm `lab/index.html` still blocks production API connectivity.
5. Inspect the latest Lab validation workflow result.
6. Work only inside Lab unless the user explicitly requests a production port.
7. Read `DECISIONS-BACKEND-HANDOFF.md` before changing Phase 6 semantics.
8. Preserve delivery vs acknowledgement as separate states.
9. Preserve typed conditions and server-authoritative production intent.
10. Update this file at the end of every major Lab round with what changed, files touched, new storage/API assumptions, known limitations, and next work.
