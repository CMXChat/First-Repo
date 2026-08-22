# Continuum frontend proving repository

`CMXChat/First-Repo` owns the static/browser-facing Continuum proving surfaces served from `db.cmxchat.com`.

**Project-wide truth and all backend authority live in `CMXChat/jay-app`.** First-Repo must not become a second backend handbook, migration log, release record, or architecture authority.

## Start here

For frontend work, read:

1. `docs/AI-START-HERE.md`
2. `docs/continuum-frontend-CURRENT.md`
3. `docs/DOCUMENTATION-AUTHORITY.md`
4. `docs/README.md`
5. `assets/cmx-routes.json`
6. the surface-specific frontend document for the route you are changing

For any question about backend implementation, production release, migrations, database models, Runtime internals, Authority, provider behavior, backend PR stacks, or deployment, switch to `CMXChat/jay-app` and begin with:

- `PROJECT-STATUS-CURRENT.md`
- `AI-START-HERE.md`
- `AGENTS.md`

## What belongs here

First-Repo may own:

- canonical static product routes;
- HTML/CSS/browser JavaScript;
- frontend interaction and visual contracts;
- frontend-to-API adapters used by the proving surfaces;
- route registry and route compatibility behavior;
- browser/static validation;
- frontend handoffs;
- product-facing copy and prototypes.

First-Repo does **not** own:

- backend release truth;
- Alembic/migration history as current authority;
- PostgreSQL/domain-model truth;
- backend PR/task status;
- provider credentials or provider implementation details;
- Runtime/Authority implementation handbooks;
- project-wide engineering status.

Those belong in `CMXChat/jay-app`.

## Canonical Continuum routes

- `/checkin/`
- `/spaces/`
- `/directory/`
- `/library/`
- `/automations/`
- `/email/`
- `/requests/`
- `/control/`
- `/doc/`

`/lab/` is retired as a canonical user-facing namespace. Historical `assets/lab/*` filenames may remain as implementation identifiers.

## Frontend status language

Use frontend-scoped language here:

- **LIVE UI** — the route is deployed and reachable.
- **WIRED** — the frontend calls a real protected backend contract.
- **PREVIEW** — browser/sample behavior that is not durable server truth.
- **LEGACY** — retained only for compatibility/history.

Whether a backend dependency is deployed is **not maintained as duplicated static truth in this repository**. The page should handle the API response truthfully, and engineers should consult `jay-app` for backend status.

## Core frontend rule

> One backend, many interfaces.

The browser may project and navigate durable server objects, but it must not invent a second database, execution engine, permission system, or deployment record.

## Documentation rule

Useful old frontend/product history can remain, but new backend implementation truth belongs only in `jay-app`.

The pre-correction documentation state remains recoverable through Git history. Removing duplicated backend status from First-Repo does not erase it from the project; the canonical backend copy remains in `jay-app`.