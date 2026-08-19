# Check In Automations Frontend — CURRENT

Date: 2026-08-19
Status: Active Continuum Lab Automations v5 workflow model + editable deterministic Planner + typed Preflight/Change Review + mobile Action-stack v6; Signals/Observations prepared as future trigger/input architecture

# Focused route

`https://db.cmxchat.com/lab/automations/`

This is the canonical Automation operating/prototyping/testing route. `/lab/` remains the broader Continuum Lab workspace.

Lab boundary is strict:

- `connect-src 'self'`;
- no production API calls;
- no provider execution;
- no authoritative scheduling;
- no real Publish;
- no provider secrets;
- no external AI/model execution;
- no online observation/crawling authority.

Strategic product direction: `docs/continuum-automations-master-plan-CURRENT.md`.

Signals companion: `docs/continuum-signals-observations-master-plan-CURRENT.md`.

# Current active model and UI layers

The route still uses the v3 browser Draft/autosave editor for compatibility while newer layers prove the product model that should eventually move into protected React/server services.

Current important layers:

- `lab-automations-experience-v3.js/.css` — compatibility Draft/autosave editor;
- `lab-automations-model-v5.js` — canonical Lab ordered workflow normalization/validation;
- `lab-automations-platform-v4.js/.css` — command center, Capability Catalog, Templates/Runs shell;
- `lab-automations-scenarios-v4.js` — 15 editable starting patterns;
- `lab-automations-directory-v4.js/.css` — Directory readiness;
- `lab-automations-audience-v4.js/.css` — Person/Organization/Group/Label Audience proof;
- `lab-automations-intelligence-v4.js/.css` — recommendations, typed data references and richer local tests;
- `lab-automations-input-routing-v4.js/.css` — typed source → receiving-field routing;
- `lab-automations-sequence-v4.js/.css` — inter-step IF/WAIT authoring UX;
- `lab-automations-flow-v5.js/.css` — ordered whole-flow preview;
- `lab-continuum-planner-contract-v1.js` — shared browser Change Plan operation/dependency/preflight vocabulary;
- `lab-automations-planner-v5.js/.css` — deterministic local Planner proposal;
- `lab-automations-planner-edit-v5.css` + `lab-automations-planner-reset-v5.js` — edit/reset proposed plan before Draft creation;
- `lab-continuum-planner-preflight-v1.js/.css` — typed interactive preflight;
- `lab-continuum-planner-review-v1.js/.css` — shared Change Review;
- `lab-automations-action-stack-v6.js/.css` — compact mobile DO-stage authoring;
- `lab-automations-v5-mobile-qa.css` — final focused-route mobile QA.

Older prototype files remain history. Production must migrate accepted semantics, not this DOM/localStorage architecture.

# Canonical Lab workflow model v5

Each Automation can normalize into one ordered `workflowV5` model:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

Start timing and recurrence remain separate policies because they are different from an inter-step WAIT.

V5 validates:

- one Trigger and one Finish;
- Trigger first and Finish last;
- unique node IDs;
- pre-action Conditions before Actions;
- sequence IF/WAIT controls only between Actions;
- step-output Conditions cannot reference future/missing Actions.

A zero-Action model can be structurally represented with a warning, but the current v3 compatibility editor still maintains at least one Action slot. Do not silently change that rule inside presentation code.

**Do not copy browser `workflowV5` JSON into backend schema.** It is Lab evidence for the ordered semantics, not server authority.

# Beginner navigation

Keep the simple rail:

`WHEN → IF → DO → WAIT → TEST`

Meaning:

- WHEN — Trigger;
- IF — rules evaluable before Actions begin;
- DO — ordered Action sequence plus inter-step controls;
- WAIT — start timing / recurrence policy;
- TEST — Review / Finish / simulation.

Accepted label remains **FLOW PREVIEW**.

Blank Drafts keep truthful pending labels such as Choose a trigger / Choose an action / Not set yet. Compatibility defaults must never look like confirmed user intent.

# Inter-step logic

Important distinction:

- top-level IF = pre-action rule;
- inter-step IF = may reference an earlier Action output;
- top-level timing = when the first Action may begin;
- inter-step WAIT = durable future workflow state between Actions.

Current inter-step IF is a **linear gate**. If false, the remaining path stops. There is no YES/NO branch graph yet.

Inter-step WAIT is labeled Runtime-required. Browser timers are never execution authority.

