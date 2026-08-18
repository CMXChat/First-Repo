# Check In Premium Library — Current Frontend Handoff

Date: 2026-08-17
Status: Active focused Lab acceptance layer

Focused route:

`https://db.cmxchat.com/lab/automations/`

This document is the current companion handoff for the premium Library/product-quality pass. Read it with:

- `docs/checkin-directory-library-CURRENT.md`
- `docs/checkin-content-editor-CURRENT.md`
- `docs/checkin-files-CURRENT.md`
- `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-READ-FIRST.md`

## Why this pass exists

Real Samsung screenshots showed that the underlying Library concepts were useful, but the presentation was beginning to feel like an administration screen. The product-quality pass keeps the domain model and improves the human experience without pretending server persistence or binary storage already exists.

A later Samsung acceptance pass also proved two specific mobile problems: folder exit was discoverable only through a small breadcrumb, and several controls had been over-compressed to desktop-density typography. The current usability layer treats those as product defects, not user error.

## Locked Library mental model

```text
Library = a protected projection

Folders
+ reusable native content
+ Templates
+ binary FileAssets
+ dependency/version information
```

The Library is **not** the ContentAsset database table.

A ContentAsset may exist without appearing in the Library.

This is especially important for Automation-owned email/message drafts.

## Action-scoped content vs reusable Library content

Default rule:

```text
Automation email/message draft
→ private to that Automation
→ hidden from general Library
```

A user can deliberately choose:

- **Save to Library** — expose that same working content as reusable Library content;
- **Save as Template** — create a new Template ContentAsset copied from the current draft;
- **Save as Document** — create a new native Document ContentAsset copied from the current draft.

This prevents the Library becoming a dump of every temporary Automation payload.

The Lab stores `libraryVisible` / `libraryRole` shaped metadata only to prototype this behavior. Exact production field names may differ.

## Premium navigation and discovery

The focused Library now prototypes:

- Recent;
- Favorites;
- Templates quick access;
- list view;
- grid view;
- sorting by updated time, name, or type;
- folder-scoped search;
- cleaner root counts;
- breadcrumbs;
- nested folders;
- compact mobile creation sheet.

Lab preference store:

`cmx-lab-library-ui-v1`

These are presentation/user preferences. They are not Automation definition state and must not be embedded in ContentVersions or AutomationVersions.

Production may keep some preferences client-side or persist protected per-user Library preferences later.

## Mobile folder navigation rule

Folder navigation must be obvious without requiring the user to infer that a breadcrumb is interactive.

Current Lab behavior:

```text
At Library root
→ top-left back leaves Library

Inside a folder
→ top-left back goes up exactly one folder
→ a visible "Back to <parent>" control is also shown
→ breadcrumb remains available for direct ancestor navigation
```

For deep nesting, both the top-left control and explicit parent control resolve the immediate `parent_folder_id`; they do not jump blindly to root.

Production folder reads must return enough authorized parent/path metadata for the frontend to render this behavior without reconstructing ancestry from unrelated client state.

## Mobile sizing rule

The mobile Library is not meant to look like a shrunk desktop admin screen.

Current target direction:

- primary taps around 44–52px;
- Library card titles around normal mobile body/title size instead of 7–9px prototype text;
- search field around normal mobile input size;
- root statistics use a readable 2×2 layout on narrow phones;
- folder/item cards have larger icons, snippets, timestamps, Favorite and `•••` targets;
- empty-state and privacy copy remain readable without zooming.

Do not reintroduce sub-10px text for primary interactive Library controls on phones merely to fit more controls on one row.

## Mobile filtering simplification

The premium `All / Recent / Favorites` navigation remains directly visible.

On narrow phones, the secondary type row is collapsed behind one clear **Filter** control that opens an in-page sheet for:

- All types;
- Documents;
- Files;
- Templates;
- Archived.

This keeps controls large without stacking two dense tab bars.

Desktop/tablet may continue showing the wider category navigation where space supports it.

## Favorites

Favorites are a user convenience over stable Library references.

Favoriting an item does not:

- change ownership;
- grant permissions;
- pin an Automation version;
- give AI authority;
- move the item into another folder.

## Recent

Recent is a navigation aid.

The Lab records recently opened stable references locally. Production can derive Recent from protected access/update activity or persist a small user preference stream. It should not mutate the underlying ContentAsset/FileAsset merely because a user opened it.

## Modern item cards

The premium projection adds:

- calmer cards;
- type-specific visual badges;
- useful snippets for native content;
- file type/version metadata;
- folder child counts;
- updated-time context;
- Favorite star;
- one compact `•••` menu instead of exposing every secondary action on every card.

Secondary actions remain available through the action sheet:

- Rename;
- Move;
- Duplicate where safe;
- Details/version history;
- Archive;
- Export/Save as UX for native content;
- future Replace File version flow for binary files.

Binary Replace remains backend pending because Lab has no authoritative object storage.

