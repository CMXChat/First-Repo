#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

pkg update -y
pkg install -y python git
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
chmod 700 agent.py
printf '\nInstalled. Configure private environment values, then run:\n'
printf '  python agent.py --self-test\n'
printf '  python agent.py\n'
