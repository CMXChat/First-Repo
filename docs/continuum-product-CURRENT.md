# Continuum Product Identity and Overview - CURRENT

Date: 2026-08-18
Status: Canonical frontend/product naming and `/doc/` contract

# Product identity

**Continuum** is the umbrella product across Spaces, Check In, the Automation Lab and `jay-app`.

Use these names consistently:

- **Continuum** = private context, automation, Runtime, Connections and bounded AI under one control plane.
- **Spaces** = briefing/context experience for approved personal, family, business and continuity information.
- **Automations** = typed Trigger, Rule, Action, Timing and Review definitions.
- **Connections** = provider, API and MCP access to outside information and capabilities.
- **Runtime** = durable Runs, waits, retries, attempts, approvals, acknowledgements, limits and results.
- **Afterlife** = **The Dead Man Switch**, using the same timing, information, people, policy, Automation, Connection, authority and Runtime architecture when the owner stops responding.
- **Check In** remains the protected application/backend program name in current code and specs.

# `/doc/` role

`https://db.cmxchat.com/doc/` is the master public noindex visual explanation of Continuum.

The finished page uses eight reading sections:

1. Continuum in one minute;
2. AI inside Continuum;
3. Spaces and incoming context;
4. Automations and Connections;
5. Afterlife: The Dead Man Switch;
6. the programming stack;
7. Lab to protected-product build path;
8. current build order.

The page teaches through process maps, network diagrams, product-style UI, status graphics and short explanations. A normal reader should understand the product before reaching the deeper engineering material.

# Final visual architecture

Continuum-specific `/doc/` styling is consolidated into:

`assets/continuum-doc-final.css`

The page no longer loads the earlier Continuum v1, v2 or mobile-v3 visual layers.

Shared document infrastructure remains in the existing `/doc/` base files for:

- light/dark theme;
- sticky desktop contents rail;
- compact mobile Contents drawer;
- reading progress;
- print behavior;
- accessibility and reduced motion.

The final page intentionally includes:

- central Continuum network with connected Directory, Spaces, Library, AI, Connections, Automations and Runtime modules;
- five-stage Receive -> Store -> Policy -> Act -> Audit process map;
- current production Check In state summary;
- replaceable AI gateway over the same protected context and tools;
- server-side capability/authority examples;
- Spaces ingestion and provenance visual;
- Personal Brief preview;
- Automation workflow timeline;
- Connection catalog and authority modes;
- configurable Afterlife timing/policy visual;
- emphasized Incident trigger;
- approved continuity outcome branches;
- browser -> FastAPI -> PostgreSQL request flow;
- Lab -> contract -> backend -> protected API -> `/checkin/` build path;
- first `continuity.md` private-data slice;
- NOW -> NEXT -> RUNTIME -> LATER roadmap.

# Mobile visual contract

The Samsung review established these permanent rules:

- mobile product maps use normal CSS flow;
- the desktop absolute-positioned map never controls phone layout;
- the mobile Contents control stays compact and sits outside reading content;
- the desktop `Active development` rail panel is hidden on phone;
- mobile touch targets remain comfortably readable;
- important processes become vertical timelines on narrow screens;
- compact horizontal card lanes are allowed where they reduce unnecessary page height;
- light-mode Afterlife uses strong light-mode contrast;
- the Incident trigger receives stronger visual emphasis than ordinary timing steps;
- Runtime remains visible in the product map;
- HTML, CSS and inline SVG provide the visual layer;
- Canvas/WebGL-heavy presentation stays out of this page;
- broad document-wide MutationObserver behavior stays prohibited because of the proven Samsung freeze.

# Afterlife timing truth

The 72h + 24h values are the **current production configuration**. They are not a permanent product limit.

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

The current production policy is:

```text
protected check in
-> authoritative server timestamp
-> 72 elapsed hours
-> deadline
-> 24 elapsed hours grace
-> triggered Incident
```

`/doc/` must label 72h + 24h as the current production policy while showing that interval and grace are configurable now.

Provider execution, durable waits/retries, acknowledgements, inbound replies and autonomous coordination remain later Runtime work.

# Core product loop

```text
RECEIVE
-> NORMALIZE
-> STORE
-> BUILD CONTEXT
-> APPLY POLICY
-> REASON / DECIDE
-> ACT
-> OBSERVE RESULT
-> UPDATE STATE
```

Continuum receives approved information from people, files, APIs, MCP, provider sync, webhooks and future supported sources. The backend keeps identity, source, time, freshness and permissions with durable state.

Spaces can reduce that state into a current Brief. AI can retrieve an approved task-specific slice. Automations define when work becomes eligible. Runtime later carries eligible work through execution, waits, retries, replies and final results.

# AI and authority

The durable application environment owns:

- People and Organizations;
- Groups and Audiences;
- Library content and files;
- source provenance and freshness;
- Conversations;
- Automation definitions and immutable versions;
- Connections;
- capability policy;
- AuthorityGrants;
- Runtime history;
- results and Audit.

AI models are replaceable reasoning providers over that environment. Human UI, AI tools and future MCP adapters use the same typed domain services and server-side authority rules.

Capability modes can represent:

- read only;
- approval required;
- bounded standing authority;
- owner control.

The same architecture can later support supported banking, payment or trading actions and person-mediated coordination when explicit policy, provider support and safeguards exist.

# Current routes and build method

- `/spaces/` = active Spaces demonstration.
- `/lab/automations/` = active Automation UX proving ground.
- `/checkin/` = protected real product surface.
- `CMXChat/First-Repo` = current public/static/prototype source.
- `CMXChat/jay-app` = FastAPI/React/PostgreSQL protected application/backend source.

Accepted work follows:

```text
Lab UX
-> backend contract
-> PostgreSQL/domain service
-> protected FastAPI operation
-> accepted UI in /checkin/
-> durable Runtime/provider execution after prerequisites
```

# Writing rules for `/doc/`

Preserve:

- one H1;
- connected paragraphs;
- short section introductions;
- visuals doing most of the teaching;
- no ellipses;
- no em dashes;
- no formulaic `it's not X, it's Y` or `not X but Y` copy;
- no generic AI/SaaS slogans;
- no forced tagline for every product area;
- truthful labels for production, prototype and planned work;
- real mechanisms and examples instead of broad claims.

The smoke test enforces the main editorial patterns.

# Long-term capability direction

Continuum is designed to grow with APIs, MCP ecosystems, communication providers, devices and stronger AI models.

Potential capability families include:

- Email;
- SMS/MMS;
- WhatsApp Business;
- Discord;
- Slack, Teams and Telegram;
- push notifications;
- voice and phone;
- Calendar and productivity systems;
- files and storage;
- GitHub and development tools;
- CRM, support, accounting and e-commerce;
- infrastructure and monitoring;
- banking, credit and brokerage analysis;
- supported transaction/trading capabilities under explicit policy;
- person-mediated coordination through approved contacts;
- external MCP resources and tools;
- future device and data sources.
