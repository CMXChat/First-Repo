const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  // Browser coverage should stay deterministic and offline. Spotify controller
  // behavior has its own mocked lifecycle suite.
  await page.route('https://open.spotify.com/**', route => route.abort());
});

async function prepareFreshPage(page, route = '/spaces/') {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
}

async function openCurrentBrief(page, route = '/spaces/') {
  const expectedEntryScenario = new URL(route, 'https://spaces.test').searchParams.get('scenario') || 'personal';
  await prepareFreshPage(page, route);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#edf3f8');
  await expect(page.locator('#entry')).toBeVisible();
  await expect(page.locator('[data-entry-scenario]')).toHaveCount(7);
  await expect(page.locator('#entrySoundtrack')).toHaveCount(0);
  await expect(page.locator('[data-entry-tip]')).toHaveCount(5);
  await expect(page.locator(`[data-entry-scenario="${expectedEntryScenario}"]`)).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#openDemo')).toBeEnabled();
  await expect(page.locator('#entrySpacePreview')).toHaveAttribute('data-entry-preview', expectedEntryScenario);
  if (expectedEntryScenario === 'personal') {
    await expect(page.locator('#openDemoLabel')).toHaveText('Open Personal Briefing');
    await expect(page.locator('#entryPreviewTitle')).toContainText('sorted by what matters next');
  }

  const background = await page.locator('html').evaluate(node => getComputedStyle(node).getPropertyValue('--bg').trim());
  expect(background).toBe('#edf3f8');
}

async function enterScenario(page, scenario = 'personal') {
  await page.locator(`[data-entry-scenario="${scenario}"]`).click();
  await expect(page.locator('#openDemo')).toBeEnabled();
  await page.locator('#openDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-entered', 'true');
  await expect(page.locator('#demoApp')).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
  await expect(page.locator('#statsGrid .stat-card')).toHaveCount(4);
}

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.body.clientWidth
  }));
  expect(overflow.document).toBeLessThanOrEqual(1);
  expect(overflow.body).toBeLessThanOrEqual(1);
}

