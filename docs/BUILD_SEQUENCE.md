# CMX db.cmxchat.com Build Sequence

This file records the approved order for the current static-to-backend project.

## 1. Central Route Registry

Status: Complete

- Maintain all route names, descriptions, categories, statuses, visibility rules and Directory inclusion in `assets/cmx-routes.json`.
- Use `assets/cmx-route-registry.js` as the shared browser loader.
- The Operations Directory renders from the registry.
- The Build Lab route table renders from the registry.
- New pages and route changes should update the registry first.

## 2. Architecture & Learning Center

Status: Active build

Maintain `/architecture/` as the central technical map and practical learning center for the CMX restricted node platform.

It should serve two audiences without forcing either through unnecessary material:

- Technical readers receive a fast architecture map, technology layers, delivery flow and decision guide.
- Learning readers can open expandable examples explaining how HTML, JavaScript, FastAPI, Python, PostgreSQL, AI, Linux, Docker, Cloudflare and controlled MCP workflows connect.

The lessons should use realistic CMX projects and outcomes instead of becoming a generic programming course.

## 3. Shared Blue Design System

Status: Next

Centralize the root terminal's blue interface tokens, panels, buttons, badges, window bars and responsive behavior, then apply them gradually across approved pages.

## 4. Changelog

Status: Planned

Create a readable project change history showing dates, affected pages, decisions and meaningful implementation notes.

## Deferred: Operator Handbook

No handbook page is currently approved. Operating instructions can remain inside the Build Lab, repository documentation and relevant architecture sections until the project becomes complex enough to justify a separate handbook.
