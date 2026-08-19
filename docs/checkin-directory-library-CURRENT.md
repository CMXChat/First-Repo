# Check In / Continuum Directory, Audiences & Library — CURRENT

Date: 2026-08-18
Status: Current cross-domain frontend handoff; Directory v2 active in Lab, advanced Library contracts remain separate, production backend expansion pending

## Read this with

- `continuum-directory-master-plan-CURRENT.md` — canonical Directory product/UX direction;
- `continuum-automations-master-plan-CURRENT.md` — current focused Automation direction;
- `checkin-library-premium-CURRENT.md` — current advanced Library projection/product direction;
- `checkin-content-editor-CURRENT.md` — native content/editor direction;
- `checkin-files-CURRENT.md` — binary File direction;
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-DIRECTORY-PLATFORM-PLAN.md` — backend Directory plan;
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
→ content/version references
→ future Runtime resolution + frozen execution snapshot
```

Directory answers **who**. Library answers **what information**. Automations define **what should happen**.

# Current Directory v2 Lab surface

The main `/lab/` Records area now renders **Directory v2**.

Active files:

```text
assets/lab/lab-crm.js
assets/lab/lab-crm.css
assets/lab/lab-directory-v2.js
assets/lab/lab-directory-v2.css
```

`lab-crm.js` remains compatibility scaffolding and seeds the shared local store. Directory v2 then enriches that store and owns the visible Directory product surface.

The older `.lab-crm` remains in the DOM for compatibility but is hidden when Directory v2 loads successfully.

Shared prototype store:

```text
cmx-lab-crm-v1
```

Directory-only navigation preference:

```text
cmx-lab-directory-ui-v2
```

All data remains browser-local synthetic Lab state.

## Current object views

Directory v2 exposes:

- People;
- Organizations;
- Groups.

The interface includes:

- fast search;
- useful views/filters;
- three-column desktop layout;
- mobile list → profile navigation;
- Overview / Activity / Relationships / Automation tabs;
- notes;
- contact readiness;
- many-Organization membership editing;
- Labels;
- explicit Person relationship prototype data;
- Group/saved-audience editing;
- Group resolution previews;
- direct Automation usage for People/Organizations;
- exact-email / normalized-phone duplicate warning prototype.

# Person ↔ Organization

A Person may belong to zero, one or many Organizations.

Directory v2 adds the prototype field:

```text
organizationIds[]
```

The older scalar:

```text
orgId
```

is mirrored for compatibility with existing Lab surfaces only.

Production remains many-to-many through a dedicated membership model.

# Contact methods

Directory v2 introduces a prototype `contactMethods[]` shape while preserving the older preferred `email` and `phone` scalar values for compatibility.

The long-term model treats email/phone as mutable ContactMethod records with properties such as:

- type;
- value;
- label;
- preferred;
- active/inactive;
- verification/readiness;
- provenance.

A Person's identity must not depend on one email address or phone number.

# Labels

Labels are descriptive metadata.

They may be used for search, grouping and audience selection.

Labels do not grant permission or authority by themselves.

Users may create arbitrary useful labels. Suggested labels are only starting points.

# Groups / saved audiences

Groups are now visible and editable in Directory v2.

A Group may contain typed selectors for:

- Person;
- Organization;
- Label.

The Lab resolver expands selectors into current People and deduplicates by stable Person ID.

Current seeded examples include:

- Family;
- Emergency Tier 1;
- Business Operations.

These are sample patterns, not reserved system Groups.

Nested Groups remain deferred.

# Contact readiness

Audience identity and channel readiness are separate concepts.

Directory v2 can preview:

- People resolved;
- email-ready count;
- phone-ready count.

A future production audience resolver must return deterministic per-Person readiness and skipped/unready reasons.

# Current focused Automations integration

The focused route remains:

`/lab/automations/`

Current Directory integration files:

```text
assets/lab/lab-automations-directory-v4.js
assets/lab/lab-automations-directory-v4.css
```

Current truthful behavior:

