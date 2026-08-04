# CMX `/brief` Master System Context and AI Collaboration Handoff

**Created:** August 4, 2026 at 4:40 PM EDT  
**Last verified against `main`:** August 4, 2026  
**Verified repository head:** `7b5588965ce2356a56768b8bf9c893b81c53dff8`  
**Repository:** `CMXChat/First-Repo`  
**Primary deployment:** `https://db.cmxchat.com/`  
**Primary product route:** `https://db.cmxchat.com/brief/`  
**Status:** Living master context, program handoff, and future-AI operating reference  
**Audience:** The CMX owner, CR, future AI agents, developers, reviewers, and authorized collaborators  
**Maintenance rule:** Update this file after a material product decision, architecture change, completed phase, security change, or major roadmap revision.

---

## 1. Purpose of This File

This file is the durable master context for the CMX `db.cmxchat.com` project, with special focus on `/brief`, the goal intelligence system, the AI control plan, the Build Lab, the plans archive, the Python and FastAPI learning path, and the future backend platform.

It exists so a new AI context window or authorized collaborator can quickly understand:

- What CMX is building.
- Why the project exists.
- What is already implemented.
- What is currently a static demonstration.
- What remains conceptual or planned.
- Which technical decisions are settled.
- Which decisions remain open.
- How `/brief`, `/ai`, `/build`, `/plans`, `/backend`, `/architecture`, `/updates`, and related routes fit together.
- How the user is learning Python through the project.
- What CR is helping establish.
- How future AI agents should investigate, report, design, code, test, and document changes.
- Which privacy, permission, deployment, and approval boundaries must remain intact.

This file should make it possible for a future AI to produce a full project report, identify the next phase, review a proposed change, build a scoped feature, or prepare a handoff without relying on a single conversation history.

This is a living synthesis. It does not replace current code inspection. It gives the project one stable explanation and operating model across changing context windows.

---

## 2. Authority and Source-of-Truth Order

When information conflicts, use this order:

1. The owner’s latest explicit instruction.
2. Current code on the repository default branch.
3. Current deployment behavior when it can be safely verified.
4. This master context file, using its latest revision timestamp.
5. Current dated implementation and roadmap documents.
6. Current route registry, manifests, contracts, and test expectations.
7. Older documentation, reports, mockups, branches, and conversations.

Important operating rules:

- Inspect recent commits before making changes because multiple AI or development contexts may work in the repository close together.
- Do not assume an older document describes the current implementation.
- Do not assume a deployed visual proves the presence of a secure backend.
- Do not describe a planned feature as active.
- Do not allow this document to become stale while code and architecture change around it.
- When a material conflict is found, record it clearly and update the appropriate source after owner approval.

The most important supporting documents at the time this file was created are:

```text
docs/concepts/brief-program-status-and-roadmap-2026-08-04.md
docs/concepts/brief-system-progress-roadmap-2026-08-04.md
docs/concepts/brief-goal-intelligence-concept-2026-08-04.md
docs/concepts/cmx-gates-system-ai-handoff-2026-08-04.md
```

The program-status report is the primary approved planning record for the current `/brief` cleanup and roadmap. The other files provide complementary implementation, goal-system, and gate architecture detail.

---

## 3. Executive Summary

CMX is building a private, permission-aware personal intelligence platform. The visible daily briefing is the first product surface, while the deeper system eventually organizes authorized information, structured memory, goals, evidence, permissions, shared spaces, and approved actions.

The current `/brief` page proves that one interface can support several briefing relationships:

- Personal.
- Relationship.
- Business partners.
- Trainer and student.
- Team and project.

The current implementation contains strong design work and many useful frontend modules. It is still largely a static proof of experience delivered from GitHub Pages. It does not yet have production user accounts, secure server sessions, private database storage, real connector permissions, persistent goal records, scheduled backend jobs, or a live AI control plane.

The product direction is to refine the frontend into one coherent application with these connected layers:

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

The deeper organizing layer is Goal Intelligence. It should collect only authorized and relevant information, maintain an understandable goal state, ask one useful question when needed, recommend one high-value action, record evidence and outcomes, adjust difficulty and trajectory, and later generate a compact Goal Pulse for `/brief`.

The planned technical direction is a Dockerized FastAPI application on Linux with PostgreSQL, protected through Cloudflare Access and Tunnel, with GitHub as the source of truth and separate development, staging, and production environments. Human approval remains required for production changes.

Python learning is part of the product plan. The goal is for the owner to understand and manage the backend instead of receiving an unexplained system. CR supports the foundation and implementation while CMX retains product direction, approval, repository ownership, and final operational control.

---

## 4. Product Identity and Core Vision

### 4.1 What the product is

The long-term product is a personal and shared operating layer that can deliver scheduled, context-aware briefings and turn approved information into useful decisions and actions.

A mature version could organize:

- Weather and location-aware information.
- Calendar events and time commitments.
- Important emails and messages.
- Tasks and project work.
- Financial records and business metrics.
- Workouts, routines, and health-related self-reports.
- Personal goals and progress.
- Relationship plans and shared agreements.
- Business-partner responsibilities and decisions.
- Team handoffs, procedures, risks, and deadlines.
- Music, narration, alarms, and morning or evening routines.
- Files, notes, reports, memories, and corrections.
- Approved connector activity from outside services.

The briefing should present the smallest useful amount first. Deeper detail should remain available without forcing the user through a long product demonstration every day.

### 4.2 What makes the system distinct

The value comes from the combination of:

- Structured user and workspace context.
- Editable memory.
- Permission-aware data access.
- Goal-directed reasoning.
- Visible evidence and freshness.
- Separate private and shared spaces.
- Repeatable scheduled updates.
- Explainable recommendations.
- Approved actions through typed tools.
- Replaceable AI providers behind a stable product layer.

The product should not depend on one model provider. The models can change while the data contracts, permissions, tools, product behavior, and user controls remain owned by CMX.

### 4.3 Product principles

The following principles should guide design and implementation:

