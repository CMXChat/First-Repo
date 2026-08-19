# Check In Future Capabilities & Connections — CURRENT

Date: 2026-08-19
Status: Long-term frontend/product contract; future-facing, not proof of current integrations

Backend canonical companions:

- `CMXChat/jay-app/specs/003-server-checkin/CAPABILITIES-CONNECTIONS-AI-ROADMAP.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-LIVE-WORLD-CAPABILITY-EXTENSION-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-CORE-ARCHITECTURE-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-CONTROL-CENTER-SIMULATION-AND-AUTONOMY-CONTRACT.md`

Read with:

- `docs/checkin-product-design-CURRENT.md`
- `docs/checkin-ai-product-design-CURRENT.md`
- `docs/checkin-communications-ai-CURRENT.md`
- `docs/continuum-signals-observations-master-plan-CURRENT.md`
- `CMXChat/jay-app/specs/003-server-checkin/AI-CAPABILITY-AND-TOOLS-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/DELEGATED-AUTHORITY-BACKEND-CONTRACT.md`

This document defines how the broader future Continuum/Check In capability system should make sense to a human.

It does **not** mean these providers or execution capabilities exist today.

# Product principle

> **Show people what Continuum can observe, what it can do, what is available right now and exactly how much authority it currently has.**

The interface should never reduce all of this to one mysterious `Connect` button or one giant AI prompt.

# Lab vs product

`/lab/automations/` remains the active Automation design proving ground while these ideas are prototypes.

Use Lab to validate new Action/editor/capability UX before backend models are locked.

Once a capability has a real protected backend service, accepted interaction patterns should move into `/checkin/` or the future protected Continuum Control Center/Connections surfaces.

Do not turn `/lab/automations/` into a second permanent production app.

# Future Connections experience

A protected Connections area should eventually show connected services and their usable Sources/capabilities.

Example:

```text
CONNECTIONS

Google                    CONNECTED
Gmail · Calendar · Drive
Sources: mail + calendar events
Capabilities: read / create / update

Discord                   CONNECTED
Sources: approved channels/events
Capabilities: read / send / reply

Voice & SMS               NOT CONNECTED
Capabilities: SMS · MMS · Calls

GitHub                    CONNECTED
Sources: repo events/checks
Capabilities: read repo · create issue · comment

External MCP              NEEDS REVIEW
7 tools discovered · 3 resources discovered
```

Connection status should distinguish at least:

- connected;
- needs attention/re-auth;
- partially available;
- disconnected;
- provider unavailable;
- schema/version changed;
- new capability available.

Do not expose raw secrets in this interface.

# Source Catalog UX

Continuum should eventually have a protected **Sources** view showing how live information gets in.

Useful Source cards/rows might show:

```text
SOURCE
GitHub · CMXChat/jay-app checks

MODE
Webhook + reconciliation

LAST OBSERVED
2 min ago

HEALTH
Current

USED BY
2 Watches · Business Space
```

Other examples:

- news/search Watch;
- webpage monitor;
- RSS feed;
- Gmail event stream;
- calendar/account data;
- status page;
- weather/market API;
- MCP resource;
- future device/sensor;
- trusted-person attestation source.

Source health should use plain language such as:

- Current;
- Stale;
- Delayed;
- Needs sign-in;
- Rate limited;
- Provider down;
- Paused.

A source being stale is different from “nothing happened.”

# Capability detail

Opening a Connection should show what Continuum can actually do through it.

Example:

```text
BROKERAGE

✓ Read balances
✓ Read positions
✓ Draft orders
△ Place order · approval required
× Withdrawals · disabled
```

Another Connection could show:

```text
DISCORD

✓ Read approved conversation context
✓ Send to Trusted channel
✓ Receive approved replies
△ Autonomous follow-up · only under standing grant
```

A user should not have to understand backend risk-tier terminology to understand consequences.

# Capability availability language

The product should communicate backend modes clearly.

Conceptual backend modes may include:

```text
disabled
read_only
approval_required
standing_grant_allowed
human_only
```

Human-facing copy might be:

```text
Unavailable
Read only
Ask me before acting
Can be pre-authorized
Only I can do this
```

The UX can evolve, but it must preserve the distinction between technical availability and authority.

# New capability discovered

When an API, provider or MCP server exposes something new, Continuum should be able to surface it without silently enabling it.

Example:

```text
NEW CAPABILITY AVAILABLE
GitHub · Create deployment environment

Continuum found a new provider operation.

TYPE
External write

REQUIRES
GitHub Connection · repo administration scope

CURRENT POLICY
Unavailable until reviewed

[See details] [Test in simulation]
```

For a low-risk read capability:

```text
NEW READ CAPABILITY
Weather provider · Severe-weather alerts

✓ Adapter schema valid
✓ Read only
✓ Existing provider scope supports it

Your policy allows automatic adoption of tested read-only capabilities.

[Enabled] [Review]
```

That second behavior exists only if the owner deliberately published such an adoption policy.

# Capability discovery lifecycle in the UI

The backend lifecycle is:

`DISCOVER → NORMALIZE → CLASSIFY → MAP → TEST → SIMULATE → REVIEW/POLICY → ENABLE → MONITOR → VERSION/DEPRECATE`

The UI should translate this into normal human states such as:

- New capability found;
- Checking compatibility;
- Test passed;
- Needs review;
- Ready to enable;
- Available;
- Changed upstream;
- Needs attention;
- Replaced/deprecated.

Do not expose raw model reasoning or provider schema noise by default. Advanced/Developer detail can show exact capability IDs, versions, schemas and adapter metadata.

# MCP UX direction

## Continuum exposed through MCP

A protected Connections/Developer area may later show:

```text
MCP ACCESS

External AI client: connected
Allowed Continuum tools:
✓ Search Library
✓ Read selected content
✓ Create Automation drafts
× Publish Automation
× Send messages
```

External clients still use normal Continuum authority/policy/domain services.

## External MCP inside Continuum

If a user connects an external MCP server, do not present every discovered tool as automatically approved.

Potential flow:

```text
Connect MCP server
→ discover tools/resources
→ show new capability candidates
→ classify / map
→ test / simulate
→ review policy
→ enable selected capabilities
```

Display provider/source, capability kind, data access and consequence clearly.

If the MCP server advertises new tools later, show **New capability available**. Do not silently add them to an Agent's active authority.

# OpenAPI / API integration assistant UX

A future integration assistant may accept an approved API/OpenAPI description and help turn it into typed Continuum capability proposals.

Useful review might show:

```text
API INTEGRATION PROPOSAL
Acme Monitoring API

FOUND
8 read operations
3 mutation operations
2 webhook event families

MAPPED
monitoring.read_status
monitoring.list_incidents
signal.status_changed

NEEDS REVIEW
incident.create
maintenance.schedule

TESTS
12/12 schema fixtures passed

[Review mapping] [Simulate] [Enable selected]
```

AI may help explain/generate mappings/tests. The provider/API description is metadata, not authority.

# Communications catalog

The Action picker should eventually be able to grow without becoming chaotic.

Potential communication families:

- Email;
- SMS / MMS;
- WhatsApp Business;
- Discord;
- Slack;
- Microsoft Teams;
- Telegram or other supported bot platforms;
- Continuum push notifications;
- Voice calls;
- future communication channels when provider APIs justify them.

Do not show every theoretical future provider in the main Action picker before it is actually supported.

Use a searchable/category-based picker once the catalog becomes large.

Example categories:

```text
COMMUNICATE
Email
Message
Discord
Voice call

CREATE / UPDATE
Calendar event
Task
Document
Issue

ANALYZE
AI task
Financial analysis
Research

OBSERVE
Watch source
Read status
Search approved provider

OPERATE
Approved API action
Infrastructure action
Financial action
```

# Communication editors

Channel editors should share common concepts where appropriate:

- Audience;
- Content;
- Attachments;
- Connection;
- Preview;
- Authority/readiness;
- timing;
- Runtime history.

Do not force Email-specific concepts like CC/BCC onto SMS/Discord.

# Voice/call UX direction

A future Voice Action could have a focused editor such as:

```text
VOICE CALL

From
Approved voice/number

Call
[Adam]

Mode
○ Play approved message
○ Ask for keypad acknowledgement
○ Bounded AI conversation

Content / instructions
[...]

Limits
Max call duration
Max follow-up calls
Allowed conversation purpose

Review
```

If custom or cloned voices are supported later, make consent/identity status visible and never make a generated voice look like an unimportant cosmetic dropdown.

# Tool / Capability Registry in the UI

The backend may eventually have many typed tools. Humans do not need a raw developer registry dump.

Present them through understandable capabilities.

Examples:

```text
Google Calendar
Read events
Create event
Update event

GitHub
Read repository
Create issue
Comment on issue

Bank
Read transactions
Read balances
Transfer funds
```

