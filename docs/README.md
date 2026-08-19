# CMX Documentation Index

Last reconciled: **August 18, 2026**
Repository: `CMXChat/First-Repo`

## Current rule

Current source, tests, workflows and `*-CURRENT.md` contracts take priority over older dated notes.

Dated concept documents remain decision history. Do not let an older Spaces-only, Brief or early Check In document override current Continuum product truth.

# Start here for Continuum / Check In

Read in this order:

1. `checkin-context-handoff-CURRENT.md` — current cross-repository production, backend and Lab truth.
2. `continuum-product-CURRENT.md` — Continuum identity, `/doc/` role and capability-status vocabulary.
3. `continuum-automations-master-plan-CURRENT.md` — canonical Automation product/UX/capability direction.
4. `continuum-directory-master-plan-CURRENT.md` — canonical Directory identity/relationship/CRM-quality direction.
5. `checkin-automations-frontend-CURRENT.md` — exact focused `/lab/automations/` frontend truth.
6. `checkin-automations-system-surface-CURRENT.md` — focused Automation operating-surface contract.
7. `checkin-lab-automations-integration-CURRENT.md` — `/lab/` ↔ `/lab/automations/` integration.
8. `checkin-directory-library-CURRENT.md` — current Directory/Audience/Library cross-domain frontend truth.
9. `checkin-library-premium-CURRENT.md` — advanced Library navigation/projection behavior.
10. `checkin-content-editor-CURRENT.md` — native content editor behavior.
11. `checkin-files-CURRENT.md` — binary File UX direction.
12. `checkin-ai-product-design-CURRENT.md` — AI product direction.
13. `checkin-communications-ai-CURRENT.md` — communication + AI Task frontend direction.
14. `checkin-product-design-CURRENT.md` — protected Check In product design.
15. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md` — canonical backend read map.

Do not reconstruct current state from old chats when these documents exist.

# Current product naming

- **Continuum** = umbrella product.
- **Spaces** = focused briefing/context experience.
- **Directory** = people, organizations, relationships, contact methods and saved audiences.
- **Library** = protected content, files and saved knowledge.
- **Automations** = typed definitions for when approved work should happen.
- **Connections** = approved paths to outside apps, APIs, MCP services and providers.
- **Runtime** = future server execution layer.
- **AI** = bounded intelligence using the same typed domain services as humans.
- **Afterlife: The Dead Man Switch** = continuity experience using the shared Continuum foundation.
- **Check In** = current protected application/backend program name in existing routes/code/specs.

Legacy Personal OS / Brief names may remain in historical filenames and dated documents.

# Current key routes

## `/doc/`

Public noindex master explanation of Continuum.

It remains under a separate clarity freeze. Do not change it merely because Lab presentation changes.

## `/lab/`

Broader Continuum / Check In experiment workspace.

Current important product surfaces include Actions, Sequence, Activity and **Directory v2**.

Directory v2 currently exposes:

- People;
- Organizations;
- Groups / saved audiences;
- many-Organization Person membership in the v2 editor;
- ContactMethod/readiness prototypes;
- Labels;
- explicit relationships;
- notes and Activity;
- Automation usage;
- Group audience resolution;
- mobile profile navigation.

All Directory state is local Lab prototype state. It is not production persistence.

## `/lab/automations/`

Dedicated focused Automation operating and testing surface.

Current route uses:

- proven v3 local Draft/autosave core;
- progressive blank-Draft truth layer;
- Continuum Automations v4 command-center/capability layer;
- expanded v4 scenario layer;
- Directory readiness integration;
- strict Lab-only execution boundary.

Current workspace includes:

- Automations;
- Templates;
- Runs preview with Runtime explicitly off;
- searchable Capability Catalog;
- interactive Flow Preview;
- per-stage local tests;
- stronger Review/preflight;
- manual / template / Planner-preview creation paths;
- thirteen current editable starting patterns;
- direct Person/Organization targets with Directory readiness;
- saved Group previews.

Direct Group/Label Automation targeting is intentionally not faked through the old scalar target field. The next milestone is a typed multi-selector Audience model.

## `/checkin/`

Protected Check In application.

Production remains the Phase 1 switch/timing/policy/Incident/Audit system until the validated Phase 2A migration/deployment boundary is deliberately completed.

## `/spaces/`

Spaces briefing/context demo and design proving surface.

Spaces remains part of Continuum. Older Spaces documents continue to control Spaces-specific behavior where they have not been deliberately superseded.

## `/environment/`

Python-first development/learning environment specification and workflow.

# Automations documentation

## Product master plan

`continuum-automations-master-plan-CURRENT.md`

Defines:

- command-center direction;
- capability-catalog architecture;
- scalable trigger/condition/action discovery;
- templates/scenarios;
- mobile interaction model;
- per-step testing;
- preflight;
- AI Planner direction;
- Connections and Runtime destination.

## Exact frontend truth

`checkin-automations-frontend-CURRENT.md`

Defines current files, v3/v4 responsibility, scenarios, direct-new route behavior, progressive Draft truth, testing, timing, safety and migration expectations.

## Backend truth

See `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md`.

Important backend Automation documents include:

- `PHASE2A-CONTINUATION-PLAN.md`;
- `CONTINUUM-AUTOMATIONS-PLATFORM-PLAN.md`;
- `AUTOMATION-FRONTEND-CONTRACT.md`;
- `AI-CAPABILITY-AND-TOOLS-CONTRACT.md`;
- `DELEGATED-AUTHORITY-BACKEND-CONTRACT.md`.

# Directory documentation

## Product master plan

`continuum-directory-master-plan-CURRENT.md`

Defines:

- Person / Organization / membership model;
- ContactMethods;
- Labels;
- Groups/saved audiences;
- explicit Person relationships;
- profile Activity;
- CRM-quality search/view/profile direction;
- duplicate/merge direction;
- custom fields;
- import/export;
- mobile UX;
- Automations/Library/Spaces/AI integration;
- deliberate non-goals such as sales-pipeline and marketing-suite parity.

## Current frontend truth

`checkin-directory-library-CURRENT.md`

Defines the current Directory v2 Lab surface, its compatibility store, current Automation readiness integration, typed Audience next step and Library boundary.

## Backend truth

Most relevant backend documents:

- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-DIRECTORY-PLATFORM-PLAN.md`;
- `CMXChat/jay-app/specs/003-server-checkin/DIRECTORY-AUDIENCE-LIBRARY-BACKEND-HANDOFF.md`.

