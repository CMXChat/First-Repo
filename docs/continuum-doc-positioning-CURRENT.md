# Continuum `/doc/` Positioning - CURRENT

Date: 2026-08-20
Status: Canonical balanced whole-product positioning with plain-English, natural-voice and reader-first passes

Read with:

- `continuum-product-CURRENT.md`
- `continuum-doc-freeze-CURRENT.md`
- `continuum-knowledge-governance-time-CURRENT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-KNOWLEDGE-GOVERNANCE-AND-MEMORY-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-TEMPORAL-AWARENESS-BACKEND-CONTRACT.md`

## Current positioning

Continuum is a durable private system that keeps useful context, current conditions, decisions, permissions, approved work and history connected across time.

It should make sense first as one product. Internal names are introduced only after the reader understands the larger idea.

The four continuity conditions remain:

```text
WITH YOU
→ FOR YOU
→ WHEN AWAY
→ IF YOU CANNOT RESPOND
```

Afterlife remains one long-term continuity path inside Continuum. Spaces remains one focused context and briefing experience inside Continuum.

## Whole-product rule

The opening must explain Continuum before it explains its parts.

Do not open by walking through Library, Directory, Spaces, Automations, Runtime, Planner or Goals. That turns the introduction into a glossary and makes the reader assemble the product themselves.

The opening should instead establish the human idea:

- useful context should survive across time;
- changes should update what the system understands about the current situation;
- the owner should be able to decide what may happen next;
- approved work should be able to continue later without losing its limits or history;
- prepared continuity plans should remain usable when the owner cannot respond;
- AI models and tools may change without taking the durable context, permissions or history with them.

Only after that foundation is clear should the page introduce the product surfaces and architecture names.

## Current hero direction

Kicker:

`A private system for what matters now and what should happen next`

Opening lead:

> Continuum is a private system for keeping the parts of your life and work that matter connected over time. It remembers useful context, keeps track of what has changed and helps you decide what should happen next without starting from scratch every time.

Second paragraph:

> The same system is being built to carry approved work forward when you are away, whether the next step depends on a deadline, a reply, a change somewhere else or a longer goal. It can also hold plans for times when you cannot respond. AI can help with the reasoning, but the information, permissions, rules and history remain with Continuum as models and tools change.

The hero lead intentionally contains no Library, Directory, Spaces, Automation, Runtime, Planner or Goal terminology.

Compact labels remain concise because they are UI labels:

```text
Remembers what matters
Keeps up with changes
Carries approved work forward
```

Hero principle:

`BUILT TO CARRY YOUR PLAN FORWARD`

Supporting line:

`Your context, permissions and history stay together even as the tools around them change.`

## Reader-first architecture rule

A reader should understand the job before being asked to remember the architecture name.

Preferred teaching order:

```text
whole product
→ human behavior
→ real Continuum term
→ deeper architecture
```

Examples:

- Continuum keeps a current picture of the situation. That picture is `State`.
- A meaningful approved-source change can become a `Signal`.
- A saved piece of repeatable or triggered work is an `Automation`.
- The later server-side layer that can keep published work going after the app closes is `Runtime`.
- `Authority` is permission to act.
- `Planner` prepares proposed product changes as a `Change Plan`.
- A `Goal` holds a larger outcome, limits and required approvals when the route may change.
- `Connections` bring outside apps and tools into Continuum.
- `Control Center` is where the owner can inspect what Continuum is doing across time.

After a term has been explained once, the technical sections can use it normally.

## Triggered work direction

Triggered work should be explained through ordinary situations before architecture diagrams take over.

A deadline may arrive, someone may reply, Check In may reach a condition or an approved outside source may change. Any of those can make the next step ready. The server still checks the relevant rules and permissions before that step runs.

The deeper flow remains available through Sources, Observations, Signals, State, policy, authority and Runtime.

## Information direction

The Information section is where the named information surfaces become useful to introduce.

Library keeps documents, files, knowledge and versions. Directory keeps stable records for people and organizations. A Space can bring the relevant pieces into focus for one part of life or work.

Knowledge intake can accept pasted text, bulk input, Markdown, JSON, AI handoffs, files, OCR or vision and approved connected Sources.