1. Show useful information before product explanation.
2. Keep daily output small enough to act on.
3. Preserve access to deeper context without cluttering the default view.
4. Ask questions only when an answer can change a decision.
5. Show why a recommendation exists.
6. Separate user reports, evidence, and AI inference.
7. Keep private and shared information visibly distinct.
8. Require approval for meaningful writes and external actions.
9. Let the user correct, delete, pause, or replace system interpretations.
10. Avoid fake certainty and unsupported success percentages.
11. Build thin working loops before broad platform complexity.
12. Use the project to teach the owner how the system works.

---

## 5. Current Route and Platform Map

The central route registry currently identifies the following important platform surfaces.

### 5.1 Root and operations

- `/` is the CMX Restricted Node entry and controlled launcher.
- `/directory/` is the approved operations directory.
- `/osint/`, `/phone/`, `/metadata/`, `/resources/`, `/missing/`, and `/search/` are active research or OSINT tools.

### 5.2 Planning and technical routes

- `/build/` is the Build Lab and future operational control room.
- `/architecture/` is the Architecture and Learning Center.
- `/backend/` is the backend blueprint and planned technical source of truth.
- `/ai/` is the AI control blueprint.
- `/updates/` is the readable platform status and project brief.
- `/plans/` is the dated product and platform plan archive.

### 5.3 Product routes

- `/brief/` is the personalized briefing product demonstration and current primary product surface.
- `/news/` is an earlier and related personalized daily-briefing proof of experience. It remains useful context for scheduled personal briefings and publishing workflows.

### 5.4 Internal and experimental routes

The repository also contains internal, client, agency, legacy, and experimental routes. These should not be treated as part of the `/brief` product architecture unless the owner explicitly connects them.

Route status, visibility, and gating can change. Always inspect `assets/cmx-routes.json` before producing a current route inventory.

---

## 6. Current Runtime Truth

As of the verified commit in this file:

### 6.1 Active today

- Static HTML, CSS, and JavaScript pages.
- GitHub as the repository source of truth.
- GitHub Pages style static deployment behavior.
- Browser-side route registry checks.
- Browser-side demonstration state and local preferences.
- Static briefing scenarios and dated content modules.
- Frontend gates and controlled visual entry experiences.
- A unified `/brief` application layer added over the existing long-form implementation.
- Documentation for backend, AI, deployment, permissions, and goal intelligence.

### 6.2 Planned and not yet active as production services

- A Python application runtime.
- FastAPI routes.
- PostgreSQL persistence.
- Secure server-side user accounts.
- Server sessions and authorization.
- Durable personal memory.
- Real private-data storage.
- Connector permission management.
- Scheduled backend jobs.
- Worker queues.
- Production MCP services.
- A live AI orchestration layer.
- Autonomous development or deployment.
- Real Build Lab health, logs, incidents, and rollback controls.

Any interface showing planned integrations, private-looking data, confidence values, provider status, or backend concepts must label its actual status honestly.

---

## 7. Root Restricted Node and Gate System

### 7.1 Gate vocabulary

A gate is the visual and browser-side entry experience shown before a page is revealed.

Current named gate designs are:

- Restricted Node Gate.
- Black Prompt Gate.

The Restricted Node Gate is the fuller blue CMX terminal experience used at the root. The Black Prompt Gate is an intentionally minimal black screen with a password prompt and no decorative interface.

### 7.2 Current security reality

The current gates are client-side deterrents and presentation barriers. They are useful for deliberate entry, casual privacy, prototypes, and product atmosphere. They are not secure boundaries for sensitive records because public static assets are still delivered to the browser.

Real protection should come from:

- Cloudflare Access at the edge.
- Authenticated server sessions.
- Server-side authorization.
- Protected storage.
- Scoped data delivery.

A visual gate can remain after secure enforcement is added. The edge or backend must decide whether protected content is delivered.

### 7.3 Credential handling

Future AI and developers must never:

- Commit plaintext credentials.
- Print credentials in reports or chat output.
- Store passwords in HTML comments, tests, examples, or documentation.
- Describe browser-side verification as secure server authentication.

Credential rotation should follow the documented salt, verifier, state-version, cache-busting, and validation process in the gate handoff documentation.

---

## 8. `/brief` Product Structure

### 8.1 One product with several views

The final working model treats `/brief` as one system with connected interaction modes. It should not become a collection of unrelated microsites.

```text
/brief
│
├── Entry
├── Focus View
├── Workspace
│   ├── Home
│   ├── Briefing
│   ├── Spaces
│   ├── Plans
│   └── Library
├── Full View
├── Walkthrough
└── Terminal
```

### 8.2 Entry

Entry selects the briefing context and establishes the initial experience.

Current or demonstrated entry capabilities include:

- Briefing-type selection.
- Optional music.
- Optional spoken opening.
- Stored onboarding and interface preferences.
- Deliberate deep-link preselection.

Entry should consistently land at the intended hero position during a normal visit. It should preserve deliberate deep links without letting delayed legacy scripts unexpectedly move the page.

### 8.3 Focus View

Focus View is the default small daily surface. It should answer:

- What changed?
- What matters now?
- What is the recommended action?
- Where should the user go for detail?

Focus View should keep the hero and a compact operating layer. It should not show the full product explanation, every scenario, all backend education, or every experimental module.

### 8.4 Workspace

Workspace is the main application shell.

Stable primary navigation:

```text
Home
Briefing
Spaces
Plans
Library
```

Only the selected primary section and scenario-specific tab should be active. The user should not need to scroll through unrelated content to reach another application state.

### 8.5 Full View

Full View preserves the depth of the existing project:

- Large scenario visuals.
- Charts.
- Detailed schedules.
- Music and media sections.
- Memory and connection demonstrations.
- Team, relationship, business, trainer, and personal modules.
- Historical product explanations.
- The complete long-form experience.

Full View allows the daily experience to stay calm without deleting useful work before its value is evaluated.

### 8.6 Walkthrough

Walkthrough should consolidate product education into one guided system. It should gradually absorb overlapping tours, help prompts, vision walkthroughs, and repeated explanatory sections.

### 8.7 Terminal

The terminal should remain a collapsed bottom command bar with an expandable drawer.

