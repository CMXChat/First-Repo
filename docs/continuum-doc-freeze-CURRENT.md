# Continuum `/doc/` Freeze - CURRENT

Date: 2026-08-20
Status: FROZEN after owner-authorized plain-English, natural-voice, contraction and reader-first terminology passes

## Freeze decision

`/doc/` remains the current Continuum product and architecture overview.

Future changes are allowed for:

- a real visual or functional bug;
- accessibility or contrast defects;
- security or privacy corrections;
- truthful LIVE / LAB / NEXT / LATER status updates;
- broken links or route changes;
- cache/version delivery corrections;
- an explicit owner request to reopen the document.

Routine cleanup should leave the page alone.

## August 20 owner-authorized reopening

The owner asked for the page to become easier to understand and less AI-like while preserving the existing design and architecture.

The work completed in this reopening now includes:

- plain-English explanations before dense architecture wording;
- removal of stacked short AI-like sentence cadence;
- fewer unnecessary colons, semicolons and overly balanced sentences;
- natural contractions where a person would normally use them;
- a reader-first terminology pass so product names and technical terms are explained when they first matter.

Canonical positioning companion

`docs/continuum-doc-positioning-CURRENT.md`

## Reader-first freeze rule

A new reader should not need prior Continuum knowledge to understand the first meaningful sentence that uses an important term.

Explain the human job first and introduce the real name in the same sentence or the next one. Once the term has been explained, later copy can use it normally and can become more technical.

This rule is deliberately narrow. Do not turn `/doc/` into a beginner tutorial and do not remove real architecture terms simply because they are technical.

Preferred teaching order

```text
plain behavior
→ real Continuum term
→ deeper architecture later
```

The page should stay useful to both nontechnical and technical readers.

## Current opening identity

Hero direction

```text
Your information, plans and permissions across time
```

The opening explains that Continuum can keep information, people, instructions and permissions over time, use that context today, continue approved work when the owner is away, and follow plans prepared for a time when the owner can't respond.

The next paragraph now explains the major names as they appear. Saved information lives in Library. Directory keeps track of people and organizations. A Space brings together the context for one part of life or work. Automations describe work already approved to continue under set rules. Check In is the live timer used to show the owner is still responding. Afterlife is the longer-term continuity area for plans that may be needed when the owner can't respond, including after death.

Compact hero labels remain intentionally concise.

```text
Knows what changed and when
Can continue work you approved
Keeps track of what is allowed and why
```

Hero principle

`BUILT TO CARRY YOUR PLAN FORWARD`

Continuity path

```text
WITH YOU
→ FOR YOU
→ WHEN AWAY
→ IF YOU CANNOT RESPOND
```

## First-use architecture explanations

The final visible copy now establishes these concepts before relying on the names:

- State is the current picture of what is true now.
- Runtime is the server-side part that can keep approved work moving after the app closes.
- Signals are meaningful changes noticed from approved sources.
- an Observation is what a source showed at a particular moment.
- Authority means permission to act.
- an Automation is a saved definition of work and the rules around it.
- Planner turns a normal-language setup request into proposed changes.
- a Change Plan is the proposed set of changes prepared for review.
- a Goal keeps an outcome, limits and approvals together across work that may take several steps.
- Connections link outside apps and tools.
- Control Center is the place where the owner can see what Continuum is doing in the background.

After those explanations, technical sections may use the real terms without repeating beginner definitions.

## Information direction

Library, Directory and Spaces remain distinct parts of the same information layer.

Knowledge intake can include:

```text
Paste + bulk text
Markdown + JSON
AI handoffs
Files + OCR / vision
Connected Sources
```

Review flow remains:

```text
CAPTURE → UNDERSTAND → REVIEW → INTEGRATE
```

The original source stays traceable and important findings remain reviewable before they become accepted long-term knowledge.

## AI and authority direction

An AI model can reason, write and use tools. Continuum keeps the information, current State, permissions and history around it, and the server decides what the model can actually see and do.

