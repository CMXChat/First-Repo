# Check In Automations Frontend — CURRENT

Date: 2026-08-19
Status: Active Continuum Lab Automations v5 model + ordered Flow Preview + deterministic typed Planner + shared Change Review, with v4.4 authoring UX, Directory/Audience integration and 390px mobile QA

# Focused route

`https://db.cmxchat.com/lab/automations/`

This is the canonical Automation operating/prototyping/testing route. `/lab/` remains the broader Continuum Lab workspace.

Lab-only boundary:

- `connect-src 'self'`;
- no production API calls;
- no provider execution;
- no authoritative scheduling;
- no real Publish;
- no provider secrets;
- no external AI/model execution.

Strategic direction: `docs/continuum-automations-master-plan-CURRENT.md`.

# Current loaded stack

The route intentionally separates compatibility authoring from the emerging canonical Lab model.

Current active layers:

- `lab-automations-experience-v3.js/.css` — browser Draft/autosave compatibility core and five-stage editor;
- `lab-automations-model-v5.js` — canonical Lab ordered workflow normalization/validation;
- `lab-continuum-planner-contract-v1.js` — shared browser-only typed Change Plan operation vocabulary;
- `lab-automations-route-integration.js`;
- `lab-automations-system-surface.js/.css`;
- `lab-automations-progressive-preview.js`;
- `lab-automations-platform-v4.js/.css` + QA;
- `lab-automations-scenarios-v4.js` — 15 editable patterns;
- `lab-automations-directory-v4.js/.css`;
- `lab-automations-audience-v4.js/.css`;
- `lab-automations-intelligence-v4.js/.css`;
- `lab-automations-input-routing-v4.js/.css`;
- `lab-automations-sequence-v4.js/.css` — current inter-step IF/WAIT authoring UX;
- `lab-automations-flow-v5.js/.css` — ordered v5 Flow Preview;
- `lab-automations-planner-v5.js/.css` — deterministic local typed Planner proving surface;
- `lab-continuum-planner-review-v1.js/.css` — shared operation effect/domain/review presentation and Change Review summary;
- `lab-automations-v5-mobile-qa.css` — final focused-route mobile readability/tap-target layer.

Older v2 and earlier experiment files remain history. Production does not copy this DOM/localStorage architecture.

# Canonical Lab workflow model v5

`lab-automations-model-v5.js` normalizes each Automation into `workflowV5`.

Current semantic order:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

Start timing and recurrence remain separate policies because they are not the same thing as an inter-step WAIT.

V5 validates:

- one Trigger and one Finish;
- Trigger first and Finish last;
- unique node IDs;
- pre-action Conditions stay before Actions;
- sequence IF/WAIT controls stay between Actions;
- a step-output Condition cannot reference a future or missing Action.

Compatibility fields remain while the UI migrates:

- `trigger`;
- `conditions[]`;
- `actions[]`;
- `flowControls[]`;
- `timing`;
- `repeatConfig`;
- `outcome`.

Browser marker: `data-lab-automations-model="v5"`.

The v3/v4 layers remain the current browser editor. They are compatibility/product-proving layers, not a second permanent workflow engine.

# Progressive truth

A blank Draft remains visibly incomplete until the user actually chooses or confirms each stage.

The v5 presentation reads the already-patched pending state, so compatibility defaults cannot appear as user intent.

Accepted label remains **FLOW PREVIEW**.

# Beginner navigation

Keep the simple rail:

- WHEN — Trigger;
- IF — pre-action Rules;
- DO — Action sequence + optional inter-step controls;
- WAIT — start timing / recurrence;
- TEST — Review / Finish / simulation.

The rail is progressive navigation over the richer v5 sequence, not the long-term storage shape.

# Advanced Flow v4.4 on v5

Between two Action cards, the current DO-stage UX can author:

- `IF / Continue if…` — linear gate;
- `WAIT / Wait between steps` — future durable inter-step delay.

The authoring layer now reads through `CMXAutomationModelV5.getFlowControls()` and writes through `CMXAutomationModelV5.setFlowControls()` first.

`flowControls[]`, `afterActionId` and `cmx-lab-automation-flow-controls-v1` remain compatibility projection/fallback.

The IF source picker exposes only Trigger data and Action outputs already available at that position. It cannot reference a future Action.

