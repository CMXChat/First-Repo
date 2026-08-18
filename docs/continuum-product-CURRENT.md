# Continuum Product Identity and `/doc/` Contract - CURRENT

Date: 2026-08-18
Status: **Clarity freeze after the teaching-order, human-copy and prose-balance rebuild**

# Product identity

**Continuum** is the umbrella product across Spaces, Check In, the Automation Lab and `jay-app`.

Use these names consistently:

- **Continuum** = the whole private information, automation, Connections, Runtime and AI environment.
- **Spaces** = focused briefings built from approved current information.
- **Directory** = people and organizations.
- **Library** = content, files and saved knowledge.
- **Automations** = definitions for when something should happen, which rules apply and what approved steps should follow.
- **Connections** = approved ways to reach outside apps, APIs, MCP services and providers.
- **Runtime** = the future server-side execution layer that keeps published workflows moving and records what happened.
- **Afterlife** = **The Dead Man Switch**, built on the same timing, people, information, rules, Connections and future Runtime.
- **Check In** remains the protected application/backend program name in current code and specs.

# `/doc/` role

`https://db.cmxchat.com/doc/` is the master public noindex explanation of Continuum.

It is a document first. Words should carry the product explanation. Visuals should make selected ideas easier to understand.

A first-time reader should be able to read the page normally without having to decode a new diagram in every section.

The visible reading path is:

1. a clear Continuum introduction;
2. the five-step operating loop;
3. one ordinary example explained mainly in prose;
4. the Parts of Continuum map;
5. how AI works inside Continuum;
6. how people, saved information and Spaces stay connected;
7. how Automations define work and Runtime executes it;
8. how Afterlife uses the same foundation for continuity;
9. optional architecture detail;
10. optional build-process detail;
11. the roadmap.

The eight stable document anchors remain:

1. `#overview`;
2. `#difference`;
3. `#spaces`;
4. `#action`;
5. `#afterlife`;
6. `#engineering`;
7. `#build`;
8. `#status`.

Visible Contents labels:

```text
01 · Overview
02 · AI
03 · Information
04 · Automations
05 · Afterlife
06 · Architecture
07 · Build
08 · Roadmap
```

# Opening copy

The hero uses the fuller plain-English introduction below.

Canonical visible hero copy:

> Continuum keeps useful context in one private place so your information, people, rules and AI stay connected over time. It can brief you while you’re here, follow approved Automations when work needs to continue, and support a continuity plan if you cannot respond.

Canonical kicker:

`Information, people, rules and AI in one place`

Canonical three ideas:

```text
Keeps useful history
Links people + information
Runs approved rules
```

The hero H1 stays prominent without taking over the first viewport.

# Core mental model

The first lesson remains:

```text
SEE WHAT IS HAPPENING
-> REMEMBER IT
-> CHECK THE RULES
-> DO APPROVED WORK
-> REMEMBER THE RESULT
```

The first section kicker is:

`Continuum in one minute`

The first section heading remains:

`How information moves through Continuum`

Do not replace the kicker with generic wording such as `Start here`.

Check In-specific timer values belong in the Afterlife section. The current 72-hour timer, 24-hour grace, policy history and Incident details stay there.

# One ordinary story

Directly after the operating loop, `/doc/` follows one normal update through the product.

This section is **prose-led**. It should not become another six-card diagram.

Canonical example:

> A client emails to say a payment was sent. Continuum can match that message to the client, keep the useful details with their source, show the update in a Business Space and let an Automation use that information for the next approved step.

Then explain Runtime plainly:

> When Runtime is built, it can keep the published workflow running on the server, handle waits or replies that belong to that workflow and record the result.

One compact supporting path is allowed:

```text
Message -> Directory -> Library -> Business Space -> Automation -> Runtime
```

This example must keep LAB, NEXT and LATER claims accurate.

# Parts of Continuum

The Parts of Continuum section is the main rich overview visual on desktop.

Its heading is:

`How the pieces fit together`

Teach the concepts alongside the names:

```text
PEOPLE -> Directory
SAVED INFORMATION -> Library
FOCUSED VIEWS -> Spaces
RULES + STEPS -> Automations
OUTSIDE TOOLS -> Connections
LONG-RUNNING WORK -> Runtime
REASONING -> AI
```

The network map and the Across Time visual may remain visually rich because this section benefits from seeing the product as one connected whole.

# Across time

The availability visual remains part of the Parts of Continuum lesson:

