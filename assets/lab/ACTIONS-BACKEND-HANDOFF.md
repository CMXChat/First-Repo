# Check In Lab Action Builder Backend Handoff

Last updated: 2026-08-16

This document describes the production direction behind the Lab Action Builder. The Lab is browser-only simulation and must never become the authoritative scheduler or executor.

For long-running and recurring behavior, also read `SCHEDULING-BACKEND-HANDOFF.md`.

## Non-negotiable boundary

The browser may create, edit, preview, and simulate Action definitions. Production side effects belong to authenticated server services and durable workers.

```text
React UI
  → generated authenticated API client
FastAPI operator API
  → application/domain services
PostgreSQL Action definitions + revisions
  → scheduler / Decision engine
execution queue / workers
  → approved provider adapters
```

No production Action should execute because a browser countdown, browser interval, or open page reached a timestamp.

## Core persistence

A practical schema can include:

- `checkin_action_definitions`
- `checkin_action_targets`
- `checkin_action_trigger_rules`
- `checkin_action_guardrails`
- `checkin_action_schedules`
- `checkin_action_revisions`
- `checkin_incident_actions`
- `checkin_action_occurrences`
- `checkin_action_executions`
- `checkin_action_execution_targets`
- `checkin_action_execution_events`

Decision-specific tables are covered by `DECISIONS-BACKEND-HANDOFF.md`.

## Action definition

Suggested reusable fields:

