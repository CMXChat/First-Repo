# Continuum Automations Operations v7 - CURRENT

Date: 2026-08-19
Status: Accepted focused Automation Lab operating layer over canonical workflow model v5. Browser-local only. Runtime/provider execution remains off.

# Purpose

`/lab/automations/` is now an operating workspace for Automation definitions, not only a builder demo.

V7 adds management/readiness/product-operation UX without changing the canonical workflow model or creating another execution path.

Canonical model remains:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

Start timing and recurrence remain separate policies.

The v3/v4 compatibility editor, v5 ordered model, Planner, typed Change Plan, preflight/review and mobile Action stack remain underneath this layer.

# Product direction

The focused route should feel like an application that somebody operates repeatedly.

Priorities:

- see current Automation definitions quickly;
- understand which Draft needs attention;
- find and filter definitions;
- create from manual flow, scenario or Planner;
- inspect the ordered definition;
- test locally without confusing simulation with execution;
- manage local lifecycle safely;
- keep future Runtime history separate;
- discover future capability families without pretending they are usable today.

Avoid restoring a large explanatory/marketing hero over the workspace.

# Dashboard v7

The top surface is now compact:

`Automation workspace`

with truthful copy that the page builds, inspects and manages workflow definitions while execution remains off in Lab.

The old large status-card deck is suppressed in favor of a compact operations strip.

Current operations summary:

- DRAFTS;
- READY TO TEST;
- NEEDS SETUP;
- RUNTIME LATER.

These are browser-local derived product states only.

They do not widen backend truth and do not imply publication/execution support.

# Readiness

V7 derives local readiness from the current Draft plus v5 structural validation.

Friendly states:

- `Ready to test`;
- `Needs setup`;
- `Runtime later` as a separate support cue.

Current local blockers can include:

- invalid workflow structure;
- no enabled Action;
- missing communication Audience/target;
- missing AI Task instructions;
- missing reusable Action reference;
- incomplete one-time Calendar timing.

`Ready to test` means the local definition is complete enough for Lab testing. It does not mean production Publish or Runtime execution is available.

Production must later derive readiness from typed protected preflight issues, not copy these browser strings.

# Filters and search

The Automation workspace supports:

- All;
- Ready;
- Needs setup;
- Runtime later;
- text search.

Filters are presentation state. They do not become workflow/lifecycle state.

# Automation rows

Automation cards are intentionally denser and more operational.

Each row can surface:

- Draft/lifecycle identity already present in the base UI;
- name;
- concise definition description;
- compact flow preview;
- readiness;
- enabled Action count;
- inter-step rule count;
- inter-step wait count;
- Runtime-later cue;
- first useful setup blocker;
- updated timestamp/timing metadata already provided by the compatibility UI.

The row remains the normal way to open the Automation editor.

# Manage Automations

V7 adds a browser-local management surface.

Current Lab operations:

- Duplicate;
- Archive;
- Restore;
- Delete local copy with explicit confirmation.

Hard boundary:

> These operations only mutate the browser-local Lab store. They never publish, execute or touch production.

The management implementation intentionally reloads the focused route after a lifecycle mutation. The old v3 compatibility editor holds an in-memory copy of localStorage, so reload prevents stale state from later resurrecting a duplicated/archived/deleted definition.

## Duplicate

Lab duplicate creates a new Draft identity and remaps:

- Action IDs;
- pre-action Rule IDs;
- inter-step flow-control IDs;
- `afterActionId` references;
- step-output `sourceId` references.

It removes stale `workflowV5` so the canonical v5 layer normalizes the new Draft again.

Production duplicate must be a protected domain-service operation with ownership, scope, revisions, immutable references and Audit. Do not copy localStorage mutation semantics.

## Archive / restore

Lab toggles Draft/Archived for product proof only.

Production lifecycle semantics remain server-owned and must preserve immutable published history/Audit.

## Delete

Lab deletes only its browser-local prototype record after confirmation.

Production retention/deletion semantics are deliberately unresolved here. Published immutable Versions and consequential Audit must not be silently erased by copying Lab behavior.

# Editor v7

The existing builder remains accepted.

V7 adds a small status strip showing:

- DEFINITION readiness;
- MODEL V5;
- LOCAL DRAFT;
- EXECUTION OFF.

Review can also show a derived readiness panel with current blockers and counts.

This makes the status visible without adding another explanatory page section.

Accepted builder navigation remains:

`WHEN → IF → DO → WAIT → TEST`

Accepted model remains v5 ordered semantics.

# Runs

The Runs surface is now deliberately framed as:

`AUTHORITATIVE RUNS`

`No Runtime history yet`

It is reserved for future server-owned:

- occurrences;
- Run/step state;
- waits;
- attempts;
- outputs;
- failures;
- retries;
- approvals/acknowledgements;
- Audit/provenance.

Local simulation must never be inserted here as fake Run history.

# Templates

Templates are presented more like a tool drawer than another landing page.

They remain ordinary Draft starting patterns.

`template → normal editable Draft`

No separate template execution engine.

# Future capability cues

The Capability Catalog now includes a small architecture-only `LATER` group for concepts already accepted across Continuum:

- **Signal observed** — future WHEN;
- **Current State matches** — future IF;
- **Update Goal progress** — future DO;
- **Wait for a State change** — future FLOW/Runtime control.

These cards are discoverability only.

They cannot be selected into a Draft and do not execute anything.

Each card explains that protected services, typed definitions, policy checks and Runtime behavior must exist first.

This keeps the Automation product visually aligned with the larger architecture without converting future plans into implementation claims.

# Signals and State

Future path remains:

`Source → Observation → Signal → State → Automation eligibility`

Signal evidence can make an Automation eligible or update State. It never grants authority.

A future State Condition reads protected server-owned current State.

# Goals / Missions

Goals remain above ordinary Automations.

A future Automation may be child work for a Goal or contribute typed progress/evidence. Automation authoring never gains permission to rewrite Goal success criteria, hard constraints, stop rules or authority.

# Durable wait

`Wait for a State change` is intentionally a future Runtime capability.

It must eventually persist server-owned waiting state and resume correctly through worker/server restarts.

Browser event listeners/timers are never durable execution authority.

# Planner

Planner remains the accepted typed-authoring direction.

Current local deterministic proving path remains:

`intent → typed plan → ordered v5 flow → Change Plan → preflight → Change Review → ordinary Draft`

V7 does not create a new Planner format.

Future Planner management requests such as duplicate/archive/fix setup/add Signal Trigger must call the same protected services as human UI.

# Mobile

V7 keeps mobile as an operating surface, not squeezed desktop.

At narrow widths:

- workspace heading remains compact;
- New Automation stays obvious;
- status summary can scroll horizontally;
- filter controls remain tap-sized;
- readiness remains readable on each Automation;
- Manage Automations becomes a bottom-sheet style surface;
- destructive action still requires confirmation;
- the existing v6 mobile Action stack remains authoritative for DO-stage compact authoring.

# Files

V7 final layer:

- `assets/lab/lab-automations-operations-v7.js`;
- `assets/lab/lab-automations-operations-v7.css`;
- `assets/lab/lab-automations-operations-v7-future.css`;
- `tests/continuum-automations-operations-v7.test.js`;
- `.github/workflows/automations-v7-operations-validation.yml`.

Route load order keeps v7 last after accepted authoring layers.

Browser marker:

`data-lab-automations-operations="v7"`

Page marker:

`data-operations-v7="ready"`

# Route registry

`/lab/automations/` is registered in `assets/cmx-routes.json` as the active direct-link-only Continuum Automations Lab.

# Security / truth boundary

V7 adds no:

- network/provider call;
- production API mutation;
- model execution;
- authoritative scheduler;
- Publish;
- Runtime;
- Signal observation service;
- Goal orchestration service;
- prompt-granted authority;
- arbitrary executable code.

The final layer contains no `fetch`, XHR, WebSocket, EventSource, `eval` or dynamic Function path.

# Backend companion

Canonical backend alignment:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AUTOMATION-OPERATIONS-WORKSPACE-CONTRACT.md`

That contract defines future protected list/readiness/lifecycle/Run/capability semantics without changing the existing production deployment boundary.

# Next implementation direction

After this Lab operating layer is accepted, the next meaningful work is backend/product migration, not another browser-local workflow engine.

Recommended protected sequence remains:

1. explicitly authorize and complete the already-validated Phase 2A production migration/deployment;
2. prove the separate protected `continuity.md` slice;
3. expand protected Automation authoring/readiness one typed family at a time;
4. build the React operating workspace using generated client/server Drafts;
5. build durable linear Runtime with fake provider;
6. add persisted waits/retries/approvals/acknowledgements;
7. add real provider capability in the approved phase order;
8. add Signals/State/Goals integration only as their protected services mature.

Do not use continued Lab polish as a substitute for the server foundation.