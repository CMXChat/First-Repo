# Continuum Email — CURRENT

Last updated: 2026-08-22

## Route ownership

`/email/` is the only canonical Continuum Email page.

The earlier physical `/lab/email/` compatibility page and `/lab/` launcher are retired. A stale request for `/lab/email/` may be compatibility-forwarded by the global `404.html` + `assets/continuum-legacy-route-redirect.js` layer to `/email/`, but `/lab/email/` owns no file, state or implementation.

PUBLIC ROUTE OBSERVED WORKING: **YES** on 2026-08-22 after the GitHub Pages deployment queue was recovered and current `main` published.

BACKEND LIVE ACCEPTANCE PROVEN: **NO**. The frontend route being live does not mean the stacked backend contracts are production-deployed.

## Purpose

`/email/` is a protected development/proving surface for one exact manual Email action.

It is designed to prove this connected path:

Person
→ email ContactMethod
→ Connection
→ SenderIdentity
→ action-scoped ContentAsset Draft
→ immutable ContentVersion
→ Automation Draft
→ preflight
→ Review
→ immutable AutomationVersion
→ manual Runtime Run
→ typed receipt / Why

Authority scope on this surface is manual owner only. Unattended Authority, schedules, AI initiation, bulk delivery and generic provider execution remain unavailable here.

## Current frontend presentation

The 2026-08-22 workspace refresh deliberately removed the earlier green/black terminal-like presentation.

Current visual rules:

- light theme is the default;
- dark theme uses rich neutral black/charcoal surfaces with blue Continuum accents;
- green is reserved for narrow success/readiness semantics;
- the page uses an application workspace layout instead of a large landing-page hero;
- recipient, sender, message, review, Run and receipt remain the same functional sequence;
- navigation uses the canonical `/control/`, `/directory/`, `/automations/` and `/library/` routes.

The Message step now reuses the established Continuum rich-composer behavior:

- Write / Preview modes;
- paragraph, H2 and H3 blocks;
- bold, italic, underline and strikethrough;
- unordered and ordered lists;
- block quote;
- safe links;
- divider;
- undo / redo;
- formatting cleanup;
- paste sanitization.

The rich editor does **not** create a second canonical content store. It projects the current composed message into the existing hidden `bodyInput`, and the established Email orchestration still sends normalized text into the real ContentDraft/ContentVersion backend contract. No private message content is persisted into localStorage or sessionStorage by the rich-composer layer.

This preserves the existing backend proof while giving the user a real document-style composer.

## Canonical backend source

The implementation follows `jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md`.

Backend OpenAPI/generated-client contracts remain executable truth. Stacked development proof is not production deployment.

## Product flow

1. Read protected People and choose a stable `person_id`.
2. Read that Person's active email ContactMethods and choose a stable `contact_method_id`.
3. Read Connections and SenderIdentities and consume authoritative backend readiness.
4. Create an action-scoped text ContentAsset and ContentDraft.
5. Save the Draft with `expected_revision` and freeze an immutable ContentVersion.
6. Create an Automation Draft containing one manual trigger, one Email action, immediate start and finish, using exact stable object IDs.
7. Run authoritative preflight, then Review and Publish an immutable AutomationVersion only when allowed.
8. Request a manual Runtime Run with `provider_mode=fake` or tightly bounded `provider_mode=real_smtp`.
9. Processing remains an explicit second user action through the existing DEVELOPMENT ONLY process control.
10. Read the typed Runtime receipt with frozen inputs, Attempts, Why/events, provider ambiguity and reconciliation facts.

## Exact backend calls consumed

All under `/api/v1`:

- `GET /checkin/operator/session`
- `GET /checkin/operator/directory/people`
- `GET /checkin/operator/directory/people/{person_id}/contact-methods`
- `GET /checkin/operator/connections`
- `GET /checkin/operator/connections/{connection_id}/sender-identities`
- `GET /checkin/operator/connections/{connection_id}/readiness`
- `POST /checkin/operator/library/content`
- `PUT /checkin/operator/library/content/{content_id}/draft`
- `POST /checkin/operator/library/content/{content_id}/versions`
- `POST /checkin/operator/automations`
- `PUT /checkin/operator/automations/{automation_id}/draft`
- `GET /checkin/operator/automations/{automation_id}/preflight`
- `POST /checkin/operator/automations/{automation_id}/review`
- `POST /checkin/operator/automations/{automation_id}/publish`
- `POST /checkin/operator/automations/{automation_id}/runs`
- `POST /checkin/operator/automations/{automation_id}/runs/{run_id}/process` — DEVELOPMENT ONLY
- `GET /checkin/operator/automations/{automation_id}/runs/{run_id}/receipt`

