# CMX Documentation Index

Last reconciled: **August 19, 2026**
Repository: `CMXChat/First-Repo`

## Current rule

Current source, tests, workflows and `*-CURRENT.md` contracts take priority over older dated notes. Older Spaces, Brief, CRM and Automation prototypes remain decision history only.

# Start here

1. `checkin-context-handoff-CURRENT.md` — current cross-repository truth.
2. `continuum-product-CURRENT.md` — Continuum identity and `/doc/` contract.
3. `continuum-automations-master-plan-CURRENT.md` — Automation product/model direction.
4. `checkin-automations-frontend-CURRENT.md` — exact Automations v5, Planner Preflight, mobile Action-stack and QA truth.
5. `continuum-directory-master-plan-CURRENT.md` — durable Directory direction.
6. `checkin-directory-library-CURRENT.md` — Directory/Audience/Library/Planner cross-domain truth.
7. `continuum-signals-observations-master-plan-CURRENT.md` — Signals/Observations/watch product direction.
8. `checkin-library-premium-CURRENT.md` — Library projection/navigation contract.
9. `checkin-content-editor-CURRENT.md` — native content/editor contract.
10. `checkin-files-CURRENT.md` — binary File direction.
11. `checkin-ai-product-design-CURRENT.md` — broader AI product direction.
12. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md` — canonical backend read map.
13. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md` — protected cross-domain Planner contract.
14. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-SIGNALS-OBSERVATIONS-PLATFORM-PLAN.md` — protected Signals/Observation architecture.

# Current key routes

## `/doc/`

Noindex master explanation of Continuum. It remains under a separate clarity freeze.

The August 19 architecture pass is a deliberate narrow freeze exception because two product-level ideas now belong in the master explanation:

- **Planner** is explained inside the AI lesson as a future natural-language path into a typed Change Plan, deterministic preflight, review and protected domain services;
- **Signals** are explained inside Automations as future provenance-bearing observations that can become typed Automation inputs and later cause approved Actions through Runtime.

Both are visibly `LATER`. The page still uses the same eight anchors and teaching order. No new large product-map node, feature grid or section was added.

`continuum-doc-signals-planner-validation.yml` protects the new copy, no-network boundary, eight stable anchors and desktop/390px rendered presence.

## `/lab/`

Broader Continuum experiment workspace.

Records runs **Directory v2** with People, Organizations, Groups, memberships, ContactMethods/readiness, Labels, Person relationships, Activity/notes, Group resolution, duplicate warnings, Automation usage and responsive desktop/mobile presentation.

Directory `AI setup` opens **CONTINUUM PLANNER · PREVIEW** using the same browser Change Plan / Preflight / Review language as focused Automations.

Browser markers:

- `data-lab-planner-contract="v1"`;
- `data-lab-planner-preflight="v1"`;
- `data-lab-planner-review="v1"`;
- `data-lab-directory-planner="typed-v2"`.

It has no model call, free-text interpretation, protected mutation or hidden authority.

Current fixed examples can show plan dependencies, typed preflight issues and Change Review. The Business contacts example can record a sample ambiguity decision. The Full Continuum setup spans Directory + Library + Automations. The **Online signals** example proposes a Watch, approved source, filter, bounded interpretation and Automation reference while keeping Signals service and Connection requirements blocked.

## `/lab/automations/`

Focused Automation operating/testing surface with:

- v3 Draft/autosave compatibility editor;
- **v5 canonical ordered workflow model**;
- compact FLOW PREVIEW + **ORDERED SEQUENCE**;
- v4 command center / Capability Catalog;
- **15 editable scenarios**;
- Directory readiness + Audience v4.1;
- typed data v4.2 + Input Routing v4.3;
- Advanced Flow v4.4 inter-step IF / WAIT authoring;
- deterministic local Planner v5;
- editable Planner proposals before Draft creation;
- shared **Planner Contract v1**;
- shared **typed Preflight v1**;
- shared **Change Review v1**;
- compact **mobile Action stack v6**;
- rendered mobile QA.

V5 semantic shape:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

Beginner rail:

`WHEN → IF → DO → WAIT → TEST`

Current inter-step IF is a linear gate only. Inter-step WAIT is Runtime-required. There is no YES/NO branch graph yet.

Mobile Action-stack v6 converts the overly tall DO view into compact Action rows with one open step at a time, explicit Edit/Hide and a separate labeled Remove control. Multiple Actions can be removed through the existing mutation path. The final compatibility Action remains `Only step` for now.

Automations Planner remains local/non-AI. It shows:

- ordered v5 flow;
- typed Change Plan operations/dependencies;
- typed Preflight;
- Change Review;
- **Edit plan before Draft** controls for removing proposed Actions and inter-step controls;
- dependency pruning and Preflight recalculation after edits;
- **Reset proposal** to regenerate the original deterministic proposal;
- `Use this draft` into an ordinary editable Lab Draft.

Removing a proposed Action changes the actual active plan, not only the rendered row. Any inter-step IF/WAIT that is no longer valid is removed from the proposal before the typed Change Plan is rebuilt. The final proposed Action remains protected because the current v3 compatibility editor still expects one Action slot.

The resulting Draft records whether the Planner proposal was edited before Draft creation. None of this calls a model, backend, provider or Runtime.

## `/checkin/`

Protected Check In application. Production remains Phase 1 until the validated Phase 2A migration/deployment runbook is deliberately completed.

## `/spaces/`

Spaces briefing/context proving surface.

## `/environment/`

Python-first development/learning environment.

# Signals / Observations direction

Continuum now has an explicit architecture target for approved external observation.

Canonical product plan:

`continuum-signals-observations-master-plan-CURRENT.md`

Backend companion:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-SIGNALS-OBSERVATIONS-PLATFORM-PLAN.md`

