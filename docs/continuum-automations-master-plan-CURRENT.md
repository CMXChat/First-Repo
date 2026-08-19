# Continuum Automations Master Plan — CURRENT

Date: 2026-08-18
Status: Canonical Automation product/UX direction; Lab v4.4 implemented, protected Runtime/provider execution still later

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

# Current Lab v4.4 stack

The focused route deliberately keeps the proven v3 Draft/autosave engine while testing richer product semantics through additive Lab layers.

Current responsibilities:

- `lab-automations-experience-v3.js` — local Draft normalization/autosave and five-stage compatibility editor;
- `lab-automations-progressive-preview.js` — truthful blank/pending states;
- `lab-automations-platform-v4.js` — command center, Capability Catalog, interactive flow, Planner/Run previews;
- `lab-automations-scenarios-v4.js` — 13 editable starting scenarios total;
- `lab-automations-directory-v4.js` — Directory readiness integration;
- `lab-automations-audience-v4.js` — Audience v4.1;
- `lab-automations-intelligence-v4.js` — v4.2 contextual recommendations, typed data references and richer tests;
- `lab-automations-input-routing-v4.js` — v4.3 receiving-field input routing;
- `lab-automations-sequence-v4.js` — v4.4 linear inter-step IF / WAIT authoring preview;
- matching CSS/QA layers — desktop/mobile presentation.

These are product-prototyping adapters. Production does not copy the DOM/localStorage architecture.

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

This rail remains useful because it gives a beginner a simple mental model even as the underlying workflow becomes richer.

# Critical v4.4 architecture correction: two kinds of IF

The original top-level **IF** stage occurs before the DO stack. Therefore it can only evaluate information available before Actions run.

Use the top-level IF stage for trigger-time/pre-action rules such as:

- Check In remains in grace;
- acknowledgement is missing before the sequence starts;
- other future conditions whose referenced data already exists at eligibility/start time.

A condition that depends on an Action output cannot honestly live in that stage.

Example:

`AI task → IF AI priority equals urgent → Notify`

The AI priority does not exist until the AI step finishes. That condition belongs **after that Action**.

This is the reason v4.4 introduces inter-step flow controls instead of faking output-dependent global Rules.

# Advanced Flow v4.4

The DO stack now has an explicitly labeled **ADVANCED FLOW · PREVIEW** layer.

Between two existing Action cards, the Lab can author:

- **IF / Continue if…** — a linear gate using Trigger data or outputs from Actions that have already occurred by that point;
- **WAIT / Wait between steps** — a future persisted delay before the next Action.

Prototype Automation intent uses `flowControls[]` anchored by stable `afterActionId`.

Compatibility store:

`cmx-lab-automation-flow-controls-v1`

The browser marker is:

`data-lab-automations-sequence="v4-4"`

## Inter-step IF

The current Lab condition is deliberately linear.

It stores a typed source reference plus one bounded operator/value comparison.

Current prototype operators:

- equals;
- does not equal;
- contains;
- greater than;
- less than;
- is true.

The source picker only offers Trigger data and outputs from Actions at or before the selected insertion point.

If false, the remaining linear path stops in the preview.

**YES/NO branch graphs are not implemented.** Branching remains later because durable routing, persistence, graph validation, restart recovery and Runtime semantics need to exist first.

## Inter-step WAIT

Inter-step WAIT is a different domain concept from the current top-level Timing stage.

Keep these separate:

- Trigger = when the workflow becomes eligible;
- start policy / current WAIT stage = when the first Action may begin;
- inter-step WAIT = persisted due state between individual Actions;
- recurrence = when another occurrence becomes eligible;
- retry = response to a failed attempt.

The Lab can author days/hours/minutes between two Actions, but explicitly labels the control as Runtime-required. Browser timers are never execution authority.

Future Runtime must persist the due time so process/server restarts do not lose the workflow.

# Flow representation and likely next consolidation

