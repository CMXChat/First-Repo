# Continuum `/doc/` Positioning - CURRENT

Date: 2026-08-21
Status: Canonical one-minute product explanation with reader-first technical depth

Read with:

- `continuum-product-CURRENT.md`
- `continuum-doc-freeze-CURRENT.md`
- `continuum-knowledge-governance-time-CURRENT.md`
- `continuum-durable-identity-CURRENT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-KNOWLEDGE-GOVERNANCE-AND-MEMORY-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-TEMPORAL-AWARENESS-BACKEND-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-DURABLE-IDENTITY-AND-PERSONA-FRAMEWORK-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-IDENTITY-PORTABILITY-IMPORT-AND-MODEL-COMPATIBILITY-CONTRACT.md`

## Current positioning

Continuum is the durable private system around changing AI models and tools. It keeps the context, current situation, permissions, approved work and history that should survive across time.

A first-time reader should be able to understand that idea in roughly one minute without knowing any Continuum product names or technical architecture terms.

For configured AI identities, the same durability direction can later preserve an identity's principles, communication character, selected long-term memories and learned ways of working across compatible model changes. That idea belongs after the basic product model is understood, not in the opening hero glossary.

## One-minute explanation rule

The opening must answer why Continuum exists before it explains its parts.

Use the mental model:

`Think of AI as the brain and Continuum as the nervous system around it`

This analogy is useful because it explains the relationship quickly. The AI can reason, write and help make decisions. Continuum supplies the durable surrounding layer that carries context across time, keeps track of change, remembers the people and information that matter, enforces permission rules and is being built to keep approved processes moving after the chat closes.

The opening then explains the operating idea in ordinary language. A change can update what Continuum knows, and the rules already set can determine whether the next step should be to act, wait, ask the owner, contact someone or do nothing.

The Dead Man Switch is introduced as one example of that larger idea. The same foundation also applies to ordinary work while the owner is asleep, busy or offline and later to larger Goals that need several steps.

The opening closes the model-portability idea clearly. A future AI model can replace the current one without taking Continuum's durable memory, context, permissions or history with it.

Durable AI identity is a deeper consequence of that same model-portability principle. It should be explained later in the AI section so the opening remains simple.

## Current hero

Kicker:

`Think of AI as the brain and Continuum as the nervous system around it`

Opening lead:

> An AI model can reason, write and help make decisions. What it still needs around it is a reliable way to carry your life and work context across time, know what changed while you were away, remember the people and documents that matter, enforce your permission rules, and keep a process going after the chat closes. Continuum is that private layer.

Second paragraph:

> It keeps the information, people, documents, current situation and history around the AI so a change can update what Continuum knows and the rules you set can decide what should happen next. That might mean acting, waiting, asking you, contacting someone or doing nothing. The Dead Man Switch is one example, and the same foundation can help with everyday work when you're asleep, busy or offline and later with bigger goals that take several steps. If you switch to a better AI later, the memory, context, permissions and history stay with Continuum.

Compact labels:

```text
Carries context across time
Keeps up with real changes
Works inside rules you set
```

Hero principle remains:

`BUILT TO CARRY YOUR PLAN FORWARD`

Supporting line:

`You can change the AI without losing the memory, permissions and history Continuum keeps.`

The hero lead must not contain Library, Directory, Spaces, Automation, Runtime, Planner, Goal or Identity terminology. The one exception is normal lowercase `goals` used as ordinary English, not as the architecture term.

## Overview transition

The first Overview section bridges directly from the analogy into the operating loop.

Heading:

`From something changing to the next allowed step`

The prose explains that a deadline, reply, check-in condition or approved outside change can update what Continuum knows. The system checks the rules and permissions already set, then the next step may be to act, wait, ask or do nothing.

Only after that does the page say that the pieces below give those jobs their technical names.

## Teaching order

Use this order throughout the document:

```text
whole product
→ human behavior
→ real Continuum term
→ deeper architecture
```

Examples:

- current situation first, then `State`;
- meaningful change first, then `Signal`;
- repeatable or triggered work first, then `Automation`;
- work continuing after the app closes first, then `Runtime`;
- permission to act first, then `Authority`;
- proposed product changes first, then `Planner` and `Change Plan`;
- a larger outcome across several steps first, then `Goal`;
- recognizable AI continuity across model changes first, then `durable Identity`.

After the first explanation, technical sections can use the real terms normally. Accessibility comes from the first explanation, not from flattening the whole document.

## Product completeness