The first is the broader CRM-quality Directory platform plan. The second remains the durable companion contract for membership, Labels, Groups and audience resolution semantics.

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

The first Phase 2A Library + typed Automation source is validated on `jay-app/main` but is **not yet production-migrated/deployed**.

Production remains Phase 1 until the separate production migration/deployment runbook succeeds.

Do not infer backend capability from Lab visuals.

Current production still has no general:

- server-backed Directory v2;
- Group/Label audience service;
- Automation Runtime;
- worker/scheduler;
- provider execution;
- acknowledgement/approval engine;
- AI Task execution;
- Planner execution;
- Agent;
- MCP execution.

# Development environment documentation

For the Python-first learning/development environment, begin with:

`development-environment-requirements.md`

The broader environment direction includes Python/FastAPI, PostgreSQL/Alembic, React/TypeScript, generated API client, Docker/deployment/recovery, secrets outside source/browser code and Git/GitHub checkpoints.

# Copy standard

For current product copy:

- use plain, direct, connected sentences;
- keep labels/controls concise;
- avoid generic SaaS/AI slogans;
- avoid ellipses and em dashes in user-facing editorial copy;
- keep LIVE / LAB / NEXT / LATER claims truthful where that vocabulary applies;
- clearly distinguish demonstrated, protected-live and future capability;
- avoid micro-copy for important meaning.

# Frontend safety lessons

Preserve:

- no broad document-wide MutationObserver for accepted Lab/Check In synchronization;
- mobile is a separate readable layout, not a scaled desktop console;
- no nested scroll traps in normal builders;
- no giant empty operational canvases;
- pending state must look pending;
- light mode needs its own contrast decisions;
- no provider secrets in frontend stores;
- no production API calls from isolated Lab routes;
- accepted Lab behavior migrates into production as product semantics, not DOM/localStorage architecture.

# Historical records

Older Personal OS, Brief, early Spaces and superseded Automation/Audience modules remain useful decision history.

Do not use them to override current Continuum naming, `/doc/` role, Automations v4 status, Directory v2 status or current backend release truth.
