# Documentation consolidation record — 2026-08-22

This is a historical record, not current status authority.

## Why this cleanup happened

By August 22, 2026, the project had accumulated many useful `*-CURRENT.md` documents written at different checkpoints. Several remained valuable but no longer represented global current truth.

Examples of drift included:

- older Automations docs calling `/lab/automations/` canonical after route graduation to `/automations/`;
- older frontend summaries saying there were no backend calls even after protected Directory/Library/Automation/Runtime proof lanes landed;
- older README/index material describing Runtime as future even though durable Runtime was implemented in the stacked backend;
- multiple overlapping frontend-week/source-truth/roadmap files that each correctly captured a point in time but made a new AI read too much before knowing which one won.

The cleanup therefore changed **authority and navigation**, not project history.

## Preserved baseline

The complete pre-consolidation First-Repo tree is preserved in git at:

`311e8c2feac73e6ea7d7f99b6a7895d2a973ad25`

That commit includes merged frontend checkpoint PR #144.

Nothing in git history was rewritten or removed.

## New authority path

The cleanup introduced:

- `docs/AI-START-HERE.md`
- `docs/PROJECT-STATUS-CURRENT.md`
- `docs/continuum-frontend-CURRENT.md`
- `docs/DOCUMENTATION-AUTHORITY.md`

and replaced the old long root/documentation indexes with concise authority maps.

## Status vocabulary standardized

Cross-project status now uses:

- LIVE
- WIRED
- STACKED
- PREVIEW
- PLANNED

The important distinction is that `WIRED + STACKED` does not mean LIVE.

## Historical files intentionally retained

Older `*-CURRENT.md` and dated files remain in the repository unless a later focused cleanup proves they can be archived/moved without losing unique context or breaking useful links.

The word `CURRENT` in an old filename no longer grants global authority by itself. `docs/DOCUMENTATION-AUTHORITY.md` defines precedence.

## Route truth

The cleanup treats the retired `/lab/` namespace as historical.

Canonical product routes are listed in `assets/cmx-routes.json` and summarized in current authority docs.

Internal `assets/lab/*` paths may continue to exist as implementation-history names until deliberate code consolidation occurs.

## Backend preservation

Backend product/release history remains owned by `CMXChat/jay-app`.

The paired backend documentation cleanup adds its own root current-status/AI entrypoint without rewriting older architecture/spec history.
