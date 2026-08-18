# Check In AI Product Design — CURRENT

Date: 2026-08-17
Status: Future-facing UI contract; no production AI runtime exists yet

Read with:

- `docs/checkin-product-design-CURRENT.md`
- `docs/checkin-communications-ai-CURRENT.md`
- `CMXChat/jay-app/specs/003-server-checkin/AI-CAPABILITY-AND-TOOLS-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/DELEGATED-AUTHORITY-BACKEND-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CHECKIN-PLATFORM-ARCHITECTURE.md`

This file defines how AI should eventually feel in Check In once the required backend services/capability model exist.

# UX principle

> **AI should feel powerful because it understands approved protected context and can use explicit typed tools, not because it has invisible authority.**

The UI should make AI scope, authority and limits understandable.

# Contextual AI entry points

Prefer AI where the user is already working instead of one omnipotent global chat as the only interface.

## Library

Useful actions later:

- summarize selected Documents;
- create a Document from selected approved sources;
- organize selected drafts;
- extract action items;
- draft a Template;
- find related protected content.

## Rich/Markdown editor

AI can help:

- rewrite selected text;
- summarize;
- expand/shorten;
- structure headings;
- create a new Draft from approved sources;
- compare to an older version.

AI changes remain a mutable Draft until the normal Save Version/Publish flow occurs.

## Automation builder

AI can:

- explain the current Automation;
- generate a typed Draft from plain language;
- suggest missing rules/timing;
- identify readiness errors;
- draft content from approved Templates/Documents;
- configure an AI Task definition from a user request.

Planner should not silently publish/send.

## Directory

AI may later help find/organize People or suggest Group composition from explicitly allowed data, but audience mutations remain typed/reviewable.

# AI Task is not one prompt box

A proper AI Task editor separates:

```text
Objective
Instructions
Context
Tools
Autonomy / approval mode
Limits
```

This is now prototyped in `/lab/automations/`.

## Objective

Human-readable job outcome.

## Instructions

Detailed constraints/preferences. Large reusable instructions should later become versioned protected Content where useful.

## Context

Show what AI may read.

Production resolves capability buckets to stable authorized IDs/selectors and exact versions.

## Tools

Show the actual operations available, grouped by consequence where helpful.

Examples:

```text
Read-only
✓ Search approved Library scope
✓ Read exact ContentVersion

Draft writes
✓ Create Document Draft
✓ Create Email Draft

External actions
□ Send Email
□ Send Message
```

Selecting a tool does not itself authorize it.

## Limits

Show useful hard bounds such as:

- max steps;
- max runtime;
- max outbound messages;
- max recipients;
- later token/cost/provider budgets.

# Capability visibility

Before an AI operation with meaningful scope, show a concise capability summary.

Example:

```text
AI can
✓ read 3 selected Documents
✓ create/edit a new Draft in Continuity

AI cannot
× send messages
× publish Automations
× access other Library content
```

This should be understandable without exposing backend jargon.

# Source selection

When AI will use private information, show the selected sources.

Examples:

```text
Using
Emergency Instructions · v3
Family Contacts · approved view
continuity.md · v5
```

Allow the user to remove a source before running the task where interactive review applies.

Do not silently broaden scope because another related item exists.

# Version awareness

When reproducibility matters, make exact versions visible.

Useful labels:

- `Using v3`;
- `Current Draft`;
- `Published v2`;
- `Newer version available`.

AI should not quietly switch a published Automation to “latest content.”

# Autonomy modes

The product now explicitly needs three human-facing modes.

## 1. Draft only

AI may read approved context and create/update permitted Drafts.

No external side effects.

## 2. Approval required

AI may prepare a consequential action, but Runtime pauses at a policy-defined approval checkpoint before the external side effect.

## 3. Pre-authorized contingency

This exists for the real Check In absence scenario.

The user deliberately publishes standing authority **before** the emergency.

Later:

```text
qualifying Incident reaches exact state
→ backend activates the exact immutable AuthorityGrantVersion
→ task/agent receives only that bounded capability envelope
→ specifically pre-authorized Actions may proceed without a fresh owner click
```

The UI should make this feel deliberate and serious, without making it frightening or obscure.

Suggested presentation:

```text
CONTINGENCY AUTHORITY
Activates only when: Primary Check In Incident → Triggered

Can
✓ read approved continuity content
✓ contact Family + Trusted audiences
✓ use verified continuity email Connection
✓ perform up to 25 outbound messages

Cannot
× change Check In timing/policy
× add new recipients outside scope
× change its own authority
× access unrelated Library content
× spend money

Ends when
Incident resolves or grant expires
```

The user should always be able to inspect the exact grant definition/version before publishing it.

# Standing authority is not prompt permission

