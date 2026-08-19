# Continuum Directory, Audiences, Library & Planner — CURRENT

Date: 2026-08-19
Status: Current cross-domain frontend handoff; Directory v2 + typed Planner v2 + shared Planner Contract/Preflight/Change Review, Automations v5 + mobile Action-stack v6, Audience v4.1 and typed data/input routing active in Lab; protected backend expansion pending

# Read this with

- `checkin-context-handoff-CURRENT.md` — current cross-repository truth;
- `continuum-directory-master-plan-CURRENT.md` — durable Directory direction;
- `continuum-automations-master-plan-CURRENT.md` — Automation product/model direction;
- `checkin-automations-frontend-CURRENT.md` — exact focused Automations truth;
- `checkin-library-premium-CURRENT.md` — Library direction;
- `checkin-content-editor-CURRENT.md` — native content/editor direction;
- `checkin-files-CURRENT.md` — binary File direction;
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-DIRECTORY-PLATFORM-PLAN.md` — backend Directory plan;
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md` — protected Planner / Change Plan contract.

Current `*-CURRENT.md` files and current source/tests win over older CRM/Audience/Automation prototypes.

# Cross-domain model

```text
Directory = who
Library = what information
Automations = what should happen
Runtime = what actually happened
Planner = typed help using the same domain services
```

Durable relationship:

```text
stable Directory / Library references
→ Automation Draft / Version
→ server eligibility + authoritative preflight
→ exact authorized resolution
→ frozen execution inputs
→ Runtime later
```

Human UI and AI must converge on the same protected domain models. There is no AI-only contact store, workflow format or Library state.

# Directory v2 Lab truth

The main `/lab/` Records area renders **Directory v2** over browser-local prototype state.

Active core files:

- `assets/lab/lab-crm.js`;
- `assets/lab/lab-directory-v2.js/.css`;
- `assets/lab/lab-directory-v2-polish.css`;
- `assets/lab/lab-directory-planner-preview.js/.css`;
- `assets/lab/lab-continuum-planner-contract-v1.js`;
- `assets/lab/lab-continuum-planner-preflight-v1.js/.css`;
- `assets/lab/lab-continuum-planner-review-v1.js/.css`.

Shared prototype store: `cmx-lab-crm-v1`.

Directory navigation state: `cmx-lab-directory-ui-v2`.

Visible object types:

- People;
- Organizations;
- Groups / saved audiences.

Current Lab demonstrations include search/views, strong profiles, many-Organization Person membership, multiple ContactMethods/readiness, Labels, explicit Person relationships, notes/Activity, Group resolution, duplicate warnings, Automation usage links, light/dark presentation and first-class mobile treatment.

Production must use typed protected server models/services instead of these browser shapes.

# Durable Directory identity rules

## Person

Stable human identity. Names, email, phone, memberships and Labels are mutable attributes/relationships.

## Organization

Stable organization identity with many Person memberships.

## PersonOrganizationMembership

Production is many-to-many. One scalar `orgId` is compatibility only.

## ContactMethod

Email/phone become durable endpoint records with stable identity, normalized/display value, preferred/active/readiness state and provenance.

## Label

Descriptive metadata. A Label never grants permission by itself.

## Group

Saved audience distinct from Label and Organization. Current Lab selectors may reference Person / Organization / Label and resolve to unique Person IDs.

Nested Groups remain deferred.

## PersonRelationship

Explicit Person-to-Person context such as family, partner, lawyer, doctor, accountant, emergency contact or business partner. Relationship type does not silently grant authority.

# Directory Planner typed-v2

The Directory command bar exposes **AI setup**, opening **CONTINUUM PLANNER · PREVIEW**.

Browser marker: `data-lab-directory-planner="typed-v2"`.

Current product flow:

`Describe → typed Change Plan → typed Preflight → Review → future protected Apply`

Current safety boundary:

- no AI/model call;
- no arbitrary free-text interpretation;
- no protected mutation;
- no production API;
- no provider execution;
- no hidden authority.

Free text demonstrates the future contract only. Fixed examples show the current typed vocabulary.

Examples include:

- Family setup;
- Business contacts;
- Continuity setup;
- **Full Continuum setup** spanning Directory + Library + Automations.

The Full Continuum example proves the intended composition:

```text
resolve People
→ create/update Groups
→ create Continuity Library folder/document Draft
→ create Automation Draft
→ reference Audience selectors
→ reference Library content
→ propose inter-step WAIT
```

It remains fixed product data, not generated AI output.

# Shared Planner Contract v1

Both Directory and focused Automations load:

`assets/lab/lab-continuum-planner-contract-v1.js`

Browser marker: `data-lab-planner-contract="v1"`.

