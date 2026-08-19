# Check In / Continuum Context Handoff — CURRENT

Date: 2026-08-18
Status: Current cross-repository continuation guide; Phase 1 production, validated Phase 2A source pending production migration, Automations v4.3 + Directory v2 + AI setup preview active in Lab

This is the first file a new ChatGPT/Codex/developer context should read before changing Continuum or Check In.

# Product map

- **Continuum** = umbrella product.
- **Check In** = current protected application/backend program name in routes/code/specs.
- **Spaces** = briefing/context experience.
- **Directory** = people, organizations, relationships, contact methods and saved audiences.
- **Library** = protected content, files and saved knowledge.
- **Automations** = typed workflow definitions.
- **Connections** = approved paths to outside capability.
- **Runtime** = future server execution/history layer.
- **AI** = bounded intelligence using the same typed domain services as human UI.
- **Afterlife: The Dead Man Switch** = continuity use case on the shared foundation.

Core principle:

> Build the control plane. Rent the capabilities.

# Read order

1. `docs/checkin-context-handoff-CURRENT.md`
2. `docs/continuum-product-CURRENT.md`
3. `docs/continuum-automations-master-plan-CURRENT.md`
4. `docs/continuum-directory-master-plan-CURRENT.md`
5. `docs/checkin-automations-frontend-CURRENT.md`
6. `docs/checkin-directory-library-CURRENT.md`
7. `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md`
8. `CMXChat/jay-app/specs/003-server-checkin/HANDOFF.md`
9. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-PRODUCTION-DEPLOYMENT-RUNBOOK.md`
10. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-CONTINUATION-PLAN.md`
11. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AUTOMATIONS-PLATFORM-PLAN.md`
12. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-DIRECTORY-PLATFORM-PLAN.md`
13. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`
14. `CMXChat/jay-app/specs/003-server-checkin/tasks.md`

Current source-of-truth files beat old chats, dated handoffs and stale READMEs.

# Production truth

Production remains Phase 1.

Reviewed Render release: `de55627926316581808337f8e9c10d26e7d64588`

Production Alembic revision: `c41f9b8d2e70`

Current protected timer:

`successful check in → 72 elapsed hours → grace begins → 24 elapsed hours → triggered if grace expires`

UTC/PostgreSQL/server time is authoritative.

Production does **not** execute email, SMS, Discord, webhook, AI, file-release or other provider Actions. A triggered Incident does not mean an external Action ran.

Phase 1 acceptance T034–T040 is complete.

# Validated Phase 2A source truth

`jay-app/main` contains validated source for the first Library/content + typed Automation slice.

Migration chain:

`c41f9b8d2e70 → f2a0c1d2e3b4 → a31c7d8e9f20`

These Phase 2A revisions are **not deployed to production yet**.

Current validated Library direction:

`LibraryFolder`

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

Current validated Automation direction:

`Automation → mutable AutomationDraft → REVIEW → immutable AutomationVersion`

Current real backend Automation subset remains intentionally small:

- Trigger: `manual`, `checkin_grace_start`, `checkin_grace_expiry`;
- Action: definition-only `manual_review`;
- start policy: `immediate`;
- simple Finish;
- no real Conditions;
- no Runtime/provider/worker/AI execution.

Publish freezes exact immutable ContentVersion identity and later Draft edits cannot rewrite published history.

# Immediate backend boundary

Before broad new Automation/Directory/Planner schema work, execute the prepared Phase 2A production migration/deployment runbook and then the separate first real protected `continuity.md` acceptance proof.

Do not mix new Directory schema, Runtime, provider or AI execution into the already-reviewed Phase 2A migration.

# `/lab/automations/` current truth

The focused route is now **Automations v4.3**.

It remains isolated:

- `connect-src 'self'`;
- no production API calls;
- no provider execution;
- no authoritative scheduling;
- no real Publish;
- no provider secrets;
- no external AI model call.

Current layers:

- v3 Draft/localStorage/autosave compatibility core;
- progressive blank-Draft truth layer;
- v4 command center + Capability Catalog + interactive Flow Preview + Planner/Runs previews;
- 13 editable scenarios;
- Directory readiness integration;
- Audience v4.1 multi-selector Person/Organization/Group/Label targeting;
- Intelligence v4.2 contextual recommendations + typed `Use data` references + richer local step traces;
- **Input routing v4.3** mapping typed sources into named Action input fields.

Current human model remains:

`WHEN → IF → DO → WAIT → TEST`

Finish is configured inside Review. Accepted flow label remains **FLOW PREVIEW**.

`/lab/automations/?new=1&from=lab` still opens a blank Draft directly on Trigger.

# Audience v4.1

Communication Actions can choose multiple Person, Organization, Group and Label selectors.

Lab stores `audienceSelectors[]`, resolves current unique People, deduplicates by Person ID and previews email/phone readiness.

V3 target fields remain compatibility scaffolding only. Production still needs canonical protected Audience resolution/readiness.

# Intelligence v4.2

Actions get context-aware **RECOMMENDED NEXT** suggestions from the same Capability Catalog.

Actions can also select friendly typed source references from Trigger outputs, earlier Action outputs and Directory/Audience values.

Prototype `dataBindings[]` are protected from older compatibility saves through `cmx-lab-automation-data-bindings-v1`.

These are typed references, not free-form executable expressions.

`TEST THIS STEP` shows local input → normalization/resolution → sample output traces and remains explicit that no provider, model, Runtime or real event source was used.

# Input routing v4.3

The focused builder now maps a typed source into a specific receiving field.

Current Lab input slots include:

- Email subject/body;
- AI Task context/focus;
- notification message data;
- manual-review context.

Prototype intent uses `inputBindings[]` with `targetField` plus typed source reference.

Compatibility store: `cmx-lab-automation-input-bindings-v1`.

Production direction is server validation against capability output/input schemas.

# Directory v2 current truth

The main `/lab/` Records surface renders Directory v2 over shared `cmx-lab-crm-v1` prototype state.

Current object views:

- People;
- Organizations;
- Groups / saved audiences.

Current demonstrations include search/views, strong profiles, many-Organization Person membership, ContactMethods/readiness, Labels, explicit Person relationships, notes/Activity, Group resolution, duplicate warnings, Automation usage, mobile list→profile behavior and dark/light presentation.

`lab-directory-v2-polish.css` is presentation-only.

# Directory AI setup preview

Directory now exposes **AI setup** in Lab.

It performs no model call and no mutation. It establishes the intended future UX:

`Describe → Plan → Preflight → Review → Apply`

Fixed examples show how one request could become typed operations across Directory and Automations.

# Cross-domain Continuum Planner

The long-term goal is that a user can describe how they want the environment organized and AI can prepare the whole setup across supported domains.

Canonical architecture:

`natural-language intent → typed Change Plan → deterministic preflight/conflicts → review/approval → normal protected domain services → authoritative state + Activity/Audit`

A Change Plan may eventually propose supported operations involving People, Organizations, memberships, ContactMethods, Labels, Groups, relationships, Automation Drafts, Audience selectors, typed input routing and Library state.

Hard rules:

- AI and humans use the same typed domain services;
- no AI-only contact store or workflow format;
- prompt text is intent, never authority;
- AI cannot invent executable capabilities;
- identity merge remains explicit/high-impact;
- published Automation changes become a new Draft/version proposal;
- external provider side effects remain Runtime behavior, not Planner setup;
- stale revisions, duplicates, permission issues and incompatible mappings are deterministic preflight blockers;
- apply must be idempotent and report partial success honestly when cross-domain atomicity is impossible.

Canonical backend plan:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`

