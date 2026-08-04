# Brief, Goals, and Info Product Structure

**Created:** August 4, 2026  
**Project:** `db.cmxchat.com`  
**Status:** Product-structure concept and handoff note  
**Scope:** Top-level navigation, `/brief`, Goal Intelligence, and project information  
**Authority:** This note records the intended product direction. It does not authorize immediate changes to `/brief` or existing live routes.

---

## Core Idea

The project currently contains three different jobs that should become easier to understand and use:

1. **Show the personalized briefing experience.**
2. **Give the user a real place to create and manage goals.**
3. **Explain the product, architecture, roadmap, and technical work.**

These jobs should become three clear top-level areas:

```text
Brief
Goals
Info
```

This structure keeps `/brief` strong as the main product demonstration while giving Goal Intelligence its own working space and moving project documentation into a clear information area.

---

## Recommended Top-Level Navigation

```text
CMX Personal Intelligence Platform
│
├── Brief
│   └── Personalized daily output and product experience
│
├── Goals
│   └── Goal dashboard, inputs, check-ins, recommendations, and evidence
│
└── Info
    └── Product documentation, architecture, status, roadmap, and learning material
```

The three areas serve different purposes and should not compete for attention inside one page.

---

## 1. Brief

### Purpose

**Brief** is the user-facing experience and the strongest demonstration of what the wider platform can become.

It should show how approved information can be turned into a useful daily view for different relationships and working contexts:

- Personal.
- Relationship.
- Business partners.
- Trainer and student.
- Team and project.

The current `/brief` work already contains rich scenario design, schedules, priorities, spaces, plans, media, memory concepts, and deeper views. That work should remain visible and impressive without being forced to carry every technical explanation or every data-entry workflow.

### Recommended role

`/brief` should remain:

- A polished product demonstration.
- The daily output surface.
- A place to experience several briefing types.
- A future destination for compact Goal Pulse output.
- A way to show how private and shared intelligence could feel.
- A strong page that can be shown to collaborators, testers, and potential users.

### What should stay out of the default Brief experience

The default briefing should not become the main place for:

- Long technical documentation.
- Backend architecture lessons.
- Full project status reports.
- Large goal-creation forms.
- Detailed evidence management.
- Every roadmap and platform concept.
- Repeated explanations of what the product may do later.

Those areas should remain accessible through Goals or Info.

### Internal Brief structure

The existing hierarchy remains useful:

```text
Entry
  ↓
Focus View
  ↓
Workspace
  ↓
Full View
  ↓
Walkthrough
  ↓
Terminal
```

Brief should prioritize the output first, then allow deeper exploration.

---

## 2. Goals

### Purpose

**Goals** should become the active dashboard and input layer for Goal Intelligence.

This is where a user creates a goal, gives the system the information it needs, records what happened, reviews evidence, and sees the next recommended action.

The Goals area should work independently before it is deeply integrated into `/brief`.

### Recommended route

```text
/goals/
```

A temporary prototype route may be used during development, but `/goals/` is the clearest long-term product name.

### What Goals should contain

#### Dashboard

A compact overview of:

- Active goals.
- Current trajectory.
- Next recommended action.
- Current blocker.
- Difficulty level.
- Milestone progress.
- Latest Goal Pulse.
- Questions that require an answer.

#### Goal creation and editing

The user should be able to provide:

- Goal title.
- Desired outcome.
- Reason the goal matters.
- Current baseline.
- Success criteria.
- Priority.
- Difficulty.
- Target date when useful.
- Available time.
- Known blockers.
- Privacy and visibility.

#### Check-ins

The check-in should remain short:

- Was the last action completed?
- How much time or energy is available?
- What changed?
- Is there a blocker?
- Is there anything else the system should know?

#### Questions

The system should show one high-value question when the answer can change the next action, milestone, difficulty, interpretation, or confidence.

#### Recommendations

Each recommendation should explain:

- What to do next.
- Why it matters now.
- Expected effort.
- Expected result.
- Current milestone.
- Difficulty used.
- Confidence.
- Which inputs or evidence influenced it.

#### Outcomes and evidence

The user should be able to record what happened and attach or connect evidence where appropriate.

The system must distinguish among:

- Planned action.
- User report.
- Evidence.
- Verified result.
- AI interpretation.

#### History and correction

Goals should preserve an understandable history. The user should be able to correct a record without silently deleting the original state.

### Recommended Goals navigation

```text
Dashboard
Goals
Check-ins
Evidence
History
Settings
```

The first prototype can be much smaller. A useful initial version only needs one goal, one difficulty control, one check-in, one question, one recommendation, one outcome, and one Goal Pulse.

### Relationship to Brief

Goals should power Brief later through a small structured output:

```text
Goal state
   ↓
Question and recommendation engine
   ↓
Goal Pulse
   ↓
Brief
```

Brief should receive the useful summary. Goals should retain the detailed input, history, evidence, and controls.

---

## 3. Info

### Purpose

**Info** should become the project handbook and information center.

It explains what CMX is building, how the system works, what is currently active, what remains planned, how privacy is handled, and how the project is being developed.

This gives technical material a proper home without weighing down the Brief experience.

### Recommended route

```text
/info/
```

### What Info should contain

#### Overview

- What the product is.
- Who it is for.
- What problem it solves.
- How Brief, Goals, memory, spaces, and approved actions work together.

