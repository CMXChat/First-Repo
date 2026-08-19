# Check In / Continuum Context Handoff — CURRENT

Date: 2026-08-18
Status: Current cross-repository continuation guide; Phase 1 production, validated Phase 2A source pending production migration, Automations v5 model + ordered Flow Preview + v4.4 authoring UX + Directory v2 active in Lab

This is the first file a new ChatGPT/Codex/developer context should read before changing Continuum or Check In.

# Product map

- **Continuum** = umbrella product.
- **Check In** = current protected application/backend program name.
- **Spaces** = briefing/context experience.
- **Directory** = people, organizations, relationships, contact methods and saved audiences.
- **Library** = protected content, files and saved knowledge.
- **Automations** = typed workflow definitions.
- **Connections** = approved paths to outside capability.
- **Runtime** = future server execution/history.
- **AI** = bounded intelligence using the same typed services as human UI.
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

Current files beat older chats, dated handoffs and stale READMEs.

# Production truth

Production remains Phase 1.

Reviewed Render release: `de55627926316581808337f8e9c10d26e7d64588`

Production Alembic revision: `c41f9b8d2e70`

Current protected timer:

`successful check in → 72 elapsed hours → grace begins → 24 elapsed hours → triggered if grace expires`

UTC/PostgreSQL/server time is authoritative.

Production does **not** execute email, SMS, Discord, webhook, AI, file release or other provider Actions. A triggered Incident does not mean an external Action ran.

Phase 1 acceptance T034–T040 is complete.

# Validated Phase 2A source truth

`jay-app/main` contains validated source for the first Library/content + typed Automation slice.

Migration chain:

`c41f9b8d2e70 → f2a0c1d2e3b4 → a31c7d8e9f20`

These Phase 2A revisions are **not deployed to production yet**.

Validated Library direction:

`LibraryFolder`

`ContentAsset → mutable ContentDraft → immutable ContentVersion`

Validated Automation direction:

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

Before broad new Automation/Directory/Planner schema work, execute the prepared Phase 2A production migration/deployment runbook and then the separate first protected `continuity.md` acceptance proof.

Do not mix new Directory schema, Runtime, providers or AI execution into the reviewed Phase 2A migration.

# `/lab/automations/` current truth

The focused route now has a **v5 canonical Lab workflow model and ordered Flow Preview** underneath the current v4.4 Actions-stage authoring experience.

It remains isolated:

- `connect-src 'self'`;
- no production API calls;
- no provider execution;
- no authoritative scheduling;
- no real Publish;
- no provider secrets;
- no external AI model call.

Current stack:

- v3 Draft/localStorage/autosave compatibility editor;
- **v5 canonical workflow normalization/validation model** in `lab-automations-model-v5.js`;
- progressive blank-Draft truth;
- v4 command center + Capability Catalog + compact interactive Flow Preview + Planner/Runs previews;
- **15 editable scenarios**;
- Directory readiness;
- Audience v4.1 Person/Organization/Group/Label composition;
- Intelligence v4.2 recommendations + typed `Use data` references + richer local step traces;
- Input Routing v4.3 typed source → named Action input;
- Advanced Flow v4.4 linear inter-step IF / WAIT authoring UX;
- **ordered v5 Flow Preview** in `lab-automations-flow-v5.js/.css`.

Beginner rail remains:

`WHEN → IF → DO → WAIT → TEST`

Finish stays inside Review. Accepted product label remains **FLOW PREVIEW**.

`/lab/automations/?new=1&from=lab` still opens Trigger directly.

# Canonical Lab workflow model v5

Each Automation can carry `workflowV5`, a normalized ordered definition.

Current node model:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

Start timing and recurrence remain separate policies because they are not the same thing as an inter-step WAIT.

V5 normalizes and validates the accepted browser Draft shape while projecting compatibility fields back for older UI code.

Compatibility fields include:

