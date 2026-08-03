(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  let initialized = false;
  let renderTimer = 0;

  function escapeHtml(value) {
    const node = document.createElement('div');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function teamData() {
    return window.BRIEF_SCENARIOS?.team || null;
  }

  function spotifyFrame(track) {
    if (!track?.spotify) return '';
    return `https://open.spotify.com/embed/track/${encodeURIComponent(track.spotify)}?utm_source=generator&theme=0`;
  }

  function roleCards(items) {
    return items.map((person, index) => `
      <button type="button" class="team-role-card ${index === 0 ? 'is-active' : ''}" data-team-role="${index}" aria-pressed="${index === 0}">
        <span>${escapeHtml(person.role)}</span>
        <strong>${escapeHtml(person.name)}</strong>
        <small>${escapeHtml(person.next)}</small>
      </button>`).join('');
  }

  function roleDetail(person) {
    return `
      <div><span>CAN SEE</span><p>${escapeHtml(person.sees)}</p></div>
      <div><span>STAYS RESTRICTED</span><p>${escapeHtml(person.private)}</p></div>
      <div><span>NEXT USEFUL ACTION</span><p>${escapeHtml(person.next)}</p></div>`;
  }

  function teamHtml(item) {
    const firstSong = item.songs?.[0];
    return `
      <div class="scenario-intro team-scenario-intro">
        <span class="source-label source-shared">TEAM + PROJECT SPACE DEMO</span>
        <p class="micro-label">${escapeHtml(item.kicker)}</p>
        <h2>${escapeHtml(item.title)}</h2>
        <p>${escapeHtml(item.summary)}</p>
      </div>

      <section class="team-space-map" aria-labelledby="teamSpacesTitle">
        <div class="scenario-subheading">
          <div><p class="micro-label">USERS, ROLES AND SPACES</p><h3 id="teamSpacesTitle">Shared work without flattening everyone into one account.</h3></div>
          <p>Visibility follows the person, role, project and approved purpose. A member can contribute to the shared outcome without seeing unrelated private records.</p>
        </div>
        <div class="team-space-grid">${item.spaces.map((space, index) => `
          <article><span>${String(index + 1).padStart(2, '0')}</span><h4>${escapeHtml(space.label)}</h4><p>${escapeHtml(space.text)}</p></article>`).join('')}</div>
      </section>

      <section class="team-role-console" aria-labelledby="teamRoleTitle">
        <div class="scenario-subheading">
          <div><p class="micro-label">MEMBER VIEW</p><h3 id="teamRoleTitle">Tap a person to see the same project through their role.</h3></div>
          <p>Leadership receives aggregate risk. Team members receive relevant work, dependencies, preparation and approved context.</p>
        </div>
        <div class="team-role-layout">
          <div class="team-role-list">${roleCards(item.members)}</div>
          <article id="teamRoleDetail" class="team-role-detail">${roleDetail(item.members[0])}</article>
        </div>
      </section>

      <section class="team-progress-panel" aria-labelledby="teamTimelineTitle">
        <div class="scenario-subheading">
          <div><p class="micro-label">PROJECT TIMELINE</p><h3 id="teamTimelineTitle">Moving information with a visible owner at every stage.</h3></div>
          <p>The line moves only as work changes. It never hides the current blocker behind an optimistic percentage.</p>
        </div>
        <ol class="team-progress-line">${item.timeline.map((step, index) => `
          <li class="is-${escapeHtml(step.state.toLowerCase().replaceAll(' ', '-'))}">
            <span>${String(index + 1).padStart(2, '0')}</span><div><strong>${escapeHtml(step.phase)}</strong><small>${escapeHtml(step.state)} · ${escapeHtml(step.owner)}</small><p>${escapeHtml(step.detail)}</p></div>
          </li>`).join('')}</ol>
      </section>

      <div class="team-operating-grid">
        <section class="team-handoff-board">
          <p class="micro-label">HANDOFFS</p><h3>Nothing important disappears between roles.</h3>
          ${item.handoffs.map(row => `<article><span>${escapeHtml(row.from)} → ${escapeHtml(row.to)}</span><strong>${escapeHtml(row.item)}</strong><small>${escapeHtml(row.status)}</small></article>`).join('')}
        </section>
        <section class="team-procedure-board">
          <p class="micro-label">PROCEDURE READINESS</p><h3>Useful before a launch, operation, appointment or field procedure.</h3>
          ${item.procedure.map(row => `<article class="is-${escapeHtml(row.state.toLowerCase())}"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.state)}</strong><p>${escapeHtml(row.detail)}</p></article>`).join('')}
        </section>
      </div>

      <div class="team-operating-grid">
        <section class="team-finance-watch">
          <p class="micro-label">ROLE-AWARE FINANCE WATCH</p><h3>Enough financial context to make the right decision.</h3>
          <div>${item.finance.map(row => `<article><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.value)}</strong><small>${escapeHtml(row.note)}</small></article>`).join('')}</div>
          <p>Detailed payroll, personal compensation and unrelated accounts remain outside the general project space.</p>
        </section>
        <section class="team-security-boundary">
          <p class="micro-label">PLANNED SECURITY BOUNDARY</p><h3>Data access is part of the product, not an afterthought.</h3>
          <ul>${item.security.map(rule => `<li>${escapeHtml(rule)}</li>`).join('')}</ul>
          <small>Planned architecture: containerized FastAPI on Linux behind Cloudflare Access and Tunnel, with protected secrets and approval-gated actions.</small>
        </section>
      </div>

      <section class="scenario-music team-scenario-music">
        <div class="scenario-subheading"><div><p class="micro-label">TEAM SOUNDTRACK</p><h3>Focus, lift and release can stay optional.</h3></div><p>Provider playback requires a direct user action. Music never blocks the operating brief.</p></div>
        <div class="scenario-song-layout">
          <div class="scenario-song-list">${item.songs.map((song, index) => `
            <button type="button" class="scenario-song ${index === 0 ? 'is-active' : ''}" data-team-song="${index}"><span>${escapeHtml(song.note)}</span><strong>${escapeHtml(song.title)}</strong><small>${escapeHtml(song.artist)}</small></button>`).join('')}</div>
          <iframe class="scenario-spotify-frame" title="Team Spotify player" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" src="${spotifyFrame(firstSong)}"></iframe>
        </div>
      </section>`;
  }

  function patchSelector() {
    const button = $('[data-scenario-choice="team"]');
    const note = $('small', button);
    if (note) note.textContent = 'Members + roles + project spaces';
  }

  function bindTeamInteractions(item, stage) {
    $$('[data-team-role]', stage).forEach(button => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.teamRole);
        $$('[data-team-role]', stage).forEach(card => {
          const active = card === button;
          card.classList.toggle('is-active', active);
          card.setAttribute('aria-pressed', String(active));
        });
        const detail = $('#teamRoleDetail', stage);
        if (detail && item.members[index]) detail.innerHTML = roleDetail(item.members[index]);
      });
    });

    const frame = $('.team-scenario-music .scenario-spotify-frame', stage);
    $$('[data-team-song]', stage).forEach(button => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.teamSong);
        const track = item.songs[index];
        if (!track || !frame) return;
        $$('[data-team-song]', stage).forEach(card => card.classList.toggle('is-active', card === button));
        frame.src = spotifyFrame(track);
      });
    });
  }

  function render() {
    if (window.BRIEF_APP?.getPreset?.() !== 'team') {
      patchSelector();
      return;
    }
    const item = teamData();
    const stage = $('#scenarioStage');
    if (!item || !stage) return;
    stage.innerHTML = teamHtml(item);
    bindTeamInteractions(item, stage);
    patchSelector();
  }

  function scheduleRender() {
    window.clearTimeout(renderTimer);
    renderTimer = window.setTimeout(render, 180);
  }

  function init() {
    if (initialized || !window.BRIEF_APP) return;
    initialized = true;
    scheduleRender();
    window.addEventListener('brief:preset-change', scheduleRender);
    window.addEventListener('brief:device-fallback-open', scheduleRender);
    [350, 800].forEach(delay => window.setTimeout(patchSelector, delay));
  }

  window.addEventListener('brief:ready', init, { once: true });
  if (window.BRIEF_APP) init();
  else document.addEventListener('DOMContentLoaded', () => window.setTimeout(init, 900), { once: true });
})();
