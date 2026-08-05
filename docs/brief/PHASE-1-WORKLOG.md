# `/brief-next` Phase 1 Worklog

Last updated: **August 5, 2026 at 1:46 PM ET**

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
Validated product revision: 5e02ff8caafd160e3802b0caaca6802ad672038a
Production /brief changed: no
```

The Phase 1 foundation and the first memory, People and Spaces, privacy, soundtrack-default, and mobile-hierarchy refinement are implemented and passing isolated validation.

The route remains Experimental and Direct-link-only. It is not approved for production cutover.

## Product standard

The target is **complex simplicity**.

A returning user should notice useful depth, movement, polish, and intelligence without needing to learn a complicated application first.

### Retain

- strong weather and timing
- compact stats that change by Space
- view navigation instead of one endless scroll
- one deeper category at a time
- five main use cases in one stable layout
- private profiles and approved shared Spaces
- reviewable memory and corrections
- one soundtrack experience
- one Spotify provider player
- light and dark themes
- enough visual character for repeated use

### Exclude

- terminal and command-line navigation
- consumer-social friends-list behavior during the current phase
- multiple application state owners
- competing depth systems
- duplicate provider embeds
- hidden duplicate dashboards
- correctness based on timeout chains
- content spread across dozens of runtime files

## Vision inherited from `/doc`

The route implements this model:

1. The Daily Briefing is the visible daily experience.
2. Goals give the system direction.
3. Spaces separate personal, relationship, family, business, team, and project context.
4. Connections bring approved information from existing services.
5. Automations allow useful work to continue after the interface closes.
6. Memory preserves sources, preferences, corrections, decisions, and outcomes.
7. Permissions control privacy, sharing, and approved action.
8. Personal OS can become a user-owned intelligence layer between the person, their information, their Spaces, connected services, and chosen assistants.

The application demonstrates this model without reproducing the full product document on the daily path.

## Ownership model

```text
brief-next/index.html
  stable product surfaces and asset loading

assets/brief-next/brief-demo-data.js
  five main scenarios and daily demo content

assets/brief-next/brief-demo-app.js
  sole owner of entry, scenario, primary view, tab, theme, URL, and global rendering state

assets/brief-next/brief-demo-media.js
  sole owner of preview audio, entry playback request, Spotify iframe, and media drawer

assets/brief-next/brief-demo-explainers.js
  local reusable memory and People and Spaces explanation schema and interaction

assets/brief-next/brief-demo.css
  core responsive visual system

assets/brief-next/brief-demo-explainers.css
  isolated explanation components and mobile hierarchy overrides
