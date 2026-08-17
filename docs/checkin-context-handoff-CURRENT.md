# Check In Context Handoff — CURRENT

Date: 2026-08-17
Status: Current cross-repository correction and continuation guide

This file is the **current correction layer** for the longer `docs/checkin-context-handoff-2026-08-17.md` handoff. A new ChatGPT/Codex context should read this file **first**, then read the longer handoff for full backend, deployment, security, frontend, and architecture history.

This file supersedes older **current-state / immediate-next-step** language where it conflicts. It does not replace the durable architecture in `CHECKIN-MASTER-PLAN.md`.

## Source-of-truth order

Use the documents for different jobs instead of treating every file as equally current:

1. **This file** — newest cross-repository observed state and immediate continuation.
2. `CMXChat/jay-app/specs/003-server-checkin/HANDOFF.md` — canonical backend release/continuity journal and verified production release facts.
3. `CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-NEXT.md` — current frontend/backend integration state.
4. `CMXChat/jay-app/specs/003-server-checkin/tasks.md` — **active executable checklist and phase gates** for what we build next.
5. `CMXChat/jay-app/specs/003-server-checkin/ACTION-BUILDER-NEXT.md` — approved Automation/Actions UX and domain mapping.
6. `CMXChat/jay-app/specs/003-server-checkin/CHECKIN-MASTER-PLAN.md` — durable architecture, invariants, domain model, scheduler/runtime/provider/AI direction.
7. `docs/checkin-context-handoff-2026-08-17.md` — extensive historical/cross-repository context for this work period.

Important master-plan reading rule: the architecture remains approved, but some of its **status wording** was written before Phase 1 was actually implemented and deployed. In particular, do not use old `Current production truth`, `Future private controls`, Phase 1 start instructions, or `Tomorrow: Start Here` language to conclude that policy versions, Incidents, pause/resume, or frontend Settings still need to be invented from scratch. Use this file + `HANDOFF.md` + `FRONTEND-BACKEND-NEXT.md` + `tasks.md` for what exists now and what comes next.

## Current production/backend truth

Phase 1 backend is fully live and production verified.

Exact reviewed Render application release:

`de55627926316581808337f8e9c10d26e7d64588`

Production Alembic revision:

`c41f9b8d2e70`

Recorded Aiven recovery checkpoint before migration:

`2026-08-17 17:04:13 UTC`

Production verification already passed for:

- exactly one expected primary switch;
- valid current/window policy pointers belonging to that switch;
- policy version 1;
- UTC authoritative timing;
- interval `259200` seconds = 72 hours;
- grace `86400` seconds = 24 hours;
- compatibility fields 72/24;
- last check in preserved during release;
- zero orphan policy pointers;
- zero Incidents at release verification;
- zero active Incidents;
- active-Incident uniqueness protection;
- published-policy immutability protection;
- approved-origin browser health HTTP 200 body `true`;
- public status HTTP 200;
- unauthenticated protected policy read HTTP 401 with `Operator unlock required`.

The temporary release mutation freeze was released after those checks passed. No production policy change, pause, resume, deadline override, reconcile, Action execution, or test check in was performed during release verification.

Do not confuse later `jay-app/main` documentation commits with the exact reviewed application SHA running on Render unless a later deployment is explicitly verified.

## Current switch semantics

The live switch is **not weekly**.

Current operating behavior remains:

```text
successful protected check in
→ backend records actual server timestamp
→ 72 elapsed hours
→ deadline
→ 24 elapsed hour grace
→ triggered state
```

A successful check in resets the next deadline to exactly 72 elapsed hours after the server-authoritative check in timestamp. PostgreSQL/server UTC is authoritative.

Old 168-hour/weekly compatibility history exists in older migration/git history. Do not resurrect it as current behavior.

## Phase 1 backend capabilities that are already real

Phase 1 now has real backend support for:

- immutable versioned switch policies;
- configurable interval and grace values;
- current published policy pointer;
- current-window policy pointer;
- apply policy starting next successful check in;
- recalculate the current window;
- publish policy with an explicit current deadline;
- pause;
- resume fresh window;
- authoritative remaining-time resume where valid;
- explicit-deadline resume;
- one-time deadline override;
- explicit reconciliation endpoint;
- immutable Incident snapshots/lifecycle state;
- atomic audits;
- PostgreSQL constraints/triggers protecting policy and Incident invariants.

Protected Phase 1 control routes under `/api/v1` include:

- `GET /checkin/operator/switch/policy`
- `PUT /checkin/operator/switch/policy`
- `POST /checkin/operator/switch/pause`
- `POST /checkin/operator/switch/resume`
- `PUT /checkin/operator/switch/deadline-override`
- `POST /checkin/operator/switch/reconcile`

