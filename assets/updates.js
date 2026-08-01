(() => {
  'use strict';

  const data = window.CMX_UPDATES;
  if (!data || !Array.isArray(data.entries)) return;

  const feed = document.getElementById('feed');
  const commandForm = document.getElementById('commandForm');
  const commandInput = document.getElementById('commandInput');
  const commandOutput = document.getElementById('commandOutput');
  const summaryLine = document.getElementById('summaryLine');

  const state = { category: 'all', query: '' };
  const sortedEntries = [...data.entries].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const categoryIds = new Set((data.categories || []).map(category => category.id));
  const knownPages = {
    build: '/build/',
    backend: '/backend/',
    ai: '/ai/',
    architecture: '/architecture/',
    directory: '/directory/',
    terminal: '/'
  };

  function format(timestamp, options) {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      ...options
    }).format(new Date(timestamp));
  }

  function dateKey(timestamp) {
    return format(timestamp, { year: 'numeric', month: '2-digit', day: '2-digit' }).replaceAll('/', '-');
  }

  function safeLink(url) {
    return typeof url === 'string' && (url.startsWith('/') || url.startsWith('https://')) ? url : null;
  }

  function createLink(linkData) {
    const url = safeLink(typeof linkData === 'string' ? linkData : linkData?.url);
    if (!url) return null;
    const link = document.createElement('a');
    link.className = 'entry-link';
    link.href = url;
    link.textContent = typeof linkData === 'string' ? `open: ${url}` : (linkData.label || `open: ${url}`);
    if (url.startsWith('https://')) {
      link.target = '_blank';
      link.rel = 'noopener';
    }
    return link;
  }

  function renderLinks(container, links = []) {
    if (!container) return;
    container.textContent = '';
    links.forEach(linkData => {
      const link = createLink(linkData);
      if (link) container.appendChild(link);
    });
  }

  function renderBrief() {
    const brief = data.brief || {};
    document.getElementById('briefSummary').textContent = brief.summary || '';

    const sections = document.getElementById('briefSections');
    sections.textContent = '';
    (brief.sections || []).forEach(section => {
      const article = document.createElement('article');
      article.className = 'brief-section';

      const label = document.createElement('h3');
      label.textContent = section.label;

      const text = document.createElement('p');
      text.textContent = section.text;

      article.append(label, text);
      sections.appendChild(article);
    });

    renderLinks(document.getElementById('briefLinks'), brief.links || []);
  }

  function renderStatus() {
    const status = data.status;
    document.getElementById('statusTimestamp').textContent = format(status.timestamp, {
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });
    document.getElementById('statusHeadline').textContent = status.headline;

    const lines = document.getElementById('statusLines');
    lines.textContent = '';
    (status.lines || []).forEach(text => {
      const p = document.createElement('p');
      p.className = 'status-line';
      p.textContent = text;
      lines.appendChild(p);
    });

    renderLinks(document.getElementById('statusLinks'), status.links || []);
  }

  function visibleEntries() {
    const query = state.query.trim().toLowerCase();
    return sortedEntries.filter(entry => {
      if (state.category !== 'all' && entry.category !== state.category) return false;
      if (!query) return true;
      return [entry.title, entry.summary, entry.category, entry.status, ...(entry.details || [])]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }

  function groupByDate(entries) {
    return entries.reduce((groups, entry) => {
      const key = dateKey(entry.timestamp);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(entry);
      return groups;
    }, new Map());
  }

  function createEntry(entry) {
    const article = document.createElement('article');
    article.className = 'entry';
    article.id = entry.id;

    const meta = document.createElement('p');
    meta.className = 'entry-meta';
    const time = format(entry.timestamp, { hour: '2-digit', minute: '2-digit', hour12: false });
    const pinned = entry.pinned ? ' [PINNED]' : '';
    meta.textContent = `[${time}] [${String(entry.category).toUpperCase()}] [${String(entry.status).toUpperCase()}]${pinned}`;

    const title = document.createElement('h3');
    title.textContent = entry.title;

    const summary = document.createElement('p');
    summary.className = 'entry-summary';
    summary.textContent = entry.summary;

    article.append(meta, title, summary);

    if (Array.isArray(entry.details) && entry.details.length) {
      const list = document.createElement('ul');
      list.className = 'entry-details';
      entry.details.forEach(detail => {
        const item = document.createElement('li');
        item.textContent = detail;
        list.appendChild(item);
      });
      article.appendChild(list);
    }

    const links = Array.isArray(entry.links)
      ? entry.links
      : entry.link
        ? [{ url: entry.link, label: entry.linkLabel || `open: ${entry.link}` }]
        : [];
    if (links.length) {
      const group = document.createElement('div');
      group.className = 'link-group';
      renderLinks(group, links);
      article.appendChild(group);
    }

    return article;
  }

  function renderFeed() {
    const entries = visibleEntries();
    const groups = groupByDate(entries);
    feed.textContent = '';

    const mode = state.category !== 'all' ? `category=${state.category}` : state.query ? `find=${state.query}` : 'all';
    const noun = sortedEntries.length === 1 ? 'change' : 'changes';
    summaryLine.textContent = `${entries.length}/${sortedEntries.length} ${noun} shown · ${mode} · type help for commands`;

    if (!entries.length) {
      const empty = document.createElement('p');
      empty.className = 'empty-state';
      empty.textContent = 'No matching changes.';
      feed.appendChild(empty);
      return;
    }

    groups.forEach(dayEntries => {
      const section = document.createElement('section');
      section.className = 'day-group';
      section.id = `day-${dateKey(dayEntries[0].timestamp)}`;

      const heading = document.createElement('h2');
      heading.className = 'day-heading';
      heading.textContent = format(dayEntries[0].timestamp, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      }).toUpperCase();

      section.appendChild(heading);
      dayEntries.forEach(entry => section.appendChild(createEntry(entry)));
      feed.appendChild(section);
    });
  }

  function setCategory(category) {
    if (category !== 'all' && !categoryIds.has(category)) return false;
    state.category = category;
    state.query = '';
    renderFeed();
    return true;
  }

  function runCommand(raw) {
    const command = raw.trim().toLowerCase().replace(/\s+/g, ' ');
    commandInput.value = '';
    if (!command) return;

    if (command === 'help') {
      commandOutput.textContent = 'help · brief · status · all · latest · today · site · tools · research · infrastructure · ai · general · find [word] · open [build|backend|ai|architecture|directory|terminal] · count · clear';
      return;
    }
    if (command === 'clear') {
      commandOutput.textContent = '';
      return;
    }
    if (command === 'brief') {
      document.getElementById('brief').scrollIntoView({ behavior: 'smooth', block: 'start' });
      commandOutput.textContent = 'Showing project brief.';
      return;
    }
    if (command === 'status') {
      document.getElementById('status').scrollIntoView({ behavior: 'smooth', block: 'start' });
      commandOutput.textContent = `${data.status.headline}\n${(data.status.lines || []).map(line => `- ${line}`).join('\n')}`;
      return;
    }
    if (command === 'count') {
      commandOutput.textContent = `${visibleEntries().length} visible · ${sortedEntries.length} total`;
      return;
    }
    if (command === 'latest') {
      setCategory('all');
      const first = feed.querySelector('.entry');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'start' });
      commandOutput.textContent = 'Showing latest change.';
      return;
    }
    if (command === 'today') {
      setCategory('all');
      const today = document.getElementById(`day-${dateKey(new Date().toISOString())}`);
      commandOutput.textContent = today ? 'Showing today.' : 'No changes today.';
      if (today) today.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (command === 'infra') {
      setCategory('infrastructure');
      commandOutput.textContent = 'category=infrastructure';
      return;
    }
    if (setCategory(command)) {
      commandOutput.textContent = `category=${command}`;
      return;
    }
    if (command.startsWith('find ')) {
      state.category = 'all';
      state.query = command.slice(5).trim();
      renderFeed();
      commandOutput.textContent = state.query ? `find=${state.query}` : 'Missing search text.';
      return;
    }
    if (command.startsWith('open ')) {
      const page = command.slice(5).trim();
      const url = knownPages[page];
      if (url) {
        window.location.href = url;
        return;
      }
      commandOutput.textContent = `Unknown page: ${page}`;
      return;
    }

    commandOutput.textContent = `command not found: ${command}`;
  }

  commandForm.addEventListener('submit', event => {
    event.preventDefault();
    runCommand(commandInput.value);
  });

  renderBrief();
  renderStatus();
  renderFeed();
  window.setTimeout(() => commandInput.focus({ preventScroll: true }), 50);
})();
