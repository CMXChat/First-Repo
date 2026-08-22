# Continuum AI Continuity / Durable Identity - CURRENT

Date: 2026-08-21
Status: Product-facing direction for `/doc/`. Future capability only. No durable identity backend is live today.

Read with:

- `continuum-doc-positioning-CURRENT.md`
- `continuum-product-CURRENT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-DURABLE-IDENTITY-AND-PERSONA-FRAMEWORK-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-IDENTITY-PORTABILITY-IMPORT-AND-MODEL-COMPATIBILITY-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-IDENTITY-DECISION-INFLUENCE-REFLECTION-AND-DRIFT-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-IDENTITY-PARTICIPATION-AND-AI-INFLUENCE-POLICY-CONTRACT.md`

## Product idea

Continuum is already positioned as the durable private layer around changing AI models and tools.

A natural extension is **AI continuity**: keeping a configured AI identity and way of working recognizable even when the underlying model or context window changes.

Instead of treating a personality as one giant prompt that disappears when a model changes, Continuum can later preserve a versioned identity containing things such as:

- principles;
- communication character;
- stable behavioral preferences;
- selected long-term memories;
- learned ways of working;
- role and evaluation history.

A compatible model can then load that identity in a new context rather than starting from zero.

## What durable means

Durable means the canonical identity belongs to Continuum's protected records, not to one provider's hidden model state.

The model can change without forcing the identity to be recreated from scratch.

The goal is recognizable continuity across time, not identical wording from every model.

## What identity can affect

A durable identity can later shape:

- communication style;
- how uncertainty is expressed;
- how alternatives are explored;
- which relevant memories receive attention;
- preferences for reversible or cautious strategies;
- how recommendations are structured;
- how the system collaborates with the owner.

That makes identity more meaningful than a cosmetic voice preset.

## What identity cannot become

Identity remains separate from:

- world facts and Current State;
- AI/Identity participation policy;
- permissions and Authority;
- provider/tool capability;
- current explicit owner instructions;
- hard Goal constraints;
- security policy.

A confident or independent personality does not gain more involvement or permission because of its personality.

The protected backend still decides what is actually allowed.

## Participation is separately configurable

A configured identity may exist without being allowed to influence every part of Continuum.

Future protected settings may allow the owner to say, for example:

- AI off for a selected Automation or step;
- writing only;
- recommendations allowed but no operational influence;
- AI only in explicitly added AI Tasks;
- an identity may plan a workflow but not participate in payment/recipient decisions.

This is separate from execution authority.

## Identity versus role

One durable identity should be able to take on several roles without becoming several unrelated personalities.

For example, the same identity might work as a strategic collaborator, researcher or continuity coordinator.

The role changes how the identity applies itself to the current job. It does not silently rewrite the underlying identity.

## Model portability

The public product promise should remain precise:

> You can change the AI without forcing a configured durable identity to start over.

Different models may express the same identity somewhat differently. Continuum should test compatibility and preserve the exact identity/model versions used when the distinction matters.

## Learning, outcomes and operational awareness

The public story can mention two grounded consequences of the broader backend direction without turning `/doc/` into a cognition architecture page.

Later, Continuum can:

- learn from corrections and real outcomes so recommendations improve over time;
- keep track of what changed, what it is responsible for, what it is waiting on and what needs attention next.

These ideas should be phrased as practical continuity/learning behavior, not as consciousness or self-awareness claims.

## Learning and drift

A future durable identity should be able to evolve through reviewable learning while remaining recognizable.

Useful changes may come from:

- direct owner edits;
- repeated corrections;
- outcome history;
- identity-development sessions;
- model compatibility testing.

Continuum should also be able to detect material drift after model, adapter or memory-selection changes instead of assuming every provider expresses the identity equally well.

## No sentience claim

Persistent identity architecture can make an AI feel far more continuous and coherent over years.

That is the intended product effect.

Public copy should describe this as AI continuity / durable versioned identity rather than evidence that the software is conscious.

## `/doc/` placement

The AI continuity explanation belongs in **AI + Permissions** because it answers a question already introduced by the page:

`What survives when the AI model changes?`

The visible copy should remain concise:

- identify the capability as **LATER**;
- explain that principles, communication character, selected memories and learned ways of working can persist;
- say that a compatible model can load that identity in a new context;
- briefly say that Continuum can later learn from corrections/outcomes and keep track of waiting/attention;
- immediately restate that identity can shape judgment and communication but cannot create facts, AI participation, permissions or authority.

Do not put private project-history examples into the public product page.

Do not lead with internal architecture terms such as Living Intelligence, Evolution Engine, self-aware AI or recursive self-improvement.

## Current implementation

The `/doc/` presentation layer is:

- `assets/continuum-doc-durable-identity.js`;
- `assets/continuum-doc-durable-identity.css`.

It is loaded after the final natural-voice layer through `assets/continuum-doc-i18n.js` so the addition remains explicit and does not disturb the current hero or one-minute explanation.

Current markers:

```text
data-continuum-durable-identity="ready"
data-continuum-identity-portability="model-agnostic-v1"
data-continuum-ai-continuity="grounded-v2"
```

## Boundary

This document and `/doc/` copy do not claim that Continuum currently has:

- a live IdentityProfile service;
- automatic identity loading across model providers;
- protected Identity/AI participation policy;
- persistent persona learning;
- external personality imports;
- a model compatibility evaluator;
- portable identity export;
- identity-driven autonomous execution;
- a live System/Self Model or learning engine.

Those remain backend work described in `jay-app`.