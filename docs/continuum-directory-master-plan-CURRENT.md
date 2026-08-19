# Continuum Directory Master Plan — CURRENT

Date: 2026-08-18
Status: Canonical Directory product/UX direction; Lab Directory v2 + polish + AI setup preview, Automations Audience v4.1 and field input routing v4.3 implemented, protected backend expansion pending

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
- `assets/lab/lab-directory-v2-polish.css` — presentation-only density/responsive polish;
- `assets/lab/lab-directory-planner-preview.js` — natural-language AI setup / Change Plan product preview;
- `assets/lab/lab-directory-planner-preview.css` — matching desktop/mobile Planner presentation.

Shared browser store:

`cmx-lab-crm-v1`

Directory-only navigation preferences:

`cmx-lab-directory-ui-v2`

The polish layer adds stronger app hierarchy, sticky desktop controls, denser record/profile presentation and dedicated phone refinements. It does not add persistence or authority.

The AI setup layer is explicitly a preview. It performs no model call and no data mutation. It establishes the future flow from natural-language intent to a reviewed typed Change Plan.

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
- light/dark presentation;
- **AI setup** preview for the future natural-language environment builder.

The original `.lab-crm` remains compatibility scaffolding and is hidden when Directory v2 successfully loads.

# Natural-language AI environment setup

Continuum should eventually let the user describe the environment they want in ordinary language, including requests such as:

- add or organize People;
- connect People to Organizations;
- add Labels and explicit relationships;
- create Groups/saved audiences;
- create or modify Automation Drafts;
- link or organize Library information;
- configure supporting structures that the owner is authorized to change.

This should feel dramatically faster than manual CRM administration while preserving the same domain rules.

The core contract is:

`natural-language intent → AI Planner → typed Change Plan → deterministic preflight → review/approval where required → normal protected domain services → authoritative updated state + Activity/Audit`

## Change Plan

AI should not directly freestyle-mutate tables or UI state.

A Change Plan is a structured proposal containing ordered typed operations such as:

- create Person;
- update Person fields;
- create/update Organization;
- create membership;
- add Label;
- create/update Group selectors;
- create PersonRelationship;
- create/update Automation Draft;
- add typed Audience selectors;
- add typed Automation input routing;
- create/link Library content where supported.

Each operation should include stable references or temporary plan-local references, expected effects, validation/readiness state, risk/approval requirements and conflict information.

A Planner request can span domains, but each operation is still executed by the owning domain service.

## Preview before apply

The user should be able to see what AI proposes before consequential changes are applied.

The preview should clearly distinguish:

- create;
- update;
- link/associate;
- archive/remove;
- blocked/missing prerequisite;
- duplicate/conflict;
- approval required.

Low-risk reversible organizational changes may eventually support broader approval policies, but high-impact or consequential changes must follow the existing capability/authority rules.

## No AI shadow state

Manual UI and AI must converge on the same Person, Organization, Group, Automation Draft and Library models.

Do not create a separate AI-only contact store, AI workflow format or hidden metadata model that becomes impossible to reconcile with human edits.

The current `AI setup` Lab modal is a product preview of this contract only. It explicitly says no model is connected and does not interpret arbitrary text or mutate Directory.

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
- linked Automations and Library information;
- natural-language AI setup over the same typed foundation.

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

The focused Automation Lab can select friendly typed data references from Directory/Audience context, currently including:

- resolved People count;
- email-ready count;
- phone-ready count.

These are **sample/reference UX only**. They prove how Directory values can appear beside Trigger and prior-step outputs in the Automation builder.

They do not make browser resolution authoritative and they do not create an expression engine.

## Automations field input routing v4.3

The focused Automation Lab now also demonstrates **input routing**: a typed source can be assigned to a specific receiving field such as Email subject/body, AI task context/focus, notification message data or human-review context.

Prototype Action fields use `inputBindings[]` with a `targetField` plus typed source reference.

This is the important bridge from “these values exist” to “this exact field receives this exact typed value.”

Production direction remains typed server paths/references validated against real capability input/output schemas and authorized Directory services.

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

AI later accesses Directory through narrow typed protected tools such as search/get Person/get Organization/preview audience/suggest duplicates/propose Group/create or update low-risk Draft state where authorized.

The cross-domain Planner can compose those tools into a Change Plan, but it must still use the same domain services as human UI.

AI cannot silently widen Groups, grant trust/authority, expose hidden contact methods, merge identities, publish consequential Automations or bypass required review.

Backend companion:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`

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

Audience/data pickers and AI setup follow the same bottom-sheet/full-screen mobile pattern with safe-area-aware actions.

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
14. deeper Connection/inbound identity and Runtime history integration;
15. cross-domain AI Change Plan execution only after the relevant domain mutation services are mature enough to support it safely.

Planner UX/contracts can be designed earlier, but AI must not become the implementation path for domain capabilities that human/API services do not yet support.

Each slice gets models, migrations, services, protected APIs, tests and generated frontend client changes before production claims widen.

# Production migration rule

Rebuild accepted semantics in protected React/FastAPI/PostgreSQL.

Do not copy localStorage, DOM patching, compatibility `orgId`, browser audience resolution as authority, compatibility target summaries, browser reload save mechanics or client-generated Audit truth.

The AI setup Lab surface also remains presentation/prototyping only. Production Planner calls protected typed services and returns authoritative post-mutation state.

# Security

Directory contains sensitive personal information.

Preserve protected reads, Origin + CSRF mutations, scope checks, stable IDs, contact privacy, audited material mutations, controlled exports, explicit authority, minimum-necessary AI retrieval and frozen Runtime recipient history later.

Labels/Groups/relationships are metadata/selectors, not implicit permissions.

AI Planner must never use prompt text as authority, silently broaden resource scope or bypass duplicate/merge/approval rules.

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
- If AI is asked to organize the environment, what exact typed changes is it proposing before they are applied?

If those answers require duplicated ad hoc identity data in every product surface, the Directory architecture is wrong.
