# Personalized Daily Intelligence Product Vision

Status: canonical product vision
Recorded: August 2, 2026
Originator and product owner: Jay / CMX
Current proof of concept: `https://db.cmxchat.com/news/`
Reference prototype: the personalized Debbie briefing experience

## The simplest explanation

This product is a private, personalized daily intelligence experience for individuals, couples, families, founders, businesses and teams.

Each person or shared group opens a beautiful private portal that already understands what matters to them. It can combine current research, personal updates, goals, schedules, weather, music, memories, habits, work, relationships and connected services into one clear daily experience. It should feel smooth, alive and useful, not like a dashboard full of disconnected widgets.

The product learns through explicit likes, dislikes, corrections, saved items, repeated choices and authorized connector data. Over time it builds a user-controlled memory and preference database so each briefing becomes more accurate, personal and actionable.

The current Jay + Crystal `/news` page is the first real proof of the idea. The Debbie page demonstrated that the same architecture can be adapted for another person with different interests, location, tone, media, tools and learning goals.

## Core product idea

The product is more than a news page. It is a daily personal operating layer.

It should help a person or group answer:

- What matters today?
- What changed since yesterday?
- What should I pay attention to?
- What do I need to do next?
- What would improve my mood, health, work, relationship or routine?
- What has the system learned about my preferences?
- What information should be remembered, corrected, saved or forgotten?
- What connected service can help complete the next action?

The experience can serve several modes without becoming separate products:

### Personal mode

A private briefing for one person covering priorities, schedule, weather, news, habits, health, learning, music, finances, projects, journaling and personal goals.

### Couple mode

A shared space with individual and shared sections, separate permissions, relationship rituals, plans, music, memories, questions, travel, finances, shared goals and careful boundaries around private information.

### Family mode

A household briefing covering calendars, school, meals, reminders, weather, activities, family memories, appointments, chores and age-appropriate sections.

### Business and team mode

A daily operating brief for founders, agencies, departments or small teams covering priorities, deadlines, meetings, clients, project movement, risks, metrics, decisions, research, communications and follow-up actions.

## The experience

The product should feel closer to a private daily ritual than conventional business software.

A strong flow looks like this:

1. The user opens a private portal.
2. The login screen shows a fixed welcome and a short daily mood or theme.
3. Access is verified securely.
4. The daily song may begin after the user interaction, with a simple Play music or Pause music control.
5. The page greets the user using the correct local time, date and context.
6. The most important items appear first.
7. Every section contains fresh research, current permitted personal input or a useful action.
8. The user can listen to the briefing with voice playback.
9. The user can like, dislike, save, correct, hide, expand, ask about or act on each item.
10. The product learns from those choices and improves the next edition.
11. Important items can become reminders, alarms, calendar events, tasks, diary entries, goals or connector actions.

The interface should remain mobile-first, fast, elegant, emotionally aware, accessible and easy to scan. Motion and media should support the experience without making it noisy.

## Daily content engine

Each edition can combine several content classes:

- Personal priorities and recent updates
- Shared or team priorities
- Weather and useful timing ideas
- Calendar and deadlines
- Email, communication and follow-up summaries
- Local, world, business, crime, culture and entertainment research
- Music and video
- Fitness, workouts, movement and recovery
- Habits and streaks
- Learning and skill development
- Relationship or team-health checkpoints
- Finances and operational metrics when authorized
- Saved memories and anniversaries
- Diary prompts and reflections
- Questions that improve tomorrow's edition

Not every section must appear every day. A section should appear only when it has strong current material, permitted personal input or a meaningful action.

## The learning loop

The product should learn in a transparent, user-controlled way.

### Explicit feedback

Every useful card or section may support:

- Like
- Dislike
- More like this
- Less like this
- Save
- Hide
- Correct this
- Remember this
- Forget this
- Ask me again later
- Turn this into a task
- Add to calendar
- Add to diary

### Preference learning

The platform can learn patterns such as:

- Topics the user values
- Topics the user avoids
- Preferred tone and length
- Best delivery time
- Music preferences
- Useful sections
- Repeated goals
- Exercise preferences
- Work priorities
- Relationship or household routines
- Preferred sources
- Notification tolerance
- Whether the user prefers text, audio or both

