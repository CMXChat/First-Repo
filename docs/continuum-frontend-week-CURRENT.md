# Continuum Frontend Week — CURRENT

Last updated: 2026-08-22
Status: **APPROVED OPERATING CHECKPOINT — EMAIL + REQUESTS V2 + DIRECTORY SESSION CONSOLIDATION LANDED**

## Purpose

This file preserves the practical operating plan for the current frontend-focused week. It is a companion to `docs/continuum-frontend-roadmap-CURRENT.md`, not a replacement for backend contracts.

Use it when recovering the current frontend week so decisions do not have to be reconstructed from chat history.

## Landed checkpoints

The coordinated frontend program has now landed these important slices:

- First-Repo PR #133 / merge `5babbb2b9c7fd11a8f7f3b527e1517b4147cb396`: master frontend roadmap, `/email/` v3 protected-backend workspace, `/requests/` v1 contact-import doorway.
- First-Repo PR #134 / merge `2272bdee9cdc2140b5ddc92d7121517ce1a0dd42`: durable frontend-week operating checkpoint.
- First-Repo PR #135 / merge `da98f22072adbc15471ac919463dd1ae8ede2eb8`: `/requests/` v2 Email safe-simulation operation and expanded shared protected API adapters.
- First-Repo PR #136 / merge `f864e15ad85b60076fc3db2f3340ec76d3c0de4c`: Requests v2 recovery checkpoint.
- First-Repo PR #137 / merge `5c5a6d4ed281b47639d62fc442dd4a972ef50302`: Directory shared protected-session transport, inline unlock/session recovery, canonical Directory navigation, and focused desktop/mobile session proof.

The stacked `jay-app` backend remains separate from this frontend checkpoint. Backend PR #24 is still stacked development truth and is not made production-live by these frontend merges.

## Current practical frontend truth

### Email

`/email/` is the dedicated manual Email workspace. Where the required backend routes are deployed it is designed to follow:

`Directory recipient → Connection/SenderIdentity → Library ContentVersion → manual Automation → preflight/Review/Publish → Runtime → receipt`

The current acceptance path uses safe simulated delivery first. No real SMTP acceptance has been authorized by this frontend program.

### Requests

`/requests/` currently has two bounded useful operations:

1. batch Person + email ContactMethod preview/approval;
2. typed Email request preview and approved safe simulation through the same Library → Automation → Runtime architecture as `/email/`.

Requests does not create a second Email engine, does not write directly to PostgreSQL and does not contain a general AI action bridge.

### Directory

`/directory/` now uses the same protected operator transport as Requests and the Email session contract.

The protected People loop is:

`operator session → Person list/create/update → email ContactMethod list/create/lifecycle → stable backend UUIDs → reload from backend`

Directory now has inline protected-session status and unlock/logout controls. The operator key is sent directly to the backend, cleared immediately, and is not stored in browser storage.

The small `assets/lab/directory-api-v1.js` compatibility adapter no longer owns its own `fetch`, session cache or CSRF implementation; it delegates to `assets/continuum-operator-api-v1.js`.

Active Directory navigation now points to canonical routes such as `/control/` and `/automations/` instead of legacy `/lab/...` compatibility paths.

Organizations, Groups and richer relationship/planner concepts remain local Lab previews and are not silently attached to protected backend People.

## Why the shared protected transport matters

A protected page needs three related pieces of proof:

1. the backend-issued secure session cookie says this browser has been unlocked;
2. the backend checks the exact allowed browser Origin;
3. write requests include the short-lived CSRF proof expected by the backend.

The CSRF proof is a second check on writes so another website cannot simply trick an already-unlocked browser into changing Continuum data.

Email, Requests and Directory should not each invent different versions of those rules. The shared operator API gives the static frontend one small networking layer for session, errors and protected mutations while each product surface keeps its own domain behavior.

## Directory validation evidence

PR #137 focused validation passed:

- Continuum Directory Server Proof Validation;
- Continuum Directory Validation;
- Directory validation;
- Continuum Directory Route Graduation Validation;
- Continuum Email Validation after the shared operator API extension;
- Continuum Requests Validation after the shared operator API extension;
- Control Center validation;
- CMX Static Validation;
- Navigation Link Guard;
- Archived Lab Validation;
- Secret Scan.

The Directory browser proof runs at desktop and mobile sizes and exercises:

`locked → inline operator unlock → page reload → connected session → protected Person projection`

The test specifically verifies that the operator key, CSRF value, protected Person UUID, ContactMethod UUID and protected email address do not enter localStorage/sessionStorage.

Directory still has browser-local storage for visual settings and unsupported Lab/sample concepts. That is not the same thing as storing protected backend truth. The invariant is: **protected credentials and canonical Person/ContactMethod records stay backend-owned.**

The mocked browser proof validates frontend orchestration. It does not mean the stacked Person/ContactMethod routes have been deployed to production.

## What Requests v2 actually proves

### Contacts

`pasted contact lines → local preview → explicit approval → protected Person create → protected email ContactMethod create → durable backend IDs/results`

