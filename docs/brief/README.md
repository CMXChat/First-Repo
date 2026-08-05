# `/brief` Documentation Index

This folder is the starting point for `/brief` recovery, stabilization, and product documentation.

## Start here

### Current recovery state

- [`../brief-recovery-handoff.md`](../brief-recovery-handoff.md)

Read this before editing `/brief`. It contains the active branch, exact commits, current blocker, repair sequence, validation matrix, and next action.

### Raw browser failures

- [`../brief-interface-failures.md`](../brief-interface-failures.md)

This file contains captured Playwright failures and should remain a raw evidence source. Keep conclusions and current status in the recovery handoff instead of adding more planning prose to the raw log.

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

## Documentation rules

1. Keep the recovery handoff status-first and current.
2. Append a checkpoint after each meaningful commit or test run.
3. Put raw logs in evidence files, not in the status summary.
4. Keep implementation reports tied to their branch or PR.
5. Never rely on chat or `/tmp` as the only record of work.
6. Record exact commit SHAs, test results, blockers, and next actions.
7. Preserve older evidence unless it is clearly duplicated and safely archived.

## Current active work

```text
Branch: agent/brief-recovery-step-1
Purpose: restore and validate the complete brief workspace baseline
Primary handoff: docs/brief-recovery-handoff.md
```
