# Check In Lab Action Builder Backend Handoff

This file documents the intended backend contract for the Lab Action Builder while the current implementation is a browser-only simulation.

## Non-negotiable boundary

The browser may create, edit, sort, preview, and simulate action definitions. It must never be the authoritative scheduler or executor.

The production path should be:

```text
Browser UI
   ↓ authenticated HTTPS
FastAPI operator API
   ↓
PostgreSQL action definitions + revisions
   ↓
Server-side eligibility scheduler
   ↓
Execution queue / worker
   ↓
Approved executor adapter
   ↓
SMS / email / AI / API / publishing / account provider
```

No production action should be executed because a browser timer expired.

## Core tables

A practical first schema:

- `checkin_action_definitions`
- `checkin_action_targets`
- `checkin_action_trigger_rules`
- `checkin_action_guardrails`
- `checkin_action_revisions`
- `checkin_action_executions`
- `checkin_action_execution_targets`
- `checkin_action_execution_events`

Future phases can add:

- `checkin_action_conditions`
- `checkin_action_dependencies`
- `checkin_action_acknowledgements`
- `checkin_action_fallbacks`

## Action definition

Suggested fields:

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

Suggested lifecycle values for definitions:

- `draft`
- `enabled`
- `suspended`
- `archived`

Runtime execution states belong on execution rows, not on the reusable definition.

## Stable targets

`checkin_action_targets` should reference stable entity IDs instead of copying mutable metadata into the action definition.

Useful columns:

- `action_id`
- `target_kind`
- `target_id`
- `purpose`
- `created_at`

Initial target kinds:

- `person`
- `organization`
- `document`
- `digital_asset`

A person may resolve to an email address or phone number when the executor prepares a run. A document may resolve to a specific version. A digital asset may resolve to a provider connection or secret reference.

Before execution, snapshot the exact resolved values into `checkin_action_execution_targets`. That preserves what actually happened even if the source record changes later.

## Trigger rules

The switch server owns the timeline.

For the current switch contract:

```text
deadline_at = last_checkin_at + 72 hours
grace_expires_at = deadline_at + 24 hours
```

Supported Lab trigger modes map cleanly to backend rules:

- `deadline`: eligible at `deadline_at`
- `grace_offset`: eligible at `deadline_at + offset`, with offset constrained to the grace window
- `grace_expiry`: eligible at `grace_expires_at`
- `scheduled`: eligible at an explicit absolute timestamp
- `manual`: never automatically eligible

Store timestamps in UTC. Store a display timezone only for presentation and recurring scheduling rules.

The scheduler should calculate eligibility from authoritative server timestamps and persisted switch state. Never trust a client-submitted `is_due`, countdown value, or browser clock.

## Eligibility is separate from execution

An action can become eligible without executing immediately.

Examples:

- eligible at 72-hour deadline, then wait for operator approval
- eligible 3 hours into grace, but cancel if a new check-in arrives
- eligible at grace expiration, then wait for a dependency
- eligible at a calendar time, but only if the switch is still overdue

The backend should persist eligibility transitions so the audit log can answer why an action did or did not execute.

## Guardrails

Initial guardrails in the Lab UI:

- `one_time`
- `require_overdue`
- `require_approval`
- `retry_count`
- `retry_interval_seconds`

Backend policy is authoritative. For example, destructive-risk actions should require approval regardless of a malformed client payload.

Future condition/dependency rules should be normalized enough to validate safely. Avoid arbitrary client-supplied executable code.

## Risk classes

Initial classes:

- `informational`
- `important`
- `critical`
- `destructive`

Risk affects required review, approvals, delays, logging, and executor policy. It must not merely change UI color.

Recommended destructive-action policy:

- mandatory operator approval
- optional second approver for especially sensitive actions
- minimum cooling-off delay where practical
- immutable execution snapshot
- idempotency key
- dry-run or preview if the provider supports it
- explicit rollback/recovery metadata where possible

## Executor registry

Do not encode provider-specific execution logic into the generic action table.

Use an approved server-side executor registry such as:

```text
sms -> SmsExecutor
email -> EmailExecutor
social -> SocialPublisherExecutor
ai -> AiTaskExecutor
organization_notice -> NoticeExecutor
publish -> PublicationExecutor
webhook -> WebhookExecutor
digital_account -> DigitalAccountExecutor
custom -> explicitly registered custom handler
scheduled -> task executor selected by configuration
```

The registry should reject unknown action types or unregistered custom handlers.

## Secrets and provider connections

Action definitions must never store:

- passwords
- API tokens
- OAuth refresh tokens
- private keys
- MFA seeds
- recovery codes
- session cookies

