# Personal OS Release Safeguards

Created: **August 5, 2026**  
Last reconciled: **August 6, 2026**  
Safeguard merge commit: `0b6013525b6b7c37a83cd450fe37b74683ac36f1`

## Scope

PR #67 added release protection around `/brief/`, `/brief-next/`, `/doc/`, and the active Personal OS assets. PR #68 repairs the current header, Spotify entry lifecycle, ARIA structure, and contrast findings while preserving every safeguard installed by PR #67.

No safeguard workflow, parity rule, cache rule, product-boundary check, accessibility suite, Spotify lifecycle test, documentation-freshness check, or asset-inventory check is removed or weakened by the repair.

## Installed safeguards

### Personal OS Release Gate

The release gate combines:

- route, noindex, light-first, reciprocal-link, demo-boundary, and ungated-Doc contracts
- `/brief/` and `/brief-next/` parity
- differential cache-version enforcement for modified active Brief assets
- documentation freshness
- active and legacy Brief asset inventory
- mocked Spotify lifecycle behavior
- automated accessibility coverage

The focused repair must merge only after the required gate is green.

### Production-domain smoke validation

`Personal OS Production Smoke` checks the deployed domain for:

- HTTP status and unexpected redirects on `/brief/`, `/brief-next/`, and `/doc/`
- first-response light mode and noindex policy
- Brief and staging parity
- versioned and reachable local assets
- reciprocal documentation links
- ungated Doc markup and route policy
- visible demo and current-versus-planned boundaries

This workflow remains the source of truth for deployment and edge behavior after merge.

### Cache-version enforcement

When an active `assets/brief/*.js` or `assets/brief/*.css` file changes, the active reference chain and both Brief route files must receive a new version query. PR #68 follows that rule for the repaired application and component stylesheet.

### Brief and staging parity

`brief/index.html` and `brief-next/index.html` are compared byte for byte and by active asset reference. PR #68 keeps them aligned. Intentional staging drift still requires a documented exception before any guard can change.

### Mocked Spotify lifecycle coverage

The Spotify suite covers application behavior without depending on the live provider during CI:

- controller readiness while the entry chooser is visible
- playback requested from the final Open demo user gesture
- silent autoplay refusal
- thrown `play()` calls
- scenario track switching through `loadEntity()`
- iframe API timeout and direct-tap fallback
- entry remaining usable and the drawer remaining controllable

The implementation cannot override Chrome autoplay rules, device policy, Spotify availability, or account restrictions. User-facing copy continues to state that one direct Spotify tap may still be required.

### Accessibility audit

The axe audit covers the Brief entry and active views plus the Personal OS document in desktop and mobile Chromium against WCAG A and AA rules.

#### Findings repaired in PR #68

**Brief and Brief Next entry**

- The chooser is now a labelled `role="group"` containing native buttons.
- Each native button retains `aria-pressed` and no longer uses the incompatible `role="listitem"` override.
- Scenario descriptions now use `#5f7084` on the light entry surface, clearing the 4.5:1 AA threshold.

**Brief Today**

- `.muted-pill` now uses the repaired shared color `#66768a`.
- hourly secondary labels use `#596b80`.
- hourly times are semantic `<time>` elements using `#2f4257`.
- the repair applies across the complete weather row, not only the first axe targets.

**Personal OS document**

- `.boundary-center > small` now uses `#617286`.
- `.memory-index` now uses `#10253a` on the coral number treatment.
- the repair is shared across the relevant diagram components.

Automated testing does not replace manual review. Before a public launch, manually verify screen-reader order, keyboard-only use, 200% and 400% zoom, reduced motion, forced colors, touch targets, focus transitions, disabled states, and the external Spotify interface with assistive technology.

### Legacy asset inventory

The inventory still classifies the Brief asset tree as active entries, active dependencies, unreferenced demo-family assets, unreferenced legacy candidates, and empty placeholders.

The recorded inventory remains:

- 68 JavaScript and CSS files under `assets/brief/`
- 9 active direct route entries
- 59 unreferenced legacy candidates
- 0 empty legacy placeholders

PR #68 does not delete the 59 candidates. Unreferenced does not mean safe to remove. A separate PR must review route references, tests, workflows, documentation, dependency chains, and Git history before deletion.

### Documentation freshness

Material Personal OS route or runtime changes must update current operational documentation. The verified baseline in `docs/README.md` must remain within the accepted commit distance and must resolve to an existing commit.

PR #68 updates:

- `docs/README.md`
- `docs/brief-interface-failures.md`
- `docs/personal-os-release-safeguards.md`

### Demo versus live-product boundary

The Brief must remain identified as a demo. The Doc must retain its current-versus-planned status, remain public noindex, and remain free of a client-side password gate. Static demonstrations do not prove authentication, durable memory, live private connectors, server permissions, encrypted storage, or action execution.

## Current release checklist

A Personal OS interface change is ready to merge only when:

- `/brief/` and `/brief-next/` are byte-for-byte aligned
- changed active Brief assets carry updated cache versions
- route contracts pass
- documentation freshness passes
- asset inventory passes without unauthorized deletion
- Spotify lifecycle tests pass
- desktop and mobile Chromium accessibility scans pass
- the Personal OS Release Gate is green
- required production smoke protections remain installed

## Remaining manual decisions

These safeguards do not decide:

- which of the 59 unreferenced legacy candidates should be retained or deleted
- whether `/brief-next/` should eventually become a deliberately different staging surface
- which checks should be marked required in branch protection
- what deployment event should trigger an immediate production smoke run
- the final manual screen-reader and real-device acceptance result

Those decisions remain separate from this focused repair.
