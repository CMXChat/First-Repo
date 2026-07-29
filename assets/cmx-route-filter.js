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

/* Terminal-only authenticated workspace. Hidden dashboard elements stay in the DOM
   so workout, XP, focus, notes, and history commands continue to function. */
(() => {
  const style = document.createElement('style');
  style.id = 'cmx-terminal-only-mode';
  style.textContent = `
    #app {
      width: 100% !important;
      height: 100svh !important;
      min-height: 100svh !important;
      overflow: hidden !important;
      padding: 0 !important;
    }

    #app .app-shell {
      width: 100% !important;
      height: 100svh !important;
      min-height: 100svh !important;
      display: block !important;
      overflow: hidden !important;
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
    }

    #app .topbar,
    #app .dashboard {
      display: none !important;
    }

    #app .main-grid {
      width: 100% !important;
      height: 100svh !important;
      min-height: 100svh !important;
      display: block !important;
      overflow: hidden !important;
    }

    #app .terminal-pane {
      width: 100% !important;
      height: 100svh !important;
      min-height: 100svh !important;
      margin: 0 !important;
      display: grid !important;
      grid-template-rows: auto minmax(0, 1fr) auto !important;
      overflow: hidden !important;
      border: 0 !important;
      border-radius: 0 !important;
      background:
        radial-gradient(circle at 100% 0, rgba(31, 155, 255, 0.08), transparent 24rem),
        rgba(1, 7, 13, 0.98) !important;
    }

    #app .pane-head {
      min-height: 46px !important;
      padding:
        max(7px, env(safe-area-inset-top))
        10px
        7px !important;
      background: rgba(7, 24, 39, 0.96) !important;
    }

    #app #terminalOutput {
      width: 100% !important;
      min-width: 0 !important;
      min-height: 0 !important;
      height: auto !important;
      max-height: none !important;
      overflow-x: hidden !important;
      overflow-y: auto !important;
      padding: 15px 12px 24px !important;
    }

    #app .terminal-line {
      max-width: 100% !important;
      overflow-wrap: anywhere !important;
      word-break: break-word !important;
    }

    #app .terminal-table {
      width: 100% !important;
      min-width: 0 !important;
      table-layout: fixed !important;
    }

    #app .terminal-table th,
    #app .terminal-table td {
      overflow-wrap: anywhere !important;
      word-break: break-word !important;
    }

    #app .terminal-input-row {
      min-height: 58px !important;
      padding:
        7px
        11px
        max(8px, env(safe-area-inset-bottom)) !important;
      background: rgba(2, 12, 23, 0.99) !important;
    }

    #app #commandInput {
      min-width: 0 !important;
      font-size: 16px !important;
    }

    @media (min-width: 760px) {
      #app .pane-head {
        padding: 9px 14px !important;
      }

      #app #terminalOutput {
        padding: 20px !important;
      }

      #app .terminal-line {
        font-size: 13px !important;
      }

      #app .prompt-mobile {
        display: none !important;
      }

      #app .prompt-full {
        display: inline !important;
      }
    }
  `;
  document.head.appendChild(style);
})();
