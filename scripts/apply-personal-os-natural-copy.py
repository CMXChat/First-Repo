from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def apply_replacements(relative_path, replacements):
    path = ROOT / relative_path
    text = path.read_text(encoding="utf-8")
    original = text

    for old, new, expected in replacements:
        count = text.count(old)
        if count != expected:
            raise RuntimeError(
                f"{relative_path}: expected {expected} occurrence(s) of {old!r}, found {count}"
            )
        text = text.replace(old, new)

    if text == original:
        raise RuntimeError(f"{relative_path}: no changes were applied")

    path.write_text(text, encoding="utf-8")
    print(f"updated {relative_path}")


brief_replacements = [
    (
        "<h1 id=\"entryTitle\">Choose a briefing to explore.</h1>",
        "<h1 id=\"entryTitle\">Choose a briefing to explore</h1>",
        1,
    ),
    (
        "<p class=\"entry-copy\">The layout stays familiar. The people, permissions, priorities, numbers, Spaces, and next steps change with your choice.</p>",
        "<p class=\"entry-copy\">The layout stays familiar, but the people, permissions, priorities, numbers, Spaces, and next steps change based on the briefing you choose.</p>",
        1,
    ),
    (
        "<small>The final Open demo tap asks Spotify to play. Some devices may still ask you to tap Spotify once.</small>",
        "<small>Opening the demo asks Spotify to play, though some devices may still require one tap inside Spotify.</small>",
        1,
    ),
    (
        "<p class=\"entry-note\">All private-looking records are fictional and labeled. Real private data would need secure sign-in and permissions.</p>",
        "<p class=\"entry-note\">The private-looking records are fictional and clearly labeled because real private data would require secure sign-in and permission controls.</p>",
        1,
    ),
    (
        "<div><p class=\"eyebrow\">MORE DETAIL</p><h1 id=\"workspaceTitle\">Open one part of the briefing at a time.</h1></div>",
        "<div><p class=\"eyebrow\">MORE DETAIL</p><h1 id=\"workspaceTitle\">Open the part of the briefing you need</h1></div>",
        1,
    ),
    (
        "<div><p class=\"eyebrow\">CLEAR BOUNDARIES</p><h1 id=\"spacesTitle\">Private profiles and approved shared Spaces.</h1></div>",
        "<div><p class=\"eyebrow\">CLEAR BOUNDARIES</p><h1 id=\"spacesTitle\">Keep private profiles separate and share only what belongs in the Space</h1></div>",
        1,
    ),
    (
        "<div><p class=\"eyebrow\">HOW IT WORKS</p><h1 id=\"howTitle\">The Brief is what you see. Personal OS keeps the context behind it.</h1></div>",
        "<div><p class=\"eyebrow\">HOW IT WORKS</p><h1 id=\"howTitle\">The Brief shows what matters now, and Personal OS keeps the context behind it</h1></div>",
        1,
    ),
    (
        "<p>Goals show direction. Spaces set boundaries. Connections bring in approved data. Memory keeps useful history. Automations handle repeat work.</p>",
        "<p>Goals provide direction, Spaces set boundaries, approved connections bring in data, memory keeps useful history, and automations handle repeat work.</p>",
        1,
    ),
    (
        "<article><span>Understand</span><h2>Put the useful information in one clear view.</h2><p>Extra sections stay hidden until they affect timing, risk, ownership, or the next step.</p></article>",
        "<article><span>Understand</span><h2>Bring the useful information into one clear view</h2><p>Extra sections stay hidden until they affect timing, risk, ownership, or the next step.</p></article>",
        1,
    ),
    (
        "<article><span>Choose</span><h2>Use goals and plans to decide what needs attention.</h2><p>The same app can support personal, relationship, business, training, and team briefings.</p></article>",
        "<article><span>Choose</span><h2>Use goals and plans to decide what deserves attention</h2><p>The same app can support personal, relationship, business, training, and team briefings.</p></article>",
        1,
    ),
    (
        "<article><span>Act</span><h2>Turn the Brief into approved work.</h2><p>Secure access, permission checks, and confirmations sit behind the interface.</p></article>",
        "<article><span>Act</span><h2>Prepare useful work and keep important actions behind approval</h2><p>Secure access, permission checks, and confirmations sit behind the interface.</p></article>",
        1,
    ),
    (
        "<div><p class=\"eyebrow\">WHAT THIS DEMO USES</p><h2>Public data can be live. Private-looking records stay fictional until secure connections exist.</h2></div>",
        "<div><p class=\"eyebrow\">WHAT THIS DEMO USES</p><h2>Public data can be live, but private-looking records stay fictional until secure connections are available.</h2></div>",
        1,
    ),
    (
        "<h2>See how the full product works.</h2>",
        "<h2>Read the full Personal OS product overview</h2>",
        1,
    ),
    (
        "<div><p class=\"eyebrow\">FULL VIEW</p><h1 id=\"everythingTitle\">The full briefing in one page.</h1></div>",
        "<div><p class=\"eyebrow\">FULL VIEW</p><h1 id=\"everythingTitle\">Review the complete briefing on one page</h1></div>",
        1,
    ),
    (
        "<p>The focused views are faster. This page keeps every section together for a longer review.</p>",
        "<p>Focused views are faster, but this page keeps every section together for a longer review.</p>",
        1,
    ),
    (
        "<p class=\"provider-note\">The Open demo tap asks Spotify to play. Some browsers, devices, or Spotify accounts may still require one direct tap.</p>",
        "<p class=\"provider-note\">Opening the demo asks Spotify to play, though some browsers, devices, or Spotify accounts may still require one direct tap.</p>",
        1,
    ),
    ("brief-demo-data.js?v=20260805-2", "brief-demo-data.js?v=20260806-1", 1),
    ("brief-demo-experience.js?v=20260805-3", "brief-demo-experience.js?v=20260806-1", 1),
    ("brief-demo-media.js?v=20260806-1", "brief-demo-media.js?v=20260806-2", 1),
    ("brief-demo-explainers.js?v=20260805-3", "brief-demo-explainers.js?v=20260806-1", 1),
]

