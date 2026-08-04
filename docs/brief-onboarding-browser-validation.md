# Brief onboarding browser validation

Validated commit: `aeb0ac71bbb2df4d19d73d756712c11e3d846d8a`

## Coverage

- Seven source-level regression suites
- Chromium desktop
- Firefox desktop
- WebKit desktop
- WebKit iPhone 13 emulation
- Chromium Pixel 5 emulation
- Portrait and landscape viewport bounds
- Entry, help, six-step tour, tips toggle, Pause to Play, Team switch, Quick and Full workspace

## Result

Static failures: 2
Browser status: 1
Install outcome: success

## Static log

```text
=== tests/brief-device-smoke.test.js ===
Brief device smoke test passed.
status=0
=== tests/brief-onboarding-smoke.test.js ===
Brief onboarding and browser compatibility smoke test passed.
status=0
=== tests/brief-terminal-smoke.test.js ===
Brief terminal smoke test passed.
status=0
=== tests/brief-entry-watch-smoke.test.js ===
Brief entry and relationship watch smoke test passed.
status=0
=== tests/brief-stability-smoke.test.js ===
node:assert:883
    throw err;
    ^

AssertionError [ERR_ASSERTION]: The input did not match the regular expression /device: '20260803-2'/. Input:

'window.BRIEF_CONFIG = {\n' +
  "  preset: 'individual',\n" +
  "  theme: 'black',\n" +
  "  appearance: 'dark',\n" +
  "  storagePrefix: 'cmxBriefDemo',\n" +
  '  effects: {\n' +
  '    ambientGlow: true,\n' +
  '    weatherMotion: true,\n' +
  '    cardMotion: true\n' +
  '  },\n' +
  '  controls: {\n' +
  '    sharedView: true,\n' +
  '    readAloud: true,\n' +
  '    music: true,\n' +
  '    explainMode: true\n' +
  '  }\n' +
  '};\n' +
  '\n' +
  '(() => {\n' +
  "  'use strict';\n" +
  '\n' +
  '  const build = {\n' +
  "    device: '20260803-3',\n" +
  "    onboarding: '20260803-2',\n" +
  "    entry: '20260803-5',\n" +
  "    upgrade: '20260803-5',\n" +
  "    live: '20260803-5',\n" +
  "    daily: '20260803-3',\n" +
  "    experience: '20260803-4',\n" +
  "    terminal: '20260803-2',\n" +
  "    watch: '20260803-3',\n" +
  "    team: '20260803-1',\n" +
  "    workspace: '20260803-1',\n" +
  "    polish: '20260803-2'\n" +
  '  };\n' +
  '\n' +
  '  const labels = {\n' +
  "    individual: 'Personal',\n" +
  "    couple: 'Relationship',\n" +
  "    partners: 'Business',\n" +
  "    trainer: 'Trainer + student',\n" +
  "    team: 'Team + project'\n" +
  '  };\n' +
  '\n' +
  '  function forceTop() {\n' +
  "    const gate = document.getElementById('entryGate');\n" +
  '    if (gate) gate.scrollTop = 0;\n' +
  '    document.documentElement.scrollTop = 0;\n' +
  '    document.body.scrollTop = 0;\n' +
  "    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });\n" +
  '  }\n' +
  '\n' +
  '  function installEntryController() {\n' +
  "    const select = document.getElementById('profileSelect');\n" +
  "    const enter = document.getElementById('enterBrief');\n" +
  "    const field = select?.closest('.profile-field');\n" +
  '    if (!select || !enter) return;\n' +
  '\n' +
  "    select.dataset.requiredChoice = 'true';\n" +
  "    select.dataset.liveRequired = 'true';\n" +
  "    select.setAttribute('required', '');\n" +
  "    field?.classList.add('is-required');\n" +
  '\n' +
  `    const emptyOptions = [...select.querySelectorAll('option[value=""]')];\n` +
  '    let placeholder = emptyOptions.shift();\n' +
  '    emptyOptions.forEach(option => option.remove());\n' +
  '    if (!placeholder) {\n' +
  "      placeholder = document.createElement('option');\n" +
  "      placeholder.value = '';\n" +
  '      select.insertBefore(placeholder, select.firstChild);\n' +
  '    }\n' +
  '    placeholder.disabled = true;\n' +
  "    placeholder.textContent = 'Choose the briefing you want to explore';\n" +
  '\n' +
  "    let note = document.getElementById('gateSelectionNote');\n" +
  '    if (!note) {\n' +
  "      note = document.createElement('p');\n" +
  "      note.id = 'gateSelectionNote';\n" +
  "      note.className = 'gate-selection-note';\n" +
  '      field?.appendChild(note);\n' +
  '    }\n' +
  "    select.setAttribute('aria-describedby', 'gateSelectionNote');\n" +
  '\n' +
  "    const copy = document.querySelector('.gate-copy');\n" +
  '    if (copy) {\n' +
  "      copy.textContent = 'Choose the briefing you want to explore. The same private platform can organize one person, a relationship, business partners, a trainer and student, or a role-based team while keeping profiles and shared spaces separate.';\n" +
  '    }\n' +
  '\n' +
  "    let selectedValue = '';\n" +
  '    let appReady = Boolean(window.BRIEF_APP);\n' +
  '    let queuedOpen = false;\n' +
  '\n' +
  '    const validChoice = value => Object.prototype.hasOwnProperty.call(labels, value);\n' +
  '\n' +
  '    const updateControls = () => {\n' +
  "      const choice = validChoice(selectedValue) ? selectedValue : '';\n" +
  '      const enabled = Boolean(choice);\n' +
  '      enter.disabled = !enabled;\n' +
  "      enter.setAttribute('aria-disabled', String(!enabled));\n" +
  "      enter.classList.remove('is-preparing');\n" +
  "      enter.textContent = enabled ? 'Open this briefing' : 'Choose a briefing first';\n" +
  '      note.textContent = enabled\n' +
  '        ? `${labels[choice]} briefing selected. Choose any entry preferences, then press Open this briefing.`\n' +
  "        : 'Choose one version before continuing. You can switch between all five inside.';\n" +
  '    };\n' +
  '\n' +
  '    const acceptSelection = () => {\n' +
  "      const choice = validChoice(select.value) ? select.value : '';\n" +
  '      selectedValue = choice;\n' +
  '      select.dataset.userSelection = choice;\n' +
  '      updateControls();\n' +
  '    };\n' +
  '\n' +
  "    select.addEventListener('input', acceptSelection);\n" +
  "    select.addEventListener('change', acceptSelection);\n" +
  '\n' +
  "    enter.addEventListener('click', event => {\n" +
  "      const choice = validChoice(selectedValue) ? selectedValue : (validChoice(select.value) ? select.value : '');\n" +
  '      if (!choice) {\n' +
  '        event.preventDefault();\n' +
  '        event.stopImmediatePropagation();\n' +
  "        note.textContent = 'Choose Personal, Relationship, Business, Trainer + student, or Team + project first.';\n" +
  `        document.querySelector('input[name="briefEntryType"]')?.focus();\n` +
  '        return;\n' +
  '      }\n' +
  '\n' +
  '      selectedValue = choice;\n' +
  '      select.value = choice;\n' +
  '      forceTop();\n' +
  '\n' +
  '      if (!appReady || !window.BRIEF_APP) {\n' +
  '        event.preventDefault();\n' +
  '        event.stopImmediatePropagation();\n' +
  '        queuedOpen = true;\n' +
  '        enter.disabled = true;\n' +
  "        enter.setAttribute('aria-disabled', 'true');\n" +
  "        enter.classList.add('is-preparing');\n" +
  "        enter.textContent = 'Preparing briefing…';\n" +
  "        note.textContent = 'The briefing is finishing its device setup. It will open automatically.';\n" +
  '        return;\n' +
  '      }\n' +
  '\n' +
  '      window.setTimeout(() => {\n' +
  "        if (!document.body.classList.contains('is-locked')) return;\n" +
  '        if (!window.BRIEF_APP || !validChoice(selectedValue)) return;\n' +
  '        window.BRIEF_APP.setPreset(selectedValue);\n' +
  "        document.body.classList.remove('is-locked');\n" +
  "        document.getElementById('entryGate')?.classList.add('is-hidden');\n" +
  "        document.getElementById('briefApp')?.setAttribute('aria-hidden', 'false');\n" +
  "        try { sessionStorage.setItem(`${window.BRIEF_CONFIG.storagePrefix}:entered`, 'true'); } catch {}\n" +
  '        forceTop();\n' +
  '        window.setTimeout(forceTop, 80);\n' +
  "        try { document.getElementById('briefMain')?.focus({ preventScroll: true }); } catch { document.getElementById('briefMain')?.focus(); }\n" +
  "        window.dispatchEvent(new CustomEvent('brief:device-fallback-open', { detail: { preset: selectedValue } }));\n" +
  '      }, 450);\n' +
  '    }, true);\n' +
  '\n' +
  "    window.addEventListener('brief:ready', () => {\n" +
  '      appReady = true;\n' +
  "      if (!validChoice(selectedValue)) selectedValue = '';\n" +
  '      select.value = selectedValue;\n' +
  '      updateControls();\n' +
  '      if (queuedOpen && selectedValue) {\n' +
  '        queuedOpen = false;\n' +
  '        window.setTimeout(() => enter.click(), 0);\n' +
  '      }\n' +
  '    });\n' +
  '\n' +
  "    selectedValue = '';\n" +
  "    select.value = '';\n" +
  "    const music = document.getElementById('musicOnEntry');\n" +
  "    const narration = document.getElementById('readOnEntry');\n" +
  '    if (music) music.checked = false;\n' +
  '    if (narration) narration.checked = false;\n' +
  '    updateControls();\n' +
  '  }\n' +
  '\n' +
  '  function loadStyle(id, href) {\n' +
  '    if (document.getElementById(id)) return;\n' +
  "    const link = document.createElement('link');\n" +
  '    link.id = id;\n' +
  "    link.rel = 'stylesheet';\n" +
  '    link.href = href;\n' +
  '    document.head.appendChild(link);\n' +
  '  }\n' +
  '\n' +
  '  function loadScript(id, src, onload) {\n' +
  '    const existing = document.getElementById(id);\n' +
  '    if (existing) {\n' +
  '      if (onload) onload();\n' +
  '      return;\n' +
  '    }\n' +
  "    const script = document.createElement('script');\n" +
  '    script.id = id;\n' +
  '    script.src = src;\n' +
  '    script.async = false;\n' +
  '    if (onload) {\n' +
  '      let completed = false;\n' +
  '      const finish = () => {\n' +
  '        if (completed) return;\n' +
  '        completed = true;\n' +
  '        onload();\n' +
  '      };\n' +
  "      script.addEventListener('load', finish, { once: true });\n" +
  "      script.addEventListener('error', finish, { once: true });\n" +
  '    }\n' +
  '    document.head.appendChild(script);\n' +
  '  }\n' +
  '\n' +
  '  installEntryController();\n' +
  '\n' +
  "  loadStyle('briefDeviceStyle', `/assets/brief/brief-device.css?v=${build.device}`);\n" +
  "  loadStyle('briefOnboardingStyle', `/assets/brief/brief-onboarding.css?v=${build.onboarding}`);\n" +
  "  loadStyle('briefEntryRadioStyle', `/assets/brief/brief-entry-radio.css?v=${build.entry}`);\n" +
  "  loadStyle('briefUpgradeStyle', `/assets/brief/brief-upgrade.css?v=${build.upgrade}`);\n" +
  "  loadStyle('briefLiveStyle', `/assets/brief/brief-live.css?v=${build.live}`);\n" +
  "  loadStyle('briefDailyStyle', `/assets/brief/brief-daily.css?v=${build.daily}`);\n" +
  "  loadStyle('briefExperienceStyle', `/assets/brief/brief-experience.css?v=${build.experience}`);\n" +
  "  loadStyle('briefTerminalStyle', `/assets/brief/brief-terminal.css?v=${build.terminal}`);\n" +
  "  loadStyle('briefRelationshipWatchStyle', `/assets/brief/brief-relationship-watch.css?v=${build.watch}`);\n" +
  "  loadStyle('briefWorkspaceStyle', `/assets/brief/brief-workspace.css?v=${build.workspace}`);\n" +
  "  loadStyle('briefPolishStyle', `/assets/brief/brief-polish.css?v=${build.polish}`);\n" +
  '\n' +
  "  loadScript('briefDeviceScript', `/assets/brief/brief-device.js?v=${build.device}`);\n" +
  "  loadScript('briefEntryRadioScript', `/assets/brief/brief-entry-radio.js?v=${build.entry}`);\n" +
  '\n' +
  "  loadScript('briefOnboardingScript', `/assets/brief/brief-onboarding.js?v=${build.onboarding}`, () => {\n" +
  "    loadScript('briefDailyVideoScript', `/assets/daily-video.js?v=${build.watch}`, () => {\n" +
  "      loadScript('briefUpgradeScript', `/assets/brief/brief-upgrade.js?v=${build.upgrade}`, () => {\n" +
  "        loadScript('briefLiveDataScript', `/assets/brief/brief-live-data.js?v=${build.live}`, () => {\n" +
  "          loadScript('briefLiveScript', `/assets/brief/brief-live.js?v=${build.live}`, () => {\n" +
  "            loadScript('briefLivePatchScript', `/assets/brief/brief-live-patch.js?v=${build.live}`, () => {\n" +
  "              loadScript('briefDailyContentScript', `/assets/brief/brief-daily-content.js?v=${build.daily}`, () => {\n" +
  "                loadScript('briefDailyScript', `/assets/brief/brief-daily.js?v=${build.daily}`, () => {\n" +
  "                  loadScript('briefExperienceGuardScript', `/assets/brief/brief-experience-guard.js?v=${build.experience}`, () => {\n" +
  "                    loadScript('briefVirgoPairScript', `/assets/brief/brief-virgo-pair.js?v=${build.experience}`, () => {\n" +
  "                      loadScript('briefExperienceScript', `/assets/brief/brief-experience.js?v=${build.experience}`, () => {\n" +
  "                        loadScript('briefTerminalScript', `/assets/brief/brief-terminal.js?v=${build.terminal}`, () => {\n" +
  "                          loadScript('briefRelationshipWatchScript', `/assets/brief/brief-relationship-watch.js?v=${build.watch}`, () => {\n" +
  "                            loadScript('briefTeamRendererScript', `/assets/brief/brief-team-renderer.js?v=${build.team}`, () => {\n" +
  "                              loadScript('briefWorkspaceScript', `/assets/brief/brief-workspace.js?v=${build.workspace}`"... 432 more characters

    at Object.<anonymous> (/home/runner/work/First-Repo/First-Repo/tests/brief-stability-smoke.test.js:24:8)
    at Module._compile (node:internal/modules/cjs/loader:1781:14)
    at Object..js (node:internal/modules/cjs/loader:1913:10)
    at Module.load (node:internal/modules/cjs/loader:1505:32)
    at Function._load (node:internal/modules/cjs/loader:1309:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5)
    at node:internal/main/run_main_module:36:49 {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: 'window.BRIEF_CONFIG = {\n' +
    "  preset: 'individual',\n" +
    "  theme: 'black',\n" +
    "  appearance: 'dark',\n" +
    "  storagePrefix: 'cmxBriefDemo',\n" +
    '  effects: {\n' +
    '    ambientGlow: true,\n' +
    '    weatherMotion: true,\n' +
    '    cardMotion: true\n' +
    '  },\n' +
    '  controls: {\n' +
    '    sharedView: true,\n' +
    '    readAloud: true,\n' +
    '    music: true,\n' +
    '    explainMode: true\n' +
    '  }\n' +
    '};\n' +
    '\n' +
    '(() => {\n' +
    "  'use strict';\n" +
    '\n' +
    '  const build = {\n' +
    "    device: '20260803-3',\n" +
    "    onboarding: '20260803-2',\n" +
    "    entry: '20260803-5',\n" +
    "    upgrade: '20260803-5',\n" +
    "    live: '20260803-5',\n" +
    "    daily: '20260803-3',\n" +
    "    experience: '20260803-4',\n" +
    "    terminal: '20260803-2',\n" +
    "    watch: '20260803-3',\n" +
    "    team: '20260803-1',\n" +
    "    workspace: '20260803-1',\n" +
    "    polish: '20260803-2'\n" +
    '  };\n' +
    '\n' +
    '  const labels = {\n' +
    "    individual: 'Personal',\n" +
    "    couple: 'Relationship',\n" +
    "    partners: 'Business',\n" +
    "    trainer: 'Trainer + student',\n" +
    "    team: 'Team + project'\n" +
    '  };\n' +
    '\n' +
    '  function forceTop() {\n' +
    "    const gate = document.getElementById('entryGate');\n" +
    '    if (gate) gate.scrollTop = 0;\n' +
    '    document.documentElement.scrollTop = 0;\n' +
    '    document.body.scrollTop = 0;\n' +
    "    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });\n" +
    '  }\n' +
    '\n' +
    '  function installEntryController() {\n' +
    "    const select = document.getElementById('profileSelect');\n" +
    "    const enter = document.getElementById('enterBrief');\n" +
    "    const field = select?.closest('.profile-field');\n" +
    '    if (!select || !enter) return;\n' +
    '\n' +
    "    select.dataset.requiredChoice = 'true';\n" +
    "    select.dataset.liveRequired = 'true';\n" +
    "    select.setAttribute('required', '');\n" +
    "    field?.classList.add('is-required');\n" +
    '\n' +
    `    const emptyOptions = [...select.querySelectorAll('option[value=""]')];\n` +
    '    let placeholder = emptyOptions.shift();\n' +
    '    emptyOptions.forEach(option => option.remove());\n' +
    '    if (!placeholder) {\n' +
    "      placeholder = document.createElement('option');\n" +
    "      placeholder.value = '';\n" +
    '      select.insertBefore(placeholder, select.firstChild);\n' +
    '    }\n' +
    '    placeholder.disabled = true;\n' +
    "    placeholder.textContent = 'Choose the briefing you want to explore';\n" +
    '\n' +
    "    let note = document.getElementById('gateSelectionNote');\n" +
    '    if (!note) {\n' +
    "      note = document.createElement('p');\n" +
    "      note.id = 'gateSelectionNote';\n" +
    "      note.className = 'gate-selection-note';\n" +
    '      field?.appendChild(note);\n' +
    '    }\n' +
    "    select.setAttribute('aria-describedby', 'gateSelectionNote');\n" +
    '\n' +
    "    const copy = document.querySelector('.gate-copy');\n" +
    '    if (copy) {\n' +
    "      copy.textContent = 'Choose the briefing you want to explore. The same private platform can organize one person, a relationship, business partners, a trainer and student, or a role-based team while keeping profiles and shared spaces separate.';\n" +
    '    }\n' +
    '\n' +
    "    let selectedValue = '';\n" +
    '    let appReady = Boolean(window.BRIEF_APP);\n' +
    '    let queuedOpen = false;\n' +
    '\n' +
    '    const validChoice = value => Object.prototype.hasOwnProperty.call(labels, value);\n' +
    '\n' +
    '    const updateControls = () => {\n' +
    "      const choice = validChoice(selectedValue) ? selectedValue : '';\n" +
    '      const enabled = Boolean(choice);\n' +
    '      enter.disabled = !enabled;\n' +
    "      enter.setAttribute('aria-disabled', String(!enabled));\n" +
    "      enter.classList.remove('is-preparing');\n" +
    "      enter.textContent = enabled ? 'Open this briefing' : 'Choose a briefing first';\n" +
    '      note.textContent = enabled\n' +
    '        ? `${labels[choice]} briefing selected. Choose any entry preferences, then press Open this briefing.`\n' +
    "        : 'Choose one version before continuing. You can switch between all five inside.';\n" +
    '    };\n' +
    '\n' +
    '    const acceptSelection = () => {\n' +
    "      const choice = validChoice(select.value) ? select.value : '';\n" +
    '      selectedValue = choice;\n' +
    '      select.dataset.userSelection = choice;\n' +
    '      updateControls();\n' +
    '    };\n' +
    '\n' +
    "    select.addEventListener('input', acceptSelection);\n" +
    "    select.addEventListener('change', acceptSelection);\n" +
    '\n' +
    "    enter.addEventListener('click', event => {\n" +
    "      const choice = validChoice(selectedValue) ? selectedValue : (validChoice(select.value) ? select.value : '');\n" +
    '      if (!choice) {\n' +
    '        event.preventDefault();\n' +
    '        event.stopImmediatePropagation();\n' +
    "        note.textContent = 'Choose Personal, Relationship, Business, Trainer + student, or Team + project first.';\n" +
    `        document.querySelector('input[name="briefEntryType"]')?.focus();\n` +
    '        return;\n' +
    '      }\n' +
    '\n' +
    '      selectedValue = choice;\n' +
    '      select.value = choice;\n' +
    '      forceTop();\n' +
    '\n' +
    '      if (!appReady || !window.BRIEF_APP) {\n' +
    '        event.preventDefault();\n' +
    '        event.stopImmediatePropagation();\n' +
    '        queuedOpen = true;\n' +
    '        enter.disabled = true;\n' +
    "        enter.setAttribute('aria-disabled', 'true');\n" +
    "        enter.classList.add('is-preparing');\n" +
    "        enter.textContent = 'Preparing briefing…';\n" +
    "        note.textContent = 'The briefing is finishing its device setup. It will open automatically.';\n" +
    '        return;\n' +
    '      }\n' +
    '\n' +
    '      window.setTimeout(() => {\n' +
    "        if (!document.body.classList.contains('is-locked')) return;\n" +
    '        if (!window.BRIEF_APP || !validChoice(selectedValue)) return;\n' +
    '        window.BRIEF_APP.setPreset(selectedValue);\n' +
    "        document.body.classList.remove('is-locked');\n" +
    "        document.getElementById('entryGate')?.classList.add('is-hidden');\n" +
    "        document.getElementById('briefApp')?.setAttribute('aria-hidden', 'false');\n" +
    "        try { sessionStorage.setItem(`${window.BRIEF_CONFIG.storagePrefix}:entered`, 'true'); } catch {}\n" +
    '        forceTop();\n' +
    '        window.setTimeout(forceTop, 80);\n' +
    "        try { document.getElementById('briefMain')?.focus({ preventScroll: true }); } catch { document.getElementById('briefMain')?.focus(); }\n" +
    "        window.dispatchEvent(new CustomEvent('brief:device-fallback-open', { detail: { preset: selectedValue } }));\n" +
    '      }, 450);\n' +
    '    }, true);\n' +
    '\n' +
    "    window.addEventListener('brief:ready', () => {\n" +
    '      appReady = true;\n' +
    "      if (!validChoice(selectedValue)) selectedValue = '';\n" +
    '      select.value = selectedValue;\n' +
    '      updateControls();\n' +
    '      if (queuedOpen && selectedValue) {\n' +
    '        queuedOpen = false;\n' +
    '        window.setTimeout(() => enter.click(), 0);\n' +
    '      }\n' +
    '    });\n' +
    '\n' +
    "    selectedValue = '';\n" +
    "    select.value = '';\n" +
    "    const music = document.getElementById('musicOnEntry');\n" +
    "    const narration = document.getElementById('readOnEntry');\n" +
    '    if (music) music.checked = false;\n' +
    '    if (narration) narration.checked = false;\n' +
    '    updateControls();\n' +
    '  }\n' +
    '\n' +
    '  function loadStyle(id, href) {\n' +
    '    if (document.getElementById(id)) return;\n' +
    "    const link = document.createElement('link');\n" +
    '    link.id = id;\n' +
    "    link.rel = 'stylesheet';\n" +
    '    link.href = href;\n' +
    '    document.head.appendChild(link);\n' +
    '  }\n' +
    '\n' +
    '  function loadScript(id, src, onload) {\n' +
    '    const existing = document.getElementById(id);\n' +
    '    if (existing) {\n' +
    '      if (onload) onload();\n' +
    '      return;\n' +
    '    }\n' +
    "    const script = document.createElement('script');\n" +
    '    script.id = id;\n' +
    '    script.src = src;\n' +
    '    script.async = false;\n' +
    '    if (onload) {\n' +
    '      let completed = false;\n' +
    '      const finish = () => {\n' +
    '        if (completed) return;\n' +
    '        completed = true;\n' +
    '        onload();\n' +
    '      };\n' +
    "      script.addEventListener('load', finish, { once: true });\n" +
    "      script.addEventListener('error', finish, { once: true });\n" +
    '    }\n' +
    '    document.head.appendChild(script);\n' +
    '  }\n' +
    '\n' +
    '  installEntryController();\n' +
    '\n' +
    "  loadStyle('briefDeviceStyle', `/assets/brief/brief-device.css?v=${build.device}`);\n" +
    "  loadStyle('briefOnboardingStyle', `/assets/brief/brief-onboarding.css?v=${build.onboarding}`);\n" +
    "  loadStyle('briefEntryRadioStyle', `/assets/brief/brief-entry-radio.css?v=${build.entry}`);\n" +
    "  loadStyle('briefUpgradeStyle', `/assets/brief/brief-upgrade.css?v=${build.upgrade}`);\n" +
    "  loadStyle('briefLiveStyle', `/assets/brief/brief-live.css?v=${build.live}`);\n" +
    "  loadStyle('briefDailyStyle', `/assets/brief/brief-daily.css?v=${build.daily}`);\n" +
    "  loadStyle('briefExperienceStyle', `/assets/brief/brief-experience.css?v=${build.experience}`);\n" +
    "  loadStyle('briefTerminalStyle', `/assets/brief/brief-terminal.css?v=${build.terminal}`);\n" +
    "  loadStyle('briefRelationshipWatchStyle', `/assets/brief/brief-relationship-watch.css?v=${build.watch}`);\n" +
    "  loadStyle('briefWorkspaceStyle', `/assets/brief/brief-workspace.css?v=${build.workspace}`);\n" +
    "  loadStyle('briefPolishStyle', `/assets/brief/brief-polish.css?v=${build.polish}`);\n" +
    '\n' +
    "  loadScript('briefDeviceScript', `/assets/brief/brief-device.js?v=${build.device}`);\n" +
    "  loadScript('briefEntryRadioScript', `/assets/brief/brief-entry-radio.js?v=${build.entry}`);\n" +
    '\n' +
    "  loadScript('briefOnboardingScript', `/assets/brief/brief-onboarding.js?v=${build.onboarding}`, () => {\n" +
    "    loadScript('briefDailyVideoScript', `/assets/daily-video.js?v=${build.watch}`, () => {\n" +
    "      loadScript('briefUpgradeScript', `/assets/brief/brief-upgrade.js?v=${build.upgrade}`, () => {\n" +
    "        loadScript('briefLiveDataScript', `/assets/brief/brief-live-data.js?v=${build.live}`, () => {\n" +
    "          loadScript('briefLiveScript', `/assets/brief/brief-live.js?v=${build.live}`, () => {\n" +
    "            loadScript('briefLivePatchScript', `/assets/brief/brief-live-patch.js?v=${build.live}`, () => {\n" +
    "              loadScript('briefDailyContentScript', `/assets/brief/brief-daily-content.js?v=${build.daily}`, () => {\n" +
    "                loadScript('briefDailyScript', `/assets/brief/brief-daily.js?v=${build.daily}`, () => {\n" +
    "                  loadScript('briefExperienceGuardScript', `/assets/brief/brief-experience-guard.js?v=${build.experience}`, () => {\n" +
    "                    loadScript('briefVirgoPairScript', `/assets/brief/brief-virgo-pair.js?v=${build.experience}`, () => {\n" +
    "                      loadScript('briefExperienceScript', `/assets/brief/brief-experience.js?v=${build.experience}`, () => {\n" +
    "                        loadScript('briefTerminalScript', `/assets/brief/brief-terminal.js?v=${build.terminal}`, () => {\n" +
    "                          loadScript('briefRelationshipWatchScript', `/assets/brief/brief-relationship-watch.js?v=${build.watch}`, () => {\n" +
    "                            loadScript('briefTeamRendererScript', `/assets/brief/brief-team-renderer.js?v=${build.team}`, () => {\n" +
    "                              loadScript('briefWorkspaceScript', `/assets/brief/brief-workspace.js?v=${build.workspace}`"... 432 more characters,
  expected: /device: '20260803-2'/,
  operator: 'match',
  diff: 'simple'
}

Node.js v22.23.1
status=1
=== tests/brief-workspace-team-smoke.test.js ===
node:assert:883
    throw err;
    ^

AssertionError [ERR_ASSERTION]: The input did not match the regular expression /brief-config\.js\?v=20260803-12/. Input:

'<!DOCTYPE html>\n' +
  '<html lang="en" data-theme="black">\n' +
  '<head>\n' +
  '  <meta charset="utf-8" />\n' +
  '  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />\n' +
  '  <meta name="color-scheme" content="dark" />\n' +
  '  <meta name="theme-color" content="#000000" />\n' +
  '  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />\n' +
  '  <meta name="description" content="A private personalized daily briefing product demonstration." />\n' +
  '  <link rel="canonical" href="https://db.cmxchat.com/brief/" />\n' +
  '  <title>Personal Briefing Demo</title>\n' +
  '  <link rel="stylesheet" href="/assets/brief/brief.css?v=20260803-4" />\n' +
  '  <link rel="stylesheet" href="/assets/brief/brief-music.css?v=20260803-2" />\n' +
  '  <link rel="stylesheet" href="/assets/brief/brief-scenarios.css?v=20260803-1" />\n' +
  '</head>\n' +
  '<body class="is-locked">\n' +
  '  <a class="skip-link" href="#briefMain">Skip to briefing</a>\n' +
  '\n' +
  '  <section class="entry-gate" id="entryGate" aria-labelledby="gateTitle">\n' +
  '    <div class="gate-orbit" aria-hidden="true"><span></span><span></span><span></span></div>\n' +
  '    <div class="gate-panel">\n' +
  '      <p class="micro-label">PRIVATE BRIEFING CONCEPT</p>\n' +
  '      <h1 id="gateTitle">Your day, already organized.</h1>\n' +
  '      <p class="gate-copy">Choose a fictional example. Each version demonstrates different users, private profiles, approved shared spaces, structured memory, connected services and actions.</p>\n' +
  '\n' +
  '      <label class="profile-field">\n' +
  '        <span>Demo profile</span>\n' +
  '        <select id="profileSelect" required>\n' +
  '          <option value="" disabled selected>Choose the briefing you want to explore</option>\n' +
  '          <option value="individual">Alex · Personal briefing</option>\n' +
  '          <option value="couple">Maya + Jordan · Couple and shared space</option>\n' +
  '          <option value="partners">Northstar · UK and US business partners</option>\n' +
  '          <option value="trainer">Nina + Sam · Trainer and student</option>\n' +
  '          <option value="team">Atlas · Team and project</option>\n' +
  '        </select>\n' +
  '      </label>\n' +
  '\n' +
  '      <div class="entry-options" aria-label="Entry preferences">\n' +
  '        <label class="option-row">\n' +
  '          <input id="musicOnEntry" type="checkbox" />\n' +
  '          <span><strong>Start today’s actual song</strong><small id="gateSongName">The authorized track preview begins after you press Enter.</small></span>\n' +
  '        </label>\n' +
  '        <label class="option-row">\n' +
  '          <input id="readOnEntry" type="checkbox" />\n' +
  '          <span><strong>Read the opening aloud</strong><small>Uses the device’s built-in speech voice and lowers the music while speaking.</small></span>\n' +
  '        </label>\n' +
  '      </div>\n' +
  '\n' +
  '      <button class="primary-action" id="enterBrief" type="button" disabled aria-disabled="true">Choose a briefing first</button>\n' +
  '      <p class="security-note">Concept gate only. Real private data would require server-side authentication.</p>\n' +
  '    </div>\n' +
  '  </section>\n' +
  '\n' +
  '  <div class="app" id="briefApp" aria-hidden="true">\n' +
  '    <header class="topbar">\n' +
  '      <a class="brand" href="#today" aria-label="Personal Brief home">\n' +
  '        <span class="brand-mark" aria-hidden="true"></span>\n' +
  '        <span>PERSONAL BRIEF</span>\n' +
  '      </a>\n' +
  '      <nav class="top-actions" aria-label="Briefing controls">\n' +
  '        <button class="quiet-button" id="viewModeButton" type="button" aria-pressed="false">Private view</button>\n' +
  '        <button class="icon-button" id="audioButton" type="button" aria-label="Play today’s song">♪</button>\n' +
  '        <button class="icon-button" id="readButton" type="button" aria-label="Read briefing aloud">Aa</button>\n' +
  '        <button class="icon-button" id="explainButton" type="button" aria-label="Explain the product" aria-pressed="false">?</button>\n' +
  '      </nav>\n' +
  '    </header>\n' +
  '\n' +
  '    <main id="briefMain" tabindex="-1">\n' +
  '      <section class="hero" id="today" aria-labelledby="heroTitle">\n' +
  '        <div class="hero-copy-block">\n' +
  '          <div class="hero-meta">\n' +
  '            <span class="status-pill status-demo">DEMO EDITION</span>\n' +
  '            <span id="editionDate">Monday, August 3</span>\n' +
  '          </div>\n' +
  '          <p class="greeting" id="greeting">Good afternoon, Alex.</p>\n' +
  '          <h1 id="heroTitle">Here is the shape of your day.</h1>\n' +
  '          <p class="hero-summary" id="heroSummary">Your schedule, weather, money, messages, goals and preferred briefing style are organized around what matters next.</p>\n' +
  '          <div class="hero-actions">\n' +
  '            <a class="primary-action" href="#scenarioExplorer">Explore this version</a>\n' +
  '            <button class="secondary-action" id="openConnections" type="button">View connections</button>\n' +
  '          </div>\n' +
  '        </div>\n' +
  '\n' +
  '        <aside class="next-up-panel" aria-labelledby="nextUpTitle">\n' +
  '          <div class="panel-topline">\n' +
  '            <span class="source-label source-connected">CONNECTED DEMO</span>\n' +
  '            <span id="currentTime">1:17 PM</span>\n' +
  '          </div>\n' +
  '          <p class="micro-label">NEXT UP</p>\n' +
  '          <h2 id="nextUpTitle">Website review with Morgan</h2>\n' +
  '          <p class="next-time" id="nextUpTime">2:30 PM · 45 minutes</p>\n' +
  '          <div class="prep-list" id="nextUpPrep">\n' +
  '            <span>Open prototype</span>\n' +
  '            <span>Confirm launch risks</span>\n' +
  '            <span>Leave with one owner</span>\n' +
  '          </div>\n' +
  '          <button class="text-action" type="button" data-concept-action="Prepare context-aware brief">Prepare this brief →</button>\n' +
  '        </aside>\n' +
  '      </section>\n' +
  '\n' +
  '      <nav class="section-nav" aria-label="Briefing sections">\n' +
  '        <a href="#weather">Weather</a>\n' +
  '        <a href="#music">Music</a>\n' +
  '        <a href="#scenarioExplorer">Examples</a>\n' +
  '        <a href="#priorities">Actions</a>\n' +
  '        <a href="#dailyRhythm">Daily updates</a>\n' +
  '        <a href="#learning">Memory</a>\n' +
  '        <a href="#possibilities">Possibilities</a>\n' +
  '        <a href="#connections">Connections</a>\n' +
  '      </nav>\n' +
  '\n' +
  '      <section class="brief-section weather-section" id="weather" aria-labelledby="weatherTitle">\n' +
  '        <div class="section-heading">\n' +
  '          <div>\n' +
  '            <p class="micro-label">LOCATION-AWARE WEATHER MODULE</p>\n' +
  '            <h2 id="weatherTitle">Plan around the sky, not a tiny icon.</h2>\n' +
  '          </div>\n' +
  '          <div class="weather-tabs" role="tablist" aria-label="Weather views">\n' +
  '            <button id="hourlyTab" role="tab" aria-selected="true" aria-controls="hourlyWeather" type="button">Hourly</button>\n' +
  '            <button id="dailyTab" role="tab" aria-selected="false" aria-controls="dailyWeather" type="button">Outlook</button>\n' +
  '          </div>\n' +
  '        </div>\n' +
  '\n' +
  '        <div class="weather-stage">\n' +
  '          <article class="weather-now" id="weatherNow">\n' +
  '            <div class="weather-visual" aria-hidden="true">\n' +
  '              <div class="sun-core"></div>\n' +
  '              <div class="weather-cloud cloud-one"></div>\n' +
  '              <div class="weather-cloud cloud-two"></div>\n' +
  '            </div>\n' +
  '            <div class="weather-primary">\n' +
  '              <span class="source-label source-demo">DEMO WEATHER</span>\n' +
  '              <p class="weather-location" id="weatherLocation">Brooklyn, New York</p>\n' +
  '              <strong class="weather-temp" id="weatherTemp">82°</strong>\n' +
  '              <p class="weather-condition" id="weatherCondition">Mostly sunny</p>\n' +
  '              <p class="weather-advice" id="weatherAdvice">Best outdoor window: 5:30–7:30 PM.</p>\n' +
  '            </div>\n' +
  '            <div class="weather-metrics" id="weatherMetrics"></div>\n' +
  '          </article>\n' +
  '\n' +
  '          <div class="weather-timeline" id="hourlyWeather" role="tabpanel" aria-labelledby="hourlyTab"></div>\n' +
  '          <div class="weather-timeline is-hidden" id="dailyWeather" role="tabpanel" aria-labelledby="dailyTab"></div>\n' +
  '        </div>\n' +
  '      </section>\n' +
  '\n' +
  '      <section class="brief-section music-section" id="music" aria-labelledby="musicSectionTitle">\n' +
  '        <div class="section-heading">\n' +
  '          <div>\n' +
  '            <p class="micro-label">ACTUAL SONG · SPOTIFY CONNECTION DEMO</p>\n' +
  '            <h2 id="musicSectionTitle">A soundtrack that belongs to the day.</h2>\n' +
  '          </div>\n' +
  '          <p>An authorized preview can begin after entry. The Spotify player demonstrates full provider playback and a personal favorites library.</p>\n' +
  '        </div>\n' +
  '\n' +
  '        <div class="music-hero">\n' +
  '          <div class="music-art" aria-hidden="true">\n' +
  '            <div class="music-art-core"></div>\n' +
  '            <div class="music-art-caption"><span>daily selection</span><span id="musicArtDate">2026.08.03</span></div>\n' +
  '          </div>\n' +
  '\n' +
  '          <article class="music-feature">\n' +
  '            <div>\n' +
  '              <span class="source-label source-connected">SPOTIFY DEMO</span>\n' +
  '              <p class="micro-label">TODAY’S FEATURED TRACK</p>\n' +
  '              <h3 id="musicTitle">Everywhere</h3>\n' +
  '              <p class="music-artist" id="musicArtist">Fleetwood Mac</p>\n' +
  '              <p class="music-reason" id="musicReason">Bright, affectionate and full of movement.</p>\n' +
  '              <p class="music-direct-line" id="musicDirectLine">Different places, same team.</p>\n' +
  '            </div>\n' +
  '\n' +
  '            <div class="music-controls">\n' +
  '              <div class="music-control-row">\n' +
  '                <button class="music-play-button" id="musicPreviewButton" type="button"><span aria-hidden="true">▶</span><b>Play actual song preview</b></button>\n' +
  '                <a class="music-open-link" id="musicSpotifyLink" href="https://open.spotify.com/" target="_blank" rel="noopener noreferrer">Open in Spotify</a>\n' +
  '              </div>\n' +
  '              <div class="music-progress" aria-label="Song preview progress">\n' +
  '                <span id="musicCurrentTime">0:00</span>\n' +
  '                <div class="music-progress-track"><i id="musicProgressBar"></i></div>\n' +
  '                <span id="musicDuration">0:30</span>\n' +
  '              </div>\n' +
  '              <p class="music-preview-note" id="musicPreviewNote">Authorized preview. Full playback depends on Spotify availability and account status.</p>\n' +
  '            </div>\n' +
  '          </article>\n' +
  '\n' +
  '          <aside class="spotify-embed-panel">\n' +
  '            <div class="spotify-panel-top">\n' +
  '          '... 9678 more characters

    at Object.<anonymous> (/home/runner/work/First-Repo/First-Repo/tests/brief-workspace-team-smoke.test.js:35:8)
    at Module._compile (node:internal/modules/cjs/loader:1781:14)
    at Object..js (node:internal/modules/cjs/loader:1913:10)
    at Module.load (node:internal/modules/cjs/loader:1505:32)
    at Function._load (node:internal/modules/cjs/loader:1309:12)
    at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5)
    at node:internal/main/run_main_module:36:49 {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: '<!DOCTYPE html>\n' +
    '<html lang="en" data-theme="black">\n' +
    '<head>\n' +
    '  <meta charset="utf-8" />\n' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />\n' +
    '  <meta name="color-scheme" content="dark" />\n' +
    '  <meta name="theme-color" content="#000000" />\n' +
    '  <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />\n' +
    '  <meta name="description" content="A private personalized daily briefing product demonstration." />\n' +
    '  <link rel="canonical" href="https://db.cmxchat.com/brief/" />\n' +
    '  <title>Personal Briefing Demo</title>\n' +
    '  <link rel="stylesheet" href="/assets/brief/brief.css?v=20260803-4" />\n' +
    '  <link rel="stylesheet" href="/assets/brief/brief-music.css?v=20260803-2" />\n' +
    '  <link rel="stylesheet" href="/assets/brief/brief-scenarios.css?v=20260803-1" />\n' +
    '</head>\n' +
    '<body class="is-locked">\n' +
    '  <a class="skip-link" href="#briefMain">Skip to briefing</a>\n' +
    '\n' +
    '  <section class="entry-gate" id="entryGate" aria-labelledby="gateTitle">\n' +
    '    <div class="gate-orbit" aria-hidden="true"><span></span><span></span><span></span></div>\n' +
    '    <div class="gate-panel">\n' +
    '      <p class="micro-label">PRIVATE BRIEFING CONCEPT</p>\n' +
    '      <h1 id="gateTitle">Your day, already organized.</h1>\n' +
    '      <p class="gate-copy">Choose a fictional example. Each version demonstrates different users, private profiles, approved shared spaces, structured memory, connected services and actions.</p>\n' +
    '\n' +
    '      <label class="profile-field">\n' +
    '        <span>Demo profile</span>\n' +
    '        <select id="profileSelect" required>\n' +
    '          <option value="" disabled selected>Choose the briefing you want to explore</option>\n' +
    '          <option value="individual">Alex · Personal briefing</option>\n' +
    '          <option value="couple">Maya + Jordan · Couple and shared space</option>\n' +
    '          <option value="partners">Northstar · UK and US business partners</option>\n' +
    '          <option value="trainer">Nina + Sam · Trainer and student</option>\n' +
    '          <option value="team">Atlas · Team and project</option>\n' +
    '        </select>\n' +
    '      </label>\n' +
    '\n' +
    '      <div class="entry-options" aria-label="Entry preferences">\n' +
    '        <label class="option-row">\n' +
    '          <input id="musicOnEntry" type="checkbox" />\n' +
    '          <span><strong>Start today’s actual song</strong><small id="gateSongName">The authorized track preview begins after you press Enter.</small></span>\n' +
    '        </label>\n' +
    '        <label class="option-row">\n' +
    '          <input id="readOnEntry" type="checkbox" />\n' +
    '          <span><strong>Read the opening aloud</strong><small>Uses the device’s built-in speech voice and lowers the music while speaking.</small></span>\n' +
    '        </label>\n' +
    '      </div>\n' +
    '\n' +
    '      <button class="primary-action" id="enterBrief" type="button" disabled aria-disabled="true">Choose a briefing first</button>\n' +
    '      <p class="security-note">Concept gate only. Real private data would require server-side authentication.</p>\n' +
    '    </div>\n' +
    '  </section>\n' +
    '\n' +
    '  <div class="app" id="briefApp" aria-hidden="true">\n' +
    '    <header class="topbar">\n' +
    '      <a class="brand" href="#today" aria-label="Personal Brief home">\n' +
    '        <span class="brand-mark" aria-hidden="true"></span>\n' +
    '        <span>PERSONAL BRIEF</span>\n' +
    '      </a>\n' +
    '      <nav class="top-actions" aria-label="Briefing controls">\n' +
    '        <button class="quiet-button" id="viewModeButton" type="button" aria-pressed="false">Private view</button>\n' +
    '        <button class="icon-button" id="audioButton" type="button" aria-label="Play today’s song">♪</button>\n' +
    '        <button class="icon-button" id="readButton" type="button" aria-label="Read briefing aloud">Aa</button>\n' +
    '        <button class="icon-button" id="explainButton" type="button" aria-label="Explain the product" aria-pressed="false">?</button>\n' +
    '      </nav>\n' +
    '    </header>\n' +
    '\n' +
    '    <main id="briefMain" tabindex="-1">\n' +
    '      <section class="hero" id="today" aria-labelledby="heroTitle">\n' +
    '        <div class="hero-copy-block">\n' +
    '          <div class="hero-meta">\n' +
    '            <span class="status-pill status-demo">DEMO EDITION</span>\n' +
    '            <span id="editionDate">Monday, August 3</span>\n' +
    '          </div>\n' +
    '          <p class="greeting" id="greeting">Good afternoon, Alex.</p>\n' +
    '          <h1 id="heroTitle">Here is the shape of your day.</h1>\n' +
    '          <p class="hero-summary" id="heroSummary">Your schedule, weather, money, messages, goals and preferred briefing style are organized around what matters next.</p>\n' +
    '          <div class="hero-actions">\n' +
    '            <a class="primary-action" href="#scenarioExplorer">Explore this version</a>\n' +
    '            <button class="secondary-action" id="openConnections" type="button">View connections</button>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '\n' +
    '        <aside class="next-up-panel" aria-labelledby="nextUpTitle">\n' +
    '          <div class="panel-topline">\n' +
    '            <span class="source-label source-connected">CONNECTED DEMO</span>\n' +
    '            <span id="currentTime">1:17 PM</span>\n' +
    '          </div>\n' +
    '          <p class="micro-label">NEXT UP</p>\n' +
    '          <h2 id="nextUpTitle">Website review with Morgan</h2>\n' +
    '          <p class="next-time" id="nextUpTime">2:30 PM · 45 minutes</p>\n' +
    '          <div class="prep-list" id="nextUpPrep">\n' +
    '            <span>Open prototype</span>\n' +
    '            <span>Confirm launch risks</span>\n' +
    '            <span>Leave with one owner</span>\n' +
    '          </div>\n' +
    '          <button class="text-action" type="button" data-concept-action="Prepare context-aware brief">Prepare this brief →</button>\n' +
    '        </aside>\n' +
    '      </section>\n' +
    '\n' +
    '      <nav class="section-nav" aria-label="Briefing sections">\n' +
    '        <a href="#weather">Weather</a>\n' +
    '        <a href="#music">Music</a>\n' +
    '        <a href="#scenarioExplorer">Examples</a>\n' +
    '        <a href="#priorities">Actions</a>\n' +
    '        <a href="#dailyRhythm">Daily updates</a>\n' +
    '        <a href="#learning">Memory</a>\n' +
    '        <a href="#possibilities">Possibilities</a>\n' +
    '        <a href="#connections">Connections</a>\n' +
    '      </nav>\n' +
    '\n' +
    '      <section class="brief-section weather-section" id="weather" aria-labelledby="weatherTitle">\n' +
    '        <div class="section-heading">\n' +
    '          <div>\n' +
    '            <p class="micro-label">LOCATION-AWARE WEATHER MODULE</p>\n' +
    '            <h2 id="weatherTitle">Plan around the sky, not a tiny icon.</h2>\n' +
    '          </div>\n' +
    '          <div class="weather-tabs" role="tablist" aria-label="Weather views">\n' +
    '            <button id="hourlyTab" role="tab" aria-selected="true" aria-controls="hourlyWeather" type="button">Hourly</button>\n' +
    '            <button id="dailyTab" role="tab" aria-selected="false" aria-controls="dailyWeather" type="button">Outlook</button>\n' +
    '          </div>\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="weather-stage">\n' +
    '          <article class="weather-now" id="weatherNow">\n' +
    '            <div class="weather-visual" aria-hidden="true">\n' +
    '              <div class="sun-core"></div>\n' +
    '              <div class="weather-cloud cloud-one"></div>\n' +
    '              <div class="weather-cloud cloud-two"></div>\n' +
    '            </div>\n' +
    '            <div class="weather-primary">\n' +
    '              <span class="source-label source-demo">DEMO WEATHER</span>\n' +
    '              <p class="weather-location" id="weatherLocation">Brooklyn, New York</p>\n' +
    '              <strong class="weather-temp" id="weatherTemp">82°</strong>\n' +
    '              <p class="weather-condition" id="weatherCondition">Mostly sunny</p>\n' +
    '              <p class="weather-advice" id="weatherAdvice">Best outdoor window: 5:30–7:30 PM.</p>\n' +
    '            </div>\n' +
    '            <div class="weather-metrics" id="weatherMetrics"></div>\n' +
    '          </article>\n' +
    '\n' +
    '          <div class="weather-timeline" id="hourlyWeather" role="tabpanel" aria-labelledby="hourlyTab"></div>\n' +
    '          <div class="weather-timeline is-hidden" id="dailyWeather" role="tabpanel" aria-labelledby="dailyTab"></div>\n' +
    '        </div>\n' +
    '      </section>\n' +
    '\n' +
    '      <section class="brief-section music-section" id="music" aria-labelledby="musicSectionTitle">\n' +
    '        <div class="section-heading">\n' +
    '          <div>\n' +
    '            <p class="micro-label">ACTUAL SONG · SPOTIFY CONNECTION DEMO</p>\n' +
    '            <h2 id="musicSectionTitle">A soundtrack that belongs to the day.</h2>\n' +
    '          </div>\n' +
    '          <p>An authorized preview can begin after entry. The Spotify player demonstrates full provider playback and a personal favorites library.</p>\n' +
    '        </div>\n' +
    '\n' +
    '        <div class="music-hero">\n' +
    '          <div class="music-art" aria-hidden="true">\n' +
    '            <div class="music-art-core"></div>\n' +
    '            <div class="music-art-caption"><span>daily selection</span><span id="musicArtDate">2026.08.03</span></div>\n' +
    '          </div>\n' +
    '\n' +
    '          <article class="music-feature">\n' +
    '            <div>\n' +
    '              <span class="source-label source-connected">SPOTIFY DEMO</span>\n' +
    '              <p class="micro-label">TODAY’S FEATURED TRACK</p>\n' +
    '              <h3 id="musicTitle">Everywhere</h3>\n' +
    '              <p class="music-artist" id="musicArtist">Fleetwood Mac</p>\n' +
    '              <p class="music-reason" id="musicReason">Bright, affectionate and full of movement.</p>\n' +
    '              <p class="music-direct-line" id="musicDirectLine">Different places, same team.</p>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="music-controls">\n' +
    '              <div class="music-control-row">\n' +
    '                <button class="music-play-button" id="musicPreviewButton" type="button"><span aria-hidden="true">▶</span><b>Play actual song preview</b></button>\n' +
    '                <a class="music-open-link" id="musicSpotifyLink" href="https://open.spotify.com/" target="_blank" rel="noopener noreferrer">Open in Spotify</a>\n' +
    '              </div>\n' +
    '              <div class="music-progress" aria-label="Song preview progress">\n' +
    '                <span id="musicCurrentTime">0:00</span>\n' +
    '                <div class="music-progress-track"><i id="musicProgressBar"></i></div>\n' +
    '                <span id="musicDuration">0:30</span>\n' +
    '              </div>\n' +
    '              <p class="music-preview-note" id="musicPreviewNote">Authorized preview. Full playback depends on Spotify availability and account status.</p>\n' +
    '            </div>\n' +
    '          </article>\n' +
    '\n' +
    '          <aside class="spotify-embed-panel">\n' +
    '            <div class="spotify-panel-top">\n' +
    '          '... 9678 more characters,
  expected: /brief-config\.js\?v=20260803-12/,
  operator: 'match',
  diff: 'simple'
}

Node.js v22.23.1
status=1
=== tests/brief-polish-smoke.test.js ===
Brief polish smoke test passed.
status=0
failures=2
```

