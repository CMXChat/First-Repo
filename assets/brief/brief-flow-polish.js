(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const TYPE_CONTROLS = '#enterBrief, [data-scenario-choice], [data-footer-preset], [data-quick-preset], [data-dock-preset], [data-drawer-preset]';
  const QUICK_ROUTE_CONTROLS = '[data-workspace-tab], [data-quick-route], [data-related-route], [data-nav-route], [data-context-route]';
  const ROUTES = {
    individual: [['overview', 'Overview'], ['day', 'Day'], ['work', 'Work'], ['finance', 'Finance'], ['wellness', 'Wellness'], ['intelligence', 'Intelligence'], ['memory', 'Memory']],
    couple: [['overview', 'Overview'], ['together', 'Together'], ['profiles', 'Profiles'], ['plans', 'Plans'], ['watch', 'Watch'], ['reflection', 'Reflection'], ['shared', 'Shared space']],
    partners: [['overview', 'Overview'], ['executive', 'Executive pulse'], ['finance', 'Finance'], ['projects', 'Projects'], ['decisions', 'Decisions'], ['markets', 'Markets'], ['partners', 'Partners']],
    trainer: [['overview', 'Overview'], ['today', 'Today'], ['habits', 'Habits'], ['progress', 'Progress'], ['recovery', 'Recovery'], ['coach', 'Coach'], ['schedule', 'Schedule']],
    team: [['overview', 'Overview'], ['board', 'Operating board'], ['mywork', 'My work'], ['project', 'Project'], ['handoffs', 'Handoffs'], ['procedure', 'Procedure'], ['finance', 'Finance'], ['spaces', 'Spaces']]
  };
  const TAB_TO_ROUTE = {
    individual: { overview: 'overview', day: 'day', work: 'work', money: 'finance', wellness: 'wellness', intelligence: 'intelligence' },
    couple: { overview: 'overview', together: 'together', profiles: 'profiles', plans: 'plans', watch: 'watch', reflection: 'reflection' },
    partners: { overview: 'overview', finance: 'finance', projects: 'projects', decisions: 'decisions', markets: 'markets', partners: 'partners' },
    trainer: { overview: 'overview', today: 'today', habits: 'habits', progress: 'progress', recovery: 'recovery', coach: 'coach' },
    team: { overview: 'overview', mywork: 'mywork', project: 'project', handoffs: 'handoffs', procedure: 'procedure', finance: 'finance', spaces: 'spaces' }
  };

  let initialized = false;
  let resetToken = 0;
  let userCancelledReset = false;
  let lastPreset = '';

  function preset() {
    return window.BRIEF_APP?.getPreset?.() || 'individual';
  }

  function depth() {
    return document.body.dataset.briefDepth === 'full' ? 'full' : 'quick';
  }

  function reducedMotion() {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  }

  function topOffset() {
    const topbarHeight = $('.topbar')?.getBoundingClientRect().height || 0;
    const navigatorHeight = $('#briefNavigatorBar')?.getBoundingClientRect().height || 0;
    const mobile = window.matchMedia?.('(max-width: 760px)').matches;
    return Math.max(20, topbarHeight + (mobile ? 14 : Math.min(navigatorHeight, 54)) + 12);
  }

  function scrollElementIntoUsefulView(target, focus = true) {
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - topOffset();
    window.scrollTo({ top: Math.max(0, top), left: 0, behavior: reducedMotion() ? 'auto' : 'smooth' });
    if (!focus) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    window.setTimeout(() => {
      try { target.focus({ preventScroll: true }); } catch {}
    }, reducedMotion() ? 0 : 260);
  }

  function usefulQuickTarget() {
    const panel = $('#briefWorkspacePanel');
    if (!panel) return null;
    return $('.quick-signal-grid, .quick-compact-list, .quick-timeline, .quick-overview-lower, .quick-watch-card, .quick-quote-card, .quick-dayline, .full-workspace-open', panel) || panel;
  }

  function landOnQuickContent() {
    if (depth() !== 'quick') return;
    const target = usefulQuickTarget();
    if (!target) return;
    scrollElementIntoUsefulView(target, true);
    document.documentElement.dataset.briefContentLanded = 'true';
  }

  function scheduleQuickLanding() {
    [100, 260, 520].forEach(delay => window.setTimeout(() => {
      if (!document.body.classList.contains('is-locked')) landOnQuickContent();
    }, delay));
  }

  function forceDocumentTop() {
    const scroller = document.scrollingElement || document.documentElement;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    if (scroller) scroller.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }

  function cancelTopReset() {
    userCancelledReset = true;
  }

  function settleAtTrueTop(duration = 1250) {
    resetToken += 1;
    const token = resetToken;
    userCancelledReset = false;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    [0, 40, 120, 260, 480, 760, 1040, duration].forEach(delay => window.setTimeout(() => {
      if (token !== resetToken || userCancelledReset) return;
      forceDocumentTop();
      try { $('#briefMain')?.focus?.({ preventScroll: true }); } catch {}
      document.documentElement.dataset.briefEntryAtTop = 'true';
    }, delay));
  }

  function currentRoute() {
    const current = preset();
    const selectedTab = $('[data-workspace-tab][aria-selected="true"]')?.dataset.workspaceTab || 'overview';
    return TAB_TO_ROUTE[current]?.[selectedTab] || window.BRIEF_NAVIGATION?.getState?.().route || 'overview';
  }

  function updateJumpControl() {
    const select = $('#briefRouteJumpSelect');
    if (!select) return;
    const current = preset();
    const routes = ROUTES[current] || ROUTES.individual;
    const active = currentRoute();
    select.innerHTML = routes.map(([id, label]) => `<option value="${id}">${label}</option>`).join('');
    if (routes.some(([id]) => id === active)) select.value = active;
    const label = $('#briefRouteJumpLabel');
    if (label) label.textContent = depth() === 'full' ? 'Jump through full workspace' : 'Jump inside this briefing';
  }

  function ensureJumpControl() {
    if ($('#briefRouteJump')) {
      updateJumpControl();
      return;
    }
    const anchor = $('#briefNavigatorBar') || $('#briefWorkspace');
    if (!anchor) return;
    const nav = document.createElement('nav');
    nav.id = 'briefRouteJump';
    nav.className = 'brief-route-jump';
    nav.setAttribute('aria-label', 'Briefing shortcuts');
    nav.innerHTML = `
      <label for="briefRouteJumpSelect"><span id="briefRouteJumpLabel">Jump inside this briefing</span><select id="briefRouteJumpSelect"></select></label>
      <button type="button" data-flow-go>Go</button>
      <button type="button" data-open-brief-map>Map</button>
      <button type="button" data-flow-top>Top</button>`;
    anchor.insertAdjacentElement('afterend', nav);

    const go = () => {
      const route = $('#briefRouteJumpSelect')?.value || 'overview';
      window.BRIEF_NAVIGATION?.navigate?.(route, { depth: depth(), push: true, focus: true });
      if (depth() === 'quick') scheduleQuickLanding();
    };
    $('[data-flow-go]', nav)?.addEventListener('click', go);
    $('#briefRouteJumpSelect', nav)?.addEventListener('change', go);
    $('[data-flow-top]', nav)?.addEventListener('click', () => settleAtTrueTop(260));
    updateJumpControl();
  }

  function enhanceContextNavigation() {
    $$('.brief-context-nav').forEach(nav => {
      if ($('[data-flow-top]', nav)) return;
      const utility = document.createElement('div');
      utility.className = 'brief-context-utilities';
      utility.innerHTML = '<span>SHORTCUTS</span><button type="button" data-open-brief-map>Map</button><button type="button" data-flow-top>Top</button>';
      nav.prepend(utility);
      $('[data-flow-top]', utility)?.addEventListener('click', () => settleAtTrueTop(260));
    });
  }

  function refreshNavigationUi() {
    ensureJumpControl();
    updateJumpControl();
    enhanceContextNavigation();
  }

  function install() {
    if (initialized) return;
    initialized = true;
    lastPreset = preset();

    document.addEventListener('click', event => {
      const typeControl = event.target.closest?.(TYPE_CONTROLS);
      if (typeControl) settleAtTrueTop(typeControl.id === 'enterBrief' ? 1400 : 1100);

      const quickControl = event.target.closest?.(QUICK_ROUTE_CONTROLS);
      if (quickControl && depth() === 'quick') scheduleQuickLanding();

      if (event.target.closest?.('[data-flow-top]')) {
        event.preventDefault();
        settleAtTrueTop(260);
      }

      if (event.target.closest?.('[data-depth-choice], [data-workspace-tab], [data-nav-route], [data-context-route], [data-related-route]')) {
        window.setTimeout(refreshNavigationUi, 220);
      }
    }, true);

    ['wheel', 'touchstart'].forEach(type => window.addEventListener(type, cancelTopReset, { passive: true }));
    window.addEventListener('keydown', event => {
      if (['PageDown', 'ArrowDown', 'End', ' '].includes(event.key)) cancelTopReset();
    }, true);

    window.addEventListener('brief:preset-change', event => {
      const next = event.detail?.preset || preset();
      const changed = next !== lastPreset;
      lastPreset = next;
      if (changed) settleAtTrueTop(1150);
      [180, 420, 760].forEach(delay => window.setTimeout(refreshNavigationUi, delay));
    });

    window.addEventListener('brief:ready', () => {
      settleAtTrueTop(820);
      [100, 320, 760, 1400].forEach(delay => window.setTimeout(refreshNavigationUi, delay));
    }, { once: true });

    window.addEventListener('brief:navigation-close', () => window.setTimeout(refreshNavigationUi, 120));
    if (!document.body.classList.contains('is-locked')) settleAtTrueTop(1300);
    [80, 260, 680, 1300, 2400].forEach(delay => window.setTimeout(refreshNavigationUi, delay));
  }

  window.BRIEF_FLOW_POLISH = { landOnQuickContent, settleAtTrueTop, refreshNavigationUi };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