The current terminal is a frontend navigation and demonstration surface. It is not a real shell and must never become an unrestricted system shell.

Future terminal commands may call approved backend tools only through typed, permission-checked interfaces.

---

## 9. Briefing Types and Tab Contracts

The product currently supports five demonstration contexts.

### 9.1 Personal

```text
Overview
Day
Work
Money
Wellness
Intelligence
```

The Personal briefing can combine daily priorities, schedule, work, finances, wellness, goals, information, and private reflection.

### 9.2 Relationship

```text
Overview
Together
Profiles
Plans
Watch
Reflection
```

The Relationship briefing can support private profiles and approved shared context, plans, memories, shared activities, check-ins, promises, and constructive next steps.

The product must avoid taking sides, diagnosing people, exposing private context automatically, or presenting uncertain conclusions as relationship facts.

### 9.3 Business partners

```text
Executive
Finance
Projects
Decisions
Markets
Partners
```

The Business briefing can organize meetings, revenue, expenses, decisions, deadlines, project status, ownership, risk, and unresolved partner questions.

### 9.4 Trainer and student

```text
Overview
Today
Habits
Progress
Recovery
Coach
```

The Trainer briefing can organize sessions, habits, evidence, progress, recovery, and coach guidance while avoiding unsupported medical conclusions.

### 9.5 Team and project

```text
Overview
My Work
Project
Handoffs
Procedures
Finance
Spaces
```

The Team briefing can organize role-specific work, project state, handoffs, procedures, finances, risks, and shared spaces.

---

## 10. Information Hierarchy and Navigation Ownership

One unified controller is intended to own:

- Current briefing type.
- Current mode.
- Current primary section.
- Current scenario tab.
- URL state.
- Browser history.
- Scroll position.
- Mobile drawer state.
- More-menu state.
- Briefing switcher state.
- Walkthrough state.
- Terminal drawer state.

The primary controller is exposed through `window.BRIEF_SYSTEM`.

Future modules should request navigation through the unified controller. They should not independently modify hashes, history, scroll position, mode state, or active tabs.

This ownership rule is important because older layers caused delayed scroll jumps, duplicate navigation, conflicting route restoration, and unpredictable mobile behavior.

---

## 11. Existing `/brief` Strengths

The current project already demonstrates substantial product range:

- Five briefing contexts.
- Quick and deeper views.
- Weather and public-information examples.
- Music and Spotify demonstrations.
- Schedules and priorities.
- Private and shared spaces.
- Memory and correction concepts.
- Connection and provider-status concepts.
- Relationship media.
- Team project and handoff views.
- Product help and tours.
- A command terminal.
- Static privacy and trust labeling.
- Mobile and theme testing work.
- Dated content update processes.

These foundations should be evaluated, simplified, and connected. Strong work should not be deleted only because the current page is too long.

---

## 12. Current `/brief` Problems

### 12.1 The daily experience became a presentation

The page currently acts as several things at once:

- Daily briefing.
- Scenario gallery.
- Product showroom.
- Technical explainer.
- Onboarding system.
- Vision presentation.
- Backend roadmap.

The daily briefing should lead. Deeper explanation should appear when requested.

### 12.2 Duplicate interaction systems

The project has accumulated overlapping selectors, tabs, route bars, cards, drawers, maps, footer controls, tours, and terminal commands.

This makes ownership difficult and creates competing behavior.

### 12.3 Legacy script overlap

Late-loaded scripts can change copy, state, and scroll position after the initial interface renders. The current architecture still includes compatibility layers and late DOM patches.

### 12.4 Data fragmentation

Different scenario and content files use several frontend data shapes. A normalized contract is required before a backend can reliably serve the interface.

### 12.5 Static document weight

Even when Focus View hides content, the browser may still receive and initialize the entire long-form document. This creates performance and maintenance costs.

### 12.6 Date ownership

Several modules can own or display edition dates. The project needs one authoritative edition object and stale-date validation that understands intentional historical content.

### 12.7 Voice problems

Earlier copy includes patterns that feel generated or abstract:

- Generic philosophy.
- Repeated explanation of capabilities.
- Fake precision.
- Contrast formulas.
- Excessive future tense.
- Repeated words with little operational value.
- Poetic headings that do not help the user act.

The preferred voice is direct, calm, specific, human, easy to scan, and occasionally dry or playful when appropriate.

---

## 13. Known `/brief` Issues Recorded on August 4, 2026

The following issues were recorded and require separate investigation:

1. **Terminal interaction issue**  
   The terminal does not work correctly and appears to blur the page.

2. **Entry instruction prominence**  
   The instruction telling the user to choose a briefing may need greater prominence. The current wording and rendering should be inspected before changing it.

3. **Autoplay music issue**  
   Autoplay is failing and a feedback or error message appears near the bottom of the page.

Other validation areas include:

- Hero position after delayed scripts.
- Mobile header spacing.
- Mobile drawers and overlays.
- Light-mode contrast across legacy modules.
- Full View return navigation.
- Browser back and forward behavior.
- Terminal commands after unified control.
- Scenario switching while overlays are open.
- Cache behavior after deployment.
- Reduced-motion behavior.
- Accessibility and focus management.

Recording an issue does not authorize unrelated redesign work. A bug-fixing task should inspect, reproduce, isolate, patch, test, and document the exact problem.

---

## 14. Data Trust, Privacy, and Visibility

### 14.1 Data classes

The interface should distinguish among:

- Live public information.
- Fictional demonstration information.
- Connected-data demonstrations.
- Disconnected providers.
- Planned integrations.
- Private records that require authenticated backend access.
- Shared records that require explicit approval and scoped permissions.

### 14.2 Visibility controls

Future records may support visibility such as:

```text
private
shared
ai_only
ask_before_brief
never_brief
goal_specific
```

Information being available to an AI does not automatically make it appropriate for a shared briefing.

### 14.3 Memory controls

Important or sensitive conclusions should not silently become permanent memory.

The user should be able to:

- Confirm a memory.
- Correct it.
- Keep it temporary.
- Restrict it to one goal or space.
- Exclude it from briefings.
- Ask before sharing it.
- Delete it.

