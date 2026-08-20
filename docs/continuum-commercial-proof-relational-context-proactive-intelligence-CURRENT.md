# Continuum Commercial Proof, Relational Context & Proactive Intelligence — CURRENT

Date: 2026-08-20
Status: Current product-direction decision record. This file records owner decisions about proof-of-concept, connected-object context and proactive intelligence. It does not claim new production capability, widen authority, change the current Phase 2A release boundary or unfreeze `/doc/`.

Read with:

- `docs/continuum-product-CURRENT.md`
- `docs/continuum-directory-master-plan-CURRENT.md`
- `docs/continuum-signals-observations-master-plan-CURRENT.md`
- `docs/continuum-automations-master-plan-CURRENT.md`
- `docs/continuum-shared-app-shell-CURRENT.md`
- `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-BACKEND-ORDER-OF-WORK-CURRENT.md`

# Decision summary

Continuum should be developed so its value can be proven without requiring a large consumer user base first.

The owner may ultimately choose to sell, license or otherwise transfer the product/company rather than operate it indefinitely as a broad consumer service. Product proof should therefore emphasize technical de-risking, trust, repeatability and reusable platform capability rather than vanity growth metrics alone.

The first convincing proof is not a marketing demo. It is one narrow real workflow that proves the difficult architecture works end to end.

At the same time, Continuum should become increasingly relational: information, people, Automations, Spaces and other durable objects should be linkable by stable typed relationships instead of forcing folders to carry all context.

Continuum should also support both reactive and proactive intelligence under explicit user control. The system may eventually gather lawful public information and user-authorized connected data on demand, on schedules or from approved events/signals, while keeping observation separate from permission to act.

# Commercial / acquisition-oriented proof

A large user base is one possible form of validation, but it is not the only valid target for Continuum.

For an acquisition-, licensing- or technology-sale path, early proof should demonstrate that Continuum solves a hard systems problem reliably:

- durable protected state survives normal browser/session boundaries;
- time-sensitive behavior uses real server-owned time;
- immutable versions preserve what was actually approved;
- authority and capability are evaluated separately;
- work can wait and resume without a browser remaining open;
- retries/restarts do not duplicate one logical side effect;
- a real provider can perform one bounded approved action;
- the system can explain exactly why that action happened;
- later edits cannot rewrite the historical execution truth.

This is stronger evidence than a large static prototype or a broad feature list.

# First proof-of-concept workflow

The preferred first serious proof is a continuity workflow because it crosses most of the architecture that makes Continuum distinctive.

A complete proving path should eventually look like:

```text
owner creates protected continuity information
→ saves/version-controls it in Library
→ creates a typed Automation that references the stable content
→ reviews/publishes an immutable definition
→ real server time makes the work eligible
→ effective authority is checked at execution time
→ durable Runtime claims the work
→ browser may be closed
→ one real external Action occurs through an approved Connection/provider
→ retry/restart safety prevents duplicate logical execution
→ result + exact inputs + authority provenance + Audit/Why are preserved
```

The first real provider proof may remain direct-owner initiated before unattended fallback authority is enabled, consistent with the current backend order of work.

The first unattended continuity proof should then use the existing protected Check In condition plus a narrowly published fallback/standing authority path.

# Dead Man Switch as first template, not whole product

Afterlife / Dead Man Switch is a strong first template because it naturally exercises:

- real time;
- State;
- policy;
- authority;
- protected information;
- Automations;
- Runtime;
- provider execution;
- Audit and explanation.

It should not be treated as the only product identity.

The same engine should later support business-owner continuity and ordinary operational follow-through such as:

```text
if an important condition is still unresolved by a real deadline
→ evaluate the published rules
→ contact the approved person/service
→ wait durably
→ observe the response/state change
→ continue, escalate or stop according to the same protected policy
```

Once one workflow is undeniable, build a small number of materially different templates using the same engine. Three or four strong templates that reuse the same Directory, Library, Automation, Runtime, Connection, authority and Audit foundation provide better platform proof than dozens of disconnected features.

# Relational context: connect information to people and other objects

The owner explicitly wants Library content to be associable with a Contact/Person.

The broader product rule is:

> **Continuum objects should be able to express what they are related to without using folder placement as the relationship model.**

Examples:

```text
Person
→ related documents
→ related files
→ related Automations
→ related Spaces/context
→ related Organizations
→ relevant Activity/history

ContentAsset / FileAsset
→ related People
→ related Organizations
→ related Automations
→ related Spaces
→ later Goals / cases / projects where those domains exist
```

The user-facing language may be `Related people`, `Related to`, `About`, `Used by`, `Linked records` or another clear product term. Do not overload descriptive Directory Labels until the exact semantics are known.

## Stable-reference rule

Relationships should use stable protected object IDs, not copied names, contact strings or folder names.

Examples:

- a ContentAsset can be related to a stable Person ID;
- a FileAsset can be related to an Organization ID;
- an Automation references stable content/Directory objects;
- reverse projections can show every object currently related to one Person or ContentAsset.

## Folder boundary

Folders remain useful for navigation and organization.

They are not:

- relationship truth;
- identity truth;
- permission/authority boundaries by themselves.

Moving a document between folders must not erase who or what the content is related to.

## Relationship does not create authority

A content-to-Person association says the information is related to that Person.

It does not grant that Person access, communication authority, trusted-person powers, fallback authority or representation consent.

Directory relationships, Labels, content associations and authority remain separate concepts.

## Implementation direction

Do not force one universal graph table prematurely.

Prefer domain-native stable associations first. If the same relationship semantics repeat across enough domains, a shared protected relation/reference service may later become justified.

