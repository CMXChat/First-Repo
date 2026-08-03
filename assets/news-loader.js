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
      .replace(/(<link rel="stylesheet" href="\/assets\/news-media\.css[^>]*>)/, `$1\n  <link rel="stylesheet" href="/assets/news-weather-modern.css?v=${token}" />`)
      .replace(/\/assets\/news-data\.js(?:\?[^"']*)?/g, `/assets/news-data.js?v=${token}`)
      .replace(/(<script src="\/assets\/news-data\.js[^>]*><\/script>)/, `$1\n  <script src="/assets/daily-song.js?v=${token}" defer></script>\n  <script src="/assets/news-song-sync.js?v=${token}" defer></script>\n  <script src="/assets/daily-weather.js?v=${token}" defer></script>\n  <script src="/assets/news-weather-sync.js?v=${token}" defer></script>\n  <script src="/assets/daily-culture.js?v=${token}" defer></script>\n  <script src="/assets/news-culture-sync.js?v=${token}" defer></script>`)
      .replace(/\/assets\/daily-video\.js(?:\?[^"']*)?/g, `/assets/daily-video.js?v=${token}`)
      .replace(/\/assets\/news\.js(?:\?[^"']*)?/g, `/assets/news.js?v=${token}`)
      .replace(/(<script src="\/assets\/news\.js[^>]*><\/script>)/, `$1\n  <script src="/assets/news-weather-modern.js?v=${token}" defer></script>`)
      .replace(/\/assets\/news-media\.js(?:\?[^"']*)?/g, `/assets/news-media.js?v=${token}`)
      .replace(/\/assets\/news-weather-modern\.css(?:\?[^"']*)?/g, `/assets/news-weather-modern.css?v=${token}`)
      .replace(/\/assets\/news-weather-modern\.js(?:\?[^"']*)?/g, `/assets/news-weather-modern.js?v=${token}`);

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
