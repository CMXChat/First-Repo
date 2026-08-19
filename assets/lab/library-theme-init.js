(() => {
  'use strict';
  const KEY = 'continuum-library-theme-v1';
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') document.documentElement.dataset.theme = saved;
  } catch (_) {}
})();