Authority is introduced as permission to act. Improved reasoning never creates extra permission by itself.

## Automations and Runtime direction

The Automation section keeps human intent first.

`Describe what should happen, then make the rules clear.`

An Automation is explained as a saved definition of work and its rules. Runtime is explained as the server-side part that can carry published work forward, including waits and retries when the app isn't open.

Current Lab workflow definitions still do not imply provider execution.

## Afterlife direction

Afterlife is for continuity plans that may need to outlast a long period when the owner can't respond, including plans for after death.

The owner chooses the people, information, instructions and permissions ahead of time. Check In supplies the trigger. Future Runtime can follow only the parts already authorized.

The LIVE and LATER copy should describe understandable user behavior and should not read like an engineering release note.

Visible guardrail

`Silence and urgency never create permission.`

## Writing contract

Visible `/doc/` paragraph copy should avoid:

- ellipses;
- em dashes;
- formulaic `it's not X, it's Y` phrasing;
- `not X but Y` phrasing;
- `rather than` constructions;
- generic AI-style intros;
- stacked `X does this. Y does that. Z does this.` cadence;
- excessive symmetry and mirrored sentence construction;
- unnecessary colons and semicolons in normal prose;
- repeated `while` constructions;
- repeated `can eventually` future framing;
- stiff uncontracted negatives when a normal contraction sounds better;
- unexplained product names or architecture terms at first meaningful use;
- dense architecture vocabulary when a simpler first explanation works;
- fragment-heavy sales copy outside intentional UI labels;
- repeated explanations that add length without adding meaning.

Use connected plain-English paragraphs, varied sentence length, calm technical language, natural contractions, concrete examples and restrained emphasis.

## Technical-depth rule

Do not remove technical depth after a term has been explained.

Diagrams, architecture sections, flows and technical callouts may continue to use State, Runtime, Signals, Authority, policy, provenance, Audit, Planner, Change Plan and other exact terms where they improve precision.

Accessibility should come from the first explanation, not from flattening the whole document.

## Protected structure and visuals

The clarity and reader-first passes keep:

- the eight stable sections;
- the existing visual system;
- Check In as the first-class LIVE route;
- current Lab/future truth labels;
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

## Final visible-copy layers

The continuity/knowledge/time clarity layer remains:

- `assets/continuum-doc-knowledge-time.js`;
- `assets/continuum-doc-knowledge-time.css`.

The natural-voice layer remains:

- `assets/continuum-doc-human-cadence.js`.

The final reader-first layer is:

- `assets/continuum-doc-reader-first.js`.

`assets/continuum-doc-i18n.js` loads those layers in that order.

Current loader targets

```text
/assets/continuum-doc-knowledge-time.js?v=20260820-1
/assets/continuum-doc-human-cadence.js?v=20260820-3
/assets/continuum-doc-reader-first.js?v=20260820-1
```

Current markers

```text
data-continuum-clarity="plain-english-v1"
data-continuum-human-cadence="ready"
data-continuum-voice="natural-v3"
data-continuum-reader-first="ready"
```

## Regression guard

`tests/continuum-doc-continuity-positioning.test.js` validates plain-English positioning, natural voice and first-use explanations.

`.github/workflows/continuum-doc-clarity-validation.yml` validates desktop and 390×844 mobile rendering and rejects known stale technical-first or AI-like wording after final rendering.

A workflow file existing does not prove a green run. Report CI as green only after an actual run/status confirms it.

## Backend boundary unchanged

This `/doc/` work changes no production backend claim and authorizes no migration, deployment, provider execution, general ingestion, Runtime activation, autonomous AI execution or new authority.

## Reopen rule

When a future context touches `/doc/`, read this file and `continuum-doc-positioning-CURRENT.md` first.

If the requested work does not fit a listed exception and the owner did not explicitly reopen `/doc/`, leave the page unchanged.
