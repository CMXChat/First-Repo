# Continuum Automations Master Plan — CURRENT

Date: 2026-08-18
Status: Canonical Automation product/UX direction; Lab v5 canonical workflow model foundation active over the v4.4 authoring surface, protected Runtime/provider execution still later

# Purpose

Continuum Automations is the workflow-definition layer for Continuum.

The product should combine IFTTT-level first-glance simplicity, Zapier whole-flow awareness, Make composition, n8n-style data inspection, Shortcuts-quality mobile authoring and Pipedream-style testing without turning into a developer IDE.

Continuum's advantage is that Directory, Library, Connections, AI, authority, immutable version history and future Runtime all belong to the same private environment.

Core principle:

**Simple flows should feel obvious. Complex flows should remain understandable. New capabilities should plug in without redesigning the product. AI should compose the same safe building blocks humans use. Runtime should always be able to explain exactly what happened.**

# Product boundaries

- `/doc/` explains Continuum and remains under its separate clarity freeze.
- `/lab/` is the broader experiment workspace and owns Directory v2.
- `/lab/automations/` is the focused Automation operating/testing surface.
- protected product implementation later uses React, server Drafts, typed services and the generated client.
- Runtime later executes immutable published definitions and records authoritative Runs.

**Automation = the plan. Runtime = execution/history.**

# Current Lab stack

The focused route now separates the **underlying workflow model** from the still-proven v3/v4.x authoring surface.

Current responsibilities:

- `lab-automations-experience-v3.js` — local Draft normalization/autosave and five-stage compatibility editor;
- `lab-automations-model-v5.js` — canonical Lab workflow normalization, ordered typed-node model, validation and compatibility projection;
- `lab-automations-progressive-preview.js` — truthful blank/pending states;
- `lab-automations-platform-v4.js` — command center, Capability Catalog, interactive flow, Planner/Run previews;
- `lab-automations-scenarios-v4.js` — **15 editable starting patterns total**, including output-dependent IF and inter-step WAIT examples;
- `lab-automations-directory-v4.js` — Directory readiness integration;
- `lab-automations-audience-v4.js` — Audience v4.1;
- `lab-automations-intelligence-v4.js` — v4.2 contextual recommendations, typed data references and richer tests;
- `lab-automations-input-routing-v4.js` — v4.3 receiving-field input routing;
- `lab-automations-sequence-v4.js` — v4.4 linear inter-step IF / WAIT authoring preview;
- matching CSS/QA layers — desktop/mobile presentation.

The v3/v4 files remain compatibility/product-proving layers. They are no longer the conceptual destination for the workflow domain model.

Production still does not copy the DOM/localStorage architecture.

# Canonical Lab workflow model v5

V5 is the first consolidation step after the v4.x proving work.

Each browser Automation can now carry `workflowV5`, a normalized ordered definition with:

- exactly one Trigger node;
- zero or more pre-action Condition nodes;
- ordered Action nodes;
- optional inter-step Condition nodes;
- optional inter-step WAIT nodes;
- exactly one Finish node;
- separate start/recurrence policies.

Conceptual shape:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

The simple user-facing rail remains:

`WHEN → IF → DO → WAIT → TEST`

That rail is navigation and progressive disclosure. It is no longer required to be the exact storage shape of every future workflow capability.

## Compatibility projection

Existing Lab Draft fields still work during migration:

- `trigger`;
- `conditions[]`;
- `actions[]`;
- `flowControls[]`;
- `timing`;
- `repeatConfig`;
- `outcome`.

V5 normalizes those fields into `workflowV5` and can project the typed model back into them while the accepted UI still depends on the older shape.

This lets current Drafts migrate without a destructive browser reset and lets the product move toward one model without rewriting every accepted interaction at once.

Compatibility state must not be mistaken for two permanent workflow engines.

## V5 validation rules

The Lab model validator already enforces structural rules including:

- one Trigger and one Finish;
- Trigger first;
- Finish last;
- unique node IDs;
- pre-action Conditions remain before Actions;
- sequence IF/WAIT remains between Actions;
- a step-output Condition cannot reference a future or missing Action.

A condition such as:

`AI task → IF AI priority = urgent → Notify`

