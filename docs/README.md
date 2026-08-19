# CMX Documentation Index

Last reconciled: **August 19, 2026**
Repository: `CMXChat/First-Repo`

## Current rule

Current source, tests, workflows and `*-CURRENT.md` contracts take priority over older dated notes. Older Spaces, Brief, CRM and Automation prototypes remain decision history only.

# Start here

1. `checkin-context-handoff-CURRENT.md` — current cross-repository truth.
2. `continuum-product-CURRENT.md` — Continuum identity and `/doc/` contract.
3. `continuum-automations-master-plan-CURRENT.md` — Automation product/model direction.
4. `checkin-automations-frontend-CURRENT.md` — exact Automations v5 frontend/model/Planner truth.
5. `continuum-directory-master-plan-CURRENT.md` — durable Directory/CRM-quality direction.
6. `checkin-directory-library-CURRENT.md` — current Directory/Audience/Library/Planner cross-domain truth.
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

Directory `AI setup` presents a **CONTINUUM PLANNER · PREVIEW** using the shared Lab Change Plan vocabulary across Directory, Library and Automations.

Browser markers:

- `data-lab-planner-contract="v1"`;
- `data-lab-directory-planner="typed-v2"`.

It has no model call, no free-text interpretation, no mutation and no hidden authority. Fixed examples show typed operations and preflight blockers, including a **Full Continuum setup** example spanning all three domains.

Current phone QA also fixes the Directory command-bar collision between `AI setup` and the primary New action and raises Planner tap targets/readability for narrow Samsung-class layouts.

## `/lab/automations/`

Focused Automation operating/testing surface with:

- v3 Draft/autosave compatibility editor;
- **v5 canonical ordered workflow model**;
- compact FLOW PREVIEW + **ORDERED SEQUENCE** v5 presentation;
- v4 command center / Capability Catalog;
- **15 editable scenarios**;
- Directory readiness;
- Audience v4.1;
- typed data/recommendations/tests v4.2;
- Input Routing v4.3;
- Advanced Flow v4.4 inter-step IF / WAIT authoring;
- **deterministic typed Planner v5 proving surface**;
- shared **Planner Contract v1** operation vocabulary;
- final v5 mobile QA layer for ordered-flow and Planner readability/tap targets.

V5 semantic shape:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

The beginner rail remains:

`WHEN → IF → DO → WAIT → TEST`

Start timing and recurrence remain policies. Current inter-step IF is a linear gate only. Inter-step WAIT is Runtime-required. There is no YES/NO branch graph yet.

Automations Planner v5 is explicitly local/non-AI:

- `TYPED PLAN PREVIEW · LOCAL`;
- `NO AI CALL`;
- shows ordered v5 flow;
- shows conceptual typed Change Plan operations;
- shows preflight blockers;
- `Use this draft` creates a normal editable Lab Draft and normalizes it through v5.

It does not call a model, backend, provider or Runtime.

## `/checkin/`

Protected Check In application. Production remains Phase 1 until the validated Phase 2A migration/deployment runbook is deliberately completed.

## `/spaces/`

Spaces briefing/context proving surface.

## `/environment/`

Python-first development/learning environment.

# One Planner language

The Lab now loads `assets/lab/lab-continuum-planner-contract-v1.js` in both Directory and focused Automations.

That file is a **browser proving registry**, not backend authority. It defines the current allowlisted Lab operation vocabulary and metadata families used by Change Plan examples, such as:

- `directory.upsert_group`;
- `library.create_folder`;
- `automation.create_draft`;
- `automation.add_condition`;
- `automation.add_wait`;
- `automation.reference_audience`;
- `automation.reference_content`.

Current CI extracts typed operation literals from both Planner surfaces and fails if either uses an operation that is absent from the shared registry.

This prevents the two prototypes from silently inventing incompatible Planner languages while the real protected server operation allowlist is still future work.

Current product contract remains:

`INTENT → TYPED CHANGE PLAN → PREFLIGHT → REVIEW → APPLY through normal protected services`

Current prototypes:

- Directory Planner typed-v2 = fixed cross-domain examples, no free-text interpretation;
- Automations Planner v5 = small local deterministic pattern matcher that can create an ordinary v5 Lab Draft;
- neither = the real protected Continuum AI Planner.

The future protected Planner replaces these adapters and the Lab operation registry with server-backed typed planning/tools while humans and AI continue using the same domain services.

# Backend boundary

The first Phase 2A Library + typed Automation source is validated on `jay-app/main` but is **not production-migrated/deployed**.

Production still has no general:

- Directory v2 persistence;
- canonical Group/Label Audience resolver;
- typed Automation data/input/inter-step flow service matching Lab;
- server equivalent of the Lab v5 ordered model;
- server Planner operation registry equivalent to the Lab contract;
- Automation Runtime / persisted waits / branching;
- provider execution;
- AI Task execution;
- Planner / Change Plan execution;
- Agent;
- MCP execution.

Do not infer backend capability from Lab visuals, browser models, Planner previews or the Lab operation registry.

# Current validation workflows

Relevant source workflows include:

- `checkin-lab-validation.yml`;
- `automations-v5-model-validation.yml`;
- `automations-v5-planner-validation.yml`;
- `continuum-directory-validation.yml`.

They now protect the shared Planner registry, both Planner vocabularies, mobile QA, model semantics, isolation and no-network/no-execution boundaries.

The available connector cannot independently expose push-triggered workflow-run results in this context, so do not claim an observed green run or Pages pickup until a later context can verify it.

# Copy and frontend safety

Preserve direct connected copy, truthful capability status, strong mobile layouts, no nested-scroll traps, no broad document-wide MutationObserver, no provider secrets in browser stores, no production API calls from isolated Lab routes and no arbitrary executable workflow/data/condition language.

Accepted Lab behavior migrates as semantics, not DOM/localStorage architecture.
