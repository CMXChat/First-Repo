# Continuum Knowledge, Memory & Time - CURRENT

Date: 2026-08-19
Status: Canonical product companion for `/doc/` and backend planning after the owner-authorized knowledge/time architecture discussion

Read with:

- `docs/continuum-product-CURRENT.md`
- `docs/checkin-context-handoff-CURRENT.md`
- `docs/checkin-directory-library-CURRENT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-KNOWLEDGE-IMPORT-INGESTION-BACKEND-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-KNOWLEDGE-GOVERNANCE-AND-MEMORY-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-TEMPORAL-AWARENESS-BACKEND-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-KNOWLEDGE-STATE-QUALITY-CONTRACT.md`

# Product decision

Continuum knowledge is broader than document upload.

The product direction is:

```text
anything the owner deliberately gives Continuum
→ capture exact source
→ understand with provenance
→ organize for review
→ propose conservative typed mappings
→ reconcile through normal protected domain services
→ make approved knowledge available to authorized AI/humans
```

Approved future inputs include:

- direct plain text;
- bulk text;
- multi-part conversational dumps;
- Markdown;
- JSON;
- AI context/handoff exports;
- many files in one ingestion session;
- PDFs/DOCX/spreadsheets through FileVersion extraction;
- images/scans through OCR/vision;
- native Continuum notes/content;
- approved provider/API/MCP resources;
- later conversational `remember this` through the same protected ingestion service.

# Default behavior

Current direction:

```text
analyze now
→ show proposed organization/changes
→ owner reviews
→ apply
```

Longer-term direction:

```text
selected low-risk obvious changes
→ may auto-apply only under explicit policy
```

No silent autonomous memory mutation is the starting point.

# Conservative mapping

Continuum should organize information aggressively for understanding and cautiously for permanent structure.

It may immediately group sources by topic, project, People, dates, tasks, decisions, preferences and conflicts.

Creating or changing permanent Directory/State/domain records remains a proposal until approved or later explicitly covered by a low-risk auto-apply policy.

# Privacy and scope

New knowledge is private to the owner by default.

Each source/knowledge item has an owner scope and may also belong to a narrower context such as Personal, Family, CMX, a client or a project.

Cross-scope use requires explicit applicable access.

AI privacy tiers are:

```text
Standard
Sensitive
Local-only
Never AI
```

External AI receives the minimum necessary authorized context for the task. A large model context window is not permission to send the whole Library.

# Corrections and conflicts

An authenticated direct owner correction normally becomes the preferred current understanding for owner-controlled knowledge while older evidence remains historical provenance.

Material conflicts remain visible.

Low-risk reconciliation may prefer stronger/newer evidence while preserving what disagreed.

Useful distinctions include:

```text
direct owner statement
verified/observed fact
sourced claim
inferred belief
corroborated belief
```

These are meanings, not one universal confidence number.

# Different kinds of knowledge

Continuum should strongly distinguish:

- facts;
- preferences;
- learned patterns;
- claims;
- observations/events;
- decisions;
- relationships;
- commitments/tasks;
- historical facts/events;
- derived interpretations;
- Current State.

Different classes can have different freshness, conflict and correction rules.

# Learning

Recurring behavior may produce suggested learned preferences first.

Example:

`You chose this briefing style 12 times. Save it as your default?`

Selected low-risk categories may later learn automatically only after explicit opt-in and inspectable/reversible policy exists.

# Source deletion and forgetting

Deleting a source and forgetting accepted knowledge are separate choices.

The product should support:

- delete source only;
- delete source + knowledge that depends only on it where safe;
- review affected knowledge first;
- later `forget this everywhere` with impact preview.

Knowledge independently confirmed elsewhere should not disappear blindly because one old source was removed.

# OCR / vision

An image or scan is one more ingestion source.

```text
exact image/FileVersion
→ OCR or vision extraction
→ derived text/layout/fields
→ provenance-backed candidates
→ review/reconciliation
→ search / Context Builder / approved knowledge
```

The image remains the preserved source. OCR/vision output remains derived and correctable.

# Real temporal awareness

Continuum needs a real backend clock, not model guesses.

Core rule:

> **Never ask the model to guess what the clock can prove.**

If the owner says `I am going to run for two minutes` and returns two seconds later, Continuum should know roughly two seconds elapsed.

If the owner returns three minutes later, Continuum should know roughly three minutes elapsed even when no AI process stayed alive during the gap.

Server/database time remains authoritative where consequence depends on time.

Store canonical instants in UTC while preserving local-time/timezone intent for human schedules and recurrence.

Time awareness covers:

- conversation gaps;
- elapsed durations;
- deadlines;
- due/overdue transitions;
- waits/retries;
- Check In timers;
- freshness/staleness;
- commitments;
- routines/patterns;
- Goals;
- Spaces briefings;
- Signals;
- provider reconciliation;
- time zones/DST;
- Control Center Now/Upcoming/History;
- simulation;
- historical truth and supersession.

Time alone may make something noteworthy.

Example:

```text
client promised payment Friday
→ Monday arrives
→ no stronger payment evidence exists
→ Continuum may suggest follow-up
```

Awareness/suggestion may happen without an explicit Automation. Actually sending or performing another consequential Action still requires the applicable policy, authority and Runtime capability.

# `/doc/` teaching

The owner explicitly reopened `/doc/` on 2026-08-19 to add these concepts.

Keep the eight-section reading path.

Do not add a giant ninth architecture section.

The human-facing additions belong primarily in:

- **Overview / Across Time** for real temporal awareness;
- **Information** for general ingestion, AI handoffs, OCR/vision and provenance;
- **Architecture** only where a compact backend truth statement helps.

Public teaching should stay concise:

1. Continuum can accept information in many forms, including text, bulk inputs, files, AI handoffs and image/document extraction.
2. It preserves source provenance and proposes what it believes should become durable knowledge.
3. New knowledge is private by default and AI sees only allowed context.
4. Continuum knows real elapsed time from backend timestamps instead of inferring time from chat turns.
5. General ingestion, OCR/vision integration and broad temporal behavior remain future architecture. Do not present them as production capabilities today.

# Backend release boundary

None of these decisions modify the already-reviewed Phase 2A migration.

Immediate backend sequence remains:

```text
Phase 2A migration/deployment
→ protected continuity.md acceptance proof
→ following knowledge/storage work
```

The knowledge/ingestion/temporal contracts define the direction after that boundary.