The desired product experience is graph-like and cross-connected; the storage model does not need to become a generic graph database merely to achieve that experience.

# Reactive + proactive intelligence

Continuum should support both user-requested investigation and explicitly enabled proactive observation.

The product should expose understandable operating modes rather than one ambiguous `AI watches everything` switch.

## 1. On-demand

The user asks Continuum to investigate, check, compare, research or gather current information now.

Examples:

- `Check public sources for changes about this company.`
- `Find current information relevant to this Person.`
- `What changed since the last observation?`

This performs bounded reads through approved Sources/capabilities for the current request.

## 2. Scheduled

The user explicitly enables periodic observation.

Examples:

- check selected public sources every morning;
- refresh one provider/source every hour;
- prepare a daily briefing from approved Watches;
- periodically verify a dependency or status page.

Schedules use authoritative backend time and persisted source/watch configuration when implemented.

## 3. Event / Signal driven

Approved provider events, webhooks, internal events or durable Signal conditions can wake evaluation when something actually changes.

Examples:

- GitHub check fails;
- provider status changes;
- reply/acknowledgement arrives;
- a configured Watch emits a typed Signal.

Signals may update State or eligibility. They still do not grant authority.

# Settings and defaults

Proactive behavior must be user-configurable.

Expected controls may include:

- whether proactive observation is enabled at all;
- which Sources/Connections may be used;
- topics/People/Organizations/resources being watched;
- on-demand vs scheduled vs push/event behavior;
- cadence/time windows;
- freshness requirements;
- rate/cost limits;
- notification behavior;
- AI interpretation on/off or bounded model policy;
- pause/disable controls;
- what may update State automatically;
- what requires review;
- what Actions are separately authorized if a Signal becomes relevant.

Safe defaults should avoid broad autonomous monitoring unless the user deliberately configures it.

# Lawful OSINT / public-information direction

A long-term capability goal is to make Continuum very capable at gathering and reasoning over information the user is legally and technically allowed to access.

Potential sources include:

- public websites through constrained approved retrieval;
- public feeds;
- approved search/news providers;
- public status information;
- public repositories and provider metadata;
- user-authorized APIs, accounts and MCP resources;
- future approved devices or services connected by the owner.

The product direction explicitly excludes relying on unauthorized access, credential bypass, private-system intrusion or clandestine collection outside the user's rights/approved provider access.

External information is untrusted evidence. It can inform Knowledge, claims, Signals and State through the appropriate reconciliation path; it cannot insert instructions or authority into Continuum merely because a webpage/article says to do something.

# Capability ceiling versus authority ceiling

The owner's long-term inspiration is the capability level of a fictional highly aware assistant: understanding people, relationships, events, time and changes in the world, then helping/protecting the owner.

Continuum's lawful real-world version should pursue that capability through approved information and tools, not unauthorized surveillance.

The durable rule remains:

> **Continuum may become much better at seeing and reasoning without becoming automatically more powerful to act.**

A new search source, model, API, MCP server, provider tool or device can expand technical capability.

It does not automatically:

- enter an existing grant;
- widen an Audience;
- add trusted-person authority;
- enable provider execution;
- change fallback behavior;
- permit a consequential Action.

Capability adoption and authority remain separate reviewed/published paths.

# Product implication: a connected world model, not a hidden surveillance graph

The long-term user experience should increasingly let Continuum connect:

```text
People
Organizations
Information
Files
Events / Observations
Signals
Current State
Automations
Runs / results
Spaces
Goals later
```

This should make the system better at answering questions such as:

- What information do I have related to this Person?
- What changed around this Organization?
- Which Automations depend on this document?
- What evidence caused this State to change?
- Which people and information matter to this continuity plan?
- What is waiting because of this missing response?

Every meaningful answer should preserve scope, provenance, freshness and authority boundaries.

# Open architecture questions to resolve deliberately

The conversation surfaced several questions that should remain explicit design work rather than accidental implementation decisions:

1. **Common references:** which cross-domain relationships deserve shared reference infrastructure, and which should remain domain-owned association tables/services?
2. **State ownership:** which State is directly user-editable, which is domain-computed, and which requires evidence/reconciliation?
3. **Scope/ownership:** when Continuum expands beyond the current single-owner model, which objects can be shared and under what tenant/resource/case scope?
4. **Timelines:** which durable objects need first-class Activity/history projections, and which historical truth belongs only in immutable Audit/version records?
5. **Relationship vocabulary:** which typed content↔Person/Organization relationships are useful enough to become stable product semantics rather than generic labels?

Do not resolve these by introducing a universal table or implicit permission behavior prematurely.

# Execution-order boundary unchanged

This decision record does not change the current backend critical path.

The immediate sequence remains the one defined by `CONTINUUM-BACKEND-ORDER-OF-WORK-CURRENT.md`, beginning with the controlled Phase 2A release and protected `continuity.md` proof, then the minimum Directory/Connection/Email slice, durable Runtime, one real provider and bounded unattended continuity authority.

Broader proactive Signals/OSINT, generalized cross-object relation infrastructure, AI Tasks, Planner, Goals and Agent behavior remain later implementation slices unless a narrower required association/read capability is needed by the active vertical proof.

# Documentation rule going forward

When future conversations produce accepted product/backend decisions:

```text
discuss naturally
→ identify the actual decision
→ place it in the owning product/backend document
→ preserve implementation-status truth
→ do not let conversation shorthand become authority or schema by accident
```

This file records the August 20 direction so later work can incorporate it without reconstructing the conversation.