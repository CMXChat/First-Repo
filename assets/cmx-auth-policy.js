'use strict';

const FIXED_GATE_STATE_KEY = 'cmx_gate_state_v2';
const FIXED_GATE_MIGRATION_KEY = 'cmx_fixed_gate_v2';
const FIXED_GATE_ITERATIONS = 600000;

/*
 * The password itself is not stored as readable text. These chunks contain a
 * PBKDF2-SHA256 salt and verifier for the fixed user credential.
 * This is only a client-side deterrent, not server-side access control.
 */
const FIXED_GATE_SALT = ['AJZgvy6gSlaz4vmH', 'mF/J+PeJu5chL1Rd', 'PrPxgAoM0WU='].join('');
const FIXED_GATE_VERIFIER = ['kaxZz7+7WWXt5sr5', 'vVdV5iwA2OF5xCZe', 'IuJ93zUnXRs='].join('');

if (!localStorage.getItem(FIXED_GATE_MIGRATION_KEY)) {
  [
    'cmx_auth_v4', 'cmx_auth_v5', 'cmx_auth_v6',
    'cmx_session_v3', 'cmx_session_v4',
    'cmx_gate_state_v1'
  ].forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
  localStorage.setItem(FIXED_GATE_MIGRATION_KEY, '1');
}

function fixedGateState() {
  return readJson(localStorage, FIXED_GATE_STATE_KEY, {
    failures: 0,
    lockedUntil: 0
  });
}

function saveFixedGateState(state) {
  writeJson(localStorage, FIXED_GATE_STATE_KEY, state);
}

authData = function fixedCredentialAvailable() {
  return {
    version: 2,
    username: ADMIN_USERNAME,
    iterations: FIXED_GATE_ITERATIONS
  };
};

createVault = async function fixedCredentialSetupDisabled() {
  gateMessage('Credential provisioning is disabled.', 'bad');
};

unlock = async function unlockFixedCredential() {
  const state = fixedGateState();
  const remaining = Math.ceil((Number(state.lockedUntil || 0) - Date.now()) / 1000);

  if (remaining > 0) {
    return gateMessage(`Access temporarily suspended. Retry in ${remaining}s.`, 'bad');
  }

  const password = $('#loginPassword').value;
  if (!password) return gateMessage('Enter the admin password.', 'bad');

  gateMessage('Verifying...', 'info');

  try {
    const candidate = await deriveVerifier(
      password,
      fromBase64(FIXED_GATE_SALT),
      FIXED_GATE_ITERATIONS
    );
    const valid = constantTimeEqual(candidate, FIXED_GATE_VERIFIER);
    $('#loginPassword').value = '';

    if (!valid) {
      state.failures = Number(state.failures || 0) + 1;
      const lockSeconds = state.failures >= 10 ? 300 : state.failures >= 5 ? 30 : 0;
      state.lockedUntil = lockSeconds ? Date.now() + lockSeconds * 1000 : 0;
      saveFixedGateState(state);
      return gateMessage(
        lockSeconds ? `Access denied. Retry in ${lockSeconds}s.` : 'Access denied.',
        'bad'
      );
    }

    saveFixedGateState({ failures: 0, lockedUntil: 0, lastLogin: new Date().toISOString() });
    writeJson(sessionStorage, KEY.session, { username: ADMIN_USERNAME, at: Date.now() });
    gateMessage('Access granted.', 'ok');
    setTimeout(() => launch(), 180);
  } catch {
    gateMessage('Authentication failed.', 'bad');
  }
};
