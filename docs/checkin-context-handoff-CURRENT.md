# Check In / Continuum Context Handoff — CURRENT

Date: 2026-08-19
Status: Current cross-repository continuation guide; Phase 1 production, validated Phase 2A source pending production migration, Automations v5 + mobile Action-stack v6 + shared Planner Contract/Preflight/Change Review + Directory v2 active in Lab

This is the first file a new ChatGPT/Codex/developer context should read before changing Continuum or Check In.

# Product map

- **Continuum** = umbrella product.
- **Check In** = current protected application/backend program name.
- **Spaces** = briefing/context experience.
- **Directory** = people, organizations, relationships, contact methods and saved audiences.
- **Library** = protected content, files and saved knowledge.
- **Automations** = typed workflow definitions.
- **Connections** = approved paths to outside capability.
- **Runtime** = future server execution/history.
- **AI / Planner** = bounded intelligence and natural-language authoring through the same typed domain services humans use.
- **Afterlife: The Dead Man Switch** = continuity use case on the shared Continuum foundation.

Core principle:

> Build the control plane. Rent the capabilities.

# Read order

1. `docs/checkin-context-handoff-CURRENT.md`
2. `docs/continuum-product-CURRENT.md`
3. `docs/continuum-automations-master-plan-CURRENT.md`
4. `docs/checkin-automations-frontend-CURRENT.md`
5. `docs/continuum-directory-master-plan-CURRENT.md`
6. `docs/checkin-directory-library-CURRENT.md`
7. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md`
8. `CMXChat/jay-app/specs/003-server-checkin/HANDOFF.md`
9. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-PRODUCTION-DEPLOYMENT-RUNBOOK.md`
10. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-CONTINUATION-PLAN.md`
11. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AUTOMATIONS-PLATFORM-PLAN.md`
12. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-DIRECTORY-PLATFORM-PLAN.md`
13. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`
14. `CMXChat/jay-app/specs/003-server-checkin/tasks.md`

Current source/tests and `*-CURRENT.md` files beat older chats, dated handoffs and stale READMEs.

# Production truth

Production remains Phase 1.

Reviewed Render release:

`de55627926316581808337f8e9c10d26e7d64588`

Production Alembic revision:

`c41f9b8d2e70`

Current protected timer:

`successful check in → 72 elapsed hours → grace begins → 24 elapsed hours → triggered if grace expires`

UTC/PostgreSQL/server time is authoritative.

Production does **not** execute email, SMS, Discord, webhook, AI, file release or other provider Actions. A triggered Incident does not mean an external Action ran.

Phase 1 acceptance T034–T040 is complete. Do not reopen it without a real defect.

# Validated Phase 2A source truth

`jay-app/main` contains validated source for the first Library/content + typed Automation slice.

Migration chain:

`c41f9b8d2e70 → f2a0c1d2e3b4 → a31c7d8e9f20`

These Phase 2A revisions are **not deployed to production yet**.

Validated Library direction:

`LibraryFolder`

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

Validated Automation direction:

`Automation → mutable AutomationDraft → REVIEW → immutable AutomationVersion`

Current real backend Automation subset remains intentionally small:

- Trigger: `manual`, `checkin_grace_start`, `checkin_grace_expiry`;
- Action: definition-only `manual_review`;
- start policy: `immediate`;
- simple Finish;
- no real Conditions;
- no Runtime/provider/worker/AI execution.

Publish freezes exact immutable ContentVersion identity and later Draft edits cannot rewrite published history.

# Immediate backend boundary

Before broad new Automation/Directory/Planner schema work, execute the prepared Phase 2A production migration/deployment runbook and then the separate first protected `continuity.md` acceptance proof.

Do not mix new Directory schema, Runtime, providers or AI execution into the reviewed Phase 2A migration.

# `/lab/automations/` current truth

The focused route currently combines:

