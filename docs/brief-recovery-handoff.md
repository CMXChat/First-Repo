# `/brief` Recovery and Stabilization Handoff

Last verified: **August 5, 2026 at 12:28 PM ET**

Repository: `CMXChat/First-Repo`  
Default branch: `main`

## Purpose of this file

This is the continuity document for the `/brief` recovery and stabilization work. Any new agent, model, developer, or context window working on `/brief` should read this file before editing code.

Update this document after every meaningful repair, test run, merge, branch change, or newly discovered blocker. Do not rely only on chat history.

This document records:

- the verified repository state
- the damage currently present on `main`
- the open PR dependency chain
- the bugs reported by Grok and reproduced by the browser suite
- the safe repair order
- the acceptance criteria for each phase
- work that must remain separate

The commit that created this file is documentation-only. It does not claim that any `/brief` code has been repaired.

---

## Critical warning

`assets/brief/brief-workspace.js` on `main` is incomplete and must be treated as damaged.

The current `main` file stops after a partial implementation and contains this explicit marker:

```js
// Remaining functions restored from good commit with depth API - see local /tmp for full if truncated
```

It then defines only a limited `setDepth` function and a small `window.BRIEF_WORKSPACE` API before closing the IIFE. The rendering, initialization, workspace construction, tab handling, preset handling, and other required functions are missing.

Verified repository blobs at the time of this handoff:

- damaged `main` blob: `ba934e55e8c671bb42cb092e7ca5d54d3adeff06`
- last known complete workspace blob: `5a0967ef6eca9f5b2e175a7ca0578b089c04fa86`
- known good commit containing the complete file: `b185daf`

The same complete workspace blob was also present on these branches when verified:

- `agent/brief-overlay-controls-fix`
- `agent/brief-personal-os-shell`

Do not paste a 30KB file through a channel that may truncate it. Do not overwrite `main` with content copied from an unverified chat response.

---

## Sources of truth

Use these in this order:

1. Current Git history and branch contents
2. Existing tests and workflow results
3. This handoff document
4. `docs/brief-interface-failures.md` for raw failure output
5. Grok's notes below as a reconstruction guide

Grok's temporary sandbox is **not** a durable source of truth.

Grok reported complete, syntax-checked Part 1 files at:

```text
/tmp/First-Repo-brief/assets/brief/
```

Reported files:

- `brief-workspace.js`
- `brief-navigation.js`
- `brief-config.js`
- `brief-core.js`
- `brief-onboarding.js`
- related onboarding CSS
- `brief-navigation.css`

Those files were not cleanly pushed and may no longer exist. Future work must reconstruct or independently implement the intended changes. Never assume `/tmp/First-Repo-brief/` is accessible in another session.

---

## Verified PR and branch map

Statuses below were verified on August 5, 2026. Recheck them before taking action because they can change.

### PR #35

Title: `Fix brief terminal and overlay controls`  
Branch: `agent/brief-overlay-controls-fix`  
Base: `main`  
State: open, not merged  
Head at verification: `b802b06d9f166f28b53503d42d3cf973b767d999`

This PR contains reusable overlay, terminal, switcher, tour, and related compatibility work. It currently depends directly on `main` and must be reassessed after the damaged workspace file is restored.

A clean merge status only means Git can combine the branches. It does not prove browser correctness.

### PR #37

Title: `Make Brief Full-first inside the Personal OS`  
Branch: `agent/brief-personal-os-shell`  
Base: `agent/brief-overlay-controls-fix`  
State: open draft, not merged  
Head at verification: `bbde6935b2654691ec2f1f8cf42b483b0b70efaf`

This PR is stacked on PR #35. It should not be merged before its dependency is corrected, tested, and merged or otherwise safely rebased.

The current browser matrix has been reported as failing. Re-run the actual workflows and inspect logs before changing test expectations.

### PR #34

Title: `Complete Goal Intelligence Step 3 and prepare Step 4`  
Branch: `agent/goal-intelligence-prototype`  
State: open draft

This work is intentionally separate. It should not be bundled into `/brief` recovery.

### PR #38

Title: `Add the Personal OS demo callout`  
Branch: `agent/personal-os-doc-demo-cta`  
State: open draft

