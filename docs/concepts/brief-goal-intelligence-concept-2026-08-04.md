# Brief Project Concept: Goal-Directed Personal Intelligence System

**Created:** August 4, 2026  
**Last revised:** August 4, 2026  
**Status:** Living concept and planning note  
**Project:** `db.cmxchat.com` / `/brief`  
**Implementation status:** Step 0 complete; Step 1 defined; Step 2 data structure drafted  
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
Generate the next Goal Pulse and eventual /brief output
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

The system should avoid collecting information that has no effect on the goal.

## Difficulty Lever

The difficulty or intensity control adjusts how demanding recommendations are without changing factual honesty.

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

Difficulty can influence task size, action count, check-in frequency, workload, recovery behavior, and milestone pacing. It cannot hide risks or make an unrealistic plan appear achievable.

## Evidence and Progress

The system should separate intention, self-reporting, evidence, and verified results.

```text
Planned: Complete the first FastAPI lesson
Reported: Watched part of the lesson
Evidence: A working route was committed to GitHub
Result: The first API endpoint exists
Confidence: High
```

The system should show why it believes progress occurred and how confident it is.

## Trajectory Instead of Fake Precision

The first version should avoid unsupported probability claims such as a precise percentage chance of success.

Use understandable states:

- Improving
- Stable
- Unclear
- At risk
- Blocked
- Completed

Each trajectory should include confidence and a short explanation.

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

# Current Proposed Roadmap

This roadmap is a planning sequence. It is not an approved build order that runs automatically.

## Step 0: Preserve the Idea

Record the dated concept, intent, risks, direction, and revision history.

**Status:** Complete.

## Step 1: Define the Smallest Working Loop

Turn the broad concept into a precise MVP interaction with clear boundaries and success criteria.

**Status:** Defined below.

## Step 2: Define the Data Structure

Specify how goals, milestones, check-ins, questions, answers, recommendations, evidence, blockers, difficulty, trajectory, visibility, and revisions relate to one another.

**Status:** Drafted below.

## Step 3: Build an Isolated Frontend Prototype

Create a separate experimental interface with sample or local data. Do not modify `/brief` during this step.

Possible locations remain undecided:

```text
/lab/goals/
/prototype/goals/
/goal-system-demo/
```

## Step 4: Build the Deterministic Goal Engine

Implement predictable rules for check-ins, missed actions, difficulty changes, blocker discovery, stale information, and milestone movement before relying on AI reasoning.

## Step 5: Add FastAPI and Persistent Storage

Connect the approved prototype to FastAPI and PostgreSQL so goal state survives refreshes, devices, and future sessions.

## Step 6: Add the AI Reasoning Layer

Provide the AI with limited, goal-relevant structured context and require structured recommendations, questions, confidence, and supporting reasons.

## Step 7: Connect the Engine to `/brief`

Only after the goal loop has been tested and approved should `/brief` consume a small, structured Goal Pulse output.

## Step 8: Add Authorized Data Sources

Add optional connectors such as GitHub, Google Calendar, Gmail, Google Drive, ClickUp, Spotify, financial information, uploaded files, and manual journals. Each source must be permission-aware, privacy-aware, and scoped to relevant goals.

## Current Roadmap Position

```text
Step 0  Preserve the idea                         Complete
Step 1  Define the MVP                           Defined
Step 2  Define the data structure                Drafted
Step 3  Build an isolated frontend prototype     Not started
Step 4  Build deterministic goal logic           Not started
Step 5  Add FastAPI and PostgreSQL                Not started
Step 6  Add AI reasoning                         Not started
Step 7  Integrate with /brief                     Not authorized
Step 8  Add authorized data sources              Not started
```

# Known Existing `/brief` Issues

These were reported on August 4, 2026. They are recorded so future context windows know about them. They have not been investigated or fixed, and they are not part of Step 2.

1. **Terminal interaction issue**  
   The terminal feature is not working correctly and currently appears to blur the page.

2. **Login briefing-choice instruction**  
   The wording on the login experience that tells users to choose their briefing may need to be more prominent. The exact current text still needs to be checked before changing it.

3. **Autoplay music issue**  
   Autoplay music is not working and a feedback or error message appears near the bottom of the page.

These issues should be inspected separately when `/brief` bug-fixing is explicitly approved. Recording them here does not authorize changes to the page.