Contact writes are sequential. If Person creation succeeds and ContactMethod creation fails, the Person remains durable and Requests reports the partial result rather than pretending the batch was atomic.

### Email

Email preview performs protected reads only:

`From/To/message → resolve Person + ContactMethod → resolve Connection + SenderIdentity + readiness → show exact IDs/message → explicit approval`

Approved safe simulation performs:

`ContentAsset/Draft → immutable ContentVersion → manual Email Automation Draft → preflight → Review → Publish → Runtime Run(provider_mode=fake) → explicit development processing where available → typed receipt`

The full Requests browser execution proof clicked the actual approval control and observed nine approved mutations in the expected order. Every mutation carried CSRF, the Run used a unique idempotency key and `provider_mode:"fake"`, no request contained `real_smtp`, and the typed receipt rendered.

## What safe simulation means

Safe simulation is real internal backend workflow with the final external provider effect simulated.

When the backend stack is available, the internal durable facts may be real:

- Person / ContactMethod;
- ContentAsset / Draft / ContentVersion;
- Automation / AutomationVersion;
- Runtime Run / Attempts;
- Why/provenance;
- typed receipt.

Only the final external provider effect is simulated, so no outside email is delivered.

Product-facing language should prefer **safe simulation** or **simulated delivery** unless a backend field name itself is being discussed.

## Production boundary

The protected Check In/operator session foundation is production-live.

The newer Directory, Connection/SenderIdentity, Library, Automation, Runtime, provider and receipt contracts used by Email/Requests/Directory remain stacked backend implementation until deliberately reviewed, merged, migrated and deployed.

Therefore a canonical page may correctly show:

`protected session connected → requested domain capability unavailable on this API`

That is a deployment boundary, not a reason to create browser-local fake server records.

## What can still be done this frontend-focused week without new backend coding

There is still substantial frontend work available:

1. finish the remaining canonical navigation/shared-shell cleanup outside Directory;
2. connect/polish `/library/` against the durable ContentAsset/Draft/Version contracts while clearly separating server-backed content from local file/folder previews;
3. improve `/control/` and `/checkin/` projections of real operational/backend state;
4. continue `/automations/` Runtime/history/receipt projection without disturbing the stable editor work;
5. improve cross-surface backend-state/session language where it can be shared safely;
6. add more typed `/requests/` operations only when they map to existing verified backend contracts;
7. keep desktop/mobile/accessibility checks and surface handoffs current;
8. verify canonical live Pages whenever live browser/DNS access is available;
9. keep an exact list of production-vs-stacked deployment gaps for the later backend phase.

The frontend-week goal remains: **make the frontend completely ready for the backend foundation already built without inventing client-side substitutes for missing server capability.**

## Next execution order

Default sequence after PR #137:

1. **Small canonical navigation sweep** for remaining active Library/Control source links that still point through `/lab/...` compatibility routes.
2. **Library slice**: inspect the existing local Library carefully, then add the narrowest useful protected ContentAsset/Draft/ContentVersion projection without pretending local folders/files are server-backed.
3. **Control / Check In**: improve real backend-state projection and shared status language.
4. **Automations / Runtime history**: improve receipt/history visibility without changing the stable editor or creating another Runtime path.
5. **Additional Requests adapters** only for already-supported backend operations.
6. Keep durable handoffs current after each coherent merge.

The useful visible product loop remains:

`Requests → Directory identity → Library content → Email/Automations define work → Runtime executes → Receipt proves what happened`

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
2. inspect receipt and ambiguity/failure behavior;
3. verify exact real SenderIdentity and Connection readiness;
4. verify exact Directory recipient;
5. confirm server-side provider credentials/readiness;
6. make one explicit bounded real-email acceptance decision;
7. send one deliberate test through canonical Runtime only;
8. inspect the real receipt/provider outcome before expanding use.

The stacked proof contract currently names `team@cmxchat.com` as the proof sender and `cmxchat@gmail.com` as the bounded proof recipient. Those strings are not permission by themselves; the frontend must resolve backend IDs/readiness.

## Assistant-control boundary

The eventual direction is for an authenticated assistant to become another interface over Continuum.

That does not exist merely because `/requests/` exists. Direct assistant execution needs a deliberate authenticated bridge into Continuum APIs. Time-based actions additionally need a durable server-side scheduling layer.

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
- generic scheduling that depends on the tab staying open;
- assistant authority that bypasses backend rules;
- alternate execution paths around canonical Runtime.

## Recovery order

When resuming this frontend week, read:

1. `docs/continuum-frontend-roadmap-CURRENT.md`
2. this file
3. `docs/continuum-email-lab-CURRENT.md`
4. `docs/continuum-requests-CURRENT.md`
5. `docs/continuum-directory-server-proof-CURRENT.md`
6. the next relevant surface-specific `docs/*-CURRENT.md`
7. current First-Repo `main` / open PRs
8. `CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md` on the active stacked backend ref

Never infer that a backend capability is production-live just because the frontend supports it or stacked backend tests prove it.
