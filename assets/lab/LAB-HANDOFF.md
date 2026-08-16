# Check In Lab Handoff

Last updated: 2026-08-16

Read this file first when resuming work on `/lab`.

## Purpose

`/lab` is the isolated frontend sandbox for the Check In dead-man-switch project. It exists so interface, data-model, action-builder, timing, and simulation work can be tested without modifying the production `/checkin` experience.

Production `/checkin` should remain untouched unless the user explicitly asks to port an approved Lab change back.

## Safety boundary

The Lab must never call the production Check In API for switch mutations or protected operations.

Current safeguards:

- `lab/index.html` rewrites the cloned CSP to `connect-src 'self';`.
- `assets/lab/lab-mock-api.js` intercepts requests aimed at `https://api.cmxchat.com`.
- Only the synthetic public status request is answered locally.
- Other production API requests return a Lab-safe 403 response.
- The page visibly identifies itself as Lab/mock mode.
- Lab records/actions/simulations are browser-local mock data.

Do not weaken this boundary to make a feature easier to demo.

## Current loader

`lab/index.html`

The loader fetches the frozen Check In HTML snapshot, rewrites production asset URLs to `/assets/lab/`, blocks production API connectivity, and adds Lab-only layers.

Current Lab-only layers loaded after the cloned Check In scripts:

1. `lab-crm.js`
2. `lab-inventory.js`
3. `lab-actions.js`
4. `lab-timeline-live.js`

Current Lab-only CSS layers:

1. `lab-safety.css`
2. `lab-crm.css`
3. `lab-inventory.css`
4. `lab-actions.css`
5. `lab-timeline.css`

## Local mock storage keys

These are not production persistence contracts. They are temporary browser adapters.

- `cmx-lab-crm-v1`
- `cmx-lab-inventory-v1`
- `cmx-lab-actions-v1`
- `cmx-lab-switch-policy-v1`
- `cmx-lab-simulations-v1`

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

Completed in the current round.

The primary proof-of-life window is no longer treated as permanently fixed to 72 hours inside Lab presentation.

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
- `lab-mock-api.js`

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

## Production execution rule

Never execute contingency actions from browser JavaScript.

Production should use:

Browser → FastAPI → PostgreSQL → eligibility scheduler / execution workers → provider adapters

Provider adapters can later cover SMS, email, AI, social, webhooks, account operations, etc., but every side effect needs server-side authorization, idempotency, audit records, and failure handling.

## Existing backend notes

Read these alongside this file:

- `assets/lab/BACKEND-HANDOFF.md`
- `assets/lab/ACTIONS-BACKEND-HANDOFF.md`

They contain more detailed proposed tables, relationship rules, document storage boundaries, action execution models, snapshots, and API direction.

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

When adding a new major Lab layer, add it to this validator.

## Current design direction

Keep the app visually cohesive with the existing Check In interface:

- black / charcoal primary surfaces
- electric / icy blue structural accents
- restrained red for contingency danger
- dense operational layout
- strong mobile usability
- serious secure-control feel
- no cyberpunk clutter
- no fake security claims
- no invented backend verification states

People/Organizations should remain clean and CRM-like. Trigger actions and final contingency boundaries can feel more dangerous, but visual severity should still map to real state/risk.

## Known Lab limitations

- All People/Organization/Document/Asset/Action data is mock browser-local storage.
- Document bytes are not actually stored.
- No real SMS/email/social/AI/webhook/account operation executes.
- Simulation outcomes are synthetic.
- Repeat/one-shot behavior is modeled but not backed by a real incident/rearm API yet.
- Existing Action Builder internals were originally authored around a 72h + 24h default. Phase 5 dynamically adapts visible timing labels/positions to current Lab policy. When action timing moves to FastAPI, remove that compatibility layer and make action trigger responses policy-aware directly.
- Calendar scheduled actions are shown as calendar-controlled and are not currently projected onto the incident-relative timeline.

## Next phase

### Phase 6 — Conditions, dependencies, fallbacks, acknowledgements

Recommended build order:

1. condition rules
2. action-to-action dependencies
3. success/failure branches
4. fallback channels
5. acknowledgement requirements
6. retry accounting per execution attempt
7. stop/continue sequence policy
8. dependency graph visualization
9. simulator support for conditional branches
10. backend handoff updates

Examples:

```text
Email counsel
  ↓ if acknowledged
AI briefing
  ↓ success
Publish approved package

Email counsel
  ↓ if failed / unacknowledged
SMS fallback
```

Do not build a generic arbitrary-code rule engine in the browser. Use explicit typed conditions that a future backend can validate safely.

## Resume checklist for another context

1. Read this file.
2. Inspect latest `main` before editing because multiple contexts may have touched the repo.
3. Confirm `/checkin` is still free of `/assets/lab/` references.
4. Confirm `lab/index.html` still blocks production API connectivity.
5. Inspect the latest Lab validation workflow result.
6. Work only inside Lab unless the user explicitly requests a production port.
7. Update this file at the end of every major Lab round with what changed, files touched, new storage/API assumptions, known limitations, and next work.
