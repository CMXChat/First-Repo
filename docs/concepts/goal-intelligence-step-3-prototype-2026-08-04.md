# Goal Intelligence Step 3 Prototype

**Created:** August 4, 2026  
**Project:** `db.cmxchat.com` / future `/brief` goal intelligence layer  
**Roadmap step:** Step 3, isolated frontend prototype  
**Implementation slice:** Part 1  
**Branch:** `agent/goal-intelligence-prototype`  
**Prototype route:** `/goals-lab/`  
**Status:** Implemented for review on a draft branch  
**Authority:** This file records the prototype. It does not authorize changes to `/brief` or production data flows.

## Purpose

This implementation begins Step 3 from the living Goal Intelligence concept and data-model work recorded in:

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

## Prototype Files

```text
goals-lab/index.html
goals-lab/styles.css
goals-lab/app.js
tests/goals-lab-smoke.test.js
```

## Current Reference Goal

The sample goal is:

> Build and understand the CMX backend.

The prototype uses the current FastAPI learning and backend direction because it provides a measurable goal with technical uncertainty, limited experience, dependencies, milestones, and evidence that can be recorded.

## Deterministic Logic

This part does not call an AI model.

The local rules adjust the active question and recommendation based on:

- Difficulty
- Available time
- Energy
- Previous action result
- Current blocker
- Repeated non-completion
- User answer preference
- Evidence type and confidence

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

## Validation Added

A source-level smoke test verifies:

- The prototype JavaScript parses
- Required UI sections exist
- Difficulty, check-in, question, evidence, history, and outcome controls exist
- Deterministic question, recommendation, trajectory, and confidence functions exist
- No `fetch()` call exists in the prototype
- Responsive, reduced-motion, forced-colors, and light-theme styles exist

## Remaining Step 3 Parts

### Part 2: Browser validation and interaction repair

Test the prototype on desktop and mobile widths and verify:

- Goal edits persist correctly
- Every difficulty level produces a visibly different workload
- Check-ins update the pulse, question, recommendation, and history
- Question choices influence the next action
- Outcomes create the next loop
- Evidence changes confidence without silently rewriting claims
- Reset and theme controls work
- Keyboard and focus behavior remain usable

### Part 3: Product review and simplification

Review whether the interface feels like useful guidance or an oversized form. Remove fields or interactions that do not change the recommendation.

### Part 4: Step 3 decision

Decide whether to:

- Revise the prototype
- Advance to deterministic engine hardening
- Prepare the FastAPI storage contract
- Stop or narrow the concept

No `/brief` integration should begin during Step 3.

## Revision Log

### August 4, 2026

- Created the first isolated Goal Intelligence frontend prototype.
- Added the full local goal loop and structured data interactions.
- Added source-level smoke coverage.
- Preserved the boundary that `/brief` remains untouched.
