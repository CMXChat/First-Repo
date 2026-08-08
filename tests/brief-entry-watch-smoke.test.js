const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const config = read('assets/brief/brief-config.js');
const entryJs = read('assets/brief/brief-entry-radio.js');
const entryCss = read('assets/brief/brief-entry-radio.css');
const watchJs = read('assets/brief/brief-relationship-watch.js');
const watchCss = read('assets/brief/brief-relationship-watch.css');
const dailyVideo = read('assets/daily-video.js');

new vm.Script(entryJs, { filename: 'brief-entry-radio.js' });
new vm.Script(watchJs, { filename: 'brief-relationship-watch.js' });
new vm.Script(dailyVideo, { filename: 'daily-video.js' });

assert.match(config, /brief-entry-radio\.css/);
assert.match(config, /brief-entry-radio\.js/);
assert.doesNotMatch(config, /brief-entry-dropdown/);
assert.match(config, /daily-video\.js/);
assert.match(config, /brief-relationship-watch\.css/);
assert.match(config, /brief-relationship-watch\.js/);

assert.match(entryJs, /input\.type = 'radio'/);
assert.match(entryJs, /input\.name = 'briefEntryType'/);
assert.match(entryJs, /select\.dispatchEvent\(new Event\('change'/);
assert.doesNotMatch(entryJs, /enter\.click\(\)/);
assert.doesNotMatch(entryJs, /Opening .*briefing/);
assert.match(entryJs, /Choose any entry preferences, then press Open this briefing/);
assert.match(entryJs, /Personal briefing/);
assert.match(entryJs, /Relationship briefing/);
assert.match(entryJs, /Business briefing/);
assert.match(entryJs, /Trainer \+ student/);
assert.match(entryCss, /grid-template-columns: repeat\(2/);
assert.match(entryCss, /\.has-entry-radio #enterBrief/);
assert.match(entryCss, /display: inline-flex !important/);
assert.match(entryCss, /width: 100%/);
assert.doesNotMatch(entryCss, /:has\(/);
assert.match(entryCss, /@media \(max-width: 620px\)/);
assert.match(entryCss, /grid-template-columns: 1fr/);

assert.match(watchJs, /currentPreset\(\) !== 'couple'/);
assert.match(watchJs, /window\.CMX_DAILY_VIDEO/);
assert.match(watchJs, /if \(!video\)/);
assert.match(watchJs, /youtube-nocookie\.com\/embed/);
assert.match(watchJs, /relationship-watch-poster/);
assert.match(watchJs, /player\.replaceChildren\(iframe\)/);
assert.doesNotMatch(watchJs, /MutationObserver/);
assert.match(watchCss, /aspect-ratio: 16 \/ 9/);
assert.match(watchCss, /html\[data-theme='light'\]/);

const hasNoDailyVideo = /window\.CMX_DAILY_VIDEO\s*=\s*null/.test(dailyVideo);
const hasValidYouTubeVideo = /provider:\s*["']youtube["']/.test(dailyVideo)
  && /videoId:\s*["'][A-Za-z0-9_-]{11}["']/.test(dailyVideo);
assert.ok(hasNoDailyVideo || hasValidYouTubeVideo, 'Daily video must be null or a valid YouTube record.');

console.log('Brief entry and relationship watch smoke test passed.');
