const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const indexHtml = read('brief/index.html');
const configJs = read('assets/brief/brief-config.js');
const deviceJs = read('assets/brief/brief-device.js');
const deviceCss = read('assets/brief/brief-device.css');

assert.match(indexHtml, /noindex, nofollow/);
assert.match(indexHtml, /<option value="" disabled selected>Choose the briefing you want to explore<\/option>/);
assert.match(indexHtml, /<input id="musicOnEntry" type="checkbox"\s*\/>/);
assert.match(indexHtml, /<input id="readOnEntry" type="checkbox"\s*\/>/);
assert.match(indexHtml, /id="enterBrief"[^>]*disabled[^>]*aria-disabled="true"/);
assert.match(configJs, /select\.dataset\.requiredChoice = 'true'/);
assert.match(configJs, /select\.dataset\.liveRequired = 'true'/);
assert.match(configJs, /Choose any entry preferences/);
assert.match(configJs, /function forceTop\(\)/);
assert.match(configJs, /window\.scrollTo\(\{ top: 0, left: 0, behavior: 'auto' \}\)/);
assert.match(configJs, /brief-device\.css/);
assert.match(configJs, /brief-device\.js/);
assert.match(configJs, /script\.addEventListener\('error', finish/);
assert.match(deviceCss, /safe-area-inset-top/);
assert.match(deviceCss, /overflow-x: hidden/);
assert.match(deviceCss, /#themeToggleButton/);
assert.match(deviceCss, /width: 44px !important/);
assert.match(deviceCss, /height: 44px !important/);
assert.match(deviceCss, /flex-wrap: nowrap !important/);
assert.match(deviceCss, /box-shadow: 0 0 10px/);
assert.match(deviceJs, /visualViewport/);
assert.match(deviceJs, /speechSynthesis/);
assert.match(deviceJs, /navigator\.onLine/);
assert.match(deviceJs, /function forceDocumentTop\(\)/);
assert.match(deviceJs, /history\.scrollRestoration = 'manual'/);
assert.match(deviceJs, /window\.setTimeout\(forceDocumentTop, 320\)/);
assert.match(deviceJs, /const root = \$\('#briefApp'\) \|\| document\.body/);
assert.match(deviceJs, /requestAnimationFrame/);

class ClassList {
  constructor() { this.values = new Set(); }
  add(...values) { values.forEach(value => this.values.add(value)); }
  remove(...values) { values.forEach(value => this.values.delete(value)); }
  contains(value) { return this.values.has(value); }
  toggle(value, enabled) {
    const next = enabled === undefined ? !this.values.has(value) : enabled;
    next ? this.values.add(value) : this.values.delete(value);
    return next;
  }
}

class EventTargetMock {
  constructor() { this.listeners = {}; }
  addEventListener(type, handler, options) {
    const capture = options === true || Boolean(options?.capture);
    (this.listeners[type] ||= []).push({ handler, capture });
  }
  dispatchEvent(event) {
    event.target ||= this;
    const handlers = [...(this.listeners[event.type] || [])].sort((a, b) => Number(b.capture) - Number(a.capture));
    for (const item of handlers) {
      item.handler(event);
      if (event.immediateStopped) break;
    }
    return !event.defaultPrevented;
  }
}

class MutationObserverMock {
  constructor(callback) {
    this.callback = callback;
    this.targets = [];
  }
  observe(target, options = {}) {
    this.targets.push({ target, options });
  }
  disconnect() {
    this.targets = [];
  }
  takeRecords() {
    return [];
  }
}

class ElementMock extends EventTargetMock {
  constructor(id = '', tag = 'div') {
    super();
    this.id = id;
    this.tagName = tag.toUpperCase();
    this.dataset = {};
    this.attributes = {};
    this.classList = new ClassList();
    this.children = [];
    this.options = [];
    this.style = {};
    this.value = '';
    this.disabled = false;
    this.checked = false;
    this.textContent = '';
    this.parent = null;
    this.scrollTop = 75;
  }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name] ?? null; }
  appendChild(child) {
    child.parent = this;
    this.children.push(child);
    if (child.tagName === 'OPTION') this.options.push(child);
    return child;
  }
  insertBefore(child, before) {
    child.parent = this;
    const index = this.children.indexOf(before);
    this.children.splice(index < 0 ? 0 : index, 0, child);
    if (child.tagName === 'OPTION') this.options.unshift(child);
    return child;
  }
  querySelectorAll(selector) {
    if (selector === 'option[value=""]') return this.options.filter(option => option.value === '');
    return [];
  }
  closest(selector) { return selector === '.profile-field' ? field : null; }
  focus(options) { this.focused = true; this.focusOptions = options; }
  click() { this.dispatchEvent(makeEvent('click')); }
  remove() {
    if (!this.parent) return;
    this.parent.children = this.parent.children.filter(child => child !== this);
    this.parent.options = this.parent.options.filter(child => child !== this);
  }
}

