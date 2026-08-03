(() => {
  'use strict';

  const content = window.BRIEF_DAILY_CONTENT;
  if (!content) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let initialized = false;

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function spotifyFrame(trackId, title) {
    return `<iframe class="daily-spotify-frame" title="Play ${escapeHtml(title)} on Spotify" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" src="https://open.spotify.com/embed/track/${encodeURIComponent(trackId)}?utm_source=generator&theme=0"></iframe>`;
  }

  function applyEntryDefaults() {
    const music = $('#musicOnEntry');
    const voice = $('#readOnEntry');
    if (music) {
      music.checked = Boolean(content.entryDefaults.music);
      const copy = music.closest('.option-row')?.querySelector('small');
      if (copy) copy.textContent = 'Optional. Start it manually or check this box before opening.';
    }
    if (voice) voice.checked = Boolean(content.entryDefaults.narration);
  }

  function renderPersonalCommandCenter() {
    if ($('#personalCommandCenter')) return;
    const anchor = $('#livePublicLayer') || $('#scenarioExplorer');
    if (!anchor) return;
    const d = content.personalDashboard;
    const section = document.createElement('section');
    section.id = 'personalCommandCenter';
    section.className = 'brief-section personal-command-center';
    section.innerHTML = `
      <div class="section-heading">
        <div><p class="micro-label">PERSONAL COMMAND CENTER · FICTIONAL PRIVATE DATA</p><h2>${escapeHtml(d.headline)}</h2></div>
        <p>${escapeHtml(d.summary)}</p>
      </div>
      <div class="personal-scorecards">${d.scorecards.map(card => `
        <article class="personal-scorecard tone-${escapeHtml(card.tone)}"><span>${escapeHtml(card.label)}</span><strong>${escapeHtml(card.value)}</strong><small>${escapeHtml(card.detail)}</small></article>`).join('')}</div>
      <div class="personal-report-layout">
        <section class="sheet-panel">
          <div class="sheet-panel-head"><div><p class="micro-label">DAILY REPORT</p><h3>Everything important in one working table</h3></div><span>FICTIONAL EXAMPLE</span></div>
          <div class="sheet-wrap"><table><thead><tr><th>Area</th><th>Status</th><th>Owner</th><th>Next action</th><th>Due</th><th>Confidence</th></tr></thead><tbody>${d.reportRows.map(row => `
            <tr><td>${escapeHtml(row.area)}</td><td><span class="sheet-status">${escapeHtml(row.status)}</span></td><td>${escapeHtml(row.owner)}</td><td>${escapeHtml(row.next)}</td><td>${escapeHtml(row.due)}</td><td><div class="confidence-meter"><i style="width:${Number(row.confidence)}%"></i><span>${Number(row.confidence)}%</span></div></td></tr>`).join('')}</tbody></table></div>
        </section>
        <aside class="personal-side-stack">
          <section class="fake-inbox-panel"><p class="micro-label">FICTIONAL INBOX TRIAGE</p><h3>Why these messages surfaced</h3>${d.fakeInbox.map(item => `<article><div><strong>${escapeHtml(item.sender)}</strong><span>${escapeHtml(item.state)}</span></div><h4>${escapeHtml(item.subject)}</h4><p>${escapeHtml(item.reason)}</p></article>`).join('')}</section>
          <section class="project-health-panel"><p class="micro-label">PROJECT HEALTH</p><h3>Progress, risk and the next move</h3>${d.projects.map(project => `<article><div><strong>${escapeHtml(project.name)}</strong><span>${escapeHtml(project.state)}</span></div><div class="project-health-bar"><i style="width:${Number(project.health)}%"></i></div><p>${escapeHtml(project.next)}</p></article>`).join('')}</section>
        </aside>
      </div>
      <section class="personal-media-shelf">
        <div class="scenario-subheading"><div><p class="micro-label">MORE MUSIC THROUGH THE DAY</p><h3>The opening track is only one moment.</h3></div><p>Each module can use a different song, playlist, podcast or lesson. Spotify controls remain on the page and require a direct user tap.</p></div>
        <div class="daily-media-grid">${content.music.personal.slice(1).map(track => `<article><span>${escapeHtml(track.note)}</span><h4>${escapeHtml(track.title)}</h4><p>${escapeHtml(track.artist)}</p>${spotifyFrame(track.spotify, `${track.title} by ${track.artist}`)}</article>`).join('')}</div>
      </section>`;
    anchor.insertAdjacentElement('afterend', section);
  }

  function renderFooterSwitcher() {
    if ($('#briefingFooterSwitcher')) return;
    const main = $('#briefMain');
    if (!main) return;
    const section = document.createElement('section');
    section.id = 'briefingFooterSwitcher';
    section.className = 'brief-section briefing-footer-switcher';
    section.innerHTML = `
      <div class="section-heading"><div><p class="micro-label">KEEP EXPLORING</p><h2>The same foundation can serve completely different relationships.</h2></div><p>Switching changes the people, permissions, modules, tone, data and actions while the private-profile and shared-space rules stay intact.</p></div>
      <div class="footer-view-grid">${content.footerViews.map(view => `<button type="button" data-footer-preset="${escapeHtml(view.id)}"><span>${escapeHtml(view.title)}</span><small>${escapeHtml(view.text)}</small><b>Open briefing →</b></button>`).join('')}</div>`;
    main.appendChild(section);
    $$('[data-footer-preset]', section).forEach(button => {
      button.addEventListener('click', () => {
        window.BRIEF_APP?.setPreset?.(button.dataset.footerPreset);
        $('#today')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  function addMaintenanceMarker() {
    document.documentElement.dataset.briefSchema = String(content.schemaVersion);
    document.documentElement.dataset.briefEdition = content.edition.date;
  }

  function init() {
    if (initialized || !window.BRIEF_APP) return;
    initialized = true;
    applyEntryDefaults();
    renderPersonalCommandCenter();
    renderFooterSwitcher();
    addMaintenanceMarker();
    const currentPreset = window.BRIEF_APP?.getPreset?.() || 'individual';
    window.BRIEF_APP?.setPreset?.(currentPreset);
    $('#personalCommandCenter')?.toggleAttribute('hidden', currentPreset !== 'individual');
    window.addEventListener('brief:preset-change', () => {
      const personal = window.BRIEF_APP?.getPreset?.() === 'individual';
      $('#personalCommandCenter')?.toggleAttribute('hidden', !personal);
      window.setTimeout(renderFooterSwitcher, 50);
    });
  }

  window.addEventListener('brief:ready', init, { once: true });
  if (window.BRIEF_APP) init();
  else document.addEventListener('DOMContentLoaded', () => window.setTimeout(init, 350), { once: true });
})();
