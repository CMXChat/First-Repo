# Check In Automations Frontend — Current Handoff

Date: 2026-08-18
Status: Active focused Lab prototype

## Focused route

`https://db.cmxchat.com/lab/automations/`

This is the canonical place to review and iterate the Automation UX. `/lab/` remains the larger Check In Lab workspace and links into this route.

The focused route is Lab-only. Its CSP keeps `connect-src 'self'`. It must not call the production Check In API, execute providers, schedule authoritative work, publish a production Automation or claim a Draft is live.

## Current frontend authority

The focused route now uses Automations v3:

- `lab/automations/index.html`
- `assets/lab/lab-automations-app.css` — small retained base/brand layer
- `assets/lab/lab-automations-experience-v3.css` — current responsive product UI
- `assets/lab/lab-automations-experience-v3.js` — current Automation app
- `assets/lab/lab-automations-route-integration.js` — deep links and return navigation only

The former `lab-automations-app-v2.js` and its dropdown, friendly, content, file, audience, library, communication and mobile enhancement runtimes remain repository history. They are no longer loaded by `/lab/automations/` and must not be treated as the current focused UX authority.

## Product model

The old seven-screen wizard has been replaced with five stages:

```text
WHEN  Trigger
IF    Rules
DO    Actions
WAIT  Timing
TEST  Review
```

A user should be able to read the Automation as a sentence:

```text
WHEN this happens
→ IF these rules still match
→ DO these actions in order
→ WAIT / REPEAT according to timing
→ FINISH with this end state
```

Name and description are metadata, not a blocking first step. New drafts receive an automatic readable name from the Trigger and first enabled Action. The user can edit details at any time.

Finish behavior is configured inside Review so the end state is visible beside the complete path instead of isolated in another wizard screen.

## Dashboard UX

The Automations home includes:

- Draft / Published / Archived prototype lifecycle tabs;
- a clear `LAB · SIMULATION ONLY` safety state;
- `New automation`;
- quick-start templates;
- readable draft cards with compact WHEN / IF / DO flow summaries;
- shared Lab-record connection status.

Current templates:

- Missed check-in escalation;
- Daily briefing;
- Notify someone later;
- AI prepares report;
- Multi-step emergency contact.

Templates create normal editable Drafts. They do not create a second template-specific data model.

## Trigger and Rules

Trigger remains the eligibility boundary. Current prototype Trigger choices are:

- Grace begins;
- Grace expires;
- Manual start;
- Calendar time.

Rules are optional. Zero Rules means `Always continue`.

Multiple Rules can use:

- `Match all · AND`;
- `Match any · OR`.

Keep the UI plain-language. The deeper backend still owns authoritative typed Condition definitions and eligibility evaluation.

## Actions

Actions are the center of the editor.

The v3 Action stack supports:

- multiple ordered steps;
- up/down ordering controls;
- drag/drop ordering on pointer-capable devices;
- duplicate;
- pause/enable without deleting;
- remove;
- replace action type;
- protected target selection;
- searchable Action/target pickers.

Current simple inline Action types are:

- Notify a person;
- Send email;
- AI task;
- Manual review.

Protected targets come from the existing Lab CRM and Inventory stores, so People, Organizations, Documents and Digital Assets are selected by stable Lab IDs where available.

## Reusable Action library

The focused builder now reads:

```text
cmx-lab-actions-v1
```

Saved Actions from the main Lab Action library can be inserted into an Automation as explicit references:

```json
{
  "type": "action_ref",
  "actionId": "act-example",
  "actionLabel": "Example saved action",
  "enabled": true
}
```

This is intentionally different from silently mapping Action-library types into the smaller inline type list. SMS, Webhook/API, Digital Account, Publish and other saved Action types keep their reusable Action identity, risk and status.

The main Lab Action library remains the definition authority. The focused Automation only stores and displays the reference.

Production must resolve and authorize a referenced Action server-side and snapshot/version the resolved definition for reproducible execution.

## Timing

Timing is presented as a visual line from Trigger to Actions and optional Repeat.

Current start modes:

```text
Immediate
Delay
Exact date & time
```

Delay is elapsed trigger-relative time. A two-day delay means 48 elapsed hours.

Exact date/time is a future not-before scheduling concept and includes an IANA timezone. It never grants the browser scheduling authority.

Recurrence remains separate from start timing and retry. Current prototype choices are:

- no repeat;
- daily;
- weekly;
- custom;
- until acknowledged.

Minutes/hours are elapsed cadence concepts. Days/weeks/months/years are calendar concepts and production needs deterministic DST, end-of-month and leap-year rules.

## Live flow

The editor continuously exposes the current workflow shape.