## Browser log

```text

Running 25 tests using 2 workers

[1A[2K[1/25] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:42:1 › entry, help center and guided tour work without overflow
[1A[2K[2/25] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:42:1 › entry, help center and guided tour work without overflow
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:14] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:15] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:16] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:16] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:16] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:16] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:16] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:16] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:16] code 404, message File not found
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:16] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K[3/25] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:42:1 › entry, help center and guided tour work without overflow (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:26] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[4/25] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:75:1 › tips can be disabled and help remains available
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:27] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] code 404, message File not found
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:28] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:29] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:30] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:31] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[5/25] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:88:1 › moving signal rail resumes after pause
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:34] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:35] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:35] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:35] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:35] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:35] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:35] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:35] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:35] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:35] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:35] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:35] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:35] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:35] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:35] code 404, message File not found

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:35] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K  1) [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:42:1 › entry, help center and guided tour work without overflow 

    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m723[39m
    Received:    [31m779.5374755859375[39m

      30 |   expect(result.top).toBeGreaterThanOrEqual(-3);
      31 |   expect(result.right).toBeLessThanOrEqual(result.width + 3);
    > 32 |   expect(result.bottom).toBeLessThanOrEqual(result.height + 3);
         |                         ^
      33 | }
      34 |
      35 | test.beforeEach(async ({ page }) => {
        at expectInsideViewport (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:32:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:65:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-desktop/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-desktop/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-desktop/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-desktop/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m723[39m
    Received:    [31m1177.046875[39m

      30 |   expect(result.top).toBeGreaterThanOrEqual(-3);
      31 |   expect(result.right).toBeLessThanOrEqual(result.width + 3);
    > 32 |   expect(result.bottom).toBeLessThanOrEqual(result.height + 3);
         |                         ^
      33 | }
      34 |
      35 | test.beforeEach(async ({ page }) => {
        at expectInsideViewport (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:32:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:65:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-desktop-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-desktop-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-desktop-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-desktop-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[6/25] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:102:1 › help and tour stay usable in landscape viewport
[1A[2K[7/25] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:75:1 › tips can be disabled and help remains available
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:39] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] code 404, message File not found
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:40] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:41] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:41] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:42] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:42] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:43] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:43] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:43] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:43] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[8/25] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:88:1 › moving signal rail resumes after pause
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:45] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[9/25] [firefox-desktop] › tests/brief-browser-e2e.spec.cjs:115:1 › team switch, full workspace and question-mark help remain functional
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:46] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:47] code 404, message File not found
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:47] "GET /favicon.ico HTTP/1.1" 404 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:47] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:48] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:49] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:49] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:49] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:49] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:49] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[10/25] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:102:1 › help and tour stay usable in landscape viewport
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[11/25] [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:42:1 › entry, help center and guided tour work without overflow
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:52] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:53] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:53] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:54] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:54] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:54] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:54] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:54] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[12/25] [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:115:1 › team switch, full workspace and question-mark help remain functional
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:56] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:06:57] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:01] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:01] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:01] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:01] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:01] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:01] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:01] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:01] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:01] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:01] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:01] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:01] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:01] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:01] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:01] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[13/25] [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:42:1 › entry, help center and guided tour work without overflow
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:04] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:05] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:05] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:05] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:05] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:05] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:05] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:05] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:05] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:05] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:05] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:06] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:06] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:06] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:06] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:06] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:06] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:06] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:06] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:06] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:06] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:06] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:06] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:07] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:07] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:07] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[14/25] [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:75:1 › tips can be disabled and help remains available
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:26] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:27] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:27] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:27] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:27] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:27] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[15/25] [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:75:1 › tips can be disabled and help remains available
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:27] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:27] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:27] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:28] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:29] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:29] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:29] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:29] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:29] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:29] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:29] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:29] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:30] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:30] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:30] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:30] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:30] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:30] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:30] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[16/25] [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:88:1 › moving signal rail resumes after pause
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:37] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[17/25] [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:88:1 › moving signal rail resumes after pause
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:39] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:40] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:40] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:40] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:40] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:40] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:40] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:40] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:41] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:41] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:41] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:41] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:41] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:41] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:41] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:41] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:41] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:41] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:41] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:41] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:42] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:42] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:42] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[18/25] [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:102:1 › help and tour stay usable in landscape viewport
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:43] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:44] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:44] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:45] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:45] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:45] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:45] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:45] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:45] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:45] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:45] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:45] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:45] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:45] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:45] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:46] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[19/25] [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:102:1 › help and tour stay usable in landscape viewport
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:47] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:48] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:48] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:48] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:48] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:48] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:48] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:48] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:48] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:49] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:49] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:49] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:49] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:49] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:49] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:49] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[20/25] [webkit-iphone] › tests/brief-browser-e2e.spec.cjs:115:1 › team switch, full workspace and question-mark help remain functional
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:54] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[21/25] [webkit-desktop] › tests/brief-browser-e2e.spec.cjs:115:1 › team switch, full workspace and question-mark help remain functional
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:55] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:56] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:56] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:56] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:56] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:56] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:56] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:56] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:57] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:57] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:57] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:57] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:57] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:57] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:57] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:57] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:57] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:57] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:57] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:58] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:58] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:58] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:07:58] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[22/25] [chromium-android] › tests/brief-browser-e2e.spec.cjs:42:1 › entry, help center and guided tour work without overflow
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:04] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:05] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:05] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:05] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:05] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:05] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:05] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:05] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:05] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:05] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[23/25] [chromium-android] › tests/brief-browser-e2e.spec.cjs:42:1 › entry, help center and guided tour work without overflow (retry #1)
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:11] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:12] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:12] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:12] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:12] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K  2) [chromium-android] › tests/brief-browser-e2e.spec.cjs:42:1 › entry, help center and guided tour work without overflow 

    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m730[39m
    Received:    [31m862.5785522460938[39m

      30 |   expect(result.top).toBeGreaterThanOrEqual(-3);
      31 |   expect(result.right).toBeLessThanOrEqual(result.width + 3);
    > 32 |   expect(result.bottom).toBeLessThanOrEqual(result.height + 3);
         |                         ^
      33 | }
      34 |
      35 | test.beforeEach(async ({ page }) => {
        at expectInsideViewport (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:32:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:65:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-android/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-android/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-android/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-android/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────

    Retry #1 ───────────────────────────────────────────────────────────────────────────────────────

    Error: [2mexpect([22m[31mreceived[39m[2m).[22mtoBeLessThanOrEqual[2m([22m[32mexpected[39m[2m)[22m

    Expected: <= [32m730[39m
    Received:    [31m862.6015625[39m

      30 |   expect(result.top).toBeGreaterThanOrEqual(-3);
      31 |   expect(result.right).toBeLessThanOrEqual(result.width + 3);
    > 32 |   expect(result.bottom).toBeLessThanOrEqual(result.height + 3);
         |                         ^
      33 | }
      34 |
      35 | test.beforeEach(async ({ page }) => {
        at expectInsideViewport (/home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:32:25)
        at /home/runner/work/First-Repo/First-Repo/tests/brief-browser-e2e.spec.cjs:65:5

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-android-retry1/test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-android-retry1/error-context.md

    attachment #3: trace (application/zip) ─────────────────────────────────────────────────────────
    test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-android-retry1/trace.zip
    Usage:

        npx playwright show-trace test-results/brief-browser-e2e-entry-he-d8387--tour-work-without-overflow-chromium-android-retry1/trace.zip

    ────────────────────────────────────────────────────────────────────────────────────────────────


[1A[2K[24/25] [chromium-android] › tests/brief-browser-e2e.spec.cjs:75:1 › tips can be disabled and help remains available
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:17] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:17] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:17] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:17] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:17] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:18] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[25/25] [chromium-android] › tests/brief-browser-e2e.spec.cjs:88:1 › moving signal rail resumes after pause
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:20] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:21] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:21] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:21] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:21] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:21] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:21] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:21] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:21] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:21] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:21] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:21] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:21] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:21] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:21] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:21] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[26/25] (retries) [chromium-android] › tests/brief-browser-e2e.spec.cjs:102:1 › help and tour stay usable in landscape viewport
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:23] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:24] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:24] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:24] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:24] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:24] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:24] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:24] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:24] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[27/25] (retries) [chromium-android] › tests/brief-browser-e2e.spec.cjs:115:1 › team switch, full workspace and question-mark help remain functional
[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /brief/?browser-test=1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief.css?v=20260803-4 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-music.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-scenarios.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-config.js?v=20260803-14 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-memory.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-presets.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-data.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-connections.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-scenarios.js?v=20260803-1 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-team-data.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/daily-song.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-scenario-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-core.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-terminal-bridge.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-onboarding.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-entry-radio.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-live.css?v=20260803-5 HTTP/1.1" 200 -
[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-daily.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-device.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-upgrade.css?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-experience.css?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-relationship-watch.css?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-workspace.css?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-polish.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-terminal.css?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-device.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-entry-radio.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-onboarding.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/daily-video.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-upgrade.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-live-data.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-live.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-live-patch.js?v=20260803-5 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-daily-content.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-daily.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-experience-guard.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-virgo-pair.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-experience.js?v=20260803-4 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-terminal.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-relationship-watch.js?v=20260803-3 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:27] "GET /assets/brief/brief-team-renderer.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:28] "GET /assets/brief/brief-workspace.js?v=20260803-1 HTTP/1.1" 200 -

[1A[2K[WebServer] 127.0.0.1 - - [04/Aug/2026 00:08:28] "GET /assets/brief/brief-polish.js?v=20260803-2 HTTP/1.1" 200 -

[1A[2K  2 failed
    [chromium-desktop] › tests/brief-browser-e2e.spec.cjs:42:1 › entry, help center and guided tour work without overflow 
    [chromium-android] › tests/brief-browser-e2e.spec.cjs:42:1 › entry, help center and guided tour work without overflow 
  23 passed (2.3m)
```