- `trigger`;
- `conditions[]`;
- `actions[]`;
- `flowControls[]`;
- `timing`;
- `repeatConfig`;
- `outcome`.

Structural validation currently enforces:

- one Trigger and one Finish;
- Trigger first and Finish last;
- unique node IDs;
- pre-action Conditions before Actions;
- sequence controls only between Actions;
- a step-output Condition cannot reference a future or missing Action.

Browser marker:

`data-lab-automations-model="v5"`

This is **Lab model truth only**. It is not production schema or Runtime truth.

# V5 owns inter-step mutation

The v4.4 Actions UI remains the visible editor for inter-step IF/WAIT, but the mutation path now prefers the canonical v5 API:

- read: `CMXAutomationModelV5.getFlowControls()`;
- write: `CMXAutomationModelV5.setFlowControls()`.

`flowControls[]`, `afterActionId` and `cmx-lab-automation-flow-controls-v1` remain compatibility projection/fallback for the older editor.

Browser marker when v5 owns the path:

`data-lab-automations-sequence-model="v5"`

This prevents the compatibility flow-control store from becoming a second permanent workflow engine.

# Ordered v5 Flow Preview

The compact Flow Preview remains the beginner stage navigator and preserves progressive pending-state truth.

The new **ORDERED SEQUENCE** view renders the canonical v5 flow underneath it.

For a complex Draft it can visibly show:

`WHEN Manual start`

`DO AI task`

`IF Step 1 · AI priority equals urgent`

`WAIT 2h`

`DO Notify`

`FINISH End workflow`

Behavior:

- complex flows expand the ordered sequence by default;
- simple flows remain collapsed by default;
- Show/Hide is presentation-only;
- ordered rows navigate back to the correct builder stage;
- start timing/recurrence appears separately as a `START` policy row;
- blank/new Drafts inherit the progressive DOM truth, so compatibility defaults cannot leak as user intent;
- mobile renders the same sequence vertically with larger tap targets.

Browser marker:

`data-lab-automations-flow="v5"`

# IF and WAIT semantics

The top-level IF stage happens before the DO sequence, so it may only use data available before Actions run.

Output-dependent logic belongs after the Action that produced the output.

Example:

`AI task → IF AI priority equals urgent → Notify`

Current IF operators: equals, does not equal, contains, greater than, less than, is true.

The source picker only exposes Trigger data and outputs available by that point in the flow.

False stops the remaining linear path in the preview.

There is **no YES/NO branching graph yet**.

Inter-step WAIT is separate from current start Timing and is marked `RUNTIME REQUIRED`. Future Runtime must persist due state across server/process restarts.

# Scenarios

Current total: **15 editable starting patterns**.

Newest advanced patterns:

- **Urgent AI follow-up** — AI assessment → IF priority is urgent → notification;
- **Delayed backup escalation** — primary escalation → WAIT two hours → backup escalation.

They create ordinary Drafts and normalize into the same v5 model. They do not imply Runtime/provider execution exists.

# Audience / data / input routing

Audience v4.1 stores richer `audienceSelectors[]` intent and previews current Person-ID-deduped resolution/readiness.

V4.2 uses typed source references rather than executable expressions. Compatibility store: `cmx-lab-automation-data-bindings-v1`.

V4.3 maps those sources into named inputs such as Email subject/body, AI Task context/focus, Notify message data and Manual Review context. Compatibility store: `cmx-lab-automation-input-bindings-v1`.

Step tests preserve the receiving-field route, for example `Body data ← Step 1 · AI summary`.

Production needs canonical server Audience resolution and typed output/input compatibility validation.

# Directory v2 + AI setup

Main `/lab/` Records renders Directory v2 over browser-local `cmx-lab-crm-v1`.

Current concepts include People, Organizations, Groups, many-Organization membership, ContactMethods/readiness, Labels, Person relationships, notes/Activity, Group resolution, duplicate warnings, Automation usage and first-class mobile/light/dark presentation.

