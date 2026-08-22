# Continuum Frontend Week — CURRENT

Last updated: 2026-08-22
Status: **APPROVED OPERATING CHECKPOINT — DURABLE IDENTITY + MEMORY + ACTION + RECEIPT NAVIGATION LANDED**

## Purpose

This is the source-specific recovery handoff for the current proof-driven frontend week in `CMXChat/First-Repo`.

It complements `docs/continuum-frontend-roadmap-CURRENT.md`; it does not replace backend contracts or the canonical living product roadmap in `CMXChat/jay-app`.

New product/architecture planning belongs in `jay-app`. This file records what the frontend has actually landed, what was proven, what remains stacked/not deployed, and the next low-risk execution order.

## Landed checkpoints

The coordinated frontend program has landed:

- PR #133 / merge `5babbb2b9c7fd11a8f7f3b527e1517b4147cb396` — `/email/` v3 protected-backend workspace, `/requests/` v1 contacts and master frontend roadmap work.
- PR #134 / merge `2272bdee9cdc2140b5ddc92d7121517ce1a0dd42` — frontend-week recovery checkpoint.
- PR #135 / merge `da98f22072adbc15471ac919463dd1ae8ede2eb8` — `/requests/` v2 typed Email safe simulation through Library → Automation → Runtime.
- PR #136 / merge `f864e15ad85b60076fc3db2f3340ec76d3c0de4c` — Requests v2 recovery checkpoint.
- PR #137 / merge `5c5a6d4ed281b47639d62fc442dd4a972ef50302` — shared protected-session Directory integration and canonical navigation.
- PR #138 / merge `d0e32726335a0b6a2a3555dcdaa4d6bc033e6076` — Directory/shared-session recovery checkpoint.
- PR #139 / merge `f93edd4912f98370d503df741ed5fb18db4fa172` — canonical protected Library ContentAsset/Draft/immutable Version lane, revision conflicts and durable-memory proof.
- PR #140 — Library recovery checkpoint.
- PR #141 / merge `e36108b73b2088d4997131e86edecca3b88129ba` — canonical `/control/` protected read-only Runtime history / typed receipt / Why projection.
- PR #142 / merge `fefcb2a797825c2239cdae831845ee02820f6c13` — exact cross-surface reference focus: Control receipt → exact Directory Person and exact Library ContentAsset.
- PR #143 / merge `e362a0e56d1d5bfce09fdb92ded78899567a14b5` — complete Email safe-simulation frontend proof plus Email/Requests receipt → exact Control Runtime handoff.

These are frontend/source checkpoints. They do not deploy the stacked backend.

## Current backend boundary

Canonical backend handbook:

`CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md`

Current stacked development path remains backend PR #24 on `dev/durable-trigger-consumption`.

Production remains on the older documented Check In / operator-session foundation until a deliberate backend merge, migration and deployment occurs.

Always distinguish:

- **LIVE** — actually deployed behavior;
- **SOURCE BUILT / STACKED** — implemented and validated backend/source work not production-deployed;
- **PROVING / PREVIEW** — frontend/product proof of intended behavior;
- **PENDING** — merge, migration, deployment, configuration or later implementation required.

Never turn SOURCE BUILT into a LIVE claim.

## Current product proof

The frontend week is no longer merely a sequence of isolated pages.

The visible durable-world chain is now:

`Requests / Email → durable identity + content → Automation/Runtime → typed Receipt → Control → exact Directory Person / exact Library Content`

And in the other direction:

`Directory Person + Library Content → Email/Automation action → Runtime → Control history`

This is the strongest current proof of:

**one backend, many interfaces.**

Stable IDs let different surfaces point at the same durable object instead of copying or re-inventing it.

## Durable identity — Directory

Canonical `/directory/` uses the shared protected operator transport for real People and email ContactMethods where those routes are deployed.

Proof:

`protected session → Person list/create/update → email ContactMethod list/create/lifecycle → stable backend UUIDs → reload from backend`

Important rules:

- display name/address can change while stable IDs preserve identity;
- duplicate/normalization rules remain backend-owned;
- protected Person/ContactMethod truth is not localStorage/sessionStorage truth;
- Organizations, Groups and richer relationships remain explicit preview concepts;
- exact `?person_id=<UUID>` navigation focuses the requested protected Person after normal Directory loading;
- a query ID is a pointer, not permission.

## Durable memory — Library

Canonical `/library/` has a protected server lane:

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

Where deployed it can:

- list/create protected content;
- edit Draft with exact `expected_revision`;
- receive `409` on stale revision;
- preserve unsaved browser text instead of overwriting newer server state;
- deliberately reload/reconcile the newer Draft;
- freeze immutable ContentVersion;
- show exact Version ID, Draft revision and checksum;
- reload protected state from backend.

The Library browser proof established:

`Draft r1 → freeze V1 → edit Draft → V1 remains unchanged → concurrent server advance → stale save 409 → deliberate reconciliation → later V2`

So Continuum can later say which exact information was used at a specific moment.

