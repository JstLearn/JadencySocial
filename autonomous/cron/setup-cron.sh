#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CRONTAB_FILE="$SCRIPT_DIR/CRONTAB"

echo "╔══════════════════════════════════════════════════╗"
echo "║     JadencySocial — Crontab Kurulumu            ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

if [[ ! -f "$CRONTAB_FILE" ]]; then
  echo "[X] CRONTAB dosyasi bulunamadi: $CRONTAB_FILE"
  exit 1
fi

echo "Kurulacak zamanlanmis görevler:"
echo ""
cat "$CRONTAB_FILE" | grep -v '^#' | grep -v '^$'
echo ""

read -p "Kurulumu onayliyor musunuz? (e/h): " confirm
[[ "$confirm" =~ ^[eE]$ ]] || { echo "Iptal edildi."; exit 0; }

echo ""
echo "[*] Mevcut crontab yedekleniyor..."
crontab -l > /tmp/jadencysocial-crontab-backup-$(date +%Y%m%d%H%M%S).txt 2>/dev/null || true

echo "[*] Yeni crontab kuruluyor..."
crontab "$CRONTAB_FILE"

echo ""
echo "[OK] Crontab kuruldu. Mevcut giris:"
crontab -l | grep -v '^#' | grep -v '^$'

echo ""
echo "Kurulum tamamlandi. Loglar:"
echo "  /home/deniz/Cloud/Code/JadencySocial/autonomous/logs/"