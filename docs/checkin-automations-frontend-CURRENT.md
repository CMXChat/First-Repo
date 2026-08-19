# Check In Automations Frontend — CURRENT

Date: 2026-08-19
Status: Active Continuum Lab Automations v5 workflow model + deterministic Planner + shared Change Review + compact v6 mobile Action stack

# Focused route

`https://db.cmxchat.com/lab/automations/`

This is the canonical Automation operating/prototyping/testing route. `/lab/` remains the broader Continuum Lab workspace.

Lab boundary remains strict:

- `connect-src 'self'`;
- no production API calls;
- no provider execution;
- no authoritative scheduling;
- no real Publish;
- no provider secrets;
- no external AI/model execution.

Strategic product direction: `docs/continuum-automations-master-plan-CURRENT.md`.

# Current active stack

The route deliberately separates older browser-editor compatibility from newer product/model proofs:

- `lab-automations-experience-v3.js/.css` — browser Draft/autosave compatibility core and five-stage editor;
- `lab-automations-model-v5.js` — canonical Lab ordered workflow normalization/validation;
- `lab-continuum-planner-contract-v1.js` — shared browser-only Change Plan vocabulary and plan dependency validation;
- `lab-automations-route-integration.js`;
- `lab-automations-system-surface.js/.css`;
- `lab-automations-progressive-preview.js`;
- `lab-automations-platform-v4.js/.css` + QA;
- `lab-automations-scenarios-v4.js` — 15 editable starting patterns;
- `lab-automations-directory-v4.js/.css`;
- `lab-automations-audience-v4.js/.css`;
- `lab-automations-intelligence-v4.js/.css`;
- `lab-automations-input-routing-v4.js/.css`;
- `lab-automations-sequence-v4.js/.css` — inter-step IF/WAIT authoring UX;
- `lab-automations-flow-v5.js/.css` — ordered v5 Flow Preview;
- `lab-automations-planner-v5.js/.css` — deterministic local typed Planner proving surface;
- `lab-continuum-planner-review-v1.js/.css` — shared effect/domain/review/dependency presentation;
- `lab-automations-action-stack-v6.js/.css` — compact mobile Action-stack authoring layer;
- `lab-automations-v5-mobile-qa.css` — final focused-route mobile QA layer.

Older v2 and earlier experiment files remain history. Production does not copy this DOM/localStorage/sessionStorage architecture.

# Canonical Lab workflow model v5

`lab-automations-model-v5.js` normalizes an Automation into one ordered `workflowV5` model:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

Start timing and recurrence stay separate policies because they are semantically different from an inter-step WAIT.

V5 validates:

- one Trigger and one Finish;
- Trigger first and Finish last;
- unique node IDs;
- pre-action Conditions before Actions;
- sequence IF/WAIT controls between Actions;
- a step-output Condition cannot reference a future or missing Action.

A model with no Actions is structurally valid with a `no_actions` warning, but the current v3 compatibility editor still maintains at least one Action slot. Changing that compatibility rule should be deliberate instead of hidden inside a mobile presentation patch.

Compatibility fields remain while the UI migrates:

- `trigger`;
- `conditions[]`;
- `actions[]`;
- `flowControls[]`;
- `timing`;
- `repeatConfig`;
- `outcome`.

Browser marker: `data-lab-automations-model="v5"`.

# Progressive truth and beginner navigation

A blank Draft remains visibly incomplete until the user makes or confirms choices. Compatibility defaults must never look like confirmed user intent.

Accepted product label remains **FLOW PREVIEW**.

The simple navigation rail remains:

- WHEN — Trigger;
- IF — pre-action Rules;
- DO — Action sequence + optional inter-step controls;
- WAIT — start timing / recurrence;
- TEST — Review / Finish / simulation.

This rail is beginner navigation over the richer ordered model, not the long-term storage shape.

# Advanced Flow v4.4 on v5

Between Actions, the DO stage can author:

- `IF / Continue if…` — a linear gate;
- `WAIT / Wait between steps` — a future durable inter-step delay.

The authoring layer reads through `CMXAutomationModelV5.getFlowControls()` and writes through `CMXAutomationModelV5.setFlowControls()` first.

`flowControls[]`, `afterActionId` and `cmx-lab-automation-flow-controls-v1` remain compatibility projection/fallback.