### 14.4 Public repository constraints

The repository is public at the time of this file. Future AI and developers must not commit:

- Credentials.
- Private personal records.
- Private relationship details.
- Client secrets.
- Financial account data.
- Private connector tokens.
- Sensitive uploaded-file contents.
- Production environment secrets.

Public demonstrations must use sanitized, fictional, public, or explicitly approved information.

---

## 15. Goal Intelligence

### 15.1 Purpose

Goal Intelligence is the proposed organizing layer behind future briefings.

The system loop is:

```text
Collect authorized information
        ↓
Update user and goal state
        ↓
Identify missing information and blockers
        ↓
Ask one useful question when needed
        ↓
Recommend the highest-value next action
        ↓
Record evidence and outcome
        ↓
Adjust plan, trajectory, and difficulty
        ↓
Generate the next Goal Pulse and eventual briefing output
```

The loop matters more than a specific page, model, connector, or visual component.

### 15.2 Current roadmap position

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

### 15.3 Reference goal

The first prototype uses this real reference goal:

> Build and understand a maintainable backend for `db.cmxchat.com` using FastAPI, while learning enough Python to understand and manage the work.

This reference goal connects product delivery, learning, dependency management, visible evidence, and staged implementation.

### 15.4 Smallest working loop

The first prototype should prove:

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

### 15.5 Difficulty levels

1. **Recovery**  
   One small action, usually 5 to 15 minutes. Protect continuity and restart cleanly.

2. **Sustainable**  
   One modest action, usually 15 to 30 minutes. Maintain steady progress.

3. **Focused**  
   One meaningful action with an optional supporting action, usually 30 to 60 minutes. This is the default.

4. **Stretch**  
   One larger action or two linked actions, usually 60 to 120 minutes. Surface tradeoffs with other obligations.

5. **Sprint**  
   Temporary campaign mode with an end date, explicit workload risk, and a return to the previous level unless renewed.

Difficulty can change workload, pacing, action count, check-in frequency, and recovery behavior. It cannot hide risk or make an unrealistic plan appear achievable.

### 15.6 Daily check-in

The first check-in should collect:

- Previous action result.
- Available time.
- Optional energy level.
- Important changes.
- Current blocker.
- Optional note.

The check-in should be brief. It should not become a mandatory journal.

### 15.7 Question behavior

Show one primary question at a time.

Question priority:

1. Missing information that prevents a useful action.
2. A new blocker.
3. Repeated non-completion.
4. Contradictory information.
5. A completed milestone requiring the next milestone.
6. Stale goal information.
7. Useful but non-urgent improvement questions.

A question should be able to explain why the answer matters.

### 15.8 Recommendation output

One primary recommendation should include:

- Action title.
- Why it matters now.
- Estimated effort.
- Expected result.
- Current milestone.
- Difficulty level used.
- Confidence.
- Evidence, check-ins, or answers that influenced it.

Recommendations are proposals until accepted or replaced.

### 15.9 Trajectory

Use understandable states:

```text
improving
stable
unclear
at_risk
blocked
completed
```

Each trajectory should include confidence and a short explanation. Avoid precise success probabilities until reliable historical data supports them.

---

## 16. Goal Intelligence Data Model

The drafted Step 2 model uses nine core entities, with a tenth audit entity where practical:

1. Goal.
2. Success Criterion.
3. Milestone.
4. Check-In.
5. Question and Answer.
6. Recommendation.
7. Outcome.
8. Evidence.
9. Goal State Snapshot.
10. Revision Event.

### 16.1 Goal

The Goal record stores the current readable state, including:

- Title and desired outcome.
- Why the goal matters.
- Baseline.
- Status and priority.
- Difficulty.
- Trajectory and confidence.
- Current milestone.
- Active question.
- Active recommendation.
- Visibility.
- Review and update timestamps.

### 16.2 Success criteria

Success criteria explain how completion is measured. They may use boolean, count, percentage, date, text confirmation, or external evidence.

### 16.3 Milestones

Milestones divide the goal into meaningful stages. The MVP should normally have one active milestone per goal.

### 16.4 Check-ins

Check-ins record current capacity, previous-action results, changes, blockers, and notes. Submitted check-ins should remain append-only. Corrections should create a revision or replacement record.

### 16.5 Questions and answers

Questions contain prompt, purpose, priority, trigger, status, type, options, and expiry. One question should normally be active for an MVP goal.

### 16.6 Recommendations and outcomes

A recommendation links to the goal, milestone, estimated effort, expected result, difficulty, confidence, and influencing records. An outcome records what happened and changes the next state.

### 16.7 Evidence

Evidence may come from:

- Manual confirmation.
- GitHub activity.
- Calendar activity.
- Task completion.
- Uploaded files.
- Connected providers.
- Generated output.
- Verified deployment or test results.

Evidence must identify source, freshness, visibility, confidence, and relationship to the claim.

### 16.8 State snapshots and revisions

Current state should be easy to read without replaying every event. Important changes should still remain auditable through snapshots and revision events.

The Step 3 local prototype should use this same conceptual shape in local JSON or JavaScript so later PostgreSQL migration does not require a complete product rewrite.

---

## 17. `/ai` AI Control Blueprint

### 17.1 Purpose

`/ai` defines how AI may eventually help build, operate, and use the platform while keeping GitHub, permissions, testing, staging, and human approval in control.

The page is currently a static policy and design document. It does not represent an active model runtime, MCP server, sandbox service, Python backend, or production automation service.

### 17.2 Two AI tracks

#### Operator and developer AI

This track may eventually:

- Read approved project context.
- Inspect allowlisted repository files at a known revision.
- Turn a request into a visible implementation plan.
- Create a feature branch.
- Write only approved files.
- Produce reviewable diffs.
- Run fixed tests in a restricted sandbox.
- Create protected previews.
- Open draft pull requests.
- Request production approval.

#### User-facing AI

This track may eventually:

- Answer questions from authorized context.
- Summarize approved records and files.
- Generate drafts, checklists, research plans, and reports.
- Call typed tools permitted for the user and workspace.
- Propose visible data changes.
- Create approved automations with schedules, logs, quotas, and cancellation.
- Maintain user and workspace isolation.

