# `/news` Research and Publishing Standard

Status: authoritative publishing contract
Target: `https://db.cmxchat.com/news/`

This file defines how every daily Jay + Crystal briefing must be researched, personalized, written, published and verified. Read it before every scheduled edition together with the section-specific files and current profiles.

## Core outcome

Publish one current, concise and genuinely useful shared briefing for Jay and Crystal. Every visible section must earn its place through fresh research, fresh permitted input, a clear practical purpose or a meaningful personal connection.

The page must never look automatically filled. No generic placeholders, stale recaps, empty apologies, recycled weather, random celebrity filler or invented personal activity.

## Required run sequence

1. Resolve the actual current local date and time in Brooklyn and Waikato.
2. Read the current repository instructions, profiles, daily data files and the previous edition.
3. Review recent permitted personal context for Jay and Crystal.
4. Research all time-sensitive public sections from reliable current sources.
5. Compare candidate items for freshness, relevance, usefulness, safety and interest.
6. Remove weak, duplicate, invasive, stale or unsupported material.
7. Write the daily runtime files using their exact schemas.
8. Fetch the latest SHA immediately before every write.
9. Publish only intended daily data files.
10. Fetch all updated files again and verify the live route when possible.

## Authority order

When instructions differ, use this order:

1. Privacy and safety rules
2. This publishing standard
3. Section-specific rules in `briefing/`
4. Current Jay and Crystal profile files
5. Current runtime schema and renderer behavior
6. Older edition content

Old daily content is evidence of prior structure, not permission to repeat stale facts.

## Research quality standard

### Strong sources

Prefer primary and authoritative sources:

- Official weather services, emergency agencies and government alerts
- Courts, prosecutors, police, legislatures and official public records
- Company, artist, studio, network, league or event statements
- Associated Press, Reuters and established national reporting
- Strong local reporting for Brooklyn, New York, Waikato and New Zealand
- Established specialist publications for entertainment, technology, finance, style or culture
- Authorized connected sources for personal data and Spotify

### Verification depth

Use one strong primary source for straightforward official facts. Use two reputable sources when the claim is disputed, legally sensitive, financially large, surprising or likely to change quickly.

For each factual card, verify:

- Date
- Location
- Name and spelling
- Current status
- Numbers and units
- Legal stage when relevant
- Source URL
- Whether the fact is still current

Do not cite an article that merely copied another weak source. Do not use search snippets as the only evidence for a consequential claim when the underlying source can be checked.

### Research failure

When reliable information is unavailable:

- Skip the card or section cleanly
- Use a narrower verified item
- State a limitation only when the missing information materially affects the briefing
- Never replace missing research with a generic motivational paragraph

## Personal-input standard

Personal claims must come from:

- A fresh self-report from Jay or Crystal
- An explicitly authorized connected source
- A current permitted conversation summary

Label activity `SELF-REPORTED` unless independently supported.

Never infer current activity from an old update. Never present silence as suspicious. Never invent Discord, messages, calls, browsing, Spotify history, work progress, exercise or relationship events.

Use only the minimum private context needed to make a section helpful. The repository is public and Git history may preserve deleted material.

## Editorial balance

Every edition should contain a useful mix of:

- What matters today
- One-minute orientation
- Personal context when available
- Real weather for both places
- One fresh shared song
- Carefully selected culture and entertainment
- Practical local or world information when relevant
- One positive, light, beautiful, funny or motivating element
- One fair relationship checkpoint
- A small number of questions that improve the next edition

Serious news must not swallow the entire page. Light sections must not trivialize serious events.

## Section-by-section publishing requirements

### 1. What Matters Today

Purpose: identify the two to four items that most affect today’s choices, mood, plans or shared understanding.

Research and input:

- Review all researched sections and fresh personal context first
- Select only the highest-value items
- Include at least one actionable or grounding item when possible

Rules:

- Do not merely duplicate lower sections word for word
- Explain the consequence or next action
- Skip generic titles such as `Have a productive day`
- Keep the section understandable without opening details

### 2. The Quick Read

Purpose: provide a truthful one-minute orientation.

Research and input:

- Summarize the strongest personal, public and practical developments
- Reflect both Jay and Crystal when information exists

Rules:

- Two to four concise cards maximum
- Distinguish confirmed facts from self-report
- Do not turn the quick read into a second priority section
- Do not claim a full daily recap when personal updates are missing

### 3. Jay’s Check-In

Purpose: explain recent Jay context that affects plans, accountability or the relationship.

Input:

- Fresh self-report or authorized source only
- Current work, family, fitness, online activity, plans or corrections only when relevant

