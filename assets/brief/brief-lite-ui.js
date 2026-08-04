(() => {
  'use strict';

  const VERSION = '20260804-8';

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

  function params() {
    try { return new URL(window.location.href).searchParams; } catch { return new URLSearchParams(); }
  }

  function shouldLoadPersonalOs() {
    const query = params();
    if (query.has('personal-os-test')) return true;
    return !query.has('browser-test') && !query.has('overlay-test');
  }

  function shouldLoadStability() {
    return !params().has('browser-test');
  }

  function loadStabilityScript() {
    if (!shouldLoadStability()) return;
    if (document.getElementById('briefPersonalOsStabilityScript') || window.BRIEF_PERSONAL_OS_STABILITY) return;
    const script = document.createElement('script');
    script.id = 'briefPersonalOsStabilityScript';
    script.src = `/assets/brief/brief-personal-os-stability.js?v=${VERSION}`;
    script.async = false;
    document.head.appendChild(script);
  }

  function loadFullHomeScript() {
    if (!shouldLoadPersonalOs()) return;
    if (window.BRIEF_FULL_HOME) {
      loadStabilityScript();
      return;
    }
    if (document.getElementById('briefFullHomeScript')) return;
    const script = document.createElement('script');
    script.id = 'briefFullHomeScript';
    script.src = `/assets/brief/brief-full-home.js?v=${VERSION}`;
    script.async = false;
    script.addEventListener('load', loadStabilityScript, { once: true });
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
      existing.addEventListener('load', loadFullHomeScript, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = 'briefPersonalOsScript';
    script.src = `/assets/brief/brief-personal-os.js?v=${VERSION}`;
    script.async = false;
    script.addEventListener('load', loadFullHomeScript, { once: true });
    document.head.appendChild(script);
  }

  function afterRepair() {
    loadPersonalOsScript();
    loadStabilityScript();
  }

  function loadRepairScript() {
    if (window.BRIEF_OVERLAY_CONTROLS_FIX) {
      afterRepair();
      return;
    }

    const existing = document.getElementById('briefOverlayControlsFixScript');
    if (existing) {
      existing.addEventListener('load', afterRepair, { once: true });
      return;
    }

    const repair = document.createElement('script');
    repair.id = 'briefOverlayControlsFixScript';
    repair.src = `/assets/brief/brief-overlay-controls-fix.js?v=${VERSION}`;
    repair.async = false;
    repair.addEventListener('load', afterRepair, { once: true });
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
  if (shouldLoadStability()) {
    ensureStyle('briefPersonalOsStabilityStyle', '/assets/brief/brief-personal-os-stability.css');
  }
  loadSystemScript();
})();
