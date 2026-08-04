const { test, expect } = require('@playwright/test');

async function enterPersonalBriefing(page) {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('brief-personal-os-test-ready')) {
      localStorage.clear();
      sessionStorage.setItem('brief-personal-os-test-ready', '1');
    }
    localStorage.setItem('cmxBriefDemo:onboarding:tips', 'off');
  });
  await page.goto('/brief/?personal-os-test=1', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#briefEntryRadio')).toBeVisible();
  await page.locator('.brief-entry-radio-card.is-individual').click();
  await expect(page.locator('#enterBrief')).toBeEnabled();
  await page.locator('#enterBrief').click();
  await expect(page.locator('body')).not.toHaveClass(/is-locked/);
  await expect(page.locator('#briefPersonalOS')).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/brief-full-home-ready/);
}

async function reenterAfterReload(page) {
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('#briefEntryRadio')).toBeVisible();
  await page.locator('.brief-entry-radio-card.is-individual').click();
  await page.locator('#enterBrief').click();
  await expect(page.locator('body')).toHaveClass(/brief-full-home-ready/);
}

async function expectNoDocumentScroll(page) {
  const metrics = await page.evaluate(() => ({
    innerHeight: window.innerHeight,
    documentHeight: document.documentElement.scrollHeight,
    bodyHeight: document.body.scrollHeight,
    overflow: getComputedStyle(document.body).overflow
  }));
  expect(metrics.overflow).toBe('hidden');
  expect(metrics.documentHeight).toBeLessThanOrEqual(metrics.innerHeight + 4);
  expect(metrics.bodyHeight).toBeLessThanOrEqual(metrics.innerHeight + 4);
}

test('desktop opens with the full operating picture inside the OS viewport', async ({ page }) => {
  await enterPersonalBriefing(page);

  await expect(page.locator('body')).toHaveClass(/brief-personal-os-ready/);
  await expect(page.locator('body')).toHaveAttribute('data-brief-os-depth', 'full');
  await expect(page.locator('#briefMain')).toBeHidden();
  await expect(page.locator('#briefOsTitle')).toHaveText('Today');
  await expect(page.locator('#briefOsNav [data-os-open="today"]')).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('.brief-os-home-module')).toHaveCount(8);
  await expect(page.locator('[data-home-module="executive"]')).toContainText('What matters now');
  await expect(page.locator('[data-home-module="priorities"]')).toContainText('Ranked outcomes');
  await expect(page.locator('[data-home-module="calendar"]')).toContainText('Today’s sequence');
  await expect(page.locator('[data-home-module="messages"]')).toContainText('Coordination needing attention');
  await expect(page.locator('[data-home-module="tasks"]')).toContainText('Execution checklist');
  await expect(page.locator('[data-home-module="goals"]')).toContainText('Current direction');
  await expect(page.locator('[data-home-module="updates"]')).toContainText('What changed in the picture');
  await expect(page.locator('[data-home-module="insights"]')).toContainText('Signals that change a decision');
  await expectNoDocumentScroll(page);

  const before = await page.locator('#briefOsTrack').evaluate(node => getComputedStyle(node).transform);
  await page.locator('#briefOsNav [data-os-open="day"]').click();
  await expect(page.locator('#briefOsTitle')).toHaveText('Day');
  await expect(page.locator('[data-os-screen="day"]')).toHaveClass(/is-active/);
  const after = await page.locator('#briefOsTrack').evaluate(node => getComputedStyle(node).transform);
  expect(after).not.toBe(before);

  await page.locator('[data-os-next-label]').click();
  await expect(page.locator('#briefOsTitle')).toHaveText('Work');

  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#briefOsTitle')).toHaveText('Private');
  await page.keyboard.press('ArrowLeft');
  await expect(page.locator('#briefOsTitle')).toHaveText('Work');
});

test('Quick is optional and the selected depth persists for future visits', async ({ page }) => {
  await enterPersonalBriefing(page);
  await page.locator('[data-brief-home-depth="quick"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-brief-os-depth', 'quick');
  await expect(page.locator('[data-brief-home-depth="quick"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.brief-os-home-module:visible')).toHaveCount(3);
  await expect(page.locator('[data-home-module="messages"]')).toBeHidden();

  await reenterAfterReload(page);
  await expect(page.locator('body')).toHaveAttribute('data-brief-os-depth', 'quick');
  await expect(page.locator('.brief-os-home-module:visible')).toHaveCount(3);

  await page.locator('[data-brief-home-depth="full"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-brief-os-depth', 'full');
  await expect(page.locator('.brief-os-home-module:visible')).toHaveCount(8);
});

