# Documentation consolidation record — 2026-08-22

This is a historical record, not current status authority.

## Why cleanup was needed

By August 22, 2026, First-Repo had accumulated many useful `*-CURRENT.md` documents from different frontend/product checkpoints. Several remained valuable but no longer represented current route or UI truth.

Examples included:

- older Automations docs calling `/lab/automations/` canonical after route graduation to `/automations/`;
- older frontend summaries describing pages before protected API wiring existed;
- multiple overlapping frontend-week/source-truth/roadmap files that made takeover unnecessarily slow.

The cleanup changed **authority and navigation**, not Git history.

## Preserved baseline

The complete pre-consolidation First-Repo tree remains recoverable at:

`311e8c2feac73e6ea7d7f99b6a7895d2a973ad25`

Nothing in Git history was rewritten.

## Boundary correction

The first consolidation pass briefly added a cross-repository `docs/PROJECT-STATUS-CURRENT.md` and copied backend checkpoint detail into First-Repo.

That was corrected immediately because the intended repository boundary is:

- `CMXChat/First-Repo` = frontend/static/product-surface truth;
- `CMXChat/jay-app` = project-wide and backend truth.

The First-Repo project-status duplicate was removed from the current tree. Its historical contents remain in Git, while the canonical project/backend status lives in `jay-app/PROJECT-STATUS-CURRENT.md`.

## Current First-Repo authority path

- `docs/AI-START-HERE.md`
- `docs/continuum-frontend-CURRENT.md`
- `docs/DOCUMENTATION-AUTHORITY.md`
- `docs/README.md`
- `assets/cmx-routes.json`

For backend questions, those files point to `CMXChat/jay-app` rather than copying backend state locally.

## Route truth

The retired `/lab/` namespace remains historical.

Canonical product routes are listed in `assets/cmx-routes.json`.

Internal `assets/lab/*` paths may continue to exist as implementation-history names until deliberate frontend code consolidation occurs.

## Historical files

Older frontend/product files remain useful for design rationale and regression evidence.

Some historical First-Repo files contain backend references because the repository boundary was less clean when they were written. Those references are historical only and should not be refreshed as backend authority.

If unique backend knowledge is ever found only in First-Repo history, reconcile it into `jay-app` before deleting the historical source.