# Continuum `/doc/` Positioning - CURRENT

Date: 2026-08-20
Status: Canonical product-complete positioning with plain-English, natural-voice and reader-first terminology passes

Read with:

- `continuum-product-CURRENT.md`
- `continuum-doc-freeze-CURRENT.md`
- `continuum-knowledge-governance-time-CURRENT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-KNOWLEDGE-GOVERNANCE-AND-MEMORY-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-TEMPORAL-AWARENESS-BACKEND-CONTRACT.md`

## Current positioning

Continuum is a durable private operating layer for information, people, workflows, goals, permissions, current State and history across time.

The opening should make four conditions understandable early.

```text
WITH YOU
→ FOR YOU
→ WHEN AWAY
→ IF YOU CANNOT RESPOND
```

Afterlife remains one long-term continuity path inside the wider product. Spaces remains a focused context and briefing experience inside Continuum.

## Product completeness rule

Clarity must never make Continuum sound like storage, a briefing app or a continuity product alone.

The opening should naturally show that the same foundation supports current context, triggered workflows, longer Goals, explicit permission and continuity across time. Goals and long-running Runtime are still future architecture and must not be written as production capabilities today.

A reader should understand that Continuum can be useful for what is happening now and is being built to keep approved work moving when something changes, pursue longer outcomes through multiple steps and carry prepared plans through periods when the owner is unavailable.

## Core teaching rule

A reader shouldn't need prior Continuum knowledge to understand a sentence.

At the first meaningful use of an important product or architecture term, explain the human job first and introduce the real name in the same sentence or the next one. Once the term has been earned, later sections can use it normally and become more technical.

This keeps the page useful to nontechnical readers without turning it into a beginner tutorial or removing the architecture technical readers care about.

The preferred pattern is

```text
plain behavior
→ real Continuum term
→ deeper architecture later
```

Do not add a glossary dump to the opening and do not keep re-explaining a term after the reader already knows it.

## Current hero direction

Kicker

`Your information, workflows and goals across time`

Opening lead

> Continuum keeps the information, people, instructions and permissions you want to carry with you over time. It can help with what you're doing now, and the same foundation is being built for workflows that react to changes and longer goals that may take several steps.

The next paragraph introduces one important workflow idea instead of listing the whole product map. An Automation is a saved workflow with something that starts it, conditions to check and rules for what it may do next. Check In is the live timer used to show the owner is still responding. Afterlife holds continuity plans for times when the owner can't respond, including after death.

AI models and tools may change without taking the underlying records, permissions or history with them.

Compact hero labels remain intentionally brief because they are labels.

```text
Keeps the right context current
Built for workflows + longer goals
Acts inside rules you set
```

Hero principle

`BUILT TO CARRY YOUR PLAN FORWARD`

## Triggered work direction

The page should make triggered work understandable without making a reader decode an event system.

Ordinary examples include a deadline arriving, a reply coming in, Check In reaching a condition or an approved outside source changing.

Any of those can make the next step ready. Continuum still checks the relevant rules and permissions before anything runs.

The deeper architecture remains available through Signals, State, policy, authority and Runtime.

## Reader-first architecture examples

Important architecture terms stay visible because they matter. Their first meaningful use explains them in ordinary language.

- `State` is Continuum's current picture of what is true now.
- `Runtime` is the background execution layer that can later keep approved work alive on the server after the app closes.
- `Signals` are meaningful changes noticed from approved sources.
- an `Observation` is what an approved source showed at a particular moment.
- `Authority` means permission to act.
- an `Automation` is a saved workflow with a start, conditions, limits and allowed actions.
- `Planner` can turn a normal-language setup request into proposed changes.
- a `Change Plan` is the proposed set of changes Planner prepares for review.
- a `Goal` keeps a longer outcome, limits and approvals together when the work may take several steps and the route can change.
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

## AI and permissions direction

The visible navigation uses `AI + Permissions` so a first-time reader understands the section before learning the architecture term `Authority`.

An AI model can reason, write and use tools. Continuum keeps the information, current State, permissions and history around it, and the server decides what the model is actually allowed to see and do.

`Authority` is introduced as permission to act. Improved reasoning never creates extra permission by itself.

The server remains the final permission check.

## Automations and Runtime direction

The Automation section still begins from normal human intent.

`Describe what should happen, then make the rules clear.`

An Automation is explained as a saved workflow with something that starts it, conditions to check and rules for what it may do. Runtime is explained from the user's point of view first. It is what can later keep published work alive in the background after the app closes. The deeper copy then explains that it runs on the server and can handle waits, allowed retries, replies, approved tools and recorded results.

Current Lab workflow definitions still do not imply provider execution.

## Signals and current State direction

The page should not assume a reader understands `Source → Observation → Signal → State` just because the diagram is accurate.

The prose explains that Continuum can save what an approved source showed at a particular moment as an Observation. A meaningful change can become a Signal and update the part of State that matters now.

The Automation section then connects this to action in ordinary language. A change can make the next step ready, but rules and permissions still decide whether the next action can run.

The exact technical flow remains visible for readers who want the architecture.

## Planner and Goals direction

Planner should first be understood as the part that can prepare proposed changes from a normal-language setup request. The proposed set is called a Change Plan.

A Goal should first be understood as something Continuum can later work toward over several steps even when the route changes. It keeps the outcome, limits and required approvals together and may use multiple Automations or tasks as conditions change.

After those first explanations, Planner, Change Plan and Goal can be used as normal architecture terms.

Goals remain LATER. The page must keep that implementation boundary clear.

## Product map direction

The product-map paragraph should show more than information storage and continuity without forcing another node into the visual.

Directory and Library provide people and information. Spaces focus relevant context. Automations handle saved workflows. Goals can hold a larger outcome when the route may change. Connections link outside tools. Runtime can later keep published work moving. Signals update what Continuum knows is happening now. AI works only with the context and tools it is allowed to use.

The existing visual structure remains unchanged.

## Afterlife positioning

Afterlife is for continuity plans that may need to outlast a long period when the owner can't respond, including plans for after death.

The owner chooses the people, information, instructions and permissions ahead of time. Check In supplies the trigger. Future Runtime can follow only the parts of the plan already authorized.

Visible guardrail

`Silence and urgency never create permission.`

The LIVE and LATER copy should describe what a person can understand today instead of reading like an engineering changelog.

## Technical depth balance

Do not remove real terms such as State, Runtime, Signals, Authority, Planner, Change Plan, Audit, policy or provenance just to make the page easier.

Explain the job once in normal language, keep the real term visible and let diagrams and architecture sections carry the deeper vocabulary. Avoid repeating beginner explanations after a term is established and preserve exact technical claims where precision matters.

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

The final reader and product-story layer is:

- `assets/continuum-doc-reader-first.js`.

`assets/continuum-doc-i18n.js` loads the knowledge/time layer, then the natural-voice layer, then the reader-first layer so the final pass sees the fully rendered document.

Current markers

```text
data-continuum-clarity="plain-english-v1"
data-continuum-human-cadence="ready"
data-continuum-voice="natural-v3"
data-continuum-reader-first="ready"
data-continuum-product-story="complete-v1"
```

Regression coverage:

- `tests/continuum-doc-continuity-positioning.test.js`;
- `tests/continuum-doc-clarity-smoke.test.js`;
- `.github/workflows/continuum-doc-clarity-validation.yml`.

## Backend boundary

This copy pass changes no production backend claim and authorizes no migration, deployment, provider execution, Runtime activation, Goal execution, AI execution or new authority.

The current backend release sequence remains separate from `/doc/` presentation work.
