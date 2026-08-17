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

Active focused route:

- `lab/automations/index.html`
- `assets/lab/lab-automations-app.css` — base focused styling
- `assets/lab/lab-automations-app-v2.css` — current dropdown/timing styling
- `assets/lab/lab-automations-app-v2.js` — current focused Automation app
- `assets/lab/lab-automations-dropdown-runtime.js` — in-page dropdown interaction stabilization

The older `assets/lab/lab-automations-app.js` remains as prior prototype history/fallback and is not the currently loaded app script.

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
- Action type and Target use in-page dropdown panels instead of native Android `<select>` sheets;
- target dropdown can search existing Lab People/Organizations/Documents/Digital Assets;
- each DO step keeps a stable-shaped Lab target reference where available;
- the first DO step is mirrored into older single-action fields for compatibility with the original Lab prototype;
- IF copy now explains an earlier action failure in plain language;
- WAIT supports No wait, precise Delay, or Exact date/time;
- Delay supports day/hour/minute values plus preset shortcuts;
- Exact date/time supports minute precision and an IANA timezone selector;
- Repeat remains separate from Wait and supports none/daily/weekly/custom cadence/until acknowledged as UX concepts;
- Review shows timing separately from recurrence;
- Publish is intentionally disabled;
- dark/light themes are supported;
- mobile is a first-class layout target.

## Timing product rule

Presets are shortcuts, not the data model.

The product should eventually allow a user to express examples such as:

```text
Wait 2 days, 3 hours, 17 minutes
```

or:

```text
Wait until Aug 22, 2026 at 3:17 PM America/New_York
```

The browser is never scheduling authority. The backend contract must validate and later resolve these values server-side.

Keep separate forever:

- wait/delay;
- recurrence;
- retry.

## Backend handoff

Canonical backend contract:

`CMXChat/jay-app/specs/003-server-checkin/AUTOMATION-FRONTEND-CONTRACT.md`

That file now explicitly covers:

- server Draft/autosave responsibility;
- typed Trigger/Condition/Action/Outcome registries;
- stable protected target IDs;
- ordered multiple DO steps;
- precise relative waits;
- exact local date/time + IANA timezone;
- DST/ambiguous-time validation;
- recurrence remaining separate from retry;
- immutable publish/version behavior later.

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
6. WHEN/IF wording;
7. multiple DO steps;
8. in-page Action dropdown;
9. searchable in-page Target dropdown;
10. custom delay day/hour/minute UX;
11. exact date/time + timezone UX;
12. custom recurrence UX;
13. human-readable Review;
14. dark/light;
15. no accidental claim that Publish/execution is live.
