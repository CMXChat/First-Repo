# CMX Documentation Index

Last reconciled: **August 19, 2026**
Repository: `CMXChat/First-Repo`

## Current rule

Current source, tests, workflows and `*-CURRENT.md` contracts take priority over older dated notes. Older Spaces, Brief, CRM and Automation prototypes remain decision history only.

# Start here

1. `checkin-context-handoff-CURRENT.md` — current cross-repository truth.
2. `continuum-product-CURRENT.md` — Continuum identity and `/doc/` contract.
3. `continuum-automations-master-plan-CURRENT.md` — Automation product/model direction.
4. `checkin-automations-frontend-CURRENT.md` — exact Automations v5/model/Planner/QA truth.
5. `continuum-directory-master-plan-CURRENT.md` — durable Directory/CRM-quality direction.
6. `checkin-directory-library-CURRENT.md` — Directory/Audience/Library/Planner cross-domain truth.
7. `checkin-library-premium-CURRENT.md` — Library projection/navigation contract.
8. `checkin-content-editor-CURRENT.md` — native content/editor contract.
9. `checkin-files-CURRENT.md` — binary File direction.
10. `checkin-ai-product-design-CURRENT.md` — broader AI product direction.
11. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md` — canonical backend read map.
12. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md` — protected cross-domain Planner contract.

# Current key routes

## `/doc/`

Noindex master explanation of Continuum. It remains under a separate clarity freeze. Lab UX/model/Planner changes do not justify editing it automatically.

## `/lab/`

Broader Continuum experiment workspace.

Records runs **Directory v2** with People, Organizations, Groups, memberships, ContactMethods/readiness, Labels, Person relationships, Activity/notes, Group resolution, duplicate warnings, Automation usage and responsive desktop/mobile presentation.

Directory `AI setup` opens **CONTINUUM PLANNER · PREVIEW** using the shared Lab Change Plan vocabulary across Directory, Library and Automations.

Browser markers:

- `data-lab-planner-contract="v1"`;
- `data-lab-planner-review="v1"`;
- `data-lab-directory-planner="typed-v2"`.

It has no model call, free-text interpretation, mutation or hidden authority. Fixed examples show typed operations, blockers and the shared Change Review, including a **Full Continuum setup** example spanning all three domains.

Current phone QA fixes the Directory command-bar collision between `AI setup` and New, raises key controls to 44px+, and validates the rendered Planner at 390px width.

## `/lab/automations/`

Focused Automation operating/testing surface with:

- v3 Draft/autosave compatibility editor;
- **v5 canonical ordered workflow model**;
- compact FLOW PREVIEW + **ORDERED SEQUENCE**;
- v4 command center / Capability Catalog;
- **15 editable scenarios**;
- Directory readiness;
- Audience v4.1;
- typed data/recommendations/tests v4.2;
- Input Routing v4.3;
- Advanced Flow v4.4 inter-step IF / WAIT authoring;
- **deterministic typed Planner v5 proving surface**;
- shared **Planner Contract v1** operation vocabulary;
- shared **Change Review v1** effect/domain/review summary;
- final v5 mobile QA layer.

V5 semantic shape:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

Beginner rail:

`WHEN → IF → DO → WAIT → TEST`

Start timing and recurrence remain policies. Current inter-step IF is a linear gate only. Inter-step WAIT is Runtime-required. There is no YES/NO branch graph yet.

Automations Planner v5 is explicitly local/non-AI:

- `TYPED PLAN PREVIEW · LOCAL`;
- `NO AI CALL`;
- ordered v5 flow;
- typed Change Plan operations;
- preflight blockers;
- shared Change Review;
- `Use this draft` creates an ordinary editable Lab Draft and normalizes it through v5.

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

It defines the shared Lab operation vocabulary and product metadata, including:

- owning domain;
- operation family;
- effect: Resolve / Create / Update / Link;
- review class.

Examples include:

- `directory.upsert_group`;
- `library.create_folder`;
- `automation.create_draft`;
- `automation.add_condition`;
- `automation.add_wait`;
- `automation.reference_audience`;
- `automation.reference_content`.

Current CI extracts typed operation literals from both Planner surfaces and fails if either uses an operation absent from the shared registry.

This prevents the prototypes from silently inventing incompatible Planner languages while the protected server allowlist is still future work.

# One Change Review language

Both Planner surfaces also load:

- `assets/lab/lab-continuum-planner-review-v1.js`;
- `assets/lab/lab-continuum-planner-review-v1.css`.

The review layer turns operation metadata into visible badges and a **CHANGE REVIEW** summary.

Current product-facing states include:

- `CREATE`;
- `UPDATE`;
- `LINK`;
- `RESOLVE`;
- `STANDARD REVIEW`;
- `CHECK REQUIRED`;
- future `APPROVAL REQUIRED` / `BLOCKED` representation.

The summary shows typed change count, represented blockers, approval/check state and affected domains.

This is product/UX proof only. Real server preflight, permissions, duplicate resolution, stale-revision handling, risk classification and approvals remain authoritative later.

Canonical desired flow:

`INTENT → TYPED CHANGE PLAN → PREFLIGHT → REVIEW → APPLY through normal protected services`

Current prototypes:

- Directory Planner typed-v2 = fixed cross-domain examples, no free-text interpretation;
- Automations Planner v5 = small local deterministic matcher that can create an ordinary v5 Lab Draft;
- neither = the real protected Continuum AI Planner.

# Mobile geometry validation

`tests/continuum-mobile-layout-probe.js` plus `.github/workflows/continuum-mobile-layout-validation.yml` now provide rendered browser geometry QA at **390×844**.

The probe checks:

- horizontal overflow before/after Planner interaction;
- Directory AI setup/New overlap;
- 44px+ key tap targets;
- Directory Planner viewport containment;
- Directory Change Review rendering;
- Automations Planner result rendering;
- Automations Change Review rendering;
- Automations Planner viewport containment;
- mobile tap targets after the richer review content appears.

This is stronger than CSS-string-only validation because it measures actual headless Chromium geometry.

# Backend boundary

The first Phase 2A Library + typed Automation source is validated on `jay-app/main` but is **not production-migrated/deployed**.

Production still has no general:

- Directory v2 persistence;
- canonical Group/Label Audience resolver;
- typed Automation data/input/inter-step service matching Lab;
- server equivalent of Lab v5;
- authoritative server Planner operation registry;
- authoritative Planner preflight/review/apply;
- Automation Runtime / persisted waits / branching;
- provider execution;
- AI Task execution;
- Planner / Change Plan execution;
- Agent;
- MCP execution.

Do not infer backend capability from Lab visuals, browser models, Planner previews, the Lab operation registry or Change Review.

# Current validation workflows

Relevant workflows include:

- `checkin-lab-validation.yml`;
- `automations-v5-model-validation.yml`;
- `automations-v5-planner-validation.yml`;
- `continuum-directory-validation.yml`;
- `continuum-mobile-layout-validation.yml`.

They protect model semantics, shared Planner vocabulary/review, mobile QA, geometry, isolation and no-network/no-execution boundaries.

The available connector cannot independently expose push-triggered workflow-run results in this context, so do not claim an observed green run or Pages pickup until a later context can verify it.

# Copy and frontend safety

Preserve direct connected copy, truthful capability status, strong mobile layouts, no nested-scroll traps, no broad document-wide MutationObserver, no provider secrets in browser stores, no production API calls from isolated Lab routes and no arbitrary executable workflow/data/condition language.

Accepted Lab behavior migrates as semantics, not DOM/localStorage architecture.