Store a `connection_ref` or `secret_ref` that the executor resolves server-side through the future secret-management layer.

The browser should receive only the minimum safe connection metadata needed to render the configuration UI.

## SMS / email

The executor should resolve the selected Person or Organization records at execution preparation time.

The execution snapshot should capture:

- resolved recipient address/number
- normalized delivery channel
- message/template revision
- attachment document versions
- provider adapter
- provider message ID after submission
- delivery state when available

Provider delivery state must come from the provider/webhook path, not the browser.

## Social / publication

Publishing actions should resolve a Digital Asset record for the destination account or site.

Store the intended audience/privacy mode explicitly. Do not silently default a private draft to public publication.

High-risk publication should support a preview artifact and approval step before provider submission.

## AI actions

The default AI action permission should be output-only.

Suggested policy fields:

- objective
- approved context record IDs
- approved tools
- forbidden tools
- output destination
- maximum runtime
- token/cost budget where appropriate
- approval requirement

The AI executor should not inherit broad application permissions automatically. Tool access must be explicit per action or policy.

Persist:

- model/provider identifier
- prompt/instruction revision
- resolved context snapshot references
- tool calls
- output artifact
- errors
- timestamps

## Webhooks / APIs

Outbound API actions should use an allowlisted connection/endpoint configuration controlled by the server.

Do not allow an arbitrary browser-entered URL to become an unrestricted production request target. Validate scheme, destination policy, connection ownership, and authentication configuration server-side.

## Digital account actions

These are high-risk by default.

A Digital Asset record identifies the account/resource. The executor resolves its provider adapter and secret reference.

Operations such as access transfer, disablement, archival, or credential rotation should have provider-specific validation and stronger approval policy. Avoid one generic endpoint that accepts an arbitrary operation string and performs it blindly.

## Scheduler and worker behavior

Recommended mechanics:

- scheduler periodically evaluates enabled actions against authoritative switch state
- eligibility changes happen in a database transaction
- enqueue with an idempotency key
- worker takes a lease/lock before execution
- retries use persisted attempt counts and backoff
- worker writes append-only execution events
- final state is persisted before downstream dependents are released

Do not depend on one long-running web request to carry an action through execution.

## Idempotency

Every execution should have an incident-aware idempotency key such as:

```text
switch_id + incident_id + action_id + trigger_revision
```

This prevents duplicate side effects when workers retry or restart.

## Execution snapshots

At execution preparation time, freeze:

- action definition revision
- trigger rule revision
- guardrails
- resolved recipients
- document version IDs
- digital asset IDs and safe connection references
- AI context references
- exact message/payload/template
- eligibility reason

Later record edits must not rewrite history.

## Audit events

At minimum record:

- definition created/updated/enabled/suspended
- became eligible
- eligibility cancelled because switch returned safe
- awaiting approval
- approved/rejected
- queued
- execution started
- provider submission
- retry scheduled
- succeeded/failed
- acknowledged when supported

Each event should include actor/service identity, timestamp, correlation ID, action ID, execution ID, and safe structured metadata.

## Suggested API shape

```text
GET    /api/v1/checkin/operator/actions
POST   /api/v1/checkin/operator/actions
GET    /api/v1/checkin/operator/actions/{action_id}
PATCH  /api/v1/checkin/operator/actions/{action_id}
POST   /api/v1/checkin/operator/actions/{action_id}/enable
POST   /api/v1/checkin/operator/actions/{action_id}/suspend
POST   /api/v1/checkin/operator/actions/{action_id}/duplicate
DELETE /api/v1/checkin/operator/actions/{action_id}

GET    /api/v1/checkin/operator/actions/{action_id}/revisions
GET    /api/v1/checkin/operator/actions/{action_id}/executions
GET    /api/v1/checkin/operator/actions/{action_id}/activity

POST   /api/v1/checkin/operator/actions/{action_id}/simulate
POST   /api/v1/checkin/operator/executions/{execution_id}/approve
POST   /api/v1/checkin/operator/executions/{execution_id}/reject
```

Simulation should execute against dedicated mock adapters or dry-run implementations, never production provider credentials.

## Phase 5 integration

The next timeline phase should visualize action definitions from this model on the 72h + 24h boundary.

Dependencies and conditions should extend the same action IDs and execution model instead of introducing a parallel automation system.

## Lab migration rule

Do not automatically migrate localStorage action definitions into production. They contain synthetic records and may have been intentionally broken during testing.

When the backend exists, replace the local storage adapter with the authenticated API while preserving the presentation and builder concepts that survived Lab testing.