Existing mixed-media/folder/file concepts remain explicitly browser-local preview until there is a real backend contract. Binary object storage is not claimed.

Exact `?content_id=<UUID>` navigation now focuses the requested protected ContentAsset after normal Library loading.

## Durable action — Email

Canonical `/email/` is the flagship manual action proof.

Current frontend chain:

`protected session → Person/ContactMethod → Connection/SenderIdentity/readiness → ContentAsset/Draft → immutable ContentVersion → Automation Draft → preflight → Review → Publish → Runtime Run(provider_mode=fake) → explicit development processing where available → typed receipt`

PR #143 added a focused browser proof for that entire frontend sequence against a mocked backend boundary.

The proof verifies:

- nine protected workflow mutations in the expected sequence;
- CSRF on every protected mutation;
- exact Person, ContactMethod, Connection, SenderIdentity, ContentAsset and Automation references;
- optimistic Draft revision use;
- immutable ContentVersion creation;
- preflight before Review/Publish;
- unique Run idempotency key;
- `provider_mode: "fake"`;
- no mutation contains `real_smtp`;
- explicit dev processing through the canonical Runtime process route;
- typed frozen receipt;
- protected values do not become browser-storage canonical truth;
- no external email is sent.

This proves frontend orchestration and safety semantics, not production deployment.

## Requests — bounded useful operations

Canonical `/requests/` currently has two useful operation families:

1. batch Person + email ContactMethod preview/approval;
2. typed Email request preview/approval using the same protected Library → Automation → Runtime path as `/email/`.

### Contacts

`paste → deterministic parse → preview → explicit approval → Person create → ContactMethod create → exact IDs/result`

If Person succeeds and ContactMethod fails, Person remains durable and Requests reports a partial result. There is no silent auto-retry.

### Email

Preview performs reads only:

`From/To/message → resolve Person/ContactMethod → resolve Connection/SenderIdentity/readiness → display exact proposal → explicit approval`

Approval then uses the canonical action chain and safe simulation. Requests does not become a second Email engine, arbitrary HTTP proxy, direct PostgreSQL console or general AI action bridge.

## Safe simulation

Safe simulation means the Continuum internal workflow can be real durable backend state while only the outside provider effect is simulated.

Where the stacked routes are available, durable facts can include:

- Person / ContactMethod;
- ContentAsset / Draft / ContentVersion;
- Automation / AutomationVersion;
- Runtime Run / Attempts;
- Why/events;
- typed receipt.

No external email is sent.

Product-facing language should prefer **safe simulation** / **simulated delivery**, not “fake frontend data.” The backend field remains `provider_mode: "fake"`.

## Durable explanation — Control

Canonical `/control/` has a read-only protected Runtime history/receipt lane.

It reads canonical records; it does not request, process, cancel, retry, reconcile or resend work.

A receipt can explain:

- Run;
- immutable AutomationVersion;
- exact Person + ContactMethod;
- exact Connection + SenderIdentity;
- exact ContentAsset + ContentVersion + checksum;
- manual-owner vs exact authority mode;
- optional AuthorityGrant / Incident / TriggerOccurrence;
- Attempts;
- Why/events;
- provider-operation reconciliation evidence.

Historical execution is rendered from frozen receipt data rather than reconstructed from current mutable Directory/Library state.

## Bidirectional exact-reference navigation

PRs #142 and #143 close the navigation loop.

Control → durable objects:

- `/directory/?person_id=<exact Person UUID>`
- `/library/?content_id=<exact ContentAsset UUID>`

Email/Requests → exact Runtime history:

- `/control/?automation_id=<exact Automation UUID>&run_id=<exact Run UUID>`

The receipt handoff UI says **Open this Run in Control**.

Security boundary:

- only opaque navigation IDs appear in these URLs;
- operator key, CSRF, sender/recipient addresses, subject/body and provider secrets do not;
- query parameters do not grant access or authority;
- destination surfaces still require the normal protected backend session;
- these handoffs are read-only and do not mutate Runtime state.

This is what turns stable IDs into a user-visible system property: the same object can be followed between views.

## Shared protected transport

Email, Requests, Directory, Library and Control increasingly share `assets/continuum-operator-api-v1.js` for the protected browser contract.

The model is:

1. backend secure cookie = valid protected operator session;
2. exact Origin = page is an allowed browser origin;
3. CSRF = extra write proof on protected mutations.

The operator key is submitted directly to the backend and cleared immediately.

Browser storage may hold harmless UI preferences/local preview concepts, but it must not become canonical protected storage.

## Validation checkpoint after PR #143

Focused validation on the final PR #143 head was green for:

- **Continuum Runtime Receipt Navigation Validation**
  - source contract;
  - Email/Requests exact receipt-link browser proof;
  - complete Email safe-simulation browser proof;
- **Continuum Email Validation**;
- **Continuum Requests Validation**
  - read-only preview;
  - canonical safe-simulation execution;
