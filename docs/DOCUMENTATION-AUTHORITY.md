# Continuum Frontend Documentation Authority

Authority: **FIRST-REPO FRONTEND DOCUMENT GOVERNANCE**
Last verified: **2026-08-22**

This repository is not allowed to become a second backend/project-status handbook.

## Core boundary

`CMXChat/First-Repo` owns frontend/static/product-surface documentation.

`CMXChat/jay-app` owns project-wide and backend truth.

If a question is about any of the following, stop reading First-Repo as authority and switch to `jay-app`:

- production backend release;
- backend deployment status;
- migrations/Alembic heads;
- database models/schema;
- backend PR/task progression;
- Runtime internals;
- Authority/trigger-consumption internals;
- provider/reconciliation implementation;
- backend validation counts;
- backend release/deployment runbooks.

Canonical backend entrypoint:

`CMXChat/jay-app/PROJECT-STATUS-CURRENT.md`

## What First-Repo may answer

First-Repo current docs may authoritatively answer:

- which static routes exist;
- which route is canonical vs legacy;
- which frontend assets/controllers a page loads;
- whether a page is wired to a protected backend contract;
- which UI behavior is browser-preview/sample behavior;
- how pages navigate between one another;
- desktop/mobile/frontend interaction contracts;
- browser/static test evidence;
- product-facing copy and design direction.

## Frontend authority order

For current frontend questions use:

1. executable frontend source and tests;
2. `docs/continuum-frontend-CURRENT.md`;
3. `assets/cmx-routes.json` for route existence/metadata;
4. the relevant surface-specific frontend CURRENT document;
5. older checkpoints/history only when needed for rationale or regression evidence.

A filename containing `CURRENT` is not automatically global authority.

## Frontend status vocabulary

Use:

- **LIVE UI** — route is deployed and reachable.
- **WIRED** — frontend code calls a real protected backend contract.
- **PREVIEW** — browser/sample behavior, not durable server truth.
- **LEGACY** — compatibility/history only.

Do not maintain a First-Repo inventory of backend `STACKED` implementation state. That belongs in `jay-app`.

A frontend can be WIRED even when the backend dependency is unavailable in the current environment. The UI must show the actual API result; First-Repo must not guess why the backend is unavailable.

## Canonical route authority

Canonical route existence comes from `assets/cmx-routes.json` plus the actual static route.

Current Continuum routes include:

- `/checkin/`
- `/spaces/`
- `/directory/`
- `/library/`
- `/automations/`
- `/email/`
- `/requests/`
- `/control/`
- `/doc/`

`/lab/` is retired as a user-facing namespace.

Historical asset names such as `assets/lab/*` may remain as implementation identifiers.

## Historical documents

Older First-Repo documents can preserve useful frontend/product decisions and acceptance evidence.

However, historical files that contain old backend details are **history, not backend authority**.

Do not copy new backend implementation details into them.

If unique backend knowledge is discovered only in an old First-Repo document, move/reconcile that knowledge into `jay-app` before deleting or heavily rewriting the old file.

Git history remains a preservation layer.

## What must never be duplicated here

Do not add or maintain current tables/lists of:

- backend release SHAs;
- migration revision IDs;
- backend PR chains;
- backend task completion inventories;
- backend test/coverage counts;
- provider-operation state machines;
- internal Authority/Runtime persistence details.

Frontend docs may name the typed objects/endpoints they consume when necessary to explain UI behavior, but implementation authority remains in `jay-app`.

## Update discipline

For a frontend change:

1. update frontend source/tests;
2. update the relevant frontend domain handoff;
3. update `continuum-frontend-CURRENT.md` only if cross-surface wiring changed;
4. update `assets/cmx-routes.json` only if route metadata changed.

For a backend/project change:

1. update `jay-app` source/tests/docs;
2. update `jay-app/PROJECT-STATUS-CURRENT.md` or the appropriate backend handoff;
3. only adjust First-Repo if the frontend itself changes because of that backend contract.

Never copy backend status into First-Repo simply so both repos say the same thing.

## AI handoff rule

A new AI in First-Repo should normally need only:

1. `docs/AI-START-HERE.md`
2. `docs/continuum-frontend-CURRENT.md`
3. `docs/README.md`
4. the relevant route-specific frontend file
5. frontend source/tests

If the task crosses into backend truth, switch repositories and read `jay-app/PROJECT-STATUS-CURRENT.md`.

## Preservation

The earlier cross-repository First-Repo status document remains recoverable in Git history. It is intentionally being removed from the current tree because backend/project authority belongs in `jay-app`, not because that information is being discarded.