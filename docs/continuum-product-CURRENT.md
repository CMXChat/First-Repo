# Continuum Product Identity and Overview - CURRENT

Date: 2026-08-18
Status: Canonical frontend/product naming and `/doc/` contract

# Product identity

**Continuum** is the umbrella product across Spaces, Check In, the Automation Lab and `jay-app`.

Use these names consistently:

- **Continuum** = the whole private information, automation, Connections, Runtime and AI environment.
- **Spaces** = focused briefings built from approved current information.
- **Directory** = people and organizations.
- **Library** = content, files and saved knowledge.
- **Automations** = rules for when something should happen and what to do next.
- **Connections** = approved ways to reach outside apps, APIs, MCP services and providers.
- **Runtime** = the future server-side layer that keeps longer workflows moving and records what happened.
- **Afterlife** = **The Dead Man Switch**, built on the same timing, people, information, rules, Connections and future Runtime.
- **Check In** remains the protected application/backend program name in current code and specs.

# `/doc/` role

`https://db.cmxchat.com/doc/` is the master public noindex visual explanation of Continuum.

The page should answer these questions quickly:

1. What is Continuum?
2. How does information get into it?
3. What does it remember?
4. What does AI gain by working inside it?
5. How can Automations and Connections turn information into action?
6. How does Afterlife work?
7. What code and infrastructure make it real?
8. What works today, what comes next, and what could grow from the same foundation?

The page uses eight reading sections:

1. Continuum in one minute;
2. what Continuum adds around AI;
3. Spaces, people and saved information;
4. Automations and possibilities;
5. Afterlife: The Dead Man Switch;
6. how the code works;
7. how ideas become real;
8. where Continuum can go.

# Plain-English contract

A smart reader with no programming background should understand the main idea without searching technical terms.

Treat this as a permanent product requirement.

The page should teach the idea before the terminology.

Examples:

```text
Database
-> explain it first as the long-term place that keeps saved information

Runtime
-> explain it first as the part that keeps a workflow moving after it starts

API
-> explain it first as a doorway apps use to talk to each other

MCP
-> explain it first as a standard that can let AI reach approved tools or information

Incident
-> explain it first as the recorded trigger event
```

Technical names can remain because `/doc/` also teaches the real architecture. They should sit underneath a plain-English explanation instead of carrying the explanation by themselves.

Preserve these writing rules:

- one H1;
- connected paragraphs;
- short section introductions;
- visuals carry much of the explanation;
- no ellipses;
- no em dashes;
- avoid formulaic contrast writing such as `it's not X, it's Y`;
- avoid `not X but Y` constructions;
- avoid generic AI/SaaS slogans;
- avoid forced taglines for every product area;
- prefer examples a normal person can picture;
- keep current, next and future capability states clear;
- preserve technical accuracy without requiring engineering knowledge.

# Opening promise

The hero should explain the complete idea before the reader reaches architecture detail.

Canonical opening paragraph:

> Continuum brings your information, people, files, messages, services, automations and AI into one private environment that can understand what is happening, remember useful history, build briefings from connected sources, follow rules you set, use approved tools and keep important work moving over time. As more services connect through APIs, MCP and other providers, it can grow into something that helps coordinate people, follow up on projects, watch important changes, analyze money, communicate through email, messaging and future voice, and work with whatever AI models become more capable in the years ahead. The deeper idea is that your context, priorities and instructions have somewhere durable to live, so Continuum can remain useful when you are busy, offline or unavailable. Afterlife carries that idea further: if you stop checking in for the period you chose, Continuum can record the trigger and begin the continuity steps you prepared in advance, including contacting trusted people, releasing approved information and eventually coordinating approved work within the limits you already set.

The opening visual directly under the hero map should explain changing levels of availability:

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

The heading for that visual is:

`Your intent has somewhere durable to live.`

The visual must keep current capability truth clear. The Check In trigger core works today. Long-running provider execution and autonomous coordination remain later Runtime work.

# Core explanation

Continuum helps software and AI understand what is happening in the user's world, remember what matters, follow the user's rules and use approved tools to get things done.

Conceptual loop:

```text
SEE WHAT IS HAPPENING
-> REMEMBER IT
-> CHECK THE RULES
-> DO APPROVED WORK
-> REMEMBER THE RESULT
```

Technical mapping:

```text
input / ingestion
-> durable state
-> policy / authority
-> Automation / Runtime action
-> Audit / updated state
```

