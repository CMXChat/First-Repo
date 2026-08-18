# Check In Directory, Audiences & Library — Current Frontend Handoff

Date: 2026-08-17
Status: Active focused Lab prototype

## Focused route

`https://db.cmxchat.com/lab/automations/`

This work remains Lab-only and does not call the production API.

## Locked product concepts

The frontend now treats these as distinct concepts:

```text
Person ↔ Organization
Person + Labels
Groups = saved audiences
Document = native editable Check In content
File = uploaded binary asset
Library = Documents + Files
Automation Action = Audience + Content + optional attachments
```

## Person and Organization relationships

A Person may belong to more than one Organization.

The Lab compatibility adapter keeps the older `orgId` field for old screens, while the new audience layer uses `organizationIds` as the many-membership prototype shape.

The long-term backend contract is many-to-many and is documented in:

`CMXChat/jay-app/specs/003-server-checkin/DIRECTORY-AUDIENCE-LIBRARY-BACKEND-HANDOFF.md`

## Labels

Suggested labels are available as starting points:

- Family
- Friend
- Work
- Colleague
- Client
- Legal
- Emergency
- Trusted
- Vendor
- Technical
- Financial
- Personal

Users may create custom labels.

Suggested labels are not a closed list.

## Groups

Groups are saved audiences and are separate from Labels.

A custom Group may include:

- People;
- Organizations;
- Labels.

The resolver deduplicates People by stable Person ID.

The Lab includes a few suggested groups only to make the UX testable. Users can create their own.

## Automation audience picker

The old single Target dropdown is visually superseded in the focused Lab by the new **Audience** card.

The Audience manager can select one or more:

- People;
- Organizations;
- Groups;
- Labels.

The UI previews:

- unique resolved People count;
- email-ready count;
- phone-ready count.

Organization membership and Group/Label targeting use live directory membership in the Lab prototype.

Production rule:

```text
Automation stores protected audience selector IDs
→ runtime resolves current authorized membership
→ deduplicates recipients
→ checks channel readiness
→ freezes exact recipient snapshot into Run history
→ provider delivery uses that frozen snapshot
```

The browser is not the authoritative audience resolver in production.

## Person relationship manager

From the Audience manager, a Person can be opened in **Manage** mode.

The Lab can edit:

- multiple Organization memberships;
- multiple Labels.

This extends `cmx-lab-crm-v1` without removing the older fields used by the larger Lab.

## Unified Library

The focused Automation prototype now exposes a **Library** concept.

The Library combines:

```text
Documents
Files
```

while keeping their underlying models separate.

### Documents

A Document is native editable Check In content.

The Lab document editor supports:

- title;
- rich text;
- headings;
- bold/italic/underline/strikethrough;
- lists;
- quotes;
- links;
- dividers;
- autosave;
- saved immutable Lab version snapshots;
- `Used by` dependency display;
- Save as / export UX.

Native Document remains the editable source.

Save/export options represented in the Lab:

- native Check In Document;
- PDF;
- DOCX;
- Markdown;
- HTML;
- plain text.

Only the native Lab Document is actually browser-persisted. Export formats are truthfully marked as backend pending.

### Files

Files continue to use the separate protected FileAsset/FileVersion prototype and viewer layer.

The Library can preview or inspect protected file metadata and, when opened from an Automation content editor, attach the current exact FileVersion.

Actual binary uploads remain backend pending.

## Linking Documents into authored content

When the Library is opened from a private content editor, a native Document may be linked into that content draft.

The Lab stores a protected-shaped ContentAsset reference plus current draft revision for UX testing.

Production Publish must freeze the exact immutable ContentVersion instead of executing against a mutable latest draft.

## Rich editor toolbar change

The private rich editor toolbar no longer depends on horizontal sideways scrolling on mobile.

Formatting controls wrap into visible rows.

When a formatting control is tapped, a short learning hint appears near the button, for example:

- `Bold`
- `Heading 2`
- `Bulleted list`
- `Insert link`
- `Align center`

This is intentionally small and temporary so a new user learns the symbols without interrupting writing.

The native Document editor uses the same visual language.

## Safety / truthfulness

The focused route still must not pretend these exist in production yet:

- server directory mutations;
- real Groups/Labels backend;
- authoritative audience resolution;
- server native Document persistence;
- real object-storage upload;
- provider delivery;
- production immutable publish;
- durable Run recipient snapshots.

Lab localStorage is only a product prototype adapter.

## Active frontend files

- `assets/lab/lab-automations-audience-runtime.js`
- `assets/lab/lab-automations-audience.css`
- `assets/lab/lab-automations-library-runtime.js`
- `assets/lab/lab-automations-library.css`
- `assets/lab/lab-automations-editor-learning.js`
- `assets/lab/lab-automations-editor-learning.css`

Existing related files remain:

- `assets/lab/lab-automations-content-runtime.js`
- `assets/lab/lab-automations-content.css`
- `assets/lab/lab-automations-files-runtime.js`
- `assets/lab/lab-automations-files.css`

## Immediate review path

1. Open a Draft Automation.
2. Go to ACTIONS.
3. Use **Audience** instead of the older Target picker.
4. Select an Organization and inspect resolved People/readiness counts.
5. Manage a Person and attach multiple Organizations/Labels.
6. Create a custom Label.
7. Create a custom Group containing People/Organizations/Labels.
8. Open Private Content.
9. Verify the formatting toolbar wraps into rows and tap controls to see learning hints.
10. Open **Library**.
11. Create a native Document.
12. Edit it, Save version, inspect Save as, Details and Used by.
13. Link the Document into the private content draft.
14. Inspect existing Files from the same Library.

Do not treat any Lab-only state as durable production data.
