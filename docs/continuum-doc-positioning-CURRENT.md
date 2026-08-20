# Continuum `/doc/` Positioning - CURRENT

Date: 2026-08-20
Status: Canonical continuity-first positioning with plain-English, natural-voice and reader-first terminology passes

Read with:

- `continuum-product-CURRENT.md`
- `continuum-doc-freeze-CURRENT.md`
- `continuum-knowledge-governance-time-CURRENT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-KNOWLEDGE-GOVERNANCE-AND-MEMORY-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-TEMPORAL-AWARENESS-BACKEND-CONTRACT.md`

## Current positioning

Continuum is a durable private operating layer for information, people, plans, permissions, current State and history across time.

The opening should make four conditions understandable early.

```text
WITH YOU
→ FOR YOU
→ WHEN AWAY
→ IF YOU CANNOT RESPOND
```

Afterlife remains one long-term continuity path inside the wider product. Spaces remains a focused context and briefing experience inside Continuum.

## Core teaching rule

A reader shouldn't need prior Continuum knowledge to understand a sentence.

At the first meaningful use of an important product or architecture term, explain the human job first and introduce the real name in the same sentence or the next one. Once the term has been earned, later sections can use it normally and can become more technical.

This keeps the page useful to nontechnical readers without turning it into a beginner tutorial or stripping out the architecture that technical readers care about.

The preferred pattern is:

```text
plain behavior
→ real Continuum term
→ deeper architecture later
```

Do not add a glossary dump to the opening and do not keep re-explaining a term after the reader already knows it.

## Current hero direction

Kicker

`Your information, plans and permissions across time`

Opening lead

> Continuum keeps the information, people, instructions and permissions you want to carry with you over time. It can help you use that context today, continue work you have approved when you are away, and follow plans you prepared for a time when you can't respond.

The next paragraph introduces the major product names through what they do. Library is where saved information lives. Directory keeps track of the people and organizations around it. A Space brings together the context needed for one part of life or work. Automations describe work already approved to continue under set rules. Check In is the live timer used to show the owner is still responding. Afterlife is the longer-term continuity area for plans that may be needed when the owner can't respond, including after death.

AI models and tools may change without taking the underlying records, permissions or history with them.

Compact hero labels remain intentionally brief because they are labels.

```text
Knows what changed and when
Can continue work you approved
Keeps track of what is allowed and why
```

Hero principle

`BUILT TO CARRY YOUR PLAN FORWARD`

## Reader-first architecture examples

Important architecture terms stay visible because they matter. Their first meaningful use now explains them in ordinary language.

- `State` is Continuum's current picture of what is true now.
- `Runtime` is the server-side part that can keep approved work moving after the app closes.
- `Signals` are meaningful changes noticed from approved sources.
- an `Observation` is what an approved source showed at a particular moment.
- `Authority` means permission to act.
- an `Automation` is a saved definition of work and the rules around it.
- `Planner` can turn a normal-language setup request into proposed changes.
- a `Change Plan` is the proposed set of changes Planner prepares for review.
- a `Goal` keeps an outcome, limits and approvals coherent when the work may take several steps and the route can change.
- `Connections` link outside apps and tools into Continuum.
- `Control Center` is the owner-facing place for seeing what Continuum is doing in the background.

The page can use those terms more directly after they have been explained once.

## Information / Library / Directory / Spaces direction

Library, Directory and Spaces remain separate product surfaces working from connected context.

Library keeps documents, files, knowledge and version history. Directory gives people and organizations stable records. A Space pulls the relevant pieces together for one focused part of life or work.

Knowledge intake can accept pasted text, bulk input, Markdown, JSON, AI handoffs, files, OCR/vision and approved connected Sources.

Canonical visible flow remains

```text
CAPTURE → UNDERSTAND → REVIEW → INTEGRATE
```

The original source stays traceable and important findings remain reviewable before they become accepted long-term knowledge.

## AI and authority direction

An AI model can reason, write and use tools. Continuum keeps the information, current State, permissions and history around it, and the server decides what the model is actually allowed to see and do.

