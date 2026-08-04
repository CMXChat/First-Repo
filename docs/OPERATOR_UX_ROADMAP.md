# CMX Operator UX Roadmap

## Current completed slice

The first case-centered operator pass is implemented on `/osint`:

- authenticated same-origin DNS gateway is preferred
- direct Google Public DNS is limited to a labeled static fallback
- stale DNS requests are cancelled and cannot replace a newer entity
- DNS results render progressively with resolver provenance
- active protected identity and local-only mode are visible
- an operator can select an active persistent case
- current OSINT sessions save atomically through the case import transaction
- domain snapshots cannot be saved while DNS collection is incomplete
- `/cases?case=<id>` opens the exact selected case
- desktop and mobile regressions cover the complete loop

## Next slice: Cases information architecture

### Navigation

Replace the long undifferentiated detail column with case-level views:

1. Overview
2. Timeline
3. Entities
4. Sources
5. Evidence
6. Relationships
7. Notes
8. Audit

The current case remains selected while moving between views. Views must work without client-side persistence of case contents.

### Overview

Show the information needed to resume work:

- status and urgency
- authorization basis
- retention review date
- last meaningful activity
- record totals
- recent observations and sources
- unverified or conflicting records
- next-action note
- import and export controls

### Timeline

Combine observations, sources, queries, evidence registrations, notes and lifecycle actions into one chronological view. Each row must state its record type and source. Timeline ordering must not imply causation.

### Entity workspace

Add:

- entity-type and confidence filters
- normalized-value search
- duplicate review
- direct links back into supported CMX tools
- relationship creation between entities in the same case
- verified, inferred, conflicting and ruled-out analyst states

### Mobile behavior

On narrow screens:

- use stacked record cards instead of minimum-width tables
- keep the case switcher and save state visible without covering content
- place destructive actions in a separate lifecycle area
- require explicit confirmation for archive, restore and purge

### Visual system

- compact operator header after first use
- rectangular action buttons
- pills reserved for status and filters
- comfortable and compact density modes
- local inline SVG icon set
- persistent banners for disconnected, partial, unsaved and failed states
- no decorative investigation-board effects

## Later slices

1. Apply active-case context to Phone, Search, Metadata and Missing Person.
2. Add direct capture of sources and external findings.
3. Add server-side RDAP, ASN, BGP, RPKI, TLS, Certificate Transparency and HTTP adapters.
4. Add isolated deep metadata and OCR workers.
5. Add evidence manifests, screenshots, hashes and custody notes.
6. Add restrained relationship and comparison views.

## Safety and release gate

Every slice must preserve:

- Cloudflare Access identity enforcement
- owner-scoped records
- explicit save actions
- no automatic browser persistence of research contents
- safe text rendering
- provider disclosure
- bounded imports and uploads
- desktop and mobile browser regressions
- protected staging before production promotion
