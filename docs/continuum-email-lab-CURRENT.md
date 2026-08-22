# Continuum Email — CURRENT

Last updated: 2026-08-22
Canonical route: `/email/`
Frontend generation: **v3 protected backend integration + exact Runtime receipt navigation**

## Purpose

`/email/` is the protected manual Email workspace. It projects the existing Continuum backend contracts rather than creating a browser-owned sending system.

Canonical chain:

`Person → email ContactMethod → Connection → SenderIdentity/readiness → ContentAsset/Draft → immutable ContentVersion → Automation Draft/preflight/Review/Publish → manual Runtime Run → typed receipt/Why`

The backend remains authoritative. The frontend never writes directly to PostgreSQL, invents readiness, reconstructs historical truth from mutable objects, stores canonical Email truth in browser storage or substitutes local fake success for an unavailable API.

## Protected session

Email uses the protected operator-session contract.

1. `GET /api/v1/checkin/operator/session` checks for an existing protected session.
2. A missing/expired session exposes inline unlock.
3. `POST /api/v1/checkin/operator/unlock` submits the operator key directly to the backend.
4. The operator key is immediately cleared and is never saved in localStorage/sessionStorage.
5. The backend cookie carries the protected session.
6. Protected mutations carry `X-CSRF-Token` and remain subject to exact Origin checks.
7. **End protected session** deletes the session and returns Email to locked state.

Shared session/error behavior is in `assets/continuum-operator-api-v1.js`. Email retains `assets/lab/lab-email-api-v1.js` as its bounded domain adapter while using the same backend contract.

## Backend-state truth

Email distinguishes:

- **LOCKED** — protected session required;
- **CONNECTED** — session and probed Email dependencies are available;
- **PARTIAL** — session works but one or more dependencies are unavailable;
- **NOT DEPLOYED** — session works while a newer stacked route is absent on the deployed API;
- **DENIED** — Origin/protected access rejected;
- **OFFLINE / UNAVAILABLE** — network/server failure.

Frontend readiness is not production deployment.

## Production vs stacked backend

Canonical backend handbook:

`CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md`

Current stacked ref remains `dev/durable-trigger-consumption` / draft backend PR #24. The newer Directory, Connection/SenderIdentity, Library, Automation, Runtime and receipt contracts are source-built/validated but are not made production-live by this frontend work.

Therefore this remains a valid live outcome:

`unlock succeeds → newer Email dependency returns 404 → Email reports NOT DEPLOYED`

Do not manufacture browser-local success beyond that boundary.

## Recipient identity

After a protected session, Email loads real People and that Person's active email ContactMethods. Exact Person and ContactMethod UUIDs are preserved into the Automation definition.

Email address is not Person identity.

## Sender capability

Email loads real Connections, SenderIdentities and authoritative backend readiness. The browser never receives provider credentials and never decides SMTP capability itself.

A typed sender string such as `team@cmxchat.com` is not authority. It must resolve to the exact backend SenderIdentity on an appropriate Connection with server-reported readiness.

## Durable content

The rich composer is presentation-only. Sanitized normalized text is projected to the backend text field; private message content is not persisted in browser storage.

**Freeze message version** performs:

`create ContentAsset + initial Draft → PUT Draft with expected_revision → POST immutable ContentVersion`

Draft conflicts remain backend-owned `409` behavior. A stale browser does not silently overwrite newer server state.

The immutable ContentVersion is what later execution can reference exactly even if the working Draft changes afterward.

## Automation

When recipient, sender and frozen content are ready, Email creates a manual Email Automation Draft with exact IDs and calls authoritative preflight.

Current definition remains bounded:

- `schema_version: 1`;
- manual trigger;
- no conditions;
- one typed Email action;
- exact Connection, SenderIdentity, Person, ContactMethod and ContentAsset IDs;
- immediate start;
- finish.

Review and Publish create immutable AutomationVersion truth. Publication is not provider delivery.

## Runtime acceptance mode

Frontend acceptance remains **safe simulation only**.

Safe simulation means the internal Continuum chain is real backend/runtime state where the APIs are deployed:

- Person / ContactMethod;
- ContentAsset / Draft / ContentVersion;
- Automation / AutomationVersion;
- Runtime Run / Attempt;
- Why/events;
- typed receipt.

Only the final outside email-provider effect is simulated. No external email is sent.

The explicit development Process control remains visible where that route exists. If the process route is not deployed, Email reports that boundary rather than pretending the Run completed.

## Real SMTP boundary

