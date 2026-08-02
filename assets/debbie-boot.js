(() => {
  "use strict";

  const SESSION_KEY = "debbie_brief_session_v2";

  function getElements() {
    return {
      gate: document.getElementById("accessGate"),
      app: document.getElementById("app"),
      password: document.getElementById("gatePassword")
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

  function start() {
    recoverVisibility();
    window.setTimeout(recoverVisibility, 900);
    window.setTimeout(recoverVisibility, 2200);
    window.addEventListener("pageshow", recoverVisibility);
    window.addEventListener("error", () => window.setTimeout(recoverVisibility, 0));
    window.addEventListener("unhandledrejection", () => window.setTimeout(recoverVisibility, 0));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
