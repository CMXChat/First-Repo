(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = value => Math.min(1, Math.max(0, value));
  let queued = false;

  function update() {
    queued = false;
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    const hero = document.getElementById("welcome");
    const weather = document.getElementById("weather");

    if (hero) {
      const rect = hero.getBoundingClientRect();
      const progress = clamp(-rect.top / Math.max(rect.height, 1));
      hero.style.setProperty("--hero-ambient-opacity", (0.7 - progress * 0.35).toFixed(3));
      hero.style.setProperty("--hero-ambient-shift", `${(progress * 34).toFixed(1)}px`);
      hero.style.setProperty("--daylight-x", `${(72 - progress * 14).toFixed(1)}%`);
      hero.style.setProperty("--daylight-y", `${(24 + progress * 11).toFixed(1)}%`);
    }

    if (weather) {
      const rect = weather.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const distance = Math.abs(center - viewport / 2);
      const visibility = 1 - clamp(distance / Math.max(viewport * 0.9, rect.height * 0.58));
      const stage = weather.querySelector(".sun-stage");

      weather.style.setProperty("--weather-sun-alpha", (0.08 + visibility * 0.18).toFixed(3));
      weather.style.setProperty("--weather-blue-alpha", (0.07 + visibility * 0.12).toFixed(3));
      weather.style.setProperty("--weather-halo-size", `${(45 + visibility * 55).toFixed(1)}px`);
      weather.style.setProperty("--weather-halo-alpha", (0.03 + visibility * 0.08).toFixed(3));

      if (stage) {
        stage.style.setProperty("--sun-scale", reducedMotion ? "1" : (0.94 + visibility * 0.11).toFixed(3));
        stage.style.setProperty("--sun-ring-turn", reducedMotion ? "0deg" : `${(visibility * 16).toFixed(1)}deg`);
        stage.style.setProperty("--sun-ring-alpha", (0.08 + visibility * 0.13).toFixed(3));
        stage.style.setProperty("--sun-ring-glow-alpha", (0.06 + visibility * 0.13).toFixed(3));
        stage.style.setProperty("--sun-orbit-alpha", (0.05 + visibility * 0.09).toFixed(3));
        stage.style.setProperty("--sun-main-glow-alpha", (0.32 + visibility * 0.34).toFixed(3));
        stage.style.setProperty("--sun-soft-glow-alpha", (0.12 + visibility * 0.14).toFixed(3));
      }
    }
  }

  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }

  function start() {
    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    const observer = new MutationObserver(queue);
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => observer.disconnect(), 15000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();