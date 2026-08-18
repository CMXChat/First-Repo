# Continuum Product Identity and Overview — CURRENT

Date: 2026-08-18
Status: Canonical frontend/product naming and public-overview contract

# Product identity

**Continuum** is the umbrella product/system being built across the existing Spaces, Check In, Automation Lab and `jay-app` work.

Use these names consistently:

- **Continuum** = the overall private context, automation, Runtime, Connections and bounded-AI control plane.
- **Spaces** = the briefing/context experience that turns approved information into a useful current view for a person or group.
- **Automations** = typed definitions for triggers, rules, Actions, timing and review.
- **Connections** = provider/API/MCP access to outside data and capabilities.
- **Runtime** = durable execution history and orchestration: Runs, waits, retries, provider attempts, approvals, acknowledgements, limits and results.
- **Afterlife** = **The Dead Man Switch**, the continuity experience that uses the same timing, information, people, Automation, Connection, authority and Runtime architecture when the owner stops responding.
- **Check In** remains the current protected application route/backend program name in code and existing specs. Do not perform a broad technical rename merely because the umbrella product now has a name.

# `/doc/` role

`https://db.cmxchat.com/doc/` is the master public noindex visual explanation of Continuum.

The current document is intentionally **visual-first and shorter than the earlier architecture-heavy version**. It uses eight main reading sections:

1. Continuum in one minute;
2. why AI has more leverage inside durable Continuum state;
3. Spaces and incoming context;
4. Automations, Connections, tools and authority;
5. Afterlife: The Dead Man Switch;
6. the real programming and engineering environment;
7. the Lab → contract → backend → protected-product build path;
8. current production truth and the ordered direction from here.

The page still carries the deeper architecture through diagrams, product-style previews and concrete examples. It should feel understandable to a normal reader before it feels comprehensive to an engineer.

The page is a product/architecture document, not a generic marketing landing page.

# Reading hierarchy

Preserve three levels of depth:

```text
FIRST SCREEN
what Continuum is + the main product map

FAST TOUR
receive → remember → reason → act → update
why durable state gives AI more leverage
Spaces / Automations / Connections / Afterlife

DEEPER READER
programming stack
backend boundaries
Lab → production method
current vs next vs later
```

A reader should understand the basic idea without reading every paragraph.

# Writing rules for `/doc/`

Keep the page concrete and technical enough to be credible while remaining readable to someone learning backend development.

Preserve these editorial rules:

- one H1;
- connected paragraphs;
- visuals do much of the teaching;
- short section introductions;
- no ellipses;
- no em dashes;
- avoid formulaic contrast copy such as `it's not X, it's Y` or `not X but Y`;
- avoid generic AI/SaaS slogans;
- avoid a forced tagline for every product area;
- explain real mechanisms and examples instead of making broad claims;
- label current production, active prototype and planned architecture truthfully;
- avoid restoring long architecture prose when a diagram already teaches the same thing.

# Visual rules

Keep the high-quality document visual system inherited from the original Spaces `/doc/`:

- light first paint;
- strong dark mode;
- sticky desktop contents rail;
- mobile Contents drawer;
- reading progress;
- print support;
- CMX/Intel-like blue and restrained violet accents;
- technical grids, architecture maps and real product-style UI previews;
- varied section rhythm so every section does not look like the same card grid;
- subtle motion only;
- reduced-motion support;
- no broad document-wide MutationObserver;
- no heavy canvas/WebGL presentation layer;
- mobile layout must remain usable on Samsung/Chrome-class devices.

Visual layers:

- `assets/continuum-doc.css` = Continuum foundation visuals;
- `assets/continuum-doc-v2.css` = current visual-first, shorter-document refinement.

The current page intentionally includes these teaching visuals:

- Continuum system orbit;
- one-minute operating loop;
- AI-session vs Continuum-environment comparison;
- provenance/freshness example;
- Personal Brief preview;
- Automation workflow + Connection catalog;
- authority examples;
- Afterlife timeline;
- browser/API/database programming stack;
- Lab-to-product build path;
- compact current / Lab / next / later roadmap.

# Core product explanation

Continuum receives approved information from people, files, APIs, MCP, provider sync, webhooks and future supported sources. The backend normalizes that information into durable protected state with identity, source, time, freshness and permissions attached.

Spaces can reduce that state into a current Brief. AI can retrieve an approved task-specific slice and reason over it. Automations can define when work becomes eligible. Runtime can eventually execute approved Actions, wait, retry, receive replies, enforce limits and preserve what happened. Results can update state and affect the next Brief or decision.

Conceptual loop:

```text
RECEIVE
→ NORMALIZE
→ REMEMBER
→ BUILD CONTEXT
→ REASON
→ DECIDE
→ ACT
→ OBSERVE RESULT
→ UPDATE STATE
```

# Why the AI layer becomes more useful

The durable application environment owns:

- People and Organizations;
- Groups/Audiences;
- Library content and files;
- records and source provenance;
- current state and freshness;
- Conversations;
- Automations and immutable versions;
- Connections;
- tool/capability policy;
- AuthorityGrants;
- Runtime history;
- results and Audit.

AI models are replaceable reasoning providers over that environment. A stronger future model can use the same protected state and typed tools without rebuilding the user's world from prompt history.

# Ingestion/context direction

The public document includes the receive → normalize → context side of the architecture because input quality is as important as output capability.

Canonical backend semantics belong in:

`CMXChat/jay-app/specs/003-server-checkin/CONTEXT-INGESTION-PROVENANCE-BACKEND-CONTRACT.md`

That contract governs APIs, MCP resources, webhooks, sync, provenance, freshness, observations/events/messages, context building and feedback from Runtime results.

# Current routes and build method

- `/spaces/` = active Spaces demonstration.
- `/lab/automations/` = active Automation UX proving ground.
- `/checkin/` = protected real product surface for server-backed Check In and later accepted Continuum capabilities.
- `CMXChat/First-Repo` = current static/public/prototype source.
- `CMXChat/jay-app` = FastAPI/React/PostgreSQL protected application/backend source.

Accepted product work follows:

```text
Lab UX
→ backend contract
→ PostgreSQL/domain service
→ protected FastAPI operation
→ accepted UI migrated into /checkin/
→ durable Runtime/provider execution only after its prerequisites exist
```

Do not turn Lab into a permanent second production application.

# Long-term adaptability

Continuum is intended to grow as APIs, MCP ecosystems, communication providers, devices and AI models improve.

Potential capability families include:

- Email;
- SMS/MMS;
- WhatsApp Business;
- Discord;
- Slack/Teams/Telegram;
- push notifications;
- voice/phone;
- Calendar and productivity systems;
- files/storage;
- GitHub and development tools;
- CRM/support/accounting/e-commerce;
- infrastructure and monitoring;
- banking/credit/brokerage read and analysis;
- explicitly supported transaction/trading capabilities under strong policy;
- person-mediated coordination through approved contacts;
- external MCP resources/tools;
- future data/device sources.

Capability availability remains explicit and server-enforced. The architecture can represent read-only, approval-gated, standing pre-authorized and owner-only capability modes without allowing AI to create its own authority.
