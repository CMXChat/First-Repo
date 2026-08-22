# Continuum Frontend Week — CURRENT

Last updated: 2026-08-22
Status: **APPROVED OPERATING CHECKPOINT — EMAIL + REQUESTS V2 LANDED**

## Purpose

This file preserves the practical operating plan for the current frontend-focused week. It is a companion to `docs/continuum-frontend-roadmap-CURRENT.md`, not a replacement for backend contracts.

Use it when recovering the current frontend week so we do not have to reconstruct decisions from chat history.

## Current checkpoint

The coordinated frontend work has now landed in three important checkpoints:

- First-Repo PR #133 / merge `5babbb2b9c7fd11a8f7f3b527e1517b4147cb396`: master frontend roadmap, `/email/` v3 protected backend integration, `/requests/` v1 contact-import doorway.
- First-Repo PR #134 / merge `2272bdee9cdc2140b5ddc92d7121517ce1a0dd42`: durable frontend-week operating checkpoint.
- First-Repo PR #135 / merge `da98f22072adbc15471ac919463dd1ae8ede2eb8`: `/requests/` v2 Email safe-simulation operation and shared protected API adapters.

Current practical frontend truth:

- `/email/` is the dedicated manual Email workspace and remains wired to the protected Directory → Connection/SenderIdentity → Library → Automation → Runtime → receipt contracts where deployed.
- `/requests/` can preview and approve batch Person + email ContactMethod creation where Directory APIs are deployed.
- `/requests/` v2 can also resolve an exact sender and recipient, preview a typed Email request with zero writes, then on explicit approval drive the same Library → Automation → Runtime path in **safe simulation** mode.
- Real SMTP remains intentionally absent from Requests and disabled for the current Email acceptance pass.
- Browser storage remains non-authoritative and direct browser-to-PostgreSQL access remains forbidden.
- Undeployed backend capabilities are surfaced as deployment boundaries rather than replaced with browser-local fake success.

The stacked `jay-app` backend remains separate from this frontend checkpoint. Backend PR #24 is still the canonical stacked development truth and is not made production-live by frontend work.

## What Requests v2 actually proves

Requests v2 is intentionally a small useful operator surface rather than a fake universal command center.

### Contacts

`pasted contact lines → local preview → explicit approval → protected Person create → protected email ContactMethod create → durable IDs/results`

Contact writes are sequential. If Person creation succeeds and ContactMethod creation fails, the Person remains durable and Requests reports the partial result rather than pretending the batch was atomic.

### Email

Email preview performs protected reads only:

`From/To/message → resolve Directory Person + ContactMethod → resolve Connection + SenderIdentity + readiness → show exact IDs/message → explicit approval`

Approved safe simulation performs:

`ContentAsset/Draft → immutable ContentVersion → manual Email Automation Draft → preflight → Review → Publish → Runtime Run(provider_mode=fake) → explicit development processing where available → typed receipt`

This is the **same Email architecture** used by `/email/`; Requests does not create a second sending engine.

## Validation evidence for Requests v2

PR #135 focused validation passed:

- Continuum Requests source contract;
- desktop/mobile Contacts + Email preview with zero mutations;
- full browser safe-simulation orchestration through the mocked backend contract;
- Continuum Email source + desktop/mobile browser validation after the shared API changed;
- CMX Static Validation;
- Navigation Link Guard;
- Secret Scan.

The full browser execution proof clicked the actual Requests approval control and observed nine approved mutations in the expected order. Every mutation carried CSRF, the Run used a unique idempotency key and `provider_mode:"fake"`, no request contained `real_smtp`, and the page rendered the typed receipt.

That proof validates the **frontend orchestration and contract shape**. It does not mean the stacked Email APIs have been deployed to production.

## What "safe simulation" means

Safe simulation is real internal backend workflow with the final external provider effect simulated.

When the backend stack is available, the internal durable facts may be real:

- Person / ContactMethod;
- ContentAsset / Draft / ContentVersion;
- Automation / AutomationVersion;
- Runtime Run / Attempts;
- Why/provenance;
- typed receipt.