This is primarily `/doc` work and should remain independently reviewable. Do not use it as a place to hide `/brief` recovery changes.

---

## Main surfaces involved

Primary page:

- `brief/index.html`

Important runtime modules include:

- `assets/brief/brief-config.js`
- `assets/brief/brief-core.js`
- `assets/brief/brief-system.js`
- `assets/brief/brief-workspace.js`
- `assets/brief/brief-navigation.js`
- `assets/brief/brief-polish.js`
- `assets/brief/brief-onboarding.js`
- device and viewport modules
- theme and theme-integrity modules
- corresponding CSS files under `assets/brief/`

Primary browser suite:

- `tests/brief-browser-e2e.spec.cjs`

Raw captured failures:

- `docs/brief-interface-failures.md`

Static smoke tests reportedly pass more consistently than the real browser matrix. Static success must not be treated as complete validation.

---

# Problem inventory

## P0: Damaged workspace module on `main`

### Symptom

`brief-workspace.js` contains only the beginning of the original implementation and a small partial ending. Required functions are missing.

### Risk

Any later fixes built directly on the damaged file may silently discard major product behavior. A partial file can also make unrelated symptoms appear to be navigation or CSS bugs.

### Required resolution

Restore the complete file from a known good Git source on an isolated recovery branch before implementing behavior changes.

### Acceptance criteria

- full workspace source is present
- JavaScript syntax passes
- workspace creates and initializes
- existing static tests do not regress
- the restore diff contains only the intended file recovery

---

## P1: Deep-link depth does not persist through entry

### Reproduction

Open a deep URL such as:

```text
/brief/?view=team&tab=handoffs&depth=full
```

The Team preset and tab may restore, but `body` remains:

```html
data-brief-depth="quick"
```

### Likely cause

Gate entry, preset restoration, workspace initialization, and navigation URL application all attempt to control state at different times. The requested depth is overridden by default initialization or preset-change behavior.

Known fragile patterns include:

- workspace initialization forcing `quick`
- preset change handlers resetting `state.depth` to `quick`
- navigation applying URL state later
- depth restoration depending on clicking a button that may not yet exist
- timed retries after gate exit

### Required resolution

Create one deterministic state path for requested preset, tab, and depth. Read requested depth early, preserve it while gated, and apply it after the workspace exists without a race between modules.

### Acceptance criteria

After entry from the deep URL:

- Team is selected
- Handoffs is selected
- `body.dataset.briefDepth === 'full'`
- Full remains selected after delayed scripts finish
- URL state remains correct
- reloading the same URL produces the same state

---

## P1: Full-only content remains hidden

### Symptom

Elements such as `.polish-team-flow` exist and may contain children with state classes such as `.is-complete`, but the browser reports them as hidden.

### Relevant CSS behavior

Quick mode hides `.polish-full-only` content:

```css
body[data-brief-depth='quick'] .polish-full-only {
  display: none;
}
```

### Root relationship

This is often a downstream result of the failed depth transition. Do not patch visibility in isolation until depth state is deterministic.

### Acceptance criteria

- requested full mode exposes all applicable full-only modules
- Team flow is visible in supported desktop and mobile projects
- no content is revealed in quick mode unless the product decision explicitly requires it
- tests and UX use the same depth contract

---

## P1: Mobile interactions detach or become unstable

### Symptoms

On Android and some constrained mobile runs:

- `[data-quick-route="day"]` becomes unstable or detached during click
- `#briefMapButton` becomes unstable or detached during click
- pointer events are intercepted by body-level or overlay elements
- tests time out after repeated click retries

### Likely causes

- modules recreate or redecorate controls after they become visible
- delayed initialization and preset retries replace DOM nodes
- map button creation is not idempotent
- quick-route decoration runs repeatedly
- overlays or backdrop layers retain pointer capture
- scrolling and visual viewport changes trigger further rendering

### Required resolution

- create interactive controls once
- update existing nodes in place
- make module initialization idempotent
- remove timed DOM replacement during active interaction
- verify overlay and backdrop pointer-event rules

### Acceptance criteria