Phase 1 still has **no real external Action execution**. Triggered switch state is authoritative switch state only.

## Current frontend state

The first Phase 1 frontend integration was added to `CMXChat/First-Repo/main` and deployed through GitHub Pages.

The integration includes:

- policy-driven public interval/grace validation instead of requiring exactly 72 hours;
- dedicated `checkin-phase1-controls.js` and `.css` layers;
- protected Settings UI wiring for policy read/update, pause, resume, and one-time deadline override;
- existing cookie-session + CSRF security reuse;
- paused-state presentation;
- responsive/mobile work;
- no intentional production switch mutation.

Last functional Phase 1 frontend-control commit before continuity documentation:

`102e7c07aba77daf811eb8f1c48bde2e69055fe6` — `Harden Check In settings text wrapping`

Detailed handoff commit:

`61730d7bb39c718eae5c62f10429042c0c9fa6b0`

The first CURRENT correction was then added after the real Samsung screenshot. This file may move `main` again through later documentation-only commits; do not confuse those with functional frontend changes.

## Current observed frontend problems

The first real Samsung/Android Chrome screenshot after Phase 1 frontend integration revealed two important issues. These are the **active work being handled now**.

### 1. Settings is not visible on the observed mobile page

The screenshot showed:

- Check In branding;
- Access;
- Dark / Light theme control;
- bottom nav: Status / Records / Actions / Activity.

There was no visible Settings gear/button.

Current source **does** contain:

- top-bar `#mobileSettings`;
- sidebar `#openSettings`.

Current narrow-screen CSS also deliberately hides the separate `#mobileNavSettings` item.

Therefore do not assume Settings was never implemented and do not blindly add a duplicate Settings control. Diagnose why the intended existing affordance is absent in the real mobile render.

### 2. Public status is degraded on the observed mobile page

The same screenshot showed:

- `Status unavailable`;
- `SYNC REQUIRED`;
- `CONNECTING`;
- countdown `--:--:--`;
- `status data partially available`;
- Last Check In `Never`;
- Next Due `Unavailable`.

That is not the expected production state. The backend previously passed approved-origin browser health/public-status checks.

Do not assume the backend is down from the screenshot alone. Diagnose from evidence. Relevant areas include public fetch behavior, status-contract normalization/validation, JavaScript errors, cache/deployment state, CORS/Cloudflare behavior, and layered presentation logic.

## Active completion gate — do this before the automation engine

The other context window is already working on the frontend issue. **Do not redirect it into roadmap/backend work. Do not start over.**

The current active gate is `tasks.md` T034-T040:

1. Diagnose and repair real Samsung `SYNC REQUIRED` / `Status unavailable` behavior.
2. Determine why the existing `#mobileSettings` affordance is not visible and fix the proven cause.
3. Reverify truthful public status/countdown on the real mobile browser.
4. Perform locked Settings visual/privacy audit on mobile and desktop.
5. Unlock only when ready and perform the first protected **GET-only** policy read.
6. Verify the UI truthfully represents current 72+24 policy/window.
7. Verify manual lock/session expiry removes private control state.
8. Add targeted regression coverage if the diagnosed failure mode warrants it.

Do **not** publish policy timing, pause, resume, override a deadline, reconcile, or record a check in merely to satisfy this gate.

If another context is already actively implementing these repairs, let that context finish the gate. The roadmap alignment below is for **after** the gate passes.

# Approved product direction after the frontend gate

The long-term product is a private automation/delegation control plane.

Human mental model:

```text
WHEN something happens
IF rules are true
DO actions
WAIT / REPEAT when configured
THEN react to outcomes
```

The realistic target is **IFTTT-class workflow/orchestration power for the providers and use cases we deliberately connect**, while going deeper in the areas Check In owns:

- private Records/People/Organizations/Documents/Digital Assets;
- switch and contingency Incident state;
- immutable versions and historical explanation;
- server-owned schedules;
- multi-step routing;
- retries/timeouts;
- acknowledgements;
- approvals;
- durable execution receipts;
- bounded AI Tasks and later bounded AI Agents.

We are **not** trying to recreate the full IFTTT/Zapier/Make/n8n integration catalog ourselves.

Core rule:

> **Build the control plane. Rent the capabilities.**

External providers supply email, SMS, Discord, AI, webhooks/APIs, storage, and future capabilities. Check In owns definitions, permissions, durable timing/state, history, orchestration, approvals, and what happens next.

## Why this direction is realistically buildable by us

Do not build a platform-sized abstraction in one shot. Every phase below has a narrow exit gate and can be learned, tested, deployed, and recovered independently.

Use the existing FastAPI + PostgreSQL foundation. Do not migrate the whole frontend to React or add a complex worker framework merely because larger products use one.