```text
WITH YOU
Brief, understand, plan

FOR YOU
Coordinate, follow up, act

WHEN YOU ARE AWAY
Wait, monitor, continue

IF YOU CANNOT RESPOND
Begin your continuity plan
```

Heading:

`Keep the information and rules you choose.`

# Capability status vocabulary

Public `/doc/` capability labels use four words:

- **LIVE** = working with real protected state now.
- **LAB** = interactive design or proving surface.
- **NEXT** = next protected backend milestone.
- **LATER** = planned capability after the foundation.

A short status note appears after the operating loop:

```text
Check In is LIVE.
Spaces and Automations are LAB.
Private information and Automation definitions are NEXT.
Runtime and provider execution are LATER.
```

The detailed four-state key stays with the Parts of Continuum section instead of being moved into another large card block.

Roadmap sequence labels `NOW`, `NEXT`, `THEN`, `LATER` describe build order.

# Writing contract

Public `/doc/` copy should sound like a person explaining the product clearly.

Keep these rules:

- one H1;
- connected paragraphs;
- enough prose to explain the idea without requiring the visual;
- short section introductions;
- direct sentences;
- concrete verbs;
- examples a normal person can picture;
- no ellipses;
- no em dashes;
- avoid `it's not X, it's Y` constructions;
- avoid `not X but Y` constructions;
- avoid rhetorical questions built around what the product is missing;
- avoid generic AI/SaaS slogans;
- avoid editor notes about how the page was designed;
- avoid abstract phrases when a concrete sentence says the same thing;
- keep current and future capability states explicit;
- preserve technical accuracy without requiring engineering knowledge.

Examples of preferred wording:

```text
AI can use saved context, rules and approved tools.

Automations define the steps. Runtime runs them.

Database access goes through the backend.
```

# Readability and heading scale

Meaningful explanatory sentences should read like normal document copy.

Target roughly:

- primary explanatory copy: 13px or larger on desktop;
- normal mobile explanation: 14px or larger;
- 11 to 12px only for status labels, metadata and secondary annotations;
- no important meaning hidden in micro-copy;
- no one-word-per-line phone cards.

Heading scale is intentionally restrained:

- hero H1: `clamp(3rem, 5.4vw, 4.4rem)` on desktop;
- main section H2: `clamp(1.9rem, 3.15vw, 2.8rem)`;
- mobile H1: `clamp(2.75rem, 14vw, 3.55rem)`;
- mobile section H2: `clamp(1.75rem, 8vw, 2.15rem)`.

# Visual rhythm

The page should use fewer, stronger visuals.

Use rich visuals where seeing relationships matters:

- operating loop = process map;
- Parts of Continuum = network map and Across Time visual;
- Spaces = briefing preview with Directory and Library examples;
- AI = comparison/journey where it improves understanding;
- Afterlife = timing/policy timeline;
- architecture = request path;
- roadmap = staged progression.

Use prose first when a paragraph explains the idea more clearly:

- ordinary end-to-end example = prose plus one compact path;
- Automation vs Runtime = explanatory paragraph plus one compact `WHEN -> IF -> DO -> WAIT -> REVIEW` line;
- status explanation = short note;
- secondary future possibilities = collapsed detail.

Do not add a new card grid simply because a section needs visual variety.

The desktop Contents rail supports reading without competing with the document.

# AI contract

The section heading is:

`AI can use saved context, rules and approved tools`

The direct explanation is:

> AI can reason with the information it receives. Continuum keeps the people, records, rules, timing, tools and history around that work.

The comparison shows a normal AI conversation beside an AI task using Continuum context.

The model strip remains replaceable:

- OpenAI;
- Anthropic;
- Gemini;
- future/local models.

Continuum keeps the approved data, rules and history around the model.

The owner-control visual shows:

- what AI may read;
- who it may contact;
- which tools it may use;
- when it must ask;
- what remains owner-controlled.

Public rule:

> AI authority is set by server-side permissions. Permission changes require an authorized server-side update.

# Spaces, Directory and Library

The visible section teaches this relationship directly:

- Directory answers who a person or organization is;
- Library holds saved content, files and versions;
- Spaces turn approved current information into focused views.

The Personal Brief remains labeled as a **LAB preview**.

The Library example remains:

```text
Afterlife
-> continuity.md
-> Draft
-> Version 1
-> Automation
```

Backend provenance semantics remain canonical in:

`CMXChat/jay-app/specs/003-server-checkin/CONTEXT-INGESTION-PROVENANCE-BACKEND-CONTRACT.md`

