(() => {
  'use strict';

  const song = window.CMX_DAILY_SONG;
  const brief = window.CMX_NEWS_BRIEF;
  if (!song || !brief) return;

  const primary = {
    audience: song.audience || "shared",
    priority: Number(song.priority || 100),
    label: song.label || "today's shared song",
    status: song.status || "DAILY PICK",
    title: song.displayTitle || `${song.title} · ${song.artist}`,
    text: song.text || "Today's shared song.",
    directLines: song.directLine ? [{ audience: "shared", text: song.directLine }] : [],
    url: song.spotifyUrl,
    linkLabel: song.spotifyLinkLabel || `play ${song.title} on Spotify`,
    published: song.published || song.selectedFor || "today's shared pick",
    isDailySong: true
  };

  const recommendations = (Array.isArray(song.recommendations) ? song.recommendations : [])
    .filter(item => item?.spotifyUrl && item?.title)
    .map((item, index) => ({
      audience: item.audience || "shared",
      priority: Number(item.priority || 75 - index),
      label: item.label || "more music for today",
      status: item.status || "RECOMMENDED",
      title: item.title,
      text: item.text || "A supporting song for today's briefing.",
      directLines: Array.isArray(item.directLines) ? item.directLines : [],
      url: item.spotifyUrl,
      linkLabel: item.spotifyLinkLabel || "play on Spotify",
      published: item.published || "today's extra pick",
      isDailySong: false
    }));

  brief.spotify = [primary, ...recommendations];
})();
