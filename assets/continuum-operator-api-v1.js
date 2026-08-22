(() => {
  "use strict";

  const API_BASE = location.hostname === "db.cmxchat.com"
    ? "https://api.cmxchat.com/api/v1"
    : "http://localhost:8000/api/v1";
  const OP = "/checkin/operator";
  let sessionCache = null;

  async function readJson(response) {
    if (response.status === 204) return null;
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  function detailMessage(body, status) {
    const detail = body?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail.map((item) => item?.msg || JSON.stringify(item)).join("; ");
    }
    return body?.message || `Request failed with ${status}`;
  }

  function apiError(response, body) {
    const error = new Error(detailMessage(body, response.status));
    error.status = response.status;
    error.body = body;
    return error;
  }

  function classify(error) {
    if (!error) return "unknown";
    if (error instanceof TypeError && !Number.isFinite(error.status)) return "network";
    if (error.status === 401) return "locked";
    if (error.status === 403) return "forbidden";
    if (error.status === 404) return "not_deployed_or_missing";
    if (error.status === 409) return "conflict";
    if (error.status === 422) return "invalid";
    if (error.status === 503) return "unavailable";
    if (Number.isFinite(error.status) && error.status >= 500) return "server";
    return "request";
  }

  async function session({ refresh = false } = {}) {
    if (sessionCache && !refresh) return sessionCache;
    const response = await fetch(`${API_BASE}${OP}/session`, {
      credentials: "include",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const body = await readJson(response);
    if (!response.ok) {
      sessionCache = null;
      throw apiError(response, body);
    }
    sessionCache = body;
    return body;
  }

  async function csrfToken() {
    const current = await session();
    if (!current?.csrf_token) {
      const error = new Error("Protected session is missing its CSRF token");
      error.status = 401;
      throw error;
    }
    return current.csrf_token;
  }

  async function request(path, options = {}) {
    const {
      mutation = false,
      headers: suppliedHeaders = {},
      ...rest
    } = options;
    const headers = { Accept: "application/json", ...suppliedHeaders };
    if (mutation) headers["X-CSRF-Token"] = await csrfToken();

    const response = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      cache: "no-store",
      ...rest,
      headers,
    });
    const body = await readJson(response);
    if (!response.ok) {
      if (response.status === 401) sessionCache = null;
      throw apiError(response, body);
    }
    return body;
  }

  async function unlock(operatorKey) {
    const response = await fetch(`${API_BASE}${OP}/unlock`, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ operator_key: String(operatorKey || "") }),
    });
    const body = await readJson(response);
    if (!response.ok) {
      sessionCache = null;
      throw apiError(response, body);
    }
    sessionCache = body;
    return body;
  }

  async function logout() {
    const token = await csrfToken();
    const response = await fetch(`${API_BASE}${OP}/session`, {
      method: "DELETE",
      credentials: "include",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "X-CSRF-Token": token,
      },
    });
    const body = await readJson(response);
    if (!response.ok) throw apiError(response, body);
    sessionCache = null;
    return body;
  }

  const json = (method, body) => ({
    method,
    mutation: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  const mutation = (method = "POST") => ({ method, mutation: true });
  const id = (value) => encodeURIComponent(value);

  const api = {
    apiBase: API_BASE,
    operatorBase: OP,
    classify,
    session,
    unlock,
    logout,
    request,

    listPeople: () => request(`${OP}/directory/people`),
    createPerson: (payload) => request(`${OP}/directory/people`, json("POST", payload)),
    updatePerson: (personId, payload) => request(`${OP}/directory/people/${id(personId)}`, json("PATCH", payload)),
    listContacts: (personId) => request(`${OP}/directory/people/${id(personId)}/contact-methods`),
    createContact: (personId, payload) => request(`${OP}/directory/people/${id(personId)}/contact-methods`, json("POST", payload)),
    setContactLifecycle: (contactId, lifecycle) => request(`${OP}/directory/contact-methods/${id(contactId)}`, json("PATCH", { lifecycle })),

    listConnections: () => request(`${OP}/connections`),
    listSenders: (connectionId) => request(`${OP}/connections/${id(connectionId)}/sender-identities`),
    connectionReadiness: (connectionId) => request(`${OP}/connections/${id(connectionId)}/readiness`),

    listLibrary: () => request(`${OP}/library`),
    createContent: (payload) => request(`${OP}/library/content`, json("POST", payload)),
    getContent: (contentId) => request(`${OP}/library/content/${id(contentId)}`),
    updateContentDraft: (contentId, payload) => request(`${OP}/library/content/${id(contentId)}/draft`, json("PUT", payload)),
    saveContentVersion: (contentId) => request(`${OP}/library/content/${id(contentId)}/versions`, mutation()),

    listAutomations: () => request(`${OP}/automations`),
    createAutomation: (payload) => request(`${OP}/automations`, json("POST", payload)),
    getAutomation: (automationId) => request(`${OP}/automations/${id(automationId)}`),
    updateAutomationDraft: (automationId, payload) => request(`${OP}/automations/${id(automationId)}/draft`, json("PUT", payload)),
    preflight: (automationId) => request(`${OP}/automations/${id(automationId)}/preflight`),
    review: (automationId) => request(`${OP}/automations/${id(automationId)}/review`, mutation()),
    publish: (automationId) => request(`${OP}/automations/${id(automationId)}/publish`, mutation()),

    listRuns: (automationId) => request(`${OP}/automations/${id(automationId)}/runs`),
    requestRun: (automationId, payload) => request(`${OP}/automations/${id(automationId)}/runs`, json("POST", payload)),
    processRun: (automationId, runId, payload) => request(`${OP}/automations/${id(automationId)}/runs/${id(runId)}/process`, json("POST", payload)),
    getRun: (automationId, runId) => request(`${OP}/automations/${id(automationId)}/runs/${id(runId)}`),
    getReceipt: (automationId, runId) => request(`${OP}/automations/${id(automationId)}/runs/${id(runId)}/receipt`),
  };

  window.CMXOperatorApi = Object.freeze(api);
})();
