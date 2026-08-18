# Check In / Continuum Context Handoff — CURRENT

Date: 2026-08-18
Status: Current cross-repository continuation guide

This is the first file a new ChatGPT/Codex/developer context should read before changing Continuum or Check In.

**Continuum** is the umbrella product. **Check In** remains the current protected application/backend program name in routes, code and existing specs. **Spaces** is the briefing/context experience. **Afterlife: The Dead Man Switch** is the continuity experience built on the same timing, information, people, Automation, Connection, authority and Runtime architecture.

# Read first

1. `docs/checkin-context-handoff-CURRENT.md` — this file, current cross-repo truth and immediate order.
2. `docs/continuum-product-CURRENT.md` — Continuum naming, `/doc/` role, visual/editorial rules and product hierarchy.
3. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md` — canonical architecture map and conflict order.
4. `CMXChat/jay-app/specs/003-server-checkin/tasks.md` — executable checklist and open Phase 1 acceptance gates.
5. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-READ-FIRST.md` — implementation decisions before backend Phase 2A.
6. `CMXChat/jay-app/specs/003-server-checkin/CHECKIN-PLATFORM-ARCHITECTURE.md` — Directory / Library / Automation / Runtime / Connections / AI architecture.
7. `CMXChat/jay-app/specs/003-server-checkin/CONTEXT-INGESTION-PROVENANCE-BACKEND-CONTRACT.md` — APIs/MCP/webhooks/sync/provenance/freshness/context-builder direction.
8. `CMXChat/jay-app/specs/003-server-checkin/CAPABILITIES-CONNECTIONS-AI-ROADMAP.md` — long-term adaptable tools, providers, MCP, voice, finance and coordination.
9. `CMXChat/jay-app/specs/003-server-checkin/AI-CAPABILITY-AND-TOOLS-CONTRACT.md` — typed AI tools and protected retrieval.
10. `CMXChat/jay-app/specs/003-server-checkin/DELEGATED-AUTHORITY-BACKEND-CONTRACT.md` — standing contingency authority.
11. `CMXChat/jay-app/specs/003-server-checkin/COMMUNICATION-ACTIONS-BACKEND-CONTRACT.md` — Email/Message/Discord delivery model.
12. `CMXChat/jay-app/specs/003-server-checkin/INBOUND-COMMUNICATION-CONVERSATION-CONTRACT.md` — replies and future Conversation runtime.
13. `docs/checkin-automations-frontend-CURRENT.md` — focused Automation Lab and current mobile readability rules.
14. `docs/checkin-communications-ai-CURRENT.md` — Email + AI Task frontend contract.
15. `docs/checkin-library-premium-CURRENT.md` — current Library quality/UX contract.

Do not reconstruct the project from old chat memory when these files exist.

# Production truth

Phase 1 backend is live and production verified.

Reviewed Render application release:

`de55627926316581808337f8e9c10d26e7d64588`

Production Alembic revision:

`c41f9b8d2e70`

Recorded Aiven recovery checkpoint:

`2026-08-17 17:04:13 UTC`

Current policy:

```text
successful protected check in
→ authoritative server timestamp
→ 72 elapsed hours
→ deadline
→ 24 elapsed hour grace
→ triggered state
```

UTC/PostgreSQL/server time is authoritative. The current policy is not weekly.

Phase 1 includes immutable policy versions, policy/window pointers, configurable interval/grace, pause/resume, one-time deadline override, reconciliation, immutable Incident snapshots/lifecycle, atomic Audit, DB constraints, protected private session, CSRF/Origin checks and sanitized public state.

Phase 1 performs no external provider/Action execution. A triggered Incident does not mean an email, SMS, Discord message, file release or AI action happened.

Do not mutate production merely to test presentation.

# Remaining Phase 1 acceptance gate

Exactly two direct acceptance observations remain open:

1. desktop locked Settings visual/privacy review;
2. natural protected-session expiry after the normal short session, proving private UI/state clears and truthful public state remains.

T037/T039 stay partial until that evidence exists.

# Samsung / mobile guardrails

The prior Samsung freeze was caused by overly broad DOM observation. Preserve these rules:

- no broad document-wide MutationObserver;
- no whole-page rescans on arbitrary mutations;
- no self-mutating observer loops;
- targeted events/observers only;
- no production-state mutation just to test UI.

The focused Automations Lab also has a new readability contract after real Samsung review showed desktop-density on phone cards.

`assets/lab/lab-automations-mobile-readable.css` is loaded last and should remain the mobile readability floor. On phones, preserve roughly:

- 24px Draft titles;
- 16px Draft summary/body copy;
- vertically stacked WHEN / DO / THEN summary nodes;
- 44–50px controls;
- 16px form input text;
- readable Timing, Email and AI Task panels;
- no horizontal compression that creates micro-copy.

See `docs/checkin-automations-frontend-CURRENT.md`.

# Focused Automation Lab

Active route:

`https://db.cmxchat.com/lab/automations/`

This is the Check In/Continuum Automation product-design proving ground. `/lab/` remains the broader experiment umbrella.

The focused route keeps:

```text
connect-src 'self'
```

It does not call the production API. localStorage is prototype state, not production persistence, authority or delivery history.

Accepted UX later migrates into protected `/checkin/` after the matching backend services exist.

Human editor:

```text
BASICS
TRIGGER
RULES
ACTIONS
TIMING
FINISH
REVIEW
```

Backend mental model:

```text
WHEN
IF
DO
WAIT / REPEAT
THEN
```

