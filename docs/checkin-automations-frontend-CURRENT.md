# Check In Automations Frontend — CURRENT

Date: 2026-08-18
Status: Active Continuum Lab Automations v4.4 experience with Directory v2, Audience, typed data/input routing and linear inter-step flow controls

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

The route keeps the v3 behavior core and loads current product layers after it:

- `lab-automations-experience-v3.js/.css`;
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
- `lab-automations-sequence-v4.js/.css`.

Older focused v2 files remain history.

# Layer responsibilities

## V3 compatibility core

Still owns browser-local `cmx-lab-automations-v1`, normalization, autosave/resume, five-stage editing, ordered Actions, reusable Action references, start timing/repeat fields and full-flow local simulation.

V4.x does not create a second execution engine.

## Progressive truth layer

Blank Draft remains visibly incomplete until each choice is made/confirmed. Accepted label remains **FLOW PREVIEW**.

## Platform/scenarios

V4 command center owns Automations / Templates / Runs, search, Capability Catalog, interactive Flow Preview navigation, creation chooser, Planner preview and future Runs preview.

Current scenario total: **13 editable starting patterns**.

## Directory + Audience v4.1

Communication Actions may compose Person, Organization, Group and Label selectors. Browser Lab preview resolves unique People and current email/phone readiness.

Production Audience resolution remains server-owned.

## Intelligence v4.2

Adds:

- contextual `RECOMMENDED NEXT` suggestions from the same Capability Catalog;
- friendly `Use data` typed references from Trigger / earlier Actions / Directory-Audience;
- richer local `TEST THIS STEP` traces.

Compatibility store: `cmx-lab-automation-data-bindings-v1`.

No arbitrary executable expression language.

## Input routing v4.3

Maps a typed source into a named receiving field.

Current example fields:

- Email `subject` / `body`;
- AI Task `context` / `focus`;
- Manual Review `review_context`;
- Notify `message`.

Prototype Action intent: `inputBindings[]` with `targetField` plus typed source reference.

Compatibility store: `cmx-lab-automation-input-bindings-v1`.

Step tests now preserve field routing, for example `Body data ← Step 1 · AI summary`.

Browser marker: `data-lab-automations-inputs="v4-3"`.

## Advanced Flow v4.4

V4.4 adds an **ADVANCED FLOW · PREVIEW** section inside the Actions sequence.

Between two Action cards, the user may author:

- `IF / Continue if…` — a linear gate;
- `WAIT / Wait between steps` — an inter-step delay preview.

Prototype Automation intent: `flowControls[]`.

Each control is anchored by `afterActionId` so it belongs to a specific point in the Action sequence.

Compatibility store: `cmx-lab-automation-flow-controls-v1`.

Browser marker: `data-lab-automations-sequence="v4-4"`.

### Inter-step IF source rule

The picker exposes only Trigger values and outputs from Actions that have already occurred at that insertion point.

This prevents impossible flows such as a pre-action rule reading an output from a future Action.

Current operators are equals, does not equal, contains, greater than, less than and is true.

If the gate is false, the remaining linear path stops in the preview.

There is **no YES/NO branching graph yet**.

### Inter-step WAIT rule

This is distinct from the existing top-level Timing stage.

- top-level Timing = when the first Action may start / recurrence presentation;
- inter-step WAIT = future persisted delay between two Actions.

V4.4 authoring is preview-only and Review marks these controls `RUNTIME REQUIRED`.

Future Runtime must persist due state. Browser timers are never authoritative execution.

# Human navigation model

Keep the simple rail:

- WHEN — Trigger;
- IF — pre-action Rules;
- DO — Action sequence + optional advanced inter-step controls;
- WAIT — start timing / recurrence;
- TEST — Review / Finish / simulation.

The top-level IF stage is for rules whose input exists before Actions begin. Output-dependent conditions belong between Actions after their source output exists.

# Command center and direct-new behavior

Normal New Automation offers Build manually / Scenario / Planner preview.

`/lab/automations/?new=1&from=lab` still bypasses that chooser and opens directly on Trigger.

Runs remains `RUNTIME OFF`.

# Data/flow model direction

The current v4.x adapters prove semantics over the old editor. They should not be treated as the final protected implementation.

The likely consolidated product model is an ordered typed sequence such as:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

Branch nodes come only after durable Runtime routing is designed.

The beginner rail may remain even when the underlying model becomes a proper sequence/graph.

# Review / simulation

Review may show:

- workflow structure;
- Directory/Audience readiness;
- input-routing summary;
- advanced-flow control count;
- Runtime-required state;
- local simulation/log.

Local tests/simulation never become authoritative Runs.

# Current relevant Lab stores

- Automation Drafts: `cmx-lab-automations-v1`;
- progressive UI: `cmx-lab-automation-progress-v1`;
- Directory: `cmx-lab-crm-v1`;
- reusable Actions: `cmx-lab-actions-v1`;
- v4 platform state: `cmx-lab-automations-platform-v4`;
- data reference compatibility: `cmx-lab-automation-data-bindings-v1`;
- receiving-field routing compatibility: `cmx-lab-automation-input-bindings-v1`;
- advanced flow-control compatibility: `cmx-lab-automation-flow-controls-v1`.

Extra stores exist only because the older compatibility core may drop unknown fields.

# AI authoring

Future Automation Planner and broader Continuum Planner use the same typed Draft/domain services as human UI.

Planner may author inter-step controls only when their backend capability/schema exists. It must not use the Lab's `flowControls[]` shape as execution authority merely because the prototype can draw it.

Published Automation edits become the next Draft/version proposal.

Cross-domain Planner contract: `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`.

# Mobile contract

Preserve one primary work area, large tap targets, readable 16px inputs where needed, one-column selectors, bottom-sheet/full-screen modals, safe-area-aware actions, no nested scroll traps and no horizontal overflow.

Advanced Flow controls must stay linear/readable on phone. Do not squeeze a desktop graph canvas onto mobile.

# Production migration rule

Migrate accepted semantics into protected React + server Drafts + typed domain services/generated client.

Do not copy localStorage, DOM patching, browser Audience/data resolution as authority, compatibility target summaries, or browser flow-control timing into production.

Production needs typed input/output schemas, stable references, optimistic concurrency, deterministic preflight, immutable AutomationVersions and later durable Runtime.

# Backend truth

Current validated Phase 2A backend remains much smaller:

- Trigger: `manual`, `checkin_grace_start`, `checkin_grace_expiry`;
- Action: `manual_review`;
- immediate start policy;
- simple Finish;
- no real Conditions;
- no production Audience/data/input-routing/inter-step control service;
- no Runtime/provider/AI execution.

The prepared Phase 2A production migration remains the immediate backend boundary.

# Regression protection

CI should protect:

- v3 autosave/compatibility;
- progressive blank-Draft truth;
- v4.1 Audience;
- v4.2 recommendations/data/tests;
- v4.3 input routing;
- v4.4 linear inter-step IF/WAIT preview;
- direct-new mobile route;
- `FLOW PREVIEW` naming;
- self-only CSP / no production API;
- no provider/model execution;
- no broad MutationObserver, `eval` or dynamic Function in current adapters.
