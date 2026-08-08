# Spaces Demo Continuity

Last reconciled: **August 8, 2026**
Repository: `CMXChat/First-Repo`
Starting code baseline: `6bab140fa8abf644acc1216cc86b2af841eeebf1`

## Start here

This file is the practical source of truth for the current `/spaces/` demonstration. Read it before changing a scenario, renderer, product explanation, or test.

The public routes have separate jobs:

- `/spaces/` is the canonical working demonstration.
- `/doc/` explains the product, trust model, inputs, memory, architecture, and current status.
- `/brief/` preserves old links by redirecting to `/spaces/` with query and hash state.
- `/brief-next/` preserves the pre-migration interface as a rollback reference.

All private-looking records in the public demo are fictional. Connected private accounts, persistent memory, multi-user permissions, and external writes remain platform work.

## Product promise shown by the demo

Spaces gives a person or approved group a current bird’s-eye view of one part of life. It organizes relevant records, explains what changed, places important items first, and prepares a useful next step.

The order combines:

1. priorities the user explicitly set;
2. deadlines and commitments;
3. likely impact and risk;
4. meaningful recent changes;
5. source freshness and confidence;
6. patterns in what the user opens, corrects, completes, or dismisses.

Engagement can tune the amount, timing, and presentation. Safety, money, time-sensitive commitments, and shared responsibilities stay visible when they require attention. The Brief should inform and prepare. The user remains in control of changes and external actions.

## Seven current briefing contexts

| Context | Purpose | Signature demonstration |
|---|---|---|
| Personal | A private daily operating view | Schedule, work, money, private habits, streaks, weather, and one short movement check-in |
| Relationship | Two private profiles with an approved shared layer | Plans, promises, decisions, shared timing, and separate private context |
| Family | A practical household Brief | Shared calendar, availability-only blocks, appointments, rides, chores, shopping, meals, and age-aware access |
| Business partners | One remote company across two local days | New York and Sydney time zones, partner lanes, project progress, deals, concerns, cash rules, and prepared calendar changes |
| Accountant and client | A shared financial review with professional boundaries | Salary and side-business records, cash plan, ledger, portfolio context, bills, tax preparation, goals, rules, and client approvals |
| Trainer and student | Coaching informed by evidence and recovery | Readiness, habits, progress, recovery, boundaries, and an adaptive session |
| Team and project | Role-specific work with shared project truth | Workstream metrics, blockers, handoffs, procedures, ownership, and leadership context |

## Business partner demonstration

The Business Partner Space represents Amina in New York and Eli in Sydney. Blue identifies Amina’s approved lane, coral identifies Eli’s, and violet identifies shared operations.

The workspace includes:

- both local times and a protected two-hour decision window;
- four team workstreams with owners, progress, status, and next evidence;
- a fictional three-stage deal pipeline that keeps forecast value separate from collected cash;
- one approved concern from each partner plus one shared operations concern;
- a three-day calendar with partner colors and local time labels;
- a highlighted Tuesday beach day with temperature, UV, and a short preparation list;
- a control that prepares two meeting changes for review.

The calendar action changes only local demo state. Its result states that both partners still need to approve and that no calendar change has been sent.

## Accountant and client demonstration

The Accountant and Client Space represents Daniel, who has a full-time job and a side business named Northline Studio, and Priya Shah, his accountant.

The workspace puts cash safety and deadlines first, then offers deeper review through:

- a compact advisor view with an accountant note and separate salary and startup figures;
- a sideways-scrollable monthly sheet with planned, actual, remaining, and status columns;
- an illustrative market rail, asset cards, allocation meters, and small trend charts;
- bills, internal tax-preparation dates, client review dates, owners, and approval states;
- a personal reserve goal, startup revenue goal, investing goal, and four editable rules.

The market figures are explicitly illustrative. Filing, tax, legal, and investment decisions require verified records and qualified advice. The demo does not execute payments, transfers, trades, filings, or calendar writes.

## Priority notice contract

Every context can define one compact priority notice. It appears below the opening summary and leads to the relevant workspace tab.

A priority notice needs:

- a specific label;
- one factual title;
- one sentence explaining the consequence or coverage state;
- a target tab;
- a restrained tone based on the subject.

Family uses this pattern to show that milk is down to the last carton and already has an owner. Accounting uses it to show that a card autopay would take flexible spending below plan. Business uses it to protect the shared cash-buffer rule.

Alerts should remain rare. A notice earns this position when it changes a near-term decision, prevents a missed responsibility, or confirms that a visible risk already has an owner.

## Direct input and correction contract

Each scenario can define one short question with three quick answers and an optional one-line correction. The current demo saves the answer in local interface state for the active page session.

A production implementation should also record:

- the person who answered;
- source and timestamp;
- the earlier value;
- the corrected value;
- the Space and permission scope;
- the effect on the next Brief.

Questions should appear only when the answer can change a recommendation, status, deadline, permission, or prepared decision. Typing remains optional for routine updates.

