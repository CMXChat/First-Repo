# Continuum Email — CURRENT

## Purpose

`/email/` is the canonical protected development/proving route for one exact manual Email action. It is not an inbox, campaign manager, generic SMTP client, scheduler, or unattended-authority surface.

`/lab/email/` is retained only as a compatibility redirect to `/email/`. Do not build a second Email implementation under `/lab`.

## Canonical backend source

The implementation follows `jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md` on the active reconciliation/API-handbook branch. Backend OpenAPI/generated client remain executable truth. The relevant backend stack is not production-deployed yet.

## Product flow

1. Read protected People and choose a stable `person_id`.
2. Read that Person's active email ContactMethods and choose a stable `contact_method_id`.
3. Read Connections and SenderIdentities, then consume backend `ConnectionReadinessFactsPublic` instead of reproducing readiness logic in the browser.
4. Create an action-scoped text ContentAsset. Subject is the ContentAsset title; body is the ContentDraft `source_text`.
5. Update ContentDraft with `expected_revision`; save immutable ContentVersion.
6. Create an Automation, update its Draft with one manual trigger + one Email action + immediate start + finish, using exact Person/ContactMethod/Connection/SenderIdentity/ContentAsset UUIDs.
7. Call authoritative preflight. Only if ready, Review then Publish immutable AutomationVersion; publication resolves the exact ContentVersion.
8. Request a manual Runtime Run with `provider_mode=fake` or `provider_mode=real_smtp`.
9. Processing remains an explicit second user action and calls the existing DEVELOPMENT ONLY process control. Real mode requires an extra confirmation and remains backend-restricted.
10. Read the typed Runtime execution receipt and present frozen historical inputs, Attempts, Why/events, provider/ambiguity and reconciliation facts.

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

Protected mutations fetch the current CSRF token from the protected operator session and send `X-CSRF-Token`; all calls use the protected cookie with `credentials: include`. No provider credentials, operator key, CSRF token, private content, or canonical objects are persisted to localStorage/sessionStorage.

## Real SMTP boundary

The browser never talks to SMTP directly and never inspects server configuration. The backend currently restricts real SMTP to the server-managed binding, exact compatible sender, and the authorized proof recipient. The frontend does not create an arbitrary-recipient bypass.

The real flow is deliberately two-stage: Request Run, then Process now. The second action is labeled as a development control because the consumed process endpoint is development-only. A real Run can have an external side effect. `accepted` means SMTP-server acceptance, not independent inbox delivery.

## Unsupported by design in v1

No CC/BCC, attachments, bulk send, arbitrary recipients, sender substitution, schedules, recurring sends, AI initiation, Planner initiation, unattended sends, AuthorityGrant controls, generic retry button, or automatic retry of ambiguous external effects.

## Failure truth

- Protected backend unavailable/session expired: show unavailable; do not fall back to fake browser data.
- Directory or selector read fails: do not reinterpret it as empty canonical data.
- `409` draft conflict: surface failure; do not overwrite blindly.
- Preflight failure/unavailable: do not allow Review/Publish.
- Real backend readiness unavailable: do not guess SMTP capability.
- Ambiguous provider outcome: receipt should expose ambiguity/reconciliation truth; never claim success or resend automatically.

## Files

- `email/index.html` — canonical protected Email shell.
- `lab/email/index.html` — compatibility redirect only.
- `assets/lab/lab-email-api-v1.js` — disposable thin static transport for the current proving surface. Final React should use the generated `jay-app` client.
- `assets/lab/lab-email-v1.js` — orchestration/presentation for the manual Email proof.
- `assets/lab/lab-email-v1.css` — responsive presentation.
- `tests/continuum-email-lab-v1.test.js` — source contract, now anchored to `/email/`.
- `.github/workflows/continuum-email-lab-validation.yml` — source + desktop/mobile geometry validation for `/email/`.

## Route integration

Canonical URL: `https://db.cmxchat.com/email/`.

The `/lab/` terminal-tree launcher still exposes Email as a `PROVING` surface, but its row and `email` / `open email` commands navigate to `/email/`. The old `/lab/email/` path redirects to `/email/` and owns no Email state or logic.

## Acceptance state

STATIC ROUTE IMPLEMENTATION: ready for Pages deployment once merged to `main`.

BACKEND LIVE ACCEPTANCE PROVEN: NO. The backend stack used by this page is not currently production-deployed. A real protected browser acceptance pass must wait for authorized backend migration/deployment and protected-session reachability.

## Live acceptance checklist

- `/email/` is served by `db.cmxchat.com` after Pages deployment
- `/lab/email/` redirects to `/email/`
- protected session works from `db.cmxchat.com` to `api.cmxchat.com`
- at least one active Person with active email ContactMethod exists
- usable Connection + SenderIdentity exist
- Connection readiness is authoritative and available
- create/freeze ContentVersion succeeds
- Automation Draft/preflight/Review/Publish succeeds
- fake accepted Run completes and receipt is truthful
- fake transient/permanent cases render correctly
- controlled real manual Run is only attempted with the authorized recipient/sender/configuration and explicit owner confirmation
- inbox receipt is recorded separately from SMTP acceptance if independently observed
- ambiguous result never auto-retries

## Stop boundary

Do not add Authority, unattended execution, CC/BCC, attachments, arbitrary recipients or production backend deployment as part of this route relocation. Do not duplicate the Email UI under `/lab`.