# Automations and Runtime

This distinction remains explicit:

**Automation = the plan.**

It defines the trigger, rules, approved actions, timing and finish behavior.

**Runtime = the execution layer.**

It will later run a published workflow on the server, handle waits, retries and replies where supported, and record what happened.

The section explains that distinction in normal prose before the compact builder line.

The readable builder model is:

```text
WHEN
-> IF
-> DO
-> WAIT
-> REVIEW
```

Avoid adding a second large plan-vs-execution card pair above the existing Automation examples.

The page keeps both an everyday example and an Afterlife continuity example.

Longer-term possibility cards stay collapsed by default.

# Afterlife

Afterlife uses Continuum for continuity.

Canonical simple explanation:

> You choose the timer. If you stop checking in long enough, the live Check In core records the trigger. Future Runtime can run the approved steps that follow.

Current Check In truth remains explicit:

- changeable timer;
- changeable grace period;
- current values 72h + 24h;
- pause/resume;
- one-time deadline override;
- policy history;
- protected sessions;
- Incident creation at trigger;
- Audit/history and repair behavior already implemented where documented.

Provider delivery, long-running waits, replies, retries, acknowledgements and AI coordination remain later Runtime work until backend truth changes.

# Architecture and build process

Architecture and build material remains on `/doc/` as optional depth in the normal reading path.

The headings remain navigable. Detailed content is collapsed by default behind:

- `Open the architecture walkthrough`;
- `Open the build workflow`.

Architecture truth remains:

```text
Browser
-> HTTPS / JSON
-> FastAPI domain services
-> PostgreSQL
-> JSON response
-> frontend
```

Database access goes through the backend. The backend owns business rules, permissions and PostgreSQL access.

The Lab-to-backend build story remains:

```text
prototype in Lab
-> write the contract
-> build PostgreSQL models/migrations/services/tests in jay-app
-> expose protected API
-> migrate accepted frontend behavior into the protected product
```

The first private-data vertical slice remains `continuity.md` unless the canonical backend plan is deliberately changed.

# Roadmap

The detailed roadmap remains near the end:

```text
NOW
Protected Check In

NEXT
Real private information

THEN
Keep workflows running

LATER
More connected capability
```

The compact status note near the beginning answers what exists today. The roadmap shows the larger build order.

# Backend boundary

This clarity, copy and prose-balance rebuild changes presentation only. Backend schema, provider execution, Runtime authority and `jay-app` implementation order remain governed by the canonical backend documents under:

`CMXChat/jay-app/specs/003-server-checkin/`

Backend capability claims on `/doc/` should change only after the canonical backend truth changes.

# Presentation implementation

The static HTML keeps the direct opening so the no-JS fallback matches the rendered page.

`assets/personal-os-doc.js` owns the current reading path by:

- restoring the fuller introduction;
- using `Continuum in one minute` for the first section;
- keeping the product map after the simple mental model;
- creating the ordinary prose-led example;
- adding one short status note after the operating loop;
- leaving the detailed status key with the Parts of Continuum map;
- moving Check In-specific glance cards into Afterlife;
- explaining Automation and Runtime in prose before the compact builder sequence;
- collapsing later-use cards;
- collapsing Architecture and Build detail by default;
- shortening Contents labels;
- normalizing older static copy into the same direct tone.

`assets/continuum-doc-qa.css` keeps the existing light/dark, Afterlife, mobile, print and general clarity safeguards.

`assets/continuum-doc-human.css` loads last and owns:

- the final H1/H2 scale;
- prose-led ordinary-story layout;
- compact status-note presentation;
- prose-first Automation explanation;
- preservation of the rich Parts of Continuum desktop map.

The clarity transformation runs once at page initialization. Avoid broad DOM mutation loops.

# Freeze rule

The `/doc/` freeze protects clarity, direct human wording, reading balance and teaching order.

Before changing `/doc/`, ask:

1. Can the reader understand the idea from the words alone?
2. Does the visual make that explanation easier to understand?
3. Does the sentence sound natural when read aloud?
4. Does it preserve the five-step mental model?
5. Does the Parts of Continuum overview remain clear on desktop and phone?
6. Does it keep LIVE, LAB, NEXT and LATER truthful?
7. Does it keep Automation definition separate from Runtime execution?
8. Does technical depth stay secondary to the product story?
9. Does it stay readable on phone and desktop?

Changes that weaken those points should come with a deliberate update to this CURRENT contract.