Current IF is linear only. False stops the remaining path. There is no YES/NO branch graph yet.

Inter-step WAIT remains distinct from start Timing and requires future persisted Runtime state.

Browser markers:

- `data-lab-automations-sequence="v4-4"`;
- `data-lab-automations-sequence-model="v5"` when v5 owns the mutation path.

# Ordered Flow Preview v5

The compact FLOW PREVIEW remains the beginner navigator.

`lab-automations-flow-v5.js/.css` adds **ORDERED SEQUENCE** underneath it for direct whole-flow visibility.

A complex Draft can visibly read:

`WHEN → DO AI task → IF priority urgent → WAIT 2h → DO Notify → FINISH`

Rules:

- complex flows expand by default;
- simple flows stay collapsed by default;
- Show/Hide is presentation-only;
- rows navigate to the corresponding editor stage;
- start timing/recurrence appears separately as a `START` policy row;
- new Drafts preserve truthful pending state;
- mobile uses a vertical tap-friendly sequence.

Browser marker: `data-lab-automations-flow="v5"`.

# Scenarios

Current total: **15 editable starting patterns**.

Two important advanced examples:

- **Urgent AI follow-up** — AI assessment → IF priority urgent → Notify;
- **Delayed backup escalation** — primary Action → WAIT two hours → backup Action.

They create ordinary editable Drafts and normalize into the same v5 model.

# Directory + Audience v4.1

Communication Actions can compose selectors across:

- Person;
- Organization;
- Group;
- Label.

Lab preview resolves current unique People and email/phone readiness. Production Audience resolution remains server-owned.

Prototype intent uses richer `audienceSelectors[]` while old `targetRef` / `targetLabel` remain compatibility fields.

# Typed data and receiving fields

## Intelligence v4.2

Adds contextual `RECOMMENDED NEXT`, friendly typed `Use data` references and richer local `TEST THIS STEP` traces.

Sources may come from Trigger data, earlier Action outputs and Directory/Audience values.

Compatibility store: `cmx-lab-automation-data-bindings-v1`.

No arbitrary executable expression language.

## Input Routing v4.3

Maps a typed source into a named receiving field.

Examples:

- Email `subject` / `body`;
- AI Task `context` / `focus`;
- Manual Review `review_context`;
- Notify `message`.

Prototype intent uses `inputBindings[]` with `targetField` plus typed source reference.

Compatibility store: `cmx-lab-automation-input-bindings-v1`.

Step traces retain the route, for example `Body data ← Step 1 · AI summary`.

Browser marker: `data-lab-automations-inputs="v4-3"`.

# Planner v5 proving surface

The Automation Planner is a **deterministic local proving adapter**, not connected AI.

Current local patterns include daily briefing, continuity escalation, delayed reminder, AI report/review and urgent AI follow-up.

The result is explicitly labeled:

- `TYPED PLAN PREVIEW · LOCAL`;
- `NO AI CALL`.

It shows:

1. **ORDERED V5 FLOW**;
2. **CHANGE PLAN** typed operation list;
3. **PREFLIGHT** blockers.

`Use this draft` creates a normal local Automation Draft, records `plannerPreview.source = "local-deterministic-v5"`, then normalizes it through `CMXAutomationModelV5.syncStore()`.

No model, backend, provider, Runtime, Publish or hidden authority is involved.

# Shared Planner Contract v1

`lab-continuum-planner-contract-v1.js` is loaded by both Directory and focused Automations.

It is a browser proving registry for typed operation vocabulary such as:

- `directory.upsert_group`;
- `library.create_folder`;
- `automation.create_draft`;
- `automation.add_condition`;
- `automation.add_wait`;
- `automation.reference_audience`;
- `automation.reference_content`.

It also carries product-facing metadata for each operation:

- owning domain;
- family;
- effect such as Resolve / Create / Update / Link;
- review class.

Browser marker: `data-lab-planner-contract="v1"`.

Current CI extracts operation literals from both Planner surfaces and fails if either introduces an unregistered operation.

This registry is **not** backend authority and must not be copied into FastAPI as the protected allowlist.

# Shared Change Review v1

`lab-continuum-planner-review-v1.js/.css` turns the shared operation metadata into a common Planner review language.

Each proposed typed operation can now display:

