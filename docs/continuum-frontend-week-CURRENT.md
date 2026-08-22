# Continuum Frontend Week — CURRENT

Last updated: 2026-08-22
Status: **APPROVED OPERATING CHECKPOINT**

## Purpose

This file preserves the practical operating plan agreed after the first `/email/` + `/requests/` frontend slice landed. It is a companion to `docs/continuum-frontend-roadmap-CURRENT.md`, not a replacement for backend contracts.

Use it when recovering the current frontend week so we do not have to reconstruct decisions from chat history.

## Current checkpoint

First-Repo PR #133 merged the first coordinated frontend slice to `main` at commit `5babbb2b9c7fd11a8f7f3b527e1517b4147cb396`.

That slice:

- documents the master frontend roadmap;
- upgrades canonical `/email/` to the protected-session/backend-aware v3 workspace;
- adds canonical `/requests/` v1 as a preview-before-write operator doorway;
- keeps browser storage non-authoritative;
- keeps direct browser-to-PostgreSQL access forbidden;
- keeps real SMTP disabled for the initial acceptance pass;
- surfaces undeployed backend capabilities truthfully instead of inventing local success.

The stacked `jay-app` backend remains separate from this frontend checkpoint. Backend PR #24 is still the canonical stacked development truth and is not made production-live by frontend work.

## What can be done during this frontend-focused week without new backend coding

There is substantial useful work available without starting another backend slice.

Frontend work can:

1. Verify `/email/` and `/requests/` on the canonical live site after Pages publication.
2. Improve shared protected-session/unlock UX and backend-state language across protected routes.
3. Remove stale active-source `/lab/...` navigation links and use canonical routes.
4. Project existing backend contracts more clearly through `/directory/`, `/library/`, `/automations/`, `/control/`, `/checkin/` and related surfaces.
5. Add typed `/requests/` adapters for backend operations that already have verified API contracts.
6. Improve Runtime/receipt/history presentation without creating another Runtime implementation.
7. Add desktop/mobile/accessibility validation and surface-specific handoffs.
8. Record exact production-vs-stacked deployment gaps discovered by the frontend.

The goal for the week is: **make the frontend completely ready for the backend foundation already built, without inventing frontend workarounds for missing server capability.**

## What cannot be completed purely from frontend work

The following require later deliberate backend/configuration/deployment work if they are not already production-live:

- merging the stacked `jay-app` backend work;
- applying its production database migration;
- deploying those newer Directory/Connection/Library/Automation/Runtime endpoints to `api.cmxchat.com`;
- configuring a real provider Connection and verified SenderIdentity where needed;
- enabling a real SMTP acceptance path;
- building a generic durable scheduler;
- building a general assistant/AI action bridge.

The frontend must clearly distinguish these boundaries from frontend defects.

## `/requests/` next approved direction: Email request planning

`/requests/` v1 currently proves batch Person + email ContactMethod creation.

The next useful adapter may let the user express an Email request such as:

> Send a test email from team@cmxchat.com to this person saying hello.

That must **not** mean `/requests/` sends mail directly or bypasses `/email/` architecture.

The intended flow is:

`user request → typed Email proposal → preview exact sender/recipient/message → explicit approval → existing Library/Automation/Runtime APIs → typed receipt`

Rules:

1. `/requests/` may parse or collect the requested sender, recipient and message for a proposed operation.
2. Sender text such as `team@cmxchat.com` is not sufficient authority. The backend must resolve/verify a real Connection + SenderIdentity and readiness.
3. Recipient must resolve to the real Directory Person + active email ContactMethod where the backend contract requires those IDs.
4. The exact message must enter the existing content/version flow rather than becoming browser-only canonical content.
5. The Email action must use the existing manual Automation and Runtime path; no second sending route is created.
6. A preview is not execution. Approval is required before consequential writes/runs.
7. If the required production endpoint is not deployed, the UI stops and reports that boundary.
8. `/requests/` must never claim that an assistant or the static page can send a real email when the backend/provider path is unavailable.

