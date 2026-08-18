# Continuum Product Identity and `/doc/` Contract - CURRENT

Date: 2026-08-18
Status: **Final `/doc/` design and editorial freeze**

# Product identity

**Continuum** is the umbrella product across Spaces, Check In, the Automation Lab and `jay-app`.

Use these names consistently:

- **Continuum** = the whole private information, automation, Connections, Runtime and AI environment.
- **Spaces** = focused briefings built from approved current information.
- **Directory** = people and organizations.
- **Library** = content, files and saved knowledge.
- **Automations** = rules for when something should happen and what should follow.
- **Connections** = approved ways to reach outside apps, APIs, MCP services and providers.
- **Runtime** = the server-side layer that will keep longer workflows moving and record what happened.
- **Afterlife** = **The Dead Man Switch**, built on the same timing, people, information, rules, Connections and future Runtime.
- **Check In** remains the protected application/backend program name in current code and specs.

# `/doc/` role

`https://db.cmxchat.com/doc/` is the master public noindex visual explanation of Continuum.

It should answer these questions in order:

1. What is Continuum?
2. Why is it useful beyond a normal AI chat?
3. How does information move through it?
4. How do Spaces, Directory and Library fit together?
5. How do Automations and Connections turn information into action?
6. How does Afterlife work?
7. What code makes it real?
8. What works now and what comes later?

The page uses eight reading sections:

1. Continuum in one minute;
2. what Continuum adds around AI;
3. Spaces, people and saved information;
4. Automations and possibilities;
5. Afterlife: The Dead Man Switch;
6. how the code works;
7. how ideas become real;
8. where Continuum can go.

# Opening promise

The hero explains the complete idea before architecture detail.

Canonical paragraph:

> Continuum brings your information, people, files, messages, services, automations and AI into one private environment that can understand what is happening, remember useful history, build briefings from connected sources, follow rules you set, use approved tools and keep important work moving over time. As more services connect through APIs, MCP and other providers, it can grow into something that helps coordinate people, follow up on projects, watch important changes, analyze money, communicate through email, messaging and future voice, and work with whatever AI models become more capable in the years ahead. The deeper idea is that your context, priorities and instructions have somewhere durable to live, so Continuum can remain useful when you are busy, offline or unavailable. Afterlife carries that idea further: if you stop checking in for the period you chose, Continuum can record the trigger and begin the continuity steps you prepared in advance, including contacting trusted people, releasing approved information and eventually coordinating approved work within the limits you already set.

The hero visually emphasizes the first sentence and the durable-context sentence without splitting the paragraph.

Directly below the product map, the availability visual stays:

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

# Capability status vocabulary

Public `/doc/` capability labels use four words only:

- **LIVE** = working with real protected state now.
- **LAB** = interactive design or proving surface.
- **NEXT** = next protected backend milestone.
- **LATER** = planned capability after the foundation.

Do not reintroduce public status words such as `MODELED`, `PLANNED`, `FUTURE`, `EXTENSIBLE`, `POLICY`, `WORKS TODAY` or `RUNTIME LATER` as capability-state labels.

Roadmap sequence labels `NOW`, `NEXT`, `THEN`, `LATER` are allowed because they describe build order, not capability status.

# Plain-English contract

A smart reader with no programming background should understand the main idea without searching technical terms.

Teach the idea before the terminology.

Examples:

```text
Database
-> the long-term place that keeps saved information

Runtime
-> the part that keeps a workflow moving after it starts

API
-> a doorway apps use to talk to each other

MCP
-> a standard that can let AI reach approved tools or information

Incident
-> a saved record of the trigger event
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

Meaningful explanations should not drop into micro-copy just to make a card smaller.

Final styling enforces roughly:

- important explanatory copy: 12px minimum on desktop;
- small status/technical labels: about 11.5px minimum;
- mobile explanatory copy: generally 13px or larger;
- phone cards use the available width instead of creating one-word-per-line columns.

The AI journey is the mobile reference pattern: numbered marker outside, full card width for the title and explanation.

# Core explanation

The operating loop remains:

```text
SEE WHAT IS HAPPENING
-> REMEMBER IT
-> CHECK THE RULES
-> DO APPROVED WORK
-> REMEMBER THE RESULT
```

The opening explains the promise. The first section explains the mechanics.

The first section heading is:

`How information moves through Continuum`

This avoids restarting the product explanation after the hero.

# AI contract

The public page directly answers:

`Why not just use AI by itself?`

Answer:

> AI can reason about what you give it. Continuum gives that reasoning persistent people, records, rules, timing, tools and history to work with.

The comparison should show a normal AI conversation beside an AI task working through Continuum context.

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

Spaces can turn approved information into focused Personal, Family, Business or Afterlife views.

The page shows sources such as:

- Calendar;
- Email;
- messages;
- money;
- files;
- APIs and MCP.

The Personal Brief is labeled as a **LAB preview**.

Directory is taught as a relationship map, using a simple project/person/trusted-group example.

Library is taught as saved content with history:

```text
Afterlife
-> continuity.md
-> Draft
-> Version 1
-> Automation
```

The backend should preserve source, observed time, freshness and allowed use for important incoming information.

Canonical backend semantics remain in:

`CMXChat/jay-app/specs/003-server-checkin/CONTEXT-INGESTION-PROVENANCE-BACKEND-CONTRACT.md`

# Automations and Connections

Automations define when work becomes eligible and what approved actions should follow.

The page must show both:

1. an ordinary-life example;
2. an Afterlife continuity example.

Ordinary example:

```text
WHEN
A client payment arrives

DO
Update the Money Space

THEN
Include it in tomorrow's brief
```

This is labeled as a **LATER example** so it does not imply live financial automation.

The continuity example remains:

```text
WHEN grace ends
-> DO Email Family
-> WAIT 15 minutes
-> DO another approved channel
-> THEN coordinate what happens next
```

Public Connection status examples currently use:

- Email = NEXT;
- Discord + messaging = LATER;
- SMS + voice = LATER;
- WhatsApp Business = LATER;
- APIs + MCP = LATER;
- Finance = LATER.

Capability-control explanations remain:

```text
See only
Ask first
Pre-approved limits
Owner only
```

# Afterlife truth

Current production timing:

```text
protected check in
-> 72 elapsed hours
-> deadline
-> 24 elapsed hours grace
-> triggered Incident
```

Public explanation:

> 72 + 24 is today's configuration. You choose these periods.

The current production values are policy-controlled, not permanent product limits.

Phase 1 already supports:

- configurable primary interval;
- configurable grace interval;
- immutable policy versions;
- current/current-window policy pointers;
- pause/resume;
- one-time deadline override;
- reconciliation;
- durable Incident snapshots and lifecycle;
- server-authoritative UTC/PostgreSQL timing;
- Audit and integrity protection.

On `/doc/`, technical terms are explained in plain language. Example:

`Incident = a saved record of the trigger event.`

The visual sequence remains:

```text
CHECK IN
-> TIMER
-> GRACE
-> TRIGGER
-> CONTINUE
```

The trigger is the visual climax. Blue/violet leads into an orange trigger state, followed by continuity outcomes.

Public Afterlife truth is grouped into:

- **LIVE** = protected Check In, timing controls, policy history, pause/resume, one-time deadline changes, recorded Incidents, protected sessions, server state repair and Audit.
- **LATER** = provider delivery, server-side waits, retries, replies, acknowledgements and approved AI coordination through Runtime.

# Programming explanation

The page keeps the real stack because it makes the product credible and helps non-technical readers learn what is actually happening.

Simple meanings:

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
keeps the development setup repeatable

Alembic
keeps database changes in order

OpenAPI generated client
helps frontend code call backend endpoints correctly
```

A request is explained as:

```text
user taps something
-> frontend sends HTTPS request
-> FastAPI checks identity/input/rules
-> PostgreSQL reads or saves data
-> FastAPI returns JSON
-> frontend updates the screen
```

Technical detail stays in the expandable block.

# Lab to product method

Accepted work follows:

