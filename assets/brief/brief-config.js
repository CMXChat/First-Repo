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
  const version = '20260803-5';
  if (!document.querySelector('link[data-brief-upgrade]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/assets/brief/brief-upgrade.css?v=${version}`;
    link.dataset.briefUpgrade = 'true';
    document.head.appendChild(link);
  }
  if (!document.querySelector('script[data-brief-upgrade]')) {
    const script = document.createElement('script');
    script.src = `/assets/brief/brief-upgrade.js?v=${version}`;
    script.async = false;
    script.dataset.briefUpgrade = 'true';
    document.head.appendChild(script);
  }
})();