test('Full home uses progressive disclosure and local task completion', async ({ page }) => {
  await enterPersonalBriefing(page);
  const messages = page.locator('[data-home-module="messages"]');
  await messages.locator('summary').click();
  await expect(messages.locator('details')).toHaveAttribute('open', '');
  await expect(messages).toHaveClass(/is-expanded/);

  const task = page.locator('[data-home-module="tasks"] [data-brief-home-task]').first();
  await task.click();
  await expect(task).toHaveAttribute('aria-pressed', 'true');
  await expect(task.locator('xpath=ancestor::li')).toHaveClass(/is-complete/);
});

test('detail mode is deliberate and returns to the OS', async ({ page }) => {
  await enterPersonalBriefing(page);
  await page.locator('#briefOsNav [data-os-open="day"]').click();
  await page.locator('[data-os-detail="#schedule"]').click();

  await expect(page.locator('body')).toHaveClass(/brief-personal-os-detail-open/);
  await expect(page.locator('#briefOsReturn')).toBeVisible();
  await expect(page.locator('#briefMain')).toBeVisible();

  await page.locator('#briefOsReturn').click();
  await expect(page.locator('body')).not.toHaveClass(/brief-personal-os-detail-open/);
  await expect(page.locator('#briefPersonalOS')).toBeVisible();
  await expect(page.locator('#briefMain')).toBeHidden();
  await expect(page.locator('#briefOsTitle')).toHaveText('Day');
  await expectNoDocumentScroll(page);
});

test('OS command opens the repaired terminal and closes cleanly', async ({ page }) => {
  await enterPersonalBriefing(page);
  const desktopCommand = page.locator('.brief-os-rail-footer [data-os-command]');
  const commandTrigger = await desktopCommand.isVisible()
    ? desktopCommand
    : page.locator('#briefSystemCommandButton');
  await expect(commandTrigger).toBeVisible();
  await commandTrigger.click();
  await expect(page.locator('#briefTerminal')).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/brief-terminal-open/);
  await page.locator('[data-terminal-close]').click();
  await expect(page.locator('#briefTerminal')).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/brief-terminal-open/);
});

test('mobile defaults to compact full cards and expands sections individually', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await enterPersonalBriefing(page);

  const switcher = page.locator('#briefSystemSwitcher');
  await expect(switcher).toBeVisible();
  await switcher.click();
  await expect(page.locator('#briefSystemSwitcherLayer')).toBeVisible();
  await page.locator('#briefSystemSwitcherLayer [data-system-close]').last().click();
  await expect(page.locator('#briefSystemSwitcherLayer')).toBeHidden();

  await expect(page.locator('body')).toHaveAttribute('data-brief-os-depth', 'full');
  await expect(page.locator('#briefOsDepthSwitch')).toBeVisible();
  await expect(page.locator('.brief-os-home-module')).toHaveCount(8);

  const navBox = await page.locator('#briefOsNav').boundingBox();
  const executiveBox = await page.locator('[data-home-module="executive"]').boundingBox();
  expect(navBox).not.toBeNull();
  expect(executiveBox).not.toBeNull();
  expect(navBox.y).toBeGreaterThan(790);
  expect(executiveBox.y).toBeLessThan(280);
  expect(executiveBox.height).toBeLessThan(310);

  const goals = page.locator('[data-home-module="goals"]');
  await goals.scrollIntoViewIfNeeded();
  await goals.locator('summary').click();
  await expect(goals.locator('details')).toHaveAttribute('open', '');

  const overflow = await page.evaluate(() => ({
    x: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    y: document.documentElement.scrollHeight - window.innerHeight
  }));
  expect(overflow.x).toBeLessThanOrEqual(3);
  expect(overflow.y).toBeLessThanOrEqual(4);
  await expectNoDocumentScroll(page);

  await page.locator('#briefOsNav [data-os-open="actions"]').click();
  await expect(page.locator('#briefOsTitle')).toHaveText('Work');
  await page.locator('[data-os-next]').click();
  await expect(page.locator('#briefOsTitle')).toHaveText('Private');
});

test('guided flow advances once and stops at System', async ({ page }) => {
  await enterPersonalBriefing(page);
  await page.evaluate(() => {
    const nativeSetInterval = window.setInterval;
    window.setInterval = (callback, delay, ...args) => nativeSetInterval(callback, Math.min(delay, 60), ...args);
    window.BRIEF_PERSONAL_OS.startGuidedFlow();
  });

  await expect.poll(() => page.evaluate(() => window.BRIEF_PERSONAL_OS.getState().active), { timeout: 1500 }).toBe('system');
  await expect.poll(() => page.evaluate(() => window.BRIEF_PERSONAL_OS.getState().autoRunning), { timeout: 1500 }).toBe(false);
  await expect(page.locator('[data-os-auto]')).toHaveAttribute('aria-pressed', 'false');
});
