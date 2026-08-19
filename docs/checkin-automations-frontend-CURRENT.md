# Check In Automations Frontend — CURRENT

Date: 2026-08-18
Status: Active Continuum Lab Automations v5 model + ordered Flow Preview foundation with v4.4 authoring UX, Directory v2, Audience and typed data/input routing

# Focused route

`https://db.cmxchat.com/lab/automations/`

This is the canonical Automation operating/prototyping/testing route. `/lab/` remains the broader Continuum / Check In Lab workspace.

Lab-only boundary remains:

- `connect-src 'self'`;
- no production API calls;
- no provider execution;
- no authoritative scheduling;
- no real Publish;
- no provider secrets;
- no external AI model execution.

Strategic direction: `docs/continuum-automations-master-plan-CURRENT.md`.

# Current loaded stack

The route keeps the proven v3 behavior core, loads the canonical v5 model immediately after it, then loads the accepted product layers and v5 ordered-flow presentation:

- `lab-automations-experience-v3.js/.css`;
- `lab-automations-model-v5.js`;
- `lab-automations-route-integration.js`;
- `lab-automations-system-surface.js/.css`;
- `lab-automations-progressive-preview.js`;
- `lab-automations-final-qa.css`;
- `lab-automations-platform-v4.js/.css`;
- `lab-automations-platform-v4-qa.css`;
- `lab-automations-scenarios-v4.js`;
- `lab-automations-directory-v4.js/.css`;
- `lab-automations-audience-v4.js/.css`;
- `lab-automations-intelligence-v4.js/.css`;
- `lab-automations-input-routing-v4.js/.css`;
- `lab-automations-sequence-v4.js/.css`;
- `lab-automations-flow-v5.js/.css`.

Older focused v2 files remain history.

# Model responsibilities

## V3 compatibility core

Still owns browser-local `cmx-lab-automations-v1`, autosave/resume, the accepted five-stage editor, existing Action editing, reusable Action references, start timing/repeat fields and local full-flow simulation.

It is now a compatibility/editor layer, not the long-term workflow domain model.

## Canonical workflow model v5

`lab-automations-model-v5.js` normalizes each Automation into `workflowV5`.

The ordered model can contain:

- Trigger;
- pre-action Conditions;
- Actions;
- inter-step Conditions;
- inter-step WAIT nodes;
- Finish.

Start timing and recurrence remain separate policies because they have different semantics from a true inter-step WAIT.

Conceptual shape:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

The model validates:

- one Trigger / one Finish;
- Trigger first / Finish last;
- unique node IDs;
- pre-action Rules stay before Actions;
- inter-step controls stay between Actions;
- a step-output Condition cannot reference a future or missing Action.

Existing Draft fields remain compatibility projections while the UI migrates:

- `trigger`;
- `conditions[]`;
- `actions[]`;
- `flowControls[]`;
- `timing`;
- `repeatConfig`;
- `outcome`.

Browser marker:

`data-lab-automations-model="v5"`

Production does not copy this browser persistence mechanism. It migrates accepted semantics into protected typed Draft services.

## Progressive truth layer

A blank Draft remains visibly incomplete until choices are made/confirmed. Accepted label remains **FLOW PREVIEW**.

The v5 presentation reads the already-patched pending state instead of raw compatibility defaults, so it cannot claim a default Trigger/Action/Finish was selected when the user has not confirmed it.

# Platform and scenarios

The v4 command center owns Automations / Templates / Runs, search, Capability Catalog, creation chooser, Planner preview and future Runs preview.

Current scenario total: **15 editable starting patterns**.

The two newest scenarios deliberately demonstrate richer sequence logic:

- **Urgent AI follow-up** — AI assessment → IF priority is urgent → Notify;
- **Delayed backup escalation** — primary escalation → WAIT two hours → backup escalation.

They remain ordinary editable Drafts and normalize into the same v5 model.

# Directory + Audience v4.1