# Why AI becomes more useful

A normal AI conversation can reason, write and plan from the context available in that interaction.

Continuum supplies a durable environment around that reasoning:

- People and Organizations;
- Groups and Audiences;
- Library content and files;
- current records;
- source and freshness information;
- Conversations;
- timers and state;
- Automations;
- Connections;
- permission and authority rules;
- future Runtime history;
- results and Audit.

A future AI task can therefore work through a sequence such as:

```text
find the right person
-> read approved records
-> use an approved communication tool
-> wait for a reply
-> update the project state
-> report the result
```

The AI model can change over time. Continuum keeps the protected data, rules and history around it.

Only server-side policy changes authority.

# Spaces, Directory and Library

Continuum is intended to receive approved information through sources such as:

- Calendar;
- Email;
- messages;
- files;
- finance;
- APIs;
- MCP resources/tools;
- provider sync;
- webhooks;
- direct user input;
- future supported services and devices.

The backend should preserve where important information came from, when it was observed, how current it is and where it is allowed to be used.

Spaces can turn that state into focused Personal, Family, Business or continuity briefings.

Directory should be explained visually as a relationship map so a reader can see how people, organizations and saved groups fit together.

Library should be explained visually as saved content with version history and a direct Automation reference, for example:

```text
continuity.md
-> Draft
-> Version 1
-> Automation
```

Canonical backend semantics belong in:

`CMXChat/jay-app/specs/003-server-checkin/CONTEXT-INGESTION-PROVENANCE-BACKEND-CONTRACT.md`

# Automations and possibilities

Automations define when work becomes eligible and what approved actions should follow.

Connections expose capabilities such as communication, calendars, APIs, MCP tools, storage, business systems and future supported financial or device actions.

The public document should make the long-term possibilities understandable while labeling planned work clearly.

Representative directions include:

- a morning brief combining calendar, messages, weather, money, tasks and overnight changes;
- coordinating people across a project, including contact, reply tracking, follow-up and scheduling;
- money analysis using current balances, transactions and relevant communications;
- Email, Discord, WhatsApp Business, SMS and future voice calls;
- GitHub, Calendar, storage, productivity and business tools;
- APIs and MCP services;
- future supported financial execution under explicit policy;
- stronger AI models using the same approved context and tools;
- Afterlife continuity workflows.

Capability modes remain explicit and server-enforced. Human-facing explanations may use:

```text
See only
Ask first
Pre-approved limits
Owner only
```

Backend contracts may use more precise typed capability states.

# Afterlife timing truth

The live switch currently uses:

```text
protected check in
-> authoritative server timestamp
-> 72 elapsed hours
-> deadline
-> 24 elapsed hours grace
-> triggered Incident
```

**72h + 24h is the current production configuration. The timing remains policy-controlled.**

Phase 1 already supports:

- configurable primary check-in interval;
- configurable grace interval;
- immutable policy versions;
- current/current-window policy pointers;
- pause/resume;
- one-time deadline override;
- reconciliation;
- durable Incident snapshots and lifecycle;
- server-authoritative UTC/PostgreSQL timing;
- Audit and integrity protection.

On `/doc/`, explain this in ordinary language first:

```text
You choose the timing.
Current live setup: 72 hours + 24 hours extra grace.
Both values can be changed.
Every policy change keeps a history.
```

A triggered Incident currently records the state. External provider execution and AI coordination remain later Runtime work.

# Programming explanation

The page should teach the real stack with simple meanings:

```text
GitHub
where the code lives

Codespaces
browser-based development workbench

Frontend
what the user sees and taps

FastAPI / Python backend
server code that receives requests and checks rules

PostgreSQL
the database that keeps durable information

Docker
helps keep the development environment repeatable

Alembic
keeps database changes in order

OpenAPI generated client
helps frontend code call backend endpoints correctly
```

A request should be explainable as:

```text
user taps something
-> frontend sends HTTPS request
-> FastAPI checks identity/input/rules
-> PostgreSQL reads or saves data
-> FastAPI returns JSON
-> frontend updates the screen
```

Technical detail can live in a small expandable block so the first reading stays simple.

# Lab to product method

Accepted product work follows:

```text
Lab UX
-> write backend rules/contracts
-> PostgreSQL/domain service
-> protected FastAPI operation
-> accepted UI migrated into /checkin/
-> durable Runtime/provider execution after prerequisites exist
```

Plain-English version:

```text
try the idea
-> decide the rules
-> build the real server/data behavior
-> connect the screen to the protected API
-> ship it into the protected product
```

Do not turn Lab into a permanent second production application.

# First private information slice

The first real private-data milestone remains:

```text
create continuity.md
-> save ContentDraft in PostgreSQL
-> read the same Draft after refresh/session
-> stale-write-safe update
-> immutable ContentVersion v1
-> real LibraryFolder
-> protected PostgreSQL search
-> version/dependency Details
-> Automation Draft reference
-> no external side effect
```

The public document can explain this as proving one small private document all the way from the screen to the database and back before building more complicated execution.

# Final visual contract

Continuum-specific styling currently lives in:

- `assets/continuum-doc-final.css` for the main document visual system;
- `assets/continuum-doc-promise.css` for the hero opening promise and four-stage availability visual.

Preserve:

- light first paint;
- strong dark mode;
- sticky desktop contents rail;
- reading progress;
- print support;
- technical grid background and blue/violet visual language;
- real HTML/CSS/inline SVG diagrams;
- larger readable mobile copy;
- normal-flow mobile product maps;
- strong light-mode Afterlife contrast;
- a visually prominent Afterlife trigger point;
- process maps, timelines and meaningful charts;
- no heavy Canvas/WebGL presentation layer;
- reduced-motion support;
- no broad document-wide MutationObserver.

## Mobile navigation rule

The Contents button belongs inside the real top toolbar controls on mobile.

It must never float over the reading area, diagrams or cards.

The drawer can remain a dialog with the current section, eight section links, keyboard focus handling and swipe-to-close support.

## Mobile card rule

Phone cards should use the available content width.

Avoid narrow internal grids that turn normal sentences into one-word-per-line columns.

The AI journey is the reference example: one numbered marker outside the card, with the title and explanation using the rest of the card width.

The hero availability visual becomes one vertical connected track on phone so all four stages remain readable without horizontal squeezing.

## Semantic color rule

Use color to teach meaning consistently:

- blue = information and Continuum;
- violet = AI and authority;
- mint/green = approved action, safe state and Library knowledge;
- orange = timing, waiting and trigger attention;
- cyan = Connections and request flow;
- indigo = build/runtime depth.

Major sections may use subtle matching background washes. Cards should use color through icons, borders, connector lines and status chips while keeping text contrast strong.

## Visual teaching rule

Every major section should make sense from its visual before the reader studies the paragraph.

The current page intentionally includes:

- full product-intro paragraph covering information, people, tools, AI, briefings, communications, finance and continuity;
- WITH YOU -> FOR YOU -> WHEN YOU ARE AWAY -> IF YOU CANNOT RESPOND availability visual;
- connected Continuum product map;
- five-step plain-English operating loop;
- AI conversation vs AI-with-Continuum comparison;
- full-width AI journey cards on mobile;
- replaceable model strip;
- authority examples;
- Spaces ingestion map;
- Personal Brief preview;
- source/freshness strip;
- Directory relationship map;
- Library Draft -> Version -> Automation flow;
- API/MCP/Webhook/Runtime plain-English guide;
- color-coded Automation workflow;
- Connection catalog with channel-specific accents;
- capability control modes;
- six-card future possibilities board;
- configurable Afterlife timing chart;
- emphasized trigger timeline;
- continuity outcome cards;
- real programming stack;
- one-request walkthrough;
- optional technical stack detail;
- Lab-to-product build path;
- `continuity.md` vertical slice;
- color-coded NOW -> NEXT -> THEN -> LATER roadmap.

# Current routes

- `/spaces/` = active Spaces demonstration.
- `/lab/automations/` = active Automation UX proving ground.
- `/checkin/` = protected real Check In surface and future accepted Continuum features.
- `CMXChat/First-Repo` = static/public/prototype source.
- `CMXChat/jay-app` = FastAPI/React/PostgreSQL protected application/backend source.

# Current roadmap discipline

Near-term order stays:

1. finish the remaining Phase 1 acceptance observations;
2. build the real private information vertical slice;
3. complete typed Automation definitions;
4. migrate accepted Lab patterns into protected `/checkin/`;
5. add durable Runtime with a fake provider;
6. prove one real low-risk provider;
7. add workflow power;
8. add AI Task, Planner and bounded Agent in that order;
9. add MCP adapters and broader capabilities over the same typed services.

Do not let the ambitious public vision change the implementation order.