#### Product

- Briefing types.
- Focus and Full View.
- Goals and Goal Pulse.
- Private and shared spaces.
- Memory and correction controls.
- Connectors and scheduled updates.

#### Architecture

- Frontend structure.
- FastAPI plan.
- Docker and Linux runtime.
- PostgreSQL.
- Cloudflare Access and Tunnel.
- Data flow.
- Permissions.
- AI and typed tools.

#### Current status

- What works today.
- What is a static demonstration.
- Known issues.
- Current development phase.
- Recent meaningful changes.

#### Roadmap

- Frontend stabilization.
- Goal prototype.
- Deterministic goal engine.
- FastAPI foundation.
- PostgreSQL persistence.
- Identity and permissions.
- AI reasoning.
- Goal Pulse integration.
- Authorized connectors.

#### Security and privacy

- Public, demonstration, connected, private, and shared data.
- Credential handling.
- User control.
- Auditability.
- Production approval.
- Why client-side gates are not the final security boundary.

#### Learning and collaboration

- The owner’s Python learning path.
- CR’s technical role.
- How CMX keeps product and deployment control.
- How future AI agents should inspect, report, build, test, and document changes.

### Recommended Info navigation

```text
Overview
Product
Architecture
Status
Roadmap
Security
Docs
```

### Relationship to existing routes

The existing routes contain useful work:

```text
/plans/
/build/
/ai/
/backend/
/architecture/
/updates/
```

They do not need to be deleted immediately. Info can become the clear parent experience that organizes and links these sections.

Over time, CMX can choose among three approaches:

1. Keep the existing routes as dedicated sections linked from Info.
2. Move their strongest content into Info while preserving redirects.
3. Keep advanced technical pages separate and use Info as the readable front door.

The third option is likely the safest first move because it preserves the existing work while improving clarity.

---

## Why This Structure Is Stronger

### It protects `/brief`

Brief can remain visually strong, personal, and easy to demonstrate. It no longer has to explain every technical decision or manage every piece of user input.

### It gives Goal Intelligence a real home

Goals stops being only a future concept hidden behind the briefing. It becomes a product area where the intelligence loop can be tested honestly.

### It makes the project easier to explain

A visitor can understand the platform through three questions:

```text
What does it show me?       Brief
What am I working toward?   Goals
How does it work?           Info
```

### It supports staged development

The three areas can mature at different speeds:

- Brief can continue improving as a demonstration.
- Goals can begin as a local prototype and later gain a backend.
- Info can organize current documentation immediately.

### It reduces architecture confusion

Technical documentation, live user output, and structured user input each receive a clear owner.

---

## Recommended Product Map

```text
                    CMX PERSONAL INTELLIGENCE
                              │
              ┌───────────────┼───────────────┐
              │               │               │
           BRIEF            GOALS            INFO
              │               │               │
      Daily intelligence   Goal dashboard   Product overview
      Scenario experience  User input       Architecture
      Focus and Full View  Check-ins        Current status
      Goal Pulse output    Questions        Roadmap
      Shared spaces        Recommendations  Security
      Demonstration        Evidence         Documentation
                              │
                              ▼
                   Structured goal state
                              │
                              ▼
                   Compact Goal Pulse
                              │
                              ▼
                            BRIEF
```

---

## Recommended Implementation Sequence

### Step 1: Preserve the concept

Record Brief, Goals, and Info as the preferred top-level product structure. This document completes that step.

### Step 2: Keep `/brief` stable

Continue current browser validation and cleanup. Do not interrupt the demo with a broad navigation rebuild before current issues are understood.

### Step 3: Design the Info front door

Create a simple information architecture that organizes the existing plans, architecture, backend, AI, Build Lab, and update material.

This can begin as a static page because most of the source material already exists.

### Step 4: Build the isolated Goals prototype

Use local sample data and the drafted Goal Intelligence data model. Keep it separate from `/brief`.

### Step 5: Test the goal loop

Confirm that a user can create one goal, check in, answer one useful question, receive one recommendation, record the outcome, and understand the Goal Pulse.

### Step 6: Add the backend foundation

Use FastAPI and PostgreSQL to persist goal records after the interface and behavior are approved.

### Step 7: Connect Goals to Brief

Allow Brief to consume the compact Goal Pulse. Keep detailed goal management in Goals.

### Step 8: Unify top-level navigation

Once the three areas are stable, add the final Brief, Goals, and Info navigation across the product.

---

## Naming Recommendation

Use the plain names:

```text
Brief
Goals
Info
```

They are understandable without explanation.

Possible route names:

```text
/brief/
/goals/
/info/
```

Avoid using `Dashboard` as the top-level replacement for Goals because Dashboard describes a layout, while Goals describes the actual purpose.

Avoid using `Docs` as the top-level replacement for Info because Info can serve non-technical visitors while still containing technical documentation.

---

## Current Recommendation

The strongest current direction is:

- Keep `/brief` as the excellent demonstration and future daily output surface.
- Give Goal Intelligence its own `/goals/` dashboard and input experience.
- Create `/info/` as the understandable project, product, technical, and roadmap hub.
- Let Goals generate a compact Goal Pulse for Brief after the goal loop is proven.
- Preserve existing technical routes while Info becomes their organized front door.

This creates a product that is easier to demonstrate, easier to build, and easier to understand without discarding the work already completed.
