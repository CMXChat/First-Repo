# CMX Documentation Index

Last reconciled: **August 18, 2026**
Repository: `CMXChat/First-Repo`

## Current rule

Current source, tests, workflows and `*-CURRENT.md` contracts take priority over older dated notes. Older Spaces, Brief, CRM and Automation prototypes remain decision history only.

# Start here

1. `checkin-context-handoff-CURRENT.md` — current cross-repository truth.
2. `continuum-product-CURRENT.md` — Continuum identity and `/doc/` contract.
3. `continuum-automations-master-plan-CURRENT.md` — Automation product/capability direction.
4. `continuum-directory-master-plan-CURRENT.md` — Directory/CRM-quality/AI-setup direction.
5. `checkin-automations-frontend-CURRENT.md` — exact focused Automations frontend truth.
6. `checkin-directory-library-CURRENT.md` — current Directory/Audience/data/Library cross-domain truth.
7. `checkin-library-premium-CURRENT.md` — Library projection/navigation contract.
8. `checkin-content-editor-CURRENT.md` — native content editor contract.
9. `checkin-files-CURRENT.md` — binary File direction.
10. `checkin-ai-product-design-CURRENT.md` — AI product direction.
11. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md` — canonical backend read map.
12. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md` — cross-domain natural-language Change Plan contract.

# Product naming

- **Continuum** = umbrella product.
- **Spaces** = briefing/context experience.
- **Directory** = people, organizations, relationships, contact methods and saved audiences.
- **Library** = protected content, files and saved knowledge.
- **Automations** = typed workflow definitions.
- **Connections** = approved outside capability.
- **Runtime** = future execution/history layer.
- **AI** = bounded intelligence using the same typed services as humans.
- **Afterlife: The Dead Man Switch** = continuity experience.
- **Check In** = current protected application/backend program name.

# Current key routes

## `/doc/`

Noindex master explanation of Continuum. It remains under a separate clarity freeze. Lab-only UX changes do not justify editing it.

## `/lab/`

Broader Continuum experiment workspace.

Records now runs **Directory v2** with People, Organizations, Groups, many-Organization membership, ContactMethods/readiness, Labels, Person relationships, Activity/notes, Group resolution, duplicate warnings, Automation usage, polished desktop/mobile presentation and **AI setup preview**.

AI setup demonstrates:

`Describe → Plan → Preflight → Review → Apply`

It performs no model call and no data mutation.

## `/lab/automations/`

Focused Automation operating/testing surface, currently **v4.3**.

Current stack:

- v3 Draft/autosave compatibility core;
- progressive blank-Draft truth layer;
- v4 command-center/Capability Catalog;
- 13 editable scenarios;
- Directory readiness;
- Audience v4.1 multi-selector Person/Organization/Group/Label targeting;
- Intelligence v4.2 recommendations, typed `Use data` references and richer stage traces;
- input routing v4.3 mapping typed sources into named receiving Action fields;
- strict Lab-only execution boundary.

Current compatibility stores include:

- `cmx-lab-automation-data-bindings-v1`;
- `cmx-lab-automation-input-bindings-v1`.

Production must not copy these persistence mechanisms.

## `/checkin/`

Protected Check In application. Production remains Phase 1 until the validated Phase 2A migration/deployment runbook is deliberately completed.

## `/spaces/`

Spaces briefing/context proving surface.

## `/environment/`

Python-first development/learning environment.

# Automations documentation

Use:

- `continuum-automations-master-plan-CURRENT.md` for destination/product architecture;
- `checkin-automations-frontend-CURRENT.md` for exact route/files/stores;
- `checkin-automations-system-surface-CURRENT.md` for operating-surface UX;
- `checkin-lab-automations-integration-CURRENT.md` for `/lab/` ↔ focused-route integration;
- `checkin-directory-library-CURRENT.md` for Directory/Audience/data integration.

Backend companions:

- `CONTINUUM-AUTOMATIONS-PLATFORM-PLAN.md`;
- `AUTOMATION-FRONTEND-CONTRACT.md`;
- `AI-CAPABILITY-AND-TOOLS-CONTRACT.md`;
- `CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`;
- `DELEGATED-AUTHORITY-BACKEND-CONTRACT.md`.

# Directory documentation

`continuum-directory-master-plan-CURRENT.md` covers Person/Organization/membership, ContactMethods, Labels, Groups, PersonRelationship, CRM-quality profile/search/view direction, Activity, duplicate/merge, custom fields, import/export, mobile UX, Automation/Library/Spaces integration and natural-language AI setup.

Backend companions:

- `CONTINUUM-DIRECTORY-PLATFORM-PLAN.md`;
- `DIRECTORY-AUDIENCE-LIBRARY-BACKEND-HANDOFF.md`;
- `CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`.

# AI environment-authoring direction

The desired product can eventually accept broad natural-language instructions such as organizing contacts, creating Groups, linking Organizations, creating Automation Drafts and wiring typed data.

Canonical architecture:

`natural-language intent → typed Change Plan → deterministic preflight/conflicts → review/approval → normal protected domain services`

AI does not receive a shadow database or separate workflow format. Prompt text never grants authority. Published Automation changes become a new Draft/version proposal. External provider side effects remain Runtime behavior.

# Library documentation

Use `checkin-library-premium-CURRENT.md`, `checkin-content-editor-CURRENT.md` and `checkin-files-CURRENT.md`.

Backend companions include `CONTENT-ASSETS-BACKEND-HANDOFF.md`, `FILE-ASSETS-BACKEND-HANDOFF.md`, `LIBRARY-FOLDERS-TEMPLATES-MARKDOWN-BACKEND-HANDOFF.md` and `LIBRARY-PROJECTION-PREMIUM-BACKEND-HANDOFF.md`.

# Current backend boundary

The first Phase 2A Library + typed Automation source is validated on `jay-app/main` but is **not production-migrated/deployed**.

Current production still has no general:

- Directory v2 persistence;
- Group/Label Audience service;
- typed multi-selector Automation Audience service;
- typed Automation data/input-routing service;
- Automation Runtime;
- worker/scheduler;
- provider execution;
- acknowledgement/approval engine;
- AI Task execution;
- Planner/Change Plan execution;
- Agent;
- MCP execution.

Do not infer backend capability from Lab visuals.

# Copy and frontend safety

Preserve direct connected copy, truthful capability status, strong mobile layouts, no nested-scroll traps, no broad document-wide MutationObserver, no provider secrets in browser stores, no production API calls from isolated Lab routes and no arbitrary executable expression layer for data mapping.

Accepted Lab behavior migrates as semantics, not DOM/localStorage architecture.
