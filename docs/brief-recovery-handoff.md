# `/brief` Current Handoff

Last reconciled: **August 5, 2026**  
Repository: `CMXChat/First-Repo`  
Verified code baseline: `0f869c5e9a14ffa44f2fe63b4bec419a445a5003`

## Current status

`main` is not in the damaged state described by the previous version of this file. The old recovery instructions, stacked PR dependency map, and requirement to restore `brief-workspace.js` are superseded.

The shipping `/brief/` experience is now a focused standalone Personal OS demonstration built from the `brief-demo-*` assets. `/brief-next/` is retained as a full staging and rollback copy. `/doc/` is the connected public noindex product overview.

Read `docs/2026-08-05-repository-reconciliation.md` for the full change history and remaining gaps.

## Current route contract

### `/brief/`

- primary public noindex demonstration
- light is the intended default
- manual dark mode remains available and persists
- five selectable contexts: Personal, Relationship, Business, Trainer, and Team
- focused Today, Spaces, Memory, Goals, and How views
- optional Everything view
- links to `/doc/` at entry, in the header, and in the How view
- Spotify soundtrack integration with readiness and fallback behavior

### `/brief-next/`

- public noindex staging and rollback copy
- currently uses the same HTML blob and shared assets as `/brief/`
- canonical points to `/brief/`
- must remain independently loadable

### `/doc/`

- public direct-link product overview
- noindex and nofollow
- light by default
- no password gate or Black Prompt Gate assets
- links to `/brief/`

## Shipping asset chain

The current `/brief/` and `/brief-next/` pages load:

- `assets/brief/brief-demo-data.js`
- `assets/brief/brief-demo-experience.js`
- `assets/brief/brief-demo-media.js`
- `assets/brief/brief-demo-app.js`
- `assets/brief/brief-demo-explainers.js`
- `assets/brief/brief-demo.css`
- `assets/brief/brief-demo-experience.css`
- `assets/brief/brief-demo-explainers.css`
- `assets/brief/brief-demo-doc-links.css`

Do not assume the older modular files under `assets/brief/` are part of the shipping page. Check `brief/index.html` before editing or deleting legacy modules.

## Theme contract

The Brief theme resolver uses `personal_os_brief_theme_v2`.

Resolution order:

1. explicit `?theme=light` or `?theme=dark`
2. saved `personal_os_brief_theme_v2`
3. light

Only the saved value `dark` forces dark mode. Old keys and invalid values no longer override the light default.

Known refinement: the HTML still starts with `data-theme="dark"` before deferred JavaScript applies the resolved theme. This can create a short dark flash on slower devices.

## Spotify entry contract

When entry soundtrack is enabled:

- the provider controller remains mounted while the drawer is visually closed
- the selected track is loaded before entry
- the Open demo button waits for track readiness
- the Open demo click requests playback
- API timeout falls back to the standard Spotify frame
- rejected automatic playback opens the drawer for one direct tap

Do not promise universal autoplay. Browser policy, Safari, Spotify state, device policy, and provider response can require a manual tap.

## Current validation ownership

Primary checks include:

- current Brief static smoke coverage
- desktop and mobile Playwright coverage
- Chromium, Firefox, WebKit, iPhone, and Android matrix coverage
- `/brief-next/` smoke and Playwright coverage
- Personal OS document smoke coverage
- privacy, secret, navigation, and theme guards

Before a release claim, run or verify the relevant workflows against the current head. The latest direct commit did not return a combined GitHub status payload during the documentation reconciliation.

## Safe change sequence

1. Recheck `main` and the active route HTML.
2. Confirm whether the change belongs to `/brief/`, `/brief-next/`, `/doc/`, or shared assets.
3. Create a branch from the latest `main`.
4. Keep production and staging parity intentional.
5. Update focused static and browser tests with the implementation.
6. Verify light and dark behavior.
7. Verify desktop and narrow mobile containment.
8. Verify noindex and route policy.
9. Update current documentation with the merged commit.

## Do not do this

- Do not restore the old workspace module because this document once said `main` was damaged.
- Do not reintroduce a password gate to `/doc/` without an explicit product decision.
- Do not treat noindex as privacy or authentication.
- Do not delete legacy Brief assets without a dependency inventory.
- Do not weaken tests to preserve selectors from the retired interface.
- Do not describe static fictional data as connected private user data.

## Current open risks

- possible dark flash before the light resolver runs
- `/brief/` and `/brief-next/` can drift without a parity guard
- Spotify behavior depends on an external provider and browser policy
- local CI does not prove the deployed domain and CDN are correct
- old Brief modules remain beside the current architecture
- the product has no real backend, account system, persistent memory, or live connector layer yet

## Source of truth order

1. current source and route registry
2. current tests and workflow results
3. `docs/2026-08-05-repository-reconciliation.md`
4. this handoff
5. older standards and dated concept documents
