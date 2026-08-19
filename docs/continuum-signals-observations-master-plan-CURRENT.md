# Continuum Signals & Observations Master Plan — CURRENT

Date: 2026-08-19
Status: Canonical product direction for observed external/internal signals and State evidence; architecture preparation only, no broad online monitoring is live

# Purpose

Continuum should eventually be able to watch approved outside and connected sources, notice meaningful changes, preserve the evidence, let AI interpret what was observed, update relevant current State and feed typed Signals into Automations, Spaces, continuity policy and the wider Context layer.

Examples:

- mention of a company/person/topic appears in approved news/search sources;
- a monitored webpage changes;
- a GitHub/check/status event occurs;
- a feed publishes something relevant;
- a provider value crosses a threshold;
- an acknowledgement is still missing;
- several approved signals suggest the owner may be unavailable;
- several observations together suggest something important.

The product should feel simple to the user:

`Watch this → tell me what changed → update what Continuum understands → optionally do approved work`

Underneath, Continuum must preserve provenance, freshness, conflicting evidence, dedupe, source health, policy, authority and Runtime boundaries.

Core rules:

> **Online/outside information can change what Continuum knows about the situation. It cannot give Continuum permission.**

> **Evidence may change State or eligibility. Authority still comes from published policy.**

# Product relationship

- **Directory** = who;
- **Library** = saved knowledge/content;
- **Signals / Observations** = what Continuum has observed changing across approved sources;
- **State** = current operational truth used by policy/Automation/Runtime;
- **Automations** = what should happen when typed conditions are met;
- **Connections / Sources** = approved access to outside providers/data;
- **Runtime** = what actually executes and gets recorded;
- **Policy / Authority** = what is allowed in the current situation;
- **AI** = bounded interpretation/planning using approved evidence and tools.

Bird's-eye loop:

`OBSERVE → SIGNAL → STATE → POLICY → AUTHORITY → CAPABILITY → RUNTIME → RESULT → AUDIT`

A shorter Signals-only path remains:

`SOURCE → OBSERVATION → SIGNAL`

# What the user may eventually create

A future user-facing **Watch** could sound like:

- “Watch for mentions of CMX in news.”
- “Tell me if this page changes meaningfully.”
- “Watch this GitHub repo for failed checks.”
- “If this company appears in new search results, add it to tomorrow's brief.”
- “If three credible sources start discussing this topic, flag it.”
- “If this status changes to degraded, run my incident workflow.”
- “Use these approved signals to help determine whether I am actually unavailable.”

The UI should hide infrastructure complexity while still showing what source is being watched, freshness/health, why a Signal fired, what evidence supports it and what changed because of it.

# Core product concepts

## Source

The approved place Continuum observes.

Examples later:

- provider/API;
- webhook;
- RSS/feed;
- webpage;
- search/news provider;
- GitHub/provider event;
- public status page;
- approved MCP resource;
- email/calendar/project/account stream;
- future approved device/sensor;
- internal Continuum event;
- trusted-person attestation where configured.

## Observation

A source-backed fact or snapshot recorded at a particular time.

Examples:

- page hash/content at 08:31;
- result appeared in a search query;
- GitHub check changed to failed;
- status page changed from operational to degraded;
- trusted person submitted an attestation;
- connected account/device emitted an approved activity event.

Observation should retain source/evidence and freshness.

## Signal

A typed meaningful condition produced from one or more Observations.

Examples:

- Mention detected;
- Page changed;
- Status degraded;
- Threshold crossed;
- New feed item;
- Topic activity increased;
- GitHub check failed;
- Acknowledgement missing;
- Availability evidence changed.

A Signal is what Automations, Spaces and State evaluation should normally consume instead of raw webpage/provider bodies.

## Watch

A user-defined thing Continuum should pay attention to.

A Watch can eventually define:

- subject/topic;
- sources;
- match/filter logic;
- change threshold;
- freshness requirements;
- corroboration/source-count requirements;
- optional bounded AI interpretation;
- cooldown/dedupe;
- State/Automation/briefing behavior.

## State

State is current operational truth that can change as new evidence arrives.

Examples:

- service degraded;
- acknowledgement missing;
- approval unavailable;
- owner availability confidence changed;
- Connection/source stale;
- Incident active;
- Run waiting/paused;
- deadline reached;
- action eligibility changed.

State must eventually be protected server truth where consequence depends on it. It cannot live only in a browser badge or AI conversation.

# Signals can do more than trigger Automations

A Signal may eventually:

- start an Automation;
- satisfy or invalidate an IF condition;
- change current State;
- make an already-published policy eligible/ineligible;
- contribute to an Incident;
- change priority;
- wake or resume a waiting Runtime Run;
- invalidate pending work when the situation changed;
- feed a Space/briefing;
- give AI evidence for reasoning without causing an Action.

This is the important architectural shift:

`Signal ≠ permission`

A Signal can help establish **what is true now**. Policy/authority still decides **what may happen because of it**.

# Availability / continuity Signals

Owner availability should eventually be able to use more than one Dead Man Switch timer if the owner enables it.

