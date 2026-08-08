(() => {
  'use strict';

  const data = window.BRIEF_DEMO_DATA;
  if (!data?.scenarios) return;

  function mergeCopy(target, source) {
    Object.entries(source).forEach(([key, value]) => {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (!target[key] || typeof target[key] !== 'object') target[key] = {};
        mergeCopy(target[key], value);
        return;
      }
      target[key] = value;
    });
  }

  mergeCopy(data, {
    meta: {
      title: 'A clear view of what matters today',
      description: 'A working daily briefing that organizes approved information around clear Spaces, permissions, goals, and next steps.'
    },
    scenarios: {
      personal: {
        headline: 'Here’s what your day looks like',
        summary: 'Your schedule, priorities, bills, movement, and next steps are together in one place.',
        recommendation: {
          title: 'Send the revised scope before the afternoon fills up',
          detail: 'It clears the main blocker and keeps the later focus window open.'
        },
        details: {
          day: {
            title: 'Your whole day in one view',
            summary: 'See the timing, conditions, and open windows in one practical view.'
          },
          work: {
            title: 'Projects, messages, and owners',
            summary: 'This view shows only the work that affects the next decision.'
          },
          money: {
            title: 'Money items that need a look',
            summary: 'The demo uses made-up records while secure finance connections remain planned.'
          },
          wellness: {
            title: 'A realistic movement plan for today',
            summary: 'A shorter plan can still keep the habit alive.'
          },
          connections: {
            title: 'Connection status and permission scope',
            summary: 'Each service shows whether it is live, made up, disconnected, or planned.'
          }
        },
        soundtrack: { note: 'A bright track for getting one real task done.' }
      },
      relationship: {
        short: 'Two private profiles and one shared Space',
        headline: 'Start with reassurance, then work through the plan',
        summary: 'Each person keeps a private profile, and the shared Space holds only the plans, promises, and details both people approved.',
        recommendation: {
          title: 'Confirm the plan and keep the discussion focused.',
          detail: 'Use the shared facts, name what still needs approval, and keep private thoughts private.'
        },
        details: {
          together: {
            title: 'One shared priority and one small repair',
            summary: 'Shared facts stay separate from each person’s private thoughts.'
          },
          profiles: {
            title: 'Two people keep two private profiles',
            summary: 'Each person’s private memory stays in their own profile.'
          },
          plans: {
            title: 'Shared decisions with owners and dates',
            summary: 'A plan is easier to follow when it has an owner and a clear approval state.'
          },
          reflection: {
            title: 'Reflection that stays practical',
            summary: 'The Brief can help with repair, appreciation, and clearer communication while both people make their own decisions.'
          },
          connections: {
            title: 'Shared services with clear limits',
            summary: 'Each connection can be limited to the couple Space and one clear use.'
          }
        }
      },
      trainer: {
        headline: 'Adjust the plan while keeping accountability',
        summary: 'Training, recovery, habits, and check-ins stay useful when the record shows what actually happened.',
        recommendation: {
          title: 'Use the smaller plan when readiness is low.',
          detail: 'Record the change so the coach can plan the next session from real evidence.'
        },
        details: {
          today: {
            title: 'One workout, one check-in, and one clear choice',
            summary: 'The plan can change while the goal stays in view.'
          },
          habits: {
            title: 'Use patterns to start a conversation',
            summary: 'A pattern adds temporary context that the user can review and correct.'
          },
          progress: {
            title: 'Use completed work as evidence',
            summary: 'Completed sessions, corrections, and repeated results matter more than motivational copy.'
          },
          recovery: {
            title: 'Sleep, pain, and readiness can change today’s plan',
            summary: 'Unusual pain calls for a pause and qualified help when needed.'
          },
          connections: {
            title: 'Fitness data needs health boundaries',
            summary: 'The data can support coaching, but qualified care still belongs with a professional.'
          }
        }
      },
      team: {
        short: 'Roles, handoffs, and one shared project record',
        headline: 'Give everyone the same goal and only the access they need',
        summary: 'Members see the work they need, and project leads keep the wider view and restricted details.',
        recommendation: {
          title: 'Assign the missing handoff before adding more work.',
          detail: 'The missing receiver is the clearest release risk.'
        },
        weather: {
          condition: 'Release window open',
          advice: 'The real condition here is blocker status and owner clarity.'
        },
        details: {
          mywork: {
            title: 'Your role-specific work',
            summary: 'A member sees what they own, what blocks it, and the approved details needed to finish.'
          },
          project: {
            title: 'One timeline with visible blockers',
            summary: 'Status changes when the evidence changes.'
          },
          handoffs: {
            title: 'Every handoff needs a sender, receiver, and proof',
            summary: 'The same handoff rule works for delivery, operations, care, and field work.'
          },
          procedures: {
            title: 'Prepare before the launch',
            summary: 'Restricted details can support readiness while remaining in lead-access records.'
          },
          connections: {
            title: 'Connect tools by role and purpose',
            summary: 'The project Space receives only the records needed for the work.'
          }
        }
      }
    }
  });

  if (!data.navigation.some(item => item.id === 'everything')) {
    data.navigation.push({ id: 'everything', label: 'Everything' });
  }

  const adaptiveSteps = [
    ['Gather', 'Read only the approved sources needed for this update.'],
    ['Check', 'See what changed, compare sources, and flag missing information.'],
    ['Choose', 'Use goals, permissions, memory, and recent results to decide what matters today.'],
    ['Build', 'Show the clearest cards, lists, charts, or maps for the available information.'],
    ['Review', 'Let the user open sources, change views, correct memory, or approve an action.'],
    ['Save', 'Record the confirmed result for the next Brief.']
  ];

  const componentChoices = [
    ['Trend', 'Chart', 'Use a graph when change over time affects the decision.'],
    ['Schedule', 'Timeline', 'Use a timeline when order, timing, or ownership matters.'],
    ['Choice', 'Comparison', 'Use a comparison when the user needs to choose between real options.'],
    ['Location', 'Map', 'Use a map when travel, weather, distance, or routing affects the plan.'],
    ['Risk', 'Alert', 'Use a clear alert when something needs review, approval, or escalation.'],
    ['Coordination', 'Shared actions', 'Use an owner list for couples, families, teams, and project Spaces.']
  ];

  const alarmSteps = [
    ['Wake', 'Start at the selected time with clear controls for snooze, skip, and privacy.'],
    ['Soundtrack', 'Play approved music from the connected Spotify account.'],
    ['Overview', 'Read a short summary of what changed, what matters, and the first useful step.'],
    ['Continue', 'Open the calendar, route, message, task, or Brief that needs attention.']
  ];

  const escapeHtml = value => {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  };

  const selectedScenarioId = () => {
    const selectValue = document.getElementById('scenarioSelect')?.value;
    const bodyValue = document.body?.dataset.scenario;
    return data.scenarios[selectValue] ? selectValue : (data.scenarios[bodyValue] ? bodyValue : data.meta.defaultScenario);
  };

  const sectionButton = (view, label) => `<button class="text-button" type="button" data-go-view="${escapeHtml(view)}">${escapeHtml(label)} <span aria-hidden="true">→</span></button>`;

  function renderJumpNav() {
    const host = document.getElementById('everythingJumpNav');
    if (!host) return;
    const items = [
      ['all-overview', 'Overview'],
      ['all-weather', 'Weather'],
      ['all-signals', 'Numbers'],
      ['all-flow', 'Flow'],
      ['all-workspace', 'Workspace'],
      ['all-spaces', 'Spaces'],
      ['all-adaptive', 'Adaptive Brief'],
      ['all-alarm', 'Morning concept'],
      ['all-privacy', 'Privacy']
    ];
    host.innerHTML = items.map(([id, label]) => `<a href="#${id}">${escapeHtml(label)}</a>`).join('');
  }

  function renderEverything(id = selectedScenarioId()) {
    const scenario = data.scenarios[id] || data.scenarios[data.meta.defaultScenario];
    const host = document.getElementById('everythingContent');
    if (!host) return;

    host.innerHTML = `
      <section class="full-section full-overview" id="all-overview">
        <div class="full-section-heading">
          <div><p class="eyebrow">OVERVIEW</p><h2>${escapeHtml(scenario.headline)}</h2></div>
          <div class="full-section-actions">${sectionButton('today', 'Open Today view')}</div>
        </div>
        <p class="full-lead">${escapeHtml(scenario.summary)}</p>
        <div class="full-overview-grid">
          <article><span>Next</span><strong>${escapeHtml(scenario.next.time)} · ${escapeHtml(scenario.next.title)}</strong><p>${escapeHtml(scenario.next.detail)}</p></article>
          <article><span>${escapeHtml(scenario.recommendation.label)}</span><strong>${escapeHtml(scenario.recommendation.title)}</strong><p>${escapeHtml(scenario.recommendation.detail)}</p></article>
        </div>
      </section>

      <section class="full-section" id="all-weather">
        <div class="full-section-heading">
          <div><p class="eyebrow">CONDITION</p><h2>Weather and timing</h2></div>
          <div class="full-section-actions">${sectionButton('today', 'Open weather in Today')}</div>
        </div>
        <article class="weather-card full-weather-card">
          <div class="weather-heading">
            <div><p class="eyebrow">CONDITION THAT CHANGES THE DAY</p><h3>Current conditions</h3></div>
            <span class="source-pill muted-pill">DEMO CONDITION</span>
          </div>
          <div class="weather-main">
            <div class="weather-visual" aria-hidden="true"><span class="weather-sun"></span><span class="weather-cloud cloud-one"></span><span class="weather-cloud cloud-two"></span></div>
            <div class="weather-reading">
              <p>${escapeHtml(scenario.weather.location)}</p>
              <strong>${escapeHtml(scenario.weather.temperature)}°</strong>
              <h3>${escapeHtml(scenario.weather.condition)}</h3>
              <p>${escapeHtml(scenario.weather.advice)}</p>
            </div>
            <div class="weather-range"><span>High <b>${escapeHtml(scenario.weather.high)}</b>°</span><span>Low <b>${escapeHtml(scenario.weather.low)}</b>°</span></div>
          </div>
          <div class="hourly-strip">${scenario.weather.hourly.map(hour => `<article class="hourly-item"><time>${escapeHtml(hour.time)}</time><strong>${escapeHtml(hour.temp)}°</strong><small>${escapeHtml(hour.label || `${hour.rain}% rain`)}</small></article>`).join('')}</div>
        </article>
      </section>

      <section class="full-section" id="all-signals">
        <div class="full-section-heading"><div><p class="eyebrow">AT A GLANCE</p><h2>Useful numbers</h2></div></div>
        <div class="full-stat-grid">${scenario.stats.map(item => `<article><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong><small>${escapeHtml(item.note)}</small></article>`).join('')}</div>
      </section>

      <section class="full-section" id="all-flow">
        <div class="full-section-heading"><div><p class="eyebrow">ORDER</p><h2>The day in order</h2></div></div>
        <ol class="full-flow">${scenario.flow.map(item => `<li><time>${escapeHtml(item.time)}</time><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.meta)}</span></li>`).join('')}</ol>
      </section>

      <section class="full-section" id="all-workspace">
        <div class="full-section-heading">
          <div><p class="eyebrow">WORKSPACE CATEGORIES</p><h2>Every category in this ${escapeHtml(scenario.label.toLowerCase())} briefing</h2></div>
          <div class="full-section-actions">${sectionButton('workspace', 'Use focused Workspace')}</div>
        </div>
        <div class="full-workspace-stack">${scenario.tabs.map(tab => {
          const detail = scenario.details[tab.id];
          if (!detail) return '';
          const visual = window.BRIEF_DEMO_ADVANCED?.renderDetail(detail);
          return `<article class="full-workspace-group">
            <header><div><span>${escapeHtml(tab.label)}</span><h3>${escapeHtml(detail.title)}</h3><p>${escapeHtml(detail.summary)}</p></div><button type="button" class="secondary-button compact-action" data-full-workspace-tab="${escapeHtml(tab.id)}">Open ${escapeHtml(tab.label)}</button></header>
            ${visual ? `<div class="full-workspace-visual">${visual}</div>` : `<div class="full-workspace-cards">${detail.cards.map(card => `<section><span>${escapeHtml(card.label)}</span><strong>${escapeHtml(card.title)}</strong><p>${escapeHtml(card.detail)}</p></section>`).join('')}</div>`}
          </article>`;
        }).join('')}</div>
      </section>

      <section class="full-section" id="all-spaces">
        <div class="full-section-heading">
          <div><p class="eyebrow">PEOPLE AND PERMISSIONS</p><h2>${escapeHtml(scenario.space.title)}</h2></div>
          <div class="full-section-actions">${sectionButton('spaces', 'Open Spaces view')}</div>
        </div>
        <div class="full-space-grid">
          <article><span>PRIVATE CONTEXT</span><ul>${scenario.space.private.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article>
          <article><span>APPROVED SHARED SPACE</span><ul>${scenario.space.shared.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article>
        </div>
      </section>

      <section class="full-section adaptive-section" id="all-adaptive">
        <div class="full-section-heading">
          <div><p class="eyebrow">ADAPTIVE BRIEF</p><h2>Choose the clearest view for the information available</h2></div>
          <div class="full-section-actions">${sectionButton('how', 'See how Spaces works')}</div>
        </div>
        <p class="full-lead">Spaces checks the approved information and presents it with the view that best supports the next decision. Navigation, privacy controls, and the main locations stay familiar as the useful cards, calendars, boards, charts, and explanations change with the day.</p>
        <ol class="adaptive-process">${adaptiveSteps.map(([title, detail], index) => `<li><span>${String(index + 1).padStart(2, '0')}</span><div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(detail)}</p></div></li>`).join('')}</ol>
        <div class="component-choice-grid">${componentChoices.map(([input, component, reason]) => `<article><span>${escapeHtml(input)}</span><strong>${escapeHtml(component)}</strong><p>${escapeHtml(reason)}</p></article>`).join('')}</div>
        <aside class="adaptive-note"><strong>The layout stays familiar as the briefing changes.</strong><p>Controls, sources, and the path back to focused views remain in predictable places.</p></aside>
      </section>

      <section class="full-section alarm-section" id="all-alarm">
        <div class="full-section-heading"><div><p class="eyebrow">FUTURE APP IDEA</p><h2>Start the morning with music and a short overview</h2></div><div class="full-section-actions"><button class="text-button" type="button" data-open-media-from-full>Open today’s soundtrack <span aria-hidden="true">→</span></button></div></div>
        <p class="full-lead">A future Spaces app could play approved music from Spotify, read a short overview, and then open the interactive Brief.</p>
        <div class="alarm-flow">${alarmSteps.map(([title, detail], index) => `<article><span>${String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(title)}</strong><p>${escapeHtml(detail)}</p></article>`).join('')}</div>
        <p class="future-boundary">This concept would require device permissions, provider support, clear controls, and secure sign-in for real playback, voice, alarms, and account access.</p>
      </section>

      <section class="full-section full-privacy" id="all-privacy">
        <div><p class="eyebrow">PRIVATE FIRST</p><h2>More information requires more control</h2></div>
        <p>Connections have a clear purpose, memories remain reviewable, shared Spaces receive only approved records, and important actions require confirmation before they are added to the history.</p>
      </section>

      <nav class="full-end-nav" aria-label="Continue exploring the briefing">
        ${sectionButton('today', 'Return to Today')}
        ${sectionButton('workspace', 'Open Workspace')}
        ${sectionButton('spaces', 'Review Spaces')}
        ${sectionButton('how', 'See how it works')}
      </nav>`;
  }

  function openWorkspaceTab(tab) {
    document.querySelector('[data-primary-view="workspace"]')?.click();
    queueMicrotask(() => document.querySelector(`[data-workspace-tab="${CSS.escape(tab)}"]`)?.click());
  }

  function installEvents() {
    document.addEventListener('briefdemo:scenariochange', event => {
      if (document.body?.dataset.view === 'everything') renderEverything(event.detail?.scenarioId);
    });

    document.addEventListener('briefdemo:viewchange', event => {
      const host = document.getElementById('everythingContent');
      if (event.detail?.view === 'everything') renderEverything(event.detail?.scenarioId);
      else if (host) host.replaceChildren();
    });

    document.addEventListener('click', event => {
      const workspaceButton = event.target.closest('[data-full-workspace-tab]');
      if (workspaceButton) {
        openWorkspaceTab(workspaceButton.dataset.fullWorkspaceTab);
        return;
      }
      if (event.target.closest('[data-open-media-from-full]')) document.getElementById('mediaButton')?.click();
    });
  }

  renderJumpNav();
  installEvents();
})();
