# Continuum Directory Master Plan — CURRENT

Date: 2026-08-18
Status: Canonical product/UX direction for Directory; Lab Directory v2 and Automations Audience v4.1 implemented, protected backend expansion pending

## Purpose

Directory is Continuum's durable identity and relationship layer.

It should eventually feel as polished and useful as the core contact-management experience in a serious CRM while remaining broader than a sales CRM. The product needs to understand people, organizations, relationships, contact methods, saved audiences and history because Spaces, Automations, Library, Connections, AI and future Runtime all need stable identities.

The goal is not to recreate every HubSpot or Pipedrive product surface. The goal is a high-quality Directory core that can support personal, family, continuity, business and operational relationships without forcing all of them into a sales pipeline model.

## Product principle

**Directory knows who. Library knows what. Automations define what should happen. Runtime records what actually happened.**

A Person or Organization should remain the same stable entity even when names, email addresses, phone numbers, memberships, labels or other mutable details change.

## Current Lab Directory v2

The main `/lab/` Records area has a richer Directory v2 product layer.

Current implementation files:

- `assets/lab/lab-crm.js` remains the compatibility data/editor foundation;
- `assets/lab/lab-directory-v2.js` enriches the local Directory model and renders the current Directory product surface;
- `assets/lab/lab-directory-v2.css` owns Directory v2 presentation;
- `cmx-lab-crm-v1` remains the shared browser-local store;
- `cmx-lab-directory-ui-v2` stores Directory-only navigation preferences.

Directory v2 is additive. It preserves compatibility fields such as `orgId`, `email`, `phone` and `tags` while adding prototype fields such as:

- `organizationIds`;
- `labels`;
- `contactMethods`;
- `lifecycle`;
- `relationshipLinks`;
- `customFields` shell;
- `groups` at the Directory store level.

These browser fields are product-prototyping shapes. Production must use typed server models and services.

## Current Lab UX

Directory v2 exposes:

1. People;
2. Organizations;
3. Groups.

The application surface includes:

- compact Directory command bar;
- search;
- useful views/filters;
- three-column desktop layout;
- dedicated mobile list-to-profile navigation;
- Overview / Activity / Relationships / Automation profile tabs;
- contact-readiness indicators;
- multiple Organization memberships in the v2 editor;
- Labels;
- notes and activity history;
- saved Groups/audiences;
- Group resolution previews;
- email-ready and phone-ready counts;
- exact-email / normalized-phone duplicate warning prototype;
- direct Automation usage links for People and Organizations;
- dark and light presentation.

The original `.lab-crm` remains in the generated Lab DOM for compatibility but is hidden when Directory v2 successfully loads.

## Core object model

### Person

A stable human identity.

A Person may eventually include:

- stable ID;
- display/legal/preferred names;
- role/title metadata;
- lifecycle state;
- importance/priority as user metadata;
- time zone and location;
- multiple ContactMethods;
- multiple Organization memberships;
- Labels;
- Group membership by resolution;
- explicit Person-to-Person relationships;
- custom fields;
- notes;
- linked Library records;
- Automation usage;
- Activity timeline;
- provenance/source metadata.

### Organization

A stable real-world organization identity.

An Organization may include:

- stable ID;
- name and type;
- lifecycle/status;
- website/location;
- organization-level contact methods where useful;
- Labels;
- custom fields;
- notes/summary;
- many Person memberships;
- linked Library records;
- Automation usage;
- Activity timeline.

### PersonOrganizationMembership

The durable production relationship between a Person and an Organization.

A Person may have zero, one or many memberships.

Membership can later carry:

- role/title within that Organization;
- primary/secondary flag;
- active/inactive dates;
- routing priority where useful;
- ownership/source;
- timestamps;
- Audit provenance.

Do not make one `organization_id` the production relationship model.

### ContactMethod

Email and phone should eventually be records, not permanent scalar properties on Person.

A ContactMethod can carry:

- stable ID;
- type such as email / phone / future supported method;
- value;
- label such as work / personal / mobile;
- preferred flag;
- active/inactive state;
- verification/readiness state;
- source;
- created/updated timestamps.

The Lab still mirrors preferred email and phone into older scalar fields for compatibility.

### Label

Labels describe entities and support search, organization and audience selection.

Labels are metadata. They do not grant permission by themselves.

Suggested labels are starting points only. Users can create their own.

### Group

A Group is a saved audience.

A Group is deliberately different from a Label and Organization.

Current Lab Group selectors can reference:

- Person;
- Organization;
- Label.

The Group resolver expands those selectors into current unique People and deduplicates by stable Person ID.

