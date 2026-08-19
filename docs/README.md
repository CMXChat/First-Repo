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
7. `checkin-library-premium-CURRENT.md` — Library projection/navigation contract.
8. `checkin-content-editor-CURRENT.md` — native content/editor contract.
9. `checkin-files-CURRENT.md` — binary File direction.
10. `checkin-ai-product-design-CURRENT.md` — broader AI product direction.
11. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md` — canonical backend read map.
12. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md` — protected cross-domain Planner contract.

# Current key routes

## `/doc/`

Noindex master explanation of Continuum. It remains under a separate clarity freeze. Lab UX/model/Planner work does not justify editing it automatically.

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

Current fixed examples can show plan dependencies, typed preflight issues and Change Review. The Business contacts example can record a sample ambiguity decision. The Full Continuum setup spans Directory + Library + Automations.

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
- `Use this draft` into an ordinary editable Lab Draft.

It does not call a model, backend, provider or Runtime.

## `/checkin/`

Protected Check In application. Production remains Phase 1 until the validated Phase 2A migration/deployment runbook is deliberately completed.

## `/spaces/`

Spaces briefing/context proving surface.

## `/environment/`

Python-first development/learning environment.

# One Planner language

Both Directory and focused Automations load:

`assets/lab/lab-continuum-planner-contract-v1.js`

This is a **browser proving registry**, not backend authority.

It defines shared Lab operation vocabulary, operation metadata, plan-local dependency validation and typed preflight issue vocabulary.

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
- `continuum-planner-preflight-validation.yml` — preflight decisions/defer state, affected Change Plan rows and persistent Runtime blockers.

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
- Automation Runtime / persisted waits / branching;
- provider execution;
- AI Task execution;
- Planner / Change Plan execution;
- Agent;
- MCP execution.

Do not infer backend capability from Lab visuals, browser models, Planner previews, preflight decisions, mobile Action behavior or Change Review.

# Copy and frontend safety

Preserve direct connected copy, truthful capability status, strong mobile layouts, no nested-scroll traps, no broad document-wide MutationObserver, no provider secrets in browser stores, no production API calls from isolated Lab routes and no arbitrary executable workflow/data/condition language.

Accepted Lab behavior migrates as semantics, not DOM/localStorage/sessionStorage architecture.