Protected mutations fetch the current CSRF token from the protected operator session and send `X-CSRF-Token`. Calls use protected cookies with `credentials: include`.

Provider credentials, operator keys, CSRF tokens, private content and canonical server objects are not persisted into localStorage/sessionStorage.

## Real SMTP boundary

The browser never speaks SMTP directly and never reads provider credentials.

Real SMTP remains backend-restricted to the server-managed binding, compatible sender and authorized proof recipient. The frontend provides no arbitrary-recipient bypass.

The real flow remains deliberately two-stage:

Request Run
→ explicit Process now

SMTP `accepted` means provider/server acceptance. It is not independent inbox-delivery proof.

Ambiguous external outcomes stay visible as ambiguity and must never be automatically retried.

## Unsupported by design

This surface does not add:

- CC/BCC
- attachments
- bulk send
- arbitrary recipients
- sender substitution
- schedules
- recurring sends
- AI initiation
- Planner initiation
- unattended sends
- generic Authority controls
- automatic retry of ambiguous external effects

## Failure truth

- Protected backend unavailable/session expired: show unavailable and never substitute browser fake data.
- Directory or selector read failure: never reinterpret failure as confirmed empty canonical data.
- `409` Draft conflict: surface it and reload current truth.
- Preflight unavailable/failing: Review/Publish stay blocked.
- Backend readiness unavailable: do not guess SMTP capability.
- Ambiguous provider outcome: expose receipt/reconciliation truth and never auto-resend.

## Files

- `email/index.html` — canonical protected Email workspace.
- `assets/lab/lab-email-api-v1.js` — disposable static transport for the proving surface; eventual React should use the generated `jay-app` client.
- `assets/lab/lab-email-v1.js` — canonical Email backend orchestration.
- `assets/lab/lab-email-workspace-v2.js` — presentation-only rich composer, sanitization, Write/Preview modes, theme toggle and freeze-state lock.
- `assets/lab/lab-email-v1.css` — neutral Continuum application presentation and responsive layout.
- `tests/continuum-email-lab-v1.test.js` — canonical route/backend/rich-composer contract checks.
- `.github/workflows/continuum-email-lab-validation.yml` — source plus desktop/mobile interaction validation.
- `assets/continuum-legacy-route-redirect.js` — stale `/lab/email/` compatibility forwarding.

## Current acceptance state

FRONTEND SOURCE: implemented at `/email/`.

PUBLIC ROUTE OBSERVED WORKING: YES.

CANONICAL LEGACY REDIRECT OBSERVED WORKING: YES for the broader `/lab/...` compatibility layer during the 2026-08-22 Pages recovery.

BACKEND LIVE ACCEPTANCE PROVEN: NO.

## Live backend acceptance checklist for later

- protected session works from `db.cmxchat.com` to the API origin
- active Person + active email ContactMethod are available
- usable Connection + SenderIdentity exist
- authoritative Connection readiness is available
- ContentVersion freeze succeeds
- Automation Draft/preflight/Review/Publish succeeds
- fake accepted/transient/permanent Runs produce truthful receipts
- any controlled real Run uses only authorized recipient/sender/configuration with explicit owner confirmation
- inbox delivery is recorded separately if independently observed
- ambiguous provider outcome never auto-retries

## Recovery

Frontend-only recovery starts with:

1. `email/index.html`
2. `assets/lab/lab-email-v1.css`
3. `assets/lab/lab-email-workspace-v2.js`
4. `assets/lab/lab-email-v1.js`
5. `assets/lab/lab-email-api-v1.js`
6. this file
7. the current backend integration handbook in `CMXChat/jay-app`

Do not recreate `/lab/email/`.

Do not move Email canonical truth into browser storage.

Do not turn rich-editor HTML into a new independent backend contract. The current proof intentionally continues to freeze normalized text through the established ContentDraft/ContentVersion path.