The product must not silently convert weak behavioral clues into permanent truths. Important preferences should be visible, editable and confirmable.

### Memory layers

The platform should separate memory into clear layers:

1. Session context: what matters during the current interaction.
2. Daily context: updates relevant to the current edition.
3. Short-term memory: active plans, current goals and recent events.
4. Long-term profile: stable preferences, identities, routines and relationships.
5. Shared memory: information explicitly approved for a couple, family or team space.
6. Source records: the original authorized data behind a claim.
7. Derived insights: patterns or inferences clearly labeled as interpretation.

Users should be able to inspect, edit, export and delete stored memory.

## Core database model

The backend should eventually maintain structured records for:

- Users
- Organizations, households and shared spaces
- Memberships and roles
- Profiles
- Preferences
- Permissions and consent
- Memories
- Goals
- Habits and workouts
- Diary entries
- Tasks and reminders
- Calendar events
- Connector accounts
- Connector sync history
- Daily editions
- Content cards
- Sources and citations
- Likes, dislikes and feedback
- Saved items and bookmarks
- Corrections
- Notifications and alarms
- Voice settings
- Audit logs

A relational database such as PostgreSQL should hold the durable product state. Vector search or retrieval can support memory and research, but it should not replace structured records for permissions, dates, tasks, identities or critical facts.

## Connectors

The product should use a permission-based connector system. Every connector must show what it can read, what it can write and when it last synchronized.

Useful connector categories include:

### Time and planning

- Google Calendar
- Tasks and reminders
- Alarm and notification services
- Scheduling tools

### Communication

- Gmail
- Slack
- Discord
- Team communication platforms

### Work and projects

- Google Drive, Docs, Sheets and Slides
- GitHub
- ClickUp
- CRMs
- Project-management systems

### Music and media

- Spotify
- Apple Music or other supported media services
- YouTube for selected videos

### Health and movement

- Workout applications
- Step, run and activity services
- User-entered gym and bodyweight logs
- Recovery and sleep data only with clear consent

### Personal knowledge and diary

- Notes applications
- Journals
- Saved links
- Voice notes
- Photos or documents approved by the user

### Business and finance

- Business metrics
- Analytics
- Invoices and revenue systems
- Personal finance only through explicit, secure authorization

### Public information

- Weather
- News
- Local alerts
- Transit
- Events
- Markets
- Research sources

The connector layer should be modular so new services can be added without rebuilding the whole product.

## Actions, alarms and automation

The briefing should not only describe the day. It should help shape it.

A user should be able to turn an item into:

- A reminder
- An alarm
- A calendar event
- A task
- A recurring habit
- A workout
- A diary entry
- A saved memory
- A shared couple or team action
- A connector workflow
- A follow-up question for tomorrow

Examples:

- Wake me with the briefing and begin the daily song after I confirm access.
- Read the briefing aloud while I get ready.
- Add the recommended run window to my calendar.
- Remind me to follow up on an email after lunch.
- Save this relationship agreement to our shared memory.
- Turn this client risk into a ClickUp task.
- Add today's workout results to my fitness history.
- Ask me tonight whether the priority was completed.

## Voice and accessibility

Voice should be a first-class product feature.

The platform should support:

- Read the full briefing aloud
- Read one section or card
- Skip, pause and resume
- Choose a voice and speaking speed
- Audio-first daily mode
- Screen-reader-friendly structure
- Captions and transcripts
- Reduced-motion mode
- High contrast and scalable text
- Simple spoken commands when supported

The user should be able to listen while driving, exercising, getting ready or working without needing to stare at the screen.

## Diary and personal history

The product can become a living diary without forcing the user to write long entries.

It can preserve:

- Daily summaries
- User corrections
- Photos or notes
- Mood words chosen by the user
- Important conversations summarized with permission
- Wins, misses and lessons
- Workouts
- Music of the day
- Places and events
- Shared memories
- Decisions and promises
- Questions for the future

The diary should distinguish between factual records, self-reports, AI summaries and AI interpretations.

Over time the user can ask:

- What was I focused on last month?
- When did this goal begin?
- What patterns keep repeating?
- What music helped during productive weeks?
- What did we agree to as a couple?
- Which clients or projects consumed the most attention?
- How has my training changed?

## AI role

AI acts as researcher, editor, organizer, explainer, memory assistant and action layer.