Communication Actions may compose Person, Organization, Group and Label selectors. Browser Lab preview resolves unique People and current email/phone readiness.

Production Audience resolution remains server-owned.

# Intelligence v4.2

Adds:

- contextual `RECOMMENDED NEXT` suggestions from the same Capability Catalog;
- friendly `Use data` typed references from Trigger / earlier Actions / Directory-Audience;
- richer local `TEST THIS STEP` traces.

Compatibility store: `cmx-lab-automation-data-bindings-v1`.

No arbitrary executable expression language.

# Input routing v4.3

Maps a typed source into a named receiving field.

Current example fields:

- Email `subject` / `body`;
- AI Task `context` / `focus`;
- Manual Review `review_context`;
- Notify `message`.

Prototype Action intent: `inputBindings[]` with `targetField` plus typed source reference.

Compatibility store: `cmx-lab-automation-input-bindings-v1`.

Step tests preserve field routing, for example `Body data ← Step 1 · AI summary`.

Browser marker: `data-lab-automations-inputs="v4-3"`.

# Advanced Flow v4.4 on v5

V4.4 remains the current Actions-stage authoring UX for inter-step logic.

Between two Action cards, the user may author:

- `IF / Continue if…` — a linear gate;
- `WAIT / Wait between steps` — an inter-step delay preview.

The v4.4 UI now reads inter-step controls from `CMXAutomationModelV5.getFlowControls()` first and writes through `CMXAutomationModelV5.setFlowControls()` first.

`flowControls[]`, `afterActionId` and `cmx-lab-automation-flow-controls-v1` remain compatibility projection/fallback only.

V5 owns the normalized sequence mutation when available and projects the temporary compatibility shape for the older UI.

Browser markers:

- `data-lab-automations-sequence="v4-4"`;
- `data-lab-automations-sequence-model="v5"` when the canonical model owns the path.

## Inter-step IF source rule

The picker exposes only Trigger values and outputs from Actions already available at that insertion point.

This prevents impossible flows such as reading output from a future Action.

Current operators are equals, does not equal, contains, greater than, less than and is true.

If false, the remaining linear path stops in the preview.

There is **no YES/NO branching graph yet**.

## Inter-step WAIT rule

This is distinct from the existing top-level Timing stage.

- top-level Timing = when the first Action may start / recurrence presentation;
- inter-step WAIT = future persisted delay between Actions.

Review marks these controls `RUNTIME REQUIRED`.

Future Runtime must persist due state. Browser timers are never authoritative execution.

# Human navigation model

Keep the simple rail:

- WHEN — Trigger;
- IF — pre-action Rules;
- DO — Action sequence + optional inter-step controls;
- WAIT — start timing / recurrence;
- TEST — Review / Finish / simulation.

The rail is a beginner navigation model over the richer v5 sequence.

Top-level IF is for data available before Actions begin. Output-dependent Conditions belong after their source Action.

# Command center and direct-new behavior

Normal New Automation offers Build manually / Scenario / Planner preview.

`/lab/automations/?new=1&from=lab` still bypasses that chooser and opens directly on Trigger.

Runs remains `RUNTIME OFF`.

# Flow Preview v5

`FLOW PREVIEW` remains the accepted product label.

The existing compact flow remains the stage navigator and keeps the truthful progressive state. The DO summary continues to expose inter-step IF/WAIT counts when present.

`lab-automations-flow-v5.js/.css` now adds **ORDERED SEQUENCE** directly under the compact Flow Preview using the canonical v5 model.

The ordered view can show:

`WHEN → IF → DO → IF → WAIT → DO → FINISH`

with the exact current Action/Condition/WAIT labels in sequence order.

Behavior:

