# CMX Restricted Node / Continuum Lab

`db.cmxchat.com` is the CMX private operational, research, learning and product-prototyping subdomain.

`CMXChat/First-Repo` owns static GitHub Pages surfaces used to prototype and explain parts of **Continuum**. The protected FastAPI/PostgreSQL application lives in `CMXChat/jay-app`.

## Current Continuum model

- **Directory** = people, organizations, relationships, contact methods and saved audiences.
- **Library** = protected content, files and saved knowledge.
- **Automations** = typed workflow definitions.
- **Connections** = approved paths to outside capability.
- **Runtime** = future server execution/history.
- **AI** = bounded intelligence using the same typed services as human UI.
- **Spaces** = briefing/context experience.
- **Afterlife: The Dead Man Switch** = continuity experience.
- **Check In** = current protected backend/application program name.

Core principle:

> Build the control plane. Rent the capabilities.

## Read current docs first

1. `docs/checkin-context-handoff-CURRENT.md`
2. `docs/continuum-product-CURRENT.md`
3. `docs/continuum-automations-master-plan-CURRENT.md`
4. `docs/continuum-directory-master-plan-CURRENT.md`
5. `docs/checkin-automations-frontend-CURRENT.md`
6. `docs/checkin-directory-library-CURRENT.md`
7. `docs/README.md`
8. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md`

Current `*-CURRENT.md` contracts, source, tests and workflows beat older dated notes.

## `/doc/`

Noindex master explanation of Continuum. It remains under a separate clarity freeze. Lab UX/model work alone does not authorize edits to `/doc/`.

## `/lab/`

Broader Continuum experiment workspace.

Records runs **Directory v2** with People, Organizations, Groups, membership concepts, ContactMethods/readiness, Labels, Person relationships, Activity/notes, duplicate warnings, Automation usage and polished desktop/mobile treatment.

Directory also has an **AI setup preview** for future natural-language environment authoring:

`Describe → Plan → Preflight → Review → Apply`

The preview performs no model call and no mutation.

## `/lab/automations/`

Focused Automation operating/testing surface with a **v5 canonical Lab workflow model foundation** under the current v4.4 authoring experience.

It currently includes:

- v3 Draft/autosave compatibility editor;
- **v5 ordered workflow normalization/validation**;
- Automations / Templates / Runs command center;
- searchable Capability Catalog;
- interactive FLOW PREVIEW;
- **15 editable scenarios**;
- Directory readiness;
- Audience v4.1 Person/Organization/Group/Label selectors;
- Intelligence v4.2 contextual recommendations + typed `Use data`;
- richer local `TEST THIS STEP` traces;
- Input Routing v4.3 from typed source outputs into named Action fields;
- Advanced Flow v4.4 with linear inter-step `IF / Continue if…` and `WAIT / Wait between steps` authoring preview;
- manual / template / Planner-preview creation paths;
- mobile-specific selectors/modals.

V5 normalizes the accepted workflow as:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

while the simple `WHEN → IF → DO → WAIT → TEST` rail remains the beginner navigation model.

Top-level IF is pre-action, so a condition depending on an Action output belongs after that Action. The current inter-step IF is a linear gate only. YES/NO branching remains later. Inter-step WAIT is distinct from start timing and needs future persisted Runtime state.

Newest scenarios demonstrate those semantics directly:

- **Urgent AI follow-up** — AI output → IF urgent → notification;
- **Delayed backup escalation** — primary Action → WAIT → backup Action.

The route stays isolated: `connect-src 'self'`, no production API/provider execution, no real scheduling/Publish, no secrets and no external AI model call.

Browser `workflowV5`, localStorage and v4 compatibility fields remain Lab scaffolding. They do not define production backend schema.

## AI environment-authoring direction

The long-term goal is that the user can describe how they want Continuum organized and AI prepares the setup through the same typed services as human UI.

Canonical flow:

`natural-language intent → typed Change Plan → deterministic preflight/conflicts → review/approval → normal protected domain services`

A future Change Plan may coordinate supported Directory, Automation and Library operations. V5 gives Automation Planner a clearer ordered typed target, but AI never gets a shadow database/workflow format, prompt-granted authority or arbitrary executable code path.

Backend contract:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`

## `/checkin/`

Protected Check In frontend.

Production remains Phase 1 until the separate validated Phase 2A production migration/deployment sequence succeeds.

Current reviewed backend release: `de55627926316581808337f8e9c10d26e7d64588`

Current production Alembic revision: `c41f9b8d2e70`

Current timer: 72 elapsed hours + 24 elapsed hours grace, server/PostgreSQL authoritative.

Production currently performs no general Automation/provider/AI execution.

## First-Repo vs jay-app

### `CMXChat/First-Repo`

Contains static HTML/CSS/JavaScript routes, Lab/product proving surfaces, current frontend/product contracts and browser/static validation workflows.

### `CMXChat/jay-app`

Owns FastAPI/Python, PostgreSQL/SQLModel, Alembic, protected services/APIs, tests, generated OpenAPI client, official React/TypeScript path, current Check In backend and validated Phase 2A Library + typed Automation source.

Browser/frontend code reaches protected data through backend services. It never connects directly to PostgreSQL.

## Current Phase 2A boundary

The first Phase 2A Library + typed Automation source is validated on `jay-app/main` but is **not production-migrated/deployed**.

Before broad backend capability/Directory/Planner/flow-control expansion, use the canonical Phase 2A production runbook in `jay-app`.

Lab visuals or model completeness do not redefine production truth.

## Architecture rules

Preserve:

- frontend has no DB credentials;
- provider secrets stay server-side;
- protected mutations use server authorization and Origin/CSRF controls;
- stable IDs beat copied mutable names/contact strings;
- published/version history stays immutable;
- human UI and AI use the same typed services;
- prompt text never grants authority;
- no arbitrary Python/JavaScript/shell/SQL/eval workflow logic;
- typed Automation data flow uses validated source/output/input references;
- inter-step WAIT is durable server state when real, never a browser sleep;
- branching is typed routing, not arbitrary expression/code execution;
- no unrestricted webhook/API escape hatch;
- no broad document-wide MutationObserver loops in accepted Check In/Lab paths;
- Lab simulation/future capability must be labeled truthfully;
- browser model completeness never proves backend execution exists.

## Development / learning stack

The protected learning/application stack in `jay-app` uses FastAPI, Python, SQLModel, PostgreSQL, Alembic, React, TypeScript, Vite, TanStack Router/Query, generated OpenAPI client, Docker, Pytest and Playwright.

Basic path:

`Browser → HTTPS/JSON → FastAPI domain services → PostgreSQL → JSON response → frontend`
