# CMX Restricted Node / Continuum Lab

`db.cmxchat.com` is the CMX private operational, research, learning and product-prototyping subdomain.

`CMXChat/First-Repo` currently owns the static GitHub Pages surfaces used to prototype and explain parts of **Continuum**, including Spaces, Check In frontend surfaces, the broader Lab and the focused Automation Lab.

The protected Python/PostgreSQL backend lives separately in `CMXChat/jay-app`.

## Current product structure

**Continuum** is the umbrella product.

- **Spaces** = focused briefing/context experience.
- **Directory** = people and organizations.
- **Library** = protected content, files and saved knowledge.
- **Automations** = definitions for when approved work should happen.
- **Connections** = approved external capability paths.
- **Runtime** = future server execution layer.
- **AI** = bounded intelligence using the same typed domain services as human UI.
- **Afterlife: The Dead Man Switch** = continuity experience using the same foundation.
- **Check In** = current protected application/backend program name in existing routes/code/specs.

## Read current documentation first

Start with:

1. `docs/checkin-context-handoff-CURRENT.md`
2. `docs/continuum-product-CURRENT.md`
3. `docs/continuum-automations-master-plan-CURRENT.md`
4. `docs/checkin-automations-frontend-CURRENT.md`
5. `docs/README.md`
6. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md`

Current `*-CURRENT.md` contracts, source, tests and workflows beat older dated concept notes.

## Current important routes

### `/doc/`

Public noindex master explanation of **Continuum**.

It is no longer a Spaces-only product overview.

The document explains the operating loop, Directory, Library, Spaces, Automations, Connections, future Runtime, AI, Afterlife, architecture and roadmap.

`/doc/` is under a separate clarity freeze. Lab UI work does not automatically authorize `/doc/` changes.

### `/lab/`

Broader Continuum / Check In experiment workspace.

It is the proving surface for private-system concepts and shared prototype records/actions.

### `/lab/automations/`

Focused Continuum Automation operating and testing surface.

Current v4 experience keeps the proven v3 browser-local Draft/autosave core and adds:

- application-style Automations / Templates / Runs navigation;
- searchable Capability Catalog;
- interactive Flow Preview;
- per-stage local tests;
- stronger Review/preflight;
- manual / template / AI Planner-preview creation paths;
- expanded editable scenarios;
- mobile-specific capability/modal behavior.

The route remains an isolated Lab prototype:

- `connect-src 'self'`;
- no production API calls;
- no provider execution;
- no real scheduling authority;
- no production Publish;
- no provider secrets;
- no AI model call from the Planner preview.

See `docs/continuum-automations-master-plan-CURRENT.md`.

### `/checkin/`

Protected Check In frontend.

The authoritative backend and operational truth live in `CMXChat/jay-app/specs/003-server-checkin/`.

Current production backend remains Phase 1 until the separate validated Phase 2A migration/deployment sequence is executed.

Current production timer is a configurable 72 elapsed hours plus 24 elapsed hours of grace.

Current reviewed backend release recorded by the canonical handoff:

`de55627926316581808337f8e9c10d26e7d64588`

Current production Alembic revision:

`c41f9b8d2e70`

Production currently performs no general Automation/provider/AI execution.

### `/spaces/`

Spaces briefing/context proving experience.

Spaces remains part of Continuum. Older Spaces-specific documentation still controls Spaces behavior where it has not been deliberately superseded by newer current contracts.

### `/environment/`

Python-first learning/development environment specification and related project-learning surface.

## First-Repo vs jay-app

### `CMXChat/First-Repo`

Currently contains:

- static HTML/CSS/JavaScript routes served through GitHub Pages;
- product-prototyping Lab surfaces;
- current frontend/product contracts;
- route and browser validation workflows;
- Continuum `/doc/` explanation;
- Spaces proving surfaces;
- Check In frontend presentation.

Static pages cannot execute Python or access PostgreSQL directly.

### `CMXChat/jay-app`

Owns the protected application architecture:

- FastAPI/Python backend;
- PostgreSQL/SQLModel;
- Alembic migrations;
- protected domain services/APIs;
- tests;
- generated OpenAPI frontend client;
- official React/TypeScript frontend path;
- current Check In backend;
- validated Phase 2A Library + typed Automation source.

Browser/frontend code reaches protected data through backend services. It does not connect directly to PostgreSQL.

## Current Phase 2A boundary

The first Phase 2A source slice is validated on `jay-app/main` but is **not yet deployed to production**.

Validated source includes:

- `LibraryFolder`;
- `ContentAsset → mutable ContentDraft → immutable ContentVersion`;
- `Automation → mutable AutomationDraft → immutable AutomationVersion`;
- current small typed Trigger registry;
- definition-only `manual_review` Action;
- immutable publication/content-version freezing;
- database-level immutable version protections.

Before broad backend capability expansion, use the production migration/deployment runbook in `jay-app`.

The v4 Automation Lab catalog may preview future capability names without making them backend truth.

## Automation architecture direction

The Automation platform is moving toward a trusted server Capability Registry.

The goal is to let the product support many future Triggers, Conditions, Actions, workflow controls and Connection-provided capabilities without redesigning the builder.

Humans and future AI Planner can compose known typed capabilities into Drafts/templates/scenarios.

They cannot invent arbitrary executable server types.

Runtime comes later and will be responsible for durable Runs, persisted waits, attempts, idempotency and execution history.

Canonical backend plan:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AUTOMATIONS-PLATFORM-PLAN.md`

## Development / learning architecture

The current full-stack learning environment in `jay-app` is based on:

- FastAPI;
- Python;
- SQLModel;
- PostgreSQL;
- Alembic;
- React;
- TypeScript;
- Vite;
- TanStack Router/Query;
- generated OpenAPI client;
- Docker;
- Pytest;
- Playwright.

The basic application path is:

`Browser → HTTPS/JSON → FastAPI domain services → PostgreSQL → JSON response → frontend`

## Security principles

Preserve these rules:

- frontend/browser code does not receive DB credentials;
- provider credentials remain server-side;
- protected mutations use server authorization and the required Origin/CSRF controls;
- stable protected IDs are used instead of copied mutable names/addresses;
- published/version history stays immutable;
- AI prompt text never grants authority;
- no arbitrary Python/JavaScript/shell/SQL/eval workflow logic;
- no unrestricted generic webhook/API escape hatch;
- no broad document-wide MutationObserver loops in the accepted Check In/Lab path;
- Lab prototypes must state when behavior is simulation/future-only;
- visual completeness never proves backend execution exists.

## Repository rules

- Preserve active routes unless a deliberate migration says otherwise.
- Keep GitHub Pages Lab/prototype claims truthful.
- Keep current frontend contracts aligned with `jay-app` backend contracts.
- Add/update validation whenever a focused route contract changes.
- Do not treat an empty GitHub status response as proof that CI passed.
- Never commit credentials, tokens, private keys or production configuration.
- Use source-of-truth handoffs instead of stale READMEs or chat memory for release decisions.

## Historical notes

Older Personal OS, Brief and early Spaces documents describe earlier product phases and route decisions.

Keep them as history, but do not use them to override current Continuum naming, `/doc/` role, Automation v4 status or current Check In backend truth.
