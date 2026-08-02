# Daily Play & Watch Rules

Target section: `spotify`
Daily video data: `assets/daily-video.js`
Daily song data: the highest-priority shared card in `assets/news-data.js` under `spotify`

## Purpose

Give Jay and Crystal one shared song and, when a strong option exists, one shared video they can play directly on `/news/`. Keep both choices light, useful, current, and easy to skip.

## Daily shared song

- Use the authorized Spotify connector.
- Include exactly one shared song when Spotify works.
- Use `audience: "shared"`, `status: "CONNECTED SOURCE"`, and the highest priority in `spotify`.
- Include the exact track and artist, a short original description, and the connector-derived Spotify track link.
- The page automatically turns the shared Spotify track into a click-to-load player.
- Do not quote lyrics, claim the song proves either person's mood, force romance, or make listening homework.
- Avoid recent repeats unless there is a clear reason.

## Daily video

When a strong selection exists, update `assets/daily-video.js` with valid UTF-8 JavaScript beginning exactly with:

`window.CMX_DAILY_VIDEO = {`

and ending with:

`};`

Use these fields:

- `audience`: normally `shared`
- `label`: normally `today's watch`
- `status`: `OFFICIAL`, `VERIFIED`, or `REPORTED`
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

Choose among comedy, a concise news explainer, scenic footage, music performance, fitness or running, animals, culture, a mini-documentary, or another useful current video. It may match the shared song when the official music video is the strongest choice.

## Video safety and quality

- Prefer official channels, primary sources, respected publishers, established creators, or verified artists.
- Verify the exact video ID and that the watch page exists.
- Prefer videos that are embeddable. Skip videos that are age-restricted, private, removed, highly graphic, deceptive, invasive, or likely to fail in an iframe.
- Do not use a rumor video as evidence for a factual claim.
- Do not select distressing news merely because it is dramatic.
- Keep political videos factual and proportionate. Avoid campaign propaganda as casual entertainment.
- Do not use private-person content, leaked material, stolen uploads, or reuploads when an official source exists.
- Do not quote lyrics or reproduce copyrighted transcripts.

## Player behavior

- Players load only after a user taps them.
- The page does not autoplay media before interaction.
- YouTube uses Privacy-Enhanced Mode through `youtube-nocookie.com`.
- Spotify and YouTube remain optional. Keep external fallback links.
- Skip the video cleanly when no strong embeddable selection exists. Do not publish an empty card or missing-video notice.

## Publishing

The daily briefing task may update both:

1. `assets/news-data.js`
2. `assets/daily-video.js`

Fetch the latest SHA for each file immediately before updating it. Validate both files after writing. Do not edit the media renderer, CSS, page gate, or HTML during an ordinary daily publishing run.
