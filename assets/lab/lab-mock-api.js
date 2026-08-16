(() => {
  "use strict";

  /*
   * /lab safety boundary.
   * No request from the cloned Check In frontend is allowed to reach the
   * production api.cmxchat.com Check In service. Public state is synthetic.
   *
   * BACKEND NOTE: when /lab gets a dedicated test API, point the Lab adapter at
   * that origin. Do not weaken this production-origin block as a shortcut.
   *
   * SWITCH POLICY NOTE: Lab policy is read from localStorage so the cloned
   * status UI, sequence simulator, and action timing all share one synthetic
   * source of truth. Production policy must live server-side and be versioned.
   */

  const nativeFetch = window.fetch.bind(window);
  const PROD_API_ORIGIN = "https://api.cmxchat.com";
  const MOCK_SWITCH_ID = "lab-sandbox";
  const CRM_STORAGE_KEY = "cmx-lab-crm-v1";
  const INVENTORY_STORAGE_KEY = "cmx-lab-inventory-v1";
  const ACTION_STORAGE_KEY = "cmx-lab-actions-v1";
  const SWITCH_POLICY_KEY = "cmx-lab-switch-policy-v1";

  window.CMX_LAB_MODE = Object.freeze({
    isolated: true,
    mockData: true,
    productionApiBlocked: true
  });

  function json(body, status = 200) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }

  function switchPolicy() {
    try {
      const stored = JSON.parse(localStorage.getItem(SWITCH_POLICY_KEY));
      if (stored?.version === 1) {
        return {
          intervalHours: Math.max(1, Math.min(720, Number(stored.intervalHours || 72))),
          graceHours: Math.max(0, Math.min(24, Number(stored.graceHours ?? 24))),
          repeat: stored.repeat !== false
        };
      }
    } catch {}
    return { intervalHours: 72, graceHours: 24, repeat: true };
  }

  function crmCounts() {
    try {
      const stored = JSON.parse(localStorage.getItem(CRM_STORAGE_KEY));
      if (Array.isArray(stored?.people) && Array.isArray(stored?.organizations)) {
        return { contacts: stored.people.length, organizations: stored.organizations.length };
      }
    } catch {}
    return { contacts: 8, organizations: 3 };
  }

  function inventoryCounts() {
    try {
      const stored = JSON.parse(localStorage.getItem(INVENTORY_STORAGE_KEY));
      if (Array.isArray(stored?.documents) && Array.isArray(stored?.assets)) {
        return { documents: stored.documents.length, assets: stored.assets.length };
      }
    } catch {}
    return { documents: 6, assets: 5 };
  }

  function actionCounts() {
    try {
      const stored = JSON.parse(localStorage.getItem(ACTION_STORAGE_KEY));
      if (Array.isArray(stored?.actions)) {
        return {
          total: stored.actions.length,
          configured: stored.actions.filter(action => action?.status !== "Draft").length
        };
      }
    } catch {}
    return { total: 4, configured: 4 };
  }

  function mockStatus() {
    const now = Date.now();
    const policy = switchPolicy();
    const elapsedHours = Math.max(0.25, Math.min(4, policy.intervalHours * 0.08));
    const lastCheckIn = now - (elapsedHours * 60 * 60 * 1000);
    const due = lastCheckIn + (policy.intervalHours * 60 * 60 * 1000);
    const graceExpires = due + (policy.graceHours * 60 * 60 * 1000);
    const directory = crmCounts();
    const inventory = inventoryCounts();
    const actions = actionCounts();

    return {
      switch_id: MOCK_SWITCH_ID,
      enabled: true,
      server_time: new Date(now).toISOString(),
      last_checkin_at: new Date(lastCheckIn).toISOString(),
      next_due_at: new Date(due).toISOString(),
      grace_expires_at: new Date(graceExpires).toISOString(),
      interval_hours: policy.intervalHours,
      grace_hours: policy.graceHours,
      repeat_enabled: policy.repeat,
      document_count: inventory.documents,
      contact_count: directory.contacts,
      organization_count: directory.organizations,
      update_revision_count: 5,
      trigger_action_count: actions.configured,
      document_uploads_enabled: false,
      lab_mock: true,
      lab_asset_count: inventory.assets,
      lab_action_total: actions.total
    };
  }

  window.fetch = async (input, init = {}) => {
    const requestUrl = input instanceof Request ? input.url : String(input);
    let url;

    try {
      url = new URL(requestUrl, location.href);
    } catch {
      return nativeFetch(input, init);
    }

    if (url.origin !== PROD_API_ORIGIN) return nativeFetch(input, init);

    const method = String(init.method || (input instanceof Request ? input.method : "GET")).toUpperCase();

    if (method === "GET" && url.pathname === "/api/v1/checkin/public/status") {
      return json(mockStatus());
    }

    console.warn(`[LAB SAFE MODE] Blocked production API request: ${method} ${url.pathname}`);
    return json({ detail: "LAB SAFE MODE: production Check In API access is blocked." }, 403);
  };

  let queued = false;
  function decorateLabState() {
    queued = false;

    const sync = document.querySelector("#syncState");
    if (sync && sync.textContent.includes("SERVER SYNCHRONIZED") && !sync.textContent.includes("LAB MOCK")) {
      sync.textContent = "SERVER SYNCHRONIZED · LAB MOCK";
    }

    const serviceLabel = document.querySelector(".local-state small");
    if (serviceLabel && serviceLabel.textContent !== "Isolated mock service") {
      serviceLabel.textContent = "Isolated mock service";
    }

    document.querySelectorAll(".official-integrity, .official-directive-foot b").forEach(node => {
      if (node.textContent.trim() === "SERVER VERIFIED") node.textContent = "LAB MOCK";
    });
  }

  function queueDecorate() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(decorateLabState);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", queueDecorate, { once: true });
  } else {
    queueDecorate();
  }

  new MutationObserver(queueDecorate).observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });
})();