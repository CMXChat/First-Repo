# `/brief` Current Recovery and Simplification Status

Last updated: **August 5, 2026 at 2:18 PM ET**

## Read order

1. `docs/brief/CURRENT.md`
2. `docs/brief/IDEAS.md`
3. `docs/brief/PHASE-1-WORKLOG.md`
4. `docs/brief/DEMO-SIMPLIFICATION-STRATEGY.md`
5. `docs/brief-recovery-handoff.md` for legacy recovery only

## Live repository state

```text
Repository: CMXChat/First-Repo
Development branch: agent/brief-demo-v2
Development draft PR: #42
Adaptive staging publish PR: #44, merged
Adaptive staging merge commit: 52bdf372e438d298e9bed39f293baf0d98d52d0a
Staging route: https://db.cmxchat.com/brief-next/
Existing production route: https://db.cmxchat.com/brief/
Production /brief changed: no
Validated product revision: 1175826cafc71719e100b56a525f768b40fd7122
Development validation run: 31034883845
Staging PR validation run: 31035274638
```

The dark-default and adaptive Everything checkpoint is now merged into `main`. The existing GitHub Pages workflow is triggered by pushes to `main`, so the staging deployment was triggered by PR #44.

Source on `main` is verified. Direct custom-domain HTTP verification remains unavailable from the current assistant web environment, so browser review is the live confirmation step.

## Latest product decisions

### Dark first

- first visits begin in dark mode
- HTML begins dark to prevent a light flash
- the base uses black and charcoal instead of a blue page background
- blue remains an accent for intelligence, selection, links, and action
- a deliberately saved light preference remains respected
- reset does not reset the theme

### Focused views remain primary

The main navigation is now:

1. Today
2. Workspace
3. Spaces
4. How it works
5. Everything

Everything appears at the end and is optional.

### Everything full view

Everything provides one complete scrollable briefing with:

- executive overview
- weather and hourly conditions
- stats
- daily flow
- every Workspace category
- private and shared Space context
- adaptive briefing explanation
- future app and alarm concept
- privacy boundary
- links back to focused views
- links into specific Workspace tabs
- jump navigation through the long page

Focused views remain faster for normal daily use.

### Stable shell, adaptive composition

The demo explains that each interactive update can be composed after approved information is gathered and researched.

The AI may choose:

- charts for trends
- timelines for schedule and sequence
- comparisons for choices
- maps for location and routing
- alerts for risk and confirmation
- shared action lists for couples, families, teams, and projects

The guardrail is explicit: personalized does not mean unpredictable.

Navigation, privacy controls, source visibility, accessibility, and familiar locations remain stable while useful modules adapt to the content.

### Future app and alarm

The demo explains a possible app experience that:

- begins at a selected alarm time
- rotates approved music from a connected Spotify account
- uses saved preferences and daily context
- reads the executive overview
- continues into the interactive briefing
- includes snooze, skip, privacy, and provider controls

It is clearly labeled as a future concept requiring native permissions, provider rules, protected authentication, and tested fallbacks.

## Architecture

```text
brief-next/index.html
  stable product surfaces and asset loading

assets/brief-next/brief-demo-data.js
  five scenario records and daily demo content

assets/brief-next/brief-demo-experience.js
  Everything navigation extension, full-view rendering, adaptive composition, and app-alarm explanation

assets/brief-next/brief-demo-app.js
  sole owner of entry, scenario, view, tab, theme, URL, and global rendering state

assets/brief-next/brief-demo-media.js
  sole owner of preview audio and the Spotify provider player

assets/brief-next/brief-demo-explainers.js
  memory and People and Spaces examples

assets/brief-next/brief-demo.css
  core responsive design

assets/brief-next/brief-demo-explainers.css
  explainer components and heading hierarchy

assets/brief-next/brief-demo-experience.css
  black dark foundation, Everything view, adaptive modules, and five-button mobile navigation
```

`brief-demo-app.js` emits an explicit `briefdemo:scenariochange` lifecycle event. The Everything module listens and rerenders without owning global application state.

## Validation

### Development validation

```text
Validated product revision: 1175826cafc71719e100b56a525f768b40fd7122
Run: 31034883845
Static job: 92404364989, passed
Browser job: 92404365175, passed
```

### Clean staging PR validation

```text
PR: #44
Staging source commit: f5dfa90de43b149d98b18a4fbc3687f332baade1
Run: 31035274638
Static job: 92405680264, passed
Browser job: 92405680241, passed
Merged main commit: 52bdf372e438d298e9bed39f293baf0d98d52d0a
```

The suite confirms:

- dark is the first-visit default
- the dark background token is `#05070b`
- saved light preference persists
- reset preserves theme and restores soundtrack selection
- five desktop and mobile navigation buttons render
- Everything is the final navigation option
- Everything renders nine major sections
- jump navigation works structurally
- all Workspace categories appear
- specific full-view Workspace links open the correct focused tab
- scenario changes update Everything
- adaptive component and Spotify alarm explanations render
- weather, stats, focused views, Spaces, memory examples, media drawer, headings, and mobile overflow remain valid

The repository-wide privacy audit still reports the pre-existing `/doc` gate mismatch. It is unrelated to the six Brief Next files in PR #44.

## Automation status

The legacy `Refresh Brief Concept` automation remains paused.

Do not restart it until:

- staging is reviewed
- the data-editing contract is documented
- automation-editable files are selected
- tests protect those boundaries
- production `/brief/` cutover is approved

## Publishing distance

Completed:

- reversible staging architecture
- first-pass focused interface
- memory versus normal AI
- People and Spaces
- privacy explanation
- black dark-first theme
- optional full Everything view
- adaptive composition explanation
- future app and alarm explanation
- focused desktop/mobile validation
- adaptive staging publication

Remaining before replacing `/brief/`:

1. User review of the published full view on desktop and mobile.
2. Focused visual corrections.
3. Contrast, keyboard, focus, and accessibility review.
4. Common editing map and daily data contract.
5. Authorized preview audio and autoplay fallback.
6. Final cutover and rollback validation.

## Exact next action

1. Review `https://db.cmxchat.com/brief-next/` after the Pages deployment finishes.
2. Inspect Everything, the five-button mobile navigation, dark surfaces, repetition, and jump links.
3. Record specific corrections.
4. Begin the editing-map and accessibility checkpoint after visual review.
5. Keep `/brief/` untouched until explicit cutover approval.