- map button remains the same connected DOM node during click
- quick cards remain connected during click
- center hit-testing reaches the intended control
- no body, backdrop, or invisible panel intercepts the action
- Android tests do not require forced clicks

---

## P1: Tour, help, and navigation overflow constrained viewports

### Symptoms

Tour and help panels can extend below the visual viewport, especially on Android, iPhone, short-height windows, and landscape layouts.

Reported examples place panel bottoms near 1197 to 1250 pixels inside a viewport around 730 pixels tall.

### Likely causes

- fixed or minimum panel heights
- absolute positioning without visual viewport correction
- missing `max-height` and internal scrolling
- safe-area insets not included
- browser chrome changes not reflected after open
- navigation drawer overflow rules are incomplete

### Required resolution

Use visual viewport-aware sizing, safe-area padding, bounded panel height, and internal scrolling. Keep controls reachable at every supported height.

### Acceptance criteria

For tour, help, map, and navigation panels:

- left and top are within the viewport tolerance
- right and bottom are within the viewport tolerance
- content scrolls inside the panel when needed
- close and next controls remain reachable
- no horizontal page overflow is introduced

---

## P1: Light-theme contrast failures

### Symptoms

Representative cards, KPI text, charts, Team flow, map panels, and navigation surfaces can produce measured contrast ratios near `1`, below the current browser-suite requirement of at least `4`.

### Required resolution

Audit actual computed foreground and background colors in both themes. Fix the relevant design tokens and component-specific overrides without flattening the current visual identity.

### Acceptance criteria

- representative text contrast meets or exceeds the suite threshold
- light theme backgrounds pass the expected luminance checks
- dark theme remains readable
- disabled, muted, and secondary text remain distinguishable
- contrast fixes work across browsers, not only Chromium

---

## P2: Timeout-driven sequencing and race conditions

### Current pattern

Multiple modules use delays such as 40, 80, 120, 160, 180, 220, 250, 300, 420, 800, 850, and 1600 milliseconds to wait for:

- gate entry
- `BRIEF_APP`
- workspace creation
- preset changes
- depth changes
- tab selection
- URL updates
- scrolling
- navigation decoration
- team switcher creation

### Risk

Timing that works on desktop Chromium fails under slower mobile emulation, WebKit, CI load, or a changed script order.

### Required resolution

Replace sequencing waits with explicit lifecycle events or a single state coordinator. A short animation delay can remain for presentation, but it must not be required for correctness.

Suggested lifecycle contract:

- config parsed
- core ready
- gate entered
- workspace mounted
- requested state applied
- navigation mounted
- active view rendered

Grok intended to add a `brief:entered` event in `brief-config.js` and `brief-core.js`. Reconstruct and validate that behavior rather than assuming the unpushed files are available.

### Acceptance criteria

- correctness does not depend on arbitrary waits
- initialization is repeatable and idempotent
- preset, tab, and depth transitions each emit or use a defined event
- tests wait on observable state, not fixed sleep periods where avoidable

---

## P2: Fragile multi-module initialization

### Symptoms

Many IIFEs independently poll for `BRIEF_APP`, listen for `brief:ready`, retry initialization, or attach late handlers. This can produce partial UI:

- missing map button
- missing quick-route attributes
- stale depth
- stale tabs
- duplicated controls
- overlay state without a visible panel

### Required resolution

Document ownership of each state and make initialization idempotent. One module should own preset/tab/depth state. Other modules should subscribe and render without resetting it.

### Acceptance criteria

- each major control has one owner
- repeated initialization calls do not duplicate DOM
- late modules can hydrate existing state
- no module silently resets another module's state

---

## P2: Pointer-event and overlay stacking problems

### Symptoms

Invisible or misplaced overlays can intercept interactions. Earlier issues also left the page blurred while the intended terminal or panel remained hidden.

### Required resolution

Every overlay must have an explicit open and closed contract:

- visible panel exists before backdrop becomes interactive
- backdrop and panel stacking order is defined
- closed surfaces use `pointer-events: none`
- stale body classes are removed when a panel cannot render
- Escape and close controls restore the page

### Acceptance criteria

