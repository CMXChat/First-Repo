window.BRIEF_CONFIG = {
  preset: 'individual',
  theme: 'black',
  appearance: 'dark',
  storagePrefix: 'cmxBriefDemo',
  effects: {
    ambientGlow: true,
    weatherMotion: true,
    cardMotion: true
  },
  controls: {
    sharedView: true,
    readAloud: true,
    music: true,
    explainMode: true
  }
};

(() => {
  'use strict';
  const upgradeVersion = '20260803-5';
  const liveVersion = '20260803-1';

  function loadStyle(key, href) {
    if (document.querySelector(`link[data-${key}]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.dataset[key] = 'true';
    document.head.appendChild(link);
  }

  function loadScript(key, src, onload) {
    if (document.querySelector(`script[data-${key}]`)) {
      if (onload) onload();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.dataset[key] = 'true';
    if (onload) script.addEventListener('load', onload, { once: true });
    document.head.appendChild(script);
  }

  loadStyle('briefUpgrade', `/assets/brief/brief-upgrade.css?v=${upgradeVersion}`);
  loadStyle('briefLive', `/assets/brief/brief-live.css?v=${liveVersion}`);

  loadScript('briefUpgrade', `/assets/brief/brief-upgrade.js?v=${upgradeVersion}`, () => {
    loadScript('briefLiveData', `/assets/brief/brief-live-data.js?v=${liveVersion}`, () => {
      loadScript('briefLive', `/assets/brief/brief-live.js?v=${liveVersion}`);
    });
  });
})();
