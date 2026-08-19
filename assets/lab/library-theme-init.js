(() => {
  'use strict';
  const KEY = 'continuum-library-theme-v1';
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') document.documentElement.dataset.theme = saved;
  } catch (_) {}

  if (!document.querySelector('script[data-library-qa-v1]')) {
    const script = document.createElement('script');
    script.src = '/assets/lab/library-app-v1-qa.js?v=20260819-1';
    script.async = false;
    script.dataset.libraryQaV1 = 'true';
    document.head.appendChild(script);
  }
})();