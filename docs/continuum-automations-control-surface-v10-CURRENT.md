# Continuum Automations Control Surface v10 — CURRENT

Date: 2026-08-21
Status: Lab product/control implementation on `agent/automations-control-surface-v10`. Browser-local only. Execution remains off. Protected backend/Runtime semantics are documented separately in `CMXChat/jay-app`.

# Why v10 exists

The accepted Automations Lab had become a strong workflow builder, but ordinary object control was still too hidden.

The product rule is:

> **An Automation is an object you operate over time, not only a form you create.**

V10 adds an operating/control layer without changing the accepted v5 workflow model or pretending that server Runtime exists.

A later v10.1 refinement adds two product proofs without creating a second workflow model:

- explicit browser-local AI-involvement settings in Permissions;
- dependency-aware Action removal warnings.

# Dashboard control

Each Automation row receives a direct contextual `•••` menu.

Current Lab actions:

- Open;
- Duplicate;
- Archive / Restore;
- Delete local copy with explicit confirmation;
- open the existing Manage-all surface.

The existing global Manage surface remains useful for bulk/lifecycle review, but common actions no longer require discovering that separate manager first.

Dashboard copy emphasizes control:

`Build, inspect and control Automation definitions. Execution remains off in Lab.`

# Leaving an Automation

The editor exposes explicit object-level navigation:

- `← Automations`;
- `×` close;
- browser Back / Forward history;
- Escape leaves the editor when no dialog is open and the user is not typing.

The controls delegate to the existing editor close path, so accepted local persistence/autosave semantics stay underneath v10 rather than creating another save engine.

# Definition versus operation

The editor presents one Automation through:

1. **Overview**
2. **Definition**
3. **Runs**
4. **Permissions**
5. **Related**
6. **History**
7. **Settings**

`Definition` remains the existing WHEN → IF → DO → WAIT → TEST builder. V10 does not fork or replace it.

## Overview

Shows lifecycle/readiness, execution truth (`Off in Lab`), trigger/timing, next useful setup/test step, quick lifecycle actions and related-object summary.

## Runs

Truthful future surface only. It explicitly says there are no authoritative Runtime Runs yet and keeps future Pause / Resume / Cancel / Retry controls disabled.

Local simulation never becomes fake Run history.

## Permissions

The base v10 surface keeps the authority boundary visible:

`No execution authority in Lab`.

It previews future effective-authority concepts such as principal, capabilities, protected resources/audiences/Connections and limits/activation/expiry/revocation.

Definition references never become permission merely because the UI can display them.

### v10.1 AI involvement preview

Permissions now also proves a second, separate product axis:

`AI involvement ≠ capability ≠ authority`.

Browser-local options are:

- Off;
- Writing only;
- Recommendations;
- Planning + recommendations;
- Only explicit AI steps;
- Pre-approved options.

Default is `Off`.

The UI explicitly says this is Lab product design only. It does not call a model, grant a capability, widen authority or change production.

It also previews future step-level exceptions. Example:

- an identity may draft email wording;
- recipient resolution may remain deterministic;
- a payment/commitment Action may be AI-off;
- protected Runtime/authority still decides whether an Action can execute.

Protected companion architecture:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-IDENTITY-PARTICIPATION-AND-AI-INFLUENCE-POLICY-CONTRACT.md`.

## Related

Projects explicit local Draft references and teaches the future backend rule that destructive changes need dependency checks against protected relationships, published Versions, frozen Runs, Goals, Connections and other references.

## History

Keeps separate:

- current local Draft/lifecycle activity;
- future immutable published AutomationVersion history;
- future operational Activity / Audit / Why.

No fake production history is generated.

## Settings

Places object controls where users expect them: Edit details, future Runtime state, Archive/Restore, Duplicate and a Danger Zone for Delete local copy.

# Exact workflow editing semantics

The Lab already proves substantial exact-node editing through the accepted v5/v6/v4.4 layers.

## Trigger

A valid workflow keeps one Trigger.

V10.1 adds explicit structural guidance: change/edit/replace the Trigger rather than treating it like an ordinary removable optional step.

Protected direction is `Replace Trigger`, not destructive deletion that leaves a structurally invalid published definition.

## Conditions

Conditions remain editable/removable according to the existing typed workflow model.

## Actions

Actions already support editing, moving, duplicating, disabling/resuming and removal in the current Lab stack.

## Inter-step IF / WAIT

The v4.4/v5 sequence layer supports adding/removing inter-step linear conditions and waits.

WAIT remains future Runtime intent, not a browser execution timer.

## Finish / outcome

Finish/outcome remains a required terminal semantic in the canonical workflow model. Future protected UI should edit/replace it rather than exposing an invalidating generic Delete.

# v10.1 dependency-aware Action removal

A destructive Action mutation should not silently break the rest of the Draft.

V10.1 inspects current browser-local Draft references before the accepted Action removal path runs.

It detects visible dependencies such as:

- pre-action Conditions reading the step output;
- inter-step Conditions reading the step output;
- IF/WAIT flow controls anchored after the Action;
- later Action input/data bindings using the step.

When dependencies exist, the Lab shows a blocking explanation before removal and offers:

- Keep step;
- Review flow;
- Remove anyway in Lab.

`Remove anyway in Lab` is intentionally still available because this is a product prototype and does not have the protected atomic repair service yet.

The dialog clearly says the real backend should return typed impact findings and atomic repair options.

Protected companion architecture:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AUTOMATION-NODE-MUTATION-DEPENDENCY-AND-AI-PARTICIPATION-DECISION.md`.

