# Continuum Automations Mobile Acceptance — CURRENT

Date: 2026-08-21

## Scope

This is the durable frontend handoff for PR #123, `Fix Automations mobile acceptance layout`.

This pass is limited to responsive/mobile acceptance correction on the existing `/lab/automations/` experience. It does not start `/lab/email/`, reconciliation UI, real-provider UI, Authority UI, Check In integration, AI/Planner work, Organizations/Groups backend integration, a new Automations page, or React migration.

Base: `First-Repo` `main` at `4a3e7c83c39462704b436295a8d6f7ede44ef3b9`, the merged PR #121 state.

Branch: `agent/lab-automations-mobile-acceptance-fix`

PR: #123

Final implementation/acceptance-code SHA before this documentation-only handoff commit: `712381f0781e24b12c0295fef9feda0b7112ea18`

## Real-device defect

A Samsung/Chrome acceptance screenshot showed the large mobile create control physically covering the `Automation workspace` heading.

Source review confirmed the structural cause:

- the mobile hero still used a competing two-column `1fr auto` layout;
- at the narrowest breakpoint, the create action was reduced to a 42px icon-only `+`;
- the title and create action therefore competed for the same narrow horizontal row;
- several surrounding dashboard groups were also close to accidental overflow at 360–430px widths.

This was treated as real acceptance evidence, not theoretical CSS cleanup.

## Responsive correction

The correction stays inside the existing late-loaded `assets/lab/lab-automations-operations-v7-polish.css` owner. No second styling system or duplicate mobile business logic was introduced.

The pass:

- reflows the phone workspace hero to one column;
- preserves the full `+ New automation` visual/semantic label;
- keeps the create control bounded and at least 44px touch-friendly;
- keeps the Continuum brand and theme control reachable in the top app header;
- collapses secondary status presentation to `LAB · OFF` on narrow screens while preserving the underlying accessible status text;
- turns Automations / Templates / Runs + PREVIEW into a bounded three-column mobile grid;
- keeps Search and Capabilities usable and stacks them only at the narrowest width;
- changes DRAFTS / READY TO TEST / NEEDS SETUP / RUNTIME LATER into a deliberate 2×2 phone grid;
- gives All / Ready / Needs setup / Runtime later plus Planner and Manage an intentional bounded mobile layout;
- keeps Drafts / Published / Archived inside a three-column segmented layout;
- removes fixed/min-width pressure from representative Automation cards;
- allows long Automation names, pills, metadata and workflow summaries to wrap cleanly;
- keeps card flow content inside its container;
- cache-busts the existing v7 polish stylesheet so a real phone does not retain the old responsive rules.

Desktop layout rules were not redesigned.

## Files changed in the implementation

- `assets/lab/lab-automations-operations-v7-polish.css`
- `lab/automations/index.html` — stylesheet cache-bust only
- `tests/continuum-automations-mobile-acceptance-probe.js`
- `tests/continuum-automations-operations-v7.test.js`
- `.github/workflows/automations-real-backend-validation.yml`

This handoff adds only:

- `docs/continuum-automations-mobile-acceptance-CURRENT.md`

No Automation transport/controller/backend-contract product JavaScript was changed in this pass.

## Acceptance viewports

The focused acceptance workflow is defined to render:

- desktop `1440 × 900`
- mobile `360 × 800`
- mobile `390 × 844`
- mobile `412 × 915`
- mobile `430 × 900`

## Browser assertions added

The test-only mobile acceptance probe uses rendered browser geometry and records pass/fail evidence in the dumped DOM. It checks:

- workspace heading exists and is visible;
- create/New Automation control exists and is visible;
- heading and create bounding rectangles do not intersect;
- body/document width stays within the viewport tolerance;
- top app-header controls do not overlap;
- primary Automations/Templates/Runs navigation stays visible and bounded;
- Search and Capabilities remain inside the viewport;
- four summary counters remain readable and use the expected phone arrangement;
- filters, Planner and Manage remain bounded/touchable;
- Drafts/Published/Archived remain bounded;
- representative Automation cards remain inside the viewport;
- representative long names/metadata/flow content do not create accidental horizontal overflow.

Existing desktop/mobile preservation assertions are not weakened.

## Product contracts preserved

This responsive pass does not change the accepted Automation model or backend semantics.

Preserved:

