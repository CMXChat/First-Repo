# Continuum `/doc/` Freeze - CURRENT

Date: 2026-08-19
Status: FROZEN after owner-authorized continuity-first positioning audit, knowledge/time update, mobile/dark/RTL safeguards and regression refresh

## Freeze decision

`/doc/` is frozen as the current Continuum product and architecture overview.

Future changes are allowed for:

- a real visual or functional bug;
- accessibility or contrast defects;
- security or privacy corrections;
- truthful LIVE / LAB / NEXT / LATER status updates;
- broken links or route changes;
- cache/version delivery corrections;
- an explicit owner request to reopen the document.

Routine cleanup should leave the page alone.

## August 19 owner-authorized reopening

The owner explicitly reopened `/doc/` after reviewing the mobile hero and deciding the first impression felt too close to Spaces.

The audit found that the deeper page already explained Runtime, authority, continuity and Afterlife well. The opening emphasized private information, AI, files and briefings before the reader understood the wider continuity identity.

The accepted correction keeps the existing visual language and eight-section reading path while moving Continuum's central product identity into the first screen.

Canonical positioning companion:

`docs/continuum-doc-positioning-CURRENT.md`

Canonical knowledge/time companion:

`docs/continuum-knowledge-time-CURRENT.md`

## Current opening identity

The first screen should establish Continuum as a durable private operating layer for information, intent and authority across time.

Current hero direction:

```text
Your information, intent and authority across time
```

The lead now explains that Continuum can:

- help while the owner is present;
- carry approved work during absence;
- preserve a continuity plan for a time when the owner can no longer respond;
- keep Spaces, Automations, AI, Check In and Afterlife on the same durable foundation.

Compact continuity path:

```text
WITH YOU
→ FOR YOU
→ WHEN AWAY
→ IF YOU CANNOT RESPOND
```

Hero principle:

`BUILT TO CARRY INTENT FORWARD`

The page should make Afterlife feel like a natural continuity edge of the product when the reader reaches that section.

## Spaces boundary

Spaces remains a focused context and briefing experience inside Continuum.

The Information section should make the separation clear:

- Library keeps durable knowledge and source history;
- Directory keeps people and relationships;
- Spaces presents a focused view of relevant Continuum context;
- ingestion brings approved information into the durable layer.

## Knowledge ingestion direction

The accepted Information teaching covers:

```text
Paste + bulk text
Markdown + JSON
AI handoffs
Files + OCR / vision
Connected Sources
```

Canonical review direction:

```text
CAPTURE → UNDERSTAND → REVIEW → INTEGRATE
```

New knowledge starts private. Source provenance remains attached. Permanent mappings stay conservative. AI receives the authorized slice needed for the job.

Backend contracts remain authoritative for implementation semantics.

## Temporal-awareness direction

The overview now teaches a real-clock principle:

> Continuum uses backend time and timestamps for elapsed time and time-sensitive State.

The concrete example remains:

```text
User says they are leaving for two minutes
→ user returns two seconds later
→ Continuum knows roughly two seconds elapsed
```

The same temporal architecture is intended to support deadlines, waits, freshness, history, local time zones, conversations, Goals, Signals and Runtime as those layers become real.

Check In already proves server-owned elapsed timing today.

## Afterlife positioning

The Afterlife section now opens from the wider Continuum continuity model.

Current product lesson:

`Afterlife is the continuity edge of Continuum.`

The owner prepares people, information, instructions and authority while able to do so. Check In records the trigger if the owner stops responding long enough. Future Runtime can carry the approved continuity plan forward.

Fallback authority is prepared in advance.

`Silence and urgency never create authority.`

## Writing contract

Visible `/doc/` copy should avoid:

- ellipses;
- em dashes;
- formulaic `it's not X, it's Y` phrasing;
- `not X but Y` phrasing;
- `rather than` constructions;
- generic AI-style intros;
- fragment-heavy sales copy;
- excessive symmetry;
- repeated explanations that add length without adding meaning.

Use connected plain-English paragraphs, calm technical language and restrained emphasis.

## Protected structure and visuals

This pass keeps:

- the eight stable sections;
- the existing visual system;
- Check In as the first-class LIVE route;
- Spaces and Automation Lab as LAB routes;
- LIVE / LAB / NEXT / LATER truth;
- current State teaching;
- Sources, Observations, Signals and information quality;
- model routing;
- Planner and Change Plan direction;
- Goals / Missions;
- capability discovery and architecture evolution;
- continuity authority rules;
- Control Center direction;
- dark mode;
- phone layout;
- RTL translation compatibility;
- print coverage.

## Final refinement layer

The continuity-first copy and the knowledge/time panels live in:

- `assets/continuum-doc-knowledge-time.js`;
- `assets/continuum-doc-knowledge-time.css`.

`assets/continuum-doc-i18n.js` performs direction preparation and loads that final layer after the main document rendering pass.

Current loader target:

`/assets/continuum-doc-knowledge-time.js?v=20260819-2`

The loaded layer requests:

`/assets/continuum-doc-knowledge-time.css?v=20260819-2`

The static `doc/index.html` still references the i18n loader with its existing query token. Normal browser revalidation should pick up the updated loader. A future cache-token bump is allowed as a delivery correction if a device proves stale.

## Regression guard

Current dedicated positioning test:

`tests/continuum-doc-continuity-positioning.test.js`

It checks:

- continuity-first hero wording;
- early Afterlife/continuity identity;
- Spaces separation;
- OCR/vision and bulk ingestion teaching;
- real temporal-awareness teaching;
- mobile/dark/RTL/print styles;
- the final loader version;
- the visible-copy writing restrictions for the refinement layer.

`.github/workflows/continuum-doc-clarity-validation.yml` now validates the new rendered hero and the existing architecture on desktop and 390×844 mobile.

A workflow file existing does not prove a green run. Report CI as green only after an actual run/status confirms it.

## Backend boundary unchanged

This `/doc/` pass changes no production backend claim.

It does not authorize or perform:

- Phase 2A production migration;
- backend deployment;
- production general ingestion;
- production OCR/vision extraction;
- general temporal Runtime deployment;
- provider execution;
- live Signals monitoring;
- Goal orchestration;
- autonomous AI execution;
- MCP execution;
- architecture self-deployment.

Immediate backend sequence remains:

```text
prepared Phase 2A migration/deployment
→ protected continuity.md acceptance proof
→ following knowledge/storage implementation slices
```

## Reopen rule

When a future context touches `/doc/`, read this file and `continuum-doc-positioning-CURRENT.md` first.

If the requested work does not fit a listed exception and the owner did not explicitly reopen `/doc/`, leave the page unchanged.
