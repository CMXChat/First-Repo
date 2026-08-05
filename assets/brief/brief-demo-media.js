(() => {
  'use strict';

  const SPOTIFY_IFRAME_API_SRC = 'https://open.spotify.com/embed/iframe-api/v1';

  const state = {
    scenarioId: '',
    controller: null,
    controllerReady: false,
    loadedTrackId: '',
    playing: false,
    entryPlaybackRequested: false,
    apiRequested: false,
    apiFailed: false
  };

  const $ = selector => document.querySelector(selector);

  function scenario(id = state.scenarioId) {
    return window.BRIEF_DEMO_DATA?.scenarios?.[id] || null;
  }

  function track(id = state.scenarioId) {
    return scenario(id)?.soundtrack || null;
  }

  function spotifyUri(id = state.scenarioId) {
    const current = track(id);
    return current?.spotifyTrackId ? `spotify:track:${current.spotifyTrackId}` : '';
  }

  function spotifyEmbedUrl(id = state.scenarioId) {
    const current = track(id);
    if (!current?.spotifyTrackId) return '';
    return `https://open.spotify.com/embed/track/${encodeURIComponent(current.spotifyTrackId)}?utm_source=generator&theme=0`;
  }

  function setStatus(message) {
    const node = $('#mediaStatus');
    if (node) node.textContent = message;
  }

  function syncButton() {
    const button = $('#previewButton');
    if (!button) return;
    button.disabled = !state.controllerReady;
    button.setAttribute('aria-pressed', String(state.playing));
    button.textContent = state.playing
      ? 'Pause Spotify soundtrack'
      : state.controllerReady
        ? 'Play Spotify soundtrack'
        : 'Loading Spotify player...';
  }

  function normalizeSpotifyFrame() {
    const frame = document.querySelector('.media-sheet iframe[src*="open.spotify.com/embed"]');
    if (!frame) return;
    frame.id = 'spotifyFrame';
    frame.title = `Play ${track()?.title || 'the selected soundtrack'} on Spotify`;
    frame.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
    frame.setAttribute('loading', 'eager');
  }

  function renderFallbackFrame() {
    const host = $('#spotifyFrame');
    const source = spotifyEmbedUrl();
    if (!host || !source) return;

    if (host.tagName === 'IFRAME') {
      if (host.getAttribute('src') !== source) host.src = source;
      return;
    }

    const frame = document.createElement('iframe');
    frame.id = 'spotifyFrame';
    frame.title = `Play ${track()?.title || 'the selected soundtrack'} on Spotify`;
    frame.loading = 'eager';
    frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    frame.src = source;
    host.replaceWith(frame);
  }

  function loadCurrentTrack() {
    const current = track();
    if (!current?.spotifyTrackId) return;

    if (state.controllerReady && state.controller && state.loadedTrackId !== current.spotifyTrackId) {
      state.controller.loadEntity(spotifyUri());
      state.loadedTrackId = current.spotifyTrackId;
      state.playing = false;
      setStatus(`Spotify is ready with ${current.title}. Opening the demo can start it from the same click.`);
      syncButton();
      return;
    }

    if (state.apiFailed) renderFallbackFrame();
  }

  function playProvider() {
    const current = track();
    if (!state.controllerReady || !state.controller || !current) {
      setStatus('Spotify is still loading. Open the music panel and tap play if the browser does not begin automatically.');
      syncButton();
      return false;
    }

    try {
      state.controller.play();
      setStatus(`Starting ${current.title} from your Open demo click...`);
      return true;
    } catch {
      state.playing = false;
      setStatus('The browser blocked Spotify playback. Tap the soundtrack control once to start it.');
      syncButton();
      return false;
    }
  }

  function pause() {
    if (!state.controllerReady || !state.controller) return;
    try {
      state.controller.pause();
    } catch {}
  }

  function attachController(controller) {
    state.controller = controller;

    controller.addListener('ready', () => {
      state.controllerReady = true;
      state.loadedTrackId = track()?.spotifyTrackId || '';
      normalizeSpotifyFrame();
      setStatus(`Spotify is ready with ${track()?.title || 'the selected soundtrack'}.`);
      syncButton();

      if (state.entryPlaybackRequested) playProvider();
    });

    controller.addListener('playback_started', event => {
      state.playing = true;
      state.entryPlaybackRequested = false;
      setStatus(`Playing ${track()?.title || 'the selected soundtrack'} through Spotify.`);
      syncButton();
      if (event?.data?.playingURI) state.loadedTrackId = event.data.playingURI.split(':').pop();
    });

    controller.addListener('playback_update', event => {
      if (typeof event?.data?.isPaused !== 'boolean') return;
      state.playing = !event.data.isPaused;
      syncButton();
    });
  }

  function createSpotifyController(IFrameAPI) {
    const host = $('#spotifyFrame');
    const uri = spotifyUri();
    if (!host || host.tagName === 'IFRAME' || !uri || !IFrameAPI?.createController) return;

    IFrameAPI.createController(host, {
      uri,
      width: '100%',
      height: 152,
      theme: 'dark'
    }, attachController);
  }

  function installSpotifyApi() {
    if (state.apiRequested) return;
    state.apiRequested = true;

    if (window.BRIEF_SPOTIFY_IFRAME_API?.createController) {
      createSpotifyController(window.BRIEF_SPOTIFY_IFRAME_API);
      return;
    }

    window.onSpotifyIframeApiReady = IFrameAPI => createSpotifyController(IFrameAPI);

    const script = document.createElement('script');
    script.src = SPOTIFY_IFRAME_API_SRC;
    script.async = true;
    script.dataset.briefSpotifyApi = 'true';
    script.addEventListener('error', () => {
      state.apiFailed = true;
      renderFallbackFrame();
      setStatus('Spotify loaded in tap-to-play mode because its playback controller was unavailable.');
      syncButton();
    }, { once: true });
    document.head.append(script);
  }

  function setScenario(id) {
    const current = scenario(id);
    if (!current) return;
    state.scenarioId = id;
    const currentTrack = current.soundtrack;

    const title = $('#trackTitle');
    const artist = $('#trackArtist');
    const note = $('#trackNote');

    if (title) title.textContent = currentTrack.title;
    if (artist) artist.textContent = currentTrack.artist;
    if (note) note.textContent = currentTrack.note;

    installSpotifyApi();
    loadCurrentTrack();

    if (!state.controllerReady && !state.apiFailed) {
      setStatus(`Preparing ${currentTrack.title} so your Open demo click can start it.`);
    }
    syncButton();
  }

  function togglePreview() {
    if (state.playing) {
      pause();
      return;
    }
    playProvider();
  }

  function requestEntryPlayback(id, enabled) {
    state.entryPlaybackRequested = Boolean(enabled);
    setScenario(id);

    if (!enabled) {
      setStatus('Automatic soundtrack playback is off for this entry.');
      return false;
    }

    return playProvider();
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

  document.addEventListener('click', event => {
    const option = event.target.closest('[data-entry-scenario]');
    if (option?.dataset.entryScenario) setScenario(option.dataset.entryScenario);
  });

  window.BRIEF_DEMO_MEDIA = {
    setScenario,
    requestEntryPlayback,
    togglePreview,
    playPreview: playProvider,
    pause,
    open,
    close,
    reset
  };
})();
