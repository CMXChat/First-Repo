# Check In Frontend Nightly Audit — 2026-08-17

Status: Source audit complete; real-device Phase 1 gate still has two open observations

This file records the frontend side of the professional end-of-night audit. Backend/release continuity and the full cross-repo audit are recorded in:

`CMXChat/jay-app/specs/003-server-checkin/NIGHTLY-CLOSEOUT-2026-08-17.md`

## Production Check In repairs

### Configurable Due Soon semantics

The browser had retained a fixed 12-hour `DUE SOON` threshold while the FastAPI service uses:

```text
min(12 hours, 20% of configured interval)
```

Fixed in:

- `assets/checkin/checkin-status-contract.js`
- `assets/checkin/checkin.js`

Relevant commits:

- `411fd2c5dc21125328587998f8e074633205180f`
- `95395f142602a383ea2e8eed02abe7139905c6c9`

### Protected-session expiry hardening

The existing UI cleared private state when the one-second render loop observed expiry. It now also uses:

- a dedicated expiry timeout;
- focus recheck;
- visibility recheck;
- rescheduling after authoritative server-time synchronization;
- the existing 401/private-state clearing boundary.

This improves robustness when browsers throttle background timers.

It does **not** replace the required real-device natural-expiry acceptance observation.

### Grace/timing presentation cleanup

The production UI now:

- uses configured grace duration for the grace progress ring;
- derives disabled-state interval copy from current configured timing;
- derives local simulation stage timing from current interval/grace;
- avoids the old timing-schema warning language implying exactly 72 hours is always required.

Current production policy remains 72+24.

### Regression tests

`tests/checkin-operations-smoke.test.js` now guards:

- configurable Due Soon thresholds;
- absence of the old hard 12-hour browser rule;
- dedicated session-expiry scheduling;
- focus/visibility rechecks;
- configurable grace progress;
- existing Samsung mobile Settings/status protections;
- no broad document-body observer regression.

Commit:

`05204efdafb09101f4a75db138f4a66fc05935c4`

## Focused Lab repairs

### Active File count

Root Library File totals now exclude archived FileAssets.

Commit:

`1af7753c62ee97c0d6ce4c37677e1dda6c95815c`

### Rich-content safe links

Lab authoring/link handling was inconsistent about plain HTTP.

The focused route now loads a final link-policy hardening layer and the Library editor source itself uses the same safe external-scheme rule.

Intended authoring link policy:

- `https:` external links;
- `mailto:`;
- internal `/path` links;
- `#anchor` links;
- reject/strip unsupported/insecure schemes.

Relevant commits:

- `5756f1b8d034b5628fd5baabf0d0606677d088df` — link policy layer;
- `7559c33347c362db5173e62c3e07dbc17bf4b836` — focused route wiring;
- `573b7d5198049579f6d98222110e2e537d5b32ad` — Library editor source hardening;
- `324f0d82a76b8243ab6741685b109830eddfe4a9` — validation contract.

Backend Content sanitization remains authoritative when real PostgreSQL ContentAssets exist.

## Samsung/performance review

The previously proven unresponsive-page bug came from broad DOM observation interacting with the frequently changing countdown.

The active production source reviewed tonight does not reintroduce a broad full-document/subtree MutationObserver.

Keep the established rule:

- targeted observers/events only;
- no full-document `characterData` watcher;
- no whole-page rescans every countdown tick;
- no observer self-mutation loops.

## Real-device items still open

Do not mark Phase 1 frontend fully complete until:

1. desktop locked Settings is visually/privacy audited;
2. an unlocked protected session is left alone until natural ~15-minute expiry and the private UI/state is observed clearing without pressing Lock Now.

Manual Lock Now has already been accepted separately.

## Bounded presentation debt

Some initial static HTML/fallback copy still reflects the current 72+24 policy before API-driven dynamic values take over.

Since production is currently 72+24, this is not a current correctness conflict. Avoid a risky broad late-night production markup rewrite. Continue moving toward server-driven timing presentation as the real backend-backed UI evolves.

## Lab freeze direction

The focused Lab has accumulated many incremental runtime/CSS layers because it served as a fast product-design environment.

Do not keep growing compatibility shims indefinitely.

Once the remaining Phase 1 gate is closed, prioritize the real PostgreSQL `continuity.md` / ContentAsset / ContentDraft / ContentVersion / LibraryFolder slice and progressively replace Lab persistence with protected backend APIs.

## Production safety tonight

No production Check In mutation was performed for this audit.

No check in, policy update, pause/resume, deadline override, reconciliation, provider execution, production database migration, or backend deployment was intentionally performed.
