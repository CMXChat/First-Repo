(() => {
  'use strict';

  const map = document.getElementById('newsSectionMap');
  if (!map) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let syncing = false;

  function isQuick() {
    return document.body.dataset.newsDepth === 'quick' || document.body.classList.contains('news-workspace-quick');
  }

  function selectQuickBeforeTab() {
    if (syncing || isQuick()) return;
    syncing = true;
    $('[data-workspace-depth="quick"]')?.click();
    window.requestAnimationFrame(() => { syncing = false; });
  }

  function correctBareFullUrl() {
    const url = new URL(window.location.href);
    const hash = url.hash.replace(/^#/, '');
    if (url.searchParams.get('view') !== 'full' || (hash && hash !== 'newsWorkspace')) return;
    syncing = true;
    $('[data-workspace-depth="full"]')?.click();
    url.hash = 'priority';
    window.history.replaceState({}, '', url);
    window.requestAnimationFrame(() => {
      document.getElementById('priority')?.scrollIntoView({ block: 'start' });
      syncing = false;
    });
  }

  function refreshDrawerCurrent() {
    const quick = isQuick();
    const tab = $('[data-workspace-tab][aria-selected="true"]')?.dataset.workspaceTab || 'overview';
    const hash = window.location.hash.replace(/^#/, '');
    $$('[data-news-quick-tab]').forEach(button => {
      const active = quick && button.dataset.newsQuickTab === tab;
      button.classList.toggle('is-current', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    $$('[data-news-drawer-target]').forEach(button => {
      const active = !quick && button.dataset.newsDrawerTarget === hash;
      button.classList.toggle('is-current', active);
      if (active) button.setAttribute('aria-current', 'location');
      else button.removeAttribute('aria-current');
    });
  }

  $$('[data-workspace-tab]').forEach(button => {
    button.addEventListener('click', selectQuickBeforeTab, true);
  });

  $('#newsOpenSectionDrawer')?.addEventListener('click', () => {
    window.requestAnimationFrame(refreshDrawerCurrent);
  });

  window.addEventListener('popstate', () => window.setTimeout(correctBareFullUrl, 0));
  correctBareFullUrl();
})();
