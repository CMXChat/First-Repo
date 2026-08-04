# Brief Project Concept: Goal-Directed Personal Intelligence System

**Created:** August 4, 2026  
**Last revised:** August 4, 2026  
**Status:** Living concept and planning note  
**Project:** `db.cmxchat.com` / `/brief`  
**Implementation status:** Step 0 complete; Step 1 MVP definition drafted  
**Authority:** This document records and develops the concept. It does not authorize changes to `/brief`, related production pages, or the live data flow.

## Purpose of This Document

This file preserves the idea so it can be found from future ChatGPT context windows, reviewed later, and revised as the project becomes clearer.

It is not a permanent rule set, final architecture, or automatic permission to build. It is a dated living record of the direction being considered beginning on August 4, 2026.

The core question is:

> What if `/brief` eventually becomes the visible output of a personal data and goal intelligence system that continuously learns what the user is trying to accomplish, asks useful questions, updates its understanding, and structures information around improving the chance of reaching those goals?

## Core Idea

The project could evolve from a frontend briefing page into a goal-directed personal intelligence layer.

The system would collect authorized information, organize it around defined goals, identify uncertainty or missing context, ask interactive questions, track evidence and progress, and recommend actions based on the user’s current reality.

The `/brief` page could eventually become the daily operating report produced by this system.

Instead of presenting disconnected information, the system would help answer:

- What is the user trying to accomplish?
- What changed since the last update?
- What progress was actually made?
- What is blocking progress?
- What information is missing or stale?
- What action would most improve the current trajectory?
- How demanding should the current plan be?
- What evidence supports the recommendation?

## Proposed System Loop

```text
Collect authorized information
        ↓
Update the user and goal state
        ↓
Identify missing information, uncertainty, and blockers
        ↓
Ask one useful question
        ↓
Recommend the highest-value next action
        ↓
Record what happened
        ↓
Adjust the plan, trajectory, and difficulty
        ↓
Generate the next goal pulse and eventual /brief output
```

The loop is more important than any individual page, visual component, connector, or model.

## Goals as the Organizing Layer

A future `/goals` page or Goals tab could define the direction of the broader system.

Each goal could include:

- Goal title
- Desired outcome
- Reason the goal matters
- Current baseline
- Target date, if applicable
- Success measurements
- Current milestone
- Available time and resources
- Known constraints
- Active blockers
- Next recommended action
- Confidence in the current understanding
- Visibility and privacy level
- Last review date

A goal should be measurable enough that the system can distinguish movement, delay, completion, changed priorities, and abandonment.

## Interactive Goal Updating

The Goals area should not behave like a static task list.

It should maintain an active understanding of the goal through focused questions. There should generally be one useful question available, but the system should only interrupt or require an answer when that answer could materially change the recommendation, priority, confidence, or interpretation of progress.

Possible question triggers include:

- Important information is missing
- A previous answer has become stale
- A milestone was completed
- A recommended action was skipped repeatedly
- A new blocker appeared
- The deadline changed
- Available time or resources changed
- Reported behavior conflicts with the current plan
- The system is uncertain between two next actions
- The user changed the difficulty level

Examples:

- Did you complete the action selected yesterday?
- What prevented you from completing it?
- Is this goal still a current priority?
- How much time do you realistically have today?
- Did the previous recommendation help?
- What did you learn from the attempt?
- Has the deadline or desired outcome changed?
- Is the current blocker technical, financial, emotional, logistical, or unclear?

The system should avoid collecting information that has no effect on the goal.

## Difficulty Lever

A difficulty or intensity control could adjust how demanding the recommendations are without changing factual honesty.

Possible levels:

1. **Recovery**  
   Tiny actions intended to protect continuity and restart momentum.

2. **Sustainable**  
   Low-pressure, steady progress with modest daily requirements.

3. **Focused**  
   Meaningful execution with clear accountability and a realistic workload.

4. **Stretch**  
   Larger actions, tighter prioritization, and reduced tolerance for avoidable delay.

5. **Sprint**  
   Temporary high-intensity effort with a defined end date and recovery plan.

The difficulty level could influence:

- Task size
- Number of simultaneous actions
- Check-in frequency
- Expected daily workload
- Recommendation intensity
- Recovery behavior after missed days
- Milestone pacing

Sprint mode should expire automatically or require a review date.

## Evidence and Progress

