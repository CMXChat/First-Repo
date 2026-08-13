'use strict';

(() => {
  const SESSION_KEY = 'cmx_vault_session_v1';
  const THEME_KEY = 'vault_theme_v1';
  const root = document.documentElement;
  const body = document.body;
  const memberId = body.dataset.memberId;
  const profile = window.VaultProfiles?.[memberId];

  function hasSession() {
    try {
      const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      return Boolean(session?.authorized && session?.at);
    } catch { return false; }
  }

  function getTheme() {
    try { return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'; }
    catch { return 'dark'; }
  }

  function setTheme(theme, save = false) {
    const next = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = next;
    const toggle = document.getElementById('profileThemeToggle');
    toggle?.setAttribute('aria-pressed', next === 'light' ? 'true' : 'false');
    toggle?.setAttribute('aria-label', `Switch to ${next === 'light' ? 'dark' : 'light'} mode`);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#eef5fb' : '#02070d');
    if (save) {
      try { localStorage.setItem(THEME_KEY, next); } catch { /* local preference is optional */ }
    }
  }

  function formatLocal(zone, options) {
    if (!zone) return null;
    try { return new Intl.DateTimeFormat('en-US', { timeZone: zone, ...options }).format(new Date()); }
    catch { return null; }
  }

  function nextBrief(zone) {
    if (!zone) return 'Starts after timezone confirmation';
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23'
    }).formatToParts(now).reduce((all, part) => ({ ...all, [part.type]: part.value }), {});
    const localHour = Number(parts.hour);
    return localHour < 7 ? 'Today around 7:00 AM' : 'Tomorrow around 7:00 AM';
  }

  function render() {
    if (!profile) {
      window.location.replace('/vault/');
      return;
    }
    document.title = `${profile.name} · Vault 3.0`;
    body.dataset.accent = profile.accent;
    document.querySelectorAll('[data-profile-name]').forEach((el) => { el.textContent = profile.name; });
    document.querySelector('[data-profile-initials]').textContent = profile.initials;
    document.querySelector('[data-profile-role]').textContent = profile.role;
    document.querySelector('[data-profile-location]').textContent = profile.location;
    document.querySelector('[data-profile-intro]').textContent = profile.intro;
    document.querySelector('[data-profile-status]').textContent = profile.status;
    document.querySelector('[data-next-brief]').textContent = nextBrief(profile.zone);
    const facts = document.querySelector('[data-profile-facts]');
    profile.facts.forEach((fact) => {
      const li = document.createElement('li');
      li.textContent = fact;
      facts.appendChild(li);
    });
    const time = formatLocal(profile.zone, { hour: 'numeric', minute: '2-digit', hour12: true });
    const date = formatLocal(profile.zone, { weekday: 'long', month: 'long', day: 'numeric' });
    document.querySelector('[data-local-time]').textContent = time || 'Timezone pending';
    document.querySelector('[data-local-date]').textContent = date || 'Add location to activate';
    body.classList.add('profile-ready');
  }

  if (!hasSession()) {
    window.location.replace('/vault/');
    return;
  }

  setTheme(getTheme());
  document.getElementById('profileThemeToggle')?.addEventListener('click', () => {
    setTheme(root.dataset.theme === 'light' ? 'dark' : 'light', true);
  });
  render();
})();
