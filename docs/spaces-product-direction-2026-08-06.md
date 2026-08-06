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

Cloudflare OS is developer infrastructure for agents, runtimes, sandboxes, tools, and orchestration. Spaces is the user-facing experience for context, continuity, memory, and action.

Cloudflare could power part of the backend in the future without becoming the product itself.

Reference: https://os.cloudflare.app/

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
