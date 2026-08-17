# Check In Lab Scheduling Backend Handoff

Last updated: 2026-08-17
Status: Supporting Lab note. The canonical backend contract is `CMXChat/jay-app/specs/003-server-checkin/AUTOMATION-FRONTEND-CONTRACT.md`.

This file explains timing concepts demonstrated in Check In Lab. It must not override the current `CHECKIN-MASTER-PLAN.md`, `tasks.md`, or the canonical Automation frontend/backend contract in `jay-app`.

## Boundary

Lab may design and preview timing. The browser is never authoritative scheduling infrastructure.

Current product direction:

```text
Frontend
  → FastAPI
  → PostgreSQL Automation definitions
  → durable Run / RunAction / Occurrence / ExecutionAttempt state
  → server scheduler / worker
  → provider adapters
```

Do not implement a long wait as:

- a browser timer;
- a sleeping HTTP request;
- a worker process held open for hours, months, or years.

Phase 2A may store and validate timing definitions. Real scheduler authority begins in the durable runtime phase.

## Keep these concepts separate

```text
WAIT / delay
RECURRENCE
RETRY
```

They are different behaviors.

- **Wait/delay** controls when workflow progress becomes due.
- **Recurrence** creates later planned occurrences according to an approved cadence.
- **Retry** reacts to a failed provider/execution attempt.

Never represent retry as ordinary recurrence.

## Wait modes

The focused Automation frontend currently supports:

```text
NONE
DELAY
EXACT DATE/TIME
```

### Relative delay

The user may express a precise elapsed delay using days, hours, and minutes.

Example:

```text
2 days + 3 hours + 17 minutes
```

The backend may normalize that to a canonical duration such as seconds for definition validation/runtime calculation.

### Exact date/time

Exact scheduling preserves local human intent:

```text
2026-08-22
15:17
America/New_York
```

Use IANA timezone identifiers.

The backend must validate:

- date/time ranges;
- timezone validity;
- DST gaps/nonexistent local times;
- DST repeated/ambiguous local times.

Validation/Review should show the resolved interpretation before Publish when possible.

## Recurrence units

The focused frontend supports custom recurrence units:

```text
minutes
hours
days
weeks
months
years
```

Do not model all six as `repeat_interval_seconds`.

There are two semantic classes.

### Elapsed cadence

- minutes
- hours
- days
- weeks

These can be represented as bounded elapsed durations where product semantics permit.

### Calendar cadence

- months
- years

Calendar cadence must preserve:

- interval count;
- unit;
- recurrence anchor;
- intended local wall-clock time when applicable;
- IANA timezone.

Examples:

```text
Every 2 months · America/New_York
Every 1 year · Europe/London
```

`1 month` is **not** `30 days`.

`1 year` is **not** `365 days`.

Do not normalize monthly/yearly recurrence to fixed seconds.

## Monthly recurrence policy

The backend needs one deterministic product rule for day-of-month values that do not exist in every month.

Recommended first implementation:

- preserve the original requested day-of-month as the anchor;
- when that day does not exist in a target month, clamp that occurrence to the final valid day of that month;
- keep the original anchor for later months.

Example:

```text
Anchor: January 31
February occurrence: February 28 or 29
March occurrence: March 31
April occurrence: April 30
May occurrence: May 31
```

Do not permanently change the anchor from 31 to 28/29 after February.

## Yearly recurrence and leap day

Recommended first implementation for a February 29 anchor:

- preserve February 29 as the permanent anchor;
- in non-leap years, schedule February 28;
- in leap years, return to February 29.

If product policy changes later, change it explicitly and version/test the behavior. Never let a date library silently decide policy.

## DST and timezone behavior

For calendar recurrence, preserve local wall-clock intent in the selected IANA timezone.

The scheduler must define and test what happens when a recurrence lands on:

- a nonexistent local time during spring-forward;
- an ambiguous/repeated local time during fall-back.

Do not silently reinterpret ambiguous times.

A definition/preview endpoint should be able to return the next resolved UTC occurrence so the UI can show exactly what will happen before Publish.

## Definition shape

Exact API/Pydantic schema belongs to Phase 2A implementation, but a conceptually useful distinction is:

```text
wait:
  type: none | delay | at

repeat:
  type: none | preset | interval | until_acknowledged
  every: 2
  unit: months
  timezone: America/New_York
```

For elapsed units, `timezone` may be unnecessary.

For calendar units (`months`, `years`), timezone is required.

## Durable runtime

When runtime becomes real, due work belongs in PostgreSQL/server state.

Core runtime concepts remain:

- `Run`
- `RunAction`
- `Occurrence`
- `ExecutionAttempt`
- persisted due timestamps
- claims/leases
- idempotency
- restart recovery

A scheduler should claim due work transactionally and record the next planned occurrence before releasing its claim.

Server restart must not lose work scheduled weeks or years in the future.

## Occurrence vs execution attempt

A recurring occurrence and a retry attempt are different records.

Example:

```text
Monthly occurrence #7
  → provider attempt 1 failed
  → provider retry 1 succeeded

Monthly occurrence #8
  → a new recurrence next month
```

Each side effect needs stable idempotency protection.

## Definition edits and history

Editing a reusable Automation must not rewrite historical Runs or Occurrences.

Published Automation versions remain immutable.

A Run freezes the definition inputs needed to explain what actually happened.

## Long horizons

Months/years in the UI do not imply that the application should pre-enqueue thousands of future jobs.

Persist the definition and next meaningful due occurrence. Materialize future work as required by the scheduler/runtime design.

Apply policy limits for:

- minimum recurrence interval;
- maximum occurrence count where appropriate;
- maximum runtime/horizon where appropriate;
- provider rate limits;
- retained execution history.

## Simulation

Later Test/Simulation should use the same timing semantics with:

- controlled fake clock;
- deterministic fake providers;
- accelerated time;
- jump-to-next-event behavior.

A multi-year calendar plan should be testable quickly without changing the ordering or calendar interpretation that production would use.

## Audit requirements

When these concepts become real, Audit should record enough to explain:

- timing/recurrence definition created or changed;
- published version identity;
- resolved next occurrence;
- occurrence claimed;
- occurrence started/finished;
- provider attempt/retry;
- next recurrence scheduled;
- cancellation/completion/timeout;
- downstream route activation.

All production execution timestamps are server-authoritative.

## Current frontend reference

Focused UX reference:

`https://db.cmxchat.com/lab/automations/`

Current frontend behavior for custom recurrence:

- minutes;
- hours;
- days;
- weeks;
- months;
- years;
- explicit Calendar timezone appears for months/years;
- UI warns that month/year cadence uses calendar semantics.

This remains UX-only until the typed backend definition APIs and later durable runtime exist.
