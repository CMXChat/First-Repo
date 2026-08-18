# Check In Product Design — CURRENT

Date: 2026-08-17
Status: Current human-interface and Lab design contract

Read with:

- `docs/checkin-context-handoff-CURRENT.md`
- `docs/checkin-library-premium-CURRENT.md`
- `docs/checkin-directory-library-CURRENT.md`
- `docs/checkin-content-editor-CURRENT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CHECKIN-PLATFORM-ARCHITECTURE.md`

This file records the UI/product principles learned from real Samsung testing and the focused Automations/Library Lab. It is intentionally separate from backend schema docs.

# Product experience goal

Check In should feel like a private, modern control center, not a database admin panel and not a developer workflow editor.

Complex backend semantics should be translated into plain language.

Examples:

```text
WHEN → Trigger
IF → Rules
DO → Actions
WAIT/REPEAT → Timing
THEN → Finish
```

The underlying typed model stays precise. The UI explains it like a normal product.

# Mobile is a first-class target

Real Samsung testing is acceptance evidence, not optional polish.

Mobile rules:

- ordinary tap targets should be about 44px or larger;
- primary controls may be 48–52px;
- body/meta text must remain readable without zooming;
- do not compress desktop density into 7–9px labels;
- avoid horizontal scrolling as the primary control-discovery mechanism;
- use wrapped toolbars, sheets, and progressive disclosure;
- respect safe-area insets;
- nested folders require an obvious up-one-level control;
- a breadcrumb alone is not enough for critical navigation.

# Navigation rule

Inside a Library folder:

```text
top-left Back/Up
→ immediate parent folder
```

At Library root:

```text
top-left Back
→ leave Library
```

Breadcrumbs remain available for jumping to higher ancestors, but they supplement the primary Back/Up behavior.

The backend should eventually return parent/breadcrumb metadata directly so the browser does not reconstruct the folder tree from unrelated data.

# Progressive disclosure

Do not show every possible option simultaneously.

Examples:

- mobile Library uses `All / Recent / Favorites` as the primary quick row;
- Documents/Files/Templates/Archived can live behind `Filter` on mobile;
- secondary item actions live behind `•••`;
- advanced workflow Finish/routes live behind `More options`;
- exact calendar/repeat options appear only when their mode is selected.

Desktop can expose more information where space permits, but should still avoid clutter.

# Library experience

Library should feel closer to a premium private drive than an admin table.

Core surfaces:

- obvious New action;
- Recent;
- Favorites;
- Templates;
- search;
- list/grid preference;
- sorting;
- logical folders;
- useful type badges/thumbnails;
- snippets/metadata;
- one clear `•••` action menu;
- Details / Versions / Used by;
- Archive/Restore rather than casual destructive deletion.

Do not show action-scoped Automation drafts in the Library unless the user explicitly chooses Save to Library / Save as Template / Save as Document.

# Item cards

Cards should emphasize:

1. name/title;
2. type;
3. useful context such as snippet, size, version, or item count;
4. updated time when useful;
5. Favorite + More as compact secondary controls.

Avoid five tiny permanent buttons on every card.

For binary assets, use useful visual previews later where safe:

- image thumbnail;
- PDF first-page preview;
- video poster;
- Office/spreadsheet safe preview.

# Editors

Check In should own excellent native editors for the formats it owns:

- rich Document;
- Markdown;
- plain text;
- Email Template;
- Message Template;
- Document Template;
- Automation-authored message/email content.

Do not attempt full editing suites for PDF/XLSX/DOCX/video/image formats in the near term.

## Rich editor toolbar

Mobile formatting controls should:

- wrap into rows;
- use finger-friendly 44–48px controls;
- briefly flash when pressed;
- briefly show the human name such as `Bold`, `Heading 2`, `Bulleted list`, or `Insert link`;
- avoid making the user memorize cryptic symbols;
- keep Write/Preview obvious.

Teaching hints are temporary and unobtrusive.

# Templates

Templates are first-class reusable content.

The UI should make these concepts obvious:

```text
Use Template
→ creates independent working content

Edit Template
→ affects future uses only after a new version is intentionally used
```

Templates should be discoverable from Library and from a relevant message/email editor.

# Audience experience

People, Organizations, Groups, and Labels should feel like understandable targeting choices.

Human language:

- Person;
- Organization;
- Group;
- Label.

The UI should preview resolved counts and channel readiness such as:

```text
18 people
17 email-ready
1 missing email
```

The browser preview is informational; production backend resolution remains authoritative.

# Automation builder experience

The builder should remain a structured linear/card experience before any freeform canvas.

Recommended product labels:

```text
Basics
Trigger
Rules
Actions
Timing
Finish
Review
```

Important Timing distinction:

- Immediately after eligibility;
- After a delay;
- At/not-before an exact local date/time;
- later WAIT steps between actions are separate;
- Repeat is separate from Retry.

Grace explanations should be visible where the check-in Trigger uses them:

```text
Check-in due
→ grace window
→ grace expires / final trigger
```

# Empty states

An empty screen should always answer:

- where am I?
- what can I do here?
- what will the primary button create?

Avoid giant explanatory landing-page copy inside operational app screens.

# Error and readiness states

Use plain truthful language.

Examples:

- `Backend pending` in Lab;
- `Upload becomes available when private storage is connected`;
- `1 person is missing an email`;
- `This published version will keep using v2`.

Do not label configuration as armed/delivered/executed before the backend/runtime exists.

# Visual direction

Aim for:

- dark mode that feels rich/near-black instead of muddy navy;
- light mode that remains clean and high contrast;
- CMX/Intel-style blue as the strong action/accent family;
- restrained mint/green for safe/ready state;
- fewer borders and boxes where hierarchy/spacing can do the work;
- rounded sheets/cards, but not every sentence inside a container;
- typography and whitespace carrying more hierarchy;
- useful file/content type accents without rainbow clutter.

# Accessibility and learnability

Design for someone who does not know developer terminology.

- icons need accessible labels;
- cryptic editor icons get transient names;
- focus states remain visible;
- color is not the only status indicator;
- buttons remain large enough for touch;
- navigation uses ordinary Back/Up expectations;
- confirmation explains consequences, not implementation jargon.

# Performance guardrail

A prior Samsung freeze was caused by broad DOM observation around a changing countdown.

Do not add:

- document-wide MutationObserver;
- whole-page characterData observation;
- repeated full-page scans on countdown ticks;
- observer loops that mutate their observed target.

Use direct events, targeted state, and explicit render/update calls.

# Navigation is not fully frozen yet

Do not prematurely lock the final protected bottom navigation based only on Lab.

The eventual product has at least these conceptual areas:

- Switch / Check In;
- Directory / People;
- Records where still useful as a separate concept;
- Library;
- Automations;
- Activity / Runtime.

Library has become important enough that it may deserve first-class navigation. Decide after the real server-backed Library/Directory exist and can be tested as an integrated product.

# Acceptance rule

A UI prototype may define the desired product contract, but it does not make a capability real.

A feature becomes real when its corresponding backend persistence, authorization, validation, versioning, runtime, provider, and audit requirements are implemented as appropriate.
