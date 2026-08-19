# Check In Lab ↔ Automations Integration — CURRENT

Date: 2026-08-18
Status: Active Continuum Lab v4 frontend integration contract

## Canonical product structure

`/lab/` is the broader Continuum / Check In Lab workspace.

`/lab/automations/` is the dedicated Automation workspace and the single full Automation editor.

Do not build a competing full Automation editor inside `/lab/`. The main Lab summarizes shared Drafts and links into the focused route.

The Lab remains a proving ground for future protected `/checkin/`. Accepted interaction behavior must later be rebuilt in the official React/frontend + typed backend stack. LocalStorage adapters and DOM-presentation layers do not migrate as production architecture.

Strategic Automation direction is canonical in:

`docs/continuum-automations-master-plan-CURRENT.md`

## Focused route authority

The focused route now uses:

### Behavior/persistence core

- `assets/lab/lab-automations-experience-v3.js`;
- `assets/lab/lab-automations-experience-v3.css`.

### Accepted support layers

- `assets/lab/lab-automations-system-surface.js`;
- `assets/lab/lab-automations-system-surface.css`;
- `assets/lab/lab-automations-progressive-preview.js`;
- `assets/lab/lab-automations-final-qa.css`;
- `assets/lab/lab-automations-route-integration.js`.

### Current v4 platform layers

- `assets/lab/lab-automations-platform-v4.js`;
- `assets/lab/lab-automations-platform-v4.css`;
- `assets/lab/lab-automations-scenarios-v4.js`.

V3 continues to own browser-local Draft normalization, editing, autosave, shared-store compatibility and full-flow simulation.

V4 owns the current operating experience: Automations/Templates/Runs navigation, capability discovery, flow navigation, per-stage local tests, stronger preflight, creation chooser, Planner preview and expanded scenarios.

Older focused v2 builder files remain repository history and are not loaded by `/lab/automations/`.

## Builder model

The focused builder remains five-stage:

1. Trigger / WHEN;
2. Rules / IF;
3. Actions / DO;
4. Timing / WAIT;
5. Review / TEST.

There is no name-first wizard.

Finish remains inside Review.

The v4 flow is interactive navigation over these same stages, not a second workflow engine.

## Progressive Flow Preview

The accepted label is **FLOW PREVIEW**.

A new blank Automation begins visibly incomplete:

- WHEN — Choose a trigger;
- IF — Not set yet;
- DO — Choose an action;
- WAIT — Not set yet;
- FINISH — Not set yet.

Rules:

- Trigger begins visually blank;
- optional Rules become `Always continue` after explicit stage confirmation;
- compatibility placeholder Action remains hidden until a real Action is chosen;
- Timing becomes `Immediately` only after Timing is confirmed;
- Finish requires explicit choice for a new Draft;
- later stages stay unavailable until required earlier choices are complete;
- configured templates/scenarios show their stored flow immediately;
- existing Drafts show stored configuration;
- Lab progress metadata remains `cmx-lab-automation-progress-v1` and is presentation-only.

Production must never visually invent an unmade user choice.

## Shared state

The main Lab and focused route continue to share:

- Automation Drafts: `cmx-lab-automations-v1`;
- CRM / Directory prototype: `cmx-lab-crm-v1`;
- Inventory prototype: `cmx-lab-inventory-v1`;
- reusable Actions: `cmx-lab-actions-v1`.

Focused new-Draft UI progress uses:

- `cmx-lab-automation-progress-v1`.

V4 stores only a non-domain platform marker under:

- `cmx-lab-automations-platform-v4`.

These remain browser-local prototype adapters.

## Main Lab → focused route navigation

From `/lab/` Actions:

- `Open Automations` opens `/lab/automations/`;
- selecting a shared Draft uses `/lab/automations/?automation=<id>&from=lab`;
- creating the first Automation uses `/lab/automations/?new=1&from=lab`;
- the reusable Action library stays available in the main Lab.

### Exact Draft

`?automation=<id>` opens that exact shared Draft.

### Direct new Draft

`?new=1` remains a special integration contract.

Even though a normal manual New Automation click in v4 opens the new Build / Templates / Planner chooser, the direct `?new=1` route must bypass that chooser and open the blank Trigger editor immediately.

This preserves current main-Lab integration and mobile regression behavior.

The one-shot query is cleaned after it is consumed.

## Focused route → main Lab

The Check In Lab brand/back control returns to:

`/lab/#lab=view%3Aactions`

`assets/lab/lab-automations-route-integration.js` owns this cross-route navigation only. It does not own Draft data or execution.

## Main-Lab bridge

