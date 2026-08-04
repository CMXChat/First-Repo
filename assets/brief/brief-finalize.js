(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let attempts = 0;
  let timer = 0;
  let openingVision = false;

  const COPY = new Map([
    ['Open full workspace map', 'Open full workspace'],
    ['Open the relevant view', 'See what this affects'],
    ['The full day without the full scroll.', 'Your day, without the long scroll.'],
    ['Five signals, one recommended move, and the deeper workspace only when it is useful.', 'The few things worth your attention right now. The evidence stays one tap away.'],
    ['Move through the briefing without hunting.', 'Jump to what you need.'],
    ['Quick view', 'Back to quick briefing'],
    ['You are here', 'Current section']
  ]);

  function reducedMotion() {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  }

  function navigationState() {
    return window.BRIEF_NAVIGATION?.getState?.() || {};
  }

  function drawerIsOpen() {
    const drawer = $('#briefNavigationDrawer');
    return Boolean(drawer && !drawer.hidden && drawer.classList.contains('is-visible'));
  }

  function announceNavigationState(open) {
    window.dispatchEvent(new CustomEvent(open ? 'brief:navigation-open' : 'brief:navigation-close'));
  }

  function closeMap() {
    window.BRIEF_NAVIGATION?.close?.(false);
    window.setTimeout(() => announceNavigationState(false), 20);
  }

  function openMap() {
    window.BRIEF_NAVIGATION?.open?.();
    window.setTimeout(() => announceNavigationState(drawerIsOpen()), 80);
  }

  function fallbackOpenFullWorkspace() {
    const button = $('[data-depth-choice="full"]');
    if (button?.getAttribute('aria-pressed') !== 'true') button?.click();
    window.setTimeout(() => {
      const target = $('#briefNavigatorBar') || $('#briefWorkspace') || $('#today') || $('#briefMain');
      target?.scrollIntoView({
        behavior: reducedMotion() ? 'auto' : 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      if (target && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      window.setTimeout(() => target?.focus?.({ preventScroll: true }), reducedMotion() ? 0 : 260);
    }, 120);
  }

  function openFullWorkspace(trigger = null) {
    closeMap();
    const state = navigationState();
    const route = trigger?.dataset?.fullRoute || state.route || 'overview';
    if (window.BRIEF_NAVIGATION?.navigate) {
      window.BRIEF_NAVIGATION.navigate(route, { depth: 'full', push: true, focus: true });
      return;
    }
    fallbackOpenFullWorkspace();
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

  function normalizeFullWorkspaceButtons(root = document) {
    $$('[data-open-full-map]', root).forEach(button => {
      button.removeAttribute('data-open-full-map');
      button.dataset.openFullWorkspace = 'true';
    });

    $$('.brief-related-routes', root).forEach(nav => {
      let full = $('[data-open-full-workspace]', nav);
      if (!full) {
        full = document.createElement('button');
        full.type = 'button';
        full.dataset.openFullWorkspace = 'true';
        nav.appendChild(full);
      }
      full.textContent = 'Open full workspace';
      full.setAttribute('aria-label', 'Open the complete briefing workspace at the current section');

      let map = $('[data-open-brief-map]', nav);
      if (!map) {
        map = document.createElement('button');
        map.type = 'button';
        map.dataset.openBriefMap = 'true';
        nav.appendChild(map);
      }
      map.textContent = 'Open briefing map';
      map.setAttribute('aria-label', 'Open the briefing map without changing the current view');
    });
  }

  function ensureVisionEntry() {
    const panel = $('#briefWorkspacePanel');
    if (!panel || $('[data-start-vision]', panel)) return;
    const card = document.createElement('aside');
    card.className = 'brief-vision-entry-card';
    card.innerHTML = `
      <div>
        <span>SEE THE BIGGER IDEA</span>
        <strong>Imagine this with your real music, voice, context and approved connections.</strong>
        <p>A short, visual walkthrough shows how the briefing could guide the whole day without making you read every module.</p>
      </div>
      <button type="button" data-start-vision>Start the vision walkthrough</button>`;
    const dayline = $('.quick-dayline', panel);
    if (dayline) panel.insertBefore(card, dayline);
    else panel.appendChild(card);
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

  function patchNavigationApi() {
    const api = window.BRIEF_NAVIGATION;
    if (!api || api.__productFinalized) return;
    const originalOpen = api.open?.bind(api);
    const originalClose = api.close?.bind(api);
    api.open = (...args) => {
      const result = originalOpen?.(...args);
      window.setTimeout(() => announceNavigationState(drawerIsOpen()), 40);
      return result;
    };
    api.close = (...args) => {
      const result = originalClose?.(...args);
      window.setTimeout(() => announceNavigationState(false), 20);
      return result;
    };
    api.__productFinalized = true;
  }

  function apply() {
    patchNavigationApi();
    simplifyNavigator();
    normalizeFullWorkspaceButtons();
    ensureVisionEntry();
    polishVisibleCopy();
    document.documentElement.dataset.briefFinalized = 'true';
  }

  function schedule(delay = 0) {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      apply();
      attempts += 1;
      if ((!$('#briefNavigatorBar') || !$('[data-depth-choice="full"]') || !$('#briefWorkspacePanel')) && attempts < 24) schedule(220);
    }, delay);
  }

  function install() {
    document.addEventListener('click', event => {
      const vision = event.target.closest?.('#briefStartVision, [data-start-vision]');
      if (vision) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openVisionAfterHelp();
        return;
      }

      const full = event.target.closest?.('[data-open-full-workspace], [data-open-full-map]');
      if (full) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openFullWorkspace(full);
        return;
      }

      const map = event.target.closest?.('[data-open-brief-map]');
      if (map) {
        event.preventDefault();
        event.stopImmediatePropagation();
        openMap();
        return;
      }

      if (event.target.closest?.('[data-depth-choice="full"]')) {
        closeMap();
        window.setTimeout(apply, 100);
      }

      if (event.target.closest?.('[data-nav-close], [data-nav-route], [data-nav-depth], [data-drawer-preset]')) {
        window.setTimeout(() => announceNavigationState(drawerIsOpen()), 220);
      }

      if (event.target.closest?.('[data-depth-choice], [data-workspace-tab], [data-quick-route], [data-related-route], [data-quick-preset], [data-scenario-choice], [data-footer-preset], [data-dock-preset]')) {
        window.setTimeout(apply, 180);
      }
    }, true);

    window.addEventListener('brief:preset-change', () => window.setTimeout(apply, 260));
    window.addEventListener('brief:device-fallback-open', () => window.setTimeout(apply, 220));
    window.addEventListener('brief:ready', () => schedule(120), { once: true });
    window.addEventListener('brief:navigation-open', () => document.body.classList.add('brief-map-visible'));
    window.addEventListener('brief:navigation-close', () => document.body.classList.remove('brief-map-visible'));
    schedule(80);
  }

  window.BRIEF_FINALIZE = { apply, openFullWorkspace, openMap, openVisionAfterHelp };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