### 17.3 Risk tiers

The current blueprint defines risk from answers through blocked actions:

```text
Tier 0  Answer
Tier 1  Read
Tier 2  Draft
Tier 3  Controlled write
Tier 4  External action or deployment
Tier 5  Blocked
```

Examples of blocked capabilities include unrestricted shell, `sudo`, arbitrary code execution on the host, direct production deployment, host filesystem access, and self-approval.

### 17.4 Planned AI delivery lifecycle

```text
Describe the goal
        ↓
Classify intent and risk
        ↓
Retrieve approved context
        ↓
Show a versioned plan
        ↓
Approve the scoped action
        ↓
Create a feature branch
        ↓
Write a reviewable changeset
        ↓
Run restricted sandbox checks
        ↓
Create a protected preview
        ↓
Open a draft pull request
        ↓
Validate staging
        ↓
Request human production approval
```

The AI should never approve its own production release.

---

## 18. `/build` Build Lab

### 18.1 Current purpose

Build Lab is the operational view for `db.cmxchat.com`.

Today it can:

- Read the route registry.
- Display route counts and registry version.
- Run browser-observed route checks.
- Explain current and future readiness.
- Show the intended delivery pipeline.

A responding route does not prove that the route is securely protected.

### 18.2 Future purpose

Build Lab should eventually display:

- FastAPI health.
- Database health.
- Worker and queue state.
- Storage and dependency state.
- Cloudflare Tunnel state.
- Preview, staging, and production releases.
- Approval status.
- Deployment evidence.
- Rollback revision.
- Logs and errors.
- Incidents.
- Backups.
- AI model and tool availability.
- Usage, cost, quotas, policy tests, and emergency stop.
- Access and security audit events.

### 18.3 Readiness requirements

Backend foundation:

- Dockerized Python application on Linux.
- Cloudflare Access and Tunnel.
- Secure sessions and role/capability enforcement.
- Separate environment configuration.
- Structured logs and health checks.
- Backups and rollback.

AI foundation:

- Versioned project handbook.
- Approved retrieval scopes.
- Typed tool registry.
- Capability-specific MCP policies.
- Restricted short-lived sandbox.
- Quotas, cancellation, audit logs, and emergency stop.
- Human production approval isolated from AI credentials.

---

## 19. `/plans` Product and Platform Plan Archive

`/plans` stores dated working entries. The current foundational entry is Personal OS.

The Personal OS plan describes:

- A private scheduled daily briefing.
- Morning alarm and narration possibilities.
- Music from approved providers.
- Weather, schedules, reminders, emails, finances, tasks, workouts, and goals.
- Structured profiles and memory.
- Private and approved shared spaces.
- Couples, friends, families, business partners, and teams.
- Corrections, deletion, temporary memory, and share controls.
- Calendar, email, music, task, workout, finance, business-tool, file, and journal connections.
- Briefing items that can become reminders, events, tasks, records, or shared actions.
- Python as the bridge from the current frontend to real accounts, databases, APIs, jobs, voice, memory, and actions.

`/plans` holds broad product intent. Current dated roadmap and architecture documents define the controlled implementation sequence.

---

## 20. Relationship Between `/news` and `/brief`

`/news` is an earlier personalized daily-briefing proof of experience. It demonstrates scheduled publishing, personal selection, daily research, distinct content areas, and the idea of a morning or shared briefing.

`/brief` is the broader product application direction. It supports several briefing contexts, structured navigation, spaces, plans, library content, goal intelligence, and the future backend product model.

Future work should avoid maintaining two competing products with duplicated ownership. Useful `/news` publishing and personalization lessons can inform `/brief`, but integration should be deliberate and documented.

---

## 21. Target Backend Architecture

### 21.1 Preferred stack

The current preferred direction is:

```text
Browser frontend
        ↓
Cloudflare Access and Tunnel
        ↓
Dockerized FastAPI application on Linux
        ↓
PostgreSQL
        ↓
Approved services, workers, storage, and connectors
```

Supporting components may include Redis or Valkey when caching, queues, sessions, or scheduled work genuinely require them.

### 21.2 Why FastAPI

FastAPI supports:

- The owner’s Python-learning objective.
- Typed request and response models.
- Automatic API documentation.
- Async services.
- Clear JSON APIs.
- Jinja migration where server-rendered pages are useful.
- Docker deployment.
- Testable route contracts.

A compatible Python ASGI framework may be considered only when it preserves the documented API, security, testing, staging, approval, and deployment requirements.

### 21.3 Migration approach

The migration should be gradual:

1. Keep existing routes available.
2. Establish the Python project and health endpoint.
3. Add one POST route.
4. Connect one frontend form.
5. Store one structured record.
6. Retrieve and display that record.
7. Add authentication and permissions before private data.
8. Migrate approved pages or APIs in controlled slices.

The current frontend should not be discarded before the replacement path is proven.

---

## 22. CR, CMX, and the Owner’s Learning Path

### 22.1 Terminology

Use **CR** when referring to the technical collaborator. Do not use the older longer label.

When attribution is unnecessary, describe the work as CMX establishing or implementing the foundation.

### 22.2 CR’s role

CR supports the technical foundation and implementation, including areas such as:

- Python and FastAPI project setup.
- Docker and Linux runtime setup.
- Development environment consistency.
- Codespaces or Dev Container support.
- Staging configuration.
- Cloudflare Access and Tunnel planning or setup.
- Database and migration foundation.
- Secrets and environment configuration.
- Logging, health checks, restart behavior, backups, and rollback.
- Reviewable code and documentation.
- Helping the owner understand the system.

CR does not own the product direction. CMX retains final decisions, repository ownership, approval, priorities, privacy policy, and deployment authority.

### 22.3 Owner learning objective

The owner is learning Python through the real project.

Future implementation should support understanding through:

- Small working routes.
- Clear folder organization.
- Typed models.
- Short explanations tied to actual code.
- Reproducible local commands.
- Visible request and response flow.
- Tests that explain expected behavior.
- Documentation of environment, deployment, and rollback.
- Tasks that move from observation to guided editing to independent work.

