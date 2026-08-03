# `/brief` Performance Safety

## Purpose

The briefing is a large interactive demonstration that must remain responsive on current phones, including Chrome and Samsung Internet on mid-range Android devices.

## Observer rules

- Do not observe `document.body` with `{ childList: true, subtree: true }` unless there is no event-driven or bounded-retry alternative.
- Never write `textContent`, `innerHTML`, append nodes, remove nodes, or replace nodes unconditionally from a MutationObserver callback watching the same subtree.
- Before changing text or markup, compare the current value with the intended value.
- Prefer product events such as `brief:ready`, `brief:preset-change`, and `brief:device-fallback-open`.
- For late-rendering optional modules, use a bounded retry loop with a short delay and a strict attempt limit.
- Disconnect any observer as soon as its narrow purpose is complete.
- Scope necessary observers to the smallest stable container.

## Current protections

- The terminal/backend bridge uses bounded retries and conditional text updates. It must not create a MutationObserver.
- The Relationship `Today’s Watch` renderer uses briefing events and bounded retries. It must not observe the entire document.
- The radio-card entry uses direct native `change` events and the existing queued-open fallback.
- Smoke tests reject a full-document observer in the terminal bridge or Relationship watch renderer.

## Validation after permanent changes

Run:

```bash
node tests/brief-device-smoke.test.js
node tests/brief-terminal-smoke.test.js
node tests/brief-entry-watch-smoke.test.js
```

Also verify:

1. The gate becomes interactive without an unresponsive-page warning.
2. All four radio cards are visible and only one can be active.
3. One tap opens the selected briefing.
4. Switching briefing types returns to the top.
5. Opening and closing help does not create sustained CPU work.
6. The terminal appears without repeatedly rewriting itself.
7. Relationship `Today’s Watch` renders only in Relationship and loads YouTube only after Play.
8. Leaving the page open for at least 30 seconds does not increase repeated DOM work.

## Incident record

On August 3, 2026, the terminal bridge watched the full document and unconditionally rewrote text inside its own observed subtree. This produced a self-triggering mutation loop and caused Chrome and Samsung Internet to report that the page was unresponsive. The observer was removed, its updates became conditional, bounded retries replaced document-wide watching, and cache versions were changed so phones would not retain the broken script.
