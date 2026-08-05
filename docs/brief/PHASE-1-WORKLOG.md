# `/brief-next` Phase 1 Worklog

Last updated: **August 5, 2026 at 1:24 PM ET**

## Purpose

This is the active implementation record for the reversible Personal OS briefing demo.

Read this file before editing `brief-next/` or `assets/brief-next/`. Update it after every meaningful code change, test run, branch change, product decision, or newly discovered blocker.

## Current checkpoint

```text
Repository: CMXChat/First-Repo
Branch: agent/brief-demo-v2
Draft PR: #42
PR base: agent/brief-recovery-step-1
Route: /brief-next/
Validated product head: 831eb8cba420517e1f6eaf44cb778a6ed3f3eb5d
Production /brief changed: no
```

Phase 1 foundation is implemented and its isolated static and desktop/mobile browser suite passes.

The route remains Experimental and Direct-link-only. It is not approved for production cutover.

## Product standard

The target is **complex simplicity**.

A person who returns every day should continue noticing useful depth, movement, polish and intelligence. The interface should remain calm enough that the person understands their day before they need to understand the product.

### Retain

- strong weather and timing
- compact stats that change by Space
- view navigation instead of one endless scroll
- one deeper category at a time
- five use cases in one stable layout
- private profiles and approved shared Spaces
- one soundtrack experience
- one Spotify provider player
- light and dark themes
- enough visual character for repeated use

### Exclude

- terminal and command-line navigation
- multiple application state owners
- competing depth systems
- duplicate provider embeds
- hidden duplicate dashboards
- correctness based on timeout chains
- content spread across dozens of runtime files

## Vision inherited from `/doc`

The new route implements the following product model:

1. The Daily Briefing is the visible daily experience.
2. Goals give the system direction.
3. Spaces separate personal, relationship, family, business, team and project contexts.
4. Connections bring approved information from existing services.
5. Automations allow useful work to continue after the interface closes.
6. Memory preserves sources, preferences, corrections, decisions and outcomes.
7. Permissions control privacy, sharing and approved action.
8. Personal OS can become a user-owned intelligence layer between the person, their information, their Spaces, connected services and chosen assistants.

The demo shows this model through the application. It does not reproduce the full `/doc` document on the daily path.

## Ownership model

```text
brief-next/index.html
  stable semantic product surfaces

assets/brief-next/brief-demo-data.js
  all normal copy and scenario records

assets/brief-next/brief-demo-app.js
  entry, scenario, view, tab, theme, URL and rendering state

assets/brief-next/brief-demo-media.js
  preview audio, Spotify provider player and media drawer

assets/brief-next/brief-demo.css
  complete responsive visual system
```

No second controller should take ownership of these concerns.

## Completed delivery parts

### Part 1A: Editable data foundation

Status: **complete**

`assets/brief-next/brief-demo-data.js` contains:

- Personal
- Relationship
- Business partners
- Trainer and student
- Team and project
- greetings and main briefing copy
- next actions and recommendations
- weather and hourly conditions
- four compact stats per scenario
- daily flow
- workspace categories and detail cards
- private and shared Space examples
- soundtrack metadata

Normal content changes should occur here without DOM editing.

### Part 1B: Reversible application shell

Status: **complete**

`brief-next/index.html` contains:

- deliberate context entry
- optional soundtrack request
- sticky header
- scenario switcher
- desktop rail navigation
- mobile bottom navigation
- Today
- Workspace
- Spaces
- How it works
- one media drawer
- one Spotify iframe

The terminal and command line are absent.

### Part 1C: Complex simplicity design system

Status: **first pass complete**

`assets/brief-next/brief-demo.css` contains:

- light-first Personal OS design derived from `/doc`
- dark theme
- large weather visualization
- compact stat cards
- selective workspace navigation
- private and shared Space presentation
- desktop, tablet and mobile layouts
- bounded media drawer
- reduced-motion support

Remaining review topics:

- short-height laptop behavior
- real phone browser chrome and safe areas
- measured contrast
- returning-user density
- final typography and spacing

### Part 1D: One application state owner

Status: **complete**

`assets/brief-next/brief-demo-app.js` owns:

- entry
- scenario
- primary view
- workspace tab
- theme
- URL state
- rendering

It does not use polling or timeout chains for correctness.

### Part 1E: One media owner

Status: **foundation complete**

`assets/brief-next/brief-demo-media.js` provides:

- one media state
- one preview audio position
- one Spotify iframe
- idempotent scenario changes
- direct soundtrack request from the Open demo click
- explicit fallback messages

Deferred to the media phase:

- authorized preview URLs
- audible entry playback verification
- browser-specific autoplay fallback
- Spotify iFrame API evaluation and implementation
- provider control testing

