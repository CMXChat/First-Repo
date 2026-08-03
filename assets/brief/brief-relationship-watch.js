(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  let initialized = false;
  let retryTimer = 0;
  let retryCount = 0;

  function currentPreset() {
    return window.BRIEF_APP?.getPreset?.() || 'individual';
  }

  function validVideo() {
    const video = window.CMX_DAILY_VIDEO;
    if (!video || video.provider !== 'youtube') return null;
    const videoId = String(video.videoId || '').trim();
    if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) return null;
    return { ...video, videoId };
  }

  function youtubeEmbed(videoId) {
    const params = new URLSearchParams({ autoplay: '1', rel: '0', modestbranding: '1', playsinline: '1' });
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${params.toString()}`;
  }

  function createCard(video) {
    const section = document.createElement('section');
    section.id = 'relationshipDailyWatch';
    section.className = 'relationship-daily-watch';
    section.dataset.relationshipWatch = 'true';
    section.innerHTML = `
      <div class="relationship-watch-heading">
        <div><p class="micro-label">TODAY’S WATCH · SHARED MEDIA</p><h3>${video.title || 'Today’s watch'}</h3></div>
        <span>${video.status || 'OFFICIAL VIDEO'}</span>
      </div>
      <p class="relationship-watch-copy">${video.text || 'A daily shared watch selected for the relationship briefing.'}</p>
      <div class="relationship-watch-player" data-video-id="${video.videoId}">
        <button type="button" class="relationship-watch-poster" aria-label="${video.buttonLabel || `Play ${video.title || 'today’s watch'}`}">
          <img src="https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg" alt="" loading="lazy" />
          <span aria-hidden="true">▶</span>
          <strong>${video.buttonLabel || 'Play the official video'}</strong>
        </button>
      </div>
      <div class="relationship-watch-footer">
        <small>${video.published || 'Official public video'}</small>
        <a href="${video.url || `https://www.youtube.com/watch?v=${video.videoId}`}" target="_blank" rel="noopener noreferrer">${video.linkLabel || 'Open on YouTube'}</a>
      </div>`;

    const player = $('.relationship-watch-player', section);
    $('.relationship-watch-poster', section)?.addEventListener('click', () => {
      if (!player || player.dataset.loaded === 'true') return;
      player.dataset.loaded = 'true';
      const iframe = document.createElement('iframe');
      iframe.title = `${video.title || 'Today’s watch'} official video`;
      iframe.src = youtubeEmbed(video.videoId);
      iframe.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      player.replaceChildren(iframe);
    });

    return section;
  }

  function render() {
    const existing = $('#relationshipDailyWatch');
    if (currentPreset() !== 'couple') {
      existing?.remove();
      return true;
    }

    const video = validVideo();
    const addon = $('#scenarioExperienceAddon');
    if (!video) return true;
    if (!addon) return false;

    if (existing?.dataset.videoId === video.videoId) return true;
    existing?.remove();

    const card = createCard(video);
    card.dataset.videoId = video.videoId;
    const culture = $('.culture-stream', addon);
    if (culture) culture.insertAdjacentElement('beforebegin', card);
    else addon.appendChild(card);
    return true;
  }

  function scheduleRender() {
    window.clearTimeout(retryTimer);
    retryCount = 0;

    const attempt = () => {
      retryCount += 1;
      const complete = render();
      if (!complete && retryCount < 12) retryTimer = window.setTimeout(attempt, 250);
    };

    attempt();
  }

  function init() {
    if (initialized || !window.BRIEF_APP) return;
    initialized = true;
    scheduleRender();
    window.addEventListener('brief:preset-change', () => window.setTimeout(scheduleRender, 120));
    window.addEventListener('brief:device-fallback-open', () => window.setTimeout(scheduleRender, 120));
  }

  window.addEventListener('brief:ready', init, { once: true });
  if (window.BRIEF_APP) init();
  else document.addEventListener('DOMContentLoaded', () => window.setTimeout(init, 900), { once: true });
})();
