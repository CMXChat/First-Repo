# Check In Private Content Editor — CURRENT

Date: 2026-08-17
Status: Active focused Lab prototype

## Route

The private content editor is entered from a content-capable DO Action inside:

`https://db.cmxchat.com/lab/automations/`

It is not a provider draft and it does not call the production API.

## Product rule

Authored contingency content belongs to Check In, not Gmail/Discord/provider draft storage.

```text
private ContentAsset
→ mutable autosaved ContentDraft
→ immutable ContentVersion at approval/publish boundary
→ AutomationVersion references exact ContentVersion
→ future Runtime renders it for an approved provider
```

Editing content later must not silently rewrite an already-published Automation.

Binary attachments follow the matching version rule:

```text
FileAsset
→ immutable FileVersion
→ Content/Action pins exact FileVersion IDs
```

Uploading a newer file version must not silently alter a published Automation.

## Lab storage

The Lab uses browser-only prototype adapters including:

```text
cmx-lab-content-assets-v1
cmx-lab-file-assets-v1
cmx-lab-email-actions-v1
```

These are product-design state only. They are not production persistence, provider drafts, binary storage or delivery receipts.

Production backend contracts:

- `CMXChat/jay-app/specs/003-server-checkin/CONTENT-ASSETS-BACKEND-HANDOFF.md`
- `CMXChat/jay-app/specs/003-server-checkin/FILE-ASSETS-BACKEND-HANDOFF.md`
- `CMXChat/jay-app/specs/003-server-checkin/COMMUNICATION-ACTIONS-BACKEND-CONTRACT.md`

The Lab storage shape is not the PostgreSQL schema.

## Current rich editor

The focused editor supports:

- full-screen mobile/desktop authoring;
- internal content name;
- Write and Preview modes;
- paragraph/H1/H2/H3;
- bold/italic/underline/strikethrough;
- unordered/ordered lists;
- blockquote/code formatting;
- alignment;
- safe hyperlink creation through in-page controls;
- horizontal rule;
- undo/redo;
- clear formatting;
- autosave;
- explicit Save content;
- Done/close;
- larger mobile formatting targets;
- transient learning labels such as `Bold`, `Heading 2`, `Bulleted list`, `Insert link`;
- attachment/version direction;
- safe file viewer shells;
- truthful backend-pending upload explanation.

The current implementation deliberately avoids provider execution and does not pretend binary files are durable in Lab.

# Email composer specialization

Email now reuses this same Content editor instead of creating another rich-text engine.

For an Email Action the editor is presented as a complete composer with:

```text
From sender boundary
From display name
To
CC
BCC
Reply-To
Subject
Rich body
Attachments
Preview
```

## From

The actual production From address is not a freeform text field.

It must come from:

```text
protected Connection
→ approved SenderIdentity
```

The Lab explicitly labels that backend/provider boundary.

An optional display name can be authored separately.

## To / CC / BCC

All three reuse the Directory/Audience manager.

They are independent role selectors, not comma-separated address strings.

Production later resolves authorized People/Organizations/Groups/Labels at Run start, applies deterministic privacy-safe dedupe and freezes the exact recipient snapshot before any provider call.

## Reply-To

Reply-To is optional delivery-envelope configuration and must be validated server-side later.

It is not an arbitrary raw email header surface.

## Subject

The existing email subject field remains part of the private content draft/version and is visually placed in the Email delivery envelope.

Do not duplicate canonical Subject into provider-draft state.

## Rich body + plain text

The rich body remains canonical versioned Check In content.

Production should derive/render a deterministic plain-text multipart alternative from the exact approved content version.

## Attachments

Email attachments use exact private FileVersions.

The Lab states this explicitly but still does not create fake binary storage.

## Preview

The Email preview includes envelope context plus Subject/body. It remains a preview and must never imply provider acceptance/delivery.

Current frontend contract:

`docs/checkin-communications-ai-CURRENT.md`

# Reusable content

Action-scoped content remains private to the Action by default.

The user may explicitly:

- Save to Library;
- Save as Template;
- Save as Document.

Those reuse operations do not turn a provider draft into source of truth.

## Compatibility adapter

The older focused Automation prototype still contains a simple Action `content`/`instruction` textarea.

For compatibility, the richer editors may project a plain-text summary/objective back into that old field so existing Draft/Review UI continues to function.

The long-term backend must not keep inline Action text as canonical rich content/AI instructions.

# Security

The focused route keeps its isolated CSP and no production/provider network calls.

Rich content must be sanitized through an allowlist before reuse.

Do not allow:

- script;
- iframe;
- object/embed;
- inline event handlers;
- executable javascript/data links;
- arbitrary HTML execution.

Production backend validation remains authoritative.

Protected files must avoid permanent public object URLs. Production viewers/downloads need authenticated exact-version authorization.

Provider credentials never belong in content, Action JSON, browser storage, Audit or AI prompts.

# What eventually moves into /checkin

The production Automations UI should eventually use this authoring pattern for content-capable Actions after the matching backend exists.

Email example:

```text
DO · Send email
→ From: verified SenderIdentity
→ TO / CC / BCC: protected Audience selectors
→ Subject + rich body: private Content
→ Attach exact FileVersions
→ Preview / Review
```

The browser reads/writes protected backend Drafts. Published Automations freeze immutable versions.

# Do not build just for appearance

Deferred until real requirements:

- real-time multiplayer editing;
- comments/suggestions/CRDT collaboration;
- public share links;
- provider-side draft ownership;
- arbitrary executable embeds;
- full Office/PDF/video editing suites.

Build excellent native content editors and excellent viewers without recreating every authoring product.
