(() => {
  'use strict';

  const API_BASE = location.hostname === 'db.cmxchat.com'
    ? 'https://api.cmxchat.com/api/v1'
    : 'http://localhost:8000/api/v1';

  async function readJson(response) {
    if (response.status === 204) return null;
    try { return await response.json(); }
    catch { return null; }
  }

  function toError(response, body) {
    const error = new Error(body?.detail || `Request failed with ${response.status}`);
    error.status = response.status;
    error.body = body;
    return error;
  }

  async function operatorSession() {
    const response = await fetch(`${API_BASE}/checkin/operator/session`, {
      credentials: 'include',
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    const body = await readJson(response);
    if (!response.ok) throw toError(response, body);
    if (!body?.csrf_token) {
      const error = new Error('Private session is missing its CSRF token');
      error.status = 401;
      throw error;
    }
    return body;
  }

  async function request(path, options = {}) {
    const { mutation = false, headers: optionHeaders = {}, ...fetchOptions } = options;
    const headers = { Accept: 'application/json', ...optionHeaders };

    if (mutation) {
      const session = await operatorSession();
      headers['X-CSRF-Token'] = session.csrf_token;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      cache: 'no-store',
      ...fetchOptions,
      headers,
    });
    const body = await readJson(response);
    if (!response.ok) throw toError(response, body);
    return body;
  }

  function jsonMutation(path, method, payload) {
    return request(path, {
      mutation: true,
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  const api = {
    baseUrl: API_BASE,
    operatorSession,
    listPeople: () => request('/checkin/operator/directory/people'),
    getPerson: (personId) => request(`/checkin/operator/directory/people/${encodeURIComponent(personId)}`),
    createPerson: (displayName) => jsonMutation('/checkin/operator/directory/people', 'POST', { display_name: displayName }),
    updatePerson: (personId, patch) => jsonMutation(`/checkin/operator/directory/people/${encodeURIComponent(personId)}`, 'PATCH', patch),
    listContactMethods: (personId) => request(`/checkin/operator/directory/people/${encodeURIComponent(personId)}/contact-methods`),
    createEmailContactMethod: (personId, address) => jsonMutation(`/checkin/operator/directory/people/${encodeURIComponent(personId)}/contact-methods`, 'POST', { channel: 'email', address }),
    setContactMethodLifecycle: (contactId, lifecycle) => jsonMutation(`/checkin/operator/directory/contact-methods/${encodeURIComponent(contactId)}`, 'PATCH', { lifecycle }),
  };

  window.CMXDirectoryLabApi = Object.freeze(api);
  document.documentElement.dataset.directoryTransport = 'protected-api-v1';
})();
