# Check In / Continuum Context Handoff — CURRENT

Date: 2026-08-18
Status: Current cross-repository continuation guide; Phase 1 production, Phase 2A source validated, production Phase 2A migration pending, Automations Lab v4 active

This is the first file a new ChatGPT/Codex/developer context should read before changing Continuum or Check In.

## Product names

- **Continuum** = umbrella product.
- **Check In** = current protected application/backend program name in routes, code and existing specs.
- **Spaces** = briefing/context experience.
- **Directory** = people and organizations.
- **Library** = protected content, files and saved knowledge.
- **Automations** = typed definitions for what should happen.
- **Connections** = approved external capability paths.
- **Runtime** = future server execution layer that records what actually happened.
- **AI** = bounded intelligence using the same typed domain services as human UI.
- **Afterlife: The Dead Man Switch** = continuity experience built on the same timing, people, information, Automation, Connections, authority and future Runtime foundation.

Core principle:

> Build the control plane. Rent the capabilities.

## Read first

1. `docs/checkin-context-handoff-CURRENT.md` — this file.
2. `docs/continuum-product-CURRENT.md` — umbrella product naming and `/doc/` contract.
3. `docs/continuum-automations-master-plan-CURRENT.md` — current Automation product/UX/capability direction.
4. `docs/checkin-automations-frontend-CURRENT.md` — exact focused Automations v4 frontend truth.
5. `docs/checkin-automations-system-surface-CURRENT.md` — current focused operating-surface contract.
6. `docs/checkin-lab-automations-integration-CURRENT.md` — `/lab/` ↔ `/lab/automations/` integration.
7. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md` — canonical backend read map.
8. `CMXChat/jay-app/specs/003-server-checkin/HANDOFF.md` — current backend/release truth.
9. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-VALIDATION-RESULT-2026-08-18.md` — Phase 2A validation evidence.
10. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-PRODUCTION-DEPLOYMENT-RUNBOOK.md` — prepared migration procedure, not yet executed.
11. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-CONTINUATION-PLAN.md` — canonical backend continuation after migration.
12. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AUTOMATIONS-PLATFORM-PLAN.md` — backend translation of the v4 extensible Automation direction.
13. `CMXChat/jay-app/specs/003-server-checkin/tasks.md` — broad delivery gates.

Do not reconstruct current state from old chats or stale READMEs when these files exist.

# Production truth

Production is still the reviewed Phase 1 backend.

Reviewed Render application release:

`de55627926316581808337f8e9c10d26e7d64588`

Production Alembic revision:

`c41f9b8d2e70`

Recorded Phase 1 Aiven recovery checkpoint:

`2026-08-17 17:04:13 UTC`

Current operating timer:

`successful protected check in → 72 elapsed hours → grace begins → 24 elapsed hours → triggered if grace expires`

UTC/PostgreSQL/server time is authoritative.

The current 72 + 24 values are configurable operating policy, not a permanent product definition.

Production Phase 1 supports:

- DeadManSwitch state;
- immutable policy versions;
- current/current-window policy pointers;
- configurable interval and grace;
- pause/resume;
- one-time deadline override;
- reconciliation;
- immutable Incident lifecycle/snapshots;
- atomic Audit/integrity safeguards;
- short protected private sessions;
- exact Origin + CSRF protections;
- protected Records/Actions/Activity/policy surfaces;
- sanitized public status.

Production does **not** execute configured provider Actions.

A triggered Incident does not mean an email, SMS, Discord message, file release, webhook or AI action happened.

Do not mutate production merely to test presentation.

# Phase 1 acceptance — complete

T034 through T040 are complete.

Accepted evidence includes:

- Samsung/mobile public live status/countdown;
- locked Settings privacy/presentation;
- authenticated protected policy read behavior;
- manual Lock Now cleanup;
- natural private-session expiry;
- public state staying truthful after private access expires;
- private Settings value scrubbing on lock/expiry;
- corrected mobile dialog sizing/overflow;
- removal of the broad MutationObserver pattern that caused Samsung freezes.

Do not reopen Phase 1 acceptance without a real production defect.

# Phase 2A source truth — validated, not production-deployed

`jay-app/main` contains a validated first private-information + typed Automation source slice.

Migration chain:

`c41f9b8d2e70 → f2a0c1d2e3b4 → a31c7d8e9f20`

Where:

- `f2a0c1d2e3b4` = Library/content foundation;
- `a31c7d8e9f20` = typed Automation definitions.

These revisions are **not applied to production yet**.

## Library/content source

Current first slice:

`LibraryFolder`

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

Validated behavior includes:

- protected Markdown/text ownership in PostgreSQL;
- folder hierarchy/navigation/breadcrumbs;
- stable IDs;
- stale-write protection;
- immutable saved ContentVersions;
- protected list/search/details;
- safe snippets;
- dependency counts;
- content visibility including Library vs action-scoped;
- generated typed frontend client;
- DB-level protection against updating immutable ContentVersion rows.

Binary files remain a separate future boundary:

`FileAsset → immutable FileVersion → private StorageObject`

## Automation source

Current first slice:

`Automation → mutable AutomationDraft → REVIEW → immutable AutomationVersion`

Validated backend subset is intentionally small:

- Trigger: `manual`, `checkin_grace_start`, `checkin_grace_expiry`;
- Action: definition-only `manual_review`;
- start policy: `immediate`;
- Finish: simple finish boundary;
- Conditions disabled until real typed behavior exists;
- Draft fields may genuinely remain unset while authoring;
- lifecycle supports Draft / Review / Published / Archived semantics;
- protected create/list/read/update/review/publish/archive operations;
- strict unknown-field/type rejection;
- content reference by stable ContentAsset ID;
- Publish requires a matching immutable current ContentVersion;
- Publish freezes exact ContentVersion ID;
- later mutable content edits cannot rewrite published AutomationVersion history;
- DB-level immutable AutomationVersion protection;
- no provider, Runtime, scheduler or AI execution.

Concrete accepted proof remains:

`create continuity.md → persistent mutable Draft → stale-write rejection → immutable ContentVersion → folder/search/details → Automation Draft references ContentAsset → Review → Publish freezes exact ContentVersion → later content edits do not rewrite published history → no provider side effect`

# Immediate backend release boundary

Before widening backend definition breadth, follow:

`CMXChat/jay-app/specs/003-server-checkin/PHASE2A-PRODUCTION-DEPLOYMENT-RUNBOOK.md`

The migration/deployment procedure must preserve Phase 1 switch truth and includes the prepared operational hold/freeze/recovery-checkpoint/migration/invariant-verification/deploy/smoke sequence.

The first real production `continuity.md` write proof is a separate post-migration acceptance step. Do not seed private content inside schema migrations.

# Automations Lab v4 — current frontend truth

Focused route:

`https://db.cmxchat.com/lab/automations/`

