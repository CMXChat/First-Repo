(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const LABELS = {
    individual: 'Personal',
    couple: 'Relationship',
    partners: 'Business',
    trainer: 'Trainer',
    team: 'Team'
  };

  let initialized = false;
  let retries = 0;

  function preset() {
    return window.BRIEF_APP?.getPreset?.() || 'individual';
  }

  function loadStyle() {
    if (document.getElementById('briefTopMapStyle')) return;
    const link = document.createElement('link');
    link.id = 'briefTopMapStyle';
    link.rel = 'stylesheet';
    link.href = '/assets/brief/brief-map-top.css?v=20260803-2';
    document.head.appendChild(link);
  }

  function drawerIsOpen() {
    const drawer = $('#briefNavigationDrawer');
    return Boolean(drawer && !drawer.hidden && drawer.classList.contains('is-visible'));
  }

  function setExpanded(expanded) {
    const button = $('#briefTopMapButton');
    if (!button) return;
    button.setAttribute('aria-expanded', String(expanded));
    button.classList.toggle('is-active', expanded);
  }

  function syncDrawerState() {
    setExpanded(drawerIsOpen());
  }

  function updateLabel() {
    const button = $('#briefTopMapButton');
    if (!button) return;
    const label = LABELS[preset()] || 'Current';
    button.setAttribute('aria-label', `Open the ${label} briefing map`);
    button.title = `${label} briefing map`;
    button.dataset.mapPreset = preset();
  }

  function createButton() {
    loadStyle();
    if ($('#briefTopMapButton')) {
      updateLabel();
      syncDrawerState();
      return true;
    }
    const actions = $('.top-actions');
    if (!actions || !window.BRIEF_NAVIGATION?.open) return false;

    const button = document.createElement('button');
    button.id = 'briefTopMapButton';
    button.className = 'icon-button brief-top-map-button';
    button.type = 'button';
    button.innerHTML = '<span aria-hidden="true">▦</span>';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', 'briefNavigationDrawer');
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      window.BRIEF_NAVIGATION?.open?.();
      window.setTimeout(syncDrawerState, 80);
    });

    const viewMode = $('#viewModeButton', actions);
    if (viewMode?.nextSibling) actions.insertBefore(button, viewMode.nextSibling);
    else if (viewMode) actions.appendChild(button);
    else actions.prepend(button);
    updateLabel();
    syncDrawerState();
    return true;
  }

  function wireDrawerState() {
    window.addEventListener('brief:navigation-open', () => setExpanded(true));
    window.addEventListener('brief:navigation-close', () => setExpanded(false));

    document.addEventListener('click', event => {
      if (event.target.closest?.('[data-nav-close], [data-nav-route], [data-nav-depth], [data-open-full-workspace]')) {
        window.setTimeout(syncDrawerState, 220);
      }
      if (event.target.closest?.('#briefMapButton, [data-open-brief-map]')) {
        window.setTimeout(syncDrawerState, 80);
      }
    }, true);

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') window.setTimeout(syncDrawerState, 30);
    });

    window.addEventListener('pageshow', () => window.setTimeout(syncDrawerState, 80));
  }

  function initialize() {
    loadStyle();
    if (initialized) return true;
    if (!createButton()) return false;
    initialized = true;
    wireDrawerState();
    window.addEventListener('brief:preset-change', () => window.setTimeout(() => {
      updateLabel();
      syncDrawerState();
    }, 120));
    window.addEventListener('brief:device-fallback-open', () => window.setTimeout(createButton, 120));
    return true;
  }

  function tryInitialize() {
    if (initialize()) return;
    retries += 1;
    if (retries < 32) window.setTimeout(tryInitialize, 250);
  }

  window.addEventListener('brief:ready', tryInitialize, { once: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tryInitialize, { once: true });
  else tryInitialize();
})();
