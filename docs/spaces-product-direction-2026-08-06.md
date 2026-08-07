# Spaces Product Direction

Date: **August 6, 2026**  
Repository: `CMXChat/First-Repo`  
Status: Current product doctrine

## Decision

The user-facing product is named **Spaces**.

Avoid positioning it as an AI operating system, Personal OS, Life OS, Agent OS, or Intelligence OS. Those names are becoming broad infrastructure language and do not describe the experience we are building.

Spaces is a context-driven workspace and personal intelligence platform. The product begins with the part of life or work the user is entering.

## Core concept

Every meaningful context can have its own Space, including:

- Personal
- Business
- Family
- Health
- Finance
- Travel
- CMX
- Research
- Relationship
- Startup

A Space can contain documents, conversations, memory, tasks, calendars, people, files, projects, research, decisions, history, goals, and approved connected data.

The user opens the Space and continues. The product should already understand who is involved, what happened, what remains unfinished, which records matter, and where the work is going.

## Product center

Chat is one interface inside Spaces. It is not the product center.

The same context can support:

- Brief
- Documents
- Projects
- Research
- Memory
- Tasks
- Calendar
- Files
- Notes
- Conversations

Every module should use the same Space context and permission boundary.

## Brief

Brief remains a flagship experience. It brings together the current information that affects the next decision or action.

A future Brief may use approved calendar, email, deadlines, tasks, projects, documents, finances, weather, habits, health, people, conversations, and long-term goals. Its job is to help the user decide what deserves attention next.

## Documents

Every document belongs to at least one Space. Documents can connect to people, projects, decisions, meetings, research, memory, tasks, and Briefs. The relationship between records is part of the product.

## Input and learning

A Space can build context from:

- connected accounts with explicit scopes
- uploaded files and imports
- notes and forms
- voice updates
- conversations
- sourced public information
- focused questions from the AI
- direct user corrections

Most setup should happen through simple account connections and clear Space choices. The AI should ask a short question only when the answer could change a decision, permission, deadline, or next action.

## Memory and settings

Memory belongs to the Space. It needs a source, date, type, freshness state, visibility rule, and revision history.

Planned Memory & Data settings should let the user inspect, correct, move, restrict, export, or delete records; remove interpretations; change connector permissions; disconnect accounts; and pause future learning.

## Model independence

The model can change while the Space keeps its context. Models, runtimes, agent frameworks, and orchestration tools are replaceable. The durable advantage is the experience of continuing inside a Space without re-explaining everything.

## Cloudflare

Cloudflare’s Agents SDK is developer infrastructure for durable identity, local SQL state, real-time connections, scheduled work, recoverable execution, tools, and human approval patterns. Spaces is the user-facing experience for context, continuity, memory, and action.

Cloudflare could power part of the backend. A future ChatGPT app or plugin could provide an optional distribution surface into the same governed backend. Spaces retains the product experience, schemas, context graph, permission model, and trust relationship.

Reference: https://developers.cloudflare.com/agents/

## Market, protection, and capitalization

The market is established in parts. Current products validate AI workspaces, scheduling, team coordination, family organization, finance visibility, connected tools, and agent infrastructure. The reviewed official product set does not show the full Spaces combination, but that review is not a global market search, patent search, or freedom to operate opinion.

Patentability remains an open question. A broad claim to an AI workspace or life assistant is unlikely to be enough. Counsel would need to identify a novel, nonobvious, eligible technical implementation. Candidate areas for review include permission scoped context, provenance and freshness, private and shared derivation, user revision history, personalized ranking, and approval controls across Spaces.

The public demo makes timing important. Record inventors, diagrams, prototypes, technical decisions, and public disclosure dates now. Use the USPTO Patent Public Search and qualified patent counsel for prior art and claim analysis. If counsel recommends a provisional application, it needs enough technical detail to support the later claims and normally must be followed by a related nonprovisional application within 12 months.

Use layered protection. Keep internal ranking, evaluation, and connector methods confidential with reasonable access controls. Clear the final brand before seeking trademark registration. Preserve human authorship records for code, copy, and original visual work.

The recommended first paid wedge is remote business partners and small teams. This audience has an identifiable buyer, frequent shared decisions, connected work data, and less regulated risk than beginning with financial advice or money movement. Prove one secure shared Space, one reliable Brief, direct corrections, scoped connections, permissions, and approved actions. Measure activation, weekly return, Brief to action rate, shared invitations, correction use, permission comprehension, and paid retention before expanding to household and professional client plans.

Official starting points:

- https://www.uspto.gov/patents/search/patent-public-search
- https://www.uspto.gov/patents/laws/examination-policy/subject-matter-eligibility
- https://www.uspto.gov/patents/basics/apply/provisional-application
- https://www.uspto.gov/sites/default/files/documents/tradesecretsiptoolkit.pdf
- https://www.uspto.gov/trademarks/basics
- https://www.copyright.gov/what-is-copyright/

## Product test

Every feature should improve at least one of these:

- the intelligence of a Space
- the quality of its context
- continuity over time
- the user’s ability to take useful action

A feature that does none of these should be reconsidered.

## Product doctrine

The goal is to build software that wakes up with the user, understands the current state of the important parts of life, and helps each part move forward naturally.

The experience should feel like opening the current state of a Space, not starting over with an AI.
