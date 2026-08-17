# Check In Context Handoff — August 17, 2026

This file exists so a new ChatGPT/Codex context can resume the Check In project without reconstructing several days of backend, deployment, frontend, and architecture work from chat history.

Read this file first for the cross-repository snapshot, then read the source files listed near the end before changing code.

## 1. What this project is

`https://db.cmxchat.com/checkin/` is a public/private Dead Man Switch control panel.

Today it is a server-backed Check In product with:

- a public sanitized status dashboard;
- a server-authoritative rolling check in window;
- a protected short private session;
- protected records, notes, configured actions, activity, and switch controls;
- FastAPI + PostgreSQL as the authority;
- static frontend delivery from `CMXChat/First-Repo`;
- backend/API delivery from `CMXChat/jay-app` through `https://api.cmxchat.com`.

The long-term direction is much larger: a private automation/delegation engine where a user can define workflows with a mental model like:

`WHEN something happens → IF rules are true → DO actions → WAIT/REPEAT → THEN react to outcomes`

The Dead Man Switch is one important use case of that future control plane.

## 2. Current moment at handoff

Date/time of this handoff: 2026-08-17, shortly after the first Phase 1 frontend integration was deployed.

### Backend

Phase 1 backend is fully live and production verified.

Exact production application release on Render:

`de55627926316581808337f8e9c10d26e7d64588`

Production Alembic revision:

`c41f9b8d2e70`

The production migration already ran successfully against Aiven PostgreSQL.

Aiven recovery checkpoint observed before release:

`2026-08-17 17:04:13 UTC`

Important production verification already completed:

- exactly one expected primary switch;
- current/window policy pointers are valid and belong to that switch;
- policy version 1 exists;
- policy timezone is UTC;
- interval/grace are 259200/86400 seconds, which is 72/24 hours;
- compatibility fields are 72/24;
- last check in remained unchanged during release verification;
- next deadline was verified as `2026-08-18 16:00 UTC` at release time;
- zero orphan policy pointers;
- zero Incidents;
- zero active Incidents;
- active Incident uniqueness index exists;
- policy immutability trigger exists;
- browser/approved-origin health smoke returned HTTP 200 body `true`;
- public status returned HTTP 200;
- unauthenticated protected policy access returned HTTP 401 with `Operator unlock required`.

The release mutation freeze was released only after those read-only checks passed. No check in, policy mutation, pause/resume, deadline override, reconcile, or Action was performed during the production release.

### Backend repository state

Repository: `CMXChat/jay-app`

Backend `main` has later documentation continuity commits after the exact production application release. At the time this handoff was written, `main` HEAD was:

`2640a59757cf5e6943e74914906d991189b2d357` — `Mark Phase 1 production release complete`

Do not confuse backend repository HEAD with the exact Render application release SHA. Production application code is the reviewed `de556279...` release unless a later deployment is explicitly verified.

### Frontend

Repository: `CMXChat/First-Repo`

Branch: `main`

The first Phase 1 frontend integration has been committed and deployed.

Latest frontend HEAD before this handoff file itself was added:

`102e7c07aba77daf811eb8f1c48bde2e69055fe6` — `Harden Check In settings text wrapping`

A fresh GitHub Pages deployment for that frontend HEAD completed successfully.

A fresh `CMX Static Validation` run for that frontend HEAD completed successfully.

The frontend integration has not intentionally changed production switch timing or recorded a check in. Production should still be treated as the existing 72 hour interval plus 24 hour grace period until an authorized mutation explicitly changes it.

## 3. What Phase 1 added on the backend

Phase 1 introduced configurable immutable switch policy versions and Incident state without adding action execution.

The backend now supports:

- policy interval stored in seconds;
- grace stored in seconds;
- UTC/server authoritative timing;
- versioned immutable published policies;
- current policy and current-window policy pointers;
- policy behavior for next check in;
- policy behavior that recalculates the current window;
- policy behavior with an explicit current deadline;
- pause;
- resume;
- authoritative remaining-time resume where valid;
- fresh-window resume;
- explicit-deadline resume;
- one time deadline override;
- reconciliation support;
- immutable Incident snapshots;
- atomic auditing;
- database constraints and triggers enforcing invariants.

Important Phase 1 protected routes under `/api/v1`:

- `GET /checkin/operator/switch/policy`
- `PUT /checkin/operator/switch/policy`
- `POST /checkin/operator/switch/pause`
- `POST /checkin/operator/switch/resume`
- `PUT /checkin/operator/switch/deadline-override`
- `POST /checkin/operator/switch/reconcile`

Phase 1 intentionally does **not** add a background scheduler, workers, providers, action delivery, retry queues, emails, SMS, Discord sending, webhooks, document releases, or AI execution.

