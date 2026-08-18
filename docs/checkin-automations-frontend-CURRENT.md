# Check In Automations Frontend — Current Handoff

Date: 2026-08-18
Status: Active focused Lab prototype

## Focused route

`https://db.cmxchat.com/lab/automations/`

This is the canonical place to review and iterate the Automation UX. `/lab/` remains the larger Check In Lab workspace and links into this route.

The focused route is Lab-only. Its CSP keeps `connect-src 'self'`. It must not call the production Check In API, execute providers, schedule authoritative work, publish a production Automation or claim a Draft is live.

## Current frontend authority

The focused route now uses Automations v3 plus the final screenshot-QA/progressive-preview layers:

- `lab/automations/index.html`
- `assets/lab/lab-automations-app.css` — small retained base/brand layer
- `assets/lab/lab-automations-experience-v3.css` — current responsive product UI
- `assets/lab/lab-automations-system-surface.css` — current product hierarchy/readability layer
- `assets/lab/lab-automations-final-qa.css` — final screenshot-driven layout and pending-state rules
- `assets/lab/lab-automations-experience-v3.js` — current Automation app
- `assets/lab/lab-automations-route-integration.js` — deep links and return navigation only
- `assets/lab/lab-automations-system-surface.js` — system-surface copy/status adaptation only
- `assets/lab/lab-automations-progressive-preview.js` — new-draft progressive preview/progress adapter only

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

Name and description are metadata, not a blocking first step. New drafts receive an automatic readable name once enough real choices exist. The user can edit details at any time.

Finish behavior is configured inside Review so the end state is visible beside the complete path instead of isolated in another wizard screen.

## Progressive Flow Preview — accepted UX rule

The side/mobile preview is now called **Flow Preview**, not `Live Flow`.

`LIVE` already has a product meaning for capabilities that really work with protected state. A local builder preview must not borrow that status word.

For a brand-new blank Automation, the preview grows as the user makes or confirms choices. It must never present compatibility defaults as if the user selected them.

Initial new-draft preview:

```text
WHEN    Choose a trigger
IF      Not set yet
DO      Choose an action
WAIT    Not set yet
FINISH  Not set yet
```

Rules:

- a required Trigger is visually unselected until the user chooses one;
- Rules are optional and become `Always continue` only after the user reaches/confirms that stage without adding a rule;
- the compatibility placeholder Action stays hidden until the user actually chooses an Action;
- Timing becomes `Immediately` only after the user reaches/confirms Timing without adding a delay/exact time;
- Finish requires an explicit user choice in Review;
- future stage buttons remain unavailable until the required earlier choices exist;
- templates are already configured, so their full flow can appear immediately;
- existing saved Drafts show their actual configured flow;
- newly created progressive Drafts remember which stages were explicitly reached/confirmed in Lab.

Prototype progress metadata uses:

```text
cmx-lab-automation-progress-v1
```

This is UI-only browser state. It is not a production persistence model.

### Production migration principle

**Never visually invent an unmade user selection.**

When this UX moves to protected `/checkin/`, use real Draft fields and explicit server/client editor state instead of copying this Lab adapter. Production defaults should be represented as defaults, accepted explicitly where that distinction matters, and never be mistaken for user-authored configuration.

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

Rules are optional. Zero Rules means `Always continue` after the Rules stage is confirmed.

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

A new blank Draft still carries an internal compatibility Action placeholder in v3 data normalization. The final UI intentionally hides that placeholder until the user chooses an Action. Do not treat the compatibility object as user intent.

## Reusable Action library

The focused builder reads:

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

For a new blank Draft, `Immediate` is a candidate/default presentation only until the user reaches and confirms Timing. The Flow Preview stays pending before that point.

## Flow Preview layout

Desktop uses a sticky Flow Preview side panel. It should follow normal document scrolling and must not create a second nested scrollbar beside the main builder.

