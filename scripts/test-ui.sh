#!/usr/bin/env bash
set -euo pipefail

echo "🎭 Running UI tests..."

if [ ! -f package.json ]; then
  echo "❌ package.json not found. UI tests require a Node project."
  exit 1
fi

BASE_URL="${BASE_URL:-http://localhost:3000}"
DEV_CMD="${DEV_CMD:-npm run dev}"
PLAYWRIGHT_CMD="${PLAYWRIGHT_CMD:-npx playwright test}"

log_file="${LOG_FILE:-/tmp/ship-ui-test.log}"
ready=0

cleanup() {
  if [ -n "${DEV_PID:-}" ] && kill -0 "$DEV_PID" 2>/dev/null; then
    kill "$DEV_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo "→ Starting dev server: $DEV_CMD"
$DEV_CMD >"$log_file" 2>&1 &
DEV_PID=$!

echo "→ Waiting for $BASE_URL"
for _ in $(seq 1 30); do
  if curl -fsS "$BASE_URL" >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 1
done

if [ "$ready" -ne 1 ]; then
  echo "❌ Dev server not ready at $BASE_URL"
  echo "   Logs: $log_file"
  exit 1
fi

echo "→ Running Playwright"
$PLAYWRIGHT_CMD

echo "✅ UI tests passed"
