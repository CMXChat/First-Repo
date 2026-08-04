(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let attempts = 0;
  let timer = 0;

  const COPY = new Map([
    ['Open full workspace map', 'Open full workspace'],
    ['Open the relevant view', 'Take me there'],
    ['The full day without the full scroll.', 'See the shape of the day at a glance.'],
    ['Five signals, one recommended move, and the deeper workspace only when it is useful.', 'The few things worth your attention right now. Everything else stays one tap away.'],
    ['Move through the briefing without hunting.', 'Jump to what you need.']
  ]);

  function reducedMotion() {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  }

  function closeMap() {
    window.BRIEF_NAVIGATION?.close?.(false);
  }

  function openFullWorkspace() {
    closeMap();
    const button = $('[data-depth-choice="full"]');
    if (button?.getAttribute('aria-pressed') !== 'true') button?.click();
    window.setTimeout(() => {
      const target = $('#briefNavigatorBar') || $('#today') || $('#briefMain');
      target?.scrollIntoView({
        behavior: reducedMotion() ? 'auto' : 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      if (target && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      window.setTimeout(() => target?.focus?.({ preventScroll: true }), reducedMotion() ? 0 : 260);
    }, 120);
  }

  function simplifyNavigator() {
    const bar = $('#briefNavigatorBar');
    if (bar) {
      bar.setAttribute('aria-label', 'Full workspace sections');
      $('#briefMapButton', bar)?.remove();
      const locationLabel = $('.brief-you-are-here small', bar);
      if (locationLabel) locationLabel.textContent = 'CURRENT SECTION';
      const quick = $('#briefBackToQuick', bar);
      if (quick) quick.textContent = 'Back to quick briefing';
    }

    $$('[data-open-full-map]').forEach(button => {
      button.removeAttribute('data-open-full-map');
      button.dataset.openFullWorkspace = 'true';
      button.textContent = 'Open full workspace';
      button.setAttribute('aria-label', 'Open the complete briefing workspace');
    });
  }

  function polishVisibleCopy(root = document) {
    const nodes = $$('button, h2, h3, h4, p, small, strong, span', root);
    nodes.forEach(node => {
      const current = node.textContent?.trim();
      const replacement = COPY.get(current);
      if (replacement) node.textContent = replacement;
    });

    const drawerTitle = $('#briefNavigationTitle');
    if (drawerTitle) drawerTitle.textContent = 'Jump to what you need.';
  }

  function apply() {
    simplifyNavigator();
    polishVisibleCopy();
    document.documentElement.dataset.briefFinalized = 'true';
  }

  function schedule(delay = 0) {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      apply();
      attempts += 1;
      if ((!$('#briefNavigatorBar') || !$('[data-depth-choice="full"]')) && attempts < 18) schedule(220);
    }, delay);
  }

  function install() {
    document.addEventListener('click', event => {
      const full = event.target.closest?.('[data-open-full-workspace], [data-open-full-map]');
      if (full) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openFullWorkspace();
        return;
      }

      if (event.target.closest?.('[data-depth-choice="full"]')) {
        closeMap();
        window.setTimeout(apply, 100);
      }

      if (event.target.closest?.('[data-depth-choice], [data-workspace-tab], [data-quick-route], [data-related-route], [data-quick-preset], [data-scenario-choice], [data-footer-preset], [data-dock-preset]')) {
        window.setTimeout(apply, 180);
      }
    }, true);

    window.addEventListener('brief:preset-change', () => window.setTimeout(apply, 260));
    window.addEventListener('brief:device-fallback-open', () => window.setTimeout(apply, 220));
    window.addEventListener('brief:ready', () => schedule(120), { once: true });
    schedule(80);
  }

  window.BRIEF_FINALIZE = { apply, openFullWorkspace };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
