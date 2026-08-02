(() => {
  'use strict';

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input, init) => {
    const response = await originalFetch(input, init);
    const requestUrl = typeof input === 'string' ? input : input?.url || '';

    if (!requestUrl.includes('/assets/cmx-news.html')) return response;

    const token = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const html = await response.text();
    const refreshedHtml = html
      .replace(/\/assets\/news-data\.js(?:\?[^"']*)?/g, `/assets/news-data.js?v=${token}`)
      .replace(/(<script src="\/assets\/news-data\.js[^>]*><\/script>)/, `$1\n  <script src="/assets/daily-song.js?v=${token}" defer></script>`)
      .replace(/\/assets\/daily-video\.js(?:\?[^"']*)?/g, `/assets/daily-video.js?v=${token}`)
      .replace(/\/assets\/news\.js(?:\?[^"']*)?/g, `/assets/news.js?v=${token}`)
      .replace(/\/assets\/news-media\.js(?:\?[^"']*)?/g, `/assets/news-media.js?v=${token}`);

    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    return new Response(refreshedHtml, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  };
})();
