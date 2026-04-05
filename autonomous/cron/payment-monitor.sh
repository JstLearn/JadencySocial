#!/bin/bash
# Payment Monitor Script - Monitors Stripe payments and sends reminders
# Runs every day at 10:00 AM

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
LOG_FILE="$PROJECT_ROOT/logs/payments-$(date +%Y%m%d).log"

# Load environment variables
if [[ -f "$PROJECT_ROOT/.env" ]]; then
  source "$PROJECT_ROOT/.env"
fi

mkdir -p "$PROJECT_ROOT/logs"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=== Starting Payment Monitor ==="

cd "$PROJECT_ROOT"

# Check for overdue invoices
log "Checking for overdue invoices..."

if bun run "$PROJECT_ROOT/src/agents/payment-monitor.ts" 2>&1 | tee -a "$LOG_FILE"; then
  log "Payment check completed"
else
  log "WARNING: Payment check had errors"
fi

# Check for failed payments
log "Checking for failed payments..."

if bun run "$PROJECT_ROOT/src/agents/payment-monitor.ts" --check-failed 2>&1 | tee -a "$LOG_FILE"; then
  log "Failed payment check completed"
else
  log "WARNING: Failed payment check had errors"
fi

# Send payment summary
if [[ -n "${TELEGRAM_BOT_TOKEN:-}" && -n "${TELEGRAM_CHAT_ID:-}" ]]; then
  SUMMARY="💳 Ödeme Monitor Raporu

📅 Tarih: $(date '+%Y-%m-%d')
⏰ Çalışma: $(date '+%H:%M')

Stripe dashboard'u kontrol edin."

  curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d "chat_id=${TELEGRAM_CHAT_ID}" \
    -d "text=${SUMMARY}" > /dev/null || true
fi

log "=== Payment Monitor Complete ==="
