# CMX Documentation Index

Last reconciled: **August 5, 2026**  
Repository: `CMXChat/First-Repo`  
Verified code baseline: `5c7eef899f3357854492e2d3918f5915eb536b6b`

## Read this first

The repository changed substantially on August 5. Current code and route policy take priority over older notes. Dated concept documents remain useful as decision history, but they must not be treated as the present production contract unless a current document confirms them.

Use this order when starting work:

1. `docs/2026-08-05-repository-reconciliation.md`
2. `docs/brief-recovery-handoff.md`
3. `docs/cmx-brief-master-context.md`
4. `docs/brief-interface-validation.md`
5. Current source, tests, workflows, and `assets/cmx-routes.json`

## Current operational documents

| File | Status | Purpose |
|---|---|---|
| `README.md` | Current | Index and document authority rules. |
| `2026-08-05-repository-reconciliation.md` | Current | Full comparison between the August 4 notes and the August 5 repository. |
| `brief-recovery-handoff.md` | Current | Safe continuity handoff for `/brief`, `/brief-next`, and `/doc`. |
| `cmx-brief-master-context.md` | Current | Product, architecture, trust, and roadmap context. |
| `brief-interface-validation.md` | Current | Active validation contract for the shipping interface. |
| `brief-interface-failures.md` | Current | Resolved failures, remaining risks, and known constraints. |
| `concepts/brief-program-status-and-roadmap-2026-08-05.md` | Current dated snapshot | Program status and next priorities after the August 5 rebuild. |

## Supporting standards

These files still contain useful implementation and review guidance. Read the current reconciliation first because some examples and asset names describe the previous modular interface.

| File | Review status |
|---|---|
| `brief-daily-maintenance.md` | Supporting standard. Daily content remains repository-driven. |
| `brief-device-compatibility.md` | Supporting standard. Current product uses the `brief-demo-*` interface. |
| `brief-finalization-standard.md` | Supporting standard. Recheck selectors and workflows before reuse. |
| `brief-navigation-standard.md` | Supporting standard. Current navigation is rendered by the demo application. |
| `brief-onboarding-browser-validation.md` | Historical validation reference. The current entry screen is scenario-card based. |
| `brief-onboarding-standard.md` | Historical interaction reference. Do not assume the old guided-tour runtime still ships. |
| `brief-performance-safety.md` | Supporting standard. Apply its principles to the current assets. |
| `brief-static-validation.md` | Historical test reference. Current smoke files and workflows are authoritative. |
| `briefing-design-standard.md` | Supporting design reference. Current plain-language, light-first behavior wins when examples conflict. |

## Historical product and concept records

These documents preserve decisions and product thinking. Their dates and original assumptions should remain visible.

| File | Status |
|---|---|
| `concepts/brief-goal-intelligence-concept-2026-08-04.md` | Historical concept. Goal Intelligence is still planned, not a connected backend feature. |
| `concepts/brief-goals-info-product-structure-2026-08-04.md` | Historical product structure. Compare with the current focused views and Everything view. |
| `concepts/brief-program-status-and-roadmap-2026-08-04.md` | Superseded by the August 5 snapshot. |
| `concepts/brief-system-progress-roadmap-2026-08-04.md` | Historical implementation record. |
| `concepts/cmx-gates-system-ai-handoff-2026-08-04.md` | Historical gate and AI plan. `/doc` is now intentionally ungated. |
| `crystal-briefing-blueprint.md` | Historical personalization blueprint. |
| `jay-crystal-news-briefing-blueprint.md` | Historical daily intelligence blueprint. |
| `news-product-polish-notes.md` | Historical news product notes. |
| `personalized-daily-intelligence-product-vision.md` | Long-term product vision. |
| `personalized-private-briefing-blueprint.md` | Historical private briefing blueprint. |

## Current route summary

- `/brief/`: public noindex Personal OS demonstration, light from the initial HTML, manual dark mode retained.
- `/brief-next/`: public noindex standalone staging and rollback copy. It currently shares the same HTML blob and assets as `/brief/`.
- `/doc/`: public noindex Personal OS product overview, light by default, no password gate.
- Other routes keep their individual route policy from `assets/cmx-routes.json`.

## Current quality rules

The August 5 interface pass also established these current expectations:

- visible Brief and Doc copy should be plain, direct, and free of generated-sounding filler
- workspace tabs must support keyboard navigation and correct ARIA state
- returning to the entry screen must restore focus predictably
- Spotify fallback must remain usable when the provider controller fails
- rendered-copy checks should protect the user-facing wording, not only source strings
- `/brief/` and `/brief-next/` should remain aligned unless a staging difference is documented

## Documentation rules

- Record the verified commit SHA in every current operational document.
- Do not describe an open PR, branch, or failure as current without rechecking GitHub.
- Do not rewrite dated concept files to hide earlier decisions. Add a new dated snapshot instead.
- Treat static browser demos as demonstrations. They do not prove a backend, authentication layer, memory service, model connector, or live data pipeline exists.
- Update this index whenever a current document is added, superseded, or archived.