```text
Lab UX
-> backend rules/contracts
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

The Lab must not become a permanent second production application.

# First private information slice

The next real private-data milestone remains:

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

# Roadmap explanation

Each stage must explain what becomes possible:

- **NOW**: Continuum can reliably know whether the owner checked in and which timing policy was active.
- **NEXT**: Continuum can safely remember real private information and use exact saved versions.
- **THEN**: Continuum can keep a workflow alive on the server after the user leaves the page.
- **LATER**: Continuum can coordinate more of the outside world through approved tools and stronger AI.

# Visual contract

Continuum-specific styling currently lives in:

- `assets/continuum-doc-final.css` for the main visual system;
- `assets/continuum-doc-promise.css` for the hero promise, availability visual and final readability/status polish;
- `assets/continuum-doc-qa.css` as the final screenshot-QA layer for rendered contrast, card density, Afterlife light mode and mobile header hardening.

Preserve:

- light first paint;
- strong dark mode;
- sticky desktop contents rail;
- mobile Contents control inside the real toolbar;
- reading progress;
- print support;
- real HTML/CSS/inline SVG diagrams;
- semantic blue/violet/mint/orange/cyan/indigo accents;
- no horizontal mobile overflow;
- readable mobile copy;
- strong light-mode Afterlife contrast;
- prominent orange trigger state;
- reduced-motion support;
- no broad document-wide MutationObserver;
- strict CSP with no inline `style` attributes.

## Screenshot QA rule

Rendered screenshots are part of acceptance. DOM presence and overflow tests are necessary, but they are not enough to approve the page visually.

A section fails visual QA if important text becomes faint, a status is hard to read, a card has large empty space with disconnected copy, a control overlaps the reading area, or light/dark mode loses the intended hierarchy.

Afterlife is the reference contrast case:

- normal light-mode titles use dark ink;
- supporting copy remains visibly darker than the card background;
- LIVE pills are readable blue/green states;
- the Trigger card uses a warm background with a dark title;
- timeline content stays grouped instead of spreading across oversized cards;
- mobile stacks the status below the copy without squeezing the content.

Regression guards:

- `tests/doc-visual-qa-smoke.test.js` checks the final QA stylesheet and source contract;
- `tests/doc-light-mode-visual-qa.spec.cjs` checks rendered desktop/mobile Afterlife contrast, density and overflow;
- `tests/doc-mobile-contents-e2e.spec.cjs` continues to protect toolbar navigation, drawer behavior and major responsive visuals.

Semantic color meanings:

- blue = information and Continuum;
- violet = AI and authority;
- mint/green = approved action, safe state and Library knowledge;
- orange = timing, waiting and trigger attention;
- cyan = Connections and request flow;
- indigo = build/runtime depth.

# Final visual inventory

The frozen page includes:

- full product-intro paragraph with selective emphasis;
- Continuum network map;
- WITH YOU -> FOR YOU -> WHEN YOU ARE AWAY -> IF YOU CANNOT RESPOND visual;
- LIVE / LAB / NEXT / LATER key;
- five-step information flow;
- direct `Why not just use AI by itself?` explanation;
- AI conversation vs Continuum comparison;
- replaceable model strip;
- owner-control panel;
- Spaces ingestion map;
- Personal Brief LAB preview;
- source/freshness strip;
- Directory relationship map;
- Library Draft -> Version -> Automation flow;
- API/MCP/Webhook/Runtime guide;
- ordinary Automation example;
- Afterlife continuity Automation example;
- Connection catalog;
- capability-control modes;
- six-card possibilities board;
- configurable Afterlife timing chart;
- trigger timeline;
- continuity outcome cards;
- programming stack;
- one-request walkthrough;
- optional technical detail;
- Lab-to-product build path;
- `continuity.md` vertical slice;
- NOW -> NEXT -> THEN -> LATER roadmap.

# Current routes

- `/spaces/` = active Spaces demonstration.
- `/lab/automations/` = active Automation UX proving ground.
- `/checkin/` = protected real Check In surface and future accepted Continuum features.
- `CMXChat/First-Repo` = static/public/prototype source.
- `CMXChat/jay-app` = FastAPI/React/PostgreSQL protected application/backend source.

# Current build order

Near-term order remains:

1. finish remaining Phase 1 acceptance observations;
2. build the real private-information vertical slice;
3. complete typed Automation definitions;
4. migrate accepted Lab patterns into protected `/checkin/`;
5. add durable Runtime with a fake provider;
6. prove one real low-risk provider;
7. add workflow power;
8. add AI Task, Planner and bounded Agent in that order;
9. add MCP adapters and broader capabilities over the same typed services.

# Freeze rule

`/doc/` is now considered design-complete.

Future changes should be limited to:

- correcting factual product truth;
- fixing accessibility, browser, responsive or rendered-contrast bugs;
- reflecting a capability that actually moved from LAB/NEXT/LATER to another state;
- replacing an outdated example after the underlying product changes.

Do not reopen the visual architecture, add more sections, add more capability cards, shrink text to fit more content, or rewrite the page into jargon-first product copy without a concrete product requirement.
