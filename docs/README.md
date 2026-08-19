# CMX Documentation Index

Last reconciled: **August 18, 2026**
Repository: `CMXChat/First-Repo`

## Current rule

Current source, tests, workflows and `*-CURRENT.md` contracts take priority over older dated notes.

Dated concept documents remain useful as decision history. Do not rewrite history to make old names look current.

The repository now contains multiple Continuum proving surfaces. Do not assume an older Spaces-only README describes the whole product.

# Start here for Continuum / Check In

Read in this order:

1. `checkin-context-handoff-CURRENT.md` — current cross-repository production, backend and Lab truth.
2. `continuum-product-CURRENT.md` — Continuum product identity, `/doc/` role and status vocabulary.
3. `continuum-automations-master-plan-CURRENT.md` — canonical Automations product/UX/capability direction.
4. `checkin-automations-frontend-CURRENT.md` — exact focused `/lab/automations/` frontend truth.
5. `checkin-automations-system-surface-CURRENT.md` — current Automations operating-surface presentation contract.
6. `checkin-lab-automations-integration-CURRENT.md` — `/lab/` ↔ `/lab/automations/` integration.
7. `checkin-product-design-CURRENT.md` — protected Check In product design.
8. `checkin-directory-library-CURRENT.md` — Directory/Library product behavior.
9. `checkin-library-premium-CURRENT.md` — premium Library navigation/projection behavior.
10. `checkin-content-editor-CURRENT.md` — content editor behavior.
11. `checkin-files-CURRENT.md` — file UX direction.
12. `checkin-ai-product-design-CURRENT.md` — AI product direction.
13. `checkin-communications-ai-CURRENT.md` — communication + AI Task frontend concepts.
14. `checkin-future-capabilities-CURRENT.md` — later capability direction where still applicable.
15. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md` — canonical backend read map.

Do not reconstruct current state from old chats when these documents exist.

# Current product naming

- **Continuum** = umbrella product.
- **Spaces** = focused briefing/context experience inside Continuum.
- **Directory** = people and organizations.
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

Public noindex master explanation of **Continuum**.

It explains the product in a prose-led reading order, including:

- the operating loop;
- Directory / Library / Spaces / Automations / Connections / Runtime / AI;
- the Dead Man Switch origin insight;
- Automation versus Runtime;
- Afterlife;
- architecture/build detail;
- roadmap/status.

`/doc/` is under a separate clarity freeze. Do not change it merely because Lab presentation changes.

## `/lab/`

Broader Continuum / Check In experiment workspace.

It remains the shared proving environment for Actions, Directory/Inventory-shaped records, Automation bridge behavior and other private-system concepts.

## `/lab/automations/`

Dedicated focused Automation operating and testing surface.

Current route uses:

- proven v3 local Draft/autosave core;
- progressive blank-Draft truth layer;
- Continuum Automations v4 command-center/capability layer;
- expanded v4 scenario layer;
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
- thirteen current editable starting patterns.

See `continuum-automations-master-plan-CURRENT.md` first for direction.

## `/checkin/`

Protected Check In application.

Production currently remains the Phase 1 switch/timing/policy/Incident/Audit system.

Do not claim the v4 Lab Automation experience is production Check In functionality.

## `/spaces/`

Spaces briefing/context demo and design proving surface.

Spaces remains part of Continuum. Older Spaces documents continue to control Spaces-specific behavior where they have not been deliberately superseded.

## `/brief/`

Compatibility route for older briefing links where the current route policy still uses it.

## `/environment/`

Python-first development/learning environment specification and related workflow.

# Automations documentation

## Strategic truth

`continuum-automations-master-plan-CURRENT.md`

Defines:

- best-of-mature-automation-product interaction goals;
- capability-catalog architecture;
- scalable trigger/condition/action discovery;
- templates/scenarios;
- mobile interaction model;
- per-step testing;
- preflight;
- AI Planner direction;
- Connections and Runtime destination;
- production migration rule.

## Exact focused frontend truth

`checkin-automations-frontend-CURRENT.md`

Defines current files, v3/v4 responsibility, current scenarios, direct-new route behavior, progressive Draft truth, timing, testing, safety and production migration expectations.

## System-surface truth

`checkin-automations-system-surface-CURRENT.md`

Defines the command-center/application hierarchy and presentation constraints.

## Cross-route truth

`checkin-lab-automations-integration-CURRENT.md`

Defines shared Lab state and exact/new Draft deep links between `/lab/` and `/lab/automations/`.

## Backend truth

See `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md`.

The most relevant backend files for Automations now include:

- `PHASE2A-CONTINUATION-PLAN.md`;
- `CONTINUUM-AUTOMATIONS-PLATFORM-PLAN.md`;
- `AUTOMATION-FRONTEND-CONTRACT.md`;
- `CHECKIN-PLATFORM-ARCHITECTURE.md`;
- `AI-CAPABILITY-AND-TOOLS-CONTRACT.md`;
- `DELEGATED-AUTHORITY-BACKEND-CONTRACT.md`;
- communication, Directory/Audience, Library, provenance and reliability contracts.

# Current backend boundary

The first Phase 2A Library + typed Automation source is validated on `jay-app/main` but is **not yet production-migrated/deployed**.

Production remains Phase 1 until the separate production migration/deployment runbook succeeds.

Do not infer backend capability from Lab visuals.

Current production still has no general:

- Automation Runtime;
- worker/scheduler;
- provider execution;
- acknowledgement/approval engine;
- AI Task execution;
- Planner execution;
- Agent;
- MCP execution.

# Spaces-specific documentation

Spaces remains an active Continuum product experience, but the older Spaces documents no longer define the entire repository/product.

Important Spaces references include:

- `spaces-demo-continuity.md`;
- `spaces-visual-design-system.md`;
- `2026-08-06-spaces-route-migration.md`;
- `2026-08-09-spaces-balanced-briefing.md`;
- `spaces-product-direction-2026-08-06.md`;
- `personal-os-release-safeguards.md`;
- historical Brief recovery/validation documents where needed.

Where a Spaces document describes `/doc/` as a Spaces-only product overview, the newer `continuum-product-CURRENT.md` wins.

# Development environment documentation

For the Python-first learning/development environment, begin with:

`development-environment-requirements.md`

and the `/environment/` route.

The broader environment direction includes:

- Python/FastAPI backend learning;
- predictable routes/services/schemas/database/models/tests/config structure;
- PostgreSQL/Alembic;
- React/TypeScript frontend understanding;
- generated API client;
- Docker/deployment/recovery;
- AI-assisted learning with architecture guardrails;
- secrets outside source/browser code;
- Git/GitHub checkpoints and reviewable changes.

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

Preserve current hard-earned rules:

- no broad document-wide MutationObserver for Lab/Check In synchronization;
- mobile is a separate readable layout, not a scaled desktop console;
- no nested scroll traps in normal builders;
- no giant empty operational canvases;
- pending state must look pending;
- light mode needs its own contrast decisions;
- no provider secrets in frontend stores;
- no production API calls from a route whose contract says isolated Lab;
- accepted Lab behavior migrates into production as product semantics, not as DOM/localStorage architecture.

# Historical records

Older Personal OS, Brief and early Spaces documents remain useful decision history.

Do not use them to override current Continuum naming, `/doc/` role, Automation v4 status or current backend release truth.
