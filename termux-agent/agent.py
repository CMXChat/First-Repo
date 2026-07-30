#!/usr/bin/env python3
"""CMX Termux agent.

Outbound-only WebSocket client with a strict action allowlist.
It intentionally provides no arbitrary shell or command execution endpoint.
"""

from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import os
import platform
import shutil
import socket
import subprocess
import sys
import time
from pathlib import Path
from typing import Any, Awaitable, Callable

import websockets

VERSION = "0.1.0"
MAX_FILE_BYTES = 256 * 1024 * 1024
MAX_LIST_ENTRIES = 200


class AgentError(RuntimeError):
    pass


def env_required(name: str) -> str:
    value = os.getenv(name, "").strip()
    if not value:
        raise AgentError(f"Missing required environment variable: {name}")
    return value


def allowed_root() -> Path:
    return Path(os.getenv("CMX_ALLOWED_ROOT", str(Path.home()))).expanduser().resolve()


def repo_root() -> Path:
    configured = os.getenv("CMX_REPO_ROOT", "").strip()
    if not configured:
        raise AgentError("CMX_REPO_ROOT is not configured")
    root = Path(configured).expanduser().resolve()
    if not root.is_dir():
        raise AgentError("CMX_REPO_ROOT is not a directory")
    return root


def safe_path(raw: str) -> Path:
    root = allowed_root()
    candidate = (root / raw).expanduser().resolve() if not Path(raw).is_absolute() else Path(raw).expanduser().resolve()
    try:
        candidate.relative_to(root)
    except ValueError as exc:
        raise AgentError("Path is outside CMX_ALLOWED_ROOT") from exc
    return candidate


def read_uptime() -> float | None:
    try:
        return float(Path("/proc/uptime").read_text(encoding="utf-8").split()[0])
    except (OSError, ValueError, IndexError):
        return None


def fixed_git(args: list[str]) -> dict[str, Any]:
    result = subprocess.run(
        ["git", *args],
        cwd=repo_root(),
        text=True,
        capture_output=True,
        timeout=45,
        check=False,
    )
    return {
        "returncode": result.returncode,
        "stdout": result.stdout[-50_000:],
        "stderr": result.stderr[-20_000:],
    }


async def action_health(_: dict[str, Any]) -> dict[str, Any]:
    return {"status": "ok", "version": VERSION, "time": time.time()}


async def action_system_info(_: dict[str, Any]) -> dict[str, Any]:
    return {
        "agent_version": VERSION,
        "hostname": socket.gethostname(),
        "platform": platform.platform(),
        "python": sys.version.split()[0],
        "machine": platform.machine(),
        "home": str(Path.home()),
        "allowed_root": str(allowed_root()),
        "uptime_seconds": read_uptime(),
    }


async def action_disk_usage(args: dict[str, Any]) -> dict[str, Any]:
    path = safe_path(str(args.get("path", ".")))
    usage = shutil.disk_usage(path)
    return {
        "path": str(path),
        "total": usage.total,
        "used": usage.used,
        "free": usage.free,
    }


async def action_dns_lookup(args: dict[str, Any]) -> dict[str, Any]:
    host = str(args.get("host", "")).strip().rstrip(".")
    if not host or len(host) > 253:
        raise AgentError("A valid host is required")
    records = await asyncio.to_thread(socket.getaddrinfo, host, None, 0, socket.SOCK_STREAM)
    addresses = sorted({item[4][0] for item in records})
    return {"host": host, "addresses": addresses}


async def action_list_files(args: dict[str, Any]) -> dict[str, Any]:
    path = safe_path(str(args.get("path", ".")))
    if not path.is_dir():
        raise AgentError("Requested path is not a directory")
    entries = []
    for item in sorted(path.iterdir(), key=lambda entry: (not entry.is_dir(), entry.name.lower()))[:MAX_LIST_ENTRIES]:
        stat = item.stat()
        entries.append({
            "name": item.name,
            "type": "directory" if item.is_dir() else "file",
            "size": stat.st_size,
            "modified": stat.st_mtime,
        })
    return {"path": str(path), "entries": entries, "truncated": len(entries) == MAX_LIST_ENTRIES}


