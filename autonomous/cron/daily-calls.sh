#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

set -a
if [[ -f .env ]]; then
  source .env
else
  echo "[!] .env not found at $PROJECT_DIR/.env"
  exit 1
fi
set +a

mkdir -p logs

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOGFILE="logs/calls-${TIMESTAMP}.log"

echo "[*] Starting daily calls at $(date)"
echo "[*] Log file: $LOGFILE"

npx tsx src/caller.ts 2>&1 | tee "$LOGFILE"
EXIT_CODE=${PIPESTATUS[0]}

if [[ $EXIT_CODE -ne 0 ]]; then
  echo "[!] Caller exited with code $EXIT_CODE"
fi

echo "[*] Calls finished at $(date)"
exit $EXIT_CODE