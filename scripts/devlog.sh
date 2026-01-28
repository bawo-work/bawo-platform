#!/usr/bin/env bash
set -euo pipefail
mkdir -p logs
touch logs/verify.log
echo "📓 Tailing logs/verify.log (Ctrl+C to stop)"
tail -n 200 -f logs/verify.log
