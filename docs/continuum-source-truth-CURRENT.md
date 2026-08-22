# Continuum cross-surface frontend truth — CURRENT

Date: 2026-08-22
Authority: **FRONTEND STATUS ONLY**
Repository: `CMXChat/First-Repo`

This document exists only to explain the shared browser status layer used by several Continuum routes.

It is **not** a backend checkpoint, release record, migration log, PR tracker, or deployment authority.

All backend/project truth belongs in `CMXChat/jay-app`.

## What this layer may say

It may describe:

- whether a frontend lane is wired to a protected backend contract;
- which UI is still local/sample preview behavior;
- canonical route names;
- frontend navigation between surfaces;
- that browser code must show unavailable backend responses truthfully.

It must not duplicate:

- backend release SHAs;
- migration revision IDs;
- backend PR/task status;
- backend test/coverage counts;
- provider implementation details;
- Runtime/Authority persistence internals;
- deployment plans.

For those facts, read `CMXChat/jay-app/PROJECT-STATUS-CURRENT.md` and the relevant backend handoff/spec.

## Shared UI

`assets/continuum-source-truth-v1.js` owns the compact frontend-status badge/dialog and a few compatibility copy patches.

Despite the historical filename, its job is now **frontend status**, not backend source truth.

`assets/continuum-source-truth-v1.css` owns its visual treatment.

The dialog explicitly points backend authority to `CMXChat/jay-app`.

## Supported surfaces

### `/control/`

Frontend truth:

- protected read-only execution-history/receipt projection is wired where available;
- exact links to Directory/Library objects are supported;
- Now/Upcoming/attention/simulation panels remain sample preview UI.

### `/directory/`

Frontend truth:

- protected Person/email-contact lane is wired where available;
- stable-ID focus through `?person_id=` is supported;
- Organizations/Groups/richer relationships remain preview concepts.

### `/library/`

Frontend truth:

- protected content/draft/version lane is wired where available;
- conflict and immutable-version presentation is part of the frontend proof;
- mixed media/files/folders/import concepts remain separate preview behavior unless backed by a protected contract.

### `/automations/`

Frontend truth:

- protected Automation lifecycle/history lane is wired where available;
- richer workflow/Planner/advanced-flow concepts remain preview behavior;
- server-backed state must never silently fall back to browser-local Automation truth.

### `/email/`

Frontend truth:

- protected manual Email orchestration is wired where available;
- receipt navigation to Control is supported;
- browser code never directly performs SMTP/provider work.

## Canonicalization

The shared script also converges stale `/lab/*` links to canonical routes such as:

- `/control/`
- `/automations/`
- `/directory/`
- `/library/`
- `/email/`

Historical `assets/lab/*` names may remain in code.

## Backend availability

A WIRED frontend does not guarantee that its backend dependency is available in the current environment.

The browser must surface the actual protected API response.

First-Repo does not maintain the explanation for backend availability. Engineers and AI should consult `jay-app` for that truth.

## Safety boundary

The shared frontend layer cannot:

- grant permission/Authority;
- create a second backend state model;
- infer deployment from frontend source;
- turn local preview state into durable server truth;
- perform provider work directly;
- maintain backend release/migration status.

## Update rule

Update this file only when the **shared frontend status behavior** changes.

If a backend release, migration, implementation milestone, provider rule or backend test result changes, update `jay-app`, not this document.