(() => {
  "use strict";

  const $ = selector => document.querySelector(selector);
  const BUILD_EXCLUDED_ROUTES = new Set(["/", "/directory/"]);
  const state = { routes: [], checks: new Map(), registryVersion: "—" };

  function escapeHtml(value = "") {
    const node = document.createElement("div");
    node.textContent = String(value);
    return node.innerHTML;
  }

  function setText(selector, value) {
    const node = $(selector);
    if (node) node.textContent = value;
  }

  function formatTime(date = new Date()) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(date);
  }

  function badgeClass(value = "") {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  function renderMetrics() {
    const results = [...state.checks.values()];
    const responding = results.filter(result => result.ok).length;
    const average = results.length
      ? Math.round(results.reduce((sum, result) => sum + result.duration, 0) / results.length)
      : null;

    setText("#routeCount", state.routes.length);
    setText("#registryVersion", state.registryVersion);
    setText("#respondingCount", results.length ? `${responding}/${results.length}` : "—");
    setText("#averageResponse", average === null ? "—" : `${average} ms`);
    setText("#lastCheck", results.length ? formatTime() : "Not run");
  }

  function renderRoutes() {
    const body = $("#routeRows");
    if (!body) return;

    body.innerHTML = state.routes.map(route => {
      const result = state.checks.get(route.path);
      const resultLabel = result ? (result.ok ? `Responding · ${result.status}` : `Failed · ${result.status || "error"}`) : "Not checked";
      const resultClass = result ? (result.ok ? "chip-approved" : "chip-future") : "";
      return `
        <tr>
          <td><a href="${escapeHtml(route.path)}" target="_blank" rel="noopener">${escapeHtml(route.path)}</a></td>
          <td>${escapeHtml(route.name)}</td>
          <td>${escapeHtml(route.category)}</td>
          <td><span class="chip chip-${badgeClass(route.status)}">${escapeHtml(route.status)}</span></td>
          <td>${escapeHtml(route.visibility)}</td>
          <td>${route.gated ? "Temporary browser gate" : "No browser gate"}</td>
          <td><span class="chip ${resultClass}">${escapeHtml(resultLabel)}</span></td>
          <td>${result ? `${result.duration} ms` : "—"}</td>
        </tr>`;
    }).join("");
  }

  async function loadRegistry() {
    const notice = $("#registryNotice");
    try {
      const response = await fetch("/assets/cmx-routes.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const registry = await response.json();
      const registeredRoutes = Array.isArray(registry.routes) ? registry.routes : [];
      state.routes = registeredRoutes.filter(route => !BUILD_EXCLUDED_ROUTES.has(route.path));
      state.registryVersion = registry.version || "—";
      if (notice) notice.textContent = `Route registry v${state.registryVersion} loaded with ${state.routes.length} Build Lab routes.`;
    } catch (error) {
      state.routes = [];
      if (notice) notice.textContent = "The route registry could not be loaded. Build Lab remains in static documentation mode.";
    }
    renderRoutes();
    renderMetrics();
  }

  async function checkRoute(route) {
    const started = performance.now();
    try {
      const response = await fetch(route.path, {
        method: "GET",
        cache: "no-store",
        credentials: "same-origin",
        redirect: "follow"
      });
      return {
        ok: response.ok,
        status: response.status,
        duration: Math.max(1, Math.round(performance.now() - started))
      };
    } catch (error) {
      return {
        ok: false,
        status: "network",
        duration: Math.max(1, Math.round(performance.now() - started))
      };
    }
  }

  async function checkAllRoutes() {
    const button = $("#checkRoutes");
    if (!state.routes.length || !button) return;
    button.disabled = true;
    button.textContent = "Checking routes";
    state.checks.clear();

    const concurrency = 4;
    let index = 0;
    async function worker() {
      while (index < state.routes.length) {
        const route = state.routes[index++];
        const result = await checkRoute(route);
        state.checks.set(route.path, result);
        renderRoutes();
        renderMetrics();
      }
    }

    await Promise.all(Array.from({ length: concurrency }, worker));
    button.disabled = false;
    button.textContent = "Run route check";
  }

  function updateClock() {
    setText("#buildClock", formatTime());
  }

  function init() {
    loadRegistry();
    updateClock();
    window.setInterval(updateClock, 1000);
    const button = $("#checkRoutes");
    if (button) button.addEventListener("click", checkAllRoutes);
  }

  document.addEventListener("DOMContentLoaded", init);
})();