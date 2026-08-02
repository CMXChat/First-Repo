window.CMX_NEWS_BRIEF = {
  meta: {
    status: "structure preview",
    date: "August 1, 2026",
    generated: "Adaptive page structure updated August 1, 2026",
    summary: "A flexible daily briefing that leads with what matters most, refreshes current information, and uses light blue for Jay, pink for Crystal and white for shared context.",
    sectionOrder: [
      "priority",
      "opening",
      "weather",
      "activity",
      "crystal",
      "local",
      "culture",
      "style",
      "spotify",
      "world",
      "horoscope",
      "relationship",
      "timeline",
      "quote",
      "questions"
    ]
  },

  priority: [
    {
      audience: "shared",
      priority: 100,
      label: "page upgrade",
      status: "ready",
      title: "The briefing now begins with the one thing worth noticing first",
      text: "This lead area can hold a weather warning, important local development, meaningful personal update or anything else that deserves attention before the regular sections.",
      directLines: [
        {
          audience: "jay",
          text: "Jay-specific guidance can appear in light blue when a direct sentence is genuinely useful."
        },
        {
          audience: "crystal",
          text: "Crystal-specific guidance can appear in pink without turning every paragraph into a color-coded wall."
        }
      ]
    }
  ],

  opening: [
    {
      audience: "shared",
      priority: 90,
      label: "adaptive structure",
      title: "Sections can move, shorten or disappear",
      text: "The daily data can change the section order. Empty sections hide automatically, and quiet news days do not need filler."
    },
    {
      audience: "shared",
      priority: 80,
      label: "editorial rule",
      title: "Useful context comes before volume",
      text: "The daily edition should explain what matters, identify uncertainty and avoid repeating the same advice simply to fill space."
    }
  ],

  activity: [
    {
      audience: "jay",
      priority: 90,
      label: "digital activity",
      status: "self-reported",
      title: "Daily online recap",
      items: [
        "People and communities Jay interacted with",
        "The general purpose and context of meaningful conversations",
        "Online work, browsing, gaming, calls or other activity",
        "Unknown or incomplete details labeled honestly"
      ],
      directLines: [
        {
          audience: "jay",
          text: "The final briefing should be clear and contextual, not written like an interrogation transcript."
        }
      ]
    },
    {
      audience: "shared",
      priority: 75,
      label: "privacy model",
      status: "backend pending",
      title: "Sensitive activity expires after 24 hours",
      text: "The future backend will keep temporary activity outside Git history and automatically remove it after the agreed retention window."
    }
  ],

  crystal: [
    {
      audience: "crystal",
      priority: 90,
      label: "Crystal’s interests",
      title: "Her side of the briefing gets real space",
      text: "This area can prioritize Waikato developments, major crime stories, celebrity coverage, lighter culture, pets, beauty, fashion and anything else Crystal says she cares about.",
      directLines: [
        {
          audience: "crystal",
          text: "Your section should feel selected for you, not like leftovers from Jay’s briefing."
        }
      ]
    },
    {
      audience: "crystal",
      priority: 70,
      label: "future feedback",
      status: "backend pending",
      title: "Corrections and preferences from the page",
      text: "Once the backend exists, Crystal will be able to flag something as incorrect, irrelevant, too detailed or worth following tomorrow."
    }
  ],

  weather: [
    {
      audience: "jay",
      priority: 80,
      label: "Brooklyn, New York",
      title: "Live weather appears here",
      text: "Current conditions, temperature range, rain or severe-weather information and one practical line for the day."
    },
    {
      audience: "crystal",
      priority: 80,
      label: "Waikato, New Zealand",
      title: "Live weather appears here",
      text: "Waikato-wide conditions only, without attempting to reveal or infer a more precise location."
    }
  ],

  style: [
    {
      audience: "crystal",
      priority: 65,
      label: "beauty and fashion",
      title: "One useful style note when there is something worth suggesting",
      text: "This can rotate between weather-aware hair ideas, makeup, nails, jewelry, outfit colors, current trends and celebrity style without becoming repetitive.",
      directLines: [
        {
          audience: "crystal",
          text: "Advice should complement your preferences and never rank, criticize or overanalyze your appearance."
        }
      ]
    }
  ],

  spotify: [
    {
      audience: "jay",
      priority: 70,
      label: "recent listening",
      status: "connected source",
      title: "Spotify recap for Jay",
      text: "When access is available, this can summarize recent listening and link directly to a notable track, artist or playlist."
    },
    {
      audience: "shared",
      priority: 60,
      label: "upbeat pick",
      title: "One positive soundtrack option",
      text: "A bright, upbeat recommendation can appear with a real Spotify link. It remains optional and is not framed as a required couple activity."
    }
  ],

  localNews: [
    {
      audience: "jay",
      priority: 75,
      label: "Brooklyn and New York",
      title: "Useful local developments",
      text: "Only timely stories with a practical or genuinely interesting reason to include them."
    },
    {
      audience: "crystal",
      priority: 85,
      label: "Waikato and New Zealand",
      title: "Crime, safety and major local developments",
      text: "Relevant Waikato coverage should receive more attention, with event dates and sourcing checked before publication."
    }
  ],

  world: [
    {
      audience: "shared",
      priority: 50,
      label: "world desk",
      status: "verified",
      title: "Only major developments",
      text: "Routine political coverage can be skipped. Include international news when it is consequential enough to matter or explain."
    }
  ],

  culture: [
    {
      audience: "crystal",
      priority: 85,
      label: "celebrity and major cases",
      status: "verified",
      title: "Confirmed developments with sources",
      text: "Current celebrity news and major crime or court developments can be summarized clearly and linked to reliable reporting."
    },
    {
      audience: "crystal",
      priority: 70,
      label: "rumor desk",
      status: "unconfirmed",
      title: "Rumors may appear, but never disguised as facts",
      text: "A rumor should identify where it came from, what remains unverified and whether credible reporting supports any part of it."
    }
  ],

  horoscope: [
    {
      audience: "jay",
      priority: 60,
      label: "Virgo · September 15",
      title: "Jay’s reading",
      text: "A short reflective horoscope for entertainment, written separately from Crystal’s.",
      directLines: [
        {
          audience: "jay",
          text: "Your best move today is to make one clear decision and stop reopening it for unnecessary debate."
        }
      ]
    },
    {
      audience: "crystal",
      priority: 60,
      label: "Virgo · September 14",
      title: "Crystal’s reading",
      text: "A distinct Virgo reading shaped around her day and interests.",
      directLines: [
        {
          audience: "crystal",
          text: "Protect your attention today and give your energy only to what feels consistent and real."
        }
      ]
    }
  ],

  relationship: [
    {
      audience: "shared",
      priority: 80,
      label: "daily perspective",
      title: "Advice should fit the actual state of the relationship",
      text: "The briefing will not force an activity, manufacture a conflict or flatten every issue into equal blame. It should identify the clearest point of common ground available that day.",
      directLines: [
        {
          audience: "jay",
          text: "Direct advice for Jay can be plain without becoming accusatory."
        },
        {
          audience: "crystal",
          text: "Crystal’s concern can be advocated for clearly without turning the page into a case against either person."
        }
      ]
    }
  ],

  timeline: [
    {
      audience: "shared",
      priority: 40,
      label: "positive memory lane",
      status: "backend pending",
      title: "Keep the good parts too",
      text: "A future private archive can preserve kind messages, funny moments, meaningful songs and signs of progress. Daily sensitive activity will not enter this permanent timeline automatically."
    }
  ],

  quote: {
    kicker: "today’s line",
    text: "Clarity should lower the temperature, not raise the stakes.",
    source: "Jay + Crystal Daily Brief",
    reflection: "The quote area can include one short line explaining why the thought fits today. Some days it can be serious, some days playful, and some days simply useful."
  },

  questions: [
    "Who did you directly message, and what was each meaningful conversation mainly about?",
    "Which Discord servers, channels, group chats or voice calls did you use?",
    "What else took your online time today?",
    "What did you listen to on Spotify, and was anything repeated?",
    "Did Crystal share a new preference, correction or concern that tomorrow’s briefing should reflect?",
    "Is there one detail you are uncertain about and want labeled as unknown?"
  ]
};