async function expectPlainVisibleCopy(page) {
  const text = await page.locator('body').innerText();
  expect(text).not.toContain('...');
  expect(text).not.toContain('…');
  expect(text).not.toContain('—');
  expect(text).not.toMatch(/\b(?:rather than|instead of)\b/i);
  expect(text).not.toMatch(/\b(?:is not|does not|are not|isn't|aren't|doesn't)\b[^.!?\n]{0,100}\bbut\b/i);
  expect(text).not.toContain('Personalized does not mean unpredictable');
  expect(text).not.toContain('STABLE SHELL, ADAPTIVE COMPOSITION');
  expect(text).not.toContain('A strong demonstration with a clear path to the real platform');
}

async function selectPrimaryView(page, view) {
  const desktopButton = page.locator(`#primaryNav [data-primary-view="${view}"]`);
  if (await desktopButton.isVisible()) {
    await desktopButton.click();
    return;
  }
  await page.locator(`#mobileNav [data-primary-view="${view}"]`).click();
}

async function dispatchSwipe(page, selector, { startX, startY = 360, endX, endY = startY }) {
  await page.locator(selector).evaluate((target, points) => {
    const emit = (type, x, y, active) => {
      const touch = {
        identifier: 1,
        target,
        clientX: x,
        clientY: y,
        pageX: x,
        pageY: y,
        screenX: x,
        screenY: y
      };
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'touches', { value: active ? [touch] : [] });
      Object.defineProperty(event, 'changedTouches', { value: [touch] });
      target.dispatchEvent(event);
    };

    emit('touchstart', points.startX, points.startY, true);
    emit('touchmove', points.endX, points.endY, true);
    emit('touchend', points.endX, points.endY, false);
  }, { startX, startY, endX, endY });
}

test('current Spaces demo opens in light mode and remains usable across devices', async ({ page }) => {
  await openCurrentBrief(page);
  await enterScenario(page, 'personal');
  await expect(page.locator('#weatherTemperature')).toHaveText('82');
  await expect(page.locator('#primaryNav button')).toHaveCount(5);
  await expect(page.locator('#mobileNav button')).toHaveCount(5);
  await expect(page.locator('.section-pager')).toHaveCount(5);
  await expectNoHorizontalOverflow(page);
  await expectPlainVisibleCopy(page);

  const topbarControls = await page.evaluate(() => {
    const music = getComputedStyle(document.getElementById('mediaButton'));
    const theme = getComputedStyle(document.getElementById('themeButton'));
    const icon = getComputedStyle(document.querySelector('#themeButton > span'));
    return {
      musicBackground: music.backgroundColor,
      themeBackground: theme.backgroundColor,
      musicRadius: music.borderRadius,
      themeRadius: theme.borderRadius,
      outerTextShadow: theme.textShadow,
      iconTextShadow: icon.textShadow
    };
  });
  expect(topbarControls.themeBackground).toBe(topbarControls.musicBackground);
  expect(topbarControls.themeRadius).toBe(topbarControls.musicRadius);
  expect(topbarControls.outerTextShadow).toBe('none');
  expect(topbarControls.iconTextShadow).not.toBe('none');

  await page.locator('#themeButton').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#05070b');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  await page.evaluate(() => localStorage.removeItem('personal_os_brief_theme_v2'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#edf3f8');
});

test('desktop entry fits common screens, stays centered and exposes small-window scrolling', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'Desktop entry geometry runs in Chromium.');
  await page.setViewportSize({ width: 1280, height: 720 });
  await openCurrentBrief(page);

  const entryFit = await page.locator('#entry').evaluate(entry => {
    const style = getComputedStyle(entry);
    const card = entry.querySelector('.entry-card').getBoundingClientRect();
    const heading = entry.querySelector('.entry-card h1').getBoundingClientRect();
    const previewElement = entry.querySelector('#entrySpacePreview');
    const preview = previewElement.getBoundingClientRect();
    const grid = entry.querySelector('#entryScenarioGrid');
    const tip = entry.querySelector('.entry-tip-carousel').getBoundingClientRect();
    const actions = entry.querySelector('.entry-actions').getBoundingClientRect();
    const activeCopy = entry.querySelector('[data-entry-tip]:not([aria-hidden="true"]) p');
    const maxScroll = entry.scrollHeight - entry.clientHeight;
    return {
      overflowY: style.overflowY,
      scrollbarColor: style.scrollbarColor,
      maxScroll,
      gutter: style.scrollbarGutter,
      leftMargin: card.left,
      rightMargin: innerWidth - card.right,
      headingHeight: heading.height,
      previewHeight: preview.height,
      previewDisplay: getComputedStyle(previewElement).display,
      gridColumnCount: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
      tipHeight: tip.height,
      actionGap: actions.top - tip.bottom,
      wordAnimation: getComputedStyle(activeCopy).animationName
    };
  });
  expect(entryFit.overflowY).toBe('scroll');
  expect(entryFit.scrollbarColor).not.toBe('auto');
  expect(entryFit.maxScroll).toBeLessThanOrEqual(1);
  expect(entryFit.gutter).toContain('stable');
  expect(Math.abs(entryFit.leftMargin - entryFit.rightMargin)).toBeLessThanOrEqual(2);
  expect(entryFit.headingHeight).toBeLessThanOrEqual(50);
  expect(entryFit.previewDisplay).toBe('none');
  expect(entryFit.previewHeight).toBeLessThanOrEqual(110);
  expect(entryFit.gridColumnCount).toBe(8);
  expect(entryFit.tipHeight).toBeLessThanOrEqual(66);
  expect(entryFit.actionGap).toBeGreaterThanOrEqual(10);
  expect(entryFit.wordAnimation).toContain('entry-tip-copy-in');
  await expect(page.locator('#entryScrollControl')).toBeHidden();
  await expect(page.locator('#openDemo')).toBeInViewport();

  await page.locator('[data-entry-scenario="business"]').click();
  await expect(page.locator('#entrySpacePreview')).toHaveAttribute('data-entry-preview', 'business');
  await expect(page.locator('#entryPreviewTitle')).toContainText('New York and Sydney');
  await expect(page.locator('#entryPreviewMetrics')).toContainText('2 decisions');
  await expect(page.locator('#openDemoLabel')).toHaveText('Open Business partners Briefing');
  await page.locator('[data-entry-scenario="personal"]').click();

  const firstTipAccent = await page.locator('#entryTipCarousel').evaluate(carousel => {
    const strong = carousel.querySelector('[data-entry-tip]:not([aria-hidden="true"]) strong');
    return {
      border: getComputedStyle(carousel).borderColor,
      text: strong ? getComputedStyle(strong).color : ''
    };
  });
  await page.locator('[data-entry-tip-next]').click();
  await expect(page.locator('#entryTipPosition')).toHaveText('2 / 5');
  await expect(page.locator('[data-entry-tip]').nth(1)).toHaveAttribute('aria-hidden', 'false');
  const secondTipAccent = await page.locator('#entryTipCarousel').evaluate(carousel => {
    const strong = carousel.querySelector('[data-entry-tip]:not([aria-hidden="true"]) strong');
    return {
      border: getComputedStyle(carousel).borderColor,
      text: strong ? getComputedStyle(strong).color : ''
    };
  });
  expect(secondTipAccent.border).not.toBe(firstTipAccent.border);
  expect(secondTipAccent.text).not.toBe(firstTipAccent.text);
  await page.locator('[data-entry-tip-next]').evaluate(button => button.blur());
  await page.mouse.move(0, 0);
  await expect.poll(() => page.locator('#entryTipPosition').textContent(), { timeout: 6000 }).toBe('3 / 5');

  await page.setViewportSize({ width: 1024, height: 768 });
  const compactFit = await page.locator('.entry-card').evaluate(card => {
    const rect = card.getBoundingClientRect();
    return {
      leftMargin: rect.left,
      rightMargin: innerWidth - rect.right,
      pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });
  expect(Math.abs(compactFit.leftMargin - compactFit.rightMargin)).toBeLessThanOrEqual(2);
  expect(compactFit.pageOverflow).toBeLessThanOrEqual(1);

  await page.setViewportSize({ width: 800, height: 650 });
  await expect(page.locator('#entryScrollControl')).toBeVisible();
  const smallWindow = await page.locator('#entry').evaluate(entry => ({
    maxScroll: entry.scrollHeight - entry.clientHeight,
    pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
  }));
  expect(smallWindow.maxScroll).toBeGreaterThan(100);
  expect(smallWindow.pageOverflow).toBeLessThanOrEqual(1);
  await page.locator('#entryScrollControl').click();
  await expect.poll(() => page.locator('#entry').evaluate(entry => entry.scrollTop)).toBeGreaterThan(80);

  await page.setViewportSize({ width: 360, height: 800 });
  await page.locator('#entry').evaluate(entry => entry.scrollTo({ top: 0, behavior: 'auto' }));
  const phoneFit = await page.locator('#entry').evaluate(entry => {
    const carousel = entry.querySelector('.entry-tip-carousel');
    const track = entry.querySelector('#entryTipTrack');
    const activeTip = carousel.querySelector('[data-entry-tip]:not([aria-hidden="true"])');
    const entryCopy = entry.querySelector('.entry-copy');
    const option = entry.querySelector('.entry-option');
    const optionTitle = option.querySelector('strong');
    const optionDetail = option.querySelector('small');
    const openButton = entry.querySelector('#openDemo');
    const previewTitle = entry.querySelector('#entryPreviewTitle');
    const previewCopy = entry.querySelector('#entryPreviewCopy');
    const preview = entry.querySelector('#entrySpacePreview');
    const position = entry.querySelector('#entryTipPosition');
    const controls = entry.querySelector('.entry-tip-controls').getBoundingClientRect();
    const carouselRect = carousel.getBoundingClientRect();
    return {
      maxScroll: entry.scrollHeight - entry.clientHeight,
      pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      optionCount: entry.querySelectorAll('[data-entry-scenario]').length,
      pillRadius: parseFloat(getComputedStyle(carousel).borderRadius),
      pillHeight: carousel.getBoundingClientRect().height,
      trackTransition: getComputedStyle(track).transitionDuration,
      wordTransition: getComputedStyle(activeTip).transitionDuration,
      rootFontSize: parseFloat(getComputedStyle(document.documentElement).fontSize),
      entryCopyFontSize: parseFloat(getComputedStyle(entryCopy).fontSize),
      optionTitleFontSize: parseFloat(getComputedStyle(optionTitle).fontSize),
      optionDetailFontSize: parseFloat(getComputedStyle(optionDetail).fontSize),
      previewTitleFontSize: parseFloat(getComputedStyle(previewTitle).fontSize),
      previewCopyFontSize: parseFloat(getComputedStyle(previewCopy).fontSize),
      previewDisplay: getComputedStyle(preview).display,
      openButtonFontSize: parseFloat(getComputedStyle(openButton).fontSize),
      openButtonHeight: openButton.getBoundingClientRect().height,
      positionDisplay: getComputedStyle(position).display,
      controlsTop: controls.top,
      carouselBottom: carouselRect.bottom
    };
  });
  expect(phoneFit.maxScroll).toBeGreaterThan(150);
  expect(phoneFit.pageOverflow).toBeLessThanOrEqual(1);
  expect(phoneFit.optionCount).toBe(7);
  expect(phoneFit.pillRadius).toBeGreaterThan(100);
  expect(phoneFit.pillHeight).toBeLessThanOrEqual(90);
  expect(phoneFit.trackTransition).not.toBe('0s');
  expect(phoneFit.wordTransition).not.toBe('0s');
  expect(phoneFit.rootFontSize).toBeGreaterThanOrEqual(17);
  expect(phoneFit.entryCopyFontSize).toBeGreaterThanOrEqual(16);
  expect(phoneFit.optionTitleFontSize).toBeGreaterThanOrEqual(17);
  expect(phoneFit.optionDetailFontSize).toBeGreaterThanOrEqual(14);
  expect(phoneFit.previewTitleFontSize).toBeGreaterThanOrEqual(20);
  expect(phoneFit.previewCopyFontSize).toBeGreaterThanOrEqual(14);
  expect(phoneFit.previewDisplay).toBe('grid');
  expect(phoneFit.openButtonFontSize).toBeGreaterThanOrEqual(15);
  expect(phoneFit.openButtonHeight).toBeGreaterThanOrEqual(48);
  expect(phoneFit.positionDisplay).toBe('none');
  expect(phoneFit.controlsTop).toBeGreaterThanOrEqual(phoneFit.carouselBottom);

  const beforeSwipe = await page.locator('#entryTipPosition').textContent();
  await dispatchSwipe(page, '#entryTipCarousel', { startX: 290, endX: 70 });
  const afterSwipe = await page.locator('#entryTipPosition').textContent();
  expect(afterSwipe).not.toBe(beforeSwipe);
  await expect.poll(() => page.locator('#entryTipPosition').textContent(), { timeout: 6000 }).not.toBe(afterSwipe);

  await page.locator('#entry').evaluate(entry => entry.scrollTo({ top: entry.scrollHeight, behavior: 'auto' }));
  await expect(page.locator('#openDemo')).toBeInViewport();
});