A switch reaching `triggered` is an authoritative state change. It does not currently mean any configured action was sent or executed.

## 4. Current timing semantics

The original/current operating policy remains:

- successful protected check in records actual server time;
- exactly 72 elapsed hours later is the deadline;
- a 24 hour grace period follows that deadline;
- successful check in resets the deadline exactly 72 hours from that successful server timestamp;
- PostgreSQL/UTC is authoritative.

There is historical 168-hour compatibility data in older migration/history. Do not describe the current live system as weekly. Phase 1 migration synchronized the active compatibility data back to the actual rolling 72 hour behavior.

## 5. Frontend work completed in this session

The frontend used to require `interval_hours === 72` for its public status contract. That would have made the new configurable backend unsafe to expose through the UI.

That restriction has now been removed.

`assets/checkin/checkin-status-contract.js` currently accepts integer timing values inside the Phase 1 bounds:

- interval: 1 through 8784 hours;
- grace: 0 through 720 hours.

It still falls back to 72/24 if public timing values are invalid.

### New private Settings layer

The new integration primarily lives in:

- `assets/checkin/checkin-phase1-controls.js`
- `assets/checkin/checkin-phase1-controls.css`

and is wired into:

- `checkin/index.html`

The Settings UI now has a real Phase 1 control surface.

While locked, it presents only public/current window information plus a private unlock path.

After the existing private session is unlocked, it can load protected policy state and expose controls for:

- interval hours;
- grace hours;
- apply timing starting with next check in;
- recalculate the current deadline;
- publish a policy with an explicit deadline;
- optional reason text;
- pause switch;
- fresh resume;
- remaining-time resume;
- explicit-deadline resume;
- one time next-deadline override;
- protected policy refresh.

The UI intentionally does not expose reconciliation as a casual button.

### Mutation security in the new frontend layer

The new Settings integration does not cache a secret.

For protected mutations it:

1. uses `credentials: "include"`;
2. reads the existing protected `/checkin/operator/session` endpoint;
3. gets the current CSRF token returned for that session;
4. sends `X-CSRF-Token` on the mutation;
5. relies on the backend's exact Origin validation and Secure HttpOnly session cookie.

The operator key, JWT, CSRF token, private policy, and protected content must not be placed into localStorage/sessionStorage.

### Paused presentation

The Phase 1 frontend can map the backend's paused representation into an explicit `PAUSED` visual state, including the main console/top status and a frozen countdown presentation.

Do not infer pause from browser-only state. Backend/public status remains authoritative.

## 6. Frontend integration commits

Relevant sequence on `CMXChat/First-Repo/main`:

- `36d95a0142bcbb9230046cc4b942570bb78ae7f6` — Fix desktop Check In package layout.
- `5c6a95eb2e50b899c72ed76a9611d7d70f53702f` — Make Check In timing contract policy driven.
- `844e1728a148ae1adefcbfb8aab4d1e33831445c` — Add Phase 1 Check In control integration.
- `0e535096d56741be17eebb8fd34b2bf6af88f5c4` — Style Phase 1 Check In controls.
- `c8abf72fc76149ed91053af1cf57a6f20f771489` — Wire Phase 1 controls into Check In.
- `f3ebea04070a1c40690f1e5b39d8e844b7aeb2ac` — Harden Phase 1 Check In controls.
- `8f1ee107c77aa8df50bc6e95dfb6dd2e8f756550` — Align Check In timing validation with Phase 1 policy bounds.
- `7f22bcbbfade5e075eb5ffc7c64ebe5101b31c6a` — Polish paused and mobile Phase 1 controls.
- `102e7c07aba77daf811eb8f1c48bde2e69055fe6` — Harden Check In settings text wrapping.

The handoff-file commit will naturally move `First-Repo/main` past `102e7c07...`; use the above SHA as the last functional frontend-control change before continuity documentation.

## 7. GitHub Pages workflow anomaly that is already understood

During frontend integration an older Pages workflow run was rerun multiple times.

Each rerun uploaded another artifact named `github-pages` into the same workflow run. `actions/deploy-pages` then failed because it found multiple artifacts with the same expected name.

The log explicitly reported multiple `github-pages` artifacts.

This was not evidence that the frontend itself was broken.

A fresh commit generated a fresh workflow run with one expected artifact. That fresh Pages deployment succeeded, and static validation succeeded.

If a new context sees failed historical Pages reruns from this period, do not treat them as the current deployment state.

## 8. Current frontend architecture and files

Primary files:

- `checkin/index.html`
- `assets/checkin/checkin.css`
- `assets/checkin/checkin-ring-fix.css`
- `assets/checkin/checkin-status-contract.js`
- `assets/checkin/checkin.js`
- `assets/checkin/checkin-refine.css`
- `assets/checkin/checkin-refine.js`
- `assets/checkin/checkin-ring-hero.css`
- `assets/checkin/checkin-vault-panels.css`
- `assets/checkin/checkin-vault-panels.js`
- `assets/checkin/checkin-actions-official.css`
- `assets/checkin/checkin-actions-official.js`
- `assets/checkin/checkin-legibility.css`
- `assets/checkin/checkin-presentation.js`
- `assets/checkin/checkin-phase1-controls.css`
- `assets/checkin/checkin-phase1-controls.js`

`assets/checkin/checkin.js` remains the main existing dashboard/API/auth/timer implementation.

The dedicated Phase 1 settings file augments it instead of replacing the entire page.

## 9. Important frontend design/product rules

Keep the existing polished product feeling:

- near black/graphite dark mode;
- professional light mode;
- restrained mint/blue/cyan/lavender/pink/coral accents;
- avoid muddy yellow/amber except real warnings;
- clean glass/depth treatment;
- serious operational feel;
- mobile must be genuinely usable on Samsung/Android;
- desktop and mobile may need separate polish;
- do not make the UI look like generic AI-generated admin copy.

Visible human-facing copy should avoid unnecessary jargon and fake intelligence-language theatrics.

The user specifically disliked copy like `RESTRICTED CONTINGENCY DIRECTIVE` and removed it.

Primary nav should remain:

`Status · Records · Actions · Activity`

Updates/Notes remain hidden from primary nav. Timeline remains reachable from Status. Settings remains accessible from the gear.

Public locked UI must not invent or reveal private record/action details.

## 10. Public aggregate count caveat

The current public API/status contract still contains aggregate count fields such as document/contact/organization/update/action counts.

The user wants stronger privacy over time, especially for record counts.

However, Phase 1 intentionally preserved the current public aggregate contract for compatibility. Removing those fields/public displays should be handled as a separate API/frontend compatibility change and not silently bundled into timing-control verification.

`trigger_action_count` also currently drives the number of generic sealed action slots. Those slots may remain generic, but never invent type, recipient, timing, channel, or content.

## 11. Mobile/performance freeze warning

This matters a lot.

A real Samsung/Android browser previously showed an `unresponsive page` warning after the presentation overhaul.

The problem involved broad `MutationObserver` layers watching too much of the document while the countdown changed every second.

Current code uses targeted observers.

Do not add:

- full-document mutation observers;
- whole-page `characterData` observers;
- repeated text rescans of the whole page on each countdown tick;
- self-triggering mutations on observed targets without guards.

Desktop-only package fixes are intentionally scoped to desktop. Do not "clean up" those selectors in a way that changes mobile unless mobile is the explicit task.

## 12. Security model to preserve

Public:

- sanitized status only;
- no owner ID;
- no switch UUID;
- no operator key;
- no raw JWT;
- no database credentials;
- no private records/actions/activity.

Private access:

- operator key verified only by backend;
- short signed session cookie;
- Secure + HttpOnly in production;
- SameSite=None for the cross-origin production dashboard/API pairing;
- double-submit CSRF;
- exact mutation Origin `https://db.cmxchat.com`;
- manual lock supported;
- private state cleared from frontend when session expires/locks.

Never ask the user to paste a secret into chat.

There was an earlier diagnostic screenshot/error output in this broader project that exposed an SMTP password. Do not reproduce that value anywhere. Before final project closeout, remind the user to rotate the active SMTP credential if that has not already happened.

## 13. Immediate next agenda

This is the exact point where work stopped.

The next step is **verification of the newly deployed frontend Phase 1 Settings integration**, not Phase 2.

### Step A: locked visual audit

On desktop:

1. Hard refresh `https://db.cmxchat.com/checkin/`.
2. Open Settings while still locked.
3. Inspect the current-window summary, private-control locked state, spacing, wrapping, typography, light/dark behavior, and whether any private values appear.
4. Send a screenshot for review.

Then do the same on mobile/Samsung after desktop is acceptable.

### Step B: read-only private policy audit

After the locked UI looks right:

1. Unlock using the existing private access flow.
2. Do **not** publish timing changes, pause, resume, override, reconcile, or check in merely for testing.
3. Let the Settings UI perform its protected `GET` policy read.
4. Confirm the current policy/state returned by the backend.
5. Verify the UI shows the expected interval, grace, version/state, and current deadline accurately.

Only after read-only verification should we decide whether any production mutation needs to be tested.

### Step C: remaining Phase 1 frontend cleanup

Likely follow-up items after verification:

