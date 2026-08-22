# Continuum cross-surface source truth — CURRENT

Date: 2026-08-22

Status: frontend proving-layer snapshot. This document and the shared source-truth UI describe current validated source; they do not deploy the backend and are not an operational health monitor.

## Why this exists

The canonical Continuum surfaces had drifted behind the actual GitHub/backend work. `/control/` still presented an old sample-only story, `/library/` still said no protected Library API existed, and several product surfaces still used Lab-era wording even though the backend stack now contains validated implementations for those domains.

The correction is to distinguish four different facts instead of flattening them:

- **LIVE** — actually deployed production behavior;
- **SOURCE BUILT / STACKED** — implemented and validated in GitHub source but not production-deployed;
- **PROVING / PREVIEW** — current static/browser-facing product surface;
- **PENDING** — merge, migration, deployment or later capability still required.

A page must never turn SOURCE BUILT into a production-live claim.

## Backend checkpoint represented by this snapshot

Repository: `CMXChat/jay-app`

Draft PR: `#24` — Durable Check In trigger consumption foundation

Head: `753e55ebf7ef00d3814c5474552d88b90b3adc8c`

Migration head: `c0d1e2f3a4b5`

PR #24 T001–T006 are complete. Current documented validation includes:

- 170 backend tests passing;
- 89% coverage;
- focused trigger-consumption regression coverage;
- migration round-trip/current validation;
- mypy and ty passing;
- PR-owned Python files Ruff/format clean;
- OpenAPI/generated-client and frontend TypeScript consistency passing;
- explicit zero-SMTP / zero non-fake-provider assertions for unattended trigger consumption.

The unattended trigger path remains **fake only**. It rechecks exact current Authority and Incident truth and delegates through the existing frozen Runtime. It is separately invokable backend work, not a scheduler, cron service or generic trigger platform.

Real SMTP remains a separate **direct manual-owner-only** capability.

## Production boundary

Production remains on the older documented Phase 1 boundary.

The stacked Directory, Library, Automation, Runtime, Email, reconciliation, Authority and trigger-consumption work is **not** made production-live by tests, this frontend projection, or the existence of PR #24.

No production migration or backend deployment is performed by this frontend work.

## Surface truth

### `/control/`

Control becomes the best high-level build-state surface while retaining its sample future operational rows.

Its top status now communicates:

- Check In is live;
- the broader backend source stack is validated;
- deployment is the next boundary;
- exact Authority + fake-only triggered Runtime has been proven in source.

Sample attention/waiting/activity content remains clearly a sample operational preview rather than being relabeled as real production activity.

### `/directory/`

Truth shown:

- stable Person IDs/lifecycle are implemented;
- email ContactMethod normalization/lifecycle/conflict behavior is implemented;
- the canonical frontend has a protected backend lane;
- Organizations, Groups and richer relationship concepts remain preview concepts;
- the stacked backend is not production-deployed.

### `/library/`

Truth shown:

- the backend ContentAsset → mutable ContentDraft → immutable ContentVersion model exists in stacked source;
- exact version references and revision/conflict semantics exist;
- the current static Library workspace still uses browser-local preview data;
- binary object storage remains future deployment/platform work.

The page must no longer imply that no protected Library backend exists at all.

### `/automations/`

Truth shown:

- protected Automation Draft, typed preflight, Review and immutable Publish exist;
- Runtime Runs, Attempts, Why and cancellation exist;
- durable TriggerOccurrence / TriggerConsumption / append-only attempts, leases, recovery and replay hardening exist in PR #24;
- unattended exact-Authority execution is fake only;
- production execution remains off.

This source-truth layer is intentionally independent of the open Automation workspace-layout PR. It should survive that visual redesign without becoming the builder itself.

### `/email/`

Truth shown:

- Person/ContactMethod → Connection/SenderIdentity → ContentVersion → AutomationVersion → Runtime receipt is implemented in stacked source;
- provider reconciliation exists and never resends merely because evidence is recorded;
- fake mode is the preferred proof path;
- bounded real SMTP remains direct manual owner only;
- unattended Authority does not gain real SMTP;
- the full stack is not yet production-deployed.

## Shared UI behavior

`assets/continuum-source-truth-v1.js` owns the common source-truth snapshot and per-domain copy.

`assets/continuum-source-truth-v1.css` owns the compact header badge and detail dialog.

The badge says `NOT DEPLOYED` deliberately. Opening it shows domain facts plus the exact backend checkpoint and production boundary.

The shared script also converges stale `/lab/*` links to current canonical routes on the supported surfaces.

This is a static source snapshot, not a live GitHub API reader. Update it deliberately when the backend checkpoint or production boundary changes.

## Supported canonical surfaces

- `/control/`
- `/directory/`
- `/library/`
- `/automations/`
- `/email/`

Do not add this layer to `/checkin/` merely to make the shell visually uniform. Check In has a different production-live truth boundary.

Do not add it to `/spaces/` until Spaces needs the same backend-source projection.

## Safety / authority rule

This UI is explanatory only.

It cannot:

- grant Authority;
- determine eligibility;
- claim trigger consumption;
- create a Runtime Run;
- invoke a provider;
- infer that a branch is deployed;
- turn a source-level proof into production truth.

Protected backend services remain authoritative for real state and effects.

## Related open frontend work

At the time of this snapshot:

- the `/doc/` vision refresh is separate frontend work;
- the `/automations/` focused workspace redesign is separate frontend work.

Keep this cross-surface truth projection narrow so those visual/product changes can merge independently.

## Update rule

Whenever the backend crosses a real release boundary, update these together:

1. the backend CURRENT integration handbook;
2. this CURRENT source-truth document;
3. the `SNAPSHOT` and relevant domain facts in `assets/continuum-source-truth-v1.js`;
4. focused/browser validation;
5. only then the visible production/proving labels.

Never update the visible status first and hope deployment catches up later.