for route in ("brief/index.html", "brief-next/index.html"):
    apply_replacements(route, brief_replacements)

apply_replacements(
    "assets/brief/brief-demo-data.js",
    [
        ("title: 'Your day, already organized.'", "title: 'A clear view of what matters today'", 1),
        (
            "description: 'A focused demonstration of a private daily briefing shaped by goals, Spaces, connections, permissions and approved actions.'",
            "description: 'A working daily briefing that organizes approved information around clear Spaces, permissions, goals, and next steps.'",
            1,
        ),
        ("headline: 'Here is the shape of your day.'", "headline: 'Here’s what your day looks like'", 1),
        (
            "detail: '45 minutes. Open the prototype and leave with one clear owner.'",
            "detail: 'Use the 45-minute review to open the prototype and leave with one clear owner.'",
            1,
        ),
        (
            "title: 'Send the revised scope before the afternoon fragments.'",
            "title: 'Send the revised scope before the afternoon fills up'",
            1,
        ),
        (
            "note: 'Bright forward motion for one real action.'",
            "note: 'A bright track for getting one real task done.'",
            1,
        ),
        (
            "headline: 'Reassurance first. Logistics second.'",
            "headline: 'Start with reassurance, then work through the plan'",
            1,
        ),
        (
            "detail: 'Jordan prepares options. Both approve.'",
            "detail: 'Jordan prepares the options, and both people approve the final choice.'",
            1,
        ),
        (
            "title: 'Collect before expanding fixed cost.'",
            "title: 'Collect the expected cash before adding fixed cost'",
            1,
        ),
        (
            "summary: 'Unowned work becomes visibly uncomfortable.'",
            "summary: 'Work without an owner is easy to miss.'",
            1,
        ),
        (
            "advice: 'Indoor training is comfortable. Hydrate before the session.'",
            "advice: 'Indoor training should be comfortable, but hydrate before the session.'",
            1,
        ),
        (
            "headline: 'Everyone should see the same mission without seeing everything.'",
            "headline: 'Everyone needs the same goal, but they do not need the same access.'",
            1,
        ),
        (
            "detail: 'Owner: Sam. Due before readiness review.'",
            "detail: 'Sam owns this task, which is due before the readiness review.'",
            1,
        ),
        (
            "summary: 'The status changes when evidence changes, not when the presentation wants to look optimistic.'",
            "summary: 'Status should follow the evidence, even when the result is less flattering.'",
            1,
        ),
    ],
)

