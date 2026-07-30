function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);
}

function normalizePath(input = '.') {
  if (!input || input === '.') return cwd;
  if (input === '~') return '/';
  const raw = input.startsWith('/') ? input : `${cwd}/${input}`;
  const stack = [];
  raw.split('/').forEach((part) => {
    if (!part || part === '.') return;
    if (part === '..') stack.pop();
    else stack.push(part);
  });
  return `/${stack.join('/')}` || '/';
}

function casesStore() {
  return read(KEY.cases, []);
}

function saveCases(cases) {
  save(KEY.cases, cases);
}

function currentCaseId() {
  return localStorage.getItem(KEY.currentCase) || '';
}

function setCurrentCase(id) {
  if (id) localStorage.setItem(KEY.currentCase, id);
  else localStorage.removeItem(KEY.currentCase);
}

function findCase(identifier) {
  const needle = String(identifier || '').toLowerCase();
  return casesStore().find((item) => item.id === needle || item.name.toLowerCase() === needle);
}

function notesStore() {
  return read(KEY.notes, []);
}

function bookmarksStore() {
  return read(KEY.bookmarks, []);
}

function aliasesStore() {
  return read(KEY.aliases, { m: 'menu', s: 'search', md: 'metadata' });
}

function fsEntries(path) {
  const normalized = normalizePath(path);
  if (normalized === '/') return FS_ROOTS.map((name) => ({ name, type: 'dir' }));
  if (normalized === '/tools') {
    return Object.entries(ROUTES).map(([name, route]) => ({ name, type: 'route', detail: route[0] }));
  }
  if (normalized === '/cases') {
    return casesStore().map((item) => ({ name: item.id, type: 'case', detail: item.status }));
  }
  if (normalized === '/notes') {
    return notesStore().map((item) => ({ name: String(item.id), type: 'note', detail: item.text.slice(0, 42) }));
  }
  if (normalized === '/bookmarks') {
    return bookmarksStore().map((item) => ({ name: String(item.id), type: 'bookmark', detail: item.title || item.url }));
  }
  if (normalized === '/reports') {
    return [{ name: 'report-generator', type: 'route', detail: '/report' }];
  }
  if (normalized === '/system') {
    return ['about', 'version', 'security', 'status', 'routes', 'commands'].map((name) => ({ name, type: 'file' }));
  }
  return null;
}

function isDirectory(path) {
  return fsEntries(path) !== null;
}

function catContent(path) {
  const normalized = normalizePath(path);
  const parts = normalized.split('/').filter(Boolean);
  if (parts[0] === 'system') {
    const file = parts[1];
    if (file === 'about') return ['CMX Command Node', 'Private browser shell and launcher for CMX intelligence tools.', 'Server-side Python execution will be added after the FastAPI migration.'];
    if (file === 'version') return ['CMX Command Node v2.0.0', 'Shell registry: 1', 'Virtual filesystem: 1'];
    if (file === 'security') return ['Local authentication: PBKDF2-SHA256', `Iterations: ${ITERATIONS.toLocaleString()}`, 'Idle lock: 20 minutes', 'Static-host limitation: client-side controls cannot protect direct routes.'];
    if (file === 'status') return statusLines();
    if (file === 'routes') return Object.entries(ROUTES).map(([name, route]) => `${name.padEnd(12)} ${route[0]}  ${route[1]}`);
    if (file === 'commands') return commandNames().join('  ');
  }
  if (parts[0] === 'tools' && parts[1] && ROUTES[parts[1]]) {
    const route = ROUTES[parts[1]];
    return [`Tool: ${parts[1]}`, `Route: ${route[0]}`, `Function: ${route[1]}`, `Launch: open ${parts[1]}`];
  }
  if (parts[0] === 'cases' && parts[1]) {
    const item = findCase(parts[1]);
    if (!item) return null;
    return caseSummary(item);
  }
  if (parts[0] === 'notes' && parts[1]) {
    const item = notesStore().find((note) => String(note.id) === parts[1]);
    return item ? [`Note ${item.id}`, `Created: ${new Date(item.at).toLocaleString()}`, item.text] : null;
  }
  if (parts[0] === 'bookmarks' && parts[1]) {
    const item = bookmarksStore().find((bookmark) => String(bookmark.id) === parts[1]);
    return item ? [`Bookmark ${item.id}`, `Title: ${item.title || '(untitled)'}`, `URL: ${item.url}`, `Created: ${new Date(item.at).toLocaleString()}`] : null;
  }
  return null;
}

function printRows(rows, headers) {
  if (!rows.length) return line('No results.', 'dim');
  const table = document.createElement('table');
  table.className = 'terminal-table';
  table.innerHTML = `<thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>`;
  $('#terminalOutput').appendChild(table);
  $('#terminalOutput').scrollTop = $('#terminalOutput').scrollHeight;
}