Rules:

- Label self-reported information
- Keep routine technical work brief unless it changes a plan
- Include one useful next action when appropriate
- Do not publish private usernames, message text, sensitive financial details, client details or identifying third-party information
- Hide the section when there is no current useful input

### 4. Crystal’s Corner

Purpose: provide material chosen specifically for Crystal without patronizing her or turning her into a list of preferences.

Research and input:

- Current confirmed interests and requests
- Strong New Zealand, culture, animals, style, beauty, jewelry, television, music, running or scenic-life material
- Fresh Crystal input when available

Rules:

- Use direct respectful language
- Include substance, not decorative filler
- Do not make mental-health, appearance, body or private-life assumptions
- Do not claim Jay knows what Crystal feels unless Crystal said it
- Keep the strongest one to three items

### 5. Weather in Both Places

Purpose: make the forecast useful for decisions.

Follow `briefing/weather-daily.md` and publish `assets/daily-weather.js`.

Each location must include:

- Correct local calendar date or daypart
- Current or near-current condition when available
- High and low
- Rain or snow probability and likely timing
- Meaningful wind
- Alerts or hazards when relevant
- Sunset when useful
- Best outdoor window or activity idea
- One practical clothing, travel or safety note
- A short one-to-three-day outlook
- Direct forecast sources

Never publish `check the sky`, `use the live forecast` or similar placeholders.

### 6. Beauty, Style and Small Joys

Purpose: provide one or two current, personalized and usable ideas.

Research:

- Verify the trend, product category, technique, color direction or cultural reference
- Prefer established beauty, fashion, jewelry or creator sources
- Distinguish a real trend from one viral post

Personalization:

- Use only confirmed details such as Crystal’s gold, pink and black preferences, jewelry design, flowers, animals, long hair and beauty spot
- Explain why the idea may suit her preferences without judging her body or appearance

Rules:

- Include a practical way to try, adapt, design or save the idea
- Avoid unsafe beauty practices, medical claims and expensive pressure
- Skip the section when the trend is weak

### 7. Play and Watch

Purpose: give them one current shared song and one optional strong video.

Follow `briefing/media-daily.md`.

Song:

- Choose a fresh track each edition
- Avoid recent repeats unless editorially justified
- Use the authorized Spotify connection when available
- Keep the card, Spotify link, preview, login copy and play controls synchronized
- Use a verified lawful preview URL or leave it empty

Video:

- Select only when a worthwhile embeddable video exists
- Prefer official or established sources
- It may match the song, but it does not have to
- Skip cleanly instead of publishing an empty player

### 8. Local News, Both Sides

Purpose: surface local information that may affect either person.

Research:

- Brooklyn and New York City official or strong local sources
- Hamilton, Waikato and New Zealand official or strong local sources
- Transit, weather alerts, safety, events, public services, major community developments and useful local culture

Rules:

- One to three cards per side only when relevant
- Explain why the item matters today
- Do not publish routine crime blotter content, private-person allegations or fear-based filler
- Use exact location wording without exposing Crystal’s precise location
- Hide the section when nothing is worth their attention

### 9. World, Only If It Matters

Purpose: include consequential world developments without creating a doom feed.

Research:

- Use AP, Reuters, primary official statements and strong regional reporting
- For conflicts or disputed events, separate confirmed facts, claims and uncertainty

Rules:

- Include zero to three items
- Explain practical or cultural relevance
- Avoid forcing a personal lesson onto tragedy
- Do not include a story solely because it is dramatic
- Skip routine political noise with no meaningful consequence

### 10. Celebrity, Crime and Culture

Purpose: deliver the strongest researched entertainment and public-figure stories with good details.

Follow `briefing/culture-daily.md` and publish `assets/daily-culture.js`.

Daily target:

- Four to six strong cards when justified
- One major entertainment or culture event
- One serious court or crime development when worthwhile
- One music, television, film or internet-culture story
- One Australia, New Zealand or Pacific-region item when available
- One lighter item
- Optional short shared perspective card

Legal stories must state the exact procedural stage and avoid implying guilt. Rumors are optional, clearly labeled and subject to strict sourcing and privacy rules.

### 11. Double Virgo, for Fun

Purpose: add a short entertainment ritual, not advice disguised as astrology.

Research and writing:

- Write separate readings for Jay and Crystal
- Tie them lightly to the current day without presenting astrology as fact
- Avoid health, money, legal, fertility or relationship predictions

Rules:

- Mark as entertainment
- Do not recycle identical wording
- Keep each reading concise and positive without being empty

### 12. Relationship Checkpoint

Purpose: support honesty, repair, appreciation and workable next steps.

