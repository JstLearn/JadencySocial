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
LOGFILE="logs/report-${TIMESTAMP}.log"

REPORT_TYPE="${1:-weekly}"

echo "[*] Starting $REPORT_TYPE report at $(date)"
echo "[*] Log file: $LOGFILE"

npx tsx src/reporter.ts "$REPORT_TYPE" 2>&1 | tee "$LOGFILE"
EXIT_CODE=${PIPESTATUS[0]}

if [[ $EXIT_CODE -ne 0 ]]; then
  echo "[!] Reporter exited with code $EXIT_CODE"
fi

echo "[*] Report finished at $(date)"
exit $EXIT_CODE