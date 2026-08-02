# Jay + Crystal `/news` Briefing Blueprint

## Canonical Route

The live Jay + Crystal shared briefing belongs at `/news/`.

The old `/crystal/` route should only redirect to `/news/` and must never become a separate competing version.

## Purpose

The Jay + Crystal `/news` briefing is a private, interactive shared daily page for Jay and Crystal. It combines personal updates, relationship repair, uplifting music, creative ideas, career progress, fitness accountability, useful current information, and a concise explanation of whatever Jay is building.

This blueprint must remain reusable even if the live `/news/` route is later rebuilt or deleted.

## Preserved Layout

The protected layout copy is stored at:

`templates/jay-crystal-news-layout.html`

Treat the live visual shell and its preserved template as protected design assets.

## Identity

The format should feel:

- Intimate without becoming invasive
- Honest without becoming a courtroom
- Playful without becoming childish
- Emotional without becoming exhausting
- Interactive without becoming cluttered
- Short enough that Crystal genuinely wants to finish it
- Visually polished and clearly different from a generic dashboard

The page belongs to both Jay and Crystal. It should feel like a shared place, not a surveillance report or a report written about one person for the other.

## Visual Rules

- Preserve the existing `/news` layout, colors, typography, spacing, cards, and motion unless Jay explicitly requests a redesign.
- Keep Jay content light blue, Crystal content pink, and shared content white.
- Keep the dark premium interface.
- Update daily data and small interaction copy before touching structure.
- Avoid oversized paragraphs and excessive cards.
- Keep mobile reading comfortable.

## Core Sections

1. A strong daily title and one-sentence theme
2. A short quick read
3. An uplifting daily song that attempts autoplay after access is granted
4. A visible top play/pause control synchronized with the media-section control
5. Jay's honest day update
6. Crystal's personal corner
7. A fair relationship checkpoint
8. What they are building together
9. Career and money direction when relevant
10. Fitness accountability for both people
11. One playful inside joke or private ritual
12. A short tomorrow plan
13. Two or three easy questions that shape the next edition

## Music Pattern

- Choose one uplifting, comforting, romantic, or motivating song each day.
- The song should fit the emotional temperature without turning into a lecture.
- Start audio from the password-submit interaction so browser autoplay rules are respected.
- Keep the same audio element alive through the protected page load.
- Show a top play/pause button near the briefing header.
- Show a synchronized play/pause control in the music card.
- Keep Spotify as the external fallback.
- If a browser blocks sound, clearly offer one-tap playback.
- Avoid songs that intensify conflict, despair, jealousy, or guilt on difficult days.

## Content Rules

- Use only personal details Jay or Crystal knowingly supplied or approved.
- Do not publish private usernames, screenshots, message contents, or surveillance-style logs.
- Summarize conversations by relevance, not by transcript.
- Separate facts from fears, interpretations, and unresolved concerns.
- Do not shame either person or declare a winner.
- Do not use self-abusive language as final apology copy.
- Convert guilt into accountability, repair, and specific next actions.
- Keep sexual references private, mutual, adult, and tasteful.
- Preserve exact inside jokes when requested, including `mean and stinky`.

## Relationship Voice

The relationship section should include:

- What happened
- What each person may need
- One fair practical rule
- One appreciation
- One small next step

Avoid diagnosing, blaming, taking sides, or pressuring Crystal to comfort Jay. Jay's apologies should acknowledge harm and emphasize consistent action.

## Product Explanation Pattern

When explaining Jay's projects to Crystal:

- Lead with the human outcome
- Avoid a wall of technical terminology
- Explain what it could do in daily life
- Show why Crystal's taste and ideas matter
- Invite one simple piece of feedback
- Keep the explanation short and interactive

Example:

> Imagine opening one private page every morning where the right music starts, the important things are already organized, and the tools you approved work together to help you plan the day.

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

## Daily Intake

Useful rotating questions include:

- What changed today?
- What was one positive moment?
- What should Crystal understand about Jay's work?
- What should Jay understand about Crystal's day?
- Did either person train?
- What is tomorrow's most important task?
- What music mood should tomorrow have?
- What is one thing they appreciate about each other?

Do not repeatedly ask for information already supplied.

## Known Personal Briefing Details From Creation Day

- Jay described the day as Creation Day and a builder's day.
- Jay worked for hours on the personalized AI briefing product.
- He learned and refined layouts and post-login music autoplay.
- He believes the concept could become a real product if services and approved information can be connected responsibly.
- He wants Crystal to help shape the product without making the briefing long or boring.
- He sat in a coffee shop for hours working, thinking, talking to people, and charging his phone.
- He spoke with Logan, Debbie, his mother, and his father.
- He helped his father with a possible scam concern and trusts Crystal with that context.
- He wants to show Crystal his updated resume and new ideas.
- Ovaro appears on the resume as evidence of initiative, ownership, and business experience.
- He wants a non-labor office role where he can help businesses grow through operations, web, SEO, advertising, strategy, and project support.
- He did not train and wants help rebuilding motivation and consistency.
- His next-day goals included sending the resume, training, creating, spending time with Crystal, watching their show, and private couple time.
- His happiest moment was hearing Crystal breathing and sleeping peacefully after a stressful morning.
- He wants Crystal to feel loved when she reads the briefing.
- He appreciates that Crystal fights for the relationship and does not easily let him go.
- Their inside phrase is `mean and stinky`.
- Their shared statement is: `We're a power couple. We're gonna make it through this.`
- Jay's apology should acknowledge cheating and harm without using self-destructive wording, then emphasize honest answers, changed behavior, and consistent actions.
- Their future picture includes saving, meeting, closing the distance, physical intimacy, love, and building a shared life.

## Daily Update Architecture

Preferred structure:

- `/news/` as the canonical gated Jay + Crystal route
- `/crystal/` as redirect only
- `assets/cmx-news.html` as the live visual shell
- `assets/news-data.js` as daily content
- `assets/news.js` as the renderer
- `assets/news-media.js` as synchronized media controls
- `assets/news-gate.js` as password and autoplay flow
- `templates/jay-crystal-news-layout.html` as the preserved layout copy
- Separate recipient profiles and preferences
- Daily uplifting media selection
- Approved connectors only
- FastAPI backend when authentication, saved answers, automation, or private data becomes real
- Versioned daily editions and a clear deletion/correction process

## Replication Principle

Preserve the format, emotional intelligence, interaction quality, music behavior, privacy rules, and visual design. Rebuild each day's content around what genuinely happened. The result should feel fresh, personal, useful, and easy to finish.