Prefer the simplest safe infrastructure that proves the next behavior. For the first runtime, prefer PostgreSQL-backed due-work claiming/leases unless real scale or operational evidence justifies Redis or another queue later.

Provider integrations are added **one at a time**, after fake execution works. AI Agent work is deliberately late.

## Approved executable roadmap

`jay-app/specs/003-server-checkin/tasks.md` is the active checklist. The stages are:

### Engine Phase 2A — typed Automation definitions

First backend milestone after the frontend gate.

Build only enough to store, validate, version, preview, and publish useful Automation definitions:

- `Automation`;
- immutable `AutomationVersion`;
- small typed Trigger registry;
- small typed Action registry;
- stable protected targets/references;
- only the Conditions and Routes needed by the first slice;
- graph/reference validation;
- `DRAFT → REVIEW → PUBLISHED → ARCHIVED` lifecycle;
- protected CRUD/publish APIs;
- authorization, cross-switch, schema, and graph tests.

**No external side effects. No scheduler yet.**

### Engine Phase 2B — private human builder

Build the private `/checkin` Automation builder around:

```text
WHEN / IF / DO / WAIT / THEN
```

The older compact flow:

```text
ACTION / TARGET / WHEN / CONTENT / REVIEW
```

remains useful as the editor for **one action step inside the Automation**. It is not the architecture of the entire workflow.

The frontend edits backend drafts, shows a human-readable review, and publishes only through backend validation.

### Engine Phase 3 — durable runtime with fake execution

Add only what is needed to prove reliable execution semantics:

- `Run`;
- `RunAction`;
- `Occurrence`;
- `ExecutionAttempt`;
- immutable runtime snapshots;
- persisted `next_run_at` / eligibility state;
- PostgreSQL locking/lease claim model;
- stable idempotency identities;
- restart/stale-claim recovery;
- deterministic fake provider;
- append-only runtime audit;
- protected runtime status/receipt APIs.

Exit condition: a manual/scheduled fake workflow runs exactly once logically, retries/recovery are explainable, and nothing depends on a browser tab staying open.

### Engine Phase 4 — one real low-risk provider vertical slice

Choose **one** provider at implementation time based on the simplest secure and operationally reliable setup. Likely candidates are Discord or email.

Add:

- server-side Connection/secret-reference boundary;
- one typed provider adapter;
- preflight/readiness;
- bounded timeout;
- normalized/redacted result;
- monitoring appropriate to the first real worker/scheduler.

Prove one complete chain:

```text
trigger
→ Run
→ due Action
→ claim
→ worker
→ provider
→ result
→ Audit
```

Only after this works should we add more providers.

### Engine Phase 5 — deeper workflow power

Add as real workflows require them:

- success/final-failure/timeout routing;
- typed dependencies;
- bounded retries;
- persisted WAIT/repeat behavior;
- branch cancellation;
- acknowledgements;
- approvals;
- calendar recurrence/timezone/DST hardening;
- additional providers one at a time, including SMS when justified.

This is where Check In grows beyond basic one-trigger/one-action IFTTT behavior.

### Engine Phase 6 — bounded AI Task and natural-language Planner

AI Task comes first as a normal typed Action with:

- approved context IDs;
- explicit output destination;
- provider/model policy;
- runtime/token/cost limits;
- audited results;
- approval requirements where needed.

Then add the Planner only after typed schemas are stable:

```text
plain language
→ typed Automation draft
→ schema validation
→ policy validation
→ graph validation
→ human-readable preview
→ user review/publish
```

The Planner creates **drafts**, not authority.

### Engine Phase 7 — bounded AI Agent later

Only after normal runtime, provider execution, approvals, audit, typed tools, limits, and simulation are trustworthy.

Server-enforced grants must define allowed Records, People, Organizations, Connections, tools, communications, cost, steps, runtime, approvals, outputs, and stop conditions. Prompt text can never expand those grants.

## First practical vertical slice

Do not begin by implementing birthdays + Discord + email + SMS + AI all together.

The first post-frontend slice should be intentionally small enough for us to understand end to end:

1. one Automation draft/version;
2. one simple trigger such as `manual` or one existing switch event;
3. a tiny typed action chain with no real external side effect;
4. publish/preview validation;
5. then fake durable execution;
6. then replace exactly one fake capability with one real low-risk provider.

This sequence proves the architecture without making the next task an unfinishable platform rewrite.

## Acceptance rule: frontend drawings are not capabilities

A feature is real only when the backend proves the corresponding behavior.

- Definition is real when backend can validate/version/persist it.
- Runtime is real when due work survives restarts and duplicate claims safely.
- Provider Action is real when server executes it with safe credentials/idempotency and persists a truthful result.
- Route is real when runtime outcomes activate it deterministically.
- WAIT is real when it is persisted/scheduled server-side, not when JavaScript sleeps.
- AI delegation is real only when permissions, context, limits, tools, audit, and approvals are enforced server-side.

