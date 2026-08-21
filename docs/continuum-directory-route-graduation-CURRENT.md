# Continuum Directory Route Graduation — CURRENT

Last updated: 2026-08-21

## Purpose

The root route name `Directory` was overloaded.

Historically, `/directory/` was the **CMX Operations Directory**: a card menu for OSINT/research and operational tools. Continuum now also has a genuine product concept named **Directory** for durable People, ContactMethods and later relationships.

This checkpoint separates those two jobs instead of renaming the product concept.

## Current route ownership

### `/menu/`

`/menu/` now owns the former Operations Directory card experience.

It remains a route-registry-driven launcher for OSINT/research tools such as:

- OSINT Console
- Phone Intelligence
- Metadata Extractor
- Resource Library
- Missing Person Workflow
- Advanced Search

The visible name is **Operations Menu**.

### `/directory/`

`/directory/` now owns the **Continuum Directory protected preview**.

It reuses the accepted Directory UI and server-proof adapters from the current stacked frontend work rather than creating a second People interface.

Current truth:

- protected backend `Person` identity is the intended canonical source for People;
- protected email `ContactMethod` is the intended canonical source for supported email contacts;
- Organizations, Groups/audiences and richer relationship concepts remain local Lab/future behavior;
- the route does not claim the stacked backend is deployed or that live acceptance has occurred;
- `/lab/directory/` remains available as the development/proof route until later acceptance/consolidation.

### `/lab/directory/`

Retained deliberately.

Do not delete or redirect it yet. Existing frontend validation and the Directory integration proof still use it. Route cleanup should follow live acceptance rather than precede it.

## Frontend gate

`/menu/` and `/directory/` use the existing **Black Prompt Gate** with shared scope:

`continuum-private-pages`

This is a temporary frontend deterrent only.

It is **not** a server-side secrecy boundary because static HTML/CSS/JavaScript assets are still delivered to the browser. Protected Directory reads/writes remain governed by the real backend operator session, owner scope, exact Origin and CSRF controls.

Do not weaken backend security because the page has a visual gate.

## Root terminal behavior

The restricted root terminal now distinguishes:

- `menu` → Operations Menu (`/menu`)
- `directory` → Continuum Directory (`/directory`)

`osint open` routes to the Operations Menu rather than the People Directory.

## Why this is a preview, not a production graduation claim

This frontend branch is stacked on the current PR #121 frontend integration proof. The full Directory/Automation/Runtime backend stack is not yet claimed as production-deployed.

Therefore:

- URL ownership has been clarified;
- the protected preview can be reviewed and developed;
- `/lab/directory/` remains the validated proof route;
- live browser acceptance against a deployed backend is still required before calling `/directory/` a fully live product surface.

## Validation contract

`tests/continuum-directory-route-graduation.test.js` locks down:

- `/menu/` owns the Operations Menu card page;
- `/directory/` owns the Continuum Directory preview;
- both new private preview surfaces declare the Black Prompt Gate;
- route registry ownership is unambiguous;
- `/lab/directory/` remains registered;
- root terminal commands distinguish `menu` and `directory`;
- `osint open` continues to lead to the OSINT operations menu rather than People/Contacts.

## Next frontend steps

Do not immediately graduate every Lab route.

After the current backend API/reconciliation work settles and the stacked backend becomes reachable, perform the documented live Directory and Automations acceptance flows first.

The next likely product-preview surface is Email because real owner-triggered SMTP has already been proven through Continuum Runtime. That future page must use the normal protected Person → ContactMethod → Connection → SenderIdentity → Content → Automation/Version → Runtime path. It must not introduce a generic browser-only send-email bypass.

CC/BCC and attachments remain future backend-contract work; the frontend must not pretend those features exist before the typed backend supports them.

## Open route architecture question

No decision is forced here between:

- direct stable routes such as `/directory/`, `/email/`, `/automations/`, `/library/`; or
- a future `/console/...` namespace.

Avoid route churn. Let proven product behavior earn each graduation.
