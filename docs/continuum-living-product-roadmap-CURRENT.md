# Continuum Living Product Roadmap - CURRENT

Date: 2026-08-22
Status: Canonical living product-direction roadmap
Scope: Product experience, user model, onboarding, intelligence, autonomy, portability, trust, future surfaces and sequencing

## How to use this document

This is the living roadmap for how Continuum should grow as a product. It captures product direction and future experience decisions without replacing narrower frontend contracts or protected backend architecture contracts.

Where this roadmap conflicts with a specialized security, authority, data-integrity, Runtime or backend contract, the specialized contract governs implementation semantics. Product ideas in this file do not imply that a capability is live.

This file should be revised as decisions change. Do not preserve an old idea only because it appears here.

Suggested roadmap status vocabulary:

- **IDEA** - worth exploring, not accepted as scheduled work.
- **PLANNED** - accepted direction, sequencing may still change.
- **BUILDING** - active implementation.
- **TESTING** - implemented enough for deliberate validation.
- **RELEASED** - available in the intended real product context.

## Product north star

Continuum should become a central, navigable map and living model of a person's digital world.

It should help a person understand what matters, find context, connect information across domains, preserve useful memory, work with people and tools, and act through permissions the person controls.

The product should feel increasingly aware of the user's world without turning into a collection of disconnected features.

A useful one-year outcome is:

> I do not waste time hunting for context. Continuum is where I can understand what is going on and move from there.

A useful product-pressure question is:

> If every other app disappeared for a day, what should Continuum still help me understand or do?

Success should be measured by depth, usefulness and coherence of understanding, not feature count.

## User intent first

Continuum should not impose a philosophy about what a person's life should become.

The user defines the goal. Continuum can help simplify life, improve organization, pursue a project, maintain continuity, coordinate family information, prepare for an emergency, manage work or pursue another objective when the user chooses that direction.

Do not turn ordinary product behavior into unsolicited therapy, wellness coaching or a claim that Continuum needs to fix the person.

User-defined reflection and progress views may exist when the user wants them.

## 1. Progressive onboarding and continuous learning

Onboarding should be modular, editable, skippable and progressive. It should not be one giant questionnaire.

### First-use foundation

Potential early questions include:

- name and preferred form of address;
- timezone and relevant locations/timezones;
- preferred contact methods;
- the user's immediate reason for using Continuum;
- current priorities or goals;
- a few closest or most important people;
- emergency contacts and relevant emergency roles;
- what kind of briefing or context would be useful first.

### First five-minute experience

The initial experience should aim for a small, credible aha moment:

1. understand one useful goal or intent;
2. identify a few important people or pieces of context;
3. optionally connect or import one useful source;
4. produce an immediate personalized snapshot, briefing, map or useful next view.

The user should receive value before Continuum asks for a large amount of information.

### Drip onboarding

Continuum should continue learning over time through low-friction, contextually relevant questions.

Examples:

- ask about a relationship when a person repeatedly appears in connected context;
- ask whether a recurring place is important;
- ask whether a repeated preference should be remembered;
- ask whether a newly connected source should contribute to a briefing or a specific domain;
- ask for missing information only when filling the gap has understandable value.

Avoid nagging, repetitive questioning and unnecessary forms.

### Import and connection paths

Prepare for information to enter Continuum through multiple approved paths, including:

- calendar connections;
- APIs;
- MCP servers;
- files and structured imports;
- other AI systems or exported AI context;
- external services and accounts;
- direct user entry;
- future approved data sources.

Every connection should have a clear scope and explain what value it adds.

## 2. The person model

Continuum should build one coherent underlying model of the user and their world.

This model can include, as permitted and useful:

- identity and profile facts;
- people and relationships;
- important places;
- important things/assets/entities;
- projects;
- goals and priorities;
- preferences, likes and dislikes;
- personal rules and boundaries;
- recurring routines and rhythms;
- durable memories and life events;
- current State;
- connected sources and provenance;
- relevant permissions and authority.

The model should evolve through corrections, new evidence and life changes.

## 3. People and relationship map

Directory should grow beyond a flat contact list into a relationship-aware model.