- no stranded blur state
- no invisible click interception
- switcher, tour, help, map, and retained overlays pass hit-testing
- opening and closing one surface does not strand another

---

## P2: Complexity, cache skew, and dual-mode conflicts

### Current risk

The original concept page and a much larger injected runtime coexist. Numerous versioned JS and CSS files can create:

- stale cached modules
- mismatched loaders
- style conflicts
- legacy and new mode assumptions running together
- tests targeting different product contracts

### Required resolution

Do not perform a broad rewrite during recovery. First restore a stable baseline, identify the intended production contract, then remove obsolete paths deliberately in separate changes.

### Acceptance criteria

- loader chain is explicit
- required navigation loads through the main path, not only a recovery path
- asset versions are updated consistently when files change
- legacy test modes remain intentionally supported or are retired with a documented decision

---

# Product intent to preserve

The recovery should keep the existing Personal OS concept and visual direction.

The goal is to make the current demo reliable and understandable, not to turn it into a generic dashboard.

The product should communicate:

- private personal profiles
- shared spaces with permission boundaries
- memory governed by rules
- connected services
- Quick and Full depth modes
- different operating views for individuals, couples, partners, trainers, and teams

Avoid vague product language. A new visitor should understand what each important module is for and why it exists.

---

# Required repair order

## Phase 0: Preflight and isolation

1. Re-read this handoff and inspect current branch/PR state.
2. Fetch the latest remote refs.
3. Do not begin from an unknown dirty worktree.
4. Create an isolated recovery branch from the intended base, normally current `main`.
5. Record the exact starting SHA in this document.
6. Capture the current failing workflow names and logs.
7. Keep documentation, recovery, behavior fixes, and visual polish in separate commits where practical.

Recommended branch name:

```text
agent/brief-recovery
```

## Phase 1: Restore the complete workspace file

On the isolated recovery branch, restore only:

```text
assets/brief/brief-workspace.js
```

Known source:

```bash
git checkout b185daf -- assets/brief/brief-workspace.js
```

Before committing:

- compare it with the complete file on PR #35
- compare it with the complete file on PR #37
- verify no desired later changes are lost
- run syntax checks and relevant static tests
- inspect the diff for unrelated edits

Suggested commit message:

```text
brief: restore complete workspace module
```

Do not push a partial file directly to `main`.

## Phase 2: Deterministic depth, preset, tab, and entry state

Implement the core reliability work in small changes:

1. Parse requested URL state early.
2. Preserve requested depth while the gate is active.
3. Emit or use an explicit gate-entry event such as `brief:entered`.
4. Mount the workspace.
5. Apply preset, tab, and depth through one owner.
6. Prevent preset initialization from resetting a requested full depth.
7. Update URL state once, after state is valid.
8. Make repeated calls safe.

Do not use a later synthetic button click as the only way to restore state.

## Phase 3: Stabilize navigation and mobile interaction

- make map button creation idempotent
- decorate quick cards without replacing them during interaction
- stop repeated DOM attachment cycles
- remove pointer interception from hidden layers
- ensure the navigation loader is in the normal application chain
- verify Android center hit-testing

## Phase 4: Fix viewport containment

- bound tour/help/nav panels to the visual viewport
- add internal scrolling where needed
- account for safe-area insets
- handle short-height and landscape layouts
- ensure controls stay reachable

## Phase 5: Run the complete browser matrix

Do not merge after only static smoke tests.

At minimum cover:

- Chromium desktop
- Firefox desktop
- WebKit desktop
- iPhone project
- Android Chromium project
- light theme
- dark theme
- standard entry
- deep-link entry
- gate-present path
- gate-absent or compatibility path where supported
- `browser-test=1`
- `finalization-test=1`
- `theme-sweep=1`

Required deep-link case:

```text
/brief/?view=team&tab=handoffs&depth=full
```

## Phase 6: Resolve PR #35

After the recovery branch is correct:

1. Determine whether PR #35 should be rebased, updated, or partially superseded.
2. Preserve valid overlay and terminal/switcher repairs.
3. Confirm its legacy and browser compatibility contracts.
4. Run its full relevant matrix.
5. Merge only when the dependency and test state are clear.

