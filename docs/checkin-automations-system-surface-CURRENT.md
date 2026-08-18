# Automations System Surface — CURRENT

Date: 2026-08-18
Status: Active focused Lab presentation contract

## Purpose

`/lab/automations/` is an operating surface inside Continuum Lab. It should feel like a private workflow system, not a marketing or product-introduction landing page.

This pass changes presentation and information hierarchy only. It does not change Automation execution authority, backend schema, provider behavior, Lab isolation or the five-stage v3 workflow model.

## Product distinction

Use the surfaces differently:

```text
/doc/
→ explains Continuum

/lab/
→ broader Continuum / Check In experiment workspace

/lab/automations/
→ operate and test Automation definitions
```

`/doc/` keeps its visual editorial/documentation role and remains under the separate Continuum product freeze.

## Dashboard hierarchy

The focused Automation dashboard should prioritize actual system state:

1. compact Automations application header;
2. New automation control;
3. workspace status;
4. Draft / Published / Archived workflow controls;
5. actual Automation cards;
6. Templates as a secondary quick-start tool.

Do not restore a billboard-sized slogan/hero above the working Automation list.

Current status deck includes:

- Draft count;
- reusable Action count;
- connected Lab record count;
- explicit execution-off state.

Templates remain useful, but they are supporting workflow creation rather than the main content of the page.

## Builder hierarchy

The v3 stages remain:

```text
TRIGGER
RULES
ACTIONS
TIMING
REVIEW / TEST
```

The builder should use a balanced application type scale:

- the current task/question is prominent without dominating the entire viewport;
- stage navigation is comfortably readable;
- helper/body text is readable without zooming;
- Live Flow is a primary system panel and should never use micro-copy;
- Action, Timing and Review metadata must remain legible;
- duplicate stage labels should be visually reduced;
- desktop navigation buttons should remain compact controls instead of a mobile-width CTA stretched across the screen.

Mobile can keep a full-width primary Continue control where that improves thumb reach and clarity.

## Active presentation files

The canonical v3 workflow behavior remains in:

```text
assets/lab/lab-automations-experience-v3.js
assets/lab/lab-automations-experience-v3.css
```

The system-surface presentation layer is:

```text
assets/lab/lab-automations-system-surface.js
assets/lab/lab-automations-system-surface.css
```

`lab/automations/index.html` loads the system-surface files after v3 and route integration.

The system-surface JavaScript may reorder and relabel rendered presentation nodes, calculate local Lab status counts and react to targeted UI/storage events. It must not own Automation data or perform execution.

Do not introduce a broad `MutationObserver` to keep the presentation layer synchronized. v3 re-renders synchronously, so targeted click/input/change/storage/custom events plus `requestAnimationFrame` are sufficient.

## Naming / metadata

The focused route uses the short product title:

```text
Continuum · Automations
```

Its noindex description identifies it as the Continuum Lab Automation workspace. This metadata change does not rename the current protected Check In backend program or existing API/spec namespaces.

## Safety

The focused route remains Lab-only:

- `connect-src 'self'`;
- no production API calls;
- no provider execution;
- no real scheduling authority;
- no real Publish;
- no credentials/provider secrets in browser state;
- simulation remains local presentation.

## Regression protection

The focused Automations and Lab-integration workflows should verify:

- v3 still owns the five-stage workflow model;
- the system-surface layer loads last;
- desktop dashboard renders the Continuum Automations operating hierarchy;
- the old `Build the flow` landing-page hero is not visible;
- Templates remain available;
- system status deck is present;
- exact-draft and new-draft deep links still work;
- mobile editor still opens at Trigger;
- no old name-first wizard reappears;
- no broad DOM observer is added.

## Backend boundary

Do not update backend implementation merely because this UI pass changed layout, copy or typography.

Before Phase 2A implementation begins, the accepted v3 workflow semantics and current frontend/backend handoff documents should be reviewed together and deliberately aligned. Backend domain work remains governed by `CMXChat/jay-app/specs/003-server-checkin/` contracts and the approved Phase 2A order.
