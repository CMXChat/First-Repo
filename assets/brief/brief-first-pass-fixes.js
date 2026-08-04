(() => {
  'use strict';

  function validHttps(value) {
    try {
      return new URL(String(value || '')).protocol === 'https:';
    } catch {
      return false;
    }
  }

  function initialize() {
    const song = window.CMX_DAILY_SONG || null;
    const option = document.getElementById('musicOnEntry');
    const gateCopy = document.getElementById('gateSongName');
    const previewNote = document.getElementById('musicPreviewNote');
    const hasPreview = Boolean(song && validHttps(song.previewUrl));

    if (option) {
      option.disabled = !hasPreview;
      option.checked = hasPreview;
      option.setAttribute('aria-disabled', String(!hasPreview));
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
