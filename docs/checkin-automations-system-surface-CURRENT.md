# Automations System Surface — CURRENT

Date: 2026-08-18
Status: Active Continuum Lab Automations v4.2 operating-surface contract

# Purpose

`/lab/automations/` is a private workflow operating surface inside Continuum Lab.

It should feel like an application for building, inspecting and safely testing Automation definitions. It must not become a marketing page or a second `/doc/`.

Current v4.2 changes presentation, discovery, local composition, typed-reference UX and simulation only. It creates no production execution authority, provider behavior, authoritative scheduling or production schema.

Read with:

- `docs/continuum-automations-master-plan-CURRENT.md`;
- `docs/checkin-automations-frontend-CURRENT.md`;
- `docs/checkin-directory-library-CURRENT.md`.

# Surface distinction

- `/doc/` explains Continuum;
- `/lab/` is the broader experiment workspace and owns Directory v2;
- `/lab/automations/` operates/tests Automation Drafts.

# Dashboard hierarchy

Prioritize:

1. compact app header;
2. New Automation;
3. Automations / Templates / Runs;
4. search + Capability Catalog;
5. system/Directory state;
6. Draft / Published / Archived controls;
7. actual Automation cards;
8. templates/scenarios on their own surface.

Do not restore a billboard hero.

Runs remains a preview and shows `RUNTIME OFF`.

# Builder hierarchy

Accepted stages remain:

- WHEN / Trigger;
- IF / Rules;
- DO / Actions;
- WAIT / Timing;
- TEST / Review.

Finish stays inside Review. Name/description stay metadata.

FLOW PREVIEW remains the accepted interactive flow name. Blank Drafts remain visibly incomplete until the user makes/ confirms choices.

# Capability discovery

Operating rule: **catalog breadth without interface clutter**.

Support current/relevant options first, categories, search, reusable Actions, explicit availability and future Connection-provided capability.

`LAB NOW` means the current prototype can represent the choice. `LATER` is a future preview and stays non-executable.

## Contextual recommendations

V4.2 adds **RECOMMENDED NEXT** on the Actions stage.

Recommendations come from current Trigger/flow context and reuse the same Capability Catalog. They never silently add a step and never convert a `LATER` capability into a usable one.

# Directory / Audience

Directory is a first-class input to communication targeting.

Current Lab can compose communication audiences from Person, Organization, Group and Label selectors, then preview unique People and email/phone readiness.

Keep the distinction clear:

- selector = saved audience intent;
- resolved People = current preview;
- readiness = current channel availability;
- future Run snapshot = exact recipients/endpoints actually used.

Browser resolution remains Lab-only.

# Typed data references

V4.2 gives Actions a **Use data** control.

Users select readable references from Trigger, previous Actions and Directory/Audience values.

The UX must feel like choosing data tokens, not programming expressions.

Normal model:

`typed source → stable source/step ID → typed path → receiving field later`

Do not introduce free-form JavaScript/Python/template execution as normal mapping.

# Testing

`TEST THIS STEP` now uses richer local traces.

A trace may show:

- sample input;
- normalization/resolution;
- rules;
- Audience/readiness;
- mapped sample values;
- simulated step output;
- local Review blockers.

It must always remain obvious that no provider, AI model, real event source, Runtime or connected account was used.

Full-flow simulation remains local and separate from future authoritative Runs.

# Review / preflight

Review remains complete flow + Finish + local validation + simulation.

Current Lab can surface workflow structure, Directory/Audience readiness, mapped-data samples and Runtime-off state.

No fake health percentages.

Future protected preflight returns deterministic server blockers/readiness.

# Mobile

Preserve:

- one primary decision area;
- large tap targets;
- readable type without zooming;
- one-column Action/capability/data choices;
- bottom-sheet/full-screen pickers;
- safe-area-aware actions;
- no nested scroll traps;
- no horizontal overflow;
- reduced-motion support.

Do not scale a desktop node canvas onto a phone.

# Active product layers

V3 behavior core:

- `lab-automations-experience-v3.js/.css`.

Accepted support:

- `lab-automations-system-surface.js/.css`;
- `lab-automations-progressive-preview.js`;
- `lab-automations-final-qa.css`;
- `lab-automations-route-integration.js`.

Current v4.x product layers:

- `lab-automations-platform-v4.js/.css`;
- `lab-automations-platform-v4-qa.css`;
- `lab-automations-scenarios-v4.js`;
- `lab-automations-directory-v4.js/.css`;
- `lab-automations-audience-v4.js/.css`;
- `lab-automations-intelligence-v4.js/.css`.

Current adapters may use targeted click/input/change/storage/custom events and `requestAnimationFrame`.

Do not introduce a broad `MutationObserver`.

# Safety boundary

Keep all true:

- `connect-src 'self'`;
- no production API call;
- no provider execution;
- no real scheduling authority;
- no real Publish;
- no provider credentials in browser state;
- no external AI model execution;
- no arbitrary executable workflow/data-mapping code;
- browser Audience/data resolution is preview only;
- simulation remains local.

# Regression protection

Focused CI should protect:

- v3 Draft/autosave compatibility;
- progressive pending-state truth;
- v4.2 layers/load order;
- Automations / Templates / Runs;
- Capability Catalog + recommendations;
- 13 scenarios;
- exact/new Draft routes;
- FLOW PREVIEW;
- Audience v4.1;
- Use data / data-binding layer;
- richer stage tests;
- mobile readability;
- production isolation;
- no broad MutationObserver/eval/dynamic Function.

# Production migration rule

Migrate accepted semantics into protected React/server Drafts/typed services/generated client.

LocalStorage, DOM patching, compatibility target labels, browser audience resolution and browser data-binding stores remain Lab scaffolding.
