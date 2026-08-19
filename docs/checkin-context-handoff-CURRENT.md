# Check In / Continuum Context Handoff — CURRENT

Date: 2026-08-18
Status: Current cross-repository continuation guide; Phase 1 production, validated Phase 2A source pending production migration, Automations v5 + typed Planner proving surface + Directory v2 typed Change Plan preview active in Lab

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

Current source-of-truth files beat older chats, dated handoffs and stale READMEs.

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

The focused route now combines:

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
- **ordered v5 Flow Preview**;
- **deterministic typed Planner v5 proving surface**.

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

Finish stays inside Review. Accepted product label remains **FLOW PREVIEW**.

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

V5 normalizes those fields into one ordered model and can project compatibility state back for older UI code.

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

Browser marker:

`data-lab-automations-sequence-model="v5"`

This prevents the compatibility store from becoming a second workflow engine.

# IF / WAIT semantics

Top-level **IF** is pre-action. It can only use information available before Actions begin.

Output-dependent logic belongs after the Action that produced the output.

Example:

`AI task → IF AI priority equals urgent → Notify`

Current inter-step IF operators:

- equals;
- does not equal;
- contains;
- greater than;
- less than;
- is true.

The source picker only exposes Trigger data and earlier Action outputs available at that insertion point.

Current IF is a **linear gate only**. If false, the remaining path stops in the preview.

There is no YES/NO branch graph yet.

Inter-step WAIT is separate from start timing and recurrence. It is labeled `RUNTIME REQUIRED` because future Runtime must persist due state across restarts. Browser sleeps/timers are never execution authority.

# Ordered v5 Flow Preview

The compact Flow Preview remains the beginner stage navigator and preserves progressive pending-state truth.

`lab-automations-flow-v5.js/.css` adds **ORDERED SEQUENCE** underneath it using the canonical v5 model.

A complex flow can visibly show:

`WHEN Manual start`

`DO AI task`

`IF Step 1 · AI priority equals urgent`

`WAIT 2h`

`DO Notify`

`FINISH End workflow`

Behavior:

- complex flows expand by default;
- simple flows stay collapsed by default;
- Show/Hide is presentation-only;
- rows navigate back to the relevant builder stage;
- start timing/recurrence appears separately as a `START` policy row;
- blank/new Drafts use the progressive pending DOM so compatibility defaults never appear as confirmed user intent;
- mobile renders the same ordered sequence vertically with larger tap targets.

Browser marker:

`data-lab-automations-flow="v5"`

# Automations Planner v5 proving surface

The focused Planner is now more than a dead-end modal, but it is still **not real AI**.

Files:

- `assets/lab/lab-automations-planner-v5.js`;
- `assets/lab/lab-automations-planner-v5.css`.

A small local deterministic matcher recognizes a few proving patterns such as:

- daily AI briefing;
- continuity escalation;
- delayed reminder;
- AI report with review;
- urgent AI follow-up.

The result is explicitly labeled:

- `TYPED PLAN PREVIEW · LOCAL`;
- `NO AI CALL`.

It shows:

1. **ORDERED V5 FLOW**;
2. **CHANGE PLAN** typed Automation operations;
3. **PREFLIGHT** blockers.

Example conceptual operations:

```text
automation.create_draft
automation.set_trigger
automation.set_preconditions
automation.add_action
automation.add_condition
automation.add_wait
automation.set_finish
```

`Use this draft` creates a normal browser-local Draft, records `plannerPreview.source = "local-deterministic-v5"`, then normalizes through `CMXAutomationModelV5`.

It does not call a model, backend, provider or Runtime and does not publish anything.

This proves the desired future interaction:

`natural-language-like intent → typed plan → preflight → normal editable Draft`

without pretending the protected Planner exists.

# Scenarios

Current total: **15 editable starting patterns**.

Newest advanced scenarios:

- **Urgent AI follow-up** — AI assessment → IF priority urgent → notification;
- **Delayed backup escalation** — primary escalation → WAIT two hours → backup escalation.

They create ordinary Drafts and normalize into v5. They do not imply Runtime/provider execution exists.

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

# Directory Planner typed-v2

Directory `AI setup` now presents itself as **CONTINUUM PLANNER · PREVIEW** and uses the same typed Change Plan vocabulary as Automations.

Browser marker:

`data-lab-directory-planner="typed-v2"`

Current boundary:

- no model call;
- no free-text interpretation;
- no data mutation;
- no production API;
- no provider execution;
- no hidden authority.

Fixed examples show typed operations across Directory, Library and Automations.

Examples include:

```text
directory.match_or_create_people
directory.upsert_membership
directory.upsert_relationship
directory.apply_label
directory.upsert_group
library.create_folder
library.create_document
automation.create_draft
automation.reference_audience
automation.reference_content
automation.add_wait
```

The **Full Continuum setup** example demonstrates one future Change Plan that can:

