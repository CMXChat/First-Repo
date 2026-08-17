# Check In Context Handoff — CURRENT

Date: 2026-08-17

This file is the **current correction layer** for the longer `docs/checkin-context-handoff-2026-08-17.md` handoff. A new context should read this file **first**, then read the longer handoff for full backend, deployment, architecture, security, and frontend history.

This file supersedes the **Immediate next agenda** in the older handoff where the two disagree.

## Current observed state

The first Phase 1 backend release is still the previously verified production release documented in the long handoff. No production switch mutation was intentionally performed by the frontend integration work.

The first Phase 1 frontend integration was added to `CMXChat/First-Repo/main`, including the configurable timing contract and the new private Settings control layer.

However, the first real Samsung/Android screenshot taken after that integration revealed two important live frontend issues that must be investigated before continuing the planned Settings verification.

### 1. Settings is not currently visible on the real mobile page

On the Samsung/Android Chrome screenshot at approximately 2:53 PM EDT on 2026-08-17, the visible top bar contained:

- Check In branding;
- Access;
- Dark / Light theme control.

There was **no visible Settings gear/button**.

The bottom mobile navigation contained exactly:

- Status;
- Records;
- Actions;
- Activity.

There was no Settings item there either.

This means the previous instruction to simply "open Settings while locked" is not currently possible from the observed mobile UI.

Important source fact: current `checkin/index.html` does contain a top-bar button with id `mobileSettings` and a sidebar button with id `openSettings`. Current `checkin-refine.css` also deliberately hides the separate `#mobileNavSettings` item on narrow screens. Therefore do **not** assume the Settings implementation was never added. Investigate why the intended top-bar `#mobileSettings` affordance is not visible in the actual mobile render before changing anything.

Do not blindly add a second Settings control until the existing CSS/layout/JS layers are understood.

### 2. Public status is currently degraded in the real mobile screenshot

The same live screenshot showed:

- `Status unavailable`;
- `SYNC REQUIRED`;
- `CONNECTING`;
- countdown `--:--:--`;
- `status data partially available`;
- Last Check In `Never`;
- Next Due `Unavailable`.

This is **not** the expected live state. The backend had already passed approved-origin browser smoke verification before this frontend integration, including HTTP 200 health and public status.

Do not conclude from the screenshot alone that the backend is down. The failure could be in the current browser request, frontend status contract, deployment/cache state, CORS/Cloudflare path, JavaScript, or another presentation/data integration layer. Diagnose it from evidence.

## Correct immediate priority

The immediate task is now **frontend production verification and repair**, not Phase 2 and not a production switch mutation.

Work in this order:

1. Inspect the current deployed/source frontend before editing.
2. Determine why the live Samsung/Android page is showing `SYNC REQUIRED` / `Status unavailable` even though the backend previously passed browser smoke.
3. Determine why the existing `#mobileSettings` top-bar affordance is not visible in the real mobile layout.
4. Fix only the proven frontend issue(s), preserving the current mobile design, public/private boundary, auth, CSRF, exact Origin behavior, and targeted-observer performance protections.
5. Recheck the public live status on Samsung/Android.
6. Once status is healthy and Settings is reachable, perform the **locked Settings visual audit**.
7. Only after that, unlock the existing private session and perform the first **read-only** protected policy verification.
8. Verify manual lock/session expiry clears private control state correctly.
9. Do not publish policy timing, pause, resume, override a deadline, reconcile, or record a check in merely to test the UI.

If another context is already actively working on these frontend repairs, **do not restart or redirect that work just because the roadmap documents below were updated**. The roadmap alignment is for the work that follows this frontend completion gate.

## Automation roadmap alignment made after this screenshot

The durable master architecture already pointed toward a private automation/delegation engine. The implementation documents in `CMXChat/jay-app` have now been tightened so future contexts do not accidentally build a shallow Actions form, jump straight into provider integrations, or attempt an unfinishable platform rewrite.

The approved long-term mental model remains:

`WHEN something happens → IF rules are true → DO actions → WAIT/REPEAT → THEN react to outcomes`

The realistic goal is IFTTT-class workflow/orchestration power for the providers and use cases we deliberately connect, with deeper Check In features around private Records, switch/Incident state, durable history, approvals, acknowledgements, retries, routing, and bounded AI.

We are **not** trying to reproduce the entire IFTTT/Zapier/Make provider catalog ourselves.

Principle:

**Build the control plane; rent capabilities.**