```

The explainer module has local component state only. It does not become a second application controller.

## Completed delivery parts

### Part 1A: Editable scenario foundation

Status: **complete**

`brief-demo-data.js` contains:

- Personal
- Relationship
- Business partners
- Trainer and student
- Team and project
- greetings and main briefing copy
- weather and hourly conditions
- four compact stats per scenario
- next actions and recommendations
- daily flow
- workspace categories and cards
- private and shared Space records
- soundtrack metadata

Normal daily demo content changes should happen here.

### Part 1B: Reversible application shell

Status: **complete**

Implemented surfaces:

- deliberate context entry
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

### Part 1C: Complex-simplicity design system

Status: **first pass complete**

Implemented:

- light-first platform design derived from `/doc`
- dark theme
- strong weather visualization
- compact stats
- selective navigation
- private and shared Space presentation
- desktop, tablet, and mobile layouts
- reduced-motion support
- smaller mobile entry and hero headings

Still requiring review:

- short-height laptop behavior
- real browser safe areas
- measured contrast
- keyboard and focus review beyond existing smoke coverage
- returning-user density
- final typography and spacing

### Part 1D: One application state owner

Status: **complete**

`brief-demo-app.js` owns:

- entry
- scenario
- primary view
- workspace tab
- theme
- URL state
- global rendering

It does not use polling or timeout chains for correctness.

### Part 1E: One media owner

Status: **foundation complete**

Implemented:

- one media state
- one preview-audio position
- one Spotify iframe
- idempotent scenario changes
- direct soundtrack request from the Open demo click
- soundtrack selected by default
- soundtrack default restored after reset
- explicit fallback messages

Deferred:

- authorized preview URLs
- audible entry playback verification
- browser-specific autoplay fallback
- Spotify iFrame API evaluation
- provider control testing

Read-aloud remains absent from the entry path.

### Part 1F: Memory and regular-AI comparison

Status: **first pass complete**

The How it works view now includes reusable interactive examples for:

- continuity
- corrections
- outcomes
- preferences

The Personal OS side demonstrates:

- source
- confirmation state
- Space scope
- reviewability
- history
- replacement of weaker inferences
- outcome-driven plan updates
- user-owned media and presentation preferences

### Part 1G: People and Spaces examples

Status: **first pass complete**

Implemented interactive examples:

- Relationship Space
- Family Space
- Team Space

Family Space demonstrates:

- expenses and bills
- chores and ownership
- pickups and appointments
- groceries and calendar changes
- a shared household briefing
- separate parent-private and member-private context

Decision:

- do not add a friends list during the current frontend phase
- use People and Spaces with explicit roles and permissions
- keep Family as an explanatory example for now, not a sixth main scenario

### Part 1H: Data beyond the dashboard

Status: **first pass complete**

The demo now explains that approved context can become:

- Brief
- Alarm
- Plan
- Coordinate
- Prepare
- Automate
- Learn
- Act

Real integrations and actions remain future work.

### Part 1I: Privacy explanation

Status: **first pass complete**

The demo now communicates:

- private first
- purpose-scoped access
- reviewable permissions
- pause and revocation
- logging and review
- confirmation before consequential action
- frontend demonstration versus server-side protection

### Part 1J: Route and automation boundaries

Status: **complete**

```text
/brief-next/
Status: Experimental
Visibility: Direct-link-only
Indexing: noindex
Production /brief: untouched
```

The legacy `Refresh Brief Concept` daily automation is paused.

Do not restart it until the final data-editing contract is documented and the production frontend is approved.

## Draft review

Reviewed open PRs and retained ideas selectively.

### Carry forward

- PR #27: interactive walkthrough missions, direct content landing, selective navigation
- PR #37: progressive disclosure, concise Full-first richness, terminal removal, internal scrolling safety
- PR #35: test-environment lessons
- PR #38: concise `/doc` connection and gate-audit lesson

### Do not carry forward

- terminal repair as a product requirement
- multiple depth controllers
- overlapping overlays and stranded blur state
- hidden duplicate dashboards
- old architecture only because legacy tests expected it

Grok `/tmp` material remains inaccessible and is not a durable source.

## Validation history

### Foundation validation

```text
Run: 31029738516
Static job: 92387097510, passed
Browser job: 92387097462, passed
Validated product revision: 831eb8cba420517e1f6eaf44cb778a6ed3f3eb5d
```

### Memory and Spaces refinement

Product revision:

```text
5e02ff8caafd160e3802b0caaca6802ad672038a
```

Initial workflow attempt:

```text
Run: 31030913507
Static job: 92391159461, passed
Browser job: 92391159797
Browser test step: passed
Overall initial job: cancelled after documentation moved the PR head
```

Clean rerun:

```text
Static job: 92391543795, passed
Browser job: 92391542885, passed
```

Verified behavior:

- JavaScript parses
- five main scenarios remain editable records
- no terminal architecture exists
- one Spotify iframe exists
- soundtrack is checked by default
- read-aloud is absent
- reset restores soundtrack default
- desktop entry and navigation work
- weather, stats, flow, scenarios, workspace tabs, and Spaces work
- memory comparison interaction works
- Family Space interaction works
- privacy and eight outcome examples render
- mobile navigation works
- tested mobile width has no horizontal overflow
- mobile entry and hero headings remain below the test limit
- theme and reset work

## Important commits in the current refinement

```text
a53580341d76615a439563d3df2f2c95c1845c7a  add ideas register
06933dcfc4e2fe5b7f77d638b91b5dfb1f91ac5d  add memory and Spaces explainer module
c7478da66a1825773cfec9e88ff0ddae2c4a6539  style explainers and mobile hierarchy
9095e60ba9326770791fafe2eebc7189c9c95a10  load explainers and default soundtrack
51bdccb41594e15a41bc75417e60c4907d183b3a  static explainer and soundtrack tests
5e02ff8caafd160e3802b0caaca6802ad672038a  browser tests for memory, Family, and mobile hierarchy
```

## Publishing distance

Completed:

- architecture
- reversible route
- core daily interface
- five scenarios
- first-pass memory difference
- first-pass People and Spaces story
- first-pass privacy story
- mobile heading correction
- isolated static and browser validation

Remaining before cutover review:

1. Product and visual review across additional viewport shapes.
2. Contrast, focus, and accessibility measurement.
3. Common editing map and data-update contract.
4. Authorized preview audio and autoplay fallback.
5. Final content and media review.
6. Route replacement and rollback rehearsal.

The current practical estimate is **three major checkpoints before cutover review**, then the cutover checkpoint itself.

## Next checkpoint: Product Review and Editing Map

### Review surfaces

- 1440 × 1000 desktop
- short-height laptop
- tablet portrait
- tablet landscape
- 390 × 844 phone
- narrower phone width

### Review questions

- Does Today feel valuable before any product explanation?
- Is weather strong without overwhelming the selected Space?
- Do stats orient the user without looking decorative?
- Is moving among Today, Workspace, Spaces, and How faster than scrolling?
- Are memory and Space examples understandable without reading `/doc`?
- Does the Family example prove useful shared context without implying surveillance?
- Does the interface look like a platform instead of an advertisement?
- Would a returning daily user know where to look first?

### Required outputs

- visual findings
- focused hierarchy and density corrections
- measured contrast findings
- keyboard and focus findings
- an editing map for scenarios, weather, stats, Spaces, explainer examples, media, and layout
- explicit remaining work for media and cutover

## Rules for future contexts

1. Read `docs/brief/CURRENT.md` first.
2. Read `docs/brief/IDEAS.md` before making product decisions.
3. Read this worklog before editing Brief Next.
4. Keep commits narrowly scoped.
5. Update all three files after meaningful checkpoints.
6. Keep production `/brief` untouched until cutover approval.
7. Do not add terminal or command-line ownership.
8. Do not create another global app or media state owner.
9. Do not add another Spotify iframe.
10. Keep main scenario content in `brief-demo-data.js`.
11. Keep explanatory examples in the reusable explainer schema.
12. Mark completed ideas explicitly.
13. Do not restart daily automation yet.

## Exact next action

Begin the Product Review and Editing Map checkpoint. Start with the new memory and People and Spaces sections, mobile platform hierarchy, and short-height behavior. Keep the scope visual and structural. Do not begin production cutover or final media integration yet.
