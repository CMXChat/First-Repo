'use strict';

(() => {
  const copy = new Map([
    ['The layout stays familiar. The people, permissions, priorities, numbers, Spaces, and next steps change with your choice.', 'The layout stays familiar while the people, permissions, priorities, numbers, Spaces, and next steps change with your choice.'],
    ['The final Open demo tap asks Spotify to play. Some devices may still ask you to tap Spotify once.', 'Opening the demo asks Spotify to play, although some devices may still require one direct tap in the Spotify player.'],
    ['All private-looking records are fictional and labeled. Real private data would need secure sign-in and permissions.', 'All private-looking records are fictional and labeled because real private data would require secure sign-in and properly limited permissions.'],
    ['The Brief is what you see. Personal OS keeps the context behind it.', 'The Brief shows what matters now, while Personal OS keeps the approved context behind it.'],
    ['Goals show direction. Spaces set boundaries. Connections bring in approved data. Memory keeps useful history. Automations handle repeat work.', 'Goals provide direction, Spaces set the boundaries, connections bring in approved data, memory preserves useful history, and automations handle repeat work.'],
    ['Public data can be live. Private-looking records stay fictional until secure connections exist.', 'Public data can be live, while private-looking records remain fictional until secure connections exist.'],
    ['The focused views are faster. This page keeps every section together for a longer review.', 'The focused views are faster, while this page keeps every section together for a longer review.'],
    ['The Open demo tap asks Spotify to play. Some browsers, devices, or Spotify accounts may still require one direct tap.', 'Opening the demo asks Spotify to play, although some browsers, devices, or Spotify accounts may still require one direct tap.'],
    ['45 minutes. Open the prototype and leave with one clear owner.', 'Use the 45-minute review to open the prototype and leave with one clear owner.'],
    ['Each person keeps a private profile. The shared Space holds only the plans, promises, and details both people approved.', 'Each person keeps a private profile, while the shared Space holds only the plans, promises, and details both people approved.'],
    ['Jordan prepares options. Both approve.', 'Jordan prepares the options, and both people approve the final choice.'],
    ['Indoor training is comfortable. Hydrate before the session.', 'Indoor training should be comfortable, so hydrate before the session and begin with the readiness check.'],
    ['The data can support coaching. Qualified care still belongs with a professional.', 'The data can support coaching, while qualified care remains with the appropriate professional.'],
    ['Members see the work they need. Project leads keep the wider view and restricted details.', 'Members see the work they need, while project leads keep the wider view and restricted details.'],
    ['Owner: Sam. Due before readiness review.', 'Sam owns this task, which is due before the readiness review.'],
    ['Personal OS checks the approved information, then chooses a clear way to show it. Navigation, privacy controls, and main locations stay familiar. The useful cards, charts, and explanations can change with the day.', 'Personal OS checks the approved information and chooses the clearest way to present it, while navigation, privacy controls, and the main locations remain familiar even as the useful cards, charts, and explanations change with the day.'],
    ['The layout can adapt and still feel familiar. Controls, sources, and the way back to focused views stay in predictable places.', 'The layout can adapt without becoming confusing because controls, sources, and the route back to focused views stay in predictable places.'],
    ['This is a concept. Real playback, voice, alarms, and account access need device permissions, provider support, clear controls, and secure sign-in.', 'This concept would require device permissions, provider support, clear controls, and secure sign-in before playback, voice, alarms, or account access could work with real users.'],
    ['Connections have a clear purpose. Memories can be reviewed. Shared Spaces receive only approved records. Important actions need confirmation and stay in the history.', 'Each connection has a clear purpose, memories remain reviewable, Shared Spaces receive only approved records, and important actions require confirmation before they enter the history.'],
    ['A normal chat usually depends on the current conversation. You may need to explain important background again.', 'A normal chat usually depends on the current conversation, so important background may need to be explained again.'],
    ['The result becomes useful evidence. The next plan can respond to what was completed, skipped, changed, or learned.', 'The result becomes useful evidence, allowing the next plan to respond to what was completed, skipped, changed, or learned.'],
    ['Important actions stay visible and need confirmation. This demo shows the rules. Real protection belongs behind secure sign-in and server permissions.', 'Important actions stay visible and require confirmation, while the demo explains the rules that would need secure sign-in and server-side permissions in a real product.'],
    ['Spotify needs one direct tap on this device. Open the soundtrack and tap play in Spotify.', 'This device requires one direct tap, so open the soundtrack and press play in the Spotify player.'],
    ['Spotify is still preparing in the background. The Brief remains available.', 'Spotify is still preparing in the background, but the Brief is ready to use.'],
    ['Spotify is preparing in the background. The Brief opened without waiting.', 'Spotify is preparing in the background while the Brief opens without waiting.'],
    ['The interface is a working demonstration. The secure multi-user platform remains under development.', 'The interface is a working demonstration, while the secure multi-user platform remains under development.'],
    ['The current demo uses sourced public information and clearly fictional private-looking examples. Real accounts, secure connectors, durable memory, and server-side permissions are part of the planned platform.', 'The current demo combines sourced public information with clearly fictional private-looking examples, while real accounts, secure connectors, durable memory, and server-side permissions remain part of the planned platform.'],
    ['The demo uses public information and clearly labeled fictional records. Real accounts, private memory, secure connections, and server permissions still need to be built.', 'The demo combines public information with clearly labeled fictional records, while real accounts, private memory, secure connections, and server permissions still need to be built.'],
    ['Most digital tools hold one slice of your life. A calendar knows time. Email knows messages. A task manager knows assignments. An AI chat knows the context placed into that conversation.', 'Most digital tools understand only one part of your life: calendars track time, email holds messages, task managers organize assignments, and AI chats work with the context placed into the current conversation.'],
    ['Most tools know one part of your life. A calendar knows time. Email knows messages. A task manager knows assignments. An AI chat knows what was placed in that conversation.', 'Most tools understand only one part of your life: calendars track time, email holds messages, task managers organize assignments, and AI chats work with whatever was placed into the current conversation.'],
    ['Personal OS creates a stable layer above those tools. It organizes authorized information into Spaces, keeps useful memory with sources and correction controls, connects current reality to goals, and produces a focused Brief with actions that remain under human control.', 'Personal OS creates a stable layer above those tools by organizing authorized information into Spaces, preserving useful memory with sources and correction controls, connecting the current situation to goals, and producing a focused Brief whose important actions remain under human control.'],
    ['Personal OS sits above those tools. It puts approved records into Spaces, keeps memory with sources and corrections, connects the current situation to goals, and prepares a focused Brief. The user stays in control of every important action.', 'Personal OS sits above those tools, placing approved records into Spaces, keeping memory tied to sources and corrections, connecting the current situation to goals, and preparing a focused Brief while the user retains control of every important action.'],
    ['The AI can change. Your operating context stays yours.', 'The AI model can change while your operating context remains yours.'],
    ['Your data and settings stay in Personal OS, even when the AI model changes.', 'Your data, settings, permissions, and history remain in Personal OS even when the AI model changes.'],
    ['The system can prepare context and options. People remain responsible for the relationship and the decision.', 'The system can prepare the relevant context and practical options, while people remain responsible for the relationship and the final decision.'],
    ['Personal OS can prepare the facts and options. People still make the decision.', 'Personal OS can prepare the facts and options, while the people involved still make the decision.'],
    ['The model receives the context, tools, and permissions needed for the current task. Personal OS keeps the long-term product state outside the model.', 'The model receives only the context, tools, and permissions needed for the current task, while Personal OS keeps the long-term product state outside the model.'],
    ['The model receives only the context, tools, and permissions needed for the task. Personal OS keeps the long-term records outside the model.', 'The model receives only the context, tools, and permissions needed for the task, while Personal OS keeps the long-term records outside the model.'],
    ['The product narrative is open. Private product data still requires real protection.', 'The product narrative can remain open, while private product data requires real protection.'],
    ['This overview is public. Real private data needs real protection.', 'This overview can remain public, while real private data requires authentication, permission checks, and protected storage.'],
    ['The demo is an active-development preview of the daily experience. Its interface, data structure, connections, Goals, memory, and backend will continue changing as the product moves toward the full system described here.', 'The demo is an active-development preview of the daily experience, and its interface, data structure, connections, goals, memory, and backend will continue changing as the product moves toward the full platform described here.'],
    ['The demo shows the current daily experience. The interface, records, connections, goals, memory, and backend will keep changing as the real product is built.', 'The demo shows the current daily experience, while the interface, records, connections, goals, memory, and backend continue changing as the real product is built.'],
    ['Personal OS is the product layer around AI models. It manages Spaces, permissions, structured memory, sources, goals, tools, approvals, and history. A model provides reasoning and generation within that controlled context.', 'Personal OS is the product layer around the AI model, managing Spaces, permissions, structured memory, sources, goals, tools, approvals, and history so the model can reason and generate inside a controlled context.'],
    ['Personal OS is the product around the AI model. It manages Spaces, permissions, memory, sources, goals, tools, approvals, and history. The model helps reason and write inside those limits.', 'Personal OS is the product around the AI model, managing Spaces, permissions, memory, sources, goals, tools, approvals, and history so the model can reason and write inside those limits.'],
    ['Spaces let one platform support private life and shared coordination without mixing everything together. Each Space defines its members, memory, goals, tools, data, and visibility rules.', 'Spaces let one platform support private life and shared coordination without mixing everything together because each Space defines its own members, memory, goals, tools, data, and visibility rules.'],
    ['That is the intended direction. The operating context remains stable while the user or system selects an appropriate model. Provider changes should not require rebuilding the user’s goals, memory, permissions, and Spaces.', 'That is the intended direction: the operating context remains stable as the user or system selects an appropriate model, so changing providers does not require rebuilding goals, memory, permissions, or Spaces.'],
    ['Yes. The user can change the AI model while keeping the same goals, memory, permissions, and Spaces.', 'Yes, the user can change the AI model while keeping the same goals, memory, permissions, and Spaces.'],
    ['No. The public demonstration uses sourced public information and clearly fictional private-looking records. Real private data requires the planned secure backend, authentication, protected storage, and connector permissions.', 'No, the public demonstration uses sourced public information and clearly fictional private-looking records, while real private data would require the planned secure backend, authentication, protected storage, and connector permissions.'],
    ['It can organize stated information, expose conflicts, compare schedules, summarize approved positions, track agreements, and suggest practical options. It should not diagnose people, invent motives, take sides, or replace professional judgment.', 'It can organize stated information, expose conflicts, compare schedules, summarize approved positions, track agreements, and suggest practical options, while avoiding diagnosis, invented motives, taking sides, or replacing professional judgment.'],
    ['It can organize what people said, show schedule or responsibility conflicts, track agreements, and suggest practical options. It should avoid diagnosis, invented motives, taking sides, or replacing professional help.', 'It can organize what people said, show schedule or responsibility conflicts, track agreements, and suggest practical options, while avoiding diagnosis, invented motives, taking sides, or replacing professional help.'],
    ['The routine can be built from the same approved context that powers the Brief. A selected alarm can begin a user-controlled music and voice experience, then allow spoken check-ins, reminders, and updates without forcing the user through a full dashboard.', 'The routine can use the same approved context that powers the Brief, allowing a selected alarm to begin a user-controlled music and voice experience followed by spoken check-ins, reminders, or updates without forcing the user through a full dashboard.'],
    ['The alarm can use the same approved records as the Brief. It can start music and voice, then accept a spoken check-in, reminder, or update without opening the full dashboard.', 'The alarm can use the same approved records as the Brief to start music and voice, then accept a spoken check-in, reminder, or update without opening the full dashboard.'],
    ['Your day, already organized.', 'A clear view of what matters today.'],
    ['The full view can change with the information.', 'The full view adapts to the information available.'],
    ['More information should come with more control.', 'As more information is connected, the user should gain more control over how it is used.'],
    ['Memory and Spaces give AI clear limits and useful history.', 'Memory and Spaces give the AI useful history within clear limits.'],
    ['A strong demonstration with a clear path to the real platform.', 'A working demonstration with the remaining platform work stated clearly.'],
    ['What works now and what still needs building.', 'What works now and what still needs to be built.'],
    ['The same foundation can serve very different lives.', 'The same foundation can support different people, groups, and responsibilities.'],
    ['The same foundation can support different people and groups.', 'The same foundation can support different people, groups, and responsibilities.'],
    ['Goals turn context into movement.', 'Goals connect the current situation to a practical next step.'],
    ['Goals help choose the next step.', 'Goals connect the current situation to a practical next step.'],
    ['Start the day with direction.', 'Start the day with the schedule, priorities, and next step already clear.'],
    ['Coordinate shared life with boundaries.', 'Coordinate shared plans while keeping private context private.'],
    ['Connect operating reality to decisions.', 'Connect cash, projects, risks, and deadlines to the decisions they affect.'],
    ['Give each person the context needed to deliver.', 'Give each person the context and ownership needed to deliver the work.'],
    ['Reassurance first. Logistics second.', 'Start with reassurance, then work through the logistics.']
  ]);

  function replaceTextNode(node) {
    const raw = node.nodeValue || '';
    const text = raw.trim();
    const replacement = copy.get(text);
    if (!replacement || replacement === text) return;
    node.nodeValue = raw.replace(text, replacement);
  }

  function polish(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      replaceTextNode(root);
      return;
    }
    if (!(root instanceof Element) && root !== document.body) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(replaceTextNode);
  }

  function start() {
    const description = document.querySelector('meta[name="description"]');
    if (location.pathname.startsWith('/doc/') && description) {
      description.content = 'A clear product overview of Personal OS, including Spaces, memory, goals, permissions, connected services, AI model choice, and approved actions.';
    }

    polish(document.body);

    const observer = new MutationObserver((records) => {
      records.forEach((record) => {
        if (record.type === 'characterData') {
          replaceTextNode(record.target);
          return;
        }
        record.addedNodes.forEach(polish);
      });
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
