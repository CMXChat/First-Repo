# Brief Goal Intelligence Worklog

**Purpose:** Durable continuation record for the future `/brief` Goal Intelligence project.  
**Created:** August 4, 2026  
**Last updated:** August 4, 2026  
**Repository:** `CMXChat/First-Repo`  
**Working branch:** `agent/goal-intelligence-prototype`  
**Draft PR:** `#34`  
**Prototype route:** `/goals-lab/`  
**Current roadmap position:** Step 3 complete; Step 4 prepared and ready to begin  
**Latest validated prototype implementation:** `72bb4c040eb9a0f1a7b3ccdffb3a8581ffc84614`  
**Step 3 closeout commit:** `041ae2e8810775eeb3ccce7db21824788cb056a3`  
**Step 4 plan commit:** `ed0e9c2ef18bdc4595add278ba1792b220b3e5aa`  
**Separate `/brief` bugfix PR:** `#35`, draft, not merged  
**Separate `/brief` Personal OS PR:** `#37`, draft, based on PR `#35`, not merged  
**Production boundary:** Goal Intelligence work does not touch `/brief` until its later integration phase.

## How Future Context Windows Should Continue

Read these files in order:

1. `docs/concepts/brief-goal-intelligence-worklog.md`
2. `docs/concepts/goal-intelligence-step-4-engine-plan.md`
3. `docs/concepts/goal-intelligence-step-3-closeout-2026-08-04.md`
4. `docs/concepts/brief-goal-intelligence-concept-2026-08-04.md`
5. `docs/concepts/goal-intelligence-step-3-prototype-2026-08-04.md`
6. Draft PR `#34`
7. For the overlay repair, read PR `#35` and `docs/brief-overlay-controls-fix-2026-08-04.md` on branch `agent/brief-overlay-controls-fix`
8. For the Personal OS redesign, read PR `#37` and `docs/brief-personal-os-redesign-2026-08-04.md` on branch `agent/brief-personal-os-shell`

Use this worklog as the current operational status. The dated concept file explains the larger idea. The Step 3 files preserve prototype evidence and decisions. The Step 4 plan defines the next implementation phase. The `/brief` interface work remains separate from the Goal Intelligence engine.

## Current Decision

Step 3 is closed successfully.

The prototype proved the smallest useful loop:

```text
Goal Pulse
  ↓
Quick check-in
  ↓
One useful question
  ↓
One recommended action
  ↓
Outcome or evidence
  ↓
Updated state
```

The page was simplified so daily guidance stays prominent while planning context, evidence and history remain available through expanders.

## Completed Roadmap Work

### Step 0

- Preserved the dated concept.

### Step 1

- Defined the MVP interaction and acceptance criteria.

### Step 2

- Drafted the structured data model for goals, milestones, check-ins, questions, answers, recommendations, outcomes, evidence, trajectory, confidence, privacy and history.

### Step 3

- Built `/goals-lab/` as an isolated browser prototype.
- Added five difficulty modes, check-ins, one active question, recommendations, outcomes, evidence, Goal Pulse, state history and browser persistence.
- Added desktop Chromium and Pixel 5 Playwright coverage.
- Fixed immediate repeated-question behavior.
- Reordered the interface around daily use.
- Collapsed full planning and record-management surfaces by default.
- Added bounded Sprint mode with a required end date.
- Passed browser, static, privacy, secret, navigation and terminal-theme checks.
- Formally closed Step 3 and approved advancement to Step 4.

## Step 4 Objective

Extract the deterministic goal rules into a pure, testable engine that accepts structured state and explicit events, then returns structured results without reading or changing the DOM.

The engine must eventually own:

- Difficulty and effort calculation
- Trajectory and confidence
- Question selection
- Repeated-question prevention
- Recommendation selection
- Sprint expiry
- Check-in, outcome and evidence transitions
- Validation and history events

The first implementation action is to extract difficulty, effort, trajectory and confidence into pure functions with unit tests.

## Step 4 Boundary

Do not add these during Step 4:

- FastAPI
- PostgreSQL
- Authentication
- Connected accounts
- AI model calls
- `/brief` integration

## Separate `/brief` Overlay Repair

Branch: `agent/brief-overlay-controls-fix`  
Draft PR: `#35`  
Status: Implemented and validated in draft; not merged or deployed

The repair:

- portals the terminal to `document.body`
- gives it explicit body-level visibility and stacking states
- restores input focus after late page scripts
- preserves header and dock triggers, close button, Escape, and command submission
- adds regression coverage for the top-left switcher, terminal, More menu, tour, and sequential open and close flows

Validated flows include desktop Chromium, Pixel 5 sizing, a real `help` command, the complete briefing smoke chain through media and polish, and repository static, privacy, secret, navigation, and terminal-theme guards.

## Separate `/brief` Personal OS Redesign

Branch: `agent/brief-personal-os-shell`  
Draft PR: `#37`  
Base branch: `agent/brief-overlay-controls-fix`  
Status: Major interaction redesign validated in desktop Chromium and Pixel 5; not merged or deployed

The user rejected the continuous report as the default interaction model. PR `#37` changes `/brief` into a Personal OS shell with one active function application at a time.

The redesign includes:

- a fixed operating viewport instead of default document scrolling
- a compact desktop application rail
- a six-application mobile bottom dock
- animated horizontal application transitions
- Previous, Next, contextual next actions, keyboard arrows, touch swipe, and URL state
- an optional Guided Flow that advances once and stops at System
- scenario-specific labels for Personal, Relationship, Business, Trainer, and Team
- compact command, timeline, action queue, privacy boundary, intelligence, and system screens
- explicit deep-detail mode for the old continuous report
- a fixed Return to Personal OS control
- a density pass based on an actual mobile failure screenshot
- a compact mobile briefing switcher, terminal control, and More control

The six function IDs are:

1. `today`
2. `day`
3. `actions`
4. `spaces`
5. `intelligence`
6. `system`

The exact labels adapt to the active briefing type.

The dedicated Personal OS suite validates desktop and mobile viewport lock, measured mobile density, animated navigation, context-aware next actions, keyboard movement, detail return, terminal use, briefing switching, overflow protection, and guided flow completion.

The Personal OS PR contains only shell, loader, style, test, workflow, and documentation files. It does not touch Goal Intelligence, backend code, connected data, or unrelated routes.

## Deferred `/brief` Work

These remain separate from PRs `#35` and `#37`:

- browser autoplay restrictions and the music-failure message
- Goal Intelligence Step 4
- backend, authentication, database, connector, and AI work
- later integration of Goal Intelligence into the Personal OS

## Current Next Actions

1. Keep PR `#35` and PR `#37` as separate drafts until reviewed.
2. Review and merge PR `#35` before retargeting PR `#37` to `main`.
3. Begin Goal Intelligence Step 4 Part 1 on PR `#34` by extracting pure difficulty, effort, trajectory, and confidence rules with unit tests.
4. Do not combine Step 4 engine changes with `/brief` interface files.
5. Integrate Goal Intelligence into the Personal OS only during a later approved integration phase.

## Update Discipline

After each meaningful part:

1. Update the roadmap position.
2. Record completed work and defects.
3. Replace Current Next Actions with the exact continuation point.
4. Include relevant branch, PR and validated commit information.
5. Keep Goal Intelligence, overlay repair, and Personal OS changes in separate PRs.

This is a living progress record, not a permanent rulebook.
