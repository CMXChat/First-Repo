# Brief static validation

Validated commit: `5d41e255129c3221f694321474ab32d9931052c9`

```text
=== tests/brief-device-smoke.test.js ===
Brief device smoke test passed.
=== tests/brief-onboarding-smoke.test.js ===
Brief onboarding and browser compatibility smoke test passed.
=== tests/brief-navigation-smoke.test.js ===
node:assert:883
    throw err;
    ^

AssertionError [ERR_ASSERTION]: The input did not match the regular expression /restoreUrlAfterEntry/. Input:

'(() => {\n' +
  "  'use strict';\n" +
  '\n' +
  '  const $ = (selector, root = document) => root.querySelector(selector);\n' +
  '  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];\n' +
  '  const VIEW_TO_PRESET = {\n' +
  "    personal: 'individual',\n" +
  "    relationship: 'couple',\n" +
  "    business: 'partners',\n" +
  "    trainer: 'trainer',\n" +
  "    team: 'team'\n" +
  '  };\n' +
  '  const PRESET_TO_VIEW = Object.fromEntries(Object.entries(VIEW_TO_PRESET).map(([view, preset]) => [preset, view]));\n' +
  '  const TAB_BY_ROUTE = {\n' +
  "    individual: { overview: 'overview', day: 'day', work: 'work', finance: 'money', wellness: 'wellness', actions: 'work', schedule: 'day', intelligence: 'intelligence', memory: 'intelligence' },\n" +
  "    couple: { overview: 'overview', together: 'together', profiles: 'profiles', plans: 'plans', watch: 'watch', reflection: 'reflection', shared: 'together' },\n" +
  "    partners: { overview: 'overview', executive: 'overview', finance: 'finance', projects: 'projects', decisions: 'decisions', markets: 'markets', partners: 'partners', actions: 'projects' },\n" +
  "    trainer: { overview: 'overview', today: 'today', habits: 'habits', progress: 'progress', recovery: 'recovery', coach: 'coach', schedule: 'today' },\n" +
  "    team: { overview: 'overview', board: 'overview', mywork: 'mywork', project: 'project', handoffs: 'handoffs', procedure: 'procedure', finance: 'finance', spaces: 'spaces' }\n" +
  '  };\n' +
  '  const CARD_ROUTES = {\n' +
  "    individual: { NEXT: 'day', WEATHER: 'day', PRIORITY: 'work', WORK: 'work', PERSONAL: 'wellness', BILLS: 'finance', REVIEW: 'finance', MOVEMENT: 'wellness', INTELLIGENCE: 'intelligence', MEMORY: 'memory' },\n" +
  "    couple: { NEXT: 'together', WEATHER: 'plans', PRIORITY: 'plans', TOGETHER: 'together', REFLECTION: 'reflection', 'CHECK-IN': 'together', MEDIA: 'watch', PROFILES: 'profiles', SHARED: 'shared' },\n" +
  "    partners: { NEXT: 'projects', WEATHER: 'markets', PRIORITY: 'projects', DECISION: 'decisions', REVENUE: 'finance', MARGIN: 'finance', PIPELINE: 'finance', RECEIVABLES: 'finance', CASH: 'finance', MARKET: 'markets', PROJECTS: 'projects' },\n" +
  "    trainer: { NEXT: 'today', WEATHER: 'recovery', PRIORITY: 'today', WEEK: 'habits', COACH: 'coach', MOVEMENT: 'today', RECOVERY: 'recovery', PROGRESS: 'progress', HABITS: 'habits' },\n" +
  "    team: { NEXT: 'mywork', WEATHER: 'procedure', PRIORITY: 'mywork', PROJECT: 'project', HANDOFFS: 'handoffs', BLOCKERS: 'project', BLOCKER: 'project', BUDGET: 'finance', FINANCE: 'finance', PROCEDURE: 'procedure', SPACES: 'spaces', WORKLOAD: 'mywork' }\n" +
  '  };\n' +
  '\n' +
  '  let initialized = false;\n' +
  '  let restoring = false;\n' +
  '  let navigationRecoveryCount = 0;\n' +
  '  let appAriaHidden = null;\n' +
  '\n' +
  '  function preset() {\n' +
  "    return window.BRIEF_APP?.getPreset?.() || 'individual';\n" +
  '  }\n' +
  '\n' +
  '  function reducedMotion() {\n' +
  "    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;\n" +
  '  }\n' +
  '\n' +
  '  function currentDepth() {\n' +
  "    return document.body.dataset.briefDepth === 'full' ? 'full' : 'quick';\n" +
  '  }\n' +
  '\n' +
  '  function routeFromTab(current, value) {\n' +
  '    const routes = TAB_BY_ROUTE[current] || {};\n' +
  '    if (routes[value]) return value;\n' +
  "    return Object.entries(routes).find(([, tab]) => tab === value)?.[0] || 'overview';\n" +
  '  }\n' +
  '\n' +
  '  function canonicalUrl(routeId, requestedDepth, push = true) {\n' +
  '    const current = preset();\n' +
  "    const tab = TAB_BY_ROUTE[current]?.[routeId] || 'overview';\n" +
  '    const url = new URL(window.location.href);\n' +
  "    const view = PRESET_TO_VIEW[current] || 'personal';\n" +
  "    url.searchParams.set('view', view);\n" +
  "    url.searchParams.set('tab', routeId);\n" +
  "    url.searchParams.set('depth', requestedDepth);\n" +
  "    if (requestedDepth === 'quick') url.hash = 'briefWorkspace';\n" +
  '    else if (!url.hash) {\n' +
  '      const selected = $(`[data-nav-route="${routeId}"]`);\n' +
  '      const targetId = selected?.dataset.navTarget;\n' +
  '      if (targetId) url.hash = targetId;\n' +
  '    }\n' +
  "    try { history[push ? 'pushState' : 'replaceState']({ briefNavigation: true, view, tab, depth: requestedDepth }, '', url); } catch {}\n" +
  '    return tab;\n' +
  '  }\n' +
  '\n' +
  '  function releaseDrawerBackground(delay = 180) {\n' +
  '    window.setTimeout(() => {\n' +
  "      const drawer = $('#briefNavigationDrawer');\n" +
  "      if (!drawer || drawer.hidden || !drawer.classList.contains('is-visible')) setAppInert(false);\n" +
  '    }, delay);\n' +
  '  }\n' +
  '\n' +
  '  function setQuickRoute(routeId, push = true) {\n' +
  '    const current = preset();\n' +
  "    const tab = TAB_BY_ROUTE[current]?.[routeId] || 'overview';\n" +
  `    const depthButton = $('[data-depth-choice="quick"]');\n` +
  "    if (currentDepth() !== 'quick') depthButton?.click();\n" +
  '    window.setTimeout(() => {\n' +
  '      const tabButton = $(`[data-workspace-tab="${tab}"]`);\n' +
  "      if (tabButton?.getAttribute('aria-selected') !== 'true') tabButton?.click();\n" +
  "      const workspace = $('#briefWorkspace');\n" +
  "      workspace?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start', inline: 'nearest' });\n" +
  "      window.setTimeout(() => $('#briefWorkspacePanel')?.focus({ preventScroll: true }), reducedMotion() ? 0 : 260);\n" +
  "      canonicalUrl(routeId, 'quick', push);\n" +
  '      window.BRIEF_NAVIGATION?.close?.(false);\n' +
  '      releaseDrawerBackground(220);\n' +
  '      scheduleEnhancements();\n' +
  '    }, 70);\n' +
  '  }\n' +
  '\n' +
  '  function canonicalizeFullRoute(routeId, push = true) {\n' +
  '    window.setTimeout(() => {\n' +
  "      canonicalUrl(routeId, 'full', push);\n" +
  '      releaseDrawerBackground(140);\n' +
  '    }, 220);\n' +
  '  }\n' +
  '\n' +
  '  function interceptNavigation() {\n' +
  "    document.addEventListener('click', event => {\n" +
  "      const trigger = event.target.closest?.('[data-quick-route], [data-related-route], [data-nav-route], [data-context-route]');\n" +
  '      if (!trigger) return;\n' +
  '      const route = trigger.dataset.quickRoute || trigger.dataset.relatedRoute || trigger.dataset.navRoute || trigger.dataset.contextRoute;\n' +
  '      if (!route) return;\n' +
  "      if (currentDepth() === 'quick') {\n" +
  '        event.preventDefault();\n' +
  '        event.stopImmediatePropagation();\n' +
  '        setQuickRoute(route, true);\n' +
  '      } else {\n' +
  '        canonicalizeFullRoute(route, true);\n' +
  '      }\n' +
  '    }, true);\n' +
  '\n' +
  "    document.addEventListener('keydown', event => {\n" +
  "      if (!['Enter', ' '].includes(event.key)) return;\n" +
  "      const trigger = event.target.closest?.('[data-quick-route], [data-related-route], [data-nav-route], [data-context-route]');\n" +
  '      if (!trigger) return;\n' +
  '      const route = trigger.dataset.quickRoute || trigger.dataset.relatedRoute || trigger.dataset.navRoute || trigger.dataset.contextRoute;\n' +
  '      if (!route) return;\n' +
  "      if (currentDepth() === 'quick') {\n" +
  '        event.preventDefault();\n' +
  '        event.stopImmediatePropagation();\n' +
  '        setQuickRoute(route, true);\n' +
  '      } else {\n' +
  '        canonicalizeFullRoute(route, true);\n' +
  '      }\n' +
  '    }, true);\n' +
  '\n' +
  "    document.addEventListener('click', event => {\n" +
  "      const tabButton = event.target.closest?.('[data-workspace-tab]');\n" +
  '      if (!tabButton) return;\n' +
  '      const route = routeFromTab(preset(), tabButton.dataset.workspaceTab);\n' +
  '      window.setTimeout(() => {\n' +
  '        canonicalUrl(route, currentDepth(), true);\n' +
  '        scheduleEnhancements();\n' +
  '      }, 180);\n' +
  '    });\n' +
  '  }\n' +
  '\n' +
  '  function requestedState() {\n' +
  '    const url = new URL(window.location.href);\n' +
  "    const requestedPreset = VIEW_TO_PRESET[url.searchParams.get('view')] || preset();\n" +
  "    const requestedValue = url.searchParams.get('tab') || 'overview';\n" +
  "    const requestedDepth = url.searchParams.get('depth') === 'full' ? 'full' : 'quick';\n" +
  '    const route = routeFromTab(requestedPreset, requestedValue);\n' +
  '    return { requestedPreset, requestedDepth, route };\n' +
  '  }\n' +
  '\n' +
  '  function applyRequestedUrl() {\n' +
  "    if (restoring || document.body.classList.contains('is-locked') || !window.BRIEF_NAVIGATION) return;\n" +
  '    restoring = true;\n' +
  '    const { requestedPreset, requestedDepth, route } = requestedState();\n' +
  '    if (requestedPreset !== preset()) {\n' +
  '      window.BRIEF_NAVIGATION.switchPreset?.(requestedPreset, { route, depth: requestedDepth, push: false, focus: false });\n' +
  "    } else if (requestedDepth === 'quick') {\n" +
  '      setQuickRoute(route, false);\n' +
  '    } else {\n' +
  "      window.BRIEF_NAVIGATION.navigate?.(route, { depth: 'full', push: false, focus: false });\n" +
  '      canonicalizeFullRoute(route, false);\n' +
  '    }\n' +
  '    window.setTimeout(() => { restoring = false; }, 950);\n' +
  '  }\n' +
  '\n' +
  '  function restoreUrlState() {\n' +
  "    $('#enterBrief')?.addEventListener('click', () => window.setTimeout(applyRequestedUrl, 720), true);\n" +
  "    window.addEventListener('brief:device-fallback-open', () => window.setTimeout(applyRequestedUrl, 520));\n" +
  "    window.addEventListener('popstate', () => window.setTimeout(applyRequestedUrl, 80));\n" +
  "    window.addEventListener('hashchange', () => window.setTimeout(applyRequestedUrl, 80));\n" +
  "    window.addEventListener('pageshow', event => {\n" +
  "      if (event.persisted || !document.body.classList.contains('is-locked')) window.setTimeout(applyRequestedUrl, 520);\n" +
  '    });\n' +
  '  }\n' +
  '\n' +
  '  function decorateCompactLinks() {\n' +
  "    const panel = $('#briefWorkspacePanel');\n" +
  "    if (!panel || currentDepth() !== 'quick') return;\n" +
  '    const mapping = CARD_ROUTES[preset()] || {};\n' +
  "    $$('.quick-compact-list article', panel).forEach(item => {\n" +
  "      const label = item.querySelector('span')?.textContent?.trim().toUpperCase();\n" +
  '      const route = mapping[label];\n' +
  '      if (!route || item.dataset.quickRoute) return;\n' +
  '      item.dataset.quickRoute = route;\n' +
  "      item.setAttribute('role', 'button');\n" +
  "      item.setAttribute('tabindex', '0');\n" +
  "      const title = item.querySelector('strong')?.textContent || label;\n" +
  "      item.setAttribute('aria-label', `${title}. Open related ${route} view.`);\n" +
  '    });\n' +
  '  }\n' +
  '\n' +
  '  function keepActiveRouteVisible() {\n' +
  `    const active = $('#briefStickyRoutes [aria-current="location"]');\n` +
  "    active?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });\n" +
  '  }\n' +
  '\n' +
  '  function setAppInert(enabled) {\n' +
  "    const app = $('#briefApp');\n" +
  '    if (!app) return;\n' +
  '    if (enabled) {\n' +
  "      appAriaHidden = app.getAttribute('aria-hidden');\n" +
  "      if ('inert' in app) app.inert = true;\n" +
  "      else app.setAttribute('aria-hidden', 'true');\n" +
  '    } else {\n' +
  "      if ('inert' in app) app.inert = false;\n" +
  "      if (appAriaHidden === null) app.removeAttribute('aria-hidden');\n" +
  ' '... 2919 more characters

    at Object.<anonymous> (/home/runner/work/First-Repo/First-Repo/tests/brief-navigation-smoke.test.js:50:8)
    at Module._compile (node:internal/modules/cjs/loader:1781:14)
    at Object..js (node:internal/modules/cjs/loader:1913:10)
    at Module.load (node:internal/modules/cjs/loader:1505:32)
    at Function._load (node:internal/modules/cjs/loader:1309:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5)
    at node:internal/main/run_main_module:36:49 {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: '(() => {\n' +
    "  'use strict';\n" +
    '\n' +
    '  const $ = (selector, root = document) => root.querySelector(selector);\n' +
    '  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];\n' +
    '  const VIEW_TO_PRESET = {\n' +
    "    personal: 'individual',\n" +
    "    relationship: 'couple',\n" +
    "    business: 'partners',\n" +
    "    trainer: 'trainer',\n" +
    "    team: 'team'\n" +
    '  };\n' +
    '  const PRESET_TO_VIEW = Object.fromEntries(Object.entries(VIEW_TO_PRESET).map(([view, preset]) => [preset, view]));\n' +
    '  const TAB_BY_ROUTE = {\n' +
    "    individual: { overview: 'overview', day: 'day', work: 'work', finance: 'money', wellness: 'wellness', actions: 'work', schedule: 'day', intelligence: 'intelligence', memory: 'intelligence' },\n" +
    "    couple: { overview: 'overview', together: 'together', profiles: 'profiles', plans: 'plans', watch: 'watch', reflection: 'reflection', shared: 'together' },\n" +
    "    partners: { overview: 'overview', executive: 'overview', finance: 'finance', projects: 'projects', decisions: 'decisions', markets: 'markets', partners: 'partners', actions: 'projects' },\n" +
    "    trainer: { overview: 'overview', today: 'today', habits: 'habits', progress: 'progress', recovery: 'recovery', coach: 'coach', schedule: 'today' },\n" +
    "    team: { overview: 'overview', board: 'overview', mywork: 'mywork', project: 'project', handoffs: 'handoffs', procedure: 'procedure', finance: 'finance', spaces: 'spaces' }\n" +
    '  };\n' +
    '  const CARD_ROUTES = {\n' +
    "    individual: { NEXT: 'day', WEATHER: 'day', PRIORITY: 'work', WORK: 'work', PERSONAL: 'wellness', BILLS: 'finance', REVIEW: 'finance', MOVEMENT: 'wellness', INTELLIGENCE: 'intelligence', MEMORY: 'memory' },\n" +
    "    couple: { NEXT: 'together', WEATHER: 'plans', PRIORITY: 'plans', TOGETHER: 'together', REFLECTION: 'reflection', 'CHECK-IN': 'together', MEDIA: 'watch', PROFILES: 'profiles', SHARED: 'shared' },\n" +
    "    partners: { NEXT: 'projects', WEATHER: 'markets', PRIORITY: 'projects', DECISION: 'decisions', REVENUE: 'finance', MARGIN: 'finance', PIPELINE: 'finance', RECEIVABLES: 'finance', CASH: 'finance', MARKET: 'markets', PROJECTS: 'projects' },\n" +
    "    trainer: { NEXT: 'today', WEATHER: 'recovery', PRIORITY: 'today', WEEK: 'habits', COACH: 'coach', MOVEMENT: 'today', RECOVERY: 'recovery', PROGRESS: 'progress', HABITS: 'habits' },\n" +
    "    team: { NEXT: 'mywork', WEATHER: 'procedure', PRIORITY: 'mywork', PROJECT: 'project', HANDOFFS: 'handoffs', BLOCKERS: 'project', BLOCKER: 'project', BUDGET: 'finance', FINANCE: 'finance', PROCEDURE: 'procedure', SPACES: 'spaces', WORKLOAD: 'mywork' }\n" +
    '  };\n' +
    '\n' +
    '  let initialized = false;\n' +
    '  let restoring = false;\n' +
    '  let navigationRecoveryCount = 0;\n' +
    '  let appAriaHidden = null;\n' +
    '\n' +
    '  function preset() {\n' +
    "    return window.BRIEF_APP?.getPreset?.() || 'individual';\n" +
    '  }\n' +
    '\n' +
    '  function reducedMotion() {\n' +
    "    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;\n" +
    '  }\n' +
    '\n' +
    '  function currentDepth() {\n' +
    "    return document.body.dataset.briefDepth === 'full' ? 'full' : 'quick';\n" +
    '  }\n' +
    '\n' +
    '  function routeFromTab(current, value) {\n' +
    '    const routes = TAB_BY_ROUTE[current] || {};\n' +
    '    if (routes[value]) return value;\n' +
    "    return Object.entries(routes).find(([, tab]) => tab === value)?.[0] || 'overview';\n" +
    '  }\n' +
    '\n' +
    '  function canonicalUrl(routeId, requestedDepth, push = true) {\n' +
    '    const current = preset();\n' +
    "    const tab = TAB_BY_ROUTE[current]?.[routeId] || 'overview';\n" +
    '    const url = new URL(window.location.href);\n' +
    "    const view = PRESET_TO_VIEW[current] || 'personal';\n" +
    "    url.searchParams.set('view', view);\n" +
    "    url.searchParams.set('tab', routeId);\n" +
    "    url.searchParams.set('depth', requestedDepth);\n" +
    "    if (requestedDepth === 'quick') url.hash = 'briefWorkspace';\n" +
    '    else if (!url.hash) {\n' +
    '      const selected = $(`[data-nav-route="${routeId}"]`);\n' +
    '      const targetId = selected?.dataset.navTarget;\n' +
    '      if (targetId) url.hash = targetId;\n' +
    '    }\n' +
    "    try { history[push ? 'pushState' : 'replaceState']({ briefNavigation: true, view, tab, depth: requestedDepth }, '', url); } catch {}\n" +
    '    return tab;\n' +
    '  }\n' +
    '\n' +
    '  function releaseDrawerBackground(delay = 180) {\n' +
    '    window.setTimeout(() => {\n' +
    "      const drawer = $('#briefNavigationDrawer');\n" +
    "      if (!drawer || drawer.hidden || !drawer.classList.contains('is-visible')) setAppInert(false);\n" +
    '    }, delay);\n' +
    '  }\n' +
    '\n' +
    '  function setQuickRoute(routeId, push = true) {\n' +
    '    const current = preset();\n' +
    "    const tab = TAB_BY_ROUTE[current]?.[routeId] || 'overview';\n" +
    `    const depthButton = $('[data-depth-choice="quick"]');\n` +
    "    if (currentDepth() !== 'quick') depthButton?.click();\n" +
    '    window.setTimeout(() => {\n' +
    '      const tabButton = $(`[data-workspace-tab="${tab}"]`);\n' +
    "      if (tabButton?.getAttribute('aria-selected') !== 'true') tabButton?.click();\n" +
    "      const workspace = $('#briefWorkspace');\n" +
    "      workspace?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start', inline: 'nearest' });\n" +
    "      window.setTimeout(() => $('#briefWorkspacePanel')?.focus({ preventScroll: true }), reducedMotion() ? 0 : 260);\n" +
    "      canonicalUrl(routeId, 'quick', push);\n" +
    '      window.BRIEF_NAVIGATION?.close?.(false);\n' +
    '      releaseDrawerBackground(220);\n' +
    '      scheduleEnhancements();\n' +
    '    }, 70);\n' +
    '  }\n' +
    '\n' +
    '  function canonicalizeFullRoute(routeId, push = true) {\n' +
    '    window.setTimeout(() => {\n' +
    "      canonicalUrl(routeId, 'full', push);\n" +
    '      releaseDrawerBackground(140);\n' +
    '    }, 220);\n' +
    '  }\n' +
    '\n' +
    '  function interceptNavigation() {\n' +
    "    document.addEventListener('click', event => {\n" +
    "      const trigger = event.target.closest?.('[data-quick-route], [data-related-route], [data-nav-route], [data-context-route]');\n" +
    '      if (!trigger) return;\n' +
    '      const route = trigger.dataset.quickRoute || trigger.dataset.relatedRoute || trigger.dataset.navRoute || trigger.dataset.contextRoute;\n' +
    '      if (!route) return;\n' +
    "      if (currentDepth() === 'quick') {\n" +
    '        event.preventDefault();\n' +
    '        event.stopImmediatePropagation();\n' +
    '        setQuickRoute(route, true);\n' +
    '      } else {\n' +
    '        canonicalizeFullRoute(route, true);\n' +
    '      }\n' +
    '    }, true);\n' +
    '\n' +
    "    document.addEventListener('keydown', event => {\n" +
    "      if (!['Enter', ' '].includes(event.key)) return;\n" +
    "      const trigger = event.target.closest?.('[data-quick-route], [data-related-route], [data-nav-route], [data-context-route]');\n" +
    '      if (!trigger) return;\n' +
    '      const route = trigger.dataset.quickRoute || trigger.dataset.relatedRoute || trigger.dataset.navRoute || trigger.dataset.contextRoute;\n' +
    '      if (!route) return;\n' +
    "      if (currentDepth() === 'quick') {\n" +
    '        event.preventDefault();\n' +
    '        event.stopImmediatePropagation();\n' +
    '        setQuickRoute(route, true);\n' +
    '      } else {\n' +
    '        canonicalizeFullRoute(route, true);\n' +
    '      }\n' +
    '    }, true);\n' +
    '\n' +
    "    document.addEventListener('click', event => {\n" +
    "      const tabButton = event.target.closest?.('[data-workspace-tab]');\n" +
    '      if (!tabButton) return;\n' +
    '      const route = routeFromTab(preset(), tabButton.dataset.workspaceTab);\n' +
    '      window.setTimeout(() => {\n' +
    '        canonicalUrl(route, currentDepth(), true);\n' +
    '        scheduleEnhancements();\n' +
    '      }, 180);\n' +
    '    });\n' +
    '  }\n' +
    '\n' +
    '  function requestedState() {\n' +
    '    const url = new URL(window.location.href);\n' +
    "    const requestedPreset = VIEW_TO_PRESET[url.searchParams.get('view')] || preset();\n" +
    "    const requestedValue = url.searchParams.get('tab') || 'overview';\n" +
    "    const requestedDepth = url.searchParams.get('depth') === 'full' ? 'full' : 'quick';\n" +
    '    const route = routeFromTab(requestedPreset, requestedValue);\n' +
    '    return { requestedPreset, requestedDepth, route };\n' +
    '  }\n' +
    '\n' +
    '  function applyRequestedUrl() {\n' +
    "    if (restoring || document.body.classList.contains('is-locked') || !window.BRIEF_NAVIGATION) return;\n" +
    '    restoring = true;\n' +
    '    const { requestedPreset, requestedDepth, route } = requestedState();\n' +
    '    if (requestedPreset !== preset()) {\n' +
    '      window.BRIEF_NAVIGATION.switchPreset?.(requestedPreset, { route, depth: requestedDepth, push: false, focus: false });\n' +
    "    } else if (requestedDepth === 'quick') {\n" +
    '      setQuickRoute(route, false);\n' +
    '    } else {\n' +
    "      window.BRIEF_NAVIGATION.navigate?.(route, { depth: 'full', push: false, focus: false });\n" +
    '      canonicalizeFullRoute(route, false);\n' +
    '    }\n' +
    '    window.setTimeout(() => { restoring = false; }, 950);\n' +
    '  }\n' +
    '\n' +
    '  function restoreUrlState() {\n' +
    "    $('#enterBrief')?.addEventListener('click', () => window.setTimeout(applyRequestedUrl, 720), true);\n" +
    "    window.addEventListener('brief:device-fallback-open', () => window.setTimeout(applyRequestedUrl, 520));\n" +
    "    window.addEventListener('popstate', () => window.setTimeout(applyRequestedUrl, 80));\n" +
    "    window.addEventListener('hashchange', () => window.setTimeout(applyRequestedUrl, 80));\n" +
    "    window.addEventListener('pageshow', event => {\n" +
    "      if (event.persisted || !document.body.classList.contains('is-locked')) window.setTimeout(applyRequestedUrl, 520);\n" +
    '    });\n' +
    '  }\n' +
    '\n' +
    '  function decorateCompactLinks() {\n' +
    "    const panel = $('#briefWorkspacePanel');\n" +
    "    if (!panel || currentDepth() !== 'quick') return;\n" +
    '    const mapping = CARD_ROUTES[preset()] || {};\n' +
    "    $$('.quick-compact-list article', panel).forEach(item => {\n" +
    "      const label = item.querySelector('span')?.textContent?.trim().toUpperCase();\n" +
    '      const route = mapping[label];\n' +
    '      if (!route || item.dataset.quickRoute) return;\n' +
    '      item.dataset.quickRoute = route;\n' +
    "      item.setAttribute('role', 'button');\n" +
    "      item.setAttribute('tabindex', '0');\n" +
    "      const title = item.querySelector('strong')?.textContent || label;\n" +
    "      item.setAttribute('aria-label', `${title}. Open related ${route} view.`);\n" +
    '    });\n' +
    '  }\n' +
    '\n' +
    '  function keepActiveRouteVisible() {\n' +
    `    const active = $('#briefStickyRoutes [aria-current="location"]');\n` +
    "    active?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });\n" +
    '  }\n' +
    '\n' +
    '  function setAppInert(enabled) {\n' +
    "    const app = $('#briefApp');\n" +
    '    if (!app) return;\n' +
    '    if (enabled) {\n' +
    "      appAriaHidden = app.getAttribute('aria-hidden');\n" +
    "      if ('inert' in app) app.inert = true;\n" +
    "      else app.setAttribute('aria-hidden', 'true');\n" +
    '    } else {\n' +
    "      if ('inert' in app) app.inert = false;\n" +
    "      if (appAriaHidden === null) app.removeAttribute('aria-hidden');\n" +
    ' '... 2919 more characters,
  expected: /restoreUrlAfterEntry/,
  operator: 'match',
  diff: 'simple'
}

Node.js v22.23.1
```
