# `/brief` Daily Maintenance Rules

## Purpose

The briefing has two layers:

1. **Permanent product experience**: layout, interactions, privacy model, scenario architecture, renderers, themes, memory explanations, users and spaces, help modal, private/shared controls, light mode, mobile containment, music controls, accountability logic, and source labels.
2. **Daily content**: current public Brooklyn information, weather, changing news, daily horoscope reflections, entertainment and market context, rotating music, and clearly fictional demonstration records.

Daily updates must never redesign the permanent layer.

## The only daily-edit files

### `assets/brief/brief-live-data.js`
Use for verified or clearly labeled public information:

- Brooklyn and NYC weather or alerts
- Local operational updates
- AI and technology news
- Business, stock, energy, or market news
- Entertainment and celebrity updates
- Daily horoscope reflections for all signs
- Virgo and Pisces relationship reflection
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
- `brief-config.js`

A permanent file may change only for an intentional product feature or verified bug fix.

## Daily update sequence

1. Read this file and `docs/briefing-design-standard.md`.
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
14. Confirm Personal, Relationship, Business, and Trainer views can be opened from the top switcher, scenario cards, and final switcher, and switching returns to the beginning.
15. Confirm the help button, private/shared control, trainer yes/no tracker, horoscope selectors, charts, and Spotify players remain interactive.
16. Publish only after validation.

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

## File loading order

The loader must keep data ahead of dependent renderers:

1. evergreen configuration and scenario data
2. upgrade behavior
3. live public data and live renderer
4. live-weather protection
5. daily rotating content and daily renderer
6. experience guard
7. profile-space, help, horoscope, accountability, market, and light-theme experience renderer

Keep this order intact.
