(() => {
  'use strict';

  const KEY = 'continuum-control-center-theme-v1';
  const root = document.documentElement;

  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') root.dataset.theme = saved;
  } catch (_) {
    // Storage is optional. The HTML light default remains truthful and usable.
  }
})();
