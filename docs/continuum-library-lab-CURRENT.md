# Continuum Library Lab - CURRENT

Date: 2026-08-19
Status: Standalone Library product prototype. Browser-local native content and file metadata only. No protected Library API, PostgreSQL persistence, object-storage upload, production extraction, AI retrieval or provider execution is claimed.

Route:

`https://db.cmxchat.com/lab/library/`

# Role

Library is Continuum's protected information layer.

Current product model:

`Directory = who`

`Library = what information`

`Automations = what should happen`

`Runtime = what actually happened`

The standalone Library should feel like a first-class information workspace rather than a generic file browser or an administration screen.

# Standalone migration

The earlier Library UX lived inside the focused Automation/content editor stack. The new route is isolated and does not inherit the broad `/lab/` Check In snapshot-loader compatibility stack.

Current standalone files:

- `lab/library/index.html`
- `assets/lab/library-theme-init.js`
- `assets/lab/library-app-v1.css`
- `assets/lab/library-app-v1.js`
- `assets/lab/library-app-v1-qa.js`
- `tests/continuum-library-standalone-v1.test.js`
- `.github/workflows/library-lab-validation.yml`

The older premium Library/editor/file prototypes remain useful compatibility/reference implementations while migration settles. Do not delete them merely because the standalone route exists.

# Shared Lab stores

The standalone route deliberately reuses the existing browser prototype stores so current Automation content/file examples can appear in the same Library universe:

- `cmx-lab-content-assets-v1`
- `cmx-lab-file-assets-v1`
- `cmx-lab-library-meta-v1`
- `cmx-lab-library-ui-v1`

The route only adds missing sample records/metadata and preserves existing stored Lab records.

These browser shapes are not the future PostgreSQL schema.

# Current Library experience

The standalone route currently provides:

- nested folders and folder tree;
- direct parent/up navigation and breadcrumbs;
- All / Recent / Favorites / Templates / Imports smart views;
- list and grid presentation;
- search, type filtering and sorting;
- mixed native content and file/media records;
- desktop three-pane workspace with item inspector;
- mobile item detail sheet and dedicated bottom navigation;
- light theme and rich near-black dark theme;
- local `Cmd/Ctrl + K` command palette;
- local folder creation;
- local native Document / Markdown / plain-text / Template creation;
- browser-local Draft editing;
- explicit browser-local immutable version snapshots;
- item Preview / Details / Versions / Used by / Knowledge tabs;
- sample dependency/Used by projections;
- clear sensitivity labels;
- local Favorites and Recent navigation state.

# Files and media

The Lab reuses the protected-file metadata examples and adds first-class Library presentation for:

- PDF;
- image;
- video;
- audio;
- spreadsheet;
- text/Markdown file;
- generic file fallback direction.

Video and audio receive product-quality viewer shells with duration/progress/waveform concepts. They do not play real bytes because the Lab has no object storage.

The route explicitly preserves the future exact-version model:

`FileAsset → immutable FileVersion → protected viewer / attachment / dependency`

A new FileVersion must never silently rewrite historical references.

# Native content

Native Library content follows the accepted direction:

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

The standalone Lab can edit browser-local native content and create local version snapshots to prove the interaction model.

Action-scoped Automation content remains hidden from the general Library unless it is explicitly reusable/Library-visible under the compatibility metadata.

Production must preserve the rule that editing a current Draft does not silently rewrite an already-published AutomationVersion.

# Knowledge ingestion preview

The standalone Import surface proves that Library is broader than file upload.

Current local intake modes:

- direct pasted text;
- Markdown;
- JSON;
- Files as an explicit future-upload explanation.

Pasted sources can be stored browser-locally with the exact original source retained on the sample record.

The visible product direction is:

`STORE → UNDERSTAND → INTEGRATE`

Current Lab behavior stops at local source preservation plus deterministic metadata/presentation. It does not run an AI model, extraction pipeline, Directory mutation, State mutation or production search index.

Imported information remains distinguishable from accepted Continuum truth and authority.

# Inspector contract

Opening an item should feel like opening a Continuum object, not merely a filename.

Current inspector tabs:

- Preview;
- Details;
- Versions;
- Used by;
- Knowledge.

The product direction is to answer:

- What is this?
- Which exact version is current?
- Which versions exist?
- Where is it used?
- What would archive/replace affect?
- What derived representations or extracted knowledge exist?
- What privacy/AI policy applies?

`Used by` is currently sample/local dependency presentation. Production must derive it from protected backend references.

# Mobile direction

The mobile Library is intentionally not a squeezed desktop file manager.

Current rules:

- normal mobile input typography;
- finger-sized primary controls;
- one-column item browsing;
- item inspector becomes a bottom sheet;
- creation/import/editor dialogs become mobile sheets/full-height authoring surfaces;
- current Library remains directly visible in bottom navigation;
- secondary Continuum destinations can move behind More as the app gains first-class surfaces;
- obvious folder Up/Back controls remain available;
- reduced-motion preference is respected.

# Production persistence boundary

The real Library is expected to use:

- PostgreSQL for LibraryFolder, ContentAsset, ContentDraft, ContentVersion, FileAsset/FileVersion metadata, provenance, relationships, dependency references, ingestion metadata and protected search state;
- private object storage for binary FileVersion bytes such as video, audio, images, PDFs, DOCX and spreadsheets;
- protected exact-version viewers/downloads rather than permanent public URLs.

Current `/lab/library/` does not claim any of those server services exist.

# Backend bridge

The first real backend proof remains the protected `continuity.md` vertical slice:

create `continuity.md` → persist ContentAsset + Draft in PostgreSQL → reload/second-device reads the same Draft → concurrency-safe edit → Save Version creates immutable ContentVersion → protected Library search finds it → place it in a real LibraryFolder → expose parent/path metadata → Automation Draft references the exact content → no provider execution.

Binary file persistence/object storage follows the protected FileAsset/FileVersion handoff and should not be faked in the browser.

# Shared shell

Library is now a first-class Lab destination at `/lab/library/`.

Long-term graduation remains `/library/` when the protected production surface is real.

Control Center remains the proposed Continuum home. Library owns its information workspace and must not be flattened into the Control Center dashboard layout.

# Immediate next QA / product direction

Before widening the feature set, prefer:

1. real-device visual review when convenient;
2. refine mixed-media card density and inspector hierarchy if actual rendering exposes issues;
3. converge Control Center/Directory navigation onto the new Library destination without disrupting LIVE Check In;
4. keep old embedded Library compatibility behavior working while the standalone route settles;
5. replace local sample persistence incrementally with protected backend services after the current Phase 2A release boundary.
