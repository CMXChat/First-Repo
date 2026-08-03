(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const VALID_PRESETS = ['individual', 'couple', 'partners', 'trainer', 'team'];

  const TERMINALS = {
    individual: {
      label: 'Personal briefing terminal',
      prompt: 'user@brief:~/personal$',
      intro: 'Personal console ready. Navigate the day, inspect data boundaries, or switch briefing views.',
      quick: ['summary', 'public', 'report', 'horoscope', 'music', 'privacy'],
      modules: {
        today: ['#today', 'Opening today'],
        quick: ['#briefWorkspace', 'Opening the concise Personal briefing'],
        public: ['#livePublicLayer', 'Opening live public information'],
        weather: ['#livePublicLayer', 'Opening Brooklyn weather and alerts'],
        dashboard: ['#personalCommandCenter', 'Opening the personal command center'],
        report: ['#personalCommandCenter .sheet-panel', 'Opening the fictional daily report'],
        inbox: ['#personalCommandCenter .fake-inbox-panel', 'Opening fictional inbox triage'],
        projects: ['#personalCommandCenter .project-health-panel', 'Opening fictional project health'],
        horoscope: ['#scenarioExperienceAddon .horoscope-card', 'Opening the personal horoscope'],
        quote: ['#briefWorkspace .quick-quote-card', 'Opening today’s reflection'],
        music: ['#music', 'Opening music and media'],
        actions: ['#priorities', 'Opening daily actions'],
        schedule: ['#schedule', 'Opening today’s schedule'],
        memory: ['#learning', 'Opening memory controls'],
        connections: ['#connections', 'Opening connection status']
      }
    },
    couple: {
      label: 'Relationship briefing terminal',
      prompt: 'pair@brief:~/shared$',
      intro: 'Relationship console ready. Compare two private profiles with the approved shared space.',
      quick: ['summary', 'profiles', 'shared', 'horoscope', 'watch', 'privacy'],
      modules: {
        today: ['#today', 'Opening the Relationship briefing'],
        quick: ['#briefWorkspace', 'Opening the concise Relationship briefing'],
        profiles: ['#scenarioExperienceAddon .relationship-profile-space', 'Opening both private profiles and the approved couple space'],
        partnera: ['#scenarioExperienceAddon .tone-blue', 'Opening the blue demonstration profile'],
        partnerb: ['#scenarioExperienceAddon .tone-pink', 'Opening the pink demonstration profile'],
        couplespace: ['#scenarioExperienceAddon .shared-space-account', 'Opening the approved couple space'],
        mediator: ['#scenarioStage', 'Opening neutral relationship guidance'],
        promises: ['#scenarioStage', 'Opening approved promises and shared agreements'],
        horoscope: ['#scenarioExperienceAddon .couple-horoscope-grid', 'Opening Virgo + Virgo reflections'],
        watch: ['#relationshipDailyWatch', 'Opening today’s shared watch'],
        culture: ['#scenarioExperienceAddon .culture-stream', 'Opening celebrity and culture updates'],
        music: ['#music', 'Opening shared music'],
        actions: ['#priorities', 'Opening relationship actions'],
        memory: ['#learning', 'Opening memory and approval controls'],
        connections: ['#connections', 'Opening connection status']
      }
    },
    partners: {
      label: 'Business briefing terminal',
      prompt: 'partners@brief:~/ops$',
      intro: 'Operating console ready. Inspect partner-private information, approved company data, markets and decisions.',
      quick: ['summary', 'finance', 'projects', 'decisions', 'markets', 'privacy'],
      modules: {
        today: ['#today', 'Opening the Business briefing'],
        quick: ['#briefWorkspace', 'Opening the concise Business briefing'],
        partners: ['#scenarioExperienceAddon .business-profile-grid', 'Opening both partner-private dashboards'],
        ledger: ['#scenarioExperienceAddon .business-shared-ledger', 'Opening the approved shared company ledger'],
        kpis: ['#scenarioStage', 'Opening operating KPIs'],
        charts: ['#scenarioExperienceAddon .business-visual-grid', 'Opening financial and process visuals'],
        finance: ['#scenarioExperienceAddon .allocation-panel', 'Opening fictional cost allocation and shared finance'],
        allocation: ['#scenarioExperienceAddon .allocation-panel', 'Opening fictional cost allocation'],
        decisions: ['#scenarioExperienceAddon .process-map-panel', 'Opening the decision process map'],
        advice: ['#scenarioExperienceAddon .advice-visual-grid', 'Opening fictional legal, financial and strategic guidance'],
        markets: ['#scenarioExperienceAddon .market-impact-stream', 'Opening current market context'],
        projects: ['#scenarioStage', 'Opening projects, owners and risks'],
        actions: ['#priorities', 'Opening operating actions'],
        schedule: ['#schedule', 'Opening partner schedule'],
        connections: ['#connections', 'Opening business connection status']
      }
    },
    trainer: {
      label: 'Trainer briefing terminal',
      prompt: 'coach@brief:~/training$',
      intro: 'Training console ready. Review habits, answer today’s checks and inspect how advice adapts.',
      quick: ['summary', 'today', 'habits', 'checkin', 'coach', 'privacy'],
      modules: {
        today: ['#today', 'Opening the Trainer briefing'],
        quick: ['#briefWorkspace', 'Opening the concise Trainer briefing'],
        habits: ['#scenarioExperienceAddon .habit-calendar', 'Opening the seven-day habit calendar'],
        checkin: ['#scenarioExperienceAddon .accountability-questions', 'Opening today’s yes-or-no check-in'],
        coach: ['#scenarioExperienceAddon .adaptive-coach-note', 'Opening the adapted coach note'],
        progress: ['#scenarioStage', 'Opening progress and evidence'],
        recovery: ['#scenarioExperienceAddon', 'Opening recovery and accountability guidance'],
        notes: ['#scenarioStage', 'Opening trainer and student notes'],
        music: ['#music', 'Opening training music'],
        actions: ['#priorities', 'Opening today’s training actions'],
        schedule: ['#schedule', 'Opening the training schedule'],
        memory: ['#learning', 'Opening correction and memory controls'],
        connections: ['#connections', 'Opening connected-data boundaries']
      }
    },
    team: {
      label: 'Team briefing terminal',
      prompt: 'team@brief:~/project$',
      intro: 'Team console ready. Review member work, project truth, handoffs, procedures, finance and access boundaries.',
      quick: ['summary', 'mywork', 'project', 'handoffs', 'procedure', 'security'],
      modules: {
        today: ['#today', 'Opening the Team briefing'],
        quick: ['#briefWorkspace', 'Opening the concise Team briefing'],
        mywork: ['#scenarioStage .team-role-console', 'Opening role-based member work'],
        project: ['#scenarioStage .team-progress-panel', 'Opening the shared project timeline'],
        handoffs: ['#scenarioStage .team-handoff-board', 'Opening project handoffs'],
        procedure: ['#scenarioStage .team-procedure-board', 'Opening procedure readiness'],
        finance: ['#scenarioStage .team-finance-watch', 'Opening approved financial context'],
        spaces: ['#scenarioStage .team-space-map', 'Opening users, roles and spaces'],
        security: ['#scenarioStage .team-security-boundary', 'Opening planned security boundaries'],
        actions: ['#priorities', 'Opening Team actions'],
        schedule: ['#schedule', 'Opening the Team schedule'],
        connections: ['#connections', 'Opening Team connection status']
      }
    }
  };

  let initialized = false;
  let history = [];
  let historyIndex = 0;

  function preset() {
    const value = window.BRIEF_APP?.getPreset?.();
    return VALID_PRESETS.includes(value) ? value : 'individual';
  }

  function config() {
    return TERMINALS[preset()] || TERMINALS.individual;
  }

  function appendLine(text, type = 'response') {
    const output = $('#briefTerminalOutput');
    if (!output) return;
    const line = document.createElement('div');
    line.className = `brief-terminal-line is-${type}`;
    line.textContent = text;
    output.appendChild(line);
    while (output.children.length > 12) output.firstElementChild?.remove();
    output.scrollTop = output.scrollHeight;
  }

  function clearOutput() {
    const output = $('#briefTerminalOutput');
    if (output) output.replaceChildren();
  }

  function scrollToTarget(selector, message) {
    const target = $(selector) || $('#scenarioStage') || $('#today');
    if (!target) {
      appendLine('That module is unavailable in this briefing.', 'error');
      return;
    }
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    appendLine(message || `Opening ${selector}`, 'success');
  }

  function setSpace(shared) {
    const button = $('#viewModeButton');
    if (!button) {
      appendLine('The private/shared control is unavailable.', 'error');
      return;
    }
    const active = button.getAttribute('aria-pressed') === 'true';
    if (active !== shared) button.click();
    window.setTimeout(() => {
      scrollToTarget('#sharedSpace', shared ? 'Approved shared space opened.' : 'Private profile view restored.');
    }, 80);
  }

  function switchPreset(next) {
    const aliases = {
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
    const id = aliases[next];
    if (!id || !window.BRIEF_APP?.setPreset) {
      appendLine(`Unknown briefing view: ${next}`, 'error');
      return;
    }
    window.BRIEF_APP.setPreset(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function summaryText() {
    const current = preset();
    const shared = $('#viewModeButton')?.getAttribute('aria-pressed') === 'true';
    const boundaries = shared ? 'approved shared space' : 'private profile view';
    const summaries = {
      individual: `Personal briefing active in ${boundaries}. Public Brooklyn information may be current. Inbox, money, project and private-life examples are fictional.`,
      couple: `Relationship briefing active in ${boundaries}. Two private profiles remain separate from the approved couple space. Blue and pink labels are customizable.`,
      partners: `Business briefing active in ${boundaries}. Partner-private records stay separate from the approved company ledger. Financial, legal and operating examples are fictional.`,
      trainer: `Trainer briefing active in ${boundaries}. Student answers, trainer rules and AI suggestions remain separately labeled. Health guidance is demonstrative, not medical care.`,
      team: `Team briefing active in ${boundaries}. Member, role, project and leadership spaces keep different visibility while approved project truth stays shared.`
    };
    return summaries[current];
  }

  function helpText() {
    const current = config();
    const moduleCommands = Object.keys(current.modules).join(', ');
    return `global: help, summary, status, modules, private, shared, top, about, privacy, clear, view personal|relationship|business|trainer|team. ${current.label.toLowerCase()}: ${moduleCommands}`;
  }

  function run(rawCommand) {
    const original = String(rawCommand || '').trim();
    if (!original) return;
    const command = original.toLowerCase().replace(/^\s*(open|go)\s+/, '').trim();
    appendLine(`${config().prompt} ${original}`, 'command');

    if (!history.length || history[history.length - 1] !== original) history.push(original);
    history = history.slice(-20);
    historyIndex = history.length;

    if (command === 'help' || command === 'commands') {
      appendLine(helpText());
      return;
    }
    if (command === 'clear' || command === 'reset') {
      clearOutput();
      appendLine(config().intro, 'system');
      return;
    }
    if (command === 'summary' || command === 'status') {
      appendLine(summaryText());
      return;
    }
    if (command === 'modules' || command === 'list') {
      appendLine(`Available here: ${Object.keys(config().modules).join(', ')}`);
      return;
    }
    if (command === 'top' || command === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      appendLine('Opening the beginning of the briefing.', 'success');
      return;
    }
    if (command === 'private') {
      setSpace(false);
      return;
    }
    if (command === 'shared' || command === 'space') {
      setSpace(true);
      return;
    }
    if (command === 'privacy') {
      appendLine('Public information is labeled and sourced. Private-looking emails, finances, health, relationship and company records are fictional until protected authentication and approved integrations exist.');
      return;
    }
    if (command === 'about' || command === 'why') {
      appendLine('This terminal is a front-end navigation and product-demonstration layer. A future backend could connect approved accounts, memory, MCP tools, APIs, scheduled jobs, voice, cars, phones, smart homes and work systems.');
      return;
    }
    if (command.startsWith('view ') || command.startsWith('switch ')) {
      switchPreset(command.split(/\s+/).slice(1).join(''));
      return;
    }
    if (['personal', 'individual', 'relationship', 'couple', 'business', 'partners', 'trainer', 'training', 'team', 'project', 'crew'].includes(command)) {
      switchPreset(command);
      return;
    }

    const target = config().modules[command.replace(/[\s_-]+/g, '')] || config().modules[command];
    if (target) {
      scrollToTarget(target[0], target[1]);
      return;
    }

    appendLine(`Unknown command: ${original}. Type help.`, 'error');
  }

  function renderQuickCommands() {
    const host = $('#briefTerminalQuick');
    if (!host) return;
    host.replaceChildren(...config().quick.map(command => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.terminalCommand = command;
      button.textContent = command;
      button.addEventListener('click', () => run(command));
      return button;
    }));
  }

  function updateTerminal() {
    const current = config();
    const title = $('#briefTerminalTitle');
    const prompt = $('#briefTerminalPrompt');
    const state = $('#briefTerminalState');
    if (title) title.textContent = current.label;
    if (prompt) prompt.textContent = current.prompt;
    if (state) state.textContent = preset() === 'individual' ? 'personal' : preset() === 'couple' ? 'relationship' : preset() === 'partners' ? 'business' : preset() === 'trainer' ? 'trainer' : 'team';
    clearOutput();
    appendLine(current.intro, 'system');
    appendLine('Type help or tap a command below. Nothing typed here leaves this page.', 'system');
    renderQuickCommands();

    const terminal = $('#briefTerminal');
    const switcher = $('#briefingFooterSwitcher');
    if (terminal && switcher && terminal.nextElementSibling !== switcher) switcher.before(terminal);
  }

  function createTerminal() {
    if ($('#briefTerminal')) return;
    const main = $('#briefMain');
    if (!main) return;

    const section = document.createElement('section');
    section.id = 'briefTerminal';
    section.className = 'brief-section brief-terminal-section';
    section.dataset.section = 'terminal';
    section.innerHTML = `
      <div class="brief-terminal-heading">
        <div><p class="micro-label">INTERACTIVE BRIEFING CONSOLE</p><h2 id="briefTerminalTitle">Briefing terminal</h2></div>
        <span id="briefTerminalState">personal</span>
      </div>
      <p class="brief-terminal-intro">A small command layer like the terminal on <code>/news</code>, adapted to the active briefing. Use the keyboard or tap a shortcut.</p>
      <details class="brief-terminal-panel">
        <summary><span class="brief-terminal-dots" aria-hidden="true"><i></i><i></i><i></i></span><strong>Open terminal controls</strong><small>navigation · privacy · views</small></summary>
        <div class="brief-terminal-window">
          <div id="briefTerminalOutput" class="brief-terminal-output" role="log" aria-live="polite" aria-relevant="additions"></div>
          <div id="briefTerminalQuick" class="brief-terminal-quick" aria-label="Terminal command shortcuts"></div>
          <form id="briefTerminalForm" class="brief-terminal-form" autocomplete="off">
            <label class="sr-only" for="briefTerminalInput">Enter a briefing command</label>
            <span id="briefTerminalPrompt" class="brief-terminal-prompt" aria-hidden="true">user@brief:~/personal$</span>
            <input id="briefTerminalInput" type="text" inputmode="text" enterkeyhint="go" autocapitalize="none" autocomplete="off" spellcheck="false" placeholder="help" />
            <button type="submit">Run</button>
          </form>
        </div>
      </details>`;

    const switcher = $('#briefingFooterSwitcher');
    if (switcher) switcher.before(section);
    else main.appendChild(section);

    $('#briefTerminalForm')?.addEventListener('submit', event => {
      event.preventDefault();
      const input = $('#briefTerminalInput');
      run(input?.value);
      if (input) input.value = '';
    });

    $('#briefTerminalInput')?.addEventListener('keydown', event => {
      if (!history.length || !['ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      historyIndex += event.key === 'ArrowUp' ? -1 : 1;
      historyIndex = Math.max(0, Math.min(history.length, historyIndex));
      event.currentTarget.value = history[historyIndex] || '';
    });

    updateTerminal();
  }

  function init() {
    if (initialized || !window.BRIEF_APP) return;
    initialized = true;
    createTerminal();
    window.addEventListener('brief:preset-change', () => window.setTimeout(updateTerminal, 140));
    window.addEventListener('brief:device-fallback-open', () => window.setTimeout(updateTerminal, 140));
  }

  window.addEventListener('brief:ready', init, { once: true });
  if (window.BRIEF_APP) init();
  else document.addEventListener('DOMContentLoaded', () => window.setTimeout(init, 650), { once: true });
})();
