#!/bin/bash
# ============================================
# Nightly Scout Agent Runner
# Tekirdağ bölgesi işletme tarama cron job
# ============================================

set -euo pipefail

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ROOT_DIR="$(dirname "$(dirname "$PROJECT_DIR")")"

# Load environment variables
if [[ -f "$ROOT_DIR/.env" ]]; then
  export $(grep -v '^#' "$ROOT_DIR/.env" | grep -v '^$' | xargs)
fi

# Log file
LOG_FILE="$PROJECT_DIR/logs/scout-$(date +%Y%m%d).log"
mkdir -p "$PROJECT_DIR/logs"

# Change to project directory
cd "$PROJECT_DIR"

# Timestamp
echo "================================================" | tee -a "$LOG_FILE"
echo "Scout Agent started at $(date)" | tee -a "$LOG_FILE"
echo "================================================" | tee -a "$LOG_FILE"

# Run the scout agent
npx tsx src/scout.ts 2>&1 | tee -a "$LOG_FILE"

# Check exit status
if [[ ${PIPESTATUS[0]} -eq 0 ]]; then
    echo "Scout Agent completed successfully at $(date)" | tee -a "$LOG_FILE"
else
    echo "Scout Agent failed with exit code ${PIPESTATUS[0]} at $(date)" | tee -a "$LOG_FILE"
    exit 1
fi
