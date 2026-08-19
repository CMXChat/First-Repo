# CMX Documentation Index

Last reconciled: **August 18, 2026**
Repository: `CMXChat/First-Repo`

## Current rule

Current source, tests, workflows and `*-CURRENT.md` contracts take priority over older dated notes. Older Spaces, Brief, CRM and Automation prototypes remain decision history only.

# Start here

1. `checkin-context-handoff-CURRENT.md` — current cross-repository truth.
2. `continuum-product-CURRENT.md` — Continuum identity and `/doc/` contract.
3. `continuum-automations-master-plan-CURRENT.md` — Automation product/capability/sequence direction.
4. `continuum-directory-master-plan-CURRENT.md` — Directory/CRM-quality/AI-setup direction.
5. `checkin-automations-frontend-CURRENT.md` — exact focused Automations frontend truth.
6. `checkin-directory-library-CURRENT.md` — current Directory/Audience/data/Library cross-domain truth.
7. `checkin-library-premium-CURRENT.md` — Library projection/navigation contract.
8. `checkin-content-editor-CURRENT.md` — native content editor contract.
9. `checkin-files-CURRENT.md` — binary File direction.
10. `checkin-ai-product-design-CURRENT.md` — AI product direction.
11. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md` — canonical backend read map.
12. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md` — cross-domain natural-language Change Plan contract.

# Current key routes

## `/doc/`

Noindex master explanation of Continuum. It remains under a separate clarity freeze. Lab-only UX/model changes do not justify editing it.

## `/lab/`

Broader Continuum experiment workspace.

Records runs **Directory v2** with People, Organizations, Groups, membership, ContactMethods/readiness, Labels, Person relationships, Activity/notes, Group resolution, duplicate warnings, Automation usage, polished desktop/mobile presentation and **AI setup preview**.

AI setup demonstrates `Describe → Plan → Preflight → Review → Apply` with no model call or mutation.

## `/lab/automations/`

Focused Automation operating/testing surface with a **v5 canonical Lab workflow model foundation** under the current v4.4 authoring experience.

Current stack:

- v3 Draft/autosave compatibility editor;
- **v5 ordered workflow normalization/validation** in `lab-automations-model-v5.js`;
- progressive blank-Draft truth;
- v4 command-center/Capability Catalog;
- **15 editable scenarios**;
- Directory readiness;
- Audience v4.1 Person/Organization/Group/Label targeting;
- Intelligence v4.2 recommendations, typed `Use data` references and richer stage traces;
- Input Routing v4.3 typed source → named Action input;
- Advanced Flow v4.4 linear inter-step `IF / Continue if…` and `WAIT / Wait between steps` authoring preview;
- strict Lab-only execution boundary.

V5 normalizes the accepted Draft into:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

while the simple WHEN / IF / DO / WAIT / TEST rail remains the beginner navigation model.

Start timing and recurrence stay separate policies. A step-output Condition cannot reference a future/missing Action.

Newest scenarios demonstrate:

- **Urgent AI follow-up** — AI output → IF urgent → notification;
- **Delayed backup escalation** — primary Action → WAIT → backup Action.

Compatibility stores still include:

- `cmx-lab-automation-data-bindings-v1`;
- `cmx-lab-automation-input-bindings-v1`;
- `cmx-lab-automation-flow-controls-v1`.

`workflowV5` is embedded in the browser Automation Draft store during the Lab migration.

Production must not copy these browser persistence mechanisms or treat the Lab node JSON as backend truth.

The current IF remains a linear gate only. YES/NO branching requires later durable Runtime routing semantics. Inter-step WAIT remains separate from start timing and requires future persisted Runtime state.

## `/checkin/`

Protected Check In application. Production remains Phase 1 until the validated Phase 2A migration/deployment runbook is deliberately completed.

## `/spaces/`

Spaces briefing/context proving surface.

## `/environment/`

Python-first development/learning environment.

# Automation documentation

Use:

- `continuum-automations-master-plan-CURRENT.md` for destination/product architecture and v5 model direction;
- `checkin-automations-frontend-CURRENT.md` for exact route/files/stores/model markers;
- `checkin-automations-system-surface-CURRENT.md` for operating-surface UX;
- `checkin-lab-automations-integration-CURRENT.md` for `/lab/` ↔ focused-route integration;
- `checkin-directory-library-CURRENT.md` for Directory/Audience/data integration.

Backend companions include `CONTINUUM-AUTOMATIONS-PLATFORM-PLAN.md`, `AUTOMATION-FRONTEND-CONTRACT.md`, `AI-CAPABILITY-AND-TOOLS-CONTRACT.md`, `CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md` and `DELEGATED-AUTHORITY-BACKEND-CONTRACT.md`.

# AI environment-authoring direction

The desired product eventually accepts broad natural-language instructions such as organizing contacts, creating Groups, linking Organizations, creating Automation Drafts, wiring typed data and composing supported workflow controls.

Canonical architecture:

`natural-language intent → typed Change Plan → deterministic preflight/conflicts → review/approval → normal protected domain services`

V5 gives the frontend/product a clearer typed ordered target for Automation Planner, but AI still uses protected server services in production. AI does not receive a shadow database or separate workflow format. Prompt text never grants authority.

# Current backend boundary

The first Phase 2A Library + typed Automation source is validated on `jay-app/main` but is **not production-migrated/deployed**.

Current production still has no general Directory v2 persistence, Group/Label Audience service, typed Automation data/input/flow-control service, server v5-equivalent sequence model, Automation Runtime, persisted waits/branch routing, provider execution, AI Task execution, Planner/Change Plan execution, Agent or MCP execution.

Do not infer backend capability from Lab visuals or browser model completeness.

# Copy and frontend safety

Preserve direct connected copy, truthful capability status, strong mobile layouts, no nested-scroll traps, no broad document-wide MutationObserver, no provider secrets in browser stores, no production API calls from isolated Lab routes and no arbitrary executable expression layer for workflow data/conditions.

Accepted Lab behavior migrates as semantics, not DOM/localStorage architecture.
