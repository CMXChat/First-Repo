# Continuum Library — CURRENT

Last updated: 2026-08-22
Route: `/library/`
Status: **PROTECTED CONTENT FRONTEND PROOF — stacked Library backend not production-deployed**

## Role

Library is Continuum's durable information layer.

Current product model:

`Directory = who`

`Library = what information`

`Automations = what should happen`

`Runtime = what actually happened`

The important current proof is not generic file-manager polish. It is whether Continuum can preserve an exact piece of information, let the Draft change safely, freeze immutable historical Versions, and later prove which exact Version an Automation used.

## Current backend truth

The canonical backend handbook on `CMXChat/jay-app` PR #24 stack defines:

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

Protected routes used by the frontend lane:

- `GET /api/v1/checkin/operator/library`
- `POST /api/v1/checkin/operator/library/content`
- `GET /api/v1/checkin/operator/library/content/{content_id}`
- `PUT /api/v1/checkin/operator/library/content/{content_id}/draft`
- `POST /api/v1/checkin/operator/library/content/{content_id}/versions`

The backend also has folder/search/move contracts, but this frontend slice intentionally focuses on native Content durability before widening the integration.

Production boundary remains unchanged:

- protected operator session foundation is production-live;
- stacked Library Content/Draft/Version implementation is source-built and validated;
- the stacked backend has not been merged, production-migrated or deployed by this frontend work;
- a production session may unlock successfully while Library routes still return unavailable/not deployed.

Frontend support is not a LIVE deployment claim.

## Protected server lane

Canonical `/library/` now contains a dedicated protected content lane above the older browser-local product preview.

Files:

- `library/index.html`
- `assets/continuum-operator-api-v1.js`
- `assets/library/library-server-v2.js`
- `assets/library/library-server-v2.css`
- `tests/continuum-library-server-v2.test.js`
- `tests/continuum-library-server-v2-browser.js`
- `.github/workflows/library-lab-validation.yml`

The server lane uses the same shared operator transport as Email, Requests and Directory.

It does not create a second session, CSRF or error-classification implementation.

## Protected session behavior

The server lane distinguishes:

- checking;
- connected;
- locked;
- Origin denied;
- backend unreachable;
- Library route not deployed;
- backend unavailable/error.

When the backend is genuinely locked, the operator key can be entered directly on `/library/`.

The key is:

- sent directly to the backend unlock route;
- cleared from the input immediately;
- never written to localStorage or sessionStorage.

Protected reads use the backend cookie session.

Protected mutations use the same cookie plus `X-CSRF-Token` contract used by the other protected surfaces.

## Durable content behavior

### Create

Creating protected native content sends a typed `ContentAssetCreate` shape with:

- `kind`;
- `title`;
- `source_text`;
- `visibility: "library"`.

The backend response supplies the canonical ContentAsset ID and initial ContentDraft.

The browser does not manufacture a protected UUID.

### Edit Draft

The editor keeps the exact revision it loaded.

Saving sends:

`{ expected_revision, source_text }`

The backend is authoritative for revision progression.

### Conflict

A stale revision returns `409`.

The frontend does **not** retry with a newer revision and silently overwrite somebody else's change.

Instead it:

1. preserves the user's unsaved editor text;
2. fetches the latest server Draft;
3. explains the old editor revision versus current server revision;
4. requires the user to reload the server Draft before another save;
5. leaves reconciliation/manual re-application visible rather than hiding the conflict.

Plain-language meaning:

**a stale editor is evidence of competing state, not permission to overwrite newer state.**

## Immutable Version behavior

`Freeze immutable Version` calls the existing protected Version route only when the editor matches the current server Draft.

The returned ContentVersion owns:

- stable Version ID;
- version number;
- exact source Draft revision;
- exact frozen source text;
- checksum;
- creator/timestamp.

Later Draft edits do not rewrite the prior Version.

The frontend renders a small immutable-proof state after a Version is frozen:

- immediately after freezing, it identifies the Draft revision captured;
- after a later Draft edit, it explicitly shows that the Draft has moved while the frozen Version still contains its original source/checksum.

That is the current durable-memory proof.

## Why this matters

An Automation should not merely remember "the current text of this note."

It should be able to reference an exact immutable ContentVersion.

The trustworthy chain becomes:

`ContentAsset → ContentVersion → AutomationVersion → Runtime receipt`

Later edits to the current Draft can improve future work without rewriting historical intent or evidence.

## Local preview lane

The existing rich Library prototype remains available below the protected lane.

It still demonstrates future/product concepts such as:

- local folders;
- mixed native/file/media cards;
- local Favorites/Recent;
- preview import flow;
- local sample versions;
- media viewer shells;
- future binary upload direction;
- sample knowledge/dependency presentation.

Its stores remain:

- `cmx-lab-content-assets-v1`
- `cmx-lab-file-assets-v1`
- `cmx-lab-library-meta-v1`
- `cmx-lab-library-ui-v1`

Those stores are explicitly **local preview state**.

They are not PostgreSQL truth and must not receive protected server Content IDs, Draft source, ContentVersion source, operator keys or CSRF values.

## Files and media boundary

Binary object storage is not implemented by this First-Repo integration.

The local preview can still show PDF/image/video/audio/spreadsheet ideas, but it must not claim that file bytes were durably uploaded to the protected backend.

Future exact binary history remains conceptually:

`FileAsset → immutable FileVersion → protected viewer / attachment / dependency`

Do not fake that with browser-local bytes or public URLs.

## Canonical navigation

Active Library source now points directly to:

- `/control/`
- `/checkin/`
- `/directory/`
- `/library/`
- `/automations/`
- `/spaces/`

`/lab/*` remains compatibility history only and must not be reintroduced into active Library navigation.

## Validation target

Focused validation covers:

- existing local Library product/storage contract;
- protected server-lane source contract;
- shared operator API use;
- no second direct protected transport;
- canonical routes;
- protected session unlock;
- ContentAsset + Draft creation;
- CSRF on writes;
- immutable Version creation;
- later Draft change without rewriting the frozen Version;
- real `409` conflict handling with unsaved text preservation;
- reload/reconcile after conflict;
- desktop and mobile horizontal containment;
- protected values absent from localStorage/sessionStorage.

Browser validation uses a mocked backend boundary. It proves frontend orchestration and semantics, not production deployment.

## Product loop

Library now strengthens the shared Continuum proof:

`Requests → Directory identity → Library durable memory → Email/Automations → Runtime → Receipt`

The next cross-surface step is to make exact protected ContentAsset/ContentVersion IDs easier to follow into Email/Automations and then into human-readable Runtime history.

## Recovery order

When resuming Library work:

1. `docs/continuum-frontend-roadmap-CURRENT.md`
2. `docs/continuum-frontend-week-CURRENT.md`
3. `docs/continuum-source-truth-CURRENT.md`
4. this file
5. `library/index.html`
6. `assets/continuum-operator-api-v1.js`
7. `assets/library/library-server-v2.js`
8. `tests/continuum-library-server-v2.test.js`
9. current `CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md` on the active PR #24 stack

Never infer production availability from frontend support or mocked browser proof.
