# Continuum `/doc/` Freeze - CURRENT

Date: 2026-08-20
Status: FROZEN after owner-authorized plain-English clarity pass over the continuity-first product overview

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

## August 20 owner-authorized clarity pass

The owner explicitly reopened `/doc/` after reviewing the mobile page and asked for the whole document to become easier to understand and less AI-like without ruining the existing design.

The accepted scope was intentionally narrow:

- preserve the eight-section reading path;
- preserve the visual system;
- preserve the existing architecture and capability truth;
- simplify visible wording;
- explain important terms in ordinary English before using deeper architecture language;
- use concrete examples where they teach faster than abstract definitions;
- keep current writing restrictions.

Canonical positioning companion:

`docs/continuum-doc-positioning-CURRENT.md`

## Current opening identity

Hero direction:

```text
Your information, plans and permissions across time
```

The first screen now explains that Continuum can:

- keep information, people, instructions and permissions over time;
- help use that context today;
- continue work already approved while the owner is away;
- follow continuity plans prepared for a time when the owner cannot respond.

The second hero paragraph explains the product pieces directly:

- Library holds information;
- Directory keeps people and relationships;
- Spaces brings relevant context into focus;
- Automations define approved work;
- Check In and Afterlife support prepared continuity;
- AI models and tools can change while Continuum keeps the lasting records and rules.

Compact hero ideas:

```text
Knows what changed and when
Can continue work you approved
Keeps track of what is allowed and why
```

Hero principle:

`BUILT TO CARRY YOUR PLAN FORWARD`

The continuity path remains:

```text
WITH YOU
→ FOR YOU
→ WHEN AWAY
→ IF YOU CANNOT RESPOND
```

## Plain-English teaching rule

The document should explain the human idea first and the architecture term second.

Examples now include:

- State = Continuum's current picture of what is true now;
- authority = permission to act;
- a Directory relationship adds context and does not create permission by itself;
- an Automation can keep using version 3 while version 4 is being edited;
- Runtime can later keep waits, replies and retries on the server after the browser closes;
- elapsed time comes from server timestamps, so the AI does not need to stay open between events.

## Information direction

Library, Directory and Spaces remain distinct:

- Library keeps documents, files, knowledge and version history;
- Directory keeps people, organizations and relationships;
- Spaces brings relevant pieces together for a focused view.

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

The original source stays traceable. Important findings stay reviewable before they become accepted long-term knowledge.

## AI and authority direction

The AI section now leads with:

`AI can change. Continuum keeps the rules around it.`

A model can reason, write and use tools. Continuum keeps the information, current State, permissions, rules and history that decide what the model can see and what it can do.

The server remains the final permission check.

## Automations and Runtime direction

The Automation section now leads with:

`Describe what should happen, then make the rules clear.`

Natural language remains the intended setup experience. Structured people, timing, approvals, limits, actions and fallback fields are what future Runtime can enforce.

Current Lab workflow definitions still do not imply provider execution.

## Temporal-awareness direction

The concrete example remains:

```text
User says they are leaving for two minutes
→ user returns two seconds later
→ Continuum knows roughly two seconds elapsed
```

Consequential elapsed time comes from backend/server timestamps.

Check In already proves server-owned timing today.

## Afterlife positioning

Afterlife is introduced as Continuum's long-term continuity path.

The owner prepares people, information, instructions and permissions in advance. Check In records the trigger if the owner stops responding long enough. Future Runtime can follow the prepared plan.

Visible guardrail:

`Silence and urgency never create permission.`

## Writing contract

Visible `/doc/` copy should avoid:

- ellipses;
- em dashes;
- formulaic `it's not X, it's Y` phrasing;
- `not X but Y` phrasing;
- `rather than` constructions;
- generic AI-style intros;
- fragment-heavy sales copy;
- excessive symmetry;
- repeated abstract nouns when a simpler word works;
- repeated explanations that add length without adding meaning.

Use connected plain-English paragraphs, calm technical language, concrete examples and restrained emphasis.

## Protected structure and visuals

The clarity pass keeps:

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

## Final visible-copy layer

The final continuity/knowledge/time/clarity copy lives in:

- `assets/continuum-doc-knowledge-time.js`;
- `assets/continuum-doc-knowledge-time.css`.

`assets/continuum-doc-i18n.js` performs direction preparation and loads the final copy layer.

Current loader target:

`/assets/continuum-doc-knowledge-time.js?v=20260820-1`

Current visible clarity marker:

`data-continuum-clarity="plain-english-v1"`

The static `doc/index.html` still loads the i18n bootstrap using its existing query token. Normal browser revalidation should pick up the updated bootstrap. A future query-token bump remains allowed if a device proves stale.

## Regression guard

Current dedicated positioning test:

`tests/continuum-doc-continuity-positioning.test.js`

It checks the plain-English hero, term definitions, Library/Directory/Spaces explanation, versioning example, Automations/Runtime wording, Afterlife permission rule, temporal example, writing restrictions, responsive styles and final loader target.

`.github/workflows/continuum-doc-clarity-validation.yml` remains the validation workflow.

A workflow file existing does not prove a green run. Report CI as green only after an actual run/status confirms it.

## Backend boundary unchanged

This `/doc/` pass changes no production backend claim and authorizes no production migration, deployment, provider execution, general ingestion, Runtime activation, autonomous AI execution or new authority.

## Reopen rule

When a future context touches `/doc/`, read this file and `continuum-doc-positioning-CURRENT.md` first.

If the requested work does not fit a listed exception and the owner did not explicitly reopen `/doc/`, leave the page unchanged.
