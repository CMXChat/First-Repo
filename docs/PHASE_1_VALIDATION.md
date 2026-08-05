# Phase 1 Validation: OSINT Case Context

Validated implementation head before this documentation commit: `7be8abe1a455b2234c3da9642da26b864db76d5d`.

## Completed behavior

- `/osint` prefers the authenticated same-origin DNS gateway.
- Direct Google Public DNS is limited to a labeled static fallback.
- Older DNS requests are cancelled and cannot overwrite a newer entity.
- DNS responses render progressively with source provenance.
- The operator can see protected or local-only mode.
- The operator can select an active persistent case.
- OSINT session persistence is explicit and atomic through the case import transaction.
- Domain snapshots cannot be saved while DNS collection is incomplete.
- `Open Cases` can return to the exact selected case.
- Cases startup loading tolerates the initial busy state.

## Validation results

All workflow groups passed on the implementation head, including:

- source and syntax policy
- privacy and secret scans
- static and navigation policy
- backend and write-security tests
- PostgreSQL 18 migrations and API integration
- container and Compose validation
- full Chromium desktop platform suite
- full Chromium mobile platform suite

The expanded browser suite exposed and corrected:

- an outdated Resources title expectation
- a query-string URL assertion bug
- an ambiguous safe-text locator in the Metadata test
- browser-suite exhaustion of the normal API request budget

Only the isolated development browser server receives a larger test request allowance. Staging and production rate limits remain unchanged.

## Release state

This validation does not approve production deployment. Protected staging, Cloudflare Access acceptance, origin isolation, live headers, logging review, encrypted backup validation and rollback rehearsal remain required.