Possible relationship information includes:

- who someone is;
- how the user knows them;
- how close or important the relationship is;
- family, friend, professional or other roles;
- preferred contact methods;
- relevant shared projects, places, events or history;
- emergency-contact role;
- trusted-person role;
- sharing or authority boundaries where explicitly configured.

Relationships must not automatically create permission or authority.

The relationship map should help Continuum understand context while preserving explicit policy boundaries.

## 4. Memory and life timeline

Continuum should maintain a useful, reviewable timeline of meaningful events and durable memories.

The timeline can connect:

- people;
- projects;
- places;
- files;
- messages or observations;
- decisions;
- goals;
- changes in State;
- milestones;
- user-authored memories.

Memory should preserve provenance and allow correction. A model's conversational memory alone should never be treated as the only durable source of truth for consequential facts.

Continuum should adapt as the person's life changes across jobs, relationships, moves, family changes, projects and other life stages without forcing a fixed life-stage template.

## 5. Preferences, likes, dislikes and personal rules

Continuum should learn useful preferences without becoming a social-like system.

Potential preference examples:

- likes and dislikes;
- communication preferences;
- work preferences;
- travel preferences;
- interface preferences;
- preferred people or services for certain tasks;
- personal rules such as `no meetings after 6 PM`;
- recurring choices the user explicitly asks Continuum to remember.

Feedback should be lightweight. A quick correction, preference toggle, choice between alternatives or `remember this preference` action can teach Continuum without requiring constant surveys.

Preferences are guidance. They do not override hard policy, authority or security boundaries.

## 6. Goals, priorities and projects

Continuum should understand what the user is trying to accomplish, not only what information exists.

Future product layers should connect:

- goals and priorities;
- projects and workstreams;
- people involved;
- relevant knowledge/files;
- current blockers and State;
- deadlines and milestones;
- allowed tools/capabilities;
- progress and meaningful changes.

Goal behavior remains governed by the dedicated Goal/Mission architecture. Product UX should make the goal and its boundaries understandable without making the user decode backend terminology.

## 7. Places and things

The user's world includes more than people and documents.

Continuum should eventually support important places and things as first-class linked entities where useful, such as:

- home and work locations;
- frequently relevant places;
- vehicles;
- devices;
- properties;
- important accounts or services;
- equipment or assets;
- other user-defined entities.

These entities can connect to people, projects, memories, State and approved capabilities.

## 8. Life Map

A visual Life Map should be explored as a primary Continuum navigation model.

The purpose is to let a user move from a high-level view of their world into increasingly specific context.

Possible zoom path:

`Life → domain → entity → relationship/context → current State/history/actions`

The map may include domains such as Personal, Family, Work, Projects, Finance or other user-defined areas without forcing every user into the same categories.

The Life Map should expose relationships between information instead of duplicating every domain page inside one giant visualization.

## 9. Living dashboard / Home

Continuum Home should become a living snapshot of what matters now.

Potential content:

- important current State;
- upcoming commitments;
- waiting items;
- active goals/projects;
- relevant people;
- recent meaningful changes;
- useful briefings;
- missing information that blocks something important;
- pending approvals;
- opportunities worth surfacing;
- connection/source health when relevant.

The dashboard should adapt to the user's intent and context. It should not become a fixed productivity scorecard.

## 10. Context engine

Continuum needs a context layer that decides what information is relevant to the current moment, request, person, project or goal.

It should combine permitted durable knowledge, current State, time, relationships, source freshness, user preferences and task context.

The context engine should help answer questions such as:

- what matters right now;
- what changed;
- what is waiting;
- what does this person/project relate to;
- what information is stale or conflicting;
- what should be included in the current briefing;
- which context is relevant to the AI or capability being used.

Context selection should be inspectable for consequential uses and should respect privacy/permission scope.

## 11. Change feed: `Today changed because...`

Continuum should explore a concise change feed that explains meaningful changes in the user's world.

Examples:

- a deadline moved;
- a reply resolved a blocker;
- a new source changed Current State;
- a goal became at risk;
- an important person or project changed status;
- new information created an opportunity;
- a connection became unavailable.