# Step 1: Smallest Working Loop MVP

## Step 1 Objective

Define the smallest interactive experience that can prove whether goal-directed questioning and recommendations are genuinely useful.

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

## Reference Goal

> Build and understand a maintainable backend for `db.cmxchat.com` using FastAPI, while learning enough Python to understand and manage the work.

This reference goal includes a measurable outcome, a learning requirement, technical uncertainty, developer dependencies, limited time, and visible evidence.

## MVP Goal Creation

Required information:

- Goal title
- Desired outcome
- Why it matters
- Current baseline
- One definition of success
- Current priority level
- Difficulty level

Optional information:

- Target date
- Available time today or this week
- Known blockers
- Available resources
- Dependencies
- Privacy level
- First milestone

## MVP Difficulty Behavior

### Recovery

- One action, usually 5 to 15 minutes
- Protect continuity
- Restart instead of catching up

### Sustainable

- One action, usually 15 to 30 minutes
- Slow and steady milestone movement

### Focused

- One meaningful action with an optional supporting action
- Usually 30 to 60 minutes
- Default mode

### Stretch

- One larger action or two linked actions
- Usually 60 to 120 minutes
- Surface tradeoffs with other obligations

### Sprint

- Temporary campaign mode
- Requires an end date
- May include multiple linked actions
- Returns to the previous level when the sprint ends unless renewed

## MVP Daily Check-In

The first version should collect:

1. Previous action result: completed, partly completed, not completed, or no action assigned
2. Available capacity: time and optional energy level
3. New change: anything affecting the goal, deadline, resources, or priority
4. Current blocker: none, technical, knowledge, time, financial, emotional, dependency, or other
5. Optional note

The check-in should not require a long journal entry.

## MVP Question Behavior

One primary question should be shown at a time.

Question priority:

1. Missing information that prevents an action
2. A new blocker
3. Repeated non-completion
4. Contradictory information
5. A completed milestone requiring the next milestone
6. Stale goal information
7. Useful but non-urgent improvement questions

A question should be able to explain why it matters.

```text
Question: What is stopping you from starting the FastAPI setup?
Why this matters: The answer determines whether the next action should teach, build, or resolve access.
```

## MVP Recommendation Output

One primary next action should include:

- Action title
- Why it matters now
- Estimated effort
- Expected result
- Current milestone
- Difficulty level used
- Confidence
- Evidence or answers that influenced it

```text
Next action: Run one local FastAPI route and confirm the response.
Why now: The current blocker is uncertainty about how the backend begins.
Effort: 30 minutes
Expected result: A working local endpoint and clearer understanding of the structure.
Milestone: First working API route
Difficulty: Focused
Confidence: Moderate
Based on: Limited Python experience, no route created yet, 45 minutes available today
```

## MVP Outcome Recording

The user should be able to record:

- Completed
- Partly completed
- Not completed
- Replaced by another useful action
- No longer relevant

Optional outcome details:

- What happened
- Evidence
- What was learned
- What caused the result

The outcome should influence the next recommendation. It should not be treated as a moral score.

## MVP Goal Pulse

The isolated prototype should generate a compact Goal Pulse outside `/brief`.

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

## MVP User Controls

The user should be able to:

- Edit the goal
- Change difficulty
- Pause or complete the goal
- Answer or skip the active question
- Correct the system’s interpretation
- Replace the recommended action
- Record an outcome
- Review recent state changes

## Step 1 Success Criteria

Step 1 is useful when:

1. A goal can be defined without a long setup process.
2. Difficulty creates visibly different and sensible recommendations.
3. A short check-in changes the known goal state.
4. A question affects the next action.
5. The recommendation is specific, achievable, and connected to a milestone.
6. The user can see which information influenced the recommendation.
7. Recording an outcome changes the next question or action.
8. The Goal Pulse is useful enough to later deserve space inside `/brief`.
9. The experience feels like guidance, not an interrogation or static task tracker.

## Explicit Step 1 Non-Goals

Step 1 does not authorize or require:

- Changes to `/brief`
- A production Goals page
- FastAPI implementation
- PostgreSQL
- Model training or fine-tuning
- Vector databases
- Automatic access to personal information
- External connectors
- Success probability percentages
- Multiple-user sharing
- Fully autonomous decisions
- Automatic changes to goals without confirmation

