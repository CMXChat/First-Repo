# Continuum Private Preview — Immediate Frontend TODO

Last updated: 2026-08-21

This is a compact frontend execution list for the current proving surfaces. Detailed owner priorities live privately in `jay-app/docs/OWNER-TODO-CURRENT.md` and should not be copied into public product copy.

## Completed in this route checkpoint

- [x] Move the old OSINT/operations card launcher from `/directory/` to `/menu/`.
- [x] Reserve `/directory/` for the Continuum People/Contacts experience.
- [x] Reuse the existing Directory UI/server-proof integration rather than build a competing Directory page.
- [x] Keep `/lab/directory/` available as the current validation/proof route.
- [x] Give `/menu/` and `/directory/` the existing Black Prompt frontend deterrent while preserving backend auth as the real security boundary.
- [x] Update route registry and root terminal commands so `menu` and `directory` mean different things.
- [x] Add a route-graduation source contract and durable handoff.

## Next after backend reconciliation/API work settles

- [ ] Perform live Directory acceptance against the actually deployed stacked backend.
- [ ] Perform live Automations acceptance against the actually deployed stacked backend.
- [ ] Design the Email surface from the canonical backend API handbook, not from guessed browser behavior.
- [ ] Make fake/simulation email execution easy and repeatable.
- [ ] Make real manual email execution explicit, reviewable and receipt-driven.
- [ ] Show Runs, Attempts, provider outcome, ambiguity/reconciliation and Why in human language.
- [ ] Do not add frontend-only CC/BCC, arbitrary-recipient, attachment or unattended-send behavior before backend contracts exist.
- [ ] Review whether a wider Black Prompt sweep across private Lab routes is worth the regression cost.
- [ ] Decide later whether stable routes remain direct root routes or move under `/console/...`.

## Files / Notes / Library

- [ ] Treat Markdown/text Notes as first-class Continuum content.
- [ ] Build friendly Library/Files/Notes presentation over durable ContentAsset/Draft/Version backend truth.
- [ ] Keep binary attachments for the later FileAsset/FileVersion boundary.

## `/doc`

- [ ] Wait for the current backend work to reach a stable checkpoint.
- [ ] Then do one selective product-story update around Person identity, definition vs execution, Connections, Runtime and the consequence ladder.
- [ ] Keep private owner TODOs, PR details, endpoint tables and credentials out of `/doc`.