test('mobile reveals the selected briefing action only after a card tap', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-android', 'The sticky entry action runs once in mobile Chromium.');
  await prepareFreshPage(page);

  await expect(page.locator('body')).toHaveAttribute('data-entry-choice-made', 'false');
  await expect(page.locator('#entryMobileChoiceHint')).toBeVisible();
  await expect(page.locator('#entryMobileChoiceHint')).toHaveText('Tap one to continue');
  await expect(page.locator('#openDemo')).toBeHidden();

  await page.locator('[data-entry-scenario="family"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-entry-choice-made', 'true');
  await expect(page.locator('#entryMobileChoiceHint')).toHaveText('Family selected');
  await expect(page.locator('#openDemo')).toBeVisible();
  await expect(page.locator('#openDemoLabel')).toHaveText('Open Family Briefing');

  await expect.poll(async () => page.locator('[data-entry-scenario="family"]').evaluate(choice => {
    const action = document.querySelector('#openDemo');
    return action ? action.getBoundingClientRect().top - choice.getBoundingClientRect().bottom : -1;
  })).toBeGreaterThanOrEqual(10);

  const stickyAction = await page.locator('#openDemo').evaluate(button => {
    const rect = button.getBoundingClientRect();
    const style = getComputedStyle(button);
    return {
      position: style.position,
      left: rect.left,
      right: innerWidth - rect.right,
      bottom: innerHeight - rect.bottom,
      height: rect.height
    };
  });
  expect(stickyAction.position).toBe('fixed');
  expect(stickyAction.left).toBeGreaterThanOrEqual(13);
  expect(stickyAction.right).toBeGreaterThanOrEqual(13);
  expect(stickyAction.bottom).toBeGreaterThanOrEqual(9);
  expect(stickyAction.height).toBeGreaterThanOrEqual(56);
  await expectNoHorizontalOverflow(page);

  await page.locator('[data-entry-scenario="accounting"]').click();
  await expect(page.locator('#openDemoLabel')).toHaveText('Open Accountant and client Briefing');
  await page.locator('#openDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-entered', 'true');
  await expect(page.locator('body')).toHaveAttribute('data-scenario', 'accounting');
});

