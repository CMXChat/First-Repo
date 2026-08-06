# CMX Restricted Node

`db.cmxchat.com` is the private operational and research subdomain for CMX. The current repository contains a static HTML, CSS, and JavaScript site served through GitHub Pages while the next platform architecture is being designed.

## Current state

The site is currently static. Existing pages run in the browser and no Python backend, database, AI service, MCP server, worker queue, authenticated connector layer, or production automation is active.

The current repository includes:

- A terminal-style root launcher
- A central route registry
- Browser-based research and metadata tools
- Internal planning and client routes
- A custom 404 page
- Static privacy and secret checks
- Build, backend, AI, architecture, and update planning pages
- The public noindex Spaces product demo and product overview

## Spaces product routes

- `/spaces/` is the canonical public noindex Spaces demo.
- `/doc/` is the public noindex Spaces product overview and current-versus-planned reference.
- `/brief/` is a legacy compatibility route that redirects old links and bookmarks to `/spaces/`.
- `/brief-next/` is the pre-migration rollback snapshot and does not define the active product surface.

The Brief is the focused daily experience inside a Space. Shared calendars, adaptive alarms, and voice remain planned capabilities with explicit permission, privacy, and user-control requirements. The static demo does not prove that those backend capabilities exist.

## Main planning pages

- `/build/` is the static operational control room. It currently reads the route registry and performs browser-observed route checks. Later it should display real application health, deployments, workers, logs, incidents, approvals, and rollback state.
- `/backend/` is the technical source of truth for API contracts, page connections, infrastructure, data models, permissions, security controls, and delivery phases.
- `/ai/` explains the planned AI control layer for normal-language development, approved site tools, MCP integrations, user-facing assistants, sandboxes, previews, staging, approvals, and automation.
- `/architecture/` is the technical learning and architecture reference.
- `/updates/` is the readable platform briefing, current status, and change log.

## Target architecture

The preferred direction is a Dockerized Python ASGI application on a protected Linux server. FastAPI is the preferred starting framework because it supports typed APIs, async services, Jinja templates, automatic API documentation, and the project's Python learning goals.

The framework decision remains reviewable. Any substitute must preserve the documented API contracts, access controls, testing, staging, deployment approval, and rollback requirements.

The planned request path is:

```text
Browser
  → Cloudflare Access
  → Cloudflare Tunnel
  → Python application
  → approved services and tools
  → PostgreSQL, private storage, GitHub, or approved integrations
```

GitHub remains the permanent source of truth. Development should occur in feature branches, deploy to protected previews or staging first, and reach production only after explicit approval.

## AI-assisted development goal

The long-term goal is to manage and extend the platform largely through normal-language instructions while keeping the AI inside strict operational boundaries.

A normal development request should follow this path:

1. Record the user's goal.
2. Classify the request and its risk.
3. Retrieve only approved handbook and repository context.
4. Present a versioned implementation plan.
5. Request scoped approval for protected actions.
6. Create a feature branch from an approved base commit.
7. Write a reviewable changeset.
8. Run fixed checks inside an isolated Docker sandbox.
9. Deploy a protected preview or staging revision.
10. Open a draft pull request.
11. Validate staging.
12. Request human production approval with rollback prepared.

The AI must never receive unrestricted shell access, sudo, the Docker host socket, production secrets, arbitrary code execution, direct writes to `main`, automatic merge authority, or direct production deployment authority.

## User-facing AI

Approved assistants may later:

- Answer questions using authorized page or workspace context
- Summarize permitted records, files, reports, and activity
- Generate drafts, checklists, research plans, and reports
- Invoke typed backend tools available to the current user
- Propose state-changing actions for confirmation
- Run approved recurring workflows with quotas, logs, and cancellation

Each assistant must have a defined purpose, audience, context scope, tool allowlist, retention policy, and confirmation requirements.

## Security principles

- Static browser gates are temporary deterrents, not real access control.
- Cloudflare Access and server-side authorization should protect private resources.
- Development, staging, and production must use separate credentials and data.
- Secrets remain in server-side environment variables or a secret manager.
- Every server operation uses typed input, an allowlisted capability, rate limits, and safe errors.
- Sensitive actions create audit events.
- Uploads are isolated, limited, scanned, and deleted according to retention rules.
- AI actions are versioned, scoped, attributable, and cancellable where possible.
- Production deployment requires a separate human approval and rollback path.

## Repository rules

- Use feature branches for meaningful changes.
- Keep `main` reviewable and production-oriented.
- Validate route registry changes.
- Run the Spaces route, browser, accessibility, Spotify, cache, inventory, and documentation safeguards before merge.
- Do not treat an empty GitHub Actions check list as a successful release.
- Do not commit credentials, tokens, private keys, or production configuration.
- Do not add arbitrary URL fetchers, command execution, or browser-stored sensitive data.
- Preserve existing active routes during backend migration unless a removal is explicitly approved.
- Keep `/brief/` available as a compatibility redirect while external references may still use it.
- Update `/updates/` when the platform direction, page responsibilities, or implementation state changes.

## Learning purpose

This project is also intended to provide practical experience with:

- Python and FastAPI
- HTML, CSS, and JavaScript
- APIs and typed data contracts
- Authentication and authorization
- Linux administration
- Git and GitHub workflows
- Docker and isolated environments
- PostgreSQL and migrations
- Cloudflare Access and Tunnel
- Logging, monitoring, backups, and rollback
- AI tools, MCP connectors, and safe automation

<!-- GitHub Pages deployment trigger: 2026-08-06T15:04:00-04:00 -->