Nested Groups remain deferred until a real need exists because nested resolution introduces graph/cycle complexity.

### PersonRelationship

Continuum should support explicit Person-to-Person relationships instead of forcing all relationship meaning into free text or Organizations.

Examples may include:

- spouse/partner;
- family;
- friend;
- lawyer;
- doctor;
- accountant;
- emergency contact;
- trusted person;
- business partner;
- manager/report;
- custom relationship type.

Relationship type is descriptive context. Separate policy decides whether a relationship grants authority.

### Activity

A record profile should eventually have a unified activity timeline.

Activity can project events such as:

- note created;
- membership changed;
- label changed;
- contact method changed;
- message/call/meeting event where connected and authorized;
- Library link change;
- Automation publication/reference;
- future Runtime outcome;
- import/merge activity.

Product Activity and immutable security Audit remain separate concerns even when some events appear in both views.

## CRM-quality product surface

The long-term Directory should support the useful core of mature contact-management products:

- fast global search;
- filters and saved views;
- strong Person and Organization profile pages;
- multiple contact methods;
- many-to-many Organization membership;
- Labels and saved Groups;
- explicit relationships;
- custom fields;
- notes;
- activities/tasks where useful;
- timeline/history;
- duplicate detection;
- merge workflow;
- imports;
- exports;
- bulk actions with review;
- recent/favorite records;
- mobile-first profile access;
- linked Automations and Library records.

These capabilities should be added because they improve Continuum's identity layer, not because another CRM has them.

## Features deliberately deferred

Do not turn Directory work into an attempt to build all of HubSpot.

Defer until a concrete Continuum use case exists:

- sales deal pipelines;
- marketing campaigns;
- lead scoring suites;
- ad attribution;
- customer-service ticketing suites;
- quote/invoice suites;
- complex forecasting;
- arbitrary CRM marketplace parity.

A future Business domain can introduce Deal, Project, Ticket or custom business objects without changing Person/Organization identity.

## Directory and Automations

Automation definitions should store stable protected audience selector IDs instead of copied mutable recipient strings.

Conceptual direction:

`Person / Organization / Group / Label selector → resolve current authorized People → check channel readiness → deduplicate → future Runtime freezes exact recipient snapshot → provider receives frozen execution inputs`

### Current Automations Audience v4.1 Lab integration

The typed multi-selector Audience editor is now active in the focused Lab for communication Actions.

Current files:

- `assets/lab/lab-automations-directory-v4.js`;
- `assets/lab/lab-automations-directory-v4.css`;
- `assets/lab/lab-automations-audience-v4.js`;
- `assets/lab/lab-automations-audience-v4.css`.

A communication Action can select one or more:

- Person;
- Organization;
- Group;
- Label.

The Lab stores `audienceSelectors[]`, resolves current unique People, deduplicates by Person ID and previews email/phone readiness.

For compatibility with the proven v3 Draft engine:

- one direct Person/Organization can still mirror to `targetRef`;
- multi-selector/Group/Label audiences use a compatibility `targetLabel` summary;
- `audienceSelectors[]` remains the richer Lab intent;
- the adapter flushes v3 Save before writing selectors and reloads the exact Draft so the v3 normalizer rehydrates the extra fields.

That reload is prototype compatibility behavior, not production architecture.

The Actions stage and Review also show Directory/readiness information.

## Contact readiness

Identity resolution and delivery readiness are separate.

A Person may exist without a usable email or phone.

An Organization or Group may resolve many People with different channel readiness.

Directory should expose this before Publish, for example:

- 8 People resolved;
- 7 email-ready;
- 5 phone-ready;
- 1 missing required channel.

Future provider delivery must preserve exact skipped/failure reasons instead of silently dropping unresolved recipients.

The current browser resolution is Lab preview logic only. Production resolution belongs to a protected backend service.

## Directory and Library

Directory relationships should eventually project linked Library information without making folder placement a permission boundary.

Useful associations may include:

- Person ↔ ContentAsset/FileAsset;
- Organization ↔ ContentAsset/FileAsset;
- Group/audience usage ↔ Automation definitions;
- exact immutable versions frozen when required by published workflows.

The user-facing profile may show linked documents/files while ownership and authorization stay in backend domain services.

## Directory and Spaces

Spaces can use authorized Directory context to answer questions such as:

- who is involved;
- what Organization they belong to;
- current role/relationship;
- what recent activity matters;
- what Group/audience they belong to.

Spaces should retrieve only the minimum authorized context needed for the briefing.

## Directory and AI

