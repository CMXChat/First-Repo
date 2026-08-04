(() => {
  'use strict';

  const STORAGE_KEY = 'cmx_goal_intelligence_lab_v1';
  const THEME_KEY = 'cmx_goal_intelligence_theme_v1';
  const VERSION = 1;

  const DIFFICULTIES = {
    1: {
      label: 'Recovery',
      time: '5 to 15 minutes',
      description: 'Protect continuity with one very small action.',
      effort: 10
    },
    2: {
      label: 'Sustainable',
      time: '15 to 30 minutes',
      description: 'Build steady progress without creating unnecessary pressure.',
      effort: 25
    },
    3: {
      label: 'Focused',
      time: '30 to 60 minutes',
      description: 'Meaningful execution with a realistic workload.',
      effort: 45
    },
    4: {
      label: 'Stretch',
      time: '60 to 120 minutes',
      description: 'Push one larger result and make the tradeoffs visible.',
      effort: 90
    },
    5: {
      label: 'Sprint',
      time: 'Temporary high intensity',
      description: 'Run a bounded campaign with a clear end point and recovery plan.',
      effort: 120
    }
  };

  const BLOCKER_LABELS = {
    none: 'None',
    technical: 'Technical',
    knowledge: 'Knowledge',
    time: 'Time',
    financial: 'Financial',
    emotional: 'Emotional',
    dependency: 'Dependency',
    other: 'Other'
  };

  const RESULT_LABELS = {
    completed: 'Completed',
    partial: 'Partly completed',
    not_completed: 'Not completed',
    none: 'No action assigned',
    replaced: 'Useful replacement action'
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function uid(prefix) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function isoNow() {
    return new Date().toISOString();
  }

  function dateLabel(value) {
    const date = value ? new Date(value) : new Date();
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function sampleState() {
    const createdAt = '2026-08-04T19:45:00.000Z';
    return {
      version: VERSION,
      goal: {
        id: 'cmx-backend',
        title: 'Build and understand the CMX backend',
        outcome: 'Launch a maintainable FastAPI backend connected to the frontend while learning enough Python to understand and manage the work.',
        why: 'The backend is required for persistent goal data, protected tools, and future briefing intelligence without depending entirely on another developer.',
        baseline: 'The frontend exists. Python knowledge is limited. FastAPI is the preferred first backend direction.',
        success: 'A maintainable FastAPI service is deployed, one frontend form saves structured data, and the main route and storage flow can be explained clearly.',
        priority: 'high',
        visibility: 'private',
        status: 'active',
        difficulty: 3,
        milestone: 'Create the first working API route',
        blocker: 'knowledge',
        trajectory: 'unclear',
        trajectoryReason: 'Waiting for the first real check-in or evidence.',
        confidence: 'moderate',
        confidenceReason: 'The goal is clear, but no verified implementation evidence has been recorded.',
        focusPreference: 'prove',
        lastCapacity: 45,
        lastEnergy: 'medium',
        consecutiveMisses: 0,
        createdAt,
        updatedAt: createdAt
      },
      activeQuestion: {
        id: 'question_initial_focus',
        prompt: 'Which result matters more for the first backend session?',
        reason: 'The answer changes whether the next action prioritizes learning, proof, or developer handoff.',
        options: [
          { value: 'understand', label: 'Understand each line of the setup' },
          { value: 'prove', label: 'Prove that one working route can run' },
          { value: 'handoff', label: 'Prepare a clean structure for CRZA to continue' }
        ],
        priority: 'high',
        status: 'active',
        createdAt
      },
      recommendation: {
        id: 'recommendation_initial',
        title: 'Run one local FastAPI route and confirm the response.',
        why: 'This proves the smallest backend path before adding storage, authentication, or connectors.',
        effortMinutes: 45,
        expectedResult: 'A working local endpoint and a short explanation of what each line does.',
        milestone: 'Create the first working API route',
        confidence: 'moderate',
        basis: ['Limited Python experience', 'No route evidence yet', 'Focused difficulty'],
        status: 'active',
        createdAt
      },
      checkIns: [],
      answers: [],
      outcomes: [],
      evidence: [],
      history: [
        {
          id: 'history_created',
          type: 'goal_created',
          title: 'Prototype goal loaded',
          detail: 'Sample goal created with Focused difficulty and the first working route as the current milestone.',
          createdAt
        }
      ]
    };
  }

  function normalizeState(candidate) {
    const fallback = sampleState();
    if (!candidate || candidate.version !== VERSION || !candidate.goal) return fallback;
    return {
      ...fallback,
      ...candidate,
      version: VERSION,
      goal: { ...fallback.goal, ...candidate.goal },
      activeQuestion: candidate.activeQuestion || fallback.activeQuestion,
      recommendation: candidate.recommendation || fallback.recommendation,
      checkIns: Array.isArray(candidate.checkIns) ? candidate.checkIns : [],
      answers: Array.isArray(candidate.answers) ? candidate.answers : [],
      outcomes: Array.isArray(candidate.outcomes) ? candidate.outcomes : [],
      evidence: Array.isArray(candidate.evidence) ? candidate.evidence : [],
      history: Array.isArray(candidate.history) ? candidate.history : fallback.history
    };
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return normalizeState(stored ? JSON.parse(stored) : null);
    } catch {
      return sampleState();
    }
  }

  let state = loadState();
  let selectedQuestionValue = '';
  let toastTimer = 0;

  function setSaveStatus(message) {
    const node = $('#saveStatus');
    if (!node) return;
    node.textContent = message;
  }

  function saveState(message = 'Saved on this device') {
    state.goal.updatedAt = isoNow();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setSaveStatus(message);
    } catch {
      setSaveStatus('Browser storage unavailable');
    }
  }

  function showToast(message) {
    const toast = $('#toast');
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
  }

  function addHistory(type, title, detail) {
    state.history.unshift({
      id: uid('history'),
      type,
      title,
      detail,
      createdAt: isoNow()
    });
    state.history = state.history.slice(0, 80);
  }

  function difficulty() {
    return DIFFICULTIES[state.goal.difficulty] || DIFFICULTIES[3];
  }

  function effectiveEffort() {
    const requested = difficulty().effort;
    const available = Number(state.goal.lastCapacity || requested);
    if (state.goal.lastEnergy === 'low') return Math.max(5, Math.min(requested, Math.round(available * 0.65)));
    if (state.goal.lastEnergy === 'high') return Math.max(5, Math.min(requested, available));
    return Math.max(5, Math.min(requested, Math.round(available * 0.85)));
  }

  function determineTrajectory(result, blocker) {
    if (state.goal.status === 'completed') {
      return ['completed', 'The stated success condition has been marked complete.'];
    }
    if (blocker === 'dependency') {
      return ['blocked', 'A known dependency currently prevents the next meaningful result.'];
    }
    if (result === 'completed') {
      return ['improving', 'The previous action produced reported movement toward the current milestone.'];
    }
    if (result === 'partial' || result === 'replaced') {
      return ['stable', 'Useful movement occurred, but the current milestone is still open.'];
    }
    if (result === 'not_completed') {
      if (state.goal.consecutiveMisses >= 2) {
        return ['at risk', 'Repeated non-completion indicates that the action size or blocker needs to change.'];
      }
      return ['stable', 'One missed action does not define the goal, but the next action should be adjusted.'];
    }
    return ['unclear', 'More current information is required before direction can be judged honestly.'];
  }

  function determineConfidence() {
    const highEvidence = state.evidence.filter(item => item.confidence === 'high').length;
    const recentActivity = state.checkIns.length + state.outcomes.length;
    if (highEvidence >= 2 || (highEvidence >= 1 && recentActivity >= 2)) {
      return ['high', 'Recent check-ins and strong evidence support the current interpretation.'];
    }
    if (recentActivity >= 1 || state.answers.length >= 1) {
      return ['moderate', 'The recommendation uses current user input, but evidence remains limited.'];
    }
    return ['low', 'The current state relies mostly on the original sample assumptions.'];
  }

  function questionForContext(result = 'none', blocker = state.goal.blocker) {
    const createdAt = isoNow();
    if (blocker === 'technical') {
      return {
        id: uid('question'),
        prompt: 'What exact command, dependency, or error message stopped the setup?',
        reason: 'The next action should fix the actual failure before adding more backend work.',
        options: [
          { value: 'install', label: 'A package or installation failed' },
          { value: 'command', label: 'The run command failed' },
          { value: 'environment', label: 'The local environment is unclear' }
        ],
        priority: 'high',
        status: 'active',
        createdAt
      };
    }
    if (blocker === 'dependency') {
      return {
        id: uid('question'),
        prompt: 'What exact access, decision, or developer input is required before progress can continue?',
        reason: 'A blocked goal needs a named dependency and a direct request, not another internal task.',
        options: [
          { value: 'access', label: 'Access or credentials' },
          { value: 'decision', label: 'A technical decision' },
          { value: 'developer', label: 'Developer work or review' }
        ],
        priority: 'high',
        status: 'active',
        createdAt
      };
    }
    if (blocker === 'time') {
      return {
        id: uid('question'),
        prompt: 'What is the smallest amount of time you can protect for this goal today?',
        reason: 'The system should shrink the action to real capacity instead of planning around imaginary time.',
        options: [
          { value: '10', label: '10 minutes' },
          { value: '20', label: '20 minutes' },
          { value: '45', label: '45 minutes' }
        ],
        priority: 'high',
        status: 'active',
        createdAt
      };
    }
    if (blocker === 'knowledge') {
      return {
        id: uid('question'),
        prompt: 'What should the next session optimize for?',
        reason: 'The recommendation can teach first, prove the path first, or prepare a handoff first.',
        options: [
          { value: 'understand', label: 'Understand each line' },
          { value: 'prove', label: 'Get one route working' },
          { value: 'handoff', label: 'Prepare a developer-ready structure' }
        ],
        priority: 'high',
        status: 'active',
        createdAt
      };
    }
    if (result === 'completed') {
      return {
        id: uid('question'),
        prompt: 'Which milestone should become active next?',
        reason: 'Completed work should advance the goal instead of producing a generic repeat action.',
        options: [
          { value: 'post_route', label: 'Connect one frontend form to a POST route' },
          { value: 'storage', label: 'Store one structured record' },
          { value: 'explain', label: 'Document and explain the working route' }
        ],
        priority: 'medium',
        status: 'active',
        createdAt
      };
    }
    if (result === 'not_completed') {
      return {
        id: uid('question'),
        prompt: 'What most directly prevented the previous action?',
        reason: 'The next action should change the blocker or action size instead of repeating the same plan.',
        options: [
          { value: 'too_large', label: 'The action was too large' },
          { value: 'unclear', label: 'The first step was unclear' },
          { value: 'other_work', label: 'Other work took priority' }
        ],
        priority: 'high',
        status: 'active',
        createdAt
      };
    }
    return {
      id: uid('question'),
      prompt: 'Is the current milestone still the right place to focus?',
      reason: 'A quick confirmation prevents the system from optimizing an outdated plan.',
      options: [
        { value: 'yes', label: 'Yes, keep this milestone' },
        { value: 'smaller', label: 'Use a smaller milestone' },
        { value: 'change', label: 'Change the milestone' }
      ],
      priority: 'medium',
      status: 'active',
      createdAt
    };
  }

  function recommendationForContext(result = 'none', blocker = state.goal.blocker) {
    const effort = effectiveEffort();
    const preference = state.goal.focusPreference || 'prove';
    const base = {
      id: uid('recommendation'),
      effortMinutes: effort,
      milestone: state.goal.milestone,
      confidence: state.goal.confidence,
      basis: [
        `${DIFFICULTIES[state.goal.difficulty].label} difficulty`,
        `${state.goal.lastCapacity || effort} minutes available`,
        `${BLOCKER_LABELS[blocker] || blocker} blocker`
      ],
      status: 'active',
      createdAt: isoNow()
    };

    if (blocker === 'dependency') {
      return {
        ...base,
        title: 'Write and send one precise dependency request.',
        why: 'The goal is blocked by something outside the current work. Progress depends on naming the missing access, decision, or developer input.',
        expectedResult: 'A clear request with an owner, required item, and next follow-up point.'
      };
    }

    if (blocker === 'technical') {
      return {
        ...base,
        title: effort <= 15 ? 'Capture the exact setup error and the command that caused it.' : 'Reproduce the setup error once, isolate the failing command, and fix only that failure.',
        why: 'A known technical failure should be resolved before the project adds routes, storage, or new tooling.',
        expectedResult: 'A reproducible error record or a confirmed working environment.'
      };
    }

    if (blocker === 'time' || effort <= 15) {
      return {
        ...base,
        title: 'Create the FastAPI project file and write one minimal route without adding storage.',
        why: 'The available capacity is small, so the action should protect momentum and leave one visible artifact.',
        expectedResult: 'A saved project file containing one readable route, ready to run later.'
      };
    }

    if (result === 'not_completed' || state.goal.consecutiveMisses >= 2) {
      return {
        ...base,
        title: 'Reduce the task to one command and one visible response.',
        why: 'Repeating the previous task would ignore the evidence that its size or starting point was wrong.',
        expectedResult: 'One command runs successfully or produces a precise error that can be addressed next.'
      };
    }

    if (preference === 'understand') {
      return {
        ...base,
        title: 'Build one GET route and annotate what every line does.',
        why: 'The goal includes learning enough Python to manage the backend, so understanding is part of the result.',
        expectedResult: 'A working route plus a short plain-language explanation of imports, app creation, decorator, function, and response.'
      };
    }

    if (preference === 'handoff') {
      return {
        ...base,
        title: 'Create a clean FastAPI starter structure and a short developer handoff note.',
        why: 'The current priority is making the next developer step obvious without hiding the project owner from the architecture.',
        expectedResult: 'A minimal app structure, run command, current milestone, and one clearly assigned next task.'
      };
    }

    if (result === 'completed') {
      return {
        ...base,
        title: 'Connect one simple frontend form to a FastAPI POST route.',
        why: 'The first route is complete, so the next meaningful proof is data moving from the browser into the backend.',
        expectedResult: 'A form submission returns structured JSON and displays the confirmed response.'
      };
    }

    if (state.goal.difficulty === 5) {
      return {
        ...base,
        title: 'Run a bounded backend sprint: GET route, POST route, one test request, and a short implementation note.',
        why: 'Sprint mode supports multiple linked actions, but the scope stays limited to the first working data path.',
        expectedResult: 'A small end-to-end backend proof with a documented stopping point.'
      };
    }

    if (state.goal.difficulty === 4) {
      return {
        ...base,
        title: 'Run one FastAPI route, test it twice, and document the setup and response.',
        why: 'Stretch mode should produce a larger result while remaining tied to the current milestone.',
        expectedResult: 'A repeatable local route with a concise setup note and confirmed output.'
      };
    }

    return {
      ...base,
      title: 'Run one local FastAPI route and confirm the response.',
      why: 'This proves the smallest backend path before adding storage, authentication, or connectors.',
      expectedResult: 'A working local endpoint and a short explanation of what each line does.'
    };
  }

  function updateDerivedState(result = 'none', blocker = state.goal.blocker) {
    const [trajectory, trajectoryReason] = determineTrajectory(result, blocker);
    const [confidence, confidenceReason] = determineConfidence();
    state.goal.trajectory = trajectory;
    state.goal.trajectoryReason = trajectoryReason;
    state.goal.confidence = confidence;
    state.goal.confidenceReason = confidenceReason;
    state.activeQuestion = questionForContext(result, blocker);
    state.recommendation = recommendationForContext(result, blocker);
  }

  function difficultyLabel(value) {
    return DIFFICULTIES[Number(value)] || DIFFICULTIES[3];
  }

  function renderDifficultyPreview(value = state.goal.difficulty) {
    const current = difficultyLabel(value);
    $('#difficultyLabel').textContent = current.label;
    $('#difficultyDescription').textContent = current.description;
  }

  function renderGoalForm() {
    $('#goalTitle').value = state.goal.title;
    $('#goalOutcome').value = state.goal.outcome;
    $('#goalWhy').value = state.goal.why;
    $('#goalBaseline').value = state.goal.baseline;
    $('#goalSuccess').value = state.goal.success;
    $('#goalPriority').value = state.goal.priority;
    $('#goalVisibility').value = state.goal.visibility;
    $('#goalMilestone').value = state.goal.milestone;
    $('#difficultyRange').value = String(state.goal.difficulty);
    renderDifficultyPreview(state.goal.difficulty);
  }

  function renderPulse() {
    const currentDifficulty = difficulty();
    const recommendation = state.recommendation;
    $('#trajectoryValue').textContent = state.goal.trajectory.replace(/\b\w/g, char => char.toUpperCase());
    $('#trajectoryReason').textContent = state.goal.trajectoryReason;
    $('#difficultyValue').textContent = currentDifficulty.label;
    $('#difficultyDetail').textContent = currentDifficulty.time;
    $('#milestoneValue').textContent = state.goal.milestone;
    $('#milestoneDetail').textContent = recommendation?.expectedResult || 'Waiting for the next action.';
    $('#confidenceValue').textContent = state.goal.confidence.replace(/\b\w/g, char => char.toUpperCase());
    $('#confidenceDetail').textContent = state.goal.confidenceReason;

    $('#goalTitlePulse').textContent = state.goal.title;
    $('#blockerValue').textContent = BLOCKER_LABELS[state.goal.blocker] || state.goal.blocker;
    $('#priorityValue').textContent = state.goal.priority.replace(/\b\w/g, char => char.toUpperCase());
    $('#statusValue').textContent = state.goal.status.replace(/\b\w/g, char => char.toUpperCase());
    $('#updatedValue').textContent = dateLabel(state.goal.updatedAt);

    if (recommendation) {
      $('#recommendationTitle').textContent = recommendation.title;
      $('#recommendationWhy').textContent = recommendation.why;
      $('#recommendationEffort').textContent = `${recommendation.effortMinutes} min`;
      $('#recommendationResult').textContent = recommendation.expectedResult;
      $('#recommendationMilestone').textContent = recommendation.milestone;
      $('#recommendationBasis').textContent = recommendation.basis.join(', ');
    }
  }

  function renderQuestion() {
    const question = state.activeQuestion;
    const host = $('#questionOptions');
    selectedQuestionValue = '';
    $('#questionCustomAnswer').value = '';

    if (!question || question.status !== 'active') {
      $('#activeQuestion').textContent = 'No active question';
      $('#questionReason').textContent = 'The current recommendation can proceed without another answer.';
      host.innerHTML = '';
      $('#submitQuestionAnswer').disabled = true;
      $('#skipQuestion').disabled = true;
      return;
    }

    $('#activeQuestion').textContent = question.prompt;
    $('#questionReason').textContent = question.reason;
    $('#submitQuestionAnswer').disabled = false;
    $('#skipQuestion').disabled = false;
    host.innerHTML = question.options.map(option => (
      `<button type="button" data-question-value="${escapeHtml(option.value)}" aria-pressed="false">${escapeHtml(option.label)}</button>`
    )).join('');
  }

  function renderEvidence() {
    const host = $('#evidenceList');
    if (!state.evidence.length) {
      host.innerHTML = '<p class="empty-state">No evidence recorded yet. A user report and a verified output should remain separate records.</p>';
      return;
    }
    host.innerHTML = state.evidence.slice(0, 8).map(item => `
      <article class="record-item">
        <header><strong>${escapeHtml(item.type.replaceAll('_', ' '))}</strong><time>${escapeHtml(dateLabel(item.createdAt))}</time></header>
        <p>${escapeHtml(item.detail)}</p>
        <small>Confidence: ${escapeHtml(item.confidence)}</small>
      </article>
    `).join('');
  }

  function renderHistory() {
    const host = $('#historyList');
    if (!state.history.length) {
      host.innerHTML = '<p class="empty-state">No state changes have been recorded.</p>';
      return;
    }
    host.innerHTML = state.history.slice(0, 12).map(item => `
      <article class="history-item">
        <header><strong>${escapeHtml(item.title)}</strong><time>${escapeHtml(dateLabel(item.createdAt))}</time></header>
        <p>${escapeHtml(item.detail)}</p>
        <small>${escapeHtml(item.type.replaceAll('_', ' '))}</small>
      </article>
    `).join('');
  }

  function renderAll() {
    renderGoalForm();
    renderPulse();
    renderQuestion();
    renderEvidence();
    renderHistory();
  }

  function readRequired(id) {
    const node = $(`#${id}`);
    const value = node?.value.trim() || '';
    if (!value) {
      node?.focus();
      throw new Error('Complete all required goal fields before saving.');
    }
    return value;
  }

  function handleGoalSubmit(event) {
    event.preventDefault();
    try {
      const previousDifficulty = state.goal.difficulty;
      state.goal.title = readRequired('goalTitle');
      state.goal.outcome = readRequired('goalOutcome');
      state.goal.why = readRequired('goalWhy');
      state.goal.baseline = readRequired('goalBaseline');
      state.goal.success = readRequired('goalSuccess');
      state.goal.milestone = readRequired('goalMilestone');
      state.goal.priority = $('#goalPriority').value;
      state.goal.visibility = $('#goalVisibility').value;
      state.goal.difficulty = Number($('#difficultyRange').value);

      updateDerivedState('none', state.goal.blocker);
      addHistory(
        'goal_updated',
        'Goal definition updated',
        previousDifficulty === state.goal.difficulty
          ? `Updated the goal state and kept ${difficulty().label} difficulty.`
          : `Changed difficulty from ${difficultyLabel(previousDifficulty).label} to ${difficulty().label}.`
      );
      saveState('Goal updated');
      renderAll();
      showToast('Goal state updated.');
    } catch (error) {
      showToast(error.message);
    }
  }

  function handleCheckInSubmit(event) {
    event.preventDefault();
    const result = $('#checkInResult').value;
    const capacity = Number($('#checkInCapacity').value);
    const energy = $('#checkInEnergy').value;
    const blocker = $('#checkInBlocker').value;
    const change = $('#checkInChange').value.trim();
    const note = $('#checkInNote').value.trim();

    state.checkIns.unshift({
      id: uid('checkin'),
      result,
      capacityMinutes: capacity,
      energy,
      blocker,
      change,
      note,
      createdAt: isoNow()
    });
    state.checkIns = state.checkIns.slice(0, 40);

    state.goal.lastCapacity = capacity;
    state.goal.lastEnergy = energy;
    state.goal.blocker = blocker;
    if (result === 'not_completed') state.goal.consecutiveMisses += 1;
    else if (result === 'completed' || result === 'partial' || result === 'replaced') state.goal.consecutiveMisses = 0;

    updateDerivedState(result, blocker);
    addHistory(
      'check_in',
      'Check-in processed',
      `${RESULT_LABELS[result]}. ${capacity} minutes available, ${energy} energy, ${BLOCKER_LABELS[blocker]} blocker.${change ? ` Change: ${change}` : ''}`
    );
    saveState('Check-in saved');
    renderAll();
    event.target.reset();
    $('#checkInCapacity').value = String(capacity);
    $('#checkInEnergy').value = energy;
    $('#checkInBlocker').value = blocker;
    showToast('Check-in processed and the next action was updated.');
  }

  function applyAnswer(answer) {
    const normalized = String(answer || '').trim();
    if (!normalized) throw new Error('Choose an option or write an answer first.');

    const question = state.activeQuestion;
    state.answers.unshift({
      id: uid('answer'),
      questionId: question.id,
      question: question.prompt,
      answer: normalized,
      createdAt: isoNow()
    });
    state.answers = state.answers.slice(0, 60);

    if (['understand', 'prove', 'handoff'].includes(normalized)) state.goal.focusPreference = normalized;
    if (['10', '20', '45'].includes(normalized)) state.goal.lastCapacity = Number(normalized);
    if (normalized === 'post_route') state.goal.milestone = 'Connect one frontend form to a POST route';
    if (normalized === 'storage') state.goal.milestone = 'Store one structured record';
    if (normalized === 'explain') state.goal.milestone = 'Document and explain the working backend path';
    if (normalized === 'smaller') state.goal.milestone = 'Create one saved FastAPI project file';

    question.status = 'answered';
    question.answer = normalized;
    question.answeredAt = isoNow();

    state.recommendation = recommendationForContext('none', state.goal.blocker);
    state.activeQuestion = questionForContext('none', state.goal.blocker);
    addHistory('question_answered', 'Active question answered', `${question.prompt} Answer: ${normalized}.`);
    saveState('Answer saved');
    renderAll();
    showToast('Answer saved and the recommendation was recalculated.');
  }

  function handleQuestionAnswer() {
    const custom = $('#questionCustomAnswer').value.trim();
    try {
      applyAnswer(custom || selectedQuestionValue);
    } catch (error) {
      showToast(error.message);
    }
  }

  function handleSkipQuestion() {
    const question = state.activeQuestion;
    if (!question) return;
    question.status = 'skipped';
    question.skippedAt = isoNow();
    addHistory('question_skipped', 'Question skipped', question.prompt);
    state.activeQuestion = questionForContext('none', state.goal.blocker);
    saveState('Question skipped');
    renderAll();
    showToast('Question skipped. The current recommendation remains available.');
  }

  function handleOutcome(result) {
    const recommendation = state.recommendation;
    if (!recommendation) return;

    state.outcomes.unshift({
      id: uid('outcome'),
      recommendationId: recommendation.id,
      recommendationTitle: recommendation.title,
      result,
      createdAt: isoNow()
    });
    state.outcomes = state.outcomes.slice(0, 60);

    if (result === 'completed') state.goal.consecutiveMisses = 0;
    if (result === 'not_completed') state.goal.consecutiveMisses += 1;
    updateDerivedState(result, state.goal.blocker);
    addHistory('outcome_recorded', 'Recommendation outcome recorded', `${RESULT_LABELS[result] || result}: ${recommendation.title}`);
    saveState('Outcome saved');
    renderAll();
    showToast('Outcome recorded and the next loop is ready.');
  }

  function handleEvidenceSubmit(event) {
    event.preventDefault();
    const detail = $('#evidenceDetail').value.trim();
    if (!detail) {
      $('#evidenceDetail').focus();
      showToast('Add the evidence detail first.');
      return;
    }

    const evidence = {
      id: uid('evidence'),
      type: $('#evidenceType').value,
      confidence: $('#evidenceConfidence').value,
      detail,
      createdAt: isoNow()
    };
    state.evidence.unshift(evidence);
    state.evidence = state.evidence.slice(0, 80);

    const [confidence, confidenceReason] = determineConfidence();
    state.goal.confidence = confidence;
    state.goal.confidenceReason = confidenceReason;
    if (['github_commit', 'working_output'].includes(evidence.type) && evidence.confidence === 'high') {
      state.goal.trajectory = 'improving';
      state.goal.trajectoryReason = 'Strong implementation evidence indicates movement toward the current milestone.';
    }
    state.recommendation = recommendationForContext('none', state.goal.blocker);
    addHistory('evidence_added', 'Evidence added', `${evidence.type.replaceAll('_', ' ')} with ${evidence.confidence} confidence: ${detail}`);
    saveState('Evidence saved');
    event.target.reset();
    renderAll();
    showToast('Evidence added without replacing the original claim.');
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }

  function initializeTheme() {
    let stored = '';
    try { stored = localStorage.getItem(THEME_KEY) || ''; } catch {}
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored);
      return;
    }
    setTheme(window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  }

  function resetSample() {
    const confirmed = window.confirm('Reset the local prototype and restore the original sample goal?');
    if (!confirmed) return;
    state = sampleState();
    selectedQuestionValue = '';
    saveState('Sample restored');
    renderAll();
    showToast('Sample goal restored.');
  }

  function installEvents() {
    $('#goalForm').addEventListener('submit', handleGoalSubmit);
    $('#checkInForm').addEventListener('submit', handleCheckInSubmit);
    $('#evidenceForm').addEventListener('submit', handleEvidenceSubmit);
    $('#submitQuestionAnswer').addEventListener('click', handleQuestionAnswer);
    $('#skipQuestion').addEventListener('click', handleSkipQuestion);
    $('#resetButton').addEventListener('click', resetSample);
    $('#themeButton').addEventListener('click', () => {
      setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
    });

    $('#difficultyRange').addEventListener('input', event => renderDifficultyPreview(Number(event.target.value)));

    document.addEventListener('click', event => {
      const questionOption = event.target.closest('[data-question-value]');
      if (questionOption) {
        selectedQuestionValue = questionOption.dataset.questionValue;
        $$('[data-question-value]').forEach(button => {
          button.setAttribute('aria-pressed', String(button === questionOption));
        });
        $('#questionCustomAnswer').value = '';
        return;
      }

      const outcome = event.target.closest('[data-outcome]');
      if (outcome) {
        handleOutcome(outcome.dataset.outcome);
        return;
      }

      const scroll = event.target.closest('[data-scroll-target]');
      if (scroll) {
        const target = $(`#${CSS.escape(scroll.dataset.scrollTarget)}`);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    $('#questionCustomAnswer').addEventListener('input', event => {
      if (!event.target.value.trim()) return;
      selectedQuestionValue = '';
      $$('[data-question-value]').forEach(button => button.setAttribute('aria-pressed', 'false'));
    });
  }

  function init() {
    initializeTheme();
    installEvents();
    renderAll();
    setSaveStatus(localStorage.getItem(STORAGE_KEY) ? 'Local state restored' : 'Sample loaded');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
