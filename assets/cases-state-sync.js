(() => {
  'use strict';

  if ((window.location.pathname.replace(/\/index\.html$/i, '/').replace(/\/+$/, '') || '/') !== '/cases') return;

  window.setTimeout(() => {
    const badge = document.getElementById('backendBadge');
    const refresh = document.getElementById('refreshCases');
    if (!badge || !refresh) return;

    let loaded = false;
    const writeControlIds = [
      'createCase',
      'saveCaseState',
      'archiveCase',
      'exportCase',
      'addNote',
      'importSession'
    ];

    const synchronize = () => {
      const connected = badge.classList.contains('good') && /connected/i.test(badge.textContent || '');
      const staticMode = badge.classList.contains('warn') && /static/i.test(badge.textContent || '');

      if (connected && !loaded) {
        loaded = true;
        refresh.disabled = false;
        refresh.click();
      }

      if (staticMode) {
        refresh.disabled = true;
        writeControlIds.forEach((id) => {
          const element = document.getElementById(id);
          if (element) element.disabled = true;
        });
      }
    };

    synchronize();
    new MutationObserver(synchronize).observe(badge, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }, 0);
})();