The post-frontend sequence is now explicitly documented in `jay-app/specs/003-server-checkin/tasks.md` and aligned with `ACTION-BUILDER-NEXT.md`:

1. typed Automation definitions/versioning only;
2. private human builder using `WHEN / IF / DO / WAIT / THEN`;
3. durable Run/Occurrence/Attempt runtime with a deterministic fake provider;
4. one real low-risk provider vertical slice, likely Discord or email depending on implementation-time security/operational simplicity;
5. routing, retries, timeouts, persisted waits/repeats, acknowledgements, approvals, calendar hardening, and additional providers only as needed;
6. bounded AI Task;
7. natural-language Planner that creates a validated **draft** for review/publish;
8. bounded AI Agent much later after normal runtime, approvals, audit, tool permissions, limits, and simulation are trustworthy.

Do not combine those into one implementation. Each stage has an exit gate so it can be learned, tested, deployed, and recovered independently.

Important: the old compact Action editing idea `ACTION → TARGET → WHEN → CONTENT → REVIEW` has **not** been thrown away. It is now explicitly treated as the step editor for one Action inside the larger Automation builder. It is not the architecture of the whole workflow.

## Files to review before changing code

Read the longer cross-repository handoff first after this file:

- `docs/checkin-context-handoff-2026-08-17.md`

Then inspect current First-Repo source, especially:

- `checkin/index.html`
- `assets/checkin/checkin.js`
- `assets/checkin/checkin-status-contract.js`
- `assets/checkin/checkin-phase1-controls.js`
- `assets/checkin/checkin-phase1-controls.css`
- `assets/checkin/checkin-refine.css`
- `assets/checkin/checkin-legibility.css`
- `assets/checkin/checkin.css`

Inspect other `assets/checkin/*` layers only as needed. Do not broadly rewrite the page.

For backend contract/current production truth and future implementation direction, review in this order:

1. `CMXChat/jay-app/specs/003-server-checkin/HANDOFF.md`
2. `CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-NEXT.md`
3. `CMXChat/jay-app/specs/003-server-checkin/tasks.md`
4. `CMXChat/jay-app/specs/003-server-checkin/ACTION-BUILDER-NEXT.md`
5. `CMXChat/jay-app/specs/003-server-checkin/CHECKIN-MASTER-PLAN.md`

`CHECKIN-MASTER-PLAN.md` remains the durable architecture source of truth. Its older Section 38, `Tomorrow: Start Here`, describes the pre-Phase-1 work plan and is historical now that Phase 1 is live. For the current executable sequence, use `FRONTEND-BACKEND-NEXT.md` + `tasks.md` + `ACTION-BUILDER-NEXT.md` while preserving the master plan's architecture/invariants.

## Important guardrails

- Do not start Phase 2 until the current frontend completion gate is passed.
- Do not describe the live switch as weekly.
- Do not casually change the production 72 hour + 24 hour policy.
- Do not mutate production just to verify the frontend.
- Do not claim configured Actions execute today.
- Do not expose private record/action/activity/policy details publicly.
- Do not weaken Secure HttpOnly session, CSRF, exact Origin, CORS, or session clearing behavior.
- Do not put operator key, JWT, CSRF token, private content, or private policy state into localStorage/sessionStorage.
- Do not add broad document-wide MutationObservers or countdown-triggered full-page text scans. A Samsung/Android freeze was already caused by observer churn in an earlier frontend version.
- Do not ask the user to paste production secrets into chat.
- Do not reproduce the SMTP credential that was exposed in an earlier diagnostic screenshot. Remind the user to rotate it before final project closeout if that has not already happened.
- Do not make the browser the scheduler. Real execution must survive a closed page and server restarts.
- Do not add arbitrary executable Python/JavaScript/shell/SQL Actions or Conditions.
- Do not add a giant provider catalog before one real vertical slice works.
- Do not start autonomous AI before typed runtime, permissions, approvals, audit, and simulation exist.

## What success looks like before moving on

Before Phase 1 frontend integration can be considered verified, the real page should again show valid server-backed public status, the intended Settings entry point should be clearly reachable on mobile and desktop, the locked Settings surface should expose no private values, and an unlocked session should be able to perform a protected **GET-only** policy read showing the authoritative policy/window correctly.

Only then should the project proceed to the Automation-definition milestone in `tasks.md`.

The next backend milestone is deliberately small: store, validate, version, preview, and publish typed Automation definitions **without external side effects**. That keeps the IFTTT-like direction real while keeping the next implementation achievable by us.