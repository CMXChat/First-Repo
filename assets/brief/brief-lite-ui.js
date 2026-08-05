(() => {
  'use strict';

  const VERSION = '20260804-3';

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

  function ensureScript(id, path) {
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.src = `${path}?v=${VERSION}`;
    script.async = false;
    document.head.appendChild(script);
  }

  ensureStyle('briefSystemStyle', '/assets/brief/brief-system.css');
  ensureStyle('briefSystemFixStyle', '/assets/brief/brief-system-fixes.css');
  ensureScript('briefSystemScript', '/assets/brief/brief-system.js');
  ensureScript('briefFirstPassFixScript', '/assets/brief/brief-first-pass-fixes.js');
})();
