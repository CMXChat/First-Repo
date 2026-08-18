# Check In Lab ↔ Automations Integration — Current

Date: 2026-08-18
Status: Active Lab frontend contract

## Canonical product structure

`/lab/` is the overall Check In Lab workspace.

`/lab/automations/` is the dedicated Automation workspace and the single full Automation editor.

Do not build a second competing Automation editor inside `/lab/`. The main Lab summarizes shared drafts and links into them. Full Automation editing stays on the focused route.

The Lab is a proving ground for future protected `/checkin/`. Accepted interaction rules should be rebuilt in the official frontend/backend stack. Lab loader scaffolding, localStorage adapters and DOM patches do not migrate as production architecture.

## Focused Automation authority

The current focused experience is Automations v3 plus final QA/progressive-preview layers:

```text
assets/lab/lab-automations-experience-v3.js
assets/lab/lab-automations-experience-v3.css
assets/lab/lab-automations-system-surface.js
assets/lab/lab-automations-system-surface.css
assets/lab/lab-automations-progressive-preview.js
assets/lab/lab-automations-final-qa.css
```

`lab/automations/index.html` loads these plus the cross-route integration script. The older `lab-automations-app-v2.js` and its focused-route enhancement runtimes remain in the repository as historical/compatibility files, but they are no longer loaded by `/lab/automations/` and are not the current UX authority.

The v3 builder is a five-stage flow:

1. Trigger / WHEN
2. Rules / IF
3. Actions / DO
4. Timing / WAIT
5. Review / TEST

There is no separate name-first wizard step. Name and description remain editable from Automation details.

There is no separate Outcome wizard step. Finish behavior is configured inside Review, where it can be understood in the context of the complete path.

## Progressive Flow Preview contract

The accepted preview label is **FLOW PREVIEW**.

Do not call this `LIVE FLOW`. `LIVE` is reserved for capability status that actually works with protected state.

A new blank Automation must not look configured before the user configures it. The preview begins with explicit pending states and fills in as choices are made or defaults are confirmed.

```text
WHEN    Choose a trigger
IF      Not set yet
DO      Choose an action
WAIT    Not set yet
FINISH  Not set yet
```

Accepted behavior:

- required Trigger starts visually blank;
- optional Rules become `Always continue` when the user confirms that stage with no extra rule;
- the internal compatibility placeholder Action remains hidden until the user chooses an Action;
- Timing becomes `Immediately` only after the user confirms Timing without adding another start policy;
- Finish must be chosen explicitly for a new blank Draft;
- future stages remain unavailable until required earlier choices exist;
- templates show their already configured flow immediately;
- older existing Drafts show their stored flow immediately;
- newly created progressive Drafts retain their confirmed-stage UI progress in the Lab adapter.

Prototype progress metadata:

```text
cmx-lab-automation-progress-v1
```

This is presentation/editor state only. Do not create a second production data model from it.

### Future `/checkin/` rule

Never visually invent an unmade user selection. If production has a default, show it as a default and preserve enough Draft/editor state to distinguish a candidate default from a confirmed user choice when that distinction affects UX or behavior.

## UX contract

The focused builder should feel like assembling and testing a readable workflow, not filling out a settings form.

Current v3 behavior includes:

- quick-start templates for common Check In, briefing, reminder and escalation patterns;
- a progressive Flow Preview that updates while the Automation is edited;
- a readable sentence summary of confirmed/pending flow state;
- optional plain-language rules with AND / OR behavior when multiple rules are present;
- an action stack with reorder, duplicate, pause/enable, remove and replace controls;
- protected target selection from Lab People, Organizations, Documents and Digital Assets;
- immediate, delayed and exact-time scheduling controls;
- repeat controls and a visual timing line;
- Review with finish behavior, pre-flight checks and a safe animated simulation;
- mobile-first navigation, large controls, a collapsible mobile Flow Preview and safe-area-aware footer;
- a desktop Flow Preview side panel that follows document scrolling instead of creating a nested scroll trap.

The simulation is presentation-only. It highlights the path and records a local simulation log. It must never perform an external side effect.

## Shared state

The Lab hub and focused route share the same browser-local Automation draft store:

```text
cmx-lab-automations-v1
```

The focused Automation workspace reads the main Lab CRM and Inventory stores:

```text
cmx-lab-crm-v1
cmx-lab-inventory-v1
```

This keeps People, Organizations, Documents and Digital Assets available as protected Automation targets without creating duplicate record stores.

The focused builder also reads the reusable Action-definition store:

```text
cmx-lab-actions-v1
```

The progressive-preview adapter uses:

```text
cmx-lab-automation-progress-v1
```

Only the first three categories describe prototype domain/draft information. The progress store is temporary UI confirmation state.

## Reusable Action references

Reusable Lab Actions are intentionally connected to Automations.

The Action library in the main Lab remains the definition authority. When a saved Action is selected in an Automation, the builder stores an explicit reference similar to:

```json
{
  "type": "action_ref",
  "actionId": "act-example",
  "actionLabel": "Example saved action",
  "enabled": true
}
```