- v3 Draft/localStorage/autosave compatibility editor;
- **v5 canonical workflow model**;
- progressive blank-Draft truth;
- v4 command center + Capability Catalog;
- **15 editable scenarios**;
- Directory readiness;
- Audience v4.1;
- Intelligence v4.2 typed data/recommendations/tests;
- Input Routing v4.3;
- Advanced Flow v4.4 inter-step IF/WAIT authoring;
- ordered v5 Flow Preview;
- deterministic local typed Planner v5;
- shared Planner operation/dependency contract;
- shared typed Planner Preflight;
- shared Change Review;
- compact mobile Action stack v6.

It remains isolated:

- `connect-src 'self'`;
- no production API calls;
- no provider execution;
- no authoritative scheduling;
- no real Publish;
- no provider secrets;
- no external AI model call.

Beginner rail remains:

`WHEN → IF → DO → WAIT → TEST`

Accepted product label remains **FLOW PREVIEW**.

`/lab/automations/?new=1&from=lab` still opens a blank Draft directly on Trigger.

# Automations v5 canonical browser model

Each Lab Automation can carry embedded `workflowV5`.

Current ordered semantic shape:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

Start timing and recurrence remain separate policies because they are different concepts from an inter-step WAIT.

Compatibility fields remain while the existing editor migrates:

- `trigger`;
- `conditions[]`;
- `actions[]`;
- `flowControls[]`;
- `timing`;
- `repeatConfig`;
- `outcome`.

Structural validation protects:

- exactly one Trigger and Finish;
- Trigger first / Finish last;
- unique node IDs;
- pre-action Conditions before Actions;
- sequence controls only between Actions;
- step-output Conditions cannot reference future or missing Actions.

Browser marker:

`data-lab-automations-model="v5"`

**Do not copy the browser `workflowV5` JSON into the production backend.** It is Lab authoring/model evidence, not production schema.

# V5 owns inter-step mutation

The v4.4 Actions UI remains the visible editor for inter-step controls, but it now uses v5 first:

- read: `CMXAutomationModelV5.getFlowControls()`;
- write: `CMXAutomationModelV5.setFlowControls()`.

`flowControls[]`, `afterActionId` and `cmx-lab-automation-flow-controls-v1` are compatibility projection/fallback only.

Current IF is a **linear gate only**. There is no YES/NO branch graph yet.

Inter-step WAIT is distinct from start timing/recurrence and remains `RUNTIME REQUIRED`. Browser timers never become execution authority.

# Mobile Action stack v6

A user-provided narrow-phone screenshot exposed that the DO stage was becoming excessively long because every Action and all per-step augmentation panels remained expanded. The old remove action also existed as a small icon mixed with other controls.

Current mobile treatment at `<=760px`:

- multi-Action stacks render compact rows by default;
- one Action is open at a time;
- explicit **Edit / Hide**;
- separate labeled **Remove**;
- multiple Actions can be removed through the existing v3 mutation path;
- the final compatibility Action remains disabled as `Only step` for now;
- reorder/duplicate/pause controls show when expanded;
- Audience / Input Routing / Use Data panels collapse with the step;
- advanced IF/WAIT connector presentation is compressed;
- desktop behavior remains unchanged.

Browser marker:

`data-lab-automations-action-stack="v6-mobile"`

This is frontend authoring UX only. It does not change backend Action semantics.

# Ordered v5 Flow Preview

The compact Flow Preview remains the beginner stage navigator.

`lab-automations-flow-v5.js/.css` adds **ORDERED SEQUENCE** using the v5 model.

A complex flow can visibly show:

`WHEN → DO AI task → IF priority urgent → WAIT 2h → DO Notify → FINISH`

Complex flows expand by default; simple flows stay collapsed. Rows navigate to the relevant builder stage. Start timing/recurrence appears separately as a `START` policy row.

Browser marker:

`data-lab-automations-flow="v5"`

# Directory v2 current truth

The main `/lab/` Records surface renders Directory v2 over browser-local `cmx-lab-crm-v1` prototype state.