apply_replacements(
    "assets/brief/brief-demo-experience.js",
    [
        ("title: 'Your day, already organized.'", "title: 'A clear view of what matters today'", 1),
        (
            "description: 'A working daily briefing with clear Spaces, permissions, goals, and next steps.'",
            "description: 'A working daily briefing that organizes approved information around clear Spaces, permissions, goals, and next steps.'",
            1,
        ),
        ("headline: 'Here is what your day looks like.'", "headline: 'Here’s what your day looks like'", 1),
        (
            "summary: 'Your schedule, priorities, bills, movement, and next steps are in one place.'",
            "summary: 'Your schedule, priorities, bills, movement, and next steps are together in one place.'",
            1,
        ),
        (
            "title: 'Send the revised scope before the afternoon gets busy.'",
            "title: 'Send the revised scope before the afternoon fills up'",
            1,
        ),
        (
            "headline: 'Start with reassurance, then handle the plan.'",
            "headline: 'Start with reassurance, then work through the plan'",
            1,
        ),
        (
            "summary: 'Each person keeps a private profile. The shared Space holds only the plans, promises, and details both people approved.'",
            "summary: 'Each person keeps a private profile, and the shared Space holds only the plans, promises, and details both people approved.'",
            1,
        ),
        (
            "headline: 'One clear view of the company today.'",
            "headline: 'See the company clearly before making today’s decisions'",
            1,
        ),
        (
            "headline: 'Adjust the plan and keep the accountability.'",
            "headline: 'Adjust the plan without losing accountability'",
            1,
        ),
        (
            "summary: 'The data can support coaching. Qualified care still belongs with a professional.'",
            "summary: 'The data can support coaching, but qualified care still belongs with a professional.'",
            1,
        ),
        (
            "headline: 'Everyone needs the same goal, with different access.'",
            "headline: 'Give everyone the same goal and only the access they need'",
            1,
        ),
        (
            "summary: 'Members see the work they need. Project leads keep the wider view and restricted details.'",
            "summary: 'Members see the work they need, and project leads keep the wider view and restricted details.'",
            1,
        ),
        (
            "<div><p class=\"eyebrow\">FAMILIAR LAYOUT, FLEXIBLE CONTENT</p><h2>The full view can change with the information.</h2></div>",
            "<div><p class=\"eyebrow\">FAMILIAR LAYOUT, FLEXIBLE CONTENT</p><h2>The full view adapts to the information available</h2></div>",
            1,
        ),
        (
            "<p class=\"full-lead\">Personal OS checks the approved information, then chooses a clear way to show it. Navigation, privacy controls, and main locations stay familiar. The useful cards, charts, and explanations can change with the day.</p>",
            "<p class=\"full-lead\">Personal OS checks the approved information and chooses a clear way to show it. Navigation, privacy controls, and the main locations stay familiar even when the useful cards, charts, and explanations change with the day.</p>",
            1,
        ),
        (
            "<aside class=\"adaptive-note\"><strong>The layout can adapt and still feel familiar.</strong><p>Controls, sources, and the way back to focused views stay in predictable places.</p></aside>",
            "<aside class=\"adaptive-note\"><strong>The layout can adapt without becoming confusing.</strong><p>Controls, sources, and the path back to focused views stay in predictable places.</p></aside>",
            1,
        ),
        (
            "<div class=\"full-section-heading\"><div><p class=\"eyebrow\">FUTURE APP IDEA</p><h2>Wake up with music and a short overview.</h2></div>",
            "<div class=\"full-section-heading\"><div><p class=\"eyebrow\">FUTURE APP IDEA</p><h2>Start the morning with music and a short overview</h2></div>",
            1,
        ),
        (
            "<p class=\"future-boundary\">This is a concept. Real playback, voice, alarms, and account access need device permissions, provider support, clear controls, and secure sign-in.</p>",
            "<p class=\"future-boundary\">This concept would require device permissions, provider support, clear controls, and secure sign-in for real playback, voice, alarms, and account access.</p>",
            1,
        ),
        (
            "<div><p class=\"eyebrow\">PRIVATE FIRST</p><h2>More information should come with more control.</h2></div>",
            "<div><p class=\"eyebrow\">PRIVATE FIRST</p><h2>More information requires more control</h2></div>",
            1,
        ),
        (
            "<p>Connections have a clear purpose. Memories can be reviewed. Shared Spaces receive only approved records. Important actions need confirmation and stay in the history.</p>",
            "<p>Connections have a clear purpose, memories remain reviewable, shared Spaces receive only approved records, and important actions require confirmation before they are added to the history.</p>",
            1,
        ),
    ],
)

