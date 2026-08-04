# Goal Intelligence Step 4 Engine Plan

**Created:** August 4, 2026  
**Status:** Prepared, implementation not started  
**Repository:** `CMXChat/First-Repo`  
**Current prototype:** `/goals-lab/`  
**Production boundary:** Step 4 does not touch `/brief`.

## Objective

Move the deterministic goal logic into a clean, testable core that accepts structured state and events, then returns structured state changes, questions, recommendations and explanations without reading or changing the DOM.

## Proposed Core Boundary

```text
Current structured state
        +
Explicit event
        ↓
Deterministic engine
        ↓
Next structured state
Question
Recommendation
Trajectory
Confidence
History events
Validation errors
```

The interface should render engine output. The engine should not know about buttons, forms, selectors, drawers, CSS, reloads or `localStorage`.

## Step 4 Parts

### Part 1: Extract pure rules

Create a core module for:

- Difficulty definitions and effort calculation
- Trajectory calculation
- Confidence calculation
- Question selection
- Repeated-question prevention
- Recommendation selection
- Sprint validation and expiry
- Outcome handling
- Evidence handling

### Part 2: Define events and results

Use explicit events such as:

```text
goal.updated
check_in.recorded
question.answered
question.skipped
recommendation.completed
recommendation.partial
recommendation.missed
recommendation.replaced
evidence.added
difficulty.changed
sprint.expired
```

Every transition should return a predictable result object.

### Part 3: Add unit coverage

Test the engine without a browser for:

- All five difficulty modes
- Low, medium and high energy
- Available-time limits
- Every blocker type
- First miss and repeated misses
- Completed, partial, missed and replacement outcomes
- Strong and weak evidence
- Repeated-question prevention
- Sprint dates and expiry
- Missing or malformed state
- Stable history events

### Part 4: Reconnect the prototype

Replace direct rule calls in the UI with the extracted engine while preserving the current visible workflow and browser storage.

### Part 5: Regression validation

Run source tests and desktop/mobile Playwright tests. The user-visible prototype should remain functionally equivalent unless a documented engine defect is corrected.

## Initial File Direction

```text
goals-lab/engine.js
goals-lab/state-adapter.js
tests/goals-engine.test.js
```

Names may change during implementation, but the separation should remain:

- `engine.js`: pure decisions and transitions
- `state-adapter.js`: browser persistence and migration
- UI scripts: rendering and event collection only

## Engine Result Contract

A transition should return something similar to:

```json
{
  "ok": true,
  "state": {},
  "question": {},
  "recommendation": {},
  "trajectory": {
    "value": "improving",
    "reason": "A completed action moved the current milestone."
  },
  "confidence": {
    "value": "moderate",
    "reason": "Current user input exists, but verified evidence is limited."
  },
  "historyEvents": [],
  "errors": []
}
```

## Rules

- Pure engine functions do not access the DOM, storage, network, time zone APIs or connected services.
- Current time must be passed into rules that need it.
- User claims and evidence remain separate records.
- Important state changes create explicit history events.
- A question should not repeat immediately after being answered unless the previous answer is stale or contradictory.
- Sprint mode requires a bounded end date and must degrade safely after expiry.
- Unknown data should lower confidence, not be silently invented.
- The engine returns validation errors without partially mutating state.

## Step 4 Completion Criteria

Step 4 is complete when:

- Core decision logic is independent of the DOM.
- Repeated-question prevention lives in the core.
- State transitions use explicit events.
- Unit tests cover meaningful rule combinations and edge cases.
- The existing prototype consumes the engine.
- Desktop and mobile browser validation still passes.
- No FastAPI, database, connector, AI or `/brief` integration has been introduced.

## First Implementation Action

Extract difficulty, effort, trajectory and confidence into pure functions with unit tests before moving question and recommendation logic.