test('section conversations and standout modules keep the current Space in scope', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'The contextual conversation flow runs once in Chromium.');
  await openCurrentBrief(page);
  await enterScenario(page, 'family');

  await expect(page.locator('[data-view-panel="today"] .section-ai-button:visible')).toHaveCount(4);
  await expect(page.locator('body')).not.toContainText('Ask AI');

  await expect(page.locator('.space-highlight')).toHaveCount(3);
  await expect(page.locator('#spaceHighlights')).toContainText('Shared calendar');
  await page.locator('[data-highlight-tab="calendar"]').click();
  await expect(page.locator('[data-view-panel="workspace"]')).toBeVisible();
  await expect(page.locator('[data-workspace-tab="calendar"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.family-calendar-day')).toHaveCount(3);

  const trigger = page.locator('.workspace-panel-heading [data-ai-trigger]');
  await expect(trigger).toHaveText('✦');
  await expect(trigger).toHaveAttribute('aria-label', /Open a conversation about/);
  const triggerGeometry = await trigger.evaluate(button => {
    const rect = button.getBoundingClientRect();
    const hitArea = getComputedStyle(button, '::before');
    return {
      width: rect.width,
      height: rect.height,
      hitInset: Math.abs(parseFloat(hitArea.inset))
    };
  });
  expect(triggerGeometry.width).toBeLessThanOrEqual(32);
  expect(triggerGeometry.height).toBeLessThanOrEqual(32);
  expect(triggerGeometry.width + (triggerGeometry.hitInset * 2)).toBeGreaterThanOrEqual(44);
  await trigger.click();
  await expect(page.locator('#spacesAiDialog')).toBeVisible();
  await expect(page.locator('#spacesAiTitle')).toHaveText('Continue with this section');
  await expect(page.locator('#spacesAiContext')).toContainText('Family');
  await expect(page.locator('#spacesAiContext')).toContainText('A shared calendar that keeps private event details covered');
  await expect(page.locator('.spaces-ai-explainer')).toContainText('After a secure backend is connected');
  const dialogGeometry = await page.locator('#spacesAiDialog').evaluate(dialog => {
    const rect = dialog.getBoundingClientRect();
    return {
      leftGap: rect.left,
      rightGap: innerWidth - rect.right,
      topGap: rect.top,
      bottomGap: innerHeight - rect.bottom,
      width: rect.width
    };
  });
  await page.waitForTimeout(220);
  const settledDialogGeometry = await page.locator('#spacesAiDialog').evaluate(dialog => {
    const rect = dialog.getBoundingClientRect();
    return {
      leftGap: rect.left,
      rightGap: innerWidth - rect.right,
      topGap: rect.top,
      bottomGap: innerHeight - rect.bottom,
      width: rect.width
    };
  });
  expect(dialogGeometry.width).toBeLessThanOrEqual(622);
  expect(Math.abs(settledDialogGeometry.leftGap - settledDialogGeometry.rightGap)).toBeLessThanOrEqual(2);
  expect(Math.abs(settledDialogGeometry.topGap - settledDialogGeometry.bottomGap)).toBeLessThanOrEqual(2);
  await expect(page.locator('[data-ai-prompt]')).toHaveCount(3);
  await page.locator('[data-ai-prompt]').first().click();
  await expect(page.locator('#spacesAiInput')).not.toHaveValue('');
  await page.locator('#spacesAiForm button[type="submit"]').click();
  await expect(page.locator('#spacesAiPreview')).toContainText('Conversation context prepared');
  await expect(page.locator('#spacesAiPreview')).toContainText('approved records');
  await page.locator('#closeSpacesAi').click();
  await expect(trigger).toBeFocused();
  await expectNoHorizontalOverflow(page);
});

test('Business partners and Accountant and client use complete advanced workspaces', async ({ page }, testInfo) => {
  test.setTimeout(45000);
  test.skip(!testInfo.project.name.endsWith('-desktop'), 'Advanced workspace coverage runs in desktop browser projects.');
  await openCurrentBrief(page);
  await enterScenario(page, 'business');

  await expect(page.locator('#priorityNotice')).toBeVisible();
  await expect(page.locator('#priorityNotice')).toContainText('9.4 weeks');
  await selectPrimaryView(page, 'workspace');

  await expect(page.locator('.partner-lane')).toHaveCount(2);
  await expect(page.locator('.partner-operations')).toContainText('4:00 PM ET');
  await expect(page.locator('.partner-operations')).toContainText('6:00 AM AEST');

  await page.locator('[data-workspace-tab="projects"]').click();
  await expect(page.locator('.project-row')).toHaveCount(4);
  await expect(page.locator('.project-dashboard')).toContainText('Harbor Health launch');

  await page.locator('[data-workspace-tab="deals"]').click();
  await expect(page.locator('.deal-stage')).toHaveCount(3);
  await expect(page.locator('.deal-pipeline')).toContainText('$68k');

  await page.locator('[data-workspace-tab="calendar"]').click();
  await expect(page.locator('.partner-calendar-day')).toHaveCount(3);
  await expect(page.locator('.partner-calendar-day[data-highlighted="true"]')).toContainText('BEACH DAY');
  await expect(page.locator('.partner-calendar-day[data-highlighted="true"]')).toContainText('UV 8');
  await page.locator('[data-demo-module-action]').click();
  await expect(page.locator('[data-module-action-status]')).toContainText('Both partners still need to approve');
  await expect(page.locator('#spacesDemoNotice')).toBeVisible();
  await expect(page.locator('#spacesDemoNotice')).toContainText('requires the secure backend');

  await page.locator('[data-workspace-tab="concerns"]').click();
  await expect(page.locator('.concern-grid article')).toHaveCount(3);

  await page.locator('#scenarioSelect').selectOption('accounting');
  await expect(page.locator('body')).toHaveAttribute('data-scenario', 'accounting');
  await expect(page.locator('#priorityNotice')).toContainText('$1,250 card autopay');

  await page.locator('#briefUpdateButton').click();
  await expect(page.locator('#briefUpdateDialog')).toBeVisible();
  await expect(page.locator('#briefUpdateQuestion')).toContainText('$840 startup client payment');
  await page.locator('[data-check-in-choice="Partial"]').click();
  await page.locator('#briefCorrectionInput').fill('$420 received');
  await page.locator('#saveBriefUpdate').click();
  await expect(page.locator('#briefUpdateStatus')).toContainText('Partial · $420 received');
  await page.locator('#cancelBriefUpdate').click();

  await selectPrimaryView(page, 'workspace');
  await expect(page.locator('.finance-people article')).toHaveCount(2);
  await expect(page.locator('.advisor-quote')).toContainText('Priya Shah');

  await page.locator('[data-workspace-tab="cash"]').click();
  await expect(page.locator('.financial-sheet tbody tr')).toHaveCount(8);
  await expect(page.locator('.financial-sheet')).toContainText('Living + flexible');

  await page.locator('[data-workspace-tab="portfolio"]').click();
  await expect(page.locator('.asset-grid article')).toHaveCount(4);
  await expect(page.locator('.market-rail')).toContainText('VTI');

  await page.locator('[data-workspace-tab="deadlines"]').click();
  await expect(page.locator('.deadline-ledger li')).toHaveCount(4);

  await page.locator('[data-workspace-tab="rules"]').click();
  await expect(page.locator('.goal-stack article')).toHaveCount(3);
  await expect(page.locator('.rule-list li')).toHaveCount(4);
  await expectNoHorizontalOverflow(page);
  await expectPlainVisibleCopy(page);
});

