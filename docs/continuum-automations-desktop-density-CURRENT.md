# Continuum Automations Desktop Density - CURRENT

Date: 2026-08-19
Status: Accepted desktop-only presentation refinement over Automations operations v7

# Purpose

The Automations editor had accumulated too much persistent chrome on laptop and desktop viewports. The global header, Draft title row, four-part status strip, stage rail, Live Flow column and fixed footer were all individually useful but together left too little vertical room for the active editor.

The accepted desktop rule is:

`compact controls → dominant editor workspace → useful side context`

Mobile remains governed by the existing mobile authoring layers and is intentionally excluded from this density pass.

# Desktop behavior

At widths of 980px and above:

- the global Continuum/Lab header is shorter while editing;
- the Draft title/save row is shorter;
- the DEFINITION / MODEL / STATE / EXECUTION strip is compressed into a thinner status row;
- the WHEN / IF / DO / WAIT / TEST stage rail is shorter;
- the editor starts closer to the stage rail;
- the main authoring column can use the available width instead of staying capped at the older desktop maximum;
- the Live Flow panel narrows and uses a tighter sticky viewport;
- flow nodes are denser;
- the fixed Back / Continue footer is slimmer;
- the editor reserves less bottom space for that footer.

At 1280px and above, the Live Flow column narrows slightly again so the active authoring surface receives more width.

# Boundary

This pass changes presentation only.

It does not change:

- workflow model v5;
- Automation data;
- Planner behavior;
- readiness rules;
- local lifecycle behavior;
- Runtime/provider execution;
- mobile layout semantics;
- backend contracts.

# Files

- `assets/lab/lab-automations-operations-v7-desktop-density.css`
- `tests/continuum-automations-desktop-density-v7.test.js`
- `lab/automations/index.html`
- `.github/workflows/automations-v7-operations-validation.yml`

The density stylesheet loads after the existing v7 polish stylesheet so it can override desktop proportions without rewriting the accepted authoring layers.

# Validation

The regression test verifies that:

- the density stylesheet loads last among the v7 CSS layers;
- the pass is scoped to desktop with `min-width:980px`;
- top chrome, status strip, stage rail, editor grid, Live Flow and footer all receive the intended compact desktop treatment;
- there is no max-width mobile override in the density stylesheet.

The GitHub workflow also renders an Automation editor at 1440×900 in addition to the existing dashboard and 390×844 mobile checks.

Do not claim CI green until an actual completed workflow run is observed.
