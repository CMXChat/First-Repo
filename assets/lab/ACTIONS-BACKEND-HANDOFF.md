# Check In Lab Action Builder Backend Handoff

Last updated: 2026-08-17
Status: Supporting Lab note. Canonical backend direction lives in `CMXChat/jay-app/specs/003-server-checkin/`.

Read first:

- `CHECKIN-MASTER-PLAN.md`
- `tasks.md`
- `ACTION-BUILDER-NEXT.md`
- `AUTOMATION-FRONTEND-CONTRACT.md`

For timing details, also read this repository's `SCHEDULING-BACKEND-HANDOFF.md`.

## Boundary

The Lab Action Builder is a frontend prototype. It can create, edit, preview, and simulate definitions, but it is never execution authority.

Current architecture direction:

```text
Frontend
  → FastAPI protected Automation API
  → PostgreSQL Automation + immutable AutomationVersion
  → durable Run / RunAction / Occurrence / ExecutionAttempt runtime
  → scheduler / worker
  → approved provider adapters
```

Do not revive the older assumption that a reusable Action row by itself is the whole workflow architecture.

The approved human workflow model is:

```text
WHEN
IF
DO
WAIT / REPEAT
THEN
```

The Action Builder edits an individual typed `DO` step inside an Automation.

## Definitions vs runtime

Definition concepts:

- `Automation`
- immutable published `AutomationVersion`
- typed Trigger
- typed Conditions
- ordered typed DO steps
- stable protected targets
- typed Wait / recurrence metadata
- typed outcomes/routes
- approval/risk metadata where required

Runtime concepts arrive later:

- `Run`
- `RunAction`
- `Occurrence`
- `ExecutionAttempt`
- immutable execution snapshot
- persisted due timestamps
- idempotency
- claims/leases
- restart recovery

Do not put runtime delivery state into reusable definitions.

## Stable targets

Definitions should reference stable protected records rather than copying mutable recipient/resource details.

Useful target kinds include:

- Person / Contact
- Organization
- Document / Record
- Digital Asset
- later approved Connection references where appropriate

Before a real side effect, runtime resolves and snapshots the exact execution inputs. Later edits to a Person, Organization, Document, or Connection must not rewrite historical Run truth.

## Action / DO step shape

A typed DO step needs at least:

- stable step ID within the draft/version;
- registered Action type;
- typed configuration for that Action;
- stable target references where applicable;
- content/template/instruction fields where applicable;
- approval/risk metadata where required.

Raw provider credentials never belong in Action JSON.

Unknown Action types are rejected server-side.

Do not permit arbitrary Python, JavaScript, shell, SQL, or `eval` as workflow Actions.

## Switch-derived triggers

Current production switch policy is configurable. Do not hardcode 72 hours or 24 hours into Automation logic.

Switch-derived Trigger definitions should resolve against authoritative server state and the applicable policy/window snapshot.

Useful trigger families may include:

- switch enters grace;
- grace expires;
- manual start;
- later typed calendar schedule;
- later typed Action outcome / acknowledgement events.

The browser never submits an authoritative `is_due` flag.

## WAIT / recurrence

Timing is part of the Automation definition, separate from the DO step's provider configuration.

Current focused UX supports:

- no wait;
- exact elapsed WAIT delay in days/hours/minutes;
- exact local date/time + IANA timezone;
- recurrence presets;
- custom recurrence in minutes/hours/days/weeks/months/years.

Do **not** normalize all recurrence into `repeat_interval_seconds`.

WAIT delay and REPEAT cadence deliberately use different semantics where needed.

WAIT delay:

- day/hour/minute inputs describe an elapsed duration;
- `Wait 2 days` means 48 elapsed hours.

Elapsed recurrence units:

- minutes;
- hours.

Calendar recurrence units:

- days;
- weeks;
- months;
- years.

Daily and Weekly presets are calendar recurrence.

Calendar recurrence keeps an anchor + IANA timezone and follows explicit calendar rules. A daily `09:00 America/New_York` recurrence must stay at 09:00 local time across DST instead of drifting because the server repeatedly added 86,400 seconds.

Weekly recurrence preserves local weekday/time. Monthly/yearly recurrence additionally needs deterministic end-of-month and leap-day behavior.

See `SCHEDULING-BACKEND-HANDOFF.md` and the canonical `AUTOMATION-FRONTEND-CONTRACT.md` for the full rules.

Keep these concepts separate:

```text
wait/delay
recurrence
retry
```

