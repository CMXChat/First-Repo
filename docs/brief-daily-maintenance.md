# `/brief` Daily Maintenance Rules

## Purpose

The briefing has two layers:

1. **Permanent product experience**: layout, interactions, privacy model, scenario architecture, renderers, themes, memory explanations, users and spaces, music controls, and source labels.
2. **Daily content**: current public Brooklyn information, changing news, date-sensitive advice, rotating music, and clearly fictional demonstration records.

Daily updates must never redesign the permanent layer.

## The only daily-edit files

### `assets/brief/brief-live-data.js`
Use for verified public information:

- Brooklyn and NYC weather or alerts
- Local operational updates
- AI and technology news
- Business or market news
- Exact timestamps and source URLs

Every item must state why it matters. Never place private user information here.

### `assets/brief/brief-daily-content.js`
Use for safe rotations and fictional demonstrations:

- Music rotation
- Fictional personal scorecards
- Fictional report rows
- Fictional inbox examples
- Fictional project health
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

A permanent file may change only for an intentional product feature or verified bug fix.

## Daily update sequence

1. Read this file and `docs/briefing-design-standard.md`.
2. Fetch the latest two daily-edit files from `main`.
3. Research current public information from reputable sources.
4. Update the exact timestamp and source URLs.
5. Rotate music so one artist or song is not repeated excessively.
6. Keep all private-looking records labeled fictional or demo.
7. Validate JavaScript syntax.
8. Confirm `noindex` remains present.
9. Confirm dark mode remains the default and light mode remains optional.
10. Confirm entry music and narration remain unchecked by default.
11. Confirm Personal, Relationship, Business, and Trainer views can be opened from both the top switcher and final switcher.
12. Publish only after validation.

## Non-negotiable rules

- Never expose real private emails, finances, relationships, health records, addresses, account activity, or private notes on this public page.
- Never call fictional data live.
- Never call a disconnected service connected.
- Never remove source links from public information.
- Never let one click silently become permanent memory.
- Never make medical, nutritional, legal, or financial conclusions beyond the permitted evidence and appropriate safety limits.
- Never replace the true-black default design during a daily update.
- Never add autoplay assumptions. Browsers and providers may require a direct user action.

## File loading order

The HTML and briefing loader must keep data ahead of renderers:

1. configuration and evergreen scenario data
2. daily song and public live data
3. daily rotating content
4. core and scenario renderers
5. upgrade, live, patch, and daily enhancement renderers

Keep this order intact.