## Rich editor learning UX

Rich editor controls are intentionally larger on mobile, now targeting roughly 48px finger-friendly controls in the focused usability pass.

When a formatting control is pressed:

1. the button briefly flashes/highlights;
2. a small temporary label appears near it;
3. the label disappears quickly without interrupting writing.

Examples:

- `Bold`
- `Heading 2`
- `Bulleted list`
- `Insert link`
- `Align center`

The toolbar continues to wrap into rows. Do not restore sideways-only scrolling as the primary mobile interaction.

## Native content editors

Keep specialized first-party editors for formats Check In owns:

- rich Document;
- Markdown source + safe Preview;
- plain text;
- Email Template;
- Message Template;
- Document Template;
- Automation email/message content.

Uploaded binary formats get strong protected viewers first. Do not turn this phase into Word/Excel/Photoshop/Premiere clones.

## Templates

Templates stay first-class reusable content.

Using a Template creates independent working content. Editing either side later does not silently rewrite the other.

Production should prefer an exact immutable Template ContentVersion as the instantiation source. The Lab may use the current Draft when no frozen version exists only to test UX.

## Export / Save as

The premium action sheet represents derived export destinations:

- PDF;
- Word DOCX;
- Markdown;
- HTML;
- plain text.

These remain backend pending.

Production rule:

```text
native ContentVersion
→ deterministic derived export
→ optional FileAsset/FileVersion with provenance back to source ContentVersion
```

The derived file never replaces the native editable source automatically.

## Library projection quality rules

The production Library query/projection must:

- deduplicate by stable asset identity;
- never show duplicate rows because two references point to the same asset;
- hide action-scoped content unless it was explicitly promoted/reused;
- preserve scope/owner checks across Content, Files, Folders and dependency projections;
- return enough metadata for type, version/readiness, updated time, folder placement and snippets;
- return enough folder parent/path metadata for obvious up-one-level navigation;
- avoid leaking private content into public/sanitized Check In surfaces.

## Folder quality rules

Folders remain logical database organization records.

Add/retain:

- case-insensitive sibling-name collision protection;
- create/rename/move/archive;
- stable `parent_folder_id` semantics;
- authorized parent/path projection for breadcrumbs and Back/Up controls;
- nested breadcrumbs;
- cycle prevention;
- no silent orphaning of children;
- no object-storage move when a folder moves;
- no permission meaning merely because an item is inside a folder.

## Search direction

First server-backed search should cover authorized:

- title/display name;
- filename;
- native Markdown/Text source;
- extracted text representation of native rich content;
- type/kind;
- folder;
- labels where supported;
- linked People/Organizations where supported;
- lifecycle;
- updated time;
- Used by/dependency metadata.

PostgreSQL search is the preferred first implementation. Do not add a separate search platform before evidence requires it.

## Preview/snippet direction

Native snippets can be derived from authorized native text/content.

Binary previews are derived artifacts and retain source FileVersion provenance.

Examples later:

- image thumbnail;
- PDF first-page preview;
- video poster;
- safe Office/spreadsheet preview;
- text extraction where approved.

No preview requires a permanent public object URL.

## Dependency / Used by direction

Library item Details should eventually answer:

```text
What is this?
Which versions exist?
Where is it used?
What would archive/replace affect?
```

`Used by` is a backend dependency query, not a manually maintained string.

Historical immutable versions referenced by published AutomationVersions or Runs cannot be silently destroyed.

## First real backend vertical slice after UX freeze

Preferred milestone:

```text
Create continuity.md
→ persist ContentAsset + ContentDraft in PostgreSQL
→ refresh / second device reads the same Draft
→ edit through protected API with concurrency protection
→ Save Version creates immutable ContentVersion v1
→ Library search finds it
→ move it into a real LibraryFolder
→ backend returns parent/path metadata for obvious folder navigation
→ Details shows exact version ID
→ an Automation Draft can reference it
→ no provider execution yet
```

This proves the private information layer before scheduler/provider complexity begins.

## Safety / truthfulness

Still Lab-only:

- localStorage content/folder/preferences;
- metadata-only binary file examples;
- no real object-storage bytes;
- no production upload;
- no server-backed Favorites/Recent;
- no real derived export;
- no provider sending;
- no production AI retrieval;
- no production Automation execution.

Do not call any of those server-backed until the jay-app API/models exist.

## Active premium files

- `assets/lab/lab-automations-library-premium.js`
- `assets/lab/lab-automations-library-premium.css`
- `assets/lab/lab-automations-library-mobile-fix.js`
- `assets/lab/lab-automations-library-mobile-fix.css`
- `assets/lab/lab-automations-library-usability.js`
- `assets/lab/lab-automations-library-usability.css`
- `assets/lab/lab-automations-editor-learning.js`
- `assets/lab/lab-automations-editor-learning.css`

The premium layer must keep the established Samsung safeguard: no broad document MutationObserver and no browser-owned scheduler authority.
