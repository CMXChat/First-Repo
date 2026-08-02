# `/news` Daily Briefing Source

Status: template
Target page: `/news/`
Runtime data: `assets/news-data.js`

## Daily objective

Create one current, useful shared briefing for Jay and Crystal. The page must feel intentionally made for both of them. Keep Jay-specific lines light blue, Crystal-specific lines pink, and shared information white.

Keep the edition concise, warm, useful, easy to scan, and occasionally funny. Crystal-facing copy should stay short, with strong attention to celebrity news, major crime, pets, beauty, nails, jewelry, Chanel, running, scenic New Zealand movement, and her confirmed style preferences. Jay-facing material should include useful local context, music, practical motivation, learning, gym consistency, and concise relationship-relevant updates.

## Default tone

Keep the briefing lighthearted and occasionally playful when the subject permits. Use dry humor without making Jay, Crystal, private people, victims, or vulnerable people the joke.

Routine weather, entertainment, pets, style, Spotify, harmless activity, gym, running, horoscopes, and ordinary relationship updates should not sound ominous. A quiet day should feel calm, not suspicious.

Shift into a serious voice only for safety, severe weather, crime, legal developments, grief, health, major world events, or an important relationship issue that genuinely requires it. Stay calm and proportionate, then return to the lighter voice afterward.

## Presentation rules

- Treat the page as a shared check-in, not surveillance, a performance review, or a courtroom transcript.
- Never display an empty section, placeholder, missing-data apology, or filler card merely to preserve the layout. If useful material is unavailable, skip the section cleanly.
- Keep Jay's activity recap brief and relationship-relevant. Routine work details can be omitted unless they affect plans or Crystal requests them.
- Place the Spotify section near the top, normally after the quick-read section and before the relationship section.
- Include exactly one shared daily song recommendation whenever the Spotify connection works. Use a real connector-derived link, rotate recent picks, and add a short original reason the song fits without quoting lyrics or forcing a romantic exercise.
- Include one short factual daily fact, observation, or piece of trivia that is funny, surprising, useful, or specifically relevant to Jay and Crystal. Verify it. Never invent a fact for the joke.
- Include one shared movement card most days. Personalize it for both: Jay's gym or current bodyweight targets, and Crystal's gym, running, walking, scenic routes, or outdoor movement in New Zealand. Keep it motivating without shaming, overtraining, or pretending exercise solves relationship problems.
- Use the relationship section for one useful observation and one workable rule or action. Do not repeat the same warning across several cards.
- Include two or three strong celebrity, crime, entertainment, culture, royal, influencer, political-figure, or major legal stories when worthwhile. Crystal does not need to name people in advance.
- Include one optional `UNCONFIRMED` messy-rumor card when a notable public-figure rumor is current, sourced, non-malicious, and genuinely entertaining. Summarize the public evidence, state clearly that it is unconfirmed, and explain what would count as confirmation. Skip the rumor slot entirely when the material is weak, cruel, invasive, based on anonymous social posts alone, or about private people.
- Include an up-and-coming trend when a real current trend is useful: beauty, nails, hair, jewelry, fashion, fitness, running, music, entertainment, internet culture, or practical technology. Skip weak trend claims.
- Keep the permanent Jay, Crystal, and shared questions at the bottom visible. Add zero to three edition-specific questions that help improve the next briefing.
- Include at least one positive, entertaining, practical, aesthetic, or motivational item so serious news does not dominate.

## Personalization rules

Use only confirmed details, supplied descriptions, and current permitted context. Do not claim visual knowledge that is unavailable in the current context and do not invent body features.

Confirmed Crystal details that may guide respectful style ideas include very long hair, a beauty spot above the right side of her lip, a preference for gold, pink, and black, jewelry design, flowers, animals, running, scenic views, and gym activity. Style suggestions should help frame or complement those features, never criticize her body, compare her to other women, or make appearance judgments.

Known Jay details that may guide movement and motivation include gym interest, the current 60-pushup target as 4 sets of 15, the 60-situp target as 3 sets of 20, learning Python, and a preference for direct, grounded motivation without corny hype.

## No-update fallback

Check whether either person supplied meaningful updates during the previous 24 to 48 hours.

- Never pretend an old update happened today.
- If updates are missing, research and publish useful external material instead of displaying blank or apologetic sections.
- Add one light shared nudge such as: `You two have been quiet for a day or two. The briefing can research the world, but it cannot obtain relationship updates through telepathy. Send one useful update each.`
- The nudge may say they have been quiet or slacking only when that is factually true. Keep it playful, not shaming.
- Ask for one concise update from each person: what changed, one positive moment, plans, gym or run activity, a concern, a correction, a topic to follow, or tomorrow's preferred music mood.

## Refresh each run

- Current local date and time for Brooklyn and Waikato
- Weather and meaningful alerts for both areas
- Useful Brooklyn, New York, Waikato, and New Zealand developments
- Waikato safety, crime, emergency, court, and missing-person developments from official sources
- Major crime and exact legal developments
- Two or three worthwhile celebrity, entertainment, culture, royal, influencer, political-figure, or major legal stories
- Optional responsibly handled public-figure rumor
- One useful up-and-coming trend when available
- One current personalized style, beauty, hair, nail, accessory, or jewelry idea for Crystal when worthwhile
- One concise practical custom-jewelry-business sentence on most days
- One worthwhile pet or animal item
- One shared movement or gym card for both
- Current connected Spotify information and one fresh shared song
- Separate short Virgo readings for September 15 and September 14
- One factual funny or relevant daily fact
- One strong original quote with a short reflection
- Major world affairs only when consequential

## Detailed card fields

The renderer supports concise cards with optional expandable detail:

- `whyItMatters`
- `watchNext`
- `details`
- `sources`
- `detailsLabel`

Keep the main card readable without opening details. Use expansion for developing, legal, safety, rumor, trend, and relationship cards when it improves understanding. Do not add expandable filler to every card.

## Relationship guidance

Use recent private context when available, but do not store sensitive relationship details in this public repository. Focus on accountability, clarity, reasonable proof, emotional acknowledgment, boundaries, and specific next actions. Do not diagnose, shame, excuse betrayal, manufacture equal blame, pressure either person, or become insulting on either person's behalf.

When a claim is disputed or unsupported, label it as a concern, self-report, report, inference, or unresolved issue. Acknowledge impact before debating intent. Encourage defined transparency boundaries, not permanent surveillance.

## Activity source

Discord, messaging, online activity, gaming, browsing, calls, social media, and Spotify history must come from a fresh self-report or an explicitly authorized connected source. Label personal activity `SELF-REPORTED` unless independently supported. Never invent activity or recycle yesterday's recap as current.

## Privacy

The repository is public even though `/news` has a browser gate. Do not publish private names, usernames, screenshots, verbatim private messages, sexual or romantic allegations, health information, medication, Crystal's precise location, confidential client or security details, or identifying third-party information. Git history may preserve deleted content.

Avoid `CMX` in Crystal-facing copy unless technically required.

## Publishing steps

1. Read this file and the current profile and renderer files.
2. Gather current sources and recent permitted context.
3. Compare with the prior edition and avoid unnecessary repeats.
4. Rank material by safety, relevance, freshness, usefulness, and genuine interest.
5. Update only `assets/news-data.js` using the supported schema.
6. Preserve the shared song near the top, hide empty sections, and keep the bottom questions visible.
7. Verify dates, claims, legal status, rumor labeling, links, Spotify, privacy, JavaScript validity, and loader behavior.
8. Report publishing or source failures honestly.