The IF source picker exposes only Trigger values and earlier Action outputs available at that position. Current IF is linear only. If false, the remaining path stops. There is no YES/NO branch graph yet.

Inter-step WAIT remains distinct from start Timing and requires future persisted Runtime state.

Browser markers:

- `data-lab-automations-sequence="v4-4"`;
- `data-lab-automations-sequence-model="v5"` when v5 owns the mutation path.

# Ordered Flow Preview v5

The compact FLOW PREVIEW remains the beginner navigator. `lab-automations-flow-v5.js/.css` adds **ORDERED SEQUENCE** beneath it for direct whole-flow visibility.

A complex Draft can read:

`WHEN → DO AI task → IF priority urgent → WAIT 2h → DO Notify → FINISH`

Complex flows open by default; simple flows stay collapsed. Rows navigate to the corresponding authoring stage. Start timing/recurrence appears separately as a `START` policy. Mobile uses the same ordered vertical sequence with larger controls.

Browser marker: `data-lab-automations-flow="v5"`.

# Scenarios

Current total: **15 editable starting patterns**.

Important advanced examples:

- **Urgent AI follow-up** — AI assessment → IF priority urgent → Notify;
- **Delayed backup escalation** — primary Action → WAIT two hours → backup Action.

They create ordinary editable Drafts and normalize into v5.

# Directory, Audience and typed data

Audience v4.1 allows communication Actions to compose Person, Organization, Group and Label selectors. Lab resolves unique People plus email/phone readiness. Production Audience resolution remains server-owned.

Intelligence v4.2 adds contextual recommendations, friendly typed `Use data` references and richer local step-test traces. Sources can come from Trigger values, earlier Action outputs and Directory/Audience values.

Input Routing v4.3 maps a typed source into a named receiving Action field, for example:

- Email `subject` / `body`;
- AI Task `context` / `focus`;
- Manual Review `review_context`;
- Notify `message`.

No arbitrary executable expression language is introduced.

Compatibility stores remain:

- `cmx-lab-automation-data-bindings-v1`;
- `cmx-lab-automation-input-bindings-v1`.

# Planner v5 proving surface

The Automation Planner remains a **deterministic local proving adapter**, not connected AI.

Current local patterns include daily briefing, continuity escalation, delayed reminder, AI report/review and urgent AI follow-up.

A result is explicitly labeled:

- `TYPED PLAN PREVIEW · LOCAL`;
- `NO AI CALL`.

It shows:

1. **ORDERED V5 FLOW**;
2. **CHANGE PLAN** typed operations;
3. **PREFLIGHT** blockers.

`Use this draft` creates a normal local Automation Draft, records `plannerPreview.source = "local-deterministic-v5"`, then normalizes it through `CMXAutomationModelV5.syncStore()`.

No model, backend, provider, Runtime, Publish or hidden authority is involved.

# Shared Planner Contract and plan dependencies

`lab-continuum-planner-contract-v1.js` is shared by Directory and focused Automations.

It is a browser proving registry for operation types such as:

- `directory.upsert_group`;
- `library.create_folder`;
- `automation.create_draft`;
- `automation.add_condition`;
- `automation.add_wait`;
- `automation.reference_audience`;
- `automation.reference_content`.

Registry metadata includes owning domain, family, effect and review class.

Plans may also carry browser-only dependency semantics:

- operation `id`;
- `dependsOn[]`;
- `produces` temporary `temp:…` result;
- `uses[]` earlier plan-local results.

The Lab validator rejects missing/future dependencies, unavailable temporary references, duplicate temporary outputs and invalid non-temporary produced references.

These `temp:` references are product proof only. Future server Change Plans own their own plan-local references and replace successfully created temporary results with authoritative stable IDs during protected apply.

Browser marker: `data-lab-planner-contract="v1"`.

# Shared Change Review v1

`lab-continuum-planner-review-v1.js/.css` presents the shared operation metadata in one review language.

Each proposed operation can show:

- effect: CREATE / UPDATE / LINK / RESOLVE;
- owning domain;
- review level;
- `Produces …` plan-local result;
- `Uses Step …` dependency.

The **CHANGE REVIEW** summary shows typed changes, represented blockers, approval/check state, affected domains and linked-step context.

This is UX proof only. Real server preflight, permissions, stale revisions, duplicate resolution, risk classification and approvals remain authoritative later.

