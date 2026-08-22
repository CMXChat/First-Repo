# Continuum documentation map

Last verified: **2026-08-22**
Repository: `CMXChat/First-Repo`

This index is intentionally short. It tells a human or AI **where to start and which files are allowed to answer which questions**.

Useful older documents remain in the repository and git history. They are not deleted just because they are no longer the first thing to read.

## Start here

1. `AI-START-HERE.md` — fastest takeover path for a new AI/context window.
2. `PROJECT-STATUS-CURRENT.md` — cross-repository LIVE/WIRED/STACKED/PREVIEW/PLANNED truth.
3. `continuum-frontend-CURRENT.md` — current route-by-route frontend/backend wiring truth.
4. `DOCUMENTATION-AUTHORITY.md` — precedence, status vocabulary and preservation rules.
5. `../assets/cmx-routes.json` — canonical route registry only.
6. `CMXChat/jay-app/PROJECT-STATUS-CURRENT.md` — backend production/main/stack truth.

If these disagree with an older checkpoint, these files win for current-status questions unless executable source or verified deployment evidence proves they need updating.

## Current product routes

- `/checkin/` — production-live Check In foundation.
- `/directory/` — protected identity surface.
- `/library/` — protected content/version lane plus separate preview workspace.
- `/automations/` — server-backed Automation lane plus richer preview builder.
- `/email/` — protected manual Email/safe-simulation workflow.
- `/requests/` — bounded typed operator requests.
- `/control/` — protected Runtime history/receipt lane plus sample operational preview.
- `/spaces/` — context/briefing product experience.
- `/doc/` — product/architecture explanation.

The `/lab/` URL namespace is retired. Historical asset names such as `assets/lab/*` may remain as implementation identifiers.

## Domain docs to read when needed

### Automations

- `continuum-automations-real-backend-integration-CURRENT.md` — current protected Automation/Draft/Publish/Runtime frontend integration details.
- `continuum-automations-master-plan-CURRENT.md` — broader Automation product direction.
- `continuum-automations-operations-v7-CURRENT.md` and related v10 docs — accepted UI/control semantics and checkpoint history.
- `checkin-automations-frontend-CURRENT.md` — older Lab-era detailed implementation checkpoint; useful history, **not** current route/deployment authority.

### Requests / Email

- `continuum-requests-CURRENT.md`
- `continuum-email-lab-CURRENT.md`

These document the current protected operator flows and production-vs-stacked boundary.

### Directory

- `continuum-directory-server-proof-CURRENT.md`
- `continuum-directory-standalone-CURRENT.md`
- Directory master/product plans for future relationship breadth.

### Library / files / content

- `continuum-library-lab-CURRENT.md` — current protected Content lane plus preview split.
- `checkin-content-editor-CURRENT.md`
- `checkin-files-CURRENT.md`
- `checkin-library-premium-CURRENT.md`

Treat binary File/object-storage plans separately from the currently proven text/ContentVersion path.

### Control / Runtime history

- `continuum-control-center-lab-CURRENT.md`

The protected history lane is read-only. Sample Now/Upcoming/attention/simulation cards remain preview UI.

### Check In / continuity

- `checkin-context-handoff-CURRENT.md` — frontend/history checkpoint; current production/backend authority ultimately lives in `jay-app`.
- `continuum-continuity-health-CURRENT.md`
- relevant Check In product/design docs.

### `/doc/` product explanation

- `continuum-product-CURRENT.md`
- `continuum-doc-positioning-CURRENT.md`
- `continuum-doc-freeze-CURRENT.md`
- focused `/doc/` companion docs.

Open `/doc/` branches must be reconciled against current main before merge; branch age does not grant authority.

### Future architecture/product direction

Keep these as design contracts rather than deployment claims:

- Signals/Observations plans;
- Goals/Missions;
- AI/Planner;
- durable identity;
- capability/MCP/live-world plans;
- Files/binary storage;
- broader Directory relationships;
- autonomy/Control simulation direction.

## Backend reading order

For `CMXChat/jay-app` work:

1. `PROJECT-STATUS-CURRENT.md`
2. `AGENTS.md`
3. `specs/003-server-checkin/HANDOFF.md` for durable production/release history
4. `specs/003-server-checkin/CONTINUUM-BACKEND-ORDER-OF-WORK-CURRENT.md`
5. active stacked branch `specs/003-server-checkin/FRONTEND-BACKEND-INTEGRATION-CURRENT.md`
6. relevant active spec/tasks
7. executable source/tests/migrations

Remember: the exact frontend/backend integration handbook currently lives on the active stacked backend branch, not `jay-app/main`.

## Status vocabulary

- **LIVE** — deployed and verified.
- **WIRED** — frontend calls the real protected contract.
- **STACKED** — implementation exists/validated in source but is not production-deployed.
- **PREVIEW** — browser/product/sample behavior, not durable backend truth.
- **PLANNED** — documented direction only.

Do not invent weaker synonyms when one of these terms is sufficient.

## What happened to the old giant index?

It is preserved in git history at First-Repo commit:

`311e8c2feac73e6ea7d7f99b6a7895d2a973ad25`

The historical detail was not declared worthless; it was removed from the **entrypoint** because it made takeover slower and allowed old checkpoint language to compete with current truth.

See `history/2026-08-22-documentation-consolidation.md` for the consolidation record.

## Update discipline

When a meaningful status changes, update the smallest correct set:

- executable source/tests;
- relevant domain CURRENT doc;
- `PROJECT-STATUS-CURRENT.md` if cross-project status changed;
- `continuum-frontend-CURRENT.md` if frontend wiring changed;
- route registry if route metadata changed;
- paired `jay-app` project-status/handoff when backend status changed.

Do not update visible product status before the source/deployment truth supports it.
