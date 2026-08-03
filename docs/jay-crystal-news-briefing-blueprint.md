# Jay + Crystal `/news` Briefing Blueprint

## Canonical Route

The live Jay + Crystal shared briefing belongs at `/news/`.

The `/crystal/` route is redirect-only. It must point to `/news/` and must never become a second competing briefing.

## Purpose

The page is a private daily experience built for Jay and Crystal and a working prototype for a future personalized briefing product.

It can combine:

- Personal updates
- Relationship moments
- Jay's progress
- Crystal-focused ideas
- Music
- Weather
- Local and world news
- Celebrity, crime, and culture
- Beauty, style, jewelry, art, animals, running, and fitness
- Career direction
- Shared plans and memories
- Product-development updates

The page should feel personal, intelligent, useful, visually polished, and easy to finish on a phone.

## Preserved Design

The protected layout copy is stored at:

`templates/jay-crystal-news-layout.html`

Preserve the existing:

- Dark premium background
- Light blue for Jay
- Pink for Crystal
- White for shared content
- Card system
- Typography
- Spacing and layout rhythm
- Navigation
- Terminal-inspired details
- Responsive behavior

The page should feel improved, not replaced. New sections should use the current classes and visual language.

## Runtime Architecture

The live route uses:

- `news/index.html` for the protected entry page
- `assets/cmx-news.html` for the stable visual shell
- `assets/news-loader.js` for cache-safe daily asset loading
- `assets/news-gate.js` for the current access gate and password-triggered music attempt
- `assets/news-data.js` for the main daily edition
- `assets/daily-song.js` for the daily song and supporting songs
- `assets/daily-weather.js` for daily weather
- `assets/daily-culture.js` for daily culture stories
- `assets/daily-video.js` for the daily video
- `assets/news.js` for the core renderer
- `assets/news-media.js` for music and video controls
- `assets/news-upgrades.js` for permanent Phase 1 sections
- `assets/news-upgrades.css` for the new section styles

Daily publishing should update only the dedicated daily files. It should not rewrite the shell, access gate, loaders, renderers, synchronization scripts, permanent layout, or blueprint.

## Phase 1 Sections

### Since Yesterday

A compact progress strip near the top. Use it for changes such as product progress, career action, relationship moments, fitness, and today's focus.

### What Jay Built

Explain Jay's work in normal language using four ideas:

1. What changed
2. Why it matters
3. What it could become
4. What comes next

Avoid API jargon, backend terminology, technical changelogs, and long feature inventories.

### Behind the Build

Tell the human story behind the product in one or two cards:

- Today's problem
- What changed
- Why the change matters
- What becomes possible next

### Memory of the Day

Use one short warm memory, funny line, quiet moment, inside joke, shared call, or appreciation. Keep it broad enough to remain safe in repository history.

### Why This Exists

Keep a permanent purpose card explaining the emotional and practical reason for the page.

### Product Vision

Keep a permanent concise card explaining that `/news` is a working prototype for personalized couple, family, founder, business, and personal briefings.

### Progress Tracker

Use four areas:

- Product
- Career
- Fitness
- Relationship

Use truthful status labels such as `Moving`, `Needs attention`, `In progress`, `Paused`, `Next action`, and `Small win`. Do not invent percentages.

### What's Next

Keep the next steps short, practical, and finishable.

### Coming Soon

Explain future backend features honestly. Do not show fake buttons or controls that appear functional.

### Living Prototype

Use a small banner near the bottom to reinforce that each daily edition and design improvement is helping shape the larger product.

## Recommended Section Order

1. Hero
2. Since Yesterday
3. What Matters Today
4. Daily Song
5. Quick Read
6. Jay's Check-In
7. What Jay Built
8. Behind the Build
9. Crystal's Corner
10. Weather
11. Style and Small Joys
12. Celebrity, Crime, and Culture
13. Local News
14. World News
15. Relationship Checkpoint
16. Shared Direction
17. Memory of the Day
18. Why This Exists
19. Product Vision
20. Progress Tracker
21. What's Next
22. Coming Soon
23. Horoscope and Quote when useful
24. One Daily Question
25. Living Prototype

The top should remain fast. Deeper explanations belong later or inside expandable details.

## Music Rules

The main daily song should:

- Attempt playback after the password form is submitted
- Use a valid audio preview when available
- Match the visible title, Spotify link, and daily video theme
- Use synchronized top and music-card controls
- Keep a Spotify fallback link
- Remain a surprise until the briefing opens

Supporting songs should:

- Include two to four picks
- Never autoplay
- Include a short reason
- Use verified Spotify links
- Load the embedded player only after a tap

Avoid recent repeats and songs that intensify conflict, jealousy, despair, guilt, or pressure.

## Crystal-Focused Research

Research broadly, then publish selectively.

### Celebrity, Crime, and Culture

Potential areas include major celebrity developments, public-figure court cases, significant crime cases, music, film, television, streaming, internet culture, royal stories, New Zealand and Australian culture, tributes, and one lighter item.

For legal or crime stories, include:

- What happened
- Exact legal status
- Why it matters
- What to watch next
- Reliable sources

Never present an allegation as a finding. Reject weak gossip, unverified social claims, sensational victim coverage, and recycled stories without a new development.