The feed should prioritize meaningful changes over raw event volume.

## 12. Completeness and life gaps

Continuum should be able to show where its understanding is strong, thin, stale, contradictory or missing.

This is not a score of the person's life. It is a quality view of Continuum's information.

Possible states:

- well supported;
- incomplete;
- stale;
- conflicting;
- inferred;
- awaiting confirmation;
- disconnected source.

The product can use this to ask better questions and help the user decide what to connect or correct next.

## 13. Sources, provenance, uncertainty and correction

When practical, Continuum should be able to answer `Where did that come from?`

For important information it should preserve:

- source/provenance;
- timestamp/freshness;
- whether the information was directly observed, user-provided, derived or inferred;
- conflicts with other evidence;
- confidence/uncertainty where meaningful.

Lack of a perfect source should not force Continuum to remain silent. When it is making an inference or guess, it should say so clearly enough for the consequence involved.

Corrections should be easy and durable. If the user corrects an important fact or preference, Continuum should not casually revert to the old version because another model response remembered it differently.

## 14. Review and correction center

Create a dedicated place to inspect and repair what Continuum believes or uses.

Potential functions:

- recent learned facts;
- unresolved conflicts;
- stale information;
- inferred information awaiting confirmation;
- preference changes;
- relationship corrections;
- source attribution;
- delete/forget controls where supported;
- audit/history for meaningful changes.

The goal is fast correction, not database administration.

## 15. Characters / lenses

Continuum should support both character-like experiences and a shared underlying user model.

The shared model remains the durable source of context. Characters are lenses or interfaces over that shared model.

Examples might include:

- a financial lens;
- a travel-planning lens;
- a work/project lens;
- a research lens;
- a user-created character with a chosen voice or role.

A character should not become an isolated memory silo that fragments the user's truth.

This allows Continuum to learn from character-based systems such as the interaction patterns the user likes in Shapes-style experiences while preserving one coherent model underneath.

## 16. Reasoning, memory and skills as systems

Continuum should mature through reusable product systems instead of one-off AI features.

Core systems include:

- user/knowledge model;
- memory;
- State;
- context selection;
- reasoning;
- skills/capabilities;
- actions/Runtime;
- authority and policy;
- audit/provenance;
- characters/lenses.

A new model or character should be able to use these systems without requiring a new isolated architecture.

## 17. Consent first, then user-granted autonomy

Continuum should begin conservatively. New users should understand what a connection or Action can do before granting it meaningful access.

The long-term product should not require the user to approve every repetitive Action forever. The user should be able to grant bounded standing authority for the things they want Continuum to handle.

Suggested autonomy ladder:

1. **Observe** - read permitted information only.
2. **Suggest** - prepare recommendations or drafts.
3. **Ask then act** - require approval before a consequential Action.
4. **Act within granted scope** - execute without asking each time when policy explicitly permits it.
5. **Exceptional continuity authority** - separately configured fallback/emergency/legacy behavior with stronger safeguards.

Important rules:

- consent and scope come before autonomy;
- permissions must be revocable;
- stronger AI does not silently expand authority;
- connecting a source does not automatically grant Action permission;
- relationships do not automatically grant authority;
- meaningful Actions should remain auditable;
- emergency/continuity rules remain separate from ordinary convenience automation.

## 18. Trust, privacy, security and permissions

Trust should be designed into the product instead of added after the AI layer becomes powerful.

A future Trust / Privacy / Security surface should help the user understand:

- what Continuum knows;
- where information came from;
- which Sources are connected;
- what each Connection can read or do;
- which permissions are active;
- which Actions can occur automatically;
- what happened recently and why;
- what is shared with other people or systems;
- how to revoke access;
- how to correct, delete or export supported information.

No connection, model, character or discovered capability should silently gain broader privileges.

## 19. Sharing, family and professional access

Continuum should eventually support scoped sharing with trusted people and professionals where the user chooses it.

Potential use cases:

- family context;
- emergency contacts;
- trusted-person involvement;
- professional collaborators;
- advisers;
- caregivers or other explicitly authorized roles where appropriate.