It should:

- Research current public information
- Summarize authorized connected data
- Rank what matters
- Personalize tone and structure
- Explain technical or complex topics plainly
- Detect possible patterns without presenting inference as fact
- Ask useful questions
- Suggest actions
- Draft reminders, tasks and diary entries
- Maintain citations and data provenance
- Respect permissions and privacy boundaries

The initial product should rely on structured profiles, retrieval, rules and feedback before considering custom model training. Fine-tuning may later improve tone or specialized behavior, but it should not be the default method for storing personal facts.

## Privacy, trust and control

Trust is a core product feature.

The platform should include:

- Real server-side authentication
- Individual and shared permissions
- Connector scopes
- Encryption in transit and at rest
- Clear source labels
- Last-synced timestamps
- Edit, forget, export and delete controls
- Audit logs for sensitive actions
- No hidden data sharing between people
- No private information committed to a public repository
- No silent permanent profile changes
- No claim that AI inference is confirmed fact
- Separate private and shared memories for couples, families and teams

A browser password gate is only a prototype convenience. The production product requires a private backend and proper authentication.

## Technical direction

The existing db.cmxchat.com direction remains appropriate:

- GitHub as source of truth
- Dockerized FastAPI backend on Linux
- PostgreSQL for durable user and product data
- Redis for caching, sessions and scheduled work
- Background jobs for research, connector sync and daily generation
- A structured API layer
- Server-rendered or component-based frontend
- Cloudflare Access, Tunnel, WAF and rate limits where appropriate
- Staging before production approval
- Environment variables or a secret manager
- Logging, monitoring, backups and restart policies
- A modular connector framework
- A research and retrieval layer with citations
- Text-to-speech and notification services

The current static JavaScript daily files are valuable prototypes. They prove the experience and publishing workflow, but the product should gradually move private user data, preferences, memories and connector results into the backend.

## Product roadmap

### Phase 1: Daily experience

- Private personalized portal
- Strong daily content flow
- Music, weather, research, questions and voice playback
- Personal, couple and business templates
- Manual and scheduled publishing

### Phase 2: Accounts and learning

- Real authentication
- User profiles
- Likes, dislikes, saves and corrections
- Preference database
- Memory controls
- Daily history

### Phase 3: Connectors and actions

- Calendar, Gmail, Drive, Spotify, tasks and project tools
- Connector permission center
- Add to calendar, task, reminder and diary actions
- Notification and alarm delivery

### Phase 4: Health, diary and routines

- Workout and movement tracking
- Habit loops
- Diary timeline
- Voice notes
- Personal pattern reports

### Phase 5: Multi-tenant product

- Individual subscriptions
- Couple and family spaces
- Business and team workspaces
- Admin controls
- Template marketplace or industry configurations
- Billing, onboarding and support

## What has already been proven

The project has already demonstrated important parts of the product:

- A private portal experience
- Personalized daily editions
- Separate Jay, Crystal and shared content
- Adaptation to another person through the Debbie reference experience
- Local time and weather for different countries
- Daily researched media and culture sections
- Rotating daily songs
- Post-login autoplay with browser-compatible controls
- Daily mood copy
- Voice-friendly content direction
- Scheduled generation and GitHub publishing
- Source and legal-status rules
- Feedback questions for the next edition
- A reusable personalized-briefing blueprint

This means the idea is beyond a vague concept. It has a working experience, reusable design rules, an editorial engine and a clear backend direction.

## Canonical project explanation

Jay is building a personalized daily intelligence platform that turns a private briefing into a continuously learning personal or shared operating system. It combines researched public information, authorized personal data, memories, preferences, music, weather, schedules, goals and connected tools into one smooth daily experience. Users can listen, react, save, correct and act on what they see. Those interactions build a transparent, user-controlled profile and memory database that improves future editions. The same system can serve an individual, a couple, a family, a founder or a business team, with separate permissions and content tailored to each person and shared space.

## Decision rule for future work

Future features should strengthen at least one of these outcomes:

- Better daily orientation
- Better personalization
- Better memory
- Better action completion
- Better connection between tools
- Better shared understanding
- Better user control and trust
- A smoother, more enjoyable daily ritual

A feature that adds complexity without improving one of these outcomes should not be prioritized.
