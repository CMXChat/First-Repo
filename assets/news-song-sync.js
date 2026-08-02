(() => {
  'use strict';

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
