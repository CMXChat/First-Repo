# `/brief` Reversible Demo Simplification Strategy

Last updated: **August 5, 2026 at 12:50 PM ET**

## Product direction

`/brief` should become a focused, editable demonstration of what the product can become.

The goal is no longer to preserve every current interaction on the main user path. The goal is to show the strongest product idea clearly, make the code easy to revise, make media behavior honest and reliable, and keep the existing work recoverable while a simpler version is built.

This direction was explicitly approved for planning on August 5, 2026.

## Non-negotiable outcomes

The simplified demo must be:

- reversible during development
- easy to edit without tracing dozens of files
- understandable within the first minute
- usable on desktop and mobile
- honest about fictional, public, disconnected, and connected data
- able to demonstrate all five use cases without rendering all five at once
- reliable when music autoplay is requested
- limited to one primary Spotify player
- free from competing state controllers and timeout-dependent initialization
- documented after every meaningful checkpoint

## Current assessment

The current page contains valuable product thinking, but it asks the browser and the visitor to process too many layers at once.

### Architecture load

The visible loader chain currently includes approximately:

- 4 stylesheets loaded directly by `brief/index.html`
- 12 scripts loaded directly by `brief/index.html`
- 12 additional stylesheets loaded by `brief-config.js`
- 18 additional scripts loaded by `brief-config.js`
- 2 additional stylesheets and 1 additional script loaded by `brief-lite-ui.js`

That is roughly 49 CSS and JavaScript resources from the visible loader chain before counting any further provider assets or nested behavior.

The page also contains multiple overlapping application layers:

- the original long-form page in `brief/index.html`
- the core application in `brief-core.js`
- the injected workspace in `brief-workspace.js`
- the larger navigation and operating shell in `brief-system.js`
- onboarding, entry, device, upgrade, live, daily, experience, terminal, relationship, team, polish, and overlay layers

Several layers own or modify the same concepts:

- selected profile
- entry state
- scroll position
- quick versus full depth
- workspace tab
- URL state
- navigation state
- music state

This is the main source of fragility. Fixing each symptom without reducing ownership would preserve the underlying problem.

### User experience load

The current page tries to demonstrate all of these in one visit:

- entry preferences
- five user profiles
- weather
- music previews
- Spotify embeds
- scenario switching
- priorities
- schedule
- daily rhythm
- memory education
- capability filtering
- AI comparison
- backend architecture
- private and shared spaces
- connection status
- explain mode
- focus, workspace, and full modes
- terminal navigation
- library articles
- onboarding and tours

The content is strong, but the primary path no longer has a clear center. The visitor must learn the interface before understanding the product.

### Media load

Music behavior currently spans:

- an entry checkbox
- preview audio created by `brief-core.js`
- an audio control in the header
- a second preview control inside the music section
- a featured Spotify iframe
- recommendation cards that replace the iframe
- additional Spotify iframes created by `brief-daily.js`
- narration that can lower the preview volume

The entry controller also delays opening through timers. This weakens the direct relationship between the user click and the browser audio playback request.

Spotify embeds should remain a provider playback demonstration. They should not be treated as a guaranteed autoplay engine.

## Target product story

The simplified demo should answer one question:

> What would it feel like if a private system prepared the useful context for your day before you asked?

The visitor should understand that answer through one short journey.

## Target user journey

### 1. Choose a demonstration

Show the five use cases as clear choices:

- Personal
- Relationship
- Business partners
- Trainer and student
- Team and project

Personal can be the visual default, but the visitor must make a deliberate selection before entering if the gate remains.

Entry should contain no more than:

- use-case choice
- optional Start soundtrack toggle
- Open demo button

Narration should be removed from the default entry path until audio behavior is stable. It can return later as an accessibility or guided-demo feature.

### 2. Show the useful day immediately

After entry, show one concise operating screen containing:

- greeting and selected context
- next event or next action
- current condition that changes timing
- top priority
- one useful recommendation
- one clear button to explore deeper

The visitor should not need to scroll through an educational document before seeing the product value.

### 3. Let one profile change the whole demo

A profile switcher should update the same stable layout.

Only the selected use case should render. The other four remain data, not hidden DOM and not duplicate dashboards.

### 4. Open one deeper workspace

