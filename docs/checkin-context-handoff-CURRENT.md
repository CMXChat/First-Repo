# Check In / Continuum Context Handoff — CURRENT

Date: 2026-08-18
Status: Current cross-repository continuation guide; Phase 1 complete, Phase 2A source validated, production Phase 2A migration pending

This is the first file a new ChatGPT/Codex/developer context should read before changing Continuum or Check In.

## Product names

- **Continuum** = umbrella product.
- **Check In** = current protected application/backend program name in routes, code and existing specs.
- **Spaces** = briefing/context experience.
- **Afterlife: The Dead Man Switch** = continuity experience built on the shared timing, information, people, Automation, Connections, authority and future Runtime architecture.

Core domains:

```text
Directory    = who
Library      = protected information/content
Automation   = what should happen
Runtime      = what actually happened
Connections  = approved external capability
AI           = bounded intelligence using the same typed services
```

Core principle:

> Build the control plane. Rent the capabilities.

## Read first

1. `docs/checkin-context-handoff-CURRENT.md` — this file.
2. `docs/continuum-product-CURRENT.md` — umbrella product naming, `/doc/` role and visual/editorial rules.
3. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md` — canonical backend read map.
4. `CMXChat/jay-app/specs/003-server-checkin/HANDOFF.md` — current backend/release truth.
5. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-VALIDATION-RESULT-2026-08-18.md` — executable validation evidence.
6. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-PRODUCTION-DEPLOYMENT-RUNBOOK.md` — prepared production migration procedure, not yet executed.
7. `CMXChat/jay-app/specs/003-server-checkin/tasks.md` — broad Phase 2A+ roadmap gates.
8. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-CONTINUATION-PLAN.md` — approved definition/backend continuation decisions; where an older validation-pending paragraph conflicts, the newer HANDOFF + validation record win.
9. `docs/checkin-automations-frontend-CURRENT.md` — focused Automations v3 UX contract.
10. `docs/checkin-communications-ai-CURRENT.md` — Email + AI Task product contract.
11. `docs/checkin-directory-library-CURRENT.md` and `docs/checkin-library-premium-CURRENT.md` — Directory/Library frontend contracts.

Do not reconstruct current state from old chats when these files exist.

# Production truth

Production is still the reviewed Phase 1 backend.

```text
Reviewed Render application release
= de55627926316581808337f8e9c10d26e7d64588

Production Alembic revision
= c41f9b8d2e70

Recorded Phase 1 Aiven recovery checkpoint
= 2026-08-17 17:04:13 UTC
```

Current timing:

```text
successful protected check in
→ authoritative server timestamp
→ 72 elapsed hours
→ grace begins
→ 24 elapsed hours
→ triggered if grace expires
```

UTC/PostgreSQL/server time is authoritative. The 72 + 24 values are the current operating configuration, not a permanent product limit.

Production Phase 1 supports immutable policy versions, current/window policy pointers, configurable timing, pause/resume, one-time deadline override, reconciliation, immutable Incident snapshots/lifecycle, atomic Audit, DB integrity, protected short sessions, CSRF/exact Origin and sanitized public state.

Production performs no external provider/Action execution. A triggered Incident does not mean an email, SMS, Discord message, file release or AI action happened.

Do not mutate production merely to test presentation.

# Phase 1 acceptance — complete

T034 through T040 are complete.

Direct browser/device evidence covers:

- Samsung public live status/countdown;
- mobile and desktop locked Settings privacy/presentation;
- authenticated read-only protected policy representation;
- manual Lock Now cleanup;
- natural private-session expiry while the page was left alone;
- public status/countdown remaining truthful after private access expires;
- private Settings DOM-value scrubbing on lock/expiry;
- corrected Settings dialog width/overflow;
- no broad document MutationObserver.

Do not reopen Phase 1 acceptance unless a real production defect appears.

# Phase 2A repository truth — validated

`jay-app/main` now contains a validated first private-information + typed Automation source slice.

Library migration:

`f2a0c1d2e3b4`

Automation migration:

`a31c7d8e9f20`

Migration chain:

```text
c41f9b8d2e70
→ f2a0c1d2e3b4
→ a31c7d8e9f20
```