Current concepts include:

- People;
- Organizations;
- Groups / saved audiences;
- many-Organization Person membership;
- ContactMethods/readiness;
- Labels;
- Person relationships;
- notes/Activity;
- Group resolution;
- duplicate warnings;
- Automation usage;
- mobile/light/dark presentation.

Production still needs typed protected Directory models/services.

# One Planner language

Directory and Automations intentionally converge on:

`INTENT → TYPED CHANGE PLAN → TYPED PREFLIGHT → REVIEW → PROTECTED APPLY LATER`

Current proving adapters:

- Directory Planner typed-v2 = fixed cross-domain examples, no free-text interpretation;
- Automations Planner v5 = small local deterministic matcher that can create an ordinary v5 Lab Draft;
- neither = real protected AI Planner execution.

Both load `lab-continuum-planner-contract-v1.js`.

The shared browser registry owns the current proving operation vocabulary plus metadata for domain/family/effect/review.

Lab Change Plan operations can also carry:

- `id`;
- `dependsOn[]`;
- temporary `produces: temp:…`;
- `uses[]` earlier temporary results.

The validator rejects future/missing dependencies, unavailable temp refs, duplicate temp refs and non-temporary produced refs.

The **Full Continuum setup** example demonstrates:

`resolve People → create Groups → create Library folder/document → create Automation Draft → reference Audiences/content → add WAIT`

These temporary refs prove dependency semantics only. Future protected server Change Plans own their own plan-local references and resolve successful creates to authoritative stable IDs during apply.

# Typed Planner Preflight v1

Both Planner surfaces load `lab-continuum-planner-preflight-v1.js/.css`.

Browser marker:

`data-lab-planner-preflight="v1"`

Current proving issue families cover:

- Directory ambiguity / protected identity checks;
- missing Audience;
- unconfirmed Automation timing;
- Runtime required;
- protected Library service required;
- Connection required;
- explicit authority approval;
- invalid Planner dependencies;
- generic review requirement.

Current states stay deliberately separate:

- **CHECK REQUIRED** — unresolved review;
- **PREVIEW DECISION** — local sample decision recorded;
- **DEFERRED TO DRAFT** — Draft can continue while configuration remains incomplete;
- **BLOCKED** — required protected service/capability/Runtime is unavailable;
- **APPROVAL REQUIRED** — authority path Planner cannot self-approve.

A Directory ambiguity can record `Use existing match` or `Keep separate`, then change that choice again. This never mutates a protected identity.

An Audience or timing issue may be `Handle in Draft`, then undone. This keeps the requirement incomplete instead of falsely clearing it.

Runtime, Connections, protected server-service gaps and approval requirements remain blocked/approval states.

Preflight issues are also linked to the Change Plan rows they affect. Rows visibly carry CHECK / DECISION / DEFERRED / BLOCKED / APPROVAL state, while issue cards identify `AFFECTS CHANGE ##` where a proving mapping exists.

Important prototype boundary: current local adapters start from human-readable blocker messages and `classifyIssue()` maps them to shared typed issue codes. **Production must not use English text matching as preflight authority.** Protected domain services later return authoritative structured issue codes, stable refs, revisions, capability readiness, permissions and approval requirements.

# Shared Change Review v1

`lab-continuum-planner-review-v1.js/.css` combines:

- operation effect/domain/review metadata;
- plan-local Produce / Uses / dependency links;
- current typed Preflight state;
- summary counts.

Reviewed/deferred issues stop counting as unresolved. True blockers and approval requirements remain unresolved.

Browser marker:

`data-lab-planner-review="v1"`

# Planner safety boundary

The Planner layers do not:

- call an AI model;
- call production backend APIs;
- mutate protected Directory/Library state;
- publish Automations;
- run providers;
- run Runtime;
- grant authority;
- hide capability gaps.

`Use this draft` in focused Automations creates only an ordinary browser-local Draft and normalizes it through v5.