- direct Person targets remain selectable through the existing v3 target field;
- direct Organization targets remain selectable through the existing v3 target field;
- Person target rows show email/phone readiness;
- Organization rows show current resolved People and channel-readiness counts;
- the Actions stage shows Directory People/Organization/Group counts;
- Review shows Directory readiness counts;
- saved Groups are visible in the target picker as audience previews;
- Groups/Labels are **not** silently forced into the old scalar target field.

The next real audience milestone is a typed multi-selector Audience editor that can represent:

```text
Person | Organization | Group | Label
```

without corrupting the current compatibility model.

Production rule remains:

```text
AutomationVersion stores stable selector IDs
→ future Run becomes eligible
→ backend resolves current authorized membership
→ deduplicates People
→ evaluates contact/channel readiness
→ freezes exact Person + contact endpoint snapshot
→ provider uses the frozen execution inputs
```

# Relationship model

Continuum should support explicit Person-to-Person relationships in addition to Organization membership.

Examples include family, partner, lawyer, doctor, accountant, trusted contact, business partner and other owner-defined relationships.

A relationship is descriptive context. It does not automatically grant authority.

# Activity and history

Directory profile Activity is a user-facing timeline.

Potential projected events include:

- profile updates;
- notes;
- Organization membership changes;
- Label changes;
- contact method changes;
- Library associations;
- Automation usage;
- future communication and Runtime events.

Activity and immutable security Audit remain separate concepts.

# Duplicate direction

The current Lab only warns on exact email or normalized phone collisions.

Production duplicate detection may become more sophisticated, but merge must remain explicit and auditable.

Do not auto-merge People because names look similar.

# Library boundary

The advanced Library remains a separate protected projection over native content and binary files.

Canonical native content direction:

```text
ContentAsset
→ mutable ContentDraft
→ immutable ContentVersion
```

Canonical binary direction:

```text
FileAsset
→ immutable FileVersion
→ private object storage
```

Directory may project linked Library information later through stable associations. Do not collapse Person/Organization and Library records into one polymorphic table.

For current Library UX and implementation details, use:

- `checkin-library-premium-CURRENT.md`;
- `checkin-content-editor-CURRENT.md`;
- `checkin-files-CURRENT.md`.

# AI boundary

Future AI may use Directory only through typed protected tools and minimum-necessary authorized context.

Useful future operations can include:

- search Directory;
- read an authorized Person/Organization profile;
- preview an audience;
- suggest duplicates;
- propose a Group;
- summarize recent authorized Activity.

AI cannot silently widen Groups, change trusted relationships, merge People, expose hidden contact methods or gain authority from labels/relationships.

# Production migration boundary

Do not port Directory v2 by copying localStorage or DOM adapters into the protected application.

The production path is:

```text
accepted Lab semantics
→ backend models/migrations/services/tests
→ protected API + generated client
→ protected React Directory surface
→ Automation Audience integration
→ future Runtime recipient freezing
```

The already validated Phase 2A Library + Automation production migration remains the immediate release boundary. Directory schema expansion comes after that boundary in deliberate increments.

# Backend companion order

Canonical backend plan:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-DIRECTORY-PLATFORM-PLAN.md`

Recommended broad sequence after the current Phase 2A release boundary:

1. Person + Organization;
2. PersonOrganizationMembership;
3. ContactMethod;
4. Label + PersonLabel;
5. Group + typed selectors;
6. canonical audience resolution/readiness service;
7. protected search/list/detail;
8. notes/activity;
9. PersonRelationship;
10. duplicate suggestion + explicit merge;
11. custom fields/saved views/import/export only as needed.

# Safety / truthfulness

Do not claim current Lab Directory features are durable production capabilities.

The Lab still has no production:

- Directory mutations;
- Group/Label persistence;
- authoritative audience resolution;
- contact-method verification service;
- duplicate merge engine;
- CRM import/export;
- Runtime recipient freezing;
- provider delivery.

The browser prototype proves UX and semantics only.
