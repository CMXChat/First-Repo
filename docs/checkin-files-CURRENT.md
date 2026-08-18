# Check In Protected Files — Current Frontend Handoff

Date: 2026-08-17
Status: Active Lab prototype

## Route

The current protected file-library/attachment prototype is entered through a private Content editor inside:

`https://db.cmxchat.com/lab/automations/`

Flow:

```text
Automation
→ ACTIONS
→ Send email / Notify a person
→ Private Content
→ Open editor
→ Manage files
```

The route is Lab-only and does not call the production Check In API or any provider.

## Current frontend files

- `assets/lab/lab-automations-files-runtime.js`
- `assets/lab/lab-automations-files.css`
- `lab/automations/index.html`

The file runtime is deliberately event-driven and does not add a broad MutationObserver.

## Lab storage boundary

The prototype uses:

`cmx-lab-file-assets-v1`

for file metadata/version mock data.

It does **not** store real binary file bytes.

The content draft keeps attachment references shaped like:

```text
fileAssetId
fileVersionId
attachedAt
```

inside the existing Lab-only `cmx-lab-content-assets-v1` adapter.

This is interaction testing only. It is not the PostgreSQL or object-storage schema.

## Current UX

The first file slice supports:

- Attached tab;
- File library tab;
- search;
- attach current version;
- remove attachment;
- explicit `Update to current version` when the content draft is pinned to an older version;
- compact attachment cards in the rich editor;
- Preview;
- Details;
- Version history;
- Used by count/list based on current Lab ContentDraft references;
- current-version metadata;
- explicit backend-pending upload explanation;
- archive/history explanation;
- dark/light styling;
- mobile layout.

## Exact-version rule

Attaching a file pins the exact version.

Example:

```text
Emergency Instructions.pdf
current FileAsset version = v3

ContentDraft attachment = v2
```

The UI may warn that a newer version is available.

It does not silently replace v2 with v3.

The user must deliberately choose:

`Update to v3`

This is the frontend expression of the backend immutable-history rule.

## Viewer prototype

The current Lab includes viewer shells for:

- image;
- PDF;
- video;
- audio;
- spreadsheet;
- text/Markdown;
- generic file fallback.

These are intentionally metadata/UX previews because Lab does not store actual bytes.

Production viewer requirements are defined in:

`CMXChat/jay-app/specs/003-server-checkin/FILE-ASSETS-BACKEND-HANDOFF.md`

Production viewers must be authenticated, exact-version aware, and must never require permanent public file URLs.

## Upload prototype boundary

`Upload new` currently opens the intended production flow explanation instead of pretending to upload bytes.

Production flow should conceptually be:

```text
Choose file
→ backend-authorized upload intent
→ private object storage
→ finalize metadata/checksum
→ scan/quarantine validation
→ immutable FileVersion
→ available to protected viewer/Actions
```

Lab browser storage must never be presented as durable binary storage.

## Backend handoff

Canonical backend companion:

`CMXChat/jay-app/specs/003-server-checkin/FILE-ASSETS-BACKEND-HANDOFF.md`

That file defines:

- FileAsset;
- immutable FileVersion;
- StorageObject/provider-independent private bytes;
- short-lived upload intents;
- checksum/type/size validation;
- malware scan/quarantine state;
- exact attachment-version references;
- viewer/download authorization;
- Range/media support;
- safe derived previews;
- provider attachment preflight;
- oversized protected-link direction;
- Used-by/dependency history;
- archive/retention rules;
- exact version recording in future Runs.

## Relationship to Content assets

Files are attachments/references owned by the private content layer.

Approved shape:

```text
ContentAsset
→ ContentDraft
   → attachment refs to exact FileVersions
→ ContentVersion
   → immutable attachment FileVersion refs
→ AutomationVersion
```

Published Automations must never resolve attachments as `latest at execution time` in the first implementation.

## What later moves into `/checkin`

The production private UI should reuse this interaction model behind Access.

Records/Files can eventually expose a broader protected library, while the Content editor uses the same file library as an attachment picker.

Do not add a separate public file surface merely because the backend has FileAsset models.

## Immediate review checklist

On Samsung/Chrome and desktop:

1. open a content-capable Action;
2. open Private Content editor;
3. tap Manage files;
4. switch Attached/File library tabs;
5. search files;
6. attach `Emergency Instructions.pdf`;
7. confirm exact version is shown in the editor attachment card;
8. Preview the PDF viewer shell;
9. open Details and inspect Version history / Used by;
10. attach image/video/audio/spreadsheet/text examples and inspect viewers;
11. remove an attachment;
12. verify the Upload new explanation never claims a real upload occurred;
13. check dark/light and mobile layout.