The route remains Lab-only and keeps:

- `connect-src 'self'`;
- no production API calls;
- no provider execution;
- no authoritative scheduling;
- no real Publish;
- no provider secrets;
- no AI model call from Planner preview.

## Architecture of the current prototype

V3 remains the browser-local Draft/autosave/normalization behavior core.

The progressive-preview layer still protects truthful blank-Draft state.

V4 adds the current product/operating layer:

- Automations / Templates / Runs workspace views;
- search;
- scalable Capability Catalog;
- New Automation chooser for manual creation;
- Build manually / Templates / AI Planner preview entry paths;
- interactive Flow Preview nodes;
- per-stage `TEST THIS STEP` local checks;
- stronger Continuum preflight presentation;
- mobile bottom-sheet/modal capability discovery;
- future Runs preview marked `RUNTIME OFF`;
- eight additional editable scenarios on top of the existing five templates.

Current total starting patterns: **13**.

Current v4 scenario additions:

- Weekly planning review;
- Grace-window heads-up;
- Final continuity review;
- AI note summary;
- Six-hour reminder;
- Daily records check;
- No-ack follow-up;
- AI briefing with review.

The v4 scenario layer creates ordinary shared v3-compatible Drafts. It does not create a new persistence model.

## Current human model

The focused builder remains:

- WHEN — Trigger;
- IF — Rules;
- DO — Actions;
- WAIT — Timing;
- TEST — Review.

Finish stays inside Review.

Name/description are metadata.

## Flow Preview truth

Accepted label: **FLOW PREVIEW**.

Do not call it `LIVE FLOW`.

Blank Draft starts as:

- WHEN — Choose a trigger;
- IF — Not set yet;
- DO — Choose an action;
- WAIT — Not set yet;
- FINISH — Not set yet.

Internal fallback/default values must not be shown as if the user selected them.

V4 flow nodes are now interactive navigation controls into their relevant stage.

## New Automation behavior

A normal manual `New automation` click opens:

- Build manually;
- Start from a scenario;
- AI Planner preview.

The existing cross-route direct-new URL remains special:

`/lab/automations/?new=1&from=lab`

It still opens a blank Draft directly on Trigger. V4 explicitly preserves this regression contract.

## Capability Catalog

The v4 Lab now prototypes a scalable catalog across Trigger, Condition, Action and future workflow-control families.

Current representable Lab options are labeled `LAB NOW`.

Future ideas are labeled `LATER` and remain non-executable.

The catalog can preview concepts such as inbound email/reply, Discord/SMS, Directory/Library updates, acknowledgement, approval, explicit WAIT, branch, reusable subflow and constrained HTTP/API without claiming those backend capabilities exist.

This browser-local catalog is UX scaffolding, not production registry/authority.

Canonical product plan:

`docs/continuum-automations-master-plan-CURRENT.md`