function makeEvent(type) {
  return {
    type,
    defaultPrevented: false,
    immediateStopped: false,
    preventDefault() { this.defaultPrevented = true; },
    stopImmediatePropagation() { this.immediateStopped = true; }
  };
}

const elements = {};
const field = new ElementMock('profileField');
const select = new ElementMock('profileSelect', 'select');
select.closest = () => field;
for (const [value, label] of [
  ['', 'Choose'],
  ['individual', 'Personal'],
  ['couple', 'Relationship'],
  ['partners', 'Business'],
  ['trainer', 'Trainer']
]) {
  const option = new ElementMock('', 'option');
  option.value = value;
  option.textContent = label;
  select.appendChild(option);
}

const enter = new ElementMock('enterBrief', 'button');
const music = new ElementMock('musicOnEntry', 'input');
music.checked = true;
const narration = new ElementMock('readOnEntry', 'input');
narration.checked = true;
const gate = new ElementMock('entryGate');
const app = new ElementMock('briefApp');
const main = new ElementMock('briefMain');
const copy = new ElementMock('gateCopy');
Object.assign(elements, {
  profileSelect: select,
  enterBrief: enter,
  musicOnEntry: music,
  readOnEntry: narration,
  entryGate: gate,
  briefApp: app,
  briefMain: main
});

const documentMock = new EventTargetMock();
documentMock.readyState = 'complete';
documentMock.body = new ElementMock('body');
documentMock.body.classList.add('is-locked');
documentMock.body.scrollTop = 92;
documentMock.documentElement = { scrollTop: 81 };
documentMock.head = new ElementMock('head');
documentMock.getElementById = id => elements[id] || null;
documentMock.querySelector = selector => selector === '.gate-copy' ? copy : null;
documentMock.createElement = tag => new ElementMock('', tag);

const scrollCalls = [];
const windowMock = new EventTargetMock();
windowMock.window = windowMock;
windowMock.document = documentMock;
windowMock.setTimeout = setTimeout;
windowMock.requestAnimationFrame = callback => setTimeout(callback, 0);
windowMock.cancelAnimationFrame = handle => clearTimeout(handle);
windowMock.scrollTo = options => scrollCalls.push(options);
windowMock.CustomEvent = class CustomEventMock {
  constructor(type, options = {}) { this.type = type; this.detail = options.detail; }
};

const context = {
  window: windowMock,
  document: documentMock,
  sessionStorage: { setItem() {} },
  CustomEvent: windowMock.CustomEvent,
  MutationObserver: MutationObserverMock,
  requestAnimationFrame: windowMock.requestAnimationFrame,
  cancelAnimationFrame: windowMock.cancelAnimationFrame,
  setTimeout,
  clearTimeout,
  console
};
vm.createContext(context);
vm.runInContext(configJs, context);

assert.equal(select.value, '');
assert.equal(enter.disabled, true);
assert.equal(enter.textContent, 'Choose a briefing first');
assert.equal(music.checked, false);
assert.equal(narration.checked, false);

select.value = 'partners';
select.dispatchEvent(makeEvent('change'));
assert.equal(enter.disabled, false);
assert.equal(enter.textContent, 'Open this briefing');

enter.click();
assert.equal(enter.disabled, true);
assert.equal(enter.textContent, 'Preparing briefing…');
assert.equal(documentMock.body.classList.contains('is-locked'), true);
assert.equal(gate.scrollTop, 0);
assert.equal(documentMock.documentElement.scrollTop, 0);
assert.equal(documentMock.body.scrollTop, 0);
assert.ok(scrollCalls.length > 0);

windowMock.BRIEF_APP = {
  preset: null,
  setPreset(value) { this.preset = value; }
};
windowMock.dispatchEvent(new windowMock.CustomEvent('brief:ready', { detail: { preset: 'individual' } }));

setTimeout(() => {
  assert.equal(documentMock.body.classList.contains('is-locked'), false);
  assert.equal(app.getAttribute('aria-hidden'), 'false');
  assert.equal(windowMock.BRIEF_APP.preset, 'partners');
  assert.equal(select.value, 'partners');
  assert.equal(gate.scrollTop, 0);
  assert.equal(documentMock.documentElement.scrollTop, 0);
  assert.equal(documentMock.body.scrollTop, 0);
  console.log('Brief device smoke test passed.');
}, 550);