The system should separate intention, self-reporting, evidence, and verified results.

Example:

```text
Planned: Complete the first FastAPI lesson
Reported: Watched part of the lesson
Evidence: A working route was committed to GitHub
Result: The first API endpoint exists
Confidence: High
```

Potential evidence sources could include:

- Manual check-ins
- GitHub activity
- Calendar activity
- Task completion
- Uploaded documents
- Connected tools
- User confirmations
- Generated outputs

The system should show why it believes progress occurred and how confident it is.

## Trajectory Instead of Fake Precision

The first version should avoid unsupported probability claims such as a precise percentage chance of success.

A more honest output could use:

- Improving
- Stable
- Unclear
- At risk
- Blocked
- Completed

It could also display confidence and supporting factors.

Example:

```text
Trajectory: Improving
Confidence: Moderate

Positive factors:
- Four of the last six actions were completed
- The primary blocker has been identified
- Required resources are available

Risk factors:
- The target date may be too aggressive
- Two important decisions remain unresolved
- No deployment path has been selected
```

Probability estimates should only be considered later if enough reliable historical data exists.

## Privacy and Visibility

Because the project may use personal or shared information, each data item and goal should eventually support visibility controls.

Possible levels:

- Private to one user
- Shared
- AI-only context
- Never include in a brief
- Ask before including
- Goal-specific access only

Information being available to the AI should not automatically make it suitable for a shared page.

## Current Proposed Roadmap

This roadmap is a planning sequence, not an approved build order that runs automatically.

### Step 0: Preserve the Idea

Record the dated concept, its intent, risks, possible direction, and revision history.

**Status:** Complete.

### Step 1: Define the Smallest Working Loop

Turn the broad concept into a precise MVP interaction with clear boundaries and success criteria.

**Status:** Initial draft included below.

### Step 2: Define the Data Structure

Specify how goals, milestones, check-ins, questions, answers, recommendations, evidence, blockers, difficulty, trajectory, visibility, and revisions relate to one another.

### Step 3: Build an Isolated Frontend Prototype

Create a separate experimental interface with sample or local data. Do not modify `/brief` during this step.

Possible locations remain undecided. Examples include:

```text
/lab/goals/
/prototype/goals/
/goal-system-demo/
```

### Step 4: Build the Deterministic Goal Engine

Implement predictable rules for check-ins, missed actions, difficulty changes, blocker discovery, stale information, and milestone movement before relying on AI reasoning.

### Step 5: Add FastAPI and Persistent Storage

Connect the approved prototype to FastAPI and PostgreSQL so goal state survives refreshes, devices, and future sessions.

### Step 6: Add the AI Reasoning Layer

Provide the AI with limited, goal-relevant structured context and require structured recommendations, questions, confidence, and supporting reasons.

### Step 7: Connect the Engine to `/brief`

Only after the goal loop has been tested and approved should `/brief` consume a small, structured Goal Pulse output.

### Step 8: Add Authorized Data Sources

Add optional connectors such as GitHub, Google Calendar, Gmail, Google Drive, ClickUp, Spotify, financial information, uploaded files, and manual journals. Each source must be permission-aware, privacy-aware, and scoped to relevant goals.

## Current Roadmap Position

```text
Step 0  Preserve the idea                         Complete
Step 1  Define the MVP                           Drafted
Step 2  Define the data structure                Not started
Step 3  Build an isolated frontend prototype     Not started
Step 4  Build deterministic goal logic           Not started
Step 5  Add FastAPI and PostgreSQL                Not started
Step 6  Add AI reasoning                         Not started
Step 7  Integrate with /brief                     Not authorized
Step 8  Add authorized data sources              Not started
```

# Step 1: Smallest Working Loop MVP

## Step 1 Objective

Define the smallest interactive experience that can prove whether goal-directed questioning and recommendations are genuinely useful.

The MVP should prove this loop:

```text
Create one goal
        ↓
Choose a difficulty level
        ↓
Complete a short check-in
        ↓
Update the known goal state
        ↓
Ask one high-value question
        ↓
Recommend one next action
        ↓
Record the result
        ↓
Update trajectory and the next question
```

The MVP does not need a production backend, connectors, vector search, model training, or `/brief` integration.

## Reference Goal for the MVP

The first prototype should use one realistic reference goal:

> Build and understand a maintainable backend for `db.cmxchat.com` using FastAPI, while learning enough Python to understand and manage the work.

