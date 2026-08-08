# CMX Documentation Index

Last reconciled: **August 8, 2026**
Repository: `CMXChat/First-Repo`
Verified code baseline: `50be686f28f9bc7fd9bc5d7043d2d527e4e50954`

## Read this first

Current code, tests, workflows, route policy, and current operational documents take priority over older notes. Dated concept documents remain useful as decision history.

Use this order when starting Spaces work:

1. `docs/spaces-demo-continuity.md`
2. `docs/spaces-visual-design-system.md`
3. `docs/2026-08-06-spaces-route-migration.md`
4. `docs/spaces-product-direction-2026-08-06.md`
5. `docs/2026-08-05-repository-reconciliation.md`
6. `docs/personal-os-release-safeguards.md`
7. `docs/brief-recovery-handoff.md`
8. `docs/cmx-brief-master-context.md`
9. `docs/brief-interface-validation.md`
10. `docs/brief-interface-failures.md`
11. Current source, tests, workflows, and `assets/cmx-routes.json`

For the Python-first learning and development environment, start with `docs/development-environment-requirements.md` and `/environment/`.

## Current operational documents

| File | Purpose |
|---|---|
| `development-environment-requirements.md` | Requirements for the Python-first development environment, project structure, AI guardrails, learning behavior, recovery, deployment, handbook, and acceptance standard. |
| `spaces-demo-continuity.md` | Current seven-scenario product, responsive entry, product-document investment comparison, design, data, validation, publishing, and rollback contract. |
| `spaces-visual-design-system.md` | Current Spaces visual language, color direction, realistic visualization rules, interlinking, Everything progress, mobile behavior, accessibility, and review standard. |
| `2026-08-06-spaces-route-migration.md` | Canonical route decision plus shared-calendar, alarm, voice, compatibility, and release contracts. |
| `spaces-product-direction-2026-08-06.md` | Current product name, category, doctrine, input model, memory settings, and Cloudflare relationship. |
| `2026-08-05-repository-reconciliation.md` | Comparison between the August 4 notes and the August 5 repository. |
| `personal-os-release-safeguards.md` | Release gate, production smoke, accessibility, cache, inventory, and documentation-freshness safeguards. The filename is retained for continuity. |
| `brief-recovery-handoff.md` | Historical continuity handoff for `/brief/`, `/brief-next/`, and `/doc/`; use the route migration document for the current route contract. |
| `cmx-brief-master-context.md` | Product, architecture, trust, and roadmap context. |
| `brief-interface-validation.md` | Validation history and interface expectations that still apply to the active experience. |
| `brief-interface-failures.md` | Resolved failures, remaining risks, and known constraints. |
| `concepts/brief-program-status-and-roadmap-2026-08-05.md` | Dated snapshot from before the Spaces rename. |

## Naming contract

- The user-facing product name is **Spaces**.
- Describe it as a context-driven workspace, personal intelligence platform, or platform built around Spaces.
- Avoid AI OS, Personal OS, Life OS, Agent OS, and Intelligence OS in current user-facing copy.
- Older dated documents may preserve former names and routes as history.
- Legacy internal filenames, storage keys, test names, and workflow filenames can remain until a separate safe migration removes them.
- The Brief is the focused daily experience inside a Space, not the product or canonical route name.

## Current routes

- `/environment/`: protected direct-link Python-first development environment specification and learning workflow.
- `/spaces/`: canonical public noindex Spaces demo, light in the initial HTML, with manual dark mode.
- `/brief/`: public noindex compatibility route that redirects old links and bookmarks to `/spaces/` while preserving query strings and hashes.
- `/brief-next/`: public noindex pre-migration rollback snapshot; it is intentionally separate from the active route.
- `/doc/`: public noindex Spaces product overview, light by default, without a password gate.

## Development environment contract

