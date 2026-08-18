# Check In Library — Samsung Mobile Acceptance

Date: 2026-08-17
Device evidence: real Samsung/Android screenshots from focused `/lab/automations/`
Status: UX findings addressed in Lab source; recheck required after Pages deploy/refresh

## What the real-device screenshots proved

- Global `Library` entry is visible from the Automations dashboard on mobile.
- Advanced Library overlay opens on Samsung and the header/breadcrumb shell is usable.
- `+ New` exposes Folder, Rich document, Markdown, Text and Template creation options.
- Native Rich Document editor opens and the formatting toolbar wraps into visible rows instead of requiring horizontal scrolling.
- Nested folder navigation/breadcrumbs work at the presentation level.

## Problems visible in screenshots

1. The Library projection showed duplicate seeded file rows such as repeated image/spreadsheet/audio/Markdown examples.
2. A duplicate sibling `Templates` folder was visible.
3. Action-scoped content such as `Private message content` appeared in the general Library even though it had not been deliberately saved for reuse.
4. Global counts included internal/action content and could double-count Template content as generic native content.
5. The mobile `+ New` chooser consumed too much vertical space with large single-column cards.
6. The All/Documents/Files/Templates/Archived filter area was too tall on mobile.
7. Large stat cards stayed visible inside nested folders where they added clutter.
8. The newer native Document/Markdown toolbar controls were not all covered by the existing small learning-label helper.
9. The blank native Document canvas was taller than needed on a phone.

## Lab fixes added from this evidence

Files:

- `assets/lab/lab-automations-library-mobile-fix.js`
- `assets/lab/lab-automations-library-mobile-fix.css`
- updated `assets/lab/lab-automations-editor-learning.js`

Behavior:

- normalize/dedupe Lab FileAsset rows by stable identity/version identity;
- consolidate duplicate active sibling folders by normalized name and preserve placements/children;
- prevent creating another active sibling folder with the same case-insensitive name;
- keep action-scoped email/message/instruction ContentAssets out of the general Library projection unless explicitly marked reusable;
- correct presentation counts to Documents / Files / Templates / Folders;
- hide large stats inside nested folders;
- compact the filter bar;
- turn the mobile Create chooser into a bottom-sheet style compact two-column surface;
- shorten the native editor canvas on mobile;
- teach `data-pro-command`, rich-link and Markdown formatting controls with the same temporary learning labels.

## Product rule clarified

`ContentAsset` does not imply `Library-listed`.

Action-owned message/email content stays attached to the Action by default. A later explicit operation such as `Save to Library`, `Save as Template`, or `Save as Document` promotes reusable content.

The Library is a protected projection over eligible ContentAssets, FileAssets and LibraryFolders. It must return one logical row per stable asset identity.

Backend continuation is recorded in `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-READ-FIRST.md`.

## Recheck after deploy

On Samsung:

1. refresh focused Automations Lab;
2. open Library root and verify no repeated File rows or duplicate Templates folder;
3. verify `Private message content` is absent from the general Library;
4. verify root counts are clean and nested folder stats collapse;
5. tap `+ New` and verify compact bottom-sheet presentation;
6. open Rich Document and tap B / H2 / list / link to verify learning labels;
7. create a duplicate sibling folder name and verify the inline rejection.
