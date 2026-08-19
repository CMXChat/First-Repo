# Check In / Continuum Directory, Audiences & Library — CURRENT

Date: 2026-08-18
Status: Current cross-domain frontend handoff; Directory v2 + AI setup preview, Automations Audience v4.1, Intelligence v4.2 and input routing v4.3 active in Lab; production backend expansion pending

## Read this with

- `continuum-directory-master-plan-CURRENT.md` — canonical Directory product/UX direction;
- `continuum-automations-master-plan-CURRENT.md` — current focused Automation direction;
- `checkin-library-premium-CURRENT.md` — current advanced Library projection/product direction;
- `checkin-content-editor-CURRENT.md` — native content/editor direction;
- `checkin-files-CURRENT.md` — binary File direction;
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-DIRECTORY-PLATFORM-PLAN.md` — backend Directory plan;
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md` — cross-domain natural-language Planner / Change Plan contract;
- `CMXChat/jay-app/specs/003-server-checkin/DIRECTORY-AUDIENCE-LIBRARY-BACKEND-HANDOFF.md` — durable relationship/audience semantics.

When an older Directory/Audience prototype file conflicts with this handoff, this file plus the Continuum Directory master plan win.

# Product model

Keep these concepts distinct:

```text
Person
↔ Organization memberships
+ Contact methods
+ Labels
+ explicit relationships
+ Groups / saved audiences

Library
├── native ContentAssets
└── binary FileAssets

Automation
→ typed audience selectors
→ typed input routing
→ content/version references
→ future Runtime resolution + frozen execution snapshot

AI Planner
→ natural-language intent
→ typed Change Plan
→ normal protected domain services
```

Directory answers **who**. Library answers **what information**. Automations define **what should happen**. AI can eventually help author the same environment through reviewed typed changes.

# Current Directory v2 Lab surface

The main `/lab/` Records area renders **Directory v2**.

Active files:

```text
assets/lab/lab-crm.js
assets/lab/lab-crm.css
assets/lab/lab-directory-v2.js
assets/lab/lab-directory-v2.css
assets/lab/lab-directory-v2-polish.css
assets/lab/lab-directory-planner-preview.js
assets/lab/lab-directory-planner-preview.css
```

`lab-crm.js` remains compatibility scaffolding and seeds the shared local store. Directory v2 enriches that store and owns the visible Directory product surface.

The older `.lab-crm` remains in the DOM for compatibility but is hidden when Directory v2 loads successfully.

Shared prototype store:

`cmx-lab-crm-v1`

Directory-only navigation preference:

`cmx-lab-directory-ui-v2`

All data remains browser-local synthetic Lab state.

## Current object views

Directory v2 exposes:

- People;
- Organizations;
- Groups.

The interface includes:

- fast search;
- useful views/filters;
- polished three-column desktop layout with responsive collapse;
- mobile list → profile navigation;
- Overview / Activity / Relationships / Automation tabs;
- notes;
- contact readiness;
- many-Organization membership editing;
- Labels;
- explicit Person relationship prototype data;
- Group/saved-audience editing;
- Group resolution previews;
- email-ready and phone-ready counts;
- exact-email / normalized-phone duplicate warning prototype;
- direct Automation usage links for People and Organizations;
- dark and light presentation;
- **AI setup** preview for the future natural-language environment builder.

## AI setup preview

The Directory command bar now includes `AI setup`.

Current Lab behavior is intentionally limited:

- no model call;
- no arbitrary prompt interpretation;
- no Directory mutation;
- no hidden AI authority.

The modal demonstrates the future Change Plan flow:

`Describe → Plan → Preflight → Review → Apply`

Fixed product examples show how a request could eventually become typed operations across Directory and Automations. They are explicitly examples, not generated results.

# Person ↔ Organization

A Person may belong to zero, one or many Organizations.

Directory v2 uses prototype `organizationIds[]` while mirroring the older scalar `orgId` for compatibility only.

Production remains many-to-many through a dedicated `PersonOrganizationMembership` model.

# Contact methods

Directory v2 introduces prototype `contactMethods[]` while preserving preferred `email` and `phone` scalars for compatibility.

The durable model treats email/phone as mutable `ContactMethod` records with type, value, label, preferred state, active state, verification/readiness and provenance.

A Person's identity must not depend on one email address or phone number.

# Labels

Labels are descriptive metadata used for search, grouping and audience selection.

Labels do not grant permission or authority by themselves.

# Groups / saved audiences

Groups are visible and editable in Directory v2.

A Group may contain typed selectors for:

- Person;
- Organization;
- Label.

The Lab resolver expands selectors into current People and deduplicates by stable Person ID.

Current seeded examples include Family, Emergency Tier 1 and Business Operations. They are sample patterns, not reserved system Groups.

Nested Groups remain deferred.

# Contact readiness

Audience identity and channel readiness are separate concepts.

Directory v2 can preview People resolved, email-ready count and phone-ready count.

A future production audience resolver must return deterministic per-Person readiness and skipped/unready reasons.

# Current focused Automations integration

Focused route:

`/lab/automations/`

Current Directory/readiness integration files:

```text
assets/lab/lab-automations-directory-v4.js
assets/lab/lab-automations-directory-v4.css
```

Current typed Audience layer:

```text
assets/lab/lab-automations-audience-v4.js
assets/lab/lab-automations-audience-v4.css
```

Current data-flow layers:

```text
assets/lab/lab-automations-intelligence-v4.js
assets/lab/lab-automations-intelligence-v4.css
assets/lab/lab-automations-input-routing-v4.js
assets/lab/lab-automations-input-routing-v4.css
```

