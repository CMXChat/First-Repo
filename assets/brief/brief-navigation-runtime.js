(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const VIEW_TO_PRESET = {
    personal: 'individual',
    relationship: 'couple',
    business: 'partners',
    trainer: 'trainer',
    team: 'team'
  };
  const TAB_BY_ROUTE = {
    individual: { overview: 'overview', day: 'day', work: 'work', finance: 'money', wellness: 'wellness', actions: 'work', schedule: 'day', intelligence: 'intelligence', memory: 'intelligence' },
    couple: { overview: 'overview', together: 'together', profiles: 'profiles', plans: 'plans', watch: 'watch', reflection: 'reflection', shared: 'together' },
    partners: { overview: 'overview', executive: 'overview', finance: 'finance', projects: 'projects', decisions: 'decisions', markets: 'markets', partners: 'partners', actions: 'projects' },
    trainer: { overview: 'overview', today: 'today', habits: 'habits', progress: 'progress', recovery: 'recovery', coach: 'coach', schedule: 'today' },
    team: { overview: 'overview', board: 'overview', mywork: 'mywork', project: 'project', handoffs: 'handoffs', procedure: 'procedure', finance: 'finance', spaces: 'spaces' }
  };

  let initialized = false;

  function preset() {
    return window.BRIEF_APP?.getPreset?.() || 'individual';
  }

  function reducedMotion() {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  }

  function currentDepth() {
    return document.body.dataset.briefDepth === 'full' ? 'full' : 'quick';
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

      const url = new URL(window.location.href);
      const view = Object.entries(VIEW_TO_PRESET).find(([, value]) => value === current)?.[0] || 'personal';
      url.searchParams.set('view', view);
      url.searchParams.set('tab', tab);
      url.searchParams.set('depth', 'quick');
      url.hash = 'briefWorkspace';
      try { history[push ? 'pushState' : 'replaceState']({ briefNavigation: true, view, tab, depth: 'quick' }, '', url); } catch {}
      window.BRIEF_NAVIGATION?.close?.(false);
    }, 70);
  }

  function interceptQuickNavigation() {
    document.addEventListener('click', event => {
      if (currentDepth() !== 'quick') return;
      const trigger = event.target.closest?.('[data-quick-route], [data-related-route], [data-nav-route]');
      if (!trigger) return;
      const route = trigger.dataset.quickRoute || trigger.dataset.relatedRoute || trigger.dataset.navRoute;
      if (!route) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setQuickRoute(route, true);
    }, true);

    document.addEventListener('keydown', event => {
      if (currentDepth() !== 'quick' || !['Enter', ' '].includes(event.key)) return;
      const trigger = event.target.closest?.('[data-quick-route], [data-related-route], [data-nav-route]');
      if (!trigger) return;
      const route = trigger.dataset.quickRoute || trigger.dataset.relatedRoute || trigger.dataset.navRoute;
      if (!route) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setQuickRoute(route, true);
    }, true);
  }

  function restoreUrlAfterEntry() {
    $('#enterBrief')?.addEventListener('click', () => {
      window.setTimeout(() => {
        if (document.body.classList.contains('is-locked')) return;
        const url = new URL(window.location.href);
        const requestedPreset = VIEW_TO_PRESET[url.searchParams.get('view')] || preset();
        const requestedTab = url.searchParams.get('tab') || 'overview';
        const requestedDepth = url.searchParams.get('depth') === 'full' ? 'full' : 'quick';
        const route = Object.entries(TAB_BY_ROUTE[requestedPreset] || {}).find(([, tab]) => tab === requestedTab)?.[0] || 'overview';
        if (requestedPreset !== preset()) {
          window.BRIEF_NAVIGATION?.switchPreset?.(requestedPreset, { route, depth: requestedDepth, push: false, focus: false });
        } else if (requestedDepth === 'quick') {
          setQuickRoute(route, false);
        } else {
          window.BRIEF_NAVIGATION?.navigate?.(route, { depth: 'full', push: false, focus: false });
        }
      }, 720);
    }, true);
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
    return true;
  }

  function init() {
    if (initialized) return;
    initialized = true;
    interceptQuickNavigation();
    restoreUrlAfterEntry();
    let attempts = 0;
    const patch = () => {
      attempts += 1;
      if (!patchPublicApi() && attempts < 24) window.setTimeout(patch, 250);
    };
    patch();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