# Mobile / regression validation

Current rendered Chromium validation includes **360×800** and **390×844** where relevant.

Dedicated workflows now cover:

- `continuum-mobile-layout-validation.yml` — overall mobile Planner/Directory geometry;
- `automations-v6-action-stack-validation.yml` — mobile Action accordion, Remove behavior and viewport fit;
- `continuum-planner-preflight-validation.yml` — typed decisions/defer state, affected Change Plan row state and persistent Runtime blocker behavior;
- existing v5 model/Planner/Directory workflows.

The available GitHub connector does not independently expose push-triggered workflow results in this context. Do not claim an observed green run or live Pages pickup without separate verification.

# Directory / Audience / data direction

Audience v4.1 composes Person / Organization / Group / Label selectors and previews current unique-Person channel readiness.

V4.2 uses typed source references from Trigger, earlier Actions and Directory/Audience values.

V4.3 maps those sources into named receiving fields.

Production needs protected server schemas and Audience resolution. Browser resolution is never authority.

# Library direction

Validated Phase 2A native content model:

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

Future binary direction:

`FileAsset → immutable FileVersion → private object storage`

Planner `library.*` operations in Lab are typed vocabulary only. They do not execute.

# Cross-domain Planner backend direction

Canonical backend contract:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`

Long-term protected flow:

`natural language → typed Change Plan → deterministic server preflight/conflicts → review/approval → normal protected domain services → authoritative results + Activity/Audit`

Hard rules:

- humans and AI use the same services;
- prompt text is intent, never authority;
- no AI-only database/business logic;
- no arbitrary Python/JS/shell/SQL/eval;
- AI cannot invent executable capabilities;
- identity merge remains explicit/high-impact;
- published workflow changes become a new Draft/version proposal;
- external side effects remain Runtime behavior;
- stale revisions and partial apply must be reported honestly;
- Planner cannot approve its own authority.

# Production backend boundary

Production currently has no general:

- Directory v2 service;
- Group/Label Audience resolver;
- typed Automation data/input/inter-step service matching Lab;
- server equivalent of Lab v5;
- authoritative Planner operation registry;
- authoritative structured Planner preflight/review/apply;
- Runtime/persisted WAIT/branch execution;
- provider delivery;
- AI Task execution;
- Planner execution;
- Agent;
- MCP execution.

The validated Phase 2A Library + typed Automation source remains pending deliberate production migration/deployment.

Lab completeness never widens production truth.

# Backend continuation order

Keep the existing backend phase plans authoritative. Broadly:

1. complete the prepared Phase 2A production migration/release boundary;
2. protected human/domain surfaces;
3. Directory/Audience slices in bounded server models/services;
4. durable **linear** Runtime + fake provider;
5. approved provider phases;
6. persisted WAIT/retry/acknowledgement/approval and typed routing/branching when prerequisites exist;
7. AI Task then Planner;
8. cross-domain Change Plan apply after mature domain services;
9. bounded Agent later;
10. MCP as adapter, never authority bypass.

# Non-negotiable rules

- PostgreSQL/server time is authoritative for protected timing.
- Frontend never accesses PostgreSQL directly.
- Stable IDs beat copied mutable contact strings.
- Immutable versions/history stay immutable.
- Labels/relationships never silently grant authority.
- Audience identity and channel readiness remain separate.
- Human UI and AI call the same typed services.
- Prompt text never grants authority.
- Provider secrets stay outside definitions/content/prompts/Audit.
- Unknown capability/Planner operation types are rejected.
- Data flow uses typed references, not arbitrary code/expression execution.
- Real inter-step WAIT is durable server state, never browser sleep.
- Branching is typed routing, never arbitrary code.
- External/inbound content is untrusted data.
- No broad document-wide MutationObserver loops in accepted frontend paths.
- `/doc/` remains under its separate clarity freeze. Do not edit it merely because Lab UX becomes richer.
