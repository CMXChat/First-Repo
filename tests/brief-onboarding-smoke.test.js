const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const index = read('brief/index.html');
const config = read('assets/brief/brief-config.js');
const onboarding = read('assets/brief/brief-onboarding.js');
const onboardingCss = read('assets/brief/brief-onboarding.css');
const onboardingBoundsCss = read('assets/brief/brief-onboarding-bounds.css');
const device = read('assets/brief/brief-device.js');
const deviceCss = read('assets/brief/brief-device.css');

new vm.Script(onboarding, { filename: 'brief-onboarding.js' });
new vm.Script(device, { filename: 'brief-device.js' });

assert.match(config, /brief-onboarding\.css/);
assert.match(config, /brief-onboarding-bounds\.css/);
assert.match(config, /brief-onboarding\.js/);
assert.match(config, /briefOnboardingScript/);
assert.match(index, /brief-config\.js\?v=/);

assert.match(onboarding, /window\.BRIEF_ONBOARDING/);
assert.match(onboarding, /#explainButton, #interactionHint/);
assert.match(onboarding, /event\.stopImmediatePropagation\(\)/);
assert.match(onboarding, /aria-haspopup/);
assert.match(onboarding, /aria-expanded/);
assert.match(onboarding, /Show me around/);
assert.match(onboarding, /Turn tips off/);
assert.match(onboarding, /STEPS = \[/);
assert.match(onboarding, /STEP \$\{next \+ 1\} OF/);
assert.match(onboarding, /Skip tour/);
assert.match(onboarding, /visualViewportBox/);
assert.match(onboarding, /window\.visualViewport\?\.addEventListener\('resize'/);
assert.match(onboarding, /window\.visualViewport\?\.addEventListener\('scroll'/);
assert.match(onboarding, /scrollIntoView/);
assert.match(onboarding, /prefers-reduced-motion/);
assert.match(onboarding, /trapFocus/);
assert.match(onboarding, /Escape/);
assert.match(onboarding, /inert/);
assert.doesNotMatch(onboarding, /new MutationObserver/);
assert.doesNotMatch(onboarding, /:has\(/);

assert.match(onboardingCss, /-webkit-backdrop-filter/);
assert.match(onboardingCss, /backdrop-filter/);
assert.match(onboardingCss, /@supports not \(\(-webkit-backdrop-filter/);
assert.match(onboardingCss, /env\(safe-area-inset-top\)/);
assert.match(onboardingCss, /env\(safe-area-inset-bottom\)/);
assert.match(onboardingCss, /prefers-reduced-motion: reduce/);
assert.match(onboardingCss, /prefers-contrast: more/);
assert.match(onboardingCss, /forced-colors: active/);
assert.match(onboardingCss, /@media \(pointer: coarse\)/);
assert.match(onboardingCss, /max-width: 390px/);

assert.match(onboardingBoundsCss, /max-height: calc\(var\(--brief-device-height/);
assert.match(onboardingBoundsCss, /overflow-y: auto/);
assert.match(onboardingBoundsCss, /overscroll-behavior: contain/);
assert.match(onboardingBoundsCss, /position: sticky/);
assert.match(onboardingBoundsCss, /prefers-reduced-motion: reduce/);

assert.match(device, /--brief-viewport-offset-top/);
assert.match(device, /--brief-keyboard-inset/);
assert.match(device, /visualViewport\?\.addEventListener\('scroll'/);
assert.match(device, /scheduleViewportRecovery/);
assert.match(device, /pageshow/);
assert.match(deviceCss, /--brief-device-width/);
assert.match(deviceCss, /brief-keyboard-visible/);
assert.match(deviceCss, /orientation: landscape/);
assert.match(deviceCss, /@supports not \(overflow: clip\)/);

console.log('Brief onboarding and browser compatibility smoke test passed.');
