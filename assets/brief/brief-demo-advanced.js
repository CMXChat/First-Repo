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

  function renderHabitTracker(detail) {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    return `<div class="habit-tracker" aria-label="Fictional habit progress">${detail.habits.map(habit => `
      <article class="habit-tracker-row"><header><div><span>PRIVATE HABIT</span><h3>${escapeHtml(habit.name)}</h3></div><strong>${escapeHtml(habit.current)}</strong></header>
      <div class="habit-week" aria-label="${escapeHtml(habit.name)} weekly completion">${habit.days.map((complete, index) => `<span class="${complete ? 'is-complete' : ''}" aria-label="${days[index]} ${complete ? 'complete' : 'open'}"><b>${days[index]}</b><i aria-hidden="true">${complete ? '✓' : ''}</i></span>`).join('')}</div>
      <footer><span>${escapeHtml(habit.target)} target</span><span>${escapeHtml(habit.best)}</span><strong>${escapeHtml(habit.note)}</strong></footer></article>`).join('')}
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
    return `
      <div class="project-dashboard" aria-label="Fictional project progress">
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
    return `<svg class="asset-sparkline" viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false"><polyline points="${points}" fill="none" vector-effect="non-scaling-stroke"></polyline></svg>`;
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
