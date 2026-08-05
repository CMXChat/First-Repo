# `/brief` Documentation Index

This folder is the starting point for `/brief` recovery, simplification, stabilization, and product documentation.

## Start here

### Live checkpoint

- [`CURRENT.md`](CURRENT.md)

Read this first. It contains the active branch, draft PR, completed checkpoint, validation state, current product direction, and exact next action.

### Simplified demo strategy

- [`DEMO-SIMPLIFICATION-STRATEGY.md`](DEMO-SIMPLIFICATION-STRATEGY.md)

This is the approved planning direction for turning `/brief` into a focused, editable, reversible demo. It contains the current architecture assessment, keep/collapse/postpone decisions, media strategy, delivery phases, PR strategy, and the first proposed implementation step.

### Full recovery handoff

- [`../brief-recovery-handoff.md`](../brief-recovery-handoff.md)

Read this before editing current product code. It contains the complete recovery sequence, bug inventory, PR dependency map, validation matrix, working rules, and change log.

### Raw browser failures

- [`../brief-interface-failures.md`](../brief-interface-failures.md)

This file contains captured Playwright failures and should remain a raw evidence source. Keep conclusions and current status in `CURRENT.md` and the recovery handoff instead of adding more planning prose to the raw log.

## Related implementation reports

- [`../brief-overlay-controls-fix-2026-08-04.md`](../brief-overlay-controls-fix-2026-08-04.md)
- [`../brief-personal-os-redesign-2026-08-04.md`](../brief-personal-os-redesign-2026-08-04.md)

These documents describe specific implementation branches. Recheck the associated branch and PR before treating any report as merged production behavior. The new simplification direction means these branches should be reviewed for reusable pieces, not merged automatically.

## Goal Intelligence documents

Goal Intelligence work is related to the long-term Personal OS concept but remains separate from `/brief` recovery and demo simplification.

- [`../concepts/brief-goal-intelligence-worklog.md`](../concepts/brief-goal-intelligence-worklog.md)
- [`../concepts/goal-intelligence-step-3-closeout-2026-08-04.md`](../concepts/goal-intelligence-step-3-closeout-2026-08-04.md)
- [`../concepts/goal-intelligence-step-4-engine-plan.md`](../concepts/goal-intelligence-step-4-engine-plan.md)

Do not mix Goal Intelligence changes into the recovery or simplified demo branches.

## Documentation roles

- `CURRENT.md`: latest short checkpoint and exact next action
- `DEMO-SIMPLIFICATION-STRATEGY.md`: durable product and architecture direction
- `brief-recovery-handoff.md`: recovery plan, bug inventory, dependency history, and full context
- `brief-interface-failures.md`: raw test evidence
- dated implementation reports: branch-specific history

## Documentation rules

1. Update `CURRENT.md` after each meaningful commit or test run.
2. Update the simplification strategy when the approved product direction changes.
3. Append important recovery checkpoints to the full recovery handoff.
4. Put raw logs in evidence files, not in the live summary.
5. Keep implementation reports tied to their branch or PR.
6. Never rely on chat or `/tmp` as the only record of work.
7. Record exact commit SHAs, test results, blockers, and next actions.
8. Preserve older evidence unless it is clearly duplicated and safely archived.
9. Keep changes small enough that another context can resume from the docs and Git history.

## Current active work

```text
Branch: agent/brief-recovery-step-1
Draft PR: #41
Current purpose: preserve and validate the complete brief workspace baseline
Next proposed product branch: agent/brief-demo-v2
Live status: docs/brief/CURRENT.md
Simplification plan: docs/brief/DEMO-SIMPLIFICATION-STRATEGY.md
Full handoff: docs/brief-recovery-handoff.md
```
