(() => {
  'use strict';

  const data = window.CMX_UPDATES;
  const dailyNotes = Array.isArray(window.CMX_DAILY_NOTES) ? window.CMX_DAILY_NOTES : [];
  if (!data) return;

  const $ = selector => document.querySelector(selector);

  function escapeHtml(value = '') {
    const node = document.createElement('div');
    node.textContent = String(value);
    return node.innerHTML;
  }

  function safeLink(url = '') {
    if (typeof url !== 'string') return '#';
    if (url.startsWith('/') || url.startsWith('https://github.com/CMXChat/First-Repo/')) return url;
    return '#';
  }

  function formatDate(timestamp, includeTime = true) {
    const options = {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    };
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    return new Intl.DateTimeFormat('en-US', options).format(new Date(timestamp));
  }

  function renderSummary() {
    const node = $('#heroSummary');
    if (node) node.textContent = data.summary;
  }

  function renderDailyNotes() {
    const container = $('#dailyNotesList');
    if (!container) return;

    const notes = [...dailyNotes].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    if (!notes.length) {
      container.innerHTML = '<p class="empty-note">No daily notes have been added yet.</p>';
      return;
    }

    container.innerHTML = notes.map(note => `
      <article class="daily-note${note.pinned ? ' is-pinned' : ''}" id="${escapeHtml(note.id || '')}">
        <p class="note-meta">[${escapeHtml(String(note.status || 'note').toUpperCase())}]${note.pinned ? ' [PINNED]' : ''} ${escapeHtml(formatDate(note.timestamp))}</p>
        <h3>${escapeHtml(note.title)}</h3>
        <div class="note-lines">${(note.body || []).map(line => `<p>${escapeHtml(line)}</p>`).join('')}</div>
        ${(note.tags || []).length ? `<p class="note-tags">${note.tags.map(tag => `#${escapeHtml(tag)}`).join(' ')}</p>` : ''}
        ${(note.links || []).length ? `<div class="note-links">${note.links.map(link => `<a href="${safeLink(link.url)}">${escapeHtml(link.label)}</a>`).join('')}</div>` : ''}
      </article>
    `).join('');
  }

  function renderPages() {
    const container = $('#pageIndex');
    if (!container) return;
    container.innerHTML = data.pages.filter(page => !['/', '/directory/', '/directory'].includes(page.route)).map(page => `
      <a class="index-row" href="${safeLink(page.route)}">
        <code>${escapeHtml(page.route)}</code>
        <span><strong>${escapeHtml(page.name)}</strong><small>${escapeHtml(page.role)} · ${escapeHtml(page.status)}</small></span>
        <i>open</i>
      </a>
      <p class="index-description">${escapeHtml(page.description)}</p>
    `).join('');
  }

  function renderMission() {
    const container = $('#missionContent');
    if (!container) return;
    container.innerHTML = data.mission.map(item => `
      <article class="text-note">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
      </article>
    `).join('');
  }

  function renderAI() {
    const container = $('#aiCapabilities');
    if (!container) return;
    container.innerHTML = data.aiCapabilities.map((item, index) => `
      <article class="numbered-note">
        <span>${String(index + 1).padStart(2, '0')}</span>
        <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></div>
      </article>
    `).join('');
  }

  function renderApis() {
    const container = $('#apiFamilies');
    if (!container) return;
    container.innerHTML = data.apiFamilies.map(item => `
      <article class="text-note">
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(item.examples)}</p>
        <a href="${safeLink(item.link)}">open related blueprint</a>
      </article>
    `).join('');
  }

  function renderWorkflow() {
    const container = $('#aiWorkflow');
    if (!container) return;
    container.innerHTML = data.workflow.map(item => `
      <article class="workflow-note">
        <span>${escapeHtml(item.step)}</span>
        <div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></div>
      </article>
    `).join('');
  }

  function renderConnection() {
    const map = $('#connectionMap');
    if (map) {
      map.innerHTML = data.connection.flow.map((item, index) => `
        <article class="workflow-note">
          <span>${String(index + 1).padStart(2, '0')}</span>
          <div><p>${escapeHtml(item)}</p></div>
        </article>
      `).join('');
    }

    const examples = $('#connectionExamples');
    if (examples) {
      examples.innerHTML = data.connection.examples.map(item => `
        <article class="code-note">
          <h3>${escapeHtml(item.title)}</h3>
          <pre>${escapeHtml(item.code)}</pre>
          <p>${escapeHtml(item.text)}</p>
        </article>
      `).join('');
    }
  }

  function renderSecurity() {
    const allowed = $('#allowedActions');
    const blocked = $('#blockedActions');
    if (allowed) allowed.innerHTML = data.security.allowed.map(item => `<p>${escapeHtml(item)}</p>`).join('');
    if (blocked) blocked.innerHTML = data.security.blocked.map(item => `<p>${escapeHtml(item)}</p>`).join('');
  }

  function renderPhases() {
    const container = $('#phaseList');
    if (!container) return;
    container.innerHTML = data.phases.map(item => `
      <article class="phase-note">
        <span>${escapeHtml(item.number)}</span>
        <div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.text)}</p></div>
        <strong>${escapeHtml(item.state)}</strong>
      </article>
    `).join('');
  }

  function renderStatus() {
    const container = $('#statusNotes');
    if (!container) return;
    container.innerHTML = data.status.map(group => `
      <article class="text-note">
        <p class="note-meta">[${escapeHtml(group.state.toUpperCase())}]</p>
        <h3>${escapeHtml(group.title)}</h3>
        <div class="line-list">${group.items.map(item => `<p>${escapeHtml(item)}</p>`).join('')}</div>
      </article>
    `).join('');
  }

  function renderChanges() {
    const container = $('#changeLog');
    if (!container) return;
    container.innerHTML = data.changes.map(item => `
      <article class="daily-note">
        <p class="note-meta">[${escapeHtml(item.category.toUpperCase())}] ${escapeHtml(formatDate(item.timestamp))}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <div class="note-lines"><p>${escapeHtml(item.summary)}</p></div>
        <div class="note-links">${item.links.map(link => `<a href="${safeLink(link.url)}">${escapeHtml(link.label)}</a>`).join('')}</div>
      </article>
    `).join('');
  }

  function easternInputValue(date = new Date()) {
    const parts = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'America/New_York',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(date).reduce((result, part) => {
      if (part.type !== 'literal') result[part.type] = part.value;
      return result;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
  }

  function easternOffset(localValue) {
    const [datePart, timePart] = localValue.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);
    const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(guess).reduce((result, part) => {
      if (part.type !== 'literal') result[part.type] = Number(part.value);
      return result;
    }, {});
    const represented = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
    const minutes = Math.round((represented - guess.getTime()) / 60000);
    const sign = minutes >= 0 ? '+' : '-';
    const absolute = Math.abs(minutes);
    return `${sign}${String(Math.floor(absolute / 60)).padStart(2, '0')}:${String(absolute % 60).padStart(2, '0')}`;
  }

  function slugify(value) {
    return String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 52) || 'daily-note';
  }

  function buildNoteBlock() {
    const localTimestamp = $('#noteTimestamp').value;
    const title = $('#noteTitle').value.trim();
    const status = $('#noteStatus').value;
    const body = $('#noteBody').value.split('\n').map(line => line.trim()).filter(Boolean);
    const links = $('#noteLinks').value.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
      const [label, url] = line.split('|').map(part => part.trim());
      return { label: label || url, url: url || '#' };
    }).filter(link => link.url.startsWith('/'));
    const tags = $('#noteTags').value.split(',').map(tag => tag.trim()).filter(Boolean);
    const pinned = $('#notePinned').checked;
    const date = localTimestamp.slice(0, 10);
    const timestamp = `${localTimestamp}:00${easternOffset(localTimestamp)}`;
    const indentArray = values => values.length
      ? `[\n${values.map(value => `      ${JSON.stringify(value)}`).join(',\n')}\n    ]`
      : '[]';
    const linkArray = links.length
      ? `[\n${links.map(link => `      { url: ${JSON.stringify(link.url)}, label: ${JSON.stringify(link.label)} }`).join(',\n')}\n    ]`
      : '[]';

    return `  {\n    id: ${JSON.stringify(`${date}-${slugify(title)}`)},\n    timestamp: ${JSON.stringify(timestamp)},\n    title: ${JSON.stringify(title)},\n    status: ${JSON.stringify(status)},\n    body: ${indentArray(body)},\n    links: ${linkArray},\n    tags: ${indentArray(tags)},\n    pinned: ${pinned}\n  },`;
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }

  function setupComposer() {
    const toggle = $('#toggleComposer');
    const composer = $('#noteComposer');
    const form = $('#noteForm');
    const timestamp = $('#noteTimestamp');
    if (timestamp) timestamp.value = easternInputValue();

    if (toggle && composer) {
      toggle.addEventListener('click', () => {
        const opening = composer.hidden;
        composer.hidden = !opening;
        toggle.setAttribute('aria-expanded', String(opening));
        toggle.textContent = opening ? '− close composer' : '+ compose note';
        if (opening) composer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    if (form) {
      form.addEventListener('submit', async event => {
        event.preventDefault();
        const status = $('#composerStatus');
        const preview = $('#notePreview');
        try {
          const block = buildNoteBlock();
          await copyText(block);
          preview.textContent = block;
          preview.hidden = false;
          status.textContent = 'Copied. Paste it at the top of updates-notes.js, then commit.';
        } catch (error) {
          status.textContent = 'Could not copy automatically. The generated block is shown below.';
          const block = buildNoteBlock();
          preview.textContent = block;
          preview.hidden = false;
        }
      });
    }
  }

  function setupCommands() {
    const form = $('#commandForm');
    const input = $('#commandInput');
    const output = $('#commandOutput');
    if (!form || !input || !output) return;

    const targets = {
      notes: '#daily-notes', compose: '#noteComposer', mission: '#mission', ai: '#ai-plan',
      apis: '#api-map', workflow: '#workflow', connection: '#connection', security: '#security',
      phases: '#phases', status: '#status', changes: '#changes', top: 'body'
    };
    const pages = { build: '/build/', backend: '/backend/', architecture: '/architecture/', directory: '/directory/' };

    form.addEventListener('submit', event => {
      event.preventDefault();
      const command = input.value.trim().toLowerCase();
      input.value = '';
      if (!command) return;
      if (command === 'help') {
        output.textContent = 'notes · compose · mission · ai · apis · workflow · connection · security · phases · status · changes · build · backend · architecture · directory · top · clear';
        return;
      }
      if (command === 'clear') {
        output.textContent = '';
        return;
      }
      if (pages[command]) {
        window.location.href = pages[command];
        return;
      }
      if (targets[command]) {
        if (command === 'compose' && $('#noteComposer').hidden) $('#toggleComposer').click();
        document.querySelector(targets[command]).scrollIntoView({ behavior: 'smooth', block: 'start' });
        output.textContent = `opened ${command}`;
        return;
      }
      output.textContent = `command not found: ${command}`;
    });
  }

  function init() {
    renderSummary();
    renderDailyNotes();
    renderPages();
    renderMission();
    renderAI();
    renderApis();
    renderWorkflow();
    renderConnection();
    renderSecurity();
    renderPhases();
    renderStatus();
    renderChanges();
    setupComposer();
    setupCommands();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