test('briefing sections expose named progress controls and working arrows', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'The section cues are validated at desktop and narrow widths.');
  await page.setViewportSize({ width: 1140, height: 844 });
  await openCurrentBrief(page);
  await enterScenario(page, 'accounting');
  const scrollCue = page.locator('[data-scroll-today]');
  await expect(scrollCue).toBeVisible();
  const initialPageScroll = await page.evaluate(() => scrollY);
  await scrollCue.click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(initialPageScroll + 20);
  await selectPrimaryView(page, 'workspace');

  const tabs = page.locator('#workspaceTabs');
  const previous = page.locator('[data-workspace-tab-step="previous"]');
  const next = page.locator('[data-workspace-tab-step="next"]');
  const hint = page.locator('#workspaceTabHint');
  await expect(hint).toBeVisible();
  await expect(hint).toContainText('Section 1 of 5');
  await expect(next).toBeVisible();
  await expect(next).toBeEnabled();
  await expect(page.locator('.workspace-next-section')).toContainText('Continue to Cash plan');
  await expect(page.locator('.workspace-related-links')).toContainText('All sections in this briefing');
  await expect(page.locator('.workspace-related-links button')).toHaveCount(5);
  await expect(page.locator('.workspace-related-links button[aria-current="page"]')).toContainText('Viewing now');
  await expect.poll(() => page.locator('.workspace-related-links').evaluate(node => {
    const firstContent = node.nextElementSibling;
    return Boolean(firstContent && node.getBoundingClientRect().top < firstContent.getBoundingClientRect().top);
  })).toBe(true);

  const relatedLink = page.locator('.workspace-related-links button:not(:disabled)').first();
  const relatedTarget = await relatedLink.getAttribute('data-workspace-continue');
  await relatedLink.click();
  await expect(page.locator(`[data-workspace-tab="${relatedTarget}"]`)).toHaveAttribute('aria-selected', 'true');
  await page.locator('[data-workspace-tab="overview"]').click();

  await page.locator('.workspace-next-section').click();
  await expect(page.locator('[data-workspace-tab="cash"]')).toHaveAttribute('aria-selected', 'true');
  await expect(hint).toContainText('Section 2 of 5');
  await expect(page.locator('.workspace-next-section')).toContainText('Continue to Portfolio');
  await expect(previous).toBeEnabled();

  await page.setViewportSize({ width: 520, height: 844 });
  await expect(next).toBeVisible();
  await expect(next).toBeEnabled();
  await next.click();
  await expect(page.locator('[data-workspace-tab="portfolio"]')).toHaveAttribute('aria-selected', 'true');
  await expect(hint).toContainText('Section 3 of 5');
  await expect(previous).toBeEnabled();
  await expectNoHorizontalOverflow(page);
});

test('every active Space keeps visible copy free of banned writing patterns', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-desktop', 'One browser is enough for the rendered-copy audit.');
  await openCurrentBrief(page);
  await enterScenario(page, 'personal');

  const scenarioIds = await page.evaluate(() => Object.keys(window.BRIEF_DEMO_DATA.scenarios));
  for (const scenarioId of scenarioIds) {
    if (scenarioId !== 'personal') {
      await page.locator('#scenarioSelect').selectOption(scenarioId);
      await expect(page.locator('body')).toHaveAttribute('data-scenario', scenarioId);
    }

    await expectPlainVisibleCopy(page);
    await selectPrimaryView(page, 'workspace');
    const tabIds = await page.locator('[data-workspace-tab]').evaluateAll(buttons => buttons.map(button => button.dataset.workspaceTab));
    for (const tabId of tabIds) {
      await page.locator(`[data-workspace-tab="${tabId}"]`).click();
      await expectPlainVisibleCopy(page);
    }

    for (const viewId of ['spaces', 'how', 'everything']) {
      await selectPrimaryView(page, viewId);
      await expectPlainVisibleCopy(page);
    }

    await selectPrimaryView(page, 'today');
  }
});