function listPath(path = '.') {
  const normalized = normalizePath(path);
  const entries = fsEntries(normalized);
  if (!entries) return line(`ls: cannot access '${path}': not a directory`, 'error');
  if (!entries.length) return line('(empty)', 'dim');
  printRows(entries.map((entry) => [entry.name, entry.type, entry.detail || '']), ['NAME', 'TYPE', 'DETAIL']);
}

function changeDirectory(path = '/') {
  if (path === '-') {
    const target = previousCwd;
    previousCwd = cwd;
    cwd = target;
  } else {
    const target = normalizePath(path);
    if (!isDirectory(target)) return line(`cd: no such directory: ${path}`, 'error');
    previousCwd = cwd;
    cwd = target;
  }
  save(KEY.cwd, cwd);
  updatePrompt();
  line(cwd, 'info');
}

function tree(path = '.') {
  const normalized = normalizePath(path);
  const entries = fsEntries(normalized);
  if (!entries) return line(`tree: '${path}' is not a directory`, 'error');
  line(normalized === '/' ? '/' : normalized, 'success');
  entries.forEach((entry, index) => {
    const branch = index === entries.length - 1 ? '└──' : '├──';
    line(`${branch} ${entry.name}${entry.type === 'dir' ? '/' : ''}${entry.detail ? `  [${entry.detail}]` : ''}`);
  });
}

function openRoute(key) {
  const route = ROUTES[key];
  if (!route) return line(`Unknown route: ${key}`, 'error');
  line(`Opening ${route[1]}: ${route[0]}`, 'info');
  setTimeout(() => { location.href = route[0]; }, 260);
}

function openTarget(target) {
  if (!target) return line('Usage: open <route|path|bookmark-id>', 'error');
  const key = target.toLowerCase();
  if (ROUTES[key]) return openRoute(key);
  if (/^https?:\/\//i.test(target)) {
    line(`Opening external URL: ${target}`, 'info');
    setTimeout(() => { location.href = target; }, 220);
    return;
  }
  const bookmark = bookmarksStore().find((item) => String(item.id) === target || item.title.toLowerCase() === key);
  if (bookmark) {
    line(`Opening bookmark ${bookmark.id}: ${bookmark.url}`, 'info');
    setTimeout(() => { location.href = bookmark.url; }, 220);
    return;
  }
  const normalized = normalizePath(target);
  if (isDirectory(normalized)) return changeDirectory(target);
  const content = catContent(target);
  if (content) return content.forEach((item) => line(item));
  return line(`open: target not found: ${target}`, 'error');
}

function statusLines() {
  const storageBytes = Object.keys(localStorage).reduce((total, key) => total + key.length + (localStorage.getItem(key) || '').length, 0) * 2;
  const current = findCase(currentCaseId());
  return [
    'Host: db.cmxchat.com',
    `Operator: ${user}`,
    `Path: ${cwd}`,
    `Routes: ${Object.keys(ROUTES).length}`,
    `Cases: ${casesStore().length}`,
    `Notes: ${notesStore().length}`,
    `Bookmarks: ${bookmarksStore().length}`,
    `Current case: ${current ? current.name : 'none'}`,
    `Local storage: ${(storageBytes / 1024).toFixed(1)} KB`,
    `Uptime: ${formatDuration(Date.now() - STARTED_AT)}`,
    'Python backend: pending FastAPI deployment'
  ];
}

function formatDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
}

function caseSummary(item) {
  return [
    `CASE ${item.id}`,
    `Name: ${item.name}`,
    `Status: ${item.status}`,
    `Created: ${new Date(item.createdAt).toLocaleString()}`,
    `Updated: ${new Date(item.updatedAt).toLocaleString()}`,
    `Notes: ${item.notes.length}`,
    `Links: ${item.links.length}`
  ];
}

