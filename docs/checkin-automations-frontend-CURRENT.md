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
- `assets/lab/lab-automations-calendar.css` — calendar recurrence guidance/timezone styling
- `assets/lab/lab-automations-friendly.css` — human-friendly explainers/finish/timing presentation
- `assets/lab/lab-automations-app-v2.js` — current focused Automation app
- `assets/lab/lab-automations-dropdown-runtime.js` — in-page dropdown interaction stabilization
- `assets/lab/lab-automations-friendly-runtime.js` — plain-language labels, grace explainer, start-timing explanation, finish UX, and step-scroll reset

The friendly runtime deliberately uses normal targeted events and does not add a broad `MutationObserver`.

The older `assets/lab/lab-automations-app.js` remains as prior prototype history/fallback and is not the currently loaded app script.

Shared prototype storage:

- `cmx-lab-automations-v1`
- reads Lab CRM `cmx-lab-crm-v1` for People/Organizations
- reads Lab inventory `cmx-lab-inventory-v1` for Documents/Digital Assets

The focused app deliberately shares `cmx-lab-automations-v1` with the larger Lab Automation prototype instead of creating a second draft store.

## Human UX model

The backend architecture can keep typed concepts such as Trigger, Condition, Action, Wait, Route, and AutomationVersion.

The user should not have to think in backend vocabulary.

Current user-facing editor labels are intentionally simpler:

```text
BASICS
TRIGGER
RULES
ACTIONS
TIMING
FINISH
REVIEW
```

These map to the deeper architecture without exposing unnecessary implementation language.

The durable product model still supports the larger workflow idea:

```text
WHEN
IF
DO
WAIT / REPEAT
THEN
```

Later explicit WAIT steps may appear between individual actions. The current focused `TIMING` step is specifically the **start policy for the action sequence**, not the final generic WAIT-node model.

## Current UX

Dashboard:

- Drafts
- Published preview state
- Archived preview state
- New Automation
- execution clearly off in Lab

Important editor behaviors:

- Save Draft is visible on every editor step;
- edits autosave locally after a short debounce;
- manual Save Draft remains available;
- closing the editor preserves a dirty Draft;
- editor resumes from its last saved step;
- changing steps resets scroll so the next heading is not hidden under the sticky mobile header;
- DO supports multiple ordered steps;
- Action type and Target use in-page dropdown panels instead of native Android `<select>` sheets;
- target dropdown can search existing Lab People/Organizations/Documents/Digital Assets;
- each DO step keeps a stable-shaped Lab target reference where available;
- the first DO step is mirrored into older single-action fields for compatibility with the original Lab prototype;
- Trigger choices use plain-language copy;
- Grace has an expandable explainer and simple Due → Grace → Final Trigger timeline;
- Rules are explicitly presented as optional;
- Timing explains the difference between the trigger and when actions actually begin;
- action-sequence start choices are Immediately / After a delay / At a date & time;
- Delay supports day/hour/minute values plus preset shortcuts;
- Exact date/time supports minute precision and an IANA timezone selector;
- an exact start time never bypasses the trigger;
- Repeat remains separate from start timing and supports none/daily/weekly/custom cadence/until acknowledged as UX concepts;
- Custom cadence supports minutes, hours, days, weeks, months, and years;
- recurring minutes/hours use elapsed cadence semantics;
- Daily, Weekly, and custom days/weeks/months/years use calendar cadence semantics;
- calendar recurrence exposes an explicit Calendar timezone control;
- FINISH defaults to a simple `Finish here` choice and puts branching/escalation/review under `More options`;
- Review shows start timing separately from recurrence and uses `START TIME` / `FINISH` labels;
- Publish is intentionally disabled;
- dark/light themes are supported;
- mobile is a first-class layout target.

## Grace-period product rule

Grace must be understandable without knowing Dead Man Switch terminology.

Plain-language meaning:

```text
normal check-in window ends
→ check-in becomes overdue
→ grace window opens
→ final trigger only happens if grace expires
```

The grace duration comes from the active switch policy. Automation definitions and frontend copy must never hardcode a fixed grace duration as architecture.

For switch-derived Automation triggers:

- `Grace begins` means the authoritative current window reached its overdue/deadline boundary and entered grace;
- `Grace ends` means the authoritative grace window expired and the final trigger was actually reached.

A successful protected check-in during an applicable grace window can return the switch to Safe and prevent the final trigger according to switch semantics.

## Trigger vs action start timing

This distinction is now deliberate.

The **Trigger** says when the Automation becomes eligible.

The **Start timing** says when its first action sequence may actually begin.

Current prototype choices:

```text
Immediately
After a delay
At a date & time
```

Production semantics to preserve:

### Immediately

Start as soon as the Trigger and approved Rules are satisfied.

### After a delay

Use an elapsed trigger-relative delay.

Example:

```text
Trigger at 1:00 PM
Delay 2h 17m
→ action start target 3:17 PM
```

A delay expressed as `2 days` means 48 elapsed hours.

### At a date & time

Treat the chosen calendar timestamp as a **not-before** gate. It does not bypass the Trigger.

Conceptually:

```text
effective_start = max(trigger/rule eligible_at, resolved calendar start)
```

Example:

```text
Chosen start: 3:00 PM
Trigger happens: 4:00 PM
→ action may start at 4:00 PM
```

The frontend should explain this before Publish. The backend must validate the local date/time + IANA timezone and later resolve it authoritatively.

This action-sequence start policy is separate from future explicit WAIT steps inserted between DO actions.

Keep these concepts separate:

- Trigger eligibility;
- action-sequence start timing;
- later explicit WAIT steps;
- recurrence;
- retry.

## Repeat product rule

Presets are shortcuts, not the data model.

Elapsed recurrence:

- minutes;
- hours.

Examples:

```text
Every 45 minutes
Every 6 hours
```

Calendar recurrence:

- days;
- weeks;
- months;
- years.

Examples:

```text
Every 2 days in America/New_York
Every 1 week in Europe/London
Every 2 months in America/New_York
Every 1 year in Europe/London
```

Calendar recurrence preserves a local wall-clock anchor and IANA timezone. This means `every 1 day at 9:00 AM America/New_York` should remain a 9:00 AM local recurrence when DST changes. It must not be implemented as repeated additions of `86,400` seconds.

Likewise:

- `1 month` is not `30 days`;
- `1 year` is not `365 days`.

Monthly/yearly recurrence additionally needs deterministic end-of-month and leap-year policy.

The browser is never scheduling authority. The backend contract must validate and later resolve these values server-side.

## Finish/outcome UX rule

The user-facing `FINISH` step should not expose a pile of abstract route names.

Default/simple choice:

- `Finish here` — end after the configured actions complete.

Advanced choices may include:

- continue to another path;
- escalate if nobody acknowledges;
- pause for human review.

Advanced choices should only become publishable when the backend can validate their required downstream route, acknowledgement capability, approval policy, and destination/reference.

The frontend should eventually hide or disable context-invalid choices instead of pretending every outcome applies to every workflow.

## Backend handoff

Canonical backend contract:

`CMXChat/jay-app/specs/003-server-checkin/AUTOMATION-FRONTEND-CONTRACT.md`

Current cross-repository execution guide:

`CMXChat/jay-app/specs/003-server-checkin/FRONTEND-BACKEND-NEXT.md`

The backend handoff must preserve:

- server Draft/autosave responsibility;
- typed Trigger/Condition/Action/Outcome registries;
- stable protected target IDs;
- ordered multiple DO steps;
- switch-derived grace trigger semantics based on authoritative policy/window state;
- typed action-sequence `start_policy` separate from later explicit WAIT nodes;
- immediate / trigger-relative delay / exact not-before calendar start modes;
- exact local date/time + IANA timezone validation;
- deterministic `effective_start = max(eligible_at, resolved_at)` behavior for exact start mode;
- custom recurrence through minutes/hours/days/weeks/months/years;
- elapsed recurrence for minutes/hours;
- calendar recurrence for days/weeks/months/years;
- explicit timezone for all calendar recurrence;
- deterministic end-of-month and leap-day policy requirements for month/year recurrence;
- recurrence remaining separate from retry;
- context-valid typed Finish/routes only;
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
→ BASICS / TRIGGER / RULES / ACTIONS / TIMING / FINISH / REVIEW
→ individual DO Action editor when needed
```

The backend/domain can still use the durable `WHEN / IF / DO / WAIT / REPEAT / THEN` concepts internally and in advanced planning.

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
5. compact human step navigation;
6. Trigger wording and grace explainer;
7. Rules wording;
8. multiple DO steps;
9. in-page Action dropdown;
10. searchable in-page Target dropdown;
11. Timing explanation makes Trigger vs action start obvious;
12. Immediately / After a delay / At a date & time choices are understandable;
13. custom trigger-relative delay day/hour/minute UX;
14. exact date/time + timezone UX;
15. custom recurrence through minutes/hours/days/weeks/months/years;
16. Calendar timezone appears for Daily, Weekly, and custom days/weeks/months/years;
17. Finish defaults to a simple end state with advanced routes tucked away;
18. Review uses plain-language start/finish labels;
19. step changes do not leave headings hidden under the sticky mobile header;
20. dark/light;
21. no accidental claim that Publish/execution is live.