### Part 1F: Route registration

Status: **complete**

`assets/cmx-routes.json` registers:

```text
/brief-next/
Status: Experimental
Visibility: Direct-link-only
Gated: false
Indexing: noindex in the page
```

### Part 1G: Isolated validation

Status: **passing**

Files:

```text
tests/brief-next-smoke.test.js
tests/brief-next.spec.cjs
tests/brief-next.playwright.config.cjs
.github/workflows/brief-next-validation.yml
```

#### Run 1

```text
Run: 31029391744
Static job: 92385927993, passed
Browser job: 92385927946, failed
```

The browser failure was caused by test project scoping. Desktop cases were also run on mobile, and the mobile case was also run on desktop. Three correctly matched product tests passed.

Correction:

```text
55665ec0f11fefeab356aa059fb95a25eed648a4
brief next: scope browser checks by viewport project
```

#### Run 2

```text
Run: 31029568262
Static job: 92386527858, passed
Browser job: 92386527581, passed
```

#### Final scoped run

Workflow triggers were limited to product, route, test and workflow changes. Documentation-only updates no longer rerun Chromium.

```text
Validated product head: 831eb8cba420517e1f6eaf44cb778a6ed3f3eb5d
Run: 31029738516
Static job: 92387097510, passed
Browser job: 92387097462, passed
```

Verified behavior:

- JavaScript syntax parses
- five scenarios remain editable records
- no terminal architecture exists
- one stylesheet and three product scripts load
- one Spotify iframe exists
- desktop entry and navigation work
- weather, stats and flow render
- scenario switching works
- workspace tabs work
- Spaces render
- mobile navigation works
- tested mobile width has no horizontal overflow
- theme switching works
- reset returns to the entry state

## Commit map

```text
dd375d784062218f5a35b90910d43d0832496f76  editable scenario data
730924efce5ddeefd90131cb9136ea4c26c4849f  reversible demo shell
737d656dab618379cae746f8279156b60a7e50e4  visual design system
7564e32833b8e37d94bd2fc7f950f31e216b415d  single media controller
c9fc65ac3dbbaa9d2569187c052039d19df8af78  single app controller
94f58b6efb7c60162921463495c15be5618cf150  idempotent media scenario updates
e79ed9c19d839f3bf306fcf7d7cc5a754c00fd23  route registration
66c2ab7f224547b4fd6e1f545d4aeeb6ad705096  static smoke test
2e62993366a11ff9c681b5055adb257599dd706e  browser configuration
75b1d0f39d8ab5e157e0687360e37cf65377a2c4  browser interaction tests
3d654a882fd944885abc7bcdbdbccb60aa992d32  isolated workflow
55665ec0f11fefeab356aa059fb95a25eed648a4  viewport project test correction
831eb8cba420517e1f6eaf44cb778a6ed3f3eb5d  product-scoped workflow triggers
```

## Next Phase 1 part: Product Review and Refinement

This is the next implementation checkpoint.

### Review surfaces

Test the route at:

- 1440 × 1000 desktop
- short-height laptop
- tablet portrait and landscape
- 390 × 844 phone
- narrower phone width

### Product questions

- Does Today feel useful before any explanation?
- Is weather strong and informative without dominating every context?
- Do stats orient the user without becoming decorative KPI filler?
- Is movement between views faster than scrolling?
- Do all five scenarios feel meaningfully different?
- Does the workspace offer enough depth without becoming another overloaded dashboard?
- Do Spaces communicate privacy and collaboration clearly?
- Does How it works explain the `/doc` vision briefly?
- Would a returning daily user know where to look first?

### Refinement outputs

- density and hierarchy fixes
- typography and contrast fixes
- short-height and mobile-safe behavior
- better active-view and transition feedback where useful
- an editing map for common copy, data and layout changes
- a documented decision about what remains for content consolidation, media and polish phases

## Rules for future contexts

1. Read `docs/brief/CURRENT.md` first.
2. Read this worklog before editing Brief Next.
3. Keep commits narrowly scoped.
4. Update both files after meaningful checkpoints.
5. Keep production `/brief` untouched during Phase 1.
6. Do not add terminal or command-line ownership.
7. Do not create another app or media state owner.
8. Do not add another Spotify iframe.
9. Keep normal content in `brief-demo-data.js`.
10. Treat legacy code as reference material, not an architecture requirement.
11. Do not begin final autoplay or cutover until product review is complete.

## Exact next action

Inspect the rendered `/brief-next/` route visually and begin the first focused refinement commit. Start with daily-use hierarchy, weather and stats density, then verify short-height and phone behavior before expanding scope.