# Step 2: Goal Intelligence Data Structure

## Step 2 Objective

Define a durable and understandable data model that can support the Step 1 loop without forcing the project into a final database architecture too early.

The model must support:

- A goal’s current state
- A history of how that state changed
- One active question and one active recommended action
- Milestones and measurable success conditions
- Check-ins and outcomes
- Evidence and confidence
- Difficulty and trajectory
- Privacy and visibility
- Future AI reasoning and connector data
- Future Goal Pulse output for `/brief`

Step 2 defines the information model. It does not create a database, API, frontend, or `/brief` integration.

## Step 2 Design Principles

1. **Current state must be easy to read.**  
   The frontend should not need to replay every historical event just to show the current goal.

2. **Important changes must have history.**  
   The system should not silently overwrite milestones, difficulty, blockers, recommendations, or trajectory.

3. **Claims and evidence must stay separate.**  
   A user report, GitHub commit, calendar entry, and AI inference are different types of information.

4. **Recommendations must be explainable.**  
   Every recommendation should reference the facts, answers, or evidence that influenced it.

5. **Privacy belongs on the data.**  
   Visibility should not exist only as a page-level setting.

6. **AI output is a proposal unless explicitly approved.**  
   AI reasoning may recommend updates, but important user goals and privacy settings should not change automatically.

7. **Data can become stale.**  
   Baselines, deadlines, blockers, available time, and priorities need review dates or freshness signals.

8. **The model should work before PostgreSQL.**  
   Step 3 should be able to use the same structure in local JSON or JavaScript sample data.

## Core Relationship Map

```text
Person or Briefing Space
        ↓ owns or contains
Goal
        ├── Success Criteria
        ├── Milestones
        ├── Blockers
        ├── Check-Ins
        ├── Questions
        │      └── Answers
        ├── Recommendations
        │      └── Outcomes
        ├── Evidence
        ├── State Snapshots
        └── Revision Events
```

A future shared briefing space may contain more than one person, but the first prototype only needs one owner and one goal.

## Core MVP Entities

The Step 3 prototype should be designed around nine core entities:

1. Goal
2. Success Criterion
3. Milestone
4. Check-In
5. Question and Answer
6. Recommendation
7. Outcome
8. Evidence
9. Goal State Snapshot

A tenth entity, Revision Event, should be included if practical because it makes changes auditable.

## Shared Field Conventions

Most stored records should use:

```json
{
  "id": "uuid-or-stable-local-id",
  "goal_id": "goal-id-when-applicable",
  "created_at": "2026-08-04T15:40:00-04:00",
  "updated_at": "2026-08-04T15:40:00-04:00",
  "created_by": "user|system|ai|connector",
  "visibility": "private|shared|ai_only|ask_before_brief|never_brief",
  "status": "record-specific-status"
}
```

For the local prototype, readable string IDs are acceptable. A future backend should use UUIDs.

## Entity 1: Goal

The Goal record holds the current readable state of the goal.

Required fields:

- `id`
- `title`
- `desired_outcome`
- `why_it_matters`
- `baseline`
- `status`
- `priority`
- `difficulty_level`
- `trajectory`
- `trajectory_confidence`
- `current_milestone_id`
- `active_question_id`
- `active_recommendation_id`
- `visibility`
- `created_at`
- `updated_at`

Optional fields:

- `target_date`
- `sprint_end_at`
- `previous_difficulty_level`
- `available_time_minutes`
- `energy_level`
- `review_after`
- `paused_reason`
- `completed_at`
- `archived_at`

Allowed goal statuses for the MVP:

```text
draft
active
paused
blocked
completed
abandoned
archived
```

Allowed priority values:

```text
low
normal
high
critical
```

Allowed trajectory values:

```text
improving
stable
unclear
at_risk
blocked
completed
```

Example:

```json
{
  "id": "goal-cmx-backend",
  "title": "Build and understand the CMX backend",
  "desired_outcome": "Deploy a maintainable FastAPI backend that I understand well enough to manage",
  "why_it_matters": "It gives db.cmxchat.com a real backend and helps me learn Python through the project",
  "baseline": "The frontend exists, but backend knowledge is limited and no approved FastAPI service is connected",
  "status": "active",
  "priority": "high",
  "difficulty_level": 3,
  "trajectory": "unclear",
  "trajectory_confidence": "medium",
  "current_milestone_id": "milestone-first-route",
  "active_question_id": "question-first-session-priority",
  "active_recommendation_id": null,
  "target_date": null,
  "visibility": "private",
  "review_after": "2026-08-11T09:00:00-04:00",
  "created_at": "2026-08-04T15:40:00-04:00",
  "updated_at": "2026-08-04T15:40:00-04:00"
}
```

## Entity 2: Success Criterion

Success criteria define how the system knows the goal is complete.

Fields:

- `id`
- `goal_id`
- `description`
- `measurement_type`
- `target_value`
- `current_value`
- `unit`
- `verification_method`
- `required`
- `status`
- `evidence_ids`

Possible measurement types:

```text
boolean
count
percentage
date
text_confirmation
external_evidence
```

Example:

```json
{
  "id": "criterion-fastapi-deployed",
  "goal_id": "goal-cmx-backend",
  "description": "A maintainable FastAPI service is deployed to staging",
  "measurement_type": "boolean",
  "target_value": true,
  "current_value": false,
  "verification_method": "deployment URL and successful health check",
  "required": true,
  "status": "not_met",
  "evidence_ids": []
}
```

## Entity 3: Milestone

Milestones divide a goal into meaningful stages.

Fields:

- `id`
- `goal_id`
- `title`
- `description`
- `sequence`
- `status`
- `target_date`
- `started_at`
- `completed_at`
- `completion_evidence_ids`
- `blocked_by_ids`

Allowed milestone statuses:

```text
planned
active
blocked
completed
skipped
replaced
```

Only one milestone should normally be active for one goal in the MVP.

## Entity 4: Check-In

A Check-In records the user’s current report and available capacity.

Fields:

- `id`
- `goal_id`
- `occurred_at`
- `previous_action_result`
- `available_time_minutes`
- `energy_level`
- `new_change`
- `blocker_type`
- `blocker_note`
- `user_note`
- `submitted_by`
- `visibility`

Allowed previous action results:

```text
completed
partly_completed
not_completed
replaced
no_action_assigned
no_longer_relevant
```

Allowed energy levels:

```text
very_low
low
normal
high
very_high
```

Allowed blocker types:

```text
none
technical
knowledge
time
financial
emotional
dependency
access
health
other
unclear
```

A Check-In should remain append-only after submission. Corrections should create a Revision Event or replacement Check-In instead of silently altering history.

## Entity 5: Question and Answer

Questions represent information the system needs to improve its next decision.

Question fields:

- `id`
- `goal_id`
- `prompt`
- `why_it_matters`
- `question_type`
- `priority`
- `trigger`
- `status`
- `required_for_recommendation`
- `answer_options`
- `asked_at`
- `expires_at`
- `supersedes_question_id`

Allowed question statuses:

```text
queued
active
answered
skipped
expired
superseded
```

Allowed question types:

```text
single_choice
multiple_choice
short_text
long_text
number
time
confirmation
```

Answer fields:

- `id`
- `question_id`
- `goal_id`
- `value`
- `answered_at`
- `answered_by`
- `confidence`
- `visibility`

Only one question should normally have `active` status for a goal in the MVP.

## Entity 6: Recommendation

A Recommendation is one proposed next action.

Fields:

- `id`
- `goal_id`
- `milestone_id`
- `title`
- `reason`
- `estimated_effort_minutes`
- `expected_result`
- `difficulty_level_used`
- `confidence`
- `status`
- `input_reference_ids`
- `created_at`
- `expires_at`
- `supersedes_recommendation_id`

Allowed recommendation statuses:

```text
proposed
accepted
replaced
completed
partly_completed
not_completed
expired
cancelled
```

`input_reference_ids` should point to the check-ins, answers, blockers, evidence, or snapshots that influenced the recommendation.

Only one recommendation should normally be active or accepted at a time for one goal in the MVP.

## Entity 7: Outcome

An Outcome records what happened after a recommendation or user-selected action.

Fields:

- `id`
- `goal_id`
- `recommendation_id`
- `result`
- `summary`
- `what_was_learned`
- `cause`
- `evidence_ids`
- `occurred_at`
- `recorded_by`
- `visibility`