AI can later use Directory through typed protected tools.

Useful bounded capabilities may include:

- search People/Organizations;
- inspect authorized profile fields;
- resolve an audience preview;
- suggest possible duplicates;
- draft a Group from user intent;
- suggest labels/relationship metadata;
- summarize recent authorized activity.

AI must not receive raw database access or permission to silently widen audience membership, contact authority or standing permission.

AI may propose Directory mutations. Normal authorization and confirmation rules still apply.

## Duplicate and merge direction

Duplicate detection should begin conservatively.

Potential signals can include:

- exact normalized email;
- exact normalized phone;
- strong normalized-name match plus corroborating context;
- external source IDs where available.

A merge must be explicit and auditable.

Merge should preserve aliases/provenance and redirect internal references safely instead of deleting history.

The current Lab only shows an exact email/normalized-phone duplicate warning. It does not perform destructive merge.

## Custom fields

Custom fields are useful but should not force uncontrolled schema changes.

Preferred direction:

- typed CustomFieldDefinition scoped to the owner/workspace;
- typed values with validation;
- supported field types such as text, number, boolean, date, enum and reference where justified;
- indexed/searchable subset where useful;
- stable definition IDs;
- archived definitions remain interpretable in history.

Do not store all first-class Directory semantics as arbitrary custom fields.

## Search and saved views

Search should begin in PostgreSQL over authorized Directory fields.

Saved views can later persist:

- object type;
- filters;
- sorting;
- visible columns/profile summary preferences;
- owner/scope.

A saved view is navigation/configuration. It does not become an authorization rule unless a separate policy explicitly uses it.

## Import/export

Future imports should support review before committing rows.

Expected flow:

`upload/import source → parse to staging rows → map fields → detect duplicates/conflicts → preview → commit authorized records → Audit`

Imports must not silently overwrite trusted existing data.

Exports should respect current authorization and sensitivity controls.

## Mobile contract

Phone Directory UX is first-class.

Current Lab v2 uses:

- full-width type controls;
- full-width search;
- simple record list;
- tap record to replace list with profile;
- explicit Back to Directory;
- horizontally scrollable profile tabs;
- stacked facts/metrics;
- large edit controls;
- 16px form inputs to avoid mobile zoom;
- no compressed three-column desktop layout.

The focused Audience manager becomes a full-width bottom-sheet-style workflow on phone with one-column selectors and safe-area-aware actions.

Production should preserve these interaction principles.

## Production backend order

Do not interrupt the already validated Phase 2A production migration merely because Directory v2 and Audience v4.1 exist in Lab.

Recommended backend order after that release boundary:

1. Person;
2. Organization;
3. PersonOrganizationMembership;
4. ContactMethod;
5. Label + PersonLabel;
6. Group + typed Group members/selectors;
7. audience resolution/readiness service;
8. typed Automation Audience definition/API using stable selector refs;
9. protected search/list/detail APIs;
10. activity/note projection;
11. duplicate detection and explicit merge;
12. custom fields and saved views when needed;
13. import/export;
14. deeper communication/Runtime history integration.

Each slice gets models, migrations, services, protected APIs, tests and generated frontend client changes before production UX claims widen.

## Production migration rule

The static Lab is a design and semantics proving ground.

Production implementation should be rebuilt in the protected React/FastAPI/PostgreSQL application using typed services and the generated API client.

Do not copy:

- browser localStorage as persistence;
- Lab DOM patching;
- compatibility `orgId` as the production relationship model;
- client-side audience resolution as authority;
- compatibility `targetLabel` as canonical audience identity;
- browser reload as a save mechanism;
- client-generated Audit truth.

## Security

Directory is sensitive data.

Preserve:

- authenticated protected reads;
- exact Origin + CSRF for mutations;
- owner/workspace/switch scope checks;
- stable IDs;
- contact method privacy;
- no secrets in browser storage in production;
- audited membership/contact changes;
- explicit authorization for export;
- no label/group-based permission inference unless policy explicitly defines it;
- minimum-necessary retrieval for AI and Spaces;
- frozen Run recipient history when Runtime exists.

## Validation target

A mature Directory should be able to answer clearly:

- Who is this Person?
- Which Organizations are they connected to?
- How can they currently be contacted?
- Which method is preferred and usable?
- Which Labels and Groups include them?
- What explicit relationships matter?
- What changed recently?
- Which Library records and Automations use them?
- Are there duplicate/conflicting identities?
- If an Automation runs, exactly which People will resolve and which channels are ready?

If those answers require duplicated ad hoc data in every product surface, the Directory architecture is wrong.
