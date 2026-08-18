# Check In Private Content Editor — Current Frontend Handoff

Date: 2026-08-17
Status: Active focused Lab prototype

## Route

The private content editor is entered from a content-capable DO Action inside:

`https://db.cmxchat.com/lab/automations/`

It is not a provider draft and it does not call the production API.

## Product rule

Authored contingency content belongs to Check In, not Gmail/Discord/provider draft storage.

The product direction is:

```text
private ContentAsset
→ mutable autosaved ContentDraft
→ immutable ContentVersion at approval/publish boundary
→ AutomationVersion references exact ContentVersion
→ future runtime renders it for an approved provider
```

Editing content later must not silently rewrite an already-published Automation.

Binary attachments follow the matching version rule:

```text
FileAsset
→ immutable FileVersion
→ ContentVersion pins exact FileVersion IDs
```

Uploading a newer file version must not silently alter a published Automation.

## Lab storage

The Lab uses a dedicated browser-only adapter:

`cmx-lab-content-assets-v1`

This is prototype storage only.

It is separate from provider accounts and separate from the Automation draft store.

The Lab adapter may save sanitized HTML plus plain text for interaction testing. Production backend must use the structured/versioned content contract described in:

`CMXChat/jay-app/specs/003-server-checkin/CONTENT-ASSETS-BACKEND-HANDOFF.md`

The Lab HTML shape is not the PostgreSQL schema.

File metadata/version interaction uses the separate Lab adapter:

`cmx-lab-file-assets-v1`

That adapter contains no real file bytes.

Current file/attachment frontend handoff:

`CMXChat/First-Repo/docs/checkin-files-CURRENT.md`

Backend file contract:

`CMXChat/jay-app/specs/003-server-checkin/FILE-ASSETS-BACKEND-HANDOFF.md`

## Current editor slice

The focused editor supports:

- full-screen mobile/desktop authoring;
- internal content name;
- email subject when applicable;
- Write and Preview modes;
- paragraph/H1/H2/H3;
- bold;
- italic;
- underline;
- strikethrough;
- unordered list;
- ordered list;
- blockquote;
- hyperlink creation through an in-page control;
- horizontal rule;
- undo/redo;
- clear formatting;
- autosave;
- explicit Save content;
- Done/close;
- protected attachment manager prototype;
- exact file-version pinning in content drafts;
- file search/library;
- file Preview/Details/Versions/Used by UI;
- image/PDF/video/audio/spreadsheet/text viewer shells;
- truthful backend-pending upload explanation.

The current implementation deliberately avoids provider execution and does not pretend binary files are durable in Lab.

## Compatibility adapter

The older focused Automation prototype still has a simple Action `content`/`instruction` textarea field.

For compatibility only, the rich editor projects a plain-text summary back into that older field so existing Draft/Review behavior keeps working.

The long-term backend must not keep the inline Action body as canonical rich content.

## Security

The focused route keeps its existing isolated CSP and no production/provider network calls.

Rich HTML saved by the Lab adapter must be sanitized through an allowlist before reuse.

Do not allow:

- script;
- iframe;
- object/embed;
- inline event handlers;
- javascript/data executable links;
- arbitrary HTML execution.

Production backend validation remains authoritative later.

Protected files must also avoid permanent public object URLs. Production viewers/downloads need authenticated, exact-version authorization.

## Backend handoff

Canonical content backend companion:

`CMXChat/jay-app/specs/003-server-checkin/CONTENT-ASSETS-BACKEND-HANDOFF.md`

Canonical file/backend companion:

`CMXChat/jay-app/specs/003-server-checkin/FILE-ASSETS-BACKEND-HANDOFF.md`

Together they define:

- ContentAsset identity;
- mutable ContentDraft revisions;
- immutable ContentVersion;
- structured-document canonical representation;
- exact content-version references from published AutomationVersions;
- provider-specific rendering;
- FileAsset identity;
- immutable FileVersion;
- private object storage;
- exact attachment-version references;
- protected viewers/downloads;
- upload/finalize/scan state;
- autosave/concurrency rules;
- lock/session/privacy requirements;
- migration away from inline Action payloads and provider drafts.

## What eventually moves into /checkin

The production Actions/Automations UI should eventually use this authoring pattern for content-capable actions.

Example:

```text
ACTIONS
→ Send email
→ Target: protected Person/Organization
→ Content: Emergency continuity email
→ Open content editor
→ Attach exact protected FileVersions
```

The editor should then read/write protected backend ContentAssets and FileAssets, not browser localStorage.

Published Automations reference immutable versions.

## Do not build yet just for appearance

Do not add Google-Docs-scale collaboration features merely to make the editor feel polished.

Deferred until real requirements:

- real-time multiplayer editing;
- comments/suggestions;
- CRDT/OT collaboration;
- public share links;
- provider-side drafts;
- arbitrary executable embeds.

## Next frontend extensions after current slice is accepted

Potential next work:

- Content Library dashboard;
- broader protected Files/Media library under Records;
- reusable content/templates;
- content version-history UI;
- protected variable insertion (`recipient name`, etc.);
- richer channel-specific previews;
- protected inline image/document embeds;
- Markdown view for advanced users if it remains useful;
- template duplication;
- destination/provider capability warnings;
- actual upload progress UX once the backend upload-intent contract exists.
