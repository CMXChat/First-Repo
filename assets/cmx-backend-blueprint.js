(() => {
  "use strict";

  const data = window.CMX_BACKEND_BLUEPRINT;
  if (!data) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = (value = "") => String(value).replace(/[&<>"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character]));
  const pretty = value => typeof value === "string" ? value : JSON.stringify(value, null, 2);
  const unique = values => [...new Set(values)].sort((a, b) => a.localeCompare(b));
  const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  let liveRoutes = [];
  let toastTimer;

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
  }

  function renderMetrics() {
    const approved = data.endpoints.filter(endpoint => endpoint.status === "Approved").length;
    const future = data.endpoints.filter(endpoint => endpoint.status === "Future").length;
    const deferred = data.endpoints.filter(endpoint => endpoint.status === "Deferred").length;
    const apiFamilies = unique(data.endpoints.map(endpoint => endpoint.family)).length;
    const items = [
      [data.endpoints.length, "Documented endpoint contracts"],
      [approved, "Approved for planned development"],
      [future + deferred, "Future or deferred contracts"],
      [apiFamilies, "API families defined"],
      ["0", "Backend endpoints currently live"]
    ];
    $("#metrics").innerHTML = items.map(([value, label]) => `<article class="metric"><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></article>`).join("");
  }

  function renderOverview() {
    const labels = {
      frontend: "Frontend",
      backend: "Backend platform",
      fastapi: "FastAPI application",
      linux: "Linux environment",
      database: "Database",
      cloudflareAccess: "Cloudflare Access",
      staging: "Staging environment",
      productionApi: "Production API"
    };
    $("#platformStatus").innerHTML = Object.entries(data.state).map(([key, value]) => `<div class="status-row"><span>${escapeHtml(labels[key] || key)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");

    const familyCounts = data.endpoints.reduce((counts, endpoint) => {
      counts[endpoint.family] = (counts[endpoint.family] || 0) + 1;
      return counts;
    }, {});
    $("#familyOverview").innerHTML = Object.entries(familyCounts).sort((a, b) => b[1] - a[1]).map(([family, count]) => `<div class="family-pill"><strong>${count}</strong><span>${escapeHtml(family)}</span></div>`).join("");

    $("#capabilityGrid").innerHTML = data.capabilities.map(capability => `<article class="capability-card"><h3>${escapeHtml(capability.title)}</h3><p>${escapeHtml(capability.text)}</p></article>`).join("");
  }

  function setupTabs() {
    $$(".tab").forEach(tab => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.target;
        $$(".tab").forEach(item => item.classList.toggle("is-active", item === tab));
        $$(".blueprint-section").forEach(section => {
          const active = section.dataset.section === target;
          section.hidden = !active;
          section.classList.toggle("is-active", active);
        });
        history.replaceState(null, "", `#${target}`);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    const initial = location.hash.replace("#", "");
    const initialTab = initial && $(`.tab[data-target="${CSS.escape(initial)}"]`);
    if (initialTab) initialTab.click();
  }

  function populateSelect(select, values) {
    values.forEach(value => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.append(option);
    });
  }

  function endpointSearchText(endpoint) {
    return [endpoint.method, endpoint.path, endpoint.family, endpoint.phase, endpoint.access, endpoint.status, endpoint.purpose, ...endpoint.pages, ...endpoint.dependencies, ...endpoint.security].join(" ").toLowerCase();
  }

  function renderEndpoints() {
    const search = $("#apiSearch").value.trim().toLowerCase();
    const family = $("#familyFilter").value;
    const phase = $("#phaseFilter").value;
    const access = $("#accessFilter").value;
    const filtered = data.endpoints.filter(endpoint => {
      return (!search || endpointSearchText(endpoint).includes(search)) &&
        (family === "all" || endpoint.family === family) &&
        (phase === "all" || endpoint.phase === phase) &&
        (access === "all" || endpoint.access === access);
    });

    $("#registrySummary").innerHTML = `<span><strong>${filtered.length}</strong> of ${data.endpoints.length} endpoint contracts shown</span><span>All implementation states are planning labels.</span>`;
    const list = $("#endpointList");
    if (!filtered.length) {
      list.innerHTML = `<div class="panel empty-state">No endpoints match the current filters.</div>`;
      return;
    }
    list.innerHTML = filtered.map(endpoint => `
      <button type="button" class="endpoint-card" data-endpoint-id="${escapeHtml(endpoint.id)}">
        <span class="method">${escapeHtml(endpoint.method)}</span>
        <span class="endpoint-path">${escapeHtml(endpoint.path)}</span>
        <span class="endpoint-purpose">${escapeHtml(endpoint.purpose)}</span>
        <span class="endpoint-meta">
          <span class="chip">${escapeHtml(endpoint.family)}</span>
          <span class="chip">${escapeHtml(endpoint.phase)}</span>
          <span class="chip chip-${slug(endpoint.status)}">${escapeHtml(endpoint.status)}</span>
        </span>
      </button>`).join("");

    $$('[data-endpoint-id]', list).forEach(button => button.addEventListener("click", () => openEndpoint(button.dataset.endpointId)));
  }

  function openEndpoint(id) {
    const endpoint = data.endpoints.find(item => item.id === id);
    if (!endpoint) return;
    const content = $("#endpointDialogContent");
    content.innerHTML = `
      <div class="dialog-header">
        <span class="method">${escapeHtml(endpoint.method)}</span>
        <h2 class="dialog-path">${escapeHtml(endpoint.path)}</h2>
        <p>${escapeHtml(endpoint.purpose)}</p>
        <div class="endpoint-meta" style="justify-content:flex-start">
          <span class="chip">${escapeHtml(endpoint.family)}</span>
          <span class="chip">${escapeHtml(endpoint.phase)}</span>
          <span class="chip">${escapeHtml(endpoint.access)}</span>
          <span class="chip chip-${slug(endpoint.status)}">${escapeHtml(endpoint.status)}</span>
        </div>
      </div>
      <div class="dialog-grid">
        <section class="dialog-section"><h3>Used by</h3><ul>${endpoint.pages.map(page => `<li>${escapeHtml(page)}</li>`).join("")}</ul></section>
        <section class="dialog-section"><h3>Technical position</h3><p><strong>Database:</strong> ${escapeHtml(endpoint.database)}</p><p><strong>Background worker:</strong> ${escapeHtml(endpoint.background)}</p></section>
        <section class="dialog-section full"><h3>Expected request</h3><pre class="json-block">${escapeHtml(pretty(endpoint.request))}</pre></section>
        <section class="dialog-section full"><h3>Expected response</h3><pre class="json-block">${escapeHtml(pretty(endpoint.response))}</pre></section>
        <section class="dialog-section"><h3>Dependencies</h3><ul>${endpoint.dependencies.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
        <section class="dialog-section"><h3>Security requirements</h3><ul>${endpoint.security.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
      </div>
      <div class="dialog-actions"><button type="button" class="secondary-button" id="copyEndpointButton">Copy endpoint contract</button></div>`;
    $("#copyEndpointButton", content).addEventListener("click", async () => {
      await navigator.clipboard.writeText(JSON.stringify(endpoint, null, 2));
      showToast("Endpoint contract copied");
    });
    $("#endpointDialog").showModal();
  }

  function setupApiRegistry() {
    populateSelect($("#familyFilter"), unique(data.endpoints.map(endpoint => endpoint.family)));
    populateSelect($("#phaseFilter"), unique(data.endpoints.map(endpoint => endpoint.phase)));
    populateSelect($("#accessFilter"), unique(data.endpoints.map(endpoint => endpoint.access)));
    ["#apiSearch", "#familyFilter", "#phaseFilter", "#accessFilter"].forEach(selector => $(selector).addEventListener(selector === "#apiSearch" ? "input" : "change", renderEndpoints));
    $("#resetApiFilters").addEventListener("click", () => {
      $("#apiSearch").value = "";
      $("#familyFilter").value = "all";
      $("#phaseFilter").value = "all";
      $("#accessFilter").value = "all";
      renderEndpoints();
    });
    renderEndpoints();
  }

  async function loadRouteRegistry() {
    const notice = $("#routeRegistryNotice");
    try {
      const response = await fetch("/assets/cmx-routes.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const registry = await response.json();
      liveRoutes = Array.isArray(registry.routes) ? registry.routes : [];
      const unmapped = liveRoutes.filter(route => !data.pagePlans[route.path]);
      notice.classList.toggle("is-warning", unmapped.length > 0);
      notice.innerHTML = `<strong>Live registry loaded:</strong> version ${escapeHtml(registry.version)} with ${liveRoutes.length} routes. ${unmapped.length ? `${unmapped.length} route${unmapped.length === 1 ? "" : "s"} currently lack a backend decision and are highlighted.` : "Every registered route has a documented backend position."}`;
    } catch (error) {
      liveRoutes = Object.keys(data.pagePlans).map(path => ({ path, name: path, category: "Fallback", status: "Unknown", visibility: "Unknown" }));
      notice.classList.add("is-warning");
      notice.innerHTML = `<strong>Registry fallback active:</strong> the live JSON registry could not be loaded. The page map is using the embedded blueprint paths only.`;
    }
    setupPageMapFilters();
    renderPageMap();
  }

  function setupPageMapFilters() {
    const select = $("#pageModeFilter");
    if (select.options.length === 1) {
      const modes = unique([...Object.values(data.pagePlans).map(plan => plan.mode), "Unmapped"]);
      populateSelect(select, modes);
    }
    $("#pageSearch").addEventListener("input", renderPageMap);
    $("#pageModeFilter").addEventListener("change", renderPageMap);
    $("#resetPageFilters").addEventListener("click", () => {
      $("#pageSearch").value = "";
      $("#pageModeFilter").value = "all";
      renderPageMap();
    });
  }

  function renderPageMap() {
    const search = $("#pageSearch").value.trim().toLowerCase();
    const mode = $("#pageModeFilter").value;
    const routes = [...liveRoutes].sort((a, b) => a.path.localeCompare(b.path));
    const filtered = routes.filter(route => {
      const plan = data.pagePlans[route.path];
      const planMode = plan ? plan.mode : "Unmapped";
      const haystack = [route.path, route.name, route.category, route.status, route.visibility, planMode, plan?.summary || "", ...(plan?.endpoints || [])].join(" ").toLowerCase();
      return (!search || haystack.includes(search)) && (mode === "all" || planMode === mode);
    });
    $("#pageMap").innerHTML = filtered.length ? filtered.map(route => {
      const plan = data.pagePlans[route.path];
      const planMode = plan ? plan.mode : "Unmapped";
      return `<article class="page-card${plan ? "" : " is-unmapped"}">
        <div class="page-card-head">
          <div><div class="route-name">${escapeHtml(route.name || route.category || "Registered route")}</div><h3 class="route-path">${escapeHtml(route.path)}</h3></div>
          <span class="page-mode">${escapeHtml(planMode)}</span>
        </div>
        <p>${escapeHtml(plan?.summary || "This route exists in the live registry but has no backend decision in the blueprint yet.")}</p>
        <div class="endpoint-links">${plan?.endpoints?.length ? plan.endpoints.map(endpoint => `<span class="endpoint-link">${escapeHtml(endpoint)}</span>`).join("") : `<span class="no-endpoints">No backend endpoint required in the current plan.</span>`}</div>
      </article>`;
    }).join("") : `<div class="panel empty-state">No pages match the current filters.</div>`;
  }

  function renderInfrastructure() {
    $("#infrastructureFlow").innerHTML = data.infrastructure.map(node => `<article class="infrastructure-node"><span class="node-order">${node.order}</span><h3>${escapeHtml(node.name)}</h3><span class="chip">${escapeHtml(node.status)}</span><p>${escapeHtml(node.purpose)}</p><div class="node-controls">${node.controls.map(control => `<span class="chip">${escapeHtml(control)}</span>`).join("")}</div></article>`).join("");
    $("#environmentGrid").innerHTML = data.environments.map(environment => `<article class="environment-card"><strong>${escapeHtml(environment.name)}</strong><p>${escapeHtml(environment.purpose)}</p><dl><dt>Deploy</dt><dd>${escapeHtml(environment.deploy)}</dd><dt>Data</dt><dd>${escapeHtml(environment.data)}</dd><dt>Access</dt><dd>${escapeHtml(environment.access)}</dd></dl></article>`).join("");
    $("#controlList").innerHTML = data.controls.map(control => `<div class="check-item">${escapeHtml(control)}</div>`).join("");
    $("#applicationTree").textContent = data.applicationTree;
  }

  function renderDataModels() {
    $("#modelGrid").innerHTML = data.models.map(model => `<article class="model-card"><h3>${escapeHtml(model.name)}</h3><p>${escapeHtml(model.purpose)}</p><div class="field-list">${model.fields.map(field => `<code>${escapeHtml(field)}</code>`).join("")}</div></article>`).join("");
    $("#relationshipMap").innerHTML = data.relationships.map(relationship => `<span class="relationship">${escapeHtml(relationship)}</span>`).join("");
  }

  function permissionClass(value) {
    if (value === true) return "permission-yes";
    if (value === false) return "permission-no";
    return "permission-conditional";
  }

  function permissionLabel(value) {
    if (value === true) return "Allowed";
    if (value === false) return "No";
    return value;
  }

  function renderPermissions() {
    $("#permissionLayers").innerHTML = data.permissionLayers.map(layer => `<article class="permission-layer"><h3>${escapeHtml(layer.title)}</h3><p>${escapeHtml(layer.text)}</p></article>`).join("");
    $("#roleMatrix").innerHTML = data.roleMatrix.map(row => `<tr><td>${escapeHtml(row.capability)}</td><td class="${permissionClass(row.viewer)}">${escapeHtml(permissionLabel(row.viewer))}</td><td class="${permissionClass(row.operator)}">${escapeHtml(permissionLabel(row.operator))}</td><td class="${permissionClass(row.admin)}">${escapeHtml(permissionLabel(row.admin))}</td></tr>`).join("");
  }

  function renderRoadmap() {
    $("#roadmapTimeline").innerHTML = data.roadmap.map(phase => `<article class="roadmap-phase"><div class="phase-number">${escapeHtml(phase.phase)}<br><span class="chip">${escapeHtml(phase.state)}</span></div><div class="phase-main"><h3>${escapeHtml(phase.name)}</h3><p>${escapeHtml(phase.objective)}</p></div><div class="deliverables">${phase.deliverables.map(item => `<span class="deliverable">${escapeHtml(item)}</span>`).join("")}</div></article>`).join("");
    $("#readinessChecklist").innerHTML = data.readiness.map((item, index) => `<div class="readiness-item"><strong>${String(index + 1).padStart(2, "0")}</strong>${escapeHtml(item)}</div>`).join("");
  }

  function renderDecisions() {
    const renderList = items => items.map(item => `<div class="decision-item">${escapeHtml(item)}</div>`).join("");
    $("#approvedDecisions").innerHTML = renderList(data.decisions.approved);
    $("#blockedDecisions").innerHTML = renderList(data.decisions.blocked);
    $("#deferredDecisions").innerHTML = renderList(data.decisions.deferred);
  }

  function setupCopySummary() {
    $("#copySummaryButton").addEventListener("click", async () => {
      const summary = [
        "CMX Backend Blueprint",
        `Version: ${data.version}`,
        `Updated: ${data.updated}`,
        `Endpoint contracts: ${data.endpoints.length}`,
        `API families: ${unique(data.endpoints.map(endpoint => endpoint.family)).length}`,
        "Current backend endpoints live: 0",
        "Direction: Dockerized FastAPI on Linux behind Cloudflare Access and Tunnel, staging first, production approval required."
      ].join("\n");
      await navigator.clipboard.writeText(summary);
      showToast("Blueprint summary copied");
    });
  }

  function init() {
    renderMetrics();
    renderOverview();
    setupTabs();
    setupApiRegistry();
    loadRouteRegistry();
    renderInfrastructure();
    renderDataModels();
    renderPermissions();
    renderRoadmap();
    renderDecisions();
    setupCopySummary();
    $("#lastUpdated").textContent = `Updated ${data.updated} · v${data.version}`;
  }

  document.addEventListener("DOMContentLoaded", init);
})();
