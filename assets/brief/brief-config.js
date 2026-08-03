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

  const build = {
    upgrade: '20260803-5',
    live: '20260803-4',
    daily: '20260803-3',
    experience: '20260803-2'
  };

  const music = document.getElementById('musicOnEntry');
  const narration = document.getElementById('readOnEntry');
  if (music) music.checked = false;
  if (narration) narration.checked = false;

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

  loadStyle('briefUpgradeStyle', `/assets/brief/brief-upgrade.css?v=${build.upgrade}`);
  loadStyle('briefLiveStyle', `/assets/brief/brief-live.css?v=${build.live}`);
  loadStyle('briefDailyStyle', `/assets/brief/brief-daily.css?v=${build.daily}`);
  loadStyle('briefExperienceStyle', `/assets/brief/brief-experience.css?v=${build.experience}`);

  loadScript('briefUpgradeScript', `/assets/brief/brief-upgrade.js?v=${build.upgrade}`, () => {
    loadScript('briefLiveDataScript', `/assets/brief/brief-live-data.js?v=${build.live}`, () => {
      loadScript('briefLiveScript', `/assets/brief/brief-live.js?v=${build.live}`, () => {
        loadScript('briefLivePatchScript', `/assets/brief/brief-live-patch.js?v=${build.live}`, () => {
          loadScript('briefDailyContentScript', `/assets/brief/brief-daily-content.js?v=${build.daily}`, () => {
            loadScript('briefDailyScript', `/assets/brief/brief-daily.js?v=${build.daily}`, () => {
              loadScript('briefExperienceGuardScript', `/assets/brief/brief-experience-guard.js?v=${build.experience}`, () => {
                loadScript('briefExperienceScript', `/assets/brief/brief-experience.js?v=${build.experience}`);
              });
            });
          });
        });
      });
    });
  });
})();