`Authority` is introduced as permission to act. Improved reasoning never creates extra permission by itself.

The server remains the final permission check.

## Automations and Runtime direction

The Automation section still begins from normal human intent.

`Describe what should happen, then make the rules clear.`

An Automation is explained as a saved definition of work and its rules. Runtime is then explained as the server-side part that can carry published work forward, including waits and retries when the app isn't open.

Current Lab workflow definitions still do not imply provider execution.

## Signals and current State direction

The page should not assume a reader understands `Source → Observation → Signal → State` just because the diagram is accurate.

The prose should explain that Continuum can save what an approved source showed at a particular moment as an Observation. A meaningful change can become a Signal and update the part of State that matters now.

The exact technical flow remains visible for readers who want the architecture.

## Planner and Goals direction

Planner should first be understood as the part that can prepare proposed changes from a normal-language setup request. The proposed set is called a Change Plan.

A Goal should first be understood as a way to keep an outcome, limits and required approvals in place when the work may take several steps and conditions can change.

After those first explanations, Planner, Change Plan and Goal can be used as normal architecture terms.

## Afterlife positioning

Afterlife is for continuity plans that may need to outlast a long period when the owner can't respond, including plans for after death.

The owner chooses the people, information, instructions and permissions ahead of time. Check In supplies the trigger. Future Runtime can follow only the parts of the plan already authorized.

Visible guardrail

`Silence and urgency never create permission.`

The LIVE and LATER copy should describe what a person can understand today instead of reading like an engineering changelog.

## Technical depth balance

Do not remove real terms such as State, Runtime, Signals, Authority, Planner, Change Plan, Audit, policy or provenance just to make the page easier.

Instead:

- explain the job once in normal language;
- keep the real term visible;
- let diagrams and architecture sections carry the deeper vocabulary;
- avoid repeating beginner explanations after the term is established;
- preserve exact technical claims where precision matters.

A technical reader should still be able to see the real architecture. A nontechnical reader should not have to decode that architecture before understanding the product.

## Writing rules

Visible `/doc/` paragraph copy should avoid:

- ellipses;
- em dashes;
- formulaic `it's not X, it's Y` phrasing;
- `not X but Y` phrasing;
- `rather than` constructions;
- generic AI-style intros;
- stacked `X does this. Y does that. Z does this.` cadence;
- excessive symmetry or perfectly mirrored sentence structures;
- unnecessary colons and semicolons in normal prose;
- repeated `while` sentence construction;
- repeated `can eventually` future framing;
- stiff uncontracted negatives when a natural contraction sounds better;
- dense architecture vocabulary before the reader has been given its meaning;
- fragment-heavy sales copy outside labels, diagrams and intentional UI microcopy;
- repeated explanations that add length without adding meaning.

Colons, semicolons and compact fragments remain fine in code, data, technical notation, labels and diagrams when they genuinely help.

Use connected plain-English paragraphs, varied sentence length, direct technical language, natural contractions, concrete examples and restrained emphasis.

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

## Implementation layers

The continuity/knowledge/time clarity layer remains:

- `assets/continuum-doc-knowledge-time.js`;
- `assets/continuum-doc-knowledge-time.css`.

The natural-voice layer remains:

- `assets/continuum-doc-human-cadence.js`.

The final reader-comprehension layer is:

- `assets/continuum-doc-reader-first.js`.

`assets/continuum-doc-i18n.js` loads the knowledge/time layer, then the natural-voice layer, then the reader-first layer so the final pass sees the fully rendered document.

Current markers

```text
data-continuum-clarity="plain-english-v1"
data-continuum-human-cadence="ready"
data-continuum-voice="natural-v3"
data-continuum-reader-first="ready"
```

Regression coverage:

- `tests/continuum-doc-continuity-positioning.test.js`;
- `tests/continuum-doc-clarity-smoke.test.js`;
- `.github/workflows/continuum-doc-clarity-validation.yml`.

## Backend boundary

This copy pass changes no production backend claim and authorizes no migration, deployment, provider execution, Runtime activation, AI execution or new authority.

The current backend release sequence remains separate from `/doc/` presentation work.
