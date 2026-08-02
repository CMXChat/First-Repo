(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const appMain = $("#app main");
  const hero = $("#welcome");
  const play = $("#play");
  const explore = $("#explore");
  if (!appMain || !hero || !play || !explore) return;

  const horoscope = {
    Aries: { dates: "Mar 21 – Apr 19", text: "A change of scenery can reset your mood. Keep the plan simple, step away from needless friction and let movement clear your head." },
    Taurus: { dates: "Apr 20 – May 20", text: "Protect your energy by declining one obligation you do not truly have room for. A quiet break is productive today." },
    Gemini: { dates: "May 21 – Jun 20", text: "You do not have to juggle every responsibility alone. Ask for help, clarify what is actually expected and avoid reading too much into vague reactions." },
    Cancer: { dates: "Jun 21 – Jul 22", text: "Slow and steady works better than forcing momentum. Leave room for one spontaneous pleasure without abandoning the routine that keeps you grounded." },
    Leo: { dates: "Jul 23 – Aug 22", text: "Make room for yourself before solving everyone else's problems. Small emotional drama does not need a full production budget." },
    Virgo: { dates: "Aug 23 – Sep 22", text: "Mixed signals are easy to misread today. Ask a direct question, keep expectations realistic and give yourself permission to rest early." },
    Libra: { dates: "Sep 23 – Oct 22", text: "Be realistic about how much can fit into one day. You can be helpful without taking responsibility for fixing every person and situation." },
    Scorpio: { dates: "Oct 23 – Nov 21", text: "A social misunderstanding may feel larger than it is. Appreciate what you handled well, then verify the facts before reacting." },
    Sagittarius: { dates: "Nov 22 – Dec 21", text: "Food, water and a manageable task list will do more for you than pushing through on enthusiasm alone. Keep your body in the conversation." },
    Capricorn: { dates: "Dec 22 – Jan 19", text: "Rest or reschedule what does not need to happen today. Confusing social signals are not a command to work harder for clarity." },
    Aquarius: { dates: "Jan 20 – Feb 18", text: "Stay flexible with people and careful with impulse spending. An alternate point of view may be useful even when you do not adopt it." },
    Pisces: { dates: "Feb 19 – Mar 20", text: "Prioritize what matters before emotional static fills the day. Your intuition is useful, but it still benefits from a reality check." }
  };

  function makeProgressBar() {
    const progress = document.createElement("div");
    progress.className = "page-progress";
    progress.setAttribute("aria-hidden", "true");
    progress.innerHTML = "<i></i>";
    document.body.prepend(progress);
    const fill = $("i", progress);
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      fill.style.width = `${Math.min(100, (window.scrollY / max) * 100)}%`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function buildWeather() {
    const section = document.createElement("section");
    section.className = "section weather-section motion-reveal";
    section.id = "weather";
    section.innerHTML = `
      <div class="weather-shell interactive-tilt">
        <div class="weather-copy">
          <span class="weather-kicker">BROOKLYN RIGHT NOW</span>
          <h2 class="weather-heading">A sunny Sunday.</h2>
          <p class="weather-summary">Bright, warm and around the low 80s this afternoon. A good day for coffee outside, a walk, or sushi that did not arrive through three separate delivery apps.</p>
          <div class="weather-live"><strong>83°</strong><span id="brooklynClock">--:--:-- PM EDT</span></div>
          <div class="weather-stats">
            <div class="weather-stat"><span>Conditions</span><strong>Sunny</strong></div>
            <div class="weather-stat"><span>Overnight low</span><strong>73°F</strong></div>
            <div class="weather-stat"><span>Sunset</span><strong>8:09 PM</strong></div>
          </div>
          <p class="micro"><a href="https://www.timeanddate.com/weather/usa/brooklyn/hourly" target="_blank" rel="noopener noreferrer">Hourly weather</a> · <a href="https://www.timeanddate.com/sun/usa/brooklyn?month=8" target="_blank" rel="noopener noreferrer">Sun times</a></p>
        </div>
        <div class="sun-stage" aria-hidden="true"><div class="sun-orb"></div><div class="sun-cloud"></div></div>
      </div>`;
    hero.insertAdjacentElement("afterend", section);

    const clock = $("#brooklynClock", section);
    const updateClock = () => {
      clock.textContent = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZoneName: "short"
      }).format(new Date());
    };
    updateClock();
    window.setInterval(updateClock, 1000);
    return section;
  }

  function buildHoroscope(afterNode) {
    const section = document.createElement("section");
    section.className = "section horoscope-section motion-reveal";
    section.id = "horoscope";
    section.innerHTML = `
      <div class="horoscope-shell">
        <div class="horoscope-intro">
          <div><span class="horoscope-kicker">TODAY'S HOROSCOPE</span><h2>Choose your sign.</h2></div>
          <p>August 2 carries restless, emotionally mixed energy. The shared advice is to keep expectations grounded, communication clear and plans simple.</p>
        </div>
        <div class="zodiac-grid" id="zodiacGrid"></div>
        <article class="horoscope-result" id="horoscopeResult" aria-live="polite">
          <span>WAITING FOR YOUR SIGN</span>
          <h3>Pick one above.</h3>
          <p>Only the selected horoscope will appear here.</p>
          <p class="horoscope-note">For entertainment. Based on today's published horoscope coverage from Mecca Woods and PEOPLE.</p>
        </article>
      </div>`;
    afterNode.insertAdjacentElement("afterend", section);

    const grid = $("#zodiacGrid", section);
    const result = $("#horoscopeResult", section);
    Object.entries(horoscope).forEach(([sign, item]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "zodiac-button";
      button.innerHTML = `<b>${sign}</b><small>${item.dates}</small>`;
      button.addEventListener("click", () => {
        $$(".zodiac-button", grid).forEach(candidate => candidate.classList.toggle("active", candidate === button));
        result.innerHTML = `
          <span>${sign.toUpperCase()} · ${item.dates}</span>
          <h3>${sign}'s August 2 reading</h3>
          <p>${item.text}</p>
          <p class="horoscope-note">Entertainment only. <a href="https://www.chron.com/horoscope/article/horoscope-sunday-08-02-26-mecca-woods-22357185.php" target="_blank" rel="noopener noreferrer">Daily source</a> · <a href="https://people.com/daily-horoscope-august-2-2026-12031173" target="_blank" rel="noopener noreferrer">Planetary overview</a></p>`;
        result.animate([{ opacity: 0.45, transform: "translateY(7px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: "ease-out" });
      });
      grid.appendChild(button);
    });
    return section;
  }

  function buildWatchSection() {
    const section = document.createElement("section");
    section.className = "section watch-section motion-reveal";
    section.id = "watch";
    section.innerHTML = `
      <div class="watch-shell">
        <div class="watch-intro">
          <div><span class="watch-kicker">WATCH + FOLLOW</span><h2>A video, with context.</h2></div>
          <p>The video is visible on the page now. The current links beside it are newer, while the embedded FOX 5 clip is clearly marked as background context.</p>
        </div>
        <div class="watch-grid">
          <article class="video-card interactive-tilt">
            <div class="video-frame-shell">
              <iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/Sgmr00nwu14?rel=0&modestbranding=1" title="FOX 5 DC video: Israel on high alert following Iran airstrike" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
            <div class="video-copy">
              <span>YOUTUBE · VERIFIED FOX 5 DC · BACKGROUND CONTEXT</span>
              <h3>Israel on high alert following an Iranian attack</h3>
              <p>This clip is from April 2024 and is included as historical video context, not presented as today's footage.</p>
            </div>
          </article>
          <aside class="current-watch-card">
            <span>CURRENT FOLLOW-UP</span>
            <h3>What is worth watching now</h3>
            <p>These links connect the background video to newer New York and Israel coverage without pretending every update says the same thing.</p>
            <div class="watch-links">
              <a class="watch-link" href="https://nypost.com/2026/08/01/us-news/mamdani-slammed-by-israeli-president-for-antisemetic-rhetoric-after-threatening-netanyahus-arrest/" target="_blank" rel="noopener noreferrer"><strong>Herzog warns about antisemitic rhetoric in New York</strong><small>Published August 1 · based on a Fox News Digital interview</small></a>
              <a class="watch-link" href="https://www.foxnews.com/video/6401839049112/" target="_blank" rel="noopener noreferrer"><strong>Fox video: Mamdani defends call to arrest Netanyahu</strong><small>Current New York and Israel political context</small></a>
              <a class="watch-link" href="https://apnews.com/article/72b1493ca75bb9d4cf195f325d8dc425" target="_blank" rel="noopener noreferrer"><strong>AP: questions around the Hamas disarmament framework</strong><small>A second source for broader context</small></a>
            </div>
          </aside>
        </div>
      </div>`;
    play.insertAdjacentElement("afterend", section);
    return section;
  }

  function rebuildProjectLinks() {
    const root = $("#recommendedProjects");
    if (!root) return;
    const projects = [
      ["/directory/", "Operations Directory", "The quickest index of active tools and places to begin.", "START HERE"],
      ["/architecture/", "Architecture & Learning Center", "A visual explanation of the frontend, Python, databases, AI and deployment.", "UNDERSTAND IT"],
      ["/backend/", "Backend Blueprint", "The protected engine, permissions, data models and API plan behind these pages.", "SEE THE ENGINE"],
      ["/ai/", "AI Control Blueprint", "How normal language, approved tools, memory and human review can work together.", "SEE THE AI PLAN"],
      ["/updates/", "CMX Platform Notes", "What has been built, what remains planned and how the platform is evolving.", "FOLLOW PROGRESS"],
      ["/build/", "Build Lab", "The future control room for health checks, staging, approvals and rollback.", "SEE OPERATIONS"]
    ];
    root.innerHTML = "";
    projects.forEach(([path, name, note, badge]) => {
      const card = document.createElement("a");
      card.className = "project-card motion-reveal";
      card.href = path;
      card.target = "_blank";
      card.rel = "noopener";
      card.innerHTML = `<span>${badge}</span><h3>${name}</h3><p>${note}</p>`;
      root.appendChild(card);
    });

    const heading = $(".section-head h2", explore);
    const copy = $(".section-head > p", explore);
    if (heading) heading.textContent = "Every CMX page she can explore.";
    if (copy) copy.textContent = "The map below matches the larger platform map used elsewhere, with private personal briefings removed. Finished tools, plans and experiments are labeled honestly.";
  }

  function revealFullRouteMap() {
    const toggle = $("#showAllRoutes");
    const grid = $("#routeGrid");
    if (!toggle || !grid) return;

    const cleanRoutes = () => {
      $$("a.route-card", grid).forEach(card => {
        const path = new URL(card.href, location.href).pathname;
        if (["/news/", "/logan/", "/debbie/"].includes(path)) card.remove();
        else card.classList.add("motion-reveal");
      });
      grid.hidden = false;
      grid.classList.add("visible");
      observeReveals(grid);
    };

    const observer = new MutationObserver(cleanRoutes);
    observer.observe(grid, { childList: true });
    if (grid.hidden) toggle.click();
    cleanRoutes();
  }

  let revealObserver;
  function observeReveals(root = document) {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px" });
    }
    $$(".motion-reveal", root).forEach(element => {
      if (!element.classList.contains("is-visible")) revealObserver.observe(element);
    });
  }

  function addMotion() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    [".section-head", ".news-card", ".song-card", ".scrabble-card", ".mystery-card", ".analogy-card", ".project-truth", ".trusted-context", ".prototype-shell", ".pattern-panel", ".roadmap", ".roadmap-detail", ".idea-form", ".closing"].forEach(selector => {
      $$(selector).forEach(element => element.classList.add("motion-reveal"));
    });

    $$(".interactive-tilt").forEach(card => {
      card.addEventListener("pointermove", event => {
        if (event.pointerType === "touch") return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.setProperty("--tilt-y", `${x * 2.4}deg`);
        card.style.setProperty("--tilt-x", `${y * -2.4}deg`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-y", "0deg");
        card.style.setProperty("--tilt-x", "0deg");
      });
    });

    let ticking = false;
    const parallax = () => {
      ticking = false;
      const sun = $(".sun-orb");
      const skyline = $(".skyline");
      if (sun) sun.style.setProperty("--sun-shift", `${Math.max(-18, Math.min(18, (sun.getBoundingClientRect().top - innerHeight / 2) * -0.025))}px`);
      if (skyline) skyline.style.transform = `translate3d(0, ${window.scrollY * 0.055}px, 0)`;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(parallax);
      }
    }, { passive: true });
    parallax();
  }

  function expandNavigation() {
    const nav = $(".topbar nav");
    if (!nav) return;
    const additions = [["#weather", "Weather"], ["#horoscope", "Horoscope"], ["#watch", "Watch"]];
    additions.forEach(([href, label]) => {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      nav.prepend(link);
    });
  }

  makeProgressBar();
  const weatherSection = buildWeather();
  buildHoroscope(weatherSection);
  buildWatchSection();
  rebuildProjectLinks();
  revealFullRouteMap();
  expandNavigation();
  addMotion();
  observeReveals();
})();
