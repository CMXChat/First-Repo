(() => {
  'use strict';

  const path = window.location.pathname
    .replace(/\/index\.html$/i, '/')
    .replace(/\/+$/, '') || '/';
  if (path !== '/cases') return;

  const requestedCaseId = (new URLSearchParams(window.location.search).get('case') || '').slice(0, 36);

  window.setTimeout(() => {
    loadOperatorWorkspace();

    const badge = document.getElementById('backendBadge');
    const refresh = document.getElementById('refreshCases');
    const list = document.getElementById('caseList');
    if (!badge || !refresh || !list) return;

    let synchronizationStarted = false;
    let synchronizationComplete = false;
    let retryTimer = 0;
    const writeControlIds = [
      'createCase',
      'saveCaseState',
      'archiveCase',
      'exportCase',
      'addNote',
      'importSession',
      'operatorCreateRelationship',
      'custodyAddEvent'
    ];

    const connected = () => badge.classList.contains('good') && /connected/i.test(badge.textContent || '');
    const staticMode = () => badge.classList.contains('warn') && /static/i.test(badge.textContent || '');

    const scheduleSynchronization = (attempt) => {
      window.clearTimeout(retryTimer);
      retryTimer = window.setTimeout(
        () => synchronizeCases(attempt),
        attempt === 0 ? 100 : 150
      );
    };

    const synchronizeCases = async (attempt) => {
      if (synchronizationComplete || !connected()) return;

      try {
        const response = await fetch('/api/cases?limit=200', {
          credentials: 'same-origin',
          cache: 'no-store',
          headers: { accept: 'application/json' }
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const cases = await response.json();
        const buttons = list.querySelectorAll('.cases-item');

        if (!cases.length) {
          synchronizationComplete = true;
          return;
        }

        if (buttons.length >= cases.length) {
          if (requestedCaseId) {
            const index = cases.findIndex((record) => record.id === requestedCaseId);
            if (index >= 0 && buttons[index]) buttons[index].click();
          }
          synchronizationComplete = true;
          return;
        }
      } catch {
        // The visible workspace keeps its own error handling.
      }

      refresh.disabled = false;
      refresh.click();
      if (attempt < 24) scheduleSynchronization(attempt + 1);
    };

    const synchronize = () => {
      if (connected() && !synchronizationStarted) {
        synchronizationStarted = true;
        scheduleSynchronization(0);
      }

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

  function loadOperatorWorkspace() {
    installCriticalResponsiveStyle();
    loadStyle('/assets/cases-operator-workspace.css?v=20260804-1', 'workspace');
    loadStyle('/assets/cases-operator-responsive.css?v=20260804-1', 'responsive');
    loadStyle('/assets/cases-evidence-custody.css?v=20260804-1', 'custody');
    loadScript('/assets/cases-workbench-guard.js?v=20260804-1', 'guard');
    loadScript('/assets/cases-operator-workspace.js?v=20260804-1', 'workspace');
    loadScript('/assets/cases-operator-records.js?v=20260804-1', 'records');
    loadScript('/assets/cases-evidence-custody.js?v=20260804-1', 'custody');
  }

  function installCriticalResponsiveStyle() {
    if (document.querySelector('style[data-cmx-cases-critical]')) return;
    const style = document.createElement('style');
    style.dataset.cmxCasesCritical = 'true';
    style.textContent = 'html{scroll-behavior:auto!important}@media(max-width:1080px){.cases-layout>.cases-operator-sidebar{position:relative!important;top:auto!important;z-index:0!important;max-height:none!important;overflow:visible!important}.cases-layout>.cmx-card:last-child{position:relative;z-index:1;min-width:0}}@media(max-width:760px){.cases-view-tabs{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;overflow:visible!important}.cases-view-tab{width:100%!important}}';
    document.head.appendChild(style);
  }

  function loadStyle(href, role) {
    if (document.querySelector(`link[data-cmx-cases-operator="${role}"]`)) return;
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = href;
    style.dataset.cmxCasesOperator = role;
    document.head.appendChild(style);
  }

  function loadScript(src, role) {
    if (document.querySelector(`script[data-cmx-cases-operator="${role}"]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.dataset.cmxCasesOperator = role;
    document.head.appendChild(script);
  }
})();
