# `/brief` Current Recovery and Simplification Status

Last updated: **August 5, 2026 at 1:58 PM ET**

## Read order

1. Read this file for the live checkpoint.
2. Read `docs/brief/IDEAS.md` for approved ideas, decisions, deferrals, and completed idea work.
3. Read `docs/brief/PHASE-1-WORKLOG.md` before editing Brief Next.
4. Read `docs/brief/DEMO-SIMPLIFICATION-STRATEGY.md` for the broader phased plan.
5. Read `docs/brief-recovery-handoff.md` only when legacy recovery context is needed.

## Live repository state

```text
Repository: CMXChat/First-Repo
Development branch: agent/brief-demo-v2
Development draft PR: #42
Staging publish PR: #43, merged
Staging publish commit on main: dff74d998c0e3c411909fa466ea680c3126ee55e
Staging route: https://db.cmxchat.com/brief-next/
Existing production route: https://db.cmxchat.com/brief/
Production /brief files changed by staging publish: no
```

The isolated Brief Next frontend is now present on `main`. The existing GitHub Pages workflow deploys the whole repository after a push to `main`, so merging PR #43 triggered the staging deployment.

Direct HTTP verification from the current assistant environment is still unresolved because the web fetch returns a cache miss and the local container cannot resolve the custom domain. Source publication to `main`, the deployment trigger, and the staging route files are verified. A browser review of the custom domain is the next live confirmation.

## Latest heading decision

The previous headings were still too large and looked more like promotional landing-page typography than an operating platform.

The current staging source uses these caps:

```text
Desktop entry H1: max 2.75rem
Desktop Today H1: max 3.25rem
Desktop view H1: max 2.5rem
Mobile entry H1: max 2rem
Mobile Today H1: max 2.2rem
Mobile view and explainer headings: max 2rem
```

The dedicated mobile browser test requires entry and Today headings to remain at or below 36px in the tested 390px viewport.

Status: **implemented, validated, and included in staging publish**

## Staging publish scope

PR #43 was created directly from `main` and included only:

- `brief-next/index.html`
- isolated `assets/brief-next/` files
- `/brief-next/` route registration
- Brief Next static tests
- Brief Next desktop and mobile browser tests
- the isolated Brief Next validation workflow

It did not include:

- changes to `brief/`
- changes to `assets/brief/`
- the legacy workspace restoration
- terminal or overlay changes
- Goal Intelligence work
- the stacked recovery branch

## Staging validation

```text
PR: #43
Publish source commit: d7f222b6736e0cdd4d37ab5dcf83aa472166e484
Merged main commit: dff74d998c0e3c411909fa466ea680c3126ee55e
Brief Next Validation run: 31032190532
Static job: 92395371330, passed
Browser job: 92395371574, passed
```

Additional repository checks passed:

- CMX Static Validation
- CMX Navigation Link Guard
- CMX Secret Scan
- CMX Terminal Theme Guard

The CMX Privacy Audit still reports the known unrelated `/doc` Black Prompt Gate mismatch. That failure is not caused by Brief Next and remains isolated in PR #38.

## Current staging experience

- five selectable contexts
- soundtrack selected by default
- read-aloud absent
- smaller platform-style headings
- Today, Workspace, Spaces, and How it works navigation
- strong weather and timing presentation
- compact changing stats
- memory versus regular-AI examples
- Relationship, Family, and Team Space examples
- concise privacy boundaries
- examples of data becoming a briefing, alarm, plan, preparation, automation, learning record, or approved action
- one Spotify provider iframe
- no terminal or command-line architecture

## Automation status

The legacy `Refresh Brief Concept` automation remains paused.

Do not restart it until:

- the staging interface is reviewed
- the final data-editing contract is documented
- the exact automation-editable files are selected
- tests protect those boundaries
- production `/brief/` cutover is approved

## Publishing distance

The reviewable staging route is now published from `main`.

Remaining before replacing `/brief/`:

1. User visual review of staging.
2. Focused visual corrections from that review.
3. Contrast, keyboard, focus, and accessibility review.
4. Common editing map and daily data contract.
5. Authorized preview audio and autoplay fallback.
6. Final cutover and rollback validation.

## Exact next action

1. Review `https://db.cmxchat.com/brief-next/` on desktop and mobile.
2. Record specific visual and content feedback.
3. Apply the next focused correction on `agent/brief-demo-v2`.
4. Publish approved staging corrections through a small clean PR to `main`.
5. Keep `/brief/` untouched until explicit cutover approval.
