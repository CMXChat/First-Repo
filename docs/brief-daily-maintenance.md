# `/brief` Daily Maintenance Rules

## Product structure

The briefing has three permanent layers:

1. **Quick briefing**: the default. It shows a small set of current signals, one recommended action, a compact timeline, a polished daily quote and scenario-specific pill tabs.
2. **Full workspace**: every rich dashboard, profile, chart, player, terminal, privacy explanation, memory control, integration concept and technical explanation remains available.
3. **Daily content**: current public information and clearly fictional demonstration records that can change without redesigning the product.

The product should demonstrate its own promise: collect broadly, organize deeply and show only what matters first.

## Required reading

Before any daily update, read:

- `docs/briefing-design-standard.md`
- `docs/brief-daily-maintenance.md`
- `docs/brief-device-compatibility.md`
- `docs/brief-performance-safety.md`

## Daily-edit files

A normal daily run may edit only:

### `assets/brief/brief-live-data.js`

Use it for verified or clearly labeled public information:

- Brooklyn and NYC weather or alerts
- Local operational updates
- AI and technology news
- Business, stock, energy and market news
- Entertainment and celebrity updates
- Daily horoscope reflections for all signs
- Virgo and Virgo relationship reflection
- Exact timestamps and source URLs

Every current item explains why it matters. Astrology remains entertainment and reflection. Never place private user information here.

### `assets/brief/brief-daily-content.js`

Use it for safe rotations and fictional demonstrations:

- Music for Personal, Relationship, Business, Trainer and Team
- Daily quotes for all five briefings
- Fictional personal scorecards, reports, inboxes and project health
- Fictional relationship profiles and approved shared-space examples
- Fictional business-partner private and shared records
- Fictional trainer accountability questions and weekly status
- Fictional Team values when the existing schema permits them
- Edition metadata

Edit values, not renderer logic or object structure.

## Shared daily media

`assets/daily-video.js` is published by the existing `/news` workflow. `/brief` reads the same verified YouTube item for the Relationship **Today’s Watch** card.

- Do not create a competing `/brief` writer for this file.
- A `/news` video update must update both pages.
- The iframe stays unloaded until Play is tapped.
- The full player includes **Refresh video**. Refresh resets a failed iframe to a fresh poster and requires another Play tap.
- The Quick Watch view includes **Refresh preview** for a blank thumbnail.
- Refresh must never silently autoplay the video.
- Loading, loaded and delayed states remain visible in text.
- An invalid or missing video must not break the Relationship briefing.

## Five briefing types

The permanent briefing set is:

1. Personal
2. Relationship
3. Business
4. Trainer + student
5. Team + project

Business remains partner and management focused. Team is a distinct member-facing and project-facing demonstration with:

- Private member profiles
- Role spaces
- Shared project truth
- Leadership spaces
- Member-specific work
- Project timelines and board columns
- Handoffs
- Procedure or operation readiness
- Approved finance signals
- Workload and readiness visuals
- Least-privilege security boundaries

## Quick briefing contract

Quick briefing is always the default after entry or after switching briefing type.

- Show roughly five primary signals, not the entire dataset.
- Show one recommended next move.
- Keep a compact timeline or day line.
- Use scenario-specific pill tabs for manual exploration.
- Preserve a polished daily quote card.
- Use real public data where available and label it clearly.
- Use concise placeholders or fictional examples for unconnected private data.
- The full workspace remains one tap away.

Pill tabs are scenario specific:

- Personal: Overview, Day, Work, Finance, Wellness, Intelligence
- Relationship: Overview, Together, Profiles, Plans, Watch, Reflection
- Business: Overview, Finance, Projects, Decisions, Markets, Partners
- Trainer: Overview, Today, Habits, Progress, Recovery, Coach
- Team: Overview, My work, Project, Handoffs, Procedure, Finance, Spaces

## Business and Team visual hierarchy

Business and Team require decision-grade visuals near the top of the experience.

### Business

The Overview, Finance, Projects and Decisions tabs keep an executive pulse directly below the pill navigation:

- KPI cards
- Six-month revenue trend
- Cash-collected ring
- Current operating decision
- A route to the deeper ledger and finance charts

These visuals use clearly fictional internal company data. Public market stories remain separately sourced and labeled.

### Team

The Overview, My work, Project, Handoffs, Procedure and Finance tabs keep a Team operating board directly below the pill navigation:

- Readiness
- Blockers
- At-risk handoffs
- Budget used
- Role count
- Workload bars
- Project flow
- Monday-style status columns
- Handoff watch
- Approved finance bars

Quick mode shows the compact signals. Full mode reveals the richer board and charts before the older long-form Team modules.

## Motion contract

Motion may support short status information. It must not control substantial reading.

- The compact signal rail may move automatically.
- It includes a working Pause or Play control.
- Explicit Pause is the source of truth and Play must always resume movement.
- Keyboard focus must never trap the rail in a permanently paused state.
- Hover may pause only on devices with a fine pointer.
- `prefers-reduced-motion` disables the moving rail and decorative Team-flow animation.
- Full cards, quotes, procedures, finance records and decisions never rotate automatically.
- Mobile cards use user-controlled horizontal swipe and scroll snap when space is limited.
- Do not add autoplay carousels for meaningful content.

## Entry contract

The pre-entry gate uses five visible radio cards.