Clarity must not make Continuum sound like storage, a briefing app, a workflow builder or an Afterlife product alone.

The page must preserve the wider product story:

- durable information and context;
- people and relationships;
- current State and meaningful change;
- repeatable and triggered work;
- larger Goals;
- permissions and authority;
- server-side Runtime across time;
- outside Connections and capabilities;
- AI inside server-enforced limits;
- durable AI identity/persona portability across compatible models;
- Check In and continuity;
- Afterlife as one long-term continuity path;
- Control Center and causal history.

Future capability remains future capability. Goals, long-running Runtime, provider actions, durable AI identity loading and autonomous AI execution are not production claims today.

## Durable identity placement

The durable identity explanation belongs inside **AI + Permissions** after the authority model is already visible.

The reader should learn four things quickly:

1. a configured identity can later preserve principles, communication character, selected memories and learned ways of working;
2. a compatible model can load that identity in a new context instead of starting from zero;
3. identity can affect judgment, strategy and communication;
4. identity still cannot create facts, permissions or authority.

Keep the visible label `LATER` until the real backend IdentityProfile/IdentityVersion and loader exist.

Do not put private project-history examples or external personality-system names on the public `/doc/` page.

## Natural writing rule

Visible `/doc/` paragraph copy should avoid the patterns repeatedly identified as AI-like:

- ellipses and em dashes;
- formulaic `it's not X, it's Y` wording;
- `not X but Y` wording;
- `rather than` constructions;
- generic scene-setting intros;
- stacked short declarative sentences with the same rhythm;
- component-by-component glossary paragraphs;
- excessive symmetry or mirrored sentence structure;
- unnecessary colons and semicolons in ordinary prose;
- repeated `while` constructions;
- repeated `can eventually` future framing;
- stiff `does not`, `cannot`, `will not` wording when a natural contraction reads better;
- architecture nouns piled together before their practical meaning is clear;
- repeated explanations that add length without adding meaning;
- fragment-heavy sales copy outside intentional labels and interface microcopy.

A natural `while`, `but` or short sentence is fine when it serves the thought. The rule is against repetitive writing habits, not individual words.

Use connected plain-English paragraphs, varied sentence length, calm technical language, natural contractions and concrete situations. Let one thought lead into the next.

## Translation and RTL

The one-minute explanation should remain friendly to machine translation. Avoid compressed idioms after the brain/nervous-system analogy, keep the surrounding sentences literal, and preserve the existing `dir="auto"` and RTL layout compatibility.

Hebrew, Arabic, Persian, Urdu and Yiddish RTL handling remains protected through `assets/continuum-doc-i18n.css` and the direction setup in `assets/continuum-doc-i18n.js`.

## Protected structure and visuals

Keep:

- the eight-section reading path;
- the existing visual language;
- Check In as the first-class LIVE route;
- truthful LIVE / LAB / NEXT / LATER labels;
- State, Signals, information quality and provenance teaching;
- Planner, Goals and Runtime architecture;
- capability discovery and architecture evolution;
- continuity authority rules;
- durable identity model portability without personhood claims;
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

The reader and product-story layer remains:

- `assets/continuum-doc-reader-first.js`.

The final natural-voice layer remains:

- `assets/continuum-doc-final-voice.js`.

The durable identity addition is:

- `assets/continuum-doc-durable-identity.js`;
- `assets/continuum-doc-durable-identity.css`.

`assets/continuum-doc-i18n.js` loads the existing sequence, then loads the durable identity layer after the final voice so the current hero and reader-first copy remain undisturbed.

Current identity loader version:

`v=20260821-1`

Current markers include:

```text
data-continuum-clarity="plain-english-v1"
data-continuum-human-cadence="ready"
data-continuum-voice="natural-v4"
data-continuum-reader-first="ready"
data-continuum-final-voice="ready"
data-continuum-durable-identity="ready"
data-continuum-identity-portability="model-agnostic-v1"
```

## Regression coverage

- `tests/continuum-doc-continuity-positioning.test.js` checks the one-minute explanation, natural voice, loader version and reader-first terminology.
- `tests/continuum-doc-durable-identity.test.js` checks the durable identity copy, model-portability boundary, authority boundary and loader wiring.
- `.github/workflows/continuum-doc-clarity-validation.yml` renders desktop and 390x844 mobile views and confirms both the final hero and durable identity callout render without regressing the page into a component glossary.

## Backend boundary

This copy work changes no production backend claim and authorizes no migration, deployment, provider execution, Runtime activation, Goal execution, durable Identity service, AI execution or new authority.
