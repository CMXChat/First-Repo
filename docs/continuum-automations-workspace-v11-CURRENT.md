# Continuum Automations Workspace v11 - CURRENT

Date: 2026-08-22
Status: Desktop builder focus redesign on branch `agent/automation-editor-workspace-v11`; no backend or execution change.

## Why this exists

The accepted Automations visual language was working, but Definition editing had accumulated too much permanent chrome at once:

- global Continuum shell;
- Automation object bar;
- Automation title/actions;
- four-cell readiness strip;
- seven Automation management tabs;
- five-step horizontal builder rail;
- editor canvas;
- Flow Preview;
- persistent Back/Continue footer.

On a normal laptop this pushed the actual question being edited deep into the viewport and made the builder feel nested inside several control surfaces.

Workspace v11 keeps the existing product language and capabilities while changing the information hierarchy so the Automation definition owns the screen.

## Desktop layout contract

At `1100px` and wider, Definition editing becomes three persistent layers:

1. the existing thin Continuum application shell;
2. a compact Automation object/title area;
3. the builder workspace.

The builder workspace is:

`Definition steps | active editor | Flow Preview`

The five Definition stages move from a full-width horizontal row into a narrow sticky vertical rail:

1. Trigger
2. Rules
3. Actions
4. Timing
5. Review

The existing stage buttons remain the real controls. v11 only moves them in the DOM and changes their layout, so existing validation, progressive locking and stage behavior remain authoritative.

## Management navigation

Overview / Definition / Runs / Permissions / Related / History / Settings remain available.

They no longer consume a permanent full-width row while Definition editing is active. A compact `Manage` button reveals the existing v10 navigation on demand.

No management section is deleted.

## Status truth

The permanent four-cell editor status strip is hidden on large desktop Definition editing because it costs vertical space.

Its important summary is copied into the compact Automation object bar, including:

- current definition readiness;
- model version;
- execution-off truth.

The existing underlying v7 status element remains in the DOM and remains available on smaller layouts.

## Flow Preview

Flow Preview remains visible supporting context rather than becoming the primary surface.

Desktop width is approximately 268px. The existing v8 collapse behavior remains supported and can reduce the preview to its compact rail.

No Flow Preview semantics change.

## Footer

The existing Back / Continue behavior remains intact, but the desktop footer is compressed and aligned with the builder content instead of reading like a large mobile dock across the whole viewport.

## Mobile boundary

Below `1100px`, the v11 structural wrappers use `display: contents` and the new desktop navigation treatment is disabled.

The existing v8 mobile-focused editor remains the controlling mobile design.

## Files

- `assets/lab/lab-automations-workspace-v11.js`
- `assets/lab/lab-automations-workspace-v11.css`
- `tests/continuum-automations-workspace-v11.test.js`
- `.github/workflows/automations-v11-workspace-validation.yml`
- `automations/index.html`

## Explicit non-goals

Workspace v11 does not:

- change Automation data;
- change server APIs;
- change Runtime;
- enable execution;
- change Authority;
- change provider behavior;
- create new trigger/action semantics;
- remove v10 management views;
- redesign the accepted mobile editor;
- touch backend deployment.

The change is information architecture and viewport allocation only.
