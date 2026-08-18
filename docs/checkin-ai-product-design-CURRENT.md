# Check In AI Product Design — CURRENT

Date: 2026-08-17
Status: Future-facing UI contract; no production AI runtime exists yet

Read with:

- `docs/checkin-product-design-CURRENT.md`
- `CMXChat/jay-app/specs/003-server-checkin/AI-CAPABILITY-AND-TOOLS-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CHECKIN-PLATFORM-ARCHITECTURE.md`

This file defines how AI should eventually feel in Check In once the required backend services/capability model exist.

# UX principle

> **AI should feel powerful because it understands the user’s protected context, not because it has invisible authority.**

The UI should make AI scope understandable.

# Contextual AI entry points

Prefer AI where the user is already working instead of one omnipotent global chat as the only interface.

Examples:

## Library

`Ask AI`

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

AI changes should remain a mutable Draft until the normal Save Version/Publish flow occurs.

## Automation builder

AI can:

- explain the current Automation;
- generate a typed Draft from plain language;
- suggest missing rules/timing;
- identify readiness errors;
- draft content from approved Templates/Documents.

Planner should not silently publish/send.

## Directory

AI may later help find/organize People or suggest Group composition from explicitly allowed data, but audience mutations remain typed/reviewable.

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
× access other Library folders
```

This should be understandable without exposing backend jargon.

# Source selection

When AI will use private information, show the selected sources.

Examples:

```text
Using
Emergency Instructions · v3
Family Contacts · current approved view
continuity.md · v5
```

Allow the user to remove a source before running the task.

Do not silently broaden scope because another related item exists.

# Version awareness

When reproducibility matters, the UI should make exact versions visible.

Useful labels:

- `Using v3`;
- `Current Draft`;
- `Published v2`;
- `Newer version available`.

AI should not quietly switch a published Automation to “latest content.”

# AI output review

For Draft/content changes:

```text
AI result
→ Preview / compare
→ Apply to Draft
→ Undo / restore previous Draft
→ Save Version later
```

For Automation planning:

```text
AI plan
→ human-readable summary
→ typed validation/readiness
→ user edits
→ Review
→ Publish only through normal policy
```

# Explain consequences, not chain-of-thought

The product should explain what AI proposes/changed in ordinary terms without exposing private model reasoning.

Examples:

```text
Changed
• created a new Markdown Draft
• used 3 approved sources
• added Family as the Audience
• set start timing to 30 minutes after grace expires

Still needs
• email Connection
• your Review before Publish
```

# Risk-sensitive confirmations

Low-risk reversible Draft edits may need little friction.

Higher-risk actions should show stronger review.

Examples:

- create Draft → lightweight;
- Save immutable version → normal confirmation where useful;
- Publish Automation → clear Review;
- send/release externally → runtime/policy/approval;
- destructive/high-impact mutation → explicit stronger confirmation or remain human-only.

# AI should not replace normal product navigation

A user should still be able to use Directory, Library, Automations, and Activity normally without AI.

AI is an acceleration/delegation layer, not the only control surface.

# Mobile AI UX

On mobile:

- avoid giant chat overlays covering the work permanently;
- use bottom sheets/full-screen focused task views where appropriate;
- keep source/capability summary readable;
- keep primary `Generate / Apply / Review` controls 44px+;
- allow easy return to the underlying Document/Automation;
- never hide whether AI output is Draft vs Published/Sent.

# Suggested future AI interaction patterns

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
→ AI asks for missing target/time/provider permission if needed
→ typed Draft created
→ visual builder opens on that Draft
→ Review shows exact Audience/Content/Timing
```

## Bounded background AI Task

```text
Automation definition explicitly includes AI Task
→ runtime provides approved exact input versions
→ AI returns validated output
→ output stored/audited
→ next typed route/action decides what happens
```

# No fake authority language

Do not say:

- `AI has access to your whole Library` unless such a grant genuinely exists;
- `AI will send this` while only a Draft exists;
- `AI changed production` if it merely edited a local/Lab prototype;
- `Agent is monitoring` without durable server runtime.

# Activity/Audit presentation

Later Activity should distinguish actor type clearly.

Examples:

```text
You edited continuity.md Draft
AI Planner created Automation Draft
You published Automation v3
Worker executed Email occurrence
Provider accepted delivery
```

A user should be able to understand what AI did vs what the server/runtime/provider did.

# Design success test

A user should eventually be able to ask:

```text
Use my selected continuity documents to create a family plan and draft an Automation for grace expiry.
```

The UI should make it obvious:

- which private sources AI can read;
- where the new Draft will be saved;
- which Audience it selected;
- which timing it configured;
- what is still missing;
- that nothing has been sent/published yet;
- what approval/review is required next.
