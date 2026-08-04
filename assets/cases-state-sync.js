(() => {
  'use strict';

  const path = window.location.pathname
    .replace(/\/index\.html$/i, '/')
    .replace(/\/+$/, '') || '/';
  if (path !== '/cases') return;

  const requestedCaseId = (new URLSearchParams(window.location.search).get('case') || '').slice(0, 36);

  window.setTimeout(() => {
    const badge = document.getElementById('backendBadge');
    const refresh = document.getElementById('refreshCases');
    const list = document.getElementById('caseList');
    if (!badge || !refresh || !list) return;

    let refreshStarted = false;
    let requestedSelectionComplete = false;
    let retryTimer = 0;
    const writeControlIds = [
      'createCase',
      'saveCaseState',
      'archiveCase',
      'exportCase',
      'addNote',
      'importSession'
    ];

    const connected = () => badge.classList.contains('good') && /connected/i.test(badge.textContent || '');
    const staticMode = () => badge.classList.contains('warn') && /static/i.test(badge.textContent || '');

    const requestInitialLoad = () => {
      if (refreshStarted || !connected()) return;
      refreshStarted = true;
      window.setTimeout(() => {
        refresh.disabled = false;
        refresh.click();
        if (requestedCaseId) scheduleRequestedSelection(0);
      }, 80);
    };

    const scheduleRequestedSelection = (attempt) => {
      window.clearTimeout(retryTimer);
      retryTimer = window.setTimeout(() => selectRequestedCase(attempt), attempt ? 120 : 180);
    };

    const selectRequestedCase = async (attempt) => {
      if (!requestedCaseId || requestedSelectionComplete || !connected()) return;
      try {
        const response = await fetch('/api/cases?limit=200', {
          credentials: 'same-origin',
          cache: 'no-store',
          headers: { accept: 'application/json' }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const cases = await response.json();
        const index = cases.findIndex((record) => record.id === requestedCaseId);
        const buttons = list.querySelectorAll('.cases-item');
        if (index >= 0 && buttons[index]) {
          requestedSelectionComplete = true;
          buttons[index].click();
          return;
        }
      } catch {
        // The visible workspace keeps its own error handling.
      }

      if (attempt < 20) {
        if (attempt === 4 || attempt === 10) {
          refresh.disabled = false;
          refresh.click();
        }
        scheduleRequestedSelection(attempt + 1);
      }
    };

    const synchronize = () => {
      if (connected()) requestInitialLoad();

      if (staticMode()) {
        window.clearTimeout(retryTimer);
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
