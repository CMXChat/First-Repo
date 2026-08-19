# CMX Documentation Index

Last reconciled: **August 19, 2026**
Repository: `CMXChat/First-Repo`

## Current rule

Current source, tests, workflows and `*-CURRENT.md` contracts take priority over older dated notes. Older Spaces, Brief, CRM and Automation prototypes remain decision history only.

For **backend implementation sequence**, `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-BACKEND-ORDER-OF-WORK-CURRENT.md` is the current execution-order overlay. It wins over older sequencing language while specialized contracts continue to govern domain semantics, security, authority, reliability and data integrity. It does not authorize production migration/deployment by itself.

# Start here

1. `checkin-context-handoff-CURRENT.md` — current cross-repository truth and release boundary.
2. `continuum-product-CURRENT.md` — Continuum identity and `/doc/` contract.
3. `continuum-doc-authorized-continuity-CURRENT.md` — focused `/doc/` contract for authorized continuity, Goals during unavailability, information quality and goal-driven architecture evolution.
4. `continuum-signals-observations-master-plan-CURRENT.md` — Signals/Observations/State product direction.
5. `checkin-future-capabilities-CURRENT.md` — future Sources, Connections, capabilities, MCP/API discovery, Control Center and autonomy UX.
6. `continuum-automations-master-plan-CURRENT.md` — Automation product/model direction.
7. `continuum-automations-operations-v7-CURRENT.md` — accepted focused Automation operating workspace, readiness, local lifecycle management, authoritative Runs boundary and future capability cues.
8. `checkin-automations-frontend-CURRENT.md` — exact Automations v5, Planner Preflight, mobile Action-stack and QA truth beneath v7.
9. `continuum-directory-master-plan-CURRENT.md` — durable Directory direction.
10. `checkin-directory-library-CURRENT.md` — Directory/Audience/Library/Planner cross-domain truth.
11. `checkin-library-premium-CURRENT.md` — Library projection/navigation contract.
12. `checkin-content-editor-CURRENT.md` — native content/editor contract.
13. `checkin-files-CURRENT.md` — binary File direction.
14. `checkin-ai-product-design-CURRENT.md` — broader AI product direction.
15. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md` — canonical backend read map.
16. `CMXChat/jay-app/specs/003-server-checkin/HANDOFF.md` — current production/repository truth and release handoff.
17. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-BACKEND-ORDER-OF-WORK-CURRENT.md` — current recommended backend execution sequence.
18. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-CORE-ARCHITECTURE-CONTRACT.md` — durable Knowledge/State/Authority/Policy/Audit invariants.
19. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AUTOMATION-OPERATIONS-WORKSPACE-CONTRACT.md` — future protected list/readiness/lifecycle/Run/capability semantics for the accepted v7 workspace.
20. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-CONTROL-CENTER-SIMULATION-AND-AUTONOMY-CONTRACT.md` — desktop/mobile Control Center, Pause Autonomy, re-contact and simulation.
21. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-LIVE-WORLD-CAPABILITY-EXTENSION-CONTRACT.md` — Sources, API/MCP discovery, typed adapters and bounded self-improvement.
22. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-GOAL-DRIVEN-ARCHITECTURE-EVOLUTION-CONTRACT.md` — governed Goal → architecture-gap → test/simulate/release/measure evolution path.
23. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md` — protected cross-domain Planner contract.
24. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-SIGNALS-OBSERVATIONS-PLATFORM-PLAN.md` — protected Signals/Observation/State architecture.

# Core architecture in one view

Durable control core:

`Knowledge + State + Authority + Policy + Audit`

Expanding/replaceable layers:

`Reasoning + Capabilities + Runtime`

Canonical consequence path:

`OBSERVE → SIGNAL → STATE → POLICY → AUTHORITY → CAPABILITY → RUNTIME → RESULT → AUDIT`

The capability ceiling can move as providers/models/tools improve. Authority still comes from policy.

Evidence can change State or eligibility. It never creates authority.

# Current backend execution order

The shortest current path to a real end-to-end Continuum is:

```text
Stage 0  controlled Phase 2A production release
→ Stage 1  protected continuity.md production acceptance proof
→ Stage 2  minimum Person/ContactMethod + Connection/SenderIdentity + definition-only Email
→ Stage 3  durable Runtime with fake provider
→ Stage 4  one real provider under direct owner control
→ Stage 5  minimum standing/fallback authority for one unattended Check In continuity action
```

The real protected React Automation builder may proceed in parallel after the Stage 2 APIs/models it needs are stable enough. Broader continuity, Signals, Knowledge ingestion, AI Tasks, Planner, Goals and Agent behavior follow the staged order in the backend order-of-work contract.

Existing Check In/Incident state is intentionally the first deterministic continuity condition, so the general Signals platform does not block the first Runtime/continuity workflow. AI comes after durable control and must not become a required dependency for owner-marked deterministic essential continuity actions.

# Current key routes

## `/doc/`

Noindex master explanation of Continuum.

The August 19 architecture work deliberately expanded the product explanation around:

- a human-first explanation of information, people, tools and AI in one private operating layer;
- Check In as the first-class LIVE route;
- capability/model portability;
- Knowledge + State + Authority + Policy + Audit;
- tangible Current State;
- Signals as evidence;
- information quality across Observation / Claim / Derived conclusion / Current State;
- Planner as natural language → typed Change Plan;
- future live-world inputs through Connections/Sources/APIs/MCP;
- long-running Runtime that can survive a closed page, waits and replies;
- Goals/Missions with success, stop and constraint semantics;
- continuity of authorized intent when direct participation is unavailable;
- future architecture evolution when a Goal exposes a recurring structural gap;
- future Control Center, Pause Autonomy and simulation direction.

Keep capability status truthful. The page may describe architecture direction as future, but it must not imply that current production already has Runtime, broad Signals monitoring, provider delivery, MCP execution, Goal orchestration or autonomous AI.

Authorized continuity is described as durable context plus prepared authority across time. Avoid supernatural, digital-clone or immortality framing.

## `/lab/`

Broader Continuum experiment workspace.

Records runs **Directory v2** over browser-local prototype state. Directory `AI setup` opens **CONTINUUM PLANNER · PREVIEW** using the same browser Change Plan / Preflight / Review language as focused Automations.

The current **Online signals** example proposes a Watch, approved source, filter, bounded interpretation and Automation reference while keeping Signals service and Connection requirements blocked.

It performs no online observation.

## `/lab/automations/`

Focused Continuum Automation operating/testing workspace.

Current accepted layers include:

- v3 Draft/autosave compatibility editor;
- **v5 canonical ordered workflow model**;
- compact FLOW PREVIEW + ORDERED SEQUENCE;
- command center / Capability Catalog;
- **15 editable scenarios**;
- Directory readiness + Audience v4.1;
- typed data v4.2 + Input Routing v4.3;
- Advanced Flow v4.4 inter-step IF / WAIT authoring;
- deterministic local Planner v5;
- editable/resettable Planner proposals;
- shared Planner Contract v1;
- typed Preflight v1;
- Change Review v1;
- compact mobile Action stack v6;
- **operations workspace v7** with Draft readiness, search/status filters and denser Automation rows;
- browser-local **Manage Automations** for duplicate/archive/restore/delete-local-copy;
- direct local Planner workspace action;
- explicit `LAB · EXECUTION OFF` boundary;
- authoritative future Runs placeholder that never mixes local simulations into Run history;
- `LATER` capability previews for Signal Trigger, State Condition, Goal progress and durable State wait;
- desktop/mobile v7 validation source.

V5 semantic shape remains:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

Beginner rail remains:

`WHEN → IF → DO → WAIT → TEST`

V7 is an operating layer over v5. It does not introduce another workflow model.

Current inter-step IF is a linear gate only. Inter-step WAIT is Runtime-required. There is no YES/NO branch graph yet.

`Ready to test` is a local definition-readiness cue. It does not mean Publish or Runtime is available.

Manage operations only mutate browser-local Lab definitions. Production lifecycle/retention semantics are defined separately.

The future Runs surface is reserved for server-owned Runtime history. Local simulation never becomes a fake Run.

None of the Lab Planner/Signals/Automation proof calls a model, protected backend mutation, provider, online monitor or Runtime.

Canonical v7 companion:

`continuum-automations-operations-v7-CURRENT.md`

Backend companion:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AUTOMATION-OPERATIONS-WORKSPACE-CONTRACT.md`