# Current Lab domains

Directory/Audience:

```text
Person ↔ Organization
Labels
Groups / saved Audiences
```

Content:

```text
ContentAsset
→ mutable ContentDraft
→ immutable ContentVersion
→ AutomationVersion reference
```

Files:

```text
FileAsset
→ immutable FileVersion
→ private StorageObject later
```

Library is a protected projection over distinct models with logical folders, templates, stable IDs, PostgreSQL-first search and dependency/Used By direction.

Binary files remain metadata-only in Lab. Do not fake object bytes or Base64 payloads in Action definitions.

# Email + AI Task

Email is the first deeply modeled communication Action:

```text
From
To
CC
BCC
Reply-To
Subject
Rich body
Attachments
Preview
```

Production From comes from `Connection + SenderIdentity`. To/CC/BCC reuse Directory/Audience. Subject/body use private Content. Attachments use exact FileVersions. Lab sends nothing.

AI Task remains structured:

```text
Objective
Instructions
Context
Tools
Autonomy
Limits
```

Current UX modes:

```text
Draft only
Approval required
Pre-authorized contingency
```

Prompt text is intent, never authority. AI cannot publish, activate, widen or renew its own grant.

Critical continuity should prefer deterministic pre-approved Actions for essential first steps, with bounded AI for interpretation, coordination and follow-up later.

# Continuum capability direction

Continuum is designed to gain capabilities through typed tools and Connections instead of separate provider-specific engines.

Potential communication families include Email, SMS/MMS, WhatsApp Business, Discord, Slack/Teams/Telegram, push and voice calls.

Other future families include Calendar, storage, GitHub, productivity, CRM, accounting, infrastructure, monitoring, banking, brokerage, APIs and external MCP resources/tools.

Capability availability may be represented as:

```text
disabled
read_only
approval_required
standing_grant_allowed
human_only
```

High-consequence capabilities are not globally hardcoded impossible. A future provider/product policy may support bounded transfers, payments, trades or person-mediated coordination under exact server-enforced authority. AI never creates that authority for itself.

Outcome policy follows the requested result. Messaging another person is not a loophole around a forbidden direct operation.

# Information ingestion / Spaces direction

Continuum also needs a strong input side:

```text
RECEIVE
→ NORMALIZE
→ REMEMBER
→ BUILD CONTEXT
→ REASON
→ DECIDE
→ ACT
→ OBSERVE RESULT
→ UPDATE STATE
```

Inputs can later arrive through provider APIs, MCP resources, verified webhooks, scheduled sync, files, direct human updates and Conversations.

Keep source identity, observed/updated time, freshness, sync health, permission scope and provenance attached. A stale or partial external observation must not be presented as current complete truth.

Spaces is the briefing/context experience over that protected state. It should reduce a large world to the changes, decisions and actions worth seeing for the current person/group/Space.

# `/doc/` current role

`https://db.cmxchat.com/doc/` is the public noindex visual master explanation of Continuum.

The 2026-08-18 version is intentionally shorter and more visual than the previous architecture-heavy rewrite. It currently uses eight main reading sections:

1. Continuum in one minute;
2. why AI has more leverage inside durable state;
3. Spaces and incoming context;
4. Automations, Connections, tools and authority;
5. Afterlife: The Dead Man Switch;
6. how the application is programmed;
7. Lab → backend → protected-product build path;
8. current reality.

The page should be understandable without reading every paragraph. Preserve the visual system orbit, operating loop, provenance example, briefing mock, workflow/Connection view, Afterlife timeline, programming stack and build path.

Do not expand `/doc/` back into a long wall of architecture prose when the visuals already teach the mechanism.

# Build method

The approved product-development pattern is:

```text
Lab UX
→ backend contract
→ PostgreSQL/domain service
→ protected FastAPI operation
→ accepted UI migrated into /checkin/
→ Runtime/provider execution only after its prerequisites exist
```

Lab is the design proving ground. It is not a permanent second production application.

# Immediate backend order

Do not start providers, scheduler/worker, autonomous AI or MCP execution in parallel with the foundation.

First finish the two Phase 1 acceptance observations.

Then build the first real private-information vertical slice:

```text
create continuity.md
→ ContentAsset + mutable ContentDraft in PostgreSQL
→ refresh / another authenticated request reads the same Draft
→ stale-write-safe update
→ Save Version creates immutable ContentVersion v1
→ place it in real LibraryFolder
→ protected PostgreSQL search finds it
→ Details returns exact version + dependency information
→ Automation Draft references it
→ no external side effect
```

Then complete typed Automation definitions including Email and AI Task/Authority references. Phase 2B moves accepted builder UX into protected `/checkin/`. Durable Runtime with a fake provider follows. One real low-risk provider comes after Runtime/idempotency/recovery/Audit are proven. Inbound Conversations come later. AI Task, Planner and Agent follow in that order. MCP sits on top of typed services later.

# Security and reliability rules

Preserve:

- Secure HttpOnly private sessions + CSRF/exact Origin;
- server-authoritative timing/state;
- stable protected IDs;
- immutable published/version history;
- no provider secrets in browser storage/content/prompts/Audit;
- no arbitrary Python/JavaScript/shell/SQL/eval;
- no unrestricted arbitrary webhook execution;
- idempotency before external side effects;
- server-enforced approvals/authority;
- prompt text never expands authority;
- truthful `backend pending` / `execution off` language.

An SMTP credential was exposed earlier in diagnostic output. Never reproduce it. Before overall project closeout, rotate it if that has not already been done.
