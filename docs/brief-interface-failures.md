# Brief Interface Failure and Risk Register

Last reconciled: **August 5, 2026**  
Repository: `CMXChat/First-Repo`  
Verified code baseline: `0f869c5e9a14ffa44f2fe63b4bec419a445a5003`

## Status of the previous failure dump

The previous version of this file contained raw Playwright failures for the retired modular Brief interface. Examples included hidden Team flow content, depth-state failures, detached map controls, old tour bounds, and contrast checks against selectors that are not part of the current shipping `brief-demo-*` interface.

Those logs remain useful in Git history, but they are not active blockers for the current `/brief/` product. Keeping them as an unqualified current report would send future work toward the wrong architecture.

## Resolved or superseded issues

### Damaged `brief-workspace.js` on `main`

Superseded. The current `/brief/` route does not load that module as its production rendering path. The focused standalone demonstration replaced the old runtime.

### Quick and Full depth persistence failures

Superseded by the new information architecture. Current navigation uses focused views plus an optional Everything view instead of the old Quick and Full depth contract.

### Detached map and quick-route controls

Superseded. The old map and quick-route selectors are not the current navigation system.

### Guided-tour and terminal overlay failures

Superseded for the shipping page. The current demo does not load the old guided-tour and terminal runtime.

### Light-mode special-section contrast

Repaired for the current interface with explicit light-theme treatment for alarm, privacy, goal, connection, and Everything-view sections. This remains an area for regression testing.

### `/doc/` password gate

Resolved. The product overview contains no Black Prompt Gate markup or gate assets and is registered as ungated.

### `/doc/` mobile final CTA overflow

Repaired with dedicated mobile containment rules and focused source-level coverage.

### Brief soundtrack not starting from entry

Improved through provider preloading, track-readiness gating, playback request from the Open demo click, API timeout fallback, and direct-tap recovery. Universal autoplay remains outside repository control.

## Active risks and open issues

### P1: Brief can flash dark before resolving to light

The static HTML begins with `data-theme="dark"`. Deferred JavaScript then resolves the query, current preference key, or light fallback.

Impact:

- possible short dark flash on slow devices
- dark browser chrome before the theme meta value updates
- visual inconsistency with the intended light-first experience

Suggested fix:

- make light the static HTML and theme-color default, or
- add a minimal CSP-compatible head boot that resolves only the theme before first paint

Acceptance criteria:

- clean first paint is light
- saved dark mode still paints dark without a light flash
- query overrides remain deterministic

### P1: Production domain and CDN are not covered by local tests

Current browser suites use a local static server.

Impact:

- stale CDN assets may survive a correct merge
- production security headers can differ from HTML meta policy
- route rewrites, canonical behavior, and cache propagation are not verified
- real mobile rendering can differ from emulation

Suggested fix:

- add a post-deploy smoke workflow or scripted manual release check against `db.cmxchat.com`

### P1: `/brief/` and `/brief-next/` can drift

The two pages currently share the same HTML blob and assets, but this is a convention rather than an enforced invariant.

Impact:

- staging may stop representing production
- a fix can be applied to only one route
- rollback expectations can become false

Suggested fix:

- add a parity test that compares allowed HTML and asset differences
- define whether staging is a mirror or an intentional experiment before each change

### P1: Spotify playback remains externally constrained

The implementation can prepare the provider and request playback. It cannot override browser autoplay policy or provider requirements.

Impact:

- some users still need one direct tap
- provider API delay or failure changes the entry experience
- tests cannot prove live playback in every environment

Suggested fix:

- add mocked iframe-controller lifecycle tests
- preserve the direct-play fallback
- keep product copy honest about the limitation

### P2: Legacy Brief modules remain in the repository

The current route uses the focused `brief-demo-*` assets, while many modules from the previous implementation remain under `assets/brief/` with historical tests and workflows.

Impact:

- future agents can edit the wrong system
- duplicate concepts increase maintenance cost
- old workflows can fail for reasons unrelated to production
- deletion without analysis could remove a still-used dependency

Suggested fix:

- generate a dependency inventory from route HTML, imports, tests, and workflows
- classify each old module as retained library, historical reference, or removable
- clean up in a dedicated PR

### P2: Validation ownership is distributed

There are multiple workflows, smoke files, browser configurations, and historical standards.

Impact:

- no single release signal
- new checks can target retired selectors
- a green subset can be mistaken for full validation

Suggested fix:

- define one release workflow or required-check set for `/brief`, `/brief-next`, `/doc`, privacy, and route policy

### P2: Documentation can become stale without detection

The previous handoff remained authoritative-looking after the architecture changed.

Impact:

- future work can restore obsolete code
- closed PRs can be treated as active dependencies
- historical failures can be mistaken for current defects

Suggested fix:

- check current docs for obsolete verified SHAs, removed selectors, and active-PR claims
- require current operational docs to be updated with material architecture changes

### P2: Static demo can be mistaken for a live Personal OS

The interface intentionally looks private and connected, but the data is fictional and repository-driven.

Impact:

- visitors can overestimate current capabilities
- future copy can imply real accounts, memory, permissions, or integrations

Suggested fix:

- retain visible fictional-data labels
- separate Demonstrated and Planned sections in product copy
- avoid claiming live connector or backend behavior until it exists

## External and planned-platform gaps

These are product gaps, not regressions in the static demo:

- authenticated accounts
- persistent Spaces
- structured memory service
- Goal Intelligence backend
- live data connectors
- model selection and orchestration
- shared permissions enforcement
- action approvals
- encrypted storage
- server audit logs
- production observability

## How to record a new failure

For each current failure, include:

- verified commit SHA
- affected route
- browser and viewport
- exact reproduction
- current selector or source file
- expected and observed behavior
- screenshot, trace, or workflow link
- whether it occurs locally, in CI, on production, or through an external provider
- whether it is a code regression, deployment issue, or third-party limitation

Do not paste an old failure into this file without first proving it exists in the current interface.