Advanced users may later inspect exact capability IDs/versions in a Details/Developer view.

# AI Task / Agent capability picker

AI configuration should be capability-visible.

Example:

```text
AI MAY USE

Information
✓ Search approved Library
✓ Read selected records
✓ Read this Conversation
✓ Read these Signal sources

Communication
✓ Draft email
△ Send email under active authority
× Contact new recipients

Work
✓ Create ClickUp task
✓ Create calendar event

Finance
✓ Read balances
× Transfer funds
```

The interface should show why a disabled capability is unavailable:

- no Connection;
- not in grant;
- approval required;
- provider unavailable;
- capability changed upstream;
- Runtime support missing;
- product/policy disables it.

# Standing / fallback authority UX

Standing and fallback delegated authority need serious Review screens.

Example:

```text
CONTINUITY AUTHORITY

ACTIVATES WHEN
Published availability/Incident policy says fallback is eligible

AI / RUNTIME MAY
✓ Read selected continuity documents
✓ Contact Family + Trusted Contacts
✓ Send through Continuity Email
✓ Coordinate replies

LIMITS
25 outbound messages
20 unique people
24 hours

STILL NOT ALLOWED
× Change Check In policy unless separately granted
× Add recipients
× Change credentials
× Move money
```

The UI should make clear which evidence/State activates eligibility and which previously published authority allows the actual action.

# Master autonomy pause UX

The future Control Center needs a prominent Pause Autonomy control.

Possible choices:

- Until I resume;
- Until a chosen date/time;
- long deliberate duration such as one year;
- future scoped pause for one Automation/capability/Connection.

While paused, observation, Signals, State updates, learning, drafting and briefings can continue. New autonomous consequential Actions are blocked.

A timed pause expiry does **not** silently reactivate autonomy.

Desired flow:

`Pause expires → ask owner → use configured contact strategy → wait effective response window → if still no qualifying response, evaluate published continuity policy → activate only the Actions/AI already authorized`

General default response-window direction is 24 hours with per-policy overrides.

# Contact strategy UX

Continuity/re-contact policies should support options such as:

- all approved channels at once;
- staged escalation;
- preferred order;
- retries;
- stop on acknowledgement;
- continue until stronger confirmation;
- involve trusted people after a threshold;
- different strategies for different scenarios.

Where providers expose real delivery truth, distinguish attempted, sent/accepted, delivered, failed, acknowledged and explicitly confirmed/denied.

# Financial product progression

Financial capability should visibly mature in stages.

## Read / analyze

Examples:

- balances;
- transactions;
- cash flow;
- liabilities;
- portfolio holdings;
- allocation/concentration;
- investment activity.

## Prepare

Examples:

- draft transfer;
- draft bill payment;
- draft trade/order;
- produce a recommended action for review.

## Execute with approval

Show exact transaction before approval:

```text
ACCOUNT
PAYEE / INSTRUMENT
AMOUNT / QUANTITY
ORDER TYPE
LIMITS / FEES where available
WHY THIS TOOL IS ALLOWED
```

## Pre-authorized bounded execution

Only display this option when the backend/provider/product policy actually supports standing/fallback authority for that capability.

Do not imply every high-risk tool can be delegated merely because AuthorityGrant exists.

# Person-mediated coordination UX

AI may sometimes achieve an objective by coordinating an approved person instead of directly calling an API.

The product should make that explicit.

Example Mission/Automation review:

```text
OBJECTIVE
Get server access transferred before Friday

AI MAY CONTACT
Adam
Mike
Technical group

AI MAY REQUEST
Transfer of approved server access
Schedule a call
Confirm completion

AI MAY NOT
Contact anyone else
Request billing changes
Request password/security changes outside the approved task
```

A messaging tool is not a loophole around outcome authority.

# Future Mission experience

A higher-level Agent UX may eventually combine existing backend concepts into something humans understand as a Mission.

Example:

```text
MISSION
Coordinate server access transfer

Goal
[...]

Information
[approved sources]

People
[approved participants]

Tools
[Email] [Discord] [Calendar] [ClickUp]

Authority
[Approval rules / standing/fallback grant]

Limits
[10 messages] [1 meeting] [5 days]

Stop when
[access confirmed]
```

Do not create this UI until Runtime/Agent concepts are mature enough to make it truthful.

# AI Gateway / model UX

Most users should not have to micromanage model brands for every task.

