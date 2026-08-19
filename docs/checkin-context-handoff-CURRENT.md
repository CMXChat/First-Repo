# Check In / Continuum Context Handoff — CURRENT

Date: 2026-08-19
Status: Canonical cross-repository continuation guide; Phase 1 production, validated Phase 2A source pending production migration, Continuum core/Signals/State/live-world/autonomy architecture aligned, rich Lab product proofs active

Read this first before changing Continuum or Check In.

# Product map

- **Continuum** = umbrella product.
- **Check In** = current protected application/backend program name.
- **Directory** = People, Organizations, relationships, contact methods and saved audiences.
- **Library** = protected content, files and durable saved knowledge.
- **Signals / Observations** = provenance-backed evidence from approved outside/internal sources.
- **State** = current operational truth used by policy, Automations and Runtime.
- **Automations** = typed workflow definitions.
- **Connections / Capabilities** = approved paths to outside sources/tools plus the typed operations Continuum can currently use.
- **Policy / Authority** = conditions, limits, approvals and explicit permission for consequential behavior.
- **Runtime** = future durable execution/history.
- **AI / Planner** = replaceable reasoning and natural-language authoring through the same typed domain services humans use.
- **Control Center** = future desktop/mobile management, activity, autonomy and simulation surface.
- **Spaces** = briefing/context experience.
- **Afterlife / Dead Man Switch** = continuity use case on the shared foundation.

Core principles:

> **Build the control plane. Rent the capabilities.**

> **The capability ceiling can move. Authority still comes from policy.**

# Core architecture

Durable control core:

`Knowledge + State + Authority + Policy + Audit`

Replaceable/expanding layers:

`Reasoning + Capabilities + Runtime`

Canonical consequence path:

`OBSERVE → SIGNAL → STATE → POLICY → AUTHORITY → CAPABILITY → RUNTIME → RESULT → AUDIT`

Important rules:

- evidence can change State/eligibility;
- evidence never grants authority;
- stronger models/new APIs/MCP tools can expand reasoning/capability without silently widening authority;
- humans, AI, workers and MCP adapters use the same protected typed services;
- operational State is server-backed where consequence depends on it;
- policy/authority/capability versions used for consequential work remain auditable.

# Read order

1. `docs/checkin-context-handoff-CURRENT.md`
2. `docs/continuum-product-CURRENT.md`
3. `docs/continuum-signals-observations-master-plan-CURRENT.md`
4. `docs/checkin-future-capabilities-CURRENT.md`
5. `docs/continuum-automations-master-plan-CURRENT.md`
6. `docs/checkin-automations-frontend-CURRENT.md`
7. `docs/continuum-directory-master-plan-CURRENT.md`
8. `docs/checkin-directory-library-CURRENT.md`
9. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md`
10. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-CORE-ARCHITECTURE-CONTRACT.md`
11. `CMXChat/jay-app/specs/003-server-checkin/CHECKIN-PLATFORM-ARCHITECTURE.md`
12. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-CONTROL-CENTER-SIMULATION-AND-AUTONOMY-CONTRACT.md`
13. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-LIVE-WORLD-CAPABILITY-EXTENSION-CONTRACT.md`
14. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-SIGNALS-OBSERVATIONS-PLATFORM-PLAN.md`
15. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`
16. `CMXChat/jay-app/specs/003-server-checkin/DELEGATED-AUTHORITY-BACKEND-CONTRACT.md`
17. `CMXChat/jay-app/specs/003-server-checkin/HANDOFF.md`
18. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-PRODUCTION-DEPLOYMENT-RUNBOOK.md`
19. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-CONTINUATION-PLAN.md`
20. `CMXChat/jay-app/specs/003-server-checkin/tasks.md`

Current source/tests and `*-CURRENT.md` files beat older chats, dated handoffs and stale READMEs.

# Production truth

Production remains **Phase 1**.

Reviewed Render release:

`de55627926316581808337f8e9c10d26e7d64588`

Production Alembic:

`c41f9b8d2e70`

Protected timer remains:

`successful check in → 72 elapsed hours → grace begins → 24 elapsed hours → triggered if grace expires`

UTC/PostgreSQL/server time is authoritative.

Production does **not** execute email, SMS, Discord, webhook, AI, file release or other provider Actions. A triggered Incident does not mean an external Action ran.

