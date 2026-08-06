# Brief Interface Failure and Risk Register

Last reconciled: **August 6, 2026**  
Repository: `CMXChat/First-Repo`  
Safeguard baseline inspected before this repair: `0b6013525b6b7c37a83cd450fe37b74683ac36f1`

## Current shipping surfaces

- `/brief/` is the active Personal OS briefing demo.
- `/brief-next/` is the byte-aligned staging and rollback copy.
- `/doc/` is the public noindex Personal OS product overview.
- The active Brief runtime is the `brief-demo-*` family referenced by both Brief route files.

Old failures from the retired modular interface remain in Git history. They are not current blockers unless they reproduce against the active routes and assets above.

## Resolved or superseded issues

### Retired modular Brief failures

Failures involving the former `brief-workspace.js`, depth persistence, detached map controls, guided tours, terminal overlays, and old selector contracts are superseded by the active standalone Brief implementation.

### Light-first rendering and plain-language copy

Both Brief routes begin with light HTML and a light theme color. Saved dark mode and explicit theme selection remain supported. The visible Brief and Doc copy has also received the current plain-language pass.

### Workspace keyboard behavior and reset focus

Workspace tabs retain keyboard controls, selected-state handling, and browser coverage. Returning to the entry chooser restores focus to a useful scenario control.

### Spotify entry lifecycle

The Spotify controller is prepared while the entry screen is visible. The final Open demo tap requests playback during the same user gesture, and the demo still opens when Spotify is slow, unavailable, or refuses autoplay. A direct-tap fallback remains available because browser policy, device policy, provider status, and Spotify account state are external constraints.

### Topbar placement and controls

The live header now contains the soundtrack and theme controls only. The documentation shortcut was removed from the live topbar while documentation remains available on the entry screen and inside How it works. Mobile safe-area spacing keeps the buttons away from the browser edge, and the theme control uses the prominent neon treatment requested for the interface.

### Scenario selector ARIA

Resolved in PR #68. The entry chooser is an accessible labelled group of native toggle buttons. The buttons keep `aria-pressed` for screen-reader state and no longer override their native button role with `role="listitem"`.

This preserves:

- mouse and touch selection
- keyboard activation through native buttons
- visible selected styling
- announced pressed state
- the Personal, Relationship, Business, Trainer, and Team choices

### Entry scenario-description contrast

Resolved in the shared light-theme component rule. Scenario descriptions now use `#5f7084` on the light entry surface, above the 4.5:1 AA threshold without increasing visual weight.

### Today-view secondary contrast

Resolved across the shared components instead of only the first axe targets:

- `.muted-pill` now uses `#66768a`
- the hourly row secondary token now uses `#596b80`
- hourly times are semantic `<time>` elements using `#2f4257`
- all hourly secondary labels inherit the repaired component rule

### Personal OS documentation diagram contrast

Resolved consistently in the light documentation theme:

- `.boundary-center > small` now uses `#617286`
- `.memory-index` now uses dark ink `#10253a` on the coral number treatment

Both treatments clear the AA threshold while retaining the existing diagram hierarchy.

### `/doc/` password gate and mobile CTA overflow

The overview remains intentionally ungated, public, and noindex. It contains no client-side password-gate markup. The mobile final CTA remains covered by its containment rules.

## Active risks and safeguards

### Production-domain observation

Local and pull-request browser suites cannot prove the deployed domain, edge cache, or provider behavior. `Personal OS Production Smoke` remains installed for deployed-route status, first-response policy, route parity, local asset reachability, cache versions, reciprocal links, demo boundaries, and ungated Doc policy.

### Cache versions

The cache-version safeguard from PR #67 remains intact. Every modified active Brief JavaScript or CSS asset in PR #68 has a corresponding version-query change through the active route reference chain in both route files.

### Brief and staging parity

`brief/index.html` and `brief-next/index.html` remain byte-for-byte aligned. A future intentional staging difference requires an explicit documented exception. Parity enforcement was not relaxed for this repair.

### Spotify remains externally constrained

The application can request playback from the final user gesture and expose a fallback. It cannot override Chrome autoplay rules, device settings, provider availability, or Spotify account restrictions. Some users may still need one direct tap inside Spotify.

### Manual accessibility review remains necessary

Automated axe coverage is required on desktop and mobile Chromium, but it does not replace manual review. Before a public launch, also verify:

- screen-reader reading order and announcements
- keyboard-only use across every view and drawer
- 200% and 400% zoom
- forced colors and high contrast
- reduced motion
- touch target spacing on real devices
- focus after scrolling, resetting, switching contexts, and closing media
- the external Spotify interface with assistive technology

### Legacy Brief assets remain under review

The inventory still identifies 59 unreferenced legacy Brief candidates. PR #68 does not delete or reclassify them. Deletion requires a separate historical and dependency review across routes, tests, workflows, documentation, and Git history.

### Demo versus live-product boundary

The Brief remains clearly identified as a demo and the Doc retains its current-versus-planned product status. The interface must not imply that authentication, durable memory, live private connectors, permissions enforcement, encrypted storage, or action execution already exists.

## Safeguards that must remain installed

Do not remove or weaken:

- the production smoke workflow
- Brief and Brief Next parity enforcement
- cache-version enforcement
- demo-versus-live boundary checks
- documentation freshness checks
- Spotify lifecycle tests
- accessibility workflows
- active and legacy asset inventory checks

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

For each current failure, include the verified commit SHA, affected route, browser and viewport, exact reproduction, current selector or source file, expected and observed behavior, supporting trace or workflow, environment, and whether the cause is code, deployment, accessibility, or an external provider.

Do not add an old failure here without first proving it exists in the active interface.