Avoid creating an opaque backend that only CR or an AI can operate.

### 22.4 Recommended first learning milestone

The first meaningful backend learning milestone is:

1. Start the FastAPI application locally.
2. Open the automatic API documentation.
3. Understand one GET health route.
4. Add or inspect one POST route.
5. Send a request.
6. Validate the typed response.
7. Store one record.
8. Read it back.
9. Run a focused test.
10. explain the request path in plain language.

---

## 23. Development and Deployment Workflow

The preferred delivery workflow is:

```text
Owner request
        ↓
Current-state inspection
        ↓
Scoped plan
        ↓
Feature branch
        ↓
Reviewable changes
        ↓
Static, unit, integration, privacy, and security checks
        ↓
Protected preview
        ↓
Draft pull request
        ↓
Review and revisions
        ↓
Staging validation
        ↓
Explicit production approval
        ↓
Deployment
        ↓
Observation and rollback readiness
```

### 23.1 GitHub rules

- GitHub remains the source of truth.
- Main should not be used as an unreviewed experiment surface for risky changes.
- Branch from a known base revision.
- Keep commits intentional and understandable.
- Include relevant tests and documentation.
- Do not mix unrelated cleanup with a scoped fix.
- Rebase or update stale branches before merge.
- Verify deployment from a clean session after cache-sensitive changes.

Small documentation changes may be committed directly when the owner explicitly requests the file and the scope is clear. Product, backend, security, and deployment changes should normally use branches and review.

### 23.2 Environment separation

Development, staging, and production should use separate:

- Configuration.
- Secrets.
- Databases or schemas where appropriate.
- Connector credentials.
- Storage.
- URLs.
- Access policies.
- Logging context.

Production credentials must never be available inside an AI sandbox or ordinary staging environment.

---

## 24. Security and Operational Boundaries

Future work must preserve these boundaries:

- No unrestricted shell exposed through the product terminal.
- No `sudo` or host-level access for AI tools.
- No Docker socket exposure to untrusted code.
- No direct AI production deployment.
- No AI self-approval.
- No plaintext credentials in GitHub.
- No private records in a public static bundle.
- No connector access without explicit user and workspace scope.
- No silent sharing of private context.
- No unsupported medical, legal, or financial conclusions.
- No invented user activity or evidence.
- No automatic memory permanence for sensitive conclusions.
- No production action without auditability and rollback.

Future tools should be typed, narrow, cancellable, logged, and permission-checked.

---

## 25. Testing Expectations

The repository already includes or has documented checks for:

- Static validation.
- Secret scanning.
- Privacy auditing.
- Navigation links.
- Theme integrity.
- Device behavior.
- Onboarding and browser compatibility.
- URL and history state.
- Entry behavior.
- Relationship media.
- Workspace and scenario rendering.
- Chromium, Firefox, WebKit, iPhone, and Android profiles.

Future testing should follow product intent. Tests should not permanently protect obsolete experiments.

### 25.1 Frontend validation

Validate:

- Normal entry.
- Deliberate deep links.
- Focus, Workspace, and Full View.
- Scenario changes.
- Tabs.
- Browser history.
- Mobile drawers.
- Keyboard and touch focus.
- Light and dark themes.
- Reduced motion.
- Music and narration behavior.
- Terminal open, close, and commands.
- Privacy and data-status labels.
- Cache-busted deployment.

### 25.2 Backend validation

Future FastAPI work should include:

- Unit tests for business rules.
- API contract tests.
- Authentication and authorization tests.
- Database migration tests.
- Permission and ownership tests.
- Rate-limit tests.
- Audit-log tests.
- Health and readiness checks.
- Backup and restore verification.
- Staging smoke tests.
- Rollback tests.

### 25.3 Goal-system validation

Validate that:

- A goal can be created quickly.
- Difficulty changes the recommendation sensibly.
- A check-in changes the known state.
- One question can change the next action.
- Evidence is distinguishable from self-report.
- The recommendation cites its inputs.
- An outcome changes the next question or action.
- The user can correct the system.
- Privacy fields are respected.
- Goal Pulse output remains compact.

---

## 26. Detailed Roadmap

### Phase 1: Stabilize `/brief`

- Reproduce and resolve the entry-scroll issues.
- Fix terminal blur and interaction behavior.
- Improve briefing-choice instruction prominence where justified.
- Repair or clearly handle autoplay limitations.
- Validate mobile and desktop behavior.
- Confirm theme contrast and accessibility.
- Align tests with current product intent.

### Phase 2: Consolidate ownership

- Keep one navigation and URL controller.
- Retire obsolete route restoration.
- Remove duplicate top controls.
- Route terminal navigation through `BRIEF_SYSTEM`.
- Consolidate tours and walkthroughs.
- Reduce late DOM patching.
- Create a clear file-ownership map.

### Phase 3: Normalize frontend data

Create one structured contract for:

- Briefing types.
- Primary sections.
- Secondary tabs.
- Card routes.
- Full View targets.
- Library articles.
- Trust labels.
- Permissions.
- Edition metadata.
- Connection status.

### Phase 4: Improve performance

- Lazy-load Full View modules.
- Load scenario modules only when selected.
- Defer media embeds.
- Remove obsolete compatibility code after validation.
- Reduce observers and repeated runtime patches.
- Measure mobile load and layout shift.

### Phase 5: Build isolated Goal Intelligence prototype

- Use local sample data.
- Implement one goal.
- Implement five difficulty levels.
- Add one check-in.
- Show one question.
- Show one recommendation.
- Record one outcome.
- Display one Goal Pulse.
- Keep it separate from `/brief` until approved.

### Phase 6: Add deterministic goal rules

Implement predictable behavior for:

- Missed actions.
- Difficulty changes.
- Stale information.
- New blockers.
- Milestone completion.
- Recommendation expiry.
- Sprint expiry.
- Trajectory updates.

### Phase 7: Establish FastAPI foundation

