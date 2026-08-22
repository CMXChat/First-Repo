# Continuum — AI START HERE

Authority: **ENTRYPOINT ONLY**
Last verified: **2026-08-22**
Repository: `CMXChat/First-Repo`

If you are an AI taking over this project, do not reconstruct truth from chat history. Read current GitHub source in this order.

## Five-minute recovery

1. `docs/PROJECT-STATUS-CURRENT.md` — the shortest current cross-repository truth.
2. `docs/continuum-frontend-CURRENT.md` — which pages are actually wired, local, stacked or live.
3. `docs/DOCUMENTATION-AUTHORITY.md` — which documents win when files disagree.
4. `assets/cmx-routes.json` — canonical route registry only; this does not prove backend deployment.
5. `CMXChat/jay-app/PROJECT-STATUS-CURRENT.md` — backend production/source/stack truth.
6. If changing backend-facing behavior, read the active stacked branch copy of `specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md`.
7. Then read only the domain-specific CURRENT file for the surface you are changing.

## Current mental model

Continuum is one durable backend world projected through multiple interfaces.

`Directory → Library → Automation → Authority/Trigger Consumption → Runtime → Receipt/Why`

The pages are not meant to become unrelated mini-apps.

- Directory answers **who**.
- Library answers **what information exists**.
- Automations answer **what should happen**.
- Authority answers **whether exact unattended work is permitted now**.
- Trigger Consumption answers **whether/how one durable event has been claimed and handled**.
- Runtime answers **what actually happened**.
- Control explains that Runtime history.
- Email and Requests are concrete interfaces over those same backend objects.

## Status language

Use only these current-status words unless a domain contract needs a more specific lifecycle term:

- **LIVE** — deployed and verified.
- **WIRED** — frontend calls the real protected contract.
- **STACKED** — backend source exists/validated but is not production-deployed.
- **PREVIEW** — browser/product concept, not backend truth.
- **PLANNED** — design only.

Never convert WIRED or STACKED into LIVE without deployment evidence.

## Production reality

Production is still the older Check In Phase 1 backend boundary.

Current production backend release: `de55627926316581808337f8e9c10d26e7d64588`

Current production Alembic revision: `c41f9b8d2e70`

The broader Directory/Connection/Library/Automation/Runtime/Email/Reconciliation/Authority/Trigger Consumption stack is not production-deployed merely because its source and frontend integration exist.

## Current frontend reality

Canonical routes:

- `/checkin/` — LIVE Check In foundation.
- `/directory/` — WIRED protected Person/email ContactMethod lane; richer relationship concepts remain PREVIEW; newer API is STACKED.
- `/library/` — WIRED protected Content lane plus separate PREVIEW file/media workspace; newer API is STACKED.
- `/automations/` — WIRED SERVER-BACKED lane plus richer LOCAL PREVIEW builder concepts; backend Runtime stack is STACKED.
- `/email/` — WIRED manual Email/safe-simulation workflow; dependencies STACKED.
- `/requests/` — WIRED typed contact + Email safe-simulation operations; not a general AI agent.
- `/control/` — WIRED read-only Runtime receipt/history lane plus PREVIEW operational dashboard; Runtime APIs STACKED.
- `/spaces/` — product/context PREVIEW; connect only to contracts that actually exist.
- `/doc/` — product explanation, not an execution surface.

Old `/lab/*` routes are not canonical product routes. `assets/lab/*` filenames may remain as implementation-history identifiers.

## Recent frontend checkpoint

First-Repo `main` was verified at `311e8c2feac73e6ea7d7f99b6a7895d2a973ad25` before this documentation cleanup.

That includes the connected frontend proof through PR #144:

- protected Directory session/projection;
- protected Library durable-memory lane;
- Email safe-simulation orchestration;
- Requests v2;
- Control Runtime receipt/Why history;
- exact cross-surface Person/Content/Run navigation.

Open visual/product work must be reconciled against current main before merging. In particular, old draft PRs #130 (`/doc/` vision refresh) and #131 (Automation viewport redesign) were behind/conflicted at this checkpoint.

## Current backend checkpoint

`CMXChat/jay-app/main` was verified at `ba985b378afc0825cbb38c09cdb0db404433bdf7` before this documentation cleanup.

Draft backend PR #24:

- branch `dev/durable-trigger-consumption`;
- base `dev/reconciliation-authority-api-handbook` / PR #21;
- head `753e55ebf7ef00d3814c5474552d88b90b3adc8c` at the latest checked report;
- migration head `c0d1e2f3a4b5`;
- T001–T006 complete;
- 170 backend tests passed at 89% coverage in the documented local validation;
- unattended Check In trigger path remains fake-only;
- no scheduler or generic trigger framework;
- real SMTP remains direct-manual-owner-only in the stacked proof;
- none of PR #17–#24 is production-deployed merely by being validated.

## Hard rules

Do not:

- write directly to PostgreSQL from First-Repo;
- store operator keys, CSRF tokens, provider credentials or canonical protected records in browser storage;
- use local preview state as a fallback for failed server truth;
- treat names/emails as stable identity instead of backend UUIDs;
- turn an old `*-CURRENT.md` name into authority just because it says CURRENT;
- call `/lab/automations/` the canonical route;
- invent a scheduler, alternate Runtime, generic execute endpoint or prompt-granted Authority;
- claim deployment from source/tests alone.

## Before changing anything

Identify which truth class the task changes:

- production behavior;
- stacked backend source;
- frontend wiring;
- preview/product UX;
- documentation/history.

Then update only the relevant authority documents and keep those classes distinct.
