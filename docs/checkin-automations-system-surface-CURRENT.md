# Automations System Surface — CURRENT

Date: 2026-08-18
Status: Active Continuum Lab Automations v5 model foundation with v4.4 operating-surface UX

# Purpose

`/lab/automations/` is a private workflow operating surface inside Continuum Lab. It should feel like an application for building, inspecting and safely testing Automation definitions, never a marketing page or second `/doc/`.

Current work changes Lab authoring/modeling and local simulation only. It creates no production execution authority, provider behavior, authoritative scheduling or production schema.

Read with `continuum-automations-master-plan-CURRENT.md`, `checkin-automations-frontend-CURRENT.md` and `checkin-directory-library-CURRENT.md`.

# Dashboard and simple builder model

Keep the command-center hierarchy: compact app header, New Automation, Automations/Templates/Runs, search + Capability Catalog, system/Directory state, lifecycle controls, actual Automation cards, then scenarios.

Runs remains `RUNTIME OFF`.

Beginner rail remains:

- WHEN / Trigger;
- IF / pre-action Rules;
- DO / Action sequence;
- WAIT / sequence-start Timing;
- TEST / Review.

Finish stays inside Review. `FLOW PREVIEW` remains the accepted product label.

The rail is progressive navigation over the richer v5 model. It is not required to match every underlying node one-for-one.

# Canonical v5 model

`lab-automations-model-v5.js` is now the canonical Lab workflow normalization layer.

It represents:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

Start timing and recurrence remain separate policies.

Current compatibility UI fields are normalized into embedded `workflowV5`, then may be projected back while v3/v4.x UI still needs them.

The model validates structural order and rejects step-output conditions that reference future or missing Actions.

Browser marker: `data-lab-automations-model="v5"`.

This is Lab model truth only, never production schema or Runtime authority.

# Capability discovery

Operating rule: **catalog breadth without interface clutter**.

Support relevant options first, categories, search, reusable Actions, explicit availability and future Connection-provided capability.

`LAB NOW` means the current prototype can represent the choice. `LATER` is non-executable.

V4.2 `RECOMMENDED NEXT` uses the same Capability Catalog and never silently mutates the Draft.

# Scenarios

Current total: **15 editable starting patterns**.

Newest advanced examples teach the richer flow directly:

- Urgent AI follow-up — AI output → IF urgent → notification;
- Delayed backup escalation — primary Action → WAIT → backup Action.

Scenarios create normal Drafts and normalize into the same v5 model.

# Directory / Audience

Directory is a first-class input. Communication Audiences can compose Person, Organization, Group and Label selectors, resolve current unique People and preview channel readiness.

Keep selector intent, current resolution/readiness and future frozen Run recipients distinct.

Browser resolution remains Lab-only.

# Typed data and input routing

V4.2 gives Actions `Use data` for typed references from Trigger, earlier Actions and Directory/Audience values.

V4.3 maps those sources to named receiving fields through **INPUT ROUTING**.

Normal model:

`typed source → stable source/step ID → typed output path → named compatible receiving field`

Step tests preserve the route, for example `Body data ← Step 1 · AI summary`.

Do not introduce free-form executable JavaScript/Python/template mapping.

# Advanced Flow v4.4

The DO sequence exposes **ADVANCED FLOW · PREVIEW**.

Between two Actions the user can add:

- **IF / Continue if…** — a linear typed gate;
- **WAIT / Wait between steps** — a future persisted delay.

The top-level IF stage cannot read outputs from Actions that have not run yet. Output-dependent conditions belong after their source Action.

The inter-step IF picker therefore exposes only Trigger data and outputs available at that point in the flow.

False means the remaining linear path stops in the preview. There is no YES/NO branch graph yet.

Inter-step WAIT is separate from start Timing and is Runtime-required because future server execution must persist due state across restarts.

The v4.4 compatibility projection still uses `flowControls[]`, `afterActionId` and `cmx-lab-automation-flow-controls-v1`; v5 normalizes those controls into ordered nodes.

# Testing and preflight

`TEST THIS STEP` remains local and side-effect-free.

Current traces can show sample input, normalization/resolution, Audience/readiness, mapped values, receiving-field routes and simulated output.

Review may show workflow structure, Audience readiness, input routing and advanced-flow counts with `RUNTIME REQUIRED`.

V5 has separate model-level CI for ordered normalization and future-step reference rejection.

Never turn local simulations into fake Runs or use cosmetic health percentages.

# AI authoring direction

Human UI, Automation Planner and the broader Continuum Planner must converge on the same typed Draft/domain model.

V5 is closer to the eventual Planner target because workflow order and data availability are explicit instead of implied only by UI stages.

Planner may author inter-step controls only once matching server types and validation exist. Browser `workflowV5` is not execution authority.

Cross-domain requests become typed Change Plans, never a shadow database/workflow format.

Backend companion: `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`.

# Mobile

Preserve one primary decision area, large tap targets, readable inputs, one-column choices, bottom-sheet/full-screen pickers, safe-area-aware actions, no nested scroll traps and no horizontal overflow.

Advanced Flow remains a readable vertical sequence on phone. Do not squeeze a graph canvas onto mobile.

# Active product layers

- v3 behavior/editor compatibility core: `lab-automations-experience-v3.js/.css`;
- v5 canonical model: `lab-automations-model-v5.js`;
- accepted support: system surface, progressive preview, final QA and route integration;
- v4 platform + scenarios;
- v4 Directory integration;
- Audience v4.1;
- Intelligence v4.2;
- Input Routing v4.3;
- Sequence/Advanced Flow v4.4: `lab-automations-sequence-v4.js/.css`.

Current adapters may use targeted events and `requestAnimationFrame`. Do not introduce a broad `MutationObserver`.

# Safety boundary

Keep all true:

- `connect-src 'self'`;
- no production API/provider/model call;
- no real scheduling or Publish;
- no provider credentials in browser state;
- no arbitrary executable workflow/data-mapping code;
- browser Audience/data/model interpretation is preview only.

# Regression protection

Focused CI should protect v3 Draft/autosave compatibility, v5 ordered normalization/validation, progressive pending states, v4.1 Audience, v4.2 data/tests, v4.3 input routing, v4.4 linear IF/WAIT authoring, command-center views, **15 scenarios**, exact/new Draft routes, FLOW PREVIEW, mobile readability, production isolation and no broad MutationObserver/eval/dynamic Function.

# Production migration rule

Migrate accepted semantics into protected React/server Drafts/typed services/generated client. LocalStorage, DOM patching, browser `workflowV5` persistence and browser flow-control timing remain Lab scaffolding.
