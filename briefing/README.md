# Briefing Files

This folder is the human-readable planning layer for the scheduled CMX briefings.

## Runtime mapping

- `/news/` is rendered from `assets/news-data.js` through `assets/news.js`.
- `/updates/` is rendered from `assets/updates-notes.js` and the existing updates assets.
- `briefing/news-daily.md` is the readable daily source for `/news`.
- `briefing/updates-daily.md` is the readable daily source for `/updates`.
- `briefing/crystal-profile.md` contains public-safe preferences used when writing Crystal-specific sections.

The Markdown files do not automatically render the pages. A scheduled task or backend process must read the relevant Markdown file, prepare the structured runtime data, update the corresponding JavaScript data file, and verify the page.

## Privacy boundary

This repository is public. Do not store private Discord usernames, screenshots, direct-message contents, medication or health details, relationship allegations, exact locations, passwords, tokens, client information, or confidential third-party details here.

Sensitive `/news` material belongs in a protected backend with expiration rules. Until that exists, only public-safe or deliberately sanitized content should be committed.

## Scheduled-task behavior

A scheduled task should:

1. Read the relevant profile and daily Markdown source.
2. Gather current public information when required.
3. Produce structured data for the target page.
4. Update only the intended runtime data file.
5. Preserve the page schema and audience colors.
6. Verify the page after publishing.
7. Report clearly when publishing is blocked or incomplete.