This is one **browser proving vocabulary** for typed Change Plan operations.

Current operation families include Directory identity/relationship/audience changes, Library folder/document creation and Automation Draft/Trigger/Action/Condition/WAIT/Finish/reference changes.

Each registry entry carries product metadata:

- owning domain;
- operation family;
- effect such as Resolve / Create / Update / Link;
- review class.

Plans can also express browser-only dependency semantics:

- operation `id`;
- `dependsOn[]`;
- temporary `produces` result using `temp:…`;
- `uses[]` references to earlier plan-local results.

The validator rejects missing/future dependencies, unavailable temp refs, duplicate temp results and invalid non-temporary produced refs.

Current CI also extracts Planner operation literals and rejects operation types absent from the shared Lab registry.

This browser registry and its temporary refs are **not** the future server allowlist/identity model. The protected Planner later owns authoritative operation registration, plan-local references and stable-ID resolution during apply.

# Shared typed Preflight v1

Both Planner surfaces load:

- `assets/lab/lab-continuum-planner-preflight-v1.js`;
- `assets/lab/lab-continuum-planner-preflight-v1.css`.

Browser marker: `data-lab-planner-preflight="v1"`.

The shared contract currently has proving issue families for:

- ambiguous Directory matches;
- protected identity checks;
- missing Audience selection;
- unconfirmed Automation timing;
- Runtime requirement;
- protected Library service requirement;
- missing Connection;
- explicit authority approval;
- invalid Planner dependencies;
- generic review requirement.

The UI keeps five meanings distinct:

- **CHECK REQUIRED** — an unresolved review choice;
- **PREVIEW DECISION** — a local sample choice has been recorded;
- **DEFERRED TO DRAFT** — the Draft may be created while the requirement stays incomplete;
- **BLOCKED** — the required protected service/capability/Runtime is unavailable;
- **APPROVAL REQUIRED** — an authority decision Planner cannot make for itself.

Directory's Business contacts example demonstrates an ambiguity review. The user may choose `Use existing match` or `Keep separate`, then change that preview decision again. No Person/Organization is mutated.

Automation examples can defer an Audience or timing requirement to the Draft. Runtime/Connection/server/authority requirements cannot be made green by the Lab.

Each issue is linked to the affected Change Plan operation when a current proving mapping exists. The row itself can display `CHECK`, `DECISION`, `DEFERRED`, `BLOCKED`, or `APPROVAL`, while the issue card says `AFFECTS CHANGE ##`.

The current local adapters still begin with human-readable blocker strings, which `classifyIssue()` maps into shared issue codes. This is intentionally prototype glue. Production must return structured authoritative issues from server domain services. It must not depend on matching English warning text.

# Shared Change Review v1

Both Planner surfaces also load:

- `assets/lab/lab-continuum-planner-review-v1.js`;
- `assets/lab/lab-continuum-planner-review-v1.css`.

Browser marker: `data-lab-planner-review="v1"`.

Each typed operation can display:

- effect: CREATE / UPDATE / LINK / RESOLVE;
- owning domain;
- review class;
- plan-local production/use/dependency links;
- typed Preflight state when that issue maps to the operation.

The **CHANGE REVIEW** summary presents typed change count, unresolved issues, approval/check state and linked-step/domain context.

Reviewed/deferred issues are no longer counted as unresolved. Real blocked/approval items remain visible.

This is product/UX proof. Authoritative identity resolution, current revisions, permissions, risk decisions, approval and apply remain server-owned.

# Mobile / Samsung QA

The shared Planner work is covered by rendered Chromium checks at **360×800** and **390×844** where relevant.

Current checks include:

- no horizontal overflow;
- Directory `AI setup` and New controls do not overlap;
- key controls meet 44px+ tap sizing;
- Planner modals fit the viewport;
- Change Review and plan dependencies render;
- typed Preflight renders;
- Directory ambiguity moves from CHECK to a preview DECISION on the affected Change Plan row;
- Automation Audience can move from CHECK to DEFERRED on the affected row;
- Runtime WAIT stays BLOCKED after that defer;
- richer review/preflight content still fits the phone viewport.

Directory mobile QA also resets the New action from older absolute positioning to the current command-bar grid so AI setup and New cannot collide on narrow phones.

# Automations v5 + mobile Action stack relationship

Focused route: `/lab/automations/`.

Canonical browser semantic shape:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

The beginner rail remains:

`WHEN → IF → DO → WAIT → TEST`

Start timing and recurrence remain separate policies.

V5 gives Planner/Audience/data integration explicit workflow positions instead of relying on screen order alone.

Mobile Action-stack v6 now collapses multi-Action DO views into compact step rows with one expanded step at a time, explicit Edit/Hide and a separate labeled Remove control. Multiple Actions can be removed through the existing v3 mutation path. The final compatibility Action remains protected as `Only step` for now.

