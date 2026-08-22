# Continuum frontend documentation map

Last verified: **2026-08-22**
Repository: `CMXChat/First-Repo`

This index is intentionally frontend-scoped.

**Project-wide and backend truth live in `CMXChat/jay-app`, not here.**

## Start here

1. `AI-START-HERE.md` — frontend takeover path.
2. `continuum-frontend-CURRENT.md` — route-by-route frontend wiring/preview truth.
3. `DOCUMENTATION-AUTHORITY.md` — what this repository is allowed to document.
4. `../assets/cmx-routes.json` — canonical route registry.
5. the relevant route-specific frontend CURRENT file.

For backend implementation, production, migrations, PR stacks, Runtime, Authority, providers or deployment, switch to:

`CMXChat/jay-app/PROJECT-STATUS-CURRENT.md`

## Canonical product routes

- `/checkin/`
- `/directory/`
- `/library/`
- `/automations/`
- `/email/`
- `/requests/`
- `/control/`
- `/spaces/`
- `/doc/`

The `/lab/` URL namespace is retired. Historical `assets/lab/*` names may remain inside the frontend implementation.

## Current frontend domain docs

### Automations

- `continuum-automations-real-backend-integration-CURRENT.md` — frontend integration behavior for the protected Automation lane.
- `continuum-automations-master-plan-CURRENT.md` — product/UI direction.
- later Automations operation/workspace docs — interaction/design checkpoints.
- `checkin-automations-frontend-CURRENT.md` — older Lab-era implementation history; not canonical route authority.

### Requests / Email

- `continuum-requests-CURRENT.md`
- `continuum-email-lab-CURRENT.md`

Read these for frontend orchestration, interaction and safety behavior. Backend implementation authority remains in `jay-app`.

### Directory

- `continuum-directory-server-proof-CURRENT.md`
- `continuum-directory-standalone-CURRENT.md`
- Directory product/design docs.

### Library / files / content UI

- `continuum-library-lab-CURRENT.md`
- `checkin-content-editor-CURRENT.md`
- `checkin-files-CURRENT.md`
- `checkin-library-premium-CURRENT.md`

These may describe frontend-visible typed objects, but backend schema/release truth belongs in `jay-app`.

### Control

- `continuum-control-center-lab-CURRENT.md`

Use it for frontend history/receipt presentation and sample operational UI semantics.

### Check In / continuity UI

- Check In frontend/product docs in this directory.

For production/backend Check In truth, use `jay-app`.

### `/doc/`

- `continuum-product-CURRENT.md`
- `continuum-doc-positioning-CURRENT.md`
- `continuum-doc-freeze-CURRENT.md`
- focused `/doc/` companion docs.

These govern product explanation and presentation, not backend release status.

### Future product/UI direction

Plans for Signals, Goals, Planner, Files, broader Directory relationships, Control simulation and other future experiences may stay here when they are primarily product/interface design.

Backend architecture and implementation contracts for those capabilities belong in `jay-app`.

## Frontend status vocabulary

- **LIVE UI** — route is deployed and reachable.
- **WIRED** — frontend calls a real protected backend contract.
- **PREVIEW** — browser/product/sample behavior, not durable server truth.
- **LEGACY** — compatibility/history only.

Do not maintain backend STACKED/release/migration truth in this repository.

## Historical files

Useful frontend/product history remains available in the repository and Git history.

Some older files contain backend detail because the repository boundaries were less clean when they were written. Treat those details as historical only. Do not refresh them as backend authority.

If a unique backend fact is found only here, reconcile it into `jay-app` before removing the historical source.

## Update discipline

When frontend behavior changes, update the smallest correct set:

- frontend source/tests;
- relevant frontend CURRENT file;
- `continuum-frontend-CURRENT.md` if cross-route wiring changed;
- route registry if route metadata changed.

When backend/project status changes, update **jay-app only** unless the frontend itself also changes.