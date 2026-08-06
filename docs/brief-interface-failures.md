# Brief Interface Failure and Risk Register

Last reconciled: **August 5, 2026**  
Repository: `CMXChat/First-Repo`  
Verified product baseline: `7b2d4e9dd85ac0011b1cb9d8426c39270b143705`

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

Repaired for the current interface with explicit light-theme treatment for alarm, privacy, goal, connection, and Everything-view sections. The broader automated audit still found separate contrast issues listed below.

### Generated-sounding or overly complex visible copy

Repaired through a plain-language pass across Brief scenarios, explainers, media messages, and the Doc. Rendered-copy checks now protect important visible wording.

### Workspace tab keyboard and state behavior

Repaired with keyboard controls, selected-state handling, and browser coverage.

### Reset and return-to-entry focus

Repaired so focus returns to a useful entry control instead of remaining in hidden application content.

### Media fallback behavior

Improved so Spotify controller failure or rejected playback exposes a usable direct-play path. Deterministic mocked lifecycle tests now cover silent refusal, thrown playback, track switching, and API timeout.

### `/doc/` password gate

Resolved. The product overview contains no Black Prompt Gate markup or gate assets and is registered as ungated.

### `/doc/` mobile final CTA overflow

Repaired with dedicated containment rules and focused coverage.

## Active findings

### P1: Entry scenario buttons use unsupported ARIA

The first automated axe audit found a critical `aria-allowed-attr` violation on `/brief/` and `/brief-next/` in desktop and mobile Chromium.

Current pattern:

- scenario controls are buttons
- each button has `role="listitem"`
- each button also uses `aria-pressed`

Axe reports `aria-pressed` as unsupported for the explicit `listitem` role. The finding applies to the Personal, Relationship, Business, Trainer, and Team scenario buttons.

Required review:

- use a valid selection pattern such as native buttons inside list items, a radio group, or another supported composite
- preserve keyboard selection, visible state, and announced state
- rerun the desktop and mobile audit after the active Brief editing context finishes

### P1: Entry scenario descriptions miss the contrast threshold

The small descriptions under the scenario names use `#65768a` on `#f7fafe`. Axe measured `4.44:1`; the required minimum for that text size is `4.5:1`.

Affected surfaces:

- `/brief/` entry
- `/brief-next/` entry
- desktop and mobile Chromium

### P1: Today view contains low-contrast secondary text

The automated audit reported serious contrast violations in desktop and mobile Chromium.

Reported targets include:

- `.muted-pill`
- `.hourly-item:nth-child(1) > span`
- `.hourly-item:nth-child(1) > small`
- `.hourly-item:nth-child(2) > span`

The complete weather row and muted token set should be reviewed instead of changing only the first reported nodes.

### P1: Personal OS document contains low-contrast diagram labels

The automated audit reported serious contrast violations in desktop and mobile Chromium.

Reported targets include:

- `.boundary-center > small`, measured at `4.18:1`
- numbered spans inside the first memory-layer cards, measured at `4.11:1`

The complete boundary and memory-diagram token set should be reviewed for consistent AA contrast.

## Active risks and safeguards

### P1: Production domain and CDN need a first recorded smoke result

Local browser suites use a local static server. PR #67 adds a daily and manual `Personal OS Production Smoke` workflow for `db.cmxchat.com`.

The workflow checks:

- deployed route status and redirects
- first-response light mode and noindex policy
- Brief and staging parity
- local asset reachability and cache versions
- reciprocal links
- ungated Doc markup and route policy
- visible demo and planned-product boundaries

Residual risk:

- the first live-domain workflow result is still pending
- production response headers and real-device behavior need continued observation

### P1: Cache versions must move with active asset changes

PR #67 adds differential enforcement. A modified active Brief JavaScript or CSS file must receive a new version query in the route HTML.

Residual risk:

- existing same-version deployments are not retroactively repaired by the safeguard
- production propagation still needs the deployed-domain smoke check

### P1: `/brief/` and `/brief-next/` parity is now enforced

PR #67 compares the two HTML files byte for byte and verifies their active asset references.

Residual risk:

- a future intentional staging difference needs an explicit documented exception instead of silently disabling the guard

### P1: Spotify remains externally constrained

The implementation and mocked lifecycle suite can validate application behavior. They cannot override browser autoplay policy, provider availability, or account requirements.

Residual risk:

- some users still need one direct Spotify tap
- live provider behavior needs production observation
- copy must continue to describe this limitation honestly

### P1: Accessibility coverage now exposes known failures

PR #67 adds automated desktop and mobile axe coverage and a strict weekly audit. Accessibility remains advisory in the pull-request release gate while another context is actively changing the interface.

Still required:

- fix the recorded ARIA and contrast findings
- run screen-reader reading-order review
- test 200% and 400% zoom
- test forced colors
- test reduced motion
- review touch targets on real devices
- verify focus behavior across every view and drawer
- review the external Spotify iframe with assistive technology

### P2: Legacy Brief modules require a deletion decision

The generated inventory found:

- 68 JavaScript and CSS files under `assets/brief/`
- 9 active direct `brief-demo-*` entries
- 59 unreferenced legacy candidates
- no empty placeholders

The inventory is a classification aid, not deletion approval.

Required next step:

- search every candidate across route HTML, tests, workflows, docs, and Git history
- classify each as retained library, historical reference, or removable
- perform cleanup in a dedicated PR after the active Brief work stabilizes

### P2: Validation now has one surrounding release gate

PR #67 adds a unified `Personal OS Release Gate` for contracts, docs freshness, inventory, Spotify lifecycle, and advisory accessibility.

Residual decision:

- choose which GitHub checks become required in branch protection
- decide when accessibility moves from advisory to required

### P2: Documentation freshness is now checked

PR #67 blocks known obsolete operational claims, verifies the documented baseline exists, and requires material product changes to update current operational documentation.

Residual risk:

- semantic architecture changes can still require human judgment
- dated concept files must remain historical instead of being rewritten as current contracts

### P2: Demo versus live-product boundary is now protected

The release contract requires the Brief to remain identified as a demo and the Doc to retain its current-versus-planned status section. It also prevents `/doc/` from regaining client-side password markup unnoticed.

Residual risk:

- new visible copy and data presentation still need human review for implied live functionality

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
