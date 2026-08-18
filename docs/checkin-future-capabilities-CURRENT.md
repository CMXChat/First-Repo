# Check In Future Capabilities & Connections — CURRENT

Date: 2026-08-17
Status: Long-term frontend/product contract; future-facing, not proof of current integrations

Backend canonical roadmap:

`CMXChat/jay-app/specs/003-server-checkin/CAPABILITIES-CONNECTIONS-AI-ROADMAP.md`

Read with:

- `docs/checkin-product-design-CURRENT.md`
- `docs/checkin-ai-product-design-CURRENT.md`
- `docs/checkin-communications-ai-CURRENT.md`
- `CMXChat/jay-app/specs/003-server-checkin/AI-CAPABILITY-AND-TOOLS-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/DELEGATED-AUTHORITY-BACKEND-CONTRACT.md`

This document defines how the broader future Check In capability system should make sense to a human.

It does **not** mean these providers or execution capabilities exist today.

# Product principle

> **Show people what Check In can reach, what it can do, and exactly how much authority it currently has.**

The interface should never reduce all of this to one mysterious `Connect` button or one giant AI prompt.

# Lab vs product

`/lab/automations/` remains the active Automation design proving ground while these ideas are prototypes.

Use Lab to validate new Action/editor/capability UX before backend models are locked.

Once a capability has a real protected backend service, accepted interaction patterns should move into `/checkin/`.

Do not turn `/lab/automations/` into a second permanent production app.

# Future Connections experience

A protected Connections area should eventually show connected services and their usable capabilities.

Example:

```text
CONNECTIONS

Google                    CONNECTED
Gmail · Calendar · Drive

Discord                   CONNECTED
Messages · Channels

Voice & SMS               NOT CONNECTED
SMS · MMS · Calls

WhatsApp Business         NOT CONNECTED
Messages · Replies

Brokerage                 CONNECTED
Holdings · Orders
```

Connection status should distinguish at least:

- connected;
- needs attention/re-auth;
- partially available;
- disconnected;
- provider unavailable.

Do not expose raw secrets in this interface.

# Capability detail

Opening a Connection should show what Check In can actually do through it.

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

The product should communicate the backend modes clearly.

Conceptual backend modes:

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

The UX can evolve, but it must preserve the distinction.

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
- Check In push notifications;
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

But do not force Email-specific concepts like CC/BCC onto SMS/Discord.

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

# Tool Registry in the UI

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

Advanced users may later inspect exact capability IDs in a Details/Developer view.

# AI Task / Agent capability picker

AI configuration should be capability-visible.

Example:

```text
AI MAY USE

Information
✓ Search approved Library
✓ Read selected records
✓ Read this Conversation

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
- product policy disables it.

# Standing authority UX

Standing delegated authority needs a serious Review screen.

Example:

```text
CONTINGENCY AUTHORITY

ACTIVATES WHEN
Primary Check In Incident reaches Triggered

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
× Change Check In policy
× Add recipients
× Change credentials
× Move money
```

For a deliberately broader future grant, the review might instead show a bounded financial permission.

Example:

```text
FINANCIAL AUTHORITY

✓ Pay named invoice INV-123
From: Operating Checking
Maximum: $2,500
Payee: existing approved vendor only

OR
✓ Ask Approved Accountant group to complete this exact payment

× Add payee
× Change destination account
× Make another payment
× Withdraw cash
```

The UI should make the consequence impossible to miss.

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

Only display this option when the backend/provider/product policy actually supports standing-grant authority for that capability.

Do not imply that every high-risk tool can be delegated merely because AuthorityGrant exists.

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

For consequential outcomes such as a payment, show that the AI is authorized to **request that outcome from the named person**, not merely that it has permission to send generic messages.

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
[Approval rules / standing grant]

Limits
[10 messages] [1 meeting] [5 days]

Stop when
[access confirmed]
```

Do not create this UI until Runtime/Agent concepts are mature enough to make it truthful.

# MCP UX direction

## Check In exposed through MCP

A protected Connections/Developer area may later show:

```text
MCP ACCESS

External AI client: connected
Allowed Check In tools:
✓ Search Library
✓ Read selected content
✓ Create Automation drafts
× Publish Automation
× Send messages
```

## External MCP inside Check In

If a user connects an external MCP server, do not present every discovered tool as automatically approved.

Potential flow:

```text
Connect MCP server
→ discover tools
→ review capabilities
→ classify / map
→ user chooses what Check In may expose to Automations/AI
```

Display provider/source and risk clearly.

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

Advanced settings may later expose a preferred model/provider.

A task should remain portable across providers where semantics allow.

Model selection never changes tool authority.

# AI source/retrieval UX

When AI uses private data, continue showing sources and versions.

Example:

```text
USING
continuity.md · v5
Server Access · current record
Conversation with Mike · 3 messages
```

Future semantic search should feel smarter without making scope invisible.

# Activity / receipts

As capability breadth grows, Activity needs to become one of the strongest trust surfaces.

Examples:

```text
AI searched 4 approved Library items
AI drafted email
You approved payment
Worker submitted transfer
Provider accepted transfer
Adam replied by email
AI requested confirmation
Mike confirmed task complete
Mission closed
```

Distinguish:

- AI decision/proposal;
- backend authorization;
- worker execution;
- provider acceptance/delivery;
- human/inbound response.

# Simulation

Before enabling consequential standing authority, show a simulation.

Example:

```text
IF THIS INCIDENT HAPPENED NOW

Would activate
Continuity Authority v3

Would allow
Email Family
SMS Trusted Contacts
Coordinate with Adam

Would still require you
Brokerage order

Would deny
New recipients
Credential changes
```

Simulation performs no side effects.

# Progressive disclosure

The product may eventually be extremely capable. The interface should still feel simple.

Default views show:

- the decision the user needs to make;
- current Connection/readiness;
- exact Audience/content;
- important consequence;
- approval/authority state.

Advanced implementation detail belongs behind Details.

Do not turn Check In into a developer console by default.

# Future capability design test

A normal person should eventually understand a request like:

```text
Coordinate getting server access transferred before Friday.
You can email Adam and Mike, use Discord, schedule one call, and update ClickUp.
Do not touch billing or credentials.
```

And the product should be able to show before execution:

- what AI can read;
- who it may contact;
- which Connections/tools it may use;
- whether any step requires approval;
- limits;
- stop conditions.

For a high-consequence case, the product should be equally explicit:

```text
If this contingency triggers, pay only invoice INV-123 up to $2,500 from the approved account, or ask the approved accountant to do it.
```

That should never visually collapse into a vague toggle labeled `Autonomous`.

# Current boundary

Today these ideas remain future design except for the Lab concepts and production Check In features explicitly documented elsewhere.

Do not label WhatsApp, SMS, voice, financial execution, MCP runtime, external AI providers, Missions or autonomous coordination as implemented until their backend/provider/runtime layers actually exist.