Sharing should be granular. Access to one Space, project, file set or emergency function should not imply access to the entire person's Continuum.

## 20. Emergency and digital legacy planning

Continuum should support future emergency and long-term continuity planning as a distinct high-trust area.

Potential concepts:

- emergency contacts;
- who should be notified under defined conditions;
- what information can be revealed and when;
- prepared fallback authority;
- continuity instructions;
- long-term/digital legacy access;
- revocation and version history;
- clear separation between ordinary account sharing and exceptional continuity authority.

Existing Check In/Afterlife architecture remains the foundation for deterministic continuity semantics. This roadmap does not weaken its authority rules.

## 21. Bidirectional AI and data portability

Portability should become a core product direction.

### Into Continuum

Users should be able to bring useful context from external systems into Continuum through approved imports, APIs, MCP, files, AI exports and other supported sources.

### Out of Continuum

Users should be able to take useful Continuum context to other AI systems or tools instead of being locked in.

Potential export formats include:

- a human-readable context document;
- a selected profile/context bundle;
- structured JSON;
- prompt/profile bundles for another AI;
- API or MCP access to specifically authorized context;
- scoped domain exports such as a project, relationship set or timeline range.

Export security needs deliberate design because a convenient context bundle can contain highly sensitive information.

Potential safeguards include:

- explicit export scope;
- preview before export;
- redaction controls;
- sensitivity warnings;
- expiration/revocation where technically meaningful;
- audit history;
- clear separation between exporting a copy and granting ongoing access.

Portability should increase user control without turning the entire private model into one easy-to-leak file by default.

## 22. Opportunities as well as problems

Continuum should be capable of surfacing useful opportunities, not only warnings and failures.

Examples may include:

- a relevant opening connected to a goal;
- a useful introduction or relationship connection;
- a timing opportunity;
- a chance to combine work already in progress;
- information that makes a decision easier;
- a capability that could remove a recurring blocker.

Opportunity surfacing should respect the same source, permission and confidence rules as risk detection.

## 23. Learn the user's language

Continuum should learn how the user names and refers to their world.

This can include:

- nicknames;
- preferred terminology;
- project shorthand;
- how the user groups people or work;
- preferred communication style;
- corrections to ambiguous names;
- user-created categories.

The user should not have to continually translate their own life into Continuum's vocabulary.

## 24. Community and reusable templates - later candidate

A later community/template layer may allow people to share useful patterns without sharing their private personal model.

Possible reusable artifacts:

- character/lens templates;
- onboarding packs for a use case;
- automation templates;
- goal templates;
- Space/view templates;
- connection recipes;
- safe policy starting points.

This remains a later candidate. Governance, security, provenance and template trust need design before community content can influence consequential behavior.

## Candidate product surfaces

This is a product map, not a commitment that every concept needs a separate route.

| Surface | Purpose | Direction |
| --- | --- | --- |
| Home / Dashboard | Living current snapshot | Core |
| Life Map | Navigable model of the user's world | Core exploration |
| People & Relationships | People, roles, relationships, contact context | Core |
| Timeline / Memory | Durable life/project history | Core |
| Goals & Priorities | What the user wants to accomplish | Planned architecture |
| Preferences | Likes, dislikes, rules and choices | Planned |
| Projects | Linked work and context | Planned |
| Places & Things | First-class non-person entities | Planned |
| Connections / Sources | Approved external data and capabilities | Planned architecture |
| Review / Corrections | Repair facts, conflicts, staleness and inference | Core trust |
| Trust / Privacy / Security | Permissions, authority, sharing and audit | Core trust |
| Import / Export | Data and AI portability | Planned |
| Characters / Lenses | Specialized interfaces over shared context | Planned |
| Change Feed | Meaningful `what changed` view | Planned |
| Completeness / Gaps | Quality of Continuum's understanding | Planned |
| Emergency / Legacy | Exceptional continuity and prepared access | High-trust later layer |
| Community / Templates | Reusable patterns without private-data sharing | Later candidate |

Do not create a route only because a row exists here. Related concepts can live inside an existing surface when that produces a clearer product.

