# Continuum Automations Control Surface v10 — CURRENT

Date: 2026-08-21
Status: Lab product/control implementation on `agent/automations-control-surface-v10`. Browser-local only. Execution remains off. Protected backend/Runtime semantics are documented separately in `CMXChat/jay-app`.

# Why v10 exists

The accepted Automations Lab had become a strong workflow builder, but ordinary object control was still too hidden.

The owner identified the core problem directly: after creating an Automation it should be obvious how to leave it, duplicate it, archive/restore it, delete it where allowed, understand its state, and eventually operate its Runs and permissions.

The product rule is now:

> **An Automation is an object you operate over time, not only a form you create.**

V10 adds an operating/control layer without changing the accepted v5 workflow model or pretending that server Runtime exists.

# Dashboard control

Each Automation row now receives a direct contextual `•••` menu.

Current Lab actions:

- Open;
- Duplicate;
- Archive / Restore;
- Delete local copy with explicit confirmation;
- open the existing Manage-all surface.

The existing global Manage surface remains useful for bulk/lifecycle review, but common actions no longer require discovering that separate manager first.

Dashboard copy is tightened to emphasize control:

`Build, inspect and control Automation definitions. Execution remains off in Lab.`

# Leaving an Automation

The editor now exposes explicit object-level navigation:

- `← Automations`;
- `×` close;
- browser Back / Forward history;
- Escape leaves the editor when no dialog is open and the user is not typing.

The controls delegate to the existing editor close path, so the accepted local persistence/autosave semantics stay underneath v10 rather than creating another save engine.

The old ambiguous arrow remains in the underlying v3 markup for compatibility but is visually replaced by the v10 object bar.

# Definition versus operation

The editor now presents one Automation through these sections:

1. **Overview**
2. **Definition**
3. **Runs**
4. **Permissions**
5. **Related**
6. **History**
7. **Settings**

`Definition` is the existing WHEN → IF → DO → WAIT → TEST builder. V10 does not fork or replace it.

The other sections are object/operation views around that same definition.

## Overview

Shows:

- lifecycle state;
- deterministic Lab readiness;
- execution truth (`Off in Lab`);
- trigger;
- timing;
- next useful setup/test step;
- quick Edit/Test/Duplicate/Archive controls;
- related-object summary.

## Runs

Truthful future surface only.

It explicitly says there are no authoritative Runtime Runs yet and shows future operation controls as disabled:

- Pause future execution;
- Resume;
- Cancel future work;
- Retry failed step.

Local simulation is never presented as a real Run.

## Permissions

Makes the authority boundary visible:

`No execution authority in Lab`.

It previews the categories a future protected effective-authority view should explain:

- principal;
- capabilities;
- protected resources/audiences/Connections;
- limits and activation/expiry/revocation.

Definition references never become permission merely because the UI can display them.

## Related

Projects explicit local Draft references such as:

- People;
- Organizations;
- protected targets;
- reusable Actions.

It also teaches the future backend rule that destructive changes need dependency checks against protected relationships, published Versions, frozen Runs, Goals, Connections and other references.

## History

Keeps three different histories conceptually separate:

- current local Draft/lifecycle activity;
- future immutable published AutomationVersion history;
- future operational Activity / Audit / Why.

No fake production history is generated.

## Settings

Places object controls where users expect them:

- Edit details;
- future execution state (disabled until Runtime exists);
- Archive / Restore;
- Duplicate;
- explicit Danger Zone for Delete local copy.

# Lifecycle behavior in Lab

V10 reuses the accepted v7 local semantics rather than inventing a second model.

## Duplicate

Duplicate creates a new local Draft identity and remaps:

- Action IDs;
- Rule IDs;
- flow-control IDs;
- `afterActionId` references;
- step-output source IDs.

Stale `workflowV5` projection data is dropped so the accepted v5 layer can rebuild it.

## Archive / restore

Archive remains a definition lifecycle operation.

V10 adds a short-lived Undo control for the browser-local archive/restore mutation.

Archive is deliberately not treated as Runtime Pause.

## Delete

Wording is deliberately:

`Delete local copy`

because this Lab only removes the browser-local prototype record.

The confirmation explains that future protected deletion has different retention obligations. Published immutable versions and consequential Audit must not be silently erased by copying localStorage behavior into production.

# Browser history

`lab-automations-history-v1.js` now records the v10 control view in addition to the existing dashboard/editor/stage/dialog state.

Browser history can therefore restore views such as:

- Overview;
- Definition;
- Runs;
- Permissions;
- Related;
- History;
- Settings.

# Mobile

V10 remains mobile-first:

- contextual menu becomes a bottom-sheet style surface;
- object tabs remain horizontally scrollable;
- exit remains direct;
- destructive confirmation respects safe-area insets;
- object panels collapse to one-column layouts;
- touch targets remain explicit;
- reduced-motion preference is supported.

# Backend companion

The protected backend direction is recorded in:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AUTOMATION-CONTROL-SURFACE-AND-LIFECYCLE-DECISION.md`

That decision preserves the distinction between:

- Automation definition lifecycle;
- Runtime/execution state;
- effective authority;
- dependencies/relationships;
- immutable Version/Audit retention.

# Files

V10 adds/updates:

- `assets/lab/lab-automations-control-v10.js`;
- `assets/lab/lab-automations-control-v10.css`;
- `assets/lab/lab-automations-history-v1.js`;
- `lab/automations/index.html`;
- `tests/continuum-automations-control-v10.test.js`;
- `.github/workflows/automations-v10-control-validation.yml`.

# Truth boundary

V10 does **not** add:

- provider execution;
- durable Runtime;
- real Pause/Resume/Cancel;
- production duplicate/restore/delete endpoints;
- production authority grants;
- production Run history;
- production version-history mutation;
- a new workflow model;
- a second Automation database;
- network calls from the v10 layer.

The current Lab stays isolated and execution-off.

# Product acceptance rule

A user looking at an Automation should always be able to answer:

- How do I leave this?
- What state is it in?
- What is its definition?
- What has it done / what will Runs mean?
- What is it allowed to do?
- What does it depend on?
- What changed?
- How do I duplicate, archive/restore, disable/pause later, or delete where retention rules permit?

The Lab proves the interaction model now; the protected backend owns the consequential semantics later.
