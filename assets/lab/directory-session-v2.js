(() => {
  'use strict';

  const api = window.CMXOperatorApi;
  if (!api) return;

  const $ = (id) => document.getElementById(id);
  const els = {
    panel: $('directoryServerAccess'),
    badge: $('directoryServerBadge'),
    state: $('directoryServerState'),
    detail: $('directoryServerDetail'),
    form: $('directoryUnlockForm'),
    key: $('directoryOperatorKey'),
    submit: $('directoryUnlockSubmit'),
    error: $('directoryUnlockError'),
    retry: $('directorySessionRetry'),
    logout: $('directorySessionLogout'),
  };

  if (!els.panel) return;

  function setState(kind, headline, detail) {
    els.panel.dataset.state = kind;
    els.badge.dataset.state = kind;
    els.badge.textContent = kind.replaceAll('_', ' ').toUpperCase();
    els.state.textContent = headline;
    els.detail.textContent = detail || '';
    els.form.hidden = kind !== 'locked';
    els.logout.hidden = kind !== 'connected';
    els.retry.hidden = kind === 'connected' || kind === 'checking' || kind === 'locked';
    window.dispatchEvent(new CustomEvent('cmx:operator-session-state', { detail: { state: kind } }));
  }

  function expiryText(session) {
    const value = Date.parse(session?.expires_at || '');
    if (!Number.isFinite(value)) return 'Protected cookie session is active.';
    return `Protected cookie session active until ${new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}.`;
  }

  function describeFailure(error) {
    const kind = api.classify(error);
    if (kind === 'locked') return ['locked', 'Backend locked', 'Enter the operator key to open the protected Directory session.'];
    if (kind === 'forbidden') return ['denied', 'Browser Origin denied', 'The backend rejected this page Origin. No protected Directory request will be bypassed.'];
    if (kind === 'network') return ['offline', 'Backend unreachable', 'This browser could not reach the protected API.'];
    if (kind === 'unavailable') return ['unavailable', 'Operator unlock unavailable', 'The backend operator key/session service is not configured in this environment.'];
    return ['unavailable', 'Protected session unavailable', error?.message || 'The protected backend did not return a usable session.'];
  }

  async function checkSession({ reloadOnSuccess = false } = {}) {
    setState('checking', 'Checking protected session…', 'Directory uses the same operator cookie and CSRF contract as Email and Requests.');
    try {
      const session = await api.session({ refresh: true });
      setState('connected', 'Protected backend connected', expiryText(session));
      if (reloadOnSuccess) location.reload();
      return true;
    } catch (error) {
      const [kind, headline, detail] = describeFailure(error);
      setState(kind, headline, detail);
      return false;
    }
  }

  els.form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const key = els.key.value;
    els.key.value = '';
    els.error.textContent = '';
    if (!key) {
      els.error.textContent = 'Enter the operator key.';
      els.key.focus();
      return;
    }

    els.submit.disabled = true;
    setState('checking', 'Unlocking protected backend…', 'The operator key is sent directly to the backend and is not stored by this page.');
    try {
      const session = await api.unlock(key);
      setState('connected', 'Protected backend connected', expiryText(session));
      location.reload();
    } catch (error) {
      const [kind, headline, detail] = describeFailure(error);
      setState(kind, headline, detail);
      els.error.textContent = error?.status === 401 ? 'Operator key was not accepted.' : (error?.message || 'Unlock failed.');
    } finally {
      els.submit.disabled = false;
    }
  });

  els.retry.addEventListener('click', () => checkSession({ reloadOnSuccess: true }));

  els.logout.addEventListener('click', async () => {
    els.logout.disabled = true;
    try {
      await api.logout();
      setState('locked', 'Protected session ended', 'Unlock again before reading or changing protected People.');
      location.reload();
    } catch (error) {
      if (api.classify(error) === 'locked') {
        setState('locked', 'Protected session already ended', 'Unlock again before reading or changing protected People.');
        location.reload();
      } else {
        const [kind, headline, detail] = describeFailure(error);
        setState(kind, headline, detail);
      }
    } finally {
      els.logout.disabled = false;
    }
  });

  checkSession();
})();