## Section conversations and module discovery

Information-rich sections can open the same compact conversation dialog with the current Space and section already named. The control is a small star with an accessible name and appears where the section offers enough context to support a useful question. Contextual prompt choices help a person ask about evidence, timing, permissions, risks, or the next useful step without typing a long setup.

The centered public dialog prepares and displays this handoff. A signed-in product would attach authorized records, source labels, permission scope, and approved tools before calling a model. Demo actions that need the future backend raise a small bottom notice, and external actions would still require the approval rules for that Space.

Every scenario also defines three standout modules. They appear after the opening Brief as direct links into the relevant workspace tab, so the Family calendar, Accounting cash sheet, Business projects, and other signature views remain easy to find.

The primary navigation calls the full module index `Explore`. The opening action, recommendation card, discovery previews, and mobile section pager all lead into it. Inside Explore, a compact cue tells the person that the category names are controls. Persistent previous and next arrows open the adjacent section, a named continuation action identifies what comes next, and the progress label shows the current position. Each section also exposes every other category near its opening through `More inside this briefing` cards. Those cards use the real destination summary, appear as a complete row on desktop, and become a swipeable rail on mobile. This keeps the depth visible before someone reaches the current section's longer data view. The opening `Scroll through today` control moves to the next visible part of the Brief and respects reduced-motion preferences.

The recommended next move also links to its exact supporting module. Its label names the destination, such as Calendar, Concerns, Cash plan, Recovery, or Handoffs, and opens that workspace tab directly. This keeps the strongest evidence connected to the recommendation without adding another navigation layer.

The entrance defines a Space as one clear briefing built from approved information for a person or the people sharing it. Personal is ready as the desktop starting point. The choices share one restrained visual treatment and update a compact mobile preview with priorities, current signals, private boundaries, and approved shared scope. A small Demo data disclosure keeps the fictional-data boundary available without ending the entrance on a disclaimer.

The entry card uses five rotating ideas in place of a music checkbox. The carousel advances from right to left every 4.2 seconds, has previous and next controls, pauses during desktop hover or keyboard focus, and respects reduced-motion settings. Phone users can swipe in either direction, the numeric counter stays hidden on small screens, and automatic movement resumes after touch interaction. The compact phone controls sit beneath the words. The thin pill changes through paired pastel accents in violet, pink, teal, coral, and cyan. Its examples cover a context-aware morning, section conversations, family coordination, prepared calendar changes, and music selected from approved listening preferences. Each future connected capability names its account, permission, or backend boundary.

Priority warnings, trainer accents, financial watch states, and similar emphasis use the current coral, rose, or violet palette in both themes.

Desktop uses a purpose-built entrance where the briefing choices, tips, and entry actions fit before the fold. The detailed selected-Space preview remains part of the more deliberate mobile and tablet flow. The light entrance uses the CMX blue family with quiet technical linework, while dark mode uses near-black with electric-blue depth. The briefing choices share one rich neutral card treatment, with color reserved for selection, the background, and the rotating platform tip.

On phones, the primary entry action stays hidden until the person taps a briefing choice. It then appears as a safe-area-aware bottom action with the chosen briefing named in full, remains available while the person reviews other choices, and disappears when the briefing opens. Desktop keeps the existing inline action and gives it a brief visual confirmation when a choice changes. This interaction belongs to the entry controller and remains reversible without changing briefing data or routing.

The entry grid uses constrained tracks so intrinsic card widths cannot push the panel to the right. It fits without vertical movement at 1917×938, 1280×720, and 1024×768 in the current Chromium geometry checks. Smaller desktop windows receive a visible clickable scroll-progress rail. Phones use full-width choices, comfortable reading sizes, and normal vertical touch scrolling. Wide financial tables scroll only inside their own sheet.

`/doc/` includes two clearly fictional interface previews: a Family calendar with covered private details and an Accountant-client correction. A section-level prompt connects those previews to the conversation model. The investment section compares the reviewed product set through official product links and limits its gap claim to that set. It also separates proven adjacent demand from unproven patentability, names the formal diligence that remains, and gives a concise protection and commercialization sequence based on official USPTO and Copyright Office starting points.

## Music and appearance

Every scenario has one primary Spotify track and two alternate choices. The music drawer can open the alternate list, switch the selected track, and keep provider fallback behavior honest.

Entry stays silent. Music starts only after the person opens the top-right drawer and chooses play. Browser and Spotify policy can require a direct tap, and the provider must never block entry into Spaces.

The top-right soundtrack and appearance buttons share the same button surface. The appearance icon carries a restrained white-blue glow so it remains easy to notice without adding a glowing border around the control.

## Code map