Default UX can be policy-oriented:

```text
AI QUALITY
Fast
Balanced
Strong reasoning

PRIVACY
Use only providers allowed for Private data

BUDGET
Maximum per Run
```

Advanced settings may later expose preferred models/providers.

A task should remain portable across providers where semantics allow.

Model selection never changes tool authority.

# AI source/retrieval UX

When AI uses private data or outside evidence, keep sources and versions visible.

Example:

```text
USING
continuity.md · v5
Server Access · current record
Conversation with Mike · 3 messages
GitHub check Signal · 2 supporting observations
Status provider · observed 3 min ago
```

Future semantic search should feel smarter without making scope invisible.

# Self-improvement UX

Continuum should be able to improve without presenting that as mysterious autonomous code rewriting.

Useful categories:

```text
LEARNED RECOMMENDATION
“This source has produced 18 low-value alerts. Raise the relevance threshold?”

NEW CAPABILITY
“Your connected provider now supports read-only incident history.”

MODEL ROUTING
“This task class performs better with the approved reasoning model at similar cost.”

POLICY SUGGESTION
“You usually approve this low-risk cleanup. Allow it automatically?”
```

The owner can decide which categories remain recommendation-only and which low-risk classes may later be automatically adopted under explicit meta-authority.

If Continuum ever gains code-generation/deployment tools, show those as separate high-impact capabilities with repository/environment scope, tests, approvals, rollback and Audit.

# Control Center / Activity

As capability breadth grows, the Control Center should become one of the strongest trust surfaces on both desktop and mobile.

Preferred primary views:

- **Now** — active/waiting/needs attention;
- **Upcoming** — timers, scheduled work and waits;
- **History** — completed/failed/cancelled/resolved;
- **All Activity** — chronological event stream with filters.

Activity may include:

```text
Source refreshed
Signal emitted
State changed
AI proposed a policy change
New provider capability discovered
You approved capability mapping
Runtime queued Action
Provider accepted Action
Trusted person acknowledged
Run paused
Simulation outcome changed
```

Opening a consequential item should explain:

`evidence → State → policy → authority → capability → Runtime → result`

The user may hide/archive UI history where supported. Immutable consequential Audit remains preserved.

# Undo

Where a management operation is genuinely reversible, show a short Undo window.

Example:

`Automation deleted → Undo for 30 seconds`

Undo is a new protected operation and both the original change and restoration remain in Audit.

Do not fake Undo for irreversible provider side effects.

# Simulation

Simulation should be a first-class Control Center tool.

It can:

- start from a frozen copy of real current State;
- change hypothetical facts;
- run policy/authority/capability/Runtime evaluation without side effects;
- save named scenarios;
- rerun important scenarios after relevant policy/capability changes;
- show structural diffs;
- explain whether the new simulated result appears safer, riskier or materially different.

Example overrides:

- pretend I stop responding now;
- pretend I miss five Check Ins;
- pretend email is down;
- pretend this trusted person does not reply;
- pretend a Connection fails;
- pretend a new Signal arrives.

Simulation sends nothing, contacts nobody and activates no real authority.

# Progressive disclosure

The product may eventually be extremely capable. The interface should still feel simple.

Default views show:

- the decision the user needs to make;
- current Source/Connection/readiness;
- exact Audience/content;
- important consequence;
- approval/authority state;
- why something is unavailable or waiting.

Advanced implementation detail belongs behind Details.

Do not turn Continuum into a developer console by default.

# Future capability design test

A normal person should eventually understand a request like:

```text
Watch approved sources for changes to this company.
Put important changes in my Business brief.
If a critical Signal is strongly supported, use my incident policy.
If my connected provider adds a useful read-only capability, tell me what it does and test it.
```

The product should be able to show:

- which Sources are watched;
- source freshness/health;
- what AI can read;
- who it may contact;
- which Connections/capabilities it may use;
- whether any step requires approval;
- which authority/fallback path applies;
- limits/stop conditions;
- what would happen in simulation.

A newly discovered API/MCP capability should fit this model without redesigning the whole product.

# Current boundary

Today these ideas remain future design except for the Lab concepts and production Check In features explicitly documented elsewhere.

Do not label Sources/Signals monitoring, WhatsApp, SMS, voice, financial execution, MCP runtime, API/OpenAPI discovery, Missions, Control Center simulation, autonomous capability adoption or autonomous coordination as implemented until their backend/provider/runtime layers actually exist.
