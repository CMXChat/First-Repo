# Goal Intelligence Step 3 Prototype

**Created:** August 4, 2026  
**Last revised:** August 4, 2026  
**Project:** `db.cmxchat.com` / future `/brief` goal intelligence layer  
**Roadmap step:** Step 3, isolated frontend prototype  
**Implementation slice:** Parts 1, 2, and 3 complete  
**Branch:** `agent/goal-intelligence-prototype`  
**Draft PR:** `#34`  
**Prototype route:** `/goals-lab/`  
**Status:** Implemented, simplified, and browser-validated on the draft branch  
**Authority:** This file records the prototype. It does not authorize changes to `/brief` or production data flows.

## Continuation Record

The current operational status is maintained in:

- `docs/concepts/brief-goal-intelligence-worklog.md`

Future context windows should read the worklog first, then this report, then the original dated concept file.

## Purpose

Step 3 tests the smallest useful goal loop before adding FastAPI, PostgreSQL, connectors, or AI model reasoning.

The prototype asks whether structured goals, short check-ins, one useful question, evidence, and one recommended action can create a useful daily operating loop.

## Part 1: Isolated Frontend Prototype

The first `/goals-lab/` implementation added:

- One editable goal
- Desired outcome, motivation, baseline, success definition, priority, visibility, and milestone fields
- A five-level difficulty control
- A structured check-in
- One active question at a time
- Deterministic question and recommendation selection
- One primary recommendation at a time
- Recommendation effort, purpose, expected result, milestone, confidence, and evidence basis
- Outcome recording
- Evidence records kept separate from user claims
- Trajectory and confidence labels
- State and revision history
- A compact Goal Pulse
- Local browser persistence
- Responsive dark and light layouts
- Reduced-motion and forced-colors support

## Part 2: Browser Validation and Loop Repair

Part 2 added a dedicated Playwright workflow for:

- Chromium desktop
- Chromium using Pixel 5 mobile emulation

The browser suite confirmed:

- Clean loading without JavaScript errors
- No horizontal overflow on desktop or mobile
- Goal editing and reload persistence
- Difficulty and workload changes
- Check-in updates to blockers, questions, recommendations, effort, and history
- Evidence and trajectory updates
- Recommendation outcomes
- Theme switching
- Section navigation

### Part 2 Defects and Corrections

#### Test cleanup erased persisted state

The first persistence test cleared `localStorage` during every reload. The test now clears state once before the test and allows later reloads to preserve edits.

#### Low-energy effort expectation was wrong

The prototype rounds 65 percent of a 10-minute capacity to 7 minutes. The browser expectation was corrected.

#### Answered blocker questions repeated

The deterministic selector could regenerate the same high-priority blocker question immediately after it was answered.

The repair checks answer history and advances to a distinct follow-up question. The advancement is recorded in state history.

## Part 3: Product Review and Simplification

Part 3 reviewed whether the prototype felt like guidance or a large setup form.

The review concluded that the normal experience should focus on:

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
```

Configuration and records remain available, but they no longer compete with the daily loop.

### Part 3 Interface Changes

- Check-in and active question now appear before goal editing in reading order and on mobile.
- The full goal editor is collapsed by default.
- Title, desired outcome, milestone, and difficulty remain in the main goal-editing path.
- Motivation, baseline, success definition, priority, and visibility moved into Planning Context.
- Optional check-in text moved into Add Context.
- Evidence and history moved into a secondary Records drawer.
- Sticky navigation was reduced to Pulse, Update, Question, Goal, and Records.
- Sprint difficulty now requires an end date of today or later.
- The Sprint date persists and appears in Goal Pulse.
- All Step 2 data fields remain available.

### Part 3 Product Findings

#### Keep prominent

- Goal Pulse
- Four-field quick check-in
- One active question
- One recommendation with an evidence basis
- Difficulty as workload control
- Evidence separated from claims
- State history

#### Keep available with less visual weight

- Full goal definition
- Optional written check-in context
- Evidence entry
- History review
- Repeated prototype boundary explanation

#### Defer

- Moving the repeated-question repair into the core deterministic engine
- Multiple active goals
- Backend persistence
- Authentication
- AI model reasoning
- Connectors
- `/brief` integration

## Current Prototype Files

```text
goals-lab/index.html
goals-lab/styles.css
goals-lab/app.js
goals-lab/part2.js
goals-lab/part3.js
goals-lab/part3.css
tests/goals-lab-smoke.test.js
tests/goals-lab-browser-e2e.spec.cjs
tests/goals-lab.playwright.config.cjs
.github/workflows/goals-lab-browser-validation.yml
docs/concepts/brief-goal-intelligence-worklog.md
```

## Current Reference Goal

The sample goal remains:

> Build and understand the CMX backend.

This goal provides technical uncertainty, limited experience, dependencies, milestones, and evidence that can be tested without changing `/brief`.

## Current Logic Boundary

The prototype still uses deterministic local rules. It does not call an AI model.

The rules currently consider:

- Difficulty
- Available time
- Energy
- Previous action result
- Current blocker
- Repeated non-completion
- User answer preference
- Evidence type and confidence
- Whether a proposed question has already been answered
- Sprint end date

## Data Boundary

The current prototype:

- Uses sample data by default
- Stores edits in the current browser through `localStorage`
- Makes no network requests
- Reads no connected accounts
- Does not train or fine-tune a model
- Does not publish data to `/brief`
- Does not modify `/brief`
- Does not provide server-side security or multi-device persistence

The page remains `noindex, nofollow` and visibly labeled as an isolated prototype.

## Validation Status

Validated implementation commit:

`72bb4c040eb9a0f1a7b3ccdffb3a8581ffc84614`

Successful workflows:

- Goal Intelligence Browser Validation
- CMX Static Validation
- CMX Privacy Audit
- CMX Secret Scan
- CMX Navigation Link Guard
- CMX Terminal Theme Guard

Part 3 browser coverage includes:

- Collapsed default state for secondary work
- Daily-loop reading order
- Five-item navigation
- Goal editing and persistence
- Sprint end-date validation and persistence
- Check-in behavior
- Repeated-question progression
- Evidence and outcomes
- Records drawer behavior
- Theme switching
- Desktop and Pixel 5 containment

## Known Existing `/brief` Issues

The following reported issues remain separate from this prototype:

- The terminal interaction blurs the page instead of working correctly.
- The login instruction telling users to choose a briefing may need greater prominence.
- Music autoplay is not working and displays feedback near the bottom.

No fix for those issues is included in this branch.

## Remaining Step 3 Work

### Part 4: Decision Checkpoint

Make an explicit decision to:

- Revise the prototype again
- Advance to Step 4 deterministic engine hardening
- Prepare the later FastAPI storage contract without building it
- Narrow or stop the concept

The current evidence supports advancing to Step 4, with `/brief` remaining untouched.

## Revision Log

### August 4, 2026, Part 3

- Added a durable cross-context worklog.
- Reordered the interface around the daily goal loop.
- Collapsed planning, optional context, and records.
- Required an end date for Sprint mode.
- Extended source and browser coverage.
- Passed all configured browser and repository checks.

### August 4, 2026, Part 2

- Added desktop and Android Playwright validation.
- Corrected two browser-test assumptions.
- Fixed the repeated-question defect.
- Passed all branch-wide validation checks.

### August 4, 2026, Part 1

- Created the first isolated Goal Intelligence frontend prototype.
- Added the local goal loop and structured data interactions.
- Added source-level smoke coverage.
- Preserved the boundary that `/brief` remains untouched.
