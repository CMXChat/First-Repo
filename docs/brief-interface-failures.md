# Spaces Interface Failure and Risk Register

Last reconciled: **August 6, 2026**  
Repository: `CMXChat/First-Repo`  
Verified main baseline: `788bf77fcd21750af08e9e694fa6995d1208cc2a`  
Legacy filename retained: `docs/brief-interface-failures.md`

## Current shipping surfaces

- `/spaces/` is the active public noindex Spaces demo.
- `/brief/` is the public noindex compatibility route for older links and bookmarks.
- `/brief-next/` is the public noindex pre-migration rollback snapshot.
- `/doc/` is the public noindex Spaces product overview.
- The active runtime is the `brief-demo-*` family referenced by `/spaces/`.

Old failures from retired interfaces remain in Git history. They are not current blockers until they reproduce against `/spaces/`, the compatibility redirect, or the current assets.

## Resolved or superseded issues

### Incomplete product rename

The interface and documentation had adopted the Spaces name while the active route, canonical URL, route registry, tests, and release contracts still treated `/brief/` as the product surface. The migration establishes `/spaces/` as the canonical route and keeps `/brief/` as a compatibility redirect.

### Production and rollback parity conflict

The former byte-parity contract prevented a route migration because `/brief/` and `/brief-next/` could not serve different purposes. The current contract separates active, legacy, and rollback surfaces. `/brief-next/` remains available without controlling the production route.

### Shared calendars were implied

The prior product material described calendars, multi-calendar coordination, shared Spaces, alarms, and voice, but did not define shared calendars as a first-class permission model. The current migration document and Spaces How view define approved availability, events, responsibilities, rides, leave-by times, and private-event boundaries.

### Alarm and voice boundaries

Alarm and voice concepts already existed, but their control model needed a single operational definition. The current model keeps both planned, opt-in, reviewable, pausable, and restricted by person, device, room, time, and Space. Sensitive material defaults to silent display.

### Spotify status semantics

The media status now uses `aria-live="polite"` so asynchronous provider state can be announced without interrupting the user. The labeled Spotify host now has an explicit `region` role.

### Retired modular Brief failures

Failures involving the former `brief-workspace.js`, depth persistence, detached map controls, guided tours, terminal overlays, and old selector contracts are superseded by the active standalone Spaces implementation.

### Light-first rendering and plain-language copy

Spaces begins with light HTML and a light theme color. Saved dark mode and explicit theme selection remain supported. The visible Spaces and Doc copy has received the current plain-language pass.

### Workspace keyboard behavior and reset focus

Workspace tabs retain keyboard controls, selected-state handling, and browser coverage. Returning to the entry chooser restores focus to a useful scenario control.

### Spotify entry lifecycle

The Spotify controller is prepared while the entry screen is visible. The final Open demo tap requests playback during the same user gesture, and the demo still opens when Spotify is slow, unavailable, or refuses autoplay. A direct-tap fallback remains available because browser policy, device policy, provider status, and Spotify account state are external constraints.

### Topbar placement and controls

The live header contains the soundtrack and theme controls. Documentation remains available on the entry screen and inside How it works. Mobile safe-area spacing keeps the buttons away from the browser edge.

### Scenario selector ARIA and contrast

The entry chooser is a labelled group of native toggle buttons. The buttons keep `aria-pressed` and do not override their native button role. Shared light-theme component rules retain the repaired scenario-description, weather-label, and time contrast.

### Documentation diagram contrast and mobile CTA

The overview retains its repaired diagram colors and mobile containment. It remains public, ungated, and noindex, with no client-side password-gate markup.

## Active risks and safeguards

### GitHub Actions did not start for the app-authored pull request

The current pull request has no workflow runs or commit statuses at the time of this reconciliation. This is unknown verification status. Historical PR #68 failures and earlier green checks cannot prove the current branch.

The branch includes updated workflows and static contracts, but merge still requires a real workflow run or an equivalent reviewed execution of the same commands.

### `/doc/` contains legacy literal demo links

The four current Doc buttons still use `/brief/` in the source HTML. The compatibility route sends those clicks to `/spaces/`, preserves URL state, and provides a no-JavaScript fallback, so user navigation is not broken. A later direct-source cleanup can replace the four attributes when the large document is edited for another substantive reason. The release validator accepts either route during this compatibility period.

### Production-domain observation

Local and pull-request browser suites cannot prove the deployed domain, edge cache, or provider behavior. Production smoke must verify `/spaces/`, `/brief/`, `/brief-next/`, and `/doc/` after merge, including the redirect, first-response theme, noindex policy, active asset reachability, cache versions, reciprocal navigation, demo boundaries, and ungated Doc policy.

### Cache versions

Active cache enforcement now follows the asset references in `/spaces/`. A modified active JavaScript or CSS file requires a new version query in the active route. The rollback snapshot does not control production cache state.

### Legacy redirect timing

The external redirect script is deferred and the fallback meta refresh waits one second. The script should replace the page before the fallback fires in normal browsers. Browser coverage must continue to verify query-string and hash preservation.

### Spotify remains externally constrained

The application can request playback from the final user gesture and expose a fallback. It cannot override browser autoplay rules, device settings, provider availability, or Spotify account restrictions. Some users may still need one direct tap inside Spotify.

### Manual accessibility review remains necessary

Automated axe coverage is required on desktop and mobile Chromium, but it does not replace manual review. Before a public launch, also verify:

- screen-reader reading order and announcements;
- keyboard-only use across every view and drawer;
- 200% and 400% zoom;
- forced colors and high contrast;
- reduced motion;
- touch target spacing on real devices;
- focus after scrolling, resetting, switching contexts, and closing media;
- the external Spotify interface with assistive technology.

### Legacy assets remain under review

The inventory identifies active Spaces entries, active dependencies, rollback-only entries, unreferenced demo-family assets, unreferenced legacy candidates, and empty placeholders. This migration does not delete unreferenced files. Deletion requires a separate historical and dependency review.

### Demo and live-product boundary

Spaces remains clearly identified as a demo and the Doc retains its current-versus-planned product status. The interface must not imply that authentication, durable memory, live private connectors, permissions enforcement, encrypted storage, shared-calendar enforcement, alarm delivery, voice capture, or action execution already exists.

## Safeguards that must remain installed

Do not remove or weaken:

- the production smoke workflow;
- active, compatibility, rollback, and documentation route contracts;
- cache-version enforcement for active Spaces assets;
- demo-versus-live boundary checks;
- documentation freshness checks;
- Spotify lifecycle tests;
- browser-matrix and accessibility workflows;
- active and rollback asset inventory checks.

## External and planned-platform gaps

These are product gaps, not regressions in the static demo:

- authenticated accounts;
- persistent Spaces;
- structured memory service;
- Goal Intelligence backend;
- live data connectors;
- shared-calendar connectors and permission enforcement;
- model selection and orchestration;
- action approvals;
- encrypted storage;
- server audit logs;
- production observability;
- alarm scheduling and delivery;
- voice capture, narration, and device controls.

## How to record a new failure

For each current failure, include the verified commit SHA, affected route, browser and viewport, exact reproduction, current selector or source file, expected and observed behavior, supporting trace or workflow, environment, and whether the cause is code, deployment, accessibility, or an external provider.

Do not add an old failure without first proving it exists in the active Spaces experience or one of the current route contracts.