apply_replacements(
    "assets/brief/brief-demo-explainers.js",
    [
        (
            "regular: 'A normal chat usually depends on the current conversation. You may need to explain important background again.'",
            "regular: 'A normal chat usually depends on the current conversation, so important background may need to be explained again.'",
            1,
        ),
        (
            "personal: 'The result becomes useful evidence. The next plan can respond to what was completed, skipped, changed, or learned.'",
            "personal: 'The result becomes useful evidence, allowing the next plan to respond to what was completed, skipped, changed, or learned.'",
            1,
        ),
        (
            "<h2>Memory and Spaces give AI clear limits and useful history.</h2>",
            "<h2>Memory and Spaces give AI useful context without removing clear limits</h2>",
            1,
        ),
        (
            "<p>Important actions stay visible and need confirmation. This demo shows the rules. Real protection belongs behind secure sign-in and server permissions.</p>",
            "<p>Important actions remain visible and require confirmation, while the demo explains the rules and leaves real protection to secure sign-in and server-side permissions.</p>",
            1,
        ),
    ],
)

apply_replacements(
    "assets/brief/brief-demo-media.js",
    [
        (
            "Spotify needs one direct tap on this device. Open the soundtrack and tap play in Spotify.",
            "Spotify needs one direct tap on this device, so open the soundtrack and press play in Spotify.",
            2,
        ),
        (
            "Spotify is still preparing in the background. The Brief remains available.",
            "Spotify is still preparing in the background, but the Brief is ready to use.",
            1,
        ),
        (
            "Spotify is preparing in the background. The Brief opened without waiting.",
            "The Brief opened while Spotify continues preparing in the background.",
            1,
        ),
    ],
)

