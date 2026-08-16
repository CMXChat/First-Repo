(() => {
  "use strict";

  /*
   * /lab safety boundary.
   * No request from the cloned Check In frontend is allowed to reach the
   * production api.cmxchat.com Check In service. Public state is synthetic.
   */

  const nativeFetch = window.fetch.bind(window);
  const PROD_API_ORIGIN = "https://api.cmxchat.com";
  const MOCK_SWITCH_ID = "lab-sandbox";

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

  function mockStatus() {
    const now = Date.now();
    const lastCheckIn = now - (4 * 60 * 60 * 1000);
    const due = lastCheckIn + (72 * 60 * 60 * 1000);
    const graceExpires = due + (24 * 60 * 60 * 1000);

    return {
      switch_id: MOCK_SWITCH_ID,
      enabled: true,
      server_time: new Date(now).toISOString(),
      last_checkin_at: new Date(lastCheckIn).toISOString(),
      next_due_at: new Date(due).toISOString(),
      grace_expires_at: new Date(graceExpires).toISOString(),
      interval_hours: 72,
      grace_hours: 24,
      document_count: 6,
      contact_count: 8,
      organization_count: 3,
      update_revision_count: 5,
      trigger_action_count: 4,
      document_uploads_enabled: false,
      lab_mock: true
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