test('Accounting spreadsheet scroll stays inside its mobile workspace', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-android', 'Accounting mobile containment runs in the Android project.');
  await page.setViewportSize({ width: 360, height: 800 });
  await openCurrentBrief(page);
  await enterScenario(page, 'accounting');

  const selectorFit = await page.locator('#scenarioSelect').evaluate(select => {
    const style = getComputedStyle(select);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const labelWidth = context.measureText(select.selectedOptions[0].textContent.trim()).width;
    const horizontalPadding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    return {
      label: select.selectedOptions[0].textContent.trim(),
      availableWidth: select.clientWidth,
      requiredWidth: Math.ceil(labelWidth + horizontalPadding + 20)
    };
  });
  expect(selectorFit.label).toBe('Accountant and client');
  expect(selectorFit.availableWidth).toBeGreaterThanOrEqual(selectorFit.requiredWidth);

  await selectPrimaryView(page, 'workspace');
  await page.locator('[data-workspace-tab="cash"]').click();

  const initialSheetFit = await page.locator('.financial-sheet-scroll').evaluate(host => {
    const firstColumn = host.querySelector('thead th:first-child');
    const plannedColumn = host.querySelector('thead th:nth-child(2)');
    const hostRect = host.getBoundingClientRect();
    const firstRect = firstColumn.getBoundingClientRect();
    const plannedRect = plannedColumn.getBoundingClientRect();
    const visiblePlannedWidth = Math.max(0, Math.min(hostRect.right, plannedRect.right) - Math.max(hostRect.left, plannedRect.left));
    return {
      firstColumnWidth: firstRect.width,
      plannedColumnWidth: plannedRect.width,
      visiblePlannedWidth,
      hostWidth: hostRect.width
    };
  });
  expect(initialSheetFit.firstColumnWidth).toBeLessThanOrEqual(150);
  expect(initialSheetFit.visiblePlannedWidth).toBeGreaterThanOrEqual(110);
  expect(initialSheetFit.plannedColumnWidth).toBeGreaterThanOrEqual(120);
  await expect(page.locator('.financial-sheet-caption')).toBeVisible();
  await expect(page.locator('.financial-sheet-toolbar')).toContainText('Swipe columns');

  const scrollState = await page.locator('.financial-sheet-scroll').evaluate(host => {
    host.scrollLeft = host.scrollWidth;
    return {
      hostOverflow: host.scrollWidth - host.clientWidth,
      hostScrollLeft: host.scrollLeft,
      documentX: document.documentElement.scrollLeft,
      windowX: window.scrollX
    };
  });
  expect(scrollState.hostOverflow).toBeGreaterThan(100);
  expect(scrollState.hostScrollLeft).toBeGreaterThan(0);
  expect(scrollState.documentX).toBe(0);
  expect(scrollState.windowX).toBe(0);
  await expectNoHorizontalOverflow(page);

  await page.locator('[data-workspace-tab="portfolio"]').click();
  await expect(page.locator('.asset-grid article')).toHaveCount(4);
  await expectNoHorizontalOverflow(page);
});

test('Personal habits and the Family briefing use the richer workspace modules', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.endsWith('-desktop'), 'Rich workspace coverage runs in desktop browser projects.');
  await openCurrentBrief(page);
  await enterScenario(page, 'personal');

  await selectPrimaryView(page, 'workspace');
  await page.locator('[data-workspace-tab="habits"]').click();
  await expect(page.locator('.habit-tracker-row')).toHaveCount(3);
  await expect(page.locator('.habit-tracker-row').first()).toContainText('4 this week');
  await expect(page.locator('.habit-tracker-row').first()).toContainText('16-day record');
  await expect(page.locator('.workspace-boundary-note')).toContainText('Personal habit remains private');

  await page.locator('#scenarioSelect').selectOption('family');
  await expect(page.locator('body')).toHaveAttribute('data-scenario', 'family');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
  await expect(page.locator('#heroTitle')).toHaveText('The household plan is clear before everyone starts moving');
  await expect(page.locator('#statsGrid')).toContainText('Chores open');

  await expect(page.locator('#recommendationViewLabel')).toHaveText('Open Calendar');
  await page.locator('#recommendationViewButton').click();
  await expect(page.locator('[data-view-panel="workspace"]')).toBeVisible();
  await expect(page.locator('[data-workspace-tab="calendar"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.family-calendar-day')).toHaveCount(3);
  await expect(page.locator('.family-calendar')).toContainText('Availability only');
  await expect(page.locator('.family-calendar')).toContainText('Zoe’s appointment');

  await page.locator('[data-workspace-tab="chores"]').click();
  await expect(page.locator('.household-column')).toHaveCount(3);
  await expect(page.locator('.household-board')).toContainText('Unload dishwasher');

  await page.locator('[data-workspace-tab="shopping"]').click();
  await expect(page.locator('.shopping-groups > section')).toHaveCount(3);
  await expect(page.locator('.shopping-groups li')).toHaveCount(7);

  await selectPrimaryView(page, 'everything');
  await expect(page.locator('#all-weather .full-weather-card')).toBeVisible();
  await expect(page.locator('#all-weather .weather-visual')).toBeVisible();
  await expect(page.locator('#all-weather .weather-range')).toContainText('High 82°');
  await expect(page.locator('#all-workspace')).toContainText('Every category in this family briefing');
  await expectNoHorizontalOverflow(page);
});

