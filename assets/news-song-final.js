(() => {
  'use strict';

  const brief = window.CMX_NEWS_BRIEF;
  if (brief) {
    brief.spotify = [
      {
        audience: "shared",
        priority: 100,
        label: "today's uplifting song",
        status: "DAILY PICK",
        title: "My Wish · Rascal Flatts",
        text: "Warm, hopeful, and centered on wanting good things for someone you love. It fits a day about rebuilding, growing, and believing the future can still become something beautiful.",
        directLines: [
          { audience: "shared", text: "Shared: let this be the soundtrack while you build the next version together." }
        ],
        url: "https://open.spotify.com/track/6Gfmj0HbpvxTdW0sdlzTDU",
        linkLabel: "play My Wish on Spotify",
        published: "today's shared pick"
      }
    ];
  }

  window.CMX_DAILY_VIDEO = {
    audience: "shared",
    label: "today's watch",
    status: "OFFICIAL",
    title: "My Wish · Rascal Flatts (Official Audio)",
    text: "The shared watch matches the song so the whole section carries one warm, uplifting mood. Play it here or open the full track whenever you want the soundtrack without extra noise.",
    provider: "youtube",
    videoId: "VLf3Qs8n_P4",
    buttonLabel: "play My Wish",
    url: "https://www.youtube.com/watch?v=VLf3Qs8n_P4",
    linkLabel: "open My Wish on YouTube",
    published: "official artist audio"
  };
})();
