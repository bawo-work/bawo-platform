#!/usr/bin/env bash
set -euo pipefail

echo "🧪 Running tests..."

if [ -f package.json ]; then
  if npm run --silent 2>/dev/null | rg -q "^test$"; then
    npm test
  elif [ -d "__tests__" ] || [ -d "tests" ] || ls *.test.ts >/dev/null 2>&1; then
    echo "⚠️  Test files found but no 'test' script in package.json"
    echo "   Add: \"test\": \"vitest\" or \"jest\" to package.json scripts"
    exit 1
  else
    echo "ℹ️  No tests found. Create tests in __tests__/ or *.test.ts files"
    exit 0
  fi
else
  echo "ℹ️  No package.json. Customize scripts/test.sh for this project."
  exit 0
fi
