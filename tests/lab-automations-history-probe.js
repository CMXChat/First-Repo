(() => {
  "use strict";

  const root = document.documentElement;
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  async function waitFor(check, timeout = 5000) {
    const started = Date.now();
    while (Date.now() - started < timeout) {
      const value = check();
      if (value) return value;
      await sleep(40);
    }
    throw new Error("Timed out waiting for Automations history state");
  }

  async function run() {
    try {
      await waitFor(() => root.dataset.labAutomationsHistory === "ready");
      const opener = await waitFor(() => document.querySelector("[data-open]"));
      root.dataset.qaHistoryDashboardStart = String(Boolean(document.querySelector(".v3-dashboard")));

      opener.click();
      await waitFor(() => document.querySelector(".v3-editor-page"));
      await sleep(180);
      root.dataset.qaHistoryEditorOpened = "true";

      const stageOne = await waitFor(() => document.querySelector('[data-stage="1"]'));
      stageOne.click();
      await waitFor(() => document.querySelector('[data-stage="1"].is-current'));
      await sleep(180);
      root.dataset.qaHistoryStageAdvanced = "true";

      history.back();
      await waitFor(() => document.querySelector('[data-stage="0"].is-current'));
      await sleep(120);
      root.dataset.qaHistoryBackStage = "true";

      history.back();
      await waitFor(() => document.querySelector(".v3-dashboard"));
      await sleep(120);
      root.dataset.qaHistoryBackDashboard = "true";
      root.dataset.qaHistoryComplete = "true";
    } catch (error) {
      root.dataset.qaHistoryComplete = "false";
      root.dataset.qaHistoryFailure = String(error?.message || error || "unknown").slice(0, 180);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => void run(), { once: true });
  else void run();
})();
