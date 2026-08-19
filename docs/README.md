# CMX Documentation Index

Last reconciled: **August 19, 2026**
Repository: `CMXChat/First-Repo`

## Current rule

Current source, tests, workflows and `*-CURRENT.md` contracts take priority over older dated notes. Older Spaces, Brief, CRM and Automation prototypes remain decision history only.

# Start here

1. `checkin-context-handoff-CURRENT.md` — current cross-repository truth and release boundary.
2. `continuum-product-CURRENT.md` — Continuum identity and `/doc/` contract.
3. `continuum-signals-observations-master-plan-CURRENT.md` — Signals/Observations/State product direction.
4. `checkin-future-capabilities-CURRENT.md` — future Sources, Connections, capabilities, MCP/API discovery, Control Center and autonomy UX.
5. `continuum-automations-master-plan-CURRENT.md` — Automation product/model direction.
6. `checkin-automations-frontend-CURRENT.md` — exact Automations v5, Planner Preflight, mobile Action-stack and QA truth.
7. `continuum-directory-master-plan-CURRENT.md` — durable Directory direction.
8. `checkin-directory-library-CURRENT.md` — Directory/Audience/Library/Planner cross-domain truth.
9. `checkin-library-premium-CURRENT.md` — Library projection/navigation contract.
10. `checkin-content-editor-CURRENT.md` — native content/editor contract.
11. `checkin-files-CURRENT.md` — binary File direction.
12. `checkin-ai-product-design-CURRENT.md` — broader AI product direction.
13. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md` — canonical backend read map.
14. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-CORE-ARCHITECTURE-CONTRACT.md` — durable Knowledge/State/Authority/Policy/Audit invariants.
15. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-CONTROL-CENTER-SIMULATION-AND-AUTONOMY-CONTRACT.md` — desktop/mobile Control Center, Pause Autonomy, re-contact and simulation.
16. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-LIVE-WORLD-CAPABILITY-EXTENSION-CONTRACT.md` — Sources, API/MCP discovery, typed adapters and bounded self-improvement.
17. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md` — protected cross-domain Planner contract.
18. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-SIGNALS-OBSERVATIONS-PLATFORM-PLAN.md` — protected Signals/Observation/State architecture.

# Core architecture in one view

Durable control core:

`Knowledge + State + Authority + Policy + Audit`

Expanding/replaceable layers:

`Reasoning + Capabilities + Runtime`

Canonical consequence path:

`OBSERVE → SIGNAL → STATE → POLICY → AUTHORITY → CAPABILITY → RUNTIME → RESULT → AUDIT`

The capability ceiling can move as providers/models/tools improve. Authority still comes from policy.

Evidence can change State or eligibility. It never creates authority.

# Current key routes

## `/doc/`

Noindex master explanation of Continuum.

The August 19 architecture work deliberately expanded the product explanation around:

- capability/model portability;
- Knowledge + State + Authority + Policy + Audit;
- typed policy/authority;
- Signals as evidence;
- Planner as natural language → typed Change Plan;
- future live-world inputs through Connections/Sources/APIs/MCP.

Keep capability status truthful. The page may describe architecture direction as future, but it must not imply that current production already has Runtime, broad Signals monitoring, provider delivery, MCP execution or autonomous AI.

## `/lab/`

Broader Continuum experiment workspace.

Records runs **Directory v2** over browser-local prototype state. Directory `AI setup` opens **CONTINUUM PLANNER · PREVIEW** using the same browser Change Plan / Preflight / Review language as focused Automations.

The current **Online signals** example proposes a Watch, approved source, filter, bounded interpretation and Automation reference while keeping Signals service and Connection requirements blocked.

It performs no online observation.

## `/lab/automations/`

Focused Automation operating/testing surface with:

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
- rendered mobile QA.

V5 semantic shape:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

Beginner rail:

`WHEN → IF → DO → WAIT → TEST`

Current inter-step IF is a linear gate only. Inter-step WAIT is Runtime-required. There is no YES/NO branch graph yet.

None of the Lab Planner/Signals/Automation proof calls a model, protected backend mutation, provider, online monitor or Runtime.

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

# Live world / capability extension

Canonical backend contract:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-LIVE-WORLD-CAPABILITY-EXTENSION-CONTRACT.md`

Future provider/API/MCP capability lifecycle:

`DISCOVER → NORMALIZE → CLASSIFY → MAP → TEST → SIMULATE → REVIEW/POLICY → ENABLE → MONITOR → VERSION/DEPRECATE`

Discovery is technical awareness, not permission.

A newly advertised MCP/API tool never enters an active grant automatically.

Continuum may eventually help generate adapter/schema/test proposals and low-risk policy recommendations. There is no hidden self-rewrite/self-deploy path.

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
- provider execution;
- acknowledgement/approval engine;
- Control Center/simulation engine;
- AI Task execution;
- Planner / Change Plan execution;
- Agent;
- MCP execution;
- autonomous capability adoption or self-deployment.

Do not infer backend capability from Lab visuals, browser models, architecture contracts or product docs.

# Copy and frontend safety

Preserve direct connected copy, truthful capability status, strong mobile layouts, no nested-scroll traps, no broad document-wide MutationObserver, no provider secrets in browser stores, no production API calls from isolated Lab routes and no arbitrary executable workflow/data/condition/integration language.

Accepted Lab behavior migrates as semantics, not DOM/localStorage/sessionStorage architecture.
