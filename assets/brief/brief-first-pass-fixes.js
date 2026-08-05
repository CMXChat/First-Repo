(() => {
  'use strict';

  let preferenceTouched = false;

  function validHttps(value) {
    try {
      return new URL(String(value || '')).protocol === 'https:';
    } catch {
      return false;
    }
  }

  function applyMusicPreference() {
    const song = window.CMX_DAILY_SONG || null;
    const option = document.getElementById('musicOnEntry');
    const gateCopy = document.getElementById('gateSongName');
    const previewNote = document.getElementById('musicPreviewNote');
    const hasPreview = Boolean(song && validHttps(song.previewUrl));

    if (option) {
      if (option.dataset.firstPassMusicBound !== 'true') {
        option.dataset.firstPassMusicBound = 'true';
        option.addEventListener('change', () => {
          preferenceTouched = true;
        });
      }
      option.disabled = !hasPreview;
      option.setAttribute('aria-disabled', String(!hasPreview));
      if (!preferenceTouched) option.checked = hasPreview;
    }

    if (gateCopy) {
      gateCopy.textContent = hasPreview
        ? 'A 30-second authorized preview will start after you press Enter.'
        : 'No authorized preview is available today. Use the Spotify player after entry.';
    }

    document.getElementById('musicPreviewAttribution')?.remove();
    if (!previewNote || !hasPreview || !validHttps(song.previewSourceUrl)) return;

    const attribution = document.createElement('p');
    attribution.id = 'musicPreviewAttribution';
    attribution.className = 'music-preview-attribution';

    const text = document.createElement('span');
    text.textContent = song.previewAttribution || `Preview provided courtesy of ${song.previewProvider || 'the music provider'}.`;

    const link = document.createElement('a');
    link.href = song.previewSourceUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `View on ${song.previewProvider || 'provider'}`;

    attribution.append(text, document.createTextNode(' '), link);
    previewNote.insertAdjacentElement('afterend', attribution);
  }

  function initialize() {
    applyMusicPreference();
    [0, 120, 420, 900, 1600].forEach(delay => window.setTimeout(applyMusicPreference, delay));
    window.addEventListener('brief:ready', applyMusicPreference);
    window.addEventListener('brief:device-fallback-open', applyMusicPreference);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
