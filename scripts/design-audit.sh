#!/usr/bin/env bash
set -euo pipefail

echo "🎨 Design audit..."

ISSUES=0

# Check for hardcoded colors
echo "→ Checking for hardcoded colors..."
COLORS=$(grep -rn "#[0-9a-fA-F]\{3,6\}" --include="*.tsx" --include="*.ts" src/ 2>/dev/null | grep -v "tailwind.config" | grep -v "globals.css" || true)
if [ -n "$COLORS" ]; then
  echo "⚠️  Hardcoded colors found:"
  echo "$COLORS" | head -10
  ISSUES=$((ISSUES + 1))
fi

# Check for hardcoded spacing
echo "→ Checking for hardcoded spacing..."
SPACING=$(grep -rn "[0-9]\+px" --include="*.tsx" --include="*.ts" src/ 2>/dev/null | grep -v "tailwind.config" | grep -v "// px-ok" || true)
if [ -n "$SPACING" ]; then
  echo "⚠️  Hardcoded pixel values found:"
  echo "$SPACING" | head -10
  ISSUES=$((ISSUES + 1))
fi

# Check for inline styles
echo "→ Checking for inline styles..."
INLINE=$(grep -rn "style={{" --include="*.tsx" src/ 2>/dev/null || true)
if [ -n "$INLINE" ]; then
  echo "⚠️  Inline styles found:"
  echo "$INLINE" | head -10
  ISSUES=$((ISSUES + 1))
fi

if [ $ISSUES -gt 0 ]; then
  echo ""
  echo "⚠️  Found $ISSUES design system violation(s)"
  echo "   Use Tailwind classes and design tokens instead."
else
  echo "✅ Design audit passed"
fi
