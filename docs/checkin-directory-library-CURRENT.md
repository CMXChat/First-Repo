# Continuum Directory, Audiences, Library & Planner — CURRENT

Date: 2026-08-18
Status: Current cross-domain frontend handoff; Directory v2 + typed Planner preview v2, Automations v5 model/Planner, Audience v4.1 and typed data/input routing active in Lab; production backend expansion pending

# Read this with

- `checkin-context-handoff-CURRENT.md` — current cross-repository truth;
- `continuum-directory-master-plan-CURRENT.md` — durable Directory direction;
- `continuum-automations-master-plan-CURRENT.md` — Automation model/product direction;
- `checkin-automations-frontend-CURRENT.md` — exact focused Automations implementation truth;
- `checkin-library-premium-CURRENT.md` — Library projection/product direction;
- `checkin-content-editor-CURRENT.md` — native content/editor direction;
- `checkin-files-CURRENT.md` — binary File direction;
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-DIRECTORY-PLATFORM-PLAN.md` — backend Directory plan;
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md` — cross-domain Planner / Change Plan contract.

Current files beat older CRM/Audience/Automation prototypes when they conflict.

# Cross-domain model

```text
Directory = who
Library = what information
Automations = what should happen
Runtime = what actually happened
AI / Planner = typed help using the same domain services
```

Core relationship:

```text
Person / Organization / Group / Label
        ↓ stable selectors
Automation Draft / Version
        ↓ future Run eligibility
server resolves current authorized People + data
        ↓
freezes exact execution inputs
        ↓
Runtime / provider later
```

AI does not create a second contact store, workflow format or Library model.

# Directory v2 Lab truth

The main `/lab/` Records area renders **Directory v2** over browser-local prototype state.

Active files:

```text
assets/lab/lab-crm.js
assets/lab/lab-directory-v2.js
assets/lab/lab-directory-v2.css
assets/lab/lab-directory-v2-polish.css
assets/lab/lab-directory-planner-preview.js
assets/lab/lab-directory-planner-preview.css
```

Shared prototype store:

`cmx-lab-crm-v1`

Directory navigation state:

`cmx-lab-directory-ui-v2`

The visible object types are:

- People;
- Organizations;
- Groups / saved audiences.

Current Lab demonstrations include:

- search and useful views;
- strong Person / Organization / Group profiles;
- many-Organization Person membership;
- multiple ContactMethods/readiness;
- Labels;
- explicit Person relationships;
- notes and user-facing Activity;
- Groups composed from Person / Organization / Label selectors;
- unique-Person Group resolution;
- email/phone readiness;
- duplicate warnings;
- Automation usage links;
- responsive desktop/mobile layouts;
- light/dark mode;
- **AI setup / Continuum Planner preview**.

Production must use typed protected server models/services instead of these browser shapes.

# Directory identity rules

## Person

A Person is a stable human identity. Email, phone, Organization membership, Labels and names are mutable attributes or relationships, not the identity itself.

## Organization

A stable organization identity that may have many Person memberships.

## PersonOrganizationMembership

Production remains many-to-many. The Lab may mirror old `orgId` compatibility fields, but one scalar Organization ID is not the durable model.

## ContactMethod

Email and phone become durable endpoint records with stable ID, type, normalized/display value, preferred/active/readiness state and provenance.

## Label

Descriptive metadata only. A Label does not grant permission or authority.

## Group

A saved audience distinct from Label and Organization.

Current Lab selectors may reference:

- Person;
- Organization;
- Label.

Resolution deduplicates by stable Person ID.

Nested Groups remain deferred.

## PersonRelationship

Explicit Person-to-Person relationship context such as family, partner, lawyer, doctor, accountant, emergency contact or business partner.

Relationship type does not silently grant authority.

# Directory Planner preview v2

The Directory command bar includes **AI setup**, but the modal now presents itself as a broader **CONTINUUM PLANNER · PREVIEW**.

Browser marker:

`data-lab-directory-planner="typed-v2"`

The contract is:

`Describe → typed Change Plan → Preflight → Review → Apply`

Current safety boundary:

- no AI/model call;
- no arbitrary free-text interpretation;
- no data mutation;
- no production API;
- no hidden authority;
- no provider execution.

The free-text field shows the **contract only** because there is no model connected.

Fixed examples show the typed operation vocabulary a real Planner should eventually use.