# Directory backend direction

After the Phase 2A release boundary, grow Directory through typed domain slices:

1. Person;
2. Organization;
3. PersonOrganizationMembership;
4. ContactMethod;
5. Label + PersonLabel;
6. Group + typed selectors;
7. canonical audience resolution/readiness;
8. typed Automation Audience;
9. protected search/list/detail;
10. notes/Activity + PersonRelationship;
11. duplicate suggestion + explicit merge;
12. custom fields/saved views/import/export as needed.

Planner mutation execution comes only after the underlying human/API domain services are mature enough to support those same operations safely.

# Runtime / AI order

Keep the high-level order:

1. Phase 2A — private information + typed definitions;
2. Phase 2B — protected human builder/product surfaces;
3. Phase 3 — durable Runtime + fake provider;
4. Phase 4 — one real low-risk provider;
5. Phase 5 — waits/routes/retries/acknowledgements/approvals/escalation;
6. Phase 6 — AI Task execution, then Automation Planner;
7. cross-domain Change Plan apply once mature domain services exist;
8. Phase 7 — bounded Agent;
9. MCP — adapter over mature typed services, never authority bypass.

# Non-negotiable architecture rules

- PostgreSQL/server time is authoritative for protected timing.
- Frontend never accesses PostgreSQL directly.
- Stable protected IDs beat copied names/contact strings.
- Person identity is not one email/phone.
- Labels/relationships do not silently grant permission.
- Audience identity and channel readiness are separate.
- Data flow uses typed source/output/input references, not arbitrary executable expressions.
- Immutable versions/history remain immutable.
- Human UI and AI call the same typed services.
- Prompt text never grants authority.
- Provider secrets stay outside definitions/content/prompts/Audit.
- Unknown executable capability types are rejected.
- No arbitrary Python/JavaScript/shell/SQL/eval workflow logic.
- External/inbound content is untrusted data.
- Lab visual completeness never becomes production truth.
- No broad document-wide MutationObserver loops in accepted frontend paths.

# `/doc/` boundary

`/doc/` explains Continuum and remains under its separate clarity freeze. Do not change it merely because Lab UX changes.

Automation remains the plan. Runtime remains future execution.

# Next backend action

The immediate backend action remains the prepared Phase 2A production migration/deployment sequence, followed by the separate protected `continuity.md` acceptance proof.
