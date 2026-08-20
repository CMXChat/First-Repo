# Continuum `/doc/` Freeze - CURRENT

Date: 2026-08-20
Status: FROZEN after owner-authorized whole-product balance and final natural-voice pass

## Freeze decision

`/doc/` remains the current Continuum product and architecture overview.

Future changes are allowed for:

- a real visual or functional bug;
- accessibility or contrast defects;
- security or privacy corrections;
- truthful LIVE / LAB / NEXT / LATER status updates;
- broken links or route changes;
- cache or delivery corrections;
- an explicit owner request to reopen the document.

Routine cleanup should leave the page alone.

## August 20 final reopening

The owner asked for one final balance pass after the prior clarity work started explaining internal product names too early.

The resulting rule is now frozen: explain Continuum as one coherent product first, then introduce the parts only after the reader understands the larger idea.

The final pass also rechecked the visible copy for the AI-like patterns already rejected in earlier rounds, including repetitive short declarative cadence, disguised glossary paragraphs, excessive symmetry, generic transitions, canned contrast phrasing and unnecessary architecture vocabulary before its meaning is clear.

Canonical positioning companion:

`docs/continuum-doc-positioning-CURRENT.md`

## Frozen opening

Hero kicker:

```text
A private system for what matters now and what should happen next
```

Hero lead:

```text
Continuum is a private system for keeping the parts of your life and work that matter connected over time. It remembers useful context, keeps track of what has changed and helps you decide what should happen next without starting from scratch every time.

The same system is being built to carry approved work forward when you are away, whether the next step depends on a deadline, a reply, a change somewhere else or a longer goal. It can also hold plans for times when you cannot respond. AI can help with the reasoning, but the information, permissions, rules and history remain with Continuum as models and tools change.
```

The opening lead must not become a list of internal product names. In particular, Library, Directory, Spaces, Automation, Runtime, Planner and Goal terminology should stay out of the hero explanation.

Compact labels remain:

```text
Remembers what matters
Keeps up with changes
Carries approved work forward
```

Hero principle remains:

`BUILT TO CARRY YOUR PLAN FORWARD`

Supporting line:

`Your context, permissions and history stay together even as the tools around them change.`

Continuity path remains:

```text
WITH YOU
→ FOR YOU
→ WHEN AWAY
→ IF YOU CANNOT RESPOND
```

## Whole-product rule

Continuum should read as one durable private system for context, change, decisions, approved work, permissions and continuity across time.

Do not let a future clarity pass narrow it into storage, a briefing app, a workflow builder or an Afterlife product alone. Also do not solve that problem by listing every component in the opening.

The reader should understand the product before learning the product map.

## Reader-first rule

Use this order:

```text
whole product
→ human behavior
→ architecture name
→ deeper technical detail
```

Examples:

- current situation first, then `State`;
- meaningful change first, then `Signal`;
- repeatable or triggered work first, then `Automation`;
- work continuing after the app closes first, then `Runtime`;
- permission to act first, then `Authority`;
- proposed product changes first, then `Planner` and `Change Plan`;
- a larger outcome across several steps first, then `Goal`.

After the first explanation, technical sections may use the real terms normally.

## Natural writing contract

Visible `/doc/` paragraph copy should avoid:

- ellipses;
- em dashes;
- formulaic `it's not X, it's Y` phrasing;
- `not X but Y` phrasing;
- `rather than` constructions;
- generic AI-style scene setting;
- stacked `X does this. Y does that. Z does this.` cadence;
- glossary-like paragraphs that make the reader assemble the product;
- excessive symmetry and mirrored sentence construction;
- repeated short sentences with the same rhythm;
- unnecessary colons and semicolons in ordinary prose;
- repeated `while` constructions;
- repeated `can eventually` future framing;
- stiff uncontracted negatives when normal speech would contract them;
- unexplained product or architecture names at first meaningful use;
- abstract nouns piled together before their practical meaning is clear;
- repeated explanations that add length without adding meaning;
- fragment-heavy sales copy outside intentional labels and UI microcopy.

Use connected plain-English paragraphs, varied sentence length, calm technical language, natural contractions and concrete examples. The prose should feel written by someone explaining the product to another person, not generated from a component inventory.

## Product and implementation truth

The final story still preserves the full product direction:

- current context and durable information;
- people and relationships;
- triggered work;
- longer Goals;
- permissions and authority;
- Runtime across time;
- outside Connections and capabilities;
- AI inside server-enforced limits;
- Check In and continuity;
- Afterlife as a long-term continuity path;
- Control Center and causal history.

Future capability remains future capability. Goals, long-running Runtime, provider actions and autonomous AI execution are not production claims today.

## Protected structure and visuals

The final pass keeps:

- the eight stable sections;
- the existing visual system;
- Check In as the first-class LIVE route;
- truthful Lab and future status labels;
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
- RTL compatibility;
- print coverage.

## Final visible-copy layers

The continuity, knowledge and time layer remains:

- `assets/continuum-doc-knowledge-time.js`;
- `assets/continuum-doc-knowledge-time.css`.

The natural-voice layer remains:

- `assets/continuum-doc-human-cadence.js`.

The final reader and whole-product story layer is:

- `assets/continuum-doc-reader-first.js`.

`assets/continuum-doc-i18n.js` loads those layers in that order.

Current loader targets:

```text
/assets/continuum-doc-knowledge-time.js?v=20260820-1
/assets/continuum-doc-human-cadence.js?v=20260820-3
/assets/continuum-doc-reader-first.js?v=20260820-3
```

Current markers:

```text
data-continuum-clarity="plain-english-v1"
data-continuum-human-cadence="ready"
data-continuum-voice="natural-v3"
data-continuum-reader-first="ready"
data-continuum-product-story="balanced-v2"
```

## Regression guard

`tests/continuum-doc-continuity-positioning.test.js` validates the final whole-product story and writing rules.

`.github/workflows/continuum-doc-clarity-validation.yml` validates desktop and 390×844 mobile rendering and rejects stale narrow, technical-first or AI-like copy. It also checks that the rendered hero lead does not turn back into a component glossary.

A workflow file existing does not prove a green run. Report CI as green only after an actual run or status confirms it.

## Backend boundary unchanged

This `/doc/` work changes no production backend claim and authorizes no migration, deployment, provider execution, general ingestion, Runtime activation, Goal execution, autonomous AI execution or new authority.

## Reopen rule

When a future context touches `/doc/`, read this file and `continuum-doc-positioning-CURRENT.md` first.

If the request does not fit a listed exception and the owner did not explicitly reopen `/doc/`, leave the page unchanged.
