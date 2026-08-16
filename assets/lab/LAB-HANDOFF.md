# Check In Lab Handoff

Last updated: 2026-08-16

Read this file first when resuming work on `/lab`.

## Purpose

`/lab` is the isolated frontend sandbox for the Check In dead-man-switch project. It exists so interface, record-model, action-builder, timing, simulation, decision-routing, audit, versioning, incident-snapshot, search, navigation, and product-integration work can be tested without modifying production `/checkin`.

Production `/checkin` must remain untouched unless the user explicitly asks to port an approved Lab change back.

For eventual migration into the official Check In project, also read `CHECKINLABCLONE.md`.

## Safety boundary

The Lab must never perform protected production Check In operations.

Current safeguards:

- `lab/index.html` is a minimal boot shell and does not contain the snapshot-transform code inline.
- `assets/lab/lab-loader.js` fetches the frozen snapshot, rewrites production asset paths, and changes `connect-src` to same-origin only.
- `assets/lab/lab-mock-api.js` intercepts requests aimed at `https://api.cmxchat.com`.
- The synthetic public status request is answered locally.
- Other production Check In API requests return a Lab-safe 403.
- The page visibly identifies itself as Lab/mock mode.
- People, Organizations, Documents, Digital Assets, Actions, switch policy, simulations, decision state, audit state, versions, incident snapshots, and recent navigation are browser-local mock state.
- Phase 6 decision logic cannot execute arbitrary code or external actions.
- Phase 7 fingerprints are visual Lab fingerprints only and are not cryptographic assurance.
- Phase 8 search reads only local Lab stores and does not call production.
- The acceptance layer can improve UX and validation but cannot execute an external side effect.

Do not weaken this boundary to make a demo easier.

### Lab CSP compatibility note

The final transformed Lab snapshot keeps `script-src 'self'` and `connect-src 'self'`.

The Lab currently uses:

```text
style-src 'self' 'unsafe-inline'
```

This is a prototype compatibility exception because inherited Check In components plus Sequence/Action visualizations still calculate some positions through `element.style` and inline style attributes.

Do not treat this as a production recommendation. The official application should use its native component/CSS architecture and tighten CSP without depending on this Lab compatibility exception.

## Current loader

### `lab/index.html`

This is now only a small loading/error shell. It loads:

```text
/assets/lab/lab-loader.js
```

Do not move the snapshot transform back into an inline `<script>`.

### `assets/lab/lab-loader.js`

The external loader:

1. fetches `assets/lab/checkin-index-snapshot.html`
2. rewrites `/assets/checkin/` to `/assets/lab/`
3. rewrites Check In URLs to `/lab/`
4. removes production API connectivity from CSP
5. applies the Lab dynamic-style CSP compatibility rule
6. marks the generated body with `data-lab-mode="true"`
7. loads `lab-mock-api.js` before the copied status/client scripts
8. loads all Lab product layers
9. fails into a controlled Retry screen if the snapshot contract changes or loading fails

### Parser bug fixed during acceptance hardening

The earlier `lab/index.html` placed the entire transform inside an inline script. That inline JavaScript contained string literals with raw `</script>` text because it was constructing script tags for the generated page.

HTML parsers terminate an inline script when they encounter that end tag even when the characters appear inside a JavaScript string. On mobile Chrome this caused the remaining JavaScript source to be rendered as page text and the Lab to fail with `LAB SNAPSHOT UNAVAILABLE`.

The transform was moved to external `lab-loader.js` so this parser failure class cannot recur through the same mechanism.

CI now generates the final transformed snapshot and runs it in headless Chromium.

### Lab JavaScript boot order

Bootstrap before generated page:

0. `lab-loader.js`

Lab product layers inside the generated page:

1. `lab-crm.js`
2. `lab-inventory.js`
3. `lab-actions.js`
4. `lab-timeline-live.js`
5. `lab-decisions.js`
6. `lab-decisions-events.js`
7. `lab-audit-bootstrap.js`
8. `lab-audit.js`
9. `lab-command.js`
10. `lab-acceptance.js`

`lab-audit-bootstrap.js` protects Phase 7 provenance when an older simulation existed before the audit layer.

`lab-audit.js` owns the Lab audit/version/incident adapter.

`lab-command.js` is the global search/navigation integration layer. It may read other Lab stores and drive their existing UI controls, but it must not become a second persistence or execution source of truth.

`lab-acceptance.js` intentionally loads last. It is a narrow stabilization layer for cross-module UX and browser-smoke readiness. It does not own domain truth.

### Lab CSS layers

1. `lab-safety.css`
2. `lab-crm.css`
3. `lab-inventory.css`
4. `lab-actions.css`
5. `lab-timeline.css`
6. `lab-timeline-responsive.css`
7. `lab-decisions.css`
8. `lab-audit.css`
9. `lab-command.css`
10. `lab-acceptance.css`

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
- `cmx-lab-navigation-v1`

