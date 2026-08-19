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

Noindex master explanation of Continuum. It remains under a separate clarity freeze. Lab-only UX changes do not justify editing it.

## `/lab/`

Broader Continuum experiment workspace.

Records runs **Directory v2** with People, Organizations, Groups, membership, ContactMethods/readiness, Labels, Person relationships, Activity/notes, Group resolution, duplicate warnings, Automation usage, polished desktop/mobile presentation and **AI setup preview**.

AI setup demonstrates `Describe → Plan → Preflight → Review → Apply` with no model call or mutation.

## `/lab/automations/`

Focused Automation operating/testing surface, currently **v4.4**.

Current stack:

- v3 Draft/autosave compatibility core;
- progressive blank-Draft truth;
- v4 command-center/Capability Catalog;
- 13 editable scenarios;
- Directory readiness;
- Audience v4.1 Person/Organization/Group/Label targeting;
- Intelligence v4.2 recommendations, typed `Use data` references and richer stage traces;
- Input Routing v4.3 typed source → named Action input;
- **Advanced Flow v4.4** linear inter-step `IF / Continue if…` and `WAIT / Wait between steps` authoring preview;
- strict Lab-only execution boundary.

V4.4 corrects an important workflow-order issue: the top-level IF stage is pre-action, so any condition depending on an Action output must live after the Action that produced that data.

Current compatibility stores include:

- `cmx-lab-automation-data-bindings-v1`;
- `cmx-lab-automation-input-bindings-v1`;
- `cmx-lab-automation-flow-controls-v1`.

Production must not copy these browser persistence mechanisms.

The current v4.4 IF is a linear gate only. YES/NO branching remains later and requires durable Runtime routing semantics. Inter-step WAIT remains separate from start timing and requires future persisted Runtime state.

## `/checkin/`

Protected Check In application. Production remains Phase 1 until the validated Phase 2A migration/deployment runbook is deliberately completed.

## `/spaces/`

Spaces briefing/context proving surface.

## `/environment/`

Python-first development/learning environment.

# Automation documentation

Use:

- `continuum-automations-master-plan-CURRENT.md` for destination/product architecture and the eventual sequence-model consolidation;
- `checkin-automations-frontend-CURRENT.md` for exact route/files/stores;
- `checkin-automations-system-surface-CURRENT.md` for operating-surface UX;
- `checkin-lab-automations-integration-CURRENT.md` for `/lab/` ↔ focused-route integration;
- `checkin-directory-library-CURRENT.md` for Directory/Audience/data integration.

Backend companions include `CONTINUUM-AUTOMATIONS-PLATFORM-PLAN.md`, `AUTOMATION-FRONTEND-CONTRACT.md`, `AI-CAPABILITY-AND-TOOLS-CONTRACT.md`, `CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md` and `DELEGATED-AUTHORITY-BACKEND-CONTRACT.md`.

# AI environment-authoring direction

The desired product eventually accepts broad natural-language instructions such as organizing contacts, creating Groups, linking Organizations, creating Automation Drafts, wiring typed data and, when supported server-side, composing typed inter-step controls.

Canonical architecture:

`natural-language intent → typed Change Plan → deterministic preflight/conflicts → review/approval → normal protected domain services`

AI does not receive a shadow database or separate workflow format. Prompt text never grants authority. Published Automation changes become a new Draft/version proposal. External provider side effects remain Runtime behavior.

# Current backend boundary

The first Phase 2A Library + typed Automation source is validated on `jay-app/main` but is **not production-migrated/deployed**.

Current production still has no general Directory v2 persistence, Group/Label Audience service, typed Automation data/input/flow-control service, Automation Runtime, persisted waits/branch routing, provider execution, AI Task execution, Planner/Change Plan execution, Agent or MCP execution.

Do not infer backend capability from Lab visuals.

# Copy and frontend safety

Preserve direct connected copy, truthful capability status, strong mobile layouts, no nested-scroll traps, no broad document-wide MutationObserver, no provider secrets in browser stores, no production API calls from isolated Lab routes and no arbitrary executable expression layer for workflow data/conditions.

Accepted Lab behavior migrates as semantics, not DOM/localStorage architecture.
