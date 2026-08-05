# `/brief` Current Recovery and Simplification Status

Last updated: **August 5, 2026 at 1:02 PM ET**

Read this file first. Then read:

- `docs/brief/PHASE-1-WORKLOG.md` for the active Brief Next implementation record
- `docs/brief/DEMO-SIMPLIFICATION-STRATEGY.md` for the approved product strategy
- `docs/brief-recovery-handoff.md` for the original recovery history and bug inventory
- `docs/brief/README.md` for the documentation index

## Active work

```text
Repository: CMXChat/First-Repo
Active branch: agent/brief-demo-v2
Active route: /brief-next/
Base branch: agent/brief-recovery-step-1
Baseline draft PR: #41
Production /brief changed: no
```

The active branch is intentionally stacked on the restored baseline while PR #41 remains unmerged.

## Product direction

The target is **complex simplicity**.

The new demonstration should feel polished and useful enough for repeated daily use while remaining immediately understandable.

Keep:

- the strong weather experience
- compact stats and useful movement
- navigation between views instead of forcing one long scroll
- a deeper workspace with one category visible at a time
- five distinct use cases through one stable interface
- private profiles and approved shared Spaces
- one soundtrack experience
- one Spotify provider player
- light and dark themes
- enough detail to reward repeat visits

Remove from the new architecture:

- command-line navigation
- terminal state ownership
- multiple competing app shells
- duplicate depth systems
- duplicate Spotify embeds
- hidden duplicate dashboards
- timeout chains required for correctness
- normal content spread across dozens of runtime files

## `/doc` vision carried into the new demo

The Daily Briefing is the visible experience.

The foundation behind it includes:

- goals
- Spaces
- approved connections
- automations
- memory and corrections
- privacy and permissions
- a user-owned intelligence layer for chosen AI assistants

The new route demonstrates this model through a concise application instead of copying the full product document into the primary user path.

## Phase 1 progress

### Completed

```text
assets/brief-next/brief-demo-data.js
brief-next/index.html
assets/brief-next/brief-demo.css
assets/brief-next/brief-demo-app.js
assets/brief-next/brief-demo-media.js
assets/cmx-routes.json
tests/brief-next-smoke.test.js
tests/brief-next.spec.cjs
tests/brief-next.playwright.config.cjs
.github/workflows/brief-next-validation.yml
docs/brief/PHASE-1-WORKLOG.md
```

### What exists now

- deliberate five-context entry
- optional soundtrack request
- sticky product header
- desktop navigation rail
- mobile bottom navigation
- scenario switcher
- Today view
- large weather section
- four compact stats per Space
- recommendation and daily flow
- one deeper Workspace view
- private and shared Spaces view
- concise Personal OS foundation view
- one media drawer
- one Spotify iframe
- one app state owner
- one media state owner
- no terminal or command-line code
- no app correctness based on timeouts
- isolated static and desktop/mobile tests

## File ownership

```text
brief-demo-data.js
  copy, scenarios, weather, stats, tabs, Spaces and soundtrack metadata

brief-demo-app.js
  entry, scenario, view, tab, theme, URL and rendering state

brief-demo-media.js
  one preview audio position, one Spotify player and media drawer

brief-demo.css
  the full responsive visual system

brief-next/index.html
  stable semantic surfaces only
```

## Media status

The architecture now makes the soundtrack request directly from the user’s Open demo click.

Current records do not contain authorized preview URLs, so Phase 1 reports that honestly and keeps Spotify as a direct-tap provider player.

Still required in the dedicated media phase:

- authorized preview media
- verified audible entry playback
- browser-specific autoplay fallback behavior
- Spotify iFrame API integration
- provider control testing

## Validation status

The focused validation files and workflow exist, but the new branch does not have a draft PR or completed CI result yet.

The new workflow will test:

- JavaScript parsing
- editable scenario structure
- absence of terminal architecture
- one stylesheet and three scripts
- one Spotify iframe
- desktop entry and navigation
- weather and stats
- scenario switching
- workspace tabs
- Spaces
- mobile navigation and overflow
- theme switching
- reversible reset

## Legacy branch decisions

### PR #41

Keep as the restored baseline and continuity record.

### PR #35

Do not merge automatically into the new demo. Reuse only focused pieces if the new architecture independently needs them.

### PR #37

Pause as a product direction. It expands the larger Personal OS shell that the new route is replacing with a smaller ownership model.

### PR #38

Keep separate because its `/doc` privacy-audit work is unrelated to the new Brief Next runtime.

## Exact next action

1. Open a stacked draft PR from `agent/brief-demo-v2` to `agent/brief-recovery-step-1`.
2. Trigger and inspect Brief Next Validation.
3. Record workflow and job IDs.
4. Fix focused failures without importing the legacy terminal, overlay or depth architecture.
5. Update this file and `PHASE-1-WORKLOG.md` after the result.

Do not replace production `/brief` during Phase 1.
