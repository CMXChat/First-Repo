(() => {
  'use strict';

  const VERSION = '20260804-1';

  function ensureStyle(id, path) {
    const href = `${path}?v=${VERSION}`;
    let link = document.getElementById(id);
    if (!link) {
      link = document.createElement('link');
      link.id = id;
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

  ensureStyle('briefSystemStyle', '/assets/brief/brief-system.css');
  ensureStyle('briefSystemFixStyle', '/assets/brief/brief-system-fixes.css');
  loadScript();
})();
