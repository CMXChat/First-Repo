# `/brief-next` Phase 1 Worklog

Last updated: **August 5, 2026 at 1:02 PM ET**

## Purpose

This file is the active implementation record for the reversible Personal OS briefing demo.

Read this file before editing `brief-next/` or `assets/brief-next/`. Update it after every meaningful code change, test run, branch change, product decision, or newly discovered blocker.

## Product standard

The target is **complex simplicity**.

A person who uses the product every day should continue noticing useful depth, movement, polish and intelligence. The interface should still feel calm enough that the person does not need to learn a complicated application before understanding their own day.

The simplified demo should retain:

- a strong weather and timing experience
- compact stats that change with the current Space
- clear movement between views instead of one forced long page
- a deeper workspace with one category visible at a time
- five use cases using the same stable interface
- private profiles and approved shared Spaces
- one soundtrack experience and one Spotify provider player
- a polished light and dark presentation
- enough visual character to feel worth revisiting

The simplified demo should remove from its architecture:

- command-line navigation
- terminal ownership of application state
- multiple competing navigation shells
- several depth systems controlling the same page
- duplicate Spotify embeds
- hidden duplicate dashboards for every scenario
- timeout chains required for correctness
- content that can only be edited by tracing dozens of runtime files

## Vision inherited from `/doc`

The `/doc` product overview establishes the following model:

1. The Daily Briefing is the visible daily experience.
2. Goals give the platform direction.
3. Spaces separate personal, relationship, family, business, team and project context.
4. Connections bring approved information from existing services.
5. Automations allow useful work to continue after the dashboard closes.
6. Memory preserves sources, preferences, corrections, decisions and outcomes.
7. Permissions determine what remains private, what can be shared and what actions require approval.
8. Personal OS can become a user-owned intelligence layer between the person, their information, their Spaces, connected services and chosen AI assistants.

The new demo should show that model through the product experience instead of reproducing the full `/doc` document inside the briefing.

## Branch and dependency

```text
Repository: CMXChat/First-Repo
Branch: agent/brief-demo-v2
Base branch: agent/brief-recovery-step-1
Baseline draft PR: #41
```

This is intentionally a stacked development branch while the restored baseline remains unmerged.

The current production `/brief` route has not been replaced or edited by this phase.

## Phase 1 delivery parts

### Part 1A: Editable data foundation

Status: **complete**

File:

```text
assets/brief-next/brief-demo-data.js
```

Responsibilities:

- all five scenario records
- visible copy
- weather and hourly conditions
- stats
- day flow
- workspace tabs and cards
- private and shared Space examples
- soundtrack metadata

The application should not require DOM edits when changing normal demo content.

### Part 1B: Reversible application shell

Status: **complete**

File:

```text
brief-next/index.html
```

Implemented surfaces:

- deliberate use-case entry
- optional soundtrack request
- sticky product header
- scenario switcher
- desktop navigation rail
- mobile navigation bar
- Today view
- large weather section
- compact stats grid
- recommendation and daily flow
- Workspace view
- Spaces view
- concise How it works view
- one media drawer
- one Spotify iframe

The terminal and command line are absent from the new page.

### Part 1C: Complex simplicity design system

Status: **complete for first pass**

File:

```text
assets/brief-next/brief-demo.css
```

Implemented:

- light-first Personal OS visual language derived from `/doc`
- dark theme
- responsive desktop, tablet and mobile layouts
- large useful weather visualization
- compact data cards
- selective navigation
- mobile bottom navigation
- bounded media drawer
- reduced-motion support

Still requiring review:

- real-device short-height behavior
- color contrast measurements
- final density and typography adjustments
- whether any section feels too empty or too dense during repeated use

### Part 1D: One application state owner

Status: **complete for first pass**

File:

```text
assets/brief-next/brief-demo-app.js
```

The application controller owns:

- entry state
- selected scenario
- selected primary view
- selected workspace tab
- theme
- URL state
- rendering

There are no timeout or polling chains in this controller.

