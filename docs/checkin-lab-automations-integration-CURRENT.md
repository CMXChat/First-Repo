# Check In Lab ↔ Automations Integration — Current

Date: 2026-08-18
Status: Active Lab frontend contract

## Canonical product structure

`/lab/` is the overall Check In Lab workspace.

`/lab/automations/` is the dedicated Automation workspace and the single full Automation editor.

Do not build a second competing Automation editor inside `/lab/`. The main Lab may summarize Automation drafts and link into them, while editing stays on the focused route.

## Shared state

The two routes share the same browser-local Automation draft store:

```text
cmx-lab-automations-v1
```

The focused Automation workspace also reads the main Lab CRM and Inventory stores:

```text
cmx-lab-crm-v1
cmx-lab-inventory-v1
```

This keeps People, Organizations, Documents and Digital Assets available as protected Automation targets without creating duplicate record stores.

## Navigation contract

From `/lab/` Actions:

- `Open Automations` opens `/lab/automations/`;
- selecting a shared Automation draft deep-links to `/lab/automations/?automation=<id>&from=lab` and opens that exact draft;
- creating the first Automation deep-links to `/lab/automations/?new=1&from=lab` and opens the new-draft editor;
- the existing main-Lab Action library remains reachable below the Automation bridge.

From `/lab/automations/`:

- the Check In Lab brand/back control returns to `/lab/#lab=view%3Aactions`;
- the main Lab router resolves that hash into the Actions destination;
- return navigation is event-hardened because the focused editor rebuilds its header during step changes.

## Main-Lab bridge

`assets/lab/lab-automations-main-bridge.js` loads after the older Lab Automation adapter and replaces its visible workspace with the canonical bridge.

The bridge:

- reads shared Automation drafts;
- shows the shared Draft count;
- presents `/lab/automations/` as the one Automation editor;
- opens exact drafts on the focused route;
- removes the old Lab Automation dialog if it exists;
- does not become another persistence or execution authority.

The older `lab-automation-builder.js` remains loaded temporarily as compatibility scaffolding because existing Lab validation and layout contracts still depend on its workspace bootstrap. Its duplicate editor is no longer exposed by the integrated UI.

## Focused-route integration

`assets/lab/lab-automations-route-integration.js` owns cross-route navigation only.

It does not own Automation data. It:

- resolves `automation=<id>` deep links;
- resolves `new=1` entry;
- cleans one-shot query parameters after entry;
- keeps the return-to-Lab Actions path stable across editor re-renders.

## Action library boundary

The main Lab reusable Action-definition store remains separate:

```text
cmx-lab-actions-v1
```

As of this contract, the focused Automation builder does **not** yet consume arbitrary reusable Action definitions from that store as DO templates. Do not claim that linkage exists.

Current integration is:

- shared Automation drafts;
- shared People / Organizations;
- shared Documents / Digital Assets;
- bidirectional navigation;
- one canonical Automation editor.

Reusable Action-definition linking is a later typed frontend/backend integration and should be implemented deliberately instead of silently mapping incompatible Action types.

## Safety boundary

Both routes remain Lab-only prototypes. They do not publish or execute production Automations or providers.

Do not weaken the existing Lab CSP or production-isolation rules while integrating the routes.

## Regression protection

`.github/workflows/checkin-lab-automations-integration.yml` validates:

- integration JavaScript syntax;
- the shared Automation storage key;
- main-Lab bridge load order;
- focused route integration asset loading;
- `/lab/` bridge rendering;
- exact-draft deep linking;
- new-Automation deep linking;
- return navigation to Lab Actions.

Keep this workflow aligned whenever either route changes.
