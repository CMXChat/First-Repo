# Check In Context Handoff — CURRENT

Date: 2026-08-17
Status: Current cross-repository continuation guide

This is the first file a new ChatGPT/Codex context should read for Check In.

It records current production truth, the remaining acceptance gate, the focused Lab state, and the approved platform/backend direction. Longer historical detail remains in `docs/checkin-context-handoff-2026-08-17.md`.

# 1. Source-of-truth order

Read in this order before substantial work:

1. **This file** — current cross-repo state and immediate continuation.
2. `CMXChat/jay-app/specs/003-server-checkin/tasks.md` — executable checklist and open gates.
3. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-READ-FIRST.md` — required product-model gate before backend Phase 2A.
4. `CMXChat/jay-app/specs/003-server-checkin/CHECKIN-PLATFORM-ARCHITECTURE.md` — bird’s-eye platform/domain architecture.
5. `CMXChat/jay-app/specs/003-server-checkin/AI-CAPABILITY-AND-TOOLS-CONTRACT.md` — future AI/tool/capability boundary.
6. `CMXChat/jay-app/specs/003-server-checkin/CHECKIN-MASTER-PLAN.md` — durable production/automation roadmap.
7. `CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-NEXT.md` — production frontend/backend integration detail.
8. `CMXChat/jay-app/specs/003-server-checkin/AUTOMATION-FRONTEND-CONTRACT.md` — focused Automation builder ↔ backend contract.
9. `docs/checkin-product-design-CURRENT.md` — current human-interface/mobile design rules.
10. `docs/checkin-library-premium-CURRENT.md` — current focused Library UX contract.
11. `CMXChat/jay-app/specs/003-server-checkin/HANDOFF.md` — backend release/deployment journal.

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

Do not mutate production merely to test UI acceptance. In particular, do not change policy timing, pause/resume, override a deadline, reconcile, or record a check in without a separate justified reason.

# 3. Production frontend acceptance — current truth

The original Samsung problems were real and were repaired:

- public page had shown `SYNC REQUIRED / Status unavailable` because timer compatibility was coupled to ancillary aggregate counts;
- the intended mobile Settings gear was hidden by mobile CSS.

Key fixes included:

- `2faa3d3f715b93667fe5ed913f91b0a62d34f989` — timer/status contract decoupled from aggregate counts;
- `ac091472dc67edb299d1826a9d89c5377adfc718` — mobile Settings entry point restored;
- `33760c63feca77f54dc7371054eba08354635f85` — mobile/header compatibility cleanup;
- dedicated targeted regression/production validation coverage was added afterward.

## Real-device evidence already proven

Real Samsung/Chrome screenshots established:

- public `SAFE / LIVE` status;
- real server-authoritative countdown;
- Last Check In / Next Due rendering;
- mobile Settings gear visible/reachable;
- locked mobile Settings showing public `72 hours rolling · 24 hours grace` and deadline without private mutation controls;
- authenticated protected **GET-only** policy load showing version 1, UTC, interval 72, grace 24 and current window/deadline;
- private session strip after unlock;
- one `Lock Now` control;
- manual Lock Now removes the private session strip, detailed private Activity/Audit, and private Settings controls while preserving truthful public status;
- no persistent Samsung freeze after the earlier broad-MutationObserver failure was removed.

## Exactly two acceptance gaps remain

Do not silently mark the frontend gate complete until these are directly proven:

1. **Desktop locked Settings visual/privacy audit.**
2. **Natural protected-session expiry** after the normal short session clears private UI/state and returns to truthful public state.

`tasks.md` now reflects this accurately: T034/T035/T036/T038/T040 are complete; T037 is mobile-complete but desktop-pending; T039 is manual-lock-complete but natural-expiry-pending.

# 4. Focused Lab truth

Focused route:

`https://db.cmxchat.com/lab/automations/`

This is an isolated product prototype. Its CSP keeps `connect-src 'self'`; it does not call the production API.

The Lab is deliberately useful for testing product semantics before backend models are locked, but localStorage state is not production persistence.

## Automation builder prototype

Current human-facing flow is approximately:

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

Important prototype decisions already locked into backend handoffs include:

- grace explanation in trigger UX;
- Action start timing: immediately / delay / not-before exact local date+time;
- exact action time never bypasses the Trigger;
- WAIT between individual Actions remains separate from Action start timing;
- Repeat is separate from Retry;
- recurring minutes/hours are elapsed cadence;
- recurring days/weeks/months/years are calendar-aware with IANA timezone;
- daily/weekly presets are calendar-aware;
- monthly/yearly edge cases are explicitly backend-owned;
- Finish defaults to simple `Finish here`, with advanced routing progressively disclosed.

## Directory / Audience prototype

Lab distinguishes:

```text
Person ↔ Organization
Labels
Groups / saved Audiences
```

A Person can belong to multiple Organizations.

Labels describe People and may be suggested/custom.

Groups collect People/Organizations/Labels.

Automation Actions target typed Audience selectors and preview deduplicated unique People/channel readiness. Production resolution remains server-authoritative and future Runs freeze the exact resolved recipient snapshot before side effects.

## Private content/editor prototype

Check In owns authored message/email/document content. Gmail/Discord/provider drafts are not the source of truth.

Rich editor supports Docs-style native content, safe links, formatting, autosave, versions, Preview, mobile wrapped toolbar, larger touch targets, and transient learning labels such as `Bold`, `Heading 2`, `Bulleted list`, and `Insert link`.

Action content is action-scoped by default. The user may explicitly:

- Save to Library;
- Save as Template;
- Save as Document.

## Library prototype

Library now prototypes:

- logical folders;
- obvious immediate-parent Back/Up behavior;
- breadcrumbs;
- native Rich Documents;
- native Markdown `.md`;
- native Text `.txt`;
- Email/Message/Document Templates;
- metadata-only binary FileAssets;
- exact-version attachment pinning;
- safe viewer shells;
- versions / Details / Used by direction;
- Recent;
- Favorites;
- search;
- list/grid;
- sort;
- mobile Filter sheet;
- compact `•••` actions;
- archive/restore;
- duplicate/rename/move where appropriate.

Important storage direction:

```text
native Rich/Markdown/Text/Templates
→ PostgreSQL canonical content + immutable versions

binary PDF/image/video/DOCX/XLSX/etc.
→ private object storage bytes
→ PostgreSQL FileAsset/FileVersion metadata + references
```

Native Markdown is intentionally DB-native so humans and later authorized AI can search/read/version it directly.

# 5. Bird’s-eye platform direction

Check In is no longer being designed as only “a dead-man switch that sends messages.”

The approved product architecture is:

> **A private information, automation, runtime, and bounded-delegation control plane.**

Six domains:

```text
Directory   = who
Library     = what information/content
Automation  = what should happen
Runtime     = what actually happened
Connections = how external capability is reached
AI          = bounded intelligence using the same typed services
```

Read `CHECKIN-PLATFORM-ARCHITECTURE.md` for the detailed contract.

The Switch is one future Trigger source inside that architecture.

# 6. Stable-ID/service rule

Names, filenames, labels, and folder paths are presentation. They are not identity.

Use stable protected IDs for People, Organizations, Groups, Folders, Content, ContentVersions, Files, FileVersions, Automations, AutomationVersions, Runs and Connections.

Renames/moves must not break references.

The human UI and future AI tools must use the **same typed domain services**.

Conceptually:

```text
Human browser ─┐
               ├→ protected API/domain service → auth → validation → persistence → audit
AI tool call ──┘
```

Do not create AI-only god-mode database endpoints.

# 7. AI direction

AI is deliberately planned, but not implemented as runtime authority yet.

Future levels:

1. interactive Assistant;
2. natural-language Planner producing typed drafts;
3. bounded AI Task inside durable Runs;
4. bounded Agent later.

AI receives explicit stable IDs/versions and server-enforced capabilities, not raw DB credentials, unrestricted SQL, provider secrets, storage keys, or prompt-granted authority.

Future tool operations should be narrow wrappers over normal domain services, for example Library create/update/search/version, Directory resolve-audience, and Automation create/update/validate draft.

Read `AI-CAPABILITY-AND-TOOLS-CONTRACT.md` before implementing any AI tool/runtime.

# 8. Backend plan from here

Do not begin provider/scheduler/AI runtime work yet.

## Immediate production gate

Finish the two remaining real-device acceptance items:

- desktop locked Settings;
- natural session expiry.

## First real Phase 2A milestone — private information layer

After that, the preferred backend vertical slice is:

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
→ typed domain service is reusable by human UI and later AI tool adapter
→ Automation Draft references it
→ no provider side effect
```

This establishes the real private information layer that Automations and AI will consume.

## Then complete Engine Phase 2A Automation definitions

T041–T049 only:

- Automation / immutable AutomationVersion;
- typed Triggers;
- typed Actions;
- stable Audience/Content/File references;
- only needed Conditions/Routes;
- DRAFT → REVIEW → PUBLISHED → ARCHIVED;
- protected CRUD/publish;
- schema/auth/cross-scope tests.

## Then

```text
Phase 2B → real human builder over backend drafts
Phase 3  → durable Run/Occurrence/Attempt + fake provider
Phase 4  → one real low-risk provider
Phase 5  → routes/retries/acks/approvals/waits/more providers
Phase 6  → AI Task + Planner
Phase 7  → bounded Agent
```

# 9. Design rules that should survive implementation

Read `docs/checkin-product-design-CURRENT.md` before major UX changes.

Key rules:

- mobile-first, normal 44px+ touch targets;
- breadcrumbs supplement, not replace, obvious Back/Up;
- progressive disclosure over developer density;
- one obvious primary action per context;
- secondary actions in sheets/menus;
- no tiny desktop controls on phones;
- rich editor controls wrap and teach their names briefly;
- truthful `backend pending` language in Lab;
- do not call configured Actions delivered/armed/executed before the server runtime exists;
- no broad document MutationObserver due the proven Samsung freeze.

Final protected navigation is **not frozen yet**. Library may deserve first-class protected navigation once the real Library/Directory domains exist and can be evaluated as one integrated product.

# 10. Security rules

Preserve and extend:

- sanitized public status;
- Secure HttpOnly private session;
- CSRF + exact mutation Origin;
- server-side scope checks;
- no private auth/session secrets in local/session storage;
- no raw provider secrets in Action JSON, content, Records, Audit, browser storage, or AI prompts;
- no arbitrary Python/JS/shell/SQL/eval;
- no unrestricted arbitrary webhooks;
- no permanent public object URLs;
- immutable published/versioned history;
- idempotency for side effects;
- stronger approval for consequential operations;
- prompt text never grants authority.

# 11. Learning/working rule

The user is learning backend development while building this.

When teaching, use short beginner explanations tied to the real project.

For implementation, preserve a clear next step and do not burn Codex/Codespaces credits when normal GitHub tooling can safely inspect/change the repos.

# 12. Security cleanup still owed

An SMTP credential was exposed earlier in diagnostic output. Never reproduce it in chat, docs, commits, prompts, or logs.

Before final project closeout, remind the user to rotate the active SMTP credential if it has not already been rotated.
