# Briefing Files

This folder is the human-readable planning and publishing layer for the scheduled CMX briefings.

## `/news` authority

Read these files for every Jay + Crystal daily edition:

- `briefing/news-publishing-standard.md` is the authoritative research, section, privacy, publishing and validation contract.
- `briefing/news-daily.md` contains the active daily objective, tone and runtime file roles.
- `briefing/media-daily.md` controls song and video selection.
- `briefing/weather-daily.md` controls Brooklyn and Waikato weather research.
- `briefing/culture-daily.md` controls celebrity, crime and culture research.
- `briefing/crystal-profile.md` and `briefing/jay-profile.md` provide public-safe personalization.

## `/news` runtime mapping

- `assets/news-data.js` stores the main briefing structure and general sections.
- `assets/daily-song.js` stores the current rotating song and autoplay metadata.
- `assets/daily-weather.js` stores researched weather for both locations.
- `assets/daily-culture.js` stores the researched celebrity, crime and culture desk.
- `assets/daily-video.js` stores one optional daily video.
- Permanent sync and renderer files combine the daily data into `/news/`.

The Markdown files do not automatically render the page. The scheduled task must read the current rules, prepare the structured runtime data, update the daily JavaScript files and verify the route.

## Other briefing routes

- `/updates/` is rendered from `assets/updates-notes.js` and the existing updates assets.
- `briefing/updates-daily.md` is the readable source for `/updates`.

## Privacy boundary

This repository is public. Do not store private usernames, screenshots, direct-message contents, medication or health details, sexual details, relationship allegations, exact locations, passwords, tokens, financial account data, client information or confidential third-party details here.

A browser gate is not server-side privacy. Treat committed content and Git history as potentially public and permanent.

## Scheduled-task behavior

A `/news` publishing task must:

1. Read the authoritative standard, daily rules, section rules and profiles.
2. Resolve the actual Brooklyn and Waikato local dates.
3. Gather current public research and fresh permitted personal input.
4. Compare the proposed edition with the previous edition.
5. Update only the five intended daily runtime files.
6. Fetch the latest SHA immediately before every write.
7. Preserve the page schema and audience colors.
8. Validate sources, legal status, privacy, JavaScript and cross-file consistency.
9. Verify the page and loader when possible.
10. Report blocked, incomplete or unverified publication honestly.
