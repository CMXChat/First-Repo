# `/brief` Documentation Index

This folder is the starting point for `/brief` recovery, stabilization, and product documentation.

## Start here

### Live checkpoint

- [`CURRENT.md`](CURRENT.md)

Read this first. It contains the active branch, draft PR, completed checkpoint, validation gap, and exact next action.

### Full recovery handoff

- [`../brief-recovery-handoff.md`](../brief-recovery-handoff.md)

Read this before editing product code. It contains the complete repair sequence, bug inventory, PR dependency map, validation matrix, working rules, and change log.

### Raw browser failures

- [`../brief-interface-failures.md`](../brief-interface-failures.md)

This file contains captured Playwright failures and should remain a raw evidence source. Keep conclusions and current status in `CURRENT.md` and the recovery handoff instead of adding more planning prose to the raw log.

## Related implementation reports

- [`../brief-overlay-controls-fix-2026-08-04.md`](../brief-overlay-controls-fix-2026-08-04.md)
- [`../brief-personal-os-redesign-2026-08-04.md`](../brief-personal-os-redesign-2026-08-04.md)

These documents describe specific implementation branches. Recheck the associated branch and PR before treating any report as merged production behavior.

## Goal Intelligence documents

Goal Intelligence work is related to the long-term Personal OS concept but remains separate from `/brief` recovery.

- [`../concepts/brief-goal-intelligence-worklog.md`](../concepts/brief-goal-intelligence-worklog.md)
- [`../concepts/goal-intelligence-step-3-closeout-2026-08-04.md`](../concepts/goal-intelligence-step-3-closeout-2026-08-04.md)
- [`../concepts/goal-intelligence-step-4-engine-plan.md`](../concepts/goal-intelligence-step-4-engine-plan.md)

Do not mix Goal Intelligence changes into the recovery branch.

## Documentation roles

- `CURRENT.md`: replace with the latest short checkpoint
- `brief-recovery-handoff.md`: maintain the durable plan, history, and full context
- `brief-interface-failures.md`: preserve raw test evidence
- dated implementation reports: keep tied to their branch or PR

## Documentation rules

1. Update `CURRENT.md` after each meaningful commit or test run.
2. Append important checkpoints to the full recovery handoff.
3. Put raw logs in evidence files, not in the live summary.
4. Keep implementation reports tied to their branch or PR.
5. Never rely on chat or `/tmp` as the only record of work.
6. Record exact commit SHAs, test results, blockers, and next actions.
7. Preserve older evidence unless it is clearly duplicated and safely archived.

## Current active work

```text
Branch: agent/brief-recovery-step-1
Draft PR: #41
Purpose: restore and validate the complete brief workspace baseline
Live status: docs/brief/CURRENT.md
Full handoff: docs/brief-recovery-handoff.md
```