Real SMTP remains intentionally disabled in the frontend acceptance pass.

The stacked backend contains a tightly bounded direct manual-owner SMTP path, but current real-send acceptance remains a separate deliberate decision. The frontend must not enable it merely because source support exists.

Browser invariants:

- never speak directly to SMTP;
- never receive provider credentials;
- never bypass sender/recipient/readiness restrictions;
- never infer authority from a sender string;
- never automatically retry ambiguous external effects.

## Typed receipt and exact Control handoff

After a Run exists, Email reads the typed Runtime receipt. Historical execution is rendered from the frozen receipt rather than reconstructed from whatever Directory or Library says today.

The receipt can include:

- Run and AutomationVersion identity/state;
- manual-owner authority mode;
- provider mode;
- frozen Person/ContactMethod;
- frozen Connection/SenderIdentity;
- exact ContentAsset/ContentVersion/checksum;
- Attempts;
- Why/events;
- provider ambiguity/reconciliation state.

The current frontend slice also exposes:

`Open this Run in Control`

using only:

`/control/?automation_id=<exact Automation UUID>&run_id=<exact Run UUID>`

Those query parameters are navigation identifiers only. They do not grant access or authority. `/control/` still requires the normal protected session and reloads the canonical receipt from the backend.

The URL deliberately does **not** include operator keys, CSRF values, recipient/sender addresses, subject/body content or provider secrets.

## Complete Email browser proof

The focused Email Runtime browser proof now exercises the current frontend chain against a mocked backend boundary:

`protected session → Person/ContactMethod → Connection/SenderIdentity/readiness → ContentAsset/Draft → immutable ContentVersion → Automation Draft → preflight → Review → Publish → fake Runtime Run → explicit development process → typed receipt → exact Control handoff`

The proof verifies:

- nine protected workflow mutations in the expected sequence;
- CSRF on every protected mutation;
- Run `provider_mode: "fake"`;
- no mutation payload contains `real_smtp`;
- the typed receipt contains exact frozen identity/content references;
- the exact Automation/Run IDs become the Control navigation link;
- protected IDs/content do not become localStorage/sessionStorage truth;
- no external email is sent.

This proves frontend orchestration and safety semantics. It does **not** prove production deployment of the stacked backend routes.

## Unsupported by design in this pass

- real SMTP execution from this frontend acceptance path;
- CC/BCC;
- attachments;
- bulk delivery;
- arbitrary-recipient bypass;
- schedules/recurring sends;
- AI initiation;
- generic Authority controls;
- automatic retry of ambiguous provider effects.

## Canonical files

- `email/index.html`
- `assets/continuum-operator-api-v1.js`
- `assets/continuum-runtime-receipt-link-v1.js`
- `assets/lab/lab-email-api-v1.js`
- `assets/lab/lab-email-v3.js`
- `assets/lab/lab-email-workspace-v2.js`
- `assets/lab/lab-email-v1.css`
- `assets/lab/lab-email-desktop-scale-v1.css`
- `assets/lab/lab-email-backend-v3.css`
- `tests/continuum-email-lab-v1.test.js`
- `tests/continuum-email-runtime-v3-browser.js`
- `tests/continuum-runtime-receipt-control-link-v1-browser.js`
- `.github/workflows/continuum-email-lab-validation.yml`
- `.github/workflows/continuum-runtime-receipt-navigation-validation.yml`

`assets/lab/lab-email-v1.js` remains historical source and is not the canonical v3 orchestrator.

## Acceptance target

Frontend safe-simulation target:

`unlock → Directory recipient → Connection/Sender readiness → freeze ContentVersion → create/preflight/review/publish AutomationVersion → request fake Runtime Run → explicitly process where development endpoint exists → typed receipt → open exact Run in Control`

If the deployed backend stops earlier, record the exact boundary. Never fake the remainder.

## Recovery

1. `docs/continuum-frontend-roadmap-CURRENT.md`
2. `docs/continuum-frontend-week-CURRENT.md`
3. this file
4. `email/index.html`
5. `assets/lab/lab-email-v3.js`
6. `assets/continuum-operator-api-v1.js`
7. `assets/continuum-runtime-receipt-link-v1.js`
8. `assets/lab/lab-email-workspace-v2.js`
9. `assets/lab/lab-email-api-v1.js`
10. current backend integration handbook in `CMXChat/jay-app`

Do not recreate `/lab/email/`, do not move canonical Email truth into browser storage and do not infer production capability from browser proof.
