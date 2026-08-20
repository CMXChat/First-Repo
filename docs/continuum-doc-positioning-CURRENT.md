# Continuum `/doc/` Positioning - CURRENT

Date: 2026-08-20
Status: Canonical continuity-first positioning with owner-authorized plain-English and human-cadence pass

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

## August 20 clarity and cadence passes

The owner reopened `/doc/` after reviewing the mobile page and asked for the whole document to become easier to understand and less AI-like without damaging the existing design or architecture.

The first accepted rule was:

> Explain the idea in ordinary language first. Introduce the architecture term second.

A follow-up cadence audit found that clear sentences could still sound generated when several short subject-action sentences were stacked together, for example `Library does X. Directory does Y. Spaces does Z.`

The second accepted rule is:

> Let related ideas flow into each other. Avoid repeatedly resetting the paragraph with the same short sentence pattern.

The page keeps its technical depth, diagrams, eight-section reading path and capability truth labels.

## Current hero direction

Kicker:

`Your information, plans and permissions across time`

Opening lead:

> Continuum keeps the information, people, instructions and permissions you want to carry with you over time. It can help you use that context today, continue work you have approved while you are away, and follow plans you prepared for a time when you cannot respond.

The next paragraph explains how the product pieces relate in connected prose. Library preserves information, Directory ties it to people and relationships, and Spaces brings the relevant context into focus. Automations can use the same records and rules to carry approved work forward, while Check In and Afterlife extend the continuity plan when the owner is away or unable to respond. AI models and tools may change without taking the underlying records, permissions and history with them.

Three compact hero ideas remain intentionally brief because they are labels, not paragraph prose:

```text
Knows what changed and when
Can continue work you approved
Keeps track of what is allowed and why
```

Hero principle:

`BUILT TO CARRY YOUR PLAN FORWARD`

## Plain-English architecture teaching

Important architecture terms stay visible because they matter, but the page defines them through ordinary language and examples.

Examples include:

- `State` as Continuum's current picture of what is true now;
- `Authority` as permission to act;
- Directory relationship labels adding context without granting permission by themselves;
- Library versioning where an Automation can keep using version 3 while version 4 is being edited;
- Runtime as server-side work that can later wait, resume and retry after the browser closes;
- real elapsed time coming from server timestamps instead of an AI model guessing how long passed.

## Information / Library / Directory / Spaces distinction

The Information section teaches the relationship among the product surfaces in connected prose while preserving their separate roles:

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

The visible AI section now uses connected wording around the durable rule: when the AI model changes, the information, current State, permissions and server-side rules stay with Continuum.

A model can reason, write and use tools, while protected server rules remain the final permission check. A stronger model does not gain extra authority merely because it can reason better.

## Automations and Runtime direction

The Automation section still begins from normal human intent:

`Describe what should happen, then make the rules clear.`

Natural language remains the setup experience. Structured people, timing, approvals, limits, actions and fallback fields are what future Runtime can enforce on the server.

Runtime remains a later capability. Current Lab workflow definitions do not imply provider execution.

## Temporal identity

The page keeps the real-clock example because it teaches the architecture clearly:

```text
User says they are leaving for two minutes
→ user returns two seconds later
→ Continuum knows roughly two seconds elapsed
```

Consequential elapsed time comes from backend/server timestamps, so the AI does not have to stay open between events.

This direction applies to deadlines, waits, freshness, history, timezone intent, conversations, Goals, Signals and future Runtime.

## Afterlife positioning

Afterlife extends the same Continuum foundation into long-term continuity. The owner prepares people, information, instructions and permissions in advance, Check In records the trigger if the owner stops responding long enough, and future Runtime can follow the plan already in place.

Visible guardrail:

`Silence and urgency never create permission.`

Fallback actions must come from rules approved earlier.

## Writing rules

Visible `/doc/` copy should avoid:

- ellipses;
- em dashes;
- formulaic `it's not X, it's Y` phrasing;
- `not X but Y` phrasing;
- `rather than` constructions;
- generic AI-style intros;
- sequences of short `X does this. Y does that. Z does this.` sentences;
- excessive symmetry or perfectly mirrored sentence structures;
- fragment-heavy sales copy outside labels, diagrams and intentional UI microcopy;
- repeated abstract nouns when a normal word works;
- repeated explanations that add length without adding meaning.

Use connected plain-English paragraphs, varied sentence length, direct technical language, concrete examples and restrained emphasis.

## Protected structure and visuals

This pass keeps:

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

The main continuity/knowledge/time clarity layer remains:

- `assets/continuum-doc-knowledge-time.js`;
- `assets/continuum-doc-knowledge-time.css`.

The final visible voice pass is:

- `assets/continuum-doc-human-cadence.js`.

`assets/continuum-doc-i18n.js` performs direction preparation, loads the knowledge/time layer, then loads the human-cadence layer after it so the cadence pass sees the final rendered architecture copy.

Current markers:

```text
data-continuum-clarity="plain-english-v1"
data-continuum-human-cadence="ready"
```

Regression coverage:

- `tests/continuum-doc-continuity-positioning.test.js`;
- `tests/continuum-doc-clarity-smoke.test.js`;
- `.github/workflows/continuum-doc-clarity-validation.yml`.

The browser workflow explicitly rejects known stale punchy phrases after final rendering.

## Backend boundary

This copy pass changes no production backend claim and authorizes no migration, deployment, provider execution, Runtime activation, AI execution or new authority.

The current backend release sequence remains separate from `/doc/` presentation work.