Until those gates exist, the frontend must not claim an Action is armed, sent, executed, delivered, released, or completed.

## Public/private and security guardrails

Preserve all current boundaries:

- public status stays sanitized and read only;
- private records/action definitions/policy/activity stay behind private access;
- Secure HttpOnly operator session cookie;
- double-submit CSRF;
- exact production mutation Origin `https://db.cmxchat.com`;
- no operator key/JWT/CSRF/private content/private policy in localStorage/sessionStorage;
- no owner ID/switch UUID/database credentials in public frontend;
- no arbitrary Python/JavaScript/shell/SQL/`eval` Action or Condition;
- no unrestricted arbitrary webhook destinations;
- raw provider credentials stay server-side behind Connection/secret references;
- external side effects require idempotency and durable server history;
- high-risk/destructive operations require stronger policy and later approvals.

## Samsung/mobile performance guardrail

A real Samsung/Android browser previously became unresponsive because broad MutationObserver behavior interacted with frequently changing countdown text.

Do not add:

- full-document MutationObservers;
- full-page `characterData` observation;
- whole-page rescans every second;
- observer callbacks that rewrite the same observed target without guards;
- browser-owned scheduling for real Actions.

The mobile frontend must remain a renderer/controller, never the automation scheduler.

## Master-plan audit result

The durable architecture in `CHECKIN-MASTER-PLAN.md` already supports the approved IFTTT-class direction: Automation, Trigger, Condition, Action, Run, Incident, RunAction, Occurrence, ExecutionAttempt, scheduler, provider adapters, approvals, acknowledgements, AI Task, Planner, Agent, and Test Center are all part of that design.

We therefore **do not need to replace the master architecture or create another competing master document**.

Some pre-Phase-1 status language inside the master plan is historical now. Current contexts should not restart Phase 1 from those passages. `tasks.md` is the executable roadmap; this CURRENT handoff records the live cross-repository state; the master plan remains the architecture/invariant reference.

## Files to inspect before frontend changes

After this file, read the longer handoff:

- `docs/checkin-context-handoff-2026-08-17.md`

Then inspect current source as needed:

- `checkin/index.html`
- `assets/checkin/checkin.js`
- `assets/checkin/checkin-status-contract.js`
- `assets/checkin/checkin-phase1-controls.js`
- `assets/checkin/checkin-phase1-controls.css`
- `assets/checkin/checkin-refine.css`
- `assets/checkin/checkin-legibility.css`
- `assets/checkin/checkin.css`

Do not broadly rewrite the page or assume an old screenshot represents current source.

## Files to read before post-frontend backend work

In `CMXChat/jay-app`:

1. `specs/003-server-checkin/HANDOFF.md`
2. `specs/003-server-checkin/FRONTEND-BACKEND-NEXT.md`
3. `specs/003-server-checkin/tasks.md`
4. `specs/003-server-checkin/ACTION-BUILDER-NEXT.md`
5. `specs/003-server-checkin/CHECKIN-MASTER-PLAN.md`
6. current backend models/services/routes/migrations relevant to the active task.

Read actual implementation before assuming target architecture already exists.

## Do-not list

- Do not interrupt the other context's current frontend repair to start Phase 2.
- Do not describe the live switch as weekly.
- Do not casually change production 72+24 timing.
- Do not mutate production merely to verify controls.
- Do not claim configured Actions execute today.
- Do not add scheduler/providers/AI during the frontend completion gate.
- Do not expose private data publicly.
- Do not weaken cookie/CSRF/Origin/CORS boundaries.
- Do not add broad DOM observers.
- Do not make a browser tab responsible for consequential execution.
- Do not add a giant provider catalog before one vertical slice works.
- Do not add a giant drag-and-drop workflow editor before typed definitions/runtime exist.
- Do not migrate frontend frameworks solely because the engine is becoming more capable.
- Do not add autonomous AI before typed runtime, audit, permissions, approvals, and simulation.
- Do not ask the user to paste production secrets into chat.
- Do not reproduce the SMTP credential exposed in earlier diagnostic output. Before final project closeout, remind the user to rotate the active SMTP credential if that has not already happened.

## Exact current next move

Continue the frontend diagnosis already underway in the other context window.

The next successful milestone is **not** Phase 2. It is:

```text
healthy truthful public status on real Samsung
+
reachable intended Settings entry point
+
locked Settings privacy/visual audit
+
protected GET-only policy verification
+
manual lock/session-expiry verification
```

After that gate passes, begin only Engine Phase 2A from `tasks.md`: typed/versioned Automation definitions with no external side effects.
