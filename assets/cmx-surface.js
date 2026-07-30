'use strict';

/* Keep legacy workspace selectors out of the public terminal surface. */
if (typeof ROUTES !== 'undefined' && Object.prototype.hasOwnProperty.call(ROUTES, 'entry')) {
  delete ROUTES.entry;
}

/* Keep terminal help synchronized with the visible route manifest. */
if (typeof help === 'function' && typeof line === 'function') {
  help = function terminalHelp() {
    line('CMX SHELL COMMANDS', 'success');
    line('SYSTEM', 'warning');
    line('help · status · whoami · date · pwd · hostname · clear · lock · reboot');
    line('NAVIGATION', 'warning');
    line('menu · osint · phone · workspace · metadata · report');
    line('resources · missing · search · timeline');
    line('USE', 'warning');
    line('open <route> · ls · ls tools · ls core');
    line('MEMORY', 'warning');
    line('focus · focus <text> · note <text> · notes · export');
    line('Use ↑/↓ for history and Tab for autocomplete.', 'dim');
  };
}