Retry belongs to provider/runtime failure handling.

## Provider registry

Provider behavior later belongs behind approved server adapters/registries.

Examples may eventually include:

- Discord notification;
- transactional email;
- SMS;
- publication;
- bounded AI Task;
- approved webhook/API Connection;
- provider-specific Digital Asset operation.

The first real provider should be one low-risk vertical slice, not a catalog explosion.

Reject unknown provider/executor types server-side.

## Secrets and Connections

Never store these in ordinary Automation/Action definitions:

- passwords;
- API tokens;
- OAuth refresh tokens;
- private keys;
- MFA seeds;
- recovery codes;
- session cookies.

Use server-owned `Connection` / `secret_ref` style references later. Provider adapters resolve secrets only at execution time.

Do not expose raw provider credentials to:

- browser storage;
- workflow JSON;
- Records;
- Audit metadata;
- AI prompts.

## Guardrails and approvals

Risk must affect backend policy, not only UI color.

Useful protections later include:

- require approval;
- second approver for higher-risk operations where justified;
- cooling-off delay;
- immutable execution snapshot;
- idempotency;
- preview/dry-run when supported;
- explicit timeout;
- bounded retry policy;
- rollback/recovery metadata where provider behavior supports it.

The typed backend decides whether an Action is permitted even if a malformed client tries to bypass UI restrictions.

## AI Actions

AI Task should arrive before any general AI Agent.

A bounded AI Task definition can include:

- objective;
- approved context Record IDs;
- approved output destination;
- provider/model policy;
- token/cost limit;
- runtime limit;
- approval requirement.

Prompt text never grants permissions.

A later AI Agent receives explicit server-enforced grants for records, tools, people, organizations, connections, cost, steps, runtime, approvals, and output destinations.

## Webhooks / APIs

Do not turn arbitrary browser-entered URLs into unrestricted backend network access.

Outbound network Actions later resolve an approved server-owned Connection with:

- destination allowlisting/policy;
- SSRF protections;
- timeout;
- authentication reference;
- expected response policy;
- redacted errors.

## Durable execution pattern

When runtime becomes real:

1. trigger creates/activates a durable Run;
2. definition inputs are snapshotted;
3. due RunAction/Occurrence state is persisted;
4. scheduler claims due work with a lease/lock;
5. worker performs one bounded attempt;
6. ExecutionAttempt result is persisted;
7. retry or next recurrence is calculated and persisted if needed;
8. terminal outcome activates the matching typed route;
9. append-only Audit records the transition.

Server restarts must not lose future work.

## Occurrence vs retry

A recurring occurrence is not a retry.

Example:

```text
Calendar occurrence #7
  → provider attempt 1 failed
  → retry attempt succeeded

Calendar occurrence #8
  → new planned recurrence later
```

Each external side effect needs stable idempotency protection.

## Definition edits and immutable history

Editing a published Automation creates/updates a new Draft/revision.

It does not rewrite:

- the immutable published AutomationVersion;
- existing Runs;
- prior Occurrences;
- prior ExecutionAttempts;
- Audit history.

Runtime truth must remain explainable after later definition edits.

## Outcome routing

Typed terminal outcomes can later include concepts such as:

- success;
- final failure;
- acknowledged;
- no acknowledgement;
- approval denied;
- timeout;
- cancelled.

Do not build a second competing dependency graph inside provider code. Routing belongs to the Automation definition/runtime model.

## Audit minimum

When runtime is implemented, record enough to explain:

- Draft created/updated;
- published version identity;
- Trigger/Condition evaluation;
- due timing resolution;
- target resolution snapshot;
- approval state;
- Occurrence created/claimed;
- ExecutionAttempt started/completed/failed;
- retry scheduled/exhausted;
- next recurrence scheduled;
- provider callback/acknowledgement when supported;
- terminal outcome;
- downstream route activation.

All production execution timestamps are server-authoritative.

## Simulation

Later simulation should use the same domain timing/routing semantics with:

- controlled fake clock;
- deterministic fake provider;
- accelerated time;
- scenario-selected outcomes;
- jump to next event.

A workflow spanning months or years should be testable in seconds without changing the calendar interpretation production would use.

## Browser role

The browser may:

- create/edit Draft definitions through protected APIs;
- render validation/readiness;
- render Plan/Run state returned by the server;
- request authorized approval/acknowledgement;
- request a simulation scenario.

The browser must not decide that production work is due or execute it.