- Create the Python application.
- Add Docker and development configuration.
- Add health and readiness routes.
- Add one POST route.
- Add typed schemas.
- Add tests.
- Add staging deployment.
- Add structured logs.

### Phase 8: Add PostgreSQL persistence

- Define migrations.
- Store one structured record.
- Retrieve it safely.
- Add ownership and visibility fields.
- Add audit and revision records.
- Add backup and restore procedures.

### Phase 9: Add secure identity and permissions

- Add authenticated users.
- Add server sessions.
- Add roles and capabilities.
- Add private and shared spaces.
- Add record ownership.
- Add explicit share approval.
- Protect the origin through Cloudflare.

### Phase 10: Add constrained AI reasoning

- Provide only goal-relevant structured context.
- Require structured output.
- Include confidence and cited inputs.
- Keep recommendations as proposals.
- Add quotas, cancellation, and logs.
- Test prompt-injection and permission boundaries.

### Phase 11: Connect Goal Pulse to `/brief`

- Add only the compact approved output.
- Keep full goal history in the deeper goal area.
- Do not overload Focus View.
- Make the source and freshness visible.

### Phase 12: Add authorized connectors

Start with high-value, narrow integrations. Likely candidates include Calendar and music, followed by other providers only when the permission, retention, and product value are clear.

Each connector must define:

- What data is read.
- What data can be written.
- User and workspace scope.
- Refresh schedule.
- Retention.
- Revocation.
- Failure behavior.
- Briefing visibility.
- Goal relevance.
- Audit events.

### Phase 13: Operational maturity

- Live Build Lab health.
- Deployment controls.
- Rollback.
- Incident handling.
- Backup verification.
- AI usage and cost controls.
- Security audit views.
- Small invited-user testing.
- Measured product learning before broader expansion.

---

## 27. Immediate Backlog and Open Decisions

Current high-value open work includes:

- Finish `/brief` browser stabilization.
- Resolve the terminal issue.
- Decide the correct autoplay fallback and user feedback.
- Finalize the entry instruction hierarchy.
- Remove duplicate navigation after regression coverage.
- Normalize data contracts.
- Establish one edition/date owner.
- Create the isolated goal prototype location.
- Define the Step 3 interface specification and acceptance criteria.
- Convert the drafted goal model into prototype sample data.
- Establish the first local FastAPI environment.
- Define CR and owner handoff documentation for the backend setup.
- Define Cloudflare Access and Tunnel deployment details.
- Define initial PostgreSQL schema and migrations after the prototype shape is approved.
- Create a permission matrix, retention policy, and threat model.
- Create a clear test matrix tied to current product behavior.

Open decisions should remain visible. Future AI should not silently choose a major product or security direction only because one option is technically convenient.

---

## 28. Future AI Operating Rules

A future AI working on this project should:

1. Read this file first.
2. Inspect recent commits.
3. Read the latest relevant dated documents.
4. Inspect current code before describing current behavior.
5. Separate implemented, demonstrated, planned, and conceptual features.
6. State assumptions and unresolved questions inside reports.
7. Use the exact gate names.
8. Refer to the collaborator as CR.
9. Never expose credentials or sensitive records.
10. Treat client-side gates as presentation barriers.
11. Preserve one `/brief` navigation owner.
12. Preserve Entry, Focus, Workspace, Full View, Walkthrough, and Terminal hierarchy.
13. Preserve private and shared boundaries.
14. Avoid inventing activity, evidence, progress, or connected data.
15. Keep AI recommendations explainable.
16. Avoid fake probability and fake confidence precision.
17. Prefer small reversible changes.
18. Add tests that protect the intended product behavior.
19. Update documentation after material changes.
20. Verify deployment from a clean session after static asset changes.
21. Use staging for backend, security, or product changes.
22. Require human production approval.
23. Preserve the owner’s ability to understand and operate the system.
24. Do not add crypto or blockchain positioning to this project.
25. Keep reports direct, specific, and useful for decisions.

---

## 29. How Future AI Should Produce Reports

When asked for a full project report, include:

### 29.1 Report header

- Date and time.
- Repository.
- Branch and commit inspected.
- Deployment inspected, if any.
- Scope.
- Whether the review was read-only or included changes.

### 29.2 Executive state

Summarize:

- What currently works.
- What changed.
- What is blocked.
- What is at risk.
- What should happen next.

### 29.3 Product state

Cover:

- Entry.
- Focus View.
- Workspace.
- Full View.
- Walkthrough.
- Terminal.
- Briefing scenarios.
- Goal Intelligence.

### 29.4 Technical state

Cover:

- Frontend architecture.
- Navigation ownership.
- Data contracts.
- Tests.
- Performance.
- Backend status.
- Database status.
- Identity and permissions.
- AI and tools.
- Deployment and operations.

### 29.5 Trust and privacy

Cover:

- Public, fictional, demo, connected, private, and shared data.
- Security boundary.
- Secrets.
- Permissions.
- Retention.
- Auditability.

### 29.6 Roadmap and action plan

For each recommended action include:

- Objective.
- Reason.
- Scope.
- Dependencies.
- Risk.
- Acceptance criteria.
- Test requirement.
- Owner or collaborator.
- Suggested order.

Reports should distinguish a recommendation from an approved task.

---

## 30. How Future AI Should Build on the Project

Before coding:

1. Identify the exact user outcome.
2. Inspect current implementation and recent commits.
3. Identify the controlling files.
4. Check whether a second controller or duplicate feature already exists.
5. Check privacy and deployment impact.
6. Prepare a scoped implementation plan.
7. Choose a branch and test strategy.

During implementation:

- Change only the required files.
- Keep the patch reversible.
- Preserve stable routes.
- Use existing contracts when valid.
- Avoid late DOM patching for new architecture.
- Add focused comments where they prevent future mistakes.
- Keep secrets and private data out of code.
- Add or update tests.
- Update version strings when static cache behavior requires it.

After implementation:

- Run focused tests.
- Run broad regression tests when shared architecture changed.
- Inspect mobile and desktop behavior.
- Review the exact diff.
- Update relevant documentation.
- Record remaining limitations.
- Verify staging or deployment from a clean session.

---

## 31. Anti-Patterns to Avoid

