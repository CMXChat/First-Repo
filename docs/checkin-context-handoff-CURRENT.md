# Check In Context Handoff — CURRENT

Date: 2026-08-17
Status: Current cross-repository continuation guide

This is the first file a new ChatGPT/Codex context should read for Check In.

It records the **current active work** and the **approved post-Phase-1 direction**. It complements the longer historical handoff at `docs/checkin-context-handoff-2026-08-17.md`.

If another context is already working on the current frontend gate, continue that work. Do not restart the project from the roadmap.

## 1. Source-of-truth order

1. **This file** — newest cross-repository state and immediate continuation.
2. `CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-NEXT.md` — current frontend/backend integration state.
3. `CMXChat/jay-app/specs/003-server-checkin/tasks.md` — active executable checklist and phase gates.
4. `CMXChat/jay-app/specs/003-server-checkin/CHECKIN-MASTER-PLAN.md` — updated durable architecture and realistic automation roadmap.
5. `CMXChat/jay-app/specs/003-server-checkin/ACTION-BUILDER-NEXT.md` — approved Automation/Actions UX and domain mapping.
6. `CMXChat/jay-app/specs/003-server-checkin/HANDOFF.md` — canonical backend release/deployment continuity journal.
7. `docs/checkin-context-handoff-2026-08-17.md` — extensive history for this work period.

The master plan was refreshed after the Phase 1 production release. Its current-production and roadmap sections now reflect the live Phase 1 backend and the approved automation-engine direction.

## 2. Current production backend truth

Phase 1 backend is fully live and production verified.

Exact reviewed Render application release:

`de55627926316581808337f8e9c10d26e7d64588`

Production Alembic revision:

`c41f9b8d2e70`

Recorded Aiven recovery checkpoint before migration:

`2026-08-17 17:04:13 UTC`

Production verification already passed for:

- exactly one expected primary switch;
- valid current/current-window policy pointers;
- policy version 1;
- UTC authoritative timing;
- interval `259200` seconds = 72 hours;
- grace `86400` seconds = 24 hours;
- compatibility fields 72/24;
- zero orphan policy pointers;
- zero Incidents and zero active Incidents at release verification;
- active-Incident uniqueness protection;
- published-policy immutability protection;
- approved-origin browser health HTTP 200 body `true`;
- public status HTTP 200;
- unauthenticated protected policy read HTTP 401 with `Operator unlock required`.

The temporary release mutation freeze was released after verification. No production policy change, pause, resume, deadline override, reconcile, Action execution, or test check in was performed during release verification.

Do not confuse later documentation commits on `jay-app/main` with the exact reviewed application SHA running on Render unless a later deploy is explicitly verified.

## 3. Current switch semantics

The live switch is not weekly.

```text
successful protected check in
→ backend records actual server timestamp
→ 72 elapsed hours
→ deadline
→ 24 elapsed hour grace
→ triggered state
```

A successful check in resets the next deadline exactly 72 elapsed hours after the server-authoritative timestamp. PostgreSQL/server UTC is authoritative.

Old 168-hour/weekly compatibility history exists in older git/migration history. Do not resurrect it as current behavior.

## 4. Phase 1 backend capabilities already real

The backend now supports:

- immutable versioned switch policies;
- configurable interval/grace values;
- current published policy pointer;
- current-window policy pointer;
- apply policy starting next successful check in;
- recalculate current window;
- explicit-current-deadline publication;
- pause;
- fresh resume;
- authoritative remaining-time resume where valid;
- explicit-deadline resume;
- one-time deadline override;
- reconciliation;
- immutable Incident snapshots/lifecycle state;
- atomic Audit behavior;
- PostgreSQL constraints/triggers protecting policy/Incident invariants.

Important protected routes under `/api/v1` include:

- `GET /checkin/operator/switch/policy`
- `PUT /checkin/operator/switch/policy`
- `POST /checkin/operator/switch/pause`
- `POST /checkin/operator/switch/resume`
- `PUT /checkin/operator/switch/deadline-override`
- `POST /checkin/operator/switch/reconcile`

