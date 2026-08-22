(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const initialUrl = new URL(window.location.href);
  const initialHash = decodeURIComponent(initialUrl.hash || '');
  const initialTab = initialUrl.searchParams.get('tab');
  const initialDepth = initialUrl.searchParams.get('depth');
  const initialDeepRoute = initialDepth === 'full'
    || Boolean(initialTab && initialTab !== 'overview')
    || Boolean(initialHash && initialHash !== '#today');
  const secondaryQuickSelectors = [
    '#scenarioExplorer',
    '#dailyRhythm',
    '#learning',
    '#possibilities',
    '.brief-vision-entry-card',
    '.brief-terminal-panel'
  ];

  let attempts = 0;
  let timer = 0;
  let openingVision = false;
  let entryTopUntil = 0;
  let entryTopFrame = 0;

  const COPY = new Map([
    ['Your day, already organized.', 'Choose your briefing.'],
    ['Choose a fictional example. Each version demonstrates different users, private profiles, approved shared spaces, structured memory, connected services and actions.', 'Pick a demo briefing. Each one shows a different daily view, private space and shared context.'],
    ['Here is the shape of your day.', 'Today at a glance.'],
    ['Your schedule, weather, money, messages, goals and preferred briefing style are organized around what matters next.', 'Schedule, weather, money, messages and priorities for today.'],
    ['Open full workspace map', 'Open full workspace'],
    ['Open the relevant view', 'Take me there'],
    ['The full day without the full scroll.', 'Today at a glance.'],
    ['Five signals, one recommended move, and the deeper workspace only when it is useful.', 'The few things that need attention now.'],
    ['Move through the briefing without hunting.', 'Jump to what you need.']
  ]);

  function reducedMotion() {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  }

  function clock() {
    return window.performance?.now?.() || Date.now();
  }

  function forceDocumentTop() {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  function guardEntryTop() {
    if (clock() >= entryTopUntil) return;
    if ((window.scrollY || document.documentElement.scrollTop || document.body.scrollTop) <= 1) return;
    window.cancelAnimationFrame(entryTopFrame);
    entryTopFrame = window.requestAnimationFrame(forceDocumentTop);
  }

  function keepNormalEntryAtTop() {
    if (initialDeepRoute) return;
    entryTopUntil = clock() + 1250;
    forceDocumentTop();
    [0, 80, 320, 620, 900, 1180].forEach(delay => {
      window.setTimeout(() => {
        if (clock() <= entryTopUntil + 30) forceDocumentTop();
      }, delay);
    });
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

  function openVisionAfterHelp() {
    if (openingVision) return;
    openingVision = true;
    window.BRIEF_ONBOARDING?.closeHelp?.(false);
    window.setTimeout(() => {
      window.BRIEF_VISION_TOUR?.open?.();
      openingVision = false;
    }, reducedMotion() ? 0 : 190);
  }

  function markSecondaryQuickContent() {
    document.body.classList.add('brief-streamlined-primary');
    secondaryQuickSelectors.forEach(selector => {
      $$(selector).forEach(node => node.classList.add('brief-secondary-section'));
    });
  }

  function simplifyNavigator() {
    const bar = $('#briefNavigatorBar');
    if (bar) {
      bar.setAttribute('aria-label', 'Briefing sections and map');
      const map = $('#briefMapButton', bar);
      if (map) {
        map.setAttribute('aria-label', 'Open briefing map');
        map.title = 'Open briefing map';
      }
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
    const nodes = $$('button, h1, h2, h3, h4, p, small, strong, span', root);
    nodes.forEach(node => {
      const current = node.textContent?.trim();
      const replacement = COPY.get(current);
      if (replacement) node.textContent = replacement;
    });

    const drawerTitle = $('#briefNavigationTitle');
    if (drawerTitle) drawerTitle.textContent = 'Jump to what you need.';
  }

  function apply() {
    markSecondaryQuickContent();
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
      if (event.target.closest?.('#briefStartVision')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openVisionAfterHelp();
        return;
      }

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

    window.addEventListener('scroll', guardEntryTop, { passive: true });
    window.addEventListener('brief:preset-change', () => window.setTimeout(apply, 260));
    window.addEventListener('brief:device-fallback-open', () => {
      keepNormalEntryAtTop();
      window.setTimeout(apply, 220);
    });
    window.addEventListener('brief:ready', () => schedule(120), { once: true });
    schedule(80);
  }

  window.BRIEF_FINALIZE = {
    apply,
    openFullWorkspace,
    openVisionAfterHelp,
    keepNormalEntryAtTop
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
