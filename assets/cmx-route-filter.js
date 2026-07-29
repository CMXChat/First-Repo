'use strict';

/* Remove legacy client and archive pages from the CMX command surface. */
['callmax', 'services', 'seo', 'pythontest', 'collab5'].forEach((key) => {
  if (typeof ROUTES !== 'undefined' && Object.prototype.hasOwnProperty.call(ROUTES, key)) {
    delete ROUTES[key];
  }
});

/* Keep terminal help compact enough for a phone screen. */
if (typeof help === 'function' && typeof line === 'function') {
  help = function mobileHelp() {
    line('CMX SHELL COMMANDS', 'success');
    line('SYSTEM', 'warning');
    line('help · status · whoami · date · clear · lock · reboot');
    line('NAVIGATION', 'warning');
    line('menu · osint · phone · workspace · metadata · report');
    line('resources · missing · search · timeline · internal · ovaro');
    line('WORKOUT', 'warning');
    line('workout · log pushups 15 · log situps 20 · undo pushups');
    line('undo situps · points · streak · rest');
    line('MEMORY', 'warning');
    line('focus <text> · note <text> · notes · export');
    line('Use ↑/↓ for history and Tab for autocomplete.', 'dim');
  };
}
