# Spaces Demo Continuity

Last reconciled: **August 8, 2026**
Repository: `CMXChat/First-Repo`
Starting code baseline: `50be686f28f9bc7fd9bc5d7043d2d527e4e50954`

## Start here

This file is the practical source of truth for the current `/spaces/` demonstration. Read it before changing a scenario, renderer, product explanation, or test. Read `spaces-visual-design-system.md` beside it for the current color, composition, visualization, responsive, interlinking, and interaction direction.

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

The notice also exposes one scenario-aware `Alert routing` preview. It can show Spaces push, WhatsApp group, text fallback, and email digest routes with realistic destinations, timing, quiet hours, and the exact information scope allowed through each route. This is local demo state and never sends a message. Real delivery requires authenticated provider connections, recipient approval, revocation, delivery logs, and failure handling. Sensitive details return the recipient to Spaces for source, permission, and action review.

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

The primary navigation calls the complete selected-Space category view `Explore`. The opening action, recommendation card, discovery previews, and mobile section pager all lead into it. Explore keeps the currently selected category in the established focused panel at the top and renders every other category in full underneath it. A person can therefore scroll through the whole Space without opening a card for each category. The existing category controls remain real tabs with keyboard behavior and `aria-selected`; choosing one brings that category to the focused top position and rerenders the remaining categories below. The older `Explore the full picture` card rail is hidden because it duplicated the category controls and added an extra reveal step. Named continuation actions still move between connected categories, contextual conversation controls remain available inside rendered sections, and specialized calendar, habit, board, financial, portfolio, and operational renderers remain intact. The `Everything` view remains a separate longer cross-briefing view with its own sticky horizontal index and progress rail. Its jumps account for both sticky bars so the destination heading remains visible. The opening `Scroll through today` control moves to the next visible part of the Brief and respects reduced-motion preferences.

The recommended next move also links to its exact supporting module. Its label names the destination, such as Calendar, Concerns, Cash plan, Recovery, or Handoffs, and opens that workspace tab directly. This keeps the strongest evidence connected to the recommendation without adding another navigation layer.

The entrance defines a Space as one clear briefing built from approved information for a person or the people sharing it. Personal remains the internal default context, but the chooser does not visually mark any briefing as selected until the person explicitly chooses one in the current entry session. This prevents URL or browser-history state from making the last-opened briefing look like a fresh choice after a reload. Intentional deep-link context can still be preserved underneath the entry. The choices share one restrained visual treatment. Tablet-sized layouts can update a selected-Space preview with priorities, current signals, private boundaries, and approved shared scope. Phones omit that repeated panel because the selected card, confirmation label, and open action already communicate the choice. A small Demo data disclosure keeps the fictional-data boundary available without ending the entrance on a disclaimer.

The entry card uses five rotating ideas in place of a music checkbox. The carousel advances from right to left every 4.2 seconds, pauses during desktop hover or keyboard focus, and respects reduced-motion settings. Previous and next arrow buttons are not shown. Phone users can swipe in either direction, the numeric counter stays hidden on small screens, and automatic movement resumes after touch interaction. The thin pill changes through paired pastel accents in violet, pink, teal, coral, and cyan. Its examples cover a context-aware morning, section conversations, family coordination, prepared calendar changes, and music selected from approved listening preferences. Each future connected capability names its account, permission, or backend boundary.

Priority warnings, trainer accents, financial watch states, and similar emphasis use the current coral, rose, or violet palette in both themes.

Desktop uses a purpose-built entrance where the briefing choices, tips, and entry actions fit before the fold. Tablet-sized layouts can retain the detailed selected-Space preview. Phones remove it to keep the entry focused. The light entrance uses the CMX blue family with quiet technical linework, while dark mode uses near-black with electric-blue depth. The briefing choices share one rich neutral card treatment, with color reserved for explicit selection, the background, and the rotating platform tip.

On phones, the natural bottom action is visible before a person chooses a briefing as a disabled `Choose a Briefing` control. Choosing a briefing changes the same control to `Open [type] Briefing`. A contextual sticky action can also appear after selection, but it yields while the natural action is visible so duplicate actions do not compete. The action disappears when the briefing opens. Desktop keeps the existing inline action and gives it a brief visual confirmation when a choice changes. This interaction belongs to the entry controller and remains reversible without changing briefing data or routing.

The entry grid uses constrained tracks so intrinsic card widths cannot push the panel to the right. It fits without vertical movement at 1917×938, 1280×720, and 1024×768 in the current Chromium geometry checks. Smaller desktop windows receive a visible clickable scroll-progress rail. Phones use full-width choices, comfortable reading sizes, and normal vertical touch scrolling. Wide financial tables scroll only inside their own sheet.

`/doc/` includes two clearly fictional interface previews: a Family calendar with covered private details and an Accountant-client correction. A section-level prompt connects those previews to the conversation model. The investment section compares the reviewed product set through official product links and limits its gap claim to that set. It also separates proven adjacent demand from unproven patentability, names the formal diligence that remains, and gives a concise protection and commercialization sequence based on official USPTO and Copyright Office starting points.

