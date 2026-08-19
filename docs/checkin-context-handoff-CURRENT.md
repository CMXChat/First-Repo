# Check In / Continuum Context Handoff — CURRENT

Date: 2026-08-19
Status: Canonical cross-repository continuation guide; Phase 1 production, validated Phase 2A source pending production migration, rich Continuum Lab product proofs active

Read this first before changing Continuum or Check In.

# Product map

- **Continuum** = umbrella product.
- **Check In** = current protected application/backend program name.
- **Directory** = People, Organizations, relationships, contact methods and saved audiences.
- **Library** = protected content, files and saved knowledge.
- **Signals / Observations** = approved outside/connected-source observations and typed noteworthy conditions.
- **Automations** = typed workflow definitions.
- **Connections** = approved paths to outside capability/sources.
- **Runtime** = future durable execution/history.
- **AI / Planner** = bounded intelligence and natural-language authoring through the same typed domain services humans use.
- **Spaces** = briefing/context experience.
- **Afterlife / Dead Man Switch** = continuity use case on the shared foundation.

Core principle:

> Build the control plane. Rent the capabilities.

# Read order

1. `docs/checkin-context-handoff-CURRENT.md`
2. `docs/continuum-product-CURRENT.md`
3. `docs/continuum-automations-master-plan-CURRENT.md`
4. `docs/checkin-automations-frontend-CURRENT.md`
5. `docs/continuum-directory-master-plan-CURRENT.md`
6. `docs/checkin-directory-library-CURRENT.md`
7. `docs/continuum-signals-observations-master-plan-CURRENT.md`
8. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md`
9. `CMXChat/jay-app/specs/003-server-checkin/HANDOFF.md`
10. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-PRODUCTION-DEPLOYMENT-RUNBOOK.md`
11. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-CONTINUATION-PLAN.md`
12. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AUTOMATIONS-PLATFORM-PLAN.md`
13. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-DIRECTORY-PLATFORM-PLAN.md`
14. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`
15. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-SIGNALS-OBSERVATIONS-PLATFORM-PLAN.md`
16. `CMXChat/jay-app/specs/003-server-checkin/tasks.md`

Current source/tests and `*-CURRENT.md` files beat older chats, dated handoffs and stale READMEs.

# Production truth

Production remains **Phase 1**.

Reviewed Render release:

`de55627926316581808337f8e9c10d26e7d64588`

Production Alembic:

`c41f9b8d2e70`

Protected timer remains:

`successful check in → 72 elapsed hours → grace begins → 24 elapsed hours → triggered if grace expires`

UTC/PostgreSQL/server time is authoritative.

Production does **not** execute email, SMS, Discord, webhook, AI, file release or other provider Actions. A triggered Incident does not mean an external Action ran.

Phase 1 acceptance T034–T040 is complete. Do not reopen it without a real defect.

# Validated Phase 2A source

`jay-app/main` contains validated source for the first protected Library/content + typed Automation definition slice.

Migration chain:

`c41f9b8d2e70 → f2a0c1d2e3b4 → a31c7d8e9f20`

These revisions are **not deployed to production yet**.

Validated Library model:

`LibraryFolder`

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

Validated Automation model:

`Automation → mutable AutomationDraft → REVIEW → immutable AutomationVersion`

Current real backend Automation subset remains deliberately small:

- Trigger: `manual`, `checkin_grace_start`, `checkin_grace_expiry`;
- Action: definition-only `manual_review`;
- immediate start policy;
- simple Finish;
- no real Conditions;
- no Runtime/provider/worker/AI execution.

Publish freezes exact immutable ContentVersion identity and later Draft edits cannot rewrite published history.

# Immediate backend boundary

Before broad Directory/Signals/Runtime/Planner schema expansion, execute the prepared Phase 2A production migration/deployment runbook and then the separate first protected `continuity.md` acceptance proof.

Do **not** mix new Directory schema, Signals services, Runtime, providers or AI execution into the reviewed Phase 2A migration.

# `/lab/automations/` current truth

Focused Lab route remains isolated and simulation-only.

Current important product proofs:

- v3 Draft/autosave compatibility editor;
- **v5 canonical ordered workflow model**;
- command center + Capability Catalog;
- **15 scenarios**;
- Directory readiness + Audience v4.1;
- typed data/recommendations/tests v4.2;
- Input Routing v4.3;
- inter-step IF/WAIT authoring v4.4;
- ordered v5 Flow Preview;
- deterministic local Planner v5;
- editable/resettable Planner proposals before Draft creation;
- shared Planner Contract v1;
- plan-local dependency/temp-ref proof;
- typed interactive Preflight v1;
- shared Change Review v1;
- compact mobile Action-stack v6;
- 360/390px rendered browser contracts.

Lab boundary:

- `connect-src 'self'`;
- no production API/provider/model call;
- no authoritative scheduling;
- no Publish;
- no provider secrets;
- no online monitoring authority.

Beginner rail stays:

`WHEN → IF → DO → WAIT → TEST`

Canonical Lab sequence underneath:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

Start timing/recurrence remain separate policies.

Current inter-step IF is a **linear gate only**. There is no YES/NO branch graph.

Inter-step WAIT remains Runtime-required.

**Do not copy browser `workflowV5` JSON into backend schema.**

# Mobile authoring truth

A real phone screenshot exposed that the DO stage was responsive but excessively tall.

Mobile Action-stack v6 now gives multi-Action flows:

- compact rows;
- one open Action at a time;
- explicit Edit/Hide;
- separate labeled Remove;
- Collapse all;
- expanded reorder/duplicate/pause controls;
- collapsed Audience/Input Routing/Use Data details;
- no drag authoring on phone.

When multiple Actions exist, Remove uses the existing v3 mutation path. The final compatibility Action remains `Only step` because v3 still expects one Action slot.

# Planner current truth

There is still **no real AI Planner**.

Automation Planner v5 is a small deterministic local matcher. Directory Planner typed-v2 uses fixed typed examples. Both prove the future product interaction without model/backend authority.

Shared desired flow:

`intent → typed Change Plan → preflight → review → protected apply later`

## Plan-local dependencies

Browser operations may demonstrate:

- `id`;
- `dependsOn[]`;
- `produces: temp:…`;
- `uses[]` earlier plan results.

Temporary refs are plan-local proof only. Future protected Planner owns its own plan-local reference implementation and replaces successful temporary results with authoritative IDs.

## Editable proposal

Automation Planner proposals can now be revised before creating a Draft.

Current proving edits:

- remove a proposed Action;
- remove proposed inter-step IF/WAIT;
- reset to the original deterministic proposal.

Removing an Action recalculates the actual proposed plan, prunes now-invalid dependent controls, rebuilds typed operations, reruns dependency checks and refreshes Preflight/Change Review.

The resulting Draft records whether the proposal was edited before Draft creation.

## Typed Preflight

Current Lab states:

- CHECK REQUIRED;
- PREVIEW DECISION;
- DEFERRED TO DRAFT;
- BLOCKED;
- APPROVAL REQUIRED.

Lab can record/change a sample decision or defer something to the editable Draft. It cannot clear real missing Runtime, Connection, protected service or authority requirements.

Issues can link to affected Change Plan rows.

The browser proving adapter currently classifies local warning text into typed issue codes. Protected backend services must return structured issue objects directly. **Do not implement production preflight as text matching.**

# Directory current truth

Main `/lab/` Records surface uses Directory v2 over browser-local prototype state.

Current concepts include:

- People;
- Organizations;
- Groups / saved audiences;
- many-Organization memberships;
- ContactMethods/readiness;
- Labels;
- Person relationships;
- notes/Activity;
- Group resolution;
- duplicate warnings;
- Automation usage;
- mobile/light/dark presentation.

Production still needs typed protected Directory models/services.

Automation Audience v4.1 can compose Person / Organization / Group / Label selectors and preview unique Person resolution/readiness. Production resolution remains server-owned.

# Signals / Observations current direction

Signals are now a first-class **architecture target**, not a hidden Automation hack.

Durable path:

`SignalSource → Observation → Signal → Automation eligibility → Runtime Run → recorded result`

Future approved sources may include:

- provider APIs/webhooks;
- RSS/feed;
- constrained webpage monitoring;
- approved search/news sources;
- GitHub/status events;
- approved MCP resources.

External content is untrusted. A webpage/feed/search result can inform Continuum but cannot expand AI tools, Audience, Connections, grants or Runtime authority.

## Shared Planner vocabulary prepared

Browser Change Plan registry now reserves definition operations such as:

- `signals.create_watch`;
- `signals.update_watch`;
- `signals.attach_source`;
- `signals.set_filter`;
- `signals.set_interpretation`;
- `signals.pause_watch`;
- `automation.reference_signal`.

This is vocabulary preparation only, not a protected server allowlist.

## Visible Online signals proof

Directory Planner includes a fixed **Online signals** example:

`Create Watch → Attach approved source → Set filter → Set bounded interpretation → Create Automation Draft → Reference Signal Watch`

It is explicitly **NO ONLINE OBSERVATION**.

It keeps these gaps blocked:

- protected Signals service required;
- source/Connection required.

Preflight maps those issues to the correct proposed Watch/source changes.

Current Continuum does **not** crawl arbitrary websites, continuously search news, poll arbitrary URLs, observe live online sources, emit production Signals or start Runs from Signals.

# Future AI direction

Future Continuum Planner should let a user say things like:

“Organize these contacts, create the groups, watch approved online sources for my company, add meaningful signals to my brief, and build the workflow.”

That request becomes one reviewed typed Change Plan across mature domain services.

AI and humans call the same services. AI gets no shadow database, unrestricted network path or provider credentials.

Signal interpretation may later summarize changes/classify relevance, but every interpretation retains supporting Observation/evidence references.

# Validation contracts

Current important workflows include:

- `checkin-lab-validation.yml`;
- `checkin-automations-validation.yml`;
- `automations-v5-model-validation.yml`;
- `automations-v5-planner-validation.yml`;
- `automations-v5-planner-edit-validation.yml`;
- `automations-v6-action-stack-validation.yml`;
- `continuum-planner-preflight-validation.yml`;
- `continuum-signals-planner-validation.yml`;
- `continuum-mobile-layout-validation.yml`;
- Directory-specific workflows.

Newer mobile interactions are exercised at **360×800** and **390×844**.

The available GitHub connector does not independently expose push-triggered workflow-run results in this context. Do not claim an observed green Actions run or live Pages pickup until separately verified.

# What to do next

Keep frontend/product work and backend sequencing separate.

Immediate backend work remains the prepared Phase 2A production migration/deployment boundary.

Safe frontend/product continuation can keep refining accepted Lab semantics, especially:

- Planner proposal editing/reordering while preserving dependencies;
- richer typed field configuration;
- clearer capability discovery;
- Directory product depth;
- Signals/Watch authoring UX as definition-only proof;
- rendered mobile QA.

Do not start real Signals ingestion, Runtime, branch execution, provider delivery or AI execution merely because the Lab can describe those concepts.
