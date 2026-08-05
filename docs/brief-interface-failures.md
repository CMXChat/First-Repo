# Brief Interface Failure and Risk Register

Last reconciled: **August 5, 2026**  
Repository: `CMXChat/First-Repo`  
Verified product baseline: `5c7eef899f3357854492e2d3918f5915eb536b6b`

## Status of the previous failure dump

The previous version contained raw Playwright failures for the retired modular Brief interface. Examples included hidden Team flow content, depth-state failures, detached map controls, old tour bounds, and contrast checks against selectors that are not part of the current shipping `brief-demo-*` interface.

Those logs remain available in Git history, but they are not active blockers for the current `/brief/` product.

## Resolved or superseded issues

### Damaged `brief-workspace.js` on `main`

Superseded. The current `/brief/` route does not load that module as its production rendering path.

### Quick and Full depth persistence failures

Superseded by the focused views plus Everything view information architecture.

### Detached map and quick-route controls

Superseded. The old map and quick-route controls are not the current navigation system.

### Guided-tour and terminal overlay failures

Superseded for the shipping page. The current demo does not load the old guided-tour and terminal runtime.

### Dark first paint on the Brief

Resolved. Both `/brief/` and `/brief-next/` now begin with light HTML and a light theme-color, while saved dark mode and explicit theme queries remain supported.

### Light-mode special-section contrast

Repaired for the current interface with explicit light-theme treatment for alarm, privacy, goal, connection, and Everything-view sections.

### Generated-sounding or overly complex visible copy

Repaired through a plain-language pass across Brief scenarios, explainers, media messages, and the Doc. Rendered-copy checks now protect important visible wording.

### Workspace tab keyboard and state behavior

Repaired with keyboard controls, selected-state handling, and browser coverage.

### Reset and return-to-entry focus

Repaired so focus returns to a useful entry control instead of remaining in hidden application content.

### Media fallback behavior

Improved so Spotify controller failure or rejected playback exposes a usable direct-play path.

### `/doc/` password gate

Resolved. The product overview contains no Black Prompt Gate markup or gate assets and is registered as ungated.

### `/doc/` mobile final CTA overflow

Repaired with dedicated containment rules and focused coverage.

## Active risks and open issues

### P1: Production domain and CDN are not covered by local tests

Current browser suites use a local static server.

Impact:

- stale CDN assets may survive a correct merge
- production security headers can differ from HTML meta policy
- route rewrites and cache propagation are not verified
- real mobile rendering can differ from emulation

Suggested fix:

- add a post-deploy smoke workflow or release check against `db.cmxchat.com`

### P1: Same-version assets can remain stale

Several Brief JavaScript files changed during the final copy and accessibility pass while their query-string versions remained unchanged.

Impact:

- a browser or edge cache can serve old code with new HTML or tests
- source verification can disagree with production behavior
- same-day fixes may appear missing after deployment

Suggested fix:

- define asset version rules
- bump versions for cache-sensitive releases
- verify deployed file content after propagation

### P1: `/brief/` and `/brief-next/` can drift

The two pages currently share the same HTML blob and assets, and a later commit deliberately realigned them. No dedicated check enforces that relationship.

Impact:

- staging may stop representing production
- a fix can be applied to only one route
- rollback expectations can become false

Suggested fix:

- add a parity test with documented allowed differences

### P1: Spotify playback remains externally constrained

The implementation can prepare the provider and request playback. It cannot override browser autoplay policy or provider requirements.

Impact:

- some users still need one direct tap
- provider delay or failure changes the entry experience
- live playback cannot be guaranteed by repository tests

Suggested fix:

- add mocked iframe-controller lifecycle tests
- preserve the direct-play fallback
- keep product copy honest

### P1: Accessibility coverage is incomplete

Keyboard tabs and reset focus are now covered, but the interface has not received a complete audit.

Missing coverage includes:

- screen-reader reading order
- heading and landmark review
- zoom and text reflow
- forced colors
- reduced motion
- touch target review on real devices
- structured automated accessibility scanning

### P2: Legacy Brief modules remain in the repository

The current route uses `brief-demo-*`, while many modules from the previous implementation remain under `assets/brief/` with historical tests and workflows.

Impact:

- future agents can edit the wrong system
- duplicate concepts increase maintenance cost
- old workflows can fail for reasons unrelated to production
- deletion without analysis could remove a still-used dependency

Suggested fix:

- generate a dependency inventory from route HTML, imports, tests, workflows, and docs
- classify each old module as active, retained library, historical reference, or removable
- clean up in a dedicated PR

### P2: Validation ownership is distributed

There are multiple workflows, smoke files, browser configurations, and historical standards.

Impact:

- no single release signal
- new checks can target retired selectors
- a green subset can be mistaken for full validation

Suggested fix:

- define one release workflow or required-check set for `/brief`, `/brief-next`, `/doc`, privacy, accessibility interactions, and route policy

### P2: Documentation can become stale without detection

The previous handoff remained authoritative-looking after the architecture changed.

Impact:

- future work can restore obsolete code
- closed PRs can be treated as active dependencies
- historical failures can be mistaken for current defects

Suggested fix:

- add freshness checks for verified SHAs, route paths, source files, selectors, and PR-state claims

### P2: Static demo can be mistaken for a live Personal OS

The interface intentionally looks private and connected, but the data is fictional and repository-driven.

Impact:

- visitors can overestimate current capabilities
- future copy can imply real accounts, memory, permissions, or integrations

Suggested fix:

- retain visible fictional-data labels
- separate Demonstrated and Planned sections
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
- whether it is a code regression, deployment issue, accessibility issue, or third-party limitation

Do not paste an old failure into this file without first proving it exists in the current interface.