The deeper view should show one selected category at a time, such as:

- Day
- Work or project
- Money or finance
- Shared space
- Wellness or recovery
- Intelligence or connections

Do not keep separate Focus, Workspace, and Full application modes in the first simplified version. Use one overview plus one detail workspace.

### 5. Explain the platform briefly

A short final section or drawer should explain:

- what is real public data
- what is fictional demo data
- what would require a protected backend
- what connected services could contribute
- what actions would still require approval

This should replace multiple long education, possibilities, comparison, library, and backend-flow sections on the main path.

## Keep, collapse, and postpone

### Keep in the simplified demo

- five use cases
- private profile versus approved shared space
- next action and daily context
- selected scenario tabs or categories
- honest source and connection labels
- one music experience
- one Spotify provider player
- one concise explanation of the backend boundary
- responsive desktop and mobile behavior

### Collapse into shorter surfaces

- weather visualization into one useful condition card
- priorities and schedule into the main overview and one detail view
- memory education into one short explanation or modal
- connection cards into a compact connection status drawer
- AI comparison and backend architecture into one concise How it works section
- capability examples into a small expandable list

### Postpone from the primary path

- terminal navigation
- library article system
- three separate depth modes
- long onboarding tour
- multiple overlay systems
- multiple Spotify iframes
- automatic narration on entry
- extensive charts and decorative modules that do not change the next decision
- full-detail variants for all five scenarios rendered at once

Postponed work can remain in Git history and selected pieces can return after the simplified foundation is stable.

## Target code architecture

The new demo should have one owner for each concern.

### Recommended production files

The exact names can change during implementation, but the responsibility split should stay small:

```text
brief-next/index.html
assets/brief-next/brief-demo.css
assets/brief-next/brief-demo-data.js
assets/brief-next/brief-demo-app.js
assets/brief-next/brief-demo-media.js
```

### Ownership contract

`brief-demo-data.js`

- all visible copy
- five scenario records
- cards, tabs, recommendations, and connection labels
- Spotify track IDs and preview metadata
- no DOM manipulation

`brief-demo-app.js`

- selected scenario
- selected detail category
- entry state
- URL state if retained
- rendering
- event delegation
- no media-provider logic

`brief-demo-media.js`

- one preview audio instance
- one Spotify Embed controller or one iframe
- soundtrack request on entry
- provider fallback
- play, pause, track swap, and blocked-playback messaging

`brief-demo.css`

- one design system
- responsive layout
- overlay and focus behavior if any
- no layered legacy override files

`index.html`

- stable semantic shell
- entry surface
- application mount points
- minimal static fallback copy
- no long hard-coded product essay

## Media strategy

### Autoplay that can be made reliable

The Start soundtrack option should control the authorized preview audio, not promise full Spotify playback.

The implementation should:

1. Create or preload one preview audio object before entry.
2. Call `audio.play()` directly inside the same user click handler that opens the demo.
3. Avoid waiting 450 milliseconds or dispatching the request through several modules.
4. Continue opening the demo even when playback is blocked.
5. Replace failure toasts with a visible Play soundtrack button.
6. Preserve the user's sound choice during the current session.

### Spotify behavior

Use one Spotify Embed only.

Recommended approach:

- load it on demand after the user opens the media surface
- use Spotify's iFrame API for track changes and direct play or pause controls where supported
- call provider playback only from a direct user action
- keep Open in Spotify as the durable fallback
- do not create one iframe per recommendation card
- do not claim the provider is connected when it is only embedded

Full provider autoplay cannot be guaranteed across browsers, Spotify availability, account state, and provider policy. The demo should treat that as a platform boundary, not a bug that can always be bypassed.

### Narration

Narration should be disabled in the first simplified release.

It can be reintroduced after the soundtrack controller is stable, using one explicit Read this briefing control. Music ducking should be added only after both controls are independently reliable.

## Reversible delivery model

The existing `/brief` implementation must remain recoverable throughout the rewrite.

### Rules

- Do not delete or broadly rewrite the current `/brief` during the first implementation step.
- Keep PR #41 as the restored baseline record.
- Build the simplified version on a new branch after the baseline checkpoint is understood.
- Build the new version in parallel under `brief-next/` and `assets/brief-next/` until review.
- Do not copy the existing loader chain into the new version.
- Do not merge PR #35 or PR #37 automatically because the product direction has changed.
- Reuse small fixes or components only when they support the simplified architecture.
- Swap the accepted new version into `/brief` only after desktop and mobile review.
- Keep the pre-swap commit as the rollback point.

