# Phase 2 Validation: Cases Operator Workspace

Validated implementation head: `dd770f005bb6071f04985e23ec8b984e3c3b1d8e`.

## Completed operator workflow

The persistent `/cases` workspace now provides eight case-level views:

1. Overview
2. Timeline
3. Entities
4. Sources
5. Evidence
6. Relationships
7. Notes
8. Audit

The redesign is a progressive browser layer over the existing Cases API and data model. It preserves the proven creation, update, archive, export, import, note, lifecycle and owner-scoping behavior.

## Overview

The Overview view now surfaces:

- case status and urgency
- authorization basis and summary
- retention review date
- record totals
- recent chronological activity
- automated review prompts for low-confidence records, duplicates, missing sources, missing notes, retention review and registration-only evidence
- explicit import and export controls

Automated prompts are review aids. They do not establish identity, truth, causation or investigative conclusions.

## Unified timeline

The Timeline view combines:

- observations
- sources
- queries
- evidence registrations
- relationships
- analyst notes
- audit events

Each row states its record type, timestamp basis and available context. Timeline ordering is chronological display only and does not imply causation or a verified real-world sequence.

## Entity workspace

The Entities view adds:

- normalized-value search
- entity-type filtering
- confidence filtering
- duplicate review
- analyst-state labels
- safe copy actions
- direct pivots into supported CMX tools

Entity state labels remain conservative. Confirmed records display as verified, weak or unrated records display as unverified, and other records display as inferred unless an explicit analyst state exists.

## Relationships

Operators can create same-case relationships using the existing protected API. The interface requires:

- two different entities
- a normalized relationship type
- confidence
- an optional analyst note

Relationship cards render readable entity labels, the analyst note, confidence and creation time. They do not hide the underlying persistent IDs from the exported case record.

## Audit and lifecycle

The Audit view loads the case-scoped redacted audit stream. Audit details describe operational actions and counts without copying research content into the audit record. Destructive lifecycle actions remain separated under `/cases/lifecycle` with explicit confirmation requirements.

## Responsive behavior

The mobile workspace now uses:

- stacked case and detail sections
- wrapped case-view controls
- non-sticky case navigation
- stable import and relationship controls
- disabled smooth scrolling on the Cases route
- compact record cards without minimum-width tables

A critical responsive style is installed synchronously before the larger operator stylesheet to prevent slow-load stacking races.

## Density and persistence

The operator can switch between comfortable and compact density. Only the density preference is stored in session storage. Case contents, research identifiers, notes and evidence data are not stored in browser persistence by the operator layer.

## Validation results

All workflow groups passed on the validated implementation head:

- OSINT platform source and syntax policy
- unsafe-rendering and browser-persistence checks
- privacy and secret scans
- static, navigation and terminal-theme checks
- backend, lifecycle and write-security tests
- PostgreSQL 18 migrations and API integration
- container and Compose validation
- full Chromium desktop platform suite
- full Chromium mobile platform suite

The browser suite specifically validates the eight Cases views, unified timeline, entity filtering, analyst states, relationship creation and notes, audit loading, case creation drawer, session imports, adversarial text rendering and static read-only behavior.

## Release state

This validation does not approve production deployment. PR #28 must remain draft until protected staging verifies Cloudflare Access identity enforcement, Tunnel-only origin access, response headers, structured logs, backup recovery and rollback procedures.
