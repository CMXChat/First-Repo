# Check In / Continuum Directory, Audiences & Library — CURRENT

Date: 2026-08-18
Status: Current cross-domain frontend handoff; Directory v2 and Automations Audience v4.1 active in Lab, production backend expansion pending

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

The main `/lab/` Records area renders **Directory v2**.

Active files:

```text
assets/lab/lab-crm.js
assets/lab/lab-crm.css
assets/lab/lab-directory-v2.js
assets/lab/lab-directory-v2.css
```

`lab-crm.js` remains compatibility scaffolding and seeds the shared local store. Directory v2 enriches that store and owns the visible Directory product surface.

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
- email-ready and phone-ready counts;
- exact-email / normalized-phone duplicate warning prototype;
- direct Automation usage links for People and Organizations;
- dark and light presentation.

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

Groups are visible and editable in Directory v2.

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

## Typed Audience v4.1

Communication Actions currently represented by the Lab as `Notify a person` or `Send email` now use a multi-selector Audience manager instead of the old one-target picker.

The Lab can select one or more:

- Person;
- Organization;
- Group;
- Label.

The current Action Draft stores prototype fields similar to:

```text
audienceSelectors[]
audienceResolution.mode = live_membership
audienceResolution.dedupe = person_id
```

The Lab resolver:

1. expands Organization membership;
2. expands Group selectors;
3. expands Label membership;
4. includes directly selected People;
5. deduplicates by stable Person ID;
6. previews email-ready and phone-ready counts.

The Audience modal shows the resolved People before the selection is applied.

## Compatibility with the proven v3 editor

V3 still has older `targetRef` / `targetLabel` fields.

The v4.1 Audience adapter preserves compatibility deliberately:

- one direct Person or Organization selector mirrors into the old stable target reference;
- a multi-selector/Group/Label audience writes a readable compatibility target label;
- the canonical Lab audience intent remains `audienceSelectors[]`;
- before saving Audience, the adapter flushes the current v3 Draft Save;
- after writing the audience selectors to the shared Automation Draft, the route reloads the exact Draft so v3 rehydrates the extra fields and does not overwrite them on a later autosave.

This reload is Lab compatibility behavior. Production must not copy it.

## Other Directory integration

The focused builder also shows:

- Directory People/Organization/Group counts on the Actions stage;
- Person email/phone readiness;
- Organization member/readiness counts;
- Directory readiness in Review;
- Audience preflight for communication Actions.

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

The browser resolver is not production authority.

Historical Runs must remain unchanged when Directory data later changes.

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

The current Lab warns only on exact email or normalized phone collisions.

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

Do not port Directory v2 or Audience v4.1 by copying localStorage or DOM adapters into the protected application.

The production path is:

```text
accepted Lab semantics
→ backend models/migrations/services/tests
→ protected API + generated client
→ protected React Directory surface
→ typed Automation Audience integration
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

The accepted Lab `audienceSelectors[]` semantics should inform the protected Automation Audience API, but the browser field names do not have to become the exact Pydantic/PostgreSQL names.

# Safety / truthfulness

Do not claim current Lab Directory/Audience features are durable production capabilities.

The Lab still has no production:

- Directory mutations matching v2;
- Group/Label persistence;
- authoritative audience resolution;
- contact-method verification service;
- duplicate merge engine;
- CRM import/export;
- Runtime recipient freezing;
- provider delivery.

The browser prototype proves UX and semantics only.
