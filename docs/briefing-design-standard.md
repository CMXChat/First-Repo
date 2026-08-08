# CMX Briefing Default Design Standard

Status: Historical pre-Spaces baseline

> For the current `/spaces/` visual and interaction direction, use `spaces-visual-design-system.md`. That document supersedes this file when the two conflict. This file remains available as design history for the earlier briefing experience.

This document preserves the approved visual and interaction direction established by `/brief` on August 3, 2026. New briefing pages should begin from this system unless a project explicitly requires a different identity.

## Non-negotiable default

The default briefing experience is dark mode with a true black page foundation. Do not replace it with green, teal, or washed blue backgrounds. Light mode may be added as a separate appearance later without changing the dark-mode identity.

## Core visual language

- Page background: pure black (`#000000`)
- Primary surfaces: near-black neutral panels (`#08090c`, `#0d0f15`, `#12151d`)
- Main text: soft white (`#f7f8fb`)
- Muted text: cool neutral gray (`#a1a6b3`)
- Primary accent: electric blue (`#57a8ff`)
- Secondary accent: violet (`#a177ff`)
- Practical/weather accent: warm amber (`#ffb052`)
- Errors or urgent states: controlled red (`#ff6a7a`)
- Borders: low-contrast white transparency, never green-tinted

Use gradients only as restrained lighting. The page should still read as black.

## Scale and composition

- Prefer a few large, useful modules over many small dashboard cards.
- Hero typography should feel editorial and confident.
- Important elements should use generous spacing and 24–36px corner radii.
- Weather, music, schedule, and priorities should feel like dedicated experiences, not generic cards.
- Mobile is the primary layout test. Desktop may expand the same hierarchy.

## Entry experience

A briefing may use a cinematic entry gate with profile selection and user-controlled startup options.

- Music can begin only after a user gesture and only when selected.
- Read-aloud can begin only when selected.
- Music should duck beneath narration when both are active.
- A frontend gate is a demonstration or convenience layer, not production authentication.
- Real private data requires server-side authentication and access control.

## Weather modules

Weather should be large, visual, interactive, and practical.

Required behavior:

- Large current temperature and condition
- Clear location and source status
- Useful advice or best activity window
- Weather metrics such as feels-like, rain, wind, and sunset
- Interactive hourly selection
- Multi-day outlook
- Reduced-motion support
- No tiny-icon-only weather summaries

## Music modules

Music should feel intentional and connected to the briefing.

- Feature one daily track with an explanation of why it was selected.
- Use an actual licensed service embed or authorized preview, not generated tones presented as a song.
- Clearly distinguish preview playback from full provider playback.
- Demonstrate favorite tracks or playlists when useful.
- Label Spotify or other services as demo, connected, or connection-required honestly.
- Never imply a provider account is connected when it is not.

## Interaction principles

- Every interaction should improve understanding or usefulness.
- Buttons that cannot perform a real action must say concept action or connection required.
- Preserve strong keyboard focus states.
- Respect `prefers-reduced-motion`.
- Avoid decorative animation that competes with content.
- Save harmless appearance preferences locally when appropriate.

## Content and data labels

Use explicit source labels:

- LIVE
- CONNECTED
- SELF-REPORTED
- REMEMBERED
- DEMO
- ANALYSIS
- SUGGESTED
- REQUIRES APPROVAL

Do not present static demonstration content as live or connected information.

## Reuse rule

The approved `/brief` dark-mode design is the baseline for new CMX briefing products, including personal, couple, family, founder, business-partner, client, health, travel, and intelligence briefings.

Future assistants and developers should preserve this foundation and extend it carefully. Do not redesign the core dark-mode identity without explicit approval.
