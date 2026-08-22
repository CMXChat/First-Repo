(() => {
  'use strict';

  const LIBRARY_PATH = '/library/';

  function makeLink(kind) {
    const link = document.createElement('a');
    link.href = LIBRARY_PATH;
    link.className = kind === 'control' ? 'cc-rail-link' : 'dir-rail-link';
    link.dataset.libraryShellLink = 'true';
    link.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg><span>Library · PREVIEW</span>';
    return link;
  }

  function patchRail() {
    const control = document.querySelector('.cc-rail-nav');
    if (control && !control.querySelector('a[href="/library/"]')) {
      const automation = control.querySelector('a[href="/automations/"], a[href="/lab/automations/"]');
      control.insertBefore(makeLink('control'), automation || null);
    }
    const directory = document.querySelector('.dir-rail-nav');
    if (directory && !directory.querySelector('a[href="/library/"]')) {
      const automation = directory.querySelector('a[href="/automations/"], a[href="/lab/automations/"]');
      directory.insertBefore(makeLink('directory'), automation || null);
    }
  }

  function queryAllowsLibrary(input) {
    const query = String(input?.value || '').trim().toLowerCase();
    return !query || 'library protected information documents files media knowledge'.includes(query) || 'library'.includes(query) || query.includes('lib');
  }

  function patchControlCommand() {
    const input = document.querySelector('.cc-command-input');
    const results = document.querySelector('.cc-command-results');
    if (!results || !queryAllowsLibrary(input) || results.querySelector('[data-library-command="control"]')) return;
    const group = document.createElement('div');
    group.className = 'cc-command-group';
    group.dataset.libraryCommandGroup = 'control';
    group.textContent = 'Open';
    const button = document.createElement('button');
    button.className = 'cc-command-item';
    button.type = 'button';
    button.dataset.libraryCommand = 'control';
    button.innerHTML = '<span class="cc-command-item-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg></span><span><strong>Library</strong><span>Open documents, files, media and imported knowledge</span></span><span class="cc-command-key">↗</span>';
    button.addEventListener('click', () => { window.location.href = LIBRARY_PATH; });
    results.append(group, button);
  }

  function patchDirectoryCommand() {
    const overlay = document.querySelector('.dir-command-overlay');
    const input = overlay?.querySelector('input');
    const results = overlay?.querySelector('.dir-command-results');
    if (!results || !queryAllowsLibrary(input) || results.querySelector('[data-library-command="directory"]')) return;
    const group = document.createElement('div');
    group.className = 'dir-command-group';
    group.dataset.libraryCommandGroup = 'directory';
    group.textContent = 'Continuum';
    const button = document.createElement('button');
    button.className = 'dir-command-item';
    button.type = 'button';
    button.dataset.libraryCommand = 'directory';
    button.innerHTML = '<i>›</i><span><strong>Library</strong><span>Open documents, files, media and imported knowledge</span></span><kbd>↗</kbd>';
    button.addEventListener('click', () => { window.location.href = LIBRARY_PATH; });
    results.append(group, button);
  }

  function patchCommandsSoon() {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      patchControlCommand();
      patchDirectoryCommand();
    }));
  }

  document.addEventListener('click', event => {
    if (event.target.closest('#commandButton, #globalCommand')) patchCommandsSoon();
  }, true);

  document.addEventListener('input', event => {
    if (event.target.matches('.cc-command-input, .dir-command-input input')) patchCommandsSoon();
  }, true);

  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') patchCommandsSoon();
    if (event.key === 'Enter' && event.target.matches('.cc-command-input, .dir-command-input input')) {
      const value = String(event.target.value || '').trim().toLowerCase();
      if (value === 'library' || value === 'open library') {
        event.preventDefault();
        event.stopImmediatePropagation();
        window.location.href = LIBRARY_PATH;
      }
    }
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', patchRail, { once:true });
  else patchRail();

  document.documentElement.dataset.libraryShellConvergence = 'v1';
})();