The initial implementation can still provide a useful typed preview even while the production backend is missing later execution endpoints, as long as it never presents that preview as a completed backend operation.

## What "safe simulated email" means

The current Email acceptance mode uses the backend's fake/simulated provider boundary first.

Plain-language meaning:

- the Person is real backend data;
- the frozen message/version is real backend data;
- the Automation/AutomationVersion is real backend data;
- the Runtime Run, Attempt, Why/provenance and receipt are real backend data;
- only the final external email-provider effect is simulated, so no external email is delivered.

This is not fake frontend data. It is a safe execution test mode for proving the real internal chain before external side effects are enabled.

The user does not need to remember the term "fake provider". Product-facing language should prefer **safe simulation** or **simulated delivery** unless the backend field name itself is being discussed.

## Real Email acceptance sequence

Do not jump directly from frontend wiring to unrestricted real mail.

Preferred sequence:

1. Prove the complete simulated delivery path.
2. Inspect the resulting typed Runtime receipt and failure/ambiguity behavior.
3. Verify the intended real sender exists as a configured, ready SenderIdentity on the correct Connection.
4. Verify the intended recipient through Directory/contact identity.
5. Make one explicit, bounded real-email acceptance decision.
6. Send one deliberate test through the backend Runtime path only.
7. Inspect the real receipt/provider outcome before expanding use.

`team@cmxchat.com` is a candidate sender discussed for testing, **not assumed to be configured or authorized**. Its actual Connection/SenderIdentity/readiness must be read from the backend before any real-send control is enabled.

## Current frontend order after the first Email/Requests slice

Default sequence unless a new blocker changes priorities:

1. Verify canonical `/email/` and `/requests/` live after deployment.
2. Clean shared shell/navigation and protected-session UX.
3. Strengthen `/directory/` as the next cohesive backend-backed surface.
4. Connect/polish `/library/` against the durable content/version contracts that are actually available.
5. Improve `/control/` and `/checkin/` projections of real operational/backend state.
6. Continue `/automations/` Runtime/history/receipt projection without disrupting the established editor work.
7. Add additional typed `/requests/` adapters, including Email planning where the existing contracts support it.
8. Keep updating handoffs with exact production-vs-stacked gaps.

The useful product loop to preserve is:

`Requests → create/plan → Directory/Library hold durable identity/content → Email/Automations define work → Runtime executes → Receipt proves what happened`

## Assistant-control boundary

The eventual direction is for an authenticated assistant to become another interface over Continuum.

That does **not** exist merely because `/requests/` exists.

Current assistant/front-end work can prepare typed operations and UI, but direct assistant execution requires a deliberate authenticated action bridge into Continuum APIs. Time-based actions additionally require a durable server-side scheduling layer.

Future principle:

**One backend, many interfaces.** Browser pages, `/requests/`, and a future assistant interface must all use the same backend identity, permissions, immutable versions, Runtime and receipts.

No secret AI bypass is part of the plan.

## Explicit no-go shortcuts during this week

Do not use frontend work to fake or bypass:

- undeployed backend endpoints;
- direct PostgreSQL writes;
- provider credentials in browser code;
- direct browser SMTP;
- real-email success without a backend receipt;
- browser-local records presented as durable server truth;
- generic scheduling that depends on the tab remaining open;
- assistant authority that bypasses backend rules;
- alternate execution paths around canonical Runtime.

## Recovery order

When resuming this frontend week, read:

1. `docs/continuum-frontend-roadmap-CURRENT.md`
2. this file
3. `docs/continuum-email-lab-CURRENT.md`
4. `docs/continuum-requests-CURRENT.md`
5. the relevant surface-specific `docs/*-CURRENT.md`
6. current First-Repo `main` / open PRs
7. `CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md` on the active stacked backend ref

Never infer that a backend capability is production-live just because the frontend supports it or stacked backend tests prove it.