- LOCAL LAB vs SERVER-BACKED separation;
- Overview / Definition / Runs / Permissions / Related / History / Settings;
- `WHEN → IF → DO → WAIT → TEST`;
- deeper ordered workflow semantics;
- stable Automation identity;
- Draft persistence;
- `expected_revision` and stale-409 recovery;
- backend-authoritative preflight;
- Review / Publish;
- immutable AutomationVersion and ContentVersion references;
- Runtime Run creation/list/detail;
- fake Runtime behavior;
- Attempts, retryability truth and Why history;
- pending Run cancellation;
- unsupported controls remaining disabled;
- ContactMethod read errors not masquerading as empty email lists;
- structured backend validation remaining human-readable;
- non-409 Draft save failures remaining visibly failed;
- no false Saved state after failed writes;
- rapid edits during in-flight writes not being silently lost;
- preflight transport/auth/backend failures remaining `BACKEND PREFLIGHT · UNAVAILABLE` instead of fabricated blockers;
- Review/Publish remaining unavailable when authoritative preflight is unavailable;
- Runtime refresh failures not leaving stale Run data presented as current;
- late async responses not patching another Automation;
- deterministic `?new=1&from=lab` one-shot behavior;
- deterministic dynamic v10 chrome/bootstrap behavior.

No new API calls were invented.

## Validation evidence obtained

### Completed source evidence

On implementation commit `f528cca7b5e32a13893116468b9cd084c2100797`:

- `Continuum Automations Operations Validation` source-contract step completed successfully.
- The strengthened v7-v9 contract accepted the new responsive expectations.
- The earlier failure on that workflow was only a stale hardcoded stylesheet cache-version assertion; the assertion was updated to the new asset version and strengthened with mobile layout expectations rather than weakened.

On an earlier PR #123 implementation head, the `Continuum Automations Real Backend Integration Validation` `source-contracts` job completed successfully and covered:

- Automations server-backed integration source contract;
- direct-new/history smoke coverage;
- v10/v10.1 preservation;
- v5 model/flow/sequence/scenario parse checks;
- Directory server-proof and standalone Directory contracts;
- shared Continuum shell;
- `git diff --check`.

No accepted source assertion was removed to make this responsive pass succeed.

## Hosted CI infrastructure block

As of final handoff recording on 2026-08-21, GitHub-hosted browser CI has **not completed**.

Important distinction: this is not a reported layout assertion failure.

Observed state:

- older `Continuum Automations Operations Validation` run `32530155711`, head `f528cca7b5e32a13893116468b9cd084c2100797`, remains `in_progress` inside `Render desktop and mobile operating surfaces` after its source-contract step passed;
- its workflow had no job-level timeout on that older run, so the Chromium render became long-lived;
- current-head `Continuum Automations Real Backend Integration Validation` run `32530404654`, head `712381f0781e24b12c0295fef9feda0b7112ea18`, remains queued;
- current-head source and browser jobs are therefore not available as completed acceptance evidence yet;
- the focused current workflow now has bounded job timeouts, but queued jobs cannot prove geometry until a runner actually starts them.

A separate older `Continuum Mobile Layout Validation` attempt previously completed Directory geometry at `390 × 844` successfully, then timed out navigating to the Automations temporary page before Automations geometry assertions executed. That timeout was not an Automations overlap assertion failure.

## Current acceptance truth

Implementation correction: **DONE**

Heading/create structural overlap fix: **DONE IN CSS**

Focused rendered geometry assertions: **ADDED**

Completed hosted 360/390/412/430 geometry evidence: **NOT YET AVAILABLE — CI INFRASTRUCTURE BLOCKED**

Horizontal overflow acceptance on all required hosted viewports: **NOT YET PROVEN BY COMPLETED CURRENT-HEAD CI**

Ready to merge based on hosted acceptance evidence: **NO — wait for current-head browser CI to complete**

Ready for another real Samsung/Chrome acceptance pass: **NOT STAMPED YET**. The implementation is prepared for the pass, but the requested hosted browser acceptance evidence must complete first.

## Known remaining issues

No additional product/mobile defect has been proven after the responsive correction.

The remaining blocker is CI execution state, not a known Automation UI defect.

If current-head browser CI later reports a real rectangle/overflow failure, fix that implementation defect in this same PR. Do not weaken the geometry assertions.

## Backend boundary

The canonical backend API handbook remains in `jay-app`. Active backend reconciliation/Authority/API-handbook work is outside this responsive PR.

Do not modify frontend API behavior from this handoff. If future canonical backend documentation conflicts with the merged frontend contract, report the mismatch in a separately reviewed task.

## Stop boundary

PR #123 is the mobile acceptance/readiness cleanup only.

Do not start `/lab/email/` from this PR or this handoff. `/lab/email/` is the expected next product slice, but it requires a separate reviewed task.
