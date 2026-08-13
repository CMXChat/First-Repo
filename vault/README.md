# Vault 3.0 developer handoff

Read this file before changing `/vault/`. It is the short source of truth for future Codex context windows and human contributors.

## Product purpose

Vault 3.0 is the private web home for a Discord server owned by **anymuz** and **biggz**. It is meant to organize approved member profiles, contacts, links, server recaps, drama context, local time, weather, news, server lore, and eventually personal daily briefings.

The current implementation is a static GitHub Pages demonstration. It does not connect to Discord, weather providers, a database, or an AI service. UI copy must continue to distinguish demonstrations from live data.

## Current routes

- `/vault/` contains the password gate, main portal, morning briefing preview, searchable member directory, timezone clocks, feature explanations, and optional terminal.
- `/vault/biggz/` is the working Biggz profile demo. Confirmed location: London. Timezone: `Europe/London`.
- `/vault/mel/` is the working Mel profile demo. Confirmed country: South Africa. City confirmation is pending. The country uses `Africa/Johannesburg` time.
- `/vault/anymuz/` is the working Anymuz profile demo. Confirmed role: owner and developer. Location and timezone are not confirmed.
- `/vault/kazy/` is the working Kazy profile demo. Confirmed role: developer. Kazy boosted the server twice and helped Vault 3.0 reach Server Level 1. Location and timezone are not confirmed.

Each member briefing targets approximately **7:00 AM in that member's confirmed local timezone**. Do not describe the schedule as 7:00 AM Eastern for everyone.

The permanent Discord invitation is:

`https://discord.gg/48xdhWJ9RD`

## File map

- `vault/index.html`: portal structure only.
- `assets/vault/vault.css`: shared gate, shell, terminal, panels, and base responsive styles.
- `assets/vault/vault-theme.css`: light theme variables and component colors.
- `assets/vault/vault-layout.css`: CSP-safe fixed positional rules.
- `assets/vault/vault-portal-ui.css`: friendly portal, briefing, directory, typography, and mobile presentation.
- `assets/vault/vault.js`: gate, session, terminal, clocks, sidebar, and base portal behavior.
- `assets/vault/vault-directory.js`: display-only member directory source. Keep uncertain details empty.
- `assets/vault/vault-portal.js`: theme, Discord invite, directory rendering, search, reactions, room-opening transitions, roster scan, local briefing schedule, and smooth navigation.
- `assets/vault/vault-restricted-node-social-v2.png`: 1200×630 PNG converted from the owner-supplied WebP. This fresh URL is the Open Graph and Twitter image used by the Vault portal and every profile room.
- `assets/vault/vault-profile-data.js`: centralized approved demo facts for open profiles.
- `assets/vault/vault-profile.js`: shared profile rendering, session check, theme, local time, and next-brief calculation.
- `assets/vault/vault-world-data.js`: shared Vault Radio, lore, briefing archive, relationship, and return-visit data.
- `assets/vault/vault-world.js`: radio controls, Spotify track switching, votes, queue, global search, poll, return brief, and local owner-note demo.
- `assets/vault/vault-world.css`: rich visual surfaces, radio presentation, world panels, global search, mini player, and mobile focused tabs.

## Mobile views

The bottom bar opens focused Home, Members, Radio, and Brief views. Everything restores the complete scrollable Vault. Keep `data-mobile-target` values aligned with the matching section IDs.
- `assets/vault/vault-profile.css`: shared member profile layout and responsive styling.
- `vault/{member}/index.html`: intentionally thin profile shell with `data-member-id`.

## Adding a profile

1. Confirm the spelling, safe display name, role, location, and timezone with the member or server owner. Never infer private facts from a Discord screenshot.
2. Add or update the directory entry in `assets/vault/vault-directory.js` and give it a route such as `/vault/example/`.
3. Add approved profile data to `assets/vault/vault-profile-data.js`.
4. Copy one thin profile HTML shell to `vault/example/index.html` and change only `data-member-id="example"`.
5. Test direct access without a Vault session, access after unlocking, dark/light modes, 320px mobile, tablet, desktop, search, back navigation, and the Discord link.

## Data and privacy rules

- A Discord name in the directory does not authorize storing personal information.
- Unknown details stay `null`, blank, or visibly marked as pending.
- Do not copy Discord avatars without approval.
- Members should eventually be able to view, correct, or remove their information.
- Never present demo drama, weather, Discord activity, or AI output as live.
- The browser password gate is a temporary deterrent. Real privacy requires Cloudflare Access and server-side authorization.
- Do not place API tokens, Discord credentials, weather keys, or private records in these static files.

## Next backend phase

When the approved backend exists, replace the static arrays with authenticated API responses. Suggested bounded resources are member profiles, briefing summaries, weather snapshots, links, and member preferences. Discord ingestion should be explicitly approved, minimized, logged, and separated from the presentation layer. Keep a clear generated timestamp and source state on every briefing.

## Current manual briefing facts

- Anymuz is learning Hebrew and Aramaic.
- Kazy boosted the server twice.
- Vault 3.0 reached Server Level 1 after Kazy's boosts.

These facts were supplied directly by the server owner on 2026-08-13. Keep them in the manual briefing until they age out or a newer server update replaces them.

## Visual rules

- Maintain both dark and light themes.
- Main copy should generally stay at 12px or larger; important explanatory copy should be 13–16px.
- Controls need a minimum 44px touch target where practical.
- Mobile is a first-class layout. Avoid horizontal scrolling and hidden essential actions.
- Preserve the blue CMX/intelligence-console character while keeping the portal understandable to nontechnical members.
