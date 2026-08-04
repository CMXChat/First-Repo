# Brief Project Concept: Goal-Directed Personal Intelligence System

**Created:** August 4, 2026  
**Status:** Living concept note  
**Project:** `db.cmxchat.com` / `/brief`  
**Implementation status:** Idea only  
**Authority:** This document records the concept. It does not authorize changes to `/brief` or any related production page.

## Purpose of This Document

This file preserves the current idea so it can be found from future ChatGPT context windows, reviewed later, and revised as the project becomes clearer.

It is not a requirements document, final architecture, build order, or permanent rule set. It is a dated record of the direction being considered on August 4, 2026.

The core question is:

> What if `/brief` eventually becomes the visible output of a personal data and goal intelligence system that continuously learns what the user is trying to accomplish, asks useful questions, updates its understanding, and structures information around improving the chance of reaching those goals?

## Core Idea

The project could evolve from a frontend briefing page into a goal-directed personal intelligence layer.

The system would collect authorized information, organize it around defined goals, identify uncertainty or missing context, ask interactive questions, track evidence and progress, and generate recommendations based on the user’s current reality.

The `/brief` page could eventually become the daily operating report produced by this system.

Instead of showing disconnected information, it would answer questions such as:

- What is the user trying to accomplish?
- What changed since the last update?
- What progress was actually made?
- What is blocking progress?
- What information is missing or stale?
- What is the highest-value next action?
- How difficult should today’s plan be?
- What evidence supports the recommendation?

## Proposed System Loop

```text
Collect authorized information
        ↓
Update the user and goal state
        ↓
Identify missing information, uncertainty, and blockers
        ↓
Ask one useful question when necessary
        ↓
Recommend the highest-value next action
        ↓
Record what happened
        ↓
Adjust the plan and difficulty
        ↓
Generate the next /brief output
```

The loop is more important than any individual page or visual feature.

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

A goal should be measurable enough that the system can distinguish movement, delay, completion, and changed priorities.

## Interactive Goal Updating

The Goals area should not behave like a static task list.

It could ask focused questions that update the system’s understanding. Questions should only be asked when the answer could change the recommendation, priority, confidence, or interpretation of progress.

Possible triggers include:

- Important information is missing
- A previous answer has become stale
- A milestone was completed
- A recommended action was skipped repeatedly
- A new blocker appeared
- The deadline changed
- The user’s available time or resources changed
- Reported behavior conflicts with the current plan
- The system is uncertain between two next actions

Examples:

- Did you complete the action selected yesterday?
- What prevented you from completing it?
- Is this goal still a current priority?
- How much time do you realistically have today?
- Did the previous recommendation help?
- What did you learn from the attempt?
- Has the deadline or desired outcome changed?
- Is the current blocker technical, financial, emotional, logistical, or unclear?

The system should avoid asking questions merely to collect more data.

## Difficulty Lever

A difficulty or intensity control could adjust how demanding the recommendations are without changing factual honesty.

Possible levels:

1. **Recovery**  
   Tiny actions intended to protect continuity and restart momentum.

2. **Sustainable**  
   Low-pressure, steady progress with modest daily requirements.

3. **Focused**  
   Meaningful execution with clear accountability and realistic workload.

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

Sprint mode should probably expire automatically or require a review date.

## Evidence and Progress

The system should separate intention from evidence.

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

Future probability estimates should only be considered if enough reliable historical data exists.

## Relationship to `/brief`

The long-term idea is that `/brief` could become the daily output layer of the goal intelligence system.

A goal section might show:

```text
Goal: Build the CMX backend
Status: Moving forward
Difficulty: Focused
Current milestone: Connect a frontend form to FastAPI
Primary blocker: Deployment workflow is still unclear
Best action today: Create one working POST endpoint and save submitted data
Estimated effort: 30 to 45 minutes
Open question: Is today’s priority understanding the code or proving the route works?
```

Other information in the brief could be selected according to its relevance to active goals, including:

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

## Possible Frontend Areas

These are conceptual only:

