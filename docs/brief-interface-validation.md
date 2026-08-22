# Brief Interface Validation Contract

Last reconciled: **August 5, 2026**  
Repository: `CMXChat/First-Repo`  
Verified product baseline: `5c7eef899f3357854492e2d3918f5915eb536b6b`

## Purpose

This document defines the validation contract for the current Personal OS demo. It replaces the earlier report that targeted the retired modular Brief interface and its old map, depth, tour, terminal, and workspace selectors.

Current implementation details are documented in `docs/2026-08-05-repository-reconciliation.md`.

## Routes in scope

### `/brief/`

Primary public noindex demo.

Required behavior:

- loads independently
- starts in light mode from the initial HTML
- preserves an intentional dark selection
- honors `?theme=light` and `?theme=dark`
- renders all five context choices
- opens the selected context
- exposes Today, Spaces, Memory, Goals, How, and Everything views
- provides usable desktop and mobile navigation
- links to `/doc/`
- labels fictional records and planned capabilities clearly
- avoids horizontal document overflow
- supports keyboard navigation through workspace tabs
- restores useful focus when returning to entry
- renders the approved plain-language copy

### `/brief-next/`

Standalone public noindex staging and rollback copy.

Required behavior:

- loads independently without redirecting
- stays functionally aligned with `/brief/`
- retains its canonical link to `/brief/`
- uses the current shared asset chain
- passes the same theme, copy, entry, keyboard, navigation, media, and containment expectations

### `/doc/`

Public noindex product overview.

Required behavior:

- loads without a password prompt
- contains no Black Prompt Gate markup or gate assets
- starts in light mode
- retains manual dark mode
- links to `/brief/`
- preserves readable print behavior
- contains its final CTA within narrow mobile viewports
- renders the approved plain-language copy
- keeps demonstrated and planned claims correctly scoped

## Current source-level checks

Focused smoke coverage should verify:

- route metadata and noindex policy
- current asset references
- current theme storage keys and fallback behavior
- scenario-card entry contract
- all expected focused views and Everything view
- reciprocal `/brief/` and `/doc/` navigation
- Spotify readiness, timeout, and fallback source contracts
- absence of the `/doc/` gate
- keyboard and ARIA contracts
- reset focus behavior
- rendered-copy maps and important visible phrases
- responsive and print rules
- duplicate IDs and required document sections
- route registry classifications

Static checks are necessary, but they do not prove browser behavior.

## Browser checks

### Primary desktop and mobile validation

At minimum, validate:

- desktop Chromium viewport
- narrow touch/mobile Chromium viewport
- clean first-load light theme
- dark selection persistence across reload
- removal of the new preference returns to light
- explicit query override remains reversible
- selected scenario opens successfully
- application navigation remains visible and usable
- workspace tabs accept supported arrow-key input
- selected tab state and focus stay aligned
- returning to entry restores focus
- media failure exposes a usable fallback
- no horizontal overflow
- `/doc/` CTA containment

### Cross-browser matrix

The maintained matrix should cover:

- Chromium desktop
- Firefox desktop
- WebKit desktop
- WebKit iPhone profile
- Chromium Android profile

The matrix must test the current `brief-demo-*` product. It must not fail because it expects selectors or modules removed from the shipping interface.

## Rendered-copy validation

Important visible copy is now part of the product contract.

Tests should confirm:

- entry copy is direct and understandable
- scenario and long-form content use the approved plain-language wording
- explainers avoid generated-sounding filler
- media readiness and fallback messages describe real behavior
- Doc status language distinguishes demonstrated and planned items
- hidden or duplicate source strings do not create false confidence about rendered output

Copy checks should be scoped to the correct visible region instead of matching an unrelated occurrence elsewhere in the page.

## Accessibility boundary

Current tests cover selected keyboard and focus behavior. A broader audit is still required.

Current minimum checks:

- correct tab roles and selected state
- keyboard movement through tabs
- focus is not stranded in hidden content
- reset returns focus to a useful entry control
- controls have usable accessible names
- mobile navigation remains reachable

Future coverage should add screen-reader flow, zoom, reduced motion, forced colors, and a structured accessibility scanner.

