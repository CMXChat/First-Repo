# Continuum frontend — AI START HERE

Authority: **FRONTEND ENTRYPOINT ONLY**
Last verified: **2026-08-22**
Repository: `CMXChat/First-Repo`

If you are an AI taking over this repository, treat it as the **frontend/static proving repository only**.

Do not reconstruct backend or project-wide truth here.

## Read in this order

1. `docs/continuum-frontend-CURRENT.md` — current route, UI, wiring and preview truth.
2. `docs/DOCUMENTATION-AUTHORITY.md` — what First-Repo is allowed to document.
3. `docs/README.md` — frontend documentation map.
4. `assets/cmx-routes.json` — canonical route registry.
5. the surface-specific frontend CURRENT file for the page you are changing.
6. executable frontend source and browser/static tests.

For **any backend question**, switch to `CMXChat/jay-app` and begin with:

1. `PROJECT-STATUS-CURRENT.md`
2. `AI-START-HERE.md`
3. `AGENTS.md`
4. the relevant backend handoff/spec/API handbook

`jay-app` is the only project/backend status authority.

## Repository boundary

First-Repo owns:

- static product routes;
- frontend presentation and interaction;
- frontend proving adapters;
- route compatibility;
- browser/static validation;
- frontend handoffs and product-facing prototypes.

First-Repo does not own or duplicate:

- backend PR/task status;
- migration heads;
- production backend release SHAs;
- database schema/model authority;
- Runtime/Authority implementation internals;
- provider implementation/reconciliation details;
- backend validation counts;
- deployment runbooks.

If you need one of those facts, read it from `jay-app` instead of copying it here.

## Frontend mental model

**One backend, many interfaces.**

The frontend surfaces should navigate and explain the same protected objects rather than become separate browser-owned systems.

Current canonical routes:

- `/checkin/`
- `/directory/`
- `/library/`
- `/automations/`
- `/email/`
- `/requests/`
- `/control/`
- `/spaces/`
- `/doc/`

Old `/lab/*` URLs are not canonical. Historical `assets/lab/*` names may remain as implementation identifiers.

## Frontend status words

Use these in First-Repo current docs:

- **LIVE UI** — route is deployed/reachable.
- **WIRED** — browser code calls a real protected backend contract.
- **PREVIEW** — local/sample behavior, not durable server truth.
- **LEGACY** — compatibility/history only.

Do not maintain a copied `STACKED` backend implementation inventory here. Backend availability/status belongs to `jay-app` and to actual API responses.

## Current route shape

- `/checkin/` — protected Check In UI.
- `/directory/` — protected identity lane plus richer preview concepts.
- `/library/` — protected content/version lane plus separate local preview workspace.
- `/automations/` — server-backed Automation lane plus richer local builder concepts.
- `/email/` — protected manual Email proving workflow.
- `/requests/` — bounded typed operator requests.
- `/control/` — read-only protected execution-history/receipt projection plus sample operational panels.
- `/spaces/` — context/briefing product experience.
- `/doc/` — product explanation.

Exact backend capabilities behind those routes must be read from `jay-app`, not inferred from this summary.

## Hard rules

Do not:

- add database credentials or provider secrets to First-Repo;
- talk directly to PostgreSQL or SMTP from browser code;
- treat browser storage as fallback truth for failed protected requests;
- copy backend release/migration/PR status into frontend authority docs;
- create a second Runtime, Authority model, scheduler or execution engine in JavaScript;
- call an old `/lab/*` route canonical;
- claim a backend deployment merely because frontend wiring exists.

Before editing, ask: **is this a frontend concern?**

If the answer is no, work in `CMXChat/jay-app` instead.