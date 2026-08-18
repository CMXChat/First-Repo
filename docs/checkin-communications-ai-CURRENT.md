# Check In Communications + AI Task Frontend — CURRENT

Date: 2026-08-17
Status: Current focused Lab contract; definition UX only, no external execution

Route:

`https://db.cmxchat.com/lab/automations/`

This file records the accepted frontend direction for communication Actions and bounded AI Tasks. It is intended for another ChatGPT/Codex/developer context to continue without reconstructing product decisions from chat.

## Lab boundary

`/lab/automations/` is the active Check In Automation product-design sandbox.

`/lab/` remains the broader experiment umbrella. Do not scatter the Check In Automation builder across unrelated Lab routes.

The focused route keeps:

```text
connect-src 'self'
```

It does not call the production Check In API and it performs no provider/AI execution.

Accepted product concepts should later move into the protected `/checkin/` application as the matching backend services become real. `/lab/automations/` is a proving ground, not a second permanent application.

# Typed Action framework

The overall Automation remains:

```text
WHEN
IF
DO
WAIT / REPEAT
THEN
```

Individual DO steps are typed methods.

Current deeply-modeled Lab methods:

- Email;
- AI Task.

Existing/simple methods remain Notification and Manual Review.

Planned typed methods can reuse the same underlying domains instead of inventing new architecture:

- Message/SMS;
- Discord;
- File/Document release or handoff;
- approved Web Request/API mutation;
- future provider-specific Actions only when justified.

Do not build a separate workflow engine per provider.

# Email Action UX

Email is the first communication Action being modeled deeply because it exercises Audience, Content, Files, Connections, Runtime and Authority in one understandable surface.

The human composer should feel like one complete email:

```text
From
To
CC
BCC
Reply-To
Subject
Rich body
Attachments
Preview
```

Underneath, those are separate protected responsibilities.

## Envelope

### From

The production From email address is **not** a freeform field.

It must come from a server-authorized:

```text
Connection
→ SenderIdentity
```

The Lab shows this boundary explicitly and allows an optional display name for UX prototyping.

Provider credentials never belong in the frontend, Automation JSON or Content body.

### To / CC / BCC

All three use the existing protected Directory/Audience model.

The Lab reuses the same Audience manager with separate selector identities:

```text
TO  -> action step selector
CC  -> action step + cc selector
BCC -> action step + bcc selector
```

Each selector may contain People, Organizations, Groups and Labels and resolves to unique People.

Production must resolve authorized current membership at Run start and then freeze the exact recipient snapshot before provider delivery.

### Reply-To

Optional reply address belongs to the Email Action delivery envelope. Production validates it against policy/provider requirements.

### Subject + rich body

Subject and body remain private authored Content owned by Check In.

The existing private Content editor provides:

- Subject;
- rich-text body;
- headings;
- bold/italic/underline/strike;
- lists;
- quote/code formatting;
- alignment;
- safe links;
- divider;
- Preview;
- autosave;
- immutable version direction;
- Save to Library / Template / Document reuse direction.

Do not create a second email-only rich-text engine.

### Plain-text alternative

Production should derive/store a deterministic plain-text representation from the approved rich content version for multipart email delivery. Provider-side drafts are not source of truth.

### Attachments

Attachments use exact private `FileVersion` references.

The Lab continues to avoid fake browser binary storage.

Production flow is:

```text
FileAsset
→ exact immutable FileVersion
→ authorized Run snapshot
→ provider attachment rendering
```

## Email preview

Preview should show at least:

- From display identity;
- To;
- CC;
- BCC;
- Subject;
- rendered rich body;
- attachment summary when real files exist.

It remains a preview. It never implies provider delivery.

# AI Task UX

AI Task is a typed Action definition, not one giant magic prompt box.

The Lab editor separates:

1. Objective;
2. Instructions;
3. Context AI may read;
4. Tools AI may use;
5. Autonomy/authority mode;
6. Hard limits.

This separation is required even if a later user-facing assistant can generate the fields from natural language.

## Objective

Short statement of the outcome the task should achieve.

Example:

```text
Prepare a concise continuity briefing from the approved records.
```

## Instructions

