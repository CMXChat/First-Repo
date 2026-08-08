'use strict';

(() => {
  const legacyName = 'Personal OS';
  const productName = 'Spaces';

  const finalCopy = {
    meta: {
      title: 'Spaces',
      description: 'A daily briefing for the part of life or work you are in, built from the information that Space is allowed to use.'
    },
    scenarios: {
      personal: {
        short: 'Your day, priorities, money, routines, and next steps',
        entryPreview: {
          title: 'Your day, sorted by what matters next',
          copy: 'See the schedule, work, money, weather, and routines that actually affect today. Personal details stay here unless you choose to share them.'
        },
        headline: 'Here’s what matters for the rest of today',
        summary: 'Your next appointment, main work block, bills, weather, and movement plan are already in one place.',
        recommendation: {
          title: 'Send the revised scope before the 3:30 focus block',
          detail: 'It clears the biggest work blocker and keeps the afternoon from getting fragmented.'
        },
        priority: {
          title: 'Two charges still need a category',
          detail: 'Confirm them now so the weekly cash view stays accurate.'
        },
        details: {
          day: { title: 'Your day at a glance', summary: 'See what is fixed, what can move, and where you still have room.' },
          work: { title: 'Work that needs your attention', summary: 'Projects, messages, owners, and the next decision are together here.' },
          money: { title: 'Money to review', summary: 'See the few items that could change a payment, budget, or decision.' },
          habits: { title: 'Your private routines', summary: 'Track what happened without turning the day into a scorecard.' },
          wellness: { title: 'Movement and energy', summary: 'Keep the plan realistic enough to do today.' },
          connections: { title: 'What’s connected', summary: 'See which services are available, what they can provide, and what still needs permission.' }
        }
      },
      relationship: {
        short: 'Shared plans together, private thoughts separate',
        entryPreview: {
          title: 'Keep shared plans together and private thoughts separate',
          copy: 'Plans, commitments, and decisions can live in one shared Space while each person keeps their own private notes and memory.'
        },
        headline: 'Start with the shared facts, then make the plan',
        summary: 'Plans, promises, and decisions live in the shared Space. Each person keeps private notes and personal memory separate.',
        recommendation: {
          title: 'Confirm the weekend plan before booking anything',
          detail: 'Agree on the hotel, budget, and owner while the same facts are in front of both of you.'
        },
        priority: {
          title: 'The $300 trip transfer still needs both approvals',
          detail: 'It stays prepared until Maya and Jordan both confirm it.'
        },
        details: {
          together: { title: 'What you both need tonight', summary: 'The shared plan stays visible without pulling private thoughts into it.' },
          profiles: { title: 'What stays private', summary: 'Each person keeps their own notes, memories, and personal context.' },
          plans: { title: 'Shared plans and decisions', summary: 'See the owner, timing, and approval state for each decision.' },
          reflection: { title: 'What to repair or repeat', summary: 'Keep reflection practical: name what hurt, what worked, and what should change next time.' },
          connections: { title: 'Shared accounts and limits', summary: 'Only the calendar, money, music, or other details both people chose for this Space belong here.' }
        }
      },
      family: {
        short: 'Today’s household plan, with a clear owner for each job',
        entryPreview: {
          title: 'Everyone can see today’s plan and who owns what',
          copy: 'Appointments, pickups, chores, shopping, and shared availability come together without exposing private calendar details.'
        },
        headline: 'The household plan is clear before everyone starts moving',
        summary: 'The family can see rides, appointments, chores, shopping, and the one change that still needs approval.',
        recommendation: {
          title: 'Confirm the school pickup change by 2:45 PM',
          detail: 'Once Elena accepts it, both routes are covered.'
        },
        priority: {
          title: 'Milk is almost out, and Elena has it covered',
          detail: 'It is on the 5:30 grocery stop, so nobody needs to duplicate the errand.'
        },
        details: {
          home: { title: 'Today’s household plan', summary: 'See the next move, who owns it, and what still needs a decision.' },
          calendar: { title: 'Who needs to be where', summary: 'Appointments, rides, and shared availability are visible without exposing private event details.' },
          chores: { title: 'Who owns each task', summary: 'Open work, due times, and completed jobs stay easy to scan.' },
          shopping: { title: 'What still needs to be picked up', summary: 'See what is needed, who claimed it, and what is already done.' },
          access: { title: 'Who can see what', summary: 'Adults, teens, and children get the household information that fits their role.' }
        }
      },
      business: {
        short: 'One company view across New York and Sydney',
        entryPreview: {
          title: 'Run one company across New York and Sydney',
          copy: 'Cash, projects, deals, concerns, and shared decisions stay aligned across both workdays. Each partner keeps private preparation separate.'
        },
        headline: 'Run one company across New York and Sydney',
        summary: 'Amina and Eli see the same cash position, project risks, pipeline, and decisions while working in different time zones.',
        recommendation: {
          title: 'Protect the cash buffer before adding another fixed cost',
          detail: 'Friday’s renewal and the late receivable push the buffer below the partners’ ten-week rule.'
        },
        priority: {
          title: 'Friday’s renewal drops the buffer to 9.4 weeks',
          detail: 'Review the renewal and late receivable together before approving a contractor.'
        },
        details: {
          executive: { title: 'The company in one glance', summary: 'See cash, delivery, pipeline, and the decisions that need both partners.' },
          projects: { title: 'Projects that need a decision', summary: 'Each project shows the owner, progress, blocker, and next move.' },
          deals: { title: 'Pipeline you can actually act on', summary: 'Every value shows its stage, owner, and next step, keeping pipeline distinct from collected cash.' },
          calendar: { title: 'New York and Sydney on one calendar', summary: 'Local times, shared windows, and prepared changes stay easy to understand before anything is sent.' },
          concerns: { title: 'What each partner wants on the table', summary: 'Shared concerns get an owner and review date. Private preparation stays private.' }
        }
      },
      accounting: {
        short: 'A shared money review with a clear approval trail',
        entryPreview: {
          title: 'See where the money stands before deciding what moves next',
          copy: 'Income, bills, taxes, savings, investing, and business cash come together for one review without mixing unrelated private records.'
        },
        headline: 'See where the money stands before deciding what moves next',
        summary: 'Daniel and Priya can review cash, taxes, bills, investing, and business money while personal records and the accountant’s private work stay separate.',
        recommendation: {
          title: 'Finish the tax reserve after the client payment clears',
          detail: '$380 closes the gap without touching the emergency fund.'
        },
        priority: {
          title: '$1,250 card autopay puts flexible spending $310 over plan',
          detail: 'Review the two open charges before the autopay runs.'
        },
        weather: {
          location: 'Brooklyn, New York',
          temperature: 82,
          condition: 'Mostly sunny',
          high: 84,
          low: 71,
          advice: 'Weather should not interfere with the 3:30 PM money review.',
          hourly: [
            { time: 'Now', temp: 82, rain: 8 },
            { time: '4 PM', temp: 83, rain: 10 },
            { time: '6 PM', temp: 79, rain: 14 },
            { time: '8 PM', temp: 75, rain: 16 }
          ]
        },
        details: {
          overview: { title: 'Start with the three money decisions', summary: 'Cash safety, deadlines, and agreed rules come first. The deeper records are still there when you need them.' },
          cash: { title: 'This month’s cash plan', summary: 'Planned and actual amounts sit side by side so exceptions are easy to spot.' },
          portfolio: { title: 'Investments and allocation', summary: 'See the mix, contributions, and review notes without overreacting to one day of market movement.' },
          deadlines: { title: 'Bills and tax dates', summary: 'Each item shows the date, amount, owner, and what still needs approval.' },
          rules: {
            title: 'The rules behind the plan',
            summary: 'Daniel can review, change, pause, or approve an exception to any rule.',
            rules: [
              { title: 'Protect taxes first', detail: 'Move the planned tax percentage before owner draws or new growth spending.', status: 'Active' },
              { title: 'Review purchases above $500', detail: 'Check the tax reserve, cash runway, and expected return before approval.', status: 'Active' },
              { title: 'Keep personal and startup records separate', detail: 'Shared reporting can compare both while each account keeps its own ledger.', status: 'Active' },
              { title: 'Confirm category changes', detail: 'A suggested category stays pending until Daniel confirms the record.', status: 'User controlled' }
            ]
          }
        }
      },
      trainer: {
        short: 'Training, recovery, progress, and coaching in one place',
        entryPreview: {
          title: 'Adjust today’s workout without losing the plan',
          copy: 'Training, recovery, habits, and coach feedback stay together, while sensitive health details keep a separate boundary.'
        },
        headline: 'Adjust today’s workout without losing the plan',
        summary: 'Nina and Sam can see readiness, the workout, recent progress, and what to change if recovery is low.',
        recommendation: {
          title: 'Use the shorter plan if readiness is low',
          detail: 'Log the change so the next session is based on what actually happened.'
        },
        priority: {
          title: 'Sleep was short last night',
          detail: 'Use the warm-up check before choosing normal or reduced volume.'
        },
        details: {
          today: { title: 'Today’s workout decision', summary: 'Check readiness, choose the right volume, and record what actually happened.' },
          habits: { title: 'Patterns worth talking about', summary: 'Use patterns to ask better questions before changing the plan.' },
          progress: { title: 'What has actually improved', summary: 'Completed sessions and repeated results show whether the plan is working.' },
          recovery: { title: 'What could change today’s plan', summary: 'Sleep, pain, and readiness can change the workout. Unusual pain is a reason to stop and get appropriate help.' },
          connections: { title: 'What the coach can use', summary: 'Workout history and optional wearable data can support coaching. Medical records need a separate protected path.' }
        }
      },
      team: {
        short: 'Ownership, blockers, handoffs, and release readiness',
        entryPreview: {
          title: 'Everyone can see what they own, what’s blocked, and what happens next',
          copy: 'The team shares one project record. Members get the details they need, while lead-only information stays restricted.'
        },
        headline: 'Everyone can see what they own and what’s blocking release',
        summary: 'The team has one shared project picture with role-specific work, blockers, handoffs, and the decision needed before release.',
        recommendation: {
          title: 'Assign the QA-to-release owner before adding more work',
          detail: 'That missing receiver is the one blocker the team can fix before the 3:00 review.'
        },
        priority: {
          title: 'QA still has nobody to hand the release to',
          detail: 'Assign the receiver before the readiness review.'
        },
        weather: {
          location: 'New York, New York',
          temperature: 74,
          condition: 'Mild and dry',
          high: 76,
          low: 63,
          advice: 'No weather issue affects today’s release schedule.',
          hourly: [
            { time: 'Now', temp: 74, rain: 11 },
            { time: '3 PM', temp: 75, rain: 12 },
            { time: '5 PM', temp: 72, rain: 10 },
            { time: 'Evening', temp: 68, rain: 9 }
          ]
        },
        details: {
          mywork: { title: 'What you own today', summary: 'See your task, the blocker in front of it, and the project goal it supports.' },
          project: { title: 'The project at a glance', summary: 'Every workstream shows its owner, progress, blocker, and next proof.' },
          handoffs: { title: 'Who hands what to whom', summary: 'Every transfer names the sender, receiver, timing, and what still needs to be delivered.' },
          procedures: { title: 'What must be ready before release', summary: 'The checklist stays visible while restricted credentials and lead-only details remain protected.' },
          connections: { title: 'Tools this project can use', summary: 'Only the project records needed for the work should enter this Space.' }
        }
      }
    }
  };

  function replaceString(value) {
    return typeof value === 'string' ? value.split(legacyName).join(productName) : value;
  }

  function updateObject(value, seen = new WeakSet()) {
    if (!value || typeof value !== 'object' || seen.has(value)) return value;
    seen.add(value);

    for (const key of Object.keys(value)) {
      const current = value[key];
      if (typeof current === 'string') value[key] = replaceString(current);
      else if (current && typeof current === 'object') updateObject(current, seen);
    }

    return value;
  }

  function mergeCopy(target, source) {
    if (!target || !source) return target;
    for (const [key, value] of Object.entries(source)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) target[key] = {};
        mergeCopy(target[key], value);
      } else {
        target[key] = value;
      }
    }
    return target;
  }

  function updateAttributes(root) {
    root.querySelectorAll?.('[aria-label], [title]').forEach((element) => {
      for (const attribute of ['aria-label', 'title']) {
        const current = element.getAttribute(attribute);
        if (current?.includes(legacyName)) element.setAttribute(attribute, replaceString(current));
      }
    });
  }

  function updateText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (node.nodeValue?.includes(legacyName)) node.nodeValue = replaceString(node.nodeValue);
    }
  }

  function setText(selector, text) {
    const node = document.querySelector(selector);
    if (node && text) node.textContent = text;
  }

  function applyStaticCopy() {
    document.querySelector('meta[name="description"]')?.setAttribute('content', finalCopy.meta.description);

    setText('.entry-brand span', 'Briefings for real life and work');
    setText('#entryTitle', 'Open the briefing you need right now');
    setText('.entry-copy', 'Choose the part of life or work you’re in. Spaces brings the information for that area together, puts the next decision first, and keeps unrelated private details out.');
    setText('.entry-demo-data p', 'The people and private records in this demo are fictional. A real version would require sign-in, clear permissions, and protected storage.');
    setText('.identity-copy small', 'A briefing for the Space you’re in');
    setText('.hero-meta .source-pill', 'DEMO BRIEF');

    setText('.space-discovery .eyebrow', 'GO DEEPER');
    setText('#spaceDiscoveryTitle', 'Open the part you need');
    setText('.space-discovery > header > p', 'Each card goes straight to that section.');

    setText('.weather-heading .eyebrow', 'WEATHER & TIMING');
    setText('#weatherTitle', 'What the conditions change');
    setText('.weather-heading .muted-pill', 'DEMO WEATHER');
    setText('#statsTitle', 'What needs attention');
    setText('.stats-panel .panel-heading-side > p', 'These change with the Space you choose.');

    setText('[data-view-panel="workspace"] .view-heading .eyebrow', 'EXPLORE');
    setText('#workspaceTitle', 'Open the part of this briefing you need');
    setText('[data-view-panel="workspace"] .view-heading-tools > p', 'The categories change with the Space. The way you move around stays familiar.');

    setText('[data-view-panel="spaces"] .view-heading .eyebrow', 'PRIVACY & SHARING');
    setText('#spacesTitle', 'See what stays private and what this Space can use');
    setText('[data-view-panel="spaces"] .view-heading-tools > p', 'Only the details needed for this Space are shared. Everything else stays with its owner.');

    const permissionCards = document.querySelectorAll('.permission-strip article');
    const permissionCopy = [
      ['Starts private', 'Personal records stay with their owner until they’re shared.'],
      ['Share for a reason', 'Each shared detail belongs to a specific Space and purpose.'],
      ['See what’s shared', 'People can review access, memory, and automations.'],
      ['Change your mind', 'Pause, correct, or remove access at any time.']
    ];
    permissionCards.forEach((card, index) => {
      const copy = permissionCopy[index];
      if (!copy) return;
      const strong = card.querySelector('strong');
      const paragraph = card.querySelector('p');
      if (strong) strong.textContent = copy[0];
      if (paragraph) paragraph.textContent = copy[1];
    });

    setText('#howTitle', 'How Spaces turns scattered information into a briefing you can use');
    setText('[data-view-panel="how"] .view-heading-tools > p', 'Goals set direction. Spaces define who can see what. Connected accounts bring in information. Memory keeps confirmed history. Automations handle repeat work.');

    const howCards = document.querySelectorAll('.how-grid article');
    const howCopy = [
      ['Bring it together', 'Pull in the information that can actually change today’s plan.'],
      ['Put it in order', 'Use goals, timing, and responsibilities to decide what deserves attention first.'],
      ['Prepare the next step', 'Draft useful actions, then keep important changes behind approval.']
    ];
    howCards.forEach((card, index) => {
      const copy = howCopy[index];
      if (!copy) return;
      const label = card.querySelector('span');
      const heading = card.querySelector('h2');
      const paragraph = card.querySelector('p');
      if (label) label.textContent = ['UNDERSTAND', 'CHOOSE', 'ACT'][index];
      if (heading) heading.textContent = copy[0];
      if (paragraph) paragraph.textContent = copy[1];
    });

    setText('#coordinationTitle', 'Calendars, alarms, and voice can work from the same Space.');
    const coordinationItems = document.querySelectorAll('[aria-labelledby="coordinationTitle"] li');
    const coordinationCopy = [
      '<strong>Shared calendars:</strong> show the events and availability people agreed to share.',
      '<strong>Adaptive alarm:</strong> adjust the start of the day when weather, travel, or an early responsibility changes the plan.',
      '<strong>Voice:</strong> read only what is safe to say aloud and make listening controls obvious.',
      '<strong>Control:</strong> every routine can be paused, reviewed, or turned off.'
    ];
    coordinationItems.forEach((item, index) => {
      if (coordinationCopy[index]) item.innerHTML = coordinationCopy[index];
    });

    setText('#everythingTitle', 'See the full briefing on one page');
    setText('[data-view-panel="everything"] .view-heading-tools > p', 'Use this when you want the whole picture. Focused views are faster when you only need one area.');

    setText('#briefUpdateTitle', 'Tell this Brief what changed');
    setText('.brief-update-boundary', 'Demo only. A real account would show what changed, where it came from, and let you review it before memory updates.');
    setText('#priorityRoutingTitle', 'Choose where important alerts should go');
    setText('.priority-routing-boundary', 'Preview only. Nothing is sent. A real connection would require sign-in, recipient approval, delivery history, and a way to turn it off.');
    setText('#spacesAiTitle', 'Continue with this section');
    setText('.spaces-ai-intro', 'Your question can use this section and the current Space as context. A connected version would still follow the Space’s permissions.');
    setText('.spaces-ai-connection span', 'Demo preview. Live answers and private records need a secure account connection.');
    setText('#spacesAiForm label', 'Ask a question or add a correction');
    setText('#spacesAiForm button[type="submit"]', 'Preview this question');
  }

  function applyBrand(root = document.body) {
    if (!root) return;
    document.title = replaceString(document.title);
    updateText(root);
    updateAttributes(root);
  }

  function applyFinalCopy() {
    const data = window.BRIEF_DEMO_DATA;
    if (!data?.scenarios) return;
    mergeCopy(data, finalCopy);
    updateObject(data);
  }

  function refreshCurrentBrief() {
    const select = document.getElementById('scenarioSelect');
    if (!select?.value) return;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  updateObject(window.BRIEF_DEMO_DATA);

  document.addEventListener('DOMContentLoaded', () => {
    applyFinalCopy();
    applyBrand();
    refreshCurrentBrief();
    applyStaticCopy();

    const target = document.getElementById('demoApp') || document.body;
    const observer = new MutationObserver((mutations) => {
      let needsUpdate = false;
      for (const mutation of mutations) {
        if (mutation.type === 'characterData' && mutation.target.nodeValue?.includes(legacyName)) {
          needsUpdate = true;
          break;
        }
        if ([...mutation.addedNodes].some((node) => node.textContent?.includes(legacyName))) {
          needsUpdate = true;
          break;
        }
      }
      if (needsUpdate) queueMicrotask(() => applyBrand(target));
    });

    observer.observe(target, { childList: true, subtree: true, characterData: true });
  }, { once: true });
})();
