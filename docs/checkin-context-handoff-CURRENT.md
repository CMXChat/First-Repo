# Check In / Continuum Context Handoff — CURRENT

Date: 2026-08-18
Status: Current cross-repository continuation guide; Phase 1 acceptance complete

This is the first file a new ChatGPT/Codex/developer context should read before changing Continuum or Check In.

**Continuum** is the umbrella product. **Check In** remains the current protected application/backend program name in routes, code and existing specs. **Spaces** is the briefing/context experience. **Afterlife: The Dead Man Switch** is the continuity experience built on the same timing, information, people, Automation, Connection, authority and Runtime architecture.

# Read first

1. `docs/checkin-context-handoff-CURRENT.md` — this file, current cross-repo truth and immediate order.
2. `docs/continuum-product-CURRENT.md` — Continuum naming, `/doc/` role, visual/editorial rules and product hierarchy.
3. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md` — canonical architecture map and conflict order.
4. `CMXChat/jay-app/specs/003-server-checkin/tasks.md` — executable checklist and Phase 2A gate state.
5. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-READ-FIRST.md` — implementation decisions before backend Phase 2A.
6. `CMXChat/jay-app/specs/003-server-checkin/CHECKIN-PLATFORM-ARCHITECTURE.md` — Directory / Library / Automation / Runtime / Connections / AI architecture.
7. `CMXChat/jay-app/specs/003-server-checkin/CONTEXT-INGESTION-PROVENANCE-BACKEND-CONTRACT.md` — APIs/MCP/webhooks/sync/provenance/freshness/context-builder direction.
8. `CMXChat/jay-app/specs/003-server-checkin/CAPABILITIES-CONNECTIONS-AI-ROADMAP.md` — long-term adaptable tools, providers, MCP, voice, finance and coordination.
9. `CMXChat/jay-app/specs/003-server-checkin/AI-CAPABILITY-AND-TOOLS-CONTRACT.md` — typed AI tools and protected retrieval.
10. `CMXChat/jay-app/specs/003-server-checkin/DELEGATED-AUTHORITY-BACKEND-CONTRACT.md` — standing contingency authority.
11. `CMXChat/jay-app/specs/003-server-checkin/COMMUNICATION-ACTIONS-BACKEND-CONTRACT.md` — Email/Message/Discord delivery model.
12. `CMXChat/jay-app/specs/003-server-checkin/INBOUND-COMMUNICATION-CONVERSATION-CONTRACT.md` — replies and future Conversation runtime.
13. `docs/checkin-automations-frontend-CURRENT.md` — focused Automations v3 Lab and current mobile-first UX contract.
14. `docs/checkin-lab-automations-integration-CURRENT.md` — `/lab/` ↔ `/lab/automations/` integration, shared state and reusable Action references.
15. `docs/checkin-communications-ai-CURRENT.md` — Email + AI Task design/backend-facing frontend contract.
16. `docs/checkin-library-premium-CURRENT.md` — current Library quality/UX contract.

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

# Phase 1 acceptance gate — complete

T034–T040 are complete.

Direct browser/device evidence now covers:

- Samsung public live status/countdown;
- mobile Settings access and locked privacy presentation;
- desktop locked Settings privacy/presentation after width/overflow hardening;
- authenticated read-only protected policy representation;
- manual Lock Now cleanup;
- natural short-session expiry without pressing Lock Now;
- private Settings DOM-value scrubbing on lock/expiry;
- truthful public status remaining after private access expires.

Natural expiry evidence was observed on real Chrome: the private session showed 5:55 remaining at 3:11 PM, the page was left alone, and by 3:17 PM it had returned to locked state. The private strip was gone, the top action returned to `Access`, System Integrity showed `LOCKED`, and locked Settings exposed only the public current window plus the unlock affordance.

No production policy mutation, pause/resume, deadline override, reconciliation or proof-of-life check in was performed merely to close the acceptance gate.

# Samsung / mobile guardrails

The prior Samsung freeze was caused by overly broad DOM observation. Preserve these rules:

- no broad document-wide MutationObserver;
- no whole-page rescans on arbitrary mutations;
- no self-mutating observer loops;
- targeted events/observers only;
- no production-state mutation just to test UI.

The focused Automation route was rebuilt on 2026-08-18 as Automations v3. The previous `lab-automations-mobile-readable.css` layer is no longer loaded by `/lab/automations/`; its readability goals have been absorbed into `assets/lab/lab-automations-experience-v3.css`.

On phones, preserve:

- one primary decision area at a time;
- readable Draft and editor copy without zooming;
- 44–50px-class primary controls where practical;
- a horizontally scrollable five-stage rail instead of compressed labels;
- one-column Action cards;
- bottom-sheet pickers/modals;
- a collapsible mobile flow preview instead of a squeezed desktop sidebar;
- safe-area-aware fixed footer;
- document-level scrolling without nested editor scroll traps;
- no horizontal page overflow;
- rich black dark mode plus usable light mode.

See `docs/checkin-automations-frontend-CURRENT.md`.

# Focused Automation Lab

Active route:

`https://db.cmxchat.com/lab/automations/`

This is the Check In/Continuum Automation product-design proving ground. `/lab/` remains the broader experiment umbrella and links into the focused route.

Current focused authority:

```text
assets/lab/lab-automations-experience-v3.js
assets/lab/lab-automations-experience-v3.css
assets/lab/lab-automations-route-integration.js
```

`lab-automations-app-v2.js` and the old focused enhancement runtimes remain repository history but are no longer loaded by the route.

The focused route keeps:

```text
connect-src 'self'
```

It does not call the production API. localStorage is prototype state, not production persistence, authority or delivery history.

Accepted UX later migrates into protected `/checkin/` after the matching backend services exist.

Human editor:

```text
WHEN  Trigger
IF    Rules
DO    Actions
WAIT  Timing
TEST  Review
```

Name/description are editable metadata instead of a blocking first screen. Finish behavior lives inside Review.

The builder includes quick-start templates, optional AND/OR rules, an ordered Action stack, progressive Flow Preview, visual timing, pre-flight checks and safe animated simulation. A brand-new draft must not present future stages as if the user already configured them. The preview grows from real choices; pending stages stay visibly unset until configured or intentionally accepted as a real default.

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

# Automation shared state and reusable Actions

The main Lab and focused Automation route share:

```text
cmx-lab-automations-v1
cmx-lab-crm-v1
cmx-lab-inventory-v1
```

The focused route also reads the main Lab reusable Action store:

```text
cmx-lab-actions-v1
```

Saved Actions are inserted into an Automation as explicit `action_ref` entries containing the saved Action ID and label. Do not silently translate reusable SMS, Email, AI, Publish, Webhook/API, Digital Account or other Action types into the smaller inline Automation type set.

The main Lab Action library remains the definition authority. A future backend must authorize, version/resolve and snapshot a referenced Action server-side before execution.

# Email + AI Task

The deeper Email and AI Task models remain architectural/product contracts even though the current v3 builder presents a simplified inline Action surface plus reusable Action references.

Email design model:

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

AI Task design model:

```text
Objective
Instructions
Context
Tools
Autonomy
Limits
```

Authority modes may later include:

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

The 2026-08-18 version is the frozen visual/editorial explanation. Future changes should be factual product updates, accessibility/browser fixes, genuine capability-status changes, or correction of outdated examples.

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

Phase 1 acceptance is complete. Do not reopen it unless a real production defect appears.

Now build the first real private-information vertical slice:

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
