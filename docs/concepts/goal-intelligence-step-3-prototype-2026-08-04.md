# Goal Intelligence Step 3 Prototype

**Created:** August 4, 2026  
**Last revised:** August 4, 2026  
**Project:** `db.cmxchat.com` / future `/brief` goal intelligence layer  
**Roadmap step:** Step 3, isolated frontend prototype  
**Implementation slice:** Parts 1 and 2 complete  
**Branch:** `agent/goal-intelligence-prototype`  
**Draft PR:** `#34`  
**Prototype route:** `/goals-lab/`  
**Status:** Implemented and browser-validated on the draft branch  
**Authority:** This file records the prototype. It does not authorize changes to `/brief` or production data flows.

## Purpose

This implementation continues Step 3 from the living Goal Intelligence concept and data-model work recorded in:

- `docs/concepts/brief-goal-intelligence-concept-2026-08-04.md`

The goal is to test the smallest useful interaction before adding FastAPI, PostgreSQL, connectors, or AI model reasoning.

## Implemented in Part 1

The isolated `/goals-lab/` route includes:

- One editable goal
- Desired outcome, motivation, baseline, success definition, priority, visibility, and milestone fields
- A five-level difficulty lever
- A short structured check-in
- One active question at a time
- Deterministic question selection based on blockers and outcomes
- One primary recommendation at a time
- Recommendation effort, purpose, expected result, milestone, confidence, and evidence basis
- Outcome recording
- Evidence records kept separate from user claims
- Trajectory and confidence labels
- State and revision history
- A compact Goal Pulse that can later become an input to `/brief`
- Local browser persistence with a clear reset control
- Responsive dark and light layouts
- Reduced-motion and forced-colors support

## Part 2 Browser Validation and Repair

Part 2 added a dedicated Playwright workflow and tested the prototype in:

- Chromium desktop
- Chromium using Pixel 5 mobile emulation

The browser suite verifies:

- The page loads without JavaScript errors
- The layout does not create horizontal overflow on desktop or mobile
- The prototype boundary remains visible
- Goal edits update the Goal Pulse
- Difficulty changes alter the workload and effort
- Goal state survives a browser reload
- A check-in updates the blocker, active question, recommendation, effort, and history
- Answering a blocker question advances the loop instead of immediately repeating the same prompt
- Evidence updates the evidence list and trajectory
- Recommendation outcomes enter the operating history
- Theme switching works
- Section navigation remains usable

The final Part 2 browser matrix passed all tests on both configured projects.

## Bugs Found During Part 2

### 1. Browser test cleanup incorrectly erased persisted state

The first test version cleared `localStorage` through an initialization script, so the cleanup ran again during reload and made valid persistence look broken.

The test now clears state once before the test begins, reloads the clean sample, and then permits later reloads to preserve the edited goal.

### 2. Low-energy effort expectation was incorrect

The implementation rounds 65 percent of a 10-minute capacity to 7 minutes. The first test expected 6 minutes.

The browser expectation now matches the documented calculation performed by the prototype.

### 3. Answered blocker questions could repeat immediately

This was a real product defect. The deterministic question selector could regenerate the same high-priority blocker question immediately after the user answered it.

A Part 2 repair now checks the persisted answer history. When the newly generated prompt has already been answered, the loop advances to a distinct follow-up question that asks what should happen next. The advancement is recorded in state history.

This repair remains local to `/goals-lab/` and does not change `/brief`.

## Prototype Files

```text
goals-lab/index.html
goals-lab/styles.css
goals-lab/app.js
goals-lab/part2.js
tests/goals-lab-smoke.test.js
tests/goals-lab-browser-e2e.spec.cjs
tests/goals-lab.playwright.config.cjs
.github/workflows/goals-lab-browser-validation.yml
```

## Current Reference Goal

The sample goal is:

> Build and understand the CMX backend.

The prototype uses the current FastAPI learning and backend direction because it provides a measurable goal with technical uncertainty, limited experience, dependencies, milestones, and evidence that can be recorded.

## Deterministic Logic

This prototype does not call an AI model.

The local rules adjust the active question and recommendation based on:

- Difficulty
- Available time
- Energy
- Previous action result
- Current blocker
- Repeated non-completion
- User answer preference
- Evidence type and confidence
- Whether a proposed question has already been answered

This allows the interaction to be evaluated before model behavior is added.

## Data Boundary

The current prototype:

- Uses sample data by default
- Stores edits only in the current browser through `localStorage`
- Makes no network requests
- Reads no connected accounts
- Does not train or fine-tune a model
- Does not publish data to `/brief`
- Does not modify `/brief`
- Does not provide server-side security or multi-device persistence

The page is marked `noindex, nofollow` and visibly labeled as an isolated prototype.

## Known Existing `/brief` Issues

The following reported issues remain separate from this prototype:

- The terminal interaction currently blurs the page instead of working correctly.
- The login instruction telling users to choose a briefing may need greater prominence.
- Music autoplay is not working and displays feedback near the bottom.

No fix for those issues is included in this branch.

## Validation Status

The final branch head passed:

- Goal Intelligence desktop and Android browser validation
- CMX Static Validation
- CMX Privacy Audit
- CMX Secret Scan
- CMX Navigation Link Guard
- CMX Terminal Theme Guard

## Remaining Step 3 Parts

### Part 3: Product review and simplification

Review whether the interface feels like useful guidance or an oversized form. Remove fields or interactions that do not change the recommendation.

The review should specifically examine:

- Whether goal setup asks for too much information at once
- Whether difficulty needs a temporary override and a required Sprint end date
- Whether the question follow-up should move into the main engine instead of remaining a separate Part 2 repair layer
- Whether evidence and history deserve equal visual weight in the daily workflow
- Whether check-in fields can be reduced without lowering recommendation quality
- Whether one real user session produces a useful Goal Pulse

### Part 4: Step 3 decision

Decide whether to:

- Revise the prototype
- Advance to deterministic engine hardening
- Prepare the FastAPI storage contract
- Stop or narrow the concept

No `/brief` integration should begin during Step 3.

## Revision Log

### August 4, 2026, Part 2

- Added desktop and Android Playwright validation.
- Confirmed responsive containment, persistence, goal updates, difficulty behavior, check-ins, questions, evidence, outcomes, theme, and navigation.
- Corrected two browser-test assumptions.
- Fixed the real repeated-question defect.
- Recorded that every branch-wide validation check passed.

### August 4, 2026, Part 1

- Created the first isolated Goal Intelligence frontend prototype.
- Added the full local goal loop and structured data interactions.
- Added source-level smoke coverage.
- Preserved the boundary that `/brief` remains untouched.
