(() => {
  "use strict";

  const data = window.DEBBIE_BRIEF;
  if (!data) return;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const gate = $("#accessGate");
  const app = $("#app");
  const form = $("#gateForm");
  const passwordInput = $("#gatePassword");
  const gateStatus = $("#gateStatus");
  const unlockButton = $("#unlockButton");
  const audio = $("#dailyAudio");

  const SESSION_KEY = "debbie_brief_session_v1";
  const STATE_KEY = "debbie_gate_state_v1";
  const ITERATIONS = 600000;
  const SALT = "xujS9NXg3w7AqSivyd4CijBCwfddpjzmEISWYxNk5yg=";
  const VERIFIER = "5uPaIzkfHRnfBiWYyi78q8rXjqKZKhx/HAxn2AUnY+8=";

  function fromBase64(value) {
    const binary = atob(value);
    return Uint8Array.from(binary, char => char.charCodeAt(0));
  }
  function toBase64(bytes) {
    let binary = "";
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  }
  async function deriveVerifier(password) {
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: fromBase64(SALT), iterations: ITERATIONS }, key, 256);
    return toBase64(new Uint8Array(bits));
  }
  function safeState() {
    try { return JSON.parse(localStorage.getItem(STATE_KEY) || "{}") || {}; }
    catch { return {}; }
  }
  function saveState(state) { localStorage.setItem(STATE_KEY, JSON.stringify(state)); }
  function constantTimeEqual(a, b) {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
  }

  function primeAudio() {
    audio.muted = true;
    audio.volume = 0.28;
    const attempt = audio.play();
    if (attempt && typeof attempt.catch === "function") attempt.catch(() => {});
  }
  async function tryAudiblePlayback() {
    try {
      audio.muted = false;
      audio.volume = 0.28;
      await audio.play();
      updateMusicButtons();
      $("#autoplayNote").textContent = "Today's preview started after access was granted.";
    } catch {
      $("#autoplayNote").textContent = "Your browser blocked automatic sound. Tap Play preview.";
    }
  }
  function unlock() {
    sessionStorage.setItem(SESSION_KEY, "granted");
    document.body.classList.remove("locked");
    gate.classList.add("unlocked");
    app.classList.add("active");
    app.removeAttribute("inert");
    app.setAttribute("aria-hidden", "false");
    window.setTimeout(() => gate.hidden = true, 480);
    tryAudiblePlayback();
  }
  function relock() {
    sessionStorage.removeItem(SESSION_KEY);
    audio.pause();
    audio.currentTime = 0;
    window.location.reload();
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    primeAudio();
    const state = safeState();
    const remaining = Math.ceil((Number(state.lockedUntil || 0) - Date.now()) / 1000);
    if (remaining > 0) {
      audio.pause();
      gateStatus.className = "gate-status bad";
      gateStatus.textContent = `Too many attempts. Try again in ${remaining} seconds.`;
      return;
    }
    if (!passwordInput.value) {
      audio.pause();
      gateStatus.className = "gate-status bad";
      gateStatus.textContent = "Enter the access password.";
      return;
    }
    gateStatus.className = "gate-status";
    gateStatus.textContent = "Checking access...";
    unlockButton.disabled = true;
    try {
      const candidate = await deriveVerifier(passwordInput.value);
      passwordInput.value = "";
      if (!constantTimeEqual(candidate, VERIFIER)) {
        audio.pause(); audio.currentTime = 0;
        state.failures = Number(state.failures || 0) + 1;
        const seconds = state.failures >= 10 ? 300 : state.failures >= 5 ? 30 : 0;
        state.lockedUntil = seconds ? Date.now() + seconds * 1000 : 0;
        saveState(state);
        gateStatus.className = "gate-status bad";
        gateStatus.textContent = seconds ? `Access denied. Try again in ${seconds} seconds.` : "Access denied.";
        return;
      }
      saveState({ failures: 0, lockedUntil: 0, lastLogin: new Date().toISOString() });
      gateStatus.className = "gate-status ok";
      gateStatus.textContent = "Access granted.";
      window.setTimeout(unlock, 180);
    } catch {
      audio.pause();
      gateStatus.className = "gate-status bad";
      gateStatus.textContent = "Authentication failed.";
    } finally { unlockButton.disabled = false; }
  });

  if (sessionStorage.getItem(SESSION_KEY) === "granted") unlock();
  else window.setTimeout(() => passwordInput.focus(), 80);

  $("#relockButton").addEventListener("click", relock);
  $$('[data-jump]').forEach(button => button.addEventListener("click", () => document.getElementById(button.dataset.jump)?.scrollIntoView({ behavior: "smooth" })));
  $("#backToTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const categories = [["all","All"],["brooklyn","Brooklyn"],["israel","Israel"],["culture","Culture"],["future","Future"],["light","Light"]];
  categories.forEach(([value, label], index) => {
    const button = document.createElement("button");
    button.type = "button"; button.textContent = label; button.className = index === 0 ? "active" : "";
    button.addEventListener("click", () => {
      $$("#newsFilters button").forEach(item => item.classList.toggle("active", item === button));
      $$(".news-card").forEach(card => card.hidden = value !== "all" && card.dataset.category !== value);
    });
    $("#newsFilters").appendChild(button);
  });
  data.news.forEach(item => {
    const article = document.createElement("article");
    article.className = "news-card"; article.dataset.category = item.category;
    article.innerHTML = `<span class="label">${item.label}</span><h3>${item.title}</h3><p>${item.summary}</p><p class="why"><strong>Why it matters:</strong> ${item.why}</p><a href="${item.source}" target="_blank" rel="noopener noreferrer">Read source ↗</a>`;
    $("#newsGrid").appendChild(article);
  });

  data.analogies.forEach(item => {
    const card = document.createElement("article"); card.className = "analogy-card";
    card.innerHTML = `<span class="analogy-icon">${item.icon}</span><h3>${item.title}</h3><strong>${item.term}</strong><p>${item.text}</p>`;
    $("#analogyGrid").appendChild(card);
  });

  const letterScores = {A:1,B:3,C:3,D:2,E:1,F:4,G:2,H:4,I:1,J:8,K:5,L:1,M:3,N:1,O:1,P:3,Q:10,R:1,S:1,T:1,U:1,V:4,W:4,X:8,Y:4,Z:10};
  let wordIndex = -1;
  function drawWord() {
    let next = wordIndex;
    while (next === wordIndex && data.words.length > 1) next = Math.floor(Math.random() * data.words.length);
    wordIndex = next;
    const item = data.words[wordIndex];
    const tiles = $("#scrabbleTiles"); tiles.innerHTML = "";
    let score = 0;
    [...item.word].forEach(letter => {
      score += letterScores[letter] || 0;
      const tile = document.createElement("span"); tile.className = "tile"; tile.innerHTML = `${letter}<small>${letterScores[letter] || 0}</small>`; tiles.appendChild(tile);
    });
    $("#scrabbleScore").textContent = String(score);
    $("#scrabbleMeaning").textContent = item.meaning;
  }
  $("#drawWord").addEventListener("click", drawWord); drawWord();
  $("#revealClue").addEventListener("click", event => { $("#clueAnswer").hidden = false; event.currentTarget.hidden = true; });

  function updateMusicButtons() {
    const label = audio.paused ? "Play preview" : "Pause preview";
    $("#musicToggle").textContent = label;
    $("#musicToggleHero").textContent = audio.paused ? "Play today's song" : "Pause today's song";
  }
  async function toggleMusic() {
    if (audio.paused) { try { audio.muted = false; await audio.play(); } catch {} }
    else audio.pause();
    updateMusicButtons();
  }
  $("#musicToggle").addEventListener("click", toggleMusic);
  $("#musicToggleHero").addEventListener("click", toggleMusic);
  audio.addEventListener("play", updateMusicButtons); audio.addEventListener("pause", updateMusicButtons);
  audio.addEventListener("timeupdate", () => {
    const duration = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 30;
    $("#musicProgress").style.width = `${Math.min(100, (audio.currentTime / duration) * 100)}%`;
    const m = Math.floor(audio.currentTime / 60); const s = Math.floor(audio.currentTime % 60).toString().padStart(2,"0");
    $("#musicTime").textContent = `${m}:${s}`;
  });
  audio.addEventListener("ended", () => { audio.currentTime = 0; updateMusicButtons(); });

  const topicText = {
    jewish:["JEWISH + ISRAEL","A balanced summary of the most relevant Israel and Jewish community developments."],
    local:["BROOKLYN","Local events, safety information, neighborhood changes and useful city actions."],
    books:["CULTURE","One mystery-book, film, reading or culture recommendation chosen for your interests."],
    money:["MONEY","A private summary of spending, bills, unusual charges or a savings target from linked accounts."],
    schedule:["PRIORITIES","Appointments, free time, deadlines and one realistic priority for the day."]
  };
  const sourceLabels = {calendar:"calendar",email:"email",spotify:"Spotify",finances:"financial accounts",none:"public information only"};
  function updatePreview() {
    const preview = $("#briefPreview"); preview.innerHTML = "";
    const selectedTopics = $$('[data-topic]:checked').map(input => input.dataset.topic);
    const selectedSources = $$('[data-source]:checked').map(input => sourceLabels[input.dataset.source]);
    selectedTopics.forEach(key => {
      const [label,title] = topicText[key];
      const item = document.createElement("div"); item.className = "preview-item";
      item.innerHTML = `<span>${label}</span><h3>${title}</h3><p>Prepared using ${selectedSources.length ? selectedSources.join(", ") : "public information only"}.</p>`;
      preview.appendChild(item);
    });
    if (!selectedTopics.length) preview.innerHTML = `<div class="preview-item"><span>EMPTY BRIEF</span><h3>You selected nothing.</h3><p>That is also a valid privacy setting.</p></div>`;
    $("#previewTone").textContent = $("#toneSelect").value;
  }
  $$('[data-topic],[data-source]').forEach(input => input.addEventListener("change", () => {
    if (input.dataset.source === "none" && input.checked) $$('[data-source]:not([data-source="none"])').forEach(other => other.checked = false);
    if (input.dataset.source !== "none" && input.checked) $('[data-source="none"]').checked = false;
    updatePreview();
  }));
  $("#toneSelect").addEventListener("change", updatePreview); updatePreview();

  const chart = $("#patternChart"); const grid = $(".grid-lines", chart);
  [40,80,120,160,200].forEach(y => { const line = document.createElementNS("http://www.w3.org/2000/svg","line"); line.setAttribute("x1","35"); line.setAttribute("x2","665"); line.setAttribute("y1",String(y)); line.setAttribute("y2",String(y)); grid.appendChild(line); });
  function renderChart(series) {
    const values = data.patterns[series];
    const points = values.map((value,index) => [45 + index * 102, 215 - value * 1.75]);
    $("#chartPath").setAttribute("d", `M ${points.map(point => point.join(" ")).join(" L ")}`);
    const group = $("#chartPoints"); group.innerHTML = "";
    points.forEach(([x,y], index) => { const circle = document.createElementNS("http://www.w3.org/2000/svg","circle"); circle.setAttribute("class","chart-point"); circle.setAttribute("cx",String(x)); circle.setAttribute("cy",String(y)); circle.setAttribute("r","6"); circle.setAttribute("aria-label", `${series} ${values[index]}`); group.appendChild(circle); });
  }
  $$(".chart-controls button").forEach(button => button.addEventListener("click", () => { $$(".chart-controls button").forEach(item => item.classList.toggle("active", item === button)); renderChart(button.dataset.series); }));
  renderChart("energy");

  function selectRoadmap(index) {
    const item = data.roadmap[index];
    $$("#roadmapSteps button").forEach((button,i) => button.classList.toggle("active", i === index));
    $("#roadmapDetail").innerHTML = `<p class="card-label">${item.status}</p><h3>${item.title}</h3><p>${item.text}</p>`;
  }
  data.roadmap.forEach((item,index) => { const button = document.createElement("button"); button.type = "button"; button.innerHTML = `<span>${item.status}</span><strong>${item.title}</strong>`; button.addEventListener("click", () => selectRoadmap(index)); $("#roadmapSteps").appendChild(button); });
  selectRoadmap(0);

  data.projects.forEach(project => { const card = document.createElement("a"); card.className = "project-card"; card.href = project.path; card.target = "_blank"; card.rel = "noopener"; card.innerHTML = `<span>${project.badge}</span><h3>${project.name}</h3><p>${project.note}</p>`; $("#recommendedProjects").appendChild(card); });
  let routesLoaded = false;
  async function loadRoutes() {
    if (routesLoaded) return;
    routesLoaded = true;
    const grid = $("#routeGrid");
    try {
      const response = await fetch("/assets/cmx-routes.json?v=15", { cache: "no-store", credentials: "same-origin" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const registry = await response.json();
      registry.routes.filter(route => route.category !== "System").forEach(route => {
        const card = document.createElement("a"); card.className = "route-card"; card.href = route.path; card.target = "_blank"; card.rel = "noopener";
        card.innerHTML = `<code>${route.path}</code><h3>${route.name}</h3><p>${route.description}</p><small>${route.status} · ${route.category}</small>`; grid.appendChild(card);
      });
    } catch { grid.innerHTML = `<article class="route-card"><h3>Route map unavailable</h3><p>Open <a href="/directory/">the directory</a> instead.</p></article>`; }
  }
  $("#showAllRoutes").addEventListener("click", event => { const grid = $("#routeGrid"); const show = grid.hidden; grid.hidden = !show; grid.classList.toggle("visible", show); event.currentTarget.textContent = show ? "Hide the full route map" : "Show the full route map"; if (show) loadRoutes(); });

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch { const area = document.createElement("textarea"); area.value = text; document.body.appendChild(area); area.select(); const ok = document.execCommand("copy"); area.remove(); return ok; }
  }
  $("#ideaForm").addEventListener("submit", async event => {
    event.preventDefault();
    const note = `DEBBIE'S BRIEFING IDEAS\n\nWhat would make me open it daily:\n${$("#ideaOne").value || "Not answered"}\n\nUseful vs invasive:\n${$("#ideaTwo").value || "Not answered"}\n\nOne feature Jay may not have considered:\n${$("#ideaThree").value || "Not answered"}`;
    const ok = await copyText(note); $("#ideaStatus").textContent = ok ? "Ideas copied. Send them to Jay." : "Copy failed. Select the text manually.";
  });
})();