window.BRIEF_CONFIG = {
  preset: 'individual',
  theme: 'black',
  appearance: 'dark',
  storagePrefix: 'cmxBriefDemo',
  effects: {
    ambientGlow: true,
    weatherMotion: true,
    cardMotion: true
  },
  controls: {
    sharedView: true,
    readAloud: true,
    music: true,
    explainMode: true
  }
};

(() => {
  'use strict';

  const build = {
    device: '20260803-3',
    onboarding: '20260803-2',
    entry: '20260803-5',
    upgrade: '20260803-5',
    live: '20260803-5',
    daily: '20260803-3',
    experience: '20260803-4',
    terminal: '20260803-2',
    watch: '20260803-3',
    team: '20260803-1',
    workspace: '20260803-1',
    polish: '20260803-2'
  };

  const labels = {
    individual: 'Personal',
    couple: 'Relationship',
    partners: 'Business',
    trainer: 'Trainer + student',
    team: 'Team + project'
  };

  function forceTop() {
    const gate = document.getElementById('entryGate');
    if (gate) gate.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  function installEntryController() {
    const select = document.getElementById('profileSelect');
    const enter = document.getElementById('enterBrief');
    const field = select?.closest('.profile-field');
    if (!select || !enter) return;

    select.dataset.requiredChoice = 'true';
    select.dataset.liveRequired = 'true';
    select.setAttribute('required', '');
    field?.classList.add('is-required');

    const emptyOptions = [...select.querySelectorAll('option[value=""]')];
    let placeholder = emptyOptions.shift();
    emptyOptions.forEach(option => option.remove());
    if (!placeholder) {
      placeholder = document.createElement('option');
      placeholder.value = '';
      select.insertBefore(placeholder, select.firstChild);
    }
    placeholder.disabled = true;
    placeholder.textContent = 'Choose the briefing you want to explore';

    let note = document.getElementById('gateSelectionNote');
    if (!note) {
      note = document.createElement('p');
      note.id = 'gateSelectionNote';
      note.className = 'gate-selection-note';
      field?.appendChild(note);
    }
    select.setAttribute('aria-describedby', 'gateSelectionNote');

    const copy = document.querySelector('.gate-copy');
    if (copy) {
      copy.textContent = 'Choose the briefing you want to explore. The same private platform can organize one person, a relationship, business partners, a trainer and student, or a role-based team while keeping profiles and shared spaces separate.';
    }

    let selectedValue = '';
    let appReady = Boolean(window.BRIEF_APP);
    let queuedOpen = false;

    const validChoice = value => Object.prototype.hasOwnProperty.call(labels, value);

    const updateControls = () => {
      const choice = validChoice(selectedValue) ? selectedValue : '';
      const enabled = Boolean(choice);
      enter.disabled = !enabled;
      enter.setAttribute('aria-disabled', String(!enabled));
      enter.classList.remove('is-preparing');
      enter.textContent = enabled ? 'Open this briefing' : 'Choose a briefing first';
      note.textContent = enabled
        ? `${labels[choice]} briefing selected. Choose any entry preferences, then press Open this briefing.`
        : 'Choose one version before continuing. You can switch between all five inside.';
    };

    const acceptSelection = () => {
      const choice = validChoice(select.value) ? select.value : '';
      selectedValue = choice;
      select.dataset.userSelection = choice;
      updateControls();
    };

    select.addEventListener('input', acceptSelection);
    select.addEventListener('change', acceptSelection);

    enter.addEventListener('click', event => {
      const choice = validChoice(selectedValue) ? selectedValue : (validChoice(select.value) ? select.value : '');
      if (!choice) {
        event.preventDefault();
        event.stopImmediatePropagation();
        note.textContent = 'Choose Personal, Relationship, Business, Trainer + student, or Team + project first.';
        document.querySelector('input[name="briefEntryType"]')?.focus();
        return;
      }

      selectedValue = choice;
      select.value = choice;
      forceTop();

      if (!appReady || !window.BRIEF_APP) {
        event.preventDefault();
        event.stopImmediatePropagation();
        queuedOpen = true;
        enter.disabled = true;
        enter.setAttribute('aria-disabled', 'true');
        enter.classList.add('is-preparing');
        enter.textContent = 'Preparing briefing…';
        note.textContent = 'The briefing is finishing its device setup. It will open automatically.';
        return;
      }

      window.setTimeout(() => {
        if (!document.body.classList.contains('is-locked')) return;
        if (!window.BRIEF_APP || !validChoice(selectedValue)) return;
        window.BRIEF_APP.setPreset(selectedValue);
        document.body.classList.remove('is-locked');
        document.getElementById('entryGate')?.classList.add('is-hidden');
        document.getElementById('briefApp')?.setAttribute('aria-hidden', 'false');
        try { sessionStorage.setItem(`${window.BRIEF_CONFIG.storagePrefix}:entered`, 'true'); } catch {}
        forceTop();
        window.setTimeout(forceTop, 80);
        try { document.getElementById('briefMain')?.focus({ preventScroll: true }); } catch { document.getElementById('briefMain')?.focus(); }
        window.dispatchEvent(new CustomEvent('brief:device-fallback-open', { detail: { preset: selectedValue } }));
      }, 450);
    }, true);

    window.addEventListener('brief:ready', () => {
      appReady = true;
      if (!validChoice(selectedValue)) selectedValue = '';
      select.value = selectedValue;
      updateControls();
      if (queuedOpen && selectedValue) {
        queuedOpen = false;
        window.setTimeout(() => enter.click(), 0);
      }
    });

    selectedValue = '';
    select.value = '';
    const music = document.getElementById('musicOnEntry');
    const narration = document.getElementById('readOnEntry');
    if (music) music.checked = false;
    if (narration) narration.checked = false;
    updateControls();
  }

  function loadStyle(id, href) {
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  function loadScript(id, src, onload) {
    const existing = document.getElementById(id);
    if (existing) {
      if (onload) onload();
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = false;
    if (onload) {
      let completed = false;
      const finish = () => {
        if (completed) return;
        completed = true;
        onload();
      };
      script.addEventListener('load', finish, { once: true });
      script.addEventListener('error', finish, { once: true });
    }
    document.head.appendChild(script);
  }

  installEntryController();

  loadStyle('briefDeviceStyle', `/assets/brief/brief-device.css?v=${build.device}`);
  loadStyle('briefOnboardingStyle', `/assets/brief/brief-onboarding.css?v=${build.onboarding}`);
  loadStyle('briefOnboardingBoundsStyle', '/assets/brief/brief-onboarding-bounds.css?v=20260803-1');
  loadStyle('briefEntryRadioStyle', `/assets/brief/brief-entry-radio.css?v=${build.entry}`);
  loadStyle('briefUpgradeStyle', `/assets/brief/brief-upgrade.css?v=${build.upgrade}`);
  loadStyle('briefLiveStyle', `/assets/brief/brief-live.css?v=${build.live}`);
  loadStyle('briefDailyStyle', `/assets/brief/brief-daily.css?v=${build.daily}`);
  loadStyle('briefExperienceStyle', `/assets/brief/brief-experience.css?v=${build.experience}`);
  loadStyle('briefTerminalStyle', `/assets/brief/brief-terminal.css?v=${build.terminal}`);
  loadStyle('briefRelationshipWatchStyle', `/assets/brief/brief-relationship-watch.css?v=${build.watch}`);
  loadStyle('briefWorkspaceStyle', `/assets/brief/brief-workspace.css?v=${build.workspace}`);
  loadStyle('briefPolishStyle', `/assets/brief/brief-polish.css?v=${build.polish}`);

  loadScript('briefDeviceScript', `/assets/brief/brief-device.js?v=${build.device}`);
  loadScript('briefEntryRadioScript', `/assets/brief/brief-entry-radio.js?v=${build.entry}`);

  loadScript('briefOnboardingScript', `/assets/brief/brief-onboarding.js?v=${build.onboarding}`, () => {
    loadScript('briefDailyVideoScript', `/assets/daily-video.js?v=${build.watch}`, () => {
      loadScript('briefUpgradeScript', `/assets/brief/brief-upgrade.js?v=${build.upgrade}`, () => {
        loadScript('briefLiveDataScript', `/assets/brief/brief-live-data.js?v=${build.live}`, () => {
          loadScript('briefLiveScript', `/assets/brief/brief-live.js?v=${build.live}`, () => {
            loadScript('briefLivePatchScript', `/assets/brief/brief-live-patch.js?v=${build.live}`, () => {
              loadScript('briefDailyContentScript', `/assets/brief/brief-daily-content.js?v=${build.daily}`, () => {
                loadScript('briefDailyScript', `/assets/brief/brief-daily.js?v=${build.daily}`, () => {
                  loadScript('briefExperienceGuardScript', `/assets/brief/brief-experience-guard.js?v=${build.experience}`, () => {
                    loadScript('briefVirgoPairScript', `/assets/brief/brief-virgo-pair.js?v=${build.experience}`, () => {
                      loadScript('briefExperienceScript', `/assets/brief/brief-experience.js?v=${build.experience}`, () => {
                        loadScript('briefTerminalScript', `/assets/brief/brief-terminal.js?v=${build.terminal}`, () => {
                          loadScript('briefRelationshipWatchScript', `/assets/brief/brief-relationship-watch.js?v=${build.watch}`, () => {
                            loadScript('briefTeamRendererScript', `/assets/brief/brief-team-renderer.js?v=${build.team}`, () => {
                              loadScript('briefWorkspaceScript', `/assets/brief/brief-workspace.js?v=${build.workspace}`, () => {
                                loadScript('briefPolishScript', `/assets/brief/brief-polish.js?v=${build.polish}`);
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
})();
