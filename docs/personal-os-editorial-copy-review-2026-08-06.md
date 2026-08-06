# Personal OS editorial copy review

Date: 2026-08-06

## Scope

This review covered all user-facing prose in:

- `/brief/`
- `/brief-next/`
- `/doc/`
- dynamic briefing scenarios
- the full Brief view
- memory and Spaces explainers
- Spotify status and fallback messages
- the product overview FAQ

Navigation labels, timestamps, statistics, compact card labels, accessibility instructions, and other interface text that benefits from brevity were left concise.

## Editorial standard

The revision removes the repeated short declarative cadence that made parts of the product read like generated copy. Related thoughts now use connected sentences with clearer cause, contrast, and sequence. Short headings remain where they improve scanning, but slogan-style language was reduced when it did not add useful meaning.

The resulting voice is direct, practical, and plainspoken. It keeps technical boundaries accurate without turning every statement into a warning or product slogan.

## Implementation

A shared presentation copy layer now handles the Brief, Brief Next, and Product Overview. It recognizes both original source phrases and later plain-language variants, which prevents older editorial layers from reintroducing clipped wording.

The copy layer observes dynamically rendered text so scenario changes, workspace tabs, explainers, full-view content, and Spotify status updates receive the same treatment after rerendering.

`/brief/` and `/brief-next/` remain byte-for-byte identical.

## Boundaries

This work does not change:

- product behavior
- navigation behavior
- scenario data meaning
- privacy boundaries
- permissions
- Spotify playback logic
- accessibility semantics
- the distinction between demonstrated and planned capabilities

The accessibility repairs identified in the release safeguards remain a separate implementation task.