The visible v4.4 authoring layer reads/writes inter-step controls through `CMXAutomationModelV5` first. Older `flowControls[]`, `afterActionId` and the compatibility store remain projection/fallback only.

# Ordered Flow Preview

Complex Drafts can expose the actual sequence, for example:

`WHEN Manual start → DO AI task → IF AI priority urgent → WAIT 2h → DO Notify → FINISH`

Complex flows expand by default. Simple flows stay compact. Rows navigate back to the corresponding authoring stage. Mobile renders the sequence vertically.

# Directory / Audience

Communication Actions can compose selectors across:

- Person;
- Organization;
- Group;
- Label.

Lab resolves current unique People and channel-readiness counts for UX proof. Production Audience resolution remains server-owned.

Prototype intent uses `audienceSelectors[]`; old `targetRef` / `targetLabel` remain compatibility fields.

# Typed data + input routing

Data references can come from:

- Trigger outputs;
- earlier Action outputs;
- Directory/Audience values.

Input routing gives those values a destination such as:

- Email subject/body;
- AI Task context/focus;
- Notify message;
- Manual Review context.

Example trace:

`Body data ← Step 1 · AI summary`

The Lab uses friendly typed references. It does not expose arbitrary executable JS/Python/expression logic.

# Mobile Action stack v6

A user-provided narrow-phone screenshot exposed that the DO stage was technically responsive but far too tall because every Action and augmentation panel stayed expanded.

At `<=760px`, Action-stack v6 now provides:

- compact Action rows by default;
- one expanded step at a time;
- explicit **Edit / Hide**;
- a separate labeled **Remove** control;
- Collapse all;
- reorder/duplicate/pause controls while a step is open;
- collapsed Audience/Input Routing/Use Data panels with the Action;
- no drag authoring on phone;
- desktop behavior unchanged.

When multiple Actions exist, Remove delegates to the existing v3 mutation path. The final remaining Action is disabled as `Only step` because the compatibility editor still expects one Action slot.

Session-only UI state:

`cmx-lab-automations-action-stack-ui-v1`

Browser marker:

`data-lab-automations-action-stack="v6-mobile"`

# Planner v5

The Automation Planner remains a **deterministic local proving adapter**, not connected AI.

It can match a small set of proving intents such as:

- daily AI briefing;
- missed Check In escalation;
- delayed reminder;
- AI report/review;
- urgent AI follow-up.

The result is labeled:

- `TYPED PLAN PREVIEW · LOCAL`;
- `NO AI CALL`.

The proposal shows:

1. ordered v5 flow;
2. typed Change Plan operations;
3. plan-local dependencies/temp refs;
4. typed Preflight;
5. shared Change Review.

`Use this draft` creates an ordinary browser-local Automation Draft and normalizes it through v5. It does not publish or execute.

# Editable Planner proposals

The Planner proposal can now be edited **before** Draft creation.

Current proving edits:

- remove a proposed Action when more than one exists;
- remove a proposed inter-step IF/WAIT;
- reset the proposal to the original deterministic interpretation.

Removing an Action changes the real `activePlan`, not just a DOM row.

After an edit, the Planner:

1. prunes inter-step controls whose anchor/source is no longer valid;
2. removes blockers that no longer apply, such as a Runtime blocker after the only inter-step WAIT disappears;
3. rebuilds typed Change Plan operations;
4. reruns local dependency validation;
5. refreshes Preflight + Change Review.

The final proposed Action remains protected as `Only action` for compatibility with the current editor.

`Reset proposal` simply regenerates the deterministic proposal from the current intent. It restores removed Actions/controls and their corresponding blockers.

A created Draft records:

- `plannerPreview.source = "local-deterministic-v5"`;
- `editCount`;
- whether it was `editedBeforeDraft`.

This is UX proof of the future workflow:

`describe intent → AI proposes typed plan → user/AI revises plan → preflight → review → create Draft/apply through protected services later`

# Shared Planner Contract v1

Directory and focused Automations use one browser-only typed operation vocabulary.

Current domains represented in the registry:

- Directory;
- Library;
- **Signals**;
- Automations.

Plan operations may carry:

- `id`;
- `dependsOn[]`;
- temporary `produces: temp:…`;
- `uses[]` earlier temporary results.

The browser validator rejects future/missing dependencies, unavailable temporary references, duplicate temp outputs and invalid non-temporary produced refs.

