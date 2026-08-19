# Continuum Directory Master Plan — CURRENT

Date: 2026-08-18
Status: Canonical Directory product/UX direction; Lab Directory v2 + polish and Automations Audience v4.1 implemented, protected backend expansion pending

# Purpose

Directory is Continuum's durable identity and relationship layer.

It should eventually feel as polished and useful as the core contact-management experience in a serious CRM while remaining broader than a sales CRM. Spaces, Automations, Library, Connections, AI and future Runtime all need stable people/organization identity, relationships, contact methods and saved audiences.

The goal is a high-quality Directory core, not a clone of every HubSpot/Pipedrive sales, marketing, support and forecasting product.

Core principle:

**Directory knows who. Library knows what. Automations define what should happen. Runtime records what actually happened.**

A Person or Organization remains the same stable entity when mutable names, email addresses, phone numbers, memberships, Labels or other details change.

# Current Lab Directory v2

The main `/lab/` Records area runs Directory v2 over the existing shared local CRM data.

Current files:

- `assets/lab/lab-crm.js` — compatibility data/editor foundation;
- `assets/lab/lab-crm.css` — retained compatibility styling;
- `assets/lab/lab-directory-v2.js` — richer Directory model/product surface;
- `assets/lab/lab-directory-v2.css` — Directory v2 base presentation;
- `assets/lab/lab-directory-v2-polish.css` — presentation-only density/responsive polish.

Shared browser store:

`cmx-lab-crm-v1`

Directory-only navigation preferences:

`cmx-lab-directory-ui-v2`

The polish layer adds stronger app hierarchy, sticky desktop controls, denser record/profile presentation and dedicated phone refinements. It does not add persistence or authority.

Directory v2 preserves old compatibility fields such as `orgId`, `email`, `phone` and `tags` while prototyping richer fields such as:

- `organizationIds`;
- `labels`;
- `contactMethods`;
- `lifecycle`;
- `relationshipLinks`;
- `customFields` shell;
- Directory-level `groups`.

Production must use typed server models/services instead of these browser shapes.

# Current Lab UX

Directory v2 exposes:

1. People;
2. Organizations;
3. Groups.

Current demonstrations include:

- compact command bar;
- search and useful views/filters;
- strong Person/Organization/Group profiles;
- three-column desktop layout with responsive collapse;
- mobile list → profile navigation;
- Overview / Activity / Relationships / Automation tabs;
- multiple Organization memberships;
- ContactMethod/readiness indicators;
- Labels;
- notes and Activity history;
- saved Groups/audiences;
- Group resolution previews;
- email-ready/phone-ready counts;
- exact-email / normalized-phone duplicate warning prototype;
- direct Automation usage links;
- light/dark presentation.

The original `.lab-crm` remains compatibility scaffolding and is hidden when Directory v2 successfully loads.

# Core durable model

## Person

Stable human identity.

Useful durable concepts include stable ID, display/preferred identity, lifecycle, role/title metadata, timezone/location when intentionally stored, multiple ContactMethods, multiple Organization memberships, Labels, Groups, explicit Person relationships, custom fields, notes, linked Library records, Automation usage, Activity and provenance.

## Organization

Stable organization identity with name/type, lifecycle/status, website/location, optional organization-level ContactMethods, Labels, custom fields, notes/summary, many Person memberships, linked Library records, Automation usage and Activity.

## PersonOrganizationMembership

Many-to-many Person ↔ Organization relationship.

It may later carry role/title, primary/secondary status, active dates, routing priority where useful, timestamps and Audit provenance.

Do not make one `organization_id` the production relationship model.

## ContactMethod

Email/phone become durable contact endpoint records rather than Person identity.

Useful fields include stable ID, type, raw/display and normalized value, label, preferred flag, active state, verification/readiness, source/provenance and timestamps.

## Label

Stable descriptive metadata used for organization/search/audience selection.

Labels never grant permission by themselves.

## Group

A Group is a saved audience, distinct from a Label and Organization.

Current Lab Group selectors can reference:

- Person;
- Organization;
- Label.

Resolution expands those selectors into current unique People and deduplicates by stable Person ID.

Nested Groups stay deferred until a real need exists because they introduce cycle/graph complexity.

## PersonRelationship

Explicit Person-to-Person relationship edge.

Examples can include partner/spouse, family, friend, lawyer, doctor, accountant, emergency contact, business partner, manager/report or custom relationship type.

Relationship description does not automatically grant authority.

## Activity

User-facing profile timeline that can project notes, membership/Label/contact changes, messages/meetings where authorized, Library associations, Automation references and future Runtime results.

Activity is not a replacement for immutable security Audit.

# CRM-quality direction

The useful core should eventually support:

- fast protected search;
- filters and saved views;
- strong profiles;
- multiple contact methods;
- many-to-many Organization membership;
- Labels and Groups;
- explicit relationships;
- custom fields;
- notes;
- activities/tasks where useful;
- timeline/history;
- duplicate detection and explicit merge;
- staged imports;
- authorized exports;
- bulk actions with review;
- recent/favorite records;
- excellent mobile access;
- linked Automations and Library information.

Add these because they strengthen Continuum identity/context, not because another CRM has them.

# Deliberate non-goals

Defer until real Continuum requirements exist:

- sales deal pipelines;
- marketing campaign suites;
- lead scoring;
- ad attribution;
- full helpdesk/ticketing;
- quote/invoice suites;
- forecasting;
- arbitrary CRM marketplace parity.