`resolve People → create Groups → create Library folder/document → create Automation Draft → reference Audiences/content → add inter-step WAIT`

Every example surfaces preflight blockers instead of pretending it is ready to apply.

# One Planner language

Directory and Automations now intentionally converge on the same product contract:

`INTENT → TYPED CHANGE PLAN → PREFLIGHT → REVIEW → APPLY through normal protected services`

The current prototypes prove different pieces:

- Directory Planner = fixed cross-domain typed examples, no free-text interpretation;
- Automations Planner = tiny local deterministic pattern matcher that can create an ordinary v5 Lab Draft;
- neither = the real future Continuum AI Planner.

The protected Planner later replaces these proving adapters with server-backed typed planning/tools using the same domain services as human UI.

# Cross-domain Continuum Planner architecture

Long-term goal: the user can describe how they want Continuum organized and AI prepares the setup across supported domains.

Canonical architecture:

`natural-language intent → typed Change Plan → deterministic preflight/conflicts → review/approval → normal protected domain services → authoritative state + Activity/Audit`

Hard rules:

- AI and humans use the same typed services;
- no AI-only database/contact/workflow format;
- prompt text is intent, never authority;
- AI cannot invent executable capabilities;
- identity merge remains explicit/high-impact;
- published Automation changes become a new Draft/version proposal;
- external provider effects remain Runtime behavior;
- stale revisions, duplicate ambiguity, permission problems and incompatible mappings are deterministic blockers;
- apply must be idempotent and report partial success honestly if cross-domain atomicity is impossible.

Canonical backend contract:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`

# Audience / data / input routing

Audience v4.1 composes Person, Organization, Group and Label selectors and previews current Person-ID-deduped resolution/readiness.

V4.2 uses typed source references from Trigger, earlier Actions and Directory/Audience values rather than executable expressions.

V4.3 maps those values into named inputs such as Email subject/body, AI Task context/focus, Notify message data and Manual Review context.

Example test trace:

`Body data ← Step 1 · AI summary`

Production needs canonical server Audience resolution and capability-schema validation for source/output/input compatibility.

# Library boundary

Native protected content direction:

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

Binary direction:

`FileAsset → immutable FileVersion → private object storage`

Current Planner examples may reference conceptual Library operations, but the Lab does not execute them.

Folders are organizational structure, not permission boundaries.

# Backend / Runtime order

Keep the canonical backend phase plans authoritative.

Broadly:

1. execute the validated Phase 2A production migration/deployment + separate `continuity.md` proof;
2. grow typed Directory/Automation human-facing services in bounded slices;
3. add canonical Audience and typed source/output/input validation;
4. build protected human Automation authoring over server Drafts;
5. durable **linear** Runtime + fake provider;
6. persisted waits/retries/acknowledgements/approvals;
7. typed route/branch behavior only after linear Runtime is reliable;
8. approved provider phases;
9. AI Task then Planner;
10. cross-domain Change Plan apply only after the relevant domain mutation services are mature;
11. bounded Agent later.

Lab v5 / Planner work does not move those backend execution phases earlier.

# Validation status

Current source includes dedicated workflows for:

- `automations-v5-model-validation.yml`;
- `automations-v5-planner-validation.yml`;
- `continuum-directory-validation.yml`.

They protect the model, Planner safety boundary, typed Change Plan vocabulary, mobile/direct-new behavior and no-network/no-execution constraints.

The GitHub connector available in this context does not expose push-triggered workflow-run results, and the working container cannot resolve GitHub or `db.cmxchat.com` over its network. Therefore the workflow/source contracts are committed on `main`, but **do not claim an independently observed green push run or live GitHub Pages pickup until later verification is available**.

# Non-negotiable rules

- PostgreSQL/server time is authoritative for protected timing.
- Frontend never accesses PostgreSQL directly.
- Stable protected IDs beat copied mutable names/contact strings.
- Person identity is not one email or phone.
- Labels/Groups/relationships do not silently grant permission.
- Audience identity and channel readiness are separate.
- Data flow uses typed source/output/input references, not arbitrary executable expressions.
- Immutable published/history records stay immutable.
- Human UI and AI call the same typed services.
- Prompt text never grants authority.
- Provider secrets stay outside definitions/content/prompts/Audit.
- Unknown executable capability/Planner operation types are rejected.
- No arbitrary Python/JavaScript/shell/SQL/eval workflow logic.
- External/inbound content is untrusted data.
- Lab visual/model/Planner completeness never becomes production truth.
- No broad document-wide MutationObserver loops in accepted frontend paths.

# `/doc/` boundary

`/doc/` remains under its separate clarity freeze. Do not edit it merely because Lab UX/model/Planner changes.

# Next backend action

The immediate backend action remains the prepared Phase 2A production migration/deployment sequence, followed by the separate protected `continuity.md` acceptance proof.
