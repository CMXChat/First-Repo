# Continuum Automations Editor Focus v8 - CURRENT

Date: 2026-08-19
Status: Accepted presentation-only density/focus layer over the existing Automations Lab editor. Browser-local Lab behavior and workflow semantics are unchanged.

# Purpose

Real desktop and Samsung phone review showed that the Automation editor was spending too much viewport space on chrome before the user reached the actual WHEN / IF / DO / WAIT / TEST work.

V8 keeps the accepted builder and makes the editor itself the dominant surface.

# Desktop

Desktop rule:

`compact controls → dominant editor workspace → useful side context`

Current behavior at 980px+:

- global/editor chrome is tighter;
- the status strip and stage rail use less vertical space;
- the main editor receives more width;
- Flow Preview is supporting context instead of a second main column;
- Flow Preview is approximately 248px wide;
- a desktop-only control can collapse Flow Preview to a slim rail;
- the collapsed preference is browser-local and remembered;
- mobile never receives the desktop collapse control.

Files:

- `assets/lab/lab-automations-operations-v7-desktop-density.css`;
- `assets/lab/lab-automations-editor-focus-v8.css`;
- `assets/lab/lab-automations-editor-focus-v8.js`.

# Mobile-first correction

Real-device review showed the desktop fix did not leak into mobile, but the phone editor still spent too much height on:

- the top Continuum/Lab bar;
- Draft / Save chrome;
- the 2×2 editor status block;
- the stage rail;
- sticky editor chrome.

Accepted mobile rule:

`compact product truth → compact stages → actual editor as early as possible`

At 760px and below:

- the global bar is shortened;
- `LAB · EXECUTION OFF` renders as the compact truthful label `LAB · OFF` so it does not clip beside the brand/theme control;
- the editor-specific header is no longer sticky and scrolls away with the page;
- Draft / Save controls remain tap-sized but use less height;
- DEFINITION / MODEL / STATE / EXECUTION render in one four-column status row instead of a tall 2×2 block;
- WHEN / IF / DO / WAIT / TEST stays horizontally scrollable but uses a shorter rail;
- redundant `Step N of 5` context is hidden on phone because the stage rail already carries that navigation state;
- the actual stage heading begins sooner;
- the fixed Back / Continue controls remain touch-safe;
- desktop Flow Preview collapse behavior remains hidden below 980px.

File:

- `assets/lab/lab-automations-mobile-focus-v8.css`.

# Mobile Flow Preview

The existing mobile Flow Preview remains a mobile-specific expandable summary/control from the accepted earlier layers.

The desktop v8 sidebar/collapse implementation must never be squeezed into phone layout.

# Truth boundary

V8 is presentation only.

It does not change:

- v5 workflow semantics;
- browser-local Draft storage;
- readiness logic;
- Runtime/provider execution status;
- protected backend truth;
- authority;
- production release state.

`LAB · OFF` is only a compact phone presentation of the existing `LAB · EXECUTION OFF` truth.

# Validation

Regression coverage:

- `tests/continuum-automations-desktop-density-v7.test.js`;
- `tests/continuum-automations-mobile-focus-v8.test.js`;
- `.github/workflows/automations-v7-operations-validation.yml`.

Workflow render coverage includes:

- desktop dashboard;
- 1440×900 desktop editor;
- 390×844 mobile dashboard/editor;
- 360×800 phone editor.

Do not claim CI green from workflow source alone. Observe an actual completed run first.
