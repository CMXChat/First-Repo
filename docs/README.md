# CMX Documentation Index

Last reconciled: **August 6, 2026**  
Repository: `CMXChat/First-Repo`  
Verified code baseline: `0ec2eb2aa052c7d73a6fd9bd687754fb792401ec`

## Read this first

Current code, tests, workflows, route policy, and current operational documents take priority over older notes. Dated concept documents remain useful as decision history.

Use this order when starting Spaces work:

1. `docs/spaces-product-direction-2026-08-06.md`
2. `docs/2026-08-05-repository-reconciliation.md`
3. `docs/personal-os-release-safeguards.md`
4. `docs/brief-recovery-handoff.md`
5. `docs/cmx-brief-master-context.md`
6. `docs/brief-interface-validation.md`
7. `docs/brief-interface-failures.md`
8. Current source, tests, workflows, and `assets/cmx-routes.json`

## Current operational documents

| File | Purpose |
|---|---|
| `spaces-product-direction-2026-08-06.md` | Current product name, category, doctrine, input model, memory settings, and Cloudflare relationship. |
| `2026-08-05-repository-reconciliation.md` | Comparison between the August 4 notes and the August 5 repository. |
| `personal-os-release-safeguards.md` | Release gate, production smoke, accessibility, cache, parity, inventory, and documentation-freshness safeguards. The filename is retained for continuity. |
| `brief-recovery-handoff.md` | Safe continuity handoff for `/brief/`, `/brief-next/`, and `/doc/`. |
| `cmx-brief-master-context.md` | Product, architecture, trust, and roadmap context. |
| `brief-interface-validation.md` | Active validation contract for the shipping interface. |
| `brief-interface-failures.md` | Resolved failures, remaining risks, and known constraints. |
| `concepts/brief-program-status-and-roadmap-2026-08-05.md` | Dated snapshot from before the Spaces rename. |

## Naming contract

- The user-facing product name is **Spaces**.
- Describe it as a context-driven workspace, personal intelligence platform, or platform built around Spaces.
- Avoid AI OS, Personal OS, Life OS, Agent OS, and Intelligence OS in current user-facing copy.
- Older dated documents may preserve the former name as history.
- Legacy internal filenames, storage keys, test names, and workflow names can remain until a separate safe migration removes them.

## Current routes

- `/brief/`: public noindex Spaces Brief demo, light in the initial HTML, with manual dark mode.
- `/brief-next/`: public noindex staging and rollback copy, kept byte-for-byte aligned with `/brief/`.
- `/doc/`: public noindex Spaces product overview, light by default, without a password gate.

## Brief contract

- Every entry, reset, and Space switch returns to Today.
- `/brief/` and `/brief-next/` remain aligned unless a staging difference is documented.
- The Space selector must remain readable and operable in light and dark mode on desktop and mobile.
- The live topbar contains the soundtrack and theme controls.
- Product documentation remains available from entry and How it works.
- Scenario buttons use native button semantics with `aria-pressed`.
- Secondary text remains WCAG AA compliant.
- Spotify preparation never blocks the Brief.
- Provider limits and direct-tap fallback copy remain honest.

## Copy standard

- Write plain, direct, connected sentences.
- Keep labels, controls, metrics, and navigation concise.
- Avoid stacked slogan fragments and generated-sounding symmetry.
- Keep demonstrated, fictional, and planned capabilities clearly separated.
- Prefer final product wording in source files. A small compatibility adapter is acceptable when it protects a staged rename across dynamic legacy modules.

## Required safeguards

Do not remove or weaken:

- `Personal OS Production Smoke`, retained as a legacy internal workflow name
- `Personal OS Release Gate`, retained as a legacy internal workflow name
- Brief and Brief Next parity enforcement
- cache-version enforcement
- demo-versus-live boundary checks
- documentation freshness checks
- Spotify lifecycle tests
- desktop and mobile Chromium accessibility workflows
- active and legacy Brief asset inventory checks

## Historical records

Older Personal OS references describe the same project before the August 6, 2026 Spaces rename. Do not rewrite dated concept files to hide that decision history.

## Documentation rules

- Record a verified commit SHA in current operational documents.
- Recheck GitHub before describing an open branch, failure, or check as current.
- Treat static browser demos as demonstrations. They do not prove a backend, authentication layer, memory service, connector, or live private data pipeline exists.
- Update this index whenever a current document is added, superseded, or archived.
