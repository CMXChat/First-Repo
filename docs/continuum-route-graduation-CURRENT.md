# Continuum Route Graduation — CURRENT

## Decision

The user-facing `/lab/` URL namespace is retired as Continuum moves from isolated proving routes toward backend-backed product surfaces.

Route graduation changes URL ownership only. It does not inflate backend capability, execution authority, deployment status, or live acceptance.

## Canonical routes

- `/directory/` — protected Directory preview
- `/email/` — protected manual Email action proving surface
- `/automations/` — Automation workspace with LOCAL preview and separate SERVER-BACKED lane
- `/control/` — Control Center prototype
- `/library/` — Library prototype
- `/checkin/` — existing protected Check In surface
- `/spaces/` — existing Spaces surface

The old integrated Check In-derived prototype is preserved at `/archive/continuum-lab/` for regression and historical reference.

## Retired routes

There is no top-level `lab/` directory in the repository after this graduation.

The following are no longer canonical files or registered routes:

- `/lab/`
- `/lab/automations/`
- `/lab/control/`
- `/lab/directory/`
- `/lab/library/`
- `/lab/email/`
- `/lab/snapshot/`

For stale bookmarks only, the global `404.html` loads `assets/continuum-legacy-route-redirect.js`, which maps those historical paths to their canonical replacements while preserving query strings and hashes. Unknown routes continue to render the normal restricted 404.

## Compatibility map

- `/lab/` → `/control/`
- `/lab/automations/` → `/automations/`
- `/lab/control/` → `/control/`
- `/lab/directory/` → `/directory/`
- `/lab/library/` → `/library/`
- `/lab/email/` → `/email/`
- `/lab/snapshot/` → `/archive/continuum-lab/`

## Important implementation distinction

Internal asset paths under `assets/lab/` and historical storage/data attributes such as `cmx-lab-*` are not user-facing `/lab/` routes. They remain in this slice to preserve accepted frontend behavior and avoid a large unrelated asset/storage migration.

A later asset namespace cleanup may rename those implementation files deliberately, with its own regression pass. Do not mix that work into route graduation.

## Preserved truth boundaries

- `/automations/` does not gain unattended authority from this move.
- `/control/` remains sample/prototype state and does not claim production Runtime.
- `/library/` remains browser-local/prototype until its protected backend exists.
- `/directory/` remains the canonical protected Person/ContactMethod preview; Organizations and Groups are not silently promoted to backend truth.
- `/email/` remains unchanged by this route-graduation slice. Its public deployment issue is intentionally not being investigated here.
- The archived integrated prototype remains historical and may visibly use older Lab terminology.

## Validation

`tests/continuum-route-graduation.test.js` asserts:

- canonical top-level routes exist;
- the route registry contains no `/lab/` path;
- no top-level `lab/` directory exists;
- the archived integrated prototype exists outside Lab;
- stale `/lab/*` compatibility mappings are explicit;
- current Automations navigation returns to `/control/`;
- the Continuum docs route button targets `/automations/`.

`.github/workflows/continuum-route-graduation-validation.yml` runs this contract on pull requests and main.

Global static validation also requires the graduated route set and fails if a top-level `lab/` directory or registered `/lab/` path returns.

## Stop boundary

This slice is route ownership and compatibility cleanup. Do not use it to deploy backend migrations, expand Email/SMTP authority, redesign the product surfaces, migrate local prototype state into canonical server state, or rename every `assets/lab/` implementation file.
