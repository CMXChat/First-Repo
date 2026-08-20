# Continuum `/doc/` Freeze - CURRENT

Date: 2026-08-20
Status: FROZEN after owner-authorized one-minute explanation and final natural-voice polish

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

## August 20 reader test

A real first-reader reaction showed that the page was still too hard to understand in about one minute. The accepted fix uses this mental model:

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
AI can reason, write and help make decisions, but by itself it doesn't reliably remember your life and work, know what changed while you were away, keep track of the people and documents that matter, respect the permission rules you set or keep a process going after the chat closes. Continuum is the private layer around the AI that keeps those things connected over time.

When something changes, Continuum can update what it knows and use the rules you already set to decide what should happen next. That might mean acting, waiting, asking you, contacting someone or doing nothing. The Dead Man Switch is one example of that, and the same setup is useful every day when you're asleep, busy, offline, waiting on someone or working toward something that takes several steps. If you switch to a better AI later, the memory, context, permissions and history stay with Continuum.
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

The first Overview paragraph now begins with `From there the flow is simple.` It explains a deadline, reply, check-in condition or approved outside change in normal language, then shows that Continuum updates what it knows, checks the rules and decides whether the next step is to act, wait, ask or do nothing.

The technical names come after the behavior is already understandable.

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

The final voice pass also removed phrases that sounded too composed or teacher-like, including `That basic idea becomes a loop`, `By this point the parts have names`, and abstract future wording about the product needing to grow. The replacement copy should sound like a person explaining the idea without losing the real technical meaning.

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

The hero remains compatible with the existing translation layer. The brain/nervous-system analogy is followed by literal language so machine translation does not have to infer the product from an idiom alone.

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
- `assets/continuum-doc-final-voice.js`

`assets/continuum-doc-i18n.js` loads the final voice layer after the reader-first layer.

Current loader targets include:

```text
/assets/continuum-doc-reader-first.js?v=20260820-4
/assets/continuum-doc-final-voice.js?v=20260820-1
```

Current final markers:

```text
data-continuum-reader-first="ready"
data-continuum-final-voice="ready"
data-continuum-voice="natural-v4"
```

## Regression guard

`tests/continuum-doc-continuity-positioning.test.js` protects the one-minute explanation and reader-first terminology.

`tests/continuum-doc-final-voice.test.js` protects the last visible voice layer and rejects the specific AI-like wording removed in the final polish.

`.github/workflows/continuum-doc-clarity-validation.yml` validates the final rendered desktop and 390x844 mobile page, including the final voice marker and current hero wording.

A workflow file existing does not prove a green run. Report CI as green only after an actual run or status confirms it.

## Backend boundary unchanged

This `/doc/` work changes no production backend claim and authorizes no migration, deployment, provider execution, general ingestion, Runtime activation, Goal execution, autonomous AI execution or new authority.

## Reopen rule

When a future context touches `/doc/`, read this file and `continuum-doc-positioning-CURRENT.md` first.

If the request does not fit a listed exception and the owner did not explicitly reopen `/doc/`, leave the page unchanged.