Never imply that typing:

```text
“do whatever you need if something happens to me”
```

creates real authority.

Natural language can help the Planner prepare an AuthorityGrant Draft, but the backend still needs:

```text
typed grant
→ validation
→ human-readable preview
→ deliberate user publication
```

AI cannot publish/activate/widen/renew its own grant.

# Deterministic continuity before AI

Critical continuity should not depend entirely on an LLM/provider being available.

Preferred visual/runtime model:

```text
Incident Triggered
├─ Send pre-approved Family Email
├─ Notify Trusted contacts
├─ Release approved Document when configured
└─ AI Task / Continuity Agent
   └─ interpret, summarize, coordinate and follow up within grant
```

The UI should distinguish deterministic Actions from AI-coordinated work.

# AI output review

For ordinary Draft/content changes:

```text
AI result
→ Preview / compare
→ Apply to Draft
→ Undo / restore
→ Save Version later
```

For Automation planning:

```text
AI plan
→ human-readable summary
→ typed validation/readiness
→ user edits
→ Review
→ Publish through normal policy
```

For a pre-authorized contingency task, Review happens when the user designs/publishes the Automation/AuthorityGrant, not necessarily at execution time.

# Explain consequences, not chain-of-thought

Explain what AI proposes/changed in ordinary terms without exposing private model reasoning.

Example:

```text
Changed
• created a new Markdown Draft
• used 3 approved sources
• added Family as the Email TO audience
• set start timing to 30 minutes after grace expires

Still needs
• verified email Connection
• your Review before Publish
```

# Risk-sensitive confirmations

Low-risk reversible Draft edits may need little friction.

Higher-risk actions get stronger review.

Examples:

- create Draft → lightweight;
- Save immutable version → normal confirmation where useful;
- Publish Automation → clear Review;
- publish/modify standing AuthorityGrant → explicit capability/activation/limit review;
- send/release externally → Runtime authority/approval;
- destructive/high-impact mutation → stronger confirmation or remain human-only.

# AI should not replace normal product navigation

The user should still be able to use Directory, Library, Automations and Activity normally without AI.

AI is an acceleration/delegation layer, not the only control surface.

# Mobile AI UX

On mobile:

- use focused full-screen task views or sheets;
- keep context/tool/authority summaries readable;
- keep controls 44px+;
- make Draft vs Published vs Sent/Executed obvious;
- show contingency authority as a dedicated section, not a hidden checkbox;
- let the user return easily to the underlying Document/Automation.

# Suggested interaction patterns

## Ask about selected content

```text
Select items
→ Ask AI
→ capability/source preview
→ user asks question
→ answer cites protected item/version names in-product
```

## Create from sources

```text
Select approved sources
→ Create with AI
→ choose Document / Markdown / Template
→ destination folder
→ Draft generated
→ user edits/reviews
```

## Plan an Automation

```text
Describe what you want
→ AI asks for missing target/time/provider/permission
→ typed Draft created
→ visual builder opens
→ Review shows exact Audience/Content/Timing/Authority requirements
```

## Bounded background AI Task

```text
Automation explicitly includes AI Task
→ Runtime provides approved exact inputs
→ active grant/approval policy determines available tools
→ AI returns output / performs only permitted typed tool calls
→ Runtime records provenance
→ next typed route/action decides what happens
```

# No fake authority language

Do not say:

- `AI has access to your whole Library` unless such a grant genuinely exists;
- `AI will send this` while only a Draft exists;
- `AI can act for you in an emergency` unless the required published grant/runtime/provider path actually exists;
- `Agent is monitoring` without durable server runtime;
- `pre-authorized` when the authority exists only in Lab/localStorage.

# Activity/Audit presentation

Later Activity should distinguish actor type and authority source.

Examples:

```text
You published Continuity Authority v2
Incident activated Continuity Authority v2
Continuity Agent read Emergency Instructions v3
Continuity Agent requested Email send under grant v2
Worker executed Email occurrence
Provider accepted message
Grant deactivated when Incident resolved
```

A user should understand what AI did, what Runtime authorized, and what provider/system actually executed.

# Design success test

A user should eventually be able to say:

```text
If I miss the final grace deadline, send my family the approved instructions, then let the continuity agent coordinate follow-ups for up to 24 hours using only my Family and Trusted groups.
```

The product should turn that into a transparent typed design showing:

- deterministic Trigger;
- exact initial deterministic Actions;
- approved Audience selectors;
- exact Content/File versions;
- verified Connection requirements;
- AI Task objective/context/tools;
- standing contingency AuthorityGrant activation condition;
- limits/expiry;
- what remains prohibited;
- that nothing executes until the real Runtime/provider layer exists and the user deliberately publishes the required definitions.
