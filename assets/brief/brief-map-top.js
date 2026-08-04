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
    link.href = '/assets/brief/brief-map-top.css?v=20260803-1';
    document.head.appendChild(link);
  }

  function setExpanded(expanded) {
    const button = $('#briefTopMapButton');
    if (!button) return;
    button.setAttribute('aria-expanded', String(expanded));
    button.classList.toggle('is-active', expanded);
  }

  function updateLabel() {
    const button = $('#briefTopMapButton');
    if (!button) return;
    const label = LABELS[preset()] || 'Current';
    button.setAttribute('aria-label', `Open ${label} briefing map`);
    button.title = `${label} briefing map`;
    button.dataset.mapPreset = preset();
  }

  function createButton() {
    loadStyle();
    if ($('#briefTopMapButton')) {
      updateLabel();
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
      setExpanded(true);
      window.BRIEF_NAVIGATION?.open?.();
    });

    const help = $('#explainButton', actions);
    if (help) actions.insertBefore(button, help);
    else actions.appendChild(button);
    updateLabel();
    return true;
  }

  function wireDrawerState() {
    document.addEventListener('click', event => {
      if (event.target.closest?.('[data-nav-close]')) setExpanded(false);
      if (event.target.closest?.('.brief-navigation-panel [data-nav-route], .brief-navigation-panel [data-nav-depth], .brief-navigation-panel button')) {
        window.setTimeout(() => {
          const drawer = $('#briefNavigationDrawer');
          setExpanded(Boolean(drawer && !drawer.hidden && drawer.classList.contains('is-visible')));
        }, 220);
      }
    }, true);

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') window.setTimeout(() => setExpanded(false), 30);
    });
  }

  function initialize() {
    loadStyle();
    if (initialized) return true;
    if (!createButton()) return false;
    initialized = true;
    wireDrawerState();
    window.addEventListener('brief:preset-change', () => window.setTimeout(updateLabel, 120));
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
