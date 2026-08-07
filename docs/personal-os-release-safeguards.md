# Spaces Release Safeguards

Created: **August 5, 2026**  
Last reconciled: **August 6, 2026**  
Verified main baseline: `788bf77fcd21750af08e9e694fa6995d1208cc2a`  
Legacy filename retained: `docs/personal-os-release-safeguards.md`

## Scope

The safeguards cover the active `/spaces/` experience, the `/brief/` compatibility redirect, the `/brief-next/` rollback snapshot, `/doc/`, the active `assets/brief/` runtime, and the operational documents that define the product boundary.

The former `/brief/` and `/brief-next/` byte-parity rule is retired. The routes now have different jobs:

- `/spaces/` is the active demo.
- `/brief/` redirects old links and bookmarks to `/spaces/`.
- `/brief-next/` preserves the pre-migration interface as a rollback snapshot.
- `/doc/` explains the product, architecture, permissions, current reality, and planned capabilities.

## Installed safeguards

### Spaces Release Gate

The release gate combines:

- route, noindex, light-first, canonical, demo-boundary, and ungated-Doc contracts;
- active Spaces asset existence and cache-version checks;
- compatibility redirect checks, including query-string and hash preservation;
- active, legacy, rollback, and documentation route-policy checks;
- documentation freshness;
- active and rollback asset inventory;
- mocked Spotify lifecycle behavior;
- automated accessibility coverage.

A route migration is not ready to merge until the required jobs run and pass. An empty check list is unknown status, not a green release.

### Browser matrix

The browser matrix covers Chromium, Firefox, WebKit, an iPhone profile, and an Android profile. The active entrypoint is `/spaces/`. Selected compatibility tests may begin at `/brief/` to prove the redirect still reaches the active app with URL state preserved.

The browser suite verifies:

- light-first rendering and saved theme behavior;
- entry, reset, and Space switching;
- desktop and mobile navigation;
- workspace tabs and keyboard behavior;
- mobile containment and guarded swipes;
- soundtrack controls and fallback behavior;
- the legacy redirect path.

### Route and product contracts

The release validator requires:

- `/spaces/` to stay noindex, use the canonical Spaces URL, identify itself as a demo, and link to `/doc/`;
- `/brief/` to stay noindex and redirect to `/spaces/` with a visible fallback;
- `/brief-next/` to stay noindex and remain registered as a rollback snapshot;
- `/doc/` to stay noindex, ungated, and explicit about current and planned capabilities;
- the route registry to mark `/spaces/` Active, `/brief/` Legacy, `/brief-next/` Experimental, and `/doc/` Active;
- shared-calendar, alarm, voice, permission, and revocation language to remain documented.

### Cache-version enforcement

When an active `assets/brief/*.js` or `assets/brief/*.css` file changes, the version query used by `/spaces/` must change. The validator compares the active reference against the pull request base. A legacy route or rollback snapshot does not control the active cache version.

### Compatibility redirect

The `/brief/` route uses a self-hosted script and a no-JavaScript meta-refresh fallback. The script must:

- use `window.location.replace()` so the redirect does not add a useless browser-history step;
- preserve the query string;
- preserve the hash;
- remain covered by static and browser tests.

### Mocked Spotify lifecycle coverage

The Spotify suite covers application behavior without depending on the live provider during CI:

- controller readiness while the entry chooser is visible;
- playback requested from the final Open demo user gesture;
- silent autoplay refusal;
- thrown `play()` calls;
- scenario track switching through `loadEntity()`;
- iframe API timeout and direct-tap fallback;
- entry remaining usable and the drawer remaining controllable.

The implementation cannot override browser autoplay rules, device policy, Spotify availability, or account restrictions. User-facing copy must continue to state that one direct Spotify tap may still be required.

### Accessibility audit

The axe audit covers the Spaces entry, active Today and How views, the legacy redirect, the rollback entry, and the product document in desktop and mobile Chromium against WCAG A and AA rules.

Current interface requirements include:

- native scenario buttons inside a labelled group;
- visible and announced toggle state;
- keyboard-operable workspace tabs;
- focus restoration after closing media and resetting the demo;
- an `aria-live="polite"` media status;
- an explicitly named Spotify region;
- AA secondary-text contrast in the entry, weather, and documentation diagrams.

Automated testing does not replace manual review. Before a public launch, manually verify screen-reader order, keyboard-only use, 200% and 400% zoom, reduced motion, forced colors, touch targets, focus transitions, disabled states, and the external Spotify interface with assistive technology.

### Asset inventory

The asset inventory begins with the files referenced by `/spaces/`, follows active JavaScript and CSS dependencies, identifies rollback-only entries from `/brief-next/`, and classifies remaining files for later review.

Unreferenced does not mean safe to delete. A separate change must review route references, tests, workflows, documentation, dependency chains, and Git history before removal.

### Documentation freshness

Material Spaces route, runtime, permission, or product-boundary changes must update a current operational document. `docs/README.md` records the verified code baseline and lists the current reading order. The migration document is required to define shared calendars, the alarm and launch routine, and bounded voice behavior.

### Demo and live-product boundary

Spaces must remain identified as a demo. `/doc/` must retain its current-versus-planned status and stay free of a client-side password gate. Static pages do not prove authentication, durable memory, live private connectors, server permissions, encrypted storage, action execution, shared-calendar enforcement, alarm delivery, or voice capture.

## Current release checklist

A Spaces interface or route change is ready to merge only when:

- `/spaces/` loads the working demo;
- `/brief/` redirects correctly and preserves URL state;
- `/brief-next/` remains available as the rollback snapshot;
- changed active assets carry updated cache versions;
- route and product-boundary contracts pass;
- documentation freshness passes;
- asset inventory passes without unauthorized deletion;
- Spotify lifecycle tests pass;
- browser-matrix tests pass;
- desktop and mobile Chromium accessibility scans pass or have an explicitly reviewed advisory result;
- required GitHub Actions jobs have actually run;
- production smoke protections remain installed for post-merge deployment verification.

## Remaining manual decisions

These safeguards do not decide:

- which unreferenced legacy candidates should be retained or deleted;
- how long `/brief-next/` should remain as a rollback snapshot;
- which checks should be marked required in branch protection;
- what deployment event should trigger an immediate production smoke run;
- the final manual screen-reader and real-device acceptance result;
- when shared calendars, alarms, and voice move from planned concepts into authenticated backend work.
