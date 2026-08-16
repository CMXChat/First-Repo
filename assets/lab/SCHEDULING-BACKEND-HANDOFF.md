# Check In Lab Scheduling Backend Handoff

Last updated: 2026-08-16

This document covers the long-running and recurring Action model prototyped by `lab-plan.js` inside Sequence.

## Boundary

The Lab planner is a product prototype. It may describe and preview timing, but the browser must never be the authoritative scheduler for a real Action.

Production direction:

```text
React UI
  → FastAPI
  → PostgreSQL definitions + incident runtime
  → server scheduler
  → durable queue / workers
  → provider adapters
```

A month-long Action must not be implemented as a browser timer, one sleeping HTTP request, or one worker process left alive for a month.

## Separate reusable definition from runtime

The reusable Action definition owns scheduling policy.

Suggested schedule fields:

- `action_id`
- `start_delay_seconds`
- `duration_seconds` nullable / zero for an instant Action
- `repeat_interval_seconds` nullable
- `repeat_limit` nullable
- `timezone` when a calendar recurrence needs local-time semantics
- `schedule_revision`

A presentation lane such as Messages / AI / Digital / Tasks is UI metadata and should not control execution behavior.

Incident runtime owns what actually happened:

- `incident_action_id`
- `eligible_at`
- `starts_at`
- `ends_at`
- `next_run_at`
- `occurrence_count`
- `runtime_state`
- `completed_at`
- `terminal_outcome`
- `definition_revision_id`
- `schedule_revision_id`

Useful runtime states can include:

- `waiting`
- `eligible`
- `waiting_for_dependency`
- `waiting_for_approval`
- `scheduled`
- `running`
- `waiting_for_next_occurrence`
- `completed`
- `failed`
- `timed_out`
- `cancelled`

## Eligibility, start, duration, recurrence

These are separate concepts.

Example:

```text
Action becomes eligible at final trigger
→ start 2 days later
→ remain active for 45 days
→ run every 24 hours while active
→ success releases Action B
→ terminal failure releases Action C
```

The authoritative server should calculate:

```text
eligible_at = trigger/dependency/condition result
starts_at = eligible_at + start_delay
ends_at = starts_at + duration
next_run_at = starts_at or prior_occurrence + repeat_interval
```

For calendar schedules, store UTC timestamps for execution while retaining the intended IANA timezone and recurrence rule when wall-clock behavior matters.

## Recurring occurrences

Each recurrence should be a durable occurrence/attempt record, not an in-memory loop.

A practical table is `checkin_action_occurrences` with fields such as:

- `id`
- `incident_action_id`
- `sequence_number`
- `scheduled_for`
- `started_at`
- `finished_at`
- `state`
- `idempotency_key`
- `provider_result_ref`
- `error_code`
- `retry_of_occurrence_id`

A recurring Action may have both occurrence retries and a recurrence cadence. Keep those concepts separate.

Example:

```text
Daily recurrence #7
  → delivery attempt 1 failed
  → delivery retry 1 succeeded

Daily recurrence #8
  → a new occurrence the next day
```

## Ending a long-running Action

An Action can terminate through a typed outcome such as:

- completed successfully
- failure after configured retry policy
- acknowledgement received
- acknowledgement timeout
- approval denied
- duration / timeout reached
- operator cancellation
- condition becomes satisfied

Do not use arbitrary client-supplied executable expressions for completion rules. Completion conditions should use the same typed-rule approach as the Decision engine.

A fixed duration can be the maximum runtime even when the Action may complete earlier because a condition is satisfied.

## Outcome routing

The existing Decision Policy concept remains the downstream graph.

When the long-running Action reaches a terminal outcome, the backend emits one durable incident event and activates the matching route:

- success → downstream success target
- final failure → failure target
- acknowledged → acknowledgement target
- no acknowledgement → no-ack target
- approval denied → denial target

Downstream Actions must resolve against the source Action's immutable incident execution snapshot, not the source's current editable definition.

## Scheduler behavior

The scheduler should query for due work such as:

```text
next_run_at <= now
AND runtime_state in schedulable states
```

Then:

1. acquire a lease / database lock
2. validate the incident is still eligible
3. create or claim an occurrence
4. enqueue an idempotent worker job
5. persist the next due time before releasing the lease
6. append audit events

The scheduler should be restart-safe. Server restarts must not lose a future run that is weeks away.

## Idempotency

An occurrence needs a stable key, for example:

```text
incident_id + action_id + action_revision + occurrence_number
```

A provider retry gets its own attempt key while retaining the occurrence relationship.

## Cancellation / plan changes

Editing the reusable Action must not mutate an already-open incident snapshot.

For an open incident, define explicit behavior for:

- cancel remaining future occurrences
- suspend future occurrences
- allow existing incident to continue on its snapshotted revision
- start a new incident only after the next check-in cycle

Do not silently apply a newly edited cadence to historical or already-running incident state.

## Long horizons

The Lab planner allows horizons up to roughly two years for visualization. That is not automatically a production limit.

Production should apply policy-specific safety limits for:

- maximum runtime
- minimum recurrence interval
- maximum occurrence count
- maximum queued future work
- retention of execution history
- provider-specific rate limits

## Sequence read model

The official Sequence page should not reconstruct the plan independently from raw tables.

A backend plan read model should provide:

- switch boundaries
- Action definition/version
- projected or scheduled start
- projected/scheduled end
- recurrence summary
- lane/category
- dependencies
- success/failure route destinations
- current incident runtime state when viewing Run mode
- next meaningful events

The frontend can then render Hours / Days / Weeks / Months zoom levels from one authoritative model.

## Plan vs Run

The Lab now separates two user concepts inside Sequence:

- **Plan**: what is configured to happen over time
- **Run / Test**: what is happening or what happened in one simulation/incident

The official project should preserve this distinction.

Plan is definition-oriented. Run is incident-oriented.

## Simulation

The official Test Center should use the same scheduling engine with:

- a controlled fake clock
- deterministic fake providers
- accelerated time
- `jump to next event`
- scenario-selected outcomes

A 90-day plan should be testable in seconds without altering the timestamps or ordering that the production scheduler would calculate.

## Audit requirements

Record at minimum:

- schedule definition created/changed
- incident schedule snapshotted
- Action became eligible
- start delay satisfied
- Action entered running state
- occurrence scheduled
- occurrence started
- occurrence succeeded/failed
- retry scheduled
- next recurrence scheduled
- Action completed/timed out/cancelled
- downstream route activated

All production timestamps are server-authoritative.