## Spotify validation boundary

Repository tests can verify:

- controller host remains mounted before entry
- soundtrack selection is tied to the chosen context
- Open demo waits while the selected track is preparing
- API timeout reaches fallback state
- rejected playback can expose a direct-play interface
- provider drawer states remain reachable

Repository tests cannot guarantee:

- third-party provider uptime
- Spotify account eligibility
- universal browser autoplay
- Safari autoplay decisions
- network or content availability in every country

A release must describe playback as requested from the entry click, with one direct tap sometimes required.

## Privacy and security checks

Required checks include:

- noindex and nofollow metadata on public concept routes
- no accidental password or secret exposure
- correct `gated` values in `assets/cmx-routes.json`
- `/doc/` remains ungated unless product policy explicitly changes
- gated routes continue to use their intended protection layer
- Content Security Policy permits only required sources
- fictional data remains labeled

Noindex is not authentication. Public concept routes are accessible to anyone with the URL.

## Cache and deployment checks

Source validation does not prove that users receive the latest asset.

A release check should confirm:

- changed assets receive an intentional cache-version update when required
- production serves the expected file content
- edge and browser caches do not retain same-day stale JavaScript
- `/brief/` and `/brief-next/` reference the intended versions
- response headers and HTML meta policy agree where relevant

## Validation recorded on August 5

The August 5 product changes passed relevant static, desktop, mobile, and multi-browser checks during their merge and follow-up work. Later commits added rendered-copy, keyboard, focus, media fallback, and document-copy assertions.

A future production claim should still use a fresh full workflow run against the release head and a deployed-domain smoke test.

## Required release checklist

1. Run current static smoke tests.
2. Run desktop and mobile Playwright tests.
3. Run the maintained cross-browser matrix.
4. Run `/brief-next/` focused validation.
5. Run `/doc/` smoke validation.
6. Run rendered-copy checks.
7. Run privacy, secret, navigation, and route-policy guards.
8. Confirm keyboard and reset-focus behavior.
9. Confirm `/brief/` and `/brief-next/` parity or document intended differences.
10. Confirm asset versions and deployed file content.
11. Test the deployed domain after propagation.
12. Record the verified commit SHA and workflow results in current documentation.

## Known coverage gaps

- deployed-domain and CDN smoke testing
- explicit parity enforcement between `/brief/` and `/brief-next/`
- mocked Spotify controller lifecycle tests
- full accessibility audit
- dependency inventory for legacy Brief assets
- automated documentation freshness checks

## Visual refinement contract recorded August 9

The active `/spaces/` briefing can become richer through the presentation of the information already on the page. Visual polish should improve hierarchy and interaction without adding more product concepts, extra panels, or duplicate controls.

For the current refinement pass:

- Today, Explore, Spaces, How, and Everything may use restrained Space-colored depth, gradients, edge accents, and clearer section pacing while keeping their existing content and navigation.
- Hover feedback belongs only on hover-capable devices. Touch layouts should remain calm, readable, and free of horizontal page movement.
- Motion should be brief and optional. Reduced-motion preferences must remove decorative transitions or entry animation.
- Dialog close controls must keep equal width and height, zero horizontal padding, and a circular radius on desktop and mobile.
- Visual changes must preserve light and dark themes, permission boundaries, focused mobile composition, and the complete Everything view.
- The visual layer lives in `assets/brief/brief-demo-visual-refinement.css` and is loaded through the final Explore stylesheet. Active cache versions must advance when that stylesheet changes.
- New browser coverage checks close-button geometry, refined surface rendering, and mobile containment. The regular accessibility, Spotify, device, release, privacy, and five-engine browser checks remain required.

The design goal is a finished briefing with stronger visual hierarchy and useful interaction feedback, while keeping the product understandable and uncluttered.

## Result format for future updates

Record:

- commit SHA
- routes tested
- static test result
- desktop and mobile result
- cross-browser result
- rendered-copy result
- accessibility interactions tested
- production-domain and cache result
- known external-provider limitations
- remaining failures with links to logs or artifacts

Do not summarize a numeric browser status without explaining what ran and what failed.
