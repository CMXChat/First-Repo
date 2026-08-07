# CMX Spaces and Daily Brief Master Context

Last reconciled: **August 5, 2026**  
Repository: `CMXChat/First-Repo`  
Verified product baseline: `5c7eef899f3357854492e2d3918f5915eb536b6b`  
Primary deployment: `https://db.cmxchat.com/`

## Purpose

This file is the current product and technical context for the Personal OS demo, its product overview, and the future platform direction. It replaces the August 4 assumptions that described the older modular Brief runtime as the active production implementation.

For the detailed comparison, read `docs/2026-08-05-repository-reconciliation.md`.

## Product definition

Personal OS is a proposed private operating layer built around:

- Spaces for separate life and work contexts
- structured, inspectable memory
- goals and direction
- daily briefings and rituals
- people, relationships, and shared coordination
- chosen AI models
- explicit permissions
- source and trust labels
- approved actions

The current repository demonstrates this product direction. It does not yet deliver the full authenticated backend platform.

## Current public surfaces

### `/spaces/`

The primary public noindex product demo.

It includes:

- Personal, Relationship, Family, Business, Trainer, and Team contexts
- focused Today, Workspace, Spaces, How, and Everything views
- private habit tracking plus household calendar, chore, shopping, and access examples
- an optional Everything view
- fictional private-looking data with explicit labels
- scenario-specific people, priorities, permissions, numbers, Spaces, and actions
- responsive desktop and mobile navigation
- light-first HTML and theme behavior with manual dark mode
- context-aware Spotify soundtrack integration
- keyboard-aware workspace tabs and reset focus
- direct links to the full product overview
- plain-language visible copy

### `/brief-next/`

A public noindex pre-migration rollback snapshot.

### `/brief/`

A legacy compatibility route that redirects to `/spaces/` while preserving query and hash state.

### `/doc/`

The public noindex Personal OS product overview.

It explains:

- the operating model
- Spaces
- structured memory
- Goal Intelligence direction
- daily ritual
- relationship and team coordination
- model choice and permissions
- trust boundaries
- current demonstrated behavior
- planned architecture
- scenarios and frequently asked questions

It is intentionally ungated, uses plainer product language, and links back to `/spaces/`.

## Current frontend architecture

The shipping Brief experience is a focused static application built from `brief-demo-*` assets.

Primary files:

- `spaces/index.html`
- `brief/index.html` for the compatibility redirect
- `brief-next/index.html` for the rollback snapshot
- `assets/brief/brief-demo-data.js`
- `assets/brief/brief-demo-app.js`
- `assets/brief/brief-demo-experience.js`
- `assets/brief/brief-demo-explainers.js`
- `assets/brief/brief-demo-media.js`
- related `brief-demo-*` CSS

The older modular Brief implementation remains in the repository. It is not the active asset chain loaded by the current route HTML. Future cleanup requires a dependency inventory before deletion.

The document surface uses:

- `doc/index.html`
- `assets/personal-os-doc.css`
- `assets/personal-os-doc.js`
- focused desktop and mobile tuning assets imported by the main stylesheet

## Theme behavior

### Brief

Light is the initial HTML theme and the default resolver result.

Resolution order:

1. explicit theme query
2. saved `personal_os_brief_theme_v2`
3. light

Manual dark mode remains reversible and persistent.

### Product overview

`/doc/` starts in light mode directly in the HTML. Dark mode remains selectable.

## Music behavior

The demo uses Spotify's iframe controller.

The interface:

- preloads the selected scenario soundtrack
- waits for readiness when entry music is enabled
- uses the Open demo click to request playback
- confirms playback state when the provider reports it
- falls back to a normal embedded player after API failure or timeout
- exposes a direct-play path when one tap is required

Automatic playback remains subject to browser and provider policy.

## Interaction and copy standards

Current product expectations include:

- visible language should be plain, direct, and specific
- rendered-copy tests should protect important user-facing text
- tab controls should expose correct ARIA state
- arrow keys should move through supported workspace tabs
- reset and return-to-entry behavior should restore useful focus
- hidden application regions should not retain active focus
- fictional and planned behavior should remain clearly labeled

## Privacy and trust boundary

Current public routes are noindex demos. Noindex is a crawler instruction, not access control.

The demo must continue to distinguish:

- fictional demo records
- static repository content
- planned connected services
- real future private user data

The current repository does not provide:

- authenticated Personal OS accounts
- server-enforced Space permissions
- encrypted memory storage
- live email, calendar, finance, health, weather, or messaging access
- model connector orchestration
- action approval queues
- backend audit logs

## Future platform architecture

The intended backend direction remains:

- FastAPI first
- Dockerized Linux deployment
- Cloudflare Access or equivalent identity boundary for private tools
- GitHub as source of truth
- staging before production approval
- Jinja or static frontend plus API endpoints where appropriate
- PostgreSQL and Redis when persistent state is introduced
- secret management through environment variables or a secret manager
- rate limits, logging, backups, health checks, and restart policy
- model and connector permissions controlled per Space

The static demo should not be coupled prematurely to a backend implementation. Define API and trust boundaries first.

## Current validation model

The repository contains:

- static Brief smoke coverage
- desktop and mobile Playwright coverage
- Chromium, Firefox, WebKit, iPhone, and Android matrix coverage
- `/brief-next/` focused coverage
- `/doc/` smoke coverage
- rendered-copy checks
- keyboard, focus, media fallback, and mobile containment checks
- privacy, navigation, secret, and theme guards

A final release claim should still be based on a fresh complete run and a deployed-domain smoke test.

## Product status

### Demonstrated

- multi-context briefing interface
- focused and full views
- responsive themes
- static fictional data
- static daily intelligence content
- reciprocal product navigation
- Spotify provider integration and fallback
- keyboard-aware tabs and focus repair
- plain-language product and interface copy
- product overview and trust narrative

### Planned

- real accounts and identity
- persistent Spaces
- structured memory service
- Goal Intelligence service
- live connectors
- model selection and orchestration
- shared Space permissions
- approved action execution
- production observability

## Near-term priorities

1. add production-domain smoke checks
2. enforce `/brief/` and `/brief-next/` parity
3. define asset cache-version rules and verify deployed content
4. mock Spotify controller readiness and fallback states
5. inventory legacy Brief assets before cleanup
6. define one release checklist and required-check set
7. complete a broader accessibility audit
8. add documentation freshness checks
9. preserve clear demo and future-platform labels

## Documentation authority

Use this order:

1. current source and route registry
2. current tests and workflow results
3. `docs/2026-08-05-repository-reconciliation.md`
4. this file
5. supporting standards
6. dated historical concepts