## Provisional build order

This sequence is intentionally revisable. It describes dependency direction, not a promise that every item in one phase must finish before any work in the next begins.

### Phase 0 - Durable foundation

Prioritize:

- identity/user model;
- protected data model;
- Directory identity/relationship primitives;
- permissions and authority;
- provenance/audit;
- Connections/source boundaries;
- security;
- current backend release and Runtime prerequisites already defined by canonical contracts.

### Phase 1 - Make Continuum know and orient

Prioritize:

- progressive onboarding;
- first-five-minute aha flow;
- Home/living snapshot;
- People & Relationships;
- Memory/Timeline foundation;
- connection/import UX;
- initial Life Map exploration;
- review/correction fundamentals.

### Phase 2 - Make Continuum understand context

Prioritize:

- context engine;
- goals/priorities UX on top of governed backend semantics;
- preferences, likes/dislikes and personal rules;
- projects;
- places/things;
- change feed;
- completeness/gaps;
- stronger provenance, conflict and uncertainty UX.

### Phase 3 - Make Continuum useful across roles and actions

Prioritize:

- reusable skills/capabilities;
- durable Runtime as architecture allows;
- autonomy controls;
- action history and management;
- characters/lenses over the shared model;
- opportunity detection;
- deeper adaptive briefings.

### Phase 4 - Make Continuum portable and shareable safely

Prioritize:

- structured import/export;
- AI context portability;
- scoped family/trusted-person/professional sharing;
- stronger Trust Center controls;
- emergency/legacy configuration;
- export redaction and security controls.

### Phase 5 - Ecosystem and deeper adaptation

Explore:

- community templates;
- shared character/workflow patterns;
- deeper life-stage adaptation;
- broader capability discovery;
- more sophisticated cross-domain intelligence;
- additional interfaces built on the same durable model.

## Product-level success criteria

Continuum is moving in the right direction when:

- the user can orient quickly without hunting across many systems;
- connected information becomes coherent context instead of a raw data dump;
- people, projects, memory, State and goals link together naturally;
- Continuum asks fewer, better questions as it learns;
- corrections stick;
- uncertainty is visible when it matters;
- the user can understand and control meaningful permissions;
- autonomy can increase without privilege silently expanding;
- changing AI models or characters does not fragment the user's durable context;
- the user can bring information in and take useful context out;
- product depth grows without turning navigation into an endless feature menu.

## Open decisions to revisit

Keep these explicit instead of accidentally settling them through UI implementation:

1. What must Continuum still help the user understand or do if every other app is unavailable for a day?
2. What is the exact minimum first-five-minute onboarding experience?
3. Which connections/imports should be offered during first use versus learned later?
4. What autonomy level should a new user start at, and how should standing authority be taught?
5. Which facts can Continuum infer quietly and which should require confirmation before consequential use?
6. How should conflicting sources be ranked, preserved and resolved?
7. Which memories should become durable automatically versus only after user confirmation?
8. What is the exact Life Map interaction model?
9. Which candidate surfaces deserve standalone routes and which belong inside existing views?
10. What should a portable AI context bundle contain by default?
11. Which export formats are needed first: human document, JSON, AI profile bundle, API/MCP or another form?
12. How should highly sensitive data be redacted or excluded from exports?
13. How should emergency authority differ from long-term digital legacy access?
14. What should be local/on-device versus server-side/cloud where architecture permits choices?
15. How should character/lens behavior be separated from durable factual memory and authority?
16. What community/template governance is required before third-party patterns can be trusted?
17. What product metric best represents `depth of useful understanding` without creating an artificial life score?

## Revision rule

This roadmap is intentionally alive.

When a meaningful product decision is accepted:

1. update this file if it changes product direction;
2. update the relevant specialized CURRENT contract when implementation semantics change;
3. keep current capability status truthful;
4. record unresolved questions instead of hiding them inside implementation;
5. remove or rewrite superseded ideas instead of accumulating contradictory roadmap text.

The goal is a Continuum roadmap that can change without losing the reasoning and boundaries that keep the product coherent.
