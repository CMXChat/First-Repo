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

  const saveKey = 'crystal-rpg-save-v1';
  const defaultState = {
    scene: 0,
    level: 1,
    inventory: ['attitude'],
    bossHp: 3,
    started: false,
    complete: false,
    sound: false,
    jewelSequence: []
  };

  let state = loadState();
  let audioContext = null;

  const scenes = {
    intro: {
      actions: ['start', 'help', 'about'],
      lines: [
        ['system', 'Booting CRYSTAL STORY ENGINE v1.67...'],
        ['system', 'Scanning personality data...'],
        ['success', 'Beauty spot detected. Hair length exceeds standard rendering limits.'],
        ['system', 'Five canine security units online. Matcha is refusing authentication.'],
        ['story', 'MISSION: Cross five ridiculous realms and unlock the classified Crystal experience.'],
        ['story', 'Type START or press the button. Type HELP whenever the plot becomes suspicious.']
      ]
    },
    one: {
      actions: ['glare', 'prove it', 'walk away', 'status'],
      lines: [
        ['system', 'LEVEL 01 // THE HALL OF UNDERESTIMATION'],
        ['story', 'A badly informed stranger blocks the path.'],
        ['story', 'STRANGER: “She probably cannot handle it.”'],
        ['story', 'The room becomes dangerously quiet. Choose: GLARE, PROVE IT, or WALK AWAY.']
      ]
    },
    two: {
      actions: ['paint flowers', 'cry dramatically', 'make tea', 'status'],
      lines: [
        ['system', 'LEVEL 02 // THE GARDEN OF LOUD FEELINGS'],
        ['story', 'The path is flooded with feelings that ignored the posted capacity limit.'],
        ['story', 'A blank canvas waits beside an unnecessarily elegant box of tissues.'],
        ['story', 'Choose: PAINT FLOWERS, CRY DRAMATICALLY, or MAKE TEA.']
      ]
    },
    three: {
      actions: ['summon matcha', 'deploy dogs', 'offer snacks', 'status'],
      lines: [
        ['system', 'LEVEL 03 // THE ANIMAL COUNCIL'],
        ['story', 'Six animals sit around a table. Five are pleased to see you. One is a cat.'],
        ['story', 'The council will grant passage only after a display of correct leadership.'],
        ['story', 'Choose: SUMMON MATCHA, DEPLOY DOGS, or OFFER SNACKS.']
      ]
    },
    four: {
      actions: ['gold', 'pink', 'black', 'inspect vault'],
      lines: [
        ['system', 'LEVEL 04 // THE JEWELRY VAULT'],
        ['story', 'Three color seals guard the founder’s key. The order is hidden in plain sight.'],
        ['story', 'Enter the three colors one at a time. Hint: luxury, softness, and the void.'],
        ['story', 'Available seals: GOLD, PINK, BLACK.']
      ]
    },
    five: {
      actions: ['block', 'paint', 'summon animals', 'laugh', 'status'],
      lines: [
        ['system', 'FINAL LEVEL // HEARTBREAK WITH WI-FI'],
        ['story', 'A dramatic shadow appears, reconnecting every seven seconds for attention.'],
        ['story', 'BOSS: “You will never recover from this season finale.”'],
        ['story', 'Defeat it with BLOCK, PAINT, SUMMON ANIMALS, or LAUGH. Three clean hits required.']
      ]
    },
    finish: {
      actions: ['unlock', 'status'],
      lines: [
        ['success', 'BOSS DEFEATED. Heartbreak has been removed from the trusted network.'],
        ['reward', 'FINAL REWARD ACQUIRED: the main-character key.'],
        ['story', 'Type UNLOCK to open the real Crystal experience.']
      ]
    }
  };

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
      // The game still works when browser storage is unavailable.
    }
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
    lines.forEach(([type, text], index) => line(type, text, startDelay + index * 110));
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
      button.addEventListener('click', () => runCommand(action));
      quickActions.appendChild(button);
    });
  }

  function updateHud() {
    levelMeter.textContent = String(state.level).padStart(2, '0');
    inventoryMeter.textContent = state.inventory.join(' · ');
    soundToggle.textContent = state.sound ? 'SOUND: ON' : 'SOUND: OFF';
    soundToggle.setAttribute('aria-pressed', String(state.sound));
  }

  function setScene(sceneName, shouldClear = true) {
    const scene = scenes[sceneName];
    if (!scene) return;
    if (shouldClear) clearLog();
    printLines(scene.lines);
    setActions(scene.actions);
    terminalInput.focus({ preventScroll: true });
    updateHud();
    saveState();
  }

  function addInventory(item) {
    if (!state.inventory.includes(item)) state.inventory.push(item);
  }

  function normalize(value) {
    return value.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  function commandEcho(command) {
    line('command', command);
    beep(430, 0.04);
  }

  function runCommand(rawCommand) {
    const command = normalize(rawCommand);
    if (!command) return;
    commandEcho(command);
    terminalInput.value = '';

    if (['help', '?'].includes(command)) {
      line('system', 'COMMANDS: use the action buttons or type the exact action. STATUS shows progress. CLEAR clears the terminal. RESET starts over.');
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
      line('reward', `LEVEL ${state.level} // INVENTORY: ${state.inventory.join(', ')} // BOSS HP: ${state.bossHp}`);
      return;
    }
    if (command === 'about') {
      line('story', 'This game was generated from Crystal’s own paragraph. The terminal is merely the gate.');
      return;
    }
    if (['murder', 'plan murder', 'murders'].includes(command)) {
      line('error', 'REQUEST DENIED: Never plan fictional murders out loud. This terminal logs everything. Matcha has already contacted counsel.');
      beep(130, 0.1);
      return;
    }
    if (command === 'jay') {
      line('story', 'JAY STATUS: partner detected. Plot details redacted. Admiration telemetry remains embarrassingly obvious.');
      return;
    }
    if (command === 'matcha') {
      line('story', 'MATCHA: “I have reviewed the evidence and decline to comment.”');
      return;
    }

    if (!state.started || state.scene === 0) {
      if (command === 'start') {
        state.started = true;
        state.scene = 1;
        state.level = 1;
        setScene('one');
      } else {
        line('error', 'Unknown pre-adventure command. Try START, HELP, or ABOUT.');
      }
      return;
    }

    if (state.scene === 1) {
      if (['glare', 'prove it', 'walk away'].includes(command)) {
        const responses = {
          'glare': 'Critical hit. No words used. The stranger remembers an urgent appointment elsewhere.',
          'prove it': 'You complete the impossible task while maintaining aggressive eye contact.',
          'walk away': 'You conserve energy. The stranger is left alone with their own poor judgment.'
        };
        line('success', responses[command]);
        addInventory('underrated rage');
        state.scene = 2;
        state.level = 2;
        saveState();
        window.setTimeout(() => setScene('two'), 900);
      } else {
        line('error', 'That will not move this particular fool. Try GLARE, PROVE IT, or WALK AWAY.');
      }
      return;
    }

    if (state.scene === 2) {
      if (['paint flowers', 'cry dramatically', 'make tea'].includes(command)) {
        const responses = {
          'paint flowers': 'The feelings become petals. The canvas gains +20 emotional range.',
          'cry dramatically': 'Valid move. The flood recedes after recognizing professional competition.',
          'make tea': 'A tactical pause restores perspective and exactly zero patience.'
        };
        line('success', responses[command]);
        addInventory('painted flower');
        state.scene = 3;
        state.level = 3;
        saveState();
        window.setTimeout(() => setScene('three'), 900);
      } else {
        line('error', 'The garden ignores that command. Try PAINT FLOWERS, CRY DRAMATICALLY, or MAKE TEA.');
      }
      return;
    }

    if (state.scene === 3) {
      if (['summon matcha', 'deploy dogs', 'offer snacks'].includes(command)) {
        const responses = {
          'summon matcha': 'Matcha appears, signs nothing, and somehow approves the motion.',
          'deploy dogs': 'Five security units surround the table. Democracy becomes efficient.',
          'offer snacks': 'Unanimous approval. Even Matcha abstains less judgmentally.'
        };
        line('success', responses[command]);
        addInventory('animal council seal');
        state.scene = 4;
        state.level = 4;
        state.jewelSequence = [];
        saveState();
        window.setTimeout(() => setScene('four'), 900);
      } else {
        line('error', 'The council stares. Try SUMMON MATCHA, DEPLOY DOGS, or OFFER SNACKS.');
      }
      return;
    }

    if (state.scene === 4) {
      if (command === 'inspect vault') {
        line('story', `SEALS ENTERED: ${state.jewelSequence.length ? state.jewelSequence.join(' → ') : 'none'}`);
        return;
      }
      if (['gold', 'pink', 'black'].includes(command)) {
        const expected = ['gold', 'pink', 'black'];
        const expectedColor = expected[state.jewelSequence.length];
        if (command === expectedColor) {
          state.jewelSequence.push(command);
          line('success', `${command.toUpperCase()} seal accepted.`);
          beep(640 + state.jewelSequence.length * 80, 0.07);
          if (state.jewelSequence.length === 3) {
            addInventory('founder key');
            state.scene = 5;
            state.level = 5;
            saveState();
            window.setTimeout(() => setScene('five'), 900);
          } else {
            saveState();
          }
        } else {
          state.jewelSequence = [];
          saveState();
          line('error', 'The vault flashes pink in disappointment. Sequence reset. Try GOLD first.');
        }
      } else {
        line('error', 'The vault accepts only GOLD, PINK, BLACK, or INSPECT VAULT.');
      }
      return;
    }

    if (state.scene === 5) {
      if (['block', 'paint', 'summon animals', 'laugh'].includes(command)) {
        const attacks = {
          'block': 'Access revoked. The boss loses one channel of unnecessary communication.',
          'paint': 'You paint over the boss with flowers. It objects to the composition.',
          'summon animals': 'Five dogs attack its confidence. Matcha attacks its legal position.',
          'laugh': 'The boss cannot survive being treated like a badly written subplot.'
        };
        state.bossHp = Math.max(0, state.bossHp - 1);
        line('success', `${attacks[command]} BOSS HP: ${state.bossHp}/3`);
        beep(220 - state.bossHp * 25, 0.13);
        if (state.bossHp === 0) {
          addInventory('main-character key');
          state.scene = 6;
          state.level = 6;
          state.complete = true;
          saveState();
          window.setTimeout(() => setScene('finish'), 1000);
        } else {
          saveState();
        }
      } else {
        line('error', 'The boss survives that. Try BLOCK, PAINT, SUMMON ANIMALS, or LAUGH.');
      }
      return;
    }

    if (state.scene >= 6) {
      if (command === 'unlock') {
        line('success', 'ACCESS GRANTED. Rendering Crystal beyond the paragraph...');
        beep(880, 0.18);
        window.setTimeout(showReveal, 850);
      } else {
        line('error', 'The final door is waiting for one command: UNLOCK.');
      }
    }
  }

  function resetGame() {
    try {
      localStorage.removeItem(saveKey);
    } catch (_) {
      // Continue with an in-memory reset.
    }
    state = { ...defaultState, inventory: ['attitude'], jewelSequence: [] };
    clearLog();
    setScene('intro', false);
  }

  function restoreScene() {
    updateHud();
    if (!state.started || state.scene === 0) setScene('intro');
    else if (state.scene === 1) setScene('one');
    else if (state.scene === 2) setScene('two');
    else if (state.scene === 3) setScene('three');
    else if (state.scene === 4) setScene('four');
    else if (state.scene === 5) setScene('five');
    else setScene('finish');
  }

  function showReveal() {
    gameScreen.hidden = true;
    reveal.hidden = false;
    document.body.classList.add('reveal-active');
    window.scrollTo(0, 0);
    observeSections();
    burstConfetti(70);
  }

  function showGame() {
    reveal.hidden = true;
    gameScreen.hidden = false;
    document.body.classList.remove('reveal-active');
    window.scrollTo(0, 0);
    restoreScene();
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
  document.getElementById('replayGame').addEventListener('click', showGame);
  document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Reveal interactions
  let toastTimer = null;
  function toast(message) {
    const toastEl = document.getElementById('toast');
    toastEl.textContent = message;
    toastEl.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  const animalReports = {
    'Dog One': 'SECURITY 01 REPORT: Perimeter secure. A delivery person was observed and defeated with noise.',
    'Dog Two': 'SECURITY 02 REPORT: Snack inventory is critically low according to a completely unbiased audit.',
    'Dog Three': 'SECURITY 03 REPORT: Emotional backup online. Lap capacity may exceed manufacturer guidance.',
    'Matcha': 'MATCHA REPORT: Everyone is behaving incorrectly. No further questions.',
    'Dog Four': 'SECURITY 04 REPORT: Hair department confirms Crystal remains the senior specialist.',
    'Dog Five': 'SECURITY 05 REPORT: Route to recovery identified. It includes several unnecessary stops for treats.'
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
    regal: ['The Main Character', 'Crown Without Permission', 'The Unbothered Heirloom'],
    soft: ['Soft Menace', 'Petals After Midnight', 'The Quiet Comeback'],
    chaos: ['Beautiful Threat', 'Matcha Made Me Do It', 'The Short Temper Collection']
  };
  document.getElementById('namePiece').addEventListener('click', () => {
    const names = pieceNames[selected.mood];
    const name = names[Math.floor(Math.random() * names.length)];
    document.getElementById('pieceName').textContent = name;
    toast(`Prototype named: ${name}`);
    burstConfetti(18);
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
    burstConfetti(55);
    toast('Controlled chaos released. Nobody was consulted.');
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