### Beauty, Style, and Jewelry

Use tasteful practical ideas involving beauty trends, jewelry, gold/pink/black styling, hair, nails, designer references, and small-business inspiration.

### Art and Creative Inspiration

Use flower-painting prompts, artists, palettes, exhibitions, animal art, jewelry references, and small visual trends.

### Animals

Use occasional positive or useful items about dogs, cats, rescues, wildlife, pet care, and funny animal stories. Do not force this section every day.

### Running and Fitness

Use weather-aware outdoor windows, scenic ideas, recovery suggestions, running music, and low-pressure motivation. Do not assume pace, distance, ability, or health status.

## Jay's Progress Story

Jay's work should appear without sounding like a technical project report or a self-promotional pitch.

Explain:

- What he worked on
- Why it matters
- How it connects to the shared future
- What product idea is emerging
- The next milestone
- How Crystal may participate later

The product direction is a personalized briefing that combines approved information, preferences, music, research, reminders, memories, goals, and useful daily context.

## Relationship Voice

The relationship section should feel fair, calm, and useful.

Include:

- What happened in approved broad terms
- What each person may need
- One useful observation
- One small next step
- One appreciation
- One practical rule

Avoid diagnosing, blaming, taking sides, declaring a winner, asking Crystal to reassure Jay, using self-abusive apology language, or repeating private arguments in detail.

A useful apology pattern is:

> I hurt you. I am deeply sorry. I know words alone are not enough. I want my actions, honesty, and consistency to show that I understand the damage and that I am working to change.

## Daily Question Rules

Ask one useful question at a time.

Rotate across:

- What changed
- One positive moment
- Tomorrow's plan
- Project progress
- Resume progress
- Fitness
- Crystal's run
- Style
- Music
- Culture
- Shared activity
- Product idea
- Briefing feedback

Make the question easy to answer. Do not request private names, message contents, screenshots, health details, financial-account details, or full activity logs.

## Expandable Content

Use expandable details for:

- Legal background
- Full sources
- Product explanation
- Longer news context
- Future roadmap
- Technical information
- Additional recommendations

The default view should remain a short headline, one concise paragraph, a clear label, and optional `More context`.

## Privacy Rules

The repository is public or potentially visible through GitHub history. Treat every committed line as something that could be discovered later.

Do not store:

- Passwords or password hints
- Private usernames or identifiers
- Message contents or screenshots
- Exact financial details
- Sensitive health details
- Private sexual details
- Private account information
- Detailed family disputes or private arguments
- Anything that could endanger either person

Use approved summaries. Keep personal context broad enough to remain safe. Private memory, reactions, corrections, and preferences should move to a secure backend before they become detailed or searchable.

## Future Backend Features

After a secure backend exists, the page may support:

- Reactions
- Song voting
- Notes
- Suggestions
- Saved memories
- Search
- Personalized preferences
- Shared checklists
- Daily answers
- Corrections
- Product feedback
- Private profile settings

Preferred future foundations:

- FastAPI
- Server-side authentication
- Secure sessions
- Database storage
- User roles
- Private API endpoints
- Rate limiting
- Audit logs
- Encrypted secrets
- Cloudflare Access or equivalent protection

The current client-side access gate is a prototype, not long-term private authentication.

## Research Workflow

### Night Research

Each night:

1. Research every possible section
2. Build a preliminary dossier
3. Gather sources
4. Identify missing personal details
5. Suggest one or two possible check-in questions
6. Flag weak stories
7. Prepare music and video candidates
8. Prepare weather questions
9. Prepare Jay's progress narrative
10. Prepare Crystal-focused ideas
11. Prepare three page-improvement ideas

Recommended path:

`briefing/research/YYYY-MM-DD-preliminary.md`

### Morning Verification and Publishing

At 6:00 AM Brooklyn time:

1. Read the nightly dossier
2. Re-research the selected stories
3. Check overnight changes
4. Reject stale items
5. Verify legal status
6. Verify weather
7. Verify Spotify links and preview URLs
8. Verify video
9. Refresh approved personal context
10. Publish the dedicated daily files
11. Validate the rendered experience

The nightly dossier is preparation, not automatically correct source material.

## Rebuild Procedure

If the live page is deleted or damaged:

1. Restore `templates/jay-crystal-news-layout.html` as the shell reference
2. Restore the protected route from `news/index.html`
3. Confirm `/crystal/` redirects to `/news/`
4. Restore `assets/cmx-news.html`
5. Restore the base styles and renderers
6. Restore `assets/news-upgrades.js` and `assets/news-upgrades.css`
7. Restore the five daily files
8. Confirm the daily song appears first in the music section
9. Test password-triggered playback, both play/pause controls, Spotify fallback, and supporting-song tap behavior
10. Test mobile widths and expandable cards
11. Confirm robots remain `noindex, nofollow`
12. Confirm no secrets or sensitive personal data entered repository history

## Definition of Success

The page should make Crystal feel loved, included, curious, entertained, informed, part of the product story, comfortable giving ideas later, and interested enough to return tomorrow.

Jay's progress should feel visible without becoming self-important. The product concept should feel clear without becoming a pitch deck. The page should remain easy to finish on a phone and visually consistent with the existing `/news` design.