function caseCommand(args) {
  const action = (args[0] || 'list').toLowerCase();
  const cases = casesStore();
  if (action === 'new') {
    const name = args.slice(1).join(' ').trim();
    if (!name) return line('Usage: case new <name>', 'error');
    const id = slugify(name);
    if (!id) return line('Case name must contain letters or numbers.', 'error');
    if (cases.some((item) => item.id === id)) return line(`Case already exists: ${id}`, 'warning');
    const now = new Date().toISOString();
    const item = { id, name, status: 'open', createdAt: now, updatedAt: now, notes: [], links: [] };
    cases.push(item);
    saveCases(cases);
    setCurrentCase(id);
    line(`Case created and selected: ${id}`, 'success');
    return;
  }
  if (action === 'list') {
    return printRows(cases.map((item) => [item.id, item.status, item.name, String(item.notes.length), String(item.links.length)]), ['ID', 'STATUS', 'NAME', 'NOTES', 'LINKS']);
  }
  if (action === 'use' || action === 'open') {
    const item = findCase(args.slice(1).join(' '));
    if (!item) return line('Case not found.', 'error');
    setCurrentCase(item.id);
    line(`Current case: ${item.id}`, 'success');
    return;
  }
  if (action === 'current') {
    const item = findCase(currentCaseId());
    if (!item) return line('No current case selected.', 'warning');
    return caseSummary(item).forEach((itemLine) => line(itemLine));
  }
  if (action === 'note') {
    const item = findCase(currentCaseId());
    const text = args.slice(1).join(' ').trim();
    if (!item) return line('Select a case first with: case use <id>', 'error');
    if (!text) return line('Usage: case note <text>', 'error');
    item.notes.push({ at: new Date().toISOString(), text });
    item.updatedAt = new Date().toISOString();
    saveCases(cases);
    line(`Note added to ${item.id}.`, 'success');
    return;
  }
  if (action === 'link') {
    const item = findCase(currentCaseId());
    const url = args[1];
    const title = args.slice(2).join(' ').trim();
    if (!item) return line('Select a case first with: case use <id>', 'error');
    if (!/^https?:\/\//i.test(url || '')) return line('Usage: case link <https://url> [title]', 'error');
    item.links.push({ at: new Date().toISOString(), url, title: title || url });
    item.updatedAt = new Date().toISOString();
    saveCases(cases);
    line(`Link added to ${item.id}.`, 'success');
    return;
  }
  if (action === 'show') {
    const item = findCase(args.slice(1).join(' ')) || findCase(currentCaseId());
    if (!item) return line('Case not found.', 'error');
    caseSummary(item).forEach((itemLine) => line(itemLine));
    item.notes.slice(-10).forEach((note, index) => line(`N${index + 1} [${new Date(note.at).toLocaleString()}] ${note.text}`));
    item.links.slice(-10).forEach((link, index) => line(`L${index + 1} ${link.title}: ${link.url}`));
    return;
  }
  if (action === 'status') {
    const item = findCase(currentCaseId());
    const status = (args[1] || '').toLowerCase();
    if (!item) return line('Select a case first.', 'error');
    if (!['open', 'paused', 'closed'].includes(status)) return line('Usage: case status <open|paused|closed>', 'error');
    item.status = status;
    item.updatedAt = new Date().toISOString();
    saveCases(cases);
    line(`${item.id} status changed to ${status}.`, 'success');
    return;
  }
  if (action === 'timeline') return openRoute('timeline');
  if (action === 'report') return openRoute('report');
  if (action === 'export') {
    const item = findCase(args.slice(1).join(' ')) || findCase(currentCaseId());
    if (!item) return line('Case not found.', 'error');
    downloadJson(`cmx-case-${item.id}.json`, item);
    return line(`Exported case: ${item.id}`, 'success');
  }
  if (action === 'delete') {
    const id = args[1];
    const confirmed = args[2] === '--confirm';
    const item = findCase(id);
    if (!item) return line('Case not found.', 'error');
    if (!confirmed) return line(`Run: case delete ${item.id} --confirm`, 'warning');
    saveCases(cases.filter((entry) => entry.id !== item.id));
    if (currentCaseId() === item.id) setCurrentCase('');
    line(`Deleted case: ${item.id}`, 'success');
    return;
  }
  return line('Usage: case <new|list|use|current|show|note|link|status|timeline|report|export|delete>', 'error');
}

function noteCommand(args) {
  const action = (args[0] || 'list').toLowerCase();
  const notes = notesStore();
  if (action === 'add') {
    const text = args.slice(1).join(' ').trim();
    if (!text) return line('Usage: note add <text>', 'error');
    const id = notes.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
    notes.push({ id, at: new Date().toISOString(), text });
    save(KEY.notes, notes.slice(-200));
    return line(`Note ${id} saved.`, 'success');
  }
  if (!['list', 'view', 'delete', 'search'].includes(action)) {
    return noteCommand(['add', ...args]);
  }
  if (action === 'list') {
    return printRows(notes.slice(-30).map((item) => [String(item.id), new Date(item.at).toLocaleString(), item.text]), ['ID', 'CREATED', 'TEXT']);
  }
  if (action === 'view') {
    const item = notes.find((note) => String(note.id) === args[1]);
    if (!item) return line('Note not found.', 'error');
    line(`Note ${item.id}`, 'success');
    line(new Date(item.at).toLocaleString(), 'dim');
    return line(item.text);
  }
  if (action === 'delete') {
    const item = notes.find((note) => String(note.id) === args[1]);
    if (!item) return line('Note not found.', 'error');
    save(KEY.notes, notes.filter((note) => note.id !== item.id));
    return line(`Deleted note ${item.id}.`, 'success');
  }
  const term = args.slice(1).join(' ').toLowerCase();
  if (!term) return line('Usage: note search <term>', 'error');
  return printRows(notes.filter((item) => item.text.toLowerCase().includes(term)).map((item) => [String(item.id), item.text]), ['ID', 'TEXT']);
}

function bookmarkCommand(args) {
  const action = (args[0] || 'list').toLowerCase();
  const bookmarks = bookmarksStore();
  if (action === 'add') {
    const url = args[1];
    const title = args.slice(2).join(' ').trim();
    if (!/^https?:\/\//i.test(url || '')) return line('Usage: bookmark add <https://url> [title]', 'error');
    const id = bookmarks.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
    bookmarks.push({ id, at: new Date().toISOString(), url, title: title || url });
    save(KEY.bookmarks, bookmarks.slice(-200));
    return line(`Bookmark ${id} saved.`, 'success');
  }
  if (action === 'list') {
    return printRows(bookmarks.map((item) => [String(item.id), item.title, item.url]), ['ID', 'TITLE', 'URL']);
  }
  if (action === 'open') return openTarget(args[1]);
  if (action === 'delete') {
    const item = bookmarks.find((bookmark) => String(bookmark.id) === args[1]);
    if (!item) return line('Bookmark not found.', 'error');
    save(KEY.bookmarks, bookmarks.filter((bookmark) => bookmark.id !== item.id));
    return line(`Deleted bookmark ${item.id}.`, 'success');
  }
  if (action === 'search') {
    const term = args.slice(1).join(' ').toLowerCase();
    if (!term) return line('Usage: bookmark search <term>', 'error');
    return printRows(bookmarks.filter((item) => `${item.title} ${item.url}`.toLowerCase().includes(term)).map((item) => [String(item.id), item.title, item.url]), ['ID', 'TITLE', 'URL']);
  }
  return line('Usage: bookmark <add|list|open|delete|search>', 'error');
}

function historyCommand(args) {
  const action = (args[0] || 'list').toLowerCase();
  if (action === 'clear') {
    history = [];
    historyIndex = 0;
    save(KEY.history, history);
    return line('Command history cleared.', 'success');
  }
  if (action === 'search') {
    const term = args.slice(1).join(' ').toLowerCase();
    if (!term) return line('Usage: history search <term>', 'error');
    const matches = history.filter((item) => item.toLowerCase().includes(term));
    matches.slice(-40).forEach((item, index) => line(`${index + 1}  ${item}`));
    return;
  }
  history.slice(-40).forEach((item, index) => line(`${Math.max(1, history.length - 39) + index}  ${item}`));
}

function aliasCommand(args) {
  const aliases = aliasesStore();
  if (!args.length || args[0] === 'list') {
    return printRows(Object.entries(aliases), ['ALIAS', 'COMMAND']);
  }
  if (args[0] === 'remove' || args[0] === 'delete') {
    if (!aliases[args[1]]) return line('Alias not found.', 'error');
    delete aliases[args[1]];
    save(KEY.aliases, aliases);
    return line(`Alias removed: ${args[1]}`, 'success');
  }
  let name;
  let command;
  if (args[0] === 'set') {
    name = args[1];
    command = args.slice(2).join(' ');
  } else if (args[0].includes('=')) {
    [name, ...command] = args[0].split('=');
    command = command.join('=');
  } else {
    name = args[0];
    command = args.slice(1).join(' ');
  }
  if (!/^[a-z][a-z0-9_-]{0,20}$/i.test(name || '') || !command) return line('Usage: alias set <name> <command>', 'error');
  aliases[name.toLowerCase()] = command;
  save(KEY.aliases, aliases);
  line(`Alias ${name} => ${command}`, 'success');
}

function osintCommand(args) {
  const action = (args[0] || 'list').toLowerCase();
  if (action === 'list') return listPath('/tools');
  if (action === 'open' || action === 'menu') return openRoute('menu');
  if (ROUTES[action]) return openRoute(action);
  return line('Usage: osint <list|open|phone|metadata|search|missing|resources|workspace|timeline|report>', 'error');
}

function systemCommand(args) {
  const action = (args[0] || 'status').toLowerCase();
  if (action === 'status') return statusLines().forEach((item) => line(item));
  if (action === 'routes') return listPath('/tools');
  if (action === 'version') return catContent('/system/version').forEach((item) => line(item));
  if (action === 'security') return catContent('/system/security').forEach((item) => line(item));
  if (action === 'storage') {
    const bytes = Object.keys(localStorage).reduce((total, key) => total + key.length + (localStorage.getItem(key) || '').length, 0) * 2;
    return line(`Approximate local storage used: ${(bytes / 1024).toFixed(1)} KB`, 'info');
  }
  if (action === 'uptime') return line(formatDuration(Date.now() - STARTED_AT), 'info');
  return line('Usage: system <status|routes|version|security|storage|uptime>', 'error');
}
