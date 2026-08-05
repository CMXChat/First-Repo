# Brief Overlay Controls Repair

**Date:** August 4, 2026  
**Repository:** `CMXChat/First-Repo`  
**Branch:** `agent/brief-overlay-controls-fix`  
**Draft PR:** `#35`  
**Status:** Implemented and under final browser validation  
**Production status:** Not merged or deployed

## Reported Problems

The user reported two related failures on `/brief`:

- The top-left briefing/profile control made the page blurry but did not show a usable panel.
- Opening the terminal produced the same blurred-screen result.

Additional known issues remain separate:

- Music autoplay can fail and report feedback near the bottom.
- The entry instruction asking the visitor to choose a briefing may need greater prominence.

## Reproduction

A dedicated Playwright suite reproduced the terminal failure in desktop Chromium and Pixel 5 emulation.

The open action correctly applied terminal state and the blurred backdrop. The terminal element itself remained hidden:

```text
body state: terminal open
terminal parent: #briefMain
computed display: none
computed width: 0
computed height: 0
visible result: backdrop only
```

This matched the user’s description.

The top-left switcher, More menu, and guided tour opened correctly in the clean automated environment. Regression coverage was still added for them because the user reported the switcher failure and both controls share overlay state and stacking behavior.

## Root Cause

The terminal lived inside the legacy `#briefMain` layout. Older view and visibility rules continued to hide that subtree even after the newer terminal controller applied its open state.

The backdrop was attached at the body level and remained visible, while the terminal remained constrained by the hidden legacy parent. The result was a blurred page with no visible terminal.

## Repair

### Body-level terminal portal

`assets/brief/brief-overlay-controls-fix.js` now moves `#briefTerminal` to `document.body` after initialization.

This separates the terminal from legacy view visibility rules while preserving the existing terminal markup, commands, triggers, and close handlers.

### Explicit terminal states

`assets/brief/brief-overlay-controls-fix.css` defines body-level terminal behavior for:

- closed
- opening
- open
- emergency visibility repair

The open terminal uses a z-index above its backdrop and receives visible opacity, pointer events, and an on-screen transform.

### Focus settlement

Some late page scripts could steal focus after the terminal opened. The repair now rechecks visibility and input focus at several short intervals after open.

### Overlay stacking guard

The repair stylesheet also confirms that visible switcher and guided-tour surfaces remain above their backdrops and interactive.

### Asset loading

`brief-lite-ui.js` and `brief-lite-ui.css` load the repair layer and use a newer internal asset version.

## Focused Browser Coverage

The dedicated overlay suite verifies:

- top-left switcher opens visibly
- switcher buttons are present
- switcher close button removes overlay state
- terminal opens above the backdrop
- terminal input receives focus
- a real `help` command submits and clears the input
- terminal close button works
- terminal dock trigger reopens it
- Escape closes it
- switcher can reopen after terminal use
- no blur or terminal-open class remains stranded
- More menu opens and closes
- guided tour opens and closes
- the same switcher and terminal flows work at Pixel 5 width
- panel center hit-testing reaches the visible interactive surface

## Broader Flow Audit

The repository’s full briefing smoke chain was repaired where old test harnesses or asset-version assertions no longer represented the current page.

The chain now reaches and validates:

- device entry behavior
- onboarding and compatibility
- interconnected navigation
- map and theme integrity
- final navigation and vision tour
- terminal structure and command bridge
- entry selection and relationship watch
- stability protections
- workspace and Team behavior
- polish and media refresh

Changes to old smoke tests were limited to browser mocks and current asset contracts. Product behavior was not changed to satisfy obsolete assertions.

## Product Files Changed

```text
assets/brief/brief-overlay-controls-fix.js
assets/brief/brief-overlay-controls-fix.css
assets/brief/brief-lite-ui.js
assets/brief/brief-lite-ui.css
```

## Test and Workflow Files Added or Updated

```text
tests/brief-overlay-controls.spec.cjs
tests/brief-overlay-controls.playwright.config.cjs
.github/workflows/brief-overlay-controls-validation.yml
tests/brief-device-smoke.test.js
tests/brief-navigation-smoke.test.js
tests/brief-theme-map-smoke.test.js
tests/brief-finalization-smoke.test.js
tests/brief-terminal-smoke.test.js
tests/brief-entry-watch-smoke.test.js
tests/brief-workspace-team-smoke.test.js
```

## Validation Status

Confirmed successful before final documentation update:

- focused desktop and Pixel 5 overlay-control browser tests
- full briefing smoke chain through polish and media refresh
- CMX Static Validation
- CMX Privacy Audit
- CMX Secret Scan
- CMX Navigation Link Guard
- CMX Terminal Theme Guard

The wider Chromium, Firefox, WebKit, iPhone, and Android matrix should be treated as the final cross-browser gate for this draft PR.

## Deferred Work

This PR does not attempt to solve:

- browser autoplay restrictions or the current music-failure feedback
- stronger entry-gate wording hierarchy
- Goal Intelligence Step 4
- backend, authentication, database, connector, or AI work

Those should remain separate changes.

## Merge Boundary

PR `#35` should remain separate from Goal Intelligence PR `#34`.

No claim should be made that the repair is live until the branch is reviewed, merged, and deployed. After deployment, a hard refresh may be useful if a browser retained an older cached loader.