## Phase 7: Resolve PR #37

Only after PR #35's dependency is settled:

1. update PR #37 onto the corrected base
2. resolve behavior differences intentionally
3. keep Full-first product decisions separate from basic recovery where possible
4. run the Personal OS and compatibility suites
5. verify scrolling, action hierarchy, entry behavior, and no stranded blur
6. review the final diff before merge

## Phase 8: Demo clarity

After reliability is stable:

- improve entry-gate copy
- add or refine an optional short walkthrough
- explain private profiles, shared spaces, governed memory, connected services, and depth modes
- add concise labels or tooltips where users currently get lost
- preserve the current concept and visual character

## Phase 9: Contrast and remaining polish

- repair light-theme contrast
- handle remaining mobile layout edges
- remove flaky selectors and obsolete waits
- verify cache/version consistency

---

# Merge order

The expected order is:

1. documentation handoff
2. isolated workspace recovery
3. deterministic Part 1 reliability fixes
4. corrected PR #35 or its reviewed equivalent
5. updated PR #37
6. demo clarity and remaining visual polish

PR #34 Goal Intelligence work and PR #38 `/doc` callout work should remain separate unless a later explicit decision changes their scope.

---

# Do not do these things

- Do not paste a large source file through a channel known to truncate output.
- Do not assume Grok's `/tmp` files still exist.
- Do not push directly to `main` before reviewing the restore diff.
- Do not merge PR #37 before resolving its PR #35 dependency.
- Do not treat `mergeable: true` as proof that tests pass.
- Do not weaken or delete browser assertions merely to produce green checks.
- Do not hide full-only content permanently to bypass a state bug.
- Do not add more correctness-critical `setTimeout` chains.
- Do not replace the product with a generic dashboard during stabilization.
- Do not bundle Goal Intelligence, backend work, authentication, connectors, or AI into this repair.
- Do not claim deployment success until the live `/brief` route has been manually verified after merge.

---

# Definition of done

The `/brief` recovery is complete only when all of the following are true:

- `main` contains a complete, reviewed workspace module
- normal entry works without stranded lock or blur states
- deep links restore preset, tab, and depth deterministically
- full-only Team content is visible in Full mode
- quick cards and the map button remain stable during mobile interaction
- tour, help, map, and navigation panels stay within supported viewports
- light and dark representative surfaces meet the test contrast threshold
- initialization is idempotent
- timed sequencing is no longer required for core correctness
- relevant static tests pass
- the full browser matrix passes across supported projects
- PR #35 and PR #37 have a clear, tested merge history
- the live page is verified after deployment
- this handoff is updated with final SHAs, PRs, and test results

---

# Immediate next action

The next code-changing context should begin with this exact limited task:

1. Create `agent/brief-recovery` from the latest intended `main`.
2. Restore only `assets/brief/brief-workspace.js` from `b185daf`.
3. Compare the restored file against PR #35 and PR #37.
4. Run syntax and existing smoke validation.
5. Commit the recovery separately.
6. Update this document with the branch, commit SHA, and test result before starting behavioral fixes.

---

# Handoff update template

Append new entries below using this format:

```markdown
## Update: YYYY-MM-DD HH:MM TZ

- Context/agent:
- Starting branch and SHA:
- Files changed:
- What was fixed:
- Tests run:
- Tests passed:
- Tests still failing:
- Commit SHA:
- PR number:
- Next exact action:
- Risks or unresolved decisions:
```

---

## Update: 2026-08-05 12:28 ET

- Context/agent: ChatGPT
- Starting branch and SHA: documentation written against current `main`; code SHA should be rechecked before repair
- Files changed: `docs/brief-recovery-handoff.md`
- What was fixed: no product code; created durable continuity and recovery plan
- Tests run: none, documentation-only change
- Tests passed: not applicable
- Tests still failing: browser matrix remains unresolved; `main` workspace file remains damaged
- Commit SHA: recorded by the GitHub file creation commit
- PR number: none
- Next exact action: create an isolated recovery branch and restore the complete workspace module
- Risks or unresolved decisions: final treatment of PR #35 and PR #37 must follow test-backed comparison after recovery
