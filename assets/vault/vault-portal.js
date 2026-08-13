'use strict';

(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('vaultThemeToggle');
  const themeMeta = document.getElementById('vaultThemeMeta');
  const joinButton = document.getElementById('joinDiscord');
  const inviteNote = document.getElementById('inviteNote');
  const mobileNav = document.querySelectorAll('[data-mobile-target]');
  const THEME_KEY = 'vault_theme_v1';

  function readTheme() {
    try {
      return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  }

  function applyTheme(theme, save = false) {
    const next = theme === 'light' ? 'light' : 'dark';
    root.dataset.theme = next;
    if (themeButton) {
      themeButton.setAttribute('aria-pressed', next === 'light' ? 'true' : 'false');
      themeButton.setAttribute('aria-label', next === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    }
    if (themeMeta) themeMeta.textContent = next === 'light' ? 'LIGHT' : 'DARK';
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', next === 'light' ? '#eef5fb' : '#02070d');
    if (save) {
      try { localStorage.setItem(THEME_KEY, next); } catch { /* preference stays in this tab */ }
    }
  }

  applyTheme(readTheme());

  themeButton?.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'light' ? 'dark' : 'light', true);
  });

  joinButton?.addEventListener('click', (event) => {
    const invite = joinButton.dataset.inviteUrl || '';
    if (!invite) {
      event.preventDefault();
      if (inviteNote) inviteNote.textContent = 'Invite link is being added. Once connected, this button opens the server instantly.';
      return;
    }
    joinButton.href = invite;
  });

  mobileNav.forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.mobileTarget || '');
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
