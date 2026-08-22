# Continuum Project Status — CURRENT

Authority: **CROSS-REPOSITORY STATUS TRUTH**
Last verified: **2026-08-22**
Supersedes for status questions: older frontend-week/source-truth/checkpoint summaries when they conflict.

This file answers one question:

> What is actually live, wired, implemented in source, preview-only, or still planned right now?

For detailed semantics, follow the linked domain contracts. Do not copy this file into product UI as a live health feed; it is a deliberately maintained source checkpoint.

## Status vocabulary

- **LIVE** — deployed and verified in the target production environment.
- **WIRED** — frontend code calls the real protected backend contract.
- **STACKED** — backend implementation exists and has validation evidence in GitHub source, but is not production-deployed.
- **PREVIEW** — browser/product concept or sample UI that is not durable backend truth.
- **PLANNED** — documented direction without an implemented current contract.

These are orthogonal. A feature may be `WIRED + STACKED`.

## Repository roles

### `CMXChat/First-Repo`

Static GitHub Pages proving frontend for `db.cmxchat.com`.

Owns:

- canonical static product routes;
- browser presentation/proof integrations;
- route registry;
- frontend handoffs and source/browser validation.

It does not own PostgreSQL truth or provider credentials.

### `CMXChat/jay-app`

FastAPI/Python/PostgreSQL protected application and official typed client path.

Owns:

- durable domain models;
- protected APIs/services;
- SQLModel/Alembic;
- Runtime/provider boundaries;
- generated OpenAPI client;
- official React/TypeScript application path;
- backend tests and release truth.

## Production truth

Production remains at the reviewed Check In Phase 1 boundary.

- Render/backend release: `de55627926316581808337f8e9c10d26e7d64588`
- production Alembic revision: `c41f9b8d2e70`
- Check In switch/policy/Incident foundation: **LIVE**
- protected operator short-session + exact Origin/CSRF boundary: **LIVE**
- current 72h + 24h timing configuration remains server/PostgreSQL authoritative

Production does **not** yet have the full newer Directory, Connection/SenderIdentity, Library/typed Automation release, durable Runtime/provider stack, reconciliation, Authority or durable trigger-consumption stack.

No source test, browser mock, static Pages merge or draft PR changes that fact.

## Backend source truth

### On `jay-app/main`

Validated source includes the Phase 2A Library and first typed Automation foundation.

Key durable model direction already present in repository source:

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

and:

`Automation → mutable AutomationDraft → immutable AutomationVersion`

Phase 2A remains **not production-migrated/deployed**.

`jay-app/main` was verified at `ba985b378afc0825cbb38c09cdb0db404433bdf7` before this documentation cleanup.

### Stacked backend development

The current broader proof stack is deliberately layered:

`PR #17 → #18 → #19 → #20 → #21 → #24`

Current important capabilities in that stack include:

- Person + email ContactMethod;
- Connection + SenderIdentity/readiness;
- typed manual Email Automation definition/preflight;
- durable Runtime Run/RunAction/Attempt/lease/reclaim/Why;
- fake provider/idempotency;
- standalone worker and pending cancellation;
- bounded direct-manual-owner real SMTP proof;
- provider-operation reconciliation;
- exact immutable AuthorityGrantVersion lifecycle/evaluation;
- exact triggered-Incident fake Runtime authority proof;
- durable TriggerOccurrence/TriggerConsumption/TriggerConsumptionAttempt;
- PostgreSQL-time claim/lease/reclaim/replay hardening;
- protected trigger-consumption inspection APIs;
- separately invokable fake-only Check In trigger consumer.

Draft PR #24 current checked state:

- branch: `dev/durable-trigger-consumption`
- base: `dev/reconciliation-authority-api-handbook` / PR #21
- checked head: `753e55ebf7ef00d3814c5474552d88b90b3adc8c`
- migration head: `c0d1e2f3a4b5`
- T001–T006 complete
- documented full backend validation: 170 passed, 89% coverage
- mypy/ty/Ruff-on-PR-owned-files/OpenAPI/client/TypeScript validation green in the recorded local checkpoint
- real SMTP requests from trigger-consumption work: zero
- unattended provider boundary: fake only
- generic scheduler/cron/trigger framework: absent
- production deployment: absent

Before modifying this stack, read the branch copy of:

`specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md`

and the relevant active spec/tasks.

## Frontend main checkpoint

First-Repo `main` was verified at `311e8c2feac73e6ea7d7f99b6a7895d2a973ad25` before this documentation cleanup.

That checkpoint includes the connected frontend proof through merged PR #144.

The current visible durable-world chain is:

`Directory / Library → Email or Automation → Runtime receipt → Control → exact Directory Person / exact Library Content`

and:

`Requests → typed protected operation → durable backend objects → Runtime receipt → Control`

Stable IDs connect the same object across interfaces rather than copying browser-owned substitutes.

## Canonical route status