A future FastAPI/PostgreSQL implementation should replace the domain-data adapters without forcing a visual rewrite. Recent-navigation preferences may remain client-side in the official application, but must not cache protected payloads.

## Completed phases

### Phase 1: Lab isolation

Completed.

- production API blocked
- synthetic public switch status
- explicit Lab presentation
- `/checkin` separate from Lab

### Phase 2: People + Organizations CRM

Completed.

- Pipedrive-style directory workspace
- People and Organization records
- search/filter/sort
- profile/detail/context panes
- notes/activity
- People and Organization linking
- add/edit flows
- mobile drill-in
- local mock persistence

Primary files:

- `lab-crm.js`
- `lab-crm.css`

### Phase 3: Documents + Digital Assets

Completed.

Documents include metadata, status, sensitivity, review dates, notes, tags, activity, and links to People, Organizations, and Digital Assets.

Digital Assets include domains, websites, cloud accounts, hosting, repositories, social accounts, devices, service accounts, owners, organizations, notes, tags, and `secret_ref` placeholders.

Important rule: passwords, tokens, private keys, recovery codes, MFA secrets, cookies, and other credentials do not belong in ordinary record storage.

Primary files:

- `lab-inventory.js`
- `lab-inventory.css`
- `BACKEND-HANDOFF.md`

### Phase 4: Action Builder

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

Definition states:

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

### Phase 5: Configurable switch policy + Sequence simulator

Completed.

The proof-of-life window is not permanently hardcoded to 72 hours in Lab presentation or the Lab status contract.

Switch policy supports:

- user-selected duration
- hours or days
- minimum 1 hour
- maximum 30 days / 720 hours
- grace from 0 to 24 hours
- rolling repeat
- one-shot

Semantics:

- `rolling repeat`: an accepted future check-in rearms a new cycle
- `one-shot`: completion requires an explicit future rearm

Sequence includes:

- Safe to Deadline to Grace to Final Trigger visualization
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

Acceptance hardening fixed two policy issues:

- the Lab copy of `checkin-status-contract.js` now accepts `1..720` interval hours instead of silently requiring exactly 72
- the day/hour editor constrains Days to 30 and Hours to 720, with a visible conversion/review step when the operator changes units

Primary files:

- `lab-timeline-live.js`
- `lab-timeline.css`
- `lab-timeline-responsive.css`
- `lab-mock-api.js`
- Lab copy of `checkin-status-contract.js`

### Phase 6: Conditions, dependencies, fallbacks, acknowledgements

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

Sequence includes a Logic & Routing Map and Decision Inspector. The Action workspace gets a compact Logic control/card instead of a large extra form.

Primary files:

- `lab-decisions.js`
- `lab-decisions-events.js`
- `lab-decisions.css`
- `DECISIONS-BACKEND-HANDOFF.md`

### Phase 7: Audit history + definition versioning + incident snapshots

Completed.

Activity now contains `Audit`, `Incidents`, `Versions`, and `Health` tabs.

The Lab records structured definition/audit events for switch policy, Actions, Decision Policies, Documents, Digital Assets, Organizations, People changes, removals/tombstones, incident creation, and historical restore operations.

Versioned objects currently include:

- switch policy
- Actions
- Decision Policies
- Documents
- Digital Assets
- Organizations

Each revision stores version number, object type/id, label, timestamp, Lab actor/source, reason, payload snapshot, and Lab fingerprint.

Restoring an older definition creates another new revision. History is never rewound.

When a new Lab simulation is seen after Phase 7 is active, the audit layer snapshots:

- current switch policy
- current definition-version references
- every enabled Action definition
- Decision Policies for enabled Actions
- stable target references
- snapshot fingerprint

Later edits do not rewrite an incident snapshot.

Simulation runs created before Phase 7 may be marked `legacy`. Exact definition provenance must not be invented for those runs.

Health tracks:

- changed since latest non-legacy simulation snapshot
- action success-path coverage
- failure-path coverage
- acknowledgement-path coverage
- fallback/routed-path coverage

Current display is `x/4` per action.

Primary files:

- `lab-audit-bootstrap.js`
- `lab-audit.js`
- `lab-audit.css`
- `AUDIT-BACKEND-HANDOFF.md`

### Phase 8: Universal search + command palette + app integration

Completed in the Lab frontend.

Primary files:

- `lab-command.js`
- `lab-command.css`

Phase 8 is intentionally an integration layer. It does not replace the earlier modules.

#### Universal search

The command index can currently search local Lab representations of:

- People
- Organizations
- Documents
- Digital Assets
- Actions
- Incidents
- versioned definitions
- Audit events
- navigation commands
- saved views
- quick-create commands