Detailed constraints, structure and preferences.

Substantial reusable instructions should later be promotable into versioned private Content instead of growing arbitrary prompt blobs inside Automation JSON.

## Context

The Lab currently visualizes capability buckets such as:

- current Incident/switch state;
- explicitly linked Content/File versions;
- approved Directory records;
- approved Library search scope.

Production must resolve those into explicit authorized stable IDs/selectors and exact versions. A filename, folder path or prompt mention is never authority.

## Tools

The Lab distinguishes read/draft/external capabilities, for example:

- Search Directory;
- Search Library;
- Read exact ContentVersion;
- Create/update Document Draft;
- Create Email Draft;
- Send approved Email;
- Send approved Message.

Tool selection alone does not authorize execution.

Every future AI-callable tool must be a narrow adapter over the same typed domain service the human UI uses.

## Autonomy modes

The frontend now distinguishes three concepts:

### Draft only

AI may read allowed context and produce approved drafts. No external side effects.

### Approval required

AI may prepare external actions but Runtime pauses at policy-defined approval checkpoints.

### Pre-authorized contingency

A previously published server-side AuthorityGrant may allow bounded action during a qualifying Incident when the user may be unavailable to click Approve.

This is standing delegated authority created **before** the emergency. It is not permission invented by the prompt or AI at runtime.

## Limits

The Lab prototypes explicit limits including:

- max tool steps;
- max runtime minutes;
- max outbound messages;
- max unique recipients.

Production adds provider/model token/cost limits where applicable.

# Contingency UX principle

Check In must support both ordinary approvals and true absence/delegation scenarios.

Normal mode can be:

```text
AI proposes
→ user approves external action
```

A qualifying Incident may instead be:

```text
published AuthorityGrant already exists
→ Incident reaches its exact activation condition
→ backend activates only that grant version
→ AI/Runtime receives only the allowed capabilities
→ actions remain bounded by resource/audience/connection/time/quantity limits
```

The UI must make it clear whether a task is:

- Draft only;
- Approval-gated;
- eligible for pre-authorized contingency execution.

AI can never self-activate, widen, renew or delegate its own authority.

# Deterministic continuity before AI

Critical contingency workflows should not rely entirely on an LLM.

Preferred pattern:

```text
qualifying Incident
→ deterministic prewritten notifications/releases first
→ bounded AI Task/Agent for interpretation, coordination or follow-up second
```

If an AI provider is unavailable, deterministic core continuity Actions should still have a path to execute once the real Runtime exists.

# Local prototype storage

Current Lab-only stores include:

```text
cmx-lab-email-actions-v1
cmx-lab-ai-task-actions-v1
cmx-lab-audience-links-v1
cmx-lab-content-assets-v1
```

These are browser-local product prototypes only.

They must not be mistaken for production persistence, credentials, authority grants or delivery receipts.

# Active frontend files

- `assets/lab/lab-automations-communications-ai-runtime.js`
- `assets/lab/lab-automations-communications-ai-fix.js`
- `assets/lab/lab-automations-communications-ai.css`
- `lab/automations/index.html`

The implementation deliberately uses events/requestAnimationFrame and does not introduce a broad MutationObserver.

# Backend mapping

Read the matching backend contracts before implementing server behavior:

- `COMMUNICATION-ACTIONS-BACKEND-CONTRACT.md`
- `DELEGATED-AUTHORITY-BACKEND-CONTRACT.md`
- `AI-CAPABILITY-AND-TOOLS-CONTRACT.md`
- `CONTENT-ASSETS-BACKEND-HANDOFF.md`
- `FILE-ASSETS-BACKEND-HANDOFF.md`
- `DIRECTORY-AUDIENCE-LIBRARY-BACKEND-HANDOFF.md`

# What is deliberately not real yet

No Lab screen proves or performs:

- sender Connection authentication;
- SMTP/provider delivery;
- Gmail/Discord draft creation;
- object-storage upload;
- recipient snapshot persistence;
- provider receipts/bounces;
- scheduler/worker execution;
- AI provider calls;
- AuthorityGrant activation;
- autonomous Agent execution.

Do not label any of those as complete because the frontend can display them.
