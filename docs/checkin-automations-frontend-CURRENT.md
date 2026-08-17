# Check In Automations Frontend — Current Handoff

Date: 2026-08-17
Status: Active focused frontend prototype

## Focused route

`https://db.cmxchat.com/lab/automations/`

This is the preferred place to review the future Automation UX.

Use the larger `/lab/` only when deeper CRM/Records/Action/Sequence prototype context is needed.

## Safety

The focused route is Lab-only.

Its CSP keeps `connect-src 'self'` and it does not call the production Check In API.

It must not execute providers, schedule real work, publish production Automations, or claim a Draft is live.

## Current frontend files

- `lab/automations/index.html`
- `assets/lab/lab-automations-app.css`
- `assets/lab/lab-automations-app.js`

Shared prototype storage:

- `cmx-lab-automations-v1`
- reads Lab CRM `cmx-lab-crm-v1` for People/Organizations
- reads Lab inventory `cmx-lab-inventory-v1` for Documents/Digital Assets

The focused app deliberately shares `cmx-lab-automations-v1` with the larger Lab Automation prototype instead of creating a second draft store.

## Current UX

Dashboard:

- Drafts
- Published preview state
- Archived preview state
- New Automation
- execution clearly off in Lab

Editor:

```text
START
WHEN
IF
DO
WAIT / REPEAT
THEN
REVIEW
```

Important current behaviors:

- Save Draft is visible on every editor step;
- edits autosave locally after a short debounce;
- manual Save Draft remains available;
- closing the editor preserves a dirty Draft;
- editor resumes from its last saved step;
- DO supports multiple ordered steps;
- each DO step can use a stable-shaped Lab target reference from People, Organizations, Documents, or Digital Assets;
- the first DO step is mirrored into the older single-action fields for compatibility with the original Lab prototype;
- Publish is intentionally disabled;
- dark/light themes are supported;
- mobile is a first-class layout target.

## Backend handoff

Canonical backend contract:

`CMXChat/jay-app/specs/003-server-checkin/AUTOMATION-FRONTEND-CONTRACT.md`

That file maps frontend behavior to the future Phase 2A Automation/AutomationVersion domain and protected API responsibilities.

Do not invent a second backend architecture from this frontend.

## What later moves into `/checkin`

Do not add a new bottom-nav destination.

The existing `Actions` destination should evolve into:

```text
Actions
→ Automations dashboard
→ Draft / Published / Archived
→ Automation editor
→ WHEN / IF / DO / WAIT / THEN / Review
→ individual DO Action editor when needed
```

Port the approved UX only after the typed Phase 2A backend definition APIs are stable.

Existing protected Check In Contacts/Organizations/Records/session/policy data should be reused where semantically valid instead of duplicated into Automation JSON.

## Do not confuse frontend completeness with backend reality

The focused page can prove product UX before backend implementation.

It does not make these real yet:

- server Draft persistence
- immutable published AutomationVersion
- scheduler
- Run
- provider execution
- retries
- acknowledgement
- approvals
- AI Task runtime
- AI Agent

## Immediate review checklist

On Samsung/Chrome and desktop, check:

1. dashboard clarity;
2. New Automation;
3. Save Draft always visible;
4. autosave/resume behavior;
5. compact step navigation;
6. WHEN/IF choices;
7. multiple DO steps;
8. target picker using existing Lab records;
9. WAIT/REPEAT density;
10. human-readable Review;
11. dark/light;
12. no accidental claim that Publish/execution is live.