| File | Responsibility |
|---|---|
| `spaces/index.html` | Active shell, entry ideas, priority notice, correction and conversation dialogs, soundtrack choices, asset order, and cache versions |
| `assets/brief/brief-demo-data.js` | Seven scenario definitions, entrance previews, and all fictional records |
| `assets/brief/brief-demo-app.js` | Entrance selection and preview, navigation, workspace rendering, priority notice, and short correction flow |
| `assets/brief/brief-demo-advanced.js` | Business, Accounting, and Team advanced renderers plus local prepared-action behavior |
| `assets/brief/brief-demo-advanced.css` | Isolated styles for advanced modules, mobile financial-sheet geometry, seven-card entry, alerts, corrections, and music choices |
| `assets/brief/brief-demo-experience.js` | Everything view, weather, habits, family boards, and shared-calendar renderers |
| `assets/brief/brief-demo-media.js` | Spotify readiness, playback fallback, and per-scenario track choices |
| `assets/brief/brief-demo-conversation.js` | Entry carousel timing and touch gestures, overflow progress control, and the static section-aware conversation handoff |
| `assets/brief/brief-demo-conversation.css` | Entrance hierarchy, live preview, Space identities, desktop fit, readable mobile flow, pill carousel, overflow affordance, discovery links, centered contextual conversation, backend notice, and layered card surfaces |
| `assets/brief/brief-demo-explainers.js` | Product explanation tabs and scenario jump controls |
| `assets/brief/brief-demo-topbar-polish.css` | Topbar controls, theme icon treatment, and compact polish |
| `doc/index.html` | Readable product overview, illustrative interface teases, reviewed product comparison, investment case, and current boundaries without JavaScript |
| `assets/personal-os-doc.css` | Product overview layout, visual teases, comparison table, investment section, responsive behavior, and print styling |
| `assets/personal-os-doc.js` | Document theme, section tracking, and synchronized product wording |
| `tests/brief-browser-e2e.spec.cjs` | Active desktop, mobile, scenario, navigation, copy, and interaction coverage |
| `tests/brief-spotify-lifecycle.spec.cjs` | Provider readiness, fallback, and alternate-track lifecycle coverage |
| `tests/personal-os-accessibility.spec.cjs` | Automated accessibility coverage for active contexts and themes |

Keep records in `brief-demo-data.js`. Add a renderer in `brief-demo-advanced.js` only when a layout cannot be expressed through the existing card, calendar, board, checklist, habits, weather, or advanced layout contracts.

## Writing standard

Use complete, connected sentences for explanations. Keep labels, controls, dates, owners, metrics, and status text compact.

Remove these patterns from visible copy:

- ellipses used as atmosphere;
- em dashes used to manufacture drama;
- repeated sentence fragments presented as slogans;
- definitions built around what the product is supposedly against;
- vague claims such as seamless, revolutionary, or game-changing;
- claims that make a fictional record sound connected or live.

Each section should answer a practical question: what changed, why it matters, who owns it, what can happen next, and what still needs approval.

## Required validation

Before publishing a Spaces change:

1. Run syntax checks for every changed JavaScript file.
2. Run static smoke tests and the release validator with the current base SHA.
3. Run Chromium and Firefox browser coverage locally.
4. Confirm WebKit coverage in GitHub Actions.
5. Run desktop and mobile accessibility checks.
6. Run Spotify lifecycle tests.
7. Check light and dark themes.
8. Check the Spaces entry at 360×800 and 390×844, confirm the choices and supporting copy remain readable, then reach the actions through normal vertical scrolling.
9. Check that the Accounting sheet keeps Category, Planned, and the horizontal cue readable at 360 pixels wide.
10. Check the spreadsheet’s own horizontal scroll without moving the page.
11. Open the contextual conversation from a focused card and an advanced workspace section. Confirm the star stays compact, the dialog is centered, the Space and section remain in scope, and a prepared backend action raises the bottom notice.
12. Confirm entry remains silent until the soundtrack control receives a direct tap.
13. Scan rendered copy for banned writing patterns.
14. Verify `/brief/` preserves query and hash state when it redirects.
15. Check `/doc/` interface previews, investment comparison, external source links, and local table scrolling in both themes.
16. Verify the deployed `/spaces/` and `/doc/` assets after merge.

## Publishing and recovery

Ship this work through a pull request. Wait for every required check, merge through GitHub, then verify the production domain.

GitHub history supports a clean recovery:

- After the entry and `/doc/` follow-up merges, revert its merge commit to return to the verified PR #75 state.
- To restore the state after PR #73 or PR #72, revert every later merge in reverse order through reviewed pull requests.
- A separate restore branch can also start from either merge commit and return through review.

Use revert commits on `main`. Do not rewrite shared history with a force push or hard reset.

## Handoff checklist

When another context window takes over, provide:

- current branch and base SHA;
- current `git status`;
- changed file list;
- last completed validation command;
- failed check names and exact evidence;
- open pull request and workflow links;
- production verification state;
- any cache or deployment propagation still pending.

This record is more useful than a promise that the work is nearly finished. It lets the next person continue from verified state.