A later Business domain can introduce Deal/Project/Ticket/custom business objects while continuing to reference the same Person/Organization identities.

# Directory and Automations

Automation definitions should store stable protected selector IDs instead of copied mutable recipient strings.

Long-term flow:

`Person / Organization / Group / Label selectors → server resolves current authorized People → readiness/authority checks → future Runtime freezes exact recipient/contact snapshot → provider`

## Audience v4.1 Lab proof

The focused Automation Lab supports multi-selector communication audiences across:

- Person;
- Organization;
- Group;
- Label.

Prototype intent lives in `audienceSelectors[]` with live-membership/dedupe semantics.

The browser previews current unique People and email/phone readiness. Compatibility `targetRef` / `targetLabel` fields exist only to coexist with the older v3 Draft engine.

Production still requires the canonical protected Audience resolver/readiness service.

## Automations Intelligence v4.2 Directory data use

The focused Automation Lab can now select friendly typed data references from Directory/Audience context, currently including:

- resolved People count;
- email-ready count;
- phone-ready count.

These are **sample/reference UX only**. They prove how Directory values can appear beside Trigger and prior-step outputs in the Automation builder.

They do not make browser resolution authoritative and they do not create an expression engine.

Production direction remains typed server paths/references validated against real output schemas and authorized Directory services.

# Contact readiness

Identity resolution and delivery readiness are separate.

A Person may exist without usable email/phone. An Organization or Group may resolve many People with different channel readiness.

Directory should expose deterministic counts and per-Person reasons before Publish/Run.

Provider execution later must preserve skipped/failure reasons instead of silently dropping recipients.

# Directory and Library

Directory relationships can project linked Library information without making folders into permission boundaries.

Useful associations may include Person/Organization ↔ ContentAsset/FileAsset and Group/audience usage ↔ Automation definitions.

Exact immutable versions are frozen where published workflows require reproducibility.

# Directory and Spaces

Spaces can retrieve minimum-necessary authorized Directory context such as who is involved, Organization/role/relationship, relevant recent Activity and Group membership.

# Directory and AI

AI later accesses Directory through narrow typed protected tools such as search/get Person/get Organization/preview audience/suggest duplicates/propose Group.

AI cannot silently widen Group membership, grant trust/authority, expose hidden contact methods or merge identities without appropriate authorization.

# Duplicate and merge direction

Conservative duplicate signals include exact normalized email, exact normalized phone, verified external source identity and later strong normalized-name + corroborating context as suggestion only.

Merge is an explicit high-impact mutation and must preserve aliases/provenance and historical references.

Current Lab only warns. It does not auto-merge.

# Custom fields

Use stable typed CustomFieldDefinition plus validated typed values.

Do not hide first-class concepts such as ContactMethod, membership, Label or lifecycle inside arbitrary custom fields.

# Search and saved views

Search begins in PostgreSQL over authorized Directory fields.

Saved views persist navigation/filter/sort/presentation preferences and do not become authority rules by themselves.

# Import/export

Future import flow:

`source → staging parse → field mapping → normalization → duplicate/conflict analysis → preview → transactional commit → Activity/Audit`

Do not silently overwrite trusted records.

Exports require authorized scope and sensitivity controls.

# Mobile contract

Phone Directory UX is first-class.

Preserve:

- full-width type controls/search;
- simple list → profile navigation;
- explicit Back to Directory;
- scrollable profile tabs;
- stacked facts/metrics;
- large edit controls;
- 16px inputs where needed to avoid zoom;
- no compressed three-column desktop layout.

Audience/data pickers follow the same bottom-sheet/full-screen mobile pattern with safe-area-aware actions.

# Production backend order

Do not interrupt the already validated Phase 2A production migration.

After that release boundary:

1. Person;
2. Organization;
3. PersonOrganizationMembership;
4. ContactMethod;
5. Label + PersonLabel;
6. Group + typed selectors;
7. canonical audience resolution/readiness;
8. typed Automation Audience definition/API;
9. protected search/list/detail;
10. notes/Activity + explicit PersonRelationship;
11. duplicate suggestion + explicit merge;
12. custom fields/saved views as needed;
13. staged import/export;
14. deeper Connection/inbound identity and Runtime history integration.

Each slice gets models, migrations, services, protected APIs, tests and generated frontend client changes before production claims widen.

# Production migration rule

Rebuild accepted semantics in protected React/FastAPI/PostgreSQL.

Do not copy localStorage, DOM patching, compatibility `orgId`, browser audience resolution as authority, compatibility target summaries, browser reload save mechanics or client-generated Audit truth.

# Security

Directory contains sensitive personal information.

Preserve protected reads, Origin + CSRF mutations, scope checks, stable IDs, contact privacy, audited material mutations, controlled exports, explicit authority, minimum-necessary AI retrieval and frozen Runtime recipient history later.

Labels/Groups/relationships are metadata/selectors, not implicit permissions.

# Validation target

A mature Directory should answer clearly:

- Who is this Person?
- Which Organizations are they connected to?
- How can they currently be contacted?
- Which methods are preferred/usable?
- Which Labels and Groups include them?
- What explicit relationships matter?
- What changed recently?
- Which Library records and Automations use them?
- Are there duplicate/conflicting identities?
- If an Automation runs, exactly which People resolve and which channels are ready?

If those answers require duplicated ad hoc identity data in every product surface, the Directory architecture is wrong.
