# Daily Play and Watch Rules

Target section: `spotify`
Daily song data: `assets/daily-song.js`
Daily briefing data: `assets/news-data.js`
Daily video data: `assets/daily-video.js`

## Purpose

Give Jay and Crystal one shared song every day and, when a strong option exists, one shared video they can play directly on `/news/`. Keep both choices light, useful, current and easy to skip.

The current song is never a permanent site setting. It is only the selection for that edition. Choose a new song on the next daily run unless there is a clear editorial reason to repeat one.

## Daily shared song

- Use the authorized Spotify connector when available.
- Choose exactly one shared song for each daily edition.
- Match the day’s mood and strongest themes without claiming the song proves either person’s emotions.
- Prefer an uplifting, warm, energizing, playful or emotionally appropriate choice.
- Avoid recent repeats. Review prior daily files or recent commit history before selecting.
- A repeat is allowed only when the song has a clear new reason to return. State that reason in the internal run summary.
- Do not quote lyrics, force romance or make listening homework.
- Use the exact track and artist, a short original description and the connector-derived Spotify track link.
- Find and verify a lawful public preview URL when available. Prefer a Spotify-hosted preview or an official Apple or iTunes preview. Never upload or copy a full copyrighted recording.
- If no preview is available, publish the Spotify selection anyway. The page will show an external music option instead of pretending autoplay is available.

## Daily song file

Replace `assets/daily-song.js` every day with valid UTF-8 JavaScript beginning exactly with:

`window.CMX_DAILY_SONG = {`

and ending with:

`};`

Use these fields:

- `audience`: normally `shared`
- `priority`: normally `100`
- `label`: normally `today's uplifting song`
- `status`: normally `DAILY PICK` or `CONNECTED SOURCE`
- `title`: exact song title
- `artist`: exact artist name
- `displayTitle`: `Song · Artist`
- `text`: one short original explanation of why it fits today
- `directLine`: one optional playful or warm shared line
- `spotifyUrl`: exact connector-derived Spotify track URL
- `spotifyLinkLabel`: concise link label
- `previewUrl`: verified lawful HTTPS preview URL, or an empty string when unavailable
- `selectedFor`: Brooklyn edition date in `YYYY-MM-DD`
- `published`: concise note such as `today's shared pick`

`assets/daily-song.js` is the authoritative source for login copy, autoplay source, accessible control labels and the visible shared-song card. Permanent rendering logic lives elsewhere and must not be copied into this daily file.

The matching `spotify` entry in `assets/news-data.js` should use the same track, artist, description and Spotify URL. If the two files briefly disagree, `assets/daily-song.js` wins on the rendered page.

## Autoplay and controls

- The song may begin only after the passphrase submission, which is the user interaction used to prime audio.
- Never autoplay before the user interacts with the gate.
- The visible hero control remains generic across editions: `Play music`, `Pause music` or `Open music` when no preview exists.
- The current song title and artist belong in the login copy, media card and accessible label.
- The hero and media-card controls must stay synchronized.
- When a browser blocks autoplay, keep a clear play option.
- When no preview exists, open the verified Spotify link instead of pretending audio can play.

## Daily video

When a strong selection exists, update `assets/daily-video.js` with valid UTF-8 JavaScript beginning exactly with:

`window.CMX_DAILY_VIDEO = {`

and ending with:

`};`

Use these fields:

- `audience`: normally `shared`
- `label`: normally `today's watch`
- `status`: `OFFICIAL`, `VERIFIED` or `REPORTED`
- `title`: exact public video title or a faithful concise title
- `text`: one short original explanation of why it was selected
- `provider`: exactly `youtube`
- `videoId`: exact 11-character YouTube video ID
- `buttonLabel`: short play instruction
- `url`: checked public YouTube watch URL
- `linkLabel`: fallback external-link label
- `published`: date or concise source note when useful

When no strong embeddable video exists, replace the file with exactly:

`window.CMX_DAILY_VIDEO = null;`

Choose among comedy, a concise news explainer, scenic footage, music performance, fitness or running, animals, culture, a mini-documentary or another useful current video. It may match the shared song when the official music video is the strongest choice, but it does not have to.

## Video safety and quality

- Prefer official channels, primary sources, respected publishers, established creators or verified artists.
- Verify the exact video ID and that the watch page exists.
- Prefer videos that are embeddable. Skip videos that are age-restricted, private, removed, highly graphic, deceptive, invasive or likely to fail in an iframe.
- Do not use a rumor video as evidence for a factual claim.
- Do not select distressing news merely because it is dramatic.
- Keep political videos factual and proportionate. Avoid campaign propaganda as casual entertainment.
- Do not use private-person content, leaked material, stolen uploads or reuploads when an official source exists.
- Do not quote lyrics or reproduce copyrighted transcripts.

## Publishing

During the full daily briefing run, update the five daily runtime files defined in `briefing/news-publishing-standard.md`. This media section specifically governs:

- `assets/daily-song.js`
- The matching song entry in `assets/news-data.js`
- `assets/daily-video.js`

Fetch the latest SHA immediately before every write. Validate exact track identity, Spotify link, preview URL, video ID, current edition date and cross-file consistency after publishing.

Do not edit the media renderer, synchronization script, cache loader, access gate, CSS or HTML during an ordinary daily publishing run.
