(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let scrollQueued = false;
  let navObserver;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  function rewriteVoice() {
    const explore = $("#explore");
    if (explore) {
      const heading = $(".section-head h2", explore);
      const copy = $(".section-head > p", explore);
      if (heading && heading.textContent !== "Explore the complete CMX platform.") {
        heading.textContent = "Explore the complete CMX platform.";
      }
      if (copy) {
        const directCopy = "Start with the recommended path, then reveal the complete project map. Each page opens a different part of the tools, infrastructure, research, AI planning and experiments behind the platform.";
        if (copy.textContent !== directCopy) copy.textContent = directCopy;
      }
    }

    const heroTitle = $("#welcome h1");
    if (heroTitle) {
      const hour = Number(new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        hour12: false
      }).format(new Date()));
      const daypart = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
      const greeting = `Good ${daypart}, Debbie.`;
      if (heroTitle.textContent !== greeting) heroTitle.textContent = greeting;
    }

    const replacements = new Map([
      ["Every CMX page she can explore.", "Explore the complete CMX platform."],
      ["The map below matches the larger platform map used elsewhere, with private personal briefings removed. Finished tools, plans and experiments are labeled honestly.", "Start with the recommended path, then reveal the complete project map. Each page opens a different part of the tools, infrastructure, research, AI planning and experiments behind the platform."],
      ["The personal Logan and Crystal briefings are intentionally excluded from Debbie's map.", ""]
    ]);

    const walker = document.createTreeWalker(document.getElementById("app") || document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const clean = node.nodeValue.trim();
      if (replacements.has(clean)) node.nodeValue = node.nodeValue.replace(clean, replacements.get(clean));
    }
  }

  function addHeroAmbient() {
    const hero = $("#welcome");
    if (!hero || $(".hero-ambient", hero)) return;

    const ambient = document.createElement("div");
    ambient.className = "hero-ambient";
    ambient.setAttribute("aria-hidden", "true");

    const positions = [
      [10, 22, 3, 10, -2], [19, 68, 5, 14, -7], [31, 36, 3, 12, -4], [43, 17, 4, 16, -10],
      [54, 74, 3, 11, -6], [64, 29, 5, 15, -9], [72, 57, 3, 13, -1], [83, 19, 4, 17, -12],
      [89, 71, 3, 12, -5], [25, 84, 4, 18, -8], [58, 48, 2, 10, -3], [76, 87, 4, 16, -11]
    ];
    positions.forEach(([x, y, size, speed, delay]) => {
      const mote = document.createElement("i");
      mote.className = "hero-mote";
      mote.style.setProperty("--mote-x", `${x}%`);
      mote.style.setProperty("--mote-y", `${y}%`);
      mote.style.setProperty("--mote-size", `${size}px`);
      mote.style.setProperty("--mote-speed", `${speed}s`);
      mote.style.setProperty("--mote-delay", `${delay}s`);
      ambient.appendChild(mote);
    });
    hero.prepend(ambient);
  }

  function addSunOrbit() {
    const stage = $(".sun-stage");
    if (!stage || $(".sun-orbit-marker", stage)) return;
    const orbit = document.createElement("div");
    orbit.className = "sun-orbit-marker";
    orbit.setAttribute("aria-hidden", "true");
    orbit.innerHTML = "<i></i><i></i><i></i>";
    stage.appendChild(orbit);
  }

  function prepareSpotlights(root = document) {
    if (!finePointer || reducedMotion) return;
    const selector = [
      ".news-card", ".song-card", ".scrabble-card", ".mystery-card", ".analogy-card",
      ".project-card", ".route-card", ".preview-panel", ".controls-panel", ".pattern-panel",
      ".roadmap-detail", ".horoscope-result", ".current-watch-card", ".video-card", ".weather-shell"
    ].join(",");

    $$(selector, root).forEach(card => {
      if (card.classList.contains("epic-spotlight")) return;
      card.classList.add("epic-spotlight");
      const light = document.createElement("span");
      light.className = "epic-card-light";
      light.setAttribute("aria-hidden", "true");
      card.appendChild(light);
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
      }, { passive: true });
    });
  }

  function prepareRevealRhythm(root = document) {
    const groups = [
      ".news-grid", ".play-grid", ".analogy-grid", ".recommended-grid", ".route-grid", ".zodiac-grid", ".roadmap"
    ];
    groups.forEach(selector => {
      $$(selector, root).forEach(group => {
        Array.from(group.children).forEach((child, index) => {
          child.style.setProperty("--reveal-delay", `${Math.min(index, 8) * 55}ms`);
        });
      });
    });
  }

  function addHoroscopeBurst(event) {
    const button = event.target.closest(".zodiac-button");
    if (!button || reducedMotion) return;
    for (let index = 0; index < 10; index += 1) {
      const angle = (Math.PI * 2 * index) / 10;
      const distance = 34 + (index % 3) * 9;
      const spark = document.createElement("i");
      spark.className = "zodiac-spark";
      spark.style.setProperty("--spark-x", `${Math.cos(angle) * distance}px`);
      spark.style.setProperty("--spark-y", `${Math.sin(angle) * distance}px`);
      button.appendChild(spark);
      window.setTimeout(() => spark.remove(), 700);
    }
  }

  function updateScrollEffects() {
    scrollQueued = false;
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    const hero = $("#welcome");
    const weather = $("#weather");

    if (hero) {
      const rect = hero.getBoundingClientRect();
      const progress = clamp(-rect.top / Math.max(rect.height, 1));
      hero.style.setProperty("--hero-scroll", progress.toFixed(3));
      const x = 72 - progress * 14;
      const y = 24 + progress * 11;
      hero.style.setProperty("--daylight-x", `${x}%`);
      hero.style.setProperty("--daylight-y", `${y}%`);
    }

    if (weather) {
      const rect = weather.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = Math.abs(center - viewport / 2);
      const visibility = 1 - clamp(distance / Math.max(viewport * 0.9, rect.height * 0.58));
      const stage = $(".sun-stage", weather);
      weather.style.setProperty("--weather-light", visibility.toFixed(3));
      if (stage) {
        stage.style.setProperty("--sun-scale", (0.94 + visibility * 0.11).toFixed(3));
        stage.style.setProperty("--sun-glow", (0.18 + visibility * 0.34).toFixed(3));
        stage.style.setProperty("--sun-ring-turn", `${visibility * 16}deg`);
      }
    }
  }

  function queueScrollEffects() {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(updateScrollEffects);
  }

  function setupActiveNavigation() {
    if (navObserver) navObserver.disconnect();
    const links = $$(".topbar nav a[href^='#']");
    const pairs = links.map(link => [link, document.querySelector(link.getAttribute("href"))]).filter(([, section]) => section);
    if (!pairs.length) return;

    navObserver = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      pairs.forEach(([link, section]) => link.classList.toggle("is-current", section === visible.target));
    }, { rootMargin: "-22% 0px -63%", threshold: [0.02, 0.2, 0.45] });
    pairs.forEach(([, section]) => navObserver.observe(section));
  }

  function animateNewsFilter(event) {
    if (!event.target.closest("#newsFilters button") || reducedMotion) return;
    requestAnimationFrame(() => {
      $$("#newsGrid .news-card:not([hidden])").forEach((card, index) => {
        card.animate([
          { opacity: 0, transform: "translateY(12px) scale(.985)" },
          { opacity: 1, transform: "none" }
        ], { duration: 320, delay: index * 45, easing: "cubic-bezier(.2,.75,.2,1)", fill: "both" });
      });
    });
  }

  function enhance() {
    rewriteVoice();
    addHeroAmbient();
    addSunOrbit();
    prepareSpotlights();
    prepareRevealRhythm();
    setupActiveNavigation();
    updateScrollEffects();
  }

  function start() {
    enhance();
    document.addEventListener("click", addHoroscopeBurst);
    document.addEventListener("click", animateNewsFilter);
    window.addEventListener("scroll", queueScrollEffects, { passive: true });
    window.addEventListener("resize", queueScrollEffects);

    const observer = new MutationObserver(() => {
      rewriteVoice();
      addSunOrbit();
      prepareSpotlights();
      prepareRevealRhythm();
      setupActiveNavigation();
      queueScrollEffects();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 18000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();