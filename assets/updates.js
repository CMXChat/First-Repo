(() => {
  'use strict';

  const data = window.CMX_UPDATES;
  if (!data || !Array.isArray(data.entries)) return;

  const app = document.getElementById('app');
  const bootScreen = document.getElementById('bootScreen');
  const bootLog = document.getElementById('bootLog');
  const filterBar = document.getElementById('filterBar');
  const searchInput = document.getElementById('searchInput');
  const feed = document.getElementById('feed');
  const dateNav = document.getElementById('dateNav');
  const feedNotice = document.getElementById('feedNotice');
  const activeFilter = document.getElementById('activeFilter');
  const commandForm = document.getElementById('commandForm');
  const commandInput = document.getElementById('commandInput');
  const commandOutput = document.getElementById('commandOutput');

  const state = {
    category: 'all',
    query: ''
  };

  const categoryLabels = new Map(data.categories.map(category => [category.id, category.label]));
  const sortedEntries = [...data.entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  function formatDate(timestamp, options) {
    return new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', ...options }).format(new Date(timestamp));
  }

  function dayKey(timestamp) {
    return formatDate(timestamp, { year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll('/', '-');
  }

  function safeLink(url) {
    return typeof url === 'string' && (url.startsWith('/') || url.startsWith('https://')) ? url : null;
  }

  function showApp() {
    bootScreen.hidden = true;
    app.hidden = false;
    renderAll();
    updateClock();
    window.setInterval(updateClock, 1000);
  }

  function runBoot() {
    const lines = [
      ['mounting update feed', false],
      [`loading ${sortedEntries.length} entries`, false],
      ['checking local index', false],
      ['node ready', true]
    ];
    lines.forEach(([text, ok], index) => {
      window.setTimeout(() => {
        const p = document.createElement('p');
        p.textContent = text;
        if (ok) p.className = 'ok';
        bootLog.appendChild(p);
      }, index * 220);
    });
    window.setTimeout(showApp, 1100);
  }

  function updateClock() {
    document.getElementById('localClock').textContent = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(new Date());
  }

  function renderStatus() {
    const status = data.status;
    document.getElementById('statusHeadline').textContent = status.headline;
    document.getElementById('statusTimestamp').textContent = formatDate(status.timestamp, {
      month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
    }).toUpperCase();
    const list = document.getElementById('statusLines');
    list.textContent = '';
    status.lines.forEach(text => {
      const item = document.createElement('li');
      item.textContent = text;
      list.appendChild(item);
    });
  }

  function renderFilters() {
    filterBar.textContent = '';
    data.categories.forEach(category => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'filter-button';
      button.dataset.category = category.id;
      button.textContent = category.label;
      button.classList.toggle('active', state.category === category.id);
      button.setAttribute('aria-pressed', String(state.category === category.id));
      button.addEventListener('click', () => {
        state.category = category.id;
        renderAll();
      });
      filterBar.appendChild(button);
    });
  }

  function getVisibleEntries() {
    const query = state.query.trim().toLowerCase();
    return sortedEntries.filter(entry => {
      const categoryMatch = state.category === 'all' || entry.category === state.category;
      if (!categoryMatch) return false;
      if (!query) return true;
      const haystack = [entry.title, entry.summary, entry.category, entry.status, ...(entry.details || [])].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }

  function groupEntries(entries) {
    return entries.reduce((groups, entry) => {
      const key = dayKey(entry.timestamp);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(entry);
      return groups;
    }, new Map());
  }

  function createEntry(entry) {
    const article = document.createElement('article');
    article.className = `entry${entry.pinned ? ' pinned' : ''}`;
    article.id = entry.id;

    const time = document.createElement('div');
    time.className = 'entry-time';
    const timeStrong = document.createElement('strong');
    timeStrong.textContent = formatDate(entry.timestamp, { hour: '2-digit', minute: '2-digit' });
    const zone = document.createElement('span');
    zone.textContent = 'ET';
    time.append(timeStrong, zone);

    const main = document.createElement('div');
    main.className = 'entry-main';

    const meta = document.createElement('div');
    meta.className = 'entry-meta';
    const category = document.createElement('span');
    category.className = 'category';
    category.dataset.category = entry.category;
    category.textContent = `[${categoryLabels.get(entry.category) || entry.category.toUpperCase()}]`;
    const status = document.createElement('span');
    status.className = 'entry-status';
    status.textContent = entry.status.toUpperCase();
    meta.append(category, status);

    const title = document.createElement('h3');
    title.textContent = entry.title;
    const summary = document.createElement('p');
    summary.className = 'entry-summary';
    summary.textContent = entry.summary;

    const actions = document.createElement('div');
    actions.className = 'entry-actions';

    let details = null;
    if (Array.isArray(entry.details) && entry.details.length) {
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'entry-action';
      toggle.textContent = 'EXPAND';
      toggle.setAttribute('aria-expanded', 'false');

      details = document.createElement('div');
      details.className = 'entry-details';
      details.hidden = true;
      const list = document.createElement('ul');
      entry.details.forEach(detail => {
        const item = document.createElement('li');
        item.textContent = detail;
        list.appendChild(item);
      });
      details.appendChild(list);

      toggle.addEventListener('click', () => {
        const open = details.hidden;
        details.hidden = !open;
        toggle.textContent = open ? 'COLLAPSE' : 'EXPAND';
        toggle.setAttribute('aria-expanded', String(open));
      });
      actions.appendChild(toggle);
    }

    const url = safeLink(entry.link);
    if (url) {
      const link = document.createElement('a');
      link.className = 'entry-action';
      link.href = url;
      link.textContent = entry.linkLabel || 'OPEN';
      actions.appendChild(link);
    }

    main.append(meta, title, summary);
    if (actions.childElementCount) main.appendChild(actions);
    if (details) main.appendChild(details);
    article.append(time, main);
    return article;
  }

  function renderFeed() {
    const entries = getVisibleEntries();
    const groups = groupEntries(entries);
    feed.textContent = '';
    dateNav.textContent = '';

    document.getElementById('entryCount').textContent = String(sortedEntries.length).padStart(2, '0');
    document.getElementById('visibleCount').textContent = String(entries.length).padStart(2, '0');
    document.getElementById('lastEntry').textContent = sortedEntries.length
      ? formatDate(sortedEntries[0].timestamp, { month: 'short', day: '2-digit' }).toUpperCase()
      : '--';
    activeFilter.textContent = `FILTER: ${categoryLabels.get(state.category) || 'ALL'}`;

    const noticeParts = [];
    if (state.category !== 'all') noticeParts.push(`CATEGORY ${categoryLabels.get(state.category)}`);
    if (state.query) noticeParts.push(`SEARCH “${state.query}”`);
    feedNotice.textContent = noticeParts.length ? noticeParts.join(' // ') : '';

    if (!entries.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'NO MATCHING ENTRIES';
      feed.appendChild(empty);
      return;
    }

    groups.forEach((dayEntries, key) => {
      const section = document.createElement('section');
      section.className = 'day-group';
      section.id = `day-${key}`;
      const heading = document.createElement('h2');
      heading.className = 'day-heading';
      heading.textContent = formatDate(dayEntries[0].timestamp, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }).toUpperCase();
      const list = document.createElement('div');
      list.className = 'entry-list';
      dayEntries.forEach(entry => list.appendChild(createEntry(entry)));
      section.append(heading, list);
      feed.appendChild(section);

      const navLink = document.createElement('a');
      navLink.className = 'date-link';
      navLink.href = `#day-${key}`;
      navLink.textContent = formatDate(dayEntries[0].timestamp, { month: 'short', day: '2-digit' }).toUpperCase();
      dateNav.appendChild(navLink);
    });
  }

  function renderAll() {
    renderStatus();
    renderFilters();
    renderFeed();
  }

  function applyCategory(category) {
    if (!categoryLabels.has(category)) return false;
    state.category = category;
    state.query = '';
    searchInput.value = '';
    renderAll();
    return true;
  }

  function runCommand(raw) {
    const command = raw.trim().toLowerCase().replace(/\s+/g, ' ');
    commandInput.value = '';
    if (!command) return;

    if (command === 'help') {
      commandOutput.textContent = 'COMMANDS: latest, today, all, site, tools, research, infra, general, find [word], count, clear';
      return;
    }
    if (command === 'latest') {
      state.category = 'all';
      state.query = '';
      searchInput.value = '';
      renderAll();
      const first = feed.querySelector('.entry');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      commandOutput.textContent = 'LATEST ENTRY OPENED';
      return;
    }
    if (command === 'today') {
      const today = dayKey(new Date().toISOString());
      state.category = 'all';
      state.query = '';
      searchInput.value = '';
      renderAll();
      const section = document.getElementById(`day-${today}`);
      commandOutput.textContent = section ? 'TODAY OPENED' : 'NO ENTRIES FOR TODAY';
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (command === 'infra') {
      applyCategory('infrastructure');
      commandOutput.textContent = 'FILTER: INFRA';
      return;
    }
    if (applyCategory(command)) {
      commandOutput.textContent = `FILTER: ${categoryLabels.get(command)}`;
      return;
    }
    if (command.startsWith('find ')) {
      const query = command.slice(5).trim();
      state.query = query;
      searchInput.value = query;
      renderAll();
      commandOutput.textContent = query ? `SEARCHING: ${query}` : 'SEARCH TERM MISSING';
      return;
    }
    if (command === 'count') {
      commandOutput.textContent = `${sortedEntries.length} TOTAL // ${getVisibleEntries().length} VISIBLE`;
      return;
    }
    if (command === 'clear') {
      commandOutput.textContent = '';
      return;
    }
    commandOutput.textContent = `UNKNOWN COMMAND: ${command}. TYPE HELP.`;
  }

  searchInput.addEventListener('input', () => {
    state.query = searchInput.value;
    renderFeed();
  });

  commandForm.addEventListener('submit', event => {
    event.preventDefault();
    runCommand(commandInput.value);
  });

  document.getElementById('skipBoot').addEventListener('click', showApp);
  document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  runBoot();
})();