Canonical review flow remains:

```text
CAPTURE → UNDERSTAND → REVIEW → INTEGRATE
```

The original source stays traceable and important findings remain reviewable before they become accepted long-term knowledge.

## AI and permissions direction

Navigation uses `AI + Permissions` for first-read clarity. The section still teaches `Authority` as the exact architecture term.

AI may reason, write and use tools. Continuum keeps the context, current situation, permissions and history around that work. The model gets only the context and capabilities allowed for the job, and the server remains the final permission check.

A stronger model never gains more authority merely because its reasoning improved.

## Automations and Runtime direction

The section begins from work a person understands.

`Describe the work normally, then make the important rules clear.`

An Automation is introduced as the way Continuum remembers repeatable or triggered work. It may start from time, a reply, a Check In condition or another approved change, then follow the limits and steps already set.

Runtime is explained from the user's point of view first. It is the later server-side layer that lets approved published work continue after the app closes and can handle time, replies, allowed retries, approved tools and recorded results.

Current Lab workflow definitions still do not imply real provider execution.

## Goals direction

Goals stay part of the whole product story without becoming hero terminology.

A Goal is introduced later as the larger outcome Continuum may work toward when success can require several approved steps and the route may change. It keeps the outcome, limits and required approvals together and can eventually coordinate work through Automations, Planner and Runtime once those capabilities are real.

Goals remain LATER until implementation status changes truthfully.

## Afterlife direction

Afterlife is for continuity plans that may need to last through a long period when the owner cannot respond, including plans for after death.

The owner chooses the people, information, instructions and permissions ahead of time. Check In provides the trigger. Future Runtime may follow only the parts already authorized.

Visible guardrail:

`Silence and urgency never create permission.`

## Natural writing rule

Visible `/doc/` paragraph copy should avoid the patterns the owner has repeatedly identified as AI-like:

- ellipses and em dashes;
- formulaic `it's not X, it's Y` wording;
- `not X but Y` wording;
- `rather than` constructions;
- generic scene-setting intros;
- stacked `X does this. Y does that. Z does this.` sentence sequences;
- paragraphs that read like a disguised glossary;
- excessive symmetry or perfectly mirrored sentence structures;
- repeated short declarative sentences with the same rhythm;
- unnecessary colons or semicolons in normal prose;
- repeated `while` constructions;
- repeated `can eventually` future framing;
- stiff uncontracted negatives where normal speech would contract them;
- abstract nouns piled together before the reader knows why they matter;
- repeated explanations that add length without adding meaning;
- sales-copy fragments outside intentional labels and interface microcopy.

Use connected plain-English paragraphs, varied sentence length, calm technical language, natural contractions and concrete situations. Let one thought lead into the next instead of resetting the sentence pattern for every concept.

## Protected structure and visuals

This pass keeps:

- the eight-section reading path;
- the existing visual language;
- Check In as the first-class LIVE route;
- truthful LIVE / LAB / NEXT / LATER labels;
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

The continuity, knowledge and time layer remains:

- `assets/continuum-doc-knowledge-time.js`;
- `assets/continuum-doc-knowledge-time.css`.

The natural-voice layer remains:

- `assets/continuum-doc-human-cadence.js`.

The final reader and whole-product story layer is:

- `assets/continuum-doc-reader-first.js`.

`assets/continuum-doc-i18n.js` loads those layers in that order.

Current markers:

```text
data-continuum-clarity="plain-english-v1"
data-continuum-human-cadence="ready"
data-continuum-voice="natural-v3"
data-continuum-reader-first="ready"
data-continuum-product-story="balanced-v2"
```

Regression coverage:

- `tests/continuum-doc-continuity-positioning.test.js`;
- `tests/continuum-doc-clarity-smoke.test.js`;
- `.github/workflows/continuum-doc-clarity-validation.yml`.

The browser validation explicitly guards the final hero lead against becoming a Library, Directory, Spaces, Automation, Runtime, Planner or Goal glossary again.

## Backend boundary

This copy pass changes no production backend claim and authorizes no migration, deployment, provider execution, Runtime activation, Goal execution, AI execution or new authority.

The current backend release sequence remains separate from `/doc/` presentation work.