This is frontend authoring UX only. Do not infer a new backend Action model from it.

# Automations Planner v5

The focused Planner remains deterministic/local and explicitly non-AI.

It renders:

1. **ORDERED V5 FLOW**;
2. **CHANGE PLAN** operations and dependencies;
3. **PREFLIGHT · TYPED REVIEW**;
4. shared **CHANGE REVIEW**.

`Use this draft` creates a normal browser-local Automation Draft and normalizes it through `CMXAutomationModelV5`.

No model, backend, provider or Runtime call occurs.

# Audience v4.1

Communication Actions can compose selectors from Person / Organization / Group / Label.

Prototype intent uses `audienceSelectors[]`.

Browser preview expands current membership, deduplicates by Person ID and shows email/phone readiness.

Old `targetRef` / `targetLabel` remain compatibility scaffolding.

Production needs canonical protected Audience resolution/readiness.

# Typed data and input routing

## Intelligence v4.2

Friendly typed sources may come from Trigger data, earlier Action outputs and Directory/Audience values such as resolved People count and channel-readiness counts.

Compatibility store: `cmx-lab-automation-data-bindings-v1`.

No arbitrary executable expression language.

## Input Routing v4.3

Typed source outputs can feed named receiving fields such as Email subject/body, AI Task context/focus, notification message data and Manual Review context.

Compatibility store: `cmx-lab-automation-input-bindings-v1`.

Durable direction:

`typed source output → compatible typed receiving input`

Production validates compatibility against server Capability Registry schemas.

# Advanced flow

Important distinctions:

- top-level IF = pre-action rule;
- inter-step IF = can use earlier Action output;
- start Timing = when first Action may start;
- inter-step WAIT = future durable workflow state.

The current v4.4 authoring UI reads/writes inter-step controls through v5 first.

Current inter-step IF is a linear gate only. There is no YES/NO branch graph yet.

Inter-step WAIT remains `RUNTIME REQUIRED` and is never implemented as browser sleep authority.

# Library boundary

Native protected content direction:

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

Binary direction:

`FileAsset → immutable FileVersion → private object storage`

Directory may project stable Library associations later. Published workflows freeze exact immutable content/file versions where reproducibility requires it.

Current Planner `library.*` operations are product vocabulary only. The Lab does not execute them.

# Contact readiness and historical truth

Identity resolution and delivery readiness remain separate.

A Person may exist without usable email/phone. A Group may resolve People with mixed readiness.

Production preflight should return deterministic counts/reasons before Publish/Run.

Future Runtime freezes exact recipient/contact endpoints and other execution inputs so history does not change when Directory data later changes.

# Duplicate / merge

Current Lab warnings and ambiguity choices are conservative product proofs.

Production merge remains explicit/high-impact. AI cannot silently merge People because names look similar. A preview `Use existing match` choice does not perform a real protected merge or match.

# Activity vs Audit

Directory Activity is user-facing history.

Immutable security Audit remains separate.

Future Planner apply should preserve provenance showing what was proposed, reviewed, approved, applied, blocked, deferred or partially failed.

# Production backend boundary

Current production still has no general:

- Directory v2 persistence;
- canonical Group/Label Audience resolver;
- typed multi-selector Automation Audience service;
- typed Automation data/input/inter-step service matching Lab;
- server equivalent of Lab v5;
- authoritative Planner operation registry;
- authoritative structured Planner preflight/review/apply;
- Runtime / persisted WAIT / branch execution;
- provider delivery;
- AI Task / Planner execution.

The validated Phase 2A Library + typed Automation source remains pending deliberate production migration/deployment.

Lab modeling/review completeness does not widen production truth.

# Backend order

After the current Phase 2A release boundary:

1. Person + Organization;
2. PersonOrganizationMembership;
3. ContactMethod;
4. Label + Group selectors;
5. canonical Audience resolution/readiness;
6. typed Automation Audience/input contracts as schemas become real;
7. protected Directory search/detail + relationships/Activity;
8. duplicate suggestion + explicit merge;
9. Library/File relationships as needed;
10. protected human Automation builder over server Drafts;
11. durable linear Runtime before persisted WAIT/branching;
12. AI Task / Planner after underlying human/API services mature;
13. cross-domain Change Plan apply after those same domain services can safely execute every operation.

Immediate backend action remains the prepared Phase 2A production migration/deployment sequence followed by the separate protected `continuity.md` proof.

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
- browser Audience/data/Planner/Preflight/Change Review results never become production authority;
- immutable published/history records stay immutable;
- external/inbound content remains untrusted data;
- no broad document-wide MutationObserver loops in accepted frontend paths.
