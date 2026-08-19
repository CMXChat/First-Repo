# Continuum Goals & Missions Product Contract - CURRENT

Date: 2026-08-19
Status: Canonical product-facing direction for durable outcome pursuit; future architecture only; no Goal/Mission Runtime exists today

# Purpose

Continuum needs a product concept above ordinary Automations for requests that describe a durable outcome instead of one fixed workflow.

Examples:

- finish a website migration by Friday inside defined constraints;
- help an authorized person pursue a suitable job until an explicit success/stop condition is reached;
- resolve a project blocker while respecting approval and spending rules;
- research a question until a defined evidence standard is satisfied.

The product-facing term is **Goal**. **Mission** may be used for a larger or more consequential Goal without implying a separate execution engine.

# Core distinction

**Automation** answers:

`When these conditions happen, what typed work should run?`

**Goal / Mission** answers:

`What outcome should Continuum keep working toward, what boundaries apply, and how do we know when to stop?`

A Goal may use zero, one or many Automations, AI Tasks, human tasks, Signals, waits, approvals and typed capabilities over its lifetime.

# Canonical Goal loop

Public mental model:

`GOAL → PLAN → ACT → OBSERVE → UPDATE STATE → REPLAN OR CONTINUE → SUCCESS / STOP`

Planner can later prepare or revise the strategy.

Runtime can later carry approved work across time, replies, waits and restarts.

Signals and results can change current Goal State.

Policy and Authority remain outside the model and govern every consequential step.

# Goal definition

A Goal should eventually make these ideas explicit:

- objective;
- success criteria;
- stop/failure criteria;
- hard constraints and prohibitions;
- approval-required actions;
- soft preferences;
- deadline/time horizon;
- budget/resource/attempt limits;
- people/beneficiary/subject scope;
- allowed Knowledge/resources;
- allowed capabilities/Connections;
- applicable policy/authority.

Natural language may express the objective and boundaries, but consequential enforcement uses typed protected fields/policy where the server needs deterministic control.

# Success and stopping

`Until it is done` does not mean run forever.

A Goal must eventually have explicit terminal semantics such as:

- succeeded;
- cancelled;
- deadline reached;
- budget/attempt limit reached;
- hard constraint blocks further work;
- required authority/consent unavailable;
- capability path unavailable;
- terminal failure rule reached.

Blocked, waiting, approval-pending and replanning are non-terminal states when the Goal can still continue.

# Constraints

Goals may contain instructions such as:

- never misrepresent facts;
- do not contact a current employer;
- ask before spending money;
- stay inside approved locations;
- do not expose selected private information;
- require approval before sending something in another person's name.

Public rule:

> **Goal pressure never overrides hard constraints or authority.**

Replanning may change strategy. It may not silently weaken hard constraints, change success criteria or widen permission.

# Acting for another person

A Goal may concern someone other than the Continuum owner.

The product must distinguish:

- who requested the Goal;
- whose data is being used;
- who benefits/is represented;
- who may approve actions;
- what consent/delegated authority exists;
- which case/project/organization scope applies.

A Directory label such as friend, family, employee, client or trusted does not itself authorize use of another person's private data or representation in their name.

# Example

Future example:

```text
GOAL
Help an authorized person pursue a suitable role within 60 days.

SUCCESS
Accepted offer or another explicitly selected terminal criterion.

HARD CONSTRAINTS
Never misrepresent qualifications.
Never contact the current employer.
Stay inside approved locations.
Require approval before anything is sent in the person's name.

PLAN
Understand approved profile
→ identify target roles
→ prepare resume strategy
→ discover opportunities
→ rank matches
→ prepare applications
→ request approvals

RUNTIME LATER
submit only when authorized
→ wait for replies
→ update State
→ prepare interviews/follow-ups
→ replan when evidence says the strategy is weak
→ stop at success/deadline/authority stop
```

This is a future architecture example. It is not a claim that Continuum can execute job applications today.

# `/doc/` direction

The main `/doc/` should teach Goals as one compact idea inside the Automations/Runtime section.

Do not add another top-level Contents section for Goals during the current document phase.

Current public teaching block:

- label: `LATER · GOALS / MISSIONS`;
- headline: `Automations handle rules. Goals let Continuum pursue an outcome.`;
- flow: `GOAL → PLAN → ACT → OBSERVE → REPLAN → SUCCESS / STOP`;
- one concise example showing success, constraints and required approval;
- explicit rule that replanning cannot silently change constraints, success criteria or authority.

The page should remain clear that Goal orchestration is LATER.

# Control Center relationship

The future Control Center should eventually show Goal-level operational truth such as:

- objective and success criteria;
- active plan version;
- current State;
- blockers;
- waiting work;
- next eligible work;
- approval requests;
- recent plan changes;
- time/budget/attempt capacity;
- success evidence;
- pause/cancel/replan controls;
- why a consequential action happened.

# Backend contract

Canonical backend companion:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-GOALS-MISSIONS-ORCHESTRATION-CONTRACT.md`

Also read:

- `CMXChat/jay-app/specs/003-server-checkin/ARCHITECTURE-INDEX.md`;
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-CORE-ARCHITECTURE-CONTRACT.md`;
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-PLANNER-PLATFORM-PLAN.md`;
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AUTOMATIONS-PLATFORM-PLAN.md`;
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-MULTI-USER-ORGANIZATION-SCOPE-CONTRACT.md`;
- `CMXChat/jay-app/specs/003-server-checkin/DELEGATED-AUTHORITY-BACKEND-CONTRACT.md`.

# Current truth

- no Goal/Mission server model exists;
- no GoalPlan/Goal work-item Runtime exists;
- no autonomous replanning exists;
- no Goal provider execution exists;
- current production remains Phase 1;
- validated Phase 2A Library/Automation definition source remains pending production migration/deployment;
- Goals must not be appended to the reviewed Phase 2A migration.

# Product guardrails

- Goal is outcome, not authority;
- Automation remains a reusable typed workflow underneath Goals;
- Planner proposes plans/configuration;
- Runtime later performs approved work;
- Agent remains a later bounded principal, not a synonym for Goal;
- explicit success/stop criteria prevent immortal execution;
- loops/stagnation/attempts require server-owned limits;
- another person's representation requires applicable consent/authority;
- model/provider changes do not change Goal permission;
- every consequential Goal action must remain explainable through State, policy, authority, capability, Runtime and Audit.
