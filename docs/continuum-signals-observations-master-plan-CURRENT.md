# Continuum Signals & Observations Master Plan — CURRENT

Date: 2026-08-19
Status: Canonical product direction for observed external signals; architecture preparation only, no broad online monitoring is live

# Purpose

Continuum should eventually be able to watch approved outside sources, notice meaningful changes, preserve the evidence, let AI interpret what was observed, and feed a typed Signal into Automations, Spaces and the wider Context layer.

Examples:

- mention of a company/person/topic appears in approved news/search sources;
- a monitored webpage changes;
- a GitHub/check/status event occurs;
- a feed publishes something relevant;
- a provider value crosses a threshold;
- several observations together suggest something important.

The product should feel simple to the user:

`Watch this → tell me when this matters → optionally do approved work`

Underneath, Continuum must preserve provenance, freshness, dedupe, source health, authority and Runtime boundaries.

Core rule:

**Online information can wake Continuum up. It cannot give Continuum permission.**

# Product relationship

- **Directory** = who;
- **Library** = saved information;
- **Signals** = what Continuum has observed changing outside or across connected sources;
- **Automations** = what should happen when typed conditions are met;
- **Connections** = approved access to outside providers/sources;
- **Runtime** = what actually executes and gets recorded;
- **AI** = bounded interpretation/planning using approved evidence and tools.

Bird's-eye loop:

`OBSERVE → NORMALIZE → REMEMBER → INTERPRET → MATCH → PREFLIGHT → ACT → RECORD`

# What the user may eventually create

A future user-facing **Watch** could sound like:

- “Watch for mentions of CMX in news.”
- “Tell me if this page changes meaningfully.”
- “Watch this GitHub repo for failed checks.”
- “If this company appears in new search results, add it to tomorrow's brief.”
- “If three credible sources start discussing this topic, flag it.”
- “If this status changes to degraded, run my incident workflow.”

The UI should hide infrastructure complexity while still showing what source is being watched, how often/currently it is checked, and why a Signal fired.

# Core product concepts

## Source

The approved place Continuum observes.

Examples later:

- provider/API;
- webhook;
- RSS/feed;
- webpage;
- search/news provider;
- GitHub;
- public status page;
- approved MCP resource.

## Observation

A source-backed fact or snapshot recorded at a particular time.

Examples:

- page hash/content at 08:31;
- result appeared in a search query;
- GitHub check changed to failed;
- status page changed from operational to degraded.

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
- GitHub check failed.

A Signal is what Automations and Spaces should normally consume instead of raw webpage/provider bodies.

## Watch

A user-defined thing Continuum should pay attention to.

A Watch can eventually define:

- subject/topic;
- sources;
- match/filter logic;
- change threshold;
- freshness requirements;
- optional bounded AI interpretation;
- cooldown/dedupe;
- Automation/briefing behavior.

# Automations relationship

Signals become a future Trigger family.

Simple product examples:

`WHEN Signal: page changed → DO AI summarize → DO Manual review`

`WHEN Signal: company mention detected → IF priority is high → DO Notify me`

`WHEN Signal: GitHub check failed → DO AI inspect approved context → DO Save incident note`

The Capability Catalog should eventually surface signal-oriented triggers alongside provider-native triggers.

Possible trigger labels:

- Signal watch matched;
- Page changed;
- Mention detected;
- Status changed;
- Threshold crossed;
- New feed item;
- supported GitHub/provider event.

They remain **LATER** until protected source/Signal services and Runtime exist.

# AI relationship

AI can eventually help in two different places.

## Interpret observations

Examples:

- summarize what changed;
- classify relevance;
- extract entities;
- decide whether multiple results describe the same event;
- assign a typed priority/category;
- create a briefing summary.

The model's output is a derived interpretation with evidence refs.

## Planner creates Watches

A user may eventually say:

“Watch news and public web results for my company, add meaningful mentions to my morning brief, and notify me if something looks urgent.”

Planner should turn that into a typed reviewed Change Plan such as:

- create Signal Watch;
- attach approved source types;
- configure filters/AI interpretation;
- create Automation Draft;
- set Signal trigger;
- add AI Task / Review / Notify Actions;
- show missing Connections/Runtime/authority in preflight.

Natural language never creates unrestricted crawling/network authority.

# Provenance UX

Every meaningful Signal should be explainable.

The UI should eventually answer:

- What did Continuum see?
- Where did it see it?
- When did it see it?
- Is the source current/healthy?
- What changed?
- Which observations support this Signal?
- Was the conclusion deterministic or AI-derived?
- Which Automation used it?

This should feel closer to an evidence trail than a mysterious AI alert.

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
- source freshness/health separate from importance.

# Web page changes

A useful page watcher should not simply compare raw HTML bytes.

Desired path:

`fetch approved page → safe normalize → compare prior representation → determine meaningful change → optionally AI summarize → emit page.changed Signal`

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
- change AuthorityGrant;
- trigger arbitrary provider work;
- grant itself credibility.

Signal interpretation is bounded by the same authorized Context/AI tooling as the rest of Continuum.

# Connections

Some Signals use public sources. Others require authenticated Connections.

Examples:

- GitHub private repository events;
- connected monitoring provider;
- project/task systems;
- email/provider events;
- private APIs.

Credentials remain server-side. Signal payloads carry stable Connection/source refs, never raw tokens.

# Spaces / briefings

Signals should become a strong input to Spaces.

Examples:

- “3 meaningful company mentions since yesterday”;
- “Website pricing page changed”;
- “Production status degraded”;
- “New GitHub failures overnight”;
- “No source refresh in 8 hours.”

Briefing cards should distinguish evidence from AI interpretation and preserve source links/refs.

# Directory relationship

Signals may refer to People/Organizations when protected identity resolution exists.

A mention can link to an existing Organization. Ambiguous matches remain review issues and must never silently merge/create identities.

# Library relationship

A user can later choose to save selected Signal evidence/research into Library.

Do not make every observation a permanent Library document automatically.

# Runtime boundary

Signal detection and Automation execution are different systems.

`Signal emitted → Automation eligible → Conditions/preflight → Runtime Run → approved Actions`

A Signal never directly sends, publishes, edits or calls providers.

# Current implementation boundary

Current Continuum Lab does **not**:

- crawl arbitrary websites;
- run public web searches automatically;
- monitor news continuously;
- poll arbitrary URLs;
- interpret online content with a live model;
- emit production Signals;
- start production Runs from Signals.

This plan exists so we do not paint ourselves into the wrong architecture while building Directory, Planner and Automations.

# Backend companion

Canonical backend plan:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-SIGNALS-OBSERVATIONS-PLATFORM-PLAN.md`

Existing provenance foundation:

`CMXChat/jay-app/specs/003-server-checkin/CONTEXT-INGESTION-PROVENANCE-BACKEND-CONTRACT.md`

# Recommended build order

1. preserve the current Phase 2A backend release boundary;
2. mature protected Directory/Library/Automation services;
3. prove one narrow read-only source + provenance path;
4. store normalized Observations for that source;
5. add one deterministic Watch/Signal type;
6. expose a definition-only Signal Trigger in protected Automation authoring;
7. after durable Runtime exists, allow that Signal to start a Run;
8. add bounded AI interpretation;
9. widen sources incrementally;
10. add Planner-created Watches and multi-source correlation later.

The first real implementation should be narrow and explainable, not a giant crawler.