apply_replacements(
    "doc/index.html",
    [
        (
            "<p>The interface is a working demonstration. The secure multi-user platform remains under development.</p>",
            "<p>The interface is a working demonstration, while the secure multi-user platform remains under development.</p>",
            1,
        ),
        (
            "<p class=\"hero-disclosure\">The current demo uses sourced public information and clearly fictional private-looking examples. Real accounts, secure connectors, durable memory, and server-side permissions are part of the planned platform.</p>",
            "<p class=\"hero-disclosure\">The current demo uses sourced public information and clearly fictional private-looking examples because real accounts, secure connectors, durable memory, and server-side permissions are still part of the planned platform.</p>",
            1,
        ),
        (
            "<p>Most digital tools hold one slice of your life. A calendar knows time. Email knows messages. A task manager knows assignments. An AI chat knows the context placed into that conversation.</p>",
            "<p>Most digital tools understand only one slice of your life: the calendar knows your time, email holds your messages, task managers track assignments, and an AI chat knows only the context placed into that conversation.</p>",
            1,
        ),
        ("<h3>See the few things worth attention now.</h3>", "<h3>See the few things that deserve attention now</h3>", 1),
        ("<h3>Keep contexts separate and coordinate safely.</h3>", "<h3>Keep each context separate while coordinating safely</h3>", 1),
        ("<h3>Preserve useful context without surrendering control.</h3>", "<h3>Keep useful context without giving up control</h3>", 1),
        ("<h3>Connect information to a direction.</h3>", "<h3>Connect information to a clear direction</h3>", 1),
        (
            "<h3>The AI can change. Your operating context stays yours.</h3>",
            "<h3>The AI can change while your operating context remains yours</h3>",
            1,
        ),
        (
            "<h2 id=\"spacesTitle\">Spaces make one system useful between people.</h2>",
            "<h2 id=\"spacesTitle\">Spaces let one system work across different people and contexts</h2>",
            1,
        ),
        (
            "<h2 id=\"memoryTitle\">Memory should be organized, inspectable, and correctable.</h2>",
            "<h2 id=\"memoryTitle\">Memory needs to stay organized, inspectable, and correctable</h2>",
            1,
        ),
        (
            "<h3>The record can change when reality changes.</h3>",
            "<h3>The record should change when reality changes</h3>",
            1,
        ),
        (
            "<h2 id=\"goalsTitle\">Goals turn context into movement.</h2>",
            "<h2 id=\"goalsTitle\">Goals connect the current situation to the next useful action</h2>",
            1,
        ),
        (
            "<h2 id=\"ritualTitle\">A briefing can become part of the morning itself.</h2>",
            "<h2 id=\"ritualTitle\">A briefing can become part of the morning routine</h2>",
            1,
        ),
        (
            "<article><span>04</span><h3>Support human judgment</h3><p>The system can prepare context and options. People remain responsible for the relationship and the decision.</p></article>",
            "<article><span>04</span><h3>Support human judgment</h3><p>The system can prepare context and options, but people remain responsible for the relationship and the decision.</p></article>",
            1,
        ),
        (
            "<p class=\"section-intro\">The model receives the context, tools, and permissions needed for the current task. Personal OS keeps the long-term product state outside the model.</p>",
            "<p class=\"section-intro\">The model receives the context, tools, and permissions needed for the current task, while Personal OS keeps the long-term product state outside the model.</p>",
            1,
        ),
        (
            "<h3>The product narrative is open. Private product data still requires real protection.</h3>",
            "<h3>The product narrative is open, but private product data still requires real protection</h3>",
            1,
        ),
        (
            "<h2 id=\"statusTitle\">A strong demonstration with a clear path to the real platform.</h2>",
            "<h2 id=\"statusTitle\">The current demo shows the product direction and the work still required</h2>",
            1,
        ),
        (
            "<h2 id=\"architectureTitle\">A product layer that remains understandable and controllable.</h2>",
            "<h2 id=\"architectureTitle\">Keep the product architecture understandable and controllable</h2>",
            1,
        ),
        (
            "<h2 id=\"scenariosTitle\">The same foundation can serve very different lives.</h2>",
            "<h2 id=\"scenariosTitle\">The same foundation can support very different people and contexts</h2>",
            1,
        ),
        ("<h3>Start the day with direction.</h3>", "<h3>Start the day knowing what needs attention</h3>", 1),
        (
            "<h3>Coordinate shared life with boundaries.</h3>",
            "<h3>Coordinate shared life without losing private boundaries</h3>",
            1,
        ),
        (
            "<h3>Connect operating reality to decisions.</h3>",
            "<h3>Use the operating picture to make better decisions</h3>",
            1,
        ),
        (
            "<h3>Give each person the context needed to deliver.</h3>",
            "<h3>Give each person the context they need to deliver</h3>",
            1,
        ),
        (
            "<h2 id=\"faqTitle\">What readers usually need clarified</h2>",
            "<h2 id=\"faqTitle\">Common questions about the product</h2>",
            1,
        ),
        (
            "<p>Personal OS is the product layer around AI models. It manages Spaces, permissions, structured memory, sources, goals, tools, approvals, and history. A model provides reasoning and generation within that controlled context.</p>",
            "<p>Personal OS is the product layer around AI models, managing Spaces, permissions, structured memory, sources, goals, tools, approvals, and history while the selected model handles reasoning and generation inside that controlled context.</p>",
            1,
        ),
        (
            "<p>Spaces let one platform support private life and shared coordination without mixing everything together. Each Space defines its members, memory, goals, tools, data, and visibility rules.</p>",
            "<p>Spaces prevent private life and shared coordination from being mixed together by defining the members, memory, goals, tools, data, and visibility rules for each context.</p>",
            1,
        ),
        (
            "<p>That is the intended direction. The operating context remains stable while the user or system selects an appropriate model. Provider changes should not require rebuilding the user’s goals, memory, permissions, and Spaces.</p>",
            "<p>Yes. The operating context is designed to remain stable while the user or system selects an appropriate model, so changing providers does not require rebuilding goals, memory, permissions, or Spaces.</p>",
            1,
        ),
        (
            "<p>No. The public demonstration uses sourced public information and clearly fictional private-looking records. Real private data requires the planned secure backend, authentication, protected storage, and connector permissions.</p>",
            "<p>No. The public demo uses sourced public information and clearly fictional private-looking records because real private data requires authentication, protected storage, a secure backend, and controlled connector permissions.</p>",
            1,
        ),
        (
            "<p>It can organize stated information, expose conflicts, compare schedules, summarize approved positions, track agreements, and suggest practical options. It should not diagnose people, invent motives, take sides, or replace professional judgment.</p>",
            "<p>It can organize stated information, expose conflicts, compare schedules, summarize approved positions, track agreements, and suggest practical options, but it should never diagnose people, invent motives, take sides, or replace professional judgment.</p>",
            1,
        ),
        (
            "<p>The routine can be built from the same approved context that powers the Brief. A selected alarm can begin a user-controlled music and voice experience, then allow spoken check-ins, reminders, and updates without forcing the user through a full dashboard.</p>",
            "<p>The routine uses the same approved context as the Brief, allowing a selected alarm to begin a user-controlled music and voice experience before moving into spoken check-ins, reminders, or updates without forcing the user through a full dashboard.</p>",
            1,
        ),
        (
            "<h2 id=\"finalCtaTitle\">Explore the current Personal OS briefing demonstration.</h2>",
            "<h2 id=\"finalCtaTitle\">Explore the current Personal OS briefing demo</h2>",
            1,
        ),
        (
            "<p>The demo is an active-development preview of the daily experience. Its interface, data structure, connections, Goals, memory, and backend will continue changing as the product moves toward the full system described here.</p>",
            "<p>The demo is an active-development preview of the daily experience, and its interface, data structure, connections, goals, memory, and backend will continue changing as the product moves toward the full system described here.</p>",
            1,
        ),
    ],
)