Input:

- Recent permitted relationship context only
- Clear uncertainty labels when accounts differ

Rules:

- One useful observation
- One workable rule, ritual, boundary or next action
- Acknowledge impact before debating intent
- Do not diagnose, shame, excuse betrayal, manufacture equal blame or pressure a decision
- Do not repeat the same warning across several cards
- Keep sensitive detail out of the repository

### 13. Good Things We’re Building

Purpose: show real shared progress, plans or positive continuity.

Input:

- Actual recent progress, agreed plans, upcoming milestones or meaningful ideas

Rules:

- Do not invent future plans
- Distinguish a wish from a commitment
- Include a small next step when useful
- Hide the section when there is no genuine update

### 14. One Line to Keep

Purpose: end the editorial content with one memorable thought.

Rules:

- Prefer an original line written for the edition
- Attribute a quote only when the attribution is verified
- Never fabricate famous quotations
- Add one short reflection connected to the day
- Do not use clichés as a substitute for insight

### 15. Help Shape Tomorrow

Purpose: collect the minimum useful input for the next edition.

Rules:

- Keep the permanent Jay, Crystal and shared prompts visible
- Add zero to three edition-specific questions
- Ask only what will materially improve tomorrow
- Do not ask for private names, screenshots, full message logs, health details or invasive proof
- Do not repeat a question already answered

## Trends, funny facts, animals and movement

These elements may appear in the best-fitting section.

### Trend

- Verify that the trend is real and current
- Explain who is adopting it and why it matters
- Give one practical adaptation
- Skip weak social-media claims

### Funny or surprising fact

- Verify it
- Keep it concise
- Never invent the fact for the punchline
- Do not make victims or vulnerable people the joke

### Animal or pet item

- Prefer useful, joyful or genuinely notable material
- Avoid distressing animal content unless it has clear practical importance

### Movement

- Personalize for Jay’s current gym or bodyweight goals and Crystal’s running, walking, gym or scenic movement
- Use the real weather when suggesting outdoor activity
- Encourage consistency and safety without shame or unnecessary volume

## Legal and crime safety checklist

Before publishing any crime or court card, confirm:

- Criminal or civil matter
- Allegation, charge, plea, trial, verdict, appeal or sentence
- Whether the person has denied the allegation or pleaded not guilty
- Whether a court has actually ruled
- Whether a number is alleged, awarded, requested or final
- Whether victim privacy requires removing details
- Whether humor is inappropriate

Use labels such as:

- `REPORTED`
- `VERIFIED`
- `CHARGED, NOT CONVICTED`
- `ONGOING CASE`
- `CIVIL ALLEGATION`
- `UNCONFIRMED`

## Freshness and repetition

Before publishing:

- Compare every current card with the previous edition
- Remove unchanged stories unless a meaningful development occurred
- Explain the new development when continuing a story
- Rotate songs, facts, movement prompts, quotes and style ideas
- Do not change a strong continuing item merely to create artificial novelty

## Privacy boundary

Never publish:

- Passwords, tokens or private access details
- Private usernames or direct-message contents
- Screenshots of private conversations
- Sexual details or allegations
- Health, medication or diagnosis details
- Crystal’s precise location
- Sensitive financial account information
- Confidential client, work or security information
- Identifying information about private third parties

The browser gate is not server-side privacy. Treat every committed line as potentially public and permanent.

## Runtime files

Ordinary daily publication may update only:

- `assets/news-data.js`
- `assets/daily-song.js`
- `assets/daily-weather.js`
- `assets/daily-culture.js`
- `assets/daily-video.js`

Do not edit permanent HTML, CSS, loaders, gates, sync scripts or renderers during a normal daily run.

## Validation checklist

Before declaring success:

- All dates match the correct Brooklyn and Waikato local dates
- JavaScript files begin and end with their required wrappers
- No syntax errors
- All source links are valid and support the claim
- Legal wording matches the actual procedural status
- Weather is current and uses appropriate local units
- Song card, autoplay preview, login copy and controls match
- Culture cards are current, sourced and non-duplicative
- Empty sections are hidden
- No placeholders remain
- No stale personal activity is presented as current
- No privacy violations
- The route loads the newest daily files without stale cache

## Operational result

After publication, report concisely:

- Edition date
- Files updated and commit SHAs
- Shared song and preview availability
- Brooklyn and Waikato weather summary
- Culture desk lead stories
- Daily video
- Other major areas covered
- Any failed source, connector or live-route verification
- One important question only when truly needed

The live page is the primary output. Do not paste the full briefing unless publication failed or Jay explicitly asks for it.
