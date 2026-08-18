# Continuum Product Identity and `/doc/` Contract - CURRENT

Date: 2026-08-18
Status: **Clarity freeze after the teaching-order rebuild**

# Product identity

**Continuum** is the umbrella product across Spaces, Check In, the Automation Lab and `jay-app`.

Use these names consistently:

- **Continuum** = the whole private information, automation, Connections, Runtime and AI environment.
- **Spaces** = focused briefings built from approved current information.
- **Directory** = people and organizations.
- **Library** = content, files and saved knowledge.
- **Automations** = definitions for when something should happen, which rules apply, and what approved steps should follow.
- **Connections** = approved ways to reach outside apps, APIs, MCP services and providers.
- **Runtime** = the future server-side execution layer that keeps published workflows moving and records what happened.
- **Afterlife** = **The Dead Man Switch**, built on the same timing, people, information, rules, Connections and future Runtime.
- **Check In** remains the protected application/backend program name in current code and specs.

# `/doc/` role

`https://db.cmxchat.com/doc/` is the master public noindex visual explanation of Continuum.

The page is a teaching document. Its primary job is to make the product understandable to a smart reader who has never seen the project before.

The reader should understand the simple idea before learning product vocabulary, technical vocabulary, build process, or long-term architecture.

The visible reading path is:

1. a short Continuum promise;
2. the five-step operating loop;
3. one ordinary end-to-end example;
4. the names of the Continuum parts;
5. what Continuum adds around AI;
6. how people, saved information and Spaces stay connected;
7. how Automations define work and how Runtime differs from an Automation;
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

The visible Contents labels are intentionally shorter:

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

# Opening promise

The hero introduces Continuum in plain language. It no longer attempts to explain the complete roadmap, product taxonomy, provider model, AI future and Afterlife flow in one opening paragraph.

Canonical visible hero copy:

> Continuum keeps useful context in one private place so your information, people, rules and AI can work from the same picture over time. It can brief you while you are here, follow approved Automations when work needs to continue, and support a continuity plan if you cannot respond.

Canonical kicker:

`Your information, people, rules and AI, connected over time`

Canonical three ideas:

```text
Remembers context
Connects the pieces
Follows your rules
```

The hero should direct the reader into the operating loop before introducing Directory, Library, Connections or Runtime.

The older long-form vision remains useful as deep product context and may remain in static fallback/history, but it is no longer the primary visible opening promise.

# Core mental model

The first lesson is always:

```text
SEE WHAT IS HAPPENING
-> REMEMBER IT
-> CHECK THE RULES
-> DO APPROVED WORK
-> REMEMBER THE RESULT
```

The first section heading remains:

`How information moves through Continuum`

The operating loop explains the mechanics before the page asks the reader to remember product names.

Check In-specific timer values do not belong inside this generic loop. The current 72-hour timer, 24-hour grace, policy history and Incident details belong in the Afterlife section.

# One ordinary story

Directly after the operating loop, `/doc/` follows one ordinary update through the product.

Canonical example:

```text
A client says a payment was sent
-> an approved source provides the update
-> Directory resolves the person/company
-> useful context can be kept with source/history
-> a Business Space can reflect the change
-> an Automation can decide what should follow
-> future Runtime can keep long-running work moving and record the result
```

This example exists to teach relationships between the parts. It must remain clearly truthful about capabilities that are still LAB, NEXT or LATER.

# Teach concepts before product names

The product map comes after the operating loop and ordinary story.

Before or alongside the names, teach the concepts:

```text
PEOPLE -> Directory
SAVED INFORMATION -> Library
FOCUSED VIEWS -> Spaces
RULES + STEPS -> Automations
OUTSIDE TOOLS -> Connections
LONG-RUNNING WORK -> Runtime
REASONING -> AI
```

The reader should understand what a part does before needing to remember its branded name.

# Useful across time

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

`Your intent has somewhere durable to live.`

This visual comes after the basic mental model instead of competing with the hero.

# Capability status vocabulary

Public `/doc/` capability labels use four words only:

- **LIVE** = working with real protected state now.
- **LAB** = interactive design or proving surface.
- **NEXT** = next protected backend milestone.
- **LATER** = planned capability after the foundation.

The first compact status explanation appears near the beginning of the page, directly after the operating loop.

Do not repeatedly reteach the status vocabulary in every section. Use section-specific status labels when they prevent a misleading capability claim.

Do not reintroduce public state labels such as `MODELED`, `PLANNED`, `FUTURE`, `EXTENSIBLE`, `POLICY`, `WORKS TODAY` or `RUNTIME LATER`.

Roadmap sequence labels `NOW`, `NEXT`, `THEN`, `LATER` remain allowed because they describe build order.

# Plain-English contract

A smart reader with no programming background should understand the main product story without searching technical terms.

Teach the idea before the terminology.

Examples:

```text
Database
-> the long-term place that keeps saved information

Runtime
-> the part that keeps a published workflow moving after it starts

API
-> a doorway apps use to talk to each other

MCP
-> a standard that can let AI reach approved tools or information

Incident
-> a saved record of the Check In trigger event
```

Preserve these writing rules:

- one H1;
- connected paragraphs;
- short section introductions;
- visuals carry much of the explanation;
- no ellipses;
- no em dashes;
- avoid `it's not X, it's Y` constructions;
- avoid `not X but Y` constructions;
- avoid generic AI/SaaS slogans;
- avoid forced taglines;
- prefer examples a normal person can picture;
- keep current and future capability states explicit;
- preserve technical accuracy without requiring engineering knowledge.

# Readability floor

Meaningful explanatory sentences should read like normal document copy.

Target roughly:

- primary explanatory copy: 13px or larger on desktop;
- normal mobile explanation: 14px or larger;
- 11 to 12px only for status labels, metadata and genuinely secondary annotations;
- no important meaning hidden in micro-copy;
- no one-word-per-line phone cards.

The document may stay visually rich. Richness should come from diagrams, hierarchy, spacing and different visual forms, not from shrinking explanations to fit more cards.

# Visual rhythm

Avoid turning every lesson into the same card grid.

Prefer distinct visual forms for distinct ideas:

- operating loop = process map;
- ordinary example = connected story flow;
- product parts = network map;
- Spaces = briefing preview;
- AI = comparison/journey;
- Automations = readable workflow sentence and workflow examples;
- Afterlife = timing/policy timeline;
- architecture = request path;
- roadmap = staged progression.

The desktop Contents rail should support reading without competing with the document.

# AI contract

The page directly answers:

`Why not just use AI by itself?`

Answer:

> AI can reason about what you give it. Continuum gives that reasoning persistent people, records, rules, timing, tools and history to work with.

The comparison shows a normal AI conversation beside an AI task using Continuum context.

The model strip stays replaceable:

- OpenAI;
- Anthropic;
- Gemini;
- future/local models.

Continuum keeps the protected data, rules and history around the model.

The owner-control visual must show:

- what AI may read;
- who it may contact;
- which tools it may use;
- when it must ask;
- what remains owner-controlled.

Public rule:

> The AI cannot expand its own authority. Changing permissions requires an authorized server-side change.

# Spaces, Directory and Library

The visible section should teach this relationship directly:

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

This distinction must remain explicit:

**Automation = the plan.**

It defines the trigger, rules, approved actions, timing and finish behavior.

**Runtime = the execution layer.**

It will later keep a published workflow moving on the server, handle waits/retries/replies where supported and record what actually happened.

The readable builder model is:

```text
WHEN
-> IF
-> DO
-> WAIT
-> REVIEW
```

The page keeps both an ordinary-life example and an Afterlife continuity example.

Longer-term possibility cards are secondary detail and stay collapsed by default so they do not interrupt the core Automation lesson.

# Afterlife

Afterlife is Continuum applied to continuity.

Canonical simple explanation:

> You choose the timer. If you stop checking in long enough, the live Check In core records the trigger. Future Runtime can carry the approved steps that follow.

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

Provider delivery, long-running waits, replies, retries, acknowledgements and AI coordination remain later Runtime work until the backend truth changes.

# Architecture and build process

Architecture and build material remains on `/doc/`, but it is optional depth in the normal reading path.

The headings remain navigable. Their detailed content is collapsed by default behind clear disclosures:

- `Open the architecture walkthrough`;
- `Open the build workflow`.

This preserves the educational material for readers who want to understand FastAPI, PostgreSQL, Codespaces, Docker, Alembic and the generated API client without requiring every product reader to learn those concepts first.

Architecture truth remains:

```text
Browser
-> HTTPS / JSON
-> FastAPI domain services
-> PostgreSQL
-> JSON response
-> frontend
```

The frontend never talks directly to PostgreSQL.

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

A compact status explanation near the beginning answers what exists today. The roadmap answers what order the larger build follows.

# Runtime implementation boundary

`/doc/` is explanatory frontend content. This clarity rebuild does **not** authorize backend schema changes, provider execution, new runtime authority or a change to the approved `jay-app` implementation order.

Backend truth remains defined by the canonical documents under:

`CMXChat/jay-app/specs/003-server-checkin/`

Any future backend change must be reconciled there before `/doc/` is updated to claim the capability.

# Runtime presentation implementation

The static HTML retains detailed semantic content and stable anchor sections.

`assets/personal-os-doc.js` owns the current clarity reading path by:

- shortening the visible hero;
- moving the product map after the simple mental model;
- creating the ordinary end-to-end story;
- moving the compact status key earlier;
- moving Check In-specific glance cards into Afterlife;
- teaching Automation vs Runtime explicitly;
- collapsing future possibility cards;
- collapsing Architecture and Build detail by default;
- shortening Contents labels.

`assets/continuum-doc-qa.css` owns the final clarity layout and readability rules while preserving the existing light/dark, Afterlife, mobile and print safeguards.

Do not add a broad DOM mutation loop to maintain this presentation. The clarity transformation is deterministic at page initialization.

# Freeze rule

The `/doc/` freeze now protects **clarity and teaching order**, not the older long hero composition.

Before changing `/doc/`, ask:

1. Does this help a first-time reader understand Continuum sooner?
2. Does it preserve the five-step mental model?
3. Does it teach concepts before internal product names?
4. Does it keep LIVE, LAB, NEXT and LATER truthful?
5. Does it keep Automation definition separate from Runtime execution?
6. Does it avoid forcing technical depth into the primary product story?
7. Does it stay readable on phone and desktop?

If the answer to any of those is no, do not make the change without deliberately revising this CURRENT contract.
