# Crystal Briefing Blueprint

## Purpose

The Crystal briefing is a private, interactive relationship-and-life briefing for Jay and Crystal. It combines personal updates, relationship repair, music, creative ideas, career progress, fitness accountability, and a concise explanation of whatever Jay is building.

It must remain reusable even if the live `/crystal/` route is later deleted.

## Identity

The Crystal format should feel:

- Intimate without becoming invasive
- Honest without becoming a courtroom
- Playful without becoming childish
- Emotional without becoming exhausting
- Interactive without becoming cluttered
- Short enough that Crystal genuinely wants to read it
- Visually polished and clearly different from a generic dashboard

The page belongs to both Jay and Crystal. It should feel like a shared space, not a report written about one person for the other.

## Core Sections

1. A strong daily title and one-sentence theme
2. A short quick read
3. An uplifting daily song that attempts autoplay after access is granted
4. Jay's honest day update
5. Crystal's personal corner
6. A fair relationship checkpoint
7. What they are building together
8. Career and money direction when relevant
9. Fitness accountability for both people
10. One playful inside joke or private ritual
11. A short tomorrow plan
12. Two or three easy questions that shape the next edition

## Content Rules

- Use only personal details Jay or Crystal knowingly supplied or approved.
- Do not publish private usernames, screenshots, message contents, or surveillance-style logs.
- Summarize conversations by relevance, not by transcript.
- Separate facts from fears, interpretations, and unresolved concerns.
- Do not shame either person or declare a winner.
- Do not use self-abusive language as the final apology copy.
- Convert guilt into accountability, repair, and specific next actions.
- Keep sexual references private, mutual, adult, and tasteful.
- Preserve their exact inside jokes when requested, including `mean and stinky`.

## Relationship Voice

The relationship section should include:

- What happened
- What each person may need
- One fair practical rule
- One appreciation
- One small next step

Avoid diagnosing, blaming, taking sides, or pressuring Crystal to comfort Jay. Jay's apologies should acknowledge the harm and emphasize consistent action.

## Product Explanation Pattern

When explaining Jay's projects to Crystal:

- Lead with the human outcome
- Avoid a wall of technical terminology
- Explain what it could do in daily life
- Show why Crystal's taste and ideas matter
- Invite one simple piece of feedback

Example:

> Imagine opening one private page every morning where the right music starts, the important things are already organized, and the tools you approved work together to help you plan the day.

## Music Pattern

- Choose one uplifting, comforting, romantic, or motivating song each day.
- The song should fit the emotional temperature without turning into a lecture.
- Attempt autoplay only after the password interaction.
- Keep a visible play and pause fallback because browsers may block sound.
- Keep Spotify as the external fallback.
- Avoid songs that intensify conflict, despair, jealousy, or guilt on already difficult days.

## Interaction Pattern

Use a small number of satisfying interactions, such as:

- Play or pause the daily song
- Pick tomorrow's feature
- Reveal an inside joke
- Choose a shared activity
- Vote on a product idea
- Mark a resume or workout goal complete
- Answer one relationship question

The page should never feel like homework.

## Visual Preservation

When updating a daily edition:

- Preserve the current layout unless Jay explicitly asks for a redesign.
- Update data and small interaction copy first.
- Keep the Jay light-blue, Crystal pink, and shared white distinction.
- Keep the dark premium interface and restrained motion.
- Do not add oversized paragraphs or too many cards.
- Keep mobile reading comfortable.

## Daily Intake

Useful questions include:

- What changed today?
- What was one positive moment?
- What should Crystal understand about Jay's work?
- What should Jay understand about Crystal's day?
- Did either person train?
- What is tomorrow's most important task?
- What music mood should tomorrow have?
- What is one thing they appreciate about each other?

Rotate questions and do not repeatedly ask for information already supplied.

## Daily Update Architecture

Preferred long-term structure:

- `/crystal/` gated route
- Reusable briefing shell
- Separate daily data file or API response
- Separate Crystal profile and preference file
- Daily uplifting media selection
- Approved connectors only
- FastAPI backend when authentication, saved answers, automation, or private data becomes real
- Versioned daily editions and a clear deletion/correction process

## Replication Principle

Preserve the format, emotional intelligence, interaction quality, music behavior, and privacy rules. Rebuild each day's content around what genuinely happened. The result should feel fresh, personal, useful, and easy to finish.