Current operation examples include:

```text
directory.match_or_create_people
directory.match_people
directory.match_organizations
directory.upsert_membership
directory.upsert_relationship
directory.apply_label
directory.upsert_group
library.create_folder
library.create_document
automation.create_draft
automation.reference_audience
automation.reference_content
automation.add_wait
```

The preview explicitly shows blockers instead of making them disappear.

Examples include:

- **Family setup** — resolve People, apply Family Label, create/update Family Group, expose it as an Automation Audience;
- **Business contacts** — resolve People/Organizations, memberships, relationships and operations Groups;
- **Continuity setup** — resolve emergency People, create Groups, create an Automation Draft, reference Audiences and propose an inter-step WAIT;
- **Full Continuum setup** — coordinate Directory + Library + Automations in one typed Change Plan.

The Full Continuum example proves the intended cross-domain shape:

```text
resolve People
→ create Groups
→ create Continuity Library folder/document
→ create Automation Draft
→ reference Audience selectors
→ reference content
→ add inter-step WAIT
```

It is still a fixed product example, not generated AI output.

# Change Plan rule

A real future Planner should not freestyle-mutate tables or DOM state.

It should return a structured proposal with:

- allowlisted operation type;
- stable protected references or plan-local temporary references;
- requested field/config changes;
- expected effects;
- deterministic validation/readiness;
- duplicate/conflict information;
- risk/approval requirements;
- dependency order.

A single plan may span Directory, Automations and Library, but each operation is still executed by the owning protected domain service.

Prompt text expresses intent. It does not grant authority.

# Automations v5 relationship

The focused `/lab/automations/` route now has a canonical browser `workflowV5` model underneath its accepted authoring UX.

Conceptual ordered flow:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

Start timing and recurrence remain separate policies.

The simple user-facing rail remains:

`WHEN → IF → DO → WAIT → TEST`

V5 is useful for Directory/Planner integration because Audience selectors and later Planner changes can target explicit typed workflow positions instead of relying only on UI-screen order.

**Do not copy the browser `workflowV5` JSON into the production backend.** It is Lab authoring/model truth only.

# Automations Planner v5 proving surface

The focused Automation Planner now goes beyond a dead-end mock modal, while remaining explicitly non-AI.

Files:

```text
assets/lab/lab-automations-planner-v5.js
assets/lab/lab-automations-planner-v5.css
```

It uses a small local deterministic matcher for a few supported examples and labels the result:

- `TYPED PLAN PREVIEW · LOCAL`;
- `NO AI CALL`.

It shows:

1. **ORDERED V5 FLOW**;
2. **CHANGE PLAN** typed Automation operations;
3. **PREFLIGHT** blockers.

Example conceptual operation names include:

```text
automation.create_draft
automation.set_trigger
automation.set_preconditions
automation.add_action
automation.add_condition
automation.add_wait
automation.set_finish
```

`Use this draft` creates a normal editable browser Draft and normalizes it through `CMXAutomationModelV5`.

This is a proving adapter only. It does not call a model, backend, provider or Runtime.

# One Planner language across Continuum

Directory and Automations now deliberately share the same product vocabulary:

```text
INTENT
→ TYPED CHANGE PLAN
→ PREFLIGHT
→ REVIEW
→ APPLY through normal protected services
```

The current prototypes differ only because they prove different parts:

- Directory Planner uses fixed cross-domain examples and never interprets free text;
- Automations Planner uses a tiny local deterministic pattern matcher and can create an ordinary Lab Automation Draft;
- neither is the real future AI Planner.

The future protected Planner should replace both proving adapters with one server-backed planning/tool layer while preserving these semantics.

# Audience v4.1

Communication Actions in the focused Automation Lab can compose selectors from:

- Person;
- Organization;
- Group;
- Label.

Prototype intent uses `audienceSelectors[]`.

Current browser behavior:

- expands selectors using browser Directory state;
- deduplicates by Person ID;
- previews email/phone readiness.

Compatibility `targetRef` / `targetLabel` fields remain scaffolding for the older v3 editor.

Production needs canonical protected server Audience resolution/readiness.

# Typed data and input routing

## Intelligence v4.2

Actions can select friendly typed values from:

- Trigger data;
- earlier Action outputs;
- Directory/Audience context.

Current Directory examples include:

- resolved People count;
- email-ready count;
- phone-ready count.

Compatibility store:

`cmx-lab-automation-data-bindings-v1`

These are typed references, not executable expressions.

## Input Routing v4.3

A typed source can be assigned to a specific receiving Action field.

Examples:

- Email subject/body;
- AI Task context/focus;
- notification message data;
- Manual Review context.

Prototype Action intent uses `inputBindings[]` with `targetField` plus typed source reference.

Compatibility store:

`cmx-lab-automation-input-bindings-v1`

Direction:

`typed source output → named compatible receiving input`

Production validates source/output/input compatibility using server capability schemas.

# Advanced flow and Directory

Inter-step IF/WAIT authoring currently exists in the Automation Lab.

Important distinction:

- top-level IF = rule evaluated before Actions begin;
- inter-step IF = can use output from an earlier Action;
- start Timing = when the Action sequence may start;
- inter-step WAIT = future persisted delay between Actions.

The v4.4 UI now reads/writes inter-step controls through the v5 model first.

Current inter-step IF is a **linear gate only**. There is no YES/NO branch graph yet.

Inter-step WAIT is `RUNTIME REQUIRED` and is never executed by a browser sleep.

# Library boundary

Native protected content direction:

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

Binary direction:

`FileAsset → immutable FileVersion → private object storage`

Directory may later project stable associations to Library items. Automation publication freezes exact immutable content/file versions where reproducibility requires it.

Folders organize content. They are not permission boundaries.

Current Directory Planner examples may mention `library.create_folder` / `library.create_document` only as future typed Change Plan operations. The Lab does not execute them.

# Contact readiness

Identity resolution and channel readiness remain separate.

A Person may exist without a usable email/phone. A Group may resolve People with mixed readiness.

Production preflight should return deterministic counts and per-Person reasons before Publish/Run.

Future Runtime freezes exact recipient/contact endpoints used by the Run so historical execution does not change when Directory data later changes.

# Duplicate / merge direction

Current Lab warnings may use exact normalized email/phone collisions.

Production duplicate handling should be conservative.

Merge remains an explicit high-impact mutation. AI cannot silently merge People because names look similar.

# Activity and Audit

Directory Activity is a user-facing history projection.

Immutable security Audit remains a separate protected concept.

Future Planner apply should write appropriate Activity/Audit provenance showing what was proposed, approved and actually changed.

# Production backend boundary

Current production still has no general:

- Directory v2 persistence;
- canonical Group/Label Audience resolver;
- typed multi-selector Automation Audience service;
- typed Automation data/input-routing service matching Lab;
- server v5-equivalent sequence model;
- inter-step WAIT/Condition execution;
- Automation Runtime;
- provider delivery;
- Planner/Change Plan execution.

The already validated Phase 2A Library + typed Automation source is still pending deliberate production migration/deployment.

Do not widen production truth because the Lab can model or display these concepts.

# Backend order

After the current Phase 2A release boundary, grow durable domains in bounded slices:

1. Person + Organization;
2. PersonOrganizationMembership;
3. ContactMethod;
4. Label + Group selectors;
5. canonical Audience resolution/readiness;
6. typed Automation Audience/input contracts as their capability schemas become real;
7. protected Directory search/detail and relationships/Activity;
8. duplicate suggestion + explicit merge;
9. Library/File relationships as needed;
10. protected human Automation builder over server Drafts;
11. durable linear Runtime before persisted waits/branching;
12. AI Task / Planner only after the underlying human/API services are mature;
13. cross-domain Change Plan apply only when those same domain services can safely execute every proposed operation.

The immediate backend action remains the prepared Phase 2A production migration/deployment sequence followed by the separate protected `continuity.md` proof.

# Security rules

Preserve:

- frontend never accesses PostgreSQL directly;
- stable IDs over copied mutable strings;
- protected reads and authorized Origin/CSRF mutations;
- Labels/Groups/relationships do not imply authority;
- no provider secrets in browser state/prompts;
- no prompt-granted authority;
- no arbitrary Python/JavaScript/shell/SQL/eval workflow logic;
- no hidden AI persistence path;
- browser Audience/data/Planner results are never production authority;
- immutable published/history records stay immutable;
- external/inbound content remains untrusted data;
- no broad document-wide MutationObserver loops in accepted frontend paths.
