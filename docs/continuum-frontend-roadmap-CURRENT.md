# Continuum Frontend Execution Roadmap — CURRENT

Last updated: 2026-08-22
Status: **APPROVED FOR EXECUTION**

## Purpose

This is the durable execution roadmap for the current frontend-focused week. GitHub is the recovery source of truth for this plan.

The backend remains authoritative for identity, protected data, permissions/readiness, immutable versions, Runtime execution and historical receipts. Frontend pages are interfaces over that truth; they do not write directly to PostgreSQL and do not invent missing backend capability.

## Current backend boundary

Canonical backend contract: `CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md` on draft PR #24.

Current backend checkpoint when this roadmap was approved:

- branch `dev/durable-trigger-consumption`
- PR #24 remains draft/unmerged
- migration head `c0d1e2f3a4b5`
- T001–T006 complete
- complete backend regression: 170 passed, 89% coverage
- production remains on the older documented Phase 1 boundary
- no production migration or deployment is authorized by this roadmap

## Guiding model

**One backend, many interfaces.**

- Directory answers **who**.
- Library answers **what information/content exists**.
- Automations answer **what should happen**.
- Runtime answers **what actually happened**.
- Connections/SenderIdentity answer **which external capability and identity are configured**.
- Authority answers **whether exact unattended work may happen now**.
- Trigger Consumption records **durable event claim/handling/recovery before execution**.
- `/requests/` becomes a human-friendly operator doorway over existing authenticated APIs.
- A future assistant-facing bridge may become another interface, but it must use the same backend rules rather than bypass them.

## Execution order

### Phase F1 — `/email/` real backend integration

Goal: turn the current protected Email workspace from a proving presentation into a truthful client of every currently available Email backend contract.

Deliverables:

1. Proper operator unlock/session UX.
2. Operator key is submitted directly to the API, immediately cleared, and never persisted in browser storage.
3. Protected session cookie + CSRF contract remain backend-owned.
4. Real Person and email ContactMethod selectors from Directory.
5. Real Connection, SenderIdentity and server readiness facts.
6. Rich editor remains presentation-only; freeze through `ContentAsset → ContentDraft → ContentVersion` using `expected_revision`.
7. Real manual Email Automation Draft, server preflight, Review and immutable Publish.
8. Real Runtime Run request and typed receipt flow.
9. Safe fake-provider acceptance first: real database/Runtime history with a simulated provider boundary and zero external email.
10. Real SMTP remains a separate, explicit, later acceptance decision; browser never receives provider credentials.
11. Clear state distinction between locked session, live capability, stacked/not-deployed capability, backend denial, validation conflict and network failure.
12. No browser fake records are substituted when server data is missing or unavailable.

Safe acceptance target:

`unlock → Directory → Connection readiness → freeze ContentVersion → Automation preflight/review/publish → fake Runtime Run → explicit development process where available → typed receipt`

If production stops at an undeployed route, the UI records that exact boundary instead of pretending completion.

### Phase F2 — `/requests/` operator doorway

Goal: create a protected operator surface for converting understandable user requests into existing backend API operations with preview-before-write.

Initial capability: **batch People + email ContactMethod creation** using already-defined Directory APIs.

First version behavior:

1. Check/unlock the same protected operator session.
2. Accept pasted contact lines in deterministic formats such as `Name <email>` or `Name, email`.
3. Parse locally only for presentation; never treat parsing as database truth.
4. Show a review table before writes.
5. Require explicit user approval before mutation.
6. Create a Person through the protected API, then create that Person's email ContactMethod.
7. Display per-row durable backend results and failures.
8. Never write directly to PostgreSQL.
9. Never store operator keys, CSRF tokens or canonical private data in localStorage/sessionStorage.
10. Do not silently retry ambiguous or conflicting mutations.

Important limitation: the static frontend does **not** contain an AI model. `/requests/` v1 can deterministically parse supported contact-entry formats; broad natural-language interpretation belongs to a later authenticated assistant/AI bridge. The page must say this plainly rather than pretending arbitrary language is understood.