```text
/brief
/goals
/check-in
/profile
/sources
/memory
/timeline
/decisions
/settings
```

The Goals experience could include:

- Create and edit goals
- Choose difficulty
- Answer one contextual question at a time
- Review the current milestone
- View the recommended next action
- Record the result
- Inspect evidence and confidence
- Review how the plan changed over time

## Possible Data Model

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

Check-ins, evidence, decisions, recommendations, and questions should likely exist as separate records connected to a goal.

## Possible Technical Direction

This concept fits the planned FastAPI-first direction for `db.cmxchat.com`.

A possible future structure:

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
   ├── Vector search, if useful
   ├── File storage
   └── Activity and audit logs
```

Potential API routes:

```text
GET  /api/goals
POST /api/goals
POST /api/goals/{id}/check-ins
GET  /api/goals/{id}/questions
POST /api/goals/{id}/answers
GET  /api/brief
```

This architecture is not approved or final. It is included to preserve the current reasoning.

## Suggested Development Sequence

### Stage 1: Frontend Concept

Create a static or local prototype with sample data.

Prove that the following interaction is useful:

- One to three active goals
- Difficulty selection
- One daily check-in
- One contextual question
- One recommended action
- A history of outcomes
- A small goal pulse inside `/brief`

### Stage 2: Structured Storage

Connect the experience to FastAPI and PostgreSQL.

Store goals, answers, check-ins, evidence, recommendations, and revisions.

### Stage 3: AI Reasoning

Provide the AI with only the goal-relevant context needed to produce structured recommendations and questions.

Possible output:

```json
{
  "trajectory": "at_risk",
  "reasoning_summary": "The current milestone has been postponed three times.",
  "next_action": "Create the FastAPI project locally and run one route.",
  "question": "What has prevented you from starting the backend setup?",
  "confidence": "medium"
}
```

### Stage 4: Connected Data

Add optional, authorized connectors only after the core loop proves useful.

Possible sources:

- GitHub
- Google Calendar
- Gmail
- Google Drive
- ClickUp
- Spotify
- Financial data
- Manual journal entries

Each connector should be optional, permission-aware, and scoped to relevant goals.

## Main Product Risk

The largest risk is trying to build the entire intelligence platform before proving that the daily interaction is useful.

The minimum valuable version is small:

- Define a goal
- Select difficulty
- Answer a check-in
- Receive one useful question
- Receive one recommended action
- Record the outcome
- See the result reflected in the brief

If that loop is useful, the system can grow around it.

## Current Working Summary

```text
Goals define direction.
Data describes reality.
Questions reduce uncertainty.
Recommendations create movement.
Evidence keeps the system honest.
The brief explains what matters today.
```

Possible working names discussed:

- Objective Engine
- Goal Intelligence
- CMX Goal Intelligence
- Personal Intelligence Layer

No name has been selected.

## Open Questions

- Should goals belong to an individual, a shared space, or both?
- How should the system decide when to ask a question?
- Which data should expire or require confirmation?
- Should difficulty be set globally or per goal?
- How should conflicting goals be prioritized?
- What should happen after repeated non-completion?
- How much reasoning should be visible to the user?
- Which evidence sources are trustworthy enough to affect progress?
- How should shared and private information be separated?
- What is the smallest frontend prototype that could prove the idea?

## Future Revision Guidance

When revising this document:

1. Preserve the original creation date.
2. Update the **Last revised** field below.
3. Add a brief entry to the revision log.
4. Clearly distinguish confirmed decisions from ideas still being explored.
5. Do not treat this concept file as permission to change `/brief`.
6. Revise the same file unless there is a strong reason to create a new version.

**Last revised:** August 4, 2026

## Revision Log

### August 4, 2026

- Initial concept recorded.
- Added goals as the organizing layer.
- Added interactive questioning and structured updates.
- Added difficulty modes.
- Added evidence, trajectory, privacy, architecture, and staged development ideas.
- Marked the document as an idea record only, with no authorization to modify `/brief`.