- **Control Center validation**
  - source contract;
  - desktop/mobile protected Runtime receipt proof;
- **Directory Server Proof Validation**;
- **Library validation**;
- **Continuum Source Truth Validation**;
- **CMX Static Validation**;
- **CMX Navigation Link Guard**;
- **Continuum Archived Lab Validation**;
- **CMX Secret Scan**.

Known repo-wide baseline failures remain:

- Terminal Theme Guard — existing Directory terminal-theme expectation;
- Privacy Audit — existing unrelated repo baseline;
- Doc Clarity — existing `/doc` test/source mismatch around escaped `can\'t`; PR #143 did not edit `/doc`.

Do not treat those inherited failures as proof that this Email/Requests/Control slice failed.

## Production deployment truth

The frontend is now increasingly ready for the already-built protected backend contracts.

That does **not** mean those contracts are reachable on production today.

A canonical surface may truthfully show:

`protected session connected → newer domain route 404 → NOT DEPLOYED`

Do not replace that state with browser-local fake server success.

No backend merge, production migration, backend deployment, SMTP configuration or real email was performed by PRs #141–#143.

## Real Email boundary

The stacked backend contains a deliberately bounded direct manual-owner SMTP path, but frontend acceptance remains safe simulation.

Current backend proof contract identifies `team@cmxchat.com` as the proof sender and `cmxchat@gmail.com` as the bounded proof recipient. Those strings do not create authority; exact backend SenderIdentity/Connection/readiness remain authoritative.

Preferred later real-email acceptance sequence:

1. prove safe simulation;
2. inspect exact receipt/failure/ambiguity behavior;
3. deploy the reviewed backend stack deliberately;
4. verify exact real Connection + SenderIdentity readiness and credential rotation;
5. verify exact Directory recipient;
6. explicitly authorize one bounded real acceptance;
7. run it through canonical Runtime only;
8. inspect receipt/provider outcome before expanding anything.

Current real-send acceptance remains zero until that deliberate decision occurs.

## What can still be done before new backend/Codex work

Useful frontend work remains, but the week has crossed an important threshold: identity, memory, action and explanation are now visibly connected.

Next low-risk work should be convergence and gap reconciliation rather than adding a large new product area:

1. verify canonical `/email/`, `/requests/`, `/directory/`, `/library/` and `/control/` behavior on public Pages when direct network/DNS access allows;
2. continue shared protected-session/deployment-state wording where inconsistent;
3. improve Check In integration only without blurring its distinct LIVE boundary;
4. inspect open Automations PR #131 before touching the Automation workspace; avoid collisions;
5. make Runtime/receipt/history relationships easier to understand without building a second Runtime;
6. add only a small number of additional Requests adapters that map to already-verified protected contracts;
7. run desktop/mobile/accessibility/nav consistency sweeps;
8. finish with a classified production-vs-stacked gap list for the later backend queue.

## What requires later backend/config/deployment work

Frontend cannot manufacture:

- merge/review of stacked `jay-app` backend work;
- production database migration;
- deployment of newer Directory/Connection/Library/Automation/Runtime routes;
- provider Connection/SenderIdentity configuration/readiness;
- SMTP credential verification/rotation;
- a bounded real SMTP acceptance decision;
- a generic durable scheduler;
- a general authenticated assistant/AI execution bridge.

Do not work around missing server capability in the browser.

## Assistant-control boundary

A future authenticated assistant can become another interface over the same backend world.

Desired pattern:

`human intent → typed proposed operation → preview → approval/Authority → protected backend APIs → durable truth → canonical Runtime → receipt`

AI interpretation is not permission. A better model, new tool, source, Connection or relationship does not automatically gain authority.

Durable future timers require server-side scheduling; they must not depend on an open browser tab.

## No-go shortcuts

Do not introduce:

- direct PostgreSQL from frontend;
- browser provider credentials/direct SMTP;
- undeployed-endpoint fakery;
- real-email success without canonical Runtime receipt;
- protected records stored as browser-owned truth;
- stale Draft auto-overwrite after `409`;
- mutation of immutable published history;
- generic tab-dependent scheduling;
- AI/relationship/readiness treated as authority;
- alternate Runtime/execution path;
- broad future-roadmap feature inflation during this integration week.

## Recovery order

When resuming:

1. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-LIVING-PRODUCT-ROADMAP-CURRENT.md`
2. current `CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md` from the active backend stack
3. `docs/continuum-frontend-roadmap-CURRENT.md`
4. this file
5. `docs/continuum-source-truth-CURRENT.md`
6. `docs/continuum-email-lab-CURRENT.md`
7. `docs/continuum-requests-CURRENT.md`
8. `docs/continuum-directory-server-proof-CURRENT.md`
9. `docs/continuum-library-lab-CURRENT.md`
10. `docs/continuum-control-center-lab-CURRENT.md`
11. current First-Repo main and open PRs

Do not make architecture or product-status assumptions from chat history when current GitHub source can answer them.

Never infer production deployment from frontend support or mocked browser proof.