This is a useful reference because it includes:

- A measurable outcome
- A learning requirement
- Technical uncertainty
- Dependencies on another developer
- Limited available time
- Milestones that can produce visible evidence

The prototype should still be designed so a different goal can replace it later.

## MVP Goal Creation

### Required information

The user must provide:

- Goal title
- Desired outcome
- Why it matters
- Current baseline
- One definition of success
- Current priority level
- Difficulty level

### Optional information

The user may provide:

- Target date
- Available time today or this week
- Known blockers
- Available resources
- Dependencies
- Privacy level
- First milestone

The system should ask follow-up questions when required information is vague enough to prevent a useful recommendation.

## MVP Difficulty Behavior

The difficulty lever is set per goal in the MVP.

### Level 1: Recovery

- One very small action
- Usually 5 to 15 minutes
- Protect continuity
- No penalty language after a missed day
- Prefer restarting over catching up

### Level 2: Sustainable

- One modest action
- Usually 15 to 30 minutes
- Slow and steady milestone movement
- Minimal urgency

### Level 3: Focused

- One meaningful action, with an optional supporting action
- Usually 30 to 60 minutes
- Clear accountability
- Normal default mode

### Level 4: Stretch

- One larger action or two linked actions
- Usually 60 to 120 minutes
- Strong prioritization
- The system should surface tradeoffs with other goals or obligations

### Level 5: Sprint

- Temporary campaign mode
- Requires an end date
- May include multiple linked actions
- Must show workload and recovery risk
- Automatically returns to the previous level when the sprint ends unless the user renews it

Difficulty changes workload and pacing. It does not change facts, hide risks, or make unrealistic plans appear achievable.

## MVP Daily Check-In

The check-in should remain brief. The first version should collect:

1. **Previous action result**  
   Completed, partly completed, not completed, or no action assigned.

2. **Available capacity**  
   A simple time or energy selection for the current period.

3. **New change**  
   Anything that changed the goal, deadline, resources, or priority.

4. **Current blocker**  
   None, technical, knowledge, time, financial, emotional, dependency, or other.

5. **Optional note**  
   Free text for context the structured fields do not capture.

The system should not require a long journal entry.

## MVP Question Behavior

The interface should generally keep one active question available.

A question becomes high priority when its answer could change:

- The next action
- The difficulty level
- The current milestone
- The interpretation of progress
- The trajectory
- The system’s confidence

Question priority for the MVP:

1. Missing information that prevents an action
2. A new blocker
3. Repeated non-completion
4. Contradictory information
5. A completed milestone requiring the next milestone
6. Stale goal information
7. Improvement questions that are useful but not urgent

The system should show one primary question at a time. It may keep additional questions in a queue, but they should not clutter the interface.

A question should explain its purpose in a short line when that is useful.

Example:

```text
Question: What is stopping you from starting the FastAPI setup?
Why this matters: The answer determines whether the next action should teach, build, or resolve access.
```

## MVP Goal State Update

After a check-in or answer, the system should update only fields supported by the new information.

Possible updates include:

- Last activity date
- Previous action result
- Active blocker
- Current milestone
- Difficulty
- Trajectory
- Confidence
- Recommended next action
- Active question

The system should preserve a short history instead of overwriting every previous state without a record.

## MVP Recommendation Output

The MVP should produce one primary next action with:

- Action title
- Why this action matters now
- Estimated effort
- Expected result
- Connection to the current milestone
- Difficulty level used
- Confidence
- Evidence or answers that influenced it

Example:

```text
Next action: Run one local FastAPI route and confirm the response.
Why now: The current blocker is uncertainty about how the backend begins.
Effort: 30 minutes
Expected result: A working local endpoint and a clearer understanding of the project structure.
Milestone: First working API route
Difficulty: Focused
Confidence: Moderate
Based on: Limited Python experience, no route created yet, 45 minutes available today
```

The system should avoid recommending multiple unrelated actions in the first version.

## MVP Outcome Recording

The user should be able to record:

- Completed
- Partly completed
- Not completed
- Replaced by another useful action
- No longer relevant

The user may add:

- What happened
- Evidence
- What was learned
- What caused the result

The outcome should influence the next recommendation. It should not be treated as a moral score.

## MVP Trajectory Rules

The MVP should use understandable labels:

