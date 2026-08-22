# Continuum Documentation Authority

Authority: **DOCUMENT GOVERNANCE**
Last verified: **2026-08-22**

This file defines how to decide which document is allowed to answer which question.

The goal is to preserve useful history without letting old checkpoints impersonate current truth.

## Core rule

A filename containing `CURRENT` is not automatically global authority.

Documents have scopes. When two files disagree, use the highest-authority file for the question being asked, then use domain files for detail.

## Authority tiers

### Tier 0 — executable truth

For implemented behavior, source/schema/tests beat prose.

Examples:

- FastAPI routes/services/models;
- Alembic migrations;
- generated OpenAPI/client;
- current frontend route source;
- browser/static tests;
- current GitHub branch/PR metadata.

Executable truth still does **not** prove production deployment. Deployment/release evidence is a separate fact.

### Tier 1 — current status authority

Use these first for current-state questions:

- `docs/PROJECT-STATUS-CURRENT.md` — cross-repository LIVE/WIRED/STACKED/PREVIEW/PLANNED status.
- `docs/continuum-frontend-CURRENT.md` — current First-Repo route/wiring truth.
- `assets/cmx-routes.json` — canonical route registry only.
- `CMXChat/jay-app/PROJECT-STATUS-CURRENT.md` — backend production/main/stack truth.
- active stacked branch `specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md` — exact protected API contract for the current backend stack.

### Tier 2 — domain CURRENT contracts

These explain one surface/domain in depth.

Examples:

- `continuum-requests-CURRENT.md`
- `continuum-email-lab-CURRENT.md`
- `continuum-control-center-lab-CURRENT.md`
- `continuum-library-lab-CURRENT.md`
- Directory server-proof/current docs
- `continuum-automations-real-backend-integration-CURRENT.md`
- product/architecture CURRENT plans

A domain file may contain historical implementation names such as `assets/lab/*`. That does not make `/lab/*` the canonical route.

### Tier 3 — plans, design contracts and roadmap material

These describe intended architecture or future behavior.

They are authoritative for design constraints **within their intended future scope**, but not for implementation/deployment status.

Examples:

- Automations master plan;
- Signals/Observations plan;
- Goals/Missions;
- AI/Planner architecture;
- live-world capability plans;
- Files/binary storage direction.

### Tier 4 — checkpoints/history

Dated notes, old acceptance reports, old route-migration documents, superseded CURRENT snapshots and archived prototypes remain useful evidence.

They do not override Tier 1 current status.

Do not delete them merely because they are old.

## Standard status vocabulary

Use these across status documents and visible status explanations:

- **LIVE** — deployed and verified in the target production environment.
- **WIRED** — frontend code actually calls the typed/protected backend contract.
- **STACKED** — implementation exists/validated in GitHub source but is not production-deployed.
- **PREVIEW** — browser/product/sample behavior, not durable backend truth.
- **PLANNED** — documented direction without implemented current contract.

Avoid creating synonyms such as `basically live`, `kind of wired`, `source complete`, `almost production` unless the exact meaning is defined.

Domain lifecycle states such as Draft/Review/Published, pending/running/succeeded, claimed/revoked etc. remain separate from these deployment/integration terms.

## Production vs source vs frontend

Always distinguish these three questions:

1. **Does the frontend call it?** → WIRED.
2. **Does backend source implement it?** → STACKED or main-source implemented.
3. **Can production serve it now?** → LIVE only with deployment evidence.

A production page can legitimately show:

`session connected → newer endpoint 404 → NOT DEPLOYED`

That is not a frontend failure if the route is intentionally still stacked.

## Route authority

Canonical route existence/metadata comes from `assets/cmx-routes.json` plus the actual filesystem/static route.

As of this consolidation, canonical Continuum product routes include:

- `/checkin/`
- `/spaces/`
- `/directory/`
- `/library/`
- `/automations/`
- `/email/`
- `/requests/`
- `/control/`
- `/doc/`

`/lab/` is retired as a user-facing product namespace.

Historical `assets/lab/*`, CSS class names, storage keys or old documentation may remain for compatibility/history. They are implementation identifiers, not canonical URLs.

## How to handle stale documents

Do not mass-delete useful files.

Instead:

1. identify the unique information in the old file;
2. make sure Tier 1 or the relevant domain document links to it if still useful;
3. classify it as checkpoint/history in `docs/README.md`;
4. preserve git history;
5. only rename/move/delete when links and unique information have been intentionally reconciled.

If a widely linked stale file must remain at its old path, add a short supersession banner only when the whole file can be safely updated without losing its content.

## What cleanup must never do

Do not:

- erase acceptance evidence just to reduce file count;
- rewrite history to make the project look more complete than it was;
- promote a preview capability to LIVE;
- copy private secrets into docs;
- replace exact commit/PR/migration evidence with vague prose;
- collapse backend architecture plans into frontend claims;
- treat a branch test as production acceptance;
- treat an old route name as current because an asset filename still contains `lab`.

## Required update pattern

When a meaningful frontend/backend status boundary changes:

1. update executable source/tests first;
2. update the relevant domain CURRENT file;
3. update `PROJECT-STATUS-CURRENT.md` if cross-project status changed;
4. update `continuum-frontend-CURRENT.md` if route/wiring truth changed;
5. update `assets/cmx-routes.json` only if route metadata changed;
6. update `CMXChat/jay-app/PROJECT-STATUS-CURRENT.md` when backend production/main/stack truth changed;
7. only then change visible LIVE/WIRED/STACKED/PREVIEW labels.

## AI handoff rule

A new AI should be able to get oriented without reading every historical Markdown file.

Minimum recovery path:

1. `docs/AI-START-HERE.md`
2. `docs/PROJECT-STATUS-CURRENT.md`
3. `docs/continuum-frontend-CURRENT.md`
4. `CMXChat/jay-app/PROJECT-STATUS-CURRENT.md`
5. relevant domain contract
6. active code/spec/tasks

Only search older history when the current files point to it or a specific decision/acceptance detail is needed.

## Preservation record

The pre-consolidation First-Repo documentation/index state remains recoverable from git at commit:

`311e8c2feac73e6ea7d7f99b6a7895d2a973ad25`

This cleanup changes discoverability and authority. It does not intentionally discard project knowledge.
