# Daily Celebrity, Crime and Culture Rules

Target section: `culture`
Daily data file: `assets/daily-culture.js`

## Purpose

Build a current culture desk that is genuinely interesting to Jay and Crystal. It should contain strong details, careful legal wording, useful context and at least one lighter item when the news allows. It must never become a random gossip feed or a crime spectacle.

## Research before selection

Search broadly across:

- Major celebrity and entertainment developments
- Film, television, music and internet culture
- Public-figure lawsuits and criminal cases
- Major court developments with cultural importance
- Australia and New Zealand entertainment and culture
- Major deaths, tributes and legacy stories
- One lighter, watchable, funny or surprising item when a strong option exists
- One responsibly handled public-figure rumor only when the evidence and sourcing justify it

Prefer developments from the past 24 to 72 hours. An older story may remain only when it is still developing or unusually important, and the card must explain why it remains relevant.

## Daily mix

Aim for four to six strong cards when the news supports them:

1. One major entertainment or culture event
2. One major crime, court or legal development when worthwhile
3. One music, film, television or internet-culture story
4. One Australia, New Zealand or Pacific-region item for Crystal when available
5. One lighter or fun item
6. One short perspective card connected to Jay and Crystal when it adds warmth

Skip weak categories. Never fill a quota with stale, invasive or low-value material.

## Source hierarchy

Prefer:

- Official courts, prosecutors, police and government records
- Associated Press and Reuters
- Official artist, studio, network, festival and awards sources
- Variety, Billboard, The Hollywood Reporter and equivalent established entertainment publications
- Reliable New Zealand and Australian reporting

Use at least two independent reputable sources for major disputed facts, large financial figures or legally sensitive claims when practical. A primary legal source plus one strong news report is ideal.

Do not rely on anonymous social posts, scraped celebrity sites, fabricated quote accounts, AI summaries or copied rumor pages.

## Crime and court wording

- Clearly distinguish arrest, charge, preliminary hearing, indictment, plea, conviction, sentencing, appeal and civil allegation.
- State `not convicted`, `has pleaded not guilty`, `alleged`, or the relevant legal status when needed.
- A judge finding probable cause is not a finding of guilt.
- Do not sensationalize victims, publish graphic details or turn suffering into entertainment.
- Do not imply guilt through headlines, labels or jokes.
- Use humor around media chaos or public spectacle, never around victims, abuse, death or vulnerable people.

## Rumor rules

A rumor card is optional and must be labeled `UNCONFIRMED`.

Include one only when:

- The people involved are public figures
- A reputable outlet has documented the public evidence
- The subject is non-malicious and not dangerously invasive
- The card explains what is known, what is speculation and what would count as confirmation

Skip rumors based only on anonymous posts, body-language analysis, private-person claims, health speculation, sexuality speculation, pregnancy speculation, leaked private material or cruelty.

## Card quality

Each main card should include:

- A clear title
- A concise main summary
- Exact legal or factual status
- Two to five useful details when the story has depth
- `whyItMatters`
- `watchNext` for developing stories
- Direct source links with dates

The collapsed card must still make sense. Expansion should provide the good details, not repeat the headline in more words.

## Personalization

Select stories that are likely to interest Jay or Crystal based on confirmed preferences and current conversation context. Do not pretend either person requested or endorsed a topic unless they did.

Crystal-relevant choices may include New Zealand and Australian culture, music, television, style, jewelry, beauty, animals and major celebrity news. Jay-relevant choices may include film, music, business implications, technology, major legal cases and internet culture. Shared stories should give them something useful or fun to discuss.

## Publishing contract

Write valid UTF-8 JavaScript beginning exactly with:

`window.CMX_DAILY_CULTURE = {`

and ending with:

`};`

Use top-level fields:

- `generated`
- `items`

The permanent sync script loads these items into `window.CMX_NEWS_BRIEF.culture`. Do not copy rendering or synchronization logic into the daily data file.

Fetch the latest SHA immediately before writing. After publishing, fetch the file again and verify claims, URLs, legal labels, dates, JavaScript validity and that no stale card remains from the previous edition.
