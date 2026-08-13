'use strict';

(() => {
  const data = window.VaultWorld;
  if (!data) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const STORAGE = 'vault_world_state_v1';
  let state = { trackId: data.tracks[0].id, votes: {}, queue: [], lastVisit: 0, poll: '', ownerNote: '' };

  function readState() {
    try { state = { ...state, ...JSON.parse(localStorage.getItem(STORAGE) || '{}') }; } catch { /* local demo state is optional */ }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE, JSON.stringify(state)); } catch { /* local demo state is optional */ }
  }

  function escapeHtml(value) {
    const node = document.createElement('span');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  }

  function spotifyEmbed(id) {
    return `https://open.spotify.com/embed/track/${encodeURIComponent(id)}?utm_source=generator&theme=0`;
  }

  function spotifyLink(id) {
    return `https://open.spotify.com/track/${encodeURIComponent(id)}`;
  }

  function currentTrack() {
    return data.tracks.find((track) => track.id === state.trackId) || data.tracks[0];
  }

  function renderTracks() {
    const host = $('#vaultTrackList');
    if (!host) return;
    host.innerHTML = data.tracks.map((track, index) => {
      const selected = track.id === state.trackId;
      const votes = track.votes + Number(state.votes[track.id] || 0);
      return `<article class="radio-track${selected ? ' selected' : ''}" style="--track:${track.accent}" data-track-id="${track.id}">
        <button class="track-select" type="button" data-select-track="${track.id}" aria-label="Select ${escapeHtml(track.title)}">
          <span class="track-number">${String(index + 1).padStart(2, '0')}</span>
          <span class="track-copy"><strong>${escapeHtml(track.title)}</strong><small>${escapeHtml(track.artist)} · ${escapeHtml(track.mood)}</small></span>
          <span class="track-state">${selected ? 'ON AIR' : 'PLAY'}</span>
        </button>
        <div class="track-actions"><button type="button" data-vote-track="${track.id}" aria-label="Vote for ${escapeHtml(track.title)}">▲ <span>${votes}</span></button><a href="${spotifyLink(track.id)}" target="_blank" rel="noopener noreferrer">Spotify ↗</a></div>
      </article>`;
    }).join('');
  }

  function selectTrack(id, announce = true) {
    if (!data.tracks.some((track) => track.id === id)) return;
    state.trackId = id;
    saveState();
    renderTracks();
    const track = currentTrack();
    const frame = $('#vaultSpotifyFrame');
    if (frame) frame.src = spotifyEmbed(track.id);
    $('#radioTrackTitle')?.replaceChildren(document.createTextNode(track.title));
    $('#radioTrackArtist')?.replaceChildren(document.createTextNode(track.artist));
    const miniTitle = $('#miniTrackTitle');
    const miniArtist = $('#miniTrackArtist');
    if (miniTitle) miniTitle.textContent = track.title;
    if (miniArtist) miniArtist.textContent = track.artist;
    const open = $('#miniSpotifyLink');
    if (open) open.href = spotifyLink(track.id);
    document.documentElement.style.setProperty('--radio-accent', track.accent);
    if (announce) window.dispatchEvent(new CustomEvent('vault:toast', { detail: `${track.title} is on Vault Radio.` }));
  }

  function voteTrack(id, button) {
    const active = Boolean(state.votes[id]);
    state.votes[id] = active ? 0 : 1;
    saveState();
    renderTracks();
    window.dispatchEvent(new CustomEvent('vault:toast', { detail: active ? 'Vote removed.' : 'Vote counted locally.' }));
  }

  function renderLore() {
    const lore = $('#vaultLoreList');
    if (lore) lore.innerHTML = data.lore.map((item, index) => `<button class="lore-card${index === 0 ? ' active' : ''}" type="button" data-lore-index="${index}"><span>${item.tag} · ${item.date}</span><strong>${item.title}</strong><small>${item.text}</small></button>`).join('');
    const archive = $('#briefArchiveList');
    if (archive) archive.innerHTML = data.archive.map((item) => `<article class="archive-entry"><span>${item.date}</span><div><strong>${item.title}</strong><p>${item.summary}</p></div><b>${item.mood}</b></article>`).join('');
  }

  function renderQueue() {
    const list = $('#radioQueueList');
    if (!list) return;
    list.innerHTML = state.queue.length ? state.queue.map((item, index) => `<li><span>${escapeHtml(item)}</span><button type="button" data-remove-queue="${index}" aria-label="Remove ${escapeHtml(item)}">×</button></li>`).join('') : '<li class="queue-empty">Drop a song name here. Suggestions stay on this device for the demo.</li>';
  }

  function openSearch() {
    const dialog = $('#vaultSearchDialog');
    if (dialog?.showModal) { dialog.showModal(); $('#vaultGlobalSearch')?.focus(); }
  }

  function search(query) {
    const q = query.trim().toLowerCase();
    const results = [];
    (window.VaultDirectory || []).forEach((member) => {
      if (`${member.name} ${member.role || ''} ${member.location || ''}`.toLowerCase().includes(q)) results.push({ type: 'Member', title: member.display || member.name, text: member.role || 'Room reserved', href: member.route || '#memberDirectory' });
    });
    data.tracks.forEach((track) => {
      if (`${track.title} ${track.artist} ${track.mood}`.toLowerCase().includes(q)) results.push({ type: 'Music', title: track.title, text: track.artist, track: track.id });
    });
    [...data.lore, ...data.archive].forEach((item) => {
      if (`${item.title} ${item.text || item.summary || ''}`.toLowerCase().includes(q)) results.push({ type: item.tag ? 'Lore' : 'Briefing', title: item.title, text: item.text || item.summary, href: item.tag ? '#vaultLore' : '#briefArchive' });
    });
    const host = $('#vaultSearchResults');
    if (!host) return;
    host.innerHTML = q ? (results.length ? results.slice(0, 12).map((item) => `<button type="button" data-search-href="${item.href || ''}" data-search-track="${item.track || ''}"><span>${item.type}</span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.text)}</small></button>`).join('') : '<p>No match yet. Try a member, song, lore item, or briefing.</p>') : '<p>Search members, songs, server lore, and briefing history.</p>';
  }

  function showReturnBrief() {
    const previous = Number(state.lastVisit || 0);
    state.lastVisit = Date.now();
    saveState();
    if (!previous || Date.now() - previous < 4 * 60 * 60 * 1000) return;
    const panel = $('#returnBrief');
    const list = $('#returnChangeList');
    if (panel && list) {
      list.innerHTML = data.changes.map((change) => `<li>${change}</li>`).join('');
      panel.classList.add('show');
    }
  }

  function bind() {
    document.addEventListener('click', (event) => {
      const select = event.target.closest('[data-select-track]');
      if (select) selectTrack(select.dataset.selectTrack);
      const vote = event.target.closest('[data-vote-track]');
      if (vote) voteTrack(vote.dataset.voteTrack, vote);
      const remove = event.target.closest('[data-remove-queue]');
      if (remove) { state.queue.splice(Number(remove.dataset.removeQueue), 1); saveState(); renderQueue(); }
      const lore = event.target.closest('[data-lore-index]');
      if (lore) $$('.lore-card').forEach((card) => card.classList.toggle('active', card === lore));
      const result = event.target.closest('[data-search-href], [data-search-track]');
      if (result) {
        $('#vaultSearchDialog')?.close();
        if (result.dataset.searchTrack) { selectTrack(result.dataset.searchTrack); $('#vaultRadio')?.scrollIntoView({ behavior: 'smooth' }); }
        else if (result.dataset.searchHref?.startsWith('/')) window.location.href = result.dataset.searchHref;
        else $(result.dataset.searchHref)?.scrollIntoView({ behavior: 'smooth' });
      }
    });
    $('#openVaultSearch')?.addEventListener('click', openSearch);
    $('#closeVaultSearch')?.addEventListener('click', () => $('#vaultSearchDialog')?.close());
    $('#vaultGlobalSearch')?.addEventListener('input', (event) => search(event.target.value));
    $('#radioExpand')?.addEventListener('click', () => document.body.classList.toggle('radio-expanded'));
    $('#returnBriefClose')?.addEventListener('click', () => $('#returnBrief')?.classList.remove('show'));
    $('#radioQueueForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = $('#radioQueueInput');
      const value = input?.value.trim();
      if (!value) return;
      state.queue.unshift(value); state.queue = state.queue.slice(0, 8); saveState(); input.value = ''; renderQueue();
      window.dispatchEvent(new CustomEvent('vault:toast', { detail: 'Song suggestion saved on this device.' }));
    });
    const notePreview = $('#ownerNotePreview');
    if (notePreview && state.ownerNote) notePreview.textContent = state.ownerNote;
    $('#ownerNoteForm')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = $('#ownerNoteInput');
      const value = input?.value.trim();
      if (!value) return;
      state.ownerNote = value; saveState(); notePreview.textContent = value; input.value = '';
      window.dispatchEvent(new CustomEvent('vault:toast', { detail: 'Server note pinned on this device.' }));
    });
    $$('[data-poll-choice]').forEach((button) => button.addEventListener('click', () => {
      state.poll = button.dataset.pollChoice; saveState();
      $$('[data-poll-choice]').forEach((choice) => choice.classList.toggle('selected', choice === button));
      $('#pollResult').textContent = `${button.textContent.trim()} has your vote.`;
    }));
    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); }
    });
  }

  readState();
  renderTracks();
  renderLore();
  renderQueue();
  selectTrack(state.trackId, false);
  search('');
  bind();
  showReturnBrief();
})();