## Typed Audience v4.1

Communication Actions represented as Notify/Email use a multi-selector Audience manager.

Selectors can include:

- Person;
- Organization;
- Group;
- Label.

Prototype Draft intent includes:

```text
audienceSelectors[]
audienceResolution.mode = live_membership
audienceResolution.dedupe = person_id
```

The Lab expands current membership, deduplicates by stable Person ID and previews email/phone readiness before applying the selection.

## V3 compatibility

The v3 editor still has `targetRef` / `targetLabel` fields.

The v4.1 adapter therefore preserves those fields as compatibility scaffolding while `audienceSelectors[]` remains the richer Lab intent.

The adapter flushes v3 Save before writing richer Audience state and reloads the exact Draft so later autosaves preserve it.

Production must not copy this reload behavior.

## Automations Intelligence v4.2

The focused builder can select friendly typed source references from:

- Trigger data;
- earlier Action outputs;
- Directory/Audience values.

Directory examples currently include resolved People count, email-ready count and phone-ready count.

These are **sample/reference UX only**. Browser resolution is not production authority and this does not create an expression engine.

## Field input routing v4.3

The focused builder now maps a selected typed source into a specific receiving Action field.

Examples include:

- Email subject;
- Email body data;
- AI task context;
- AI task focus value;
- notification message data;
- manual-review context.

Prototype Action intent uses `inputBindings[]` entries containing a `targetField` plus the typed source reference.

This is the first Lab proof of the full direction:

`typed source output → typed receiving input field`

The browser-local compatibility store is `cmx-lab-automation-input-bindings-v1`, but production should use the normal protected Automation Draft model and server capability schemas.

# Production Automation/Directory rule

The durable direction remains:

```text
AutomationVersion stores stable selectors + typed input references
→ future Run becomes eligible
→ backend resolves current authorized membership/data
→ validates input/output schema compatibility
→ deduplicates People
→ checks channel readiness + authority
→ freezes exact execution inputs
→ provider/domain capability uses frozen values
```

Historical Runs stay unchanged when Directory data later changes.

# Relationship model

Continuum should support explicit `PersonRelationship` records in addition to Organization membership.

Examples include family, partner, lawyer, doctor, accountant, trusted contact and business partner.

A relationship is descriptive context. It does not automatically grant authority.

# Activity and history

Directory profile Activity is a user-facing timeline.

Potential projected events include profile updates, notes, Organization membership changes, Label changes, contact method changes, Library associations, Automation usage and future communication/Runtime events.

Activity and immutable security Audit remain separate concepts.

# Duplicate direction

The current Lab warns only on exact email or normalized phone collisions.

Production merge must remain explicit and auditable. Do not auto-merge People because names look similar.

# Library boundary

The advanced Library remains a separate protected projection over native content and binary files.

Canonical native content:

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

Canonical binary direction:

`FileAsset → immutable FileVersion → private object storage`

Directory may project linked Library information later through stable associations. Do not collapse Person/Organization and Library records into one polymorphic table.

For current Library UX and implementation details, use `checkin-library-premium-CURRENT.md`, `checkin-content-editor-CURRENT.md` and `checkin-files-CURRENT.md`.

# AI boundary and Change Plan

Future AI may use Directory only through typed protected tools and minimum-necessary authorized context.

The desired high-level experience is that a user can say things such as:

- organize these contacts into family/business groups;
- add my accountant and connect them to my company;
- label these People and create a saved audience;
- set up emergency contacts and draft an escalation Automation;
- organize supporting Library information.

The implementation contract is:

`natural-language intent → AI Planner → typed Change Plan → preflight → review/approval as required → normal domain mutations`

A Change Plan may propose typed operations across Directory, Automations and Library, but it never becomes a second persistence/execution engine.

AI cannot silently widen Groups, change trusted relationships, merge People, expose hidden contact methods, publish consequential Automations, grant itself authority or bypass normal validators.

Human UI and AI converge on the same Person, Organization, Group, Automation Draft and Library models.

# Production migration boundary

Do not port Directory v2, AI setup preview, Audience v4.1 or v4.3 input routing by copying localStorage or DOM adapters into the protected application.

Production path:

`accepted Lab semantics → backend models/services/tests → protected API + generated client → protected React surfaces → future Runtime`

The already validated Phase 2A Library + Automation production migration remains the immediate release boundary. Directory schema expansion comes after it in deliberate increments.

# Backend companion order

Canonical backend plans:

- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-DIRECTORY-PLATFORM-PLAN.md`;
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`.

Broad order after the current Phase 2A release boundary:

1. Person + Organization;
2. PersonOrganizationMembership;
3. ContactMethod;
4. Label + PersonLabel;
5. Group + typed selectors;
6. canonical audience resolution/readiness;
7. protected search/list/detail;
8. notes/activity;
9. PersonRelationship;
10. duplicate suggestion + explicit merge;
11. custom fields/saved views/import/export only as needed;
12. cross-domain Planner mutation execution only after the underlying human/API domain services are mature enough to support those same changes safely.

The Lab field names do not have to become exact Pydantic/PostgreSQL names.

# Safety / truthfulness

The Lab still has no production:

- Directory v2 persistence;
- AI setup model execution;
- AI Change Plan execution;
- Group/Label audience service;
- authoritative audience resolution;
- typed Automation input routing service;
- contact-method verification service;
- duplicate merge engine;
- CRM import/export;
- Runtime recipient/data freezing;
- provider delivery.

The browser prototype proves UX and semantics only.
