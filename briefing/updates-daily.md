# `/updates` Daily Source

Status: template
Target page: `/updates/`
Runtime notes: `assets/updates-notes.js`

## Purpose

Maintain a concise operator log of meaningful CMX Restricted Node changes. This file is the readable source for the daily platform note. The live page still renders from the existing updates JavaScript assets.

## Include

- What changed
- Why it changed
- Current status: planned, in progress, complete, paused, or blocked
- Files or routes affected
- Important validation results
- Known limitations
- Next practical step

## Exclude

- Private relationship material
- Personal health information
- Passwords, tokens, secrets, screenshots, or credentials
- Client-confidential information
- Claims that planned backend, AI, MCP, database, sandbox, or deployment features are already live

## Daily note format

- Timestamp
- Status
- Short title
- Two to six factual lines
- Optional internal route links
- Relevant tags
- Pinned only when the note remains important beyond the current day

## Publishing steps

1. Review recent repository changes and the current platform state.
2. Write only changes that actually occurred.
3. Update `assets/updates-notes.js` using its existing schema.
4. Keep newest notes first.
5. Verify `/updates/` renders after the change.
6. Report anything that could not be verified.
