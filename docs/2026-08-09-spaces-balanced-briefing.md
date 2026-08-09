# Spaces balanced briefing composition

Date: 2026-08-09  
Status: implementation review  
Primary route: `/spaces/`

## Purpose

This refinement keeps the visual range that makes Spaces feel like a real product while reducing the places where a phone or long briefing asks the user to process too much at once. The goal is easier navigation and clearer control without shrinking the product into a sparse set of cards.

## Today

Desktop keeps Weather, Useful numbers, the recommendation, and Flow visible together. The wider screen has enough room to make that overview useful, and hiding most of it behind a single active card would make the briefing feel smaller than it is.

On phones, Weather, Numbers, and Flow use a compact focus control. One dense module is shown at a time while the recommendation remains available. A user can change the Brief style to Full review if they prefer to keep the main Today sections open.

## Explore

Explore keeps the selected category fully rendered with its real charts, calendars, boards, lists, or other scenario-specific interface. The remaining categories appear as compact previews with a short description and an Open action.

This preserves the rich Family, Business partner, Accountant and client, Trainer, Relationship, Team, and Personal modules while avoiding a page where every category is expanded at the same time.

## Everything

Everything remains the complete briefing. It keeps all nine core sections and the existing jump navigation because its purpose is to provide the longer review. The shorter Today and Explore views already provide progressive disclosure, so the full view does not need another layer of hiding.

## Briefing settings

Today exposes one Briefing settings control. The local demo settings preview:

- scheduled opening and a preferred time;
- Focused or Full review style;
- approved calendar context;
- music on open;
- priority alert routing through the existing routing preview;
- people and sharing through the existing Spaces view;
- soundtrack selection through the existing music interface.

The settings stay local to the browser. They do not send messages, invitations, calendar changes, or private records. A connected product would require authenticated accounts, permission checks, recipient consent where relevant, delivery history, and clear controls for changing or stopping access.

## Writing and presentation standard

The interface should sound like a normal person explaining a useful product. Keep complete sentences where explanation is needed, preserve compact labels where the visual format calls for them, and avoid pitch-deck language, slogan stacks, ellipses, em dashes, repeated choppy sentences, and abstract terminology when simpler wording is clearer.

The visual rule is equally important: reduce density where screen size demands it, while keeping the distinctive calendars, financial views, weather treatment, project modules, household boards, charts, permissions, and other scenario-specific visuals that communicate what Spaces can become.

## Release checks

Before merging this refinement:

- verify desktop Today still shows the rich overview;
- verify phone Today can switch cleanly among Weather, Numbers, and Flow;
- verify Full review restores all main Today sections on phones;
- verify Explore keeps one rich category and compact previews for the rest;
- verify Family calendar and other scenario-specific renderers remain available;
- verify Briefing settings opens, persists local choices, and hands off to the existing routing, sharing, and soundtrack interfaces;
- verify Everything still contains all nine core sections;
- verify light and dark themes remain readable;
- verify no horizontal overflow on phone layouts;
- run the normal Spaces release, accessibility, browser, privacy, navigation, secret, and static checks.