Allowed results:

```text
completed
partly_completed
not_completed
replaced_by_useful_action
no_longer_relevant
```

The outcome should influence future questions and recommendations, but it should not function as a punishment score.

## Entity 8: Evidence

Evidence supports or challenges a claim about progress, blockers, completion, or current state.

Fields:

- `id`
- `goal_id`
- `evidence_type`
- `source_type`
- `source_reference`
- `summary`
- `claim_supported`
- `confidence`
- `verification_status`
- `occurred_at`
- `captured_at`
- `expires_at`
- `visibility`

Allowed evidence types:

```text
self_report
file
screenshot
link
commit
deployment
calendar_event
task_completion
message
metric
system_observation
other
```

Allowed source types:

```text
user
github
calendar
gmail
drive
clickup
spotify
finance
uploaded_file
system
ai_inference
other
```

Allowed verification statuses:

```text
unverified
user_confirmed
source_confirmed
contradicted
expired
```

AI inference should never be stored as source-confirmed evidence.

## Entity 9: Goal State Snapshot

A Goal State Snapshot records the interpreted state after a meaningful update.

Fields:

- `id`
- `goal_id`
- `snapshot_at`
- `trajectory`
- `trajectory_confidence`
- `current_milestone_id`
- `active_blocker_ids`
- `active_question_id`
- `active_recommendation_id`
- `difficulty_level`
- `progress_summary`
- `positive_factors`
- `risk_factors`
- `source_reference_ids`
- `created_by`

Snapshots are append-only. The current Goal record may point to the latest snapshot.

## Entity 10: Revision Event

Revision Events explain who changed important data and why.

Fields:

- `id`
- `goal_id`
- `entity_type`
- `entity_id`
- `field_name`
- `old_value`
- `new_value`
- `reason`
- `changed_by`
- `changed_at`
- `requires_confirmation`
- `confirmed_at`

Revision Events are especially important for:

- Goal outcome changes
- Difficulty changes
- Target date changes
- Priority changes
- Privacy changes
- Milestone replacement
- AI-proposed updates
- User corrections

## Blockers

Blockers may begin as structured fields inside Check-Ins, but Step 5 should likely promote them into their own records.

Proposed blocker fields:

- `id`
- `goal_id`
- `type`
- `description`
- `severity`
- `status`
- `first_seen_at`
- `last_confirmed_at`
- `resolved_at`
- `resolution`
- `source_reference_ids`

Allowed blocker statuses:

```text
active
monitoring
resolved
invalid
expired
```

## Visibility Policy

Each important record should carry one visibility value.

```text
private
shared
ai_only
ask_before_brief
never_brief
goal_only
```

Meaning:

- `private`: visible only to the owning user
- `shared`: allowed in the shared space and potentially in shared output
- `ai_only`: usable for reasoning but hidden from ordinary page output
- `ask_before_brief`: requires confirmation before inclusion in a brief
- `never_brief`: may be stored but must never appear in `/brief`
- `goal_only`: visible inside the goal experience but excluded from general brief output

A future shared space may also need an explicit list of permitted user IDs. The MVP does not need that yet.

## Confidence Model

Use simple labels in the prototype:

```text
low
medium
high
```

Confidence should be stored separately for:

- Evidence
- Answers when uncertain
- Recommendations
- Trajectory
- AI-proposed updates

Confidence is not the same as probability of success.

## Freshness and Staleness

The following information may require review dates:

- Baseline
- Target date
- Priority
- Difficulty
- Available capacity
- Active blocker
- Current milestone
- Privacy permission
- Recommendation
- Active question

Useful fields:

```text
last_confirmed_at
review_after
expires_at
superseded_at
```

Expired data should not be deleted automatically. It should be marked stale and either confirmed, replaced, or ignored in current reasoning.

## Current State Versus History

The data model should use both:

1. **Current readable records** for fast frontend display
2. **Append-only history records** for auditability and future reasoning

Recommended behavior:

```text
User submits check-in
        ↓
Check-in is stored unchanged
        ↓
Question answer is stored unchanged
        ↓
System proposes state changes
        ↓
Approved current Goal fields are updated
        ↓
Goal State Snapshot is appended
        ↓
Revision Events explain important changes
```

## Step 3 Local Prototype Shape