The five-stage rail remains the beginner navigation model, but v4.4 demonstrates that the long-term domain model is more naturally an ordered typed sequence/graph containing Actions and workflow controls.

Do not keep adding unlimited DOM patches forever.

A future consolidation, likely a v5-style Lab/product model before protected Phase 2B migration, should consider representing the actual workflow as ordered typed nodes such as:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

Branch nodes should be added only when durable Runtime routing semantics are designed.

The goal is to migrate accepted v4.x semantics into a coherent authoring model, not preserve every v3 compatibility implementation detail.

# Flow Preview

Accepted name remains **FLOW PREVIEW**.

Do not restore `LIVE FLOW` as the product label.

The top-level Flow Preview remains a navigational summary. Detailed inter-step controls currently live in the Actions sequence because the legacy preview model does not yet represent arbitrary ordered workflow nodes.

A later consolidated flow model should make those controls visible in the actual flow representation.

# Capability Catalog

Capability breadth scales through a trusted catalog/registry, not by hard-coding every future option into the UI.

Families include:

- Trigger;
- Condition;
- Action;
- workflow control;
- Finish/outcome;
- Connection-provided capability;
- typed input/output data.

Lab status labels remain truthful:

- `LAB NOW` = the current prototype can represent it;
- `LATER` = deliberate future capability, not executable truth.

V4.2 `RECOMMENDED NEXT` reuses the same catalog and never fabricates capabilities.

# Directory and Audience

Audience v4.1 lets communication Actions compose stable Person, Organization, Group and Label selectors.

The browser resolves current unique People and previews channel readiness.

That is Lab UX only. Production resolution/readiness belongs to protected Directory services and future Runtime freezes exact recipients/contact endpoints.

# Typed data v4.2

Actions can choose friendly typed sources from:

- Trigger outputs;
- earlier Action outputs;
- Directory/Audience readiness values.

Prototype `dataBindings[]` are protected from old compatibility saves with:

`cmx-lab-automation-data-bindings-v1`

Durable model:

`typed source → stable source/step ID → typed output path`

No arbitrary JavaScript/Python/template-expression mapping language.

# Field input routing v4.3

V4.3 completes the receiving side:

`typed source output → named Action input field`

Current Lab examples:

- Email subject/body;
- AI Task context/focus;
- Notify message data;
- Manual Review context.

Prototype `inputBindings[]` include `targetField` plus typed source information.

Compatibility store:

`cmx-lab-automation-input-bindings-v1`

Step tests now retain receiving-field context, for example:

`Body data ← Step 1 · AI summary`

Production Capability Registry metadata should describe both outputs and receiving inputs so humans and AI Planner can create only compatible mappings.

# Testing / preflight

`TEST THIS STEP` remains local and side-effect-free.

Current traces can show input, normalization/resolution, Audience/readiness, mapped values, receiving-field routes and sample output.

Review can show Audience readiness, input-routing summary and v4.4 inter-step control count with `RUNTIME REQUIRED` where applicable.

Never convert Lab simulation into fake Run history.

Future server preflight returns deterministic blockers/readiness rather than cosmetic percentages.

# AI authoring

Automation Planner eventually creates/edits the same typed Draft humans use.

It can choose known capabilities, Directory audiences, typed input/output mappings and supported flow controls only when their typed backend definitions exist.

The broader Continuum Planner may propose a cross-domain Change Plan spanning Directory, Automations and Library:

`natural-language intent → typed Change Plan → preflight/conflicts → review/approval → normal protected domain services`

No shadow workflow format, direct database path or prompt-granted authority.

Backend companion:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`

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

Exact phase labels in backend canonical plans remain authoritative where they are more specific.

# Security / production rules

Preserve:

- server-owned authorization and timing;
- stable IDs;
- immutable published history;
- no raw provider secrets in definitions/prompts;
- no arbitrary executable workflow/mapping code;
- browser Audience/data/flow-control resolution never becomes production authority;
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
