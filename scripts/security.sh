#!/usr/bin/env bash
set -euo pipefail

echo "🔒 Security check..."

WARNINGS=0

if [ -f package.json ]; then
  echo "→ npm audit"
  npm audit --audit-level=high || WARNINGS=$((WARNINGS + 1))
fi

echo "→ Scanning for secrets..."
PATTERNS="API_KEY|SECRET|PASSWORD|PRIVATE_KEY|ACCESS_TOKEN"
if grep -rE "$PATTERNS" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.json" . 2>/dev/null | grep -v node_modules | grep -v ".env.example"; then
  echo "⚠️  Potential secrets found above"
  WARNINGS=$((WARNINGS + 1))
else
  echo "   No secrets detected"
fi

if [ $WARNINGS -gt 0 ]; then
  echo "⚠️  $WARNINGS warning(s) — review before shipping"
else
  echo "✅ Security check passed"
fi
