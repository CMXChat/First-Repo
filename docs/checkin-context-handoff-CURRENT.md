# Check In Context Handoff — CURRENT

Date: 2026-08-17
Status: Current cross-repository continuation guide

This is the first file a new ChatGPT/Codex context should read for Check In.

It records current production truth, the remaining acceptance gate, the focused Lab state, and the approved platform/backend direction. Longer historical detail remains in dated handoffs/audits.

# 1. Source-of-truth order

Read in this order before substantial work:

1. **This file** — current cross-repo state and immediate continuation.
2. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md` — shareable architecture map.
3. `CMXChat/jay-app/specs/003-server-checkin/tasks.md` — executable checklist and open gates.
4. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-READ-FIRST.md` — required product-model gate before backend Phase 2A.
5. `CMXChat/jay-app/specs/003-server-checkin/CHECKIN-PLATFORM-ARCHITECTURE.md` — bird’s-eye platform/domain architecture.
6. `CMXChat/jay-app/specs/003-server-checkin/CAPABILITIES-CONNECTIONS-AI-ROADMAP.md` — long-term adaptable capability/Connection/AI expansion roadmap.
7. `CMXChat/jay-app/specs/003-server-checkin/AI-CAPABILITY-AND-TOOLS-CONTRACT.md` — general future AI/tool/capability boundary.
8. `CMXChat/jay-app/specs/003-server-checkin/DELEGATED-AUTHORITY-BACKEND-CONTRACT.md` — standing contingency authority/activation rules.
9. `CMXChat/jay-app/specs/003-server-checkin/COMMUNICATION-ACTIONS-BACKEND-CONTRACT.md` — Email/Message/Discord typed delivery contract.
10. `CMXChat/jay-app/specs/003-server-checkin/CHECKIN-MASTER-PLAN.md` — durable production/automation roadmap.
11. `CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-NEXT.md` — production frontend/backend integration detail.
12. `CMXChat/jay-app/specs/003-server-checkin/AUTOMATION-FRONTEND-CONTRACT.md` — focused Automation builder ↔ backend contract.
13. `docs/checkin-product-design-CURRENT.md` — current human-interface/mobile design rules.
14. `docs/checkin-communications-ai-CURRENT.md` — current Email + AI Task frontend contract.
15. `docs/checkin-future-capabilities-CURRENT.md` — future Connections/Tool/financial/MCP/voice capability UX direction.
16. `docs/checkin-library-premium-CURRENT.md` — current focused Library UX contract.
17. `CMXChat/jay-app/specs/003-server-checkin/HANDOFF.md` — backend release/deployment continuity.

Do not reconstruct architecture from chat memory when these files exist.

# 2. Production backend truth

Phase 1 backend is fully live and production verified.

Exact reviewed Render application release:

`de55627926316581808337f8e9c10d26e7d64588`

Production Alembic revision:

`c41f9b8d2e70`

Recorded Aiven recovery checkpoint before migration:

`2026-08-17 17:04:13 UTC`

Current switch policy is **not weekly**.

```text
successful protected check in
→ authoritative server timestamp
→ 72 elapsed hours
→ deadline
→ 24 elapsed hour grace
→ triggered state
```

UTC/PostgreSQL/server time is authoritative.

Phase 1 backend supports immutable policy versions, configurable interval/grace, policy/window pointers, pause/resume, one-time deadline override, reconciliation, immutable Incident snapshots/lifecycle, atomic Audit, DB constraints, protected private session, CSRF/Origin checks, protected records/content areas, and sanitized public status.

Phase 1 still performs **no external Action execution**.

A triggered switch does not mean email/SMS/Discord/webhook/document/AI delivery happened.

Do not mutate production merely to test UI acceptance.

# 3. Production frontend acceptance — current truth

The original Samsung problems were repaired and most acceptance evidence is complete.

Real Samsung/Chrome evidence already proved:

- public `SAFE / LIVE` status and server-authoritative countdown;
- Last Check In / Next Due rendering;
- mobile Settings gear visible/reachable;
- locked mobile Settings exposes public timing only;
- authenticated protected GET-only policy load shows the current 72+24 policy/window;
- private session strip after unlock;
- manual Lock Now clears private UI/state while truthful public status remains;
- no persistent Samsung freeze after the broad-MutationObserver failure was removed.

The nightly source audit also hardened:

- configurable Due Soon classification to match backend `min(12h, 20% of interval)` semantics;
- protected-session expiry with a dedicated timeout plus focus/visibility rechecks;
- configurable grace progress/simulation presentation;
- matched cache-busting for the changed production runtime/contract scripts.

See `docs/checkin-nightly-audit-2026-08-17.md`.

## Exactly two acceptance gaps remain

Do not silently mark the frontend gate complete until these are directly proven:

1. **Desktop locked Settings visual/privacy audit.**
2. **Natural protected-session expiry** after the normal short session clears private UI/state and returns to truthful public state.

T037/T039 remain partially open in `tasks.md` for those observations only.

# 4. Focused Lab truth

Focused route:

`https://db.cmxchat.com/lab/automations/`

This is the active Check In Automation product-design sandbox.