The index is rebuilt from current local stores when the palette renders. Search never calls production.

Official-project search must be authorization-aware and server/API-backed so restricted entities cannot leak through search results, snippets, counts, or timing behavior.

#### Command palette

Open with:

- `Cmd+K` on Apple platforms
- `Ctrl+K` elsewhere
- `/` when the user is not typing in an editor
- the Search control in the top bar

Keyboard controls:

- Up / Down moves between results
- Enter opens the selected result
- Escape closes the palette
- Tab / Shift+Tab remain trapped inside the open palette after acceptance hardening

The palette shows recent items before the user types and groups matching results by object type.

#### Deep navigation

Current Lab deep-link adapter uses hashes such as:

```text
#lab=person%3Ap-maya
#lab=action%3Aact-ai-brief
#lab=incident%3Asim-...
```

The adapter drives the existing Lab module controls so opening a search result lands on the exact record/action/incident/version instead of only switching to a broad section.

Browser back/forward responds to these Lab routes.

Acceptance hardening disabled the copied legacy Check In hash-history enhancer inside Lab mode because it used `#records`, `#actions`, and similar hashes and could overwrite Phase 8 exact routes.

Stale deep links now fall back to the correct workspace and show a message instead of silently doing nothing.

Official migration must replace this hash adapter with the official application router. Do not copy DOM-click routing into React/TanStack Router.

#### Global quick create

The top bar exposes a Lab `New` menu for:

- Person
- Organization
- Document
- Digital Asset
- Action
- Note current record when supported

The integration layer opens the existing editor for each object. It does not implement duplicate creation logic.

Acceptance hardening adds menu/menuitem semantics, arrow-key navigation, and prevents `Note current record` from opening a dead-end search when no note-capable record is selected.

#### Saved views

Current built-in views include:

- Critical actions
- Documents needing review
- Untested action paths
- Changed since simulation

These use existing filters or the Activity Health view.

#### Recently viewed

`cmx-lab-navigation-v1` stores only lightweight local navigation metadata for recent objects. Do not add protected record payloads to this store.

#### Status assurance

Status gets a `Current configuration / Contingency assurance` block derived from the same Lab stores used by Phase 7.

It surfaces:

- configured proof-of-life interval
- grace window
- rolling repeat / one-shot mode
- enabled Action count
- latest non-legacy test snapshot
- definitions changed since that snapshot
- enabled Actions below 4/4 simulated path coverage
- Documents needing review

Possible presentation states:

- `PLAN CURRENT`
- `TEST REQUIRED`
- `RETEST REQUIRED`
- `COVERAGE INCOMPLETE`

These are Lab assurance states only. They do not claim real provider delivery or production readiness.

#### Mobile and accessibility integration

Phase 8 plus acceptance hardening includes:

- full-width mobile command sheet
- mobile quick-create sheet
- larger top-bar touch targets
- explicit focus-visible styling
- keyboard-first command navigation
- command-palette focus containment
- ARIA menu semantics for quick create
- `aria-modal` command surface
- `aria-keyshortcuts`
- reduced-motion treatment
- dark/light theme support
- additional <=380px top-bar compression

### Phase 8 acceptance / stabilization round

Completed after the user opened `/lab` on Android and exposed the parser failure described above.

Primary files:

- `lab/index.html`
- `lab-loader.js`
- Lab copy of `checkin-status-contract.js`
- `lab-acceptance.js`
- `lab-acceptance.css`
- `.github/workflows/checkin-lab-validation.yml`

Acceptance fixes include:

- external snapshot loader replacing parser-fragile inline JavaScript
- controlled load/retry shell
- custom `1..720` hour status-contract validation
- Lab deep-link router no longer conflicts with copied legacy hash history
- dynamic day/hour policy editor limits
- command palette focus containment
- quick-create ARIA/keyboard behavior
- no dead-end global Note command
- stale-route fallback handling
- mobile top-bar touch/spacing polish
- an explicit `data-lab-acceptance="ready"` browser readiness marker
- generated-snapshot CI validation
- headless desktop browser boot test
- exact Action deep-link browser test
- 390×844 mobile browser boot test

## Switch-policy source of truth in Lab

`cmx-lab-switch-policy-v1`

Conceptual shape:

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

## Version / incident snapshot rule

A definition version is reusable configuration history.

An incident snapshot is the exact version set used by one incident.

They must stay separate.

Example:

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

## Backend and migration handoffs

Read as needed:

- `BACKEND-HANDOFF.md`
- `ACTIONS-BACKEND-HANDOFF.md`
- `DECISIONS-BACKEND-HANDOFF.md`
- `AUDIT-BACKEND-HANDOFF.md`
- `CHECKINLABCLONE.md`

