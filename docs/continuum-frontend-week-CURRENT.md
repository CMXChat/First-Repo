# Continuum Frontend Week — CURRENT

Last updated: 2026-08-22
Status: **APPROVED OPERATING CHECKPOINT — EMAIL + REQUESTS V2 + DIRECTORY + LIBRARY DURABLE MEMORY LANDED**

## Purpose

This file preserves the practical operating state for the current proof-driven frontend week. It is a companion to `docs/continuum-frontend-roadmap-CURRENT.md`, not a replacement for backend contracts or product architecture planning.

Use it when recovering the frontend week so decisions and boundaries do not have to be reconstructed from chat history.

New architecture/roadmap planning belongs in `CMXChat/jay-app`. This First-Repo file remains a source-specific CURRENT handoff for frontend execution and recovery.

## Landed checkpoints

The coordinated frontend program has now landed these slices:

- First-Repo PR #133 / merge `5babbb2b9c7fd11a8f7f3b527e1517b4147cb396`: `/email/` v3 protected-backend workspace, `/requests/` v1 contact-import doorway, and frontend roadmap work.
- PR #134 / merge `2272bdee9cdc2140b5ddc92d7121517ce1a0dd42`: durable frontend-week checkpoint.
- PR #135 / merge `da98f22072adbc15471ac919463dd1ae8ede2eb8`: `/requests/` v2 Email safe-simulation operation and shared protected API adapters.
- PR #136 / merge `f864e15ad85b60076fc3db2f3340ec76d3c0de4c`: Requests v2 recovery checkpoint.
- PR #137 / merge `5c5a6d4ed281b47639d62fc442dd4a972ef50302`: Directory shared protected-session transport, inline unlock/session recovery, canonical Directory navigation, and desktop/mobile session proof.
- PR #138 / merge `d0e32726335a0b6a2a3555dcdaa4d6bc033e6076`: Directory/shared-session recovery checkpoint.
- PR #139 / merge `f93edd4912f98370d503df741ed5fb18db4fa172`: canonical `/library/` protected ContentAsset/Draft/Version lane, real revision-conflict handling, immutable-version proof, explicit local-preview split, and canonical Library navigation.

The stacked `CMXChat/jay-app` backend remains separate from these frontend merges. Backend PR #24 on `dev/durable-trigger-consumption` remains stacked development truth and is not made production-live by frontend validation.

## Current product proof

The week is being executed as a proof-driven integration week, not a page-polishing checklist.

The visible chain is becoming:

`Requests → Directory identity → Library durable memory → Email/Automations define work → Runtime executes → Receipt proves what happened`

The objective is to show several interfaces operating over the same protected durable world rather than behaving like unrelated mini-apps.

## Current practical frontend truth

### Email

`/email/` is the dedicated manual Email workspace. Where the required backend routes are deployed it follows:

`Directory recipient → Connection/SenderIdentity → Library ContentVersion → manual Automation → preflight/Review/Publish → Runtime → receipt`

The current acceptance path uses safe simulated delivery first. Real SMTP remains deliberately disabled for this frontend phase.

### Requests

`/requests/` currently has two bounded useful operations:

1. batch Person + email ContactMethod preview/approval;
2. typed Email request preview and approved safe simulation through the same Library → Automation → Runtime architecture as `/email/`.

Requests does not create a second Email engine, write directly to PostgreSQL, or contain a general AI action bridge.

### Directory — durable identity

`/directory/` uses the shared protected operator transport.

Its protected loop is:

`operator session → Person list/create/update → email ContactMethod list/create/lifecycle → stable backend UUIDs → reload from backend`

Directory has inline protected-session status/unlock/logout controls and canonical active navigation. Protected Person/ContactMethod truth remains backend-owned.

Organizations, Groups and richer relationship/planner concepts remain explicitly local previews.

### Library — durable memory

`/library/` now has two visibly separate lanes.

The first is a **protected server lane** using the shared operator API and the existing stacked backend contracts:

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

Where the routes are deployed, the lane can:

- list protected content;
- create a typed ContentAsset plus initial Draft;
- load stable backend IDs;
- edit the Draft using exact `expected_revision`;
- freeze an immutable ContentVersion;
- display the Version ID, source Draft revision, checksum and frozen source;
- show backend dependency counts;
- reload protected state from the server.

The second lane preserves the existing folders/files/media/import UI as **browser-local preview** only. Those concepts are not silently relabeled as protected backend truth.

Binary object storage is not claimed.

## The Library concurrency proof

Draft edits are optimistic-concurrency protected.

The frontend remembers which Draft revision was loaded and sends:

`{ expected_revision, source_text }`

If the backend has already advanced, it returns `409`.

The frontend then deliberately does **not** auto-retry with the newer revision. Instead it:

1. keeps the user's unsaved editor text;
2. fetches the latest server Draft;
3. explains the editor revision versus the current server revision;
4. requires an explicit server-Draft reload;
5. lets the user re-apply/reconcile the change deliberately.

