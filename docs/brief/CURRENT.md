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
Current staging route: https://db.cmxchat.com/brief-next/
Existing production route: https://db.cmxchat.com/brief/
Production /brief changed: no
Validated product revision: 1175826cafc71719e100b56a525f768b40fd7122
Validation run: 31034883845
```

The new adaptive full-view and dark-default slice is validated on the development branch and is ready for an isolated staging publish.

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

The demo now explains that each interactive update can be composed after approved information is gathered and researched.

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

The demo now explains a possible app experience that:

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

```text
Validated product revision: 1175826cafc71719e100b56a525f768b40fd7122
Workflow: Brief Next Validation
Run: 31034883845
Static job: 92404364989, passed
Browser job: 92404365175, passed
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

Remaining before replacing `/brief/`:

1. Publish this validated slice to staging.
2. User review of the full view on desktop and mobile.
3. Focused visual corrections.
4. Contrast, keyboard, focus, and accessibility review.
5. Common editing map and daily data contract.
6. Authorized preview audio and autoplay fallback.
7. Final cutover and rollback validation.

## Exact next action

1. Publish revision `1175826cafc71719e100b56a525f768b40fd7122` through a clean branch from `main`.
2. Keep `/brief/` untouched.
3. Review `https://db.cmxchat.com/brief-next/` after deployment.
4. Record feedback on Everything, dark surfaces, navigation density, and repetition.
5. Begin the editing-map and accessibility checkpoint after the visual review.
