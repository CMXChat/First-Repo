# Jay + Crystal News Product Polish

This pass adapts useful interaction and visual ideas from `/brief/` without importing its public business, Team, or fictional account demonstrations.

## Product changes

- Quick view is the default for a new edition and remembers the device preference.
- Full edition remains available without deleting any existing sections.
- Moving daily signals support persistent Pause and Play.
- Top visual cards use only real page state: completed actions, local clocks, birthday dates, Crystal input status, and the configured opening track.
- Media players provide per-player refresh, a global refresh action, loading status, timeout guidance, and external-provider fallback links.
- Quick-view controls switch to the full edition before navigating to a hidden section.
- Workspace tabs support arrow keys, Home, and End.
- The build-note visibility control remains reversible.
- Mobile containment and reduced-motion behavior are explicit.

## Validation

Run:

```bash
node scripts/validate-news-product.mjs
```

The validator checks loader order, Quick/Full persistence, navigation interception, keyboard tabs, media recovery, rail resumption, top visuals, mobile behavior, reduced motion, reversible build-note visibility, and the current cache version.
