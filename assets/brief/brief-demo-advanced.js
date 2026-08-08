(() => {
  'use strict';

  /*
   * Advanced workspace modules stay separate from the core demo controller.
   * Add or revise records in brief-demo-data.js, then select a renderer with
   * detail.layout. This file owns presentation only. Demo actions change local
   * interface state and never send calendar, financial, or account changes.
   */

  const escapeHtml = value => {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  };

  const safeTone = value => String(value || 'neutral').replace(/[^a-z0-9-]/gi, '').toLowerCase() || 'neutral';
  const clampProgress = value => Math.max(0, Math.min(100, Number(value) || 0));

  function renderMiniMonth(calendar) {
    const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const markers = new Map((calendar.markers || []).map(marker => [Number(marker.day), safeTone(marker.tone)]));
    const blanks = Array.from({ length: Number(calendar.startOffset) || 0 }, () => '<i aria-hidden="true"></i>').join('');
    const days = Array.from({ length: Number(calendar.days) || 31 }, (_, index) => {
      const day = index + 1;
      const tone = markers.get(day);
      return `<span class="${day === Number(calendar.selected) ? 'is-selected' : ''}${tone ? ' has-event' : ''}"${tone ? ` data-calendar-tone="${tone}"` : ''}${day === Number(calendar.selected) ? ' aria-current="date"' : ''}>${day}${tone ? '<b aria-hidden="true"></b>' : ''}</span>`;
    }).join('');
    return `<section class="mini-month" aria-label="${escapeHtml(calendar.label)} fictional calendar"><header><div><span>MONTH VIEW</span><strong>${escapeHtml(calendar.label)}</strong></div><small>${escapeHtml(calendar.note)}</small></header><div class="mini-month-weekdays" aria-hidden="true">${weekdays.map(day => `<b>${day}</b>`).join('')}</div><div class="mini-month-days">${blanks}${days}</div><footer><span><i></i>Shared</span><span><i></i>Personal</span><span><i></i>Care</span></footer></section>`;
  }

  function renderPersonalDay(detail) {
    return `<div class="personal-day-command" aria-label="Fictional personal day plan">
      <section class="personal-timebox">
        <header><div><span>TODAY · TIMEBOXED</span><strong>A realistic plan for the hours that remain</strong></div><small>Fictional schedule</small></header>
        <div class="timebox-scale" aria-hidden="true"><span>2 PM</span><span>4 PM</span><span>6 PM</span><span>8 PM</span></div>
        <ol>${detail.schedule.map((item, index) => `<li data-day-tone="${safeTone(item.tone)}"><time>${escapeHtml(item.time)}</time><div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.context)}</span></div><b>${escapeHtml(item.duration)}</b>${index === 1 ? '<i>Focus</i>' : ''}</li>`).join('')}</ol>
        <footer><span><i></i>4h 15m planned</span><strong>1h 15m remains open</strong></footer>
      </section>
      <aside class="personal-day-side">
        ${renderMiniMonth(detail.calendar)}
        <section class="day-capacity"><header><span>WEEKLY CAPACITY</span><strong>Protect the useful windows</strong></header><div>${detail.capacity.map(item => `<span class="${item.current ? 'is-current' : ''}" data-capacity="${clampProgress(item.value)}"><b>${escapeHtml(item.day)}</b><i><em></em></i><small>${escapeHtml(item.label)}</small></span>`).join('')}</div></section>
      </aside>
      <div class="personal-day-signals">${detail.cards.map((card, index) => `<article data-signal-tone="${['blue', 'violet', 'green'][index]}"><small>${escapeHtml(card.label)}</small><strong>${escapeHtml(card.title)}</strong><p>${escapeHtml(card.detail)}</p></article>`).join('')}</div>
    </div>`;
  }

  function renderFamilyCommand(detail) {
    return `<div class="family-command" aria-label="Fictional family bird's-eye view">
      <section class="family-day-route">
        <header><div><span>HOUSEHOLD PULSE</span><strong>Friday in one route</strong></div><small>5 shared events · 1 approval</small></header>
        <ol>${detail.timeline.map((item, index) => `<li data-family-tone="${safeTone(item.tone)}"><div class="family-route-time"><time>${escapeHtml(item.time)}</time><i aria-hidden="true"></i></div><div><small>${escapeHtml(item.label)}</small><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.owner)}</span></div><b>${index === 0 ? 'Review' : index === 1 ? 'Ready' : 'Planned'}</b></li>`).join('')}</ol>
        <footer><span><i></i>All owners visible</span><strong>One private block contributes availability only</strong></footer>
      </section>
      ${renderMiniMonth(detail.calendar)}
      <section class="family-life-stream"><header><div><span>LIFE AROUND THE CALENDAR</span><strong>Useful details without opening five apps</strong></div><small>Fictional household context</small></header><div>${detail.signals.map(signal => `<article data-family-tone="${safeTone(signal.tone)}"><span aria-hidden="true">${escapeHtml(signal.symbol)}</span><div><small>${escapeHtml(signal.label)}</small><strong>${escapeHtml(signal.title)}</strong><p>${escapeHtml(signal.detail)}</p></div><b>${escapeHtml(signal.status)}</b></article>`).join('')}</div></section>
    </div>`;
  }

  function renderHabitTracker(detail) {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const completed = detail.habits.reduce((total, habit) => total + habit.days.filter(Boolean).length, 0);
    const total = detail.habits.length * days.length;
    const percent = Math.round((completed / total) * 100);
    const dailyTotals = days.map((day, index) => ({ day, complete: detail.habits.filter(habit => habit.days[index]).length }));
    return `<div class="habit-tracker" aria-label="Fictional habit progress">
      <section class="habit-overview">
        <div class="habit-overview-score"><div class="habit-score-ring" role="img" aria-label="${completed} of ${total} weekly habit check-ins complete" data-habit-score="${percent}"><span><strong>${percent}%</strong><small>THIS WEEK</small></span></div><div><small>WEEKLY RHYTHM</small><strong>${completed} of ${total} check-ins</strong><p>Consistency is strongest in the morning. Two open weekend windows can still improve the week without chasing a perfect score.</p></div></div>
        <div class="habit-week-pattern"><header><span>Daily completion</span><small>Across ${detail.habits.length} private habits</small></header><div>${dailyTotals.map(item => `<span data-daily-fill="${Math.round((item.complete / detail.habits.length) * 100)}"><b>${item.day}</b><i><em></em></i><strong>${item.complete}/${detail.habits.length}</strong></span>`).join('')}</div></div>
      </section>
      <header class="habit-list-heading"><div><span>HABIT DETAIL</span><strong>What happened each day</strong></div><small>Tap-free demo record · fictional data</small></header>
      ${detail.habits.map(habit => `
      <article class="habit-tracker-row"><header><div><span>PRIVATE HABIT</span><h3>${escapeHtml(habit.name)}</h3></div><strong>${escapeHtml(habit.current)}</strong></header>
      <div class="habit-week" aria-label="${escapeHtml(habit.name)} weekly completion">${habit.days.map((complete, index) => `<span class="${complete ? 'is-complete' : ''}" aria-label="${days[index]} ${complete ? 'complete' : 'open'}"><b>${days[index]}</b><i aria-hidden="true">${complete ? '✓' : ''}</i></span>`).join('')}</div>
      <footer><span>${escapeHtml(habit.target)} target</span><span>${escapeHtml(habit.best)}</span><strong>${escapeHtml(habit.note)}</strong></footer></article>`).join('')}
      <section class="habit-insights" aria-label="Habit interpretation"><article><small>STRONGEST PATTERN</small><strong>Morning reset is carrying the week</strong><p>Six completed days make this the most stable routine in the current record.</p></article><article><small>WATCH</small><strong>Evening movement has two open windows</strong><p>Saturday and Sunday remain available, with no need to overload either day.</p></article><article><small>NEXT USEFUL CHECK-IN</small><strong>Review after the weekend</strong><p>Keep, reduce, or reschedule the target using what actually happened.</p></article></section>
      <p class="workspace-boundary-note"><strong>Sharing rule:</strong> a Personal habit remains private unless the user approves a specific result, plan, or time for another Space.</p></div>`;
  }

  function renderFamilyCalendar(detail) {
    return `<div class="family-calendar" aria-label="Fictional approved family calendar">${detail.days.map(day => `
      <article class="family-calendar-day"><header><span>${escapeHtml(day.day)}</span><strong>${escapeHtml(day.date)}</strong></header><ol>${day.events.map(event => `
        <li class="${event.kind === 'Availability only' ? 'is-private-block' : ''}"><time>${escapeHtml(event.time)}</time><div><strong>${escapeHtml(event.title)}</strong><small>${escapeHtml(event.owner)}</small></div><span>${escapeHtml(event.kind)}</span></li>`).join('')}</ol></article>`).join('')}
      <p class="workspace-boundary-note"><strong>Calendar boundary:</strong> private titles, notes, attendees, and locations stay hidden. The Family Space can use an approved event or a simple busy block for coordination.</p></div>`;
  }

  function renderHouseholdBoard(detail) {
    return `<div class="household-board" aria-label="Fictional family chore board">${detail.columns.map(column => `
      <section class="household-column" data-board-tone="${escapeHtml(column.tone)}"><header><span aria-hidden="true"></span><h3>${escapeHtml(column.title)}</h3><small>${column.items.length}</small></header>
      <div>${column.items.map(item => `<article><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.owner)}</p><small>${escapeHtml(item.due)}</small></article>`).join('')}</div></section>`).join('')}</div>`;
  }

  function renderShoppingList(detail) {
    return `<div class="shopping-groups" aria-label="Fictional shared family shopping list">${detail.groups.map(group => `
      <section><header><h3>${escapeHtml(group.title)}</h3><span>${group.items.filter(item => item.checked).length}/${group.items.length}</span></header><ul>${group.items.map(item => `
        <li class="${item.checked ? 'is-checked' : ''}"><span class="shopping-check" aria-hidden="true">${item.checked ? '✓' : ''}</span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.owner)}</small></li>`).join('')}</ul></section>`).join('')}</div>`;
  }

  function renderDecisionTimeline(detail) {
    return `<div class="decision-timeline" aria-label="Briefing sequence">${detail.cards.map((card, index) => `
      <article><div class="decision-step"><span>${String(index + 1).padStart(2, '0')}</span><i aria-hidden="true"></i></div><div><small>${escapeHtml(card.label)}</small><strong>${escapeHtml(card.title)}</strong><p>${escapeHtml(card.detail)}</p></div></article>`).join('')}</div>`;
  }

  function renderStatusBoard(detail) {
    const tones = ['active', 'waiting', 'context'];
    return `<div class="compact-status-board" aria-label="Current briefing status">${detail.cards.map((card, index) => `
      <article data-status-tone="${tones[index % tones.length]}"><header><span><i aria-hidden="true"></i>${escapeHtml(card.label)}</span><b>${index === 0 ? 'Now' : index === 1 ? 'Watch' : 'Context'}</b></header><strong>${escapeHtml(card.title)}</strong><p>${escapeHtml(card.detail)}</p><div class="status-board-rail" aria-hidden="true"><i></i></div></article>`).join('')}</div>`;
  }

  function renderMetricBars(detail) {
    const values = [78, 56, 68];
    return `<div class="brief-metric-bars" aria-label="Illustrative briefing measures"><header><span>Current pattern</span><small>FICTIONAL DEMO VIEW</small></header><div>${detail.cards.map((card, index) => `
      <article><div><span>${escapeHtml(card.label)}</span><strong>${escapeHtml(card.title)}</strong></div><b>${values[index % values.length]}<small>/100</small></b><div class="brief-metric-track" role="img" aria-label="${escapeHtml(card.label)} illustrative level ${values[index % values.length]} out of 100"><i></i></div><p>${escapeHtml(card.detail)}</p></article>`).join('')}</div></div>`;
  }

  function renderReadinessDial(detail) {
    return `<div class="readiness-panel"><section class="readiness-score"><div class="readiness-dial" role="img" aria-label="Illustrative readiness 72 out of 100"><span><strong>72</strong><small>READY</small></span></div><div><small>ADAPTIVE VIEW</small><strong>Keep the plan useful</strong><p>Readiness changes the size of the next step while the goal stays visible.</p></div></section><div class="readiness-factors">${detail.cards.map(card => `<article><span><i aria-hidden="true"></i></span><div><small>${escapeHtml(card.label)}</small><strong>${escapeHtml(card.title)}</strong><p>${escapeHtml(card.detail)}</p></div></article>`).join('')}</div></div>`;
  }

  function renderConnectionMap(detail) {
    return `<div class="brief-connection-map" aria-label="Scoped connection map"><div class="connection-hub"><span>SPACE</span><strong>Approved context</strong><small>Purpose scoped</small></div><div class="connection-spokes">${detail.cards.map((card, index) => `<article data-connection-index="${index + 1}"><i aria-hidden="true"></i><div><small>${escapeHtml(card.label)}</small><strong>${escapeHtml(card.title)}</strong><p>${escapeHtml(card.detail)}</p></div></article>`).join('')}</div><p class="connection-boundary"><i aria-hidden="true"></i>Each connection contributes only the approved records needed for this view.</p></div>`;
  }

  function renderSharedOrbit(detail) {
    const first = detail.cards[0];
    const second = detail.cards[1];
    const shared = detail.cards[2];
    return `<div class="shared-orbit-view" aria-label="Private and shared context"><div class="shared-orbit-diagram"><article class="orbit-person orbit-person-a"><small>${escapeHtml(first.label)}</small><strong>${escapeHtml(first.title)}</strong></article><div class="orbit-shared"><span>SHARED</span><strong>${escapeHtml(shared.title)}</strong><small>Approved by both</small></div><article class="orbit-person orbit-person-b"><small>${escapeHtml(second.label)}</small><strong>${escapeHtml(second.title)}</strong></article></div><div class="shared-orbit-notes">${detail.cards.map(card => `<article><small>${escapeHtml(card.label)}</small><strong>${escapeHtml(card.title)}</strong><p>${escapeHtml(card.detail)}</p></article>`).join('')}</div></div>`;
  }

  function renderProgressTrend(detail) {
    return `<div class="progress-trend-panel"><header><div><span>RECENT EVIDENCE</span><strong>Direction across six check-ins</strong></div><small>FICTIONAL TREND</small></header><div class="trend-chart" role="img" aria-label="Illustrative upward trend across six check-ins"><div class="trend-grid" aria-hidden="true"><i></i><i></i><i></i></div><svg viewBox="0 0 600 180" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="briefTrendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".25"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></linearGradient></defs><path class="trend-area" d="M0 145 L100 128 L200 105 L300 114 L400 78 L500 53 L600 34 L600 180 L0 180 Z"/><polyline points="0,145 100,128 200,105 300,114 400,78 500,53 600,34"/><g><circle cx="0" cy="145" r="5"/><circle cx="100" cy="128" r="5"/><circle cx="200" cy="105" r="5"/><circle cx="300" cy="114" r="5"/><circle cx="400" cy="78" r="5"/><circle cx="500" cy="53" r="5"/><circle cx="600" cy="34" r="5"/></g></svg><footer><span>Six check-ins ago</span><span>Now</span></footer></div><div class="trend-evidence">${detail.cards.map(card => `<article><small>${escapeHtml(card.label)}</small><strong>${escapeHtml(card.title)}</strong><p>${escapeHtml(card.detail)}</p></article>`).join('')}</div></div>`;
  }

  function renderHandoffFlow(detail) {
    return `<div class="handoff-visual" aria-label="Decision and ownership flow">${detail.cards.map((card, index) => `<article><div class="handoff-marker"><span>${index + 1}</span>${index < detail.cards.length - 1 ? '<i aria-hidden="true">→</i>' : ''}</div><small>${escapeHtml(card.label)}</small><strong>${escapeHtml(card.title)}</strong><p>${escapeHtml(card.detail)}</p><b>${index === 0 ? 'Prepared' : index === 1 ? 'Review' : 'Confirm'}</b></article>`).join('')}</div>`;
  }

  function renderGuidedSteps(detail) {
    return `<ol class="guided-brief-steps">${detail.cards.map((card, index) => `<li><span aria-hidden="true">${index < 1 ? '✓' : String(index + 1).padStart(2, '0')}</span><div><small>${escapeHtml(card.label)}</small><strong>${escapeHtml(card.title)}</strong><p>${escapeHtml(card.detail)}</p></div><i aria-hidden="true">${index < 1 ? 'Complete' : index === 1 ? 'Next' : 'Protected'}</i></li>`).join('')}</ol>`;
  }

  function renderPartnerOperations(detail) {
    return `
      <div class="partner-operations">
        <div class="partner-lanes">
          ${detail.partners.map(partner => `
            <article class="partner-lane" data-partner-tone="${safeTone(partner.tone)}">
              <header><span>${escapeHtml(partner.role)}</span><strong>${escapeHtml(partner.localTime)}</strong></header>
              <h3>${escapeHtml(partner.name)}</h3>
              <p class="partner-place">${escapeHtml(partner.place)}</p>
              <dl>
                <div><dt>Focus</dt><dd>${escapeHtml(partner.focus)}</dd></div>
                <div><dt>Shared concern</dt><dd>${escapeHtml(partner.concern)}</dd></div>
              </dl>
            </article>
          `).join('')}
        </div>
        <section class="shared-window-card">
          <span>SHARED DECISION WINDOW</span>
          <strong>${escapeHtml(detail.sharedWindow)}</strong>
          <div class="shared-window-line" aria-hidden="true"><i></i><b></b><i></i></div>
          <small>New York 4:00-6:00 PM · Sydney 6:00-8:00 AM</small>
        </section>
        <article class="operations-concern" data-partner-tone="${safeTone(detail.operations.tone)}">
          <span>${escapeHtml(detail.operations.label)}</span>
          <div><strong>${escapeHtml(detail.operations.title)}</strong><p>${escapeHtml(detail.operations.detail)}</p></div>
        </article>
        <div class="connection-row" aria-label="Approved business sources">
          ${detail.connections.map(item => `<span>${escapeHtml(item)}</span>`).join('')}
        </div>
      </div>`;
  }

  function renderProjectDashboard(detail) {
    const progress = detail.projects.map(project => clampProgress(project.progress));
    const average = Math.round(progress.reduce((sum, value) => sum + value, 0) / Math.max(progress.length, 1));
    const owned = detail.projects.filter(project => project.owner && project.owner !== 'Unassigned').length;
    const blocked = detail.projects.filter(project => String(project.status).toLowerCase() === 'blocked').length;
    return `
      <div class="project-dashboard" aria-label="Fictional project progress">
        <section class="project-command-view">
          <div class="project-health-visual">
            <div class="project-health-ring" data-project-health="${average}" role="img" aria-label="${average}% overall project health">
              <span><strong>${average}%</strong><small>HEALTH</small></span>
            </div>
            <div><span>RELEASE PULSE</span><strong>${blocked ? 'One handoff is holding the release' : 'Release path is clear'}</strong><p>${owned} of ${detail.projects.length} workstreams have a named owner. The next review should resolve the receiver before more work enters the queue.</p></div>
          </div>
          <div class="project-burndown">
            <header><div><span>OPEN WORK</span><strong>Release trajectory</strong></div><small>Fictional · 6 days</small></header>
            <svg viewBox="0 0 520 150" role="img" aria-label="Open work trending down toward release">
              <defs><linearGradient id="projectBurndownFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#168cff" stop-opacity=".36"/><stop offset="1" stop-color="#8f6cff" stop-opacity=".02"/></linearGradient></defs>
              <path class="project-grid-line" d="M20 35H500M20 75H500M20 115H500"/>
              <path class="project-area" d="M20 28 C90 30 105 51 180 55 S285 76 340 82 S430 105 500 116 L500 135 L20 135 Z"/>
              <path class="project-line" d="M20 28 C90 30 105 51 180 55 S285 76 340 82 S430 105 500 116"/>
              <g><circle cx="20" cy="28" r="5"/><circle cx="180" cy="55" r="5"/><circle cx="340" cy="82" r="5"/><circle cx="500" cy="116" r="7"/></g>
            </svg>
            <div class="project-chart-labels"><span>MON · 14</span><span>WED · 9</span><span>FRI · 5</span><strong>TODAY · 3</strong></div>
          </div>
        </section>
        <div class="project-signal-strip" aria-label="Project signals">
          <span><small>OWNERSHIP</small><strong>${owned}/${detail.projects.length}</strong><em>One receiver missing</em></span>
          <span><small>BLOCKERS</small><strong>${blocked}</strong><em>QA to release</em></span>
          <span><small>REVIEW</small><strong>3:00</strong><em>Decision window</em></span>
          <span><small>RELEASE</small><strong>Today</strong><em>Approval pending</em></span>
        </div>
        <div class="project-dashboard-heading"><span>WORKSTREAM</span><span>TEAM</span><span>PROGRESS</span><span>NEXT</span></div>
        ${detail.projects.map(project => `
          <article class="project-row" data-project-tone="${safeTone(project.tone)}">
            <div class="project-name"><span>${escapeHtml(project.status)}</span><strong>${escapeHtml(project.name)}</strong></div>
            <div class="project-team"><span>${escapeHtml(project.team)}</span><small>${escapeHtml(project.owner)}</small></div>
            <div class="project-progress"><progress value="${clampProgress(project.progress)}" max="100">${clampProgress(project.progress)}%</progress><strong>${clampProgress(project.progress)}%</strong></div>
            <p>${escapeHtml(project.next)}</p>
          </article>
        `).join('')}
      </div>`;
  }

  function renderDealPipeline(detail) {
    return `
      <div class="deal-pipeline" aria-label="Fictional business deal pipeline">
        ${detail.stages.map(stage => `
          <section class="deal-stage">
            <header><div><span>${escapeHtml(stage.name)}</span><strong>${escapeHtml(stage.value)}</strong></div><small>${stage.deals.length}</small></header>
            <div>${stage.deals.map(deal => `
              <article data-partner-tone="${safeTone(deal.tone)}">
                <div><strong>${escapeHtml(deal.name)}</strong><span>${escapeHtml(deal.value)}</span></div>
                <p>${escapeHtml(deal.owner)}</p>
                <small>${escapeHtml(deal.next)}</small>
              </article>
            `).join('')}</div>
          </section>
        `).join('')}
        <p class="workspace-boundary-note"><strong>Forecast rule:</strong> deal value supports planning after its stage and next evidence are visible. Collected cash remains a separate record.</p>
      </div>`;
  }

  function renderPartnerCalendar(detail) {
    return `
      <div class="partner-calendar">
        <div class="timezone-pair" aria-label="Partner local times">
          ${detail.timezones.map(zone => `
            <article data-partner-tone="${safeTone(zone.tone)}"><span>${escapeHtml(zone.name)} · ${escapeHtml(zone.place)}</span><strong>${escapeHtml(zone.time)}</strong></article>
          `).join('')}
        </div>
        <div class="partner-calendar-days">
          ${detail.days.map(day => `
            <article class="partner-calendar-day" data-highlighted="${day.highlighted === true}">
              <header>
                <div><span>${escapeHtml(day.day)}</span><strong>${escapeHtml(day.date)}</strong></div>
                ${day.label ? `<small>${escapeHtml(day.label)}</small>` : ''}
              </header>
              ${day.weather ? `<p class="calendar-weather">${escapeHtml(day.weather)}</p>` : ''}
              <ol>${day.events.map(event => `
                <li data-partner-tone="${safeTone(event.tone)}">
                  <time>${escapeHtml(event.time)}</time>
                  <div><strong>${escapeHtml(event.title)}</strong><small>${escapeHtml(event.owner)}</small></div>
                  ${event.change ? `<span>${escapeHtml(event.change)}</span>` : ''}
                </li>
              `).join('')}</ol>
            </article>
          `).join('')}
        </div>
        <div class="calendar-action-card">
          <div><span>PREPARED ACTION</span><strong>Protect Tuesday without changing a calendar yet</strong><p>Spaces can prepare the affected meetings and wait for both partners to review the draft.</p></div>
          <button class="primary-button" type="button" data-demo-module-action data-action-result="${escapeHtml(detail.action.result)}" aria-pressed="false">${escapeHtml(detail.action.label)}</button>
        </div>
        <p class="module-action-status" data-module-action-status aria-live="polite">No calendar changes have been sent.</p>
      </div>`;
  }

  function renderPartnerConcerns(detail) {
    return `
      <div class="partner-concerns">
        <div class="concern-grid">
          ${detail.concerns.map(concern => `
            <article data-partner-tone="${safeTone(concern.tone)}">
              <header><span>${escapeHtml(concern.label)}</span><strong>${escapeHtml(concern.owner)}</strong></header>
              <h3>${escapeHtml(concern.title)}</h3>
              <p>${escapeHtml(concern.detail)}</p>
              <small>${escapeHtml(concern.next)}</small>
            </article>
          `).join('')}
        </div>
        <aside class="shared-decision"><span>AGREED OPERATING POSITION</span><strong>${escapeHtml(detail.decision)}</strong></aside>
        <p class="workspace-boundary-note"><strong>Concern boundary:</strong> each partner chooses what enters the shared Brief. Private preparation and unrelated personal context remain in the partner’s private profile.</p>
      </div>`;
  }

  function renderFinancialOverview(detail) {
    return `
      <div class="financial-overview">
        <div class="finance-people">
          ${detail.people.map(person => `
            <article data-finance-tone="${safeTone(person.tone)}"><span>${escapeHtml(person.role)}</span><strong>${escapeHtml(person.name)}</strong><p>${escapeHtml(person.focus)}</p></article>
          `).join('')}
        </div>
        <blockquote class="advisor-quote">
          <span>RECENT ACCOUNTANT NOTE</span>
          <p>“${escapeHtml(detail.quote.text)}”</p>
          <footer><strong>${escapeHtml(detail.quote.by)}</strong><small>${escapeHtml(detail.quote.when)}</small></footer>
        </blockquote>
        <div class="money-pulse" aria-label="Fictional monthly money summary">
          ${detail.money.map(item => `<article><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong><small>${escapeHtml(item.note)}</small></article>`).join('')}
        </div>
      </div>`;
  }

  function renderSpreadsheet(detail) {
    return `
      <div class="financial-sheet-shell">
        <div class="financial-sheet-toolbar"><span>AUGUST PLAN</span><div><i></i><small>Shared review sheet</small><b>Swipe columns <span aria-hidden="true">→</span></b></div></div>
        <p class="financial-sheet-caption">${escapeHtml(detail.caption)}</p>
        <div class="financial-sheet-scroll" role="region" aria-label="Scrollable fictional monthly cash plan" tabindex="0">
          <table class="financial-sheet">
            <caption>${escapeHtml(detail.caption)}</caption>
            <colgroup><col class="sheet-category-column"><col class="sheet-money-column"><col class="sheet-money-column"><col class="sheet-money-column"><col class="sheet-status-column"></colgroup>
            <thead><tr>${detail.columns.map(column => `<th scope="col">${escapeHtml(column)}</th>`).join('')}</tr></thead>
            <tbody>
              ${detail.rows.map(row => `
                <tr data-finance-status="${safeTone(row.tone)}">
                  <th scope="row">${escapeHtml(row.category)}</th>
                  <td>${escapeHtml(row.planned)}</td>
                  <td>${escapeHtml(row.actual)}</td>
                  <td>${escapeHtml(row.remaining)}</td>
                  <td><span>${escapeHtml(row.status)}</span></td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot><tr><th scope="row">${escapeHtml(detail.total.category)}</th><td>${escapeHtml(detail.total.planned)}</td><td>${escapeHtml(detail.total.actual)}</td><td>${escapeHtml(detail.total.remaining)}</td><td>${escapeHtml(detail.total.status)}</td></tr></tfoot>
          </table>
        </div>
        <p class="sheet-scroll-note">Swipe or scroll sideways to review every column on a small screen.</p>
      </div>`;
  }

  function sparkline(values) {
    const width = 180;
    const height = 54;
    const safeValues = values.map(Number).filter(Number.isFinite);
    const min = Math.min(...safeValues);
    const max = Math.max(...safeValues);
    const range = Math.max(1, max - min);
    const points = safeValues.map((value, index) => {
      const x = safeValues.length === 1 ? width / 2 : (index / (safeValues.length - 1)) * width;
      const y = height - 4 - ((value - min) / range) * (height - 8);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
    return `<svg class="asset-sparkline" viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false"><polygon points="0,${height} ${points} ${width},${height}" vector-effect="non-scaling-stroke"></polygon><polyline points="${points}" fill="none" vector-effect="non-scaling-stroke"></polyline><circle cx="${width}" cy="${points.split(' ').at(-1).split(',')[1]}" r="3.5"></circle></svg>`;
  }

  function renderPortfolio(detail) {
    const ticker = detail.ticker.map(item => `
      <span data-market-tone="${safeTone(item.tone)}"><strong>${escapeHtml(item.symbol)}</strong><b>${escapeHtml(item.value)}</b><small>${escapeHtml(item.change)}</small></span>
    `).join('');

    return `
      <div class="portfolio-dashboard">
        <div class="market-rail" aria-label="Illustrative delayed market figures">
          <div class="market-track">${ticker}<span aria-hidden="true" class="market-repeat">${ticker}</span></div>
        </div>
        <p class="market-caption">SAMPLE DELAYED MARKET RAIL · INTERFACE DEMONSTRATION</p>
        <section class="portfolio-command" aria-label="Fictional portfolio overview">
          <div class="portfolio-performance">
            <header><div><span>INVESTED ASSETS</span><strong>$48,620</strong><small><b>+$1,284</b> this quarter · fictional</small></div><div class="portfolio-range"><b>1M</b><b class="is-active">3M</b><b>1Y</b></div></header>
            <div class="portfolio-chart">
              <div class="portfolio-axis" aria-hidden="true"><i></i><i></i><i></i></div>
              <svg viewBox="0 0 620 220" role="img" aria-label="Illustrative three month portfolio performance compared with a benchmark">
                <defs><linearGradient id="portfolioAreaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#168cff" stop-opacity=".38"/><stop offset="1" stop-color="#168cff" stop-opacity=".02"/></linearGradient></defs>
                <path class="portfolio-area" d="M15 166 C70 158 92 170 140 143 S220 135 264 109 S348 118 390 84 S470 78 515 53 S572 54 605 30 L605 205 L15 205 Z"/>
                <path class="portfolio-benchmark" d="M15 172 C92 166 135 151 205 146 S310 122 370 113 S482 90 605 72"/>
                <path class="portfolio-main-line" d="M15 166 C70 158 92 170 140 143 S220 135 264 109 S348 118 390 84 S470 78 515 53 S572 54 605 30"/>
                <circle cx="605" cy="30" r="7"/>
              </svg>
              <div class="portfolio-chart-labels"><span>MAY</span><span>JUN</span><span>JUL</span><strong>AUG 8</strong></div>
            </div>
            <footer><span><i class="portfolio-key-main"></i>Portfolio <strong>+2.7%</strong></span><span><i class="portfolio-key-benchmark"></i>Reference mix <strong>+2.2%</strong></span><small>Delayed example</small></footer>
          </div>
          <aside class="portfolio-allocation">
            <header><span>ALLOCATION</span><strong>Inside plan range</strong></header>
            <div class="allocation-donut" role="img" aria-label="58% US market, 20% international, 15% bonds, and 7% investment cash"><span><strong>93%</strong><small>INVESTED</small></span></div>
            <div class="allocation-legend">
              ${detail.assets.map(asset => `<span data-asset-tone="${safeTone(asset.tone)}"><i></i><b>${escapeHtml(asset.symbol)}</b><small>${escapeHtml(asset.share)}%</small></span>`).join('')}
            </div>
            <p><strong>$216 remains</strong> in this month’s contribution plan after the tax reserve is funded.</p>
          </aside>
        </section>
        <div class="asset-grid">
          ${detail.assets.map(asset => `
            <article data-asset-tone="${safeTone(asset.tone)}">
              <header><div><span>${escapeHtml(asset.symbol)}</span><h3>${escapeHtml(asset.name)}</h3></div><strong>${escapeHtml(asset.value)}</strong></header>
              ${sparkline(asset.points)}
              <div class="asset-allocation"><span>${escapeHtml(asset.share)}% allocation</span><small>${escapeHtml(asset.change)}</small></div>
              <meter min="0" max="100" value="${clampProgress(asset.share)}">${clampProgress(asset.share)}%</meter>
            </article>
          `).join('')}
        </div>
        <p class="workspace-boundary-note"><strong>Market boundary:</strong> ${escapeHtml(detail.note)}</p>
      </div>`;
  }

  function renderDeadlineLedger(detail) {
    return `
      <div class="deadline-ledger">
        <ol>
          ${detail.deadlines.map(item => `
            <li data-deadline-tone="${safeTone(item.tone)}">
              <time>${escapeHtml(item.date)}</time>
              <div><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.owner)}</small></div>
              <div class="deadline-amount"><strong>${escapeHtml(item.amount)}</strong><span>${escapeHtml(item.status)}</span></div>
            </li>
          `).join('')}
        </ol>
        <p class="workspace-boundary-note"><strong>Professional boundary:</strong> ${escapeHtml(detail.boundary)}</p>
      </div>`;
  }

  function renderFinancialRules(detail) {
    return `
      <div class="financial-rules">
        <div class="goal-stack">
          ${detail.goals.map(goal => `
            <article data-finance-tone="${safeTone(goal.tone)}">
              <header><strong>${escapeHtml(goal.name)}</strong><span>${clampProgress(goal.progress)}%</span></header>
              <progress value="${clampProgress(goal.progress)}" max="100">${clampProgress(goal.progress)}%</progress>
              <footer><span>${escapeHtml(goal.current)}</span><small>Goal ${escapeHtml(goal.target)}</small></footer>
            </article>
          `).join('')}
        </div>
        <section class="rule-list">
          <header><span>USER-APPROVED RULES</span><strong>Rules guide the Brief and remain editable</strong></header>
          <ol>${detail.rules.map((rule, index) => `
            <li><span>${String(index + 1).padStart(2, '0')}</span><div><strong>${escapeHtml(rule.title)}</strong><p>${escapeHtml(rule.detail)}</p></div><small>${escapeHtml(rule.status)}</small></li>
          `).join('')}</ol>
        </section>
      </div>`;
  }

  const renderers = {
    'personal-day': renderPersonalDay,
    'family-command': renderFamilyCommand,
    'decision-timeline': renderDecisionTimeline,
    'status-board': renderStatusBoard,
    'metric-bars': renderMetricBars,
    'readiness-dial': renderReadinessDial,
    'connection-map': renderConnectionMap,
    'shared-orbit': renderSharedOrbit,
    'progress-trend': renderProgressTrend,
    'handoff-flow': renderHandoffFlow,
    'guided-steps': renderGuidedSteps,
    habits: renderHabitTracker,
    calendar: renderFamilyCalendar,
    board: renderHouseholdBoard,
    checklist: renderShoppingList,
    'partner-operations': renderPartnerOperations,
    'project-dashboard': renderProjectDashboard,
    'deal-pipeline': renderDealPipeline,
    'partner-calendar': renderPartnerCalendar,
    'partner-concerns': renderPartnerConcerns,
    'financial-overview': renderFinancialOverview,
    spreadsheet: renderSpreadsheet,
    portfolio: renderPortfolio,
    'deadline-ledger': renderDeadlineLedger,
    'financial-rules': renderFinancialRules
  };

  function renderDetail(detail) {
    const renderer = renderers[detail?.layout];
    return renderer ? renderer(detail) : '';
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-demo-module-action]');
    if (!button) return;
    const calendar = button.closest('.partner-calendar');
    const status = calendar?.querySelector('[data-module-action-status]');
    if (!calendar || !status) return;
    calendar.classList.add('has-prepared-action');
    button.setAttribute('aria-pressed', 'true');
    button.textContent = 'Tuesday draft prepared';
    status.textContent = button.dataset.actionResult || 'The draft is ready for review.';
    document.dispatchEvent(new CustomEvent('briefdemo:backendrequired', {
      detail: { message: 'Draft prepared in the demo. Sending calendar changes requires the secure backend and both partners’ approval.' }
    }));
  });

  window.BRIEF_DEMO_ADVANCED = { renderDetail };
})();
