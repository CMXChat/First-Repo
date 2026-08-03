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
  const liveVersion = '20260803-3';

  function loadStyle(id, href) {
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(id, src, onload) {
    const existing = document.getElementById(id);
    if (existing) {
      if (onload) onload();
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = false;
    if (onload) script.addEventListener('load', onload, { once: true });
    document.head.appendChild(script);
  }

  loadStyle('briefUpgradeStyle', `/assets/brief/brief-upgrade.css?v=${upgradeVersion}`);
  loadStyle('briefLiveStyle', `/assets/brief/brief-live.css?v=${liveVersion}`);

  loadScript('briefUpgradeScript', `/assets/brief/brief-upgrade.js?v=${upgradeVersion}`, () => {
    loadScript('briefLiveDataScript', `/assets/brief/brief-live-data.js?v=${liveVersion}`, () => {
      loadScript('briefLiveScript', `/assets/brief/brief-live.js?v=${liveVersion}`, () => {
        loadScript('briefLivePatchScript', `/assets/brief/brief-live-patch.js?v=${liveVersion}`);
      });
    });
  });
})();