This is an important Continuum trust rule:

**newer server state is not permission for a stale browser to overwrite it.**

## The Library immutability proof

A ContentVersion is a frozen historical snapshot, not merely the current Draft with a version label.

PR #139 browser validation proved:

`Draft r1 → freeze Version 1 → edit/save Draft r2 → Version 1 source remains unchanged`

It then deliberately introduced a concurrent server edit:

`editor based on r2 → server becomes r3 → save gets 409 → unsaved text preserved → reload r3 → reconcile/save r4 → freeze Version 2`

After the full sequence:

- Version 1 still contained the original r1 source;
- Version 2 contained the reconciled r4 source;
- the mutable Draft could continue changing without rewriting either historical snapshot.

That is the core **durable memory** proof.

## Why immutable content matters to Email and Automations

An Automation should not mean “use whatever this note says later.”

It should be able to preserve:

`ContentAsset ID → exact ContentVersion ID → AutomationVersion ID → Runtime receipt`

That lets Continuum answer which exact information was approved or used at a particular moment even after the working Draft changes later.

The next cross-surface work should make those exact references increasingly visible through Email/Automations/Runtime history rather than creating a new execution path.

## Shared protected transport

Email, Requests, Directory and Library increasingly share one protected browser transport through `assets/continuum-operator-api-v1.js`.

A protected page relies on three related checks:

1. the backend-issued secure cookie says the browser has a valid unlocked session;
2. the backend validates the exact browser Origin;
3. protected writes carry the expected CSRF proof.

The CSRF proof prevents another website from using an already-unlocked browser to mutate Continuum.

The shared API keeps those rules consistent while each surface owns its own product/domain behavior.

The operator key is sent directly to the backend, cleared immediately, and not written into localStorage/sessionStorage.

## Browser-storage boundary

Browser storage can still contain harmless UI state or explicitly local preview data.

It must not become canonical protected storage.

Current focused browser tests verify that protected values such as operator keys, CSRF values, protected IDs and protected source content do not leak into localStorage/sessionStorage during the server-backed proofs.

The invariant is:

**local UI state can be local; canonical protected truth stays backend-owned.**

## Requests safe simulation

### Contacts

`pasted contact lines → local preview → explicit approval → protected Person create → protected email ContactMethod create → durable backend IDs/results`

Contact writes are sequential. If Person creation succeeds and ContactMethod creation fails, the Person remains durable and Requests reports the partial result rather than pretending the batch was atomic.

### Email

Preview performs protected reads only:

`From/To/message → resolve Person + ContactMethod → resolve Connection + SenderIdentity + readiness → show exact IDs/message → explicit approval`

Approved safe simulation performs:

`ContentAsset/Draft → immutable ContentVersion → manual Email Automation Draft → preflight → Review → Publish → Runtime Run(provider_mode=fake) → explicit development processing where available → typed receipt`

The browser execution proof observes the real frontend orchestration against a mocked backend boundary and verifies that no request uses `real_smtp`.

## What safe simulation means

Safe simulation is real internal backend workflow with only the final outside provider effect simulated.

When the backend stack is available, durable internal facts can include:

- Person / ContactMethod;
- ContentAsset / Draft / ContentVersion;
- Automation / AutomationVersion;
- Runtime Run / Attempts;
- Why/provenance;
- typed receipt.

Only the final external delivery effect is simulated.

Product-facing language should prefer **safe simulation** or **simulated delivery** rather than describing it as fake frontend data.

## Validation evidence for PR #139

Current-head focused checks passed before merge:

- Library validation source contracts;
- Library shared-shell convergence;
- Library desktop/mobile durable-memory Playwright proof;
- Continuum Source Truth Validation;
- Continuum Email Validation after the shared API extension;
- Continuum Requests Validation after the shared API extension;
- Continuum Directory Server Proof Validation after the shared API extension;
- Continuum Route Graduation Validation;
- Continuum theme-toggle validation;
- CMX Static Validation;
- Navigation Link Guard;
- Archived Lab Validation;
- Secret Scan.

The existing repo-wide Terminal Theme Guard, Privacy Audit and Doc Clarity failures remained the same unrelated baseline failures.

These browser proofs mock the backend boundary. They prove frontend orchestration and safety semantics; they do not make the stacked backend production-live.

## Production boundary

The protected Check In/operator-session foundation is production-live.

The newer Directory, Connection/SenderIdentity, Library, Automation, Runtime, provider and receipt contracts used by these proving surfaces remain stacked backend implementation until deliberately reviewed, merged, migrated and deployed.

Therefore a canonical page may correctly show:

`protected session connected → requested domain capability unavailable/not deployed`

That is a deployment boundary, not permission to manufacture browser-local fake server success.

No backend merge, production migration or deployment was performed by PR #139.