Only the final provider side effect is simulated, so no external email is delivered.

This is not fake frontend data. It is the safe acceptance mode for proving the real internal chain before external side effects are enabled.

Product-facing language should prefer **safe simulation** or **simulated delivery** unless the backend field name itself is being discussed.

## What can still be done this frontend-focused week without new backend coding

There is still substantial useful work available without starting another backend slice.

Frontend work can:

1. Verify canonical `/email/` and `/requests/` after Pages publication whenever live verification is available.
2. Remove stale active-source `/lab/...` navigation links and converge the shared shell on canonical routes.
3. Improve shared protected-session/unlock UX and backend-state language across protected routes.
4. Strengthen `/directory/` as the next cohesive backend-backed surface, including clear lifecycle/error/deployment states and the Requests → Directory loop.
5. Connect/polish `/library/` against the durable ContentAsset/Draft/Version contracts that are actually available.
6. Improve `/control/` and `/checkin/` projections of real operational/backend state.
7. Continue `/automations/` Runtime/history/receipt projection without disrupting the established editor work.
8. Add additional typed `/requests/` adapters only for already-verified backend contracts.
9. Improve Runtime/receipt/history presentation without creating another Runtime implementation.
10. Add desktop/mobile/accessibility validation and surface-specific handoffs.
11. Record exact production-vs-stacked deployment gaps discovered by the frontend.

The goal for the week remains: **make the frontend completely ready for the backend foundation already built, without inventing frontend workarounds for missing server capability.**

## What cannot be completed purely from frontend work

The following require later deliberate backend/configuration/deployment work if they are not already production-live:

- merging the stacked `jay-app` backend work;
- applying its production database migration;
- deploying the newer Directory/Connection/Library/Automation/Runtime endpoints to `api.cmxchat.com`;
- confirming/configuring the real provider Connection and verified SenderIdentity for real delivery;
- confirming SMTP credential rotation/readiness;
- enabling a bounded real SMTP acceptance path;
- building a generic durable scheduler;
- building a general assistant/AI action bridge.

The frontend must clearly distinguish these boundaries from frontend defects.

## Real Email acceptance sequence

Do not jump directly from frontend wiring to unrestricted real mail.

Preferred sequence:

1. Prove the complete simulated delivery path.
2. Inspect the resulting typed Runtime receipt and failure/ambiguity behavior.
3. Verify the intended real sender exists as a configured, ready SenderIdentity on the correct Connection.
4. Verify the intended recipient through Directory/contact identity.
5. Confirm provider credentials/readiness on the server.
6. Make one explicit, bounded real-email acceptance decision.
7. Send one deliberate test through the backend Runtime path only.
8. Inspect the real receipt/provider outcome before expanding use.

The stacked backend proof contract currently names `team@cmxchat.com` as the proof sender and `cmxchat@gmail.com` as the bounded proof recipient, but the frontend must still resolve the real backend IDs/readiness. Text strings are not authority.

## Current frontend execution order

Default sequence unless a new blocker changes priorities:

1. Canonical navigation/shared-shell cleanup and protected-session consistency.
2. Strengthen `/directory/` and the `Requests → Directory → Email` loop.
3. Connect/polish `/library/` against durable content/version contracts.
4. Improve `/control/` and `/checkin/` projections of real operational state.
5. Continue `/automations/` Runtime/history/receipt projection without disrupting the established editor.
6. Add another useful typed `/requests/` adapter only when it maps cleanly to an existing backend contract.
7. Keep updating handoffs with exact production-vs-stacked gaps.

The useful product loop to preserve is:

`Requests → create/plan → Directory/Library hold durable identity/content → Email/Automations define work → Runtime executes → Receipt proves what happened`

## Assistant-control boundary

The eventual direction is for an authenticated assistant to become another interface over Continuum.

That does **not** exist merely because `/requests/` exists.

Current assistant/frontend work can prepare typed operations and UI, but direct assistant execution requires a deliberate authenticated action bridge into Continuum APIs. Time-based actions additionally require a durable server-side scheduling layer.

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