## Delivery phases

## Phase 0: Finish and preserve the baseline

Current work.

- keep PR #41 limited to the workspace restore and continuity docs
- finish browser-matrix inspection
- record inherited CI blockers
- decide whether PR #41 should merge as a recovery baseline
- pause broad work on PR #35 and PR #37 until the new architecture determines what is still useful

## Phase 1: Build the reversible demo foundation

This is the first proposed implementation step.

- create `agent/brief-demo-v2` from the accepted baseline
- create the parallel `brief-next/` surface
- create the small data, app, media, and CSS ownership structure
- implement the entry selection
- implement one stable overview layout
- make all five profiles render through the same layout
- add one detail workspace with one category visible at a time
- add a placeholder media surface with one player slot
- add minimal focused tests
- leave the current `/brief` untouched

### Phase 1 acceptance criteria

- no current `/brief` product files are deleted
- the new surface loads without the legacy loader chain
- one scenario state controls the full page
- all five scenarios switch without reloading or duplicating the DOM
- desktop and mobile layouts are readable
- no tour, terminal, library, or full-mode system is included
- no console errors
- documentation records the exact branch, files, tests, and next action

## Phase 2: Consolidate the content story

- select the strongest content from the current implementation
- rewrite it into one overview and a small set of detail categories
- create an explicit keep, rewrite, archive map for every current section
- reduce the main journey to approximately three screen lengths on desktop
- keep deeper explanations in drawers or secondary views

## Phase 3: Rebuild soundtrack and Spotify behavior

- move preview audio to one media controller
- trigger requested preview playback inside the entry click
- add blocked-playback fallback
- integrate one Spotify Embed or iFrame API controller
- swap tracks without replacing the whole media section
- remove duplicate Spotify frames from the simplified version
- test Chrome, Firefox, Safari/WebKit, iPhone, and Android behavior

## Phase 4: Product polish and editability

- finalize visual hierarchy
- reduce motion and decorative noise
- document every content key
- add a content editing map
- ensure text and scenario changes usually require editing one data file
- verify keyboard, focus, contrast, and short-height behavior

## Phase 5: Review and cutover

- compare `/brief` and the parallel simplified version
- get explicit approval for the final product direction
- replace `/brief` with the accepted simplified files
- preserve a rollback commit or archive branch
- update route and privacy audits if required
- run the full browser and static validation suite

## Phase 6: Remove obsolete layers deliberately

Only after cutover:

- identify assets no longer loaded anywhere
- confirm no other routes depend on them
- archive useful design references in documentation
- delete obsolete runtime files in small reviewed groups
- update tests to match the simplified product contract

## PR strategy

### PR #41

Purpose remains baseline recovery. Do not turn it into the full rewrite.

### PR #35

Do not merge automatically.

Potentially reusable:

- Node browser-environment mocks in `tests/brief-device-smoke.test.js`
- selected overlay fixes if the simplified version still has an overlay

Potentially obsolete:

- fixes that preserve the current multi-overlay and terminal architecture

### PR #37

Pause as a product branch.

It expands the Personal OS shell and depends on PR #35. The new direction favors a much smaller demo architecture. Review it later for ideas and copy, not as the default merge path.

### PR #38

Keep separate. Its privacy-audit adjustment may still be useful independently because the current audit failure is related to `/doc`, not `/brief`.

## Context continuity rules

After every meaningful action:

1. Update `docs/brief/CURRENT.md`.
2. Record the branch and latest product commit.
3. Record files changed.
4. Record exact test commands or workflow IDs.
5. Classify failures as restore-specific, inherited, flaky, or unrelated.
6. Record the exact next action.
7. Keep raw logs outside the current-status summary.
8. Avoid broad multi-file changes without an intermediate checkpoint.

## Exact next approval requested

Approve **Phase 1: Build the reversible demo foundation**.

That approval authorizes a new branch and a parallel simplified surface. It does not authorize deleting the current `/brief`, merging PR #35 or PR #37, or swapping the new demo into production.