## What can still be done this frontend-focused week without new backend coding

Useful next work includes:

1. make exact ContentAsset/ContentVersion and Automation/Runtime references easier to follow across surfaces;
2. improve `/control/` as a human-readable projection of real Runtime/receipt/history truth without replacing its clearly labeled future/sample areas;
3. improve `/checkin/` only where shared status/deployment language can be added without blurring its different LIVE boundary;
4. continue `/automations/` Runtime/history/receipt projection without colliding with the open focused workspace PR;
5. add more typed `/requests/` operations only when they map cleanly to existing protected backend contracts;
6. continue canonical-route cleanup when stale active-source links are found;
7. keep desktop/mobile/accessibility validation and source-specific handoffs current;
8. verify canonical Pages live behavior whenever direct browser/DNS access is available;
9. record exact production-vs-stacked gaps for the later backend queue.

The frontend-week goal remains:

**make the frontend completely ready for the backend foundation already built without inventing browser substitutes for missing server capability.**

## Next execution order

Default sequence after Library PR #139:

1. **Cross-surface exact-reference pass** — make the existing Person/Content/Automation/Run identities and frozen-version relationships easier to follow, starting with low-collision surfaces.
2. **Control / Runtime history** — make receipts and Why more human-readable projections of canonical backend records, not a second Runtime.
3. **Check In consistency** — only where useful and without flattening its distinct production-live status.
4. **Automations coordination** — inspect current open Automations work before touching the builder; prefer Runtime/history integration that does not collide with the layout PR.
5. **Additional Requests adapters** only for already-supported backend operations.
6. Keep recovery handoffs current after each coherent merge.

The useful visible product loop is now:

`Requests → Directory durable identity → Library durable memory → Email/Automations durable action → Runtime → Receipt`

## What cannot be completed purely from frontend work

These require later deliberate backend/configuration/deployment work if they are not already production-live:

- merging the stacked `jay-app` backend work;
- applying its production database migration;
- deploying the newer Directory/Connection/Library/Automation/Runtime endpoints to `api.cmxchat.com`;
- confirming/configuring the provider Connection and SenderIdentity for real delivery;
- confirming SMTP credential rotation/readiness;
- enabling a bounded real SMTP acceptance path;
- building a generic durable scheduler;
- building a general authenticated assistant/AI action bridge.

Do not confuse frontend readiness with production deployment.

## Real Email acceptance sequence

Do not jump directly from frontend wiring to unrestricted real mail.

Preferred later sequence:

1. prove complete simulated delivery;
2. inspect the receipt and ambiguity/failure behavior;
3. verify exact real SenderIdentity and Connection readiness;
4. verify exact Directory recipient;
5. confirm server-side provider credentials/readiness;
6. make one explicit bounded real-email acceptance decision;
7. send one deliberate test through canonical Runtime only;
8. inspect the real receipt/provider outcome before expanding use.

The stacked proof contract currently names `team@cmxchat.com` as the proof sender and `cmxchat@gmail.com` as the bounded proof recipient. Those strings are not permission by themselves; real backend IDs/readiness remain authoritative.

## Assistant-control boundary

The eventual direction is for an authenticated assistant to become another interface over Continuum.

That does not exist merely because `/requests/` exists. Direct assistant execution needs a deliberate authenticated bridge into Continuum APIs. Time-based actions additionally need a durable server-side scheduling layer.

Principle:

**One backend, many interfaces.** Browser pages, `/requests/`, and a future assistant interface must all use the same backend identity, permissions, immutable versions, Runtime and receipts.

No secret AI bypass is part of the plan.

## Explicit no-go shortcuts

Do not use frontend work to fake or bypass:

- undeployed backend endpoints;
- direct PostgreSQL writes;
- provider credentials in browser code;
- direct browser SMTP;
- real-email success without a backend receipt;
- browser-local records presented as durable server truth;
- stale Draft auto-overwrite after a revision conflict;
- mutable Draft changes rewriting immutable historical Versions;
- generic scheduling that depends on an open tab;
- assistant authority that bypasses backend rules;
- alternate execution paths around canonical Runtime.

## Recovery order

When resuming this frontend week, read:

1. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-LIVING-PRODUCT-ROADMAP-CURRENT.md`
2. current `CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md` on the active PR #24 stack
3. `docs/continuum-frontend-roadmap-CURRENT.md`
4. this file
5. `docs/continuum-source-truth-CURRENT.md`
6. `docs/continuum-directory-server-proof-CURRENT.md`
7. `docs/continuum-library-lab-CURRENT.md`
8. `docs/continuum-email-lab-CURRENT.md`
9. `docs/continuum-requests-CURRENT.md`
10. current First-Repo main and open PRs

Do not make architecture or product-status assumptions from chat history when current GitHub source can answer them.

Never infer that a backend capability is production-live merely because the frontend supports it or stacked backend tests prove it.