`assets/lab/lab-automations-main-bridge.js` remains the bridge from the broader Lab Actions area into the focused Automation route.

The bridge may:

- read shared Drafts;
- show Draft count/status;
- open exact Drafts;
- start a direct new Draft;
- show compact timing/action summaries;
- point to the reusable Action library.

It must not become a second full editor, second persistence model or execution authority.

## V4 command-center behavior

The focused route now has three top-level working surfaces:

- Automations;
- Templates;
- Runs preview.

Automations owns Draft / Published / Archived prototype lists.

Templates owns editable starting patterns.

Runs is intentionally future-facing and must remain labeled `RUNTIME OFF` until authoritative server Runtime exists.

Search and the Capability Catalog belong to the focused route and do not change main-Lab persistence.

## Templates and scenarios

The original five focused-route templates remain.

V4 adds eight more editable scenario starting points:

- Weekly planning review;
- Grace-window heads-up;
- Final continuity review;
- AI note summary;
- Six-hour reminder;
- Daily records check;
- No-ack follow-up;
- AI briefing with review.

Current total: 13.

The new scenario layer creates a normal v3-compatible Draft in `cmx-lab-automations-v1` and then reopens that exact Draft using the established exact-Draft route.

Templates/scenarios do not get a separate domain model.

## Capability Catalog integration

The v4 capability catalog is browser-local UX scaffolding for the future extensible Automation platform.

It can show:

- currently representable Lab options;
- future Triggers, Conditions, Actions and workflow-control concepts;
- clear `LAB NOW` / `LATER` availability;
- category/search discovery;
- reusable Lab Actions.

Future capability entries must remain informational and non-executable until matching backend definitions/services/Connections/Runtime exist.

The browser-local catalog is not production authorization or execution truth.

## Reusable Action references

Saved Actions from the main Lab Action library remain selectable as explicit `action_ref` entries.

The focused Automation does not silently convert reusable types such as SMS, Webhook/API, Digital Account or Publish into one of the simple inline types.

Production later needs to resolve and authorize referenced Actions server-side and freeze the resolved version/execution inputs for reproducibility.

## Per-stage test integration

V4 adds **TEST THIS STEP** inside the focused editor.

These are local explanatory checks only. They do not call the main Lab, production API, provider or external AI model.

The existing full-flow simulation remains local.

## AI Planner preview

The manual New Automation chooser can open an AI Planner preview.

It exists to establish future product behavior:

- natural-language intent should become the same typed Automation Draft a human edits;
- AI should not create a shadow workflow format;
- published history should never be silently rewritten by AI.

Current Planner preview performs no AI/model request and may only point the user toward existing local starting patterns.

## Screenshot/mobile contract

Permanent cross-route lessons remain:

- focused editing stays on one route;
- mobile is a separate readable layout, not a scaled desktop console;
- no tiny primary text;
- no giant empty operational canvases;
- no nested scroll traps;
- light mode needs intentional contrast;
- pending state is first-class;
- capability/modals use phone-friendly bottom-sheet presentation;
- no broad document-wide MutationObserver.

## Draft compatibility

V3 continues to normalize older `cmx-lab-automations-v1` data and write legacy compatibility fields needed by older Lab surfaces.

Current newer prototype fields include:

- `conditions`;
- `ruleMode`;
- per-Action `enabled`;
- `action_ref`;
- `editorStage`.

The progressive layer continues to hide internal placeholder/default values on a brand-new Draft.

Do not remove legacy compatibility fields until the broader Lab bridge and validation contracts are deliberately migrated.

## Safety boundary

Both `/lab/` and `/lab/automations/` remain prototypes.

They do not:

- publish real Automations;
- execute communication providers;
- run external AI tools;
- schedule authoritative work;
- mutate connected accounts;
- hold provider secrets.

Keep focused-route CSP `connect-src 'self'` and production isolation intact.

## Regression protection

`.github/workflows/checkin-automations-validation.yml` now covers:

- v3, route, system, progressive, platform-v4 and scenarios-v4 syntax;
- focused-route asset load order;
- v4 dashboard/application markers;
- Automations / Templates / Runs presence;
- expanded scenario presence;
- capability-catalog presence;
- exact Draft deep links;
- direct-new deep link opening Trigger, not the creation chooser;
- progressive blank-Draft truth;
- `FLOW PREVIEW` naming;
- per-stage local-test presence;
- strict Lab isolation;
- no MutationObserver/eval/dynamic Function in presentation layers.

`.github/workflows/checkin-lab-validation.yml` remains responsible for the broader Lab bridge/general workspace contract.

Keep both workflows aligned when shared integration behavior changes.
