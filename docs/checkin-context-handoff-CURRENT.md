# Check In / Continuum Context Handoff — CURRENT

Date: 2026-08-18
Status: Current cross-repository continuation guide; Phase 1 production, validated Phase 2A source pending production migration, Automations v4.1 + Directory v2 active in Lab

This is the first file a new ChatGPT/Codex/developer context should read before changing Continuum or Check In.

# Product map

- **Continuum** = umbrella product.
- **Check In** = current protected application/backend program name in routes, code and specs.
- **Spaces** = briefing/context experience.
- **Directory** = people, organizations, relationships, contact methods and saved audiences.
- **Library** = protected content, files and saved knowledge.
- **Automations** = typed workflow definitions.
- **Connections** = approved paths to outside capability.
- **Runtime** = future server execution/history layer.
- **AI** = bounded intelligence using the same typed services as human UI.
- **Afterlife: The Dead Man Switch** = continuity use case on the shared Continuum foundation.

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
9. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-VALIDATION-RESULT-2026-08-18.md`
10. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-PRODUCTION-DEPLOYMENT-RUNBOOK.md`
11. `CMXChat/jay-app/specs/003-server-checkin/PHASE2A-CONTINUATION-PLAN.md`
12. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AUTOMATIONS-PLATFORM-PLAN.md`
13. `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-DIRECTORY-PLATFORM-PLAN.md`
14. `CMXChat/jay-app/specs/003-server-checkin/tasks.md`

Current files beat old chats, dated handoffs and stale READMEs.

# Production truth

Production is still Phase 1.

Reviewed Render release:

`de55627926316581808337f8e9c10d26e7d64588`

Production Alembic revision:

`c41f9b8d2e70`

Current timer:

`successful protected check in → 72 elapsed hours → grace begins → 24 elapsed hours → triggered if grace expires`

UTC/PostgreSQL/server time is authoritative.

Production Phase 1 supports the protected switch/policy/Incident/Audit/session/security system already documented in `jay-app`.

Production does **not** execute email, SMS, Discord, webhook, AI, file-release or other provider Actions.

A triggered Incident does not mean an external Action ran.

Phase 1 acceptance T034–T040 is complete. Do not reopen it without a real defect.

# Validated Phase 2A source truth

`jay-app/main` contains validated source for the first Library/content + typed Automation slice.

Migration chain:

`c41f9b8d2e70 → f2a0c1d2e3b4 → a31c7d8e9f20`

These two Phase 2A revisions are **not deployed to production yet**.

## Library/content

Current validated source:

`LibraryFolder`

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

It includes protected persistence/search/navigation, stale-write protection, immutable versions, dependency projection and database-level immutable-version safeguards.

Binary File storage remains a separate later boundary.

## Automation definitions

Current validated source:

`Automation → mutable AutomationDraft → REVIEW → immutable AutomationVersion`

Current real backend definition subset remains intentionally small:

- Trigger: `manual`, `checkin_grace_start`, `checkin_grace_expiry`;
- Action: definition-only `manual_review`;
- start policy: `immediate`;
- simple Finish boundary;
- Conditions not yet enabled as real backend behavior;
- no provider execution;
- no general Runtime;
- no worker/scheduler;
- no AI execution.

Publish freezes exact immutable ContentVersion identity and later mutable edits cannot rewrite published AutomationVersion history.

# Immediate backend boundary

Before adding broad Automation or Directory backend work, execute the prepared Phase 2A production migration/deployment runbook.

Then perform the separate first real protected `continuity.md` acceptance proof.

Do not mix new Directory schema, Runtime, providers or AI execution into the already-reviewed Phase 2A migration.

# `/lab/automations/` current truth

The focused Automations route is now the v4.1 Lab product surface.

It remains isolated:

- `connect-src 'self'`;
- no production API calls;
- no provider execution;
- no authoritative scheduling;
- no real Publish;
- no provider secrets;
- Planner remains a preview with no model call.

Current structure:

- v3 remains Draft/localStorage/autosave compatibility core;
- progressive-preview layer protects truthful blank Draft state;
- v4 platform layer adds Automations / Templates / Runs, Capability Catalog, flow navigation, per-step tests, preflight and Planner preview;
- v4 scenario layer provides 13 editable starting patterns;
- Directory integration adds readiness/context;
- Audience v4.1 adds real Lab multi-selector audiences for communication Actions.

Current human model remains:

`WHEN → IF → DO → WAIT → TEST`

Finish is configured inside Review.

Accepted preview label remains **FLOW PREVIEW**.

The direct-new URL:

`/lab/automations/?new=1&from=lab`

still opens a blank Draft directly on Trigger.

# Automations Audience v4.1

Communication Actions represented as Notify/Email can now choose multiple Directory selectors in Lab:

- Person;
- Organization;
- Group;
- Label.

The Lab stores prototype `audienceSelectors[]`, resolves current unique People, deduplicates by Person ID and shows email/phone readiness.

Compatibility behavior preserves the v3 engine:

- one Person/Organization can mirror to old `targetRef`;
- larger audiences use a compatibility `targetLabel` summary;
- the adapter saves current v3 state first, writes `audienceSelectors[]`, then reloads the exact Draft so v3 rehydrates the extra fields.

This is **Lab adapter behavior only**.

Production still needs a protected typed Audience model and canonical server-side audience-resolution/readiness service.

# Directory v2 current truth

The main `/lab/` Records surface now renders Continuum Directory v2 over the existing shared `cmx-lab-crm-v1` prototype store.

Current object views:

- People;
- Organizations;
- Groups / saved audiences.

Current UX/model demonstrations include:

- search and useful views;
- Person/Organization/Group profiles;
- Overview / Activity / Relationships / Automation tabs;
- many-Organization Person membership;
- multiple ContactMethod prototype records;
- Labels;
- explicit Person relationships;
- notes and Activity;
- Groups composed from Person/Organization/Label selectors;
- unique-Person Group resolution;
- email/phone readiness;
- exact-email / normalized-phone duplicate warnings;
- direct Automation usage links;
- mobile list → profile behavior;
- light/dark presentation.

The old `.lab-crm` remains compatibility scaffolding and is hidden after Directory v2 loads.

Directory v2 aims for a polished serious-CRM identity/relationship core. It deliberately does not attempt to build all of HubSpot/Pipedrive sales, marketing, support and forecasting products.

# Directory backend direction

Production Directory should grow through stable typed domain models rather than copying the browser store.

Broad order after the current Phase 2A release boundary:

1. Person;
2. Organization;
3. PersonOrganizationMembership;
4. ContactMethod;
5. Label + PersonLabel;
6. Group + typed selectors;
7. canonical audience resolution/readiness service;
8. typed Automation Audience definition/API;
9. protected Directory search/list/detail;
10. notes/activity and explicit PersonRelationship;
11. duplicate suggestion + explicit merge;
12. custom fields/saved views/import/export as needed.

Canonical backend plan:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-DIRECTORY-PLATFORM-PLAN.md`