## `/checkin/`

Protected Check In application. Production remains Phase 1 until the validated Phase 2A migration/deployment runbook is deliberately completed.

## `/spaces/`

Spaces briefing/context proving surface.

## `/environment/`

Python-first development/learning environment.

# Signals / Observations / State direction

Canonical product plan:

`continuum-signals-observations-master-plan-CURRENT.md`

Backend companion:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-SIGNALS-OBSERVATIONS-PLATFORM-PLAN.md`

Durable relationship:

`Source → Observation → Signal → State / eligibility → Policy + Authority → Capability → Runtime → result`

Future source families may include provider APIs/webhooks, RSS/feed, constrained webpage monitoring, approved search/news sources, GitHub/status events, approved MCP resources, account/project streams, device/sensor sources and trusted-person attestations where configured.

Signals may start Automations, satisfy/invalidate Conditions, update protected State, contribute to Incidents, wake Runtime or feed Spaces/AI reasoning. They do not grant authority.

Conflicting evidence should be preserved where material. Confidence may use freshness, corroboration, source history, context and user feedback. Different consequences may require different evidence strength.

Information quality should preserve the distinction between Observation, Claim, Derived conclusion and Current State, including source, freshness and conflicts.

# Live world / capability extension

Canonical backend contract:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-LIVE-WORLD-CAPABILITY-EXTENSION-CONTRACT.md`

Future provider/API/MCP capability lifecycle:

`DISCOVER → NORMALIZE → CLASSIFY → MAP → TEST → SIMULATE → REVIEW/POLICY → ENABLE → MONITOR → VERSION/DEPRECATE`

