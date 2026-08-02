(() => {
  "use strict";

  const data = window.LOGAN_BRIEF;
  if (!data) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const ACCESS_KEY = `logan-brief-access-${document.documentElement.dataset.briefDate}`;
  const WATER_KEY = `logan-water-${document.documentElement.dataset.briefDate}`;
  const correctAnswers = { q1: "b", q2: "c", q3: "a" };

  const expansionStyles = document.createElement("link");
  expansionStyles.rel = "stylesheet";
  expansionStyles.href = "/assets/logan-expansion.css?v=20260802-1";
  document.head.appendChild(expansionStyles);

  const gate = $("#gate");
  const app = $("#briefApp");
  const quizForm = $("#quizForm");
  const quizStatus = $("#quizStatus");
  const terminalLog = $("#terminalLog");

  function formatNacTime(includeSeconds = false) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      hour: "numeric",
      minute: "2-digit",
      second: includeSeconds ? "2-digit" : undefined,
      hour12: true,
      timeZoneName: includeSeconds ? undefined : "short"
    }).format(new Date());
  }

  function updateClocks() {
    const gateClock = $("#gateClock");
    const liveLocalTime = $("#liveLocalTime");
    if (gateClock) gateClock.textContent = `${formatNacTime(true)} CDT`;
    if (liveLocalTime) liveLocalTime.textContent = formatNacTime(false);
  }
  updateClocks();
  setInterval(updateClocks, 1000);

  function addTerminalLine(text, className = "") {
    const line = document.createElement("div");
    line.className = className;
    line.textContent = text;
    terminalLog.appendChild(line);
  }

  let revealObserver;

  function grantAccess(save = true) {
    if (save) localStorage.setItem(ACCESS_KEY, "granted");
    document.body.classList.remove("gate-active");
    gate.classList.add("granted");
    app.classList.add("active");
    app.removeAttribute("inert");
    app.setAttribute("aria-hidden", "false");
    window.setTimeout(() => {
      if (revealObserver) $$(".reveal").forEach((element) => revealObserver.observe(element));
    }, 100);
  }

  function relock() {
    localStorage.removeItem(ACCESS_KEY);
    document.body.classList.add("gate-active");
    gate.classList.remove("granted");
    app.classList.remove("active");
    app.setAttribute("inert", "");
    app.setAttribute("aria-hidden", "true");
    quizForm.reset();
    terminalLog.innerHTML = "";
    quizStatus.textContent = "awaiting input_";
    $$("fieldset", quizForm).forEach((field) => field.classList.remove("correct", "wrong"));
    gate.scrollTop = 0;
  }

  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();
    terminalLog.innerHTML = "";
    let score = 0;
    let unanswered = 0;

    Object.entries(correctAnswers).forEach(([name, correct], index) => {
      const selected = $(`input[name="${name}"]:checked`, quizForm);
      const field = $(`fieldset[data-question="${index + 1}"]`, quizForm);
      field.classList.remove("correct", "wrong");
      if (!selected) {
        unanswered += 1;
        field.classList.add("wrong");
        return;
      }
      if (selected.value === correct) {
        score += 1;
        field.classList.add("correct");
      } else {
        field.classList.add("wrong");
      }
    });

    if (unanswered) {
      quizStatus.textContent = `missing ${unanswered} answer${unanswered > 1 ? "s" : ""}_`;
      addTerminalLine("[ ERROR ] challenge incomplete", "error");
      return;
    }

    addTerminalLine(`[ SCAN ] ${score}/3 safety responses verified`);
    if (score === 3) {
      quizStatus.textContent = "authorization accepted_";
      addTerminalLine("[ OK ] firearm-safety baseline confirmed", "ok");
      addTerminalLine("[ OK ] Logan profile match: Army / bartender / East Texas", "ok");
      addTerminalLine("ACCESS GRANTED // welcome to today's field brief", "grant");
      window.setTimeout(() => grantAccess(true), 850);
    } else {
      quizStatus.textContent = "authorization denied_";
      addTerminalLine("[ DENIED ] Check the four universal safety rules and try again.", "error");
    }
  });

  $("#relockButton").addEventListener("click", relock);

  function sourceById(id) {
    return data.sources.find((source) => source.id === id);
  }

  function renderFilters() {
    const categories = [
      ["all", "All intel"],
      ["local", "Nacogdoches"],
      ["guns", "Guns + hunting"],
      ["texas", "Texas"],
      ["weather", "Weather"],
      ["fun", "Light stuff"]
    ];
    const container = $("#newsFilters");
    categories.forEach(([value, label], index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `filter-button${index === 0 ? " active" : ""}`;
      button.dataset.filter = value;
      button.textContent = label;
      button.addEventListener("click", () => {
        $$(".filter-button", container).forEach((item) => item.classList.toggle("active", item === button));
        $$(".intel-card", $("#newsGrid")).forEach((card) => {
          card.hidden = value !== "all" && card.dataset.category !== value;
        });
      });
      container.appendChild(button);
    });
  }

  function renderNews() {
    const grid = $("#newsGrid");
    data.news.forEach((item) => {
      const source = sourceById(item.sourceId);
      const article = document.createElement("article");
      article.className = "intel-card reveal";
      article.dataset.category = item.category;
      article.dataset.priority = item.priority;
      article.innerHTML = `
        <span class="eyebrow">${item.eyebrow}</span>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <p class="intel-why"><strong>Why it matters:</strong> ${item.why}</p>
        <button class="source-jump" type="button">${source ? source.name : "source"} ↗</button>`;
      $(".source-jump", article).addEventListener("click", () => {
        if (source) window.open(source.url, "_blank", "noopener,noreferrer");
      });
      grid.appendChild(article);
    });
  }

  function renderTimeline() {
    const track = $("#timelineTrack");
    const detail = $("#timelineDetail");
    const select = (index) => {
      const item = data.timeline[index];
      $$(".timeline-node", track).forEach((node, nodeIndex) => node.classList.toggle("active", nodeIndex === index));
      detail.innerHTML = `<span class="detail-type">${item.type}</span><h3>${item.time} · ${item.title}</h3><p>${item.detail}</p>`;
    };
    data.timeline.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "timeline-node";
      button.innerHTML = `<strong>${item.time}</strong><i></i><span>${item.title}</span>`;
      button.addEventListener("click", () => select(index));
      track.appendChild(button);
    });
    select(0);
  }

  function renderGunDates() {
    data.gunDates.forEach((item) => {
      const row = document.createElement("div");
      row.className = "date-row";
      row.innerHTML = `<time>${item.date}</time><div><h3>${item.title}</h3><p>${item.text}</p></div>`;
      $("#gunDates").appendChild(row);
    });
  }

  function renderState() {
    data.stateItems.forEach((item) => {
      const card = document.createElement("article");
      card.className = "state-card reveal";
      card.innerHTML = `<div class="state-icon">${item.icon}</div><div class="state-label">${item.label}</div><h3>${item.title}</h3><p>${item.text}</p>`;
      $("#stateGrid").appendChild(card);
    });
  }

  function renderCapabilities() {
    data.capabilities.forEach((item) => {
      const card = document.createElement("article");
      card.className = "capability-card reveal";
      card.innerHTML = `<div class="cap-icon">${item.icon}</div><h3>${item.title}</h3><p>${item.text}</p>`;
      $("#capabilityGrid").appendChild(card);
    });
  }

  function renderQuestions() {
    data.questions.forEach((question, index) => {
      const item = document.createElement("div");
      item.className = "question-item";
      item.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><div>${question}</div>`;
      $("#questionList").appendChild(item);
    });
  }

  function renderSources() {
    data.sources.forEach((source) => {
      const link = document.createElement("a");
      link.className = "source-item";
      link.href = source.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.innerHTML = `<span>${source.name}</span><strong>${source.title}</strong><small>${source.date}</small>`;
      $("#sourceList").appendChild(link);
    });
  }

  function renderBarTip() {
    const tip = document.createElement("article");
    tip.className = "bar-tip reveal";
    tip.innerHTML = `
      <div class="bar-tip-icon" aria-hidden="true">♜</div>
      <div>
        <div class="card-label">DAILY BAR UPGRADE // THE REGULARS MEMORY LOOP</div>
        <h3>Remember one useful detail, not someone's entire life story.</h3>
        <p>At the end of the shift, record three privacy-safe things: a regular's first name, usual drink, and one harmless conversation hook such as their team, job field, or upcoming trip. On the next visit, greet them by name and confirm the drink instead of assuming it.</p>
        <small>Why it works: people return to places where they feel recognized. It improves hospitality, repeat business, atmosphere, and often tips. Do not record sensitive information, gossip, intoxicated confessions, phone numbers, or anything that would feel creepy if the guest saw it.</small>
      </div>`;
    $("#shift-intel").insertBefore(tip, $("#shift-intel").lastElementChild);
  }

  const recentTracks = [
    {
      title: "No Receipts",
      artist: "Augxst, Prznt, Adrian Chafer",
      spotify: "https://open.spotify.com/track/6CQCw1B4igNUKBGCgcIJLj?utm_source=openai&utm_medium=chatgpt&go=1&nap_web=1&request_id=1c0c8cc9-b6f6-4e76-99fb-a866ee39651b&nl=spotify%3Anl%3ACAASEBwMjMm29k52mfuoZu45ZRsaGDU6NkNRQ3cxQjRpZ05VS0JHQ2djSUpMaiADMAPgAzXoA8TbhZr8M%2FADIA%3D%3D&redirect_uri=com.openai.chatgpt"
    },
    {
      title: "Ready",
      artist: "Dyce",
      spotify: "https://open.spotify.com/track/3iGt2RRIfy42EOoMMIoEB2?utm_source=openai&utm_medium=chatgpt&go=1&nap_web=1&request_id=1c0c8cc9-b6f6-4e76-99fb-a866ee39651b&nl=spotify%3Anl%3ACAASEBwMjMm29k52mfuoZu45ZRsaGDU6M2lHdDJSUklmeTQyRU9vTU1Jb0VCMiADMAPgAzXoA8TbhZr8M%2FADIA%3D%3D&redirect_uri=com.openai.chatgpt"
    },
    {
      title: "Everlasting",
      artist: "Armin van Buuren, SACHA",
      spotify: "https://open.spotify.com/track/3fQpNZSQAR1Kf0X5IbSVoX?utm_source=openai&utm_medium=chatgpt&go=1&nap_web=1&request_id=1c0c8cc9-b6f6-4e76-99fb-a866ee39651b&nl=spotify%3Anl%3ACAASEBwMjMm29k52mfuoZu45ZRsaGDU6M2ZRcE5aU1FBUjFLZjBYNUliU1ZvWCADMAPgAzXoA8TbhZr8M%2FADIA%3D%3D&redirect_uri=com.openai.chatgpt"
    },
    {
      title: "energy",
      artist: "arya x",
      spotify: "https://open.spotify.com/track/1ZCjqdLQEkQspnq5mBKy8C?utm_source=openai&utm_medium=chatgpt&go=1&nap_web=1&request_id=1c0c8cc9-b6f6-4e76-99fb-a866ee39651b&nl=spotify%3Anl%3ACAASEBwMjMm29k52mfuoZu45ZRsaGDU6MVpDanFkTFFFa1FzcG5xNW1CS3k4QyADMAPgAzXoA8TbhZr8M%2FADIA%3D%3D&redirect_uri=com.openai.chatgpt"
    },
    {
      title: "Broken Soul, Pt. 2",
      artist: "CloverS",
      spotify: "https://open.spotify.com/track/7v8mtcuyUUiELxn5SRiXPc?utm_source=openai&utm_medium=chatgpt&go=1&nap_web=1&request_id=1c0c8cc9-b6f6-4e76-99fb-a866ee39651b&nl=spotify%3Anl%3ACAASEBwMjMm29k52mfuoZu45ZRsaGDU6N3Y4bXRjdXlVVWlFTHhuNVNSaVhQYyADMAPgAzXoA8TbhZr8M%2FADIA%3D%3D&redirect_uri=com.openai.chatgpt"
    }
  ];

  function renderExpansionSections() {
    const tomorrow = $("#tomorrow");
    tomorrow.dataset.scene = "14";

    const media = document.createElement("section");
    media.className = "scene media-scene";
    media.id = "media";
    media.dataset.scene = "11";
    media.dataset.title = "Jay's Media Drop";
    media.innerHTML = `
      <div class="scene-head reveal">
        <div><p class="kicker">FROM JAY'S RECENT SPOTIFY ROTATION</p><h2>A song for an old internet friend.</h2></div>
        <p>This is based on Jay's connected Spotify recent listening, not a generic recommendation pretending to know him.</p>
      </div>
      <div class="friendship-note reveal">
        <strong>LOGAN // WHY YOU ARE GETTING THIS PAGE</strong>
        <p>Jay has known you since the COVID-era internet chaos. You helped build the social side of CMX when it was still becoming a real community, and you stayed a good friend through the strange years after that. This page is partly a daily briefing and partly a live demonstration of where Jay wants CMX technology to go.</p>
      </div>
      <div class="media-layout">
        <article class="media-player reveal">
          <div class="media-label">JAY'S SONG CHOICE FOR LOGAN</div>
          <h3>Everlasting</h3>
          <p class="media-artist">Armin van Buuren & SACHA</p>
          <div class="waveform" aria-hidden="true">${"<i></i>".repeat(28)}</div>
          <p class="media-reason"><strong>Why this one:</strong> it appeared in Jay's recent rotation, the title fits a friendship that survived the COVID era and the long CMX build, and the track has enough forward energy for an Army veteran who works behind a bar. Sentimental, but not a Hallmark hostage situation.</p>
          <div class="media-actions">
            <a class="media-link spotify" href="${recentTracks[2].spotify}" target="_blank" rel="noopener noreferrer">Play on Spotify</a>
            <a class="media-link youtube" href="https://www.youtube.com/results?search_query=Armin+van+Buuren+SACHA+Everlasting" target="_blank" rel="noopener noreferrer">Find on YouTube</a>
          </div>
        </article>
        <article class="rotation-card reveal">
          <div class="card-label">WHAT JAY HAS BEEN LISTENING TO</div>
          <h3>Recent Spotify rotation</h3>
          <div class="rotation-list">
            ${recentTracks.map((track, index) => `<a class="rotation-track" href="${track.spotify}" target="_blank" rel="noopener noreferrer"><span>${String(index + 1).padStart(2, "0")}</span><span><strong>${track.title}</strong><small>${track.artist}</small></span><em>SPOTIFY ↗</em></a>`).join("")}
          </div>
          <p class="media-truth">Pulled from Jay's authorized Spotify listening history on August 2, 2026. This does not expose private messages, contacts, or unrelated account data.</p>
        </article>
      </div>`;

    const platform = document.createElement("section");
    platform.className = "scene";
    platform.id = "platform";
    platform.dataset.scene = "12";
    platform.dataset.title = "What Jay Is Building";
    platform.innerHTML = `
      <div class="scene-head reveal">
        <div><p class="kicker">THE BIG CMX PLAN, WITHOUT DEVELOPER GIBBERISH</p><h2>Turn pages like this into useful private software.</h2></div>
        <p>Right now this site is a set of advanced static web pages. Jay's next move is to give those pages a secure engine, memory, approved integrations, and AI that can perform controlled work.</p>
      </div>
      <div class="friendship-note reveal">
        <strong>WHY THIS MATTERS TO YOU</strong>
        <p>You helped Jay build CMX as a social place. He is now trying to evolve the same idea into a platform where trusted people can have their own useful tools, briefings, workspaces, research pages, automations, and private assistants without needing to understand code.</p>
      </div>
      <div class="platform-stack">
        <article class="platform-card reveal"><span class="platform-number">01 // FRONTEND</span><h3>The part you see</h3><p>The buttons, terminal, cards, timelines, calculators, forms, music links, and pages in your browser. HTML gives it structure, CSS makes it look good, and JavaScript makes it interactive.</p><code>browser = dashboard</code></article>
        <article class="platform-card reveal"><span class="platform-number">02 // BACKEND</span><h3>The protected engine room</h3><p>A Python FastAPI server would receive requests, check identity and permission, process files, call approved services, run automations, and return safe results to the page.</p><code>FastAPI = engine</code></article>
        <article class="platform-card reveal"><span class="platform-number">03 // DATABASE</span><h3>The organized memory</h3><p>A database can remember profiles, settings, briefing history, tasks, saved research, approvals, audit logs, and information you explicitly choose to store.</p><code>PostgreSQL = memory</code></article>
        <article class="platform-card reveal"><span class="platform-number">04 // AI</span><h3>The translator and operator</h3><p>You speak normally. The AI understands the request, gathers permitted context, creates a plan, and calls narrowly defined tools. It should never get unlimited server authority.</p><code>plain English → tools</code></article>
        <article class="platform-card reveal"><span class="platform-number">05 // MCP + CONNECTORS</span><h3>The approved adapters</h3><p>MCP and app connectors let the AI use specific outside services such as GitHub, Gmail, calendars, Spotify, finances, files, search, or internal CMX tools through defined permissions.</p><code>connector = allowed doorway</code></article>
        <article class="platform-card reveal"><span class="platform-number">06 // GITHUB</span><h3>The source of truth</h3><p>Every page and code change remains versioned. The AI can create a branch, show exactly what changed, send it to staging, and preserve a rollback path.</p><code>GitHub = history</code></article>
        <article class="platform-card reveal"><span class="platform-number">07 // STAGING + APPROVAL</span><h3>The safety checkpoint</h3><p>Changes go to a private test version first. Jay reviews them before production. High-risk actions can require another explicit approval instead of silently running.</p><code>test → approve → live</code></article>
        <article class="platform-card reveal"><span class="platform-number">08 // CLOUDFLARE + LINUX</span><h3>The real gate and server</h3><p>A Linux server runs the app. Cloudflare Access and Tunnel protect it, while HTTPS, rate limits, logs, backups, secret storage, and automatic restarts keep it controlled and recoverable.</p><code>identity before access</code></article>
      </div>
      <div class="platform-flow reveal" aria-label="How a request moves through the future CMX platform">
        <div class="flow-node"><span>01</span><strong>You ask normally</strong></div>
        <div class="flow-node"><span>02</span><strong>AI understands intent</strong></div>
        <div class="flow-node"><span>03</span><strong>Permissions are checked</strong></div>
        <div class="flow-node"><span>04</span><strong>Approved tools run</strong></div>
        <div class="flow-node"><span>05</span><strong>Staging shows result</strong></div>
        <div class="flow-node"><span>06</span><strong>Human approves live</strong></div>
      </div>
      <div class="platform-details">
        <article class="flow-example reveal">
          <h3>What that would feel like</h3>
          <ol>
            <li>Logan says, “Build tomorrow's briefing and include hunting deadlines, my shifts, weather, and bills due.”</li>
            <li>The AI checks which accounts and data Logan has actually authorized.</li>
            <li>It researches public sources, reads the permitted schedule or finance data, and drafts the page.</li>
            <li>It writes the change to GitHub on a branch and deploys a protected preview.</li>
            <li>Jay or Logan reviews it, approves it, and the live page updates with a complete audit trail.</li>
          </ol>
        </article>
        <article class="flow-example platform-truth reveal">
          <h3>Why a backend is necessary</h3>
          <ul>
            <li>Static pages cannot safely hold secrets, private account tokens, real authentication, or trusted personal data.</li>
            <li>A backend can enforce who is allowed to read, write, approve, upload, connect, or trigger an action.</li>
            <li>It enables databases, file processing, notifications, scheduled jobs, private AI memory, APIs, and account integrations.</li>
            <li>It lets CMX build tools once and safely reuse them across people, pages, and future projects.</li>
          </ul>
        </article>
      </div>
      <div class="truth-console reveal"><strong>Current truth:</strong><p>The quiz gate on this page is a fun browser gate on a public static repository. It discourages casual viewing, but real confidentiality requires the planned server, login, permissions, and Cloudflare Access. Jay is deliberately building the architecture in stages so the cool part does not outrun the secure part.</p></div>`;

    const pageMap = document.createElement("section");
    pageMap.className = "scene";
    pageMap.id = "page-map";
    pageMap.dataset.scene = "13";
    pageMap.dataset.title = "CMX Page Map";
    pageMap.innerHTML = `
      <div class="scene-head reveal">
        <div><p class="kicker">WHAT JAY HAS ALREADY BUILT</p><h2>The current db.cmxchat.com map.</h2></div>
        <p>These links are loaded from the live CMX route registry. Some are polished tools, some are private plans, and some are experiments preserved so the best ideas can be reused.</p>
      </div>
      <div class="friendship-note reveal">
        <strong>TRUSTED ACCESS NOTE</strong>
        <p>Jay trusts you enough to show you the working map. Explore it, break nothing on purpose, and remember that the more technical pages describe what is being built, while several backend features remain planned until the secure server exists.</p>
      </div>
      <div class="page-map" id="liveRouteMap">
        <article class="page-group reveal"><h3>Loading route registry...</h3><p>The page is checking the current source of truth.</p></article>
      </div>
      <p class="legacy-note reveal">The directory intentionally shows only approved active tools. This trusted briefing also exposes direct-link planning, internal, client, experimental, legacy, and system routes so Logan can understand the whole project.</p>`;

    tomorrow.parentNode.insertBefore(media, tomorrow);
    tomorrow.parentNode.insertBefore(platform, tomorrow);
    tomorrow.parentNode.insertBefore(pageMap, tomorrow);
    renderRouteMap();
  }

  async function renderRouteMap() {
    const container = $("#liveRouteMap");
    try {
      const response = await fetch("/assets/cmx-routes.json?v=14", { cache: "no-store", credentials: "same-origin" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const registry = await response.json();
      const active = registry.routes.filter((route) => route.status === "Active" && route.category !== "System");
      const working = registry.routes.filter((route) => !["Active", "Legacy"].includes(route.status) && route.category !== "System");
      const legacy = registry.routes.filter((route) => route.status === "Legacy" || route.category === "System");
      const renderGroup = (title, intro, routes) => `
        <article class="page-group reveal">
          <h3>${title}</h3><p>${intro}</p>
          <div class="route-list">${routes.map((route) => `<a class="route-link" href="${route.path}" target="_blank" rel="noopener"><code>${route.path}</code><span>${route.name}</span><small>${route.status}</small></a>`).join("")}</div>
        </article>`;
      container.innerHTML = [
        renderGroup("Active pages", "Current tools, operational blueprints, briefings, and client workspaces marked active.", active),
        renderGroup("Work in progress", "Internal, experimental, and review-stage pages that preserve ongoing thinking and design work.", working),
        renderGroup("Legacy and system", "Compatibility routes and the custom fallback page.", legacy)
      ].join("");
      if (revealObserver) $$(".reveal", container).forEach((element) => revealObserver.observe(element));
    } catch (error) {
      container.innerHTML = `<article class="page-group reveal"><h3>Route registry unavailable</h3><p>The live map could not load. Open <a href="/directory/">/directory/</a> for the approved tool list.</p></article>`;
      console.error(error);
    }
  }

  renderFilters();
  renderNews();
  renderTimeline();
  renderGunDates();
  renderState();
  renderCapabilities();
  renderQuestions();
  renderSources();
  renderBarTip();
  renderExpansionSections();

  let safetyIndex = 3;
  $("#safetyCard").addEventListener("click", () => {
    safetyIndex = (safetyIndex + 1) % data.safetyRules.length;
    $("#safetyRule").textContent = data.safetyRules[safetyIndex];
  });

  let openerIndex = 0;
  $("#shuffleOpener").addEventListener("click", () => {
    let next = openerIndex;
    while (next === openerIndex && data.socialOpeners.length > 1) next = Math.floor(Math.random() * data.socialOpeners.length);
    openerIndex = next;
    $("#openerDisplay").textContent = data.socialOpeners[openerIndex];
  });

  const shiftHours = $("#shiftHours");
  const tipsPerHour = $("#tipsPerHour");
  const taxReserve = $("#taxReserve");
  function updateTipCalculator() {
    const hours = Number(shiftHours.value);
    const rate = Number(tipsPerHour.value);
    const reserve = Number(taxReserve.value);
    const gross = hours * rate;
    const net = gross * (1 - reserve / 100);
    $("#shiftHoursOutput").textContent = `${hours} hours`;
    $("#tipsPerHourOutput").textContent = `$${rate}/hr`;
    $("#taxReserveOutput").textContent = `${reserve}%`;
    $("#grossTips").textContent = `$${gross.toFixed(0)}`;
    $("#netTips").textContent = `$${net.toFixed(0)}`;
  }
  [shiftHours, tipsPerHour, taxReserve].forEach((input) => input.addEventListener("input", updateTipCalculator));
  updateTipCalculator();

  let waterCount = Number(localStorage.getItem(WATER_KEY) || 0);
  function updateWater() {
    $("#waterCount").textContent = String(waterCount);
  }
  updateWater();
  $("#addWater").addEventListener("click", () => {
    waterCount += 1;
    localStorage.setItem(WATER_KEY, String(waterCount));
    updateWater();
  });

  const missionButtons = $$(".mission-card .check-button");
  function updateMissions() {
    const complete = missionButtons.filter((button) => button.closest(".mission-card").classList.contains("completed")).length;
    $("#missionCount").textContent = `${complete} / 3`;
    $("#missionFill").style.width = `${(complete / 3) * 100}%`;
    $("#missionMessage").textContent = complete === 3
      ? "All three acknowledged. The command staff will now stop hovering."
      : "Nothing dramatic. Just handle the three things that can become annoying later.";
  }
  missionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".mission-card");
      card.classList.toggle("completed");
      button.textContent = card.classList.contains("completed") ? "checked ✓" : "mark checked";
      updateMissions();
    });
  });

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const success = document.execCommand("copy");
      area.remove();
      return success;
    }
  }

  $("#profileForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const topics = $("#profileTopics").value.trim() || "Not answered";
    const schedule = $("#profileSchedule").value.trim() || "Not answered";
    const tracking = $("#profileTracking").value.trim() || "Not answered";
    const note = `LOGAN BRIEFING PROFILE\n\nTopics I want: ${topics}\n\nMy normal week: ${schedule}\n\nTrack or remind me about: ${tracking}\n\nConnected services I may consider: calendar / Gmail / Spotify / finances / none\n\nSend this to Jay so future /logan briefings can be personalized.`;
    const success = await copyText(note);
    $("#profileStatus").textContent = success ? "profile note copied" : "copy failed; select the text manually";
  });

  $("#copyLink").addEventListener("click", async () => {
    const success = await copyText(window.location.href);
    $("#copyLink").textContent = success ? "Link copied ✓" : "Copy failed";
  });

  $$('[data-jump]').forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.getElementById(button.dataset.jump);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  const scenes = $$(".scene");
  const nav = $("#navigator");
  const navScrim = $("#navScrim");
  const navLinks = $("#navLinks");
  function closeNav() {
    nav.classList.remove("open");
    navScrim.classList.remove("open");
  }
  $("#openNavigator").addEventListener("click", () => {
    nav.classList.add("open");
    navScrim.classList.add("open");
  });
  $("#closeNavigator").addEventListener("click", closeNav);
  navScrim.addEventListener("click", closeNav);

  scenes.forEach((scene, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.target = scene.id;
    button.innerHTML = `<i>${String(index + 1).padStart(2, "0")}</i><span>${scene.dataset.title}</span><small>↗</small>`;
    button.addEventListener("click", () => {
      scene.scrollIntoView({ behavior: "smooth" });
      closeNav();
    });
    navLinks.appendChild(button);
  });

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });

  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      $$("button", navLinks).forEach((button) => button.classList.toggle("active", button.dataset.target === entry.target.id));
    });
  }, { rootMargin: "-40% 0px -45% 0px" });
  scenes.forEach((scene) => sceneObserver.observe(scene));

  function updateScrollProgress() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const percent = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
    $("#progressFill").style.width = `${percent}%`;
    $("#progressLabel").textContent = `${Math.round(percent)}% scanned`;
  }
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();

  const commandMap = {
    help: "commands: news, guns, timeline, shift, social, texas, media, platform, pages, profile, sources, top, relock",
    news: "sitrep",
    guns: "gun-desk",
    timeline: "timeline",
    shift: "shift-intel",
    social: "social-radar",
    texas: "texas-watch",
    media: "media",
    platform: "platform",
    pages: "page-map",
    profile: "profile",
    sources: "sources",
    top: "brief"
  };

  $("#commandForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#commandInput");
    const command = input.value.trim().toLowerCase();
    input.value = "";
    if (!command) return;
    if (command === "relock") {
      $("#commandOutput").textContent = "terminal relocked";
      relock();
      return;
    }
    if (command === "help") {
      $("#commandOutput").textContent = commandMap.help;
      return;
    }
    const targetId = commandMap[command];
    const target = targetId ? document.getElementById(targetId) : null;
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      $("#commandOutput").textContent = `opening ~/${command}`;
    } else {
      $("#commandOutput").textContent = `command not found: ${command}. type help`;
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
    if (event.key === "/" && app.classList.contains("active") && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      event.preventDefault();
      $("#commandInput").focus();
    }
  });

  if (localStorage.getItem(ACCESS_KEY) === "granted") grantAccess(false);
})();