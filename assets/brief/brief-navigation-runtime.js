(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const VIEW_TO_PRESET = {
    personal: 'individual',
    relationship: 'couple',
    business: 'partners',
    trainer: 'trainer',
    team: 'team'
  };
  const PRESET_TO_VIEW = Object.fromEntries(Object.entries(VIEW_TO_PRESET).map(([view, preset]) => [preset, view]));
  const TAB_BY_ROUTE = {
    individual: { overview: 'overview', day: 'day', work: 'work', finance: 'money', wellness: 'wellness', actions: 'work', schedule: 'day', intelligence: 'intelligence', memory: 'intelligence' },
    couple: { overview: 'overview', together: 'together', profiles: 'profiles', plans: 'plans', watch: 'watch', reflection: 'reflection', shared: 'together' },
    partners: { overview: 'overview', executive: 'overview', finance: 'finance', projects: 'projects', decisions: 'decisions', markets: 'markets', partners: 'partners', actions: 'projects' },
    trainer: { overview: 'overview', today: 'today', habits: 'habits', progress: 'progress', recovery: 'recovery', coach: 'coach', schedule: 'today' },
    team: { overview: 'overview', board: 'overview', mywork: 'mywork', project: 'project', handoffs: 'handoffs', procedure: 'procedure', finance: 'finance', spaces: 'spaces' }
  };
  const CARD_ROUTES = {
    individual: { NEXT: 'day', WEATHER: 'day', PRIORITY: 'work', WORK: 'work', PERSONAL: 'wellness', BILLS: 'finance', REVIEW: 'finance', MOVEMENT: 'wellness', INTELLIGENCE: 'intelligence', MEMORY: 'memory' },
    couple: { NEXT: 'together', WEATHER: 'plans', PRIORITY: 'plans', TOGETHER: 'together', REFLECTION: 'reflection', 'CHECK-IN': 'together', MEDIA: 'watch', PROFILES: 'profiles', SHARED: 'shared' },
    partners: { NEXT: 'projects', WEATHER: 'markets', PRIORITY: 'projects', DECISION: 'decisions', REVENUE: 'finance', MARGIN: 'finance', PIPELINE: 'finance', RECEIVABLES: 'finance', CASH: 'finance', MARKET: 'markets', PROJECTS: 'projects' },
    trainer: { NEXT: 'today', WEATHER: 'recovery', PRIORITY: 'today', WEEK: 'habits', COACH: 'coach', MOVEMENT: 'today', RECOVERY: 'recovery', PROGRESS: 'progress', HABITS: 'habits' },
    team: { NEXT: 'mywork', WEATHER: 'procedure', PRIORITY: 'mywork', PROJECT: 'project', HANDOFFS: 'handoffs', BLOCKERS: 'project', BLOCKER: 'project', BUDGET: 'finance', FINANCE: 'finance', PROCEDURE: 'procedure', SPACES: 'spaces', WORKLOAD: 'mywork' }
  };

  let initialized = false;
  let restoring = false;
  let navigationRecoveryCount = 0;
  let appAriaHidden = null;

  function preset() {
    return window.BRIEF_APP?.getPreset?.() || 'individual';
  }

  function reducedMotion() {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  }

  function currentDepth() {
    return document.body.dataset.briefDepth === 'full' ? 'full' : 'quick';
  }

  function routeFromTab(current, value) {
    const routes = TAB_BY_ROUTE[current] || {};
    if (routes[value]) return value;
    return Object.entries(routes).find(([, tab]) => tab === value)?.[0] || 'overview';
  }

  function canonicalUrl(routeId, requestedDepth, push = true) {
    const current = preset();
    const tab = TAB_BY_ROUTE[current]?.[routeId] || 'overview';
    const url = new URL(window.location.href);
    const view = PRESET_TO_VIEW[current] || 'personal';
    url.searchParams.set('view', view);
    url.searchParams.set('tab', routeId);
    url.searchParams.set('depth', requestedDepth);
    if (requestedDepth === 'quick') url.hash = 'briefWorkspace';
    else if (!url.hash) {
      const selected = $(`[data-nav-route="${routeId}"]`);
      const targetId = selected?.dataset.navTarget;
      if (targetId) url.hash = targetId;
    }
    try { history[push ? 'pushState' : 'replaceState']({ briefNavigation: true, view, tab, depth: requestedDepth }, '', url); } catch {}
    return tab;
  }

  function setQuickRoute(routeId, push = true) {
    const current = preset();
    const tab = TAB_BY_ROUTE[current]?.[routeId] || 'overview';
    const depthButton = $('[data-depth-choice="quick"]');
    if (currentDepth() !== 'quick') depthButton?.click();
    window.setTimeout(() => {
      const tabButton = $(`[data-workspace-tab="${tab}"]`);
      if (tabButton?.getAttribute('aria-selected') !== 'true') tabButton?.click();
      const workspace = $('#briefWorkspace');
      workspace?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start', inline: 'nearest' });
      window.setTimeout(() => $('#briefWorkspacePanel')?.focus({ preventScroll: true }), reducedMotion() ? 0 : 260);
      canonicalUrl(routeId, 'quick', push);
      window.BRIEF_NAVIGATION?.close?.(false);
      scheduleEnhancements();
    }, 70);
  }

  function canonicalizeFullRoute(routeId, push = true) {
    window.setTimeout(() => canonicalUrl(routeId, 'full', push), 220);
  }

  function interceptNavigation() {
    document.addEventListener('click', event => {
      const trigger = event.target.closest?.('[data-quick-route], [data-related-route], [data-nav-route], [data-context-route]');
      if (!trigger) return;
      const route = trigger.dataset.quickRoute || trigger.dataset.relatedRoute || trigger.dataset.navRoute || trigger.dataset.contextRoute;
      if (!route) return;
      if (currentDepth() === 'quick') {
        event.preventDefault();
        event.stopImmediatePropagation();
        setQuickRoute(route, true);
      } else {
        canonicalizeFullRoute(route, true);
      }
    }, true);

    document.addEventListener('keydown', event => {
      if (!['Enter', ' '].includes(event.key)) return;
      const trigger = event.target.closest?.('[data-quick-route], [data-related-route], [data-nav-route], [data-context-route]');
      if (!trigger) return;
      const route = trigger.dataset.quickRoute || trigger.dataset.relatedRoute || trigger.dataset.navRoute || trigger.dataset.contextRoute;
      if (!route) return;
      if (currentDepth() === 'quick') {
        event.preventDefault();
        event.stopImmediatePropagation();
        setQuickRoute(route, true);
      } else {
        canonicalizeFullRoute(route, true);
      }
    }, true);

    document.addEventListener('click', event => {
      const tabButton = event.target.closest?.('[data-workspace-tab]');
      if (!tabButton) return;
      const route = routeFromTab(preset(), tabButton.dataset.workspaceTab);
      window.setTimeout(() => {
        canonicalUrl(route, currentDepth(), true);
        scheduleEnhancements();
      }, 180);
    });
  }

  function requestedState() {
    const url = new URL(window.location.href);
    const requestedPreset = VIEW_TO_PRESET[url.searchParams.get('view')] || preset();
    const requestedValue = url.searchParams.get('tab') || 'overview';
    const requestedDepth = url.searchParams.get('depth') === 'full' ? 'full' : 'quick';
    const route = routeFromTab(requestedPreset, requestedValue);
    return { requestedPreset, requestedDepth, route };
  }

  function applyRequestedUrl() {
    if (restoring || document.body.classList.contains('is-locked') || !window.BRIEF_NAVIGATION) return;
    restoring = true;
    const { requestedPreset, requestedDepth, route } = requestedState();
    if (requestedPreset !== preset()) {
      window.BRIEF_NAVIGATION.switchPreset?.(requestedPreset, { route, depth: requestedDepth, push: false, focus: false });
    } else if (requestedDepth === 'quick') {
      setQuickRoute(route, false);
    } else {
      window.BRIEF_NAVIGATION.navigate?.(route, { depth: 'full', push: false, focus: false });
      canonicalizeFullRoute(route, false);
    }
    window.setTimeout(() => { restoring = false; }, 950);
  }

  function restoreUrlState() {
    $('#enterBrief')?.addEventListener('click', () => window.setTimeout(applyRequestedUrl, 720), true);
    window.addEventListener('brief:device-fallback-open', () => window.setTimeout(applyRequestedUrl, 520));
    window.addEventListener('popstate', () => window.setTimeout(applyRequestedUrl, 80));
    window.addEventListener('hashchange', () => window.setTimeout(applyRequestedUrl, 80));
    window.addEventListener('pageshow', event => {
      if (event.persisted || !document.body.classList.contains('is-locked')) window.setTimeout(applyRequestedUrl, 520);
    });
  }

  function decorateCompactLinks() {
    const panel = $('#briefWorkspacePanel');
    if (!panel || currentDepth() !== 'quick') return;
    const mapping = CARD_ROUTES[preset()] || {};
    $$('.quick-compact-list article', panel).forEach(item => {
      const label = item.querySelector('span')?.textContent?.trim().toUpperCase();
      const route = mapping[label];
      if (!route || item.dataset.quickRoute) return;
      item.dataset.quickRoute = route;
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      const title = item.querySelector('strong')?.textContent || label;
      item.setAttribute('aria-label', `${title}. Open related ${route} view.`);
    });
  }

  function keepActiveRouteVisible() {
    const active = $('#briefStickyRoutes [aria-current="location"]');
    active?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  }

  function setAppInert(enabled) {
    const app = $('#briefApp');
    if (!app) return;
    if (enabled) {
      appAriaHidden = app.getAttribute('aria-hidden');
      if ('inert' in app) app.inert = true;
      else app.setAttribute('aria-hidden', 'true');
    } else {
      if ('inert' in app) app.inert = false;
      if (appAriaHidden === null) app.removeAttribute('aria-hidden');
      else app.setAttribute('aria-hidden', appAriaHidden);
      appAriaHidden = null;
    }
  }

  function protectDrawerFocus() {
    document.addEventListener('click', event => {
      if (event.target.closest?.('#briefMapButton')) {
        window.setTimeout(() => {
          if (!$('#briefNavigationDrawer')?.hidden) setAppInert(true);
        }, 40);
      }
      if (event.target.closest?.('[data-nav-close]')) setAppInert(false);
    }, true);
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape') setAppInert(false);
    }, true);
  }

  function scheduleEnhancements() {
    [0, 100, 360, 900, 1800, 3600].forEach(delay => window.setTimeout(() => {
      decorateCompactLinks();
      keepActiveRouteVisible();
    }, delay));
  }

  function recoverNavigation() {
    if (window.BRIEF_NAVIGATION || navigationRecoveryCount >= 2 || $('#briefNavigationRecoveryScript')) return;
    navigationRecoveryCount += 1;
    const script = document.createElement('script');
    script.id = 'briefNavigationRecoveryScript';
    script.src = `/assets/brief/brief-navigation.js?v=20260803-1-recovery-${navigationRecoveryCount}`;
    script.async = false;
    script.addEventListener('load', () => {
      script.removeAttribute('id');
      window.setTimeout(patchPublicApi, 300);
      scheduleEnhancements();
    }, { once: true });
    document.head.appendChild(script);
  }

  function patchPublicApi() {
    const api = window.BRIEF_NAVIGATION;
    if (!api || api.__runtimePatched) return false;
    const originalNavigate = api.navigate?.bind(api);
    api.navigate = (route, options = {}) => {
      const requestedDepth = options.depth || currentDepth();
      if (requestedDepth === 'quick') {
        setQuickRoute(route, options.push !== false);
        return;
      }
      return originalNavigate?.(route, options);
    };
    api.__runtimePatched = true;
    if (!document.body.classList.contains('is-locked')) window.setTimeout(applyRequestedUrl, 180);
    scheduleEnhancements();
    return true;
  }

  function init() {
    if (initialized) return;
    initialized = true;
    interceptNavigation();
    restoreUrlState();
    protectDrawerFocus();
    scheduleEnhancements();
    window.addEventListener('brief:preset-change', scheduleEnhancements);
    let attempts = 0;
    const patch = () => {
      attempts += 1;
      if (patchPublicApi()) return;
      if (attempts < 32) window.setTimeout(patch, 250);
      else {
        recoverNavigation();
        window.setTimeout(() => {
          attempts = 0;
          patch();
        }, 1000);
      }
    };
    patch();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
