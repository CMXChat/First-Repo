# Continuum Product Identity and `/doc/` Contract - CURRENT

Date: 2026-08-18
Status: **Clarity freeze after the teaching-order and human-copy rebuild**

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

`https://db.cmxchat.com/doc/` is the master public noindex visual explanation of Continuum.

The page is a teaching document. Its job is to make the product understandable to a smart reader who has never seen the project before.

The reader should understand the basic idea before product vocabulary, technical vocabulary, build process or long-term architecture.

The visible reading path is:

1. a short Continuum introduction;
2. the five-step operating loop;
3. one ordinary end-to-end example;
4. the names of the Continuum parts;
5. how AI works inside Continuum;
6. how people, saved information and Spaces stay connected;
7. how Automations define work and Runtime executes it;
8. how Afterlife uses the same foundation for continuity;
9. optional architecture detail;
10. optional build-process detail;
11. the roadmap.

The eight stable document anchors remain for navigation and compatibility:

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

The hero uses a short plain-English introduction.

Canonical visible hero copy:

> Continuum keeps useful information, people and rules together so the same context is available when you need it. It can build briefings, use approved Automations and support your continuity plan if you cannot respond.

Canonical kicker:

`Information, people, rules and AI in one place`

Canonical three ideas:

```text
Keeps useful history
Links people + information
Runs approved rules
```

The product map comes after the first mental model and ordinary example.

# Core mental model

The first lesson remains:

```text
SEE WHAT IS HAPPENING
-> REMEMBER IT
-> CHECK THE RULES
-> DO APPROVED WORK
-> REMEMBER THE RESULT
```

The first section heading remains:

`How information moves through Continuum`

Check In-specific timer values belong in the Afterlife section. The current 72-hour timer, 24-hour grace, policy history and Incident details stay there.

# One ordinary story

Directly after the operating loop, `/doc/` follows one normal update through the product.

Canonical example:

```text
A client says a payment was sent
-> an approved source provides the update
-> Directory matches it to the right person/company
-> Library can keep the useful details with source/history
-> a Business Space can show the change
-> an Automation applies the rules and next step
-> future Runtime can keep the workflow running and record the result
```

This example must keep LAB, NEXT and LATER claims accurate.

# Concepts before product names

The product map comes after the operating loop and ordinary story.

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

# Across time

The availability visual remains part of the product-map lesson:

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

The first compact status explanation appears directly after the operating loop.

Roadmap sequence labels `NOW`, `NEXT`, `THEN`, `LATER` describe build order.

# Writing contract

Public `/doc/` copy should sound like a person explaining the product clearly.

Keep these rules:

- one H1;
- connected paragraphs;
- short section introductions;
- direct sentences;
- concrete verbs;
- examples a normal person can picture;
- visuals carry much of the explanation;
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

The page can stay visually rich. Diagrams, spacing, hierarchy and different visual forms should provide that richness.

# Visual rhythm

Use distinct visual forms for distinct ideas:

- operating loop = process map;
- ordinary example = connected story flow;
- product parts = network map;
- Spaces = briefing preview;
- AI = comparison/journey;
- Automations = readable workflow sentence and workflow examples;
- Afterlife = timing/policy timeline;
- architecture = request path;
- roadmap = staged progression.

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

The readable builder model is:

```text
WHEN
-> IF
-> DO
-> WAIT
-> REVIEW
```

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

The compact status explanation near the beginning answers what exists today. The roadmap shows the larger build order.

# Backend boundary

This clarity and copy rebuild changes presentation only. Backend schema, provider execution, Runtime authority and `jay-app` implementation order remain governed by the canonical backend documents under:

`CMXChat/jay-app/specs/003-server-checkin/`

Backend capability claims on `/doc/` should change only after the canonical backend truth changes.

# Presentation implementation

The static HTML keeps the direct human copy so the no-JS fallback matches the rendered page.

`assets/personal-os-doc.js` owns the current clarity reading path by:

- keeping the hero short;
- moving the product map after the simple mental model;
- creating the ordinary end-to-end story;
- moving the compact status key earlier;
- moving Check In-specific glance cards into Afterlife;
- teaching Automation and Runtime separately;
- collapsing later-use cards;
- collapsing Architecture and Build detail by default;
- shortening Contents labels;
- normalizing older static copy into the same direct tone.

`assets/continuum-doc-qa.css` keeps the final clarity layout and readability rules while preserving existing light/dark, Afterlife, mobile and print safeguards.

`assets/continuum-doc-human.css` loads last and owns the final H1/H2 scale.

The clarity transformation runs once at page initialization. Avoid broad DOM mutation loops.

# Freeze rule

The `/doc/` freeze protects clarity, direct human wording and teaching order.

Before changing `/doc/`, ask:

1. Does this help a first-time reader understand Continuum sooner?
2. Does the sentence sound natural when read aloud?
3. Does it preserve the five-step mental model?
4. Does it teach concepts before internal product names?
5. Does it keep LIVE, LAB, NEXT and LATER truthful?
6. Does it keep Automation definition separate from Runtime execution?
7. Does technical depth stay secondary to the product story?
8. Does it stay readable on phone and desktop?

Changes that weaken those points should come with a deliberate update to this CURRENT contract.
