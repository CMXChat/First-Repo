(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const SWITCH_CONTROLS = '[data-scenario-choice], [data-footer-preset], [data-quick-preset], [data-dock-preset]';
  const ALIASES = {
    personal: 'individual',
    individual: 'individual',
    relationship: 'couple',
    couple: 'couple',
    business: 'partners',
    partners: 'partners',
    trainer: 'trainer',
    training: 'trainer',
    team: 'team',
    project: 'team',
    crew: 'team'
  };
  const LABELS = {
    individual: 'Personal',
    couple: 'Relationship',
    partners: 'Business',
    trainer: 'Trainer',
    team: 'Team'
  };
  const TERMINAL_INTRO = 'Demo shell now. Protected data entry and file uploads can come through this terminal or the dashboard once the backend is live.';
  const TERMINAL_SUMMARY = 'demo now · backend reserved';

  let initialized = false;
  let lastPreset = '';
  let pendingSwitchMessage = '';
  let lateUiTimer = 0;
  let lateUiAttempts = 0;

  function preset() {
    return window.BRIEF_APP?.getPreset?.() || 'individual';
  }

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

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function switchBriefing(value) {
    const normalized = String(value || '').replace(/[^a-z]/g, '');
    const next = ALIASES[normalized];
    if (!next || !window.BRIEF_APP?.setPreset) {
      appendLine('usage: brief personal|relationship|business|trainer|team', 'error');
      return;
    }
    pendingSwitchMessage = `${LABELS[next]} briefing opened.`;
    window.BRIEF_APP.setPreset(next);
    window.setTimeout(scrollTop, 60);
  }

  function helpLines() {
    return [
      'now: demo navigation only. backend reserved for secure data + file input here or in the dashboard.',
      'commands: brief personal|relationship|business|trainer|team, top, private, shared, modules, learn, teams, security, backend, privacy, about, clear.'
    ];
  }

  function handleBridgeCommand(rawValue) {
    const original = String(rawValue || '').trim();
    if (!original) return false;
    const command = original.toLowerCase().replace(/^\s*(open|go)\s+/, '').trim();

    const switchMatch = command.match(/^(?:brief|briefing|briefing\s+type|view|switch)\s+(.+)$/);
    const recognized = [
      'help', 'commands', 'backend', 'future', 'learn', 'learning', 'teach', 'teaching',
      'teams', 'team', 'security', 'cloud', 'brief', 'briefing', 'briefing type'
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
      appendLine('backend reserved. later: authenticated inputs, file uploads, connectors and approved actions through terminal or dashboard.');
      return true;
    }

    if (['learn', 'learning', 'teach', 'teaching'].includes(command)) {
      appendLine('learning: daily lessons, spaced repetition, quizzes, corrections, workout progression and accountability from approved history.');
      return true;
    }

    if (command === 'teams' || command === 'team') {
      appendLine('teams: role-based member, project and leadership spaces for procedures, handoffs, operations and approved finance monitoring. use brief team to open the demo.');
      return true;
    }

    if (command === 'security' || command === 'cloud') {
      appendLine('planned security: containerized FastAPI on Linux, Cloudflare Access/Tunnel, protected secrets, least-privilege permissions, audit logs, rate limits, encrypted transport, backups and approval gates.');
      return true;
    }

    return false;
  }

  function augmentTerminal() {
    const intro = $('.brief-terminal-intro');
    if (intro && intro.textContent !== TERMINAL_INTRO) intro.textContent = TERMINAL_INTRO;

    const summary = $('.brief-terminal-panel summary small');
    if (summary && summary.textContent !== TERMINAL_SUMMARY) summary.textContent = TERMINAL_SUMMARY;

    const output = $('#briefTerminalOutput');
    if (output && !output.querySelector('[data-terminal-bridge-note]')) {
      const line = document.createElement('div');
      line.dataset.terminalBridgeNote = 'true';
      line.className = 'brief-terminal-line is-system';
      line.textContent = 'demo shell only · type help for backend, learning, teams and security';
      output.appendChild(line);
    }
  }

  function augmentHelpModal() {
    const dialog = $('.brief-help-dialog');
    if (!dialog || $('#briefScopeHelp')) return;

    const details = document.createElement('details');
    details.id = 'briefScopeHelp';
    details.innerHTML = '<summary>Learning, accountability, teams and secure operations</summary><p>Daily teaching, spaced repetition, workout progression and accountability can use approved history. Role-based team spaces can support projects, procedures, handoffs, operations and finance monitoring for managers and team members. The planned backend uses protected authentication, permissions, encrypted transport, secrets management, audit logs, rate limits, backups and approval-gated actions.</p>';

    const reality = $('.brief-help-reality', dialog);
    if (reality) dialog.insertBefore(details, reality);
    else dialog.appendChild(details);
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

  function installUniversalReturnToTop() {
    lastPreset = preset();

    document.addEventListener('click', event => {
      if (!event.target.closest?.(SWITCH_CONTROLS)) return;
      window.setTimeout(scrollTop, 120);
    }, true);

    window.addEventListener('brief:preset-change', event => {
      const next = event.detail?.preset || preset();
      const changed = next !== lastPreset;
      lastPreset = next;
      window.setTimeout(() => {
        augmentTerminal();
        augmentHelpModal();
        if (changed) scrollTop();
        if (pendingSwitchMessage) {
          appendLine(pendingSwitchMessage, 'success');
          pendingSwitchMessage = '';
        }
      }, 180);
    });
  }

  function scheduleLateUi() {
    window.clearTimeout(lateUiTimer);
    lateUiAttempts = 0;

    const check = () => {
      lateUiAttempts += 1;
      augmentTerminal();
      augmentHelpModal();
      const complete = Boolean($('#briefTerminalOutput') && $('.brief-help-dialog'));
      if (!complete && lateUiAttempts < 20) lateUiTimer = window.setTimeout(check, 300);
    };

    check();
  }

  function init() {
    if (initialized || !window.BRIEF_APP) return;
    initialized = true;
    installCommandBridge();
    installUniversalReturnToTop();
    scheduleLateUi();

    $('#explainButton')?.addEventListener('click', () => window.setTimeout(augmentHelpModal, 60), true);
  }

  window.addEventListener('brief:ready', init, { once: true });
  if (window.BRIEF_APP) init();
  else document.addEventListener('DOMContentLoaded', () => window.setTimeout(init, 850), { once: true });
})();
