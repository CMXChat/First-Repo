# CMX Documentation Index

Last reconciled: **August 18, 2026**
Repository: `CMXChat/First-Repo`

## Current rule

Current source, tests, workflows and `*-CURRENT.md` contracts take priority over older dated notes.

Dated concept documents remain decision history. Do not let an older Spaces-only, Brief, CRM or Automation prototype override current Continuum truth.

# Start here

1. `checkin-context-handoff-CURRENT.md` — concise current cross-repository truth.
2. `continuum-product-CURRENT.md` — Continuum identity and `/doc/` contract.
3. `continuum-automations-master-plan-CURRENT.md` — Automation product/capability direction.
4. `continuum-directory-master-plan-CURRENT.md` — Directory identity/relationship/CRM-quality direction.
5. `checkin-automations-frontend-CURRENT.md` — exact focused Automations frontend truth.
6. `checkin-directory-library-CURRENT.md` — exact current Directory/Audience/Library cross-domain frontend truth.
7. `checkin-library-premium-CURRENT.md` — Library projection/navigation contract.
8. `checkin-content-editor-CURRENT.md` — native content editor contract.
9. `checkin-files-CURRENT.md` — binary File direction.
10. `checkin-ai-product-design-CURRENT.md` — AI product direction.
11. `checkin-communications-ai-CURRENT.md` — communication + AI Task direction.
12. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md` — canonical backend read map.

# Current product naming

- **Continuum** = umbrella product.
- **Spaces** = focused briefing/context experience.
- **Directory** = people, organizations, relationships, contact methods and saved audiences.
- **Library** = protected content, files and saved knowledge.
- **Automations** = typed workflow definitions.
- **Connections** = approved paths to outside apps, APIs, MCP services and providers.
- **Runtime** = future server execution/history layer.
- **AI** = bounded intelligence using the same typed services as humans.
- **Afterlife: The Dead Man Switch** = continuity experience on the shared foundation.
- **Check In** = current protected application/backend program name.

# Current key routes

## `/doc/`

Public noindex master explanation of Continuum.

It remains under a separate clarity freeze. Lab changes alone do not justify editing it.

## `/lab/`

Broader Continuum / Check In experiment workspace.

The Records area now runs **Directory v2** over the shared Lab CRM store.

Current Directory v2 demonstrations include:

- People;
- Organizations;
- Groups / saved audiences;
- many-Organization Person membership;
- ContactMethod/readiness prototypes;
- Labels;
- Person relationships;
- notes and Activity;
- Group resolution;
- duplicate warnings;
- Automation usage;
- mobile list → profile behavior.

All state remains browser-local prototype state.

## `/lab/automations/`

Focused Automation operating/testing surface.

Current stack:

- v3 local Draft/autosave compatibility core;
- progressive blank-Draft truth layer;
- v4 command-center/Capability Catalog layer;
- v4 scenario layer with 13 editable starting patterns;
- Directory readiness integration;
- **Audience v4.1** multi-selector layer;
- strict Lab-only execution boundary.

Communication Actions can now select one or more:

- Person;
- Organization;
- Group;
- Label.

The Lab stores `audienceSelectors[]`, resolves current unique People, deduplicates by Person ID and previews email/phone readiness.

This is Lab semantics only. Production still needs the typed protected Audience model, canonical resolver and Runtime recipient freezing.

## `/checkin/`

Protected Check In application.

Production remains Phase 1 until the validated Phase 2A migration/deployment runbook is deliberately completed.

## `/spaces/`

Spaces briefing/context proving surface inside Continuum.

## `/environment/`

Python-first development/learning environment.

# Automations documentation

## Product master plan

`continuum-automations-master-plan-CURRENT.md`

Use for command-center UX, Capability Catalog, scenarios, mobile, testing/preflight, Planner direction, Connections and Runtime destination.

## Exact frontend truth

`checkin-automations-frontend-CURRENT.md`

Use for actual focused-route files, v3/v4 responsibilities, progressive Draft rules, safety and migration expectations.

## Directory/Audience integration

`checkin-directory-library-CURRENT.md`

Use for current Audience v4.1 semantics, compatibility behavior and production boundary.

## Backend truth

See `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md`.

Important Automation backend docs include:

- `PHASE2A-CONTINUATION-PLAN.md`;
- `CONTINUUM-AUTOMATIONS-PLATFORM-PLAN.md`;
- `AUTOMATION-FRONTEND-CONTRACT.md`;
- `AI-CAPABILITY-AND-TOOLS-CONTRACT.md`;
- `DELEGATED-AUTHORITY-BACKEND-CONTRACT.md`.

# Directory documentation

## Product master plan

`continuum-directory-master-plan-CURRENT.md`

Use for:

- Person / Organization / membership model;
- ContactMethods;
- Labels;
- Groups;
- PersonRelationship;
- CRM-quality profile/search/view direction;
- Activity;
- duplicate/merge direction;
- custom fields;
- import/export;
- mobile UX;
- Automations/Library/Spaces/AI integration;
- deliberate non-goals such as full sales/marketing CRM parity.

## Backend truth

- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-DIRECTORY-PLATFORM-PLAN.md` — broad Directory platform plan.
- `CMXChat/jay-app/specs/003-server-checkin/DIRECTORY-AUDIENCE-LIBRARY-BACKEND-HANDOFF.md` — durable membership/Label/Group/audience companion contract.

# Library documentation

Use:

- `checkin-library-premium-CURRENT.md`;
- `checkin-content-editor-CURRENT.md`;
- `checkin-files-CURRENT.md`.

Backend companions include:

- `CONTENT-ASSETS-BACKEND-HANDOFF.md`;
- `FILE-ASSETS-BACKEND-HANDOFF.md`;
- `LIBRARY-FOLDERS-TEMPLATES-MARKDOWN-BACKEND-HANDOFF.md`;
- `LIBRARY-PROJECTION-PREMIUM-BACKEND-HANDOFF.md`.

# Current backend boundary

The first Phase 2A Library + typed Automation source is validated on `jay-app/main` but is **not production-migrated/deployed**.

Current production still has no general:

- Directory v2 persistence;
- Group/Label audience service;
- typed multi-selector Automation Audience service;
- Automation Runtime;
- worker/scheduler;
- provider execution;
- acknowledgement/approval engine;
- AI Task execution;
- Planner execution;
- Agent;
- MCP execution.

Do not infer backend capability from Lab visuals.

# Development environment

For the Python-first learning/development environment, start with `development-environment-requirements.md` and `/environment/`.

# Copy standard

- use plain, direct, connected sentences;
- keep labels and controls concise;
- avoid generic SaaS/AI slogans;
- avoid ellipses and em dashes in user-facing editorial copy;
- keep capability status truthful;
- clearly distinguish Lab, protected-live and future capability;
- avoid micro-copy for important meaning.

# Frontend safety lessons

Preserve:

- no broad document-wide MutationObserver in accepted Lab/Check In synchronization;
- mobile is a separate readable layout;
- no nested scroll traps in normal builders;
- pending state must look pending;
- light mode needs explicit contrast decisions;
- no provider secrets in frontend stores;
- no production API calls from isolated Lab routes;
- accepted Lab behavior migrates into production as semantics, not DOM/localStorage architecture.

# Historical records

Older Personal OS, Brief, early Spaces and superseded Automation/Audience modules remain useful decision history only.
