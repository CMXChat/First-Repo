# Continuum Standalone Directory Lab - CURRENT

Date: 2026-08-19
Status: Standalone Directory product prototype implemented at `/lab/directory/`. Browser-local Lab data only. Protected backend Directory services remain pending.

Route:

`https://db.cmxchat.com/lab/directory/`

Read with:

- `docs/continuum-directory-master-plan-CURRENT.md`
- `docs/continuum-shared-app-shell-CURRENT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-DIRECTORY-PLATFORM-PLAN.md`

# Decision

Directory now has its own clean product boundary instead of requiring the broad `/lab/` Check In-derived compatibility workspace.

The broad `/lab/` route remains available as legacy/compatibility scaffolding for experiments that still depend on its snapshot-loader stack. It is not the preferred Directory destination going forward.

The preferred Lab Directory destination is now:

`/lab/directory/`

Long-term production graduation remains:

`/directory/`

only after the real protected frontend/backend boundary is ready.

# Why this route exists

Directory is Continuum's identity and relationship layer.

The standalone surface should answer:

```text
who is this person or organization?
how can they be contacted?
which methods are currently usable in the sample model?
which organizations, labels, groups and explicit relationships connect them?
which local Automation Drafts reference them?
are there exact duplicate signals?
which People resolve from a saved Group?
what changed recently?
```

The product rule remains:

`Directory knows who. Library knows what. Automations define what should happen. Runtime records what actually happened.`

# Current files

- `lab/directory/index.html`
- `assets/lab/directory-theme-init.js`
- `assets/lab/directory-app-v1.css`
- `assets/lab/directory-app-v1.js`
- `tests/continuum-directory-standalone-v1.test.js`
- `.github/workflows/directory-lab-validation.yml`

The route does not load the legacy Check In snapshot loader.

# Shared data compatibility

The standalone prototype deliberately continues to use the existing browser-local sample store:

`cmx-lab-crm-v1`

This lets the old broad Lab Directory v2 and the new standalone route see compatible sample identity data during migration.

The standalone app normalizes compatibility fields such as:

- `orgId` into `organizationIds` where needed;
- `tags` into descriptive Labels;
- scalar email/phone into sample `contactMethods` where richer data is absent;
- lifecycle/status compatibility;
- missing Group sample data.

This is migration compatibility only. Production must use typed server models/services.

Directory-specific UI state uses:

`continuum-directory-ui-v1`

Theme choice uses:

`continuum-directory-theme-v1`

# V1 product surface

The standalone Directory includes:

- People;
- Organizations;
- Groups/saved audiences;
- local search;
- useful saved-style views;
- list → profile navigation;
- three-column desktop presentation;
- dedicated mobile list → detail behavior;
- Overview / Relationships / Activity / Automations tabs where relevant;
- ContactMethod/readiness presentation;
- multiple Organization membership compatibility;
- descriptive Labels;
- explicit Person relationship presentation;
- Group resolution from Person / Organization / Label selectors;
- unique-Person resolution before channel readiness;
- exact email/normalized-phone duplicate signals;
- local Automation usage projection;
- local-only create/edit for basic Person/Organization/Group fields;
- shared Continuum app-switching shell direction;
- light and rich-black dark themes;
- a global `Cmd/Ctrl + K` navigation palette.

# Identity and authority boundary

Relationship metadata never grants authority.

Examples such as:

- family;
- lawyer;
- doctor;
- emergency contact;
- trusted;
- business partner;

remain descriptive Directory context unless a separate protected authority policy explicitly grants a role/capability.

The UI surfaces this rule directly.

# Group / audience semantics

Current Group selectors remain:

`Person | Organization | Label`

Resolution direction:

`selectors → unique Person IDs → contact readiness`

Nested Groups remain deferred.

Browser resolution is preview behavior only. Production requires the canonical protected audience resolver described by the backend Directory plan.

# Duplicate behavior

V1 only warns on strong local sample signals:

- exact normalized email;
- exact normalized phone.

It does not auto-merge.

Production duplicate suggestion/merge remains a separate high-impact backend capability with explicit authorization, provenance preservation and historical-reference safety.

# Local create/edit boundary

The standalone route can create or edit basic sample records in browser localStorage.

This is intentionally limited Lab behavior. It does not imply:

- production Directory persistence;
- server validation;
- Audit authority;
- protected import/export;
- automatic trusted-person roles;
- real audience readiness;
- provider identity verification.

Group creation starts with an empty selector definition in this first isolated version. The richer legacy Lab still contains more experimental selector/editor behavior while a clean dedicated Group editor is designed later.

# AI setup preview

`Plan changes` demonstrates the accepted future direction:

`natural-language intent → typed Change Plan → deterministic preflight → review → protected domain services`

The current preview is fixed/local presentation logic.

It performs:

- no model call;
- no arbitrary text interpretation;
- no mutation;
- no authority change;
- no Automation publication;
- no backend request.

The preview exists to teach the workflow and preserve the product contract before real Planner services exist.

# Shared shell integration

The standalone route follows the accepted shared-shell rule:

`shared shell owns app switching / environment / global command / appearance`

`Directory owns its people / organization / group workspace`

The route includes the current five high-frequency Lab destinations on mobile:

`Control | Check In | Directory | Automation | Spaces`

The desktop rail uses the same destination model while keeping Directory's own workspace independent from Control Center presentation.

Control Center now routes its visible Directory affordances toward `/lab/directory/` through the temporary Lab convergence bootstrap. The real production shell should replace this static bridging through the application router later.

# Mobile contract

Phone behavior is first-class:

- no compressed three-column desktop grid;
- type switcher remains usable;
- search uses mobile-safe input sizing;
- list opens a dedicated profile view;
- explicit `Back to Directory` control;
- profile tabs scroll horizontally;
- facts stack;
- dialogs become bottom-sheet style surfaces;
- global app switching stays available in the bottom navigation;
- safe-area inset is respected.

# Truth boundary

Do not claim any of the following from this route:

- protected production Directory persistence;
- authoritative contact verification/readiness;
- canonical server audience resolution;
- trusted-person authority;
- production relationship authority;
- production Activity/Audit;
- protected duplicate merge;
- production AI Directory mutation;
- Runtime recipient history.

The backend plan remains canonical for those services.

# Backend alignment

This frontend migration does not change the backend release boundary.

Production remains on the previously documented order:

1. complete the already-reviewed Phase 2A production boundary and `continuity.md` proof;
2. then introduce bounded Directory backend slices beginning with Person / Organization / membership / ContactMethod;
3. continue through Labels, Groups, canonical audience resolution and protected Directory APIs.

Do not add Directory schema changes to the already-reviewed Phase 2A migration merely because the standalone frontend route exists.

# Next Directory product work

Do not immediately turn Directory into a generic CRM suite.

The strongest next frontend work after this V1 settles is:

1. refine the standalone Group selector editor without reintroducing broad Lab coupling;
2. add explicit Person relationship editing with clear no-authority semantics;
3. improve duplicate-review presentation while retaining review-first behavior;
4. add clean staged import UX only when it can reflect the eventual backend staging model;
5. connect the surface to real protected APIs incrementally after backend Directory slices exist;
6. eventually graduate the accepted experience to `/directory/` inside the real shared application shell.
