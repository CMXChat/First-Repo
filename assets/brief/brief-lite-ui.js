(() => {
  'use strict';

  const VERSION = '20260804-1';

  function loadStyle() {
    const href = `/assets/brief/brief-system.css?v=${VERSION}`;
    let link = document.getElementById('briefSystemStyle');
    if (!link) {
      link = document.createElement('link');
      link.id = 'briefSystemStyle';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    if (link.getAttribute('href') !== href) link.setAttribute('href', href);
  }

  function loadScript() {
    if (document.getElementById('briefSystemScript') || window.BRIEF_SYSTEM) return;
    const script = document.createElement('script');
    script.id = 'briefSystemScript';
    script.src = `/assets/brief/brief-system.js?v=${VERSION}`;
    script.async = false;
    document.head.appendChild(script);
  }

  loadStyle();
  loadScript();
})();