| Route | Frontend | Backend dependency | Current truth |
|---|---|---|---|
| `/checkin/` | server-backed protected UI | production Phase 1 | **LIVE** |
| `/directory/` | protected Person/email ContactMethod lane + richer local concepts | PR #17 stack for newer routes | **WIRED + STACKED**; Organizations/Groups richer relationship UI remains **PREVIEW** |
| `/library/` | protected Content lane + separate local media/file workspace | Phase 2A/stacked Library APIs | **WIRED + STACKED**; mixed-media/binary storage remains **PREVIEW/PLANNED** |
| `/automations/` | SERVER-BACKED lane plus richer local builder | stacked Automation/Runtime APIs | **WIRED + STACKED**; richer Conditions/Planner/Audience/advanced workflow features remain partly **PREVIEW** |
| `/email/` | protected manual Email orchestration and safe simulation | PR #17–#21 Runtime/provider stack | **WIRED + STACKED**; current frontend acceptance uses simulated provider effect |
| `/requests/` | contacts + typed Email safe-simulation operators | same protected Directory/Library/Automation/Runtime stack | **WIRED + STACKED**; general natural-language AI request understanding is **PLANNED** |
| `/control/` | read-only protected Runtime history/receipt lane + sample dashboard | stacked Runtime receipt APIs | **WIRED + STACKED** for history; Now/Upcoming/attention/simulation rows remain **PREVIEW** |
| `/spaces/` | context/briefing product experience | connect only when contracts exist | mostly **PREVIEW** |
| `/doc/` | explanatory product page | no operational backend required | product explanation; capability labels must remain truthful |

## Exact frontend connections that exist

The shared protected transport `assets/continuum-operator-api-v1.js` calls `https://api.cmxchat.com/api/v1` on `db.cmxchat.com` and uses:

- backend-issued protected cookie session;
- `credentials: include`;
- exact backend Origin checks;
- CSRF on protected mutations;
- no canonical protected localStorage/sessionStorage fallback.

It exposes current adapters for:

- People and ContactMethods;
- Connections/SenderIdentities/readiness;
- Library content/Draft/Version;
- Automations/Draft/preflight/Review/Publish;
- Runtime Run request/read/process and receipts.

The Automations page also retains its older thin Automations-specific proof adapter because that integration predates the shared transport. Final React work should use the generated `jay-app` client rather than preserving these static proof adapters as product architecture.

## Cross-surface continuity already landed

Current frontend source supports exact-reference navigation:

- Email/Requests receipt → `/control/?automation_id=<UUID>&run_id=<UUID>`
- Control receipt Person → `/directory/?person_id=<UUID>`
- Control receipt Content → `/library/?content_id=<UUID>`

The URLs are pointers, not permission. Protected destination reads still require the backend session.

## Important gaps

### Deployment gaps

These are implemented/wired but not production-ready merely by source existence:

- production merge/review of the stacked backend;
- production database migration;
- deployment of Directory/Connection/Library/Automation/Runtime APIs;
- production provider configuration/readiness;
- one explicitly authorized bounded real-email production acceptance.

### Product/backend gaps

Still absent or intentionally incomplete:

- generic durable scheduler/cron;
- broad generic trigger-registration framework;
- unattended real SMTP;
- generic natural-language assistant execution bridge;
- arbitrary webhook/code/SQL execution;
- broad Signals/Observations service;
- full server equivalent of the richer browser Automation workflow model;
- general Goals/Planner/Agent execution;
- production binary FileAsset/object-storage path;
- broad Organizations/Groups relationship backend.

## Open frontend work at this checkpoint

Do not merge these blindly; reconcile them with current `main` first:

- PR #130 — `/doc/` vision refresh; draft and behind/conflicted at the checked state.
- PR #131 — Automation workspace/viewport redesign; owner-approved design direction, but draft and behind/conflicted at the checked state.

Their ideas may still be good. Their branches are not automatically current truth.

## Next practical order

1. Keep documentation and source status truthful while the backend remains stacked.
2. Reconcile and visually validate the Automation viewport redesign against current `main` before merging it.
3. Reconcile `/doc/` vision work against current product copy rather than force-merging stale branch state.
4. Continue frontend convergence only against already-defined backend contracts.
5. Separately review the backend stack for a deliberate merge/migration/deployment plan.
6. After deployment, run real browser acceptance and replace `STACKED/NOT DEPLOYED` labels only with observed evidence.

## Non-negotiable architecture rules

- event existence != authority != consumption != execution;
- backend/server truth wins over browser projections;
- identity uses stable IDs, not mutable display strings;
- immutable historical versions/receipts stay immutable;
- AI interpretation is not permission;
- capability/readiness does not create Authority;
- frontend never gains DB/provider secrets;
- Runtime remains the single consequence/execution history path;
- old `/lab/*` route names are historical, not canonical product URLs.

## Update rule

Whenever a real release/status boundary changes, update together:

1. this file;
2. `docs/continuum-frontend-CURRENT.md` if frontend truth changed;
3. `assets/cmx-routes.json` if route metadata changed;
4. the relevant domain CURRENT file;
5. `CMXChat/jay-app/PROJECT-STATUS-CURRENT.md` and/or backend handoff when backend status changed;
6. visible product status labels only after the source/deployment truth is correct.
