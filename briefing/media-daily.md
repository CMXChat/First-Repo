# Daily Play and Watch Rules

Target section: `spotify`
Daily song data: `assets/daily-song.js`
Daily briefing data: `assets/news-data.js`
Daily video data: `assets/daily-video.js`

## Purpose

Give Jay and Crystal one primary shared song every day, two to four supporting songs farther down the section, and one shared video when a strong option exists. Keep the selection uplifting, personal, easy to skip, and short enough that the page never feels like a playlist dump.

The current music is only for that edition. Rotate the primary and supporting songs unless there is a clear editorial reason to repeat one. The login welcome remains fixed, the daily mood line changes, and the primary song stays a surprise until the briefing opens.

## Primary daily song

- Use the authorized Spotify connector when available.
- Choose exactly one primary shared song for each edition.
- Match the day’s mood and strongest themes without claiming the song proves either person’s emotions.
- Prefer an uplifting, warm, energizing, playful or emotionally appropriate choice.
- Avoid recent repeats unless there is a clear new reason.
- Use the exact track, artist, connector-derived Spotify track link and a short original description.
- Find and verify a lawful preview URL when available. Prefer a Spotify-hosted preview or official Apple or iTunes preview.
- Never upload or copy a full copyrighted recording.
- If no preview is available, retain the verified Spotify link and do not pretend autoplay is available.

## Supporting song stack

Add two to four supporting recommendations in `recommendations` inside `assets/daily-song.js`.

The supporting songs should appear below the primary song and featured video. Give each one a clear purpose, such as:

- for Crystal’s run
- for Jay’s work session
- for building something bigger
- for a shared reset
- for winding down
- for tomorrow’s gym session

Rules:

- Keep the mix varied in energy and purpose.
- Use verified exact Spotify track links.
- Supporting songs never autoplay.
- Each supporting card must use tap-to-load playback and an external Spotify fallback.
- Do not repeat the primary song in the recommendation list.
- Avoid filling the section with near-identical songs or heavy conflict music.
- Keep descriptions original and concise.
- Two or three strong extra songs are better than a long weak list.

## Daily song file

Replace `assets/daily-song.js` every day with valid UTF-8 JavaScript beginning exactly with:

`window.CMX_DAILY_SONG = {`

and ending with:

`};`

Primary fields:

- `audience`: normally `shared`
- `priority`: normally `100`
- `label`: normally `today's uplifting song`
- `status`: normally `DAILY PICK` or `CONNECTED SOURCE`
- `title`: exact song title
- `artist`: exact artist name
- `displayTitle`: `Song · Artist`
- `loginMood`: one concise lowercase mood phrase ending with a period
- `text`: one short original explanation of why it fits today
- `directLine`: one optional playful or warm shared line
- `spotifyUrl`: exact connector-derived Spotify track URL
- `spotifyLinkLabel`: concise link label
- `previewUrl`: verified lawful HTTPS preview URL, or an empty string when unavailable
- `selectedFor`: Brooklyn edition date in `YYYY-MM-DD`
- `published`: concise note such as `today's shared pick`
- `recommendations`: array containing two to four supporting song objects

Each recommendation object should use:

- `audience`
- `priority`
- `label`
- `status`
- `title`: `Song · Artist`
- `text`
- `spotifyUrl`
- `spotifyLinkLabel`
- `published`

`assets/daily-song.js` is the authoritative source for the login mood, primary autoplay source, primary song card and supporting song cards. Permanent rendering logic lives elsewhere and must not be copied into this daily file.

The matching `spotify` entry in `assets/news-data.js` should remain consistent with the primary track. The dedicated song file controls the rendered music stack.

## Login welcome, autoplay and controls

- Permanent login sentence: `Welcome to today’s brief. This private space belongs to Jay and Crystal.`
- A second line displays `Today’s mood: [loginMood]`.
- Do not reveal the primary song title on the login screen.
- The primary song may begin only after passphrase submission.
- Never autoplay before the user interacts with the gate.
- Keep the hero and primary media-card controls synchronized.
- When a browser blocks autoplay, show a clear play option.
- When no primary preview exists, open the verified Spotify link instead.
- Supporting songs must never compete with the primary audio. They remain tap-to-load.

## Daily video

When a strong selection exists, update `assets/daily-video.js` with valid UTF-8 JavaScript beginning exactly with:

`window.CMX_DAILY_VIDEO = {`

and ending with:

`};`

Use:

- `audience`
- `label`
- `status`: `OFFICIAL`, `VERIFIED` or `REPORTED`
- `title`
- `text`
- `provider`: exactly `youtube`
- `videoId`: exact 11-character YouTube ID
- `buttonLabel`
- `url`
- `linkLabel`
- `published`

When no strong embeddable video exists, use exactly:

`window.CMX_DAILY_VIDEO = null;`

Prefer official channels, primary sources, respected publishers, established creators or verified artists. Skip private, removed, age-restricted, graphic, deceptive or unreliable videos. Do not use rumor videos as evidence.

## Publishing

During the full daily briefing run, update the five daily runtime files defined in `briefing/news-publishing-standard.md`. This media section governs:

- `assets/daily-song.js`
- The matching primary song entry in `assets/news-data.js`
- `assets/daily-video.js`

Fetch the latest SHA before every write. Validate the primary track, recommendation tracks, Spotify links, preview URL, video ID, current edition date, login mood and cross-file consistency after publishing.

Do not edit the media renderer, synchronization script, cache loader, access gate, gate-copy script, CSS or HTML during an ordinary daily publishing run.
