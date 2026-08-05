# `/brief` Documentation Index

This folder is the starting point for `/brief` recovery, simplification, and product documentation.

## Start here

### Live checkpoint

- [`CURRENT.md`](CURRENT.md)

Read this first. It contains the active branch, current route, completed checkpoint, validation state, and exact next action.

### Approved ideas and decisions

- [`IDEAS.md`](IDEAS.md)

This is the durable register for approved user ideas, design decisions, deferred concepts, completed idea checkpoints, People and Spaces examples, memory direction, privacy principles, automation decisions, and cutover requirements.

### Active Phase 1 implementation record

- [`PHASE-1-WORKLOG.md`](PHASE-1-WORKLOG.md)

Read this before editing `brief-next/` or `assets/brief-next/`. It records the complex-simplicity product standard, `/doc` vision, file ownership, completed implementation parts, validation plan, and remaining Phase 1 sequence.

### Approved simplification strategy

- [`DEMO-SIMPLIFICATION-STRATEGY.md`](DEMO-SIMPLIFICATION-STRATEGY.md)

This contains the broader phased plan for preserving the current implementation, building the reversible demo, consolidating content, rebuilding media, polishing, cutting over, and later removing obsolete layers.

### Full recovery handoff

- [`../brief-recovery-handoff.md`](../brief-recovery-handoff.md)

This contains the original damaged-file recovery, legacy bug inventory, PR dependency map, browser matrix, and historical checkpoints.

### Raw browser failures

- [`../brief-interface-failures.md`](../brief-interface-failures.md)

This file contains captured legacy Playwright failures and should remain a raw evidence source. Keep conclusions and current status in `CURRENT.md`, the Phase 1 worklog, and the recovery handoff.

## Related implementation reports

- [`../brief-overlay-controls-fix-2026-08-04.md`](../brief-overlay-controls-fix-2026-08-04.md)
- [`../brief-personal-os-redesign-2026-08-04.md`](../brief-personal-os-redesign-2026-08-04.md)

These documents describe legacy implementation branches. Recheck the associated branch and PR before treating any report as merged production behavior.

## Goal Intelligence documents

Goal Intelligence remains related to the long-term Personal OS foundation but separate from Brief Next Phase 1.

- [`../concepts/brief-goal-intelligence-worklog.md`](../concepts/brief-goal-intelligence-worklog.md)
- [`../concepts/goal-intelligence-step-3-closeout-2026-08-04.md`](../concepts/goal-intelligence-step-3-closeout-2026-08-04.md)
- [`../concepts/goal-intelligence-step-4-engine-plan.md`](../concepts/goal-intelligence-step-4-engine-plan.md)

Do not mix Goal Intelligence engine work into the reversible demo foundation.

## Documentation roles

- `CURRENT.md`: replace with the latest short checkpoint
- `IDEAS.md`: maintain approved ideas, decisions, deferrals, and completion states
- `PHASE-1-WORKLOG.md`: append active Brief Next implementation checkpoints
- `DEMO-SIMPLIFICATION-STRATEGY.md`: maintain the approved product and phase strategy
- `brief-recovery-handoff.md`: preserve recovery history and legacy context
- `brief-interface-failures.md`: preserve raw test evidence
- dated implementation reports: keep tied to their branch or PR

## Documentation rules

1. Update `CURRENT.md` after each meaningful commit or test run.
2. Update `IDEAS.md` whenever an idea is approved, rejected, deferred, implemented, or superseded.
3. Update `PHASE-1-WORKLOG.md` after each Brief Next implementation checkpoint.
4. Keep the broader product strategy stable unless the user changes direction.
5. Put raw logs in evidence files, not in the live summary.
6. Never rely on chat or `/tmp` as the only record of work.
7. Record exact branches, commit SHAs, test results, blockers, and next actions.
8. Keep production `/brief` untouched until explicit cutover approval.
9. Do not reintroduce terminal ownership, duplicate state controllers, or multiple Spotify players into Brief Next.
10. Mark completed idea work explicitly so the next context does not repeat it.

## Current active work

```text
Branch: agent/brief-demo-v2
Base: agent/brief-recovery-step-1
Route: /brief-next/
Purpose: build and validate the reversible complex-simplicity Personal OS briefing demo
Live status: docs/brief/CURRENT.md
Ideas register: docs/brief/IDEAS.md
Implementation worklog: docs/brief/PHASE-1-WORKLOG.md
Strategy: docs/brief/DEMO-SIMPLIFICATION-STRATEGY.md
```
