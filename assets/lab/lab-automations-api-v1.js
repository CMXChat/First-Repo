(() => {
  "use strict";

  const API_BASE = location.hostname === "db.cmxchat.com"
    ? "https://api.cmxchat.com/api/v1"
    : "http://localhost:8000/api/v1";

  async function readJson(response) {
    if (response.status === 204) return null;
    try { return await response.json(); } catch { return null; }
  }

  function detailMessage(body, status) {
    const detail = body?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail.map((item) => item?.msg || JSON.stringify(item)).join("; ");
    }
    return body?.message || `Request failed with ${status}`;
  }

  async function csrfToken() {
    const response = await fetch(`${API_BASE}/checkin/operator/session`, {
      credentials: "include",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const body = await readJson(response);
    if (!response.ok) {
      const error = new Error(detailMessage(body, response.status));
      error.status = response.status;
      error.body = body;
      throw error;
    }
    if (!body?.csrf_token) {
      const error = new Error("Private session is missing its CSRF token");
      error.status = 401;
      throw error;
    }
    return body.csrf_token;
  }

  async function request(path, options = {}) {
    const { mutation = false, headers: optionHeaders = {}, ...fetchOptions } = options;
    const headers = { Accept: "application/json", ...optionHeaders };
    if (mutation) headers["X-CSRF-Token"] = await csrfToken();
    const response = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      cache: "no-store",
      ...fetchOptions,
      headers,
    });
    const body = await readJson(response);
    if (!response.ok) {
      const error = new Error(detailMessage(body, response.status));
      error.status = response.status;
      error.body = body;
      throw error;
    }
    return body;
  }

  const json = (method, body) => ({
    method,
    mutation: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  const mutation = (method = "POST") => ({ method, mutation: true });

  const auto = "/checkin/operator/automations";
  const directory = "/checkin/operator";
  const library = "/checkin/operator/library";

  window.CMXAutomationsLabApi = Object.freeze({
    apiBase: API_BASE,

    listAutomations: () => request(auto),
    createAutomation: (payload) => request(auto, json("POST", payload)),
    getAutomation: (automationId) => request(`${auto}/${encodeURIComponent(automationId)}`),
    updateDraft: (automationId, payload) => request(`${auto}/${encodeURIComponent(automationId)}/draft`, json("PUT", payload)),
    preflight: (automationId) => request(`${auto}/${encodeURIComponent(automationId)}/preflight`),
    review: (automationId) => request(`${auto}/${encodeURIComponent(automationId)}/review`, mutation()),
    publish: (automationId) => request(`${auto}/${encodeURIComponent(automationId)}/publish`, mutation()),
    archive: (automationId) => request(`${auto}/${encodeURIComponent(automationId)}/archive`, mutation()),

    listPeople: () => request(`${directory}/directory/people`),
    listContacts: (personId) => request(`${directory}/directory/people/${encodeURIComponent(personId)}/contact-methods`),
    listConnections: () => request(`${directory}/connections`),
    listSenders: (connectionId) => request(`${directory}/connections/${encodeURIComponent(connectionId)}/sender-identities`),

    listLibrary: () => request(library),
    getContent: (contentId) => request(`${library}/content/${encodeURIComponent(contentId)}`),
    saveContentVersion: (contentId) => request(`${library}/content/${encodeURIComponent(contentId)}/versions`, mutation()),

    listRuns: (automationId) => request(`${auto}/${encodeURIComponent(automationId)}/runs`),
    getRun: (automationId, runId) => request(`${auto}/${encodeURIComponent(automationId)}/runs/${encodeURIComponent(runId)}`),
    requestRun: (automationId, payload) => request(`${auto}/${encodeURIComponent(automationId)}/runs`, json("POST", payload)),
    processRun: (automationId, runId, payload) => request(`${auto}/${encodeURIComponent(automationId)}/runs/${encodeURIComponent(runId)}/process`, json("POST", payload)),
    cancelRun: (automationId, runId) => request(`${auto}/${encodeURIComponent(automationId)}/runs/${encodeURIComponent(runId)}/cancel`, mutation()),
  });
})();