# Continuum Email — CURRENT

Last updated: 2026-08-22

## Route ownership

`/email/` is the only canonical Continuum Email page.

The earlier physical `/lab/email/` compatibility page and `/lab/` launcher have been retired by the broader Continuum route graduation. Do not recreate either one.

A stale request for `/lab/email/` may be compatibility-forwarded by the global `404.html` + `assets/continuum-legacy-route-redirect.js` layer to `/email/`, but `/lab/email/` is not registered and owns no file, state or implementation.

The current public deployment problem observed on `db.cmxchat.com/email/` is intentionally outside this route-graduation slice. Do not infer that Email is live merely because the canonical source exists.

## Purpose

`/email/` is a protected development/proving surface for one exact manual Email action. It is not an inbox, campaign manager, generic SMTP client, scheduler or unattended-authority surface.

## Canonical backend source

The implementation follows `jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md` on the active reconciliation/API-handbook backend work. Backend OpenAPI/generated-client contracts remain executable truth. The relevant backend stack has not been proven production-live from this frontend.

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
- `POST /checkin/operator/automations/{automation_id}/runs/{run_id}/process` (DEVELOPMENT ONLY)
- `GET /checkin/operator/automations/{automation_id}/runs/{run_id}/receipt`

Protected mutations fetch the current CSRF token from the protected operator session and send `X-CSRF-Token`; all calls use protected cookies with `credentials: include`. Provider credentials, operator keys, CSRF tokens, private content and canonical server objects are not persisted into localStorage/sessionStorage.

## Real SMTP boundary

The browser never talks to SMTP directly and never reads provider credentials. Real SMTP remains backend-restricted to the server-managed binding, compatible sender and authorized proof recipient. The frontend provides no arbitrary-recipient bypass.

The real flow remains deliberately two-stage: Request Run, then Process now. SMTP `accepted` means provider/server acceptance, not independent inbox-delivery proof. Ambiguous external outcomes must never be automatically retried or presented as confirmed success.

## Unsupported by design

No CC/BCC, attachments, bulk send, arbitrary recipients, sender substitution, schedules, recurring sends, AI initiation, Planner initiation, unattended sends, generic Authority controls or automatic retry of ambiguous external effects.

## Failure truth

- Protected backend unavailable/session expired: show unavailable; never substitute browser fake data.
- Directory or selector read failure: never reinterpret it as confirmed empty canonical data.
- `409` Draft conflict: surface it; never overwrite blindly.
- Preflight unavailable/failing: Review/Publish stay blocked.
- Backend readiness unavailable: do not guess SMTP capability.
- Ambiguous provider outcome: expose receipt/reconciliation truth and never auto-resend.

## Files

- `email/index.html` — sole canonical protected Email shell.
- `assets/lab/lab-email-api-v1.js` — disposable static transport for the proving surface; eventual React should use the generated `jay-app` client.
- `assets/lab/lab-email-v1.js` — orchestration/presentation for the manual Email proof.
- `assets/lab/lab-email-v1.css` — responsive presentation.
- `tests/continuum-email-lab-v1.test.js` — canonical Email source contract plus retired-route assertion.
- `.github/workflows/continuum-email-lab-validation.yml` — source and desktop/mobile validation for `/email/`.
- `assets/continuum-legacy-route-redirect.js` — global stale-route compatibility map, including `/lab/email/` → `/email/`.

## Acceptance state

FRONTEND SOURCE: implemented at `/email/`.

PUBLIC ROUTE OBSERVED WORKING: NO in the latest user check. The user observed the site's custom restricted 404 at `db.cmxchat.com/email/`. Route graduation does not attempt to solve that deployment issue.

BACKEND LIVE ACCEPTANCE PROVEN: NO. Do not call Email live until the protected backend stack is authorized/deployed and the full browser acceptance flow has been observed.

## Live acceptance checklist for later

- `db.cmxchat.com/email/` actually serves the canonical page
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

## Route-graduation boundary

Do not add Authority, unattended execution, CC/BCC, attachments, arbitrary recipients or production backend deployment as part of route cleanup. Do not create another Email implementation under `/lab/`.

For the current URL architecture, `docs/continuum-route-graduation-CURRENT.md` supersedes older Lab-route assumptions.