- `id`
- `switch_id`
- `name`
- `action_type`
- `risk_class`
- `status`
- `config_json`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`
- `revision_number`

Definition lifecycle:

- `draft`
- `enabled`
- `suspended`
- `archived`

Runtime states belong to incident/execution rows, not the reusable definition.

## Stable targets

Action definitions should reference stable records instead of copying mutable contact/account/document metadata.

Initial target kinds:

- Person
- Organization
- Document
- Digital Asset

A Person may resolve to a phone/email during execution preparation. A Document resolves to an exact document version. A Digital Asset can resolve to a provider connection / safe secret reference.

Before side effects, snapshot exact resolved values into execution-target rows. Later record edits must not rewrite what an incident used.

## Configurable switch timing

The current product model is configurable. Do not hardcode 72 hours or 24 hours in production logic.

Conceptually:

```text
deadline_at = last_checkin_at + policy.interval
final_trigger_at = deadline_at + policy.grace
```

`72h + 24h` is only the historical/default example.

Current trigger families:

- `deadline` → eligible at `deadline_at`
- `grace_offset` → eligible at `deadline_at + configured offset`, constrained by the snapshotted grace policy
- `grace_expiry` → eligible at `final_trigger_at`
- `scheduled` → eligible at an explicit calendar time
- `manual` → never automatically eligible from time alone

Store authoritative timestamps in UTC. Retain IANA timezone information for wall-clock recurring schedules where necessary.

The scheduler calculates eligibility from the incident's snapshotted policy and authoritative server state. Never trust client countdown values or client-submitted `is_due` flags.

## Eligibility is separate from execution

An Action can become eligible without executing immediately.

Examples:

- eligible at deadline, then wait for approval
- eligible in grace, but cancel because a valid check-in returned the incident to Safe
- eligible at final trigger, then wait for an upstream dependency
- eligible at a calendar time, then wait until a condition becomes true
- eligible, then intentionally delay two more days before the Action starts

Persist these transitions so Activity can explain why something did or did not run.

## Long-running and recurring Action definitions

The Lab now prototypes schedule metadata in addition to the trigger boundary.

Production scheduling policy should be normalized into fields such as:

- `start_delay_seconds`
- `duration_seconds`
- `repeat_interval_seconds`
- `repeat_limit`
- `timezone` / recurrence metadata when required
- `schedule_revision`

A long-running Action can therefore be modeled as:

```text
eligible
→ start delay
→ running
→ recurring occurrences while active
→ terminal outcome
→ Decision route activates downstream Action
```

Example:

```text
Final trigger
→ wait 2 days
→ monitor once per day for 45 days
→ success → release Action B
→ terminal failure → notify Action C
```

Do not keep a worker, browser tab, or HTTP request alive for the whole duration. Persist `starts_at`, `ends_at`, `next_run_at`, occurrence count, and runtime state, then let the scheduler wake due work.

Each recurrence should have a durable occurrence row and an idempotency key. Occurrence retries and recurrence cadence are separate concepts.

Read `SCHEDULING-BACKEND-HANDOFF.md` for the full model.

## Guardrails

Initial reusable guardrails include:

- execute once per incident where appropriate
- require switch/incident to remain overdue
- require approval
- retry count
- retry interval/backoff

Backend policy is authoritative. Destructive risk should require strong approval regardless of malformed client payloads.

Useful stronger protections for high-risk operations:

- mandatory approval
- optional second approver
- cooling-off delay
- immutable execution snapshot
- idempotency key
- preview/dry-run when provider supports it
- explicit recovery/rollback metadata

## Risk classes

Initial classes:

- informational
- important
- critical
- destructive

Risk must influence server policy. It must not merely change UI color.

## Executor registry

Provider-specific behavior should live behind an approved server registry rather than arbitrary Action code.

Conceptually:

```text
sms → SmsExecutor
email → EmailExecutor
social → SocialPublisherExecutor
ai → AiTaskExecutor
organization_notice → NoticeExecutor
publish → PublicationExecutor
webhook → WebhookExecutor
digital_account → DigitalAccountExecutor
custom → explicitly registered handler only
scheduled → approved task executor
```

Reject unknown executor types/handlers server-side.

## Secrets and connections

Never store these in ordinary Action definitions:

- passwords
- API tokens
- OAuth refresh tokens
- private keys
- MFA seeds
- recovery codes
- session cookies

Use `connection_ref` / `secret_ref` records resolved server-side by the provider adapter.

## SMS / email

At execution preparation, resolve the selected Person/Organization records and snapshot:

- exact recipient address/number
- normalized channel
- message/template revision
- attachment document versions
- provider adapter
- provider message ID after submission
- delivery state when callbacks are available

Delivery state comes from provider/server callbacks, never from browser assumptions.

## Social / publication

Resolve the destination through a Digital Asset / approved provider connection.

Audience/privacy must be explicit. High-risk publication should support preview + approval before provider submission.

## AI Actions

Default AI capability should remain output-only.

Useful policy fields:

- objective
- approved context record IDs
- approved tools
- forbidden tools
- output destination
- maximum runtime
- cost/token budget where appropriate
- approval requirement

Persist model/provider ID, instruction revision, resolved context snapshot references, tool calls, output artifact, errors, and timestamps.

AI tools should not inherit broad application permissions automatically.

## Webhooks / APIs

Outbound API Actions should resolve an allowlisted server-owned integration/connection.

Do not convert an arbitrary browser-entered URL into unrestricted production network access. Validate destination policy, scheme, ownership, authentication reference, timeout, and expected response server-side.

## Digital account Actions

These are high-risk by default.

The Digital Asset identifies the target resource. A provider-specific adapter validates the requested operation and resolves safe connection references.

Access transfer, disablement, archival, credential rotation, or similar operations require stronger approval and explicit provider policy.

## Scheduler / worker behavior

Recommended pattern:

1. scheduler evaluates authoritative switch/incident state and due schedules
2. eligibility/runtime transition is persisted transactionally
3. due occurrence is created or claimed with a lease/lock
4. work is queued with an idempotency key
5. worker performs one bounded attempt
6. append-only execution event is written
7. next retry/recurrence is persisted if needed
8. terminal state is persisted before downstream routes are released

Server restarts must not lose work scheduled days or months into the future.

## Idempotency

A reusable incident execution key can begin with:

```text
switch_id + incident_id + action_id + action_revision
```

Recurring occurrences should add occurrence sequence/time identity, and individual retries should have distinct attempt IDs.

## Execution snapshots

Before external work, freeze at minimum:

- Action definition revision
- trigger revision
- schedule revision
- Decision Policy revision
- guardrails
- resolved targets
- document versions
- Digital Asset IDs / connection references
- exact message/payload/instructions
- eligibility reason
- relevant typed-condition evaluation inputs

Later edits must not rewrite incident history.

## Outcome routing

Execution and scheduling end in a typed terminal outcome. The Decision engine activates the matching downstream route.

Examples:

- success
- final failure
- acknowledged
- no acknowledgement
- approval denied
- timeout/cancel when supported by the typed policy model

Do not invent a separate scheduling dependency graph that competes with Decision Policy routing.

## Audit minimum

Record:

- definition created/updated/enabled/suspended/archived
- trigger/schedule version changed
- became eligible
- eligibility cancelled
- start delay entered/satisfied
- awaiting/receiving/denying approval
- occurrence scheduled/started/completed/failed
- retry scheduled/exhausted
- recurrence scheduled
- delivery callback
- acknowledgement callback/timeout
- terminal Action outcome
- downstream route activated

All production timestamps are server-authoritative.

## Simulation requirement

The official Test Center should use the same domain scheduling/Decision code with:

- controlled fake clock
- deterministic fake providers
- accelerated time
- scenario-selected outcomes
- durable simulated incidents/audit events

A month-long plan should be testable in seconds while preserving the same calculated ordering/timestamps that production scheduling would use.

## Browser role

The browser may:

- request definition mutations
- show Plan/Run projections returned by the server
- request a simulation scenario
- request an authorized approval/acknowledgement
- render server state

The browser must not decide that a real Action is due or execute it.
