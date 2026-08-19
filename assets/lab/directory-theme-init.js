(() => {
  'use strict';
  const KEY = 'continuum-directory-theme-v1';
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') document.documentElement.dataset.theme = saved;
  } catch (_) {}

  if (!document.querySelector('script[data-library-shell-convergence]')) {
    const script = document.createElement('script');
    script.src = '/assets/lab/continuum-library-shell-convergence-v1.js?v=20260819-1';
    script.async = false;
    script.dataset.libraryShellConvergence = 'true';
    document.head.appendChild(script);
  }
})();
