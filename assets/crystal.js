(() => {
  'use strict';

  const gameScreen = document.getElementById('gameScreen');
  const reveal = document.getElementById('reveal');
  const terminalLog = document.getElementById('terminalLog');
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const quickActions = document.getElementById('quickActions');
  const levelMeter = document.getElementById('levelMeter');
  const inventoryMeter = document.getElementById('inventoryMeter');
  const soundToggle = document.getElementById('soundToggle');

  const saveKey = 'crystal-jay-hearing-v4';
  const defaultState = {
    scene: 0,
    question: 0,
    started: false,
    complete: false,
    sound: false,
    mercy: 0,
    harsh: 0,
    matcha: 0,
    verdictKey: 'pending',
    verdict: 'PENDING',
    verdictNote: 'Jay is alive. The hearing has not started.'
  };

  const verdicts = {
    soft: {
      title: 'JAY SURVIVES ON A TECHNICALITY',
      note: 'Crystal lets him live. Conditions apply.',
      condition: 'Alive. About to explain himself again.'
    },
    harsh: {
      title: 'JAY SURVIVES, BUT IN RESTRICTED MODE',
      note: 'Indoor privileges revoked. He has the couch.',
      condition: 'Alive. On the couch. Still typing.'
    },
    matcha: {
      title: 'MISTRIAL: MATCHA LEFT',
      note: 'Jay wins by default. Matcha could not be bothered.',
      condition: 'Alive. Matcha does not care.'
    }
  };

  const scenes = {
    intro: {
      actions: ['start', 'about'],
      lines: [
        ['system', 'Opening CASE 00-JAY...'],
        ['system', 'Judge: Crystal. Defendant: Jay. Witness: Matcha.'],
        ['story', 'CHARGE: being Jay.'],
        ['story', 'Three questions. Pick carefully.'],
        ['system', 'Jay has water. Unfortunately, he also has Wi-Fi.'],
        ['story', 'Type START.']
      ]
    },
    one: {
      actions: ['hear him out', 'leave on read', 'ask matcha'],
      lines: [
        ['system', 'QUESTION 01/03 // 11:47 PM'],
        ['story', 'Jay sends: “Can we talk?”'],
        ['story', 'Typing. Stops. Typing again.'],
        ['story', 'HEAR HIM OUT, LEAVE ON READ, or ASK MATCHA.']
      ]
    },
    two: {
      actions: ['accept apology', 'cross examine', 'order food'],
      lines: [
        ['system', 'QUESTION 02/03 // THE APOLOGY'],
        ['story', 'Jay apologizes. Somehow it becomes about Jay.'],
        ['story', 'The court is tired.'],
        ['story', 'ACCEPT APOLOGY, CROSS EXAMINE, or ORDER FOOD.']
      ]
    },
    three: {
      actions: ['spare jay', 'delete jay', 'let matcha decide'],
      lines: [
        ['system', 'QUESTION 03/03 // SENTENCING'],
        ['story', 'He made it.'],
        ['story', 'Boyfriend, couch, or deleted contact?'],
        ['story', 'SPARE JAY, DELETE JAY, or LET MATCHA DECIDE.']
      ]
    }
  };

  let state = loadState();
  let audioContext = null;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(saveKey));
      return saved ? { ...defaultState, ...saved } : { ...defaultState };
    } catch (_) {
      return { ...defaultState };
    }
  }

  function saveState() {
    try {
      localStorage.setItem(saveKey, JSON.stringify(state));
    } catch (_) {
      // The page still works without storage.
    }
  }

  function normalize(value) {
    return value.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  function line(type, text, delay = 0) {
    window.setTimeout(() => {
      const p = document.createElement('p');
      p.className = `log-line ${type}`;
      p.textContent = text;
      terminalLog.appendChild(p);
      terminalLog.parentElement.scrollTop = terminalLog.parentElement.scrollHeight;
    }, delay);
  }

  function printLines(lines, startDelay = 0) {
    lines.forEach(([type, text], index) => line(type, text, startDelay + index * 95));
  }

  function clearLog() {
    terminalLog.textContent = '';
  }

  function setActions(actions) {
    quickActions.textContent = '';
    actions.forEach(action => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quick-action';
      button.textContent = action;
      if (action === 'delete jay') button.dataset.danger = 'true';
      button.addEventListener('click', () => runCommand(action));
      quickActions.appendChild(button);
    });
  }

  function updateHud() {
    levelMeter.textContent = `${String(state.question).padStart(2, '0')}/03`;
    inventoryMeter.textContent = state.complete ? state.verdictKey : state.started ? 'deciding' : 'pending';
    soundToggle.textContent = state.sound ? 'SOUND: ON' : 'SOUND: OFF';
    soundToggle.setAttribute('aria-pressed', String(state.sound));
  }

  function setScene(sceneName, shouldClear = true) {
    const scene = scenes[sceneName];
    if (!scene) return;
    if (shouldClear) clearLog();
    printLines(scene.lines);
    setActions(scene.actions);
    updateHud();
    saveState();
    window.setTimeout(() => terminalInput.focus({ preventScroll: true }), 50);
  }

  function commandEcho(command) {
    line('command', command);
    beep(430, 0.04);
  }

  function jolt() {
    gameScreen.classList.remove('terminal-jolt');
    void gameScreen.offsetWidth;
    gameScreen.classList.add('terminal-jolt');
    window.setTimeout(() => gameScreen.classList.remove('terminal-jolt'), 380);
  }

  function advance(sceneName) {
    saveState();
    setActions([]);
    terminalInput.disabled = true;
    window.setTimeout(() => {
      terminalInput.disabled = false;
      setScene(sceneName);
    }, 2000);
  }

  function runCommand(rawCommand) {
    const command = normalize(rawCommand);
    if (!command) return;
    commandEcho(command);
    terminalInput.value = '';

    if (['help', '?'].includes(command)) {
      line('system', 'Use the buttons. Other commands: STATUS, JAY, MATCHA, LOVE, SCREENSHOTS, RESET.');
      return;
    }
    if (command === 'clear') {
      clearLog();
      return;
    }
    if (command === 'reset') {
      resetGame();
      return;
    }
    if (command === 'status') {
      line('reward', `QUESTION ${state.question}/3 // JAY: alive // CRYSTAL: deciding // MATCHA: absent`);
      return;
    }
    if (command === 'about') {
      line('story', 'Crystal wrote one paragraph. Jay ended up on trial.');
      return;
    }
    if (['murder', 'kill jay', 'plan murder', 'murders'].includes(command)) {
      line('error', 'No actual crimes. Use DELETE JAY.');
      jolt();
      beep(130, 0.1);
      return;
    }
    if (command === 'jay') {
      const reports = [
        'JAY STATUS: alive. Typing and deleting.',
        'JAY STATUS: starting with “Okay, but listen.”',
        'JAY STATUS: refreshed the page. Nothing changed.'
      ];
      line('story', reports[Math.floor(Math.random() * reports.length)]);
      return;
    }
    if (command === 'matcha') {
      line('story', 'MATCHA: “Both of you are exhausting.”');
      return;
    }
    if (command === 'love') {
      line('error', 'LOVE DETECTED. Annoying.');
      return;
    }
    if (command === 'screenshots') {
      line('story', '47 screenshots. Nobody is innocent.');
      return;
    }
    if (command === 'sorry') {
      line('story', 'Sorry received. Change pending.');
      return;
    }
    if (command === 'lawyer') {
      line('story', 'Matcha wants tuna up front.');
      return;
    }

    if (!state.started || state.scene === 0) {
      if (command === 'start') {
        state.started = true;
        state.scene = 1;
        state.question = 1;
        setScene('one');
      } else {
        line('error', 'Type START. Jay is stalling.');
      }
      return;
    }

    if (state.scene === 1) {
      const responses = {
        'hear him out': 'Jay starts with “Basically.” It gets worse.',
        'leave on read': 'Left on delivered. Peace returns briefly.',
        'ask matcha': 'Matcha sees the screenshot and leaves.'
      };
      if (responses[command]) {
        line('success', responses[command]);
        if (command === 'hear him out') state.mercy += 1;
        if (command === 'leave on read') state.harsh += 1;
        if (command === 'ask matcha') state.matcha += 1;
        state.scene = 2;
        state.question = 2;
        advance('two');
      } else {
        line('error', 'Pick one of the three options.');
      }
      return;
    }

    if (state.scene === 2) {
      const responses = {
        'accept apology': 'Accepted. Suspicious, but accepted.',
        'cross examine': 'Jay gets one direct question. He answers a different one.',
        'order food': 'Court paused. Food first.'
      };
      if (responses[command]) {
        line('success', responses[command]);
        if (command === 'accept apology') state.mercy += 1;
        if (command === 'cross examine') state.harsh += 1;
        if (command === 'order food') state.matcha += 1;
        state.scene = 3;
        state.question = 3;
        advance('three');
      } else {
        line('error', 'Pick one of the three options.');
      }
      return;
    }

    if (state.scene === 3) {
      const responses = {
        'spare jay': 'Jay lives. Conditions apply.',
        'delete jay': 'Request denied. Couch approved.',
        'let matcha decide': 'Matcha leaves. Mistrial.'
      };
      if (responses[command]) {
        line('success', responses[command]);
        if (command === 'spare jay') state.mercy += 3;
        if (command === 'delete jay') {
          state.harsh += 3;
          jolt();
        }
        if (command === 'let matcha decide') state.matcha += 3;
        finishHearing();
      } else {
        line('error', 'Pick one of the three options.');
      }
    }
  }

  function finishHearing() {
    const maxScore = Math.max(state.mercy, state.harsh, state.matcha);
    state.verdictKey = state.matcha === maxScore ? 'matcha' : state.harsh === maxScore ? 'harsh' : 'soft';
    const verdict = verdicts[state.verdictKey];
    state.verdict = verdict.title;
    state.verdictNote = verdict.note;
    state.scene = 4;
    state.question = 3;
    state.complete = true;
    saveState();
    updateHud();
    setActions([]);
    terminalInput.disabled = true;
    line('system', 'Calculating...', 520);
    line('reward', verdict.title, 900);
    line('story', verdict.note, 1140);
    line('system', 'Opening Crystal’s file...', 1550);
    beep(820, 0.15);
    window.setTimeout(showReveal, 2700);
  }

  function resetGame() {
    try {
      localStorage.removeItem(saveKey);
    } catch (_) {
      // Continue with an in-memory reset.
    }
    state = { ...defaultState };
    terminalInput.disabled = false;
    clearLog();
    setScene('intro', false);
  }

  function restoreScene() {
    updateHud();
    if (state.complete) {
      window.setTimeout(showReveal, 80);
      return;
    }
    if (!state.started || state.scene === 0) setScene('intro');
    else if (state.scene === 1) setScene('one');
    else if (state.scene === 2) setScene('two');
    else setScene('three');
  }

  function applyVerdict() {
    const verdict = verdicts[state.verdictKey] || verdicts.soft;
    document.getElementById('caseVerdict').textContent = verdict.title;
    document.getElementById('caseVerdictNote').textContent = verdict.note;
    document.getElementById('jayCondition').textContent = verdict.condition;
    reveal.classList.remove('verdict-soft', 'verdict-harsh', 'verdict-matcha');
    reveal.classList.add(`verdict-${state.verdictKey === 'pending' ? 'soft' : state.verdictKey}`);
  }

  function showReveal() {
    applyVerdict();
    gameScreen.hidden = true;
    reveal.hidden = false;
    document.body.classList.add('reveal-active');
    window.scrollTo(0, 0);
    observeSections();
    burstConfetti(state.verdictKey === 'harsh' ? 34 : 48);
  }

  function showGame(reset = false) {
    if (reset) resetGame();
    reveal.hidden = true;
    gameScreen.hidden = false;
    document.body.classList.remove('reveal-active');
    window.scrollTo(0, 0);
    if (!reset) restoreScene();
    window.setTimeout(() => terminalInput.focus(), 80);
  }

  function beep(frequency = 440, duration = 0.05) {
    if (!state.sound) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.025, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (_) {
      state.sound = false;
      updateHud();
    }
  }

  terminalForm.addEventListener('submit', event => {
    event.preventDefault();
    runCommand(terminalInput.value);
  });

  soundToggle.addEventListener('click', () => {
    state.sound = !state.sound;
    saveState();
    updateHud();
    beep(620, 0.08);
  });

  document.getElementById('resetGame').addEventListener('click', resetGame);
  document.getElementById('replayGame').addEventListener('click', () => showGame(true));
  document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  let toastTimer = null;
  function toast(message) {
    const toastEl = document.getElementById('toast');
    toastEl.textContent = message;
    toastEl.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  const animalReports = {
    'Dog One': 'Jay came near the door. I barked.',
    'Dog Two': 'Cheese may affect my statement.',
    'Dog Three': 'Crystal was upset. I stayed. Jay should have been quiet.',
    'Matcha': 'Both of you need supervision. Not from me.',
    'Dog Four': 'Hair good. Explanation bad.',
    'Dog Five': 'I know where Jay sleeps.'
  };

  document.querySelectorAll('.animal-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.dataset.animal;
      document.getElementById('animalMessage').textContent = animalReports[name];
      card.animate([
        { transform: 'translateY(0) rotate(0)' },
        { transform: 'translateY(-12px) rotate(-2deg)' },
        { transform: 'translateY(0) rotate(0)' }
      ], { duration: 420, easing: 'ease-out' });
    });
  });

  const garden = document.getElementById('flowerGarden');
  let flowerColor = 'pink';
  const colorMap = { pink: '#ff5ca8', gold: '#e6bd63', black: '#33222f' };

  document.querySelectorAll('.garden-color').forEach(button => {
    button.addEventListener('click', () => {
      flowerColor = button.dataset.color;
      document.querySelectorAll('.garden-color').forEach(item => item.classList.toggle('active', item === button));
    });
  });

  function plantFlower(x, y) {
    const rect = garden.getBoundingClientRect();
    const localX = Math.min(Math.max(x - rect.left, 38), rect.width - 38);
    const localY = Math.min(Math.max(y - rect.top, 150), rect.height - 8);
    const flower = document.createElement('div');
    flower.className = 'planted-flower';
    flower.style.left = `${localX}px`;
    flower.style.top = `${localY}px`;
    flower.style.setProperty('--flower-color', colorMap[flowerColor]);
    flower.style.zIndex = String(Math.round(localY));
    flower.innerHTML = '<span class="stem"></span><span class="leaf"></span><span class="leaf right"></span><span class="bloom"><i class="petal"></i><i class="petal"></i><i class="petal"></i><i class="petal"></i><i class="petal"></i><b class="center"></b></span>';
    garden.appendChild(flower);
    const instruction = garden.querySelector('.garden-instruction');
    if (instruction) instruction.hidden = true;
    beep(520 + Math.random() * 180, 0.06);
  }

  garden.addEventListener('pointerdown', event => plantFlower(event.clientX, event.clientY));
  garden.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const rect = garden.getBoundingClientRect();
      plantFlower(rect.left + rect.width * (.25 + Math.random() * .5), rect.top + rect.height * (.55 + Math.random() * .35));
    }
  });

  document.getElementById('clearGarden').addEventListener('click', event => {
    event.stopPropagation();
    garden.querySelectorAll('.planted-flower').forEach(flower => flower.remove());
    const instruction = garden.querySelector('.garden-instruction');
    if (instruction) instruction.hidden = false;
    toast('Gone.');
  });

  const necklace = document.getElementById('necklace');
  const selected = { metal: 'gold', stone: 'pink', mood: 'regal' };
  document.querySelectorAll('.jewel-controls input').forEach(input => {
    input.addEventListener('change', () => {
      selected[input.name] = input.value;
      necklace.className = `necklace metal-${selected.metal} stone-${selected.stone} mood-${selected.mood}`;
      beep(720, 0.05);
    });
  });

  const pieceNames = {
    regal: ['Last Nerve', 'Read Receipt', 'For Now'],
    soft: ['Fine', 'Still Here', 'Do Not Ask'],
    chaos: ['Bad Idea', 'Do Not Text', 'Matcha Saw It']
  };

  document.getElementById('namePiece').addEventListener('click', () => {
    const names = pieceNames[selected.mood];
    const name = names[Math.floor(Math.random() * names.length)];
    document.getElementById('pieceName').textContent = name;
    toast(`Named: ${name}`);
    burstConfetti(14);
  });

  const dreamModal = document.getElementById('dreamModal');
  const dreamText = document.getElementById('dreamText');
  const closeDream = document.getElementById('closeDream');
  let lastDreamTrigger = null;

  document.querySelectorAll('.dream-card').forEach(card => {
    card.addEventListener('click', () => {
      lastDreamTrigger = card;
      dreamText.textContent = card.dataset.dream;
      dreamModal.hidden = false;
      closeDream.focus();
    });
  });

  function closeDreamModal() {
    dreamModal.hidden = true;
    if (lastDreamTrigger) lastDreamTrigger.focus();
  }

  closeDream.addEventListener('click', closeDreamModal);
  dreamModal.addEventListener('click', event => {
    if (event.target === dreamModal) closeDreamModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !dreamModal.hidden) closeDreamModal();
  });

  function burstConfetti(count = 40) {
    const layer = document.getElementById('confettiLayer');
    const colors = ['#ff5ca8', '#e6bd63', '#fff0f7', '#1c1119'];
    for (let i = 0; i < count; i += 1) {
      const piece = document.createElement('i');
      piece.className = 'confetti';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.setProperty('--drift', `${-120 + Math.random() * 240}px`);
      piece.style.animationDelay = `${Math.random() * .45}s`;
      piece.style.animationDuration = `${2.4 + Math.random() * 1.8}s`;
      layer.appendChild(piece);
      window.setTimeout(() => piece.remove(), 4800);
    }
  }

  function controlledChaos() {
    reveal.classList.add('chaos-flash');
    burstConfetti(48);
    toast('Jay is apologizing early.');
    window.setTimeout(() => reveal.classList.remove('chaos-flash'), 1000);
  }

  document.getElementById('chaosButton').addEventListener('click', controlledChaos);
  document.getElementById('finalChaos').addEventListener('click', () => {
    controlledChaos();
    document.querySelectorAll('.animal-card').forEach((card, index) => {
      window.setTimeout(() => card.animate([
        { transform: 'translateY(0) rotate(0)' },
        { transform: `translateY(-${18 + Math.random() * 25}px) rotate(${-6 + Math.random() * 12}deg)` },
        { transform: 'translateY(0) rotate(0)' }
      ], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' }), index * 55);
    });
  });

  function observeSections() {
    const sections = document.querySelectorAll('.section-observe');
    if (!('IntersectionObserver' in window)) {
      sections.forEach(section => section.classList.add('in-view'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    sections.forEach(section => observer.observe(section));
  }

  restoreScene();
})();
