# Continuum `/doc/` Positioning - CURRENT

Date: 2026-08-19
Status: Canonical continuity-first positioning after owner-requested product audit

Read with:

- `continuum-product-CURRENT.md`
- `continuum-doc-freeze-CURRENT.md`
- `continuum-knowledge-governance-time-CURRENT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-KNOWLEDGE-GOVERNANCE-AND-MEMORY-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-TEMPORAL-AWARENESS-BACKEND-CONTRACT.md`

## Why this audit happened

The August 19 mobile hero was polished and accurate, yet its first impression leaned too heavily toward private AI context, files and briefings. That made Continuum feel too close to Spaces before the reader reached the continuity, Runtime and Afterlife material.

The owner explicitly reopened `/doc/` for a restrained product audit and refinement.

## Positioning decision

Continuum should feel like a durable private operating layer that can preserve knowledge, current State, intent, authority, policy and history across time.

The first screen should establish four conditions early:

```text
WITH YOU
→ FOR YOU
→ WHEN AWAY
→ IF YOU CANNOT RESPOND
```

Afterlife remains one continuity edge of the wider product. The page should introduce that DNA early enough for the Afterlife section to feel like a natural extension of Continuum.

Spaces remains a focused context and briefing experience inside Continuum.

## Current hero direction

Kicker:

`Your information, intent and authority across time`

Lead:

> Continuum keeps the information, people, rules and authority that should survive the moment. It can help while you are here, carry approved work when you are away and preserve the continuity plan you prepared for a time when you can no longer respond.

> Spaces, Automations, AI, Check In and Afterlife use that same durable foundation. Models and tools can change. Continuum keeps the context, current State, policy and history that make the next decision coherent.

Three compact ideas:

```text
Understands what changed + when
Carries approved intent forward
Keeps authority + history coherent
```

Continuity principle:

`BUILT TO CARRY INTENT FORWARD`

The opening remains human and concise. Deeper architecture follows below.

## Spaces distinction

The Information section now teaches:

- Library keeps durable knowledge and source history;
- Directory keeps people and relationships;
- Spaces presents a focused view of the relevant pieces;
- direct text, bulk input, Markdown, JSON, AI handoffs, files, OCR/vision and approved connected Sources can enter through the knowledge-ingestion direction;
- proposed durable mappings remain reviewable under the current knowledge-governance contract.

Spaces should never read as the whole Continuum product.

## Temporal identity

The overview includes the real temporal-awareness direction:

- server-backed time for consequential state;
- elapsed time comes from timestamps;
- two seconds and two hours remain different even when no model stayed active;
- deadlines, waits, freshness, history and timezone intent use explicit temporal data.

This reinforces the Continuum name and the product's ability to operate across time.

## Afterlife positioning

The Afterlife section now begins from the wider continuity model:

> Afterlife is the continuity edge of Continuum.

The reader should understand that the owner prepares people, information, instructions and authority while able to do so, Check In records the trigger, and later Runtime can carry the approved continuity plan forward.

Fallback authority stays prepared in advance. Silence and urgency never create authority.

## Writing rules

The visible `/doc/` copy should continue to avoid:

- ellipses;
- em dashes;
- formulaic contrast constructions such as `it's not X, it's Y`;
- `not X but Y` phrasing;
- `rather than` constructions;
- generic AI-style intros;
- excessive symmetry;
- short fragment-heavy sales copy;
- repetitive explanations of the same concept.

Use connected plain-English paragraphs, direct technical language and restrained emphasis.

## What stayed protected

This pass keeps:

- the eight-section reading path;
- existing visual language;
- Check In as the first-class LIVE route;
- Spaces and Automation Lab as LAB routes;
- LIVE / LAB / NEXT / LATER truth;
- State, Signals, information-quality and provenance teaching;
- Planner, Goals and Runtime architecture;
- capability discovery and architecture evolution;
- continuity authority rules;
- Control Center direction;
- dark mode;
- mobile layout;
- RTL compatibility;
- print coverage.

## Implementation layer

The final continuity-first refinement lives in:

- `assets/continuum-doc-knowledge-time.js`;
- `assets/continuum-doc-knowledge-time.css`.

`assets/continuum-doc-i18n.js` loads that final layer after the main `/doc/` rendering pass while preserving RTL direction preparation.

Regression coverage:

- `tests/continuum-doc-continuity-positioning.test.js`;
- `.github/workflows/continuum-doc-clarity-validation.yml`.

## Backend boundary

This positioning pass changes no production backend claim.

The new ingestion, memory-governance and temporal contracts remain future architecture after the current Phase 2A release boundary and protected `continuity.md` proof.