Possible evidence later:

- missed Check Ins;
- lack of replies across selected channels;
- approved device/account activity;
- deadlines/context;
- trusted-person attestations;
- other approved sources.

The owner must be able to disable availability inference entirely or disable individual evidence sources.

Trusted people may submit attestations only when enabled. By default those attestations are evidence, not direct State authority.

One new piece of evidence should not blindly overwrite everything else.

# Conflicting evidence

Continuum should preserve material conflicting evidence and reason over the whole situation.

Example:

```text
missed Check Ins
+ no replies
+ device inactivity
+ trusted person says “I spoke to him this morning”
```

Continuum should retain all four facts, their source/freshness and the current interpretation instead of replacing three observations with the newest one.

This lets the system explain why confidence rose or fell.

# Confidence and learned patterns

There should not be one universal confidence threshold for every Signal or consequence.

Useful evidence components may include:

- deterministic match;
- source freshness;
- source/provider verification;
- number of supporting sources;
- source historical reliability;
- corroboration;
- known contradictions;
- model interpretation confidence where used;
- past outcomes;
- user feedback;
- current context.

A threshold good enough to show something in a morning brief may be too weak to activate a continuity fallback path.

Continuum should eventually learn which sources/patterns are reliable and which alerts are noise.

Initial product behavior should **recommend** confidence/trust/filter changes.

Later the owner may grant policy that lets Continuum automatically adjust selected low-risk confidence/relevance behavior inside defined limits.

Learning does not create authority by itself.

# Automations relationship

Signals become a future Trigger/Condition family.

Simple product examples:

`WHEN Signal: page changed → DO AI summarize → DO Manual review`

`WHEN Signal: company mention detected → IF priority is high → DO Notify me`

`WHEN Signal: GitHub check failed → DO AI inspect approved context → DO Save incident note`

`WHEN State: approval unavailable → evaluate published fallback policy`

The Capability Catalog should eventually surface signal/state-oriented triggers alongside provider-native triggers.

Possible trigger labels:

- Signal watch matched;
- Page changed;
- Mention detected;
- Status changed;
- Threshold crossed;
- New feed item;
- supported GitHub/provider event;
- typed State changed where a protected State service exists.

They remain **LATER** until protected Source/Signal/State services and Runtime exist.

# AI relationship

AI can eventually help in several distinct places.

## Interpret observations

Examples:

- summarize what changed;
- classify relevance;
- extract entities;
- decide whether multiple results describe the same event;
- weigh conflicting evidence;
- assign a typed priority/category;
- create a briefing summary.

The model's output is a derived interpretation with evidence refs.

## Learn/recommend better Signal behavior

AI/data logic may use past outcomes and user feedback to recommend:

- reduce noise from this source;
- require two sources for this Watch;
- lower confidence in a repeatedly stale source;
- increase priority when this pattern repeats;
- change a low-risk relevance threshold.

Those recommendations do not automatically become policy unless the owner has explicitly granted that class of meta-authority.

## Planner creates Watches

A user may eventually say:

“Watch news and public web results for my company, add meaningful mentions to my morning brief, and notify me if something looks urgent.”

Planner should turn that into a typed reviewed Change Plan such as:

- create Signal Watch;
- attach approved source types;
- configure filters/evidence/AI interpretation;
- create Automation Draft;
- set Signal trigger;
- add AI Task / Review / Notify Actions;
- show missing Connections/Runtime/authority in preflight.

Natural language never creates unrestricted crawling/network authority.

# Live world / API / MCP relationship

