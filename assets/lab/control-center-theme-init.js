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

  // Temporary Lab route convergence. The real shared app shell should own this
  // through the router once these surfaces move into the application frontend.
  function patchDirectoryRoutes() {
    document.querySelectorAll('a[href="/lab/"]').forEach((link) => {
      if (/directory/i.test(link.textContent || '')) link.href = '/lab/directory/';
    });
  }

  document.addEventListener('click', (event) => {
    const command = event.target.closest?.('.cc-command-item');
    if (command?.querySelector('strong')?.textContent?.trim() === 'Directory') {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.href = '/lab/directory/';
      return;
    }

    const detailAction = event.target.closest?.('#detailActionButton');
    if (detailAction && /directory/i.test(detailAction.textContent || '')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.href = '/lab/directory/';
    }
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', patchDirectoryRoutes, { once: true });
  else patchDirectoryRoutes();
})();
