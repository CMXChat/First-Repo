# Continuum Frontend Gap Reconciliation — CURRENT

Last updated: 2026-08-22

Status: **FRONTEND PROVING LOOP CONNECTED — REMAINING BLOCKERS ARE MOSTLY RELEASE / CONFIGURATION, WITH A SMALL FRONTEND HARDENING QUEUE**

## Purpose

This is the source-specific answer to a practical question:

> What is actually left before Continuum's current Directory → Library → Email/Automation → Runtime → Receipt loop can be used against production backend truth?

This document reconciles current `CMXChat/First-Repo` frontend state with the current stacked `CMXChat/jay-app` backend state. It is not a production deployment claim and does not replace the canonical backend integration handbook.

Canonical backend handbook:

`CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md`

## Source checkpoints used for this reconciliation

Frontend main at reconciliation start:

`311e8c2feac73e6ea7d7f99b6a7895d2a973ad25`

That includes the connected frontend proof through First-Repo PRs #141–#144.

Backend stacked development truth:

- PR #17 — Directory and Email definition/preflight foundation — draft/open;
- PR #18 — durable Runtime + fake provider — draft/open;
- PR #19 — standalone worker / browser proof controls — draft/open;
- PR #20 — bounded direct manual-owner real SMTP path — draft/open;
- PR #21 — provider reconciliation + Authority + canonical frontend API handbook — draft/open;
- PR #24 — durable Check In trigger consumption foundation — draft/open.

PR #24 head at reconciliation time:

`753e55ebf7ef00d3814c5474552d88b90b3adc8c`

Migration head:

`c0d1e2f3a4b5`

Production remains on the older Check In / protected operator-session foundation. The stacked PR #17 → #18 → #19 → #20 → #21 → #24 chain is not merged, production-migrated, or deployed.

## What the frontend already proves

The current frontend is no longer a set of disconnected concept pages.

It now has one coherent proving loop:

`Requests / Email → Directory identity → Library content → Automation publication → Runtime → typed receipt → Control → exact Directory / Library source objects`

The important property is not the number of screens. It is that the screens increasingly refer to the same durable backend identities.

### Directory — durable identity

Canonical `/directory/` uses protected backend Person and email ContactMethod contracts where those routes are available.

The proven frontend behavior includes:

- protected operator session / Origin / CSRF handling;
- inline unlock and session recovery;
- Person list/create/update;
- email ContactMethod list/create/lifecycle;
- stable UUID display and reuse;
- exact `?person_id=<UUID>` focus after normal Directory loading;
- no protected Person/ContactMethod canonical storage in localStorage/sessionStorage;
- Organizations and Groups remain explicitly local preview concepts.

### Library — durable memory

Canonical `/library/` has a separate protected server lane for:

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

The proving flow includes:

- protected content list/create/read;
- `expected_revision` Draft updates;
- deliberate `409` conflict handling;
- preservation of unsaved browser text after a stale write;
- explicit reload/reconcile rather than blind retry;
- immutable ContentVersion creation;
- exact Version ID, Draft revision and checksum display;
- exact `?content_id=<UUID>` focus after normal Library loading;
- browser proof that later Draft edits do not rewrite an older frozen Version.

The folder/mixed-media/file/import lane remains explicitly browser-local preview. Binary object storage is not claimed.

### Email — durable manual action proof

Canonical `/email/` is the strongest full workflow proof.

Current frontend sequence:

`protected session → Person/ContactMethod → Connection/SenderIdentity/readiness → ContentAsset/Draft → immutable ContentVersion → Automation Draft → preflight → Review → Publish → Runtime Run(provider_mode=fake) → explicit development processing where available → typed receipt`

The focused browser proof verifies:

- nine protected workflow mutations in the expected order;
- CSRF on every protected mutation;
- exact Person, ContactMethod, Connection, SenderIdentity, ContentAsset and Automation references;
- Draft revision use;
- immutable ContentVersion creation;
- preflight before Review/Publish;
- unique Run idempotency key;
- `provider_mode: "fake"`;
- no `real_smtp` mutation;
- canonical Runtime processing rather than a second browser execution engine;
- typed frozen receipt;
- no protected values becoming browser-storage canonical truth.

That is frontend orchestration proof against a mocked backend boundary. It is not a production-backend proof.

### Requests — bounded operator doorway

Canonical `/requests/` currently supports two useful operation families:

1. deterministic contact-batch preview and protected Person + ContactMethod writes;
2. typed Email request preview/approval using the same Library → Automation → Runtime architecture as `/email/`.

Requests does not become an arbitrary HTTP proxy, direct PostgreSQL client, second Email engine, scheduler, or general AI execution bridge.

### Control — durable history and receipt projection

Canonical `/control/` has a protected read-only Runtime/history lane where stacked routes are available.

It can project typed receipt and Why/provenance facts and navigate exact durable references back to Directory and Library.

Email and Requests receipts can navigate the other direction to:

`/control/?automation_id=<Automation UUID>&run_id=<Run UUID>`

Only opaque navigation IDs are placed in that URL. Operator keys, CSRF values, message content, sender/recipient addresses, and provider secrets are not.

