# Personal OS Release Safeguards

Created: **August 5, 2026**  
Code baseline reviewed before this safeguards branch: `7b2d4e9dd85ac0011b1cb9d8426c39270b143705`

## Scope

This pass adds release protection around Personal OS without changing `/brief/`, `/brief-next/`, `/doc/`, or their runtime assets. It was intentionally separated because another context was actively changing the Brief interface.

The baseline already includes:

- mobile overflow and Spotify entry stabilization from PR #63
- Today-first entry, reset, and context switching from PR #64
- the compact hero scroll cue from PR #65
- light-first rendering, plain-language copy, keyboard tab controls, reset focus, and the earlier documentation reconciliation

## Added safeguards

### One release gate

`Personal OS Release Gate` combines the required surrounding checks:

- route, noindex, light-first, reciprocal-link, demo-boundary, and ungated-Doc contracts
- production and staging parity
- differential cache-version enforcement for modified active assets
- documentation freshness
- active and legacy Brief asset inventory
- mocked Spotify lifecycle behavior
- automated accessibility reporting

Accessibility is advisory in the pull-request gate while the source is being changed elsewhere. The scheduled accessibility workflow remains strict and will fail when serious or critical automated violations are found.

### Production-domain smoke validation

`Personal OS Production Smoke` runs daily and can be started manually. It checks the deployed domain instead of a local server:

- `/brief/`, `/brief-next/`, and `/doc/` return HTTP 200 without an unexpected redirect
- all three pages remain noindex and light in the first HTML response
- Brief and staging HTML remain aligned
- active local assets are versioned and reachable
- reciprocal links remain present
- `/doc/` remains free of password-gate markup
- route registry policies remain ungated for these three public noindex surfaces
- demo and current-versus-planned boundaries remain visible

The workflow is installed by this safeguards branch. An immediate production run was not completed inside this context because the available execution environment could not resolve the deployment host and the GitHub connector did not expose workflow dispatch. The scheduled or manual workflow remains the source of truth for deployed-domain status.

### Cache-version enforcement

When an active `assets/brief/*.js` or `assets/brief/*.css` file changes in a pull request, its version query in the route HTML must also change. This prevents rapid same-day deployments from silently depending on browser or edge cache invalidation.

### Brief and staging parity

The release contract compares `/brief/index.html` and `/brief-next/index.html` byte for byte and compares their local asset references. Intentional staging drift must be documented before the guard is relaxed.

### Mocked Spotify lifecycle coverage

The dedicated suite covers provider behavior that should not depend on Spotify being available during CI:

- silent autoplay refusal
- `play()` exceptions
- scenario track switching through `loadEntity()`
- iframe API timeout and direct-tap fallback
- entry remaining usable and the drawer remaining controllable

The first complete safeguard run passed all mocked Spotify lifecycle tests.

### Accessibility audit

The automated axe audit covers:

- Brief entry
- Brief Today and How views
- Brief Next entry
- Personal OS document
- desktop and mobile Chromium
- WCAG 2.0 and 2.1 A and AA rules

#### Findings from the first audit

The first audit ran against product baseline `7b2d4e9dd85ac0011b1cb9d8426c39270b143705`. The same findings reproduced in desktop and mobile Chromium.

**Brief and Brief Next entry**

- Critical `aria-allowed-attr`: each scenario button combines `role="listitem"` with `aria-pressed`. Axe reports `aria-pressed` as unsupported for that explicit role. The reported targets are the Personal, Relationship, Business, Trainer, and Team scenario buttons.
- Serious `color-contrast`: the small scenario descriptions use `#65768a` on `#f7fafe`, measured at `4.44:1` against the required `4.5:1` for that text size.

**Brief Today**

- Serious `color-contrast`: reported targets include `.muted-pill` and text inside the first hourly weather items, including the time and secondary labels.

**Personal OS document**

- Serious `color-contrast`: reported targets include `.boundary-center > small` and the numbered spans in the first memory-layer cards.
- The shared-boundary note was measured at `4.18:1`.
- The memory-layer number treatment was measured at `4.11:1`.

These are active product findings for the other Brief editing context. This safeguards branch records them but does not change the interface.

Automated testing does not replace manual review. Before a public launch, manually verify:

- screen-reader order and announcements
- 200% and 400% zoom
- keyboard-only use across every view and drawer
- reduced motion
- forced colors and high contrast
- touch target spacing on real devices
- text contrast for disabled and muted states
- focus visibility after scrolling, resetting, switching contexts, and closing media
- external Spotify iframe behavior with assistive technology

### Legacy asset inventory

The maintenance script walks every JavaScript and CSS file under `assets/brief/`, builds a reference graph from the shipping route entrypoints, and classifies files as:

- active direct entry
- active dependency
- unreferenced demo-family asset
- unreferenced legacy candidate
- empty legacy placeholder

The first generated inventory found:

- 68 JavaScript and CSS files under `assets/brief/`
- 9 active direct route entries
- 0 additional active dependencies discovered by the static reference walk
- 59 unreferenced legacy candidates
- 0 empty legacy placeholders

The nine active direct entries are the current `brief-demo-*` JavaScript and CSS files referenced by both `/brief/` and `/brief-next/`.

Unreferenced does not mean safe to delete. Deletion still requires a search across route HTML, tests, workflows, documentation, and Git history.

### Documentation freshness

The docs check blocks superseded operational claims and confirms the current documentation baseline still exists in Git. Material route and core runtime changes must update at least one current operational document.

### Demo versus live-product boundary

The release contract requires the Brief to remain identified as a demo and the document to retain its current-versus-planned status section. It also prevents `/doc/` from quietly regaining client-side password markup.

## Remaining manual decisions

These safeguards do not decide:

- which of the 59 unreferenced legacy candidates should be retained or deleted
- when the recorded accessibility findings should become a required pull-request check
- whether `/brief-next/` should eventually become a deliberately different staging surface
- what deployment event should trigger an immediate production smoke run
- which GitHub checks should be marked as required in branch protection

Those decisions should be made after the active Brief editing context finishes and the new baseline is stable.