test('mobile tab rows keep the document aligned and selected labels readable', async ({ page }, testInfo) => {
  test.skip(!['chromium-android', 'webkit-iphone'].includes(testInfo.project.name), 'Touch containment runs in mobile browser projects.');
  await page.setViewportSize({ width: 360, height: 800 });
  await openCurrentBrief(page);
  await enterScenario(page, 'relationship');
  await selectPrimaryView(page, 'workspace');

  await page.locator('[data-workspace-tab="connections"]').click();
  await page.locator('[data-workspace-tab="together"]').click();

  const workspaceState = await page.evaluate(() => {
    const selected = document.querySelector('.workspace-tabs button[aria-selected="true"]');
    const layout = document.querySelector('.app-layout')?.getBoundingClientRect();
    return {
      windowX: window.scrollX,
      documentX: document.documentElement.scrollLeft,
      bodyX: document.body.scrollLeft,
      selectedColor: selected ? getComputedStyle(selected).color : '',
      layoutLeft: layout?.left || 0,
      layoutRight: layout?.right || 0,
      viewport: document.documentElement.clientWidth
    };
  });

  expect(workspaceState.windowX).toBe(0);
  expect(workspaceState.documentX).toBe(0);
  expect(workspaceState.bodyX).toBe(0);
  expect(workspaceState.selectedColor).toBe('rgb(255, 255, 255)');
  expect(workspaceState.layoutLeft).toBeGreaterThanOrEqual(-1);
  expect(workspaceState.layoutRight).toBeLessThanOrEqual(workspaceState.viewport + 1);

  await selectPrimaryView(page, 'how');
  await page.locator('[data-space-example="family"]').click();
  const explainerColor = await page.locator('[data-space-example="family"]').evaluate(node => getComputedStyle(node).color);
  expect(explainerColor).toBe('rgb(255, 255, 255)');
  await page.locator('.space-example-open').click();
  await expect(page.locator('body')).toHaveAttribute('data-scenario', 'family');
  await expect(page.locator('body')).toHaveAttribute('data-view', 'today');
  await expect(page.locator('#heroTitle')).toHaveText('The household plan is clear before everyone starts moving');
  await selectPrimaryView(page, 'workspace');
  await page.locator('[data-workspace-tab="access"]').click();
  await expect(page.locator('[data-workspace-tab="access"]')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.workspace-panel')).toContainText('Useful family access with age-appropriate limits');
  await expectNoHorizontalOverflow(page);
});

test('every briefing entry and context switch starts on Today', async ({ page }) => {
  await openCurrentBrief(page, '/spaces/?scenario=team&view=everything&tab=plans');

  await page.locator('[data-entry-scenario="team"]').click();
  await page.locator('#openDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-view', 'today');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
  await expect(page.locator('[data-view-panel="everything"]')).toBeHidden();
  await expect(page).toHaveURL(/scenario=team/);
  await expect(page).toHaveURL(/view=today/);
  expect(new URL(page.url()).searchParams.has('tab')).toBe(false);

  await selectPrimaryView(page, 'how');
  await expect(page.locator('[data-view-panel="how"]')).toBeVisible();
  await page.locator('#resetDemo').evaluate(button => button.click());
  await expect(page.locator('body')).toHaveAttribute('data-entered', 'false');
  expect(new URL(page.url()).searchParams.has('view')).toBe(false);

  await page.locator('[data-entry-scenario="relationship"]').click();
  await page.locator('#openDemo').click();
  await expect(page.locator('body')).toHaveAttribute('data-view', 'today');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();

  await selectPrimaryView(page, 'workspace');
  await expect(page.locator('[data-view-panel="workspace"]')).toBeVisible();
  await page.locator('#scenarioSelect').selectOption('business');
  await expect(page.locator('body')).toHaveAttribute('data-scenario', 'business');
  await expect(page.locator('body')).toHaveAttribute('data-view', 'today');
  await expect(page.locator('[data-view-panel="today"]')).toBeVisible();
  await expect(page).toHaveURL(/scenario=business/);
  await expect(page).toHaveURL(/view=today/);
});

test('section pagers and guarded swipes move between views on mobile', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium-android', 'Touch navigation is validated in the Android project.');
  await openCurrentBrief(page);
  await enterScenario(page, 'trainer');

  await expect(page.locator('.section-pager')).toHaveCount(5);
  const todayPager = page.locator('[data-view-panel="today"] .section-pager');
  await expect(todayPager.locator('[data-section-view]')).toHaveCount(1);
  await expect(todayPager.locator('[data-section-view="workspace"]')).toContainText('Explore');
  await expect(todayPager.locator('.section-swipe-hint')).toBeVisible();

  await todayPager.locator('[data-section-view="workspace"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-view', 'workspace');
  await expect(page.locator('[data-view-panel="workspace"]')).toBeVisible();

  const workspacePager = page.locator('[data-view-panel="workspace"] .section-pager');
  await expect(workspacePager.locator('[data-section-view]')).toHaveCount(2);
  await workspacePager.locator('[data-section-view="spaces"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-view', 'spaces');

  const spacesPager = page.locator('[data-view-panel="spaces"] .section-pager');
  await spacesPager.locator('[data-section-view="workspace"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-view', 'workspace');
  await workspacePager.locator('[data-section-view="today"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-view', 'today');

  await dispatchSwipe(page, '#demoMain', { startX: 320, endX: 90 });
  await expect(page.locator('body')).toHaveAttribute('data-view', 'workspace');
  await dispatchSwipe(page, '#demoMain', { startX: 80, endX: 310 });
  await expect(page.locator('body')).toHaveAttribute('data-view', 'today');

  await dispatchSwipe(page, '#demoMain', { startX: 10, endX: 280 });
  await expect(page.locator('body')).toHaveAttribute('data-view', 'today');

  await selectPrimaryView(page, 'how');
  await expect(page.locator('body')).toHaveAttribute('data-view', 'how');
  await dispatchSwipe(page, '#memoryExampleTabs', { startX: 320, startY: 120, endX: 80, endY: 120 });
  await expect(page.locator('body')).toHaveAttribute('data-view', 'how');

  await dispatchSwipe(page, '#demoMain', { startX: 320, endX: 80 });
  await expect(page.locator('body')).toHaveAttribute('data-view', 'everything');
  await dispatchSwipe(page, '#demoMain', { startX: 320, endX: 80 });
  await expect(page.locator('body')).toHaveAttribute('data-view', 'everything');

  await page.locator('[data-view-panel="everything"] [data-section-view="today"]').click();
  await expect(page.locator('body')).toHaveAttribute('data-view', 'today');
  await expectNoHorizontalOverflow(page);
});

test('mobile How view remains contained and uses compact foundation cards', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openCurrentBrief(page);
  await enterScenario(page, 'team');

  await page.locator('#mobileNav [data-primary-view="how"]').click();
  await expect(page.locator('[data-view-panel="how"]')).toBeVisible();
  await expect(page.locator('#intelligenceExplainers')).toBeVisible();

  await page.locator('[data-memory-example="preference"]').click();
  await page.locator('[data-space-example="team"]').click();
  await expectNoHorizontalOverflow(page);

  const layout = await page.evaluate(() => {
    const viewport = document.documentElement.clientWidth;
    const selectors = [
      '.foundation-map',
      '.foundation-map > *',
      '.intelligence-explainers',
      '.explainer-tabs',
      '.memory-comparison',
      '.comparison-card',
      '.space-example-panel'
    ];
    const rects = selectors.flatMap(selector =>
      [...document.querySelectorAll(selector)].map(node => {
        const rect = node.getBoundingClientRect();
        return { selector, left: rect.left, right: rect.right, width: rect.width, height: rect.height };
      })
    );
    const foundationHeights = [...document.querySelectorAll('.foundation-map > *')]
      .map(node => node.getBoundingClientRect().height);

    return {
      viewport,
      rects,
      maxFoundationHeight: Math.max(...foundationHeights)
    };
  });

  for (const rect of layout.rects) {
    expect(rect.left, `${rect.selector} should stay inside the left edge`).toBeGreaterThanOrEqual(-1);
    expect(rect.right, `${rect.selector} should stay inside the right edge`).toBeLessThanOrEqual(layout.viewport + 1);
    expect(rect.width, `${rect.selector} should not exceed the viewport`).toBeLessThanOrEqual(layout.viewport + 1);
  }
  expect(layout.maxFoundationHeight).toBeLessThanOrEqual(220);
});