Directory `AI setup` is a preview only. It makes no model call or mutation and demonstrates:

`Describe → Plan → Preflight → Review → Apply`

# Cross-domain Continuum Planner

Long-term goal: the user can describe how they want Continuum organized and AI prepares the setup through the same typed services humans use.

Canonical flow:

`natural-language intent → typed Change Plan → deterministic preflight/conflicts → review/approval → normal protected domain services → authoritative state + Activity/Audit`

Potential supported operations later include Directory identity/relationships/Groups, Automation Drafts/Audiences/typed data routing/supported flow controls and Library organization/content.

V5 is intentionally closer to the Automation shape Planner should eventually target because the workflow is expressed as explicit typed ordered nodes instead of UI-only stage assumptions.

Hard rules:

- no AI-only database/contact/workflow format;
- prompt text is intent, never authority;
- AI cannot invent executable capabilities;
- identity merge remains explicit/high-impact;
- published Automation changes become a new Draft/version proposal;
- external provider effects remain Runtime behavior;
- stale revisions/duplicates/permissions/incompatible mappings are deterministic blockers;
- apply is idempotent and reports partial success honestly when cross-domain atomicity is impossible.

Canonical backend plan: `CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`.

# Directory backend direction

After the Phase 2A production boundary, grow Directory through typed domain slices: Person, Organization, membership, ContactMethod, Label, Group/selectors, canonical Audience resolution, Automation Audience, protected search/detail, Activity/notes/PersonRelationship, duplicate suggestion/explicit merge, then custom fields/saved views/import-export as needed.

Planner mutation execution comes only after matching human/API domain services exist.

# Runtime / AI order

Keep the backend canonical phase order. Broadly:

1. Phase 2A private information + typed definitions;
2. protected human builder/domain surfaces;
3. durable linear Runtime + fake provider;
4. approved provider phases;
5. persisted waits/retries/acknowledgements/approvals and later typed routing;
6. AI Task then Planner;
7. cross-domain Change Plan apply after mature services;
8. bounded Agent later;
9. MCP as adapter, never authority bypass.

Lab v5 modeling/presentation does not move branching/WAIT execution forward in that order.

# Validation

Dedicated `automations-v5-model-validation.yml` protects:

- v5 model syntax and ordered normalization;
- future-step reference rejection;
- v5-owned flow-control mutation and compatibility projection;
- 15 scenarios and the two advanced examples;
- ordered Flow Preview source/style contracts;
- blank-Draft `Choose a trigger` / `Choose an action` truth;
- mobile/direct-new markers.

The GitHub connector available in this context does not expose push-triggered workflow-run results, and this environment cannot resolve GitHub/db.cmxchat.com over its container network. Therefore source/workflow contracts are committed, but do **not** claim an independently observed green push run or live Pages pickup until a later context can verify it.

# Non-negotiable rules

- PostgreSQL/server time authoritative for protected timing.
- Frontend never accesses PostgreSQL directly.
- Stable protected IDs beat copied mutable names/contact strings.
- Person identity is not one email/phone.
- Labels/relationships do not silently grant permission.
- Audience identity and readiness are separate.
- Data flow uses typed source/output/input references, not arbitrary executable expressions.
- Immutable history stays immutable.
- Human UI and AI call the same typed services.
- Prompt text never grants authority.
- Provider secrets stay outside definitions/content/prompts/Audit.
- Unknown executable capability/Planner operation types are rejected.
- No arbitrary Python/JavaScript/shell/SQL/eval workflow logic.
- External/inbound content is untrusted data.
- Lab visual/model completeness never becomes production truth.
- No broad document-wide MutationObserver loops in accepted frontend paths.

# `/doc/` boundary

`/doc/` remains under its separate clarity freeze. Do not edit it merely because Lab UX/model changes.

# Next backend action

The immediate backend action remains the prepared Phase 2A production migration/deployment sequence, followed by the separate protected `continuity.md` acceptance proof.
