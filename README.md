# CMX Restricted Node / Continuum frontend

`CMXChat/First-Repo` owns the static GitHub Pages proving surfaces served from `db.cmxchat.com`.

The protected FastAPI/PostgreSQL application, durable domain models, migrations, generated API client and canonical backend services live in `CMXChat/jay-app`.

## Start here

For a human or AI taking over the project, read in this order:

1. `docs/AI-START-HERE.md`
2. `docs/PROJECT-STATUS-CURRENT.md`
3. `docs/continuum-frontend-CURRENT.md`
4. `docs/DOCUMENTATION-AUTHORITY.md`
5. the relevant surface-specific `docs/*-CURRENT.md`
6. `CMXChat/jay-app/PROJECT-STATUS-CURRENT.md`
7. the active backend branch handbook/spec when working on stacked backend code

Do **not** infer current truth from an older chat, an older `*-CURRENT.md` filename, or a historical `/lab/*` route. The authority index above wins when documents disagree.

## Product model

Continuum is the umbrella product and a navigable map of a person's connected digital world.

- **Directory** = who: People, ContactMethods and later richer relationships.
- **Library** = protected information/content and immutable versions.
- **Automations** = what should happen.
- **Connections / SenderIdentity** = approved external capability and identity definitions.
- **Authority** = whether exact unattended work may happen now.
- **Trigger Consumption** = durable event claim/recovery before execution.
- **Runtime** = what actually happened, with Attempts, receipts and Why/provenance.
- **Check In** = the currently production-live protected continuity/timing application foundation.
- **Spaces** = context/briefing experience.
- **Requests** = bounded human-friendly doorway over typed protected operations.
- **AI / Planner** = future bounded intelligence using the same typed services and authority rules, never a bypass.

Core rule:

> One backend, many interfaces.

## Canonical Continuum routes

User-facing Continuum routes are outside the retired `/lab/` namespace:

- `/checkin/`
- `/spaces/`
- `/directory/`
- `/library/`
- `/automations/`
- `/email/`
- `/requests/`
- `/control/`
- `/doc/`

`/archive/continuum-lab/` preserves the older integrated prototype. Internal files under `assets/lab/` may remain because those are implementation-history identifiers, not canonical route names.

## Status vocabulary

Use these terms consistently:

- **LIVE** — deployed and verified in the target production environment.
- **WIRED** — frontend code really calls the typed/protected backend contract.
- **STACKED** — backend implementation exists and is validated in GitHub source but is not production-deployed.
- **PREVIEW** — browser/product concept that is not durable backend truth.
- **PLANNED** — documented direction with no implemented contract yet.

`WIRED + STACKED` is a normal state: the page can be ready while production still returns `404 / NOT DEPLOYED` for the newer API.

## Current production boundary

Production remains on the reviewed Check In Phase 1 boundary:

- production backend release: `de55627926316581808337f8e9c10d26e7d64588`
- production Alembic revision: `c41f9b8d2e70`
- protected Check In switch/policy/Incident/operator-session behavior is LIVE
- production does **not** yet contain the full stacked Directory, Connection, Library, Email Automation Runtime, Authority or trigger-consumption stack

The broader backend work exists in validated source and stacked draft PRs. Tests and frontend wiring do not make that work production-live.

## Frontend truth

The current frontend has meaningful protected/backend-aware lanes rather than isolated mock pages:

- Directory: protected Person + email ContactMethod lane where deployed.
- Library: protected `ContentAsset → ContentDraft → ContentVersion` lane plus separate local preview concepts.
- Automations: a SERVER-BACKED lane for durable Draft/preflight/Review/Publish/Runtime alongside richer LOCAL PREVIEW workflow concepts.
- Email: protected manual Email orchestration through Directory → Connection → Library → Automation → Runtime → receipt.
- Requests: preview-before-write contact operations and typed Email safe simulation through the same canonical backend chain.
- Control: read-only protected Runtime receipt/history lane plus explicitly sample operational preview panels.

Exact IDs now connect surfaces: Email/Requests can open a specific Run in Control, and Control can point to the exact Directory Person or Library ContentAsset involved.

See `docs/continuum-frontend-CURRENT.md` for the route-by-route wiring matrix.

## Backend truth

`CMXChat/jay-app/main` contains validated Check In plus Phase 2A Library/typed Automation source, but Phase 2A is not production-migrated.

The later implementation is intentionally stacked through draft backend PRs, culminating in draft PR #24 (`dev/durable-trigger-consumption`), where durable trigger consumption and the separately invoked fake-only Check In consumer are implemented and validated. Real SMTP remains direct-manual-owner-only in the stacked proof; unattended execution remains fake-only.

Read `CMXChat/jay-app/PROJECT-STATUS-CURRENT.md` and the active stacked branch's `specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md` before changing backend-facing frontend behavior.

## Safety invariants

- frontend never receives database credentials;
- browser code never talks directly to PostgreSQL or SMTP;
- protected mutations use the server session, exact Origin and CSRF;
- stable IDs are identity; display names/emails are presentation data;
- immutable published/version/receipt history is never reconstructed from current mutable state;
- prompt text, urgency, AI confidence, readiness or capability never grant Authority;
- human UI, future AI and future MCP adapters use the same typed services;
- no arbitrary Python/JavaScript/shell/SQL/eval execution path;
- durable time/waits belong server-side, never in a browser tab;
- browser preview state must never silently impersonate missing server truth.

## Documentation rule

Useful historical material is preserved. Cleanup means **changing authority, not erasing knowledge**.

The documentation policy is in `docs/DOCUMENTATION-AUTHORITY.md`. Git history preserves the pre-consolidation README and index at First-Repo commit `311e8c2feac73e6ea7d7f99b6a7895d2a973ad25`.
