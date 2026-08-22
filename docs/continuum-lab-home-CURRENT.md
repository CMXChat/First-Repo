# Continuum Lab Home — CURRENT

Status: focused frontend route/navigation contract

## Purpose

`/lab/` is the front door to Continuum's experimental and proving surfaces. It is a navigation/index surface, not a second implementation of Directory, Automations, Library, Runtime, Check In or Email.

Product rule:

> `/lab/` answers “what can I experiment with right now?” Focused routes own the actual product state.

The page intentionally uses a terminal/tree presentation because it is a development map. It supports direct links plus a tiny local command surface (`help`, `tree`, `status`, `open <route>`). The launcher performs no API fetch, owns no durable domain state and stores nothing in browser storage.

## Current tree

- `/lab/control/` — Control Center Lab
- `/lab/automations/` — Automations proving surface; server-backed lane remains distinct from LOCAL LAB state
- `/lab/directory/` — Directory development/proving route
- `/lab/library/` — Library prototype
- `/email/` — canonical protected manual Email action playground; marked `PROVING` because the frontend exists while its stacked backend remains undeployed/live-acceptance pending
- `/lab/email/` — compatibility redirect to `/email/`; owns no Email implementation
- `/lab/snapshot/` — preserved integrated Check In-derived Lab snapshot for regression/reference
- `/checkin/` — live protected Check In surface outside Lab
- `/directory/` — graduated protected Directory preview outside Lab
- `/spaces/` — Spaces experience
- `/doc/` — Continuum explanation

`/menu/` remains the separate CMX Operations/OSINT menu. Do not overload it with Continuum Lab navigation.

## Email route integration

The canonical Email proving surface now lives at `/email/`. The Lab launcher retains an Email row marked `PROVING`, but that row points outside the nested Lab route to `/email/`.

This label is intentionally frontend-scoped. It does not claim that the stacked Directory/Connection/Library/Automation/Runtime/SMTP backend is deployed to production. The Email route owns its protected API behavior and safety boundaries; the Lab home still owns navigation only.

Terminal commands `email` and `open email` resolve to `/email/`.

`/lab/email/` remains only as a compatibility redirect so old bookmarks do not break. Do not recreate a second Email implementation under `/lab`.

## Old `/lab/` preservation

Before this route change, plain `/lab/` booted the large generated Check In-derived integrated Lab snapshot through `assets/lab/lab-loader.js`.

That experience is not deleted. Its boot shell is preserved at:

`/lab/snapshot/`

The old loader, snapshot transformation, Planner proofs and their dedicated validation continue to exist for regression/reference. Plain `/lab/` no longer boots that snapshot.

Backward compatibility: old links shaped like `/lab/#lab=...` are redirected by the new Lab home launcher to `/lab/snapshot/#lab=...` so legacy hash navigation still resolves to the preserved integrated workspace rather than silently landing on an unrelated page.

## Status-label truth

- `LIVE` — an existing production-facing surface; does not mean every planned Continuum capability is deployed.
- `WIRED` / `PROVING` — frontend uses or models real protected contracts, but deployment/live acceptance may still be pending.
- `LAB` — experiment/prototype; not production execution truth.
- `NEXT` — planned proving surface only. A NEXT item must not be a live link or imply backend support that does not exist.
- `ARCHIVE` — preserved older integrated surface kept for regression/reference.

The Lab home must never infer authority or backend readiness from frontend labels.

## Security / authority boundary

The launcher has a deliberately closed CSP with `connect-src 'none'` and makes no backend requests. It contains no credentials and no provider logic.

The page is not a security boundary. Focused protected surfaces continue to rely on their own server/session/Origin/CSRF controls where applicable.

## Mobile behavior

The route tree changes from a four-column desktop row into a stacked mobile row below 640px. Validation covers 1280px, 430px, 390px and 360px widths and asserts no horizontal overflow and no route rows outside the viewport.

## Validation

Focused source contract:

`tests/continuum-lab-home.test.js`

Focused workflow:

`.github/workflows/continuum-lab-home-validation.yml`

The workflow checks:

- launcher JS parses;
- root no longer loads `lab-loader.js`;
- focused routes and truthful status labels exist;
- Email resolves to `/email/` and is marked `PROVING`;
- the preserved snapshot still loads the old Lab loader;
- the launcher remains navigation-only (no fetch/WebSocket/browser-storage/eval path);
- old `#lab=` links redirect to `/lab/snapshot/`;
- desktop/mobile geometry does not horizontally overflow.

## Next work

`/email/` owns its feature handoff at `docs/continuum-email-lab-CURRENT.md`. Further Email capability expansion must follow the canonical backend contract rather than expanding the Lab launcher.