Phase 1 still has **no external Action execution**.

A `triggered` switch means authoritative switch state only. It does not mean configured email/SMS/Discord/webhook/document/AI Actions were sent or executed.

## 5. Current frontend integration

The first Phase 1 frontend integration is in `CMXChat/First-Repo/main` and deployed through GitHub Pages.

It added:

- policy-driven timing validation instead of requiring exactly 72 hours;
- `assets/checkin/checkin-phase1-controls.js`;
- `assets/checkin/checkin-phase1-controls.css`;
- protected Settings wiring for policy read/update, pause, resume, and deadline override;
- reuse of the existing protected cookie session + CSRF model;
- paused-state presentation;
- responsive/mobile work;
- no intentional production switch mutation.

Relevant earlier functional frontend commits include:

- `5c6a95eb2e50b899c72ed76a9611d7d70f53702f` — policy-driven timing contract;
- `844e1728a148ae1adefcbfb8aab4d1e33831445c` — Phase 1 controls;
- `c8abf72fc76149ed91053af1cf57a6f20f771489` — controls wired into Check In;
- `f3ebea04070a1c40690f1e5b39d8e844b7aeb2ac` — controls hardened;
- `8f1ee107c77aa8df50bc6e95dfb6dd2e8f756550` — timing bounds aligned;
- `7f22bcbbfade5e075eb5ffc7c64ebe5101b31c6a` — paused/mobile polish;
- `102e7c07aba77daf811eb8f1c48bde2e69055fe6` — settings text wrapping.

Earlier desktop package fix that must remain intact:

- `36d95a0142bcbb9230046cc4b942570bb78ae7f6`.

## 6. Samsung issues found, fixes already committed, live acceptance still pending

The first real Samsung/Android screenshot after Phase 1 frontend integration showed two issues:

- `SYNC REQUIRED / Status unavailable / CONNECTING` even though backend browser smoke had previously passed;
- no visible mobile Settings gear despite `#mobileSettings` existing in source.

Two narrow frontend fixes were then committed:

### Status/timer fix

Commit:

`2faa3d3f715b93667fe5ed913f91b0a62d34f989` — `Decouple Check In timer status from aggregate counts`

What it changed:

`checkin-status-contract.js` no longer treats aggregate inventory-count fields as required for the server-authoritative timer to be schema-compatible. Interval/grace validity controls the timer contract; missing/stale aggregate counts fall back to presentation defaults instead of forcing `SYNC REQUIRED`.

This is intentionally narrow. It does not change backend timing or production switch state.

### Mobile Settings-entry fix

Commit:

`ac091472dc67edb299d1826a9d89c5377adfc718` — `Restore mobile Check In settings entry point`

What it changed:

On screens up to 430px, `#mobileSettings` is explicitly displayed as the intended top-bar Settings control. It does not add a duplicate bottom-nav Settings destination.

### Current acceptance state

The code fixes exist, but **real-device verification remains the active gate**.

Do not treat the commits alone as proof that the live Samsung page is now correct. Continue with `tasks.md` T036-T040 and only close T034/T035 once the working context is satisfied the diagnosed causes/fixes are correct.

The next real actions are:

1. hard refresh/reload the live Samsung page after the new frontend deploy reaches it;
2. verify public status/countdown are truthful again;
3. verify the top-bar Settings gear is visible/reachable;
4. perform locked Settings visual/privacy audit on mobile and desktop;
5. unlock only when ready and perform the first protected **GET-only** policy read;
6. verify the UI represents the authoritative current 72+24 policy/window correctly;
7. verify manual lock/session expiry removes private controls/state;
8. add targeted regression coverage if the diagnosed failure warrants it.

Do **not** publish policy timing, pause, resume, override a deadline, reconcile, or record a check in merely to complete this gate.

If another context is already running these checks, let it finish. Do not redirect it into backend roadmap work.

