(() => {
  "use strict";

  const SESSION_KEY = "debbie_brief_session_v2";
  let autoplayAttempted = false;
  let loginPrimeActive = false;

  function getElements() {
    return {
      gate: document.getElementById("accessGate"),
      app: document.getElementById("app"),
      password: document.getElementById("gatePassword"),
      form: document.getElementById("gateForm"),
      status: document.getElementById("gateStatus"),
      audio: document.getElementById("dailyAudio")
    };
  }

  function showGate() {
    const { gate, app, password } = getElements();
    if (!gate || !app) return;
    gate.hidden = false;
    gate.classList.remove("unlocked");
    app.classList.remove("active");
    app.setAttribute("aria-hidden", "true");
    app.setAttribute("inert", "");
    document.body.classList.add("locked");
    window.setTimeout(() => password?.focus(), 80);
  }

  function revealApp() {
    const { gate, app } = getElements();
    if (!gate || !app) return;
    document.body.classList.remove("locked");
    app.classList.add("active");
    app.removeAttribute("inert");
    app.setAttribute("aria-hidden", "false");
    gate.classList.add("unlocked");
    window.setTimeout(() => { gate.hidden = true; }, 480);
  }

  function recoverVisibility() {
    const granted = sessionStorage.getItem(SESSION_KEY) === "granted";
    const { gate, app } = getElements();
    if (!gate || !app) return;

    if (granted) {
      if (!app.classList.contains("active") || app.hasAttribute("inert")) revealApp();
      return;
    }

    const gateStyle = getComputedStyle(gate);
    const appStyle = getComputedStyle(app);
    if (gate.hidden || gateStyle.display === "none" || (gateStyle.visibility === "hidden" && appStyle.visibility === "hidden")) {
      showGate();
    }
  }

  function createReadAloudCompatibility(afterElement) {
    let compatibility = document.getElementById("readSummary");
    if (compatibility) return compatibility;

    compatibility = document.createElement("button");
    compatibility.id = "readSummary";
    compatibility.type = "button";
    compatibility.hidden = true;
    compatibility.tabIndex = -1;
    compatibility.setAttribute("aria-hidden", "true");
    afterElement?.after(compatibility);
    return compatibility;
  }

  function restoreHeroMusicButton() {
    const existingMusicButton = document.getElementById("heroMusicToggle");
    if (existingMusicButton) {
      createReadAloudCompatibility(existingMusicButton);
      existingMusicButton.textContent = "Play today's song";
      existingMusicButton.setAttribute("aria-pressed", "false");
      return existingMusicButton;
    }

    const original = document.getElementById("readSummary");
    if (!original) return null;

    const musicButton = original.cloneNode(true);
    musicButton.hidden = false;
    musicButton.removeAttribute("aria-hidden");
    musicButton.removeAttribute("tabindex");
    musicButton.id = "heroMusicToggle";
    musicButton.textContent = "Play today's song";
    musicButton.setAttribute("aria-pressed", "false");
    original.replaceWith(musicButton);
    createReadAloudCompatibility(musicButton);
    return musicButton;
  }

  function syncMusicControls() {
    const { audio } = getElements();
    if (!audio) return;

    const heroButton = document.getElementById("heroMusicToggle");
    const mediaButton = document.getElementById("musicToggle");
    const isPlaying = !audio.paused && !audio.ended;

    if (heroButton) {
      heroButton.textContent = isPlaying ? "Pause today's song" : "Play today's song";
      heroButton.setAttribute("aria-pressed", String(isPlaying));
    }

    if (mediaButton) mediaButton.textContent = isPlaying ? "Pause preview" : "Play preview";
    document.querySelector(".media-card")?.classList.toggle("playing", isPlaying);
  }

  async function startSong({ force = false } = {}) {
    const { audio, app } = getElements();
    if (!audio || !app?.classList.contains("active")) return false;
    if (autoplayAttempted && !force && !audio.paused) return true;

    autoplayAttempted = true;
    audio.muted = false;
    audio.volume = 0.32;

    try {
      await audio.play();
      syncMusicControls();
      return true;
    } catch {
      syncMusicControls();
      return false;
    }
  }

  function stopPrimedAudio() {
    const { audio } = getElements();
    if (!audio || !loginPrimeActive) return;
    loginPrimeActive = false;
    audio.pause();
    audio.currentTime = 0;
    audio.muted = false;
    audio.volume = 0.32;
    syncMusicControls();
  }

  function primeAudioFromLogin() {
    const { audio } = getElements();
    if (!audio) return;

    loginPrimeActive = true;
    audio.muted = true;
    audio.volume = 0;
    audio.currentTime = 0;
    audio.play().catch(() => {
      loginPrimeActive = false;
      audio.muted = false;
      audio.volume = 0.32;
    });
  }

  function finishLoginAutoplay() {
    const { audio } = getElements();
    if (!audio) return;

    loginPrimeActive = false;
    audio.muted = false;
    audio.volume = 0.32;

    if (audio.paused) startSong({ force: true });
    else {
      autoplayAttempted = true;
      syncMusicControls();
    }
  }

  function setupMusic() {
    const { app, form, status, audio } = getElements();
    if (!app || !audio) return;

    if ("speechSynthesis" in window) speechSynthesis.cancel();

    const heroButton = restoreHeroMusicButton();
    heroButton?.addEventListener("click", async () => {
      if (audio.paused) await startSong({ force: true });
      else audio.pause();
      syncMusicControls();
    });

    audio.addEventListener("play", syncMusicControls);
    audio.addEventListener("pause", syncMusicControls);
    audio.addEventListener("ended", syncMusicControls);

    form?.addEventListener("submit", primeAudioFromLogin, true);

    if (status) {
      const statusObserver = new MutationObserver(() => {
        const message = status.textContent.toLowerCase();
        if (message.includes("access denied") || message.includes("authentication failed") || message.includes("try again")) stopPrimedAudio();
      });
      statusObserver.observe(status, { childList: true, characterData: true, subtree: true });
    }

    const appObserver = new MutationObserver(() => {
      if (!app.classList.contains("active")) return;
      if (loginPrimeActive) finishLoginAutoplay();
      else startSong();
    });
    appObserver.observe(app, { attributes: true, attributeFilter: ["class", "aria-hidden", "inert"] });

    if (app.classList.contains("active")) startSong();
    syncMusicControls();
  }

  function start() {
    recoverVisibility();
    setupMusic();
    window.setTimeout(recoverVisibility, 900);
    window.setTimeout(recoverVisibility, 2200);
    window.addEventListener("pageshow", recoverVisibility);
    window.addEventListener("error", () => window.setTimeout(recoverVisibility, 0));
    window.addEventListener("unhandledrejection", () => window.setTimeout(recoverVisibility, 0));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
