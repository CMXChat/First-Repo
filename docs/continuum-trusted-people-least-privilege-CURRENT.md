# Continuum Trusted People Least Privilege - CURRENT

Date: 2026-08-19
Status: Owner-approved product/architecture direction. Future capability.

Canonical backend contract:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-TRUSTED-PEOPLE-LEAST-PRIVILEGE-ACCESS-CONTRACT.md`

# Product decision

A trusted relationship never grants broad Continuum access by itself.

Trusted People should receive only the exact purpose, information, capability, resource, time window and continuity-mode scope the owner explicitly authorized.

Examples:

- attest that the owner is okay without seeing private history;
- approve one defined contingency action without receiving unrelated authority;
- receive one selected document/message after a qualifying continuity transition;
- act as a bounded recovery custodian without becoming an ordinary account administrator;
- receive family information without gaining access to business/private AI history;
- serve as executor for selected release/recovery functions without becoming a universal Continuum superuser.

Disclosure, attestation, approval, recovery, state-change authority and ordinary account access remain separate capability classes.

# Future AI / frontend guardrails

- Never design `trusted = full access`.
- Relationship labels such as family, friend, executor or admin do not create permission.
- Afterlife mode does not itself create access.
- Show the owner exactly what each Person can see/do and when.
- Prefer purpose-specific access and minimum necessary disclosure.
- Revocation should stop future use while preserving historical Audit/Why evidence.
- Recovery custodians do not receive raw secrets or automatic access to unrelated content.
- High-impact roles may require stronger identity verification and fresh authentication.
- Do not describe this direction as implemented production access control until protected backend support exists.