Do not:

- Add another navigation controller.
- Add a second source of truth for dates.
- Put backend education back into the default daily briefing.
- Expose every possible module in Focus View.
- Treat a static gate as secure authorization.
- Connect personal data before identity, permission, and retention rules exist.
- Add broad AI autonomy before typed tools and audit controls.
- Use a vector database before a real retrieval requirement exists.
- Fine-tune a model before structured context and deterministic rules are proven.
- Create fake success probabilities.
- Store user corrections by silently overwriting history.
- Let a model decide what becomes shared.
- Build a large backend before one end-to-end record flow works.
- Replace the current frontend wholesale without a validated migration path.
- Preserve obsolete tests only because they already exist.
- Merge stale branches without reconciling current `main`.
- Turn the terminal into an unrestricted shell.
- Allow production credentials in staging or sandbox environments.
- Add platform claims that exceed current implementation.

---

## 32. Design and Writing Direction

### 32.1 Visual direction

The broader `db.cmxchat.com` identity uses:

- Mobile-first layouts.
- Dark terminal and restricted-node styling.
- Blue CMX, Linux, and operator-console influence.
- Clear hierarchy.
- Professional, restrained presentation.
- Minimal visible decoration where the gate contract requires it.

`/brief` can use richer scenario visuals, but the application shell should remain coherent and calm.

### 32.2 Writing direction

Preferred copy is:

- Direct.
- Calm.
- Specific.
- Human.
- Operational.
- Easy to scan.
- Technical when needed without becoming dense for its own sake.

Avoid:

- Generic introductions.
- Dramatic fragments.
- Repetitive philosophy.
- Fake certainty.
- Excessive capability narration.
- Unnecessary jargon.
- Ellipses.
- Em dashes.
- Repeated contrast formulas.

When status matters, use language such as:

```text
Active
Demonstration
Planned
Disconnected
Blocked
Needs review
Not implemented
Backend pending
```

---

## 33. Essential Files and Areas to Inspect

This list is a starting point and must be checked against current code.

### Master and dated documentation

```text
docs/cmx-brief-master-context.md
docs/concepts/brief-program-status-and-roadmap-2026-08-04.md
docs/concepts/brief-system-progress-roadmap-2026-08-04.md
docs/concepts/brief-goal-intelligence-concept-2026-08-04.md
docs/concepts/cmx-gates-system-ai-handoff-2026-08-04.md
```

### Core route and gate files

```text
index.html
assets/cmx-routes.json
assets/cmx-auth-policy.js
assets/cmx-ops-core.js
assets/cmx-ops-site.js
assets/cmx-ops-intel.js
assets/cmx-ops-runtime.js
assets/gates/library.json
assets/gates/README.md
assets/gates/cmx-gate-black-prompt.css
assets/gates/cmx-gate-black-prompt.js
```

### `/brief` system files

```text
brief/index.html
assets/brief/brief-system.js
assets/brief/brief-system.css
assets/brief/brief-system-fixes.css
assets/brief/brief-terminal-bridge.js
```

Additional legacy, content, scenario, test, and compatibility files must be identified from the current page load order.

### Planning and platform files

```text
ai/index.html
assets/cmx-ai-control-blueprint.html
build/index.html
assets/cmx-build-lab.html
plans/index.html
assets/cmx-plans.html
assets/plans-data.js
backend/index.html
architecture/index.html
updates/index.html
```

---

## 34. Handoff Checklist for a New AI Context

A new AI should confirm the following before saying it is fully up to date:

- [ ] Read this master file.
- [ ] Inspect the latest repository commits.
- [ ] Confirm the current default branch.
- [ ] Inspect the route registry.
- [ ] Read the current dated `/brief` reports.
- [ ] Read the current goal intelligence concept.
- [ ] Inspect the unified `/brief` files.
- [ ] Inspect current page load order and compatibility layers.
- [ ] Check open pull requests and stale branches when relevant.
- [ ] Confirm the current runtime truth.
- [ ] Separate static demonstrations from live backend features.
- [ ] Review known issues.
- [ ] Confirm the current roadmap position.
- [ ] Confirm whether the requested task is read-only, reporting, design, implementation, testing, or deployment.
- [ ] Confirm privacy and security impact.
- [ ] State the exact commit used for the report or build.

---

## 35. Current Master State at Creation

At the time this file was created:

- `/brief` has a unified frontend application layer.
- Focus, Workspace, and Full View direction is implemented in the repository but still requires broad validation and consolidation.
- Goal Intelligence Step 0 is complete.
- Goal Intelligence Step 1 is defined.
- Goal Intelligence Step 2 data structure is drafted.
- The isolated goal prototype has not started.
- FastAPI and PostgreSQL implementation have not started as active production services.
- `/ai` and `/build` remain static blueprints and operational demonstrations.
- `/plans` contains the Personal OS product vision.
- The public repository still requires strict sanitization.
- Client-side gates remain presentation barriers.
- The owner is learning Python through the backend goal.
- CR is the technical collaborator supporting the foundation and implementation.
- CMX retains product control, repository ownership, approval, and deployment authority.

---

## 36. Revision Procedure

When materially revising this file:

1. Preserve the original created timestamp.
2. Update the Last revised timestamp.
3. Update the verified commit.
4. Add a revision-log entry.
5. Update current state and roadmap position.
6. Remove statements that are no longer true.
7. Keep historical decisions only where they explain current architecture.
8. Link new authoritative documents.
9. Avoid copying every minor commit into this file.
10. Keep it useful as an operating handoff.

---

## 37. Revision Log

### August 4, 2026 at 4:40 PM EDT

- Created the first master context and AI collaboration handoff.
- Consolidated `/brief`, Goal Intelligence, `/ai`, `/build`, `/plans`, backend, gate, privacy, testing, deployment, and learning direction.
- Recorded the current implementation boundary between static frontend and future backend.
- Recorded CR terminology and role.
- Defined future-AI reporting, building, testing, security, and documentation rules.
- Recorded the approved staged roadmap and current Goal Intelligence position.
- Added a new-context handoff checklist and revision procedure.
