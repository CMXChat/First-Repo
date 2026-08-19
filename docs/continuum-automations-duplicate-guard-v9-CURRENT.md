# Continuum Automations Duplicate Guard v9 - CURRENT

Date: 2026-08-19
Status: Accepted focused Lab UX rule over the existing v5 Automation model. Repeated Actions remain valid. Production execution remains off.

# Problem

A workflow can legitimately contain the same capability more than once, but several generic rows such as:

`Send email`

`Send email`

`Send email`

look accidental and make the ordered flow difficult to understand.

Blocking repeated capabilities would be wrong. A workflow may need separate emails for different people, different stages, different instructions or deliberate follow-up.

# Accepted rule

> **Same capability is allowed. Accidental repetition should be visible.**

The Lab now handles this in three layers.

## 1. Picker awareness

When adding an inline Action, the Action Picker shows how many instances of that capability already exist in the current flow.

Examples:

`1 already in flow`

`2 already in flow`

The blank compatibility-editor placeholder `Notify a person` at the start of a new Draft is excluded from this count because the underlying editor discards it when a real first Action is added.

Replacing an existing Action does not trigger the add-another warning.

## 2. Soft confirmation

Selecting a capability that is already present asks:

`Add another Send email?`

The user may cancel or choose `Add another`.

This is a warning, not a prohibition.

The explanation makes clear that repetition can be correct when the new step serves a different person, stage or instruction.

## 3. Exact configured duplicate cue

When two configured inline Actions normalize to the same:

- capability type;
- target;
- instruction;

the later step shows a compact `Possible duplicate` warning and identifies the earlier DO step it matches.

The user can keep both. No automatic deletion or merge occurs.

# Human labels

Configured communication Actions should stop looking generic where the target is known.

Examples:

`Send email` + target `Hassan` → `Email Hassan`

`Notify a person` + target `Primary contact` → `Notify Primary contact`

The descriptive label is presentation only. It does not change the typed Action capability or stored target reference.

The label is also projected into the current live Flow Preview and v5 Ordered Sequence after those layers finish rendering.

# Render order

The v5 ordered-flow layer rebuilds three animation frames after editor changes.

The v9 presentation pass deliberately runs one frame later so its descriptive labels and duplicate cues survive the v5 redraw instead of briefly appearing and reverting to generic labels.

# Accessibility / mobile

The duplicate confirmation is a focused modal on desktop and bottom sheet on phone.

It supports:

- focus moving into the warning;
- Escape to cancel;
- backdrop tap to cancel;
- focus return when cancelled;
- safe-area padding on phone;
- reduced-motion rules.

The underlying Action Picker is hidden from the accessibility tree while the duplicate warning is active and restored when the warning closes.

# Boundaries

V9 does not add:

- provider execution;
- Runtime;
- a new Automation format;
- a new Action type;
- server mutation;
- model calls;
- automatic deduplication;
- authority changes.

The canonical workflow model remains:

`Trigger → pre-action Conditions → Action → Condition/Wait → Action → Finish`

The duplicate guard is authoring UX only.

# Files

- `assets/lab/lab-automations-duplicate-guard-v9.js`
- `assets/lab/lab-automations-duplicate-guard-v9.css`
- `tests/continuum-automations-duplicate-guard-v9.test.js`
- `.github/workflows/automations-v7-operations-validation.yml`

Browser marker:

`data-lab-automations-duplicate-guard="v9"`

# Future protected application

The protected React application should keep the same semantic rule:

- repeated capability types are valid;
- typed preflight may warn about suspicious exact duplicates;
- warnings remain distinguishable from hard blockers;
- identical-looking labels should become contextual where safe display information is available;
- backend truth remains typed Action IDs, capability types, target/resource references and immutable published versions.

A future Planner should receive the same typed duplicate/preflight information rather than silently removing repeated Actions on its own.