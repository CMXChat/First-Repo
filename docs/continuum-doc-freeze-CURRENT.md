# Continuum `/doc/` Freeze - CURRENT

Date: 2026-08-20
Status: FROZEN after owner-authorized plain-English, natural-voice, reader-first and product-completeness passes

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

The completed work now includes plain-English first explanations, natural contractions, removal of common AI-writing cadence, reader-first technical terminology and a final product-completeness pass.

That last pass corrects an important risk from the earlier simplification work. Clarity must not make Continuum sound like storage or continuity alone. The public story now includes current context, triggered workflows, longer Goals, explicit permission and continuity across time without pretending future Runtime or Goal execution is live today.

Canonical positioning companion

`docs/continuum-doc-positioning-CURRENT.md`

## Product-complete opening

Hero direction

```text
Your information, workflows and goals across time
```

The opening says that Continuum keeps information, people, instructions and permissions over time and that the same foundation is being built for workflows that react to changes and longer goals that may take several steps.

An Automation is introduced as a saved workflow with something that starts it, conditions to check and rules for what it may do next. Check In remains the live timer used to show the owner is still responding. Afterlife holds continuity plans for times when the owner can't respond, including after death.

Compact hero labels remain intentionally concise.

```text
Keeps the right context current
Built for workflows + longer goals
Acts inside rules you set
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

## Product completeness rule

The opening and early sections should make the whole product understandable without listing every component.

Continuum should read as a foundation for current context, triggered workflows, longer outcomes, permissions and continuity. Goals, long-running Runtime, provider actions and autonomous AI work remain future capabilities until their status changes truthfully.

Do not let a future clarity pass narrow the story back to information, plans and continuity alone.

## Reader-first rule

A new reader should not need prior Continuum knowledge to understand the first meaningful sentence that uses an important term.

Explain the human job first and introduce the real name in the same sentence or the next one. Once the term has been explained, later copy can use it normally and become more technical.

Preferred teaching order

```text
plain behavior
→ real Continuum term
→ deeper architecture later
```

Do not turn `/doc/` into a beginner tutorial and do not remove real architecture terms simply because they are technical.

## Triggered work rule

Triggered behavior should be understandable through normal examples before the architecture flow is expected to carry the explanation.

A deadline can arrive, a reply can come in, Check In can reach a condition or an approved outside source can change. Any of those can make the next step ready. The server still checks the relevant rules and permissions before anything runs.

The deeper flow through Signals, State, policy, authority and Runtime remains intact.

## First-use architecture explanations

The final visible copy establishes these concepts before relying on their names:

- State is the current picture of what is true now.
- Runtime is what can later keep published work alive in the background after the app closes, with the deeper copy explaining that it runs on the server.
- Signals are meaningful changes noticed from approved sources.
- an Observation is what a source showed at a particular moment.
- Authority means permission to act.
- an Automation is a saved workflow with a start, conditions, limits and allowed actions.
- Planner turns a normal-language setup request into proposed changes.
- a Change Plan is the proposed set of changes prepared for review.
- a Goal keeps a longer outcome, limits and approvals together across work that may take several steps and change route.
- Connections link outside apps and tools.
- Control Center is the place where the owner can see what Continuum is doing in the background.

After those explanations, technical sections may use the real terms without repeating beginner definitions.

## Navigation direction

The reader-facing navigation uses `AI + Permissions` because permission is immediately understandable. The section still introduces and preserves `Authority` as the exact architecture term.

## Automations and Runtime direction

The Automation section keeps human intent first.

`Describe what should happen, then make the rules clear.`

An Automation is a saved workflow with something that starts it, conditions to check and rules for what it may do. Runtime is explained from the user's point of view first as background work that can later continue after the app closes. The technical explanation then makes clear that it runs on the server and can handle waits, allowed retries, replies, tools and recorded results.

Current Lab workflow definitions still do not imply provider execution.

## Goals direction

Goals are part of the product story and should not disappear from the opening or product map simply because they are later architecture.

A Goal is introduced as something Continuum can later work toward over several steps even when the route changes. It keeps the outcome, limits and approvals together and may use multiple Automations or tasks.

Goals remain LATER until the implementation status changes.

## Afterlife direction

Afterlife is for continuity plans that may need to outlast a long period when the owner can't respond, including plans for after death.

The owner chooses the people, information, instructions and permissions ahead of time. Check In supplies the trigger. Future Runtime can follow only the parts already authorized.

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

Accessibility comes from the first explanation, not from flattening the whole document.

## Protected structure and visuals

The final pass keeps:

- the eight stable sections;
- the existing visual system;
- Check In as the first-class LIVE route;
- current Lab/future truth labels;
- State, Sources, Observations, Signals and information quality;
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

The final reader and product-story layer is:

- `assets/continuum-doc-reader-first.js`.

`assets/continuum-doc-i18n.js` loads those layers in that order.

Current loader targets

```text
/assets/continuum-doc-knowledge-time.js?v=20260820-1
/assets/continuum-doc-human-cadence.js?v=20260820-3
/assets/continuum-doc-reader-first.js?v=20260820-2
```

Current markers

```text
data-continuum-clarity="plain-english-v1"
data-continuum-human-cadence="ready"
data-continuum-voice="natural-v3"
data-continuum-reader-first="ready"
data-continuum-product-story="complete-v1"
```

## Regression guard

`tests/continuum-doc-continuity-positioning.test.js` validates plain-English positioning, natural voice, reader-first explanations and product completeness.

`.github/workflows/continuum-doc-clarity-validation.yml` validates desktop and 390×844 mobile rendering and rejects known stale narrow, technical-first or AI-like wording after final rendering.

A workflow file existing does not prove a green run. Report CI as green only after an actual run/status confirms it.

## Backend boundary unchanged

This `/doc/` work changes no production backend claim and authorizes no migration, deployment, provider execution, general ingestion, Runtime activation, Goal execution, autonomous AI execution or new authority.

## Reopen rule

When a future context touches `/doc/`, read this file and `continuum-doc-positioning-CURRENT.md` first.

If the requested work does not fit a listed exception and the owner did not explicitly reopen `/doc/`, leave the page unchanged.
