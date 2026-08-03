(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  let initialized = false;

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
      return;
    }

    const video = validVideo();
    const addon = $('#scenarioExperienceAddon');
    if (!video || !addon) return;

    if (existing?.dataset.videoId === video.videoId) return;
    existing?.remove();

    const card = createCard(video);
    card.dataset.videoId = video.videoId;
    const culture = $('.culture-stream', addon);
    if (culture) culture.insertAdjacentElement('beforebegin', card);
    else addon.appendChild(card);
  }

  function init() {
    if (initialized || !window.BRIEF_APP) return;
    initialized = true;
    render();
    window.addEventListener('brief:preset-change', () => window.setTimeout(render, 180));

    if ('MutationObserver' in window) {
      const observer = new MutationObserver(() => render());
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  window.addEventListener('brief:ready', init, { once: true });
  if (window.BRIEF_APP) init();
  else document.addEventListener('DOMContentLoaded', () => window.setTimeout(init, 900), { once: true });
})();
