(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const ALIASES = {
    personal: 'individual', individual: 'individual',
    relationship: 'couple', couple: 'couple',
    business: 'partners', partners: 'partners',
    trainer: 'trainer', training: 'trainer',
    team: 'team', project: 'team', crew: 'team'
  };
  const LABELS = {
    individual: 'Personal', couple: 'Relationship', partners: 'Business', trainer: 'Trainer', team: 'Team'
  };
  const THEME_VERSION = '20260804-2';
  const SYSTEM_VERSION = '20260804-1';
  let initialized = false;
  let pendingSwitchMessage = '';
  let lateUiTimer = 0;
  let lateUiAttempts = 0;

  function terminalPrompt() {
    return $('#briefTerminalPrompt')?.textContent || 'brief@cmx:$';
  }

  function appendLine(text, type = 'response') {
    const output = $('#briefTerminalOutput');
    if (!output || !text) return;
    const line = document.createElement('div');
    line.className = `brief-terminal-line is-${type}`;
    line.textContent = text;
    output.appendChild(line);
    while (output.children.length > 12) output.firstElementChild?.remove();
    output.scrollTop = output.scrollHeight;
  }

  function appendCommand(command) {
    appendLine(`${terminalPrompt()} ${command}`, 'command');
  }

  function switchBriefing(value) {
    const normalized = String(value || '').replace(/[^a-z]/g, '');
    const next = ALIASES[normalized];
    if (!next) {
      appendLine('usage: brief personal|relationship|business|trainer|team', 'error');
      return;
    }
    pendingSwitchMessage = `${LABELS[next]} briefing opened.`;
    if (window.BRIEF_SYSTEM?.switchPreset) window.BRIEF_SYSTEM.switchPreset(next);
    else window.BRIEF_APP?.setPreset?.(next);
  }

  function helpLines() {
    return [
      'views: focus, workspace, full, library, spaces, plans, tour.',
      'briefings: brief personal|relationship|business|trainer|team.',
      'modules: use the active pill name, or try weather, music, memory, connections.',
      'boundaries: privacy, backend, security, learning, teams, about, clear.'
    ];
  }

  function handleBridgeCommand(rawValue) {
    const original = String(rawValue || '').trim();
    if (!original) return false;
    const command = original.toLowerCase().replace(/^\s*(open|go)\s+/, '').trim();
    const switchMatch = command.match(/^(?:briefing\s+type|briefing|brief|view|switch)\s+(.+)$/);
    const recognized = [
      'help', 'commands', 'backend', 'future', 'learn', 'learning', 'teach', 'teaching',
      'teams', 'team', 'security', 'cloud', 'brief', 'briefing', 'briefing type', 'about'
    ].includes(command) || Boolean(switchMatch);

    if (!recognized) return false;
    appendCommand(original);

    if (command === 'help' || command === 'commands') {
      helpLines().forEach(line => appendLine(line));
      return true;
    }
    if (command === 'brief' || command === 'briefing' || command === 'briefing type') {
      appendLine('usage: brief personal|relationship|business|trainer|team');
      return true;
    }
    if (switchMatch) {
      switchBriefing(switchMatch[1]);
      return true;
    }
    if (command === 'backend' || command === 'future') {
      appendLine('The interface is a public demonstration. Protected records, files, connectors and approved actions belong behind authenticated backend services.');
      return true;
    }
    if (['learn', 'learning', 'teach', 'teaching'].includes(command)) {
      appendLine('Learning can use approved history, corrections, spaced repetition, completed actions and temporary context without silently redefining the person.');
      return true;
    }
    if (command === 'teams' || command === 'team') {
      appendLine('Team spaces can separate member work, project truth, handoffs, procedures, leadership context and approved finance signals by role.');
      return true;
    }
    if (command === 'security' || command === 'cloud') {
      appendLine('Planned controls include authentication, least-privilege permissions, encrypted transport, protected secrets, audit logs, rate limits, backups and approval gates.');
      return true;
    }
    if (command === 'about') {
      appendLine('This is a connected briefing interface with Focus, Workspace and Full View, an information library, guided walkthroughs and a front-end command layer.');
      return true;
    }
    return false;
  }

  function augmentTerminal() {
    const intro = $('.brief-terminal-intro');
    if (intro) intro.textContent = 'Navigate Focus, Workspace, Full View, briefing tabs, spaces, plans and the information library from one command surface.';
    const summary = $('.brief-terminal-panel summary small');
    if (summary) summary.textContent = 'views · modules · privacy · briefing types';
    const output = $('#briefTerminalOutput');
    if (output && !output.querySelector('[data-terminal-bridge-note]')) {
      const line = document.createElement('div');
      line.dataset.terminalBridgeNote = 'true';
      line.className = 'brief-terminal-line is-system';
      line.textContent = 'type help for the system map';
      output.appendChild(line);
    }
  }

  function augmentHelpModal() {
    const dialog = $('.brief-help-dialog');
    if (!dialog || $('#briefScopeHelp')) return;
    const details = document.createElement('details');
    details.id = 'briefScopeHelp';
    details.innerHTML = '<summary>Focus, Workspace, Full View and protected operations</summary><p>Focus shows the immediate operating picture. Workspace uses stable navigation and scenario-specific tabs. Full View preserves every visual module. Protected data and actions still require authenticated backend services, permissions and approval gates.</p>';
    const reality = $('.brief-help-reality', dialog);
    if (reality) dialog.insertBefore(details, reality);
    else dialog.appendChild(details);
  }

  function loadStyle(id, href) {
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(id, src) {
    if (document.getElementById(id) || (id === 'briefSystemScript' && window.BRIEF_SYSTEM)) return;
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = false;
    document.head.appendChild(script);
  }

  function loadProductLayers() {
    loadStyle('briefThemeIntegrityStyle', `/assets/brief/brief-theme-integrity.css?v=${THEME_VERSION}`);
    loadStyle('briefSystemStyle', `/assets/brief/brief-system.css?v=${SYSTEM_VERSION}`);
    loadStyle('briefSystemFixStyle', `/assets/brief/brief-system-fixes.css?v=${SYSTEM_VERSION}`);
    loadScript('briefThemeIntegrityScript', `/assets/brief/brief-theme-integrity.js?v=${THEME_VERSION}`);
    loadScript('briefSystemScript', `/assets/brief/brief-system.js?v=${SYSTEM_VERSION}`);
  }

  function installCommandBridge() {
    document.addEventListener('submit', event => {
      if (event.target?.id !== 'briefTerminalForm') return;
      const input = $('#briefTerminalInput');
      if (!handleBridgeCommand(input?.value)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (input) input.value = '';
    }, true);
  }

  function scheduleLateUi() {
    window.clearTimeout(lateUiTimer);
    lateUiAttempts = 0;
    const check = () => {
      lateUiAttempts += 1;
      augmentTerminal();
      augmentHelpModal();
      if ((!$('#briefTerminalOutput') || !$('.brief-help-dialog')) && lateUiAttempts < 24) {
        lateUiTimer = window.setTimeout(check, 280);
      }
    };
    check();
  }

  function init() {
    if (initialized || !window.BRIEF_APP) return;
    initialized = true;
    installCommandBridge();
    scheduleLateUi();
    loadProductLayers();
    window.addEventListener('brief:preset-change', () => {
      window.setTimeout(() => {
        augmentTerminal();
        augmentHelpModal();
        if (pendingSwitchMessage) {
          appendLine(pendingSwitchMessage, 'success');
          pendingSwitchMessage = '';
        }
      }, 180);
    });
    $('#explainButton')?.addEventListener('click', () => window.setTimeout(augmentHelpModal, 60), true);
  }

  window.addEventListener('brief:ready', init, { once: true });
  if (window.BRIEF_APP) init();
  else document.addEventListener('DOMContentLoaded', () => window.setTimeout(init, 650), { once: true });
})();
