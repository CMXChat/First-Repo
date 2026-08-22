(() => {
  'use strict';

  if (location.hash.startsWith('#lab=')) {
    location.replace(`/lab/snapshot/${location.hash}`);
    return;
  }

  const rows = [...document.querySelectorAll('[data-route-row]')];
  const output = document.getElementById('terminalOutput');
  const form = document.getElementById('labCommandForm');
  const input = document.getElementById('labCommand');
  let selected = Math.max(0, rows.findIndex((row) => row.matches(':focus')));

  const aliases = Object.freeze({
    home: '/lab/',
    control: '/lab/control/',
    automations: '/lab/automations/',
    automation: '/lab/automations/',
    directory: '/directory/',
    'directory-lab': '/lab/directory/',
    library: '/lab/library/',
    email: '/email/',
    snapshot: '/lab/snapshot/',
    checkin: '/checkin/',
    'check-in': '/checkin/',
    spaces: '/spaces/',
    doc: '/doc/',
    menu: '/menu/'
  });

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  function setOutput(lines, tone = '') {
    if (!output) return;
    const className = tone ? `lab-output__${tone}` : '';
    const list = Array.isArray(lines) ? lines : [lines];
    output.innerHTML = list.map((line, index) => `<div${index === 0 && className ? ` class="${className}"` : ''}>${line}</div>`).join('');
  }

  function select(index, { focus = false } = {}) {
    if (!rows.length) return;
    selected = (index + rows.length) % rows.length;
    rows.forEach((row, current) => row.classList.toggle('is-selected', current === selected));
    if (focus) rows[selected].focus({ preventScroll: false });
  }

  function routeName(row) {
    return row?.dataset.command || 'unknown';
  }

  function openRow(row) {
    if (!row) return;
    if (row.getAttribute('aria-disabled') === 'true') {
      const name = esc(routeName(row));
      setOutput([
        `<span class="lab-output__warn">${name}/ is visible planning, not a navigable route yet.</span>`,
        'A future marker never implies backend capability or authority.'
      ]);
      return;
    }
    if (row instanceof HTMLAnchorElement && row.href) window.location.assign(row.href);
  }

  function renderTreeStatus() {
    const lines = rows.map((row) => {
      const name = esc(routeName(row));
      const status = esc(row.dataset.status || '');
      return `<code>${name.padEnd(14, ' ')}</code> <span>${status}</span>`;
    });
    setOutput(['<span class="lab-output__ok">Current Lab map:</span>', ...lines]);
  }

  function runCommand(raw) {
    const value = String(raw || '').trim();
    if (!value) return;
    const [verbRaw, ...rest] = value.split(/\s+/);
    const verb = verbRaw.toLowerCase();
    const arg = rest.join(' ').toLowerCase();

    if (verb === 'help' || verb === '?') {
      setOutput([
        '<span class="lab-output__ok">Available commands</span>',
        '<code>tree</code> — list Lab branches and labels',
        '<code>status</code> — explain current Lab boundary',
        '<code>open &lt;name&gt;</code> — open a route, e.g. <code>open email</code>',
        '<code>ls</code> — same idea, fewer words',
        '<code>clear</code> — clear terminal output'
      ]);
      return;
    }

    if (verb === 'tree' || verb === 'ls') {
      renderTreeStatus();
      return;
    }

    if (verb === 'status') {
      setOutput([
        '<span class="lab-output__ok">Lab boundary intact.</span>',
        'Focused routes own product state. This launcher owns navigation only.',
        'LIVE means an existing production-facing surface; WIRED/PROVING does not mean the full stacked backend is deployed.',
        'NEXT means visible planning, not fake capability.'
      ]);
      return;
    }

    if (verb === 'clear' || verb === 'cls') {
      setOutput('');
      return;
    }

    if (verb === 'open' || verb === 'cd') {
      if (!arg) {
        setOutput('<span class="lab-output__warn">Choose a route: open automations, open directory, open email…</span>');
        return;
      }
      const target = aliases[arg];
      if (!target) {
        setOutput(`<span class="lab-output__error">Unknown route: ${esc(arg)}</span>`);
        return;
      }
      window.location.assign(target);
      return;
    }

    if (aliases[verb]) {
      window.location.assign(aliases[verb]);
      return;
    }

    setOutput([
      `<span class="lab-output__error">command not found: ${esc(verb)}</span>`,
      'Type <code>help</code> for the small command set.'
    ]);
  }

  rows.forEach((row, index) => {
    row.addEventListener('focus', () => select(index));
    if (!(row instanceof HTMLAnchorElement)) {
      row.addEventListener('click', () => openRow(row));
      row.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openRow(row);
        }
      });
    }
  });

  document.addEventListener('keydown', (event) => {
    const editing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
    if (editing) {
      if (event.key === 'Escape') {
        input?.blur();
        select(selected, { focus: true });
      }
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'j') {
      event.preventDefault();
      select(selected + 1, { focus: true });
    } else if (event.key === 'ArrowUp' || event.key === 'k') {
      event.preventDefault();
      select(selected - 1, { focus: true });
    } else if (event.key === 'Enter') {
      event.preventDefault();
      openRow(rows[selected]);
    } else if (event.key === '/' || event.key === ':') {
      event.preventDefault();
      input?.focus();
    }
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const command = input?.value || '';
    runCommand(command);
    if (input) {
      input.value = '';
      input.focus();
    }
  });

  select(selected);
  document.documentElement.dataset.labHome = 'terminal-tree-v1';
})();
