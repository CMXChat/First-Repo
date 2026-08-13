'use strict';

(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('vaultThemeToggle');
  const themeMeta = document.getElementById('vaultThemeMeta');
  const joinButton = document.getElementById('joinDiscord');
  const inviteNote = document.getElementById('inviteNote');
  const mobileNav = document.querySelectorAll('[data-mobile-target]');
  const memberSearch = document.getElementById('memberSearch');
  const featuredMembers = document.getElementById('featuredMembers');
  const memberGrid = document.getElementById('memberGrid');
  const directoryEmpty = document.getElementById('directoryEmpty');
  const profileTransition = document.getElementById('profileTransition');
  const transitionName = document.getElementById('transitionName');
  const vaultToast = document.getElementById('vaultToast');
  const rosterScan = document.getElementById('rosterScan');
  const THEME_KEY = 'vault_theme_v1';
  let toastTimer;

  function showToast(message) {
    if (!vaultToast) return;
    window.clearTimeout(toastTimer);
    vaultToast.textContent = message;
    vaultToast.classList.add('show');
    toastTimer = window.setTimeout(() => vaultToast.classList.remove('show'), 3200);
  }

  window.addEventListener('vault:toast', (event) => showToast(event.detail));

  function openMemberRoom(event, member) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (!profileTransition || !member.route) {
      window.location.href = member.route;
      return;
    }
    transitionName.textContent = member.name;
    profileTransition.classList.add('open');
    profileTransition.setAttribute('aria-hidden', 'false');
    window.setTimeout(() => { window.location.href = member.route; }, 620);
  }

  function initials(name) {
    return name.split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();
  }

  function memberCard(member, featured = false) {
    const card = document.createElement(member.route ? 'a' : 'button');
    card.className = featured ? `featured-member accent-${member.accent || 'blue'}` : 'member-card';
    if (member.route) {
      card.href = member.route;
      card.addEventListener('click', (event) => openMemberRoom(event, member));
    } else {
      card.type = 'button';
      card.addEventListener('click', () => showToast(`${member.name}'s room is reserved. Add their details when they're ready.`));
    }
    card.dataset.memberSearch = `${member.name} ${member.display || ''} ${member.role || ''} ${member.location || ''}`.toLowerCase();

    const avatar = document.createElement('span');
    avatar.className = 'member-avatar';
    avatar.textContent = initials(member.name);
    avatar.setAttribute('aria-hidden', 'true');

    const copy = document.createElement('span');
    copy.className = 'member-card-copy';
    const name = document.createElement('strong');
    name.textContent = member.display || member.name;
    const detail = document.createElement('small');
    detail.textContent = member.location || member.role || 'Profile details pending';
    copy.append(name, detail);

    const state = document.createElement('span');
    state.className = `member-card-state${member.route ? ' open' : ''}`;
    state.textContent = member.route ? (featured ? 'Open profile →' : 'Open') : 'Queued';
    card.append(avatar, copy, state);
    return card;
  }

  function renderDirectory(query = '') {
    const members = Array.from(window.VaultDirectory || []);
    const featured = members.filter((member) => member.route);
    const normalized = query.trim().toLowerCase();
    const matches = members.filter((member) => `${member.name} ${member.display || ''} ${member.role || ''} ${member.location || ''}`.toLowerCase().includes(normalized));

    if (featuredMembers && !featuredMembers.childElementCount) {
      featured.forEach((member) => featuredMembers.appendChild(memberCard(member, true)));
    }
    if (memberGrid) {
      memberGrid.textContent = '';
      matches.forEach((member) => memberGrid.appendChild(memberCard(member)));
    }
    if (directoryEmpty) directoryEmpty.classList.toggle('hidden', matches.length > 0);
    document.getElementById('memberCount').textContent = String(members.length);
    document.getElementById('profileCount').textContent = String(featured.length);
    document.getElementById('queuedCount').textContent = `${members.length - featured.length} profiles queued`;
  }

  function updateBriefSchedule() {
    document.querySelectorAll('[data-next-brief]').forEach((target) => {
      const zone = target.dataset.nextBrief;
      try {
        const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone: zone, hour: '2-digit', hourCycle: 'h23' }).format(new Date()));
        target.textContent = hour < 7 ? 'today · around 7:00 AM' : 'tomorrow · around 7:00 AM';
      } catch { target.textContent = 'schedule pending'; }
    });
    const date = document.getElementById('briefingDate');
    if (date) date.textContent = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());
  }

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
      const view = button.dataset.mobileTarget || 'portalHome';
      document.body.dataset.mobileView = view;
      mobileNav.forEach((item) => item.classList.toggle('active', item === button));
      if (view === 'everything') window.scrollTo({ top: 0, behavior: 'smooth' });
      else document.getElementById(view)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  memberSearch?.addEventListener('input', () => renderDirectory(memberSearch.value));

  rosterScan?.addEventListener('click', () => {
    rosterScan.classList.remove('scanning');
    void rosterScan.offsetWidth;
    rosterScan.classList.add('scanning');
    const directory = document.querySelector('.full-directory');
    if (directory) directory.open = true;
    showToast(`${window.VaultDirectory?.length || 0} members found. Pick a name.`);
    window.setTimeout(() => directory?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 420);
  });

  document.querySelectorAll('[data-reaction]').forEach((button) => {
    button.addEventListener('click', () => {
      const count = button.querySelector('span');
      const active = button.classList.toggle('reacted');
      const base = Number(button.dataset.baseCount || count?.textContent || 0);
      button.dataset.baseCount = String(base);
      if (count) count.textContent = String(base + (active ? 1 : 0));
      button.classList.remove('reaction-pop');
      void button.offsetWidth;
      button.classList.add('reaction-pop');
    });
  });

  document.querySelectorAll('[data-scroll-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.scrollTarget || '');
      window.setTimeout(() => target?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    });
  });

  renderDirectory();
  updateBriefSchedule();
  if (window.matchMedia('(max-width: 700px)').matches) body.dataset.mobileView = 'portalHome';
})();