- **Improving:** recent actions or evidence show meaningful movement
- **Stable:** work is continuing but the goal state has not materially changed
- **Unclear:** not enough current information exists
- **At risk:** delay, constraints, or repeated non-completion threaten the desired outcome
- **Blocked:** a known dependency prevents meaningful progress
- **Completed:** the stated success condition has been met

The label should include confidence and a short explanation.

## MVP Goal Pulse

The isolated prototype should generate a compact Goal Pulse even though it will not yet appear on `/brief`.

```text
Goal: Build the CMX backend
Trajectory: Improving
Difficulty: Focused
Current milestone: First working API route
Primary blocker: Limited understanding of the setup sequence
Best action: Run one local FastAPI route
Effort: 30 minutes
Active question: Do you want to understand each line first or prove that the route works first?
Confidence: Moderate
```

This allows the future `/brief` output shape to be tested without modifying `/brief`.

## MVP User Controls

The user should be able to:

- Edit the goal
- Change difficulty
- Pause the goal
- Mark the goal complete
- Answer or skip the active question
- Correct the system’s interpretation
- Replace the recommended action
- Record an outcome
- Review recent state changes

Skipping a question should not automatically block the entire experience unless the answer is genuinely required to produce a safe or meaningful recommendation.

## MVP Success Criteria

The concept is worth advancing to Step 2 and Step 3 when the prototype can demonstrate that:

1. A user can define a goal without completing a long setup process.
2. The difficulty setting causes visibly different but sensible recommendations.
3. A short check-in meaningfully changes the goal state.
4. The system asks a question that affects the next action.
5. The recommendation is specific, achievable, and connected to a milestone.
6. The user can see which information influenced the recommendation.
7. Recording the result changes the next question or action.
8. The Goal Pulse is useful enough that it could later deserve space inside `/brief`.
9. The experience feels like guidance and updating, not a static task tracker or an interrogation.

## MVP Failure Signals

The concept should be revised before expanding when:

- Questions feel repetitive or irrelevant
- The system asks for data without using it
- Difficulty only changes wording instead of workload
- Recommendations are generic
- The user cannot correct a wrong interpretation
- Progress labels feel arbitrary
- The workflow requires too much manual input
- The Goal Pulse does not provide value beyond an ordinary to-do item

## Explicit MVP Non-Goals

Step 1 does not approve or require:

- Changes to `/brief`
- A production Goals page
- FastAPI implementation
- PostgreSQL
- Model fine-tuning or training
- Vector databases
- Automatic access to personal information
- Gmail, Calendar, GitHub, ClickUp, Spotify, finance, or other connectors
- Success probability percentages
- Multiple-user sharing
- Fully autonomous decisions
- Automatic changes to the user’s goals without confirmation

## Step 1 Example Lifecycle

### Initial setup

```text
Goal: Build and understand the db.cmxchat.com backend
Baseline: Frontend exists; Python knowledge is limited
Success: One maintainable FastAPI service is deployed and understood
Difficulty: Focused
Current milestone: First working local route
```

### First question

```text
Which outcome matters more for the first session?
A. Understand each line of the setup
B. Prove that a working route can run
C. Prepare the structure for CRZA to continue
```

### First recommendation

```text
Create the smallest FastAPI app with one GET route, run it locally, and write a short note explaining the route.
```

### Result

```text
Partly completed: Project files were created, but the route did not run.
Blocker: Environment setup error
Evidence: Error output or screenshot
```

### Updated question

```text
What exact command or dependency failed during setup?
```

### Updated recommendation

```text
Resolve the environment error before adding any new route or database work.
```

This example demonstrates the intended update loop without requiring a full AI platform.

## Step 1 Decisions Currently Proposed

These are proposed decisions and can still be revised:

- The MVP begins with one goal.
- Difficulty is set per goal.
- Focused is the default difficulty.
- One primary question is shown at a time.
- One primary action is recommended at a time.
- The system records history instead of silently replacing state.
- Trajectory uses named states, not a success percentage.
- The prototype produces a Goal Pulse but does not publish it to `/brief`.
- The first reference goal is the `db.cmxchat.com` FastAPI backend goal.

## Step 1 Questions Still Open

- Should the check-in happen once per day, whenever the page opens, or only after an action is due?
- Should capacity be measured in time, energy, or both?
- Should the user select the next milestone or allow the system to propose it for confirmation?
- How much history should the frontend show during the prototype?
- Should a skipped question remain active or move behind a newer urgent question?
- Should the difficulty lever support temporary overrides for one day?
- What exact isolated prototype path should be used when Step 3 is approved?