This registry is **not** the future protected server allowlist.

# Signals / Observations preparation

Signals are now an explicit future Automation input/Trigger layer.

Canonical product plan:

`docs/continuum-signals-observations-master-plan-CURRENT.md`

Backend plan:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-SIGNALS-OBSERVATIONS-PLATFORM-PLAN.md`

Durable path:

`SignalSource → Observation → Signal → Automation eligibility → Runtime Run`

Future source families may include approved provider APIs/webhooks, feeds, constrained webpage watches, approved search/news sources, GitHub/status events and approved MCP resources.

The shared Planner registry is already prepared for reviewed definition operations such as:

- `signals.create_watch`;
- `signals.update_watch`;
- `signals.attach_source`;
- `signals.set_filter`;
- `signals.set_interpretation`;
- `signals.pause_watch`;
- `automation.reference_signal`.

The main `/lab/` Directory Planner now has a fixed **Online signals** example showing:

`Create Watch → Attach approved source → Set filter → Set bounded interpretation → Create Automation Draft → Reference Signal Watch`

It is explicitly labeled **NO ONLINE OBSERVATION**. No fetch/search/crawler/model/provider call occurs.

The example intentionally keeps two real capability gaps blocked:

- protected Signals service required;
- Connection/source required.

Preflight links the Signals-service blocker to **Create Watch** and the Connection blocker to **Attach approved source**, so review does not blame an unrelated Action.

External web/feed/search content is untrusted data. A Signal can make an Automation eligible later, but it cannot grant authority or directly perform provider work.

# Typed Preflight v1

Current proving states:

- CHECK REQUIRED;
- PREVIEW DECISION;
- DEFERRED TO DRAFT;
- BLOCKED;
- APPROVAL REQUIRED.

Lab may record/change a sample ambiguity decision or defer a Draft-level configuration item. It cannot clear a real missing Runtime, Connection, protected service or authority requirement.

Preflight links typed issues to affected Change Plan rows where the proving adapter has a deterministic mapping.

The current browser adapter begins with local human-readable warnings and classifies them into typed issue codes. **Do not copy text matching into production.** Protected domain services must return structured issue codes directly.

Signals issue vocabulary now reserves:

- `signals.source_required`;
- `signals.service_required`.

# Change Review

Shared Change Review displays:

- CREATE / UPDATE / LINK / RESOLVE effect;
- owning domain;
- review state;
- plan dependencies such as Produces / Uses Step;
- current Preflight state;
- aggregate change / unresolved issue / approval / linked-step counts.

Reviewed/deferred issues stop counting as unresolved. Real blockers remain unresolved.

# Validation

Current dedicated browser contracts include:

- `automations-v6-action-stack-validation.yml` — mobile accordion/Remove behavior;
- `automations-v5-planner-edit-validation.yml` — proposal remove/dependency-prune/reset behavior;
- `continuum-planner-preflight-validation.yml` — interactive Preflight decisions/defer and persistent blockers;
- `continuum-signals-planner-validation.yml` — Online signals typed plan, Signals/Connection blockers and correct issue-to-change mapping;
- broader v5 model/Planner/mobile workflows.

Rendered tests cover **360×800** and **390×844** for the newer phone interactions.

The available GitHub connector does not independently expose push-triggered workflow results in this context. Source/workflow presence must not be described as an observed green Actions run.

# Current backend boundary

Validated Phase 2A backend source remains intentionally much smaller:

- Triggers: `manual`, `checkin_grace_start`, `checkin_grace_expiry`;
- Action: definition-only `manual_review`;
- immediate start policy;
- simple Finish;
- no real Conditions;
- no production Directory/Audience/data/input/inter-step service matching Lab;
- no server equivalent of browser v5;
- no authoritative Planner operation registry/preflight/apply;
- no SignalSource / Observation / SignalWatch / Signal service;
- no webpage/search/news monitoring;
- no Runtime/provider/AI execution.

The prepared Phase 2A production migration remains the immediate backend boundary.

# Production migration rule

Migrate accepted semantics into protected React + typed server Draft/domain services using the generated API client.

Do not copy:

- browser localStorage/sessionStorage;
- DOM patching;
- browser Audience/data resolution as authority;
- browser `workflowV5` JSON as server schema;
- local deterministic Planner matching;
- browser Planner registry as server allowlist;
- browser warning-text preflight classification;
- browser timing/WAIT execution;
- any fake online observation path.