`/lab/` remains the broader experiment umbrella. Do not scatter the Automation product across unrelated Lab routes.

The focused route keeps:

```text
connect-src 'self'
```

It does not call the production API and localStorage is prototype state, not production persistence/authority/delivery history.

Accepted UX later moves into the protected `/checkin/` application as matching backend services become real.

## Automation builder

Human-facing flow is approximately:

```text
Basics
Trigger
Rules
Actions
Timing
Finish
Review
```

Backend mental model remains:

```text
WHEN
IF
DO
WAIT / REPEAT
THEN
```

Individual DO steps are typed Actions.

## Directory / Audience

Lab distinguishes:

```text
Person ↔ Organization
Labels
Groups / saved Audiences
```

Audience selectors resolve to unique People and preview channel readiness. Production resolution remains server-authoritative and future Runs freeze exact recipient snapshots before side effects.

## Private Content / Library

Check In owns authored content. Provider drafts are not source of truth.

Current prototypes include:

- action-scoped private content;
- Rich Documents;
- Markdown/Text;
- Templates;
- logical Library folders;
- exact-version direction;
- metadata-only binary FileAssets;
- search/Recent/Favorites/list-grid/sort;
- obvious immediate-parent Back/Up;
- rich editor with larger mobile controls + transient learning labels.

Storage direction:

```text
native Rich/Markdown/Text/Templates
→ PostgreSQL canonical content + immutable versions

binary PDF/image/video/DOCX/XLSX/etc.
→ private object storage bytes
→ PostgreSQL FileAsset/FileVersion metadata + references
```

# 5. Email Action — current Lab contract

Email is now the first deeply-modeled communication Action.

The frontend presents a complete composer around existing protected subsystems:

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

Important boundaries:

- production From address comes from protected `Connection + SenderIdentity`, never freeform provider credentials;
- To/CC/BCC each use separate Directory/Audience selector sets;
- Subject + rich body remain private Check In Content;
- plain-text alternative is derived deterministically from the approved content version;
- attachments use exact private FileVersions;
- provider drafts are never canonical;
- future Runtime resolves/dedupes/freezes exact recipients before provider delivery;
- definition/preview in Lab sends nothing.

Frontend files:

- `assets/lab/lab-automations-communications-ai-runtime.js`
- `assets/lab/lab-automations-communications-ai-fix.js`
- `assets/lab/lab-automations-communications-ai.css`
- `docs/checkin-communications-ai-CURRENT.md`

Backend contract:

`CMXChat/jay-app/specs/003-server-checkin/COMMUNICATION-ACTIONS-BACKEND-CONTRACT.md`

# 6. AI Task + delegated contingency authority

AI Task is intentionally **not** one giant prompt box.

The Lab separates:

```text
Objective
Instructions
Context AI may read
Tools AI may use
Autonomy/approval mode
Hard limits
```

Current UX modes:

1. Draft only;
2. Approval required;
3. Pre-authorized contingency.

The third mode exists for the real continuity use case where the owner may be unavailable at exactly the moment action is needed.

The authority model is:

```text
owner is present
→ deliberately publishes immutable standing AuthorityGrant version

later qualifying Incident occurs
→ backend verifies exact deterministic activation condition
→ activates only that grant version
→ Runtime/AI receives only approved tools/resources/audiences/connections/limits
→ no fresh owner click is required for the explicitly pre-authorized action class
```

AI cannot activate, widen, renew, republish or delegate its own authority.

Prompt text never grants authority.

Normal approvals and contingency delegation can coexist.

Critical continuity should prefer deterministic pre-approved typed Actions first, then use bounded AI for interpretation/coordination/follow-up so an AI-provider outage does not automatically block basic continuity behavior.

Backend contract:

`CMXChat/jay-app/specs/003-server-checkin/DELEGATED-AUTHORITY-BACKEND-CONTRACT.md`

# 7. Adaptable future capability model

Check In is deliberately **not** being architected with a universal rule that AI can never perform a whole class of consequential operation forever.

The long-term model is a typed Capability/Tool Registry plus Connection Catalog.

Each capability may conceptually be governed as:

```text
disabled
read_only
approval_required
standing_grant_allowed
human_only
```

This lets capabilities mature safely as Runtime, providers, product policy and external constraints mature.

Examples of future families include:

```text
COMMUNICATION
Email
SMS / MMS
WhatsApp Business
Discord
Slack / Teams / Telegram
Push
Voice calls

WORK / PRODUCTIVITY
Calendar
Drive/storage
GitHub
ClickUp/Asana/Jira/etc.
CRM / support / documents

OPERATIONS
Monitoring
DNS / hosting / cloud typed operations
approved API actions

FINANCE
bank/credit/brokerage read + analysis
transaction/order drafts
explicitly supported transfers/payments/trades
```

High-consequence capabilities are not automatically autonomous.

A tool such as `bank.transfer` or `brokerage.place_order` may begin disabled or approval-required. If a future provider/product policy explicitly supports it, the architecture can represent a narrowly bounded standing AuthorityGrant instead of requiring a redesign.

