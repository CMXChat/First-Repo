# Continuum Frontend — CURRENT

Authority: **FRONTEND IMPLEMENTATION / WIRING TRUTH ONLY**
Last verified: **2026-08-22**
Repository: `CMXChat/First-Repo`

This file answers only:

> Which canonical pages exist, which parts of those pages call protected backend contracts, which parts remain browser previews, and how the frontend surfaces connect to each other?

It does **not** answer backend release, migration, model, PR-stack, Runtime-internal, Authority-internal, provider, or deployment-status questions.

For those questions, use `CMXChat/jay-app/PROJECT-STATUS-CURRENT.md` and the relevant backend handoff/spec.

## Frontend design rule

**One backend, many interfaces.**

The pages should project and navigate shared protected objects rather than create separate browser-owned systems.

## Frontend status terms

- **LIVE UI** — route is deployed and reachable.
- **WIRED** — frontend code calls a real protected backend contract.
- **PREVIEW** — browser/sample behavior, not durable server truth.
- **LEGACY** — compatibility/history only.

Backend implementation/deployment state is intentionally not duplicated here.

## Shared protected browser transport

Primary shared proving adapter:

`assets/continuum-operator-api-v1.js`

It is responsible for frontend transport concerns such as:

- protected session use;
- credentials on protected requests;
- CSRF on protected mutations;
- no-store request behavior;
- clearing sensitive unlock input after submission;
- surfacing backend errors instead of silently replacing them with local success.

The static adapters are proving infrastructure. They are not a second backend or database.

## `/checkin/`

Frontend classification: **LIVE UI + WIRED**

The page is the protected Check In interface. It reads and changes supported Check In state through the protected backend.

Do not infer broader Automation/Email/Runtime behavior merely because Check In is reachable.

## `/directory/`

Frontend classification: **WIRED + PREVIEW**

The protected lane can use backend Person/email-contact operations and stable IDs.

Richer Organizations, Groups, Labels/audiences and relationship experiences remain frontend preview concepts unless/until matching server contracts are available.

Exact focus is supported through:

`/directory/?person_id=<UUID>`

If a protected request is unavailable, the UI must show that truth rather than invent a local server record.

## `/library/`

Frontend classification: **WIRED + PREVIEW**

The protected content lane can work with server-owned content, mutable draft state and immutable versions through the frontend adapter.

The mixed-media/files/folders/import workspace still contains browser-preview concepts and must remain visibly separate from protected server truth.

Exact focus is supported through:

`/library/?content_id=<UUID>`

## `/automations/`

Frontend classification: **WIRED + PREVIEW**

The canonical route contains two intentionally different lanes:

### Server-backed lane

Frontend controllers support protected Automation operations such as:

- list/create/open;
- draft editing with revision/conflict handling;
- preflight/review/publish requests;
- protected selectors for referenced objects;
- execution-history/run projections where the backend contract is available.

Relevant proving controllers include:

- `assets/lab/lab-automations-api-v1.js`
- `assets/lab/lab-automations-server-v1.js`
- `assets/lab/lab-automations-server-lifecycle-v1.js`
- `assets/lab/lab-automations-server-runtime-v1.js`

Historical `assets/lab/*` filenames are implementation identifiers only; `/automations/` is canonical.

### Preview lane

The richer visual builder still contains concepts that are intentionally frontend prototypes until matching protected contracts exist.

Local preview state must never become a fallback cache for a failed server-backed Automation.

## `/email/`

Frontend classification: **WIRED**

Email is a protected manual proving workflow that coordinates the frontend steps needed to select recipient/sender/content/Automation references and request a typed run/receipt through the backend contract.

The browser does not speak SMTP directly and does not receive provider credentials.

A completed receipt can open the exact execution record in Control:

`/control/?automation_id=<UUID>&run_id=<UUID>`

## `/requests/`

Frontend classification: **WIRED**

Requests is a bounded operator doorway over typed operations.

Current frontend modes include:

- contact preview followed by explicit approved protected writes;
- Email safe-simulation orchestration through the same protected frontend adapters used by other surfaces.

Requests is not a generic HTTP proxy, database console, or unrestricted AI agent.

After a typed receipt is returned, it can open the exact Run in Control.

## `/control/`

Frontend classification: **WIRED + PREVIEW**

Control contains two different kinds of UI:

### Protected history/receipt projection

Read-only frontend views can show exact execution records and references returned by the backend.

### Sample operational preview

Now/Upcoming/attention/connection-health/simulation panels remain sample product UI unless explicitly backed by protected server truth.

Control can navigate exact references to:

- `/directory/?person_id=<UUID>`
- `/library/?content_id=<UUID>`
- `/automations/`

## `/spaces/`

Frontend classification: primarily **PREVIEW**

Spaces is the context/briefing product experience. Add protected integration only when a real typed backend contract exists.

## `/doc/`

Frontend classification: product explanation

`/doc/` is not an operational backend client. It explains the product and must keep future capability wording distinct from current behavior.

## Cross-surface exact identity

Current frontend navigation supports this pattern:

`Email / Requests receipt`
→ `/control/?automation_id=<UUID>&run_id=<UUID>`

`Control Person reference`
→ `/directory/?person_id=<UUID>`

`Control Content reference`
→ `/library/?content_id=<UUID>`

Those query parameters are navigation pointers only. They do not bypass protected authorization.

## Failure behavior

A wired frontend may receive an unavailable/not-found response from a backend dependency.

That must be shown truthfully.

Do not convert a missing protected endpoint into browser-owned fake success merely to make the interface appear complete.

For the reason a backend dependency is or is not available, consult `jay-app`; do not maintain a duplicate backend status ledger here.

## Frontend validation

This repository may record browser/static validation for:

- route behavior;
- UI interactions;
- adapter request shape;
- conflict/error presentation;
- navigation between surfaces;
- mobile/desktop layout;
- no-secret/no-local-fallback frontend rules.

Such tests prove frontend behavior only. They do not prove backend deployment or backend implementation completeness.

## Update rule

When frontend behavior changes, update only the smallest relevant set:

1. frontend source/tests;
2. this file if route/wiring truth changed;
3. the relevant surface-specific frontend handoff;
4. `assets/cmx-routes.json` if route metadata changed.

If the change is actually backend/project status, update `CMXChat/jay-app` instead of copying that truth into First-Repo.