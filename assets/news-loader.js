(() => {
  'use strict';

  const cacheToken = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${src}${src.includes('?') ? '&' : '?'}v=${encodeURIComponent(cacheToken)}`;
      script.async = false;
      script.referrerPolicy = 'no-referrer';
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true });
      document.head.appendChild(script);
    });
  }

  loadScript('/assets/news-data.js')
    .then(() => loadScript('/assets/news.js'))
    .catch(error => {
      const target = document.getElementById('briefSummary');
      if (target) target.textContent = 'The latest briefing could not be loaded. Refresh the page and try again.';
      console.error(error);
    });
})();
