# Brief Interface Validation Contract

Last reconciled: **August 5, 2026**  
Repository: `CMXChat/First-Repo`  
Verified code baseline: `0f869c5e9a14ffa44f2fe63b4bec419a445a5003`

## Purpose

This document defines the validation contract for the current Personal OS demonstration. It replaces the earlier report that targeted the retired modular Brief interface and its old map, depth, tour, terminal, and workspace selectors.

Current implementation details are documented in `docs/2026-08-05-repository-reconciliation.md`.

## Routes in scope

### `/brief/`

Primary public noindex demonstration.

Required behavior:

- loads independently
- resolves to light mode on a clean first load
- preserves an intentional dark selection
- honors `?theme=light` and `?theme=dark`
- renders all five context choices
- opens the selected context
- exposes Today, Spaces, Memory, Goals, How, and Everything views
- provides usable desktop and mobile navigation
- links to `/doc/`
- labels fictional records and planned capabilities clearly
- avoids horizontal document overflow

### `/brief-next/`

Standalone public noindex staging and rollback copy.

Required behavior:

- loads independently without redirecting
- stays functionally aligned with `/brief/`
- retains its canonical link to `/brief/`
- uses the current shared asset chain
- passes the same theme, entry, navigation, and containment expectations

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

## Current source-level checks

The focused smoke coverage should verify:

- route metadata and noindex policy
- current asset references
- current theme storage keys and fallback behavior
- scenario-card entry contract
- all expected focused views and Everything view
- reciprocal `/brief/` and `/doc/` navigation
- Spotify readiness, timeout, and fallback source contracts
- absence of the `/doc/` gate
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
- no horizontal overflow
- `/doc/` CTA containment

### Cross-browser matrix

The maintained matrix should cover:

- Chromium desktop
- Firefox desktop
- WebKit desktop
- WebKit iPhone profile
- Chromium Android profile

The matrix should test the current `brief-demo-*` product. It must not fail because it expects selectors or modules removed from the shipping interface.

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

## Validation recorded on August 5

The August 5 pull requests for the current interface passed the relevant static, desktop, mobile, and multi-browser checks before merge. Later direct commits added focused Spotify-readiness and document-containment coverage.

During this documentation reconciliation, GitHub returned no combined-status entries for the final direct-commit head. Therefore this document does not claim that every workflow ran successfully against `0f869c5e9a14ffa44f2fe63b4bec419a445a5003` as one complete release candidate.

## Required release checklist

Before calling a future head ready for production:

1. Run current static smoke tests.
2. Run desktop and mobile Playwright tests.
3. Run the maintained cross-browser matrix.
4. Run `/brief-next/` focused validation.
5. Run `/doc/` smoke validation.
6. Run privacy, secret, navigation, and route-policy guards.
7. Confirm `/brief/` and `/brief-next/` parity or document intended differences.
8. Test the deployed domain after propagation.
9. Confirm no stale CDN asset versions are served.
10. Record the verified commit SHA and workflow results in current documentation.

## Known coverage gaps

- deployed-domain and CDN smoke testing
- first-paint theme flash detection
- explicit parity enforcement between `/brief/` and `/brief-next/`
- mocked Spotify controller lifecycle tests
- dependency inventory for legacy Brief assets
- automated documentation freshness checks

## Result format for future updates

Record:

- commit SHA
- routes tested
- static test result
- desktop/mobile result
- cross-browser result
- production-domain result
- known external-provider limitations
- remaining failures with links to logs or artifacts

Do not summarize a numeric browser status without explaining what ran and what failed.