Mobile uses a compact readable Flow Preview disclosure instead of squeezing a desktop sidebar into the phone layout.

The preview must be allowed to be incomplete. Pending steps use visibly pending styling rather than fabricated values.

Existing configured Drafts and templates can show a complete current flow immediately.

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

For a new blank Draft, Finish is not silently accepted as `End workflow`. The user must choose the end behavior before the draft can complete the progressive builder path.

## Shared prototype storage

Current shared stores used by v3:

- Automations: `cmx-lab-automations-v1`
- Automation UI progress: `cmx-lab-automation-progress-v1`
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

The progressive-preview adapter separately remembers whether a new Lab Draft has explicitly reached/confirmed Trigger, Rules, Actions, Timing and Finish. Production should fold this concept into the real Draft/editor state instead of creating a second production store.

## Screenshot-driven design rules for future `/checkin/`

The August 18 desktop/mobile audit established several rules that should survive the Lab:

1. **No giant empty operational canvases.** Empty Activity, Sequence and Logic surfaces should collapse to the information they actually contain.
2. **No debug-console micro-copy as primary UI.** User-facing operational text must remain readable on a normal desktop and phone without zooming.
3. **No nested scrolling for a normal builder sidebar.** The page owns scrolling unless a bounded picker/modal truly needs its own scroll area.
4. **Do not spread a small amount of content across a huge card.** Keep label, title, explanation and status visually grouped.
5. **Light mode needs its own contrast decisions.** Do not translate dark mode by simply making surfaces pale.
6. **Graphs earn their space.** Logic/relationship canvases should tighten when only a few nodes exist and expand when complexity actually requires it.
7. **Pending state is a first-class visual state.** Incomplete configuration should look incomplete.
8. **Lab patterns migrate as product behavior, not as static DOM patches.** Rebuild accepted behavior with the protected React/frontend stack and typed services.

The general Lab screenshot-QA layer is `assets/lab/lab-final-qa.css`. The focused Automations layer is `assets/lab/lab-automations-final-qa.css`.

## Mobile contract

Phone UX is first-class, especially Samsung/Chrome-sized screens.

Preserve these rules:

- one primary decision area at a time;
- readable copy without zooming;
- large tap targets;
- horizontally scrollable stage rail instead of compressed labels;
- one-column Action cards;
- bottom-sheet pickers/modals;
- mobile Flow Preview disclosure instead of a crushed desktop sidebar;
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
- explicit distinction between untouched/defaulted fields and user-authored/confirmed configuration where that affects UX or behavior;
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

The accepted **progressive Flow Preview** behavior should move with the builder. The Lab loader, localStorage progress adapter, DOM patching and inline-style compatibility must not.

## Current review checklist

On Samsung/Chrome and desktop, verify:

1. Templates are useful and easy to scan.
2. A new Automation opens directly on Trigger, not a Name form.
3. A new blank Draft shows no fabricated Trigger/Action/Timing/Finish choices in Flow Preview.
4. Future stages remain unavailable until required earlier choices are complete.
5. Optional Rules can be confirmed as `Always continue` without adding a rule.
6. The five-stage rail is clear and scrolls correctly on phone.
7. Rules read naturally and AND / OR is understandable.
8. Action cards are easy to reorder, duplicate, pause and remove.
9. The hidden compatibility Action never appears as a user choice before an Action is selected.
10. Target search can find current Lab records.
11. Saved Lab Actions appear as explicit reusable references.
12. Flow Preview stays readable while editing and does not create a nested desktop scrollbar.
13. Delay, exact time and recurrence controls are understandable.
14. Review shows the whole path and requires an explicit Finish state for a new blank Draft.
15. Simulation visibly progresses without any external execution.
16. Autosave/resume does not jump to stale Draft state.
17. Dark and light themes are usable.
18. There is no horizontal page overflow or mobile scroll trap.
19. Nothing claims Publish or execution is live.
