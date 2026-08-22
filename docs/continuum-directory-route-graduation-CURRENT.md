# Continuum Directory Route Graduation — CURRENT

Last updated: 2026-08-22

## Current decision

`/directory/` is the single canonical Continuum Directory route.

The earlier checkpoint that retained `/lab/directory/` as a separate proof route has been superseded by the broader Continuum route graduation recorded in `docs/continuum-route-graduation-CURRENT.md`.

There is no canonical or physical `/lab/directory/` product page after PR #129.

## Route ownership

### `/menu/`

`/menu/` owns the CMX Operations Menu for OSINT/research and operational tools.

### `/directory/`

`/directory/` owns the protected Continuum Directory preview for durable People and email ContactMethods.

Current truth remains:

- protected backend `Person` identity is the intended canonical source for People;
- protected email `ContactMethod` is the intended canonical source for supported email contacts;
- Organizations, Groups/audiences and richer relationship concepts remain local/proving behavior until typed backend contracts exist;
- route graduation does not claim the stacked backend is production-deployed or that live acceptance has occurred;
- Black Prompt remains only a client-side deterrent; backend session, owner scope, Origin and CSRF are authoritative.

## Retired proof route

`/lab/directory/` is retired.

Do not recreate it for frontend validation. Current tests and workflows must target `/directory/` directly or use the archived integrated proving snapshot at `/archive/continuum-lab/` when they intentionally need historical Lab behavior.

A stale request for `/lab/directory/` may be compatibility-forwarded by the global 404 redirect layer to `/directory/`, but it is not a registered product route and has no page of its own.

## Validation

`tests/continuum-directory-route-graduation.test.js` now locks down:

- `/menu/` owns the Operations Menu;
- `/directory/` owns the protected Continuum Directory preview;
- `/lab/directory/` is absent from the route registry and filesystem;
- root terminal commands continue to distinguish Operations Menu from Continuum Directory.

The broader `tests/continuum-route-graduation.test.js` additionally requires the entire canonical Continuum route set to remain outside the `/lab/` namespace.

## Backend boundary

This route decision changes URL ownership only. Do not infer deployment, persistence, provider execution, Runtime authority, Organizations/Groups backend support, or live acceptance from the route name.

For the complete current URL decision, use `docs/continuum-route-graduation-CURRENT.md` as the higher-level source of truth.
