# Check In Lab · Phase 6 Decision Engine Backend Handoff

Last updated: 2026-08-16

This file documents the intended production boundary behind the Lab-only conditions, dependencies, acknowledgement, and outcome-routing UI.

## Non-negotiable rule

The browser must never become the authoritative decision engine for a real contingency incident.

Production direction:

```text
Browser
  ↓
FastAPI
  ↓
PostgreSQL
  ↓
Eligibility / decision workers
  ↓
Approved provider executors
```

The browser can create validated definitions, request authorized mutations, and render explanations. Server-side code owns incident state, clocks, evaluations, retries, approvals, acknowledgements, route activation, and all side effects.

## Proposed tables

### `checkin_action_conditions`

Suggested fields:

- `id` UUID primary key
- `action_id` UUID foreign key
- `group_operator` enum: `AND`, `OR`
- `condition_type` typed enum
- `config_json` JSONB containing only validated fields for that condition type
- `position`
- `created_at`
- `updated_at`

Initial condition types mirrored by Lab:

- `switch_overdue`
- `grace_expired`
- `action_state`
- `asset_status`

Do not support arbitrary JavaScript, Python, SQL, shell, or free-form executable expressions as a rule type.

### `checkin_action_routes`

Suggested fields:

- `id` UUID
- `source_action_id`
- `event_type`
- `target_action_id`
- `branch_exclusive` boolean
- `created_at`
- `updated_at`

Initial route event types:

- `success`
- `failure`
- `acknowledged`
- `no_ack`
- `approval_denied`

A route creates an incident-scoped activation signal. It must not mutate the reusable action definition itself.

### `checkin_action_dependencies`

Dependencies can be represented explicitly even when some are inferred from `action_state` conditions.

Suggested fields:

- `id`
- `action_id`
- `depends_on_action_id`
- `required_state`
- `timeout_seconds` nullable
- `created_at`

The API must reject cycles before enabling a definition set.

### `checkin_acknowledgement_policies`

Suggested fields:

- `action_id`
- `required` boolean
- `timeout_seconds`
- `allowed_actor_scope`
- `created_at`
- `updated_at`

Delivery and acknowledgement are separate states. A message can be delivered successfully and still remain `AWAITING_ACKNOWLEDGEMENT`.

### `checkin_acknowledgements`

Suggested fields:

- `id`
- `incident_id`
- `incident_action_id`
- `actor_id` or signed external acknowledgement identity
- `acknowledged_at`
- `verification_method`
- `verification_metadata_json`

Any public acknowledgement link must be signed, scoped, expiring, rate-limited, and non-reusable.

### `checkin_action_approvals`

Suggested fields:

- `id`
- `incident_id`
- `incident_action_id`
- `actor_id`
- `decision` enum: `approved`, `denied`
- `created_at`
- `reason` nullable

Destructive actions should require server-enforced approval policy regardless of the browser configuration.

### `checkin_incident_actions`

This is the runtime state for one action inside one incident.

Suggested fields:

- `id`
- `incident_id`
- `action_definition_id`
- `definition_version_id`
- `state`
- `eligible_at`
- `started_at`
- `finished_at`
- `ack_deadline_at`
- `attempt_count`
- `route_activation_json`
- `last_error_code`
- `created_at`
- `updated_at`

Possible runtime states include:

- `WAITING`
- `BLOCKED`
- `ELIGIBLE`
- `AWAITING_APPROVAL`
- `EXECUTING`
- `RETRY_QUEUED`
- `AWAITING_ACKNOWLEDGEMENT`
- `ACKNOWLEDGED`
- `NO_ACKNOWLEDGEMENT`
- `SUCCEEDED`
- `FAILED`
- `APPROVAL_DENIED`
- `CANCELLED`

### `checkin_condition_evaluations`

Every decision should be explainable later.

Suggested fields:

- `id`
- `incident_action_id`
- `condition_id`
- `evaluated_at`
- `result` boolean
- `input_snapshot_json`
- `reason_code`
- `human_summary`

This table powers the future production equivalent of the Lab Decision Inspector.

### `checkin_route_events`

Suggested fields:

- `id`
- `incident_id`
- `source_incident_action_id`
- `event_type`
- `target_incident_action_id`
- `created_at`
- `metadata_json`

Route events should be append-only audit records.

## Cycle detection

Before an action set can be enabled, build a directed graph from:

- explicit outcome routes
- action-state dependencies
- future dependency records

Reject any graph containing a directed cycle.

The Lab performs a client-side preview of this validation. Production must repeat it server-side and treat the server result as authoritative.

## Evaluation order

Recommended production evaluation order for each incident action:

1. Confirm definition/version is enabled for this incident.
2. Confirm incident-relative or calendar time boundary has been reached.
3. Confirm inbound route activation when the action is route-gated.
4. Evaluate typed conditions from an immutable input snapshot.
5. Confirm approval requirements.
6. Mark action `ELIGIBLE` or `AWAITING_APPROVAL`.
7. Execute through an approved worker/provider adapter.
8. Record attempt result and retry accounting.
9. If delivery succeeded and acknowledgement is required, move to `AWAITING_ACKNOWLEDGEMENT`.
10. Resolve acknowledgement or timeout.
11. Emit the matching route event.
12. Re-evaluate affected downstream incident actions.

## Retry behavior

Retry counters belong to the incident action, not the reusable definition.

A failure route should normally fire only after configured attempts are exhausted. Each provider call needs an idempotency key scoped to the incident action and attempt.

## Branch cancellation

When `branch_exclusive=true`, selecting one route can cancel unresolved sibling branches from the same source action.

Cancellation should itself be an auditable state transition. Never delete the sibling incident-action row.

## Acknowledgement security

Acknowledgements may eventually come from:

- an authenticated operator
- a signed one-time acknowledgement link
- a verified inbound provider event

Do not treat email opens, SMS delivery receipts, or webpage visits as acknowledgement unless the policy explicitly defines them that way.

## API direction

Possible endpoints:

```text
GET    /api/v1/checkin/action-definitions/{id}/decision-policy
PUT    /api/v1/checkin/action-definitions/{id}/decision-policy
POST   /api/v1/checkin/action-definitions/validate-graph
GET    /api/v1/checkin/incidents/{incident_id}/decision-graph
GET    /api/v1/checkin/incidents/{incident_id}/actions/{incident_action_id}/evaluation
POST   /api/v1/checkin/incidents/{incident_id}/actions/{incident_action_id}/approve
POST   /api/v1/checkin/incidents/{incident_id}/actions/{incident_action_id}/deny
POST   /api/v1/checkin/incidents/{incident_id}/actions/{incident_action_id}/acknowledge
```

Actual execution endpoints should remain internal worker operations where possible, not browser-callable general-purpose execution endpoints.

## Lab storage

Current browser-only keys:

- `cmx-lab-decisions-v1`
- `cmx-lab-decision-runtime-v1`

These exist only to exercise the UX and decision model. They are not a production persistence format.

## Current Lab demonstration chain

The seeded Lab logic demonstrates:

```text
AI contingency briefing
  ↓ success
Business continuity email
  ↓ delivered
Acknowledgement gate
  ├─ acknowledged → stop escalation
  └─ failure / no acknowledgement → SMS legal escalation

Primary domain handoff
  → independently waits for final trigger + operator approval
```

This chain is synthetic and performs no external operation.