## 7. Approved product direction after the frontend gate

Check In is intentionally evolving into a private automation/delegation control plane.

Human mental model:

```text
WHEN something happens
IF rules are true
DO actions
WAIT / REPEAT when configured
THEN react to outcomes
```

The realistic target is **IFTTT-class trigger/action and workflow usefulness for the providers we deliberately connect**, with deeper private orchestration than simple one-trigger/one-action recipes.

Check In should own:

- durable Automation definitions;
- immutable versions;
- Switch/Incident state;
- schedules;
- conditions;
- targets and protected records;
- Runs;
- Occurrences;
- Execution Attempts;
- retries/timeouts;
- routing;
- acknowledgements;
- approvals;
- audit history;
- provider references;
- bounded AI permissions.

External providers supply capabilities such as email, SMS, Discord, AI, object storage, and approved APIs/webhooks.

Core principle:

> **Build the control plane. Rent the capabilities.**

We are not trying to reproduce the entire IFTTT/Zapier/Make/n8n integration marketplace ourselves.

## 8. Why the roadmap is realistically doable by us

The implementation is intentionally split into narrow vertical slices using the existing FastAPI + PostgreSQL foundation.

Do not:

- build a platform-sized abstraction all at once;
- rewrite the whole frontend into React merely because the backend gets more capable;
- add Redis/Celery/Dramatiq/RQ simply because large systems use them;
- add many providers before one fake and one real vertical slice work;
- start AI Agent work early;
- build a giant drag-and-drop workflow editor first.

Prefer PostgreSQL-backed durable claims/jobs first if they satisfy reliability requirements. Add a separate queue only when real evidence justifies it.

A small reliable engine with a few excellent provider adapters is more valuable than a fragile engine claiming dozens of integrations.

## 9. Approved executable roadmap after the frontend gate

`CMXChat/jay-app/specs/003-server-checkin/tasks.md` is the concrete checklist.

### Engine Phase 2A — typed Automation definitions

First backend milestone after the frontend gate.

Build:

- `Automation`;
- immutable `AutomationVersion`;
- small typed Trigger registry;
- small typed Action registry;
- stable protected targets/references;
- only Conditions/Routes needed by the first slice;
- graph/reference/cycle validation;
- `DRAFT → REVIEW → PUBLISHED → ARCHIVED` lifecycle;
- protected CRUD/publish APIs;
- schema/authorization/cross-switch tests.

No external side effects. No scheduler yet.

### Engine Phase 2B — private human builder

Evolve the private `Actions` area around:

```text
WHEN / IF / DO / WAIT / THEN
```

The compact step-editing flow:

```text
ACTION / TARGET / WHEN / CONTENT / REVIEW
```

is the editor for **one DO step**, not the architecture of the entire Automation.

Start with a structured linear/card builder. Do not build a freeform drag-and-drop canvas first.

### Engine Phase 3 — durable runtime with fake provider

Add:

- `Run`;
- `RunAction`;
- `Occurrence`;
- `ExecutionAttempt`;
- immutable runtime snapshots;
- persisted due times;
- PostgreSQL lock/lease claim model;
- stable idempotency identities;
- restart/stale-claim recovery;
- deterministic fake provider;
- append-only runtime Audit;
- protected runtime status/receipt APIs.

Exit condition: fake workflows run reliably without the browser staying open and survive duplicate claims/restarts correctly.

### Engine Phase 4 — one real low-risk provider

Choose one provider based on the simplest secure/operational setup.

Preferred candidate: approved Discord webhook Connection.

Transactional email is an acceptable alternative if clearly simpler at implementation time.

Prove:

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

Only then add more providers.

### Engine Phase 5 — deeper workflow power

Add as real workflows require them:

- success/final-failure/timeout routes;
- typed dependencies;
- retries;
- persisted WAIT/repeat behavior;
- branch cancellation;
- acknowledgements;
- approvals;
- calendar recurrence/timezone/DST hardening;
- additional providers one at a time, including SMS when justified.