## Relationship to `/brief`

The long-term idea is that `/brief` could become the daily output layer of the goal intelligence system.

Other information in the brief could eventually be selected according to relevance to active goals, including:

- Calendar commitments
- GitHub changes
- Relevant messages
- Financial constraints
- Workload
- Recent decisions
- Missed commitments
- New opportunities
- Personal energy or availability

The brief should remain readable and selective. Deep reasoning should happen behind the page, not create a bloated page.

No `/brief` implementation should begin until Step 7 is explicitly approved.

## Possible Future Data Model

A basic goal record might eventually resemble:

```json
{
  "id": "cmx-backend",
  "title": "Build the CMX backend",
  "outcome": "Launch a maintainable FastAPI backend connected to the frontend",
  "status": "active",
  "difficulty": 3,
  "target_date": null,
  "baseline": "Frontend exists and backend knowledge is limited",
  "metrics": [
    "FastAPI application deployed",
    "Frontend form connected",
    "PostgreSQL stores submissions",
    "Authentication enabled"
  ],
  "constraints": [
    "Limited Python experience",
    "Client workload",
    "Developer dependency"
  ],
  "current_milestone": "Create the first working API route",
  "next_action": "Build and test one POST endpoint",
  "open_questions": [
    "Which server will host the first staging deployment?"
  ],
  "visibility": "private",
  "updated_at": "2026-08-04"
}
```

Check-ins, evidence, decisions, recommendations, and questions should likely exist as separate records connected to a goal. Exact data modeling belongs to Step 2.

## Possible Future Technical Direction

This concept fits the planned FastAPI-first direction for `db.cmxchat.com`.

```text
Frontend
   ↓
FastAPI
   ├── Goal API
   ├── Check-in API
   ├── Data ingestion
   ├── Memory and retrieval
   ├── Recommendation logic
   ├── Brief generation
   └── Connector permissions

Storage
   ├── PostgreSQL
   ├── Vector search, only if useful
   ├── File storage
   └── Activity and audit logs
```

Potential later API routes:

```text
GET  /api/goals
POST /api/goals
POST /api/goals/{id}/check-ins
GET  /api/goals/{id}/questions
POST /api/goals/{id}/answers
GET  /api/brief
```

This architecture is not approved or final.

## Main Product Risk

The largest risk is trying to build the entire intelligence platform before proving that the interaction is useful.

The minimum valuable version remains small:

- Define a goal
- Select difficulty
- Answer a short check-in
- Receive one useful question
- Receive one recommended action
- Record the outcome
- See the goal state update
- Generate a compact Goal Pulse outside `/brief`

If that loop is useful, the broader system can grow around it.

## Current Working Summary

```text
Goals define direction.
Data describes reality.
Questions reduce uncertainty.
Recommendations create movement.
Evidence keeps the system honest.
The brief eventually explains what matters today.
```

Possible working names discussed:

- Objective Engine
- Goal Intelligence
- CMX Goal Intelligence
- Personal Intelligence Layer

No name has been selected.

## Future Revision Guidance

When revising this document:

1. Preserve the original creation date.
2. Update the **Last revised** field.
3. Add a brief entry to the revision log.
4. Clearly distinguish confirmed decisions from ideas still being explored.
5. Do not treat this concept file as permission to change `/brief`.
6. Revise the same file unless there is a strong reason to create a separate specification.
7. Update the roadmap status as work is approved and completed.

## Revision Log

### August 4, 2026, Step 1 update

- Added the proposed eight-step roadmap.
- Marked Step 0 complete.
- Began Step 1 by defining the smallest working loop MVP.
- Added MVP goal setup, difficulty behavior, check-in fields, question logic, recommendations, outcomes, trajectory, Goal Pulse, user controls, success criteria, failure signals, non-goals, and an example lifecycle.
- Confirmed that `/brief` remains untouched and unauthorized until Step 7.

### August 4, 2026, initial concept

- Initial concept recorded.
- Added goals as the organizing layer.
- Added interactive questioning and structured updates.
- Added difficulty modes.
- Added evidence, trajectory, privacy, architecture, and staged development ideas.
- Marked the document as an idea record only, with no authorization to modify `/brief`.
