(() => {
  "use strict";

  const data = window.LOGAN_TERMINAL_DATA;
  const output = document.getElementById("output");
  const form = document.getElementById("shellForm");
  const input = document.getElementById("shellInput");
  const promptLabel = document.getElementById("promptLabel");
  const clock = document.getElementById("clock");

  const SESSION_KEY = "logan_terminal_session_v1";
  const STATE_KEY = "cmx_gate_state_v1";
  const ITERATIONS = 600000;
  const SALT_B64 = "AZ4QJPMRsGl0B1pJV+4Yzut/sDzFl++ZoeMAfrO5ieo=";
  const VERIFIER_B64 = "PWXFb5BlVpc7BCUDpCvMZ1faJ6Yb304F8d0EspmpnP0=";

  const commands = [
    "help", "man", "brief", "all", "news", "local", "weather", "timeline",
    "guns", "safety", "missions", "shift", "bar-tip", "tips", "social",
    "media", "friendship", "platform", "capabilities", "pages", "questions",
    "sources", "open", "status", "neofetch", "whoami", "date", "pwd", "ls",
    "tree", "cat", "history", "clear", "relock", "exit"
  ];

  const aliases = {
    cls: "clear",
    briefing: "brief",
    gun: "guns",
    hunt: "guns",
    music: "media",
    routes: "pages",
    map: "pages",
    about: "friendship",
    system: "platform",
    quit: "exit"
  };

  const challenge = [
    {
      question: "Treat every firearm as though it is:",
      options: ["a) unloaded until proven otherwise", "b) loaded", "c) safe when the safety is on"],
      answer: "b"
    },
    {
      question: "The muzzle should point:",
      options: ["a) wherever your eyes are looking", "b) down whenever possible", "c) only where an unintended discharge would cause no injury"],
      answer: "c"
    },
    {
      question: "Your trigger finger stays:",
      options: ["a) indexed outside the trigger guard until you intend to fire", "b) resting lightly on the trigger", "c) wherever it feels comfortable"],
      answer: "a"
    }
  ];

  let mode = "boot";
  let challengeIndex = 0;
  let challengeAnswers = [];
  let commandHistory = [];
  let historyIndex = 0;
  let routeCache = null;

  function escapeText(value) {
    return String(value ?? "");
  }

  function scrollBottom() {
    output.scrollTop = output.scrollHeight;
  }

  function addLine(text = "", className = "") {
    const line = document.createElement("div");
    line.className = `line ${className}`.trim();
    line.textContent = escapeText(text);
    output.appendChild(line);
    scrollBottom();
    return line;
  }

  function addLinkLine(prefix, label, url, suffix = "") {
    const line = document.createElement("div");
    line.className = "line link-line";
    if (prefix) line.append(document.createTextNode(prefix));
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    line.append(link);
    if (suffix) line.append(document.createTextNode(suffix));
    output.appendChild(line);
    scrollBottom();
  }

  function addRule(character = "─") {
    addLine(character.repeat(96), "rule");
  }

  function addHeader(title, subtitle = "") {
    addLine("");
    addRule();
    addLine(title.toUpperCase(), "strong");
    if (subtitle) addLine(subtitle, "dim");
    addRule();
  }

  function addTable(headers, rows) {
    const table = document.createElement("table");
    table.className = "table";
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      row.forEach((cell) => {
        const td = document.createElement("td");
        td.textContent = escapeText(cell);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    output.appendChild(table);
    scrollBottom();
  }

  function addCommandEcho(command) {
    addLine(`┌──(logan㉿cmx-node)-[~/brief]`);
    addLine(`└─$ ${command}`, "command");
  }

  function updateClock() {
    clock.textContent = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "short"
    }).format(new Date());
  }

  function setPrompt(top, bottom, placeholder = "", password = false) {
    promptLabel.innerHTML = "";
    const topSpan = document.createElement("span");
    topSpan.className = "prompt-top";
    topSpan.textContent = top;
    const bottomSpan = document.createElement("span");
    bottomSpan.className = "prompt-bottom";
    bottomSpan.textContent = bottom;
    promptLabel.append(topSpan, bottomSpan);
    input.placeholder = placeholder;
    input.type = password ? "password" : "text";
    document.body.classList.toggle("password-mode", password);
    requestAnimationFrame(() => input.focus());
  }

  function setShellPrompt() {
    setPrompt("┌──(logan㉿cmx-node)-[~/brief]", "└─$", "type help");
  }

  function setPasswordPrompt() {
    setPrompt("┌──(admin㉿cmx-node)-[/secure/logan]", "└─Password:", "", true);
  }

  function setChallengePrompt() {
    setPrompt(`┌──(security-check㉿cmx-node)-[question-${challengeIndex + 1}]`, "└─answer [a/b/c]:", "a, b, or c");
  }

  function fromBase64(value) {
    const binary = atob(value);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  }

  function toBase64(bytes) {
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }

  async function deriveVerifier(password) {
    const material = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: fromBase64(SALT_B64),
        iterations: ITERATIONS
      },
      material,
      256
    );
    return toBase64(new Uint8Array(bits));
  }

  function constantTimeEqual(left, right) {
    if (left.length !== right.length) return false;
    let difference = 0;
    for (let index = 0; index < left.length; index += 1) {
      difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
    }
    return difference === 0;
  }

  function readGateState() {
    try {
      return JSON.parse(localStorage.getItem(STATE_KEY) || "{}") || {};
    } catch {
      return {};
    }
  }

  function saveGateState(state) {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }

  function boot() {
    output.innerHTML = "";
    addLine("CMX RESTRICTED NODE / LOGAN TERMINAL", "strong");
    addLine("Copyright (c) 2026 CMX Global LLC");
    addLine("");
    addLine("[    0.000000 ] Linux cmx-node 6.12.0-amd64");
    addLine("[    0.082113 ] mounting /briefs/logan");
    addLine("[    0.194201 ] loading Nacogdoches intelligence dataset");
    addLine("[    0.311904 ] loading Texas firearms and hunting watch");
    addLine("[    0.447188 ] loading operator profile: army-veteran / bartender / cmx-friend");
    addLine("[    0.601037 ] network interfaces restricted");
    addLine("[    0.778502 ] authentication service ready");
    addLine("");
    addLine("Unauthorized access is prohibited.");
    addLine("This browser gate is a deterrent. Real confidentiality requires the planned server and Cloudflare Access.", "dim");
    addLine("");
    addLine("login: admin");
    mode = "password";
    setPasswordPrompt();
  }

  async function authenticate(password) {
    const state = readGateState();
    const remaining = Math.ceil((Number(state.lockedUntil || 0) - Date.now()) / 1000);

    if (remaining > 0) {
      addLine(`Access temporarily suspended. Retry in ${remaining}s.`, "error");
      return;
    }

    if (!password) {
      addLine("Password required.", "error");
      return;
    }

    addLine("verifying credential...", "dim");
    input.disabled = true;

    try {
      const candidate = await deriveVerifier(password);
      const valid = constantTimeEqual(candidate, VERIFIER_B64);

      if (!valid) {
        state.failures = Number(state.failures || 0) + 1;
        const lockSeconds = state.failures >= 10 ? 300 : state.failures >= 5 ? 30 : 0;
        state.lockedUntil = lockSeconds ? Date.now() + lockSeconds * 1000 : 0;
        saveGateState(state);
        addLine(lockSeconds ? `Access denied. Retry in ${lockSeconds}s.` : "Access denied.", "error");
        return;
      }

      saveGateState({ failures: 0, lockedUntil: 0, lastLogin: new Date().toISOString() });
      addLine("credential accepted", "strong");
      addLine("executing: sudo /usr/local/bin/firearm-safety-check");
      beginChallenge();
    } catch {
      addLine("Authentication failed.", "error");
    } finally {
      input.disabled = false;
      input.value = "";
      input.focus();
    }
  }

  function beginChallenge() {
    mode = "challenge";
    challengeIndex = 0;
    challengeAnswers = [];
    addHeader("firearm safety authorization", "Three simple questions. Enter a, b, or c.");
    printChallenge();
  }

  function printChallenge() {
    const item = challenge[challengeIndex];
    addLine(`[${challengeIndex + 1}/3] ${item.question}`, "strong");
    item.options.forEach((option) => addLine(option, "indent"));
    setChallengePrompt();
  }

  function answerChallenge(answer) {
    const normalized = answer.trim().toLowerCase();
    if (!["a", "b", "c"].includes(normalized)) {
      addLine("Enter a, b, or c.", "error");
      return;
    }

    challengeAnswers.push(normalized);
    addLine(`answer: ${normalized}`);
    challengeIndex += 1;

    if (challengeIndex < challenge.length) {
      addLine("");
      printChallenge();
      return;
    }

    const score = challenge.reduce(
      (total, item, index) => total + (challengeAnswers[index] === item.answer ? 1 : 0),
      0
    );

    if (score !== challenge.length) {
      addLine("");
      addLine(`authorization denied: ${score}/3 correct`, "error");
      addLine("Review the universal safety rules and run the check again.");
      challengeIndex = 0;
      challengeAnswers = [];
      addLine("");
      printChallenge();
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "granted");
    mode = "shell";
    addLine("");
    addLine("firearm-safety baseline confirmed", "strong");
    addLine("access granted");
    addLine("");
    showMotd();
    setShellPrompt();
  }

  function showMotd() {
    addRule("═");
    addLine(`LOGAN TERMINAL BRIEF / ${data.date.toUpperCase()}`, "strong");
    addLine(`${data.location} | edition ${data.edition} | refreshed ${data.updated}`);
    addLine("Type 'help' for commands. Type 'brief' for the useful stuff first.");
    addLine("Use Arrow Up and Arrow Down for history. Use Tab for completion. Ctrl+L clears the screen.", "dim");
    addRule("═");
  }

  function commandHelp() {
    addHeader("available commands", "Everything on this page is accessed through the shell.");
    addTable(
      ["COMMAND", "PURPOSE"],
      [
        ["brief", "Today's concise operator briefing"],
        ["all", "Print every major briefing section"],
        ["news [category]", "News. Categories: all, local, guns, texas, weather, fun"],
        ["weather", "Nacogdoches weather snapshot"],
        ["timeline", "Today's local timeline"],
        ["guns", "Firearms, hunting dates, draw watch, and legal note"],
        ["safety", "Universal firearm-safety refresher"],
        ["missions", "Three practical priorities for today"],
        ["shift", "Bartender shift intelligence"],
        ["bar-tip", "Daily bar improvement tip"],
        ["tips <hours> <rate> <reserve>", "Estimate gross tips and after-reserve amount"],
        ["social", "A random light conversation opener"],
        ["media", "Jay's song choice and recent Spotify rotation"],
        ["friendship", "Why Jay made this for Logan"],
        ["platform", "Plain-English frontend, backend, AI, MCP, and server plan"],
        ["capabilities", "What this platform can actually do with permission"],
        ["pages", "Load the current db.cmxchat.com route registry"],
        ["questions", "Information Logan can provide for better daily briefs"],
        ["sources", "Public-source ledger"],
        ["open <target>", "Open spotify, youtube, directory, a source ID, or a /route/"],
        ["status | neofetch", "Terminal and briefing status"],
        ["ls | tree | cat <file>", "Linux-style navigation"],
        ["history", "Command history"],
        ["clear", "Clear terminal output"],
        ["relock | exit", "Destroy this browser session and return to login"]
      ]
    );
  }

  function commandBrief() {
    addHeader("today's field brief", `${data.location} | ${data.date}`);
    addLine(`Weather: ${data.weather.summary}; high ${data.weather.high} F; feels like ${data.weather.feelsLike} F; sunset ${data.weather.sunset}.`);
    addLine("Priority 1: Check whether home or work is inside the active boil-water notice area.");
    addLine("Priority 2: Hydrate before the hottest part of the day.");
    addLine("Priority 3: New Texas recreational-license ID validation begins August 3.");
    addLine("Priority 4: August 15 is the next major hunting-license and drawn-hunt date.");
    addLine("");
    data.news.slice(0, 5).forEach((item, index) => {
      addLine(`${String(index + 1).padStart(2, "0")} [${item.priority}] ${item.title}`, "strong");
      addLine(item.summary, "indent");
    });
    addLine("");
    addLine("Run: news, guns, timeline, shift, media, platform, or all");
  }

  function commandNews(category = "all") {
    const allowed = ["all", "local", "guns", "texas", "weather", "fun"];
    const normalized = allowed.includes(category) ? category : "all";
    const items = normalized === "all" ? data.news : data.news.filter((item) => item.category === normalized);
    addHeader(`${normalized} news`, `${items.length} item${items.length === 1 ? "" : "s"} loaded`);
    items.forEach((item, index) => {
      addLine(`${String(index + 1).padStart(2, "0")} [${item.priority}] ${item.title}`, "strong");
      addLine(item.summary, "indent");
      addLine(`why_it_matters: ${item.why}`, "double-indent dim");
      addLine(`source: ${item.source}`, "double-indent faint");
      addLine("");
    });
  }

  function commandWeather() {
    addHeader("nacogdoches weather");
    addLine(`condition : ${data.weather.summary}`);
    addLine(`high      : ${data.weather.high} F`);
    addLine(`low       : ${data.weather.low} F`);
    addLine(`feels_like: ${data.weather.feelsLike} F`);
    addLine(`sunset    : ${data.weather.sunset}`);
    addLine("");
    addLine("operator_note: Hydration and vehicle or pet heat checks matter more than weather-app theatrics.");
  }

  function commandTimeline() {
    addHeader("today's timeline");
    addTable(["TIME", "EVENT", "DETAIL"], data.timeline);
  }

  function commandGuns() {
    addHeader("firearms and hunting watch", "Official-source summary. Verify the exact rule for the exact situation.");
    addTable(["DATE", "ITEM", "DETAIL"], data.gunDates);
    addLine("Gus Engeling WMA archery-deer draw:", "strong");
    addLine("50 permits listed; August 15 deadline; $3 application; extended-hunt fee may apply if selected.", "indent");
    addLine("Last year's listed success rate was 13 percent. That is context, not a prediction.", "indent dim");
    addLine("");
    addLine("legal_note: This is not legal advice, a carry-permission map, or a substitute for TPWD, DPS, ATF, property-owner, range, or attorney guidance.", "dim");
  }

  function commandSafety() {
    addHeader("firearm safety refresher");
    data.safetyRules.forEach((rule, index) => addLine(`${index + 1}. ${rule}`));
  }

  function commandMissions() {
    addHeader("commander's intent", "Three priorities. Everything else can wait.");
    data.missions.forEach(([id, title, text]) => {
      addLine(`${id} ${title.toUpperCase()}`, "strong");
      addLine(text, "indent");
      addLine("");
    });
  }

  function commandShift() {
    addHeader("bartender shift intelligence");
    addLine("environment : August heat outside; controlled chaos inside.");
    addLine("nightlife   : Historic downtown remains the obvious local zone for drinks, music, and foot traffic.");
    addLine("pre-shift   : water, food, cash setup, clean tools, stocked backups, and one clear sales focus.");
    addLine("after-shift : count cash once, reserve taxes, hydrate, eat, and avoid emotional accounting.");
    addLine("");
    addLine("Try: tips 8 30 20");
    addLine("Run: bar-tip");
  }

  function commandBarTip() {
    addHeader(`daily bar tip: ${data.barTip.title}`);
    addLine(data.barTip.text);
    addLine("");
    addLine(`why_it_works: ${data.barTip.why}`);
    addLine(`privacy_boundary: ${data.barTip.boundary}`, "dim");
  }

  function commandTips(args) {
    const hours = Number(args[0] ?? 8);
    const rate = Number(args[1] ?? 30);
    const reserve = Number(args[2] ?? 20);

    if (![hours, rate, reserve].every(Number.isFinite) || hours < 0 || rate < 0 || reserve < 0 || reserve > 100) {
      addLine("usage: tips <hours> <tips-per-hour> <reserve-percent>", "error");
      addLine("example: tips 8 30 20");
      return;
    }

    const gross = hours * rate;
    const afterReserve = gross * (1 - reserve / 100);
    addHeader("tip-run estimate");
    addLine(`shift_hours       : ${hours}`);
    addLine(`tips_per_hour     : $${rate.toFixed(2)}`);
    addLine(`gross_tips        : $${gross.toFixed(2)}`);
    addLine(`reserve_percent   : ${reserve}%`);
    addLine(`after_reserve     : $${afterReserve.toFixed(2)}`, "strong");
    addLine("scenario_only     : actual tips, taxes, tip-outs, wages, and reporting rules vary.", "dim");
  }

  function commandSocial() {
    const opener = data.socialOpeners[Math.floor(Math.random() * data.socialOpeners.length)];
    addHeader("social radar");
    addLine(opener, "strong");
    addLine("");
    addLine("operator_note: Ask it naturally. Do not sound like a chatbot wearing cologne.", "dim");
  }

  function commandMedia() {
    addHeader("jay's media drop");
    addLine(`selected_track: ${data.media.chosen.title}`);
    addLine(`artist        : ${data.media.chosen.artist}`);
    addLine(`why           : ${data.media.chosen.reason}`);
    addLine("");
    addLine("Run 'open spotify' or 'open youtube'.");
    addLine("");
    addLine("Recent Spotify rotation:", "strong");
    data.media.recent.forEach(([title, artist], index) => {
      addLine(`${String(index + 1).padStart(2, "0")} ${title} / ${artist}`);
    });
  }

  function commandFriendship() {
    addHeader("why this terminal exists");
    addLine(data.friendship);
    addLine("");
    addLine("Logan helped build the social foundation. Jay is now trying to build the technical foundation around it.");
    addLine("The goal is to turn trusted relationships, useful information, and CMX history into private tools that actually help people.");
  }

  function commandPlatform() {
    addHeader("what jay is building", "The simple version of the frontend, backend, AI, and infrastructure plan.");
    data.platform.forEach(([name, title, text], index) => {
      addLine(`${String(index + 1).padStart(2, "0")} ${name} / ${title}`, "strong");
      addLine(text, "indent");
      addLine("");
    });
    addLine("REQUEST FLOW", "strong");
    addLine("1. Logan asks in normal language.");
    addLine("2. AI checks identity, permission, and available context.");
    addLine("3. AI calls only approved tools or connectors.");
    addLine("4. The backend performs the controlled work.");
    addLine("5. The result goes to a staging preview.");
    addLine("6. Jay or Logan approves it before production.");
    addLine("7. GitHub records what changed and preserves rollback.");
    addLine("");
    addLine("current_truth: This terminal is still a static GitHub Pages interface. Real authentication, private data, databases, AI actions, and automation require the planned FastAPI server and Cloudflare identity layer.", "dim");
  }

  function commandCapabilities() {
    addHeader("what the full platform can do", "Only with explicit authorization and the required connected services.");
    data.capabilities.forEach((item, index) => addLine(`${String(index + 1).padStart(2, "0")}. ${item}`));
  }

  async function fetchRoutes() {
    if (routeCache) return routeCache;
    const response = await fetch("/assets/cmx-routes.json?v=14", {
      cache: "no-store",
      credentials: "same-origin"
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    routeCache = await response.json();
    return routeCache;
  }

  async function commandPages() {
    addHeader("cmx route registry", "Loading the current source of truth...");
    try {
      const registry = await fetchRoutes();
      const rows = registry.routes.map((route) => [
        route.path,
        route.name,
        route.status,
        route.visibility
      ]);
      addTable(["PATH", "NAME", "STATUS", "VISIBILITY"], rows);
      addLine("Use: open /route/");
    } catch (error) {
      addLine(`route registry unavailable: ${error.message}`, "error");
      addLine("Try: open directory");
    }
  }

  function commandQuestions() {
    addHeader("logan profile questions", "Answering these lets future editions become genuinely personal.");
    data.questions.forEach((question, index) => addLine(`${String(index + 1).padStart(2, "0")}. ${question}`));
    addLine("");
    addLine("Send the answers to Jay. Do not paste passwords, account numbers, private access tokens, or anything you would not want stored.");
  }

  function commandSources() {
    addHeader("source ledger");
    data.sources.forEach(([id, name, title, url]) => {
      addLine(`[${id}] ${name} / ${title}`, "strong");
      addLinkLine("    ", url, url);
    });
  }

  function commandStatus() {
    addHeader("system status");
    addLine("           .-------------------------.");
    addLine("           | LOGAN / CMX NODE        |");
    addLine("           '-------------------------'");
    addLine(`user       : logan`);
    addLine(`host       : cmx-node`);
    addLine(`shell      : logan-brief 1.0`);
    addLine(`location   : ${data.location}`);
    addLine(`edition    : ${data.edition}`);
    addLine(`brief_date : ${data.date}`);
    addLine(`updated    : ${data.updated}`);
    addLine(`interface  : static GitHub Pages terminal`);
    addLine(`auth       : client-side PBKDF2 gate plus safety check`);
    addLine(`backend    : planned FastAPI / Linux / Cloudflare`);
    addLine(`theme      : black / white / text-only`);
  }

  function commandWhoami() {
    addHeader("operator profile");
    addLine("name       : Logan");
    addLine("location   : Nacogdoches, Texas");
    addLine("background : United States Army veteran");
    addLine("work       : bartender");
    addLine("interests  : firearms, hunting, Texas, music, women, practical local intelligence");
    addLine("cmx_role   : early social-side contributor and long-time friend since the COVID era");
    addLine("access     : trusted briefing user");
  }

  function commandLs() {
    addLine("brief/  intel/  texas/  guns/  shift/  media/  platform/  sources/  profile/");
  }

  function commandTree() {
    addLine(".");
    addLine("├── brief");
    addLine("│   ├── today.txt");
    addLine("│   ├── timeline.log");
    addLine("│   └── missions.txt");
    addLine("├── intel");
    addLine("│   ├── local.news");
    addLine("│   ├── texas.news");
    addLine("│   └── weather.txt");
    addLine("├── guns");
    addLine("│   ├── deadlines.txt");
    addLine("│   └── safety.rules");
    addLine("├── shift");
    addLine("│   ├── bartender.txt");
    addLine("│   └── daily-tip.txt");
    addLine("├── media");
    addLine("│   ├── selected-track.txt");
    addLine("│   └── recent-rotation.txt");
    addLine("├── platform");
    addLine("│   ├── architecture.txt");
    addLine("│   ├── capabilities.txt");
    addLine("│   └── routes.json");
    addLine("└── profile");
    addLine("    ├── friendship.txt");
    addLine("    └── questions.txt");
  }

  async function commandCat(target = "") {
    const normalized = target.replace(/^\.?\//, "").toLowerCase();
    const map = {
      "brief/today.txt": commandBrief,
      "brief/timeline.log": commandTimeline,
      "brief/missions.txt": commandMissions,
      "intel/local.news": () => commandNews("local"),
      "intel/texas.news": () => commandNews("texas"),
      "intel/weather.txt": commandWeather,
      "guns/deadlines.txt": commandGuns,
      "guns/safety.rules": commandSafety,
      "shift/bartender.txt": commandShift,
      "shift/daily-tip.txt": commandBarTip,
      "media/selected-track.txt": commandMedia,
      "media/recent-rotation.txt": commandMedia,
      "platform/architecture.txt": commandPlatform,
      "platform/capabilities.txt": commandCapabilities,
      "platform/routes.json": commandPages,
      "profile/friendship.txt": commandFriendship,
      "profile/questions.txt": commandQuestions
    };
    const handler = map[normalized];
    if (!handler) {
      addLine(`cat: ${target || "missing operand"}: No such file or command mapping`, "error");
      addLine("Run 'tree' to view available pseudo-files.");
      return;
    }
    await handler();
  }

  function showHistory() {
    addHeader("command history");
    commandHistory.forEach((item, index) => addLine(`${String(index + 1).padStart(4, " ")}  ${item}`));
  }

  function findSource(id) {
    return data.sources.find((source) => source[0] === id);
  }

  async function commandOpen(target = "") {
    const normalized = target.trim();
    let url = "";

    if (normalized === "spotify") url = data.media.chosen.spotify;
    else if (normalized === "youtube") url = data.media.chosen.youtube;
    else if (normalized === "directory") url = "/directory/";
    else if (normalized.startsWith("/")) url = normalized;
    else {
      const source = findSource(normalized);
      if (source) url = source[3];
    }

    if (!url) {
      addLine("usage: open spotify | youtube | directory | <source-id> | /route/", "error");
      return;
    }

    addLine(`opening ${url}`);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function commandMan(target = "") {
    const manuals = {
      news: "news [all|local|guns|texas|weather|fun] prints researched briefing items and source IDs.",
      tips: "tips <hours> <tips-per-hour> <reserve-percent> calculates gross tips and the amount remaining after a planning reserve.",
      open: "open <target> opens spotify, youtube, directory, a source ID, or a db.cmxchat.com route.",
      cat: "cat <pseudo-file> prints a briefing section. Run tree to see available files.",
      pages: "pages fetches /assets/cmx-routes.json and prints the current CMX route registry.",
      platform: "platform explains the frontend, FastAPI backend, PostgreSQL, AI, MCP, GitHub, staging, Linux, and Cloudflare plan."
    };
    addHeader(`manual: ${target || "logan-terminal"}`);
    addLine(manuals[target] || "Run 'help' for the command list. This shell is a controlled briefing interface, not a real operating-system terminal.");
  }

  async function commandAll() {
    commandBrief();
    commandNews("all");
    commandWeather();
    commandTimeline();
    commandGuns();
    commandSafety();
    commandMissions();
    commandShift();
    commandBarTip();
    commandMedia();
    commandFriendship();
    commandPlatform();
    commandCapabilities();
    await commandPages();
    commandQuestions();
    commandSources();
  }

  async function execute(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    addCommandEcho(trimmed);
    commandHistory.push(trimmed);
    historyIndex = commandHistory.length;

    const parts = trimmed.split(/\s+/);
    let command = parts.shift().toLowerCase();
    command = aliases[command] || command;
    const args = parts;

    switch (command) {
      case "help":
        commandHelp();
        break;
      case "man":
        commandMan((args[0] || "").toLowerCase());
        break;
      case "brief":
        commandBrief();
        break;
      case "all":
        await commandAll();
        break;
      case "news":
        commandNews((args[0] || "all").toLowerCase());
        break;
      case "local":
        commandNews("local");
        break;
      case "weather":
        commandWeather();
        break;
      case "timeline":
        commandTimeline();
        break;
      case "guns":
        commandGuns();
        break;
      case "safety":
        commandSafety();
        break;
      case "missions":
        commandMissions();
        break;
      case "shift":
        commandShift();
        break;
      case "bar-tip":
        commandBarTip();
        break;
      case "tips":
        commandTips(args);
        break;
      case "social":
        commandSocial();
        break;
      case "media":
        commandMedia();
        break;
      case "friendship":
        commandFriendship();
        break;
      case "platform":
        commandPlatform();
        break;
      case "capabilities":
        commandCapabilities();
        break;
      case "pages":
        await commandPages();
        break;
      case "questions":
        commandQuestions();
        break;
      case "sources":
        commandSources();
        break;
      case "open":
        await commandOpen(args.join(" "));
        break;
      case "status":
      case "neofetch":
        commandStatus();
        break;
      case "whoami":
        commandWhoami();
        break;
      case "date":
        addLine(new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Chicago",
          dateStyle: "full",
          timeStyle: "long"
        }).format(new Date()));
        break;
      case "pwd":
        addLine("/home/logan/brief");
        break;
      case "ls":
        commandLs();
        break;
      case "tree":
        commandTree();
        break;
      case "cat":
        await commandCat(args.join(" "));
        break;
      case "history":
        showHistory();
        break;
      case "clear":
        output.innerHTML = "";
        break;
      case "relock":
      case "exit":
        sessionStorage.removeItem(SESSION_KEY);
        output.innerHTML = "";
        addLine("session destroyed");
        addLine("returning to login...");
        setTimeout(boot, 350);
        break;
      default:
        addLine(`${command}: command not found`, "error");
        addLine("Type 'help' to list available commands.");
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const value = input.value;
    input.value = "";

    if (mode === "password") {
      await authenticate(value);
      return;
    }

    if (mode === "challenge") {
      answerChallenge(value);
      return;
    }

    if (mode === "shell") {
      await execute(value);
    }
  });

  input.addEventListener("keydown", (event) => {
    if (mode !== "shell") return;

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!commandHistory.length) return;
      historyIndex = Math.max(0, historyIndex - 1);
      input.value = commandHistory[historyIndex] || "";
      input.setSelectionRange(input.value.length, input.value.length);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!commandHistory.length) return;
      historyIndex = Math.min(commandHistory.length, historyIndex + 1);
      input.value = commandHistory[historyIndex] || "";
      input.setSelectionRange(input.value.length, input.value.length);
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const typed = input.value.trim().toLowerCase();
      if (!typed || typed.includes(" ")) return;
      const matches = commands.filter((command) => command.startsWith(typed));
      if (matches.length === 1) input.value = matches[0];
      else if (matches.length > 1) addLine(matches.join("  "), "dim");
    }

    if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      output.innerHTML = "";
    }
  });

  document.addEventListener("click", () => input.focus());
  window.addEventListener("pageshow", () => input.focus());

  updateClock();
  setInterval(updateClock, 1000);

  if (!data) {
    addLine("fatal: briefing dataset unavailable", "error");
    return;
  }

  if (sessionStorage.getItem(SESSION_KEY) === "granted") {
    mode = "shell";
    showMotd();
    setShellPrompt();
  } else {
    boot();
  }
})();
