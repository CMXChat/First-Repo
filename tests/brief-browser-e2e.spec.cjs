'use strict';

const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

// Keep the long-lived browser matrix suite intact while updating the shared
// entry helper to enforce the current neutral chooser contract.
const sourcePath = path.join(__dirname, 'brief-browser-e2e.source.cjs');
let source = fs.readFileSync(sourcePath, 'utf8');

const previousEntrySetup = [
  "  await expect(page.locator(`[data-entry-scenario=\"${expectedEntryScenario}\"]`)).toHaveAttribute('aria-pressed', 'true');",
  "  if (await page.locator('#openDemo').isDisabled()) {",
  "    await page.locator(`[data-entry-scenario=\"${expectedEntryScenario}\"]`).click();",
  "  }"
].join('\n');

const neutralEntrySetup = [
  "  await expect(page.locator('[data-entry-scenario][aria-pressed=\"true\"]')).toHaveCount(0);",
  "  await expect(page.locator('[data-entry-scenario][aria-pressed=\"false\"]')).toHaveCount(7);",
  "  await expect(page.locator('#openDemo')).toBeDisabled();",
  "  await expect(page.locator('#entrySpacePreview')).toBeHidden();",
  "  await expect(page.locator('[data-entry-scenario=\"personal\"] .entry-option-topline em')).toHaveText('One person');",
  "  await page.locator(`[data-entry-scenario=\"${expectedEntryScenario}\"]`).click();",
  "  await expect(page.locator(`[data-entry-scenario=\"${expectedEntryScenario}\"]`)).toHaveAttribute('aria-pressed', 'true');"
].join('\n');

if (!source.includes(previousEntrySetup)) {
  throw new Error('Browser matrix source no longer matches the expected entry helper. Update the maintained suite directly before release.');
}

source = source.replace(previousEntrySetup, neutralEntrySetup);

const suite = new Module(sourcePath, module);
suite.filename = sourcePath;
suite.paths = Module._nodeModulePaths(__dirname);
suite._compile(source, sourcePath);