is valid because the referenced AI Action exists earlier in the sequence.

A condition attempting to read an output from a later Action is invalid.

This validation is authoring-model protection only. Production still requires server-owned schema/reference/preflight validation.

## Start timing remains a policy

V5 deliberately does **not** pretend every timing concept is the same node type.

Keep separate:

- Trigger = eligibility;
- start policy = when the first Action may begin;
- recurrence = future occurrence policy;
- inter-step WAIT = persisted workflow state between Actions;
- retry = response to failed execution.

Start timing and recurrence therefore remain model policies while true inter-step WAIT is represented in sequence order.

# Command center

Top-level views remain:

- Automations;
- Templates;
- Runs, explicitly `RUNTIME OFF`.

Prioritize actual workflows and operating state. Do not restore a marketing billboard above the Automation list.

Normal New Automation offers:

1. Build manually;
2. start from scenario;
3. AI Planner preview.

`/lab/automations/?new=1&from=lab` remains the direct-new exception and opens a blank Draft at Trigger.

# Beginner workflow model

The accepted top-level rail remains:

- WHEN — Trigger;
- IF — pre-action Rules;
- DO — Action sequence;
- WAIT — sequence-start timing / recurrence presentation;
- TEST — Review / Finish / simulation.

This gives a beginner a simple mental model even though v5 can represent richer order underneath.

# Two kinds of IF

The top-level **IF** stage occurs before the DO stack. It can only evaluate information available before Actions run.

Use it for trigger-time/pre-action rules such as:

- Check In remains in grace;
- acknowledgement is missing before the sequence starts;
- other conditions whose referenced data already exists at eligibility/start time.

A condition that depends on an Action output belongs after that Action.

Example:

`AI task → IF AI priority equals urgent → Notify`

The AI priority does not exist until the AI step finishes.

# Advanced Flow v4.4

The DO stack exposes **ADVANCED FLOW · PREVIEW** for current authoring.

Between two Action cards, the Lab can author:

- **IF / Continue if…** — a linear gate using Trigger data or outputs from Actions already available by that point;
- **WAIT / Wait between steps** — a future persisted delay before the next Action.

Current compatibility projection uses `flowControls[]` anchored by `afterActionId` and the store `cmx-lab-automation-flow-controls-v1`.

V5 converts those controls into ordered sequence nodes under `workflowV5`.

Browser markers:

- `data-lab-automations-model="v5"`;
- `data-lab-automations-sequence="v4-4"`.

## Inter-step IF

The current condition is deliberately linear.

Current prototype operators:

- equals;
- does not equal;
- contains;
- greater than;
- less than;
- is true.

If false, the remaining linear path stops in the preview.

**YES/NO branch graphs are not implemented.** Branching remains later because durable routing, persistence, graph validation, restart recovery and Runtime semantics must exist first.

## Inter-step WAIT

The Lab can author days/hours/minutes between Actions but explicitly labels the control Runtime-required.

Future Runtime must persist due state so process/server restarts do not lose work.

Browser timers are never execution authority.

# Scenarios and discoverability

Current total: **15 editable starting patterns**.

Two advanced scenarios now deliberately teach the richer sequence through user intent:

- **Urgent AI follow-up** — AI assessment → IF priority is urgent → notification;
- **Delayed backup escalation** — primary escalation → WAIT two hours → backup escalation.

They create ordinary editable Drafts. They do not create a second execution engine or imply Runtime exists.

Future user-created and AI-created scenarios should remain compositions of known typed capabilities.

# Flow Preview

Accepted name remains **FLOW PREVIEW**.

Do not restore `LIVE FLOW` as the product label.

The top-level Flow Preview remains a navigational summary and already surfaces inter-step IF/WAIT counts on the DO node when present.

A later UI consolidation can render v5 nodes directly while preserving a compact beginner view.

# Capability Catalog

Capability breadth scales through a trusted catalog/registry, not by hard-coding every future option into the UI.

Families include Trigger, Condition, Action, workflow control, Finish/outcome, Connection-provided capability and typed input/output data.

Lab status labels remain truthful:

- `LAB NOW` = the current prototype can represent it;
- `LATER` = deliberate future capability, not executable truth.

