# CMX Documentation Index

Last reconciled: **August 6, 2026**  
Repository: `CMXChat/First-Repo`  
Verified code baseline: `a537fa2aaefd0d25f3d507d9b0da7255ffa3c1ee`

## Read this first

Current code, tests, workflows, route policy, and current operational documents take priority over older notes. Dated concept documents remain useful as decision history, but they are not the present production contract unless a current document confirms them.

Use this order when starting Personal OS work:

1. `docs/2026-08-05-repository-reconciliation.md`
2. `docs/personal-os-release-safeguards.md`
3. `docs/brief-recovery-handoff.md`
4. `docs/cmx-brief-master-context.md`
5. `docs/brief-interface-validation.md`
6. `docs/brief-interface-failures.md`
7. Current source, tests, workflows, and `assets/cmx-routes.json`

## Current operational documents

| File | Status | Purpose |
|---|---|---|
| `README.md` | Current | Index and document authority rules. |
| `2026-08-05-repository-reconciliation.md` | Current | Comparison between the August 4 notes and the August 5 repository. |
| `personal-os-release-safeguards.md` | Current | Release gate, production smoke, accessibility, cache, parity, inventory, and documentation-freshness safeguards. |
| `brief-recovery-handoff.md` | Current | Safe continuity handoff for `/brief/`, `/brief-next/`, and `/doc/`. |
| `cmx-brief-master-context.md` | Current | Product, architecture, trust, and roadmap context. |
| `brief-interface-validation.md` | Current | Active validation contract for the shipping interface. |
| `brief-interface-failures.md` | Current | Resolved failures, remaining risks, and known constraints. |
| `concepts/brief-program-status-and-roadmap-2026-08-05.md` | Current dated snapshot | Program status and priorities after the August 5 rebuild. |

## Supporting standards

These files still contain useful implementation and review guidance. Compare their examples with the current `brief-demo-*` interface before applying them.

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

These documents preserve earlier decisions and product thinking. Keep their dates and assumptions visible.

| File | Status |
|---|---|
| `concepts/brief-goal-intelligence-concept-2026-08-04.md` | Historical concept. Goal Intelligence remains planned, not a connected backend feature. |
| `concepts/brief-goals-info-product-structure-2026-08-04.md` | Historical product structure. Compare with the focused views and Everything view. |
| `concepts/brief-program-status-and-roadmap-2026-08-04.md` | Superseded by the August 5 snapshot. |
| `concepts/brief-system-progress-roadmap-2026-08-04.md` | Historical implementation record. |
| `concepts/cmx-gates-system-ai-handoff-2026-08-04.md` | Historical gate and AI plan. `/doc/` is now intentionally ungated. |
| `crystal-briefing-blueprint.md` | Historical personalization blueprint. |
| `jay-crystal-news-briefing-blueprint.md` | Historical daily intelligence blueprint. |
| `news-product-polish-notes.md` | Historical news product notes. |
| `personalized-daily-intelligence-product-vision.md` | Long-term product vision. |
| `personalized-private-briefing-blueprint.md` | Historical private briefing blueprint. |

## Current route summary

- `/brief/`: public noindex Personal OS demo, light in the initial HTML, with manual dark mode retained.
- `/brief-next/`: public noindex staging and rollback copy. It currently remains byte-for-byte aligned with `/brief/`.
- `/doc/`: public noindex Personal OS product overview, light by default, without a password gate.
- Other routes retain their individual policy from `assets/cmx-routes.json`.

## Current Brief header and entry contract

- The live topbar contains the soundtrack and theme controls only.
- Product documentation remains available from the entry screen and the How it works view, not from the live header.
- Mobile safe-area spacing must keep topbar controls away from the browser edge.
- The theme control should remain visually prominent in light and dark mode.
- The scenario chooser is a labelled group of native toggle buttons using `aria-pressed`; do not restore `role="listitem"` on those buttons.
- Scenario descriptions and Today-view secondary weather text must remain WCAG AA compliant.

## Current quality rules

- visible Brief and Doc copy should be plain, direct, and free of generated-sounding filler
- vary sentence length and combine related thoughts instead of stacking short declarations that sound generated
- every briefing entry, reset, and context switch should return to Today
- the Today hero should lead users into the page without creating a mobile dead end
- workspace tabs must support keyboard navigation and correct ARIA state
- returning to the entry screen must restore focus predictably
- Spotify preparation must never block entry
- the final Open demo tap should request playback during the same user gesture
- the direct-tap Spotify fallback and honest provider-limit copy must remain available
- rendered-copy checks should protect user-facing wording, not only source strings
- `/brief/` and `/brief-next/` must remain aligned unless a staging difference is explicitly documented
- active Brief asset changes must carry a new cache-version query in both route files and any active import chain
- the demo and current-versus-planned product boundaries must remain visible
- the 59 unreferenced legacy Brief assets require a separate dependency and history review before deletion

## Required safeguards

Do not remove or weaken:

- `Personal OS Production Smoke`
- the Personal OS Release Gate
- Brief and Brief Next parity enforcement
- cache-version enforcement
- demo-versus-live boundary checks
- documentation freshness checks
- Spotify lifecycle tests
- desktop and mobile Chromium accessibility workflows
- active and legacy Brief asset inventory checks

## Documentation rules

- Record a verified commit SHA in every current operational document.
- Do not describe an open PR, branch, failure, or check result as current without rechecking GitHub.
- Do not rewrite dated concept files to hide earlier decisions. Add a new dated snapshot when needed.
- Treat static browser demos as demonstrations. They do not prove a backend, authentication layer, memory service, model connector, or live private data pipeline exists.
- Update this index whenever a current document is added, superseded, or archived.