Desktop uses a sticky live-flow side panel. Mobile uses a compact readable flow button that expands the same information without squeezing a desktop sidebar into the phone layout.

The live flow and readable sentence update from current Trigger, Rules, enabled Actions, Timing, Repeat and Finish state.

## Review and simulation

Review is an actual pre-flight surface instead of a static summary.

It includes:

- the complete flow;
- Finish behavior;
- local validation warnings;
- a safe animated simulation;
- a local simulation log;
- `Save draft & close`.

The simulation only walks the rendered workflow. It never sends email/SMS, runs an AI tool, calls a webhook, changes an account or performs any other external side effect.

Current Finish choices:

- End workflow;
- Continue on success;
- Escalate if not acknowledged;
- Require review.

## Shared prototype storage

Current shared stores used directly by v3:

- Automations: `cmx-lab-automations-v1`
- CRM/Directory: `cmx-lab-crm-v1`
- Inventory: `cmx-lab-inventory-v1`
- Reusable Actions: `cmx-lab-actions-v1`

These stores are browser-local prototype state only.

Automations v3 normalizes existing Drafts and continues writing older compatibility fields such as `condition`, `action`, `target`, `content`, `wait`, `repeat` and `editorStep` while newer UX fields include `conditions`, `ruleMode`, per-action `enabled`, `action_ref` and `editorStage`.

Do not remove those compatibility fields until the main Lab adapter has been deliberately migrated.

## Autosave and resume

Draft edits autosave after a short debounce. Explicit Save remains available.

`persist()` clears the pending autosave timer before writing, preventing an older delayed timer from saving stale editor state after a close/open transition.

The Draft stores its current five-stage editor position and resumes there later.

## Mobile contract

Phone UX is first-class, especially Samsung/Chrome-sized screens.

Preserve these rules:

- one primary decision area at a time;
- readable copy without zooming;
- large tap targets;
- horizontally scrollable stage rail instead of compressed labels;
- one-column Action cards;
- bottom-sheet pickers/modals;
- mobile live-flow disclosure instead of a crushed desktop sidebar;
- safe-area-aware fixed footer;
- document-level scrolling without nested editor scroll traps;
- no horizontal page overflow;
- dark mode remains rich black, with a usable light theme;
- reduced-motion preferences are honored.

The layout is allowed to become taller on mobile to protect readability and touch accuracy.

## Grace semantics

Grace must remain understandable without requiring Dead Man Switch terminology.

```text
normal check-in window ends
→ check-in becomes overdue
→ grace window opens
→ final trigger happens only if grace expires
```

Grace duration comes from authoritative switch policy. Frontend definitions must not hardcode a fixed duration as architecture.

A successful protected check-in during an applicable grace window can return the switch to Safe according to backend policy semantics.

## Backend handoff

Canonical backend contracts remain in `CMXChat/jay-app/specs/003-server-checkin/`, including the Automation frontend/backend contract and cross-repository implementation guidance.

Production implementation must preserve:

- server Draft persistence;
- typed Trigger / Condition / Action / Outcome registries;
- stable protected target IDs;
- ordered multiple Actions;
- disabled/paused step semantics if accepted;
- switch-derived grace state from authoritative policy/window data;
- start timing separate from future explicit WAIT nodes;
- timezone-aware scheduling;
- recurrence separate from retry;
- server authorization and versioned resolution for reusable Action references;
- immutable published versions;
- scheduler/worker authority;
- immutable execution/audit events.

## What later moves into `/checkin/`

Do not port this UX into production Check In merely because it looks complete.

Accepted pieces should move only when matching backend services and policy enforcement exist. Reuse protected Check In Contacts, Organizations, Records, sessions and policy data where their semantics match.

The likely production navigation remains:

```text
Actions
→ Automations
→ Draft / Published / Archived
→ Trigger / Rules / Actions / Timing / Review
```

## Current review checklist

On Samsung/Chrome and desktop, verify:

1. Templates are useful and easy to scan.
2. A new Automation opens directly on Trigger, not a Name form.
3. The five-stage rail is clear and scrolls correctly on phone.
4. Rules read naturally and AND / OR is understandable.
5. Action cards are easy to reorder, duplicate, pause and remove.
6. Target search can find current Lab records.
7. Saved Lab Actions appear as explicit reusable references.
8. The live flow stays readable while editing.
9. Delay, exact time and recurrence controls are understandable.
10. Review shows the whole path and Finish state together.
11. Simulation visibly progresses without any external execution.
12. Autosave/resume does not jump to stale Draft state.
13. Dark and light themes are usable.
14. There is no horizontal page overflow or mobile scroll trap.
15. Nothing claims Publish or execution is live.