V4.2 `RECOMMENDED NEXT` reuses the same catalog and never fabricates capabilities.

# Directory and Audience

Audience v4.1 lets communication Actions compose stable Person, Organization, Group and Label selectors.

The browser resolves current unique People and previews channel readiness.

That is Lab UX only. Production resolution/readiness belongs to protected Directory services and future Runtime freezes exact recipients/contact endpoints.

# Typed data v4.2

Actions can choose friendly typed sources from Trigger outputs, earlier Action outputs and Directory/Audience readiness values.

Prototype `dataBindings[]` are protected from old compatibility saves with `cmx-lab-automation-data-bindings-v1`.

Durable model:

`typed source → stable source/step ID → typed output path`

No arbitrary JavaScript/Python/template-expression mapping language.

# Field input routing v4.3

V4.3 completes the receiving side:

`typed source output → named Action input field`

Current Lab examples include Email subject/body, AI Task context/focus, Notify message data and Manual Review context.

Prototype `inputBindings[]` include `targetField` plus typed source information.

Compatibility store: `cmx-lab-automation-input-bindings-v1`.

Step tests retain receiving-field context, for example:

`Body data ← Step 1 · AI summary`

Production Capability Registry metadata should describe both outputs and receiving inputs so humans and AI Planner can create only compatible mappings.

# Testing / preflight

`TEST THIS STEP` remains local and side-effect-free.

Current traces can show input, normalization/resolution, Audience/readiness, mapped values, receiving-field routes and sample output.

Review can show Audience readiness, input-routing summary and inter-step control count with `RUNTIME REQUIRED` where applicable.

Dedicated v5 model CI also validates the ordered model independently of the browser presentation.

Never convert Lab simulation into fake Run history.

Future server preflight returns deterministic blockers/readiness rather than cosmetic percentages.

# AI authoring

Automation Planner eventually creates/edits the same typed Draft humans use.

V5 is intentionally closer to the model AI Planner should target: explicit typed nodes, stable IDs, bounded configuration and deterministic validation.

AI can choose known capabilities, Directory audiences, typed input/output mappings and supported flow controls only when their backend definitions exist.

The broader Continuum Planner may propose a cross-domain Change Plan spanning Directory, Automations and Library:

`natural-language intent → typed Change Plan → preflight/conflicts → review/approval → normal protected domain services`

No shadow workflow format, direct database path or prompt-granted authority.

Backend companion: `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`.

# Runtime and branching order

Runtime remains server-side and later owns Runs, occurrences, step state, persisted waits, retries, provider attempts and frozen execution inputs.

Recommended order remains:

1. Phase 2A production migration/deployment + separate `continuity.md` proof;
2. mature typed Automation/Directory definitions and protected human authoring;
3. typed Audience and source/output/input validation;
4. durable **linear** Runtime + fake provider;
5. persisted inter-step WAIT / retries / acknowledgements / approvals;
6. typed routing/branching only after linear Runtime is reliable;
7. one real low-risk provider in the approved phase order;
8. AI Task, then Planner;
9. cross-domain Change Plan apply after mature domain mutation services;
10. bounded Agent later.

V5 Lab modeling does not move those backend execution phases earlier.

# Security / production rules

Preserve:

- server-owned authorization and timing;
- stable IDs;
- immutable published history;
- no raw provider secrets in definitions/prompts;
- no arbitrary executable workflow/mapping code;
- browser Audience/data/model resolution never becomes production authority;
- unknown capability/operation types rejected;
- human and AI use the same typed services;
- prompt text never grants authority;
- no broad document MutationObserver loops in accepted frontend paths.

# Validation target

A mature Automation should clearly answer:

- What starts this?
- Which pre-action rules apply?
- Which Actions and inter-step controls occur in order?
- Which data exists at each point in the sequence?
- Which receiving field gets each mapped value?
- Which Audience/resources/Connections are referenced?
- What timing/wait/retry semantics apply?
- Which authority permits consequential work?
- Which immutable definition was published?
- What did AI propose if it helped author it?
- What exactly happened when Runtime executed it?

If users must mentally reconstruct that sequence from unrelated forms, the product model needs consolidation.