async def action_hash_file(args: dict[str, Any]) -> dict[str, Any]:
    path = safe_path(str(args.get("path", "")))
    algorithm = str(args.get("algorithm", "sha256")).lower()
    if algorithm not in {"sha256", "sha512"}:
        raise AgentError("Allowed algorithms: sha256, sha512")
    if not path.is_file():
        raise AgentError("Requested path is not a file")
    size = path.stat().st_size
    if size > MAX_FILE_BYTES:
        raise AgentError(f"File exceeds {MAX_FILE_BYTES} byte limit")

    def calculate() -> str:
        digest = hashlib.new(algorithm)
        with path.open("rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(chunk)
        return digest.hexdigest()

    value = await asyncio.to_thread(calculate)
    return {"path": str(path), "algorithm": algorithm, "digest": value, "size": size}


async def action_git_status(_: dict[str, Any]) -> dict[str, Any]:
    return await asyncio.to_thread(fixed_git, ["status", "--short", "--branch"])


async def action_git_log(args: dict[str, Any]) -> dict[str, Any]:
    requested = int(args.get("limit", 5))
    limit = max(1, min(20, requested))
    return await asyncio.to_thread(fixed_git, ["log", f"-{limit}", "--date=iso", "--pretty=format:%h%x09%ad%x09%s"])


async def action_git_pull(_: dict[str, Any]) -> dict[str, Any]:
    if os.getenv("CMX_ALLOW_GIT_PULL", "0") != "1":
        raise AgentError("git_pull is disabled; set CMX_ALLOW_GIT_PULL=1 to enable it")
    return await asyncio.to_thread(fixed_git, ["pull", "--ff-only"])


Action = Callable[[dict[str, Any]], Awaitable[dict[str, Any]]]
ACTIONS: dict[str, Action] = {
    "health": action_health,
    "system_info": action_system_info,
    "disk_usage": action_disk_usage,
    "dns_lookup": action_dns_lookup,
    "list_files": action_list_files,
    "hash_file": action_hash_file,
    "git_status": action_git_status,
    "git_log": action_git_log,
    "git_pull": action_git_pull,
}


async def handle_job(message: dict[str, Any]) -> dict[str, Any]:
    job_id = str(message.get("id", ""))
    action_name = str(message.get("action", ""))
    args = message.get("args") or {}
    if not isinstance(args, dict):
        return {"type": "result", "id": job_id, "ok": False, "error": "args must be an object"}
    action = ACTIONS.get(action_name)
    if action is None:
        return {"type": "result", "id": job_id, "ok": False, "error": "action is not allowed"}
    try:
        result = await action(args)
        return {"type": "result", "id": job_id, "ok": True, "action": action_name, "result": result}
    except Exception as exc:
        return {"type": "result", "id": job_id, "ok": False, "action": action_name, "error": str(exc)}


async def agent_loop() -> None:
    relay_url = env_required("CMX_RELAY_URL")
    token = env_required("CMX_AGENT_TOKEN")
    agent_id = os.getenv("CMX_AGENT_ID", socket.gethostname()).strip() or socket.gethostname()
    if not relay_url.startswith("wss://"):
        raise AgentError("CMX_RELAY_URL must use wss://")

    delay = 2
    while True:
        try:
            async with websockets.connect(relay_url, ping_interval=20, ping_timeout=20, max_size=2 * 1024 * 1024) as websocket:
                await websocket.send(json.dumps({
                    "type": "hello",
                    "agent_id": agent_id,
                    "token": token,
                    "version": VERSION,
                    "capabilities": sorted(ACTIONS),
                }))
                delay = 2
                async for raw in websocket:
                    try:
                        message = json.loads(raw)
                        if not isinstance(message, dict) or message.get("type") != "job":
                            continue
                        response = await handle_job(message)
                    except Exception as exc:
                        response = {"type": "result", "id": "", "ok": False, "error": f"invalid job: {exc}"}
                    await websocket.send(json.dumps(response, separators=(",", ":")))
        except asyncio.CancelledError:
            raise
        except Exception as exc:
            print(f"[agent] connection error: {exc}; retrying in {delay}s", file=sys.stderr, flush=True)
            await asyncio.sleep(delay)
            delay = min(60, delay * 2)


def self_test() -> None:
    print(json.dumps({
        "version": VERSION,
        "python": sys.version.split()[0],
        "allowed_root": str(allowed_root()),
        "repo_root": os.getenv("CMX_REPO_ROOT", "(not configured)"),
        "git_pull_enabled": os.getenv("CMX_ALLOW_GIT_PULL", "0") == "1",
        "capabilities": sorted(ACTIONS),
    }, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser(description="CMX outbound-only Termux agent")
    parser.add_argument("--self-test", action="store_true", help="print configuration and exit")
    args = parser.parse_args()
    if args.self_test:
        self_test()
        return
    try:
        asyncio.run(agent_loop())
    except (KeyboardInterrupt, AgentError) as exc:
        if str(exc):
            print(f"[agent] {exc}", file=sys.stderr)
        raise SystemExit(1 if isinstance(exc, AgentError) else 0)


if __name__ == "__main__":
    main()
