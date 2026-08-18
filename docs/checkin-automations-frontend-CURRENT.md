# Check In Automations Frontend — Current Handoff

Date: 2026-08-18
Status: Active focused frontend prototype

## Focused route

`https://db.cmxchat.com/lab/automations/`

This is the preferred place to review the future Automation UX. Use the larger `/lab/` only when deeper prototype context is needed.

The focused route is Lab-only. Its CSP keeps `connect-src 'self'` and it does not call the production Check In API. It must not execute providers, schedule real work, publish production Automations, or claim a Draft is live.

## Current frontend files

Active focused route:

- `lab/automations/index.html`
- `assets/lab/lab-automations-app.css` — base focused styling
- `assets/lab/lab-automations-app-v2.css` — dropdown/timing styling
- `assets/lab/lab-automations-calendar.css` — calendar recurrence/timezone guidance
- `assets/lab/lab-automations-friendly.css` — human-friendly explainers and finish/timing presentation
- `assets/lab/lab-automations-content.css` — private Content editor
- `assets/lab/lab-automations-communications-ai.css` — Email + AI Task definition UX
- `assets/lab/lab-automations-mobile-readable.css` — current phone readability layer loaded last
- `assets/lab/lab-automations-app-v2.js` — current focused Automation app
- `assets/lab/lab-automations-dropdown-runtime.js` — in-page dropdown stabilization
- `assets/lab/lab-automations-friendly-runtime.js` — plain-language labels, grace/timing explanation, finish UX and step-scroll reset
- `assets/lab/lab-automations-content-runtime.js` — Content authoring/runtime prototype
- Email/AI, Audience, Library and File layers loaded by the focused route

The older `assets/lab/lab-automations-app.js` remains prototype history and is not the currently loaded app script.

The friendly/runtime layers use targeted events. Do not reintroduce a broad document-wide `MutationObserver`.

## Shared prototype storage

The Lab deliberately reuses existing prototype stores instead of creating a second application state model:

- Automations: `cmx-lab-automations-v1`
- CRM/Directory: `cmx-lab-crm-v1`
- Inventory: `cmx-lab-inventory-v1`
- Content: `cmx-lab-content-assets-v1`
- Files: `cmx-lab-file-assets-v1`
- Audience links: `cmx-lab-audience-links-v1`
- Email metadata: `cmx-lab-email-actions-v1`
- AI Task config: `cmx-lab-ai-task-actions-v1`

These stores remain prototype-only. Accepted behavior later migrates to protected backend services.

## Human UX model

User-facing editor steps stay simple:

```text
BASICS
TRIGGER
RULES
ACTIONS
TIMING
FINISH
REVIEW
```

The deeper product model still supports:

```text
WHEN
IF
DO
WAIT / REPEAT
THEN
```

The current `TIMING` step is the start policy for the Action sequence. Future explicit WAIT nodes between Actions remain a separate concept.

## Mobile readability contract

The phone UI must never be a desktop layout shrunk until it technically fits.

The 2026-08-18 mobile pass was triggered by real Samsung/Chrome review of the Draft list. The problem was systemic: many labels, summaries and flow nodes were rendered at 8–12px and three workflow nodes stayed side-by-side on a narrow phone.

`assets/lab/lab-automations-mobile-readable.css` now owns the phone readability floor across the focused Automation experience.

Preserve these rules on screens at 700px and below:

- Draft cards use one column;
- card titles are about 24px;
- Draft summary/body copy is about 16px;
- WHEN / DO / THEN summary nodes stack vertically and use readable labels/details;
- section headings, status text and metadata scale up instead of becoming micro-copy;
- tabs and primary controls are at least about 44–50px tall;
- form inputs use 16px text to remain comfortable and avoid mobile browser zoom behavior;
- choice-card titles are about 16px with readable secondary copy;
- editor headings and explanatory copy remain large enough to learn from on a phone;
- Timing cards, dropdown rows, Email envelope/recipient controls and AI Task controls use the same readability standard;
- mobile layouts may become taller to protect readability;
- horizontal density is only used when it remains genuinely readable.

Library can have its own specialized premium/mobile layers. Other Automation screens should meet the same overall readability quality bar.

Do not remove this layer merely because the old base CSS already has mobile media queries. Those queries mainly made the layout fit; this layer makes it comfortable to read and use.

## Current UX behavior

Dashboard:

- Drafts;
- Published preview state;
- Archived preview state;
- New Automation;
- execution clearly off in Lab.

Editor behavior:

- Save Draft remains available on every step;
- edits autosave locally after a short debounce;
- closing preserves a dirty Draft;
- editor resumes from its last saved step;
- step changes reset scroll so headings stay visible under sticky mobile UI;
- ACTIONS supports multiple ordered DO steps;
- Action type and Target use in-page dropdown panels instead of native Android `<select>` sheets;
- Target can search current Lab People, Organizations, Documents and Digital Assets;
- Trigger choices use plain-language copy;
- Grace includes a Due → Grace → Final Trigger explanation;
- RULES are presented as optional;
- TIMING distinguishes Trigger eligibility from Action-sequence start timing;
- FINISH defaults to `Finish here` with advanced paths tucked away;
- Review keeps start timing and recurrence separate;
- Publish remains disabled;
- dark/light themes are supported;
- mobile is a first-class layout target.

## Grace semantics

