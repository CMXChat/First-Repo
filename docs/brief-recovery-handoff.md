# `/spaces` Current Handoff

Last reconciled: **August 5, 2026**  
Repository: `CMXChat/First-Repo`  
Verified product baseline: `5c7eef899f3357854492e2d3918f5915eb536b6b`

## Current status

`main` is not in the damaged state described by the previous version of this file. The old recovery instructions, stacked PR dependency map, and requirement to restore `brief-workspace.js` are superseded.

The shipping `/spaces/` experience is a focused standalone Spaces demo built from the `brief-demo-*` assets. `/brief/` is a state-preserving compatibility redirect, `/brief-next/` is a pre-migration rollback snapshot, and `/doc/` is the connected public noindex product overview.

Read `docs/2026-08-05-repository-reconciliation.md` for the full comparison and remaining gaps.

## Current route contract

### `/spaces/`

- primary public noindex demo
- light in the initial HTML and theme resolver
- manual dark mode remains available and persists
- six contexts: Personal, Relationship, Family, Business, Trainer, and Team
- focused Today, Workspace, Spaces, How, and Everything views
- Personal habit tracking and Family household coordination examples
- optional Everything view
- links to `/doc/` at entry and in the How view
- Spotify soundtrack integration with readiness and fallback behavior
- keyboard-aware workspace tabs
- predictable focus when returning to entry
- plain-language visible copy protected by rendered-copy checks

### `/brief-next/`

- public noindex pre-migration rollback snapshot
- must remain independently loadable

### `/brief/`

- legacy compatibility route
- redirects to `/spaces/`
- preserves query and hash state when JavaScript is available

### `/doc/`

- public direct-link product overview
- noindex and nofollow
- light by default
- no password gate or Black Prompt Gate assets
- links to `/spaces/`
- plain-language product copy

## Shipping asset chain

The current `/spaces/` page loads:

- `assets/brief/brief-demo-data.js`
- `assets/brief/brief-demo-experience.js`
- `assets/brief/brief-demo-media.js`
- `assets/brief/brief-demo-app.js`
- `assets/brief/brief-demo-explainers.js`
- `assets/brief/brief-demo.css`
- `assets/brief/brief-demo-experience.css`
- `assets/brief/brief-demo-explainers.css`
- `assets/brief/brief-demo-doc-links.css`

Do not assume the older modular files under `assets/brief/` are part of the shipping page. Check the route HTML before editing or deleting legacy modules.

## Theme contract

The Brief theme resolver uses `personal_os_brief_theme_v2`.

Resolution order:

1. explicit `?theme=light` or `?theme=dark`
2. saved `personal_os_brief_theme_v2`
3. light

Only the saved value `dark` forces dark mode. Old keys and invalid values do not override the light default. The HTML shell also begins in light mode, so a clean load does not depend on deferred JavaScript to avoid a dark first paint.

## Spotify entry contract

When entry soundtrack is enabled:

- the provider controller remains mounted while the drawer is visually closed
- the selected track is loaded before entry
- the Open demo button waits for track readiness
- the Open demo click requests playback
- API timeout falls back to the standard Spotify frame
- rejected automatic playback exposes a direct-play route
- later fixes protect fallback behavior and readiness timing

Do not promise universal autoplay. Browser policy, Safari, Spotify state, device policy, and provider response can require a manual tap.

## Interaction contract

- scenario cards support the current entry flow
- workspace tabs expose correct selected state
- supported arrow-key behavior moves through tabs
- returning to the entry screen restores focus to a useful control
- reset behavior must not strand focus inside hidden application content
- visible copy should stay direct and easy to understand

## Current validation ownership

Primary checks include:

- current Brief static smoke coverage
- desktop and mobile Playwright coverage
- Chromium, Firefox, WebKit, iPhone, and Android matrix coverage
- `/brief-next/` smoke and Playwright coverage
- Personal OS document smoke coverage
- rendered-copy checks for Brief and Doc
- keyboard, focus, media fallback, and mobile containment assertions
- privacy, secret, navigation, and theme guards

Before a release claim, run or verify the relevant workflows against the current head and test the deployed domain after propagation.

## Safe change sequence

1. Recheck `main` and the active route HTML.
2. Confirm whether the change belongs to `/brief/`, `/brief-next/`, `/doc/`, or shared assets.
3. Create a branch from the latest `main`.
4. Keep production and staging parity intentional.
5. Update focused static and browser tests with the implementation.
6. Verify light and dark behavior.
7. Verify keyboard and focus behavior.
8. Verify desktop and narrow mobile containment.
9. Verify noindex and route policy.
10. Update asset versions when cache behavior requires it.
11. Update current documentation with the merged commit.

## Do not do this

- Do not restore the old workspace module because this document once said `main` was damaged.
- Do not reintroduce a password gate to `/doc/` without an explicit product decision.
- Do not treat noindex as privacy or authentication.
- Do not delete legacy Brief assets without a dependency inventory.
- Do not weaken tests to preserve selectors from the retired interface.
- Do not describe static fictional data as connected private user data.
- Do not assume same-version asset URLs will always bypass browser or edge cache.

## Current open risks

- deployed domain and CDN behavior are not covered by local tests
- `/brief/` and `/brief-next/` can drift without a parity guard
- Spotify behavior depends on an external provider and browser policy
- old Brief modules remain beside the current architecture
- asset-version updates are not enforced after every same-day code revision
- accessibility has improved but has not received a complete audit
- the product has no real backend, account system, persistent memory, or live connector layer yet

## Source of truth order

1. current source and route registry
2. current tests and workflow results
3. `docs/2026-08-05-repository-reconciliation.md`
4. this handoff
5. older standards and dated concept documents