## What is already good enough for backend deployment testing

A new frontend architecture slice is **not** required before deploying the existing stacked backend for safe-simulation testing.

Once the backend stack is deliberately reviewed, merged, migrated and deployed, the existing canonical frontend is already shaped to test:

- protected sessions;
- Directory durable identity;
- Connection/Sender readiness;
- Library durable memory;
- Automation publication;
- fake Runtime execution;
- typed receipts / Why history;
- cross-surface exact-ID navigation.

This is the key reconciliation result:

**the next major blocker is not “build another frontend engine.”**

## Remaining frontend work

The remaining frontend queue is smaller and should be treated as hardening/polish, not as a reason to invent new backend behavior.

### 1. Requests should fail closed on incomplete per-record resolution

Current Requests Email preview resolves recipient/sender candidates through multiple protected lookups.

The current implementation uses settled concurrent lookups and can skip an individual rejected lookup while another lookup succeeds. Backend uniqueness plus server preflight still provide authoritative protection, so this does not create a secret bypass. However, before a real-provider production acceptance, the frontend should be stricter:

- if any lookup required to prove uniqueness fails unexpectedly, treat resolution as incomplete;
- block approval;
- explain which protected lookup failed;
- require an explicit retry/re-preview;
- never treat partial visibility as proof of uniqueness.

This is a **small frontend hardening item** and a good candidate for the next focused Requests PR.

### 2. Canonical navigation is coherent but not perfectly uniform

The main surfaces now use canonical routes and no active page relies on old `/lab/...` route links.

The shells are still intentionally different:

- Control/Directory/Library use rail-oriented navigation;
- Email/Requests use lighter task-focused top navigation;
- Check In has its own production-live application shell;
- Spaces remains a separate demo experience.

Some rails do not expose every action surface directly. That is UX polish, not a data-integrity or execution blocker.

Do not force visual uniformity merely for symmetry. A future shell pass may add consistent discoverability for Email/Requests without making Check In or Spaces lie about their different product boundaries.

### 3. CSP can be tightened as defense in depth

Control and Check In already use the exact API host in their connection policy. Some proving pages still allow `https://*.cmxchat.com` for `connect-src`.

The backend still enforces the exact allowed Origin, protected cookie and CSRF checks, so the wildcard frontend CSP is not the authority boundary. It can nevertheless be tightened later to the exact API host for defense in depth.

This is **hardening, not a backend release blocker**.

### 4. Public Pages verification remains an environment gap

GitHub merges and CI do not prove that the public custom-domain page was personally observed from the current execution environment.

Direct `db.cmxchat.com` / `api.cmxchat.com` verification has been unavailable from the current tool environment because DNS/direct-open access is blocked there.

Therefore:

- do not say the latest Pages build was directly observed unless it actually was;
- do not treat lack of local DNS access as a product failure;
- perform public browser verification from an environment that can resolve the custom domain when available.

### 5. Open visual work should not be stomped

At reconciliation time:

- First-Repo PR #131 — Automation builder viewport redesign — remains draft/open;
- First-Repo PR #130 — `/doc/` vision refresh — remains draft/open.

Both are substantially behind current main and should be deliberately rebased/reconciled before merge.

Do not modify the same focused Automations or `/doc/` areas casually while those branches remain active.

## Backend release blockers

These are the main reasons the canonical proving surfaces are not production-complete today.

### 1. The stacked backend PR chain is still open

The feature chain is intentionally stacked:

`#17 → #18 → #19 → #20 → #21 → #24`

The branches contain the frontend dependencies for Directory, Connection/SenderIdentity, Library, Automation, Runtime, provider, reconciliation, Authority and trigger-consumption behavior.

Before production use, that stack needs a deliberate review/merge plan. Do not merge PR #24 by itself while its dependencies remain unmerged.

### 2. Production database migrations are not applied

The current stacked migration head is:

`c0d1e2f3a4b5`

Production remains on the older boundary.

Deployment therefore requires migration planning, backup/restore confidence and current-head verification before the newer domain APIs can be treated as production truth.

### 3. New backend API routes are not production-deployed

Today, the protected operator session may work while newer routes return 404/unsupported.

The frontend already reports this as `NOT DEPLOYED` / capability unavailable rather than manufacturing browser-local success.

Production needs the stacked Directory, Connection/Sender, Library, Automation, Runtime, receipt and reconciliation routes deployed behind the existing protected origin/session boundary.

### 4. Development-only processing is not a production worker strategy

The browser proof can call the explicit development process endpoint where available.

That is useful for proving the canonical Runtime path, but it is not the final operational production worker topology.

For normal production use, Runtime processing must be run as an appropriate backend worker/service rather than depending on a browser tab calling a development control.

This is **deployment/operations work**, not a reason to add browser execution logic.

## Provider configuration blockers for real Email

Safe simulated delivery does not require real SMTP configuration.

Real Email acceptance does.

### Current provider contract

The stacked backend includes a bounded real SMTP path with important restrictions:

- direct manual-owner initiation only;
- exact configured sender contract: `team@cmxchat.com`;
- current bounded proof recipient: `cmxchat@gmail.com` only;
- no arbitrary recipient bypass;
- no bulk / CC / BCC;
- no unattended Authority SMTP;
- no scheduler-based SMTP;
- ambiguous provider results are terminal and never auto-retried;
- reconciliation records evidence and never resends.

### Current operational uncertainty

SMTP credential rotation/readiness is **UNCONFIRMED** in the canonical handbook.

Before a real-provider production proof, verify server-side configuration/readiness without exposing secret values.

The frontend must resolve the actual protected Connection and SenderIdentity IDs and readiness facts. Email strings alone are not authority.

## What is genuinely not implemented yet

Do not misclassify these as frontend bugs or deployment omissions.

### Generic durable scheduler

There is no general server-side scheduler for arbitrary future actions.

The current trigger-consumption work is a narrowly invoked backend consumer around Check In trigger occurrences and exact Authority. It is not cron, a task scheduler, or a general timer platform.

### General authenticated assistant / AI action bridge

`/requests/` is not an AI agent bridge.

A future assistant interface needs deliberate authentication into the same Continuum backend and must use the same protected identities, Authority rules, immutable versions, Runtime and receipts.

No secret AI bypass is part of the current system.

### Unattended real SMTP

Not implemented and intentionally not authorized by the current Authority work.

Unattended trigger consumption is fake-only.

### HTML-email delivery model

The rich Email composer is presentation UX. Current backend proof freezes/sends normalized source text. There is no second HTML-email storage/rendering model implied by the current frontend.

### Bulk mail / CC / BCC / arbitrary-recipient provider behavior

Not implemented in the bounded provider proof and should not be inferred from the existence of Email UI.

## Distinct surface boundaries that should remain distinct

### Check In

Check In is different because its protected operator/session and deterministic switch foundation are actually production-live.

Do not add a generic `NOT DEPLOYED` badge merely to make it visually match proving surfaces.

### Spaces

Spaces remains a fictional/demo briefing surface with explicit demo-data language.

Do not relabel its fictional scenario data as protected backend truth merely because Directory/Library/Runtime now have stacked backend implementations.

### Automations

Automations has existing protected source truth plus separate focused visual work in PR #131.

Until that branch is reconciled, prefer small Runtime/history integrations that do not rewrite the builder workspace.

### `/doc/`

The product overview is separately being worked in PR #130.

Do not use gap reconciliation as an excuse to rewrite its accepted product framing.

## Recommended release sequence

The clean path from the current proving state to real use is:

1. keep the current frontend main stable;
2. complete a deliberate review of backend PR #17 → #18 → #19 → #20 → #21 → #24;
3. decide the merge strategy for the stacked chain;
4. prepare/verify production database migration and rollback/backup safety;
5. deploy the newer protected backend routes and normal Runtime worker/service;
6. verify exact production Origin/CORS/cookie/CSRF behavior from `https://db.cmxchat.com`;
7. run safe-simulation production acceptance through Directory → Library → Automation → Runtime → receipt;
8. verify Control reads the resulting real production Run/receipt and cross-surface IDs;
9. fix any production-only frontend integration defects without inventing local substitutes;
10. harden Requests incomplete-resolution behavior before real-provider acceptance;
11. verify exact real Connection/SenderIdentity and server-side SMTP readiness;
12. make one explicit bounded manual real-Email acceptance decision;
13. send one deliberate test through canonical Runtime only;
14. inspect receipt/provider/reconciliation state before expanding provider use.

## What “ready for real use” should mean

Do not use one vague `ready` label.

### Ready for production safe simulation

Requires:

- backend stack merged/migrated/deployed;
- protected session/Origin/CSRF verified on the real origins;
- production Runtime worker/service available;
- Directory/Library/Automation/Runtime/receipt APIs responding;
- one complete fake-provider Run produces a typed receipt;
- Control can read it and follow exact references.

No real SMTP is required for this milestone.

### Ready for one bounded real Email proof

Requires everything above plus:

- exact protected Connection/SenderIdentity readiness;
- confirmed server-side provider configuration/credential readiness;
- exact bounded sender/recipient policy;
- Requests/Email resolution succeeds without partial lookup uncertainty;
- explicit manual owner initiation;
- canonical Runtime only;
- one receipt/provider outcome inspected after the attempt.

### Ready for unattended work

This is a separate later milestone.

The current fake-only exact-Authority Check In trigger proof is valuable, but general unattended workflows require additional deliberate product/backend work. Do not let a successful manual Email proof silently widen Authority or introduce a scheduler.

## Final reconciliation

The current frontend week succeeded at its intended job.

It made the browser surfaces ready to operate over the backend foundation already built in source without manufacturing browser-local substitutes for missing production capability.

The system can now be explained as one durable chain:

`identity → memory → approved action → Runtime → receipt → exact history`

The largest remaining gap is no longer frontend architecture.

It is crossing the release boundary deliberately:

**review the stacked backend → migrate → deploy → verify safe simulation on production → configure/verify provider → perform one bounded real-provider proof.**

Keep the smaller frontend hardening queue separate so UI polish does not obscure the actual deployment work.