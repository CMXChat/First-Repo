# Continuum Trusted Role Onboarding - CURRENT

Date: 2026-08-19
Status: Owner-approved product/architecture direction. Future capability. Does not imply trusted-role onboarding or Goal Runtime exists today.

Canonical backend contract:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-TRUSTED-ROLE-ACCEPTANCE-AND-ONBOARDING-CONTRACT.md`

Read with:

- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-TRUSTED-PEOPLE-LEAST-PRIVILEGE-ACCESS-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-GOALS-MISSIONS-ORCHESTRATION-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-CONTINUITY-READINESS-AND-HEALTH-CHECK-CONTRACT.md`

# Product decision

When Continuum materially depends on another Person, the product goal is reliable accepted role coverage, not forcing that Person to create a normal Continuum account.

Example direction:

```text
Goal:
Secure one verified contingency approver before the configured deadline.

Plan:
Invite approved candidate
→ wait
→ respectful follow-up
→ alternate approved channel if allowed
→ ask owner to intervene when useful
→ replan to backup candidate if needed
→ stop at decline/attempt/deadline limits

Success:
Exact role version accepted + required identity/channel verification complete.
```

# Account direction

Trusted-role participation should use a narrow role-scoped external principal and a small secure role portal where possible.

A Person may be able to accept through a protected link, prove control of an approved email/phone, see the exact role/responsibilities, accept or decline, and later perform only the specific approval/attestation/recovery operation they were granted.

They do not automatically receive a general Continuum account, Library access, AI history, unrelated Directory information, credentials or other continuity plans.

Stronger roles may require stronger authentication without turning that Person into a broad account user.

# Persuasion / follow-up direction

Continuum may improve acceptance by:

- clearly explaining why the Person was chosen;
- showing exactly what the role allows and does not allow;
- keeping the request simple;
- answering common questions;
- using owner-approved personalized wording;
- sending bounded respectful reminders;
- trying an alternate approved channel;
- asking the owner to make a personal follow-up;
- moving to an approved backup candidate when the first path fails.

The system must stop on explicit decline, obey cadence/attempt/quiet-hour limits, avoid deceptive urgency, and avoid harassment or coercive pressure.

# Role categories

Advance acceptance is generally unnecessary for passive recipients, recommended for helpful optional participants, required for roles the continuity plan materially depends on, and required with stronger identity assurance for security-sensitive recovery/custodian roles.

# Future AI / developer guardrails

- optimize for reliable role coverage, not account creation;
- do not mark nomination, delivery, link-open or silence as acceptance;
- do not force a full Continuum account when a narrow role principal is sufficient;
- do not expose unrelated owner information during recruitment;
- allow Goal replanning toward approved backups;
- enforce outreach limits outside the model;
- keep acceptance, account membership, disclosure and authority as separate concepts;
- do not claim this flow is live until protected backend/Runtime support exists.
