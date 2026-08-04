(() => {
  'use strict';

  const VERSION = '20260804-2';

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

  function loadRepairScript() {
    if (document.getElementById('briefOverlayControlsFixScript') || window.BRIEF_OVERLAY_CONTROLS_FIX) return;
    const repair = document.createElement('script');
    repair.id = 'briefOverlayControlsFixScript';
    repair.src = `/assets/brief/brief-overlay-controls-fix.js?v=${VERSION}`;
    repair.async = false;
    document.head.appendChild(repair);
  }

  function loadScript() {
    if (window.BRIEF_SYSTEM) {
      loadRepairScript();
      return;
    }

    const existing = document.getElementById('briefSystemScript');
    if (existing) {
      existing.addEventListener('load', loadRepairScript, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = 'briefSystemScript';
    script.src = `/assets/brief/brief-system.js?v=${VERSION}`;
    script.async = false;
    script.addEventListener('load', loadRepairScript, { once: true });
    document.head.appendChild(script);
  }

  ensureStyle('briefSystemStyle', '/assets/brief/brief-system.css');
  ensureStyle('briefSystemFixStyle', '/assets/brief/brief-system-fixes.css');
  ensureStyle('briefOverlayControlsFixStyle', '/assets/brief/brief-overlay-controls-fix.css');
  loadScript();
})();