Phase 1 acceptance T034–T040 is complete. Do not reopen it without a real defect.

# Validated Phase 2A source

`jay-app/main` contains validated source for the first protected Library/content + typed Automation definition slice.

Migration chain:

`c41f9b8d2e70 → f2a0c1d2e3b4 → a31c7d8e9f20`

These revisions are **not deployed to production yet**.

Validated Library model:

`LibraryFolder`

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

Validated Automation model:

`Automation → mutable AutomationDraft → REVIEW → immutable AutomationVersion`

Current real backend Automation subset remains deliberately small:

- Trigger: `manual`, `checkin_grace_start`, `checkin_grace_expiry`;
- Action: definition-only `manual_review`;
- immediate start policy;
- simple Finish;
- no real Conditions;
- no Runtime/provider/worker/AI execution.

Publish freezes exact immutable ContentVersion identity and later Draft edits cannot rewrite published history.

# Immediate backend boundary

Before broad Directory/Signals/Runtime/Planner schema expansion, execute the prepared Phase 2A production migration/deployment runbook and then the separate first protected `continuity.md` acceptance proof.

Do **not** mix new Directory schema, Signals services, general State/authority schema, Runtime, providers, capability discovery, Control Center persistence or AI execution into the reviewed Phase 2A migration.

Architecture reconciliation does not authorize production deployment/migration.

# Live world / API / MCP direction

Canonical backend contract:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-LIVE-WORLD-CAPABILITY-EXTENSION-CONTRACT.md`

Continuum should grow as new APIs, MCP servers, tools, services and devices become available without redesigning the durable core.

Candidate capability lifecycle:

`DISCOVER → NORMALIZE → CLASSIFY → MAP → TEST → SIMULATE → REVIEW/POLICY → ENABLE → MONITOR → VERSION/DEPRECATE`

Possible live information paths include:

- provider push/webhooks;
- scheduled polling;
- RSS/feed sync;
- constrained webpage monitoring;
- approved search/news providers;
- MCP resources;
- on-demand typed reads;
- internal domain events;
- future approved device/sensor streams.

A newly advertised API/MCP capability is a **candidate**, not authority.

Continuum may eventually help generate adapter/schema/test proposals. There is no hidden path where AI edits/deploys production code and grants itself access.

# Signals / Observations / State direction

Canonical product plan:

`docs/continuum-signals-observations-master-plan-CURRENT.md`

Backend plan:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-SIGNALS-OBSERVATIONS-PLATFORM-PLAN.md`

Durable path:

`SignalSource → Observation → Signal → State / eligibility → Policy + Authority → Capability → Runtime → result`

Future approved sources may include provider APIs/webhooks, RSS/feed, constrained webpage monitoring, approved search/news sources, GitHub/status/provider events, approved MCP resources, account/project streams, device sources and trusted-person attestations where configured.

Signals may eventually:

- start an Automation;
- satisfy/invalidate a Condition;
- change protected State/eligibility;
- contribute to an Incident;
- wake/resume Runtime;
- contribute to availability confidence;
- feed Spaces/briefings or AI reasoning.

External content is untrusted. It cannot expand tools, Audience, Connections, policy, grants or Runtime authority.

Conflicting evidence should be preserved where material. Confidence may incorporate freshness, corroboration, source reliability, history, context, outcomes and feedback.

There is no single universal confidence threshold for every consequence.

Initial learned trust/relevance changes should be recommendations. Later selected low-risk automatic tuning requires explicit policy/meta-authority.

# Availability / continuity architecture

Owner availability should eventually be able to use multiple approved Signals, not only the Dead Man Switch timer.

Possible evidence includes missed Check Ins, lack of replies, approved device/account activity, deadlines, trusted-person attestations and other configured sources.

The owner must be able to disable the availability-inference system or individual evidence sources.

Trusted-person attestations are evidence by default. A trusted person can directly change authoritative State only under separate explicit authority.

Fallback authority means previously published authority becomes eligible when its conditions are satisfied.

Silence, absence or urgency never creates authority.

When owner availability is restored:

`no new fallback-authority claims → already-started work follows typed recovery semantics`

# Master autonomy pause

The future system needs a first-class **Pause Autonomy** control.

While paused:

- new autonomous consequential Actions are blocked;
- observation, Signals, State maintenance, learning, drafting and briefings may continue;
- direct owner-requested actions are handled according to their own interaction/policy rules.

Pause may support:

- until manually resumed;
- until a chosen date/time;
- long deliberate durations such as one year;
- future scoped pauses.

Timed pause expiry does not silently turn autonomy back on.

Desired flow:

`pause expires → contact owner through configured strategy → wait effective response window → if owner responds, use decision → if not, evaluate published continuity/fallback policy`

General default response-window direction is 24 hours with per-policy overrides.

Contact strategy may be all channels at once, staged escalation, preferred order, retries, stop-on-acknowledgement or trusted-person escalation depending on the policy.

# Control Center / simulation direction

Canonical backend/product contract:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-CONTROL-CENTER-SIMULATION-AND-AUTONOMY-CONTRACT.md`

Control Center is intended as a first-class desktop **and mobile** surface.

Preferred primary views:

- Now;
- Upcoming;
- History;
- All Activity.

Underneath, one canonical event/activity truth should cover observations, Signals, State changes, policy/authority changes, Actions, waits, retries, contact attempts, results and management actions.

Opening a consequential item should expose:

`evidence → State → policy → authority → capability → Runtime → result`

The user should eventually be able to edit/cancel/retry supported future work, hide/archive user-facing history, use Undo where truly reversible, pause autonomy and inspect source/capability health.

Consequential Audit remains durable even if the UI hides an item.

Simulation should:

- start from a frozen snapshot of real current State where useful;
- allow hypothetical inputs;
- perform no real side effects or real authority activation;
- save named scenarios;
- rerun important scenarios after relevant policy/capability changes;
- show what changed and why;
- classify changed outcomes as advisory safer/riskier/materially different with reasons.

# `/lab/automations/` current truth

Focused Lab route remains isolated and simulation-only.

Current important product proofs:

- v3 Draft/autosave compatibility editor;
- **v5 canonical ordered workflow model**;
- command center + Capability Catalog;
- **15 scenarios**;
- Directory readiness + Audience v4.1;
- typed data/recommendations/tests v4.2;
- Input Routing v4.3;
- inter-step IF/WAIT authoring v4.4;
- ordered v5 Flow Preview;
- deterministic local Planner v5;
- editable/resettable Planner proposals before Draft creation;
- shared Planner Contract v1;
- plan-local dependency/temp-ref proof;
- typed interactive Preflight v1;
- shared Change Review v1;
- compact mobile Action-stack v6;
- 360/390px rendered browser contracts.

Lab boundary:

- `connect-src 'self'`;
- no production API/provider/model call;
- no authoritative scheduling;
- no Publish;
- no provider secrets;
- no online monitoring authority.

Beginner rail stays:

`WHEN → IF → DO → WAIT → TEST`

Canonical Lab sequence underneath:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

Start timing/recurrence remain separate policies.

Current inter-step IF is a **linear gate only**. There is no YES/NO branch graph.

Inter-step WAIT remains Runtime-required.

**Do not copy browser `workflowV5` JSON into backend schema.**

# Mobile authoring truth

Mobile Action-stack v6 gives multi-Action flows:

- compact rows;
- one open Action at a time;
- explicit Edit/Hide;
- separate labeled Remove;
- Collapse all;
- expanded reorder/duplicate/pause controls;
- collapsed Audience/Input Routing/Use Data details;
- no drag authoring on phone.

When multiple Actions exist, Remove uses the existing v3 mutation path. The final compatibility Action remains `Only step` because v3 still expects one Action slot.

# Planner current truth

There is still **no real AI Planner**.

Automation Planner v5 is a small deterministic local matcher. Directory Planner typed-v2 uses fixed typed examples. Both prove the future product interaction without model/backend authority.

Shared desired flow:

`intent → typed Change Plan → preflight → review → protected apply later`

Browser operations may demonstrate:

- `id`;
- `dependsOn[]`;
- `produces: temp:…`;
- `uses[]` earlier plan results.

Temporary refs are plan-local proof only.

Automation Planner proposals can be revised before creating a Draft by removing proposed Actions/inter-step controls and resetting the original deterministic proposal. Removing an Action recalculates the actual plan, prunes invalid dependencies, rebuilds typed operations and reruns Preflight/Change Review.

Current Lab Preflight states:

- CHECK REQUIRED;
- PREVIEW DECISION;
- DEFERRED TO DRAFT;
- BLOCKED;
- APPROVAL REQUIRED.

The browser proving adapter currently classifies local warning text into typed issue codes. Protected backend services must return structured issue objects directly. **Do not implement production preflight as text matching.**

Future Planner may propose Directory, Library, Signals/Sources, Automations, Connection/capability mapping and policy/authority operations only through mature typed domain services.

A discovered API/MCP tool never becomes executable merely because Planner understood it.

# Directory current truth

Main `/lab/` Records surface uses Directory v2 over browser-local prototype state.

Current concepts include People, Organizations, Groups/saved audiences, many-Organization memberships, ContactMethods/readiness, Labels, Person relationships, notes/Activity, Group resolution, duplicate warnings, Automation usage and responsive desktop/mobile presentation.

Production still needs typed protected Directory models/services.

Automation Audience v4.1 can compose Person / Organization / Group / Label selectors and preview unique Person resolution/readiness. Production resolution remains server-owned.

Relationships/Labels do not silently grant authority.

# Shared Planner Signals vocabulary

Browser Change Plan registry reserves definition operations such as:

- `signals.create_watch`;
- `signals.update_watch`;
- `signals.attach_source`;
- `signals.set_filter`;
- `signals.set_interpretation`;
- `signals.pause_watch`;
- `automation.reference_signal`.

This is vocabulary preparation only, not a protected server allowlist.

Directory Planner includes a fixed **Online signals** example:

`Create Watch → Attach approved source → Set filter → Set bounded interpretation → Create Automation Draft → Reference Signal Watch`

It is explicitly **NO ONLINE OBSERVATION** and keeps Signals service/source Connection gaps blocked.

# Validation contracts

Current important workflows include:

- `checkin-lab-validation.yml`;
- `checkin-automations-validation.yml`;
- `automations-v5-model-validation.yml`;
- `automations-v5-planner-validation.yml`;
- `automations-v5-planner-edit-validation.yml`;
- `automations-v6-action-stack-validation.yml`;
- `continuum-planner-preflight-validation.yml`;
- `continuum-signals-planner-validation.yml`;
- `continuum-mobile-layout-validation.yml`;
- Directory-specific workflows.

Newer mobile interactions are exercised at **360×800** and **390×844**.

Do not claim a green workflow run unless it was actually observed/verified.

# Current non-production list

Production still does **not** have general:

- Directory v2 persistence;
- canonical Group/Label Audience resolver;
- SignalSource / Observation / SignalWatch / Signal service;
- multi-source availability inference;
- broad online monitoring/web search/news polling;
- Source Catalog / live source health UI;
- broad server Capability Registry;
- API/OpenAPI/MCP discovery/import pipeline;
- typed Automation data/input/inter-step service matching Lab;
- server equivalent of Lab v5;
- authoritative Planner registry/preflight/review/apply;
- Automation Runtime;
- persisted waits/branching;
- provider delivery;
- acknowledgement/approval engine;
- Control Center matching the new contract;
- real simulation engine;
- AI Task execution;
- Planner / Change Plan execution;
- Agent;
- MCP execution;
- autonomous capability adoption;
- self-deploying AI code.

# What to do next

Immediate backend work remains the prepared Phase 2A production migration/deployment boundary, only after explicit authorization.

After that boundary and the separate `continuity.md` proof, architecture order remains:

1. bounded Directory/Automation/domain-service breadth;
2. real protected builder surfaces;
3. one narrow read-only Source/Observation/provenance path;
4. durable linear Runtime + fake provider;
5. one real low-risk provider;
6. one deterministic SignalWatch/Signal family and protected State slice;
7. waits/retries/acknowledgements/approvals, then typed routing;
8. AI Task + read-only Planner tools;
9. Change Plan generation/preflight then low-risk apply;
10. broader Signals/Planner-created Watches;
11. second provider to prove adapter extensibility;
12. bounded MCP discovery/import;
13. OpenAPI-assisted capability proposals;
14. explicit-policy low-risk tuning/adoption;
15. bounded Agent / broader continuity autonomy later.

Safe frontend/product work can keep refining accepted Lab semantics and documenting future Control Center/Source/Capability UX without claiming backend implementation.