Browser marker: `data-lab-planner-review="v1"`.

# Mobile Action stack v6

The user-provided phone view exposed a real usability problem: every Action plus Audience, Input Routing, Use Data and advanced-flow UI remained expanded, creating an excessively tall DO stage. The old remove control also existed only as a small icon beside several other controls.

`lab-automations-action-stack-v6.js/.css` fixes the mobile authoring experience without changing workflow semantics.

At `<=760px`:

- multi-Action stacks are compact by default;
- one Action opens at a time as an accordion;
- each compact row keeps a readable step summary;
- **Edit / Hide** is explicit;
- **Remove** is a separate labeled control instead of a buried tiny X;
- when multiple Actions exist, any step can be removed using the existing v3 mutation path;
- the final remaining Action stays disabled as `Only step` because the v3 compatibility editor currently maintains one Action slot;
- reorder, duplicate and pause/resume controls appear when the step is expanded;
- original action controls receive accessible labels/titles;
- Audience, Input Routing, Use Data and other per-step augmentation panels collapse with the step;
- advanced IF/WAIT connectors are visually compressed on phone;
- mobile card dragging is disabled because explicit controls are safer on touch;
- desktop authoring behavior remains unchanged.

The accordion state is presentation-only session state in `cmx-lab-automations-action-stack-ui-v1`.

Browser marker: `data-lab-automations-action-stack="v6-mobile"`.

# Mobile / Samsung validation

Preserve one primary work area, large touch targets, readable 16px editing inputs where needed, vertical flow presentation, safe-area-aware actions, no nested-scroll traps and no horizontal overflow.

Planner and broader mobile geometry remain covered by the existing mobile validation work.

The Action stack now has a dedicated interactive browser contract:

`.github/workflows/automations-v6-action-stack-validation.yml`

It exercises the real UI at **360×800** and **390×844**:

`open Draft → enter DO → duplicate to two Actions → collapse → open one → remove one → verify one remains`

The probe also checks:

- v6 marker loaded;
- compact collapsed-card height;
- hidden detail fields while collapsed;
- one-open-at-a-time accordion behavior;
- visible Remove availability when multiple Actions exist;
- final single-step Remove protection;
- 44px+ main Edit/Remove touch targets;
- horizontal viewport fit.

The GitHub connector does not provide an independently observed push-triggered workflow result here, so source/workflow presence must not be described as an observed green CI run.

# Command center and persistence

Normal New Automation offers Build manually, Scenario and Planner preview. `/lab/automations/?new=1&from=lab` remains the direct-new path and opens Trigger immediately.

Runs remains `RUNTIME OFF`.

Current relevant Lab persistence:

- Automation Drafts + embedded `workflowV5`: `cmx-lab-automations-v1`;
- progressive UI: `cmx-lab-automation-progress-v1`;
- Directory: `cmx-lab-crm-v1`;
- reusable Actions: `cmx-lab-actions-v1`;
- v4 platform state: `cmx-lab-automations-platform-v4`;
- data-reference compatibility: `cmx-lab-automation-data-bindings-v1`;
- input-routing compatibility: `cmx-lab-automation-input-bindings-v1`;
- advanced-flow compatibility/fallback: `cmx-lab-automation-flow-controls-v1`;
- mobile Action-stack presentation only: `cmx-lab-automations-action-stack-ui-v1` in sessionStorage.

# Production migration rule

Migrate accepted semantics into protected React + typed server Draft/domain services using the generated API client.

Do not copy browser localStorage/sessionStorage, DOM patching, browser Audience/data resolution as authority, `workflowV5` JSON as server schema, local deterministic Planner matching, browser Planner registries, browser Change Review counts, or browser timing into production.

# Backend truth

Current validated Phase 2A backend remains intentionally much smaller:

- Trigger: `manual`, `checkin_grace_start`, `checkin_grace_expiry`;
- Action: `manual_review`;
- immediate start policy;
- simple Finish;
- no real Conditions;
- no production Audience/data/input-routing/inter-step service;
- no server v5-equivalent ordered model;
- no authoritative Planner operation registry;
- no Planner/Change Plan execution;
- no Runtime/provider/AI execution.

The prepared Phase 2A production migration remains the immediate backend boundary. The v6 Action-stack work is frontend authoring UX only and does not alter that boundary.