These Phase 2A revisions are **not deployed to production yet**.

## Real Library/content source

```text
LibraryFolder
ContentAsset
→ mutable ContentDraft
→ immutable ContentVersion
```

Validated source includes:

- logical folders + breadcrumbs;
- stable content IDs;
- protected create/read/list/search operations;
- stale-write-safe Draft edits;
- immutable saved versions;
- Markdown/text canonical source in PostgreSQL for the first slice;
- action-scoped content exclusion from the normal Library projection;
- stable dependency / `Used by` counts;
- generated typed frontend client.

Binary files remain a separate future `FileAsset → FileVersion → private object storage` boundary.

## Real first Automation source

```text
Automation
→ mutable AutomationDraft
→ REVIEW
→ immutable AutomationVersion
```

Validated first definition subset includes:

- Trigger: `manual`, `checkin_grace_start`, `checkin_grace_expiry`;
- Action: definition-only `manual_review`;
- sequence-start policy: `immediate`;
- Finish: simple finish boundary;
- progressive Draft fields that may genuinely remain unset;
- DRAFT → REVIEW → PUBLISHED → ARCHIVED lifecycle;
- protected list/create/read/draft-update/review/publish/archive API;
- strict schemas rejecting unknown definition fields;
- Draft content reference by stable ContentAsset ID;
- Publish freezes exact immutable ContentVersion ID;
- stale content blocks publication;
- concurrent content rows are locked while the publish snapshot is frozen;
- published AutomationVersion has DB immutability protection;
- later mutable Content edits cannot rewrite published Automation history;
- no provider, Runtime, scheduler or AI execution.

Concrete first proof:

```text
continuity.md
→ ContentAsset + mutable Draft
→ protected persistence/read
→ stale-write protection
→ immutable ContentVersion v1
→ LibraryFolder
→ search + breadcrumbs
→ exact version/dependency Details
→ Automation Draft reference
→ Review
→ Publish freezes exact ContentVersion
→ later Draft edits do not change published AutomationVersion
→ no external side effect
```

# Validation evidence

Validation PR:

`CMXChat/jay-app #14`

Clean validated head:

`3f88bb62bb350f75d854140685886149dc1c01d5`

All clean-head workflow gates passed:

```text
Test Backend  32184728853  success
pre-commit    32184728874  success
Playwright    32184728846  success
```

That includes isolated PostgreSQL migration/tests, the backend coverage gate, Ruff, formatting, mypy, `ty`, generated frontend SDK consistency and all four Playwright shards.

Detailed evidence lives in:

`CMXChat/jay-app/specs/003-server-checkin/PHASE2A-VALIDATION-RESULT-2026-08-18.md`

# Important frontend availability rule

**Do not wire production `/checkin/` to these new Library/Automation endpoints yet.**

The source is validated in the repository, but production remains at Phase 1 schema `c41f9b8d2e70` and the reviewed Phase 1 backend release.

Until the Phase 2A production migration + backend release is explicitly completed and verified:

- Lab stays prototype/local-only;
- `/checkin/` must not assume the new tables/routes are live;
- do not remove truthful `backend pending` / `execution off` boundaries based only on source existing in GitHub;
- no provider delivery or Runtime should be implied.

After the backend migration is accepted, Phase 2B can migrate accepted UX into protected `/checkin/` against the real typed API.

# Focused Automation Lab

Active route:

`https://db.cmxchat.com/lab/automations/`

Lab is a design proving ground, not a permanent second production application.

Current human model:

```text
WHEN  Trigger
IF    Rules
DO    Actions
WAIT  Timing
TEST  Review
```

Name/description are metadata. Finish behavior lives inside Review.

A brand-new Automation must remain progressive. It cannot visually claim that Trigger, Rules, Actions, Timing or Finish are configured before the user actually chooses or intentionally accepts them.

The preview grows from real state:

```text
WHEN   Choose a trigger
IF     Not set yet
DO     Choose an action
WAIT   Not set yet
FINISH Not set yet
```

Saved/configured drafts show their actual configured flow.

Accepted Lab behavior later migrates into protected `/checkin/`; the Lab loader/localStorage/DOM-adapter implementation does not.

# Mobile / Samsung rules

Preserve:

- one primary decision area at a time;
- readable type without zooming;
- 44px+ touch targets where practical;
- vertical stacking over cramped desktop grids;
- horizontal stage rail when needed;
- one-column Action cards;
- bottom-sheet mobile pickers/modals;
- collapsible mobile flow preview;
- document-level scrolling without nested editor scroll traps;
- no horizontal page overflow;
- rich black dark mode plus usable light mode;
- no broad document-wide/subtree/characterData MutationObserver loops.

# Directory, Library, communication and AI direction

Directory/Audience:

```text
Person ↔ Organization
Labels
Groups / saved Audiences
```

Automations eventually target stable protected identities/selectors. Do not copy ordinary email/phone strings into reusable definitions as canonical identity.

Email model remains:

```text
From
To / CC / BCC
Reply-To
Subject
Rich body
Attachments
Preview
```

Future production From uses `Connection + SenderIdentity`; recipients use Directory/Audience; content uses exact protected versions; attachments use exact FileVersions.

AI Task model remains:

```text
Objective
Instructions
Context
Tools
Autonomy
Limits
```

Prompt text is intent, never authority. AI cannot create, widen, activate, renew or publish its own permission.

User-facing Standing Permission maps to bounded backend AuthorityGrant/AuthorityGrantVersion semantics, not a second authority model.

Critical Afterlife continuity should use deterministic pre-approved actions for essential first steps. Bounded AI can later interpret, coordinate and follow up within explicit authority.

# Continuum input / Spaces direction

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

Future inputs can arrive through provider APIs, verified webhooks, polling/sync, MCP resources/tools, files, humans and Conversations.

Keep provenance, source IDs, observed/updated time, freshness, coverage, permissions and sync health attached. A stale or partial observation cannot be presented as complete current truth.

Spaces builds protected briefings from this durable state.

# `/doc/`

`https://db.cmxchat.com/doc/` is the public noindex visual master explanation of Continuum.

The current design/editorial version is frozen. Only factual capability/status updates, accessibility/browser fixes and real defects should change it.

# Build method

```text
Lab UX
→ backend contract
→ PostgreSQL/domain service
→ protected FastAPI operation
→ accepted UI migrated into /checkin/
→ durable Runtime
→ one real provider
→ deeper workflow power
→ AI later
```

# Immediate order

Phase 1 acceptance is closed and the first Phase 2A source slice is validated.

Immediate backend/release work is now:

1. review `f2a0c1d2e3b4` + `a31c7d8e9f20` as production migrations;
2. use `PHASE2A-PRODUCTION-DEPLOYMENT-RUNBOOK.md` as the controlled procedure;
3. verify Render deploy hold/Auto-Deploy state before any schema mutation because service startup runs Alembic prestart;
4. create and verify a fresh Aiven provider-native recovery checkpoint;
5. confirm production is still exactly at `c41f9b8d2e70`;
6. deliberately migrate/deploy Phase 2A only after those preconditions pass;
7. verify Phase 1 status remains unchanged and protected new Library/Automation read boundaries work;
8. only after migration acceptance consider the first real production `continuity.md` write proof;
9. continue remaining broad T041–T049 definition work in bounded increments;
10. Directory/Audience stable references before real communication definitions;
11. Phase 2B protected builder after the definition gate;
12. durable Runtime with fake provider before any real provider;
13. one real low-risk provider after idempotency/recovery/Audit;
14. AI Task, Planner, Agent and MCP later.

Broad T041–T049 task IDs remain open where their full acceptance criteria extend beyond the validated first slice. Do not mark the whole Phase 2A exit gate complete yet.

# Security / reliability

Preserve:

- Secure HttpOnly protected sessions + CSRF/exact Origin;
- server-authoritative timing/state;
- stable protected IDs;
- immutable published/version history;
- no provider secrets in browser storage/content/prompts/Audit;
- no arbitrary Python/JavaScript/shell/SQL/eval;
- no unrestricted arbitrary webhook execution;
- idempotency before external side effects;
- server-enforced approvals/authority;
- prompt text never expands authority;
- truthful capability/status language.

An SMTP credential was exposed earlier in diagnostic output. Never reproduce it. Before overall project closeout, rotate it if that has not already been completed.
