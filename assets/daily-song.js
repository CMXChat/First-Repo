window.CMX_DAILY_SONG = {
  audience: "shared",
  priority: 100,
  label: "today's uplifting song",
  status: "DAILY PICK",
  title: "My Wish",
  artist: "Rascal Flatts",
  displayTitle: "My Wish · Rascal Flatts",
  text: "Warm, hopeful, and centered on wanting good things for someone you love. It fits a day about rebuilding, growing, and believing the future can still become something beautiful.",
  directLine: "Shared: let this be the soundtrack while you build the next version together.",
  spotifyUrl: "https://open.spotify.com/track/6Gfmj0HbpvxTdW0sdlzTDU",
  spotifyLinkLabel: "play My Wish on Spotify",
  previewUrl: "https://p.scdn.co/mp3-preview/9c0b4d2e32560e295b5770138abd247f08c7bba9.mp3",
  selectedFor: "2026-08-02",
  published: "today's shared pick"
};

(() => {
  const song = window.CMX_DAILY_SONG;
  const brief = window.CMX_NEWS_BRIEF;
  if (!song || !brief) return;

  brief.spotify = [{
    audience: song.audience || "shared",
    priority: Number(song.priority || 100),
    label: song.label || "today's shared song",
    status: song.status || "DAILY PICK",
    title: song.displayTitle || `${song.title} · ${song.artist}`,
    text: song.text || "Today's shared song.",
    directLines: song.directLine ? [{ audience: "shared", text: song.directLine }] : [],
    url: song.spotifyUrl,
    linkLabel: song.spotifyLinkLabel || `play ${song.title} on Spotify`,
    published: song.published || song.selectedFor || "today's shared pick"
  }];
})();