Possible constraints include approved accounts/payees/instruments, maximum transaction/aggregate value, order type, time window, transaction count and explicit prohibitions on new payees/withdrawal destinations/security changes.

AI never gets to invent those permissions.

Canonical backend roadmap:

`CMXChat/jay-app/specs/003-server-checkin/CAPABILITIES-CONNECTIONS-AI-ROADMAP.md`

Frontend/product companion:

`docs/checkin-future-capabilities-CURRENT.md`

# 8. Network coordination / acting through people

A future Agent may also achieve approved objectives by coordinating people in the owner’s network.

Examples:

```text
request action from approved contact
follow up
schedule meeting
request confirmation
record completion
```

Person-mediated action is **not a loophole** around direct-tool policy.

If a transaction/outcome is forbidden, AI may not bypass that restriction by asking someone else to perform it.

A valid AuthorityGrant may explicitly authorize a bounded person-mediated outcome, such as asking an approved accountant to pay one named invoice within exact limits.

This uses the same:

- Audience;
- Conversation;
- AuthorityGrant;
- Runtime;
- limits;
- Audit.

# 9. MCP, APIs and AI-provider portability

MCP is planned in both directions.

```text
External AI
→ Check In MCP server
→ typed Check In tools
→ normal domain services/policy/Audit
```

and later:

```text
Check In Agent
→ approved external MCP Connection
→ discovered tool reviewed/mapped into Tool Registry
→ risk/availability policy
→ explicit grant
```

An external MCP server advertising a tool does not automatically authorize AI to use it.

Check In should also use typed provider/API adapters and avoid a default architecture of arbitrary URL + secret + arbitrary JSON.

Long-term AI provider direction is a Check In AI Gateway so model/provider choice can evolve without rebuilding Automations.

Model policy may consider reasoning/vision/audio capability, privacy, latency, cost, availability and reliability.

Model intelligence and tool authority remain separate.

# 10. Other contact/action methods

Do **not** build a separate architecture for every provider.

Email and AI Task establish the reusable Action framework.

Later typed methods reuse the same domains where appropriate:

- Audience;
- ContentVersion;
- FileVersion;
- Connection;
- Runtime snapshot;
- idempotency/retry/Audit;
- Authority/approval.

Channel-specific semantics remain typed. For example CC/BCC is Email-specific and should not be forced onto SMS/Discord.

# 11. Bird’s-eye platform direction

Check In is a private information, automation, runtime, and bounded-delegation control plane.

Six domains:

```text
Directory   = who
Library     = what information/content
Automation  = what should happen
Runtime     = what actually happened
Connections = how external capability is reached
AI          = bounded intelligence using the same typed services
```

The Switch is one Trigger source inside that architecture.

# 12. Stable-ID/service rule

Names, filenames and paths are presentation, not identity.

Use stable protected IDs for People, Organizations, Groups, Folders, Content/Versions, Files/Versions, Automations/Versions, Connections/SenderIdentities, AuthorityGrants/Versions and later Runs/GrantActivations.

The human UI, AI tools and optional MCP adapters use the **same typed domain services**.

Conceptually:

```text
Human browser ─┐
AI tool ───────┼→ protected API/tool adapter → domain service → auth/policy → persistence → Audit
MCP client ────┘
```

Do not create machine-only god-mode database/provider endpoints.

# 13. Backend plan from here

Do not begin provider/scheduler/AI execution while the Phase 1 acceptance gate remains open.

## Immediate gate

Finish:

- desktop locked Settings;
- natural session expiry.

## First real Phase 2A milestone

```text
Create continuity.md
→ ContentAsset + mutable ContentDraft in PostgreSQL
→ refresh / another authenticated session reads same Draft
→ protected update with stale-write protection
→ Save Version creates immutable ContentVersion v1
→ create/move into real LibraryFolder
→ parent/breadcrumb metadata supports obvious Back/Up
→ protected PostgreSQL search finds it
→ Details returns exact version ID + dependency count
→ typed domain service reusable by human UI and later AI/MCP adapter
→ Automation Draft references it
→ no provider side effect
```

Then complete T041–T049 typed Automation definitions, including definition-time Email envelope references and AI Task/AuthorityGrant schema semantics where needed.

Authority activation, provider send and AI execution remain later Runtime phases.

Do not divert Phase 2A into building the entire future capability catalog.

# 14. Design/security rules

Preserve:

- mobile-first 44px+ touch targets;
- obvious Back/Up;
- progressive disclosure;
- truthful `backend pending` / `execution off` language;
- no broad document MutationObserver;
- sanitized public state;
- Secure HttpOnly private sessions + CSRF/exact Origin;
- no private auth/provider secrets in browser storage/content/Audit/prompts;
- no arbitrary Python/JS/shell/SQL/eval;
- no unrestricted arbitrary webhooks;
- immutable published/versioned history;
- idempotency for external side effects;
- server-enforced approval/authority;
- prompt text never expands authority.

# 15. Security cleanup still owed

An SMTP credential was exposed earlier in diagnostic output. Never reproduce it in chat, docs, commits, prompts, or logs.

Before overall project closeout, rotate the affected SMTP credential if it has not already been rotated.
