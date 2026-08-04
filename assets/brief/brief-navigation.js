(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const VALID_PRESETS = ['individual', 'couple', 'partners', 'trainer', 'team'];
  const VIEW_SLUGS = {
    individual: 'personal',
    couple: 'relationship',
    partners: 'business',
    trainer: 'trainer',
    team: 'team'
  };
  const PRESET_FROM_SLUG = Object.fromEntries(Object.entries(VIEW_SLUGS).map(([preset, slug]) => [slug, preset]));
  const LABELS = {
    individual: 'Personal',
    couple: 'Relationship',
    partners: 'Business',
    trainer: 'Trainer',
    team: 'Team'
  };

  const ROUTES = {
    individual: [
      { id: 'overview', label: 'Overview', tab: 'overview', target: '#today' },
      { id: 'day', label: 'Day', tab: 'day', target: '#weather' },
      { id: 'work', label: 'Work', tab: 'work', target: '#personalCommandCenter' },
      { id: 'finance', label: 'Finance', tab: 'money', target: '#personalCommandCenter' },
      { id: 'wellness', label: 'Wellness', tab: 'wellness', target: '#scenarioExplorer' },
      { id: 'actions', label: 'Actions', tab: 'work', target: '#priorities' },
      { id: 'schedule', label: 'Schedule', tab: 'day', target: '#schedule' },
      { id: 'intelligence', label: 'Intelligence', tab: 'intelligence', target: '#livePublicLayer' },
      { id: 'memory', label: 'Memory', tab: 'intelligence', target: '#learning' }
    ],
    couple: [
      { id: 'overview', label: 'Overview', tab: 'overview', target: '#today' },
      { id: 'together', label: 'Together', tab: 'together', target: '#scenarioExplorer' },
      { id: 'profiles', label: 'Profiles', tab: 'profiles', target: '#scenarioExperienceAddon' },
      { id: 'plans', label: 'Plans', tab: 'plans', target: '#priorities' },
      { id: 'watch', label: 'Watch', tab: 'watch', target: '#relationshipDailyWatch' },
      { id: 'reflection', label: 'Reflection', tab: 'reflection', target: '#scenarioExperienceAddon' },
      { id: 'shared', label: 'Shared space', tab: 'together', target: '#sharedSpace' }
    ],
    partners: [
      { id: 'overview', label: 'Overview', tab: 'overview', target: '#today' },
      { id: 'executive', label: 'Executive pulse', tab: 'overview', target: '#briefPriorityVisuals' },
      { id: 'finance', label: 'Finance', tab: 'finance', target: '#scenarioExperienceAddon' },
      { id: 'projects', label: 'Projects', tab: 'projects', target: '#scenarioStage' },
      { id: 'decisions', label: 'Decisions', tab: 'decisions', target: '#scenarioExperienceAddon' },
      { id: 'markets', label: 'Markets', tab: 'markets', target: '#scenarioExperienceAddon' },
      { id: 'partners', label: 'Partners', tab: 'partners', target: '#scenarioExperienceAddon' },
      { id: 'actions', label: 'Actions', tab: 'projects', target: '#priorities' }
    ],
    trainer: [
      { id: 'overview', label: 'Overview', tab: 'overview', target: '#today' },
      { id: 'today', label: 'Today', tab: 'today', target: '#priorities' },
      { id: 'habits', label: 'Habits', tab: 'habits', target: '#scenarioExperienceAddon' },
      { id: 'progress', label: 'Progress', tab: 'progress', target: '#scenarioStage' },
      { id: 'recovery', label: 'Recovery', tab: 'recovery', target: '#scenarioExperienceAddon' },
      { id: 'coach', label: 'Coach', tab: 'coach', target: '#scenarioExperienceAddon' },
      { id: 'schedule', label: 'Schedule', tab: 'today', target: '#schedule' }
    ],
    team: [
      { id: 'overview', label: 'Overview', tab: 'overview', target: '#today' },
      { id: 'board', label: 'Operating board', tab: 'overview', target: '#briefPriorityVisuals' },
      { id: 'mywork', label: 'My work', tab: 'mywork', target: '#scenarioStage' },
      { id: 'project', label: 'Project', tab: 'project', target: '#scenarioStage' },
      { id: 'handoffs', label: 'Handoffs', tab: 'handoffs', target: '#scenarioStage' },
      { id: 'procedure', label: 'Procedure', tab: 'procedure', target: '#scenarioStage' },
      { id: 'finance', label: 'Finance', tab: 'finance', target: '#scenarioStage' },
      { id: 'spaces', label: 'Spaces', tab: 'spaces', target: '#sharedSpace' }
    ]
  };

  const CARD_ROUTES = {
    individual: {
      NEXT: 'day', WEATHER: 'day', PRIORITY: 'work', WORK: 'work', PERSONAL: 'wellness',
      BILLS: 'finance', REVIEW: 'finance', MOVEMENT: 'wellness', INTELLIGENCE: 'intelligence'
    },
    couple: {
      NEXT: 'together', WEATHER: 'plans', PRIORITY: 'plans', TOGETHER: 'together', REFLECTION: 'reflection',
      'CHECK-IN': 'together', MEDIA: 'watch', PROFILES: 'profiles'
    },
    partners: {
      NEXT: 'projects', WEATHER: 'markets', PRIORITY: 'projects', DECISION: 'decisions',
      REVENUE: 'finance', MARGIN: 'finance', PIPELINE: 'finance', RECEIVABLES: 'finance', CASH: 'finance', MARKET: 'markets'
    },
    trainer: {
      NEXT: 'today', WEATHER: 'recovery', PRIORITY: 'today', WEEK: 'habits', COACH: 'coach',
      MOVEMENT: 'today', RECOVERY: 'recovery', PROGRESS: 'progress'
    },
    team: {
      NEXT: 'mywork', WEATHER: 'procedure', PRIORITY: 'mywork', PROJECT: 'project', HANDOFFS: 'handoffs',
      BLOCKERS: 'project', BLOCKER: 'project', BUDGET: 'finance', FINANCE: 'finance', PROCEDURE: 'procedure', SPACES: 'spaces'
    }
  };

  const state = {
    initialized: false,
    drawerOpen: false,
    applyingUrl: false,
    currentRoute: 'overview',
    observer: null,
    scrollFrame: 0,
    returnFocus: null,
    retryCount: 0
  };

  function preset() {
    const value = window.BRIEF_APP?.getPreset?.();
    return VALID_PRESETS.includes(value) ? value : 'individual';
  }

  function depth() {
    return document.body.dataset.briefDepth === 'full' ? 'full' : 'quick';
  }

  function selectedTab() {
    return $('[data-workspace-tab][aria-selected="true"]')?.dataset.workspaceTab || 'overview';
  }

  function routeList(current = preset()) {
    return ROUTES[current] || ROUTES.individual;
  }

  function routeById(id, current = preset()) {
    return routeList(current).find(route => route.id === id) || routeList(current)[0];
  }

  function routeByTab(tab, current = preset()) {
    return routeList(current).find(route => route.tab === tab) || routeList(current)[0];
  }

  function validTab(tab, current = preset()) {
    return Boolean($(`[data-workspace-tab="${CSS.escape(tab)}"]`)) || routeList(current).some(route => route.tab === tab);
  }

  function actualTarget(route) {
    return route?.target ? $(route.target) : null;
  }

  function smoothBehavior() {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  function currentUrlState() {
    return {
      view: VIEW_SLUGS[preset()],
      tab: selectedTab(),
      depth: depth(),
      route: state.currentRoute
    };
  }

  function updateUrl({ route = state.currentRoute, mode = 'replace' } = {}) {
    if (state.applyingUrl) return;
    const current = currentUrlState();
    const url = new URL(window.location.href);
    url.searchParams.set('view', current.view);
    url.searchParams.set('tab', current.tab);
    url.searchParams.set('depth', current.depth);
    const selected = routeById(route);
    const target = actualTarget(selected);
    url.hash = target?.id ? target.id : '';
    const method = mode === 'push' ? 'pushState' : 'replaceState';
    try { history[method]({ briefNavigation: true, ...current }, '', url); } catch {}
  }

  function readUrlState() {
    const url = new URL(window.location.href);
    const view = PRESET_FROM_SLUG[url.searchParams.get('view')] || null;
    const tab = url.searchParams.get('tab') || null;
    const requestedDepth = url.searchParams.get('depth') === 'full' ? 'full' : url.searchParams.get('depth') === 'quick' ? 'quick' : null;
    const hashTarget = url.hash ? `#${decodeURIComponent(url.hash.slice(1))}` : null;
    return { view, tab, depth: requestedDepth, hashTarget };
  }

  function setDepth(nextDepth) {
    const button = $(`[data-depth-choice="${nextDepth}"]`);
    if (button && depth() !== nextDepth) button.click();
  }

  function setTab(tab) {
    const button = $(`[data-workspace-tab="${CSS.escape(tab)}"]`);
    if (button && selectedTab() !== tab) button.click();
  }

  function scrollToRoute(route, focus = false) {
    const target = actualTarget(route) || $('#briefWorkspace') || $('#today');
    if (!target) return;
    target.scrollIntoView({ behavior: smoothBehavior(), block: 'start', inline: 'nearest' });
    if (focus) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      window.setTimeout(() => target.focus({ preventScroll: true }), smoothBehavior() === 'auto' ? 0 : 320);
    }
  }

  function rememberRoute(route) {
    if (!route) return;
    const key = 'cmxBriefDemo:navigation:recent';
    try {
      const previous = JSON.parse(sessionStorage.getItem(key) || '[]');
      const item = { preset: preset(), route: route.id, label: route.label };
      const next = [item, ...previous.filter(entry => !(entry.preset === item.preset && entry.route === item.route))].slice(0, 5);
      sessionStorage.setItem(key, JSON.stringify(next));
    } catch {}
  }

  function recentRoutes() {
    try { return JSON.parse(sessionStorage.getItem('cmxBriefDemo:navigation:recent') || '[]').slice(0, 4); }
    catch { return []; }
  }

  function navigateTo(routeId, options = {}) {
    const current = preset();
    const route = routeById(routeId, current);
    const nextDepth = options.depth || depth();
    state.currentRoute = route.id;
    setDepth(nextDepth);
    window.setTimeout(() => {
      setTab(route.tab);
      window.setTimeout(() => {
        scrollToRoute(route, options.focus === true);
        rememberRoute(route);
        updateActiveUi();
        updateUrl({ route: route.id, mode: options.push === false ? 'replace' : 'push' });
        closeDrawer(false);
      }, 80);
    }, 40);
  }

  function switchPreset(nextPreset, options = {}) {
    if (!VALID_PRESETS.includes(nextPreset)) return;
    const apply = () => {
      const routes = routeList(nextPreset);
      const requested = options.route && routes.some(route => route.id === options.route) ? options.route : 'overview';
      window.setTimeout(() => navigateTo(requested, { depth: options.depth || 'quick', push: options.push, focus: options.focus }), 280);
    };
    if (preset() === nextPreset) apply();
    else {
      const once = event => {
        if (event.detail?.preset && event.detail.preset !== nextPreset) return;
        window.removeEventListener('brief:preset-change', once);
        apply();
      };
      window.addEventListener('brief:preset-change', once);
      window.BRIEF_APP?.setPreset?.(nextPreset);
      window.setTimeout(() => {
        window.removeEventListener('brief:preset-change', once);
        if (preset() === nextPreset) apply();
      }, 900);
    }
  }

  function preselectGateFromUrl() {
    const requested = readUrlState().view;
    if (!requested || !document.body.classList.contains('is-locked')) return;
    const radio = $(`input[name="briefEntryType"][value="${requested}"]`);
    if (radio && !radio.checked) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function applyUrlState() {
    const requested = readUrlState();
    state.applyingUrl = true;
    const finish = () => { state.applyingUrl = false; };
    const targetPreset = requested.view || preset();
    const targetRoute = requested.hashTarget
      ? routeList(targetPreset).find(route => route.target === requested.hashTarget)?.id
      : null;
    const route = targetRoute || (requested.tab ? routeByTab(requested.tab, targetPreset).id : 'overview');
    switchPreset(targetPreset, { route, depth: requested.depth || 'quick', push: false, focus: false });
    window.setTimeout(finish, 850);
  }

  function createBar() {
    if ($('#briefNavigatorBar')) return;
    const workspace = $('#briefWorkspace');
    if (!workspace) return;
    const bar = document.createElement('nav');
    bar.id = 'briefNavigatorBar';
    bar.className = 'brief-navigator-bar';
    bar.setAttribute('aria-label', 'Briefing map');
    bar.innerHTML = `
      <button id="briefMapButton" class="brief-map-button" type="button" aria-haspopup="dialog" aria-expanded="false"><span aria-hidden="true">⌖</span><b>Map</b></button>
      <div class="brief-you-are-here"><small>YOU ARE HERE</small><strong id="briefCurrentLocation">${LABELS[preset()]} · Overview</strong></div>
      <div id="briefStickyRoutes" class="brief-sticky-routes"></div>
      <button id="briefBackToQuick" class="brief-back-quick" type="button">Quick view</button>`;
    workspace.insertAdjacentElement('beforebegin', bar);
    $('#briefMapButton')?.addEventListener('click', openDrawer);
    $('#briefBackToQuick')?.addEventListener('click', () => navigateTo('overview', { depth: 'quick', focus: true }));
  }

  function createDrawer() {
    if ($('#briefNavigationDrawer')) return;
    const layer = document.createElement('div');
    layer.id = 'briefNavigationDrawer';
    layer.className = 'brief-navigation-drawer';
    layer.hidden = true;
    layer.innerHTML = `
      <button class="brief-navigation-backdrop" type="button" data-nav-close aria-label="Close briefing map"></button>
      <aside class="brief-navigation-panel" role="dialog" aria-modal="true" aria-labelledby="briefNavigationTitle">
        <header><div><span>BRIEFING MAP</span><h2 id="briefNavigationTitle">Move through the briefing without hunting.</h2></div><button type="button" data-nav-close aria-label="Close briefing map">×</button></header>
        <div class="brief-navigation-location"><small>YOU ARE HERE</small><strong id="briefDrawerLocation"></strong></div>
        <div class="brief-navigation-depth" role="group" aria-label="Briefing depth"><button type="button" data-nav-depth="quick">Quick briefing</button><button type="button" data-nav-depth="full">Full workspace</button></div>
        <section><h3>Sections</h3><div id="briefDrawerRoutes" class="brief-drawer-routes"></div></section>
        <section><h3>Recently viewed</h3><div id="briefRecentRoutes" class="brief-recent-routes"></div></section>
        <section><h3>Switch briefing</h3><div id="briefDrawerPresets" class="brief-drawer-presets"></div></section>
        <footer><span>Tip: tabs and section links update the URL, so this exact view can be refreshed or bookmarked.</span><button type="button" data-nav-close>Done</button></footer>
      </aside>`;
    document.body.appendChild(layer);
    $$('[data-nav-close]', layer).forEach(button => button.addEventListener('click', () => closeDrawer()));
    $$('[data-nav-depth]', layer).forEach(button => button.addEventListener('click', () => {
      setDepth(button.dataset.navDepth);
      renderNavigation();
      updateUrl({ mode: 'push' });
    }));
    layer.addEventListener('keydown', trapDrawerFocus);
  }

  function trapDrawerFocus(event) {
    if (event.key !== 'Tab') return;
    const panel = $('.brief-navigation-panel');
    if (!panel) return;
    const focusable = $$('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])', panel).filter(node => node.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openDrawer() {
    createDrawer();
    const layer = $('#briefNavigationDrawer');
    if (!layer || state.drawerOpen) return;
    state.drawerOpen = true;
    state.returnFocus = document.activeElement;
    renderDrawer();
    layer.hidden = false;
    document.body.classList.add('brief-navigation-open');
    $('#briefMapButton')?.setAttribute('aria-expanded', 'true');
    window.requestAnimationFrame(() => layer.classList.add('is-visible'));
    window.setTimeout(() => $('.brief-navigation-panel [data-nav-route]')?.focus(), 100);
  }

  function closeDrawer(restoreFocus = true) {
    const layer = $('#briefNavigationDrawer');
    if (!layer || !state.drawerOpen) return;
    state.drawerOpen = false;
    layer.classList.remove('is-visible');
    document.body.classList.remove('brief-navigation-open');
    $('#briefMapButton')?.setAttribute('aria-expanded', 'false');
    window.setTimeout(() => { layer.hidden = true; }, 150);
    if (restoreFocus) (state.returnFocus || $('#briefMapButton'))?.focus?.();
  }

  function renderRouteButtons(host, className = '') {
    if (!host) return;
    host.replaceChildren(...routeList().map(route => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = className;
      button.dataset.navRoute = route.id;
      button.textContent = route.label;
      button.setAttribute('aria-current', route.id === state.currentRoute ? 'location' : 'false');
      button.addEventListener('click', () => navigateTo(route.id, { depth: depth(), focus: true }));
      return button;
    }));
  }

  function renderDrawer() {
    const current = preset();
    const currentRoute = routeById(state.currentRoute);
    const label = `${LABELS[current]} · ${currentRoute.label}`;
    const location = $('#briefDrawerLocation');
    if (location) location.textContent = label;
    renderRouteButtons($('#briefDrawerRoutes'));

    const recentHost = $('#briefRecentRoutes');
    if (recentHost) {
      const recent = recentRoutes();
      recentHost.replaceChildren(...(recent.length ? recent.map(item => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = `${LABELS[item.preset] || item.preset} · ${item.label}`;
        button.addEventListener('click', () => switchPreset(item.preset, { route: item.route, depth: 'full', push: true, focus: true }));
        return button;
      }) : [Object.assign(document.createElement('p'), { textContent: 'Your recently opened sections will appear here.' })]));
    }

    const presetHost = $('#briefDrawerPresets');
    if (presetHost) {
      presetHost.replaceChildren(...VALID_PRESETS.map(item => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = LABELS[item];
        button.classList.toggle('is-active', item === current);
        button.setAttribute('aria-pressed', String(item === current));
        button.addEventListener('click', () => switchPreset(item, { route: 'overview', depth: 'quick', push: true, focus: true }));
        return button;
      }));
    }

    $$('[data-nav-depth]').forEach(button => {
      const active = button.dataset.navDepth === depth();
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function updateActiveUi() {
    const current = preset();
    const route = routeById(state.currentRoute, current);
    const label = `${LABELS[current]} · ${route.label}`;
    const location = $('#briefCurrentLocation');
    if (location) location.textContent = label;
    $$('[data-nav-route]').forEach(button => button.setAttribute('aria-current', button.dataset.navRoute === route.id ? 'location' : 'false'));
    $('#briefBackToQuick')?.toggleAttribute('hidden', depth() === 'quick');
    if (state.drawerOpen) renderDrawer();
  }

  function renderBar() {
    renderRouteButtons($('#briefStickyRoutes'), 'brief-sticky-route');
    updateActiveUi();
  }

  function sectionCandidates() {
    const seen = new Set();
    return routeList().map(route => ({ route, element: actualTarget(route) })).filter(item => {
      if (!item.element || seen.has(item.element)) return false;
      seen.add(item.element);
      return true;
    });
  }

  function observeSections() {
    state.observer?.disconnect?.();
    state.observer = null;
    const candidates = sectionCandidates();
    if ('IntersectionObserver' in window) {
      state.observer = new IntersectionObserver(entries => {
        if (depth() !== 'full') return;
        const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const match = candidates.find(item => item.element === visible.target);
        if (match && match.route.id !== state.currentRoute) {
          state.currentRoute = match.route.id;
          updateActiveUi();
        }
      }, { rootMargin: '-18% 0px -64% 0px', threshold: [0, .08, .2, .45] });
      candidates.forEach(item => state.observer.observe(item.element));
    }
  }

  function fallbackActiveSection() {
    if ('IntersectionObserver' in window || depth() !== 'full') return;
    window.cancelAnimationFrame(state.scrollFrame);
    state.scrollFrame = window.requestAnimationFrame(() => {
      const candidates = sectionCandidates();
      const offset = Math.max(90, window.innerHeight * .24);
      const passed = candidates.filter(item => item.element.getBoundingClientRect().top <= offset);
      const active = passed[passed.length - 1] || candidates[0];
      if (active && active.route.id !== state.currentRoute) {
        state.currentRoute = active.route.id;
        updateActiveUi();
      }
    });
  }

  function relatedRoutes(tab = selectedTab()) {
    const routes = routeList();
    const currentIndex = Math.max(0, routes.findIndex(route => route.tab === tab || route.id === state.currentRoute));
    return [routes[currentIndex + 1], routes[currentIndex + 2], routes[currentIndex - 1]].filter(Boolean).filter((route, index, list) => list.findIndex(item => item.id === route.id) === index).slice(0, 3);
  }

  function decorateQuickCards() {
    const panel = $('#briefWorkspacePanel');
    if (!panel || depth() !== 'quick') return;
    const mapping = CARD_ROUTES[preset()] || {};
    $$('.quick-signal-card', panel).forEach(card => {
      const label = $('span', card)?.textContent?.trim().toUpperCase();
      const route = mapping[label];
      if (!route) return;
      card.dataset.quickRoute = route;
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${card.querySelector('h4')?.textContent || label}. Open ${routeById(route).label}.`);
    });

    let footer = $('.brief-related-routes', panel);
    if (!footer) {
      footer = document.createElement('nav');
      footer.className = 'brief-related-routes';
      footer.setAttribute('aria-label', 'Related briefing views');
      panel.appendChild(footer);
    }
    const related = relatedRoutes();
    footer.innerHTML = `<span>RELATED</span>${related.map(route => `<button type="button" data-related-route="${route.id}">${route.label}</button>`).join('')}<button type="button" data-open-full-map>Open full workspace map</button>`;
  }

  function installQuickRouting() {
    document.addEventListener('click', event => {
      const card = event.target.closest?.('[data-quick-route]');
      if (card) {
        navigateTo(card.dataset.quickRoute, { depth: 'quick', push: true, focus: true });
        return;
      }
      const related = event.target.closest?.('[data-related-route]');
      if (related) {
        navigateTo(related.dataset.relatedRoute, { depth: 'quick', push: true, focus: true });
        return;
      }
      if (event.target.closest?.('[data-open-full-map]')) {
        setDepth('full');
        window.setTimeout(openDrawer, 120);
      }
    });
    document.addEventListener('keydown', event => {
      const card = event.target.closest?.('[data-quick-route]');
      if (!card || !['Enter', ' '].includes(event.key)) return;
      event.preventDefault();
      navigateTo(card.dataset.quickRoute, { depth: 'quick', push: true, focus: true });
    });
  }

  function addContextNavigation() {
    $$('.brief-context-nav').forEach(node => node.remove());
    if (depth() !== 'full') return;
    const unique = sectionCandidates();
    unique.forEach((item, index) => {
      const previous = unique[index - 1]?.route;
      const next = unique[index + 1]?.route;
      const related = relatedRoutes(item.route.tab).filter(route => route.id !== previous?.id && route.id !== next?.id).slice(0, 2);
      const nav = document.createElement('nav');
      nav.className = 'brief-context-nav';
      nav.setAttribute('aria-label', `${item.route.label} section navigation`);
      nav.innerHTML = `<div>${related.length ? `<span>RELATED</span>${related.map(route => `<button type="button" data-context-route="${route.id}">${route.label}</button>`).join('')}` : '<span>CONTINUE</span>'}</div><div>${previous ? `<button type="button" data-context-route="${previous.id}">← ${previous.label}</button>` : ''}${next ? `<button type="button" data-context-route="${next.id}">${next.label} →</button>` : '<button type="button" data-context-route="overview">Back to overview ↑</button>'}</div>`;
      item.element.appendChild(nav);
    });
  }

  function installContextRouting() {
    document.addEventListener('click', event => {
      const button = event.target.closest?.('[data-context-route]');
      if (button) navigateTo(button.dataset.contextRoute, { depth: 'full', push: true, focus: true });
    });
  }

  function renderNavigation() {
    createBar();
    createDrawer();
    renderBar();
    decorateQuickCards();
    observeSections();
    addContextNavigation();
    document.body.classList.add('has-brief-navigation');
  }

  function scheduleRender() {
    [0, 90, 260, 620].forEach(delay => window.setTimeout(renderNavigation, delay));
  }

  function installStateListeners() {
    document.addEventListener('click', event => {
      if (event.target.closest?.('[data-workspace-tab], [data-depth-choice]')) {
        window.setTimeout(() => {
          state.currentRoute = routeByTab(selectedTab()).id;
          renderNavigation();
          updateUrl({ route: state.currentRoute, mode: 'push' });
        }, 60);
      }
    });
    window.addEventListener('brief:preset-change', () => {
      state.currentRoute = 'overview';
      scheduleRender();
      window.setTimeout(() => updateUrl({ route: 'overview', mode: 'replace' }), 360);
    });
    window.addEventListener('brief:device-fallback-open', () => {
      scheduleRender();
      window.setTimeout(applyUrlState, 420);
    });
    window.addEventListener('scroll', fallbackActiveSection, { passive: true });
    window.addEventListener('popstate', applyUrlState);
    window.addEventListener('hashchange', applyUrlState);
    window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && state.drawerOpen) closeDrawer();
    });
  }

  function initialize() {
    if (state.initialized || !window.BRIEF_APP || !$('#briefWorkspace')) return false;
    state.initialized = true;
    createBar();
    createDrawer();
    installQuickRouting();
    installContextRouting();
    installStateListeners();
    preselectGateFromUrl();
    renderNavigation();
    if (!document.body.classList.contains('is-locked')) window.setTimeout(applyUrlState, 320);
    return true;
  }

  function tryInitialize() {
    if (initialize()) return;
    state.retryCount += 1;
    if (state.retryCount < 24) window.setTimeout(tryInitialize, 250);
  }

  window.BRIEF_NAVIGATION = {
    open: openDrawer,
    close: closeDrawer,
    navigate: navigateTo,
    switchPreset,
    getState: currentUrlState
  };

  window.addEventListener('brief:ready', tryInitialize, { once: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tryInitialize, { once: true });
  else tryInitialize();
})();
