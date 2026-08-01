(() => {
  'use strict';

  const REGISTRY_URL = '/assets/cmx-routes.json';

  async function loadRoutes(options = {}) {
    const response = await fetch(`${REGISTRY_URL}?v=1`, {
      cache: options.cache || 'no-store',
      credentials: 'same-origin'
    });

    if (!response.ok) {
      throw new Error(`Route registry returned HTTP ${response.status}`);
    }

    const registry = await response.json();
    if (!registry || !Array.isArray(registry.routes)) {
      throw new Error('Route registry format is invalid');
    }

    return registry;
  }

  function directoryRoutes(registry) {
    return registry.routes
      .filter((route) => route.directory === true && route.status === 'Active')
      .sort((a, b) => Number(a.hotkey || 999) - Number(b.hotkey || 999));
  }

  function routeByPath(registry, path) {
    return registry.routes.find((route) => route.path === path) || null;
  }

  window.CMXRouteRegistry = {
    url: REGISTRY_URL,
    load: loadRoutes,
    directoryRoutes,
    routeByPath
  };
})();