Before FastAPI or PostgreSQL, the isolated prototype can use a single JavaScript or JSON bundle:

```json
{
  "goals": [],
  "success_criteria": [],
  "milestones": [],
  "check_ins": [],
  "questions": [],
  "answers": [],
  "recommendations": [],
  "outcomes": [],
  "evidence": [],
  "state_snapshots": [],
  "revision_events": []
}
```

This shape is intentionally close to future database tables, but it remains easy to inspect during the frontend prototype.

## Minimum Step 3 Data Bundle

The first isolated prototype only needs:

- One Goal
- One or more Success Criteria
- One active Milestone
- One active Question
- Zero or one active Recommendation
- A Check-In history
- An Outcome history
- Optional Evidence
- A latest Goal State Snapshot

Connectors, multiple users, advanced source permissions, and vector data are deferred.

## Goal Update Flow

```text
1. Read the current Goal and latest Snapshot
2. Record a Check-In or Answer
3. Identify changed facts and missing information
4. Update or create the active Blocker
5. Close, supersede, or keep the active Question
6. Create one Recommendation
7. Record the user’s Outcome later
8. Append a new Snapshot
9. Update the readable Goal pointers
10. Add Revision Events for important changes
```

## Goal Pulse Data Contract

The future Goal Pulse should be generated from structured data, not manually rewritten text.

```json
{
  "goal_id": "goal-cmx-backend",
  "goal_title": "Build and understand the CMX backend",
  "trajectory": "improving",
  "trajectory_confidence": "medium",
  "difficulty_level": 3,
  "current_milestone": "First working API route",
  "primary_blocker": "Limited understanding of the setup sequence",
  "best_action": "Run one local FastAPI route",
  "estimated_effort_minutes": 30,
  "active_question": "Do you want to understand each line first or prove the route works first?",
  "updated_at": "2026-08-04T15:40:00-04:00",
  "visibility": "private"
}
```

This contract can be tested outside `/brief` during Step 3 and Step 4.

## Data Integrity Rules

1. A Goal must always have an owner or owning space.
2. A completed Goal must have at least one met required success criterion or an explicit user override.
3. A Goal should normally have no more than one active milestone.
4. A Goal should normally have no more than one active question.
5. A Goal should normally have no more than one accepted active recommendation.
6. Sprint difficulty requires an end date.
7. A recommendation must include at least one reason or input reference.
8. An evidence record must identify its source type.
9. AI inference cannot be marked source-confirmed.
10. `never_brief` data cannot appear in a Goal Pulse or `/brief` output.
11. Important user data cannot be deleted solely because it became stale.
12. AI-proposed changes to goal outcome, priority, target date, or privacy require confirmation.
13. An outcome should reference the recommendation it evaluates when one exists.
14. State snapshots are append-only.
15. User corrections should remain visible in the revision history.

## Step 2 Acceptance Criteria

Step 2 is ready to support Step 3 when:

1. The Step 1 lifecycle can be represented without inventing unstructured fields.
2. The current goal can be displayed without replaying the full event history.
3. The history can explain how the current state was reached.
4. Every recommendation can identify what influenced it.
5. User reports and external evidence remain distinguishable.
6. Difficulty, trajectory, and confidence are stored independently.
7. Privacy can be applied to individual records.
8. One active question and one active recommendation can be enforced.
9. Stale information can be marked without deleting it.
10. The same model can work in local prototype data and later PostgreSQL tables.
11. A structured Goal Pulse can be generated without touching `/brief`.
12. Important AI-proposed updates can require user confirmation.

## Step 2 Decisions Currently Proposed

These are proposals and may still be revised:

- The first prototype has one owner and one goal.
- Difficulty is stored on the Goal and copied into each Recommendation and Snapshot.
- Current state lives on the Goal for fast display.
- Check-Ins, Answers, Outcomes, Evidence, Snapshots, and Revision Events are append-only.
- One primary Question and one primary Recommendation are active at a time.
- Goal completion is tied to Success Criteria.
- Visibility is attached to individual records.
- Confidence uses low, medium, and high labels.
- AI inference is stored separately from verified evidence.
- The Goal Pulse has its own stable data contract before `/brief` integration.

## Step 2 Open Questions