The focused builder does not silently convert Action-library types such as SMS, Webhook/API, Digital Account or Publish into one of the smaller inline Automation action types. The reference keeps the reusable Action's identity visible, while the Action library remains responsible for its own type, risk, status and detailed definition.

For production, this browser-local reference model is only a UX prototype. The server must authorize the referenced Action, resolve it by stable ID, validate its current/versioned definition and snapshot the resolved execution inputs so a future execution is reproducible and auditable.

## Navigation contract

From `/lab/` Actions:

- `Open Automations` opens `/lab/automations/`;
- selecting a shared Automation draft deep-links to `/lab/automations/?automation=<id>&from=lab` and opens that exact draft;
- creating the first Automation deep-links to `/lab/automations/?new=1&from=lab` and opens the new-draft editor;
- the main-Lab Action library remains reachable below the Automation bridge.

From `/lab/automations/`:

- the Check In Lab brand/back control returns to `/lab/#lab=view%3Aactions`;
- the main Lab router resolves that hash into the Actions destination;
- return navigation is event-hardened so it stays correct when the focused editor re-renders.

`assets/lab/lab-automations-route-integration.js` owns this cross-route navigation only. It does not own Automation data.

## Main-Lab bridge

`assets/lab/lab-automations-main-bridge.js` loads after the older Lab Automation adapter and replaces its visible workspace with the canonical bridge.

The bridge:

- reads shared Automation drafts;
- shows the shared Draft count;
- presents `/lab/automations/` as the one Automation editor;
- opens exact drafts on the focused route;
- reports enabled action count and high-level timing;
- tells the user that saved Lab Actions can be selected as reusable references;
- removes the old Lab Automation dialog if it exists;
- does not become another persistence or execution authority.

The older `lab-automation-builder.js` remains loaded temporarily in the main Lab as compatibility scaffolding because existing Lab validation and layout contracts still depend on its workspace bootstrap. Its duplicate editor is not exposed by the integrated UI.

## Screenshot-driven Lab lessons

The August 18 screenshot audit of Sequence, Activity, Actions, Logic and Automations is part of the migration contract.

General `/lab/` final presentation layer:

```text
assets/lab/lab-final-qa.css
```

Focused Automations final presentation layer:

```text
assets/lab/lab-automations-final-qa.css
```

Permanent design lessons:

- empty Activity/audit states should not consume most of the viewport;
- Sequence timelines should be large enough to understand and compact enough to keep nearby controls in view;
- Action definition/detail surfaces must not rely on debug-sized 5–7px text as primary information;
- Logic graphs should tighten when only a few nodes exist instead of leaving a huge empty canvas;
- user-facing light mode needs explicit contrast, borders and hierarchy;
- small content groups should not live inside giant empty cards;
- a normal builder sidebar should not own its own vertical scrollbar;
- pending configuration is a legitimate state and should look pending;
- mobile remains a separate readable layout, not a scaled desktop console;
- no broad document-wide MutationObserver is acceptable as the mechanism for these UX layers.

## Draft compatibility

Automations v3 normalizes existing `cmx-lab-automations-v1` drafts and continues writing legacy compatibility fields used by older Lab surfaces. New canonical UX fields include multiple `conditions`, `ruleMode`, action `enabled` state, reusable `action_ref` entries and `editorStage`.

The v3 normalizer still creates a compatibility placeholder Action and default Trigger/Timing/Outcome values. The progressive-preview layer prevents those internal fallback values from being presented as user intent on a new blank Draft.

Do not remove the legacy compatibility fields until the main Lab adapter and validation contracts have been deliberately migrated away from them.

## Safety boundary

Both routes remain Lab-only prototypes. They do not publish or execute production Automations, communication providers, AI tools, integrations or account operations.

Keep the existing strict CSP and production-isolation rules intact. Provider secrets, credentials and authoritative scheduling never belong in this frontend draft store.

## Regression protection

`.github/workflows/checkin-automations-validation.yml` validates:

- v3 integration JavaScript syntax;
- progressive-preview JavaScript syntax;
- shared Automation, CRM, Inventory and Action-library contracts;
- explicit reusable Action-reference support;
- the five-stage focused UX contract;
- final QA/progressive-preview assets are loaded last;
- a new blank Draft renders `FLOW PREVIEW`, `Choose a trigger` and pending future steps;
- `LIVE FLOW` does not return on the blank-draft route;
- progressive preview has no MutationObserver/eval/dynamic-code mechanism;
- `/lab/automations/` loads v3 and no longer loads the superseded v2 builder;
- main-Lab bridge load order and rendering;
- v3 dashboard/template rendering;
- exact-draft deep linking;
- new-Automation deep linking into Trigger instead of the old name-first wizard;
- return navigation to Lab Actions.

`.github/workflows/checkin-lab-validation.yml` also validates the final general Lab screenshot-QA layer and production isolation.

Keep both workflows aligned whenever either route, reusable Action contract, progressive preview or focused UX changes.
