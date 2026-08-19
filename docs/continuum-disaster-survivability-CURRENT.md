# Continuum Disaster Survivability - CURRENT

Date: 2026-08-19
Status: Owner-approved product/architecture direction. Future capability. Does not imply production disaster recovery exists today.

Canonical backend contract:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-DISASTER-SURVIVABILITY-AND-RECOVERY-CONTRACT.md`

Read with:

- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-INDEPENDENT-CONTINUITY-EXECUTION-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AVAILABILITY-AND-CONTINUITY-MODES-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CHECKIN-OPERATIONS-RELIABILITY-CONTRACT.md`

# Product decision

Continuum is intended to survive more than an AI outage.

Long-term direction:

```text
AI unavailable
→ deterministic essential continuity path can still work

worker/process dies
→ durable Runtime can recover/reclaim work safely

application/server dies
→ another instance can recover from durable state

database/storage fails
→ tested restore path can reconstruct authoritative state

primary infrastructure/provider fails
→ continuity-critical recovery data has an independent recovery path
```

This does not mean building expensive multi-cloud infrastructure immediately. Reliability maturity should grow with real protected Runtime and continuity capability.

# Continuity-critical data direction

The strongest recovery treatment belongs to the minimum canonical set required to reconstruct continuity behavior and historical proof, including published policies/authority, critical Automation definitions, referenced immutable content/files, essential Directory references, continuity State, open critical Runtime state, idempotency/provider-attempt records and consequential Audit/Why provenance.

Derived caches, previews, indexes and embeddings should remain rebuildable when practical.

# Recovery package direction

Continuum should eventually support an encrypted, versioned, integrity-verifiable continuity recovery package for selected continuity-critical artifacts.

The package must not become a plaintext secret dump or a universal skeleton key.

Restoring the package does not activate CONTINGENCY or AFTERLIFE and does not create execution authority.

# Future AI / developer guardrails

When touching Continuum continuity/reliability work:

- do not design continuity-critical truth as browser-only/localStorage/in-memory state;
- do not make an LLM required for an owner-marked deterministic essential step;
- do not assume a database provider backup alone equals disaster survivability;
- do not place raw provider secrets in recovery packages, ordinary backups, Audit or AI prompts;
- do not let restoration automatically activate fallback/Afterlife authority;
- do not replay an external action because restored local state is uncertain;
- preserve idempotency and provider-attempt provenance across recovery;
- treat emergency recovery as its own protected capability/authority path;
- keep recovery infrastructure proportional to proven product consequence and current maturity;
- never claim backup/failover/RPO/RTO/DR as live until the deployed recovery path has actually been tested.

# Current truth

This is architecture direction.

Current production/Lab status remains governed by the newest Check In/Continuum handoffs and backend release records. Do not describe this document as proof that disaster recovery, cross-provider failover, emergency custodian recovery or portable Afterlife packages are implemented today.