apply_replacements(
    "docs/README.md",
    [
        (
            "Verified code baseline: `0b6013525b6b7c37a83cd450fe37b74683ac36f1`",
            "Verified code baseline: `aa2991db2e83624de7804e5d1f4255003387c4f4`",
            1,
        ),
        (
            "- The scenario chooser is a labelled group of native buttons using `aria-pressed`; do not restore `role=\"listitem\"` on those buttons.",
            "- The scenario chooser is a labelled listbox of native buttons using `role=\"option\"` and `aria-selected`; do not combine `aria-pressed` with `role=\"listitem\"`.",
            1,
        ),
        (
            "- visible Brief and Doc copy should be plain, direct, and free of generated-sounding filler\n",
            "- visible Brief and Doc copy should be plain, direct, and free of generated-sounding filler\n- vary sentence length and combine related thoughts instead of stacking short declarations that sound generated\n",
            1,
        ),
    ],
)

brief = (ROOT / "brief/index.html").read_bytes()
brief_next = (ROOT / "brief-next/index.html").read_bytes()
if brief != brief_next:
    raise RuntimeError("brief/index.html and brief-next/index.html are no longer byte-for-byte identical")

forbidden = [
    "The layout stays familiar. The people",
    "The Brief is what you see. Personal OS",
    "Goals show direction. Spaces set boundaries.",
    "Public data can be live. Private-looking records",
    "The focused views are faster. This page",
    "Reassurance first. Logistics second.",
    "Indoor training is comfortable. Hydrate",
    "Members see the work they need. Project leads",
    "Important actions stay visible and need confirmation. This demo shows the rules.",
    "Most digital tools hold one slice of your life. A calendar knows time.",
    "The AI can change. Your operating context stays yours.",
    "The product narrative is open. Private product data",
]

combined = "\n".join(
    (ROOT / path).read_text(encoding="utf-8")
    for path in [
        "brief/index.html",
        "assets/brief/brief-demo-data.js",
        "assets/brief/brief-demo-experience.js",
        "assets/brief/brief-demo-explainers.js",
        "assets/brief/brief-demo-media.js",
        "doc/index.html",
    ]
)

remaining = [phrase for phrase in forbidden if phrase in combined]
if remaining:
    raise RuntimeError(f"generated-sounding copy remains: {remaining}")

print("copy rewrite complete; Brief parity preserved")