# Runtime / AI order

Keep the high-level sequence:

1. Phase 2A — private information + typed definitions;
2. Phase 2B — protected human builder and protected product surfaces as matching backend services exist;
3. Phase 3 — durable Runtime + fake provider;
4. Phase 4 — one real low-risk provider;
5. Phase 5 — waits/routes/retries/acknowledgements/approvals/escalation;
6. Phase 6 — AI Task execution, then Planner;
7. Phase 7 — bounded Agent;
8. MCP — adapters over mature typed services.

Directory backend slices can progress after the Phase 2A migration without waiting for Runtime, but they must not destabilize the reviewed release boundary.

# Non-negotiable architecture rules

- PostgreSQL/server time is authoritative for protected timing.
- Frontend never accesses PostgreSQL directly.
- Stable protected IDs beat copied names/email/phone strings.
- Person identity is not one email address or phone number.
- Labels and relationships do not silently grant permission.
- Audience identity and delivery readiness are separate.
- Immutable versions/history stay immutable.
- Human UI and AI call the same typed services.
- Prompt text never grants authority.
- Provider secrets stay outside definitions/content/prompts/Audit.
- Unknown executable capability types are rejected.
- No arbitrary Python/JavaScript/shell/SQL/eval workflow logic.
- External/inbound content is untrusted data.
- Lab visual completeness never becomes production truth.
- No broad document-wide MutationObserver loops in accepted frontend paths.

# `/doc/` boundary

`/doc/` explains Continuum and remains under its separate clarity freeze.

Do not change it merely because Lab UX changes.

Automation remains the plan. Runtime remains the future execution layer.

# Next backend action

The immediate backend action remains the prepared Phase 2A production migration/deployment sequence, followed by the separate protected `continuity.md` acceptance proof.