- genuinely complex flows open the ordered sequence by default;
- simple flows remain collapsed by default;
- Show/Hide is local presentation state only;
- each ordered row navigates to the appropriate builder stage;
- start timing/recurrence appears as a separate `START` policy row instead of pretending it is an inter-step WAIT node;
- blank/new Drafts use the progressive pending-state DOM, so the ordered view still says `Choose a trigger`, `Choose an action` and `Not set yet` until those choices are confirmed;
- mobile uses the same vertical sequence with larger tap targets instead of a scaled desktop canvas.

Browser marker:

`data-lab-automations-flow="v5"`

This is the first v5 presentation layer and begins replacing mental reconstruction of the flow without deleting the beginner navigation model.

# Review / simulation

Review may show:

- workflow structure;
- Directory/Audience readiness;
- input-routing summary;
- advanced-flow control count;
- Runtime-required state;
- local simulation/log.

Local tests/simulation never become authoritative Runs.

# Current relevant Lab persistence

- Automation Drafts + embedded `workflowV5`: `cmx-lab-automations-v1`;
- progressive UI: `cmx-lab-automation-progress-v1`;
- Directory: `cmx-lab-crm-v1`;
- reusable Actions: `cmx-lab-actions-v1`;
- v4 platform state: `cmx-lab-automations-platform-v4`;
- data reference compatibility: `cmx-lab-automation-data-bindings-v1`;
- receiving-field routing compatibility: `cmx-lab-automation-input-bindings-v1`;
- advanced flow-control compatibility/fallback: `cmx-lab-automation-flow-controls-v1`.

Extra stores remain migration scaffolding while older UI code still needs them.

# AI authoring

Future Automation Planner and broader Continuum Planner use the same typed Draft/domain services as human UI.

The v5 ordered model is intentionally closer to that target because Planner can reason about explicit typed nodes and valid data availability at each position.

Planner may author inter-step controls only when matching backend capability/schema exists. The Lab model never becomes execution authority merely because it can represent the flow.

Published Automation edits become the next Draft/version proposal.

Cross-domain Planner contract: `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`.

# Mobile contract

Preserve one primary work area, large tap targets, readable 16px inputs where needed, one-column selectors, bottom-sheet/full-screen modals, safe-area-aware actions, no nested scroll traps and no horizontal overflow.

Advanced Flow and the ordered v5 sequence stay linear/readable on phone. Do not squeeze a desktop graph canvas onto mobile.

# Production migration rule

Migrate accepted semantics into protected React + server Drafts + typed domain services/generated client.

Do not copy localStorage, DOM patching, browser Audience/data resolution as authority, compatibility target summaries, browser `workflowV5` JSON or browser flow-control timing into production.

Production needs typed input/output schemas, stable references, optimistic concurrency, deterministic preflight, immutable AutomationVersions and later durable Runtime.

# Backend truth

Current validated Phase 2A backend remains much smaller:

- Trigger: `manual`, `checkin_grace_start`, `checkin_grace_expiry`;
- Action: `manual_review`;
- immediate start policy;
- simple Finish;
- no real Conditions;
- no production Audience/data/input-routing/inter-step control service;
- no server v5-equivalent ordered workflow model;
- no Runtime/provider/AI execution.

The prepared Phase 2A production migration remains the immediate backend boundary.

V5 is a Lab authoring-model/presentation consolidation and does not widen production backend truth.

# Regression protection

CI should protect:

- v3 autosave/compatibility;
- v5 ordered-model normalization and structural validation;
- v5-owned inter-step mutation through `getFlowControls` / `setFlowControls`;
- progressive blank-Draft truth;
- ordered v5 Flow Preview and mobile presentation;
- v4.1 Audience;
- v4.2 recommendations/data/tests;
- v4.3 input routing;
- v4.4 linear inter-step IF/WAIT authoring;
- 15 scenarios including advanced IF/WAIT examples;
- direct-new mobile route;
- `FLOW PREVIEW` naming;
- self-only CSP / no production API;
- no provider/model execution;
- no broad MutationObserver, `eval` or dynamic Function in current adapters.
