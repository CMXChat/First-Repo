(() => {
  "use strict";

  const data = window.LOGAN_BRIEF;
  if (!data) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const ACCESS_KEY = `logan-brief-access-${document.documentElement.dataset.briefDate}`;
  const WATER_KEY = `logan-water-${document.documentElement.dataset.briefDate}`;
  const correctAnswers = { q1: "b", q2: "c", q3: "a" };

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

  function grantAccess(save = true) {
    if (save) localStorage.setItem(ACCESS_KEY, "granted");
    document.body.classList.remove("gate-active");
    gate.classList.add("granted");
    app.classList.add("active");
    app.removeAttribute("inert");
    app.setAttribute("aria-hidden", "false");
    window.setTimeout(() => {
      $$(".reveal").forEach((el) => revealObserver.observe(el));
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
    const container = $("#gunDates");
    data.gunDates.forEach((item) => {
      const row = document.createElement("div");
      row.className = "date-row";
      row.innerHTML = `<time>${item.date}</time><div><h3>${item.title}</h3><p>${item.text}</p></div>`;
      container.appendChild(row);
    });
  }

  function renderState() {
    const grid = $("#stateGrid");
    data.stateItems.forEach((item) => {
      const card = document.createElement("article");
      card.className = "state-card reveal";
      card.innerHTML = `<div class="state-icon">${item.icon}</div><div class="state-label">${item.label}</div><h3>${item.title}</h3><p>${item.text}</p>`;
      grid.appendChild(card);
    });
  }

  function renderCapabilities() {
    const grid = $("#capabilityGrid");
    data.capabilities.forEach((item) => {
      const card = document.createElement("article");
      card.className = "capability-card reveal";
      card.innerHTML = `<div class="cap-icon">${item.icon}</div><h3>${item.title}</h3><p>${item.text}</p>`;
      grid.appendChild(card);
    });
  }

  function renderQuestions() {
    const container = $("#questionList");
    data.questions.forEach((question, index) => {
      const item = document.createElement("div");
      item.className = "question-item";
      item.innerHTML = `<span>${String(index + 1).padStart(2, "0")}</span><div>${question}</div>`;
      container.appendChild(item);
    });
  }

  function renderSources() {
    const container = $("#sourceList");
    data.sources.forEach((source) => {
      const link = document.createElement("a");
      link.className = "source-item";
      link.href = source.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.innerHTML = `<span>${source.name}</span><strong>${source.title}</strong><small>${source.date}</small>`;
      container.appendChild(link);
    });
  }

  renderFilters();
  renderNews();
  renderTimeline();
  renderGunDates();
  renderState();
  renderCapabilities();
  renderQuestions();
  renderSources();

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
  function updateWater() { $("#waterCount").textContent = String(waterCount); }
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
  function closeNav() { nav.classList.remove("open"); navScrim.classList.remove("open"); }
  $("#openNavigator").addEventListener("click", () => { nav.classList.add("open"); navScrim.classList.add("open"); });
  $("#closeNavigator").addEventListener("click", closeNav);
  navScrim.addEventListener("click", closeNav);
  scenes.forEach((scene, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.target = scene.id;
    button.innerHTML = `<i>${String(index + 1).padStart(2, "0")}</i><span>${scene.dataset.title}</span><small>↗</small>`;
    button.addEventListener("click", () => { scene.scrollIntoView({ behavior: "smooth" }); closeNav(); });
    navLinks.appendChild(button);
  });

  const revealObserver = new IntersectionObserver((entries) => {
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
    help: "commands: news, guns, timeline, shift, social, texas, profile, sources, top, relock",
    news: "sitrep",
    guns: "gun-desk",
    timeline: "timeline",
    shift: "shift-intel",
    social: "social-radar",
    texas: "texas-watch",
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
    if (event.key === "/" && app.classList.contains("active") && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      event.preventDefault();
      $("#commandInput").focus();
    }
  });

  if (localStorage.getItem(ACCESS_KEY) === "granted") grantAccess(false);
})();