`CHECKINLABCLONE.md` is the official-project migration blueprint. Update it whenever a major Lab phase adds approved behavior that should eventually be recreated in the official application.

## CI / validation

Workflow:

`.github/workflows/checkin-lab-validation.yml`

The validator now tests browser behavior, not just source-string presence.

It should continue checking:

- Lab JavaScript syntax
- configurable status-contract values including non-72-hour intervals
- production API isolation
- required Lab assets
- `/checkin` has no Lab references
- generated transformed snapshot contains the expected Lab CSP/assets
- `lab-mock-api.js` loads before the copied Check In client
- backend handoff documents remain present
- switch-policy/Sequence files remain wired
- Decision files remain wired
- Audit/version files remain wired
- Phase 8 command/search files remain wired
- acceptance/stabilization files remain wired last
- append-only/version/snapshot handoff language remains present
- `CHECKINLABCLONE.md` remains present
- persistent handoff includes the current phase
- headless Chromium boots the complete Lab
- the browser reaches `data-lab-acceptance="ready"`
- an exact Action `#lab=` deep link selects the expected Action
- a 390×844 viewport boots successfully with mobile navigation and global controls

The earlier parser bug passed the old validator because that validator only checked JavaScript syntax and expected strings. Do not regress to source-only validation for the Lab boot path.

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

- Everything remains browser-local mock state.
- Document bytes are not stored.
- No real SMS/email/social/AI/webhook/account operation executes.
- Simulation outcomes are synthetic.
- Repeat/one-shot behavior has no real incident/rearm API yet.
- Decision evaluation is browser simulation only.
- Asset-status conditions read mock Digital Asset state.
- The condition catalog is intentionally typed and limited.
- Calendar-scheduled actions are not projected onto the incident-relative timeline.
- Exact version provenance is unavailable for simulations created before Phase 7; those are labeled legacy.
- Phase 7 Lab fingerprints are non-cryptographic and must never be presented as real tamper-proof validation.
- Existing modules can physically remove local mock definitions. Phase 7 preserves historical revisions/audit tombstones, but production should prefer archive/soft-delete behavior.
- Phase 8 universal search is a local prototype. It does not represent a production authorization/search architecture.
- Phase 8 deep routing depends on stable DOM/data attributes from the Lab modules. The official application must use its native router and component APIs.
- Recently viewed entries are browser-local convenience metadata.
- `lab-loader.js` and `lab-acceptance.js` are static-clone compatibility layers, not official-app architecture.
- Lab currently permits inline styles in CSP because prototype visual positioning uses them. The official application should remove that dependency.

## Next work after acceptance stabilization

Do not start production backend wiring just because the Lab now passes browser smoke tests. The user is still validating the product and data model.

Recommended next work:

1. user visually reviews the repaired live `/lab` on the actual Android device
2. test several real interactions manually: Records, Actions, Sequence, Activity, Search, New, Settings, light/dark mode
3. address any device-specific issue not represented by headless Chromium
4. run a small set of representative simulations and verify assurance/incident history behavior
5. remove any duplicated or obsolete UI found during manual use
6. only after user approval, freeze/tag an approved Lab migration candidate

The official-project migration should then use `CHECKINLABCLONE.md`, not a blind copy of `/lab` source code.

## Resume checklist for another context

1. Read this file first.
2. Read `CHECKINLABCLONE.md` if migration/official-project work is involved.
3. Inspect latest `main` before editing because another context may have touched the repo.
4. Confirm `/checkin` contains no `/assets/lab/` references.
5. Confirm `lab/index.html` is only a boot shell and uses external `lab-loader.js`.
6. Confirm `lab-loader.js` still strips production API connectivity.
7. Confirm `lab-loader.js` loads `lab-mock-api.js` before the copied status/client scripts.
8. Inspect latest Lab validation workflow result, including the Chromium smoke steps.
9. Work only inside Lab unless explicitly asked to port to production.
10. Read the relevant backend handoff before changing data semantics.
11. Preserve delivery vs acknowledgement as separate states.
12. Preserve typed conditions and server-authoritative production intent.
13. Preserve immutable incident-snapshot semantics.
14. Preserve `restore old version → create new revision` semantics.
15. Do not claim Lab fingerprints are cryptographic assurance.
16. Do not let `lab-command.js` or `lab-acceptance.js` become an authoritative domain-data store.
17. Preserve Phase 8 ownership of `#lab=` routes; do not reactivate the copied legacy hash router in Lab mode.
18. Do not move the snapshot transform back into inline JavaScript.
19. Update this file at the end of every major Lab round with changed files, new storage/API assumptions, known limitations, and next work.
20. Update `CHECKINLABCLONE.md` when the round adds behavior or lessons intended for the official project.

Update this file at the end of every major Lab round.