- All five choices remain readable without opening a menu.
- Native radio behavior permits one selection.
- Selecting a card only selects it. It must not enter automatically.
- The visible **Open this briefing** button is the only entry action.
- Music and narration preferences can be chosen before entry.
- Both preferences remain unchecked by default.
- The hidden select exists only as a compatibility bridge.
- Entry forces the document and gate to position zero.
- Never restore a popup, modal picker, dropdown or one-tap automatic entry.

## Full workspace contract

Full workspace preserves the rich work already created:

- Live public layer
- Weather and music
- Scenario explorer
- Personal command center
- Relationship private and shared profiles
- Relationship Today’s Watch and refresh control
- Business partner dashboards, executive pulse and shared ledger
- Trainer habit and accountability modules
- Team users, roles, spaces, workload, board, handoffs, procedures, finance and security
- Priorities and schedules
- Daily rhythm
- Memory controls
- Integrations and possibilities
- Backend architecture explanation
- Terminal
- Final briefing switcher

Daily updates must never remove these modules merely to shorten the default experience.

## Terminal contract

The terminal adapts to all five briefing types.

- Primary switching syntax: `brief personal|relationship|business|trainer|team`
- Compatible `briefing`, `briefing type`, `view` and `switch` forms may remain.
- Global commands preserve help, summary, status, modules, private, shared, top, about, privacy, clear, backend, learn, teams and security.
- Team commands include mywork, project, handoffs, procedure, finance, spaces and security.
- Terminal help states that the current shell navigates the demonstration only.
- Future authenticated input and file upload may work through the terminal or dashboard.
- Nothing typed into the current static terminal leaves the page.
- The terminal must never pretend to execute real backend, financial, legal, medical, account or device actions.

## Permanent files

Normal daily refreshes must not edit permanent product files, including:

- `brief/index.html`
- all briefing CSS files
- `brief-config.js`
- `brief-core.js`
- `brief-scenario-renderer.js`
- `brief-entry-radio.js`
- `brief-device.js`
- `brief-upgrade.js`
- `brief-live.js`
- `brief-live-patch.js`
- `brief-daily.js`
- `brief-experience.js`
- `brief-experience-guard.js`
- `brief-virgo-pair.js`
- `brief-terminal.js`
- `brief-terminal-bridge.js`
- `brief-relationship-watch.js`
- `brief-team-data.js`
- `brief-team-renderer.js`
- `brief-workspace.js`
- `brief-workspace.css`
- `brief-polish.js`
- `brief-polish.css`
- all briefing smoke tests
- `.github/workflows/brief-device-smoke.yml`

A permanent file changes only for an intentional product feature or verified bug fix.

## Daily validation sequence

1. Read the required documentation.
2. Fetch the latest two editable files from `main`.
3. Read but do not rewrite `assets/daily-video.js`.
4. Research current public information from reputable sources.
5. Refresh timestamps, source URLs and why-it-matters copy.
6. Refresh all horoscope summaries and the Virgo + Virgo reflection.
7. Refresh Relationship entertainment and Business market context.
8. Rotate music and daily quotes without repetitive artists or language.
9. Keep private-looking records fictional and labeled.
10. Confirm all five radio choices remain present.
11. Confirm selection does not enter automatically.
12. Confirm Quick briefing is the default and Full workspace remains available.
13. Confirm all scenario pill tabs work.
14. Confirm Pause → Play → Pause works and reduced motion disables movement.
15. Confirm the Relationship video can be reset without autoplay.
16. Confirm Business KPIs and charts appear near the top.
17. Confirm Team readiness, workload, board, handoff and finance visuals remain available.
18. Confirm every briefing switch returns to the top.
19. Confirm dark mode, genuine light mode and mobile containment remain intact.
20. Confirm `noindex` remains present.
21. After a permanent change, run:
   - `node tests/brief-device-smoke.test.js`
   - `node tests/brief-terminal-smoke.test.js`
   - `node tests/brief-entry-watch-smoke.test.js`
   - `node tests/brief-stability-smoke.test.js`
   - `node tests/brief-workspace-team-smoke.test.js`
   - `node tests/brief-polish-smoke.test.js`
22. Publish only after validation.

## Non-negotiable rules

- Never expose real private emails, finances, relationships, health records, addresses, account activity or private notes on this public page.
- Never call fictional data live.
- Never call a disconnected service connected.
- Never remove source links from public information.
- Never present astrology as science or professional advice.
- Never let one click silently become permanent memory.
- Never make medical, nutritional, legal or financial conclusions beyond permitted evidence and appropriate safety limits.
- Never weaken the true-black default or genuine white light theme.
- Never assume autoplay will work.
- Never use a broad MutationObserver that watches the entire document and mutates the same interface from its callback.
- Never hide the rich modules permanently in order to shorten Quick briefing.
- Never make substantial content auto-rotate.
- Never merge Team into Business. They serve different perspectives.
- Never remove media refresh controls without an equivalent recovery path.

## Loading order

The loader keeps data before dependent renderers and continues after optional script failures:

1. Synchronous entry controller
2. Radio-card and device helpers
3. Base presets, data, scenarios and Team data
4. Core application and base scenario renderer
5. Shared daily video data
6. Upgrade layer
7. Live public data and renderer
8. Daily rotating content and renderer
9. Experience guard and Virgo-pair defaults
10. Experience renderer
11. Terminal renderer
12. Relationship watch renderer
13. Team renderer
14. Quick/full workspace controller
15. Business, Team, motion and media polish controller
16. Terminal bridge and universal return-to-top controller

Keep this order intact.