Discovery is technical awareness, not permission.

A newly advertised MCP/API tool never enters an active grant automatically.

Continuum may eventually help generate adapter/schema/test proposals and low-risk policy recommendations. There is no hidden self-rewrite/self-deploy path.

# Authorized continuity

Focused public companion:

`continuum-doc-authorized-continuity-CURRENT.md`

Future conceptual flow:

`PREPARED INTENT → CURRENT STATE → CONTINUITY POLICY → AUTHORIZED ACTION → WAIT / REPLY → CONTINUE → AUDIT`

Continuum may eventually carry specific approved work forward on a person's behalf when that person cannot participate directly. Prepared people, information, priorities, limits and authority remain the basis for that work.

The same architecture can support short-term unavailability, hospitalization, extended incapacity and long-term continuity after death according to the policy chosen beforehand.

Absence never expands published authority.

A future Goal may continue during unavailability when its published continuity policy allows it. Success criteria, constraints, budgets and stop conditions remain in force.

# Goal-driven architecture evolution

Canonical backend contract:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-GOAL-DRIVEN-ARCHITECTURE-EVOLUTION-CONTRACT.md`

Future conceptual flow:

`GOAL → ATTEMPT → GAP DETECTED → CHANGE PLAN → TEST → SIMULATE → AUTHORIZE → IMPLEMENT → RELEASE → MEASURE → KEEP / REVISE / ROLLBACK`

This is deeper than adding a provider capability. A Goal may eventually expose a recurring limitation in the data model, domain services, Runtime, capability mapping or other architecture. Continuum can prepare the smallest justified change and pass it through normal engineering and release controls.

Architecture evolution keeps versioning, migrations, tests, release authority, Audit/provenance and rollback. Permission remains governed separately.

# Control Center / autonomy / simulation

Canonical contract:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-CONTROL-CENTER-SIMULATION-AND-AUTONOMY-CONTRACT.md`

Direction:

- first-class desktop and mobile Control Center;
- one chronological activity truth projected into Now / Upcoming / History / All Activity;
- explainability from evidence → State → policy → authority → capability → Runtime → result;
- authenticated management of supported future work;
- Undo only where genuinely reversible;
- Pause Autonomy blocks new autonomous consequential execution while observation/learning/briefing may continue;
- timed pause expiry requires owner re-contact before any policy-defined fallback path is considered;
- general default response window direction = 24 hours with per-policy overrides;
- simulation can clone real current State, alter hypothetical facts and perform zero real side effects;
- important saved scenarios may rerun after relevant policy/capability changes and warn on safer/riskier/materially-different outcomes.

# One Planner language

Directory and focused Automations share the browser proving registry:

`assets/lab/lab-continuum-planner-contract-v1.js`

This is **not** backend authority.

Canonical desired flow:

`INTENT → TYPED CHANGE PLAN → PREFLIGHT → REVIEW → PROTECTED APPLY LATER`

Future protected Planner may span Directory, Library, Signals/Sources, Automations, supported Connection/capability mappings and policy/authority changes only through mature typed services.

# One Preflight language

Current user-facing Lab states:

- CHECK REQUIRED;
- PREVIEW DECISION;
- DEFERRED TO DRAFT;
- BLOCKED;
- APPROVAL REQUIRED.

The prototype currently maps some local warning text into typed issue codes. Production must return structured issues directly from protected services and must not use text matching as authority.

# Mobile validation

Current mobile QA includes rendered Chromium checks at **360×800** and **390×844** for the newer Directory/Planner/Automation contracts.

Workflow source existence is not proof of a green run. Do not claim CI success unless it was actually observed.

# Backend boundary

The first Phase 2A Library + typed Automation source is validated on `jay-app/main` but is **not production-migrated/deployed**.

Production still has no general:

- Directory v2 persistence;
- canonical Group/Label Audience resolver;
- SignalSource / Observation / SignalWatch / Signal service;
- multi-source availability inference;
- broad online monitoring;
- Source Catalog / broad Capability Registry;
- API/OpenAPI/MCP discovery/import;
- typed Automation data/input/inter-step service matching Lab;
- server equivalent of Lab v5;
- authoritative Planner registry/preflight/review/apply;
- Automation Runtime / persisted waits / branching;
- Goal/Mission orchestration;
- provider execution;
- acknowledgement/approval engine;
- Control Center/simulation engine;
- AI Task execution;
- Planner / Change Plan execution;
- Agent;
- MCP execution;
- autonomous capability adoption;
- architecture-evolution execution or self-deployment.

Do not infer backend capability from Lab visuals, browser models, architecture contracts or product docs.

# Copy and frontend safety

Preserve direct connected copy, truthful capability status, strong mobile layouts, no nested-scroll traps, no broad document-wide MutationObserver, no provider secrets in browser stores, no production API calls from isolated Lab routes and no arbitrary executable workflow/data/condition/integration language.

Accepted Lab behavior migrates as semantics, not DOM/localStorage/sessionStorage architecture.