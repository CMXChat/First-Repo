const { test, expect } = require('@playwright/test');

const STORAGE_KEY = 'cmx_goal_intelligence_lab_v1';
const THEME_KEY = 'cmx_goal_intelligence_theme_v1';

async function openClean(page) {
  await page.goto('/goals-lab/');
  await page.evaluate(({ storageKey, themeKey }) => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(themeKey);
    sessionStorage.clear();
  }, { storageKey: STORAGE_KEY, themeKey: THEME_KEY });
  await page.reload();
  await expect(page.locator('#pageTitle')).toBeVisible();
}

async function setRange(page, value) {
  await page.locator('#difficultyRange').evaluate((node, next) => {
    node.value = String(next);
    node.dispatchEvent(new Event('input', { bubbles: true }));
    node.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

test('loads without page errors and fits desktop or mobile viewport', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await openClean(page);

  await expect(page.locator('.prototype-badge')).toHaveText('ISOLATED PROTOTYPE');
  await expect(page.locator('.boundary-card')).toContainText('No `/brief` integration');
  await expect(page.locator('#goalPulse')).toBeVisible();
  await expect(page.locator('#goalSetup')).toBeVisible();

  const overflow = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
    bodyWidth: document.body.scrollWidth
  }));
  expect(overflow.documentWidth).toBeLessThanOrEqual(overflow.viewportWidth + 1);
  expect(overflow.bodyWidth).toBeLessThanOrEqual(overflow.viewportWidth + 1);
  expect(errors).toEqual([]);
});

test('goal edits, difficulty and local persistence survive reload', async ({ page }) => {
  await openClean(page);

  await page.locator('#goalTitle').fill('Ship the first Goal Intelligence prototype');
  await setRange(page, 1);
  await expect(page.locator('#difficultyLabel')).toHaveText('Recovery');
  await page.getByRole('button', { name: 'Update goal state' }).click();

  await expect(page.locator('#goalTitlePulse')).toHaveText('Ship the first Goal Intelligence prototype');
  await expect(page.locator('#difficultyValue')).toHaveText('Recovery');
  await expect(page.locator('#recommendationEffort')).toHaveText('10 min');
  await expect(page.locator('#saveStatus')).toHaveText('Goal updated');

  await page.reload();
  await expect(page.locator('#goalTitle')).toHaveValue('Ship the first Goal Intelligence prototype');
  await expect(page.locator('#goalTitlePulse')).toHaveText('Ship the first Goal Intelligence prototype');
  await expect(page.locator('#difficultyValue')).toHaveText('Recovery');
  await expect(page.locator('#saveStatus')).toHaveText('Local state restored');
});

test('check-in changes the question, recommendation and history', async ({ page }) => {
  await openClean(page);

  await page.locator('#checkInResult').selectOption('not_completed');
  await page.locator('#checkInCapacity').selectOption('10');
  await page.locator('#checkInEnergy').selectOption('low');
  await page.locator('#checkInBlocker').selectOption('technical');
  await page.locator('#checkInChange').fill('The setup command failed.');
  await page.getByRole('button', { name: 'Process check-in' }).click();

  await expect(page.locator('#activeQuestion')).toContainText('What exact command');
  await expect(page.locator('#recommendationTitle')).toContainText('Capture the exact setup error');
  await expect(page.locator('#recommendationEffort')).toHaveText('7 min');
  await expect(page.locator('#blockerValue')).toHaveText('Technical');
  await expect(page.locator('#historyList')).toContainText('Check-in processed');
});

test('answering a blocker question advances instead of repeating it', async ({ page }) => {
  await openClean(page);

  await page.locator('#checkInBlocker').selectOption('technical');
  await page.getByRole('button', { name: 'Process check-in' }).click();
  const firstQuestion = await page.locator('#activeQuestion').textContent();

  await page.locator('[data-question-value="install"]').click();
  await page.getByRole('button', { name: 'Save answer' }).click();

  await expect(page.locator('#historyList')).toContainText('Active question answered');
  await expect(page.locator('#historyList')).toContainText('Question loop advanced');
  await expect(page.locator('#activeQuestion')).not.toHaveText(firstQuestion || '');
  await expect(page.locator('#activeQuestion')).toContainText('What should happen next?');
});

test('evidence and recommendation outcomes update the operating record', async ({ page }) => {
  await openClean(page);

  await page.locator('#evidenceType').selectOption('github_commit');
  await page.locator('#evidenceConfidence').selectOption('high');
  await page.locator('#evidenceDetail').fill('Commit abc123 added a working FastAPI route.');
  await page.getByRole('button', { name: 'Add evidence' }).click();

  await expect(page.locator('#evidenceList')).toContainText('Commit abc123');
  await expect(page.locator('#trajectoryValue')).toHaveText('Improving');
  await expect(page.locator('#historyList')).toContainText('Evidence added');

  await page.locator('[data-outcome="completed"]').click();
  await expect(page.locator('#historyList')).toContainText('Recommendation outcome recorded');
  await expect(page.locator('#saveStatus')).toHaveText('Outcome saved');
});

test('theme and section navigation remain usable', async ({ page }) => {
  await openClean(page);

  const initialTheme = await page.locator('html').getAttribute('data-theme');
  await page.locator('#themeButton').click();
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', initialTheme || '');

  await page.locator('[data-scroll-target="evidencePanel"]').click();
  await expect(page.locator('#evidencePanel')).toBeInViewport();
});
