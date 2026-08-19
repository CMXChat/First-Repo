# Continuum Continuity Health - CURRENT

Date: 2026-08-19
Status: Owner-approved product/architecture direction. Future capability. Does not imply production continuity health checks exist today.

Canonical backend contract:

`CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-CONTINUITY-READINESS-AND-HEALTH-CHECK-CONTRACT.md`

Read with:

- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-DISASTER-SURVIVABILITY-AND-RECOVERY-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AI-INDEPENDENT-CONTINUITY-EXECUTION-CONTRACT.md`
- `CMXChat/jay-app/specs/003-server-checkin/CONTINUUM-AVAILABILITY-AND-CONTINUITY-MODES-CONTRACT.md`

# Product decision

Continuum should periodically prove that a continuity plan still works instead of assuming that old configuration is still usable.

Potential checks include:

- critical Content/File versions still exist and pass integrity checks;
- critical Automations and policies still resolve to supported typed capabilities;
- essential actions still have a deterministic no-AI path;
- required People/Groups and recipient channels still resolve;
- provider Connections/scopes are still usable;
- fallback channels are still available where configured;
- recovery package/backup evidence is current;
- last required restore drill/simulation succeeded;
- Afterlife/contingency conditions remain internally valid;
- no provider/API/capability change silently broke a critical path.

# Safety rule

Default health checks have zero real consequential side effects.

They may use read-only checks, checksum/integrity validation, fake/sandbox providers, simulation and isolated restore drills. They do not send real messages, release real files or activate continuity modes just to prove readiness.

A deliberate live drill, if supported later, is a separate explicitly authorized test operation with controlled test destinations and clear labeling.

# Readiness UX direction

Friendly product states may include:

`HEALTHY · ATTENTION · DEGRADED · BLOCKED · UNKNOWN`

`UNKNOWN` must remain visibly unknown. It should never be painted green because Continuum lacks evidence.

Readiness evidence ages. A major policy, Automation, Connection, content, provider-adapter or recovery change should invalidate the specific old proof that depended on the previous version.

Healthy checks can normally stay quiet in Control Center/history/briefings. Important degradation should surface through the accepted proactive-awareness urgency model.

# Future AI / developer guardrails

- do not use real provider side effects as the default health test;
- do not keep an old green readiness state after a dependency materially changed;
- do not let AI-generated prose become readiness truth;
- do not require an LLM to prove an owner-marked deterministic essential action;
- do not claim a backup is recoverable solely because backup creation succeeded;
- do not claim a Connection is usable solely because credentials exist;
- preserve evidence and authoritative time for material health claims;
- never describe this document as proof that production health checking or restore drills are implemented today.
