# `/brief` Current Recovery and Simplification Status

Last updated: **August 5, 2026 at 12:50 PM ET**

Read this file first. Then read:

- `docs/brief/DEMO-SIMPLIFICATION-STRATEGY.md` for the approved planning direction
- `docs/brief-recovery-handoff.md` for the complete recovery history and bug inventory
- `docs/brief/README.md` for the documentation index

## Current repository state

```text
Repository: CMXChat/First-Repo
Branch: agent/brief-recovery-step-1
Draft PR: #41
PR title: Restore complete /brief workspace baseline
PR base: main
PR state: open draft
PR mergeable calculation: true
```

The branch head changes when continuity documentation is updated. Check PR #41 for the latest head SHA.

The stable product recovery commit remains:

```text
0b3cba3de40434ac24598580bd9f38790036e58a
brief: restore complete workspace module
```

The restored workspace blob remains:

```text
5a0967ef6eca9f5b2e175a7ca0578b089c04fa86
```

## New product direction

The intended destination for `/brief` is now a focused, editable, reversible demonstration of what the product can become.

The goal is not to preserve every current interaction on the primary path. The goal is to:

- make the demo understandable within the first minute
- keep all five use cases without rendering all five at once
- reduce the number of state owners and runtime layers
- make most copy and scenario changes editable in one data file
- rebuild soundtrack behavior around a direct user gesture
- use one Spotify provider player
- preserve the existing implementation as a rollback and reference point
- perform every change in small documented checkpoints

The complete strategy is recorded in:

```text
docs/brief/DEMO-SIMPLIFICATION-STRATEGY.md
```

No simplified-demo product code has been created yet.

## Architecture assessment

The visible current loader chain uses roughly:

```text
4 stylesheets loaded directly by brief/index.html
12 scripts loaded directly by brief/index.html
12 stylesheets loaded by brief-config.js
18 scripts loaded by brief-config.js
2 stylesheets and 1 script loaded by brief-lite-ui.js
```

That is approximately 49 CSS and JavaScript resources from the visible chain alone.

The current application also has overlapping ownership across:

- `brief-core.js`
- `brief-workspace.js`
- `brief-system.js`
- entry, device, onboarding, upgrade, live, daily, experience, terminal, relationship, team, polish, and overlay layers

Several of these layers change the same profile, entry, scroll, depth, tab, URL, navigation, and media states. This is the main architectural problem.

## Media assessment

Current music behavior is divided across:

- the entry checkbox
- preview audio in `brief-core.js`
- the header audio button
- the music-section preview button
- the featured Spotify iframe
- recommendation cards that replace the featured iframe
- additional Spotify iframes created by `brief-daily.js`
- narration and music-volume coordination

The entry flow also uses delayed opening and competing handlers. The simplified version should call preview `audio.play()` directly inside the entry click that the user initiated.

Spotify should use one embed or iFrame API controller and remain a user-controlled provider player. The demo should not promise that Spotify itself can autoplay in every browser.

## Current validation snapshot

### Passed on recent PR #41 heads

```text
CMX Static Validation
CMX Secret Scan
CMX Navigation Link Guard
CMX Terminal Theme Guard
```

### Known inherited failure: combined `/brief` smoke workflow

Root failure:

```text
ReferenceError: MutationObserver is not defined
```

Classification:

- Node VM test harness deficiency
- not caused by the restored workspace blob
- focused mock update already exists on PR #35

### Known unrelated failure: CMX Privacy Audit

Root failure:

```text
doc/index.html is not recognized as using the Black Prompt Gate contract
```

Classification:

- `/doc` audit contract issue
- unrelated to the restored `/brief` workspace
- focused audit update already exists on PR #38

### Browser Matrix

Latest inspected run:

```text
Run: 31026970607
Job: 92377811749
State at checkpoint: in progress
```

The browser engines were installed and the Chromium, Firefox, WebKit, iPhone, and Android step was still running. This file must be updated when a completed result is available.

## PR direction

### PR #41

Keep as the restored baseline and continuity record. Do not turn it into the full simplification rewrite.

### PR #35

Pause automatic merge. Review for small reusable pieces, especially the Node browser mocks. Do not inherit the complete overlay and terminal architecture by default.

### PR #37

Pause as a product branch. The new direction favors a smaller architecture instead of expanding the current Personal OS shell.

### PR #38

Keep separate. Its privacy-audit adjustment may still be useful independently for `/doc`.

## Proposed implementation phases

```text
Phase 0: preserve and understand the restored baseline
Phase 1: build a parallel reversible demo foundation
Phase 2: consolidate the content and user story
Phase 3: rebuild preview autoplay and Spotify behavior
Phase 4: visual polish, accessibility, and editability
Phase 5: review and cut over to /brief
Phase 6: remove obsolete layers deliberately
```

## Exact next approval requested

Approve **Phase 1: Build the reversible demo foundation**.

Phase 1 will:

1. Create a new branch named `agent/brief-demo-v2` from the accepted baseline.
2. Build a parallel `brief-next/` surface and `assets/brief-next/` asset folder.
3. Use one scenario state, one app controller, one media controller, one data file, and one stylesheet.
4. Implement the simple entry choice, one overview, one detail workspace, and all five profiles through the same layout.
5. Include one media slot but postpone final autoplay and Spotify integration to Phase 3.
6. Add focused desktop and mobile tests.
7. Leave the current `/brief` untouched.
8. Update this file after every meaningful commit and test result.

Approval does not authorize deleting the current `/brief`, merging PR #35 or PR #37, or replacing the production route.