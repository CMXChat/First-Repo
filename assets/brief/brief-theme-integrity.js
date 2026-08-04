(() => {
  'use strict';

  const root = document.documentElement;
  const LIGHT = '#f3f6fa';
  const DARK = '#000000';
  let observer;

  function isLight() {
    return root.dataset.theme === 'light';
  }

  function ensureMeta(name, value) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      document.head.appendChild(meta);
    }
    meta.content = value;
  }

  function syncTheme() {
    const light = isLight();
    root.style.colorScheme = light ? 'light' : 'dark';
    root.dataset.themeIntegrity = 'ready';
    ensureMeta('color-scheme', light ? 'light' : 'dark');
    ensureMeta('theme-color', light ? LIGHT : DARK);

    const toggle = document.getElementById('themeToggleButton');
    if (toggle) {
      toggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
      toggle.title = light ? 'Switch to dark mode' : 'Switch to light mode';
      toggle.setAttribute('aria-pressed', String(light));
    }
  }

  function scheduleSync() {
    [0, 120, 420, 1000, 1800].forEach(delay => window.setTimeout(syncTheme, delay));
  }

  function init() {
    scheduleSync();
    if ('MutationObserver' in window) {
      observer = new MutationObserver(records => {
        if (records.some(record => record.attributeName === 'data-theme')) syncTheme();
      });
      observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    }

    document.addEventListener('click', event => {
      if (!event.target.closest?.('#themeToggleButton')) return;
      window.setTimeout(syncTheme, 0);
      window.setTimeout(syncTheme, 120);
    }, true);

    window.addEventListener('brief:ready', scheduleSync, { once: true });
    window.addEventListener('brief:preset-change', () => window.setTimeout(syncTheme, 120));
    window.addEventListener('pageshow', scheduleSync);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
