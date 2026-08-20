# Continuum `/doc/` Positioning - CURRENT

Date: 2026-08-20
Status: Canonical continuity-first positioning with owner-authorized plain-English clarity pass

Read with:

- `continuum-product-CURRENT.md`
- `continuum-doc-freeze-CURRENT.md`
- `continuum-knowledge-governance-time-CURRENT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-KNOWLEDGE-GOVERNANCE-AND-MEMORY-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-TEMPORAL-AWARENESS-BACKEND-CONTRACT.md`

## Current positioning

Continuum is a durable private operating layer for information, people, plans, permissions, current State and history across time.

The opening should make four conditions understandable early:

```text
WITH YOU
→ FOR YOU
→ WHEN AWAY
→ IF YOU CANNOT RESPOND
```

Afterlife remains one long-term continuity path inside the wider product. Spaces remains a focused context and briefing experience inside Continuum.

## August 20 clarity pass

The owner reopened `/doc/` after reviewing the mobile page and asked for the whole document to become easier to understand and less AI-like without damaging the existing design or architecture.

The accepted rule for this pass is:

> Explain the idea in ordinary language first. Introduce the architecture term second.

The page keeps its depth. It no longer expects a new reader to translate terms such as State, authority, Runtime, policy or provenance before understanding the basic idea.

The visual system, eight-section reading path and capability truth labels remain protected.

## Current hero direction

Kicker:

`Your information, plans and permissions across time`

Lead direction:

> Continuum keeps the information, people, instructions and permissions you want to carry with you over time. It can help you use that context today, continue work you have approved while you are away, and follow plans you prepared for a time when you cannot respond.

The next paragraph explains the major product pieces directly:

- Library holds information;
- Directory keeps people and relationships;
- Spaces brings relevant context into focus;
- Automations define approved work;
- Check In and Afterlife support continuity plans prepared in advance;
- AI models and tools can change while Continuum keeps the lasting records and rules.

Three compact hero ideas:

```text
Knows what changed and when
Can continue work you approved
Keeps track of what is allowed and why
```

Hero principle:

`BUILT TO CARRY YOUR PLAN FORWARD`

## Plain-English architecture teaching

Important architecture terms stay visible because they matter, but the page should define them through ordinary language and examples.

Examples now include:

- `State` as Continuum's current picture of what is true now;
- `Authority` as permission to act;
- Directory relationship labels adding context without creating permission by themselves;
- Library versioning where an Automation can keep using version 3 while version 4 is being edited;
- Runtime as server-side work that can later wait, resume and retry after the browser is closed;
- real elapsed time coming from server timestamps instead of an AI model guessing how long passed.

## Information / Library / Directory / Spaces distinction

The Information section should teach the product split directly:

- Library keeps documents, files, knowledge and version history;
- Directory keeps people, organizations and relationships;
- Spaces brings the relevant pieces together for one part of life or work;
- knowledge ingestion can accept pasted text, bulk input, Markdown, JSON, AI handoffs, files, OCR/vision and approved connected Sources.

Knowledge intake keeps the original source and reviewability before information becomes accepted long-term knowledge.

Canonical visible flow remains:

```text
CAPTURE → UNDERSTAND → REVIEW → INTEGRATE
```

## AI and authority direction

The AI section now leads with the simple rule:

> AI can change. Continuum keeps the rules around it.

A model can reason, write and use tools. Continuum keeps the information, current State, permissions, rules and history that decide what the model can see and what it can do.

The server remains the final permission check.

A stronger model never gains extra authority merely because it can reason better.

## Automations and Runtime direction

The Automation section now begins from the human interaction:

> Describe what should happen, then make the rules clear.

Natural language is the setup experience. Structured people, timing, approvals, limits, actions and fallback fields are what future Runtime can enforce on the server.

Runtime remains a later capability. The page must never imply that current Lab workflow definitions are already executing against providers.

## Temporal identity

The page keeps the real-clock example because it explains the architecture clearly:

```text
User says they are leaving for two minutes
→ user returns two seconds later
→ Continuum knows roughly two seconds elapsed
```

Consequential elapsed time comes from backend/server timestamps. The AI does not have to stay open between events.

This direction applies to deadlines, waits, freshness, history, timezone intent, conversations, Goals, Signals and future Runtime.

## Afterlife positioning

Afterlife is now introduced as Continuum's long-term continuity path.

The owner prepares people, information, instructions and permissions in advance. Check In records the trigger if the owner stops responding long enough. Future Runtime can follow the prepared plan.

Visible guardrail:

`Silence and urgency never create permission.`

Fallback actions must come from rules approved earlier.

## Writing rules

Visible `/doc/` copy should continue to avoid:

- ellipses;
- em dashes;
- formulaic `it's not X, it's Y` phrasing;
- `not X but Y` phrasing;
- `rather than` constructions;
- generic AI-style intros;
- excessive symmetry;
- fragment-heavy sales copy;
- repeated abstract nouns when a normal word works;
- repeated explanations that add length without adding meaning.

Use connected plain-English paragraphs, direct technical language, concrete examples and restrained emphasis.

## Protected structure and visuals

This clarity pass keeps:

- the eight-section reading path;
- the existing visual language;
- Check In as the first-class LIVE route;
- Lab and future capability truth labels;
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

The final visible copy refinement lives in:

- `assets/continuum-doc-knowledge-time.js`;
- `assets/continuum-doc-knowledge-time.css`.

`assets/continuum-doc-i18n.js` loads that final layer after the main `/doc/` rendering pass while preserving RTL direction preparation.

Current clarity marker:

`data-continuum-clarity="plain-english-v1"`

Regression coverage:

- `tests/continuum-doc-continuity-positioning.test.js`;
- `tests/continuum-doc-clarity-smoke.test.js`;
- `.github/workflows/continuum-doc-clarity-validation.yml`.

## Backend boundary

This copy pass changes no production backend claim and authorizes no migration, deployment, provider execution, Runtime activation, AI execution or new authority.

The current backend release sequence remains separate from `/doc/` presentation work.