Future `/requests/` adapters may expose other already-existing APIs such as Library creation, Automation drafting or lifecycle operations, but each adapter must be typed, reviewable and backend-authorized.

### Phase F3 — project the existing backend across the remaining frontend

After Email and Requests have a stable foundation, work systematically through current product surfaces instead of inventing another backend slice.

Priority areas:

- `/directory/`: backend-backed People/ContactMethod projection, lifecycle/error states, canonical navigation cleanup.
- `/library/`: durable ContentAsset/Draft/Version projection where deployed; no browser-local state presented as server truth.
- `/automations/`: durable Draft/preflight/Publish/Runtime projections and receipt/history surfaces while preserving the current editor work.
- `/control/`: accurate source/deployment/attention state and links into durable operational objects.
- `/checkin/`: presentation of current deterministic protected Check In truth without creating a parallel generic Runtime.
- `/spaces/`: preserve context/workspace direction; connect only where a real backend contract exists.
- shared operator-session UX, error classification and deployment-state language across protected surfaces.
- canonical-route href sweep so retired `/lab/...` paths stop appearing in active source.
- desktop/mobile visual consistency and accessibility.

### Phase F4 — leave the next backend phase ready, not improvised

At the end of the frontend-focused week:

- update durable handoffs for every changed surface;
- record exact production-vs-stacked gaps discovered by real frontend integration;
- list missing backend endpoints/contracts as explicit future slices rather than frontend workarounds;
- keep `jay-app` draft stack unmerged unless a separate deployment plan is explicitly approved;
- prepare an ordered next-backend roadmap for when Codex/backend capacity resumes.

## `/requests/` long-term direction

The intended destination is an operator layer where a user can express intent in normal language and receive a proposed typed plan before anything consequential happens.

Example future request:

> Add these five contacts, create a follow-up Automation for two of them, and show me exactly what will be written before you do it.

Long-term flow:

`human intent → typed proposed operations → preview/approval → authenticated backend APIs → PostgreSQL durable truth → Runtime/receipt where execution is involved`

AI is an input/translation layer, **not authority**. It must not:

- write directly to PostgreSQL;
- manufacture permission;
- bypass Origin/CSRF/session rules;
- bypass immutable publication;
- create a parallel Runtime;
- turn undeployed backend behavior into browser-local simulation presented as real.

## Future assistant control

A later assistant-facing bridge can make it possible to ask an assistant to create/query Continuum objects and eventually schedule or initiate approved actions. That requires a deliberate authenticated tool/API bridge and, for time-based work, a real durable server-side scheduling layer.

The current backend slice intentionally does **not** provide a general scheduler, generic execution endpoint or AI execution authority.

A future command such as:

> Tomorrow at 9:00, remind me about the server; if a separately approved condition is met, perform this exact action.

must ultimately resolve through server-side durable time/state, fresh Authority evaluation where unattended execution is involved, canonical Runtime and durable receipts. It must not depend on a browser tab remaining open.

## Explicit current non-goals

During this frontend-focused roadmap, do not silently add or claim:

- production backend deployment;
- production database migration;
- generic scheduler/cron system;
- unattended real SMTP;
- generic trigger framework;
- wildcard Authority;
- alternate Runtime;
- direct browser SMTP;
- direct browser-to-database writes;
- arbitrary AI execution;
- HTML-email backend contract unless separately designed and implemented.

## Branch/PR discipline

Meaningful First-Repo work follows:

`current main → feature branch → source/static validation → focused browser/visual validation where available → PR → inspect diff/checks → merge → Pages publish → verify canonical live route`

Direct-to-main changes are reserved for genuine emergency corrections, not normal feature work.

## Recovery

Start frontend recovery with:

1. this roadmap;
2. the surface-specific `docs/*-CURRENT.md` handoff;
3. current `main` and open First-Repo PRs;
4. `CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md`;
5. never infer production deployment from stacked source/tests.
