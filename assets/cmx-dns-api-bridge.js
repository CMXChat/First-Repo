(() => {
  'use strict';

  const path = window.location.pathname.replace(/\/index\.html$/i, '/').replace(/\/+$/, '') || '/';
  if (path !== '/osint') return;

  const nativeFetch = window.fetch.bind(window);

  window.fetch = async (input, init = {}) => {
    const requestedUrl = requestUrl(input);
    if (!requestedUrl || requestedUrl.origin !== 'https://dns.google' || requestedUrl.pathname !== '/resolve') {
      return nativeFetch(input, init);
    }

    const name = requestedUrl.searchParams.get('name') || '';
    const type = requestedUrl.searchParams.get('type') || 'A';
    const apiUrl = new URL('/api/dns', window.location.origin);
    apiUrl.searchParams.set('name', name);
    apiUrl.searchParams.set('type', type);

    const headers = new Headers(init.headers || {});
    headers.set('accept', 'application/json');

    try {
      const response = await nativeFetch(apiUrl, {
        ...init,
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
        headers
      });
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) return response;
      if (![404, 405, 501].includes(response.status)) return response;
    } catch {
      // Static hosting does not expose the FastAPI route. Use the explicit transition fallback below.
    }

    return nativeFetch(input, init);
  };

  function requestUrl(input) {
    try {
      if (typeof input === 'string' || input instanceof URL) return new URL(input, window.location.href);
      if (input instanceof Request) return new URL(input.url, window.location.href);
      return null;
    } catch {
      return null;
    }
  }
})();