- fix any desktop/mobile visual issues seen in real screenshots;
- confirm pause rendering is sensible without actually pausing production unless deliberately authorized;
- confirm invalid input/error handling is understandable;
- confirm Settings remains safe after session expiration/manual lock;
- consider the separate public count privacy cleanup;
- add or strengthen targeted frontend smoke tests for the new Settings layer if useful.

## 14. What comes after Phase 1 UI verification

Do not jump directly into providers or AI execution.

The broader agenda is:

### Action configuration

Move from the current simple saved trigger-action rows toward typed action schemas and a real private builder.

The conceptual UI should become:

`WHEN / IF / DO / WAIT / THEN`

Examples eventually include:

- missed check in escalation;
- SMS;
- email;
- Discord;
- recurring birthday automations;
- AI prompt/task;
- bounded AI agent actions.

### Durable execution model

Use the architecture vocabulary from the master plan:

- **Automation**: reusable definition;
- **Run**: one activation;
- **Incident**: contingency context/snapshot;
- **Occurrence**: one scheduled instance;
- **Execution Attempt**: one retry/attempt.

### Scheduler/workers

Later, due work must be claimed server side with database locks/leases/idempotency.

Do not use:

- browser timers as the scheduler;
- sleeping HTTP requests;
- a browser that has to remain open;
- memory-only work queues for consequential actions.

### Providers

Build adapters for capabilities such as email/SMS/Discord one at a time.

Keep provider secrets server side. Persist sanitized provider references/receipts, not raw credentials or sensitive payloads.

### AI planner

A future AI natural-language planner can translate user instructions into a structured **draft** automation.

It should not silently activate consequential automation.

### Bounded AI agent

A later agent may act only within explicit boundaries for:

- approved records;
- approved people/contacts;
- approved tools;
- approved integrations;
- cost ceiling;
- step ceiling;
- runtime ceiling;
- permissions;
- approvals.

Principle:

**Build the control plane; rent capabilities.**

## 15. Backend files the next context should read

In `CMXChat/jay-app`, read in this order:

1. `specs/003-server-checkin/HANDOFF.md`
2. `specs/003-server-checkin/CHECKIN-MASTER-PLAN.md`
3. `specs/003-server-checkin/FRONTEND-BACKEND-NEXT.md`
4. `specs/003-server-checkin/ACTION-BUILDER-NEXT.md`
5. `specs/003-server-checkin/PRODUCTION-DEPLOYMENT-RUNBOOK.md` if release/deployment detail is relevant.

For implementation details also inspect the current Check In routes/services/models/migration/tests rather than trusting old chat summaries.

## 16. Frontend files the next context should read

In `CMXChat/First-Repo`, read in this order:

1. `docs/checkin-context-handoff-2026-08-17.md`
2. `checkin/index.html`
3. `assets/checkin/checkin.js`
4. `assets/checkin/checkin-status-contract.js`
5. `assets/checkin/checkin-phase1-controls.js`
6. `assets/checkin/checkin-phase1-controls.css`
7. `assets/checkin/checkin-legibility.css`
8. `assets/checkin/checkin-refine.js`
9. other `assets/checkin/*` files only as needed for the affected visual/behavior layer.

Review the actual current source before editing. The page has accumulated several intentional layered refinements, so broad rewrites can easily regress mobile, auth, countdown, or protected package behavior.

## 17. User learning/working style for this project

The user is actively learning backend development through this build.

They know basic HTML/CSS/JavaScript more comfortably than React/TypeScript/Python/backend concepts.

When teaching, use short beginner explanations and concrete flow diagrams/examples. Do not dump a giant lecture unless asked.

When implementing, give one clear next action at a time. Avoid long multi-command terminal walls unless necessary.

The user may use Codex/Codespaces, but Codex credits are limited, so do not burn them on work that can be done directly through GitHub tooling.

## 18. Do not do these things

- Do not describe the live switch as weekly.
- Do not change production timing casually.
- Do not pause/resume/override/check in simply to prove a button works.
- Do not start Phase 2 before finishing the current frontend verification.
- Do not claim configured actions execute today.
- Do not expose secrets or protected data.
- Do not weaken CSRF/Origin/session boundaries.
- Do not reintroduce broad MutationObserver behavior.
- Do not rebuild `/checkin` from an old screenshot.
- Do not touch unrelated `/spaces`, `/doc`, Vault, Brief, or other First-Repo areas during a Check In task unless explicitly requested.
- Do not conflate repository HEAD with production release without verifying deployment.

## 19. Exact handoff sentence

At the moment this file was written:

**Phase 1 backend is live and verified, the first policy-driven/private-control frontend integration is deployed successfully, and the next job is to visually audit the locked Settings UI and then perform a protected read-only policy check before considering any production mutation or Phase 2 work.**
