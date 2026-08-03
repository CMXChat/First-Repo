(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const VALID_PRESETS = ['individual', 'couple', 'partners', 'trainer', 'team'];
  const state = { depth: 'quick', tab: 'overview', railPaused: false };
  let initialized = false;
  let retryTimer = 0;
  let retries = 0;

  const LABELS = {
    individual: 'Personal',
    couple: 'Relationship',
    partners: 'Business',
    trainer: 'Trainer',
    team: 'Team'
  };

  const TABS = {
    individual: [['overview', 'Overview'], ['day', 'Day'], ['work', 'Work'], ['money', 'Finance'], ['wellness', 'Wellness'], ['intelligence', 'Intelligence']],
    couple: [['overview', 'Overview'], ['together', 'Together'], ['profiles', 'Profiles'], ['plans', 'Plans'], ['watch', 'Watch'], ['reflection', 'Reflection']],
    partners: [['overview', 'Overview'], ['finance', 'Finance'], ['projects', 'Projects'], ['decisions', 'Decisions'], ['markets', 'Markets'], ['partners', 'Partners']],
    trainer: [['overview', 'Overview'], ['today', 'Today'], ['habits', 'Habits'], ['progress', 'Progress'], ['recovery', 'Recovery'], ['coach', 'Coach']],
    team: [['overview', 'Overview'], ['mywork', 'My work'], ['project', 'Project'], ['handoffs', 'Handoffs'], ['procedure', 'Procedure'], ['finance', 'Finance'], ['spaces', 'Spaces']]
  };

  const DEEP_TARGETS = {
    individual: { overview: '#today', day: '#weather', work: '#personalCommandCenter', money: '#personalCommandCenter', wellness: '#scenarioExplorer', intelligence: '#livePublicLayer' },
    couple: { overview: '#today', together: '#scenarioExplorer', profiles: '#scenarioExperienceAddon', plans: '#priorities', watch: '#relationshipDailyWatch', reflection: '#scenarioExperienceAddon' },
    partners: { overview: '#today', finance: '#scenarioExperienceAddon', projects: '#scenarioStage', decisions: '#scenarioExperienceAddon', markets: '#scenarioExperienceAddon', partners: '#scenarioExperienceAddon' },
    trainer: { overview: '#today', today: '#priorities', habits: '#scenarioExperienceAddon', progress: '#scenarioStage', recovery: '#scenarioExperienceAddon', coach: '#scenarioExperienceAddon' },
    team: { overview: '#today', mywork: '#scenarioStage', project: '#scenarioStage', handoffs: '#scenarioStage', procedure: '#scenarioStage', finance: '#scenarioStage', spaces: '#scenarioStage' }
  };

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function preset() {
    const value = window.BRIEF_APP?.getPreset?.();
    return VALID_PRESETS.includes(value) ? value : 'individual';
  }

  function scenarioData() {
    return window.BRIEF_DATA?.scenarios?.[preset()] || window.BRIEF_DATA?.scenarios?.individual || {};
  }

  function liveData() { return window.BRIEF_LIVE_DATA || {}; }
  function content() { return window.BRIEF_DAILY_CONTENT || {}; }
  function teamData() { return window.BRIEF_SCENARIOS?.team || {}; }

  function text(value, fallback = 'Available after an approved connection') {
    return escapeHtml(value || fallback);
  }

  function card(label, title, detail, tone = 'blue', meta = '') {
    return `<article class="quick-signal-card tone-${escapeHtml(tone)}"><span>${text(label)}</span><h4>${text(title)}</h4><p>${text(detail)}</p>${meta ? `<small>${text(meta)}</small>` : ''}</article>`;
  }

  function compactList(items) {
    return `<div class="quick-compact-list">${items.map(item => `<article><span>${text(item.label)}</span><div><strong>${text(item.title)}</strong><small>${text(item.detail)}</small></div></article>`).join('')}</div>`;
  }

  function timeline(items) {
    return `<ol class="quick-timeline">${items.slice(0, 5).map((item, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span><time>${text(item.time)}</time><div><strong>${text(item.title)}</strong><small>${text(item.meta)}</small></div></li>`).join('')}</ol>`;
  }

  function quoteFor(current) {
    const c = content();
    const values = {
      individual: c.personalDashboard?.quote || 'A useful day begins when the next honest action becomes visible.',
      couple: 'Care becomes practical when both people can see the next kind action.',
      partners: 'Clarity compounds when every decision has evidence, an owner and a date.',
      trainer: c.trainerAccountability?.quote || 'Consistency becomes easier when the plan fits the person.',
      team: window.BRIEF_TEAM_VIEW?.quote || 'A strong team sees the same mission without exposing every private detail.'
    };
    return values[current];
  }

  function quoteCard(current) {
    const date = liveData().horoscopes?.date || content().edition?.date || 'Today';
    return `<blockquote class="quick-quote-card tone-${escapeHtml(current)}"><span class="quick-quote-mark" aria-hidden="true">“</span><div><small>DAILY BRIEFING REFLECTION · ${text(date)}</small><p>${text(quoteFor(current))}</p><footer>Original briefing reflection</footer></div></blockquote>`;
  }

  function sectionHeading(kicker, title, copy) {
    return `<div class="quick-panel-heading"><div><p class="micro-label">${text(kicker)}</p><h3>${text(title)}</h3></div><p>${text(copy)}</p></div>`;
  }

  function overviewPanel(current) {
    const data = scenarioData();
    const live = liveData();
    const weather = live.weather || data.weather || {};
    const priority = data.priorities?.[0] || {};
    const next = data.nextUp || {};
    const cards = [];

    cards.push(card('NEXT', next.title, next.time, 'blue', next.prep?.[0]));
    const weatherMeta = weather.temperature || (data.weather?.hourly?.[0]?.temp !== undefined ? `${data.weather.hourly[0].temp}°` : 'Public layer');
    cards.push(card('WEATHER', weather.condition, weather.advice || weather.summary, 'amber', weatherMeta));
    cards.push(card('PRIORITY', priority.title, priority.detail, 'violet', priority.due));

    if (current === 'individual') {
      const project = content().personalDashboard?.projects?.[0];
      cards.push(card('WORK', project?.name, project?.next, 'green', project?.state));
      cards.push(card('PERSONAL', 'Movement still matters', data.priorities?.[2]?.detail, 'pink', data.priorities?.[2]?.due));
    } else if (current === 'couple') {
      const shared = content().relationshipSpace?.shared?.[0];
      cards.push(card('TOGETHER', shared?.text, 'Approved for the couple space', 'green', shared?.label));
      cards.push(card('REFLECTION', 'Virgo + Virgo', live.horoscopes?.compatibility, 'pink', 'Entertainment and reflection'));
    } else if (current === 'partners') {
      const shared = content().businessSpace?.shared || [];
      cards.push(card(shared[0]?.label, shared[0]?.value, shared[0]?.note, 'green'));
      cards.push(card('DECISION', shared[2]?.value, shared[2]?.note, 'pink', 'Fictional operating record'));
    } else if (current === 'trainer') {
      const week = content().trainerAccountability?.week || [];
      const done = week.filter(day => day.done === true).length;
      cards.push(card('WEEK', `${done} completed days`, 'A quick accountability signal, not a judgment.', 'green'));
      cards.push(card('COACH', 'Adapt after today’s check-in', 'One answer can change the next recommendation without redefining the person.', 'pink'));
    } else {
      const team = window.BRIEF_TEAM_VIEW || {};
      cards.push(card('PROJECT', team.quickSignals?.[0], team.quickSignals?.[1], 'green'));
      cards.push(card('HANDOFFS', team.quickSignals?.[2], team.quickSignals?.[4], 'pink'));
    }

    const deepTab = current === 'team' ? 'mywork' : current === 'partners' ? 'decisions' : current === 'trainer' ? 'today' : current === 'couple' ? 'together' : 'work';
    return `${sectionHeading('QUICK BRIEFING', `${LABELS[current]}: what matters now`, 'Five signals, one recommended move, and the deeper workspace only when it is useful.')}
      <div class="quick-signal-grid">${cards.join('')}</div>
      <div class="quick-overview-lower">
        <section class="quick-next-action"><span>RECOMMENDED NEXT MOVE</span><h4>${text(priority.title || next.title)}</h4><p>${text(priority.detail || next.prep?.join(' · '))}</p><button type="button" data-open-deep="${escapeHtml(deepTab)}">Open the relevant view</button></section>
        ${quoteCard(current)}
      </div>
      <section class="quick-dayline"><div><p class="micro-label">TODAY’S FLOW</p><h4>The full day without the full scroll.</h4></div>${timeline(data.schedule || [])}</section>`;
  }

  function personalPanel(tab) {
    const data = scenarioData();
    const live = liveData();
    const c = content();
    if (tab === 'day') return `${sectionHeading('DAY', 'Time, weather and the next useful window', 'Current public information and fictional schedule data stay clearly labeled.')}${timeline(data.schedule || [])}<div class="quick-signal-grid">${(live.weather?.metrics || data.weather?.metrics || []).map(item => card(item.label, item.value, live.weather?.advice || data.weather?.advice, 'blue')).join('')}</div>`;
    if (tab === 'work') return `${sectionHeading('WORK', 'Projects, inbox and ownership without the full dashboard', 'The full report remains available in the workspace.')}${compactList((c.personalDashboard?.projects || []).map(item => ({ label: item.state, title: item.name, detail: item.next })))}${compactList((c.personalDashboard?.fakeInbox || []).slice(0, 2).map(item => ({ label: item.state, title: item.subject, detail: item.reason })))}`;
    if (tab === 'money') return `${sectionHeading('FINANCE', 'Enough financial context to notice what needs attention', 'This public concept uses fictional rows until protected financial accounts are connected.')}${compactList([{ label: 'BILLS', title: 'Two fictional bills due this week', detail: '$486 demonstration total' }, { label: 'REVIEW', title: 'Two uncategorized expenses', detail: 'A connected version would ask before categorizing them' }, { label: 'BOUNDARY', title: 'No financial action is automatic', detail: 'Transfers, payments and changes require explicit approval' }])}`;
    if (tab === 'wellness') return `${sectionHeading('WELLNESS', 'Movement, recovery and a realistic next step', 'Health and fitness guidance remains bounded by evidence and appropriate professional care.')}${compactList([{ label: 'MOVEMENT', title: data.priorities?.[2]?.title, detail: data.priorities?.[2]?.detail }, { label: 'WEATHER WINDOW', title: live.weather?.condition || data.weather?.condition, detail: live.weather?.advice || data.weather?.advice }, { label: 'MEMORY', title: 'Corrections stay more important than guesses', detail: 'Temporary context can expire instead of becoming identity' }])}${quoteCard('individual')}`;
    return `${sectionHeading('INTELLIGENCE', 'Only the public updates that could change the day', 'A timestamp, source and reason matter more than a wall of headlines.')}${compactList((live.news || []).slice(0, 4).map(item => ({ label: item.group || item.status, title: item.title, detail: item.why || item.summary })))}`;
  }

  function couplePanel(tab) {
    const data = scenarioData();
    const c = content();
    const live = liveData();
    if (tab === 'together') return `${sectionHeading('TOGETHER', 'One shared priority and one small repair', 'Approved shared information stays separate from private processing.')}${compactList((c.relationshipSpace?.shared || []).map(item => ({ label: item.label, title: item.text, detail: 'Approved couple-space item' })))}${compactList([{ label: 'CHECK-IN', title: data.nextUp?.title, detail: data.nextUp?.prep?.join(' · ') }])}`;
    if (tab === 'profiles') return `${sectionHeading('PROFILES', 'Two private accounts, one approved couple space', 'Neither person receives automatic access to the other person’s private notes.')}${compactList([{ label: c.relationshipSpace?.labels?.left, title: c.relationshipSpace?.left?.name, detail: c.relationshipSpace?.left?.approvedShared?.[0] }, { label: c.relationshipSpace?.labels?.right, title: c.relationshipSpace?.right?.name, detail: c.relationshipSpace?.right?.approvedShared?.[0] }, { label: c.relationshipSpace?.labels?.shared, title: 'Approved together', detail: c.relationshipSpace?.shared?.[0]?.text }])}`;
    if (tab === 'plans') return `${sectionHeading('PLANS', 'Shared decisions with owners and timing', 'Travel, budgets, rituals and promises can be visible without exposing everything else.')}${compactList((data.priorities || []).map(item => ({ label: item.status, title: item.title, detail: `${item.owner} · ${item.due}` })))}`;
    if (tab === 'watch') {
      const video = window.CMX_DAILY_VIDEO || {};
      return `${sectionHeading('TODAY’S WATCH', video.title || 'Shared media appears here', video.text || 'The daily selection uses the same verified YouTube source as /news.')}${video.videoId ? `<button type="button" class="quick-watch-card" data-open-full-target="#relationshipDailyWatch"><img src="https://i.ytimg.com/vi/${escapeHtml(video.videoId)}/hqdefault.jpg" alt="" loading="lazy"><span><small>${text(video.status || 'OFFICIAL VIDEO')}</small><strong>${text(video.title)}</strong><p>${text(video.text)}</p><b>Open player in full workspace</b></span></button>` : card('MEDIA', 'No valid video is available', 'The rest of the relationship briefing still works.', 'violet')}`;
    }
    return `${sectionHeading('REFLECTION', 'Virgo + Virgo, with room for two real people', live.horoscopes?.disclaimer || 'Astrology is entertainment and reflection.')}${quoteCard('couple')}${compactList([{ label: 'COUPLE REFLECTION', title: 'Virgo + Virgo', detail: live.horoscopes?.compatibility }, ...(live.entertainment || []).slice(0, 2).map(item => ({ label: item.status, title: item.title, detail: item.why || item.summary }))])}`;
  }

  function businessPanel(tab) {
    const data = scenarioData();
    const c = content();
    const live = liveData();
    if (tab === 'finance') return `${sectionHeading('FINANCE', 'Cash, margin and exposure in a few decisive signals', 'The full workspace keeps the charts, allocation and shared ledger.')}${compactList((c.businessSpace?.shared || []).map(item => ({ label: item.label, title: item.value, detail: item.note })))}`;
    if (tab === 'projects') return `${sectionHeading('PROJECTS', 'Risks, owners and deadlines', 'A useful operating brief makes unowned work visibly uncomfortable.')}${compactList((data.priorities || []).map(item => ({ label: item.status, title: item.title, detail: `${item.owner} · ${item.due}` })))}`;
    if (tab === 'decisions') return `${sectionHeading('DECISIONS', 'Evidence becomes an owner and a deadline', 'Repeated debates can become written operating rules.')}${compactList((c.businessSpace?.advice || []).map(item => ({ label: item.kind, title: item.title, detail: item.text })))}`;
    if (tab === 'markets') return `${sectionHeading('MARKETS', 'Public news only when it changes company exposure', 'Current stories stay separate from fictional internal company data.')}${compactList((live.markets || []).map(item => ({ label: item.status, title: item.title, detail: item.impact || item.summary })))}`;
    return `${sectionHeading('PARTNERS', 'Private interpretations before the shared operating view', 'Personal concerns and company facts do not need the same visibility.')}${compactList([{ label: c.businessSpace?.labels?.left, title: c.businessSpace?.left?.name, detail: c.businessSpace?.left?.approved?.[0] }, { label: c.businessSpace?.labels?.right, title: c.businessSpace?.right?.name, detail: c.businessSpace?.right?.approved?.[0] }, { label: c.businessSpace?.labels?.shared, title: 'Approved company space', detail: c.businessSpace?.shared?.[2]?.note }])}`;
  }

  function trainerPanel(tab) {
    const data = scenarioData();
    const c = content();
    const scenario = window.BRIEF_SCENARIOS?.trainer || {};
    if (tab === 'today') return `${sectionHeading('TODAY', 'One workout, one check-in, one adaptive decision', 'The plan can become smaller without calling the day a failure.')}${compactList((data.priorities || []).map(item => ({ label: item.status, title: item.title, detail: `${item.owner} · ${item.due}` })))}`;
    if (tab === 'habits') return `${sectionHeading('HABITS', 'The pattern is visible, but still correctable', 'Habit evidence supports a conversation. It does not define the person.')}${compactList((scenario.habits || []).map(item => ({ label: item.label, title: item.display, detail: item.insight })))}`;
    if (tab === 'progress') return `${sectionHeading('PROGRESS', 'Evidence before confidence', 'Completed work, corrections and repeated patterns matter more than motivational language.')}${compactList((scenario.patterns || []).map(item => ({ label: item.status, title: item.title, detail: item.action })))}`;
    if (tab === 'recovery') return `${sectionHeading('RECOVERY', 'Sleep, pain and readiness can change the plan', 'Unusual pain requires an appropriate pause and professional guidance when needed.')}${compactList((c.trainerAccountability?.questions || []).slice(2).map(item => ({ label: 'CHECK-IN', title: item.question, detail: item.no })))}`;
    return `${sectionHeading('COACH', 'Accountability that adapts instead of shaming', 'Trainer rules, student answers and AI suggestions stay separately labeled.')}${quoteCard('trainer')}${compactList((scenario.notes || []).map(item => ({ label: item.source, title: item.state, detail: item.text })))}`;
  }

  function teamPanel(tab) {
    const data = teamData();
    if (tab === 'mywork') return `${sectionHeading('MY WORK', 'A member sees the next work, dependencies and approved context', 'The project lead and a team member do not need identical dashboards.')}${compactList((data.members || []).map(item => ({ label: item.role, title: item.next, detail: `${item.name} · ${item.sees}` })))}`;
    if (tab === 'project') return `${sectionHeading('PROJECT', 'One shared timeline with visible blockers', 'The status line moves when evidence changes, not because the presentation wants to look optimistic.')}${compactList((data.timeline || []).map(item => ({ label: item.state, title: item.phase, detail: `${item.owner} · ${item.detail}` })))}`;
    if (tab === 'handoffs') return `${sectionHeading('HANDOFFS', 'Every transfer names the sender, receiver and missing evidence', 'This works for product delivery, operations, care coordination and field work.')}${compactList((data.handoffs || []).map(item => ({ label: item.status, title: `${item.from} → ${item.to}`, detail: item.item })))}`;
    if (tab === 'procedure') return `${sectionHeading('PROCEDURE', 'Preparation before a launch, operation or appointment', 'Role-restricted information can support readiness without entering the general team space.')}${compactList((data.procedure || []).map(item => ({ label: item.state, title: item.label, detail: item.detail })))}`;
    if (tab === 'finance') return `${sectionHeading('FINANCE', 'The financial context each role needs, with the rest restricted', 'Budget signals can shape decisions without exposing payroll or personal compensation.')}${compactList((data.finance || []).map(item => ({ label: item.label, title: item.value, detail: item.note })))}`;
    return `${sectionHeading('SPACES', 'Private profiles, role spaces, project spaces and leadership spaces', 'Access follows purpose and permission, with audit history and revocation.')}${compactList((data.spaces || []).map(item => ({ label: item.label, title: item.label, detail: item.text })))}${compactList((data.security || []).slice(0, 4).map((item, index) => ({ label: `SECURITY ${index + 1}`, title: item, detail: 'Planned protected backend behavior' })))}`;
  }

  function panelHtml(current, tab) {
    if (tab === 'overview') return overviewPanel(current);
    if (current === 'individual') return personalPanel(tab);
    if (current === 'couple') return couplePanel(tab);
    if (current === 'partners') return businessPanel(tab);
    if (current === 'trainer') return trainerPanel(tab);
    return teamPanel(tab);
  }

  function signals(current) {
    const data = scenarioData();
    const live = liveData();
    const generated = live.generated || content().edition?.date || 'Daily update';
    const values = [
      { label: 'UPDATED', value: generated },
      { label: 'NEXT', value: data.nextUp?.title || 'Next useful action' },
      { label: 'WEATHER', value: live.weather?.condition || data.weather?.condition || 'Public layer' },
      { label: 'PRIORITY', value: data.priorities?.[0]?.title || 'Review today' }
    ];
    if (current === 'couple') values.push({ label: 'SHARED', value: content().relationshipSpace?.shared?.[0]?.text || 'Approved couple space' });
    else if (current === 'partners') values.push({ label: 'MARKET', value: live.markets?.[0]?.title || 'Current market context' });
    else if (current === 'trainer') values.push({ label: 'CHECK-IN', value: content().trainerAccountability?.questions?.[0]?.question || 'Daily accountability' });
    else if (current === 'team') values.push({ label: 'TEAM', value: window.BRIEF_TEAM_VIEW?.quickSignals?.[1] || 'Role-based project space' });
    else values.push({ label: 'NEWS', value: live.news?.[0]?.title || 'Current public intelligence' });
    return values;
  }

  function renderRail(current) {
    const track = $('#briefSignalStrip');
    if (!track) return;
    const items = signals(current);
    track.innerHTML = [...items, ...items].map(item => `<span><b>${text(item.label)}</b>${text(item.value)}</span>`).join('');
  }

  function renderTabs(current) {
    const host = $('#briefWorkspaceTabs');
    if (!host) return;
    const available = TABS[current] || TABS.individual;
    if (!available.some(([id]) => id === state.tab)) state.tab = 'overview';
    host.innerHTML = available.map(([id, label]) => `<button type="button" role="tab" id="brief-tab-${escapeHtml(id)}" aria-selected="${id === state.tab}" aria-controls="briefWorkspacePanel" data-workspace-tab="${escapeHtml(id)}">${escapeHtml(label)}</button>`).join('');
    $$('[data-workspace-tab]', host).forEach(button => button.addEventListener('click', () => selectTab(button.dataset.workspaceTab, true)));
  }

  function renderPanel() {
    const panel = $('#briefWorkspacePanel');
    if (!panel) return;
    const current = preset();
    panel.setAttribute('aria-labelledby', `brief-tab-${state.tab}`);
    if (state.depth === 'full') {
      panel.innerHTML = `<div class="full-workspace-open"><div><p class="micro-label">FULL WORKSPACE OPEN</p><h3>Every rich module is available below.</h3><p>Use the pills as shortcuts, or return to the concise briefing when you have seen enough.</p></div><button type="button" data-depth-choice="quick">Return to quick briefing</button></div>`;
      $('[data-depth-choice="quick"]', panel)?.addEventListener('click', () => setDepth('quick', true));
      return;
    }
    panel.innerHTML = panelHtml(current, state.tab);
    $$('[data-open-deep]', panel).forEach(button => button.addEventListener('click', () => {
      state.tab = button.dataset.openDeep;
      setDepth('full', false);
      window.setTimeout(() => scrollDeepTarget(state.tab), 80);
    }));
    $$('[data-open-full-target]', panel).forEach(button => button.addEventListener('click', () => {
      const target = button.dataset.openFullTarget;
      setDepth('full', false);
      window.setTimeout(() => $(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 160);
    }));
  }

  function selectTab(tab, userInitiated = false) {
    state.tab = tab;
    renderTabs(preset());
    if (state.depth === 'full') {
      scrollDeepTarget(tab);
      return;
    }
    renderPanel();
    if (userInitiated) $('#briefWorkspacePanel')?.focus({ preventScroll: true });
  }

  function scrollDeepTarget(tab) {
    const selector = DEEP_TARGETS[preset()]?.[tab] || '#scenarioExplorer';
    const target = $(selector) || $('#scenarioExplorer');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function setDepth(value, scroll = false) {
    state.depth = value === 'full' ? 'full' : 'quick';
    document.body.dataset.briefDepth = state.depth;
    $$('[data-depth-choice]').forEach(button => {
      const active = button.dataset.depthChoice === state.depth;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    renderPanel();
    if (scroll) $('#briefWorkspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function createWorkspace() {
    if ($('#briefWorkspace')) return true;
    const hero = $('#today');
    if (!hero) return false;
    const section = document.createElement('section');
    section.id = 'briefWorkspace';
    section.className = 'brief-section brief-workspace-shell';
    section.innerHTML = `
      <div class="brief-workspace-top">
        <div><p class="micro-label">INTELLIGENT COMPRESSION</p><h2>Everything organized. Only what matters shown first.</h2><p>The quick briefing proves the daily value. The full workspace preserves every dashboard, profile, chart, player, explanation and control.</p></div>
        <div class="brief-depth-switch" role="group" aria-label="Briefing depth"><button type="button" data-depth-choice="quick" class="is-active" aria-pressed="true">Quick briefing</button><button type="button" data-depth-choice="full" aria-pressed="false">Full workspace</button></div>
      </div>
      <section class="brief-signal-rail" aria-label="Current briefing signals"><button id="briefSignalPause" type="button" aria-pressed="false">Pause</button><div class="brief-signal-window"><div id="briefSignalStrip" class="brief-signal-strip"></div></div></section>
      <div id="briefWorkspaceTabs" class="brief-workspace-tabs" role="tablist" aria-label="Briefing views"></div>
      <div id="briefWorkspacePanel" class="brief-workspace-panel" role="tabpanel" tabindex="-1"></div>`;
    hero.insertAdjacentElement('afterend', section);
    document.body.classList.add('has-brief-workspace');
    document.body.dataset.briefDepth = state.depth;

    $$('[data-depth-choice]', section).forEach(button => button.addEventListener('click', () => setDepth(button.dataset.depthChoice, false)));
    $('#briefSignalPause')?.addEventListener('click', event => {
      state.railPaused = !state.railPaused;
      section.dataset.railPaused = String(state.railPaused);
      event.currentTarget.setAttribute('aria-pressed', String(state.railPaused));
      event.currentTarget.textContent = state.railPaused ? 'Play' : 'Pause';
    });
    return true;
  }

  function patchHero() {
    const link = $('.hero-actions .primary-action');
    if (link) {
      link.href = '#briefWorkspace';
      link.textContent = 'Open quick briefing';
    }
  }

  function addTeamSwitchers() {
    const quickGrid = $('#scenarioQuickMenu .scenario-quick-grid');
    if (quickGrid && !quickGrid.querySelector('[data-quick-preset="team"]')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.quickPreset = 'team';
      button.innerHTML = '<span>Team</span><small>Members, roles, projects, handoffs and procedures</small>';
      button.addEventListener('click', () => {
        window.BRIEF_APP?.setPreset?.('team');
        $('#scenarioQuickMenu')?.classList.add('is-hidden');
        $('#scenarioMenuButton')?.setAttribute('aria-expanded', 'false');
      });
      quickGrid.appendChild(button);
    }

    const footerGrid = $('#briefingFooterSwitcher .footer-view-grid');
    if (footerGrid && !footerGrid.querySelector('[data-footer-preset="team"]')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.footerPreset = 'team';
      button.innerHTML = '<span>Team</span><small>Role-based member views, project truth, handoffs, procedures and approved financial context.</small><b>Open briefing →</b>';
      button.addEventListener('click', () => window.BRIEF_APP?.setPreset?.('team'));
      footerGrid.appendChild(button);
    }

    const dock = $('.scenario-dock-buttons');
    if (dock && !dock.querySelector('[data-dock-preset="team"]')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.dockPreset = 'team';
      button.textContent = 'Team';
      button.addEventListener('click', () => window.BRIEF_APP?.setPreset?.('team'));
      dock.appendChild(button);
    }
  }

  function renderAll() {
    const current = preset();
    renderRail(current);
    renderTabs(current);
    renderPanel();
    patchHero();
    addTeamSwitchers();
  }

  function onPresetChange() {
    state.depth = 'quick';
    state.tab = 'overview';
    document.body.dataset.briefDepth = 'quick';
    window.setTimeout(() => {
      renderAll();
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, 220);
  }

  function initialize() {
    if (initialized || !window.BRIEF_APP || !window.BRIEF_DATA) return false;
    if (!createWorkspace()) return false;
    initialized = true;
    renderAll();
    setDepth('quick', false);
    window.addEventListener('brief:preset-change', onPresetChange);
    window.addEventListener('brief:device-fallback-open', () => window.setTimeout(renderAll, 180));
    [300, 800, 1600].forEach(delay => window.setTimeout(addTeamSwitchers, delay));
    return true;
  }

  function tryInitialize() {
    if (initialize()) return;
    retries += 1;
    if (retries < 20) retryTimer = window.setTimeout(tryInitialize, 250);
  }

  window.addEventListener('brief:ready', tryInitialize, { once: true });
  if (window.BRIEF_APP) tryInitialize();
  else document.addEventListener('DOMContentLoaded', tryInitialize, { once: true });
})();