### Engine Phase 6 — AI Task + natural-language Planner

AI Task first:

- approved context IDs;
- explicit output;
- model/provider policy;
- runtime/token/cost limits;
- audited result;
- approval where needed.

Then Planner:

```text
plain language
→ typed Automation draft
→ schema validation
→ policy validation
→ graph validation
→ human-readable preview
→ user review/publish
```

Planner creates drafts. It does not create authority.

### Engine Phase 7 — bounded AI Agent later

Only after normal runtime, providers, approvals, audit, typed tools, limits, and simulation are trustworthy.

Server-enforced grants define allowed records, people, organizations, Connections, tools, communication rights, budget, steps, runtime, approvals, outputs, and stop conditions.

Prompt text can never expand those permissions.

## 10. Acceptance rule: drawings are not capabilities

A frontend card does not make a capability real.

- A definition is real when the backend validates, versions, and persists it.
- Runtime is real when due work survives restarts/duplicate claims safely.
- Provider Action is real when the server executes it idempotently with safe credential boundaries and stores a truthful result.
- WAIT is real when persisted server-side, not when JavaScript sleeps.
- A route is real when runtime outcomes activate it deterministically.
- AI delegation is real only when context, tools, permissions, limits, audit, and approvals are enforced server-side.

Until these gates exist, do not claim Actions are armed, sent, delivered, released, executed, or completed.

## 11. Security/public-private guardrails

Preserve:

- sanitized read-only public status;
- private records/action definitions/policy/activity behind private access;
- Secure HttpOnly operator session cookie;
- double-submit CSRF;
- exact mutation Origin `https://db.cmxchat.com`;
- no operator key/JWT/CSRF/private policy/private content in localStorage/sessionStorage;
- no owner ID/switch UUID/database credentials in public frontend;
- no raw provider credentials in Action JSON, Records, Audit, prompts, or frontend;
- no arbitrary Python/JavaScript/shell/SQL/`eval` Actions or Conditions;
- no unrestricted arbitrary webhook destinations;
- idempotency and durable history for external side effects;
- stronger policy/approvals before destructive operations.

## 12. Samsung/mobile performance guardrail

A real Samsung/Android browser previously became unresponsive because broad DOM observation interacted with the frequently changing countdown.

Do not add:

- full-document `MutationObserver`;
- full-page `characterData` observation;
- whole-page rescans every countdown tick;
- observer callbacks that repeatedly mutate their own observed target.

Use targeted state/events.

## 13. Files to inspect before frontend changes

Read current source before editing:

- `checkin/index.html`
- `assets/checkin/checkin.js`
- `assets/checkin/checkin-status-contract.js`
- `assets/checkin/checkin-phase1-controls.js`
- `assets/checkin/checkin-phase1-controls.css`
- `assets/checkin/checkin-refine.css`
- `assets/checkin/checkin-legibility.css`
- other `assets/checkin/*` files only as needed.

Do not broadly rewrite `/checkin` from screenshots or memory.

## 14. Files to inspect before backend automation work

After the active frontend gate passes, read:

- `specs/003-server-checkin/tasks.md`;
- `specs/003-server-checkin/CHECKIN-MASTER-PLAN.md`;
- `specs/003-server-checkin/ACTION-BUILDER-NEXT.md`;
- current backend models/services/routes/migrations/tests.

Then implement only the active checklist slice.

## 15. Learning/working style

The user is learning backend development while building this.

When explaining concepts, use short beginner-friendly explanations tied to this project.

For implementation, prefer one clear next action at a time unless a full plan is explicitly requested.

Codex/Codespaces credits are limited. If ChatGPT can safely inspect/change First-Repo through GitHub directly, do not burn Codex unnecessarily.

## 16. Security cleanup still owed

An SMTP credential was exposed earlier in diagnostic output. Never reproduce it in chat, docs, commits, prompts, or logs.

Before final overall project closeout, remind the user to rotate the active SMTP credential if that has not already been done.