## Music and appearance

Every scenario has one primary Spotify track and two alternate choices. The music drawer can open the alternate list, switch the selected track, and keep provider fallback behavior honest.

Entry stays silent. Music starts only after the person opens the top-right drawer and chooses play. Browser and Spotify policy can require a direct tap, and the provider must never block entry into Spaces.

The top-right soundtrack control remains compact. The appearance control matches `/doc/`: an explicit segmented `Dark` and `Light` button with a moving selected-state thumb. Both words remain visible, the accessible label names the next action, and the control does not rely on an ambiguous icon.

## Code map

| File | Responsibility |
|---|---|
| `spaces/index.html` | Active shell, entry ideas, priority notice, correction and conversation dialogs, soundtrack choices, asset order, and cache versions |
| `assets/brief/brief-demo-data.js` | Seven scenario definitions, entrance previews, and all fictional records |
| `assets/brief/brief-demo-app.js` | Entrance selection and preview, navigation, workspace rendering, priority notice, alert-routing preview, and short correction flow |
| `assets/brief/brief-demo-advanced.js` | Business, Accounting, and Team advanced renderers plus local prepared-action behavior |
| `assets/brief/brief-demo-advanced.css` | Isolated styles for advanced modules, mobile financial-sheet geometry, seven-card entry, alerts, corrections, and music choices |
| `assets/brief/brief-demo-experience.js` | Everything view, weather, habits, family boards, and shared-calendar renderers |
| `assets/brief/brief-demo-media.js` | Spotify readiness, playback fallback, and per-scenario track choices |
| `assets/brief/brief-demo-explore.js` | Complete Explore rendering that preserves the focused category and opens every remaining category underneath it |
| `assets/brief/brief-demo-explore.css` | Explore overview layout, duplicate-index removal, and neutral entry-selection treatment before an explicit choice |
| `assets/brief/brief-demo-conversation.js` | Entry carousel timing and touch gestures, overflow progress control, and the static section-aware conversation handoff |
| `assets/brief/brief-demo-conversation.css` | Entrance hierarchy, live preview, Space identities, desktop fit, readable mobile flow, pill carousel, overflow affordance, discovery links, centered contextual conversation, backend notice, and layered card surfaces |
| `assets/brief/brief-demo-explainers.js` | Product explanation tabs and scenario jump controls |
| `assets/brief/brief-demo-topbar-polish.css` | Topbar controls, segmented appearance control, and compact polish |
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
8. Check the Spaces entry at 320×844, 360×800, 390×844, and 430×844. Confirm the large selected-Space preview is hidden on phones, the choices and supporting copy remain readable, stale URL state does not create a selected-looking card before a tap, and the disabled or selected action is reachable through normal vertical scrolling.
9. Check that the Accounting sheet keeps Category, Planned, and the horizontal cue readable at 360 pixels wide.
10. Check the spreadsheet’s own horizontal scroll without moving the page.
11. Open the contextual conversation from a focused card and an advanced workspace section. Confirm the star stays compact, the dialog is centered, the Space and section remain in scope, and a prepared backend action raises the bottom notice.
12. Confirm entry remains silent until the soundtrack control receives a direct tap.
13. Scan rendered copy for banned writing patterns.
14. Verify `/brief/` preserves query and hash state when it redirects.
15. Check `/doc/` interface previews, investment comparison, external source links, and local table scrolling in both themes.
16. Open alert routing in representative Personal, Family, Accounting, and Team contexts. Check scenario-specific destinations, switch state, focus restoration, mobile dialog containment, and the explicit no-send boundary.
17. Check Team Project and Accounting Portfolio in focused, Explore, and Everything views at 320, 360, 390, and 430 pixels. Charts must fit and tables may scroll only inside their named region.
18. Verify that Explore renders every category exactly once: the active category in the focused panel and every remaining category below it.
19. Verify the deployed `/spaces/` and `/doc/` assets after merge.

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

## August 8 visual briefing release

The current release replaces generic three-card briefing sections with visuals shaped around the decision in each section. These include timelines, status boards, metric bars, readiness dials, relationship maps, progress charts, handoff flows, and guided steps. The Everything view reuses these full visual modules so it remains the complete view instead of a reduced summary.

The Personal habit view now explains weekly completion, daily rhythm, strongest pattern, the area that needs attention, and the next useful check-in. All displayed records remain fictional demo data.

The entry carousel no longer shows previous and next arrow buttons. It continues to rotate automatically and supports touch swiping. On mobile, the natural bottom action remains visible as a disabled `Choose a Briefing` control before a choice. Choosing a briefing updates it to `Open [type] Briefing` and reveals the contextual Open briefing action. The contextual action yields when the natural action is visible, avoiding duplicate competing controls.
