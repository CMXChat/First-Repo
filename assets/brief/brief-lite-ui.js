(() => {
  'use strict';

  const VERSION = '20260804-7';

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

  function shouldLoadPersonalOs() {
    try {
      const params = new URL(window.location.href).searchParams;
      if (params.has('personal-os-test')) return true;
      return !params.has('browser-test') && !params.has('overlay-test');
    } catch {
      return true;
    }
  }

  function loadFullHomeScript() {
    if (!shouldLoadPersonalOs()) return;
    if (document.getElementById('briefFullHomeScript') || window.BRIEF_FULL_HOME) return;
    const script = document.createElement('script');
    script.id = 'briefFullHomeScript';
    script.src = `/assets/brief/brief-full-home.js?v=${VERSION}`;
    script.async = false;
    document.head.appendChild(script);
  }

  function loadPersonalOsScript() {
    if (!shouldLoadPersonalOs()) return;
    if (window.BRIEF_PERSONAL_OS) {
      loadFullHomeScript();
      return;
    }
    const existing = document.getElementById('briefPersonalOsScript');
    if (existing) {
      loadFullHomeScript();
      return;
    }
    const script = document.createElement('script');
    script.id = 'briefPersonalOsScript';
    script.src = `/assets/brief/brief-personal-os.js?v=${VERSION}`;
    script.async = false;
    script.addEventListener('load', loadFullHomeScript, { once: true });
    document.head.appendChild(script);
  }

  function loadRepairScript() {
    if (window.BRIEF_OVERLAY_CONTROLS_FIX) {
      loadPersonalOsScript();
      return;
    }

    const existing = document.getElementById('briefOverlayControlsFixScript');
    if (existing) {
      existing.addEventListener('load', loadPersonalOsScript, { once: true });
      return;
    }

    const repair = document.createElement('script');
    repair.id = 'briefOverlayControlsFixScript';
    repair.src = `/assets/brief/brief-overlay-controls-fix.js?v=${VERSION}`;
    repair.async = false;
    repair.addEventListener('load', loadPersonalOsScript, { once: true });
    document.head.appendChild(repair);
  }

  function loadSystemScript() {
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
  if (shouldLoadPersonalOs()) {
    ensureStyle('briefPersonalOsStyle', '/assets/brief/brief-personal-os.css');
    ensureStyle('briefPersonalOsDensityStyle', '/assets/brief/brief-personal-os-density.css');
    ensureStyle('briefPersonalOsMobileStyle', '/assets/brief/brief-personal-os-mobile.css');
    ensureStyle('briefFullHomeStyle', '/assets/brief/brief-full-home.css');
  }
  loadSystemScript();
})();