Canonical backend translation:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AUTOMATIONS-PLATFORM-PLAN.md`

# Backend direction after the Phase 2A migration

Do not mirror the whole Lab catalog in one migration.

Widen real typed capability families incrementally.

Current recommended sequence remains:

1. complete deterministic auto-naming + explicit-name override behavior;
2. add definition enabled/disabled semantics only when useful without faking Runtime;
3. add Calendar Trigger only with timezone/DST rules and tests;
4. add real typed Conditions only for implemented behavior;
5. add Directory/Audience stable references;
6. add definition/preflight-only Email with no send;
7. add structured AI Task definition shape with no model execution;
8. expand start-policy timing as required;
9. add approved AuthorityGrant references where needed;
10. add other typed Action families one at a time;
11. keep explicit inter-step WAIT separate and later;
12. add routes/branches/acknowledgements/approvals only with their Runtime prerequisites.

# Capability architecture

Long-term server direction:

- trusted server-owned Capability Registry;
- stable capability identifiers and version semantics;
- safe metadata exposed to the protected builder;
- contextual availability/readiness based on implementation, Connection, scope and authority;
- users/AI compose capability instances and templates;
- users/AI do not invent arbitrary executable types;
- Connections unlock/satisfy typed capability prerequisites;
- AI Planner edits the same typed Draft as human UI;
- AI Task later executes as a bounded Runtime Action;
- published AutomationVersions remain immutable;
- Runtime later freezes exact execution inputs and records exact Runs.

Do not permit arbitrary Python/JavaScript/shell/SQL/eval workflow logic.

# Directory / Audience direction

Person ↔ Organization is many-to-many through membership.

Labels describe. They are not permissions.

Groups are saved audiences and remain distinct from Labels/Organizations.

Definitions store stable Person/Audience selector identity instead of copied mutable contact strings.

Future Runtime default:

`published selector → resolve current authorized membership/contact methods at Run eligibility → readiness/authority checks → freeze exact recipients/contact endpoints into Run history → provider adapter`

Historical Runs stay unchanged when Directory data later changes.

# Library direction

Library is a protected projection, not one giant `LibraryItem` SQL table.

Native content:

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

Binary file direction:

`FileAsset → immutable FileVersion → private StorageObject`

Action-scoped content is excluded from general Library by default.

Favorites/Recent/list-grid/sort/filter are navigation preferences, not workflow/version state.

Folder placement does not grant authorization or AI authority.

Search starts in PostgreSQL.

# Communication direction

Communication definition separates:

- Connection + SenderIdentity;
- protected Audience selectors;
- exact immutable ContentVersion;
- exact FileVersion attachments later;
- Runtime frozen recipient/sender/content/attachment/idempotency snapshots.

Provider adapter performs delivery. It does not decide audience or authority.

Inbound replies become normalized protected Conversation/Event data later.

Inbound content remains untrusted and cannot expand authority.

# AI and authority

AI progression remains:

- Assistant;
- AI Task definition/execution;
- Planner;
- bounded Agent last.

AI gets typed tools over normal domain services.

AI does not receive:

- raw DB credentials;
- arbitrary ORM/SQL access;
- provider secrets;
- unrestricted shell/code execution;
- arbitrary webhook authority;
- blanket Directory/Library access.

Prompt text is intent, not authority.

Standing Permission maps to the existing AuthorityGrant architecture.

AI cannot create, widen, activate, renew or republish its own authority grant.

# Runtime order

Keep the architecture order:

1. Phase 2A — private information + typed definitions;
2. Phase 2B — protected human builder;
3. Phase 3 — durable Runtime + fake provider;
4. Phase 4 — one real low-risk provider;
5. Phase 5 — waits, routes, retries, acknowledgements, approvals, escalation;
6. Phase 6 — AI Task execution, then Planner;
7. Phase 7 — bounded Agent;
8. MCP — adapters over mature typed services, never an authority bypass.

No browser-owned scheduling.

# `/doc/` boundary

`/doc/` explains Continuum and is under a separate clarity freeze.

Do not change `/doc/` simply because the Lab UX changes.

Its capability claims should change only when product/backend truth changes materially.

Current conceptual distinction remains:

- Automation = the plan;
- Runtime = the execution layer.

# Repository relationship

`First-Repo` currently owns the static Lab proving surfaces and current frontend/product contracts.

`jay-app` owns protected backend architecture, models, migrations, services, APIs, tests and the future official React/frontend path.

Accepted Lab behavior migrates as semantics, not by copying localStorage or DOM patches.

The protected Phase 2B builder should use:

- React/TypeScript;
- generated OpenAPI client;
- server Drafts;
- optimistic concurrency;
- protected sessions + Origin/CSRF;
- server Capability Registry/readiness metadata;
- stable protected IDs.

# Safety rules that keep winning

Preserve:

- Secure HttpOnly protected session;
- exact Origin + CSRF for protected mutations;
- server-side ownership/scope checks;
- stable protected IDs;
- immutable history;
- stale-write rejection;
- no private/provider secrets in browser storage, definitions, content, prompts or Audit;
- no arbitrary executable workflow code;
- no unrestricted webhook/API escape hatch;
- no prompt-granted authority;
- no broad document-wide MutationObserver loops;
- no provider side effect from definition operations;
- no claim that a pretty Lab UI means Runtime exists.

# Next backend action

The immediate backend action remains the prepared Phase 2A production migration/deployment sequence.

Do not start Runtime/provider/AI execution in parallel merely because Automations v4 now shows the future operating model.