### Part 1E: One media owner

Status: **foundation complete**

File:

```text
assets/brief-next/brief-demo-media.js
```

Implemented:

- one media state
- one preview audio position in the architecture
- one Spotify iframe
- idempotent scenario changes
- direct soundtrack request from the user’s Open demo click
- explicit status messages when no authorized preview exists

Not completed in Phase 1:

- authorized preview URLs
- verified audible entry playback
- browser-specific autoplay fallback testing
- Spotify iFrame API integration
- provider playback controls beyond the embed

Those belong to the dedicated media phase after the new product shell is stable.

### Part 1F: Isolated tests

Status: **created, CI result pending**

Files:

```text
tests/brief-next-smoke.test.js
tests/brief-next.spec.cjs
tests/brief-next.playwright.config.cjs
.github/workflows/brief-next-validation.yml
```

The tests verify:

- the page has one stylesheet and three product scripts
- no terminal or command-line architecture exists
- all five scenarios are editable data records
- every scenario has weather, stats, tabs, Spaces and one soundtrack
- JavaScript syntax parses
- desktop entry and navigation
- weather and stats rendering
- scenario switching
- workspace tabs
- Spaces
- one Spotify iframe
- mobile navigation
- horizontal overflow
- theme switching
- reversible reset

### Part 1G: Route registration and review

Status: **route registered, PR and CI pending**

Route:

```text
/brief-next/
```

Registry status:

```text
Experimental
Direct-link-only
Noindex
Not gated
```

The route remains separate from `/brief` until review and explicit cutover approval.

## Current file ownership

```text
brief-next/index.html
  semantic structure and stable product surfaces

assets/brief-next/brief-demo-data.js
  content and scenario records

assets/brief-next/brief-demo-app.js
  state, rendering, navigation and URL behavior

assets/brief-next/brief-demo-media.js
  preview audio, Spotify provider player and media drawer

assets/brief-next/brief-demo.css
  complete visual and responsive system
```

No other runtime module should quietly take ownership of these concerns.

## Remaining Phase 1 sequence

### Checkpoint 1: Open isolated draft PR

- base it on `agent/brief-recovery-step-1`
- clearly identify it as stacked and reversible
- keep `/brief` untouched
- trigger the isolated validation workflow

### Checkpoint 2: Inspect static and browser validation

- record workflow and job IDs
- fix only issues inside the new architecture
- do not import legacy terminal, overlay or depth systems to satisfy old tests
- update this file and `CURRENT.md`

### Checkpoint 3: Visual and product review

Review the route as a returning daily user:

- Does the Today view feel valuable without scrolling through documentation?
- Is the weather section useful and visually strong?
- Do the stats create orientation without looking like decorative KPI filler?
- Is navigation faster than scrolling?
- Does each Space feel materially different while the interface remains stable?
- Is the workspace deep enough without becoming another full dashboard?
- Does the How it works view explain the `/doc` vision without becoming a document?

### Checkpoint 4: Phase 1 closeout

- resolve focused test failures
- record screenshots or visual findings
- document the editing map
- identify what moves into content consolidation, media and polish phases
- keep the route experimental until explicit approval

## Rules for future contexts

1. Read `docs/brief/CURRENT.md` first.
2. Read this worklog before editing the new demo.
3. Keep each commit narrowly scoped.
4. Update the worklog after each meaningful checkpoint.
5. Do not edit production `/brief` during Phase 1.
6. Do not add a terminal or command-line layer to `brief-next`.
7. Do not create a second app state owner.
8. Do not add more Spotify iframes.
9. Keep normal copy and scenario changes inside the data file.
10. Treat the old implementation as reference material, not an architecture requirement.

## Current exact next action

1. Open the stacked draft PR for `agent/brief-demo-v2`.
2. Inspect the new Brief Next validation workflow.
3. Record the exact pass, fail and blocker state.
4. Fix the first focused issue if one is found.
5. Update this worklog and `docs/brief/CURRENT.md` before expanding the implementation.