- Should a shared Jay and Crystal space be modeled in Step 3 or postponed until after the single-user loop works?
- Should Blocker be a full entity in the frontend prototype or remain inside Check-Ins until FastAPI work begins?
- Should capacity use only time, or time plus energy?
- Should goal priority be a label, a numeric rank, or both?
- Should success criteria permit weighted importance later?
- How much revision history should be shown in the interface?
- Should a skipped Question return to the queue automatically?
- Should the user be able to accept a Recommendation while editing its wording?
- Should an Outcome be allowed for a user-created action that had no system Recommendation?
- Which fields should be mandatory before the system can produce its first Recommendation?

## Step 2 Result

Step 2 now provides a proposed information architecture for the goal intelligence loop.

No code, database, API, route, production page, or `/brief` component has been created or changed.

The next roadmap step, when explicitly approved, is Step 3: build an isolated frontend prototype using sample or local data.

# Relationship to `/brief`

The long-term idea is that `/brief` could become the daily output layer of the goal intelligence system.

The Goal Intelligence layer would decide what matters. A brief-generation layer would select safe and relevant output. `/brief` would display the result clearly.

```text
Goal Intelligence data and reasoning
        ↓
Permission and relevance filtering
        ↓
Goal Pulse data contract
        ↓
/brief presentation
```

No `/brief` implementation should begin until Step 7 is explicitly approved.

# Possible Future Technical Direction

This concept fits the planned FastAPI-first direction for `db.cmxchat.com`.

```text
Frontend
   ↓
FastAPI
   ├── Goal API
   ├── Check-In API
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
GET  /api/goals/{id}
PATCH /api/goals/{id}
POST /api/goals/{id}/check-ins
GET  /api/goals/{id}/questions
POST /api/goals/{id}/answers
GET  /api/goals/{id}/recommendation
POST /api/recommendations/{id}/outcomes
GET  /api/goals/{id}/pulse
GET  /api/brief
```

This architecture is not approved or final.

# Main Product Risk

The largest risk is trying to build the entire intelligence platform before proving that the interaction is useful.

The minimum valuable version remains small:

- Define one goal
- Select difficulty
- Answer a short check-in
- Receive one useful question
- Receive one recommended action
- Record the outcome
- See the goal state update
- Generate a compact Goal Pulse outside `/brief`

If that loop is useful, the broader system can grow around it.

# Current Working Summary

```text
Goals define direction.
Data describes reality.
Questions reduce uncertainty.
Recommendations create movement.
Evidence keeps the system honest.
The brief eventually explains what matters today.
```

Possible working names:

- Objective Engine
- Goal Intelligence
- CMX Goal Intelligence
- Personal Intelligence Layer

No name has been selected.

# Future Revision Guidance

When revising this document:

1. Preserve the original creation date.
2. Update the Last revised field.
3. Add a brief entry to the revision log.
4. Clearly distinguish confirmed decisions from ideas still being explored.
5. Do not treat this concept file as permission to change `/brief`.
6. Revise the same file unless there is a strong reason to create a separate specification.
7. Update the roadmap status as work is approved and completed.
8. Keep observed bugs separate from approved implementation work.

# Revision Log

## August 4, 2026, Step 2 update

- Recorded three reported `/brief` issues without investigating or changing the page.
- Added the Step 2 information architecture.
- Defined core entities, relationships, shared fields, statuses, confidence, freshness, visibility, and integrity rules.
- Added local prototype data shape and a structured Goal Pulse contract.
- Added Step 2 acceptance criteria, proposed decisions, and open questions.
- Marked Step 2 as drafted and kept Step 3 unstarted.
- Confirmed that `/brief` remains untouched and unauthorized until Step 7.

## August 4, 2026, Step 1 update

- Added the proposed eight-step roadmap.
- Marked Step 0 complete.
- Defined the smallest working loop MVP.
- Added goal setup, difficulty behavior, check-in fields, question logic, recommendations, outcomes, trajectory, Goal Pulse, user controls, success criteria, and non-goals.
- Confirmed that `/brief` remains untouched and unauthorized until Step 7.

## August 4, 2026, initial concept

- Initial concept recorded.
- Added goals as the organizing layer.
- Added interactive questioning and structured updates.
- Added difficulty modes.
- Added evidence, trajectory, privacy, architecture, and staged development ideas.
- Marked the document as an idea record only, with no authorization to modify `/brief`.