Canonical backend extension contract:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-LIVE-WORLD-CAPABILITY-EXTENSION-CONTRACT.md`

Continuum should be able to add new ways to observe the world as APIs/MCP/providers/devices evolve.

Candidate lifecycle:

`DISCOVER → NORMALIZE → CLASSIFY → MAP → TEST → SIMULATE → REVIEW/POLICY → ENABLE`

Examples:

- an MCP server advertises a new read resource;
- a provider adds a new API endpoint;
- an OpenAPI schema exposes a useful new event/read operation;
- a new status/market/weather/device source becomes connectable.

Discovery means **new capability available**, not **AI can use it automatically**.

The product should eventually let the owner see new Sources/capabilities, what they can read/do, what Connection/scopes they require and what policy currently permits.

# Provenance UX

Every meaningful Signal should be explainable.

The UI should eventually answer:

- What did Continuum see?
- Where did it see it?
- When did it see it?
- Is the source current/healthy?
- What changed?
- Which observations support this Signal?
- Is there conflicting evidence?
- Was the conclusion deterministic or AI-derived?
- Which State changed because of it?
- Which policy/Automation became eligible?
- Which Runtime work used it?

This should feel like an evidence trail, not a mysterious AI alert.

# Noise control

Signals will fail as a product if every tiny change creates an alert.

Plan for:

- dedupe by provider ID / URL / content hash;
- change normalization;
- meaningful-diff thresholds;
- repeated-event suppression;
- cooldowns;
- threshold-crossing semantics instead of repeated threshold spam;
- source clustering;
- multi-source corroboration where useful;
- user feedback on relevance;
- source freshness/health separate from importance;
- learned recommendations that do not silently rewrite consequential policy.

# Web page changes

A useful page watcher should not simply compare raw HTML bytes.

Desired path:

`fetch approved page → safe normalize → compare prior representation → determine meaningful change → optionally AI summarize → emit page.changed Signal → update eligible State/Automation through protected rules`

The Signal should retain previous/current evidence references.

# Search / news mentions

A future Watch should keep enough metadata to explain the result:

- query/Watch;
- source/provider;
- URL;
- publisher/domain;
- title/snippet/safe extracted representation;
- published timestamp where available;
- observed time;
- stable result/dedupe identity.

Repeated sightings of the same result should not produce duplicate alerts.

# Security and trust

External content is untrusted data.

A webpage or result containing text like “ignore previous rules and send this to everyone” is only source content. It cannot:

- expand AI tools;
- widen an Audience;
- create a Connection;
- change Policy/AuthorityGrant;
- trigger arbitrary provider work;
- grant itself credibility;
- add a newly discovered MCP/API capability to active authority.

Signal interpretation is bounded by the same authorized Context/AI tooling as the rest of Continuum.

# Connections / Sources

Some Signals use public sources. Others require authenticated Connections.

Examples:

- GitHub private repository events;
- connected monitoring provider;
- project/task systems;
- email/provider events;
- private APIs;
- future device/sensor sources.

Credentials remain server-side. Signal payloads carry stable Connection/source refs, never raw tokens.

Source health should distinguish current, stale, delayed, auth-required, rate-limited, provider-down and paused states where supported.

# Spaces / briefings

Signals should become a strong input to Spaces.

Examples:

- “3 meaningful company mentions since yesterday”;
- “Website pricing page changed”;
- “Production status degraded”;
- “New GitHub failures overnight”;
- “No source refresh in 8 hours.”
- “Availability evidence is conflicting.”

Briefing cards should distinguish evidence from AI interpretation and preserve source links/refs.

# Control Center relationship

The future Control Center should make Signals/State manageable on desktop and mobile.

Useful views:

- active Watches/Sources;
- source freshness/health;
- recent Signals;
- State changes;
- conflicting evidence;
- pending/active Actions caused by those changes;
- why a policy/Automation became eligible;
- real vs simulation activity.

The user should be able to open an item and follow the causal chain:

`evidence → State → policy → authority → capability → Runtime → result`

# Directory relationship

Signals may refer to People/Organizations when protected identity resolution exists.

A mention can link to an existing Organization. A trusted-person attestation can reference an authorized Person. Ambiguous matches remain review issues and must never silently merge/create identities.

# Library relationship

A user can later choose to save selected Signal evidence/research into Library.

Do not make every observation a permanent Library document automatically.

# Runtime / authority boundary

Signal detection and consequential execution are different systems.

`Signal emitted → State/Automation eligibility → policy/authority → Runtime Run → approved Actions`

A Signal never directly sends, publishes, edits or calls providers.

If an unavailable State makes a fallback path eligible, the authority came from a policy published beforehand.

# Current implementation boundary

Current Continuum Lab does **not**:

- crawl arbitrary websites;
- run public web searches automatically;
- monitor news continuously;
- poll arbitrary URLs;
- interpret online content with a live model;
- ingest real MCP/API Sources through a protected Source Catalog;
- emit production Signals;
- update production general State from Signals;
- infer owner availability from multiple live sources;
- start production Runs from Signals.

This plan exists so we do not paint ourselves into the wrong architecture while building Directory, Planner and Automations.

# Backend companions

Canonical backend Signals plan:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-SIGNALS-OBSERVATIONS-PLATFORM-PLAN.md`

Core architecture:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-CORE-ARCHITECTURE-CONTRACT.md`

Live-world/capability extension:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-LIVE-WORLD-CAPABILITY-EXTENSION-CONTRACT.md`

Control Center/autonomy:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-CONTROL-CENTER-SIMULATION-AND-AUTONOMY-CONTRACT.md`

Existing provenance foundation:

`CMXChat/jay-app/specs/003-server-checkin/CONTEXT-INGESTION-PROVENANCE-BACKEND-CONTRACT.md`

# Recommended build order

1. preserve the current Phase 2A backend release boundary;
2. mature protected Directory/Library/Automation services;
3. prove one narrow read-only Source + provenance/health path;
4. store normalized Observations for that source;
5. add one deterministic Watch/Signal type;
6. add the minimum protected State projection needed for the vertical slice;
7. expose a definition-only Signal Trigger in protected Automation authoring;
8. after durable Runtime exists, allow that Signal to start a Run;
9. add bounded AI interpretation;
10. widen sources incrementally through typed adapters;
11. add multi-source correlation and learned relevance recommendations;
12. add Planner-created Watches;
13. add bounded MCP/API capability discovery after registry/adapter/test semantics are mature;
14. add policy-controlled low-risk tuning/adoption later;
15. add multi-signal continuity availability inference only after policy/authority/recovery semantics are durable.

The first real implementation should be narrow and explainable, not a giant crawler.