# Lifecycle behavior in Lab

V10 reuses accepted v7 local semantics.

## Duplicate

Duplicate creates a new local Draft identity and remaps Action IDs, Rule IDs, flow-control IDs, `afterActionId` references and step-output source IDs. Stale `workflowV5` projection data is dropped so v5 rebuilds it.

## Archive / restore

Archive remains a definition lifecycle operation. V10 adds a short-lived Undo control. Archive is deliberately not Runtime Pause.

## Delete Automation

Wording is deliberately `Delete local copy` because this Lab only removes the browser-local prototype record.

Future protected deletion must preserve immutable published history and consequential Audit according to retention policy.

# Browser history

`lab-automations-history-v1.js` records the v10 control view in addition to dashboard/editor/stage/dialog state so Back/Forward can restore Overview, Definition, Runs, Permissions, Related, History and Settings.

# Mobile

Current v10/v10.1 behavior keeps:

- contextual menu as a bottom-sheet style surface;
- horizontally scrollable object tabs;
- direct exit;
- dependency/destructive dialogs respecting safe-area insets;
- one-column object panels;
- touch-safe controls;
- reduced-motion support.

Future consolidation should reassess whether seven visible tabs are the best smallest-phone information architecture; an `Overview · Definition · More` presentation may be easier while preserving the same object model.

# Consolidation before another large version

The Lab has intentionally accumulated accepted proving layers from v3 through v10.1.

That is useful history but should not become permanent production structure.

Before another large feature layer, prefer a consolidation pass that:

- preserves the accepted v5 workflow semantics;
- preserves proven v10 control behavior;
- reduces duplicated DOM/event/state ownership;
- makes node mutation/validation ownership clearer;
- keeps browser-local Lab isolation;
- leaves production React/backend free to use protected services rather than copying localStorage/overlay architecture.

Do not turn `v11` into another giant overlay merely because the product has more ideas.

# Backend companions

Protected direction now includes:

- `CONTINUUM-AUTOMATION-CONTROL-SURFACE-AND-LIFECYCLE-DECISION.md`;
- `CONTINUUM-AUTOMATION-NODE-MUTATION-DEPENDENCY-AND-AI-PARTICIPATION-DECISION.md`;
- `CONTINUUM-IDENTITY-PARTICIPATION-AND-AI-INFLUENCE-POLICY-CONTRACT.md`.

These preserve the distinction between definition lifecycle, Runtime state, AI participation, effective authority, dependencies and immutable Version/Audit retention.

# Files

V10/v10.1 adds/updates:

- `assets/lab/lab-automations-control-v10.js`;
- `assets/lab/lab-automations-control-v10-editor-bootstrap.js`;
- `assets/lab/lab-automations-control-v10.css`;
- `assets/lab/lab-automations-control-v10-1.js`;
- `assets/lab/lab-automations-control-v10-1.css`;
- `assets/lab/lab-automations-history-v1.js`;
- `lab/automations/index.html`;
- `tests/continuum-automations-control-v10.test.js`;
- `tests/continuum-automations-control-v10-1.test.js`;
- `.github/workflows/automations-v10-control-validation.yml`.

# Truth boundary

V10/v10.1 does **not** add:

- provider execution;
- a real AI/model call;
- protected AI participation policy;
- durable Runtime;
- real Pause/Resume/Cancel;
- production duplicate/restore/delete endpoints;
- protected node mutation/repair endpoints;
- production authority grants;
- production Run history;
- production version-history mutation;
- a new workflow engine;
- a second Automation database;
- network calls from the control layers.

The current Lab stays isolated and execution-off.

# Product acceptance rule

A user looking at an Automation should be able to answer:

- How do I leave this?
- What state is it in?
- What is its definition?
- Which exact workflow pieces can I edit/replace/remove?
- What depends on a step before I remove it?
- What has it done / what will Runs mean?
- Is AI involved here, and where?
- What is it actually allowed to do?
- What does it depend on?
- What changed?
- How do I duplicate, archive/restore, disable/pause later, or delete where retention rules permit?

The Lab proves the interaction model now; the protected backend owns the consequential semantics later.
