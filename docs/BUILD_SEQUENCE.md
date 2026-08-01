# CMX db.cmxchat.com Build Sequence

This file records the approved order for the current static-to-backend project.

## 1. Central Route Registry

Status: In progress

- Maintain all route names, descriptions, categories, statuses, visibility rules and Directory inclusion in `assets/cmx-routes.json`.
- Use `assets/cmx-route-registry.js` as the shared browser loader.
- The Operations Directory must render from the registry.
- The Build Lab route table must also render from the registry.
- New pages and route changes should update the registry first.

## 2. Operator Handbook

Status: Next

Create `/handbook/` as the main reference for routes, workflows, naming standards, GitHub branches, staging, approvals, deployment, Python, Linux, FastAPI and future MCP use.

## 3. Architecture Map

Status: Planned

Create `/architecture/` showing the approved path from GitHub through staging, production approval, Linux, Docker, FastAPI, PostgreSQL, Cloudflare Tunnel and Cloudflare Access.

## 4. Shared Blue Design System

Status: Planned

Centralize the root terminal's blue interface tokens, panels, buttons, badges, window bars and responsive behavior, then apply them gradually across approved pages.

## 5. Changelog and Readiness

Status: Planned

Create a readable project change history and a manually maintained deployment-readiness view without browser-only persistence or simulated backend controls.