- effect: `CREATE`, `UPDATE`, `LINK`, `RESOLVE`, or combined variants;
- owning domain;
- review level such as `STANDARD REVIEW`, `CHECK REQUIRED`, future `APPROVAL REQUIRED`, or `BLOCKED`.

The plan also gets a **CHANGE REVIEW** summary showing:

- number of typed changes;
- represented blockers;
- approval/check state;
- number and names of affected domains.

This is review/diff UX proof only. Real server preflight, permissions, stale-revision checks, protected identity resolution and approval decisions remain future backend authority.

Browser marker: `data-lab-planner-review="v1"`.

# Mobile / Samsung contract

Preserve one primary work area, large touch targets, readable 16px inputs where necessary, vertical flow presentation, bottom-sheet/full-screen modals, safe-area-aware actions, no nested scroll traps and no horizontal overflow.

Current final mobile QA raises:

- Planner/ordered-flow readability;
- Planner example controls to 44px+;
- Planner close controls to 44px;
- final Draft action to 46px;
- ordered sequence tap/readability sizing.

A dedicated browser geometry workflow now runs Chromium at **390×844** and checks:

- page horizontal overflow before/after Planner interaction;
- Planner modal viewport containment;
- 44px+ key tap targets;
- Automation Planner result rendering;
- shared Change Review rendering inside the Planner result.

The broader Directory geometry is validated by the same workflow.

# Command center

Normal New Automation offers:

1. Build manually;
2. start from scenario;
3. Planner preview.

`/lab/automations/?new=1&from=lab` remains the direct-new exception and opens Trigger immediately.

Runs remains `RUNTIME OFF`.

# Current relevant Lab persistence

- Automation Drafts + embedded `workflowV5`: `cmx-lab-automations-v1`;
- progressive UI: `cmx-lab-automation-progress-v1`;
- Directory: `cmx-lab-crm-v1`;
- reusable Actions: `cmx-lab-actions-v1`;
- v4 platform state: `cmx-lab-automations-platform-v4`;
- data reference compatibility: `cmx-lab-automation-data-bindings-v1`;
- receiving-field routing compatibility: `cmx-lab-automation-input-bindings-v1`;
- advanced flow-control compatibility/fallback: `cmx-lab-automation-flow-controls-v1`.

Extra stores remain temporary migration scaffolding.

# AI authoring direction

Future Automation Planner and broader Continuum Planner use the same typed Draft/domain services as human UI.

The v5 ordered model, shared operation vocabulary and Change Review are product proofs of that target.

The real Planner later replaces browser pattern matching/metadata with protected server tools, authoritative allowlists, deterministic preflight, permissions, optimistic concurrency and Audit.

Published Automation edits become a new Draft/version proposal, never an in-place mutation of immutable history.

Backend companion: `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`.

# Production migration rule

Migrate accepted semantics into protected React + server Drafts + typed domain services/generated client.

Do not copy:

- localStorage;
- DOM patching;
- browser Audience/data resolution as authority;
- browser `workflowV5` JSON as server schema;
- local deterministic Planner matching;
- the browser Planner Contract registry as the server allowlist;
- browser Change Review counts as authoritative preflight;
- browser timers/flow-control timing.

# Backend truth

Current validated Phase 2A backend remains intentionally much smaller:

- Trigger: `manual`, `checkin_grace_start`, `checkin_grace_expiry`;
- Action: `manual_review`;
- immediate start policy;
- simple Finish;
- no real Conditions;
- no production Audience/data/input-routing/inter-step control service;
- no server v5-equivalent ordered model;
- no authoritative Planner operation registry;
- no Planner/Change Plan execution;
- no Runtime/provider/AI execution.

The prepared Phase 2A production migration remains the immediate backend boundary.

# Regression protection

Current workflows protect the v3 compatibility path, v5 normalization/validation, v5-owned inter-step mutation, progressive blank-Draft truth, ordered Flow Preview, 15 scenarios, deterministic Planner boundaries, shared Planner operation vocabulary, shared Change Review, mobile tap/readability rules, 390px browser geometry, Directory/Audience/data integration, self-only CSP and the no-provider/no-model/no-arbitrary-code boundary.

The available GitHub connector still does not expose push-triggered workflow-run results in this context. Do not claim an independently observed green run or live Pages pickup until a later context can verify it.
