(() => {
  'use strict';

  const brief = window.CMX_NEWS_BRIEF || {};
  const header = document.querySelector('.brief-header');
  const workspace = document.getElementById('newsWorkspace');
  if (!header || !workspace || document.getElementById('newsSignalRail')) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const editionKey = String(brief.meta?.date || new Date().toISOString().slice(0, 10))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
  const storagePrefix = `cmx-news:${editionKey}:polish`;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  let visibilityPaused = false;

  function installStylesheet() {
    if ($('link[href^="/assets/news-polish.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/assets/news-polish.css?v=${Date.now()}`;
    document.head.appendChild(link);
  }

  function readStorage(key, fallback) {
    try {
      const value = window.localStorage.getItem(`${storagePrefix}:${key}`);
      return value === null ? fallback : value;
    } catch {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage.setItem(`${storagePrefix}:${key}`, value);
    } catch {}
  }

  function make(tag, className = '', text = '') {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function actionRows() {
    return $$('#nextStepsCards .card-list li');
  }

  function actionStats() {
    const rows = actionRows();
    const done = rows.filter(row => row.classList.contains('is-complete')).length;
    return { done, total: rows.length, percent: rows.length ? Math.round((done / rows.length) * 100) : 0 };
  }

  function nextActionText() {
    const row = actionRows().find(item => !item.classList.contains('is-complete'));
    return row?.querySelector('.news-action-toggle')?.dataset.actionText || row?.textContent?.trim() || 'Choose one useful action';
  }

  function nextBirthday(monthIndex, day) {
    const now = new Date();
    let target = new Date(now.getFullYear(), monthIndex, day, 0, 0, 0, 0);
    if (target < now) target = new Date(now.getFullYear() + 1, monthIndex, day, 0, 0, 0, 0);
    return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000));
  }

  function localClock(id, fallback) {
    return document.getElementById(id)?.textContent?.trim() || fallback;
  }

  function songTitle() {
    const song = window.CMX_DAILY_SONG || {};
    return song.displayTitle || [song.title, song.artist].filter(Boolean).join(' · ') || 'Today’s song';
  }

  function weatherSummary() {
    const cards = $$('#weatherCards .weather-card, #weatherCards article, #weather .brief-card');
    return cards.slice(0, 2).map(card => card.querySelector('h3')?.textContent?.trim() || card.querySelector('strong')?.textContent?.trim()).filter(Boolean).join(' / ') || 'Two-city weather ready';
  }

  function crystalInputStatus() {
    const text = JSON.stringify(brief.crystal || []).toLowerCase();
    if (/three rough paragraphs|three paragraphs|own paragraphs/.test(text)) return '3 paragraphs requested';
    return Array.isArray(brief.crystal) && brief.crystal.length ? 'Daily context included' : 'Waiting for her words';
  }

  function railItems() {
    return [
      ['BROOKLYN', localClock('brooklynTime', 'New York time')],
      ['WAIKATO', localClock('waikatoTime', 'New Zealand time')],
      ['NEXT', nextActionText()],
      ['BIRTHDAYS', `${nextBirthday(8, 14)} days to Sep 14 · ${nextBirthday(8, 15)} days to Sep 15`],
      ['MUSIC', songTitle()],
      ['WEATHER', weatherSummary()],
      ['CRYSTAL', crystalInputStatus()]
    ];
  }

  function setRailPaused(paused, persist = true) {
    const rail = $('#newsSignalRail');
    const button = $('#newsSignalToggle');
    const strip = $('#newsSignalStrip');
    if (!rail || !button || !strip) return;
    rail.dataset.paused = String(paused);
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = paused ? '▶ Play' : '❚❚ Pause';
    button.setAttribute('aria-label', paused ? 'Play moving briefing signals' : 'Pause moving briefing signals');
    strip.style.animationPlayState = paused ? 'paused' : 'running';
    const status = $('#newsSignalStatus');
    if (status) status.textContent = paused ? 'Moving briefing signals paused.' : 'Moving briefing signals playing.';
    if (persist) writeStorage('rail-paused', String(paused));
  }

  function buildRail() {
    const rail = make('section', 'news-signal-rail');
    rail.id = 'newsSignalRail';
    rail.setAttribute('aria-label', 'Moving daily briefing signals');

    const button = make('button', 'news-signal-toggle');
    button.id = 'newsSignalToggle';
    button.type = 'button';

    const windowNode = make('div', 'news-signal-window');
    const strip = make('div', 'news-signal-strip');
    strip.id = 'newsSignalStrip';
    const items = railItems();
    [...items, ...items].forEach(([label, value]) => {
      const item = make('span');
      item.append(make('b', '', label), make('i', '', value));
      strip.appendChild(item);
    });
    windowNode.appendChild(strip);

    const status = make('span', 'sr-only', 'Moving briefing signals playing.');
    status.id = 'newsSignalStatus';
    status.setAttribute('role', 'status');
    rail.append(button, status, windowNode);

    const experience = $('#newsExperienceBar');
    if (experience) experience.insertAdjacentElement('afterend', rail);
    else header.prepend(rail);

    button.addEventListener('click', () => setRailPaused(button.getAttribute('aria-pressed') !== 'true'));
    setRailPaused(readStorage('rail-paused', reducedMotion ? 'true' : 'false') === 'true', false);
    return rail;
  }

  function pulseCard(label, value, detail, tone, visual = null) {
    const card = make('article', `news-pulse-card tone-${tone}`);
    if (visual) card.appendChild(visual);
    const body = make('div');
    body.append(make('span', '', label), make('strong', '', value), make('small', '', detail));
    card.appendChild(body);
    return card;
  }

  function ring(percent) {
    const node = make('div', 'news-pulse-ring');
    node.style.setProperty('--pulse-value', String(percent));
    node.setAttribute('role', 'img');
    node.setAttribute('aria-label', `${percent} percent of today’s actions complete`);
    node.appendChild(make('span', '', `${percent}%`));
    return node;
  }

  function buildPulse() {
    const section = make('section', 'news-pulse');
    section.id = 'newsPulse';
    section.setAttribute('aria-labelledby', 'newsPulseTitle');
    const heading = make('div', 'news-pulse-heading');
    const titleWrap = make('div');
    titleWrap.append(make('p', 'path-label', '~/quick/today-at-a-glance'));
    const title = make('h3', '', 'TODAY AT A GLANCE');
    title.id = 'newsPulseTitle';
    titleWrap.appendChild(title);
    heading.append(titleWrap, make('p', '', 'Real page state, current timing, and what still needs a human answer.'));
    const grid = make('div', 'news-pulse-grid');
    grid.id = 'newsPulseGrid';
    section.append(heading, grid);

    const tabs = $('.news-workspace-tabs');
    if (tabs) tabs.insertAdjacentElement('beforebegin', section);
    else workspace.appendChild(section);
    renderPulse();
  }

  function renderPulse() {
    const grid = $('#newsPulseGrid');
    if (!grid) return;
    const stats = actionStats();
    const brooklyn = localClock('brooklynTime', 'Brooklyn');
    const waikato = localClock('waikatoTime', 'Waikato');
    grid.replaceChildren(
      pulseCard('ACTIONS', `${stats.done}/${stats.total || 0} complete`, stats.total ? `${stats.total - stats.done} still open on this device` : 'No checklist loaded', 'jay', ring(stats.percent)),
      pulseCard('TWO PLACES', `${brooklyn} ↔ ${waikato}`, 'Current local clocks stay visible together', 'shared'),
      pulseCard('BIRTHDAY WINDOW', `${nextBirthday(8, 14)} / ${nextBirthday(8, 15)} days`, 'Crystal Sep 14 · Jay Sep 15', 'gold'),
      pulseCard('CRYSTAL’S VOICE', crystalInputStatus(), 'Her words can correct the next edition', 'crystal'),
      pulseCard('OPENING TRACK', songTitle(), 'Refresh or restart the player if media stalls', 'violet')
    );
  }

  function refreshMedia(button) {
    window.dispatchEvent(new CustomEvent('news:media-refresh'));
    window.dispatchEvent(new CustomEvent('news:refresh'));
    renderPulse();
    renderRail();
    button.textContent = '✓ Refreshed';
    const status = $('#newsRefreshStatus');
    if (status) status.textContent = 'Briefing widgets and loaded media were refreshed.';
    window.setTimeout(() => { button.textContent = '↻ Refresh'; }, 1500);
  }

  function renderRail() {
    const strip = $('#newsSignalStrip');
    if (!strip) return;
    const items = railItems();
    strip.replaceChildren();
    [...items, ...items].forEach(([label, value]) => {
      const item = make('span');
      item.append(make('b', '', label), make('i', '', value));
      strip.appendChild(item);
    });
    const paused = $('#newsSignalToggle')?.getAttribute('aria-pressed') === 'true';
    strip.style.animationPlayState = paused ? 'paused' : 'running';
  }

  function addRefreshControl() {
    const actions = $('.news-experience-actions');
    if (!actions || $('#newsRefreshBrief')) return;
    const button = make('button', 'news-experience-button', '↻ Refresh');
    button.id = 'newsRefreshBrief';
    button.type = 'button';
    button.addEventListener('click', () => refreshMedia(button));
    actions.prepend(button);
    const status = make('span', 'sr-only', 'Briefing widgets ready.');
    status.id = 'newsRefreshStatus';
    status.setAttribute('role', 'status');
    actions.appendChild(status);
  }

  function coordinateControls() {
    const personal = $('#newsPersonalView');
    if (personal) {
      personal.textContent = document.body.classList.contains('news-personal-view') ? 'Show build notes' : 'Hide build notes';
      personal.addEventListener('click', () => {
        window.setTimeout(() => {
          personal.textContent = document.body.classList.contains('news-personal-view') ? 'Show build notes' : 'Hide build notes';
        }, 0);
      });
    }

    window.addEventListener('news:depth-change', event => {
      const quick = event.detail?.depth === 'quick';
      if (personal) {
        personal.hidden = quick;
        personal.setAttribute('aria-hidden', String(quick));
      }
    });
  }

  function enhanceSectionNavigation() {
    const nav = $('.brief-nav');
    if (!nav || !('IntersectionObserver' in window)) return;
    const links = $$('a[href^="#"]', nav);
    const byId = new Map(links.map(link => [link.getAttribute('href')?.slice(1), link]));
    const sections = [...byId.keys()].map(id => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach(link => link.classList.toggle('is-current', link === byId.get(visible.target.id)));
    }, { rootMargin: '-20% 0px -68% 0px', threshold: [0.01, 0.25, 0.5] });
    sections.forEach(section => observer.observe(section));
  }

  function addBackToTop() {
    const button = make('button', 'news-back-top', '↑ Top');
    button.id = 'newsBackTop';
    button.type = 'button';
    button.setAttribute('aria-label', 'Back to top of briefing');
    button.addEventListener('click', () => header.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    document.body.appendChild(button);
    const update = () => button.classList.toggle('is-visible', window.scrollY > 700);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function bindStateUpdates() {
    window.addEventListener('news:actions-changed', () => {
      renderPulse();
      renderRail();
    });
    window.addEventListener('news:workspace-rendered', renderPulse);
    const host = $('#nextStepsCards');
    if (host) {
      const observer = new MutationObserver(() => {
        renderPulse();
        renderRail();
      });
      observer.observe(host, { subtree: true, attributes: true, attributeFilter: ['class', 'aria-pressed'] });
    }

    document.addEventListener('visibilitychange', () => {
      const button = $('#newsSignalToggle');
      if (!button) return;
      if (document.hidden) {
        visibilityPaused = button.getAttribute('aria-pressed') !== 'true';
        if (visibilityPaused) setRailPaused(true, false);
      } else if (visibilityPaused) {
        visibilityPaused = false;
        setRailPaused(false, false);
      }
    });
  }

  installStylesheet();
  buildRail();
  buildPulse();
  addRefreshControl();
  coordinateControls();
  enhanceSectionNavigation();
  addBackToTop();
  bindStateUpdates();
})();