Grace must remain understandable without requiring Dead Man Switch terminology.

```text
normal check-in window ends
→ check-in becomes overdue
→ grace window opens
→ final trigger happens only if grace expires
```

Grace duration comes from the active switch policy. Frontend definitions must not hardcode a fixed duration as architecture.

For switch-derived triggers:

- `Grace begins` means the authoritative current window reached the deadline boundary and entered grace;
- `Grace ends` means the authoritative grace window expired and the final trigger was reached.

A successful protected check-in during an applicable grace window can return the switch to Safe according to backend policy semantics.

## Trigger vs Action start timing

The Trigger says when the Automation becomes eligible.

The start policy says when its first Action sequence may begin.

Current prototype choices:

```text
Immediately
After a delay
At a date & time
```

### Immediately

Begin after Trigger and approved Rules are satisfied.

### After a delay

Use an elapsed trigger-relative delay.

Example:

```text
Trigger at 1:00 PM
Delay 2h 17m
→ action start target 3:17 PM
```

A delay of `2 days` means 48 elapsed hours.

### At a date & time

Treat the selected timestamp as a not-before gate:

```text
effective_start = max(trigger/rule eligible_at, resolved calendar start)
```

An exact date/time does not bypass a late Trigger.

Keep these concepts separate:

- Trigger eligibility;
- Action-sequence start policy;
- future explicit WAIT steps;
- recurrence;
- retry.

## Recurrence

Elapsed recurrence:

- minutes;
- hours.

Calendar recurrence:

- days;
- weeks;
- months;
- years.

Calendar recurrence keeps a local wall-clock anchor and IANA timezone. A daily 9:00 AM America/New_York schedule should remain 9:00 AM local through DST changes.

Also preserve:

- `1 month` is not automatically `30 days`;
- `1 year` is not automatically `365 days`;
- month/year recurrence needs deterministic end-of-month and leap-year policy;
- recurrence is separate from retry;
- the browser is never scheduling authority.

## Email + AI Task

Email is the first deeply modeled communication Action. It reuses Directory/Audience, Content and File concepts for:

```text
From
To
CC
BCC
Reply-To
Subject
Rich body
Attachments
Preview
```

AI Task uses structured fields:

```text
Objective
Instructions
Context
Tools
Autonomy
Limits
```

The frontend may show `Pre-authorized contingency` as a future mode, while authority remains server-side and later depends on an immutable published AuthorityGrant.

See:

- `docs/checkin-communications-ai-CURRENT.md`
- `CMXChat/jay-app/specs/003-server-checkin/COMMUNICATION-ACTIONS-BACKEND-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/DELEGATED-AUTHORITY-BACKEND-CONTRACT.md`

## Backend handoff

Canonical backend contract:

`CMXChat/jay-app/specs/003-server-checkin/AUTOMATION-FRONTEND-CONTRACT.md`

Cross-repository execution guide:

`CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-NEXT.md`

Backend implementation must preserve:

- server Draft/autosave responsibility;
- typed Trigger / Condition / Action / Outcome registries;
- stable protected target IDs;
- ordered multiple DO steps;
- switch-derived grace semantics from authoritative policy/window state;
- typed Action-sequence `start_policy` separate from WAIT nodes;
- immediate / delay / exact-not-before modes;
- local date/time + IANA timezone validation;
- deterministic `effective_start = max(eligible_at, resolved_at)` for exact start mode;
- elapsed recurrence for minutes/hours;
- calendar recurrence for days/weeks/months/years;
- explicit timezone for calendar recurrence;
- deterministic month/year edge policy;
- context-valid typed Finish/routes;
- immutable publish/version behavior later.

## What later moves into `/checkin/`

Do not add a separate bottom-nav product just for the prototype.

The existing Actions destination can evolve into:

```text
Actions
→ Automations dashboard
→ Draft / Published / Archived
→ Automation editor
→ BASICS / TRIGGER / RULES / ACTIONS / TIMING / FINISH / REVIEW
```

Port accepted UX only after the matching typed backend services exist. Reuse protected Check In Contacts, Organizations, Records, session and policy data where the semantics match.

## Frontend completeness vs backend reality

The focused page proves product UX. It does not make these runtime capabilities real yet:

- server Draft persistence;
- immutable published AutomationVersion;
- scheduler/worker;
- Run;
- provider execution;
- retries;
- acknowledgement;
- approvals;
- AI Task runtime;
- bounded Agent.

## Immediate review checklist

On Samsung/Chrome and desktop, check:

1. Draft card text feels comfortably readable without zooming;
2. WHEN / DO / THEN summaries stack cleanly on a phone;
3. header, tabs and primary controls have comfortable tap sizes;
4. editor headings and explanatory copy remain readable;
5. choice cards, dropdowns and timing controls are no longer micro-copy;
6. Email composer fields and recipient cards remain readable on mobile;
7. AI Task Objective/Tools/Autonomy/Limits remain readable on mobile;
8. New Automation and Save Draft behavior;
9. autosave/resume behavior;
10. Trigger wording and grace explainer;
11. multiple DO steps;
12. searchable in-page Target dropdown;
13. Trigger vs Action-start explanation;
14. date/time + timezone UX;
15. recurrence semantics;
16. Finish defaults to a simple end state;
17. Review uses plain-language labels;
18. dark/light themes;
19. no horizontal overflow;
20. no accidental claim that Publish/execution is live.
