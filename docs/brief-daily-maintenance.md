# `/brief` Daily Maintenance Rules

## Purpose

The briefing has two layers:

1. **Permanent product experience**: layout, interactions, privacy model, scenario architecture, renderers, themes, memory explanations, users and spaces, help modal, private/shared controls, light mode, mobile containment, music controls, accountability logic, device compatibility, scenario-aware terminal, and source labels.
2. **Daily content**: current public Brooklyn information, weather, changing news, daily horoscope reflections, entertainment and market context, rotating music, and clearly fictional demonstration records.

Daily updates must never redesign the permanent layer.

## Required reading

Before any daily update, read:

- `docs/briefing-design-standard.md`
- `docs/brief-daily-maintenance.md`
- `docs/brief-device-compatibility.md`

## The only daily-edit files

### `assets/brief/brief-live-data.js`
Use for verified or clearly labeled public information:

- Brooklyn and NYC weather or alerts
- Local operational updates
- AI and technology news
- Business, stock, energy, or market news
- Entertainment and celebrity updates
- Daily horoscope reflections for all signs
- Virgo and Virgo relationship reflection
- Exact timestamps and source URLs

Every current item must state why it matters. Astrology must remain labeled as entertainment and reflection. Never place private user information here.

### `assets/brief/brief-daily-content.js`
Use for safe rotations and fictional demonstrations:

- Music rotation
- Fictional personal scorecards
- Fictional report rows
- Fictional inbox examples
- Fictional project health
- Fictional relationship profile and approved shared-space examples
- Fictional business-partner private records and shared company records
- Fictional trainer accountability questions and weekly status
- Quote rotations
- Edition metadata

Keep the object schema stable. Edit values, not renderer logic.

## Permanent files

Do not edit permanent files during a normal daily refresh. They include:

- `brief/index.html`
- all briefing CSS files
- `brief-core.js`
- `brief-scenario-renderer.js`
- `brief-upgrade.js`
- `brief-live.js`
- `brief-live-patch.js`
- `brief-daily.js`
- `brief-experience.js`
- `brief-experience-guard.js`
- `brief-virgo-pair.js`
- `brief-terminal.js`
- `brief-terminal.css`
- `brief-terminal-bridge.js`
- `brief-config.js`
- `brief-device.js`
- `brief-device.css`
- `tests/brief-device-smoke.test.js`
- `tests/brief-terminal-smoke.test.js`
- `.github/workflows/brief-device-smoke.yml`

A permanent file may change only for an intentional product feature or verified bug fix.

## Terminal contract

The terminal at the bottom of `/brief` is a permanent navigation and product-demonstration layer.

- It must adapt to Personal, Relationship, Business, and Trainer views.
- Each view must have its own prompt, summary, quick commands, and module commands.
- Global commands must preserve `help`, `summary`, `status`, `modules`, `private`, `shared`, `top`, `about`, `privacy`, `clear`, `backend`, `learn`, `teams`, `security`, and briefing-view switching.
- The primary switching syntax is `brief personal|relationship|business|trainer`. Compatible `briefing`, `briefing type`, `view`, and `switch` forms may remain available.
- Every actual briefing-type change must return the user to the beginning, whether it came from the top menu, scenario cards, dock, terminal, or final switcher.
- Terminal help must state concisely that the current shell is limited to demonstration navigation, a protected backend layer is reserved, and future users may enter structured information or upload files through the terminal or dashboard.
- Learning copy may describe daily lessons, spaced repetition, quizzes, corrections, workout progression, and accountability using approved history.
- Team copy may describe role-based member and manager views for projects, procedures, handoffs, operations, and finance monitoring.
- Security copy must describe the planned architecture honestly, including containerized FastAPI on Linux, Cloudflare Access and Tunnel, protected secrets, least-privilege permissions, audit logs, rate limits, encrypted transport, backups, and approval-gated actions.
- Commands must navigate existing modules or change existing interface state. They must not pretend to execute backend, financial, legal, medical, account, or device actions.
- Nothing typed into the static terminal may be transmitted or stored remotely.
- The terminal must remain usable through tappable shortcuts on mobile, keyboard input on desktop, light mode, dark mode, reduced motion, and screen readers.
- The terminal belongs immediately before the final briefing switcher.

## Daily update sequence

1. Read all required documentation.
2. Fetch the latest two daily-edit files from `main`.
3. Research current public information from reputable sources.
4. Update the exact timestamp and source URLs.
5. Refresh all daily horoscope sign summaries and keep the entertainment disclaimer.
6. Refresh entertainment news for the Relationship view and market news for the Business view.
7. Rotate music so one artist or song is not repeated excessively.
8. Keep all private-looking records labeled fictional or demo.
9. Preserve the blue/pink relationship example as customizable labels, not fixed gender rules.
10. Validate JavaScript syntax.
11. Confirm `noindex` remains present.
12. Confirm dark mode remains the default and the white light mode remains optional.
13. Confirm entry music and narration remain unchecked by default.
14. Confirm Personal, Relationship, Business, and Trainer views can be opened from the top switcher, scenario cards, terminal, and final switcher, and switching returns to the beginning.
15. Confirm the help button, private/shared control, trainer yes/no tracker, horoscope selectors, charts, Spotify players, and terminal remain interactive.
16. Run `node tests/brief-device-smoke.test.js` and `node tests/brief-terminal-smoke.test.js` after any permanent briefing change.
17. Publish only after validation.

## Non-negotiable rules

- Never expose real private emails, finances, relationships, health records, addresses, account activity, or private notes on this public page.
- Never call fictional data live.
- Never call a disconnected service connected.
- Never remove source links from public information.
- Never present astrology as science or professional advice.
- Never let one click silently become permanent memory.
- Never make medical, nutritional, legal, or financial conclusions beyond the permitted evidence and appropriate safety limits.
- Never replace the true-black default design during a daily update.
- Never remove or weaken the genuine white light theme.
- Never add autoplay assumptions. Browsers and providers may require a direct user action.
- Never edit permanent files merely to refresh content.
- Never allow multiple scripts to reset or independently own the entry selector.
- Never remove the queued-open fallback or mobile entry regression test.
- Never turn the static terminal into a fake backend console or imply that typed commands perform real protected actions.
- Never remove the terminal smoke test when changing terminal behavior.

## File loading order

The loader must keep data ahead of dependent renderers and continue after optional script failures:

1. synchronous entry controller in `brief-config.js`
2. device compatibility CSS and helper
3. evergreen configuration and scenario data
4. upgrade behavior
5. live public data and live renderer
6. live-weather protection
7. daily rotating content and daily renderer
8. experience guard
9. Virgo-pair defaults
10. profile-space, help, horoscope, accountability, market, and light-theme experience renderer
11. scenario-aware terminal renderer
12. terminal/backend bridge and universal return-to-top controller

Keep this order intact.
