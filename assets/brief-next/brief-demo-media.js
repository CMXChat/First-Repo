(() => {
  'use strict';

  const state = {
    scenarioId: '',
    audio: null,
    playing: false,
    entryPlaybackRequested: false
  };

  const $ = selector => document.querySelector(selector);

  function scenario(id = state.scenarioId) {
    return window.BRIEF_DEMO_DATA?.scenarios?.[id] || null;
  }

  function track(id = state.scenarioId) {
    return scenario(id)?.soundtrack || null;
  }

  function setStatus(message) {
    const node = $('#mediaStatus');
    if (node) node.textContent = message;
  }

  function syncButton() {
    const button = $('#previewButton');
    if (!button) return;
    const current = track();
    const available = Boolean(current?.previewUrl);
    button.disabled = !available;
    button.setAttribute('aria-pressed', String(state.playing));
    if (!available) {
      button.textContent = 'Preview unavailable in Phase 1';
      return;
    }
    button.textContent = state.playing ? 'Pause soundtrack preview' : 'Play soundtrack preview';
  }

  function destroyAudio() {
    if (!state.audio) return;
    state.audio.pause();
    state.audio.src = '';
    state.audio = null;
    state.playing = false;
  }

  function buildAudio(current) {
    destroyAudio();
    if (!current?.previewUrl) {
      syncButton();
      return;
    }

    const audio = new Audio(current.previewUrl);
    audio.preload = 'metadata';
    audio.volume = 0.32;
    audio.addEventListener('play', () => {
      state.playing = true;
      setStatus(`Playing the authorized preview of ${current.title}.`);
      syncButton();
    });
    audio.addEventListener('pause', () => {
      state.playing = false;
      syncButton();
    });
    audio.addEventListener('ended', () => {
      state.playing = false;
      audio.currentTime = 0;
      setStatus('Preview complete. Spotify remains available for provider playback.');
      syncButton();
    });
    audio.addEventListener('error', () => {
      state.playing = false;
      setStatus('The preview could not load. Use the Spotify player instead.');
      syncButton();
    });
    state.audio = audio;
    syncButton();
  }

  function setScenario(id) {
    const current = scenario(id);
    if (!current) return;
    state.scenarioId = id;
    const currentTrack = current.soundtrack;

    const title = $('#trackTitle');
    const artist = $('#trackArtist');
    const note = $('#trackNote');
    const frame = $('#spotifyFrame');

    if (title) title.textContent = currentTrack.title;
    if (artist) artist.textContent = currentTrack.artist;
    if (note) note.textContent = currentTrack.note;
    if (frame) {
      frame.src = `https://open.spotify.com/embed/track/${encodeURIComponent(currentTrack.spotifyTrackId)}?utm_source=generator&theme=0`;
      frame.title = `Play ${currentTrack.title} by ${currentTrack.artist} on Spotify`;
    }

    buildAudio(currentTrack);
    if (currentTrack.previewUrl) {
      setStatus('The authorized preview can start from the entry click or the preview control.');
    } else if (state.entryPlaybackRequested) {
      setStatus('A soundtrack was requested, but this Phase 1 record has no authorized preview URL. Use the Spotify player with a direct tap.');
    } else {
      setStatus('Phase 1 establishes one media controller. Authorized preview playback and browser fallback testing are completed in the media phase.');
    }
  }

  async function playPreview() {
    const current = track();
    if (!current?.previewUrl || !state.audio) {
      setStatus('No authorized preview is configured yet. Spotify remains available with a direct tap.');
      syncButton();
      return false;
    }

    try {
      await state.audio.play();
      return true;
    } catch {
      state.playing = false;
      setStatus('The browser blocked preview playback. Tap the preview control to try again.');
      syncButton();
      return false;
    }
  }

  function pause() {
    if (!state.audio) return;
    state.audio.pause();
  }

  function togglePreview() {
    if (state.audio && !state.audio.paused) {
      pause();
      return;
    }
    playPreview();
  }

  function requestEntryPlayback(id, enabled) {
    state.entryPlaybackRequested = Boolean(enabled);
    setScenario(id);
    if (!enabled) return false;

    /*
     * This call is intentionally made synchronously from the user's Open demo
     * click by brief-demo-app.js. Phase 3 will add authorized preview URLs and
     * browser-specific verification without changing the ownership model.
     */
    if (!state.audio) {
      setStatus('A soundtrack was requested, but no authorized preview is configured yet. Spotify requires a direct provider tap.');
      return false;
    }
    playPreview();
    return true;
  }

  function open() {
    const drawer = $('#mediaDrawer');
    const button = $('#mediaButton');
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    button?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    drawer.querySelector('[data-close-media]')?.focus({ preventScroll: true });
  }

  function close() {
    const drawer = $('#mediaDrawer');
    const button = $('#mediaButton');
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    button?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    button?.focus({ preventScroll: true });
  }

  function reset() {
    pause();
    close();
    state.entryPlaybackRequested = false;
  }

  window.BRIEF_DEMO_MEDIA = {
    setScenario,
    requestEntryPlayback,
    togglePreview,
    playPreview,
    pause,
    open,
    close,
    reset
  };
})();