test('Spotify failure never blocks entry or opens the drawer automatically', async ({ page }) => {
  await page.route('https://open.spotify.com/**', route => route.abort());
  await openCurrentBrief(page);

  await page.locator('[data-entry-scenario="team"]').click();
  await expect(page.locator('#openDemo')).toBeEnabled();
  await page.locator('#openDemo').click();

  await expect(page.locator('body')).toHaveAttribute('data-entered', 'true');
  await expect(page.locator('#mediaDrawer')).not.toHaveClass(/is-open/);
  await expect(page.locator('#mediaDrawer')).toHaveAttribute('inert', '');

  await page.locator('#mediaButton').click();
  await expect(page.locator('#mediaDrawer')).toHaveClass(/is-open/);
  await expect(page.locator('#mediaDrawer')).not.toHaveAttribute('inert', '');
  await expect(page.locator('#previewButton')).toBeHidden();
  await expect(page.locator('#spotifyFrame')).toHaveAttribute('src', /open\.spotify\.com\/embed\/track\//);

  await page.locator('.media-heading [data-close-media]').click();
  await expect(page.locator('#mediaDrawer')).not.toHaveClass(/is-open/);
  await expect(page.locator('#mediaDrawer')).toHaveAttribute('inert', '');
});

test('legacy Brief route preserves URL state while redirecting to Spaces', async ({ page }) => {
  await page.goto('/brief/?theme=dark#how', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL(/\/spaces\/\?theme=dark#how$/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('#entry')).toBeVisible();
});

test('explicit theme query remains reversible on active and rollback routes', async ({ page }) => {
  await prepareFreshPage(page);

  for (const route of ['/spaces/', '/brief-next/']) {
    await page.goto(`${route}?theme=dark`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#05070b');

    await page.goto(`${route}?theme=light`, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#edf3f8');
    await expect(page.locator('#entry')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }
});

test('Doc final demo CTA stays contained on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/doc/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#edf3f8');
  await expect(page.locator('link[data-spaces-mobile-fixes="true"]')).toHaveCount(1);

  const cta = page.locator('.final-cta');
  await cta.scrollIntoViewIfNeeded();
  await expect(cta).toBeVisible();

  const containment = await page.evaluate(() => {
    const section = document.querySelector('.final-cta');
    const heading = section?.querySelector('h2');
    const button = section?.querySelector('.button');
    const viewport = document.documentElement.clientWidth;
    const sectionRect = section?.getBoundingClientRect();
    const buttonRect = button?.getBoundingClientRect();

    return {
      documentOverflow: document.documentElement.scrollWidth - viewport,
      bodyOverflow: document.body.scrollWidth - document.body.clientWidth,
      sectionRight: sectionRect?.right || 0,
      buttonRight: buttonRect?.right || 0,
      viewport,
      headingOverflow: heading ? heading.scrollWidth - heading.clientWidth : 0,
      sectionColumns: section ? getComputedStyle(section).gridTemplateColumns : ''
    };
  });

  expect(containment.documentOverflow).toBeLessThanOrEqual(1);
  expect(containment.bodyOverflow).toBeLessThanOrEqual(1);
  expect(containment.sectionRight).toBeLessThanOrEqual(containment.viewport + 1);
  expect(containment.buttonRight).toBeLessThanOrEqual(containment.viewport + 1);
  expect(containment.headingOverflow).toBeLessThanOrEqual(1);
  expect(containment.sectionColumns).not.toBe('none');

  const mobileType = await page.evaluate(() => ({
    root: parseFloat(getComputedStyle(document.documentElement).fontSize),
    previewCopy: parseFloat(getComputedStyle(document.querySelector('.product-preview-heading p')).fontSize),
    calendarEvent: parseFloat(getComputedStyle(document.querySelector('.calendar-preview-events strong')).fontSize),
    investmentCopy: parseFloat(getComputedStyle(document.querySelector('.defensibility-status-grid p')).fontSize),
    investmentStatus: parseFloat(getComputedStyle(document.querySelector('.defensibility-status')).fontSize),
    finalNote: parseFloat(getComputedStyle(document.querySelector('.final-cta-note')).fontSize)
  }));
  expect(mobileType.root).toBeGreaterThanOrEqual(17);
  expect(mobileType.previewCopy).toBeGreaterThanOrEqual(14);
  expect(mobileType.calendarEvent).toBeGreaterThanOrEqual(13);
  expect(mobileType.investmentCopy).toBeGreaterThanOrEqual(13);
  expect(mobileType.investmentStatus).toBeGreaterThanOrEqual(10);
  expect(mobileType.finalNote).toBeGreaterThanOrEqual(13);
});

test('Doc renders the plain-language copy audit', async ({ page }) => {
  await page.goto('/doc/?theme=light', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#pageTitle')).toHaveText('One briefing for the part of life you’re in');
  await expect(page.locator('.hero-lead')).toContainText('Shared details meet in one Brief');
  await expect(page.locator('#statusTitle')).toHaveText('The current demo shows the product direction and the work still required');
  await expect(page.locator('#architectureTitle')).toHaveText('Keep the product architecture understandable and controllable');
  await expect(page.locator('#finalCtaTitle')).toHaveText('Explore the current Spaces Brief demo');
  await expect(page.locator('.product-preview-stage')).toHaveCount(1);
  await expect(page.locator('#investment')).toHaveCount(1);
  await expect(page.locator('.market-table-shell')).toContainText('Adjacent products reviewed');
  await expect(page.locator('#investment a[href="https://developers.cloudflare.com/agents/"]')).toHaveCount(1);
  await expect(page.locator('.status-list').first()).toContainText('A separate `/brief-next/` snapshot retained for rollback reference');
  await expectPlainVisibleCopy(page);
});