Durable relationship:

`Source → Observation → Signal → Automation eligibility → Runtime action → recorded result`

Future source families may include provider APIs/webhooks, RSS/feed, constrained webpage monitoring, approved search/news sources, GitHub/status events and approved MCP resources.

Signals are future typed inputs to Automations and Spaces. External content remains untrusted and never grants authority. Current Continuum does **not** crawl arbitrary sites, continuously search news, poll arbitrary URLs, emit production Signals or start production Runs from Signals.

The shared Lab Planner vocabulary is already prepared for future reviewed configuration operations including:

- `signals.create_watch`;
- `signals.update_watch`;
- `signals.attach_source`;
- `signals.set_filter`;
- `signals.set_interpretation`;
- `signals.pause_watch`;
- `automation.reference_signal`.

The current **Online signals** Planner example uses that vocabulary as a definition-only proof. It performs no online observation. Signals service and source Connection remain explicit blocked preflight requirements.

# One Planner language

Both Directory and focused Automations load:

`assets/lab/lab-continuum-planner-contract-v1.js`

This is a **browser proving registry**, not backend authority.

It defines shared Lab operation vocabulary, operation metadata, plan-local dependency validation and typed preflight issue vocabulary across Directory, Library, Signals and Automations.

Plan operations may carry:

- `id`;
- `dependsOn[]`;
- temporary `produces: temp:…`;
- `uses[]` earlier plan results.

The browser validator rejects invalid dependency order and bad temporary references.

The future protected Planner owns its own authoritative operation allowlist and plan-local reference implementation.

# One Preflight language

Both Planner surfaces load:

- `assets/lab/lab-continuum-planner-preflight-v1.js`;
- `assets/lab/lab-continuum-planner-preflight-v1.css`.

Current user-facing states:

- `CHECK REQUIRED`;
- `PREVIEW DECISION`;
- `DEFERRED TO DRAFT`;
- `BLOCKED`;
- `APPROVAL REQUIRED`.

The Lab can record/change a sample review decision or defer a Draft-level requirement. It cannot make Runtime, Connection, protected server-service or authority blockers disappear.

Typed issues are linked to affected Change Plan rows where the current proving adapter knows the relationship. Those rows visibly change among CHECK / DECISION / DEFERRED / BLOCKED / APPROVAL states.

The current prototype maps local human-readable blocker text into typed issue codes. Production must return structured issue objects from protected domain services and must not use text matching as authority.

Signals vocabulary also reserves `signals.source_required` and `signals.service_required` for future typed preflight, without claiming those services exist now.

# One Change Review language

`lab-continuum-planner-review-v1.js/.css` combines operation effect/domain/review metadata, plan dependencies and current preflight state into one summary.

Reviewed/deferred items stop counting as unresolved. Real blocked or approval-required items remain unresolved.

Canonical desired flow:

`INTENT → TYPED CHANGE PLAN → PREFLIGHT → REVIEW → PROTECTED APPLY LATER`

# Mobile validation

Current mobile QA includes rendered Chromium checks at **360×800** and **390×844**.

Relevant dedicated workflows:

- `continuum-mobile-layout-validation.yml` — overall Directory/Planner geometry;
- `automations-v6-action-stack-validation.yml` — compact Action stack, accordion and Remove behavior;
- `continuum-planner-preflight-validation.yml` — preflight decisions/defer state, affected Change Plan rows and persistent Runtime blockers;
- `automations-v5-planner-edit-validation.yml` — proposed Action removal, dependency pruning, Reset proposal and narrow-phone fit;
- `continuum-signals-planner-validation.yml` — definition-only Signals plan, correct blocked mappings and 360/390px fit;
- `continuum-doc-signals-planner-validation.yml` — public `/doc/` Planner/Signals integration and 390px rendering.

The Planner-edit browser contract proves:

`2 proposed Actions + WAIT → remove backup Action → invalid WAIT/Runtime issue disappear → Reset proposal → original 2 Actions + WAIT/Runtime issue return`

The available connector does not independently expose push-triggered workflow results here, so do not claim an observed green run or live Pages pickup without separate verification.

# Backend boundary

The first Phase 2A Library + typed Automation source is validated on `jay-app/main` but is **not production-migrated/deployed**.

Production still has no general:

- Directory v2 persistence;
- canonical Group/Label Audience resolver;
- typed Automation data/input/inter-step service matching Lab;
- server equivalent of Lab v5;
- authoritative Planner operation registry;
- authoritative structured Planner preflight/review/apply;
- SignalSource / Observation / SignalWatch / Signal service;
- online webpage/search/news monitoring;
- Automation Runtime / persisted waits / branching;
- provider execution;
- AI Task execution;
- Planner / Change Plan execution;
- Agent;
- MCP execution.

Do not infer backend capability from Lab visuals, browser models, Planner previews, preflight decisions, mobile Action behavior, Signals architecture documents or Change Review.

# Copy and frontend safety

Preserve direct connected copy, truthful capability status, strong mobile layouts, no nested-scroll traps, no broad document-wide MutationObserver, no provider secrets in browser stores, no production API calls from isolated Lab routes and no arbitrary executable workflow/data/condition language.

Accepted Lab behavior migrates as semantics, not DOM/localStorage/sessionStorage architecture.
