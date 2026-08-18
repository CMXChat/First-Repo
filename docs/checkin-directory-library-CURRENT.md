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

Library
├── Folders
├── Native content
│   ├── Rich Document
│   ├── Markdown
│   ├── Plain text
│   └── Templates
└── Files = uploaded binary assets

Automation Action = Audience + Content + optional Documents/Files
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

# Advanced Private Library

The focused route now uses an advanced Library layer on top of the earlier Documents + Files prototype.

The Lab Library supports:

- logical nested folders;
- breadcrumbs;
- create folder;
- rename folder;
- move folder;
- archive folder prototype;
- rename/move/archive Library items;
- duplicate native content;
- search within the current folder;
- filters for All / Documents / Files / Templates / Archived;
- content/file details;
- immutable Lab content version snapshots.

Lab folder metadata uses:

`cmx-lab-library-meta-v1`

This is browser-only prototype state.

Production folders are logical database records. They are not literal object-storage paths and they are not permission boundaries.

Canonical backend companion:

`CMXChat/jay-app/specs/003-server-checkin/LIBRARY-FOLDERS-TEMPLATES-MARKDOWN-BACKEND-HANDOFF.md`

## Native Documents

A Document is native editable Check In content.

Rich Documents use a Docs-style editor and the ContentAsset / mutable Draft / immutable ContentVersion direction.

Native Document remains the editable source.

Derived exports may later include:

- PDF;
- DOCX;
- Markdown;
- HTML;
- plain text.

Retained exports become derived FileAssets/FileVersions in production instead of replacing the editable native source.

## Native Markdown

Markdown is now a first-class native Library item.

The focused Lab can create an editable `.md` item with:

- human title;
- filename such as `ai-context-notes.md`;
- Markdown source editor;
- formatting helpers;
- safe side-by-side/stacked preview;
- autosaved mutable draft;
- explicit immutable **Save version** snapshots;
- content details/version IDs;
- folder placement;
- rename/move/duplicate/archive UX.

Product rule:

```text
Native Markdown source
→ ContentAsset / ContentDraft in PostgreSQL later
→ immutable ContentVersion snapshots
→ human editor / safe renderer / authorized AI retrieval
```

Ordinary native Markdown should not require object storage merely because the UI calls it a file.

If a user uploads an existing `.md`, production should be able to preserve the original FileVersion and offer **Import as editable Markdown**.

## Native plain text

The Library can also create `.txt` native content with the same ContentAsset/ContentVersion direction and a dedicated plain-text editor.

## Binary Files

Files continue to use the separate protected FileAsset/FileVersion prototype and viewer layer.

Examples:

- PDF;
- image;
- video;
- audio;
- DOCX;
- XLSX;
- archives.

Binary upload remains backend pending and must use private object storage later.

The advanced Library can rename the FileAsset display name and move/archive the logical Library item in Lab metadata. Production FileVersions retain immutable original filename/checksum provenance.

## Templates

Templates are now a first-class Library type.

The focused Lab can create:

- Email template;
- Message template;
- Document template.

Templates use the same private content direction as Documents instead of Gmail/Discord/provider drafts.

Template drafts can have immutable saved versions.

The prototype exposes a few safe variable placeholders such as:

- `{{recipient_name}}`
- `{{organization_name}}`
- `{{current_date}}`

These are presentation placeholders only. Production variables must be typed and allowlisted server-side.

## Use template inside an Automation

The private content editor now receives a **Reusable Templates** shortcut.

The user can choose a saved Template and instantiate its content into the current email/message draft.

Lab records a `templateSource` reference when applying a Template.

Production rule:

```text
Template ContentVersion
→ instantiate new mutable ContentDraft
→ user edits independently
→ Automation Publish freezes the final ContentVersion
```

Editing a Template later must not rewrite an already-created message or published Automation.

## AI-readable native content

Native Document / Markdown / Text / Template content is designed to be usable by humans and later authorized AI.

The production AI contract is not raw database access.

Preferred direction:

```text
AI capability
→ approved protected content_id
→ exact content_version_id or explicit current Draft permission
→ backend authorization
→ allowed representation returned
→ audited use where required
```

AI must not receive database credentials, SQL access, object-storage keys, or blanket folder access.

Folder placement does not grant AI permission.

For reproducible Automation behavior, exact immutable ContentVersion IDs are preferred.

## Linking Documents / Files into authored content

When Library is opened from a private content editor, native Documents and protected FileVersions can be reused by the content draft.

Production Publish must freeze exact immutable ContentVersion/FileVersion dependencies before an AutomationVersion becomes immutable.

## Rich editor toolbar

The private rich editor toolbar no longer depends on horizontal sideways scrolling on mobile.

Formatting controls wrap into visible rows.

When a formatting control is tapped, a short learning hint appears near the button, for example:

- `Bold`
- `Heading 2`
- `Bulleted list`
- `Insert link`
- `Align center`

This is intentionally small and temporary so a new user learns the symbols without interrupting writing.

Native rich Documents/Templates use the same visual language.

## Deliberate non-goals right now

Do not turn this phase into clones of:

- Google Docs multiplayer collaboration;
- Microsoft Word;
- Excel;
- Photoshop;
- Acrobat editing;
- Premiere/video editing.

The product should provide excellent native editors for Check In-owned text/content and excellent protected viewers for uploaded binary formats first.

## Safety / truthfulness

The focused route still must not pretend these exist in production yet:

- server directory mutations;
- real Groups/Labels backend;
- authoritative audience resolution;
- server native Document/Markdown/Text/Template persistence;
- real object-storage upload;
- provider delivery;
- production immutable publish;
- durable Run recipient snapshots;
- real AI Library access.

Lab localStorage is only a product prototype adapter.

## Active frontend files

- `assets/lab/lab-automations-audience-runtime.js`
- `assets/lab/lab-automations-audience-review.js`
- `assets/lab/lab-automations-audience.css`
- `assets/lab/lab-automations-library-runtime.js`
- `assets/lab/lab-automations-library.css`
- `assets/lab/lab-automations-library-pro.js`
- `assets/lab/lab-automations-library-pro.css`
- `assets/lab/lab-automations-editor-learning.js`
- `assets/lab/lab-automations-editor-learning.css`
- `assets/lab/lab-automations-document-security.js`

Existing related files remain:

- `assets/lab/lab-automations-content-runtime.js`
- `assets/lab/lab-automations-content.css`
- `assets/lab/lab-automations-files-runtime.js`
- `assets/lab/lab-automations-files.css`

## Immediate review path

1. Open `/lab/automations/` and open Library.
2. Create a Folder and move between folder breadcrumbs.
3. Create a native Markdown file and edit both its filename and source.
4. Check the safe Markdown Preview.
5. Save an immutable version and inspect Details/version ID.
6. Create a plain-text item.
7. Create an Email or Message Template.
8. Add formatting/variables and Save version.
9. Rename/move/duplicate native content.
10. Inspect an existing binary File and rename/move its Library item.
11. Open a private Automation content editor.
12. Use **Reusable Templates** and apply a Template.
13. Open Library from the content editor and inspect existing Document/File reuse.

Do not treat any Lab-only state as durable production data.
