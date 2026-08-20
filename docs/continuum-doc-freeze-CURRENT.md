# Continuum `/doc/` Freeze - CURRENT

Date: 2026-08-20
Status: FROZEN after owner-authorized plain-English and human-cadence passes

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

The first pass simplified terminology and established the rule that human meaning should come before architecture vocabulary.

The follow-up cadence audit found that some copy was individually clear but still sounded generated because several short subject-action sentences were stacked together. The final pass therefore also protects connected paragraph rhythm and varied sentence structure.

Canonical positioning companion:

`docs/continuum-doc-positioning-CURRENT.md`

## Current opening identity

Hero direction:

```text
Your information, plans and permissions across time
```

The opening explains that Continuum can keep information, people, instructions and permissions over time, help use that context today, continue work already approved while the owner is away, and follow continuity plans prepared for a time when the owner cannot respond.

The next paragraph now connects the product pieces in one flowing explanation. Library preserves information, Directory ties it to people and relationships, Spaces brings the relevant context into focus, and Automations can use those same records and rules to carry approved work forward. Check In and Afterlife extend the continuity plan when the owner is away or unable to respond, while AI models and tools can change without taking the underlying records, permissions and history with them.

Compact hero labels remain intentionally concise:

```text
Knows what changed and when
Can continue work you approved
Keeps track of what is allowed and why
```

Hero principle:

`BUILT TO CARRY YOUR PLAN FORWARD`

Continuity path:

```text
WITH YOU
→ FOR YOU
→ WHEN AWAY
→ IF YOU CANNOT RESPOND
```

## Plain-English teaching rule

Explain the human idea first and the architecture term second.

Examples include:

- State = Continuum's current picture of what is true now;
- authority = permission to act;
- Directory relationship labels add context without granting permission by themselves;
- an Automation can keep using version 3 while version 4 is being edited;
- Runtime can later keep waits, replies and retries on the server after the browser closes;
- elapsed time comes from server timestamps, so AI does not need to stay open between events.

## Human cadence rule

Related ideas should read as connected prose. Avoid repeatedly resetting a paragraph with the same short pattern, especially sequences such as `Library does X. Directory does Y. Spaces does Z.`

Short wording remains appropriate for labels, cards, flow diagrams, status pills and deliberate UI microcopy.

Visible paragraph copy should use varied sentence length and make the relationship between ideas clear.

## Information direction

Library, Directory and Spaces remain distinct while being explained as connected parts of the same information layer.

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

When the AI changes, Continuum keeps the information, current State, permissions and server-side rules around it.

The server remains the final permission check, and improved reasoning never creates extra authority by itself.

## Automations and Runtime direction

The Automation section keeps the human interaction first:

`Describe what should happen, then make the rules clear.`

Natural language remains the intended setup experience. Structured people, timing, approvals, limits, actions and fallback fields are what future Runtime can enforce.

Current Lab workflow definitions still do not imply provider execution.

## Temporal-awareness direction

Concrete example:

```text
User says they are leaving for two minutes
→ user returns two seconds later
→ Continuum knows roughly two seconds elapsed
```

Consequential elapsed time comes from backend/server timestamps. Check In already proves server-owned timing today.

## Afterlife positioning

Afterlife extends the same Continuum foundation into long-term continuity. The owner prepares people, information, instructions and permissions in advance, Check In records the trigger if the owner stops responding long enough, and future Runtime can follow the plan already prepared.

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
- stacked `X does this. Y does that. Z does this.` paragraph cadence;
- excessive symmetry and mirrored sentence construction;
- fragment-heavy sales copy outside intentional UI labels;
- repeated abstract nouns when a simpler word works;
- repeated explanations that add length without adding meaning.

Use connected plain-English paragraphs, varied sentence length, calm technical language, concrete examples and restrained emphasis.

## Protected structure and visuals

The clarity and cadence passes keep:

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

The final human-voice layer is:

- `assets/continuum-doc-human-cadence.js`.

`assets/continuum-doc-i18n.js` loads the knowledge/time layer first and the human-cadence layer after it.

Current loader targets:

```text
/assets/continuum-doc-knowledge-time.js?v=20260820-1
/assets/continuum-doc-human-cadence.js?v=20260820-1
```

Current markers:

```text
data-continuum-clarity="plain-english-v1"
data-continuum-human-cadence="ready"
```

The static `doc/index.html` still loads the i18n bootstrap using its existing query token. Normal browser revalidation should pick up the updated bootstrap. A future query-token bump remains allowed if a device proves stale.

## Regression guard

`tests/continuum-doc-continuity-positioning.test.js` now validates both the plain-English layer and final human-cadence layer.

`.github/workflows/continuum-doc-clarity-validation.yml` validates desktop and 390×844 mobile rendering and explicitly rejects known stale punchy phrases after final rendering.

A workflow file existing does not prove a green run. Report CI as green only after an actual run/status confirms it.

## Backend boundary unchanged

This `/doc/` work changes no production backend claim and authorizes no migration, deployment, provider execution, general ingestion, Runtime activation, autonomous AI execution or new authority.

## Reopen rule

When a future context touches `/doc/`, read this file and `continuum-doc-positioning-CURRENT.md` first.

If the requested work does not fit a listed exception and the owner did not explicitly reopen `/doc/`, leave the page unchanged.
