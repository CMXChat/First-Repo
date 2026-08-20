# Continuum `/doc/` Freeze - CURRENT

Date: 2026-08-20
Status: FROZEN after owner-authorized one-minute explanation and natural-voice pass

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

## August 20 final reader test

A real first-reader reaction showed that the page was still too hard to understand in about one minute. The product names were no longer overwhelming, but the opening had become so broad that it did not quickly explain why Continuum exists around AI.

The accepted fix uses this mental model:

`Think of AI as the brain and Continuum as the nervous system around it`

The analogy is followed immediately by literal explanation. AI can reason and help make decisions. Continuum is the durable private layer around it that carries life and work context across time, keeps track of change, remembers people and documents, enforces permission rules and is being built to keep approved processes going after the chat closes.

The opening then explains that a change can update what Continuum knows and the owner's existing rules can determine whether the next step is to act, wait, ask, contact someone or do nothing.

The Dead Man Switch is one example of the wider product. Everyday work, offline periods and later multi-step goals use the same foundation.

## Frozen opening

Hero kicker:

```text
Think of AI as the brain and Continuum as the nervous system around it
```

Hero lead:

```text
An AI model can reason, write and help make decisions. What it still needs around it is a reliable way to carry your life and work context across time, know what changed while you were away, remember the people and documents that matter, enforce your permission rules, and keep a process going after the chat closes. Continuum is that private layer.

It keeps the information, people, documents, current situation and history around the AI so a change can update what Continuum knows and the rules you set can decide what should happen next. That might mean acting, waiting, asking you, contacting someone or doing nothing. The Dead Man Switch is one example, and the same foundation can help with everyday work when you're asleep, busy or offline and later with bigger goals that take several steps. If you switch to a better AI later, the memory, context, permissions and history stay with Continuum.
```

The opening lead must stay free of internal surface and architecture names such as Library, Directory, Spaces, Automation, Runtime and Planner. Lowercase ordinary English such as `goals` is fine when it helps explain the whole idea.

Compact labels:

```text
Carries context across time
Keeps up with real changes
Works inside rules you set
```

Hero principle:

`BUILT TO CARRY YOUR PLAN FORWARD`

Supporting line:

`You can change the AI without losing the memory, permissions and history Continuum keeps.`

## Frozen Overview transition

Heading:

`From something changing to the next allowed step`

The first Overview paragraph explains the loop in normal language before architecture terms appear. A deadline, reply, check-in condition or approved outside change can update what Continuum knows. It checks the rules and permissions already set, and the next step may be to act, wait, ask or do nothing.

The paragraph then tells the reader that the pieces below give those jobs their technical names.

## Teaching order

Use:

```text
whole product
→ human behavior
→ architecture name
→ deeper technical detail
```

Once a term has been clearly explained, later sections may use State, Signal, Automation, Runtime, Authority, Planner, Change Plan, Goal and other architecture terms normally.

## Natural writing contract

Visible `/doc/` paragraph copy should avoid:

- ellipses;
- em dashes;
- formulaic `it's not X, it's Y` phrasing;
- `not X but Y` phrasing;
- `rather than` constructions;
- generic AI-style scene setting;
- stacked short declarative cadence;
- glossary-like component lists;
- excessive symmetry and mirrored sentence construction;
- unnecessary colons and semicolons in ordinary prose;
- repetitive `while` constructions;
- repetitive `can eventually` future framing;
- stiff uncontracted negatives when a contraction sounds natural;
- unexplained architecture terms at first meaningful use;
- abstract nouns piled together before their practical meaning is clear;
- repeated explanations that add length without adding meaning;
- fragment-heavy sales copy outside intentional labels and UI microcopy.

Do not mechanically ban a normal word just because it can be overused. One natural `while`, `but` or short sentence is fine. The problem is repetitive patterning.

Use connected plain-English paragraphs, varied sentence length, natural contractions and concrete situations.

## Product truth

The page still covers the complete Continuum direction:

- durable information and context;
- people and relationships;
- current State and meaningful change;
- triggered work;
- larger Goals;
- permissions and authority;
- Runtime across time;
- outside Connections and capabilities;
- AI inside server-enforced limits;
- Check In and continuity;
- Afterlife as one long-term continuity path;
- Control Center and causal history.

Future capability remains future capability. Goals, long-running Runtime, provider actions and autonomous AI execution are not production claims today.

## Translation and RTL

The new hero remains compatible with the existing translation layer. The brain/nervous-system analogy is followed by literal language so machine translation does not have to infer the product from an idiom alone.

Keep the existing Hebrew, Arabic, Persian, Urdu and Yiddish RTL rules, `dir="auto"` setup, mirrored navigation, directional arrows and mobile drawer behavior.

## Protected structure and visuals

Keep:

- eight stable sections;
- existing visual system;
- Check In as the first-class LIVE route;
- truthful Lab and future status labels;
- State, Sources, Observations, Signals and information-quality teaching;
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

- `assets/continuum-doc-knowledge-time.js`
- `assets/continuum-doc-knowledge-time.css`
- `assets/continuum-doc-human-cadence.js`
- `assets/continuum-doc-reader-first.js`

`assets/continuum-doc-i18n.js` loads the final reader layer as:

`/assets/continuum-doc-reader-first.js?v=20260820-4`

Current markers:

```text
data-continuum-clarity="plain-english-v1"
data-continuum-human-cadence="ready"
data-continuum-voice="natural-v3"
data-continuum-reader-first="ready"
data-continuum-product-story="balanced-v2"
```

## Regression guard

`tests/continuum-doc-continuity-positioning.test.js` protects the one-minute explanation, natural contractions, reader-first technical terminology and cache version.

`.github/workflows/continuum-doc-clarity-validation.yml` validates the final rendered desktop and 390x844 mobile page. It also rejects the previous broad hero and verifies that the new lead does not become a product glossary.

A workflow file existing does not prove a green run. Report CI as green only after an actual run or status confirms it.

## Backend boundary unchanged

This `/doc/` work changes no production backend claim and authorizes no migration, deployment, provider execution, general ingestion, Runtime activation, Goal execution, autonomous AI execution or new authority.

## Reopen rule

When a future context touches `/doc/`, read this file and `continuum-doc-positioning-CURRENT.md` first.

If the request does not fit a listed exception and the owner did not explicitly reopen `/doc/`, leave the page unchanged.
