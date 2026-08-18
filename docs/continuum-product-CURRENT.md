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

It should explain, in one coherent document:

1. the whole Continuum information-to-action loop;
2. the practical difference between a standalone AI session and AI operating inside durable Continuum state;
3. Spaces;
4. information ingestion, provenance, freshness and task-specific context;
5. Automations and Runtime;
6. Connections, typed tools, APIs and MCP;
7. replaceable AI/model providers and server-side authority;
8. Afterlife: The Dead Man Switch;
9. the real engineering environment and programming stack;
10. the Lab → contract → backend → protected-product build method;
11. current production truth, immediate build focus and long-term capability direction.

The page is a product/architecture document, not a generic marketing landing page.

# Writing rules for `/doc/`

Keep the page concrete and technical enough to be credible while remaining readable to someone learning backend development.

Preserve these editorial rules:

- one H1;
- connected paragraphs;
- visuals do much of the teaching;
- no ellipses;
- no em dashes;
- avoid formulaic contrast copy such as `it's not X, it's Y` or `not X but Y`;
- avoid generic AI/SaaS slogans;
- avoid a forced tagline for every product area;
- explain real mechanisms and examples instead of making broad claims;
- label current production, active prototype and planned architecture truthfully.

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
- subtle motion only;
- reduced-motion support;
- no broad document-wide MutationObserver;
- no heavy canvas/WebGL presentation layer;
- mobile layout must remain usable on Samsung/Chrome-class devices.

`assets/continuum-doc.css` is the Continuum-specific visual layer loaded after the existing `/doc/` styles.

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

The public document now includes the receive → normalize → context side of the architecture because input quality is as important as output capability.

Canonical backend semantics belong in:

`CMXChat/jay-app/specs/003-server-checkin/CONTEXT-INGESTION-PROVENANCE-BACKEND-CONTRACT.md`

That contract should govern APIs, MCP resources, webhooks, sync, provenance, freshness, observations/events/messages, context building and feedback from Runtime results.

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
