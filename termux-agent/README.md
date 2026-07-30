# CMX Termux Agent

Outbound-only agent scaffold for a future private CMX relay. It does not expose an SSH server or arbitrary command endpoint.

## Current state

The web console reports `DISCONNECTED` because no relay has been deployed or paired. These files prepare the phone-side agent only.

## Allowed actions

- `health`
- `system_info`
- `disk_usage`
- `dns_lookup`
- `list_files` within `CMX_ALLOWED_ROOT`
- `hash_file` within `CMX_ALLOWED_ROOT`
- `git_status` within `CMX_REPO_ROOT`
- `git_log` within `CMX_REPO_ROOT`
- `git_pull --ff-only`, disabled unless `CMX_ALLOW_GIT_PULL=1`

There is no arbitrary `exec`, shell, package-install, file-delete, or unrestricted subprocess action.

## Install in Termux

```bash
pkg update
pkg install git

git clone https://github.com/CMXChat/First-Repo.git
cd First-Repo/termux-agent
bash install.sh
```

Place the environment values in a private file outside the repository, source it, then run:

```bash
python agent.py --self-test
python agent.py
```

Use a long random token. The relay URL must use `wss://`. Do not place the token in browser JavaScript or commit it to GitHub.

## Connection model

```text
db.cmxchat.com
    -> private HTTPS relay
    -> authenticated job queue
    -> outbound WSS connection from Termux
```

The relay must authenticate the operator, authenticate the agent, enforce per-action permissions, rate-limit jobs, and retain structured audit logs. Until that relay exists, the agent remains intentionally disconnected.