- Python is the primary backend language and FastAPI is the primary application template.
- Confirmed direction, proposed defaults, and unresolved choices remain visibly separate.
- Project structure should keep routes, services, schemas, database code, models, tests, migrations, and configuration in predictable locations.
- AI may handle routine project work inside defined boundaries while dependencies, schema changes, destructive commands, broad architecture changes, secrets, and deployment receive stronger review controls.
- Secrets remain outside source and browser code.
- Git and GitHub provide checkpoints, reviewable diffs, branches, commits, pull requests, and recovery.
- Local development, sandboxes, validation, staging, production, observation, and rollback should form one understandable lifecycle.
- Database backup and restore are part of the normal operating model.
- The handbook should explain both the workflow and the underlying technology.
- The example project should demonstrate the full lifecycle from local FastAPI through database, tests, deployment, logs, rollback, and restore.
- The long-term goal is increasing independence from both the handbook and AI for routine work.

## Spaces experience contract

- Every entry, reset, and Space switch returns to Today.
- `/spaces/` is the active experience and `/brief/` must remain a working compatibility redirect.
- `/brief-next/` is a rollback snapshot and must not be required to match `/spaces/` byte for byte.
- The Space selector must remain readable and operable in light and dark mode on desktop and mobile.
- The live topbar contains the soundtrack control and the same explicit `Dark` and `Light` segmented appearance control used by `/doc/`.
- The active demo contains seven contexts, including Business partners and Accountant and client.
- Each context can show one compact priority notice, one scenario-aware alert-routing preview, and one short correction question.
- Each context links to three signature modules and can open a conversation from the current section.
- The entry defines Spaces as briefings built from approved information and starts with Personal selected. Tablet-sized layouts can show the selected briefing and permission preview; phones remove that repeated preview and keep the selected card, confirmation label, disabled or active natural action, and contextual sticky action.
- The entry also rotates through practical product ideas in a thin changing-accent pill, fits common desktop viewports, gives phones a readable vertical flow, and exposes an explicit scroll affordance when a smaller desktop window needs it.
- Every context offers one primary soundtrack and two alternate choices.
- Product documentation remains available from entry and How it works.
- Scenario buttons use native button semantics with `aria-pressed`.
- Secondary text remains WCAG AA compliant.
- Entry remains silent; soundtrack playback begins from a direct action in the top-right music drawer.
- Spotify preparation never blocks Spaces.
- Provider limits and direct-tap fallback copy remain honest.
- Shared calendars expose only approved Space-level coordination data, not unrelated private event details.
- Alarm and voice behavior remain planned, opt-in, visible, reviewable, and limited by the current person, device, time, and Space.
- Alert routing is a local demo setting. No WhatsApp, text, push, or email delivery occurs. Production delivery requires authenticated connections, recipient consent, route scope, revocation, logs, and failure handling.

## Copy standard

- Write plain, direct, connected sentences.
- Keep labels, controls, metrics, and navigation concise.
- Avoid stacked slogan fragments and generated-sounding symmetry.
- Keep demonstrated, fictional, and planned capabilities clearly separated.
- Prefer final product wording in source files. A small compatibility adapter is acceptable when it protects a staged rename across dynamic legacy modules.

## Required safeguards

Do not remove or weaken:

- the Spaces browser matrix across Chromium, Firefox, WebKit, iPhone, and Android profiles;
- the Spaces release gate;
- active-route, compatibility-route, rollback, and product-boundary checks;
- cache-version enforcement for active Spaces assets;
- demo-versus-live boundary checks;
- documentation freshness checks;
- Spotify lifecycle tests;
- desktop and mobile Chromium accessibility workflows;
- active and rollback Spaces asset inventory checks.

The former Brief and Brief Next parity rule is retired because `/brief/` is now a redirect and `/brief-next/` is a rollback snapshot.

## Historical records

Older Personal OS and `/brief/` references describe the same project before the August 6, 2026 Spaces route migration. Do not rewrite dated concept files to hide that decision history.

`briefing-design-standard.md` records the earlier dark-first briefing baseline. It no longer controls the light-default `/spaces/` interface where it conflicts with `spaces-visual-design-system.md`.

## Documentation rules

- Record a verified commit SHA in current operational documents.
- Recheck GitHub before describing an open branch, failure, or check as current.
- Treat static browser demos as demonstrations. They do not prove a backend, authentication layer, memory service, connector, or live private data pipeline exists.
- Update this index whenever a current document, route contract, or release safeguard is added, superseded, or archived.
