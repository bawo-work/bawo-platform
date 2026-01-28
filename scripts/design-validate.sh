#!/usr/bin/env bash
set -euo pipefail

critical=0
major=0
minor=0

print_issue() {
  local level="$1"
  local message="$2"
  case "$level" in
    critical) critical=$((critical + 1)) ;;
    major) major=$((major + 1)) ;;
    minor) minor=$((minor + 1)) ;;
  esac
  printf "  ✗ %s\n" "$message"
}

print_ok() {
  printf "  ✓ %s\n" "$1"
}

has_cmd() { command -v "$1" >/dev/null 2>&1; }

validate_json() {
  local file="$1"
  if [ ! -f "$file" ]; then
    print_issue critical "$file missing"
    return 1
  fi

  if has_cmd jq; then
    jq . "$file" >/dev/null 2>&1 || { print_issue major "$file invalid JSON"; return 1; }
  elif has_cmd python; then
    python - <<'PY' "$file" >/dev/null 2>&1 || { print_issue major "$file invalid JSON"; return 1; }
import json,sys
with open(sys.argv[1], "r", encoding="utf-8") as f:
    json.load(f)
PY
  elif has_cmd node; then
    node -e "JSON.parse(require('fs').readFileSync('$file','utf8'))" >/dev/null 2>&1 \
      || { print_issue major "$file invalid JSON"; return 1; }
  else
    print_issue minor "Cannot validate $file (no jq/python/node)"
    return 1
  fi

  print_ok "$file valid"
  return 0
}

check_contrast() {
  local file="$1"
  if ! has_cmd python; then
    echo "contrast:skipped"
    return 0
  fi

  python - <<'PY' "$file" 2>/dev/null
import json,sys,re

def get_color(data, path):
    cur = data
    for key in path:
        if isinstance(cur, dict) and key in cur:
            cur = cur[key]
        else:
            return None
    if isinstance(cur, dict) and "value" in cur:
        return cur["value"]
    if isinstance(cur, str):
        return cur
    return None

def hex_to_rgb(value):
    value = value.lstrip("#")
    if len(value) == 8:
        value = value[:6]
    if len(value) != 6:
        return None
    return tuple(int(value[i:i+2], 16) / 255.0 for i in (0, 2, 4))

def rel_lum(rgb):
    def channel(c):
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = rgb
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)

def contrast_ratio(c1, c2):
    l1 = rel_lum(c1)
    l2 = rel_lum(c2)
    lighter = max(l1, l2)
    darker = min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)

with open(sys.argv[1], "r", encoding="utf-8") as f:
    data = json.load(f)

text_primary = get_color(data, ["color", "text", "primary"])
text_secondary = get_color(data, ["color", "text", "secondary"])
surface_bg = get_color(data, ["color", "surface", "background"])

def report(label, fg, bg):
    if not (fg and bg):
        print(f"{label}:missing")
        return
    if not (re.match(r'^#[0-9a-fA-F]{6,8}$', fg) and re.match(r'^#[0-9a-fA-F]{6,8}$', bg)):
        print(f"{label}:invalid")
        return
    c1 = hex_to_rgb(fg)
    c2 = hex_to_rgb(bg)
    if not c1 or not c2:
        print(f"{label}:invalid")
        return
    ratio = contrast_ratio(c1, c2)
    print(f"{label}:ok:{ratio:.2f}")

report("primary", text_primary, surface_bg)
report("secondary", text_secondary, surface_bg)
PY
}

validate_dataset() {
  local file="$1"
  if ! has_cmd python; then
    print_issue minor "Cannot validate datasets in $file (python missing)"
    return 0
  fi

  python - <<'PY' "$file"
import json,sys
with open(sys.argv[1], "r", encoding="utf-8") as f:
    data = json.load(f)
data_sets = data.get("dataSets", {})
missing = [k for k in ("typical", "empty", "maximum", "edge") if k not in data_sets]
if missing:
    print("missing:" + ",".join(missing))
else:
    print("ok")
PY
}

echo "DESIGN VALIDATION REPORT"
echo "════════════════════════"
echo ""

if [ ! -d "design" ]; then
  print_issue critical "design/ directory not found"
  echo ""
  echo "ISSUES: $((critical + major + minor)) (critical: $critical, major: $major, minor: $minor)"
  exit 1
fi

echo "Strategy Phase"
if [ -f "design/strategy/POSITIONING.md" ]; then
  print_ok "POSITIONING.md exists"
else
  print_issue critical "POSITIONING.md missing"
fi
if [ -f "design/strategy/AUDIENCE.md" ]; then
  print_ok "AUDIENCE.md exists"
else
  print_issue critical "AUDIENCE.md missing"
fi
if [ -f "design/strategy/PERSONALITY.md" ]; then
  print_ok "PERSONALITY.md exists"
else
  print_issue critical "PERSONALITY.md missing"
fi
if [ -f "design/strategy/STRATEGY_COMPLETE.md" ]; then
  print_ok "STRATEGY_COMPLETE.md exists"
else
  print_issue critical "STRATEGY_COMPLETE.md missing"
fi

echo ""
echo "Identity Phase"
if [ -f "design/identity/MOODBOARD.md" ] || [ -d "design/identity/MOODBOARDS" ]; then
  print_ok "MOODBOARD(s) present"
else
  print_issue major "Moodboard missing (design/identity/MOODBOARD.md or MOODBOARDS/)"
fi
if [ -f "design/identity/LOGO.md" ]; then
  print_ok "LOGO.md exists"
else
  print_issue major "LOGO.md missing"
fi
if [ -f "design/identity/VOICE.md" ]; then
  print_ok "VOICE.md exists"
else
  print_issue major "VOICE.md missing"
fi
if [ -f "design/identity/IDENTITY_COMPLETE.md" ]; then
  print_ok "IDENTITY_COMPLETE.md exists"
else
  print_issue major "IDENTITY_COMPLETE.md missing"
fi

echo ""
echo "System Phase"
validate_json "design/system/tokens/colors.json" || true
validate_json "design/system/tokens/typography.json" || true
validate_json "design/system/tokens/spacing.json" || true
if [ -f "design/system/SYSTEM_COMPLETE.md" ]; then
  print_ok "SYSTEM_COMPLETE.md exists"
else
  print_issue critical "SYSTEM_COMPLETE.md missing"
fi

if [ -f "design/system/tokens/colors.json" ]; then
  contrast_output="$(check_contrast "design/system/tokens/colors.json")"
  if echo "$contrast_output" | grep -q "^contrast:skipped$"; then
    print_issue minor "Cannot check color contrast (python missing)"
    contrast_output=""
  fi
  if [ -n "$contrast_output" ]; then
    primary_line="$(echo "$contrast_output" | grep "^primary:" || true)"
    secondary_line="$(echo "$contrast_output" | grep "^secondary:" || true)"

    primary_status="$(echo "$primary_line" | cut -d: -f2)"
    primary_ratio="$(echo "$primary_line" | cut -d: -f3)"
    secondary_status="$(echo "$secondary_line" | cut -d: -f2)"
    secondary_ratio="$(echo "$secondary_line" | cut -d: -f3)"

    if [ "$primary_status" = "ok" ]; then
      if has_cmd python && [ -n "$primary_ratio" ]; then
        primary_ok="$(python - <<'PY' "$primary_ratio"
import sys
print("ok" if float(sys.argv[1]) >= 4.5 else "fail")
PY
)"
        if [ "$primary_ok" = "ok" ]; then
          print_ok "Color contrast: text.primary on surface.background >= 4.5:1"
        else
          print_issue major "Color contrast: text.primary on surface.background = $primary_ratio (need 4.5:1)"
        fi
      else
        print_issue major "Color contrast: text.primary on surface.background not found"
      fi
    else
      print_issue major "Color contrast: primary text on background not found"
    fi

    if [ "$secondary_status" = "ok" ]; then
      if has_cmd python && [ -n "$secondary_ratio" ]; then
        secondary_ok="$(python - <<'PY' "$secondary_ratio"
import sys
print("ok" if float(sys.argv[1]) >= 4.5 else "fail")
PY
)"
        if [ "$secondary_ok" = "ok" ]; then
          print_ok "Color contrast: text.secondary on surface.background >= 4.5:1"
        else
          print_issue major "Color contrast: text.secondary on surface.background = $secondary_ratio (need 4.5:1)"
        fi
      else
        print_issue major "Color contrast: text.secondary on surface.background not found"
      fi
    else
      print_issue major "Color contrast: secondary text on background not found"
    fi
  fi
fi

echo ""
echo "Screens Phase"
if [ -d "design/screens" ]; then
  feature_dirs="$(find design/screens -mindepth 1 -maxdepth 1 -type d 2>/dev/null || true)"
  if [ -z "$feature_dirs" ]; then
    print_issue major "No feature screen directories found"
  else
    while IFS= read -r feature_dir; do
      feature="$(basename "$feature_dir")"
      if [ ! -f "$feature_dir/FLOWS.md" ]; then
        print_issue major "$feature/FLOWS.md missing"
      fi
      if [ ! -f "$feature_dir/STATES.md" ]; then
        print_issue major "$feature/STATES.md missing"
      fi
      if [ ! -f "$feature_dir/SCREENS.md" ]; then
        print_issue major "$feature/SCREENS.md missing"
      fi
      if [ ! -f "$feature_dir/DATA.json" ]; then
        print_issue major "$feature/DATA.json missing"
      else
        dataset_result="$(validate_dataset "$feature_dir/DATA.json")"
        if echo "$dataset_result" | rg -q "^missing:"; then
          missing_sets="$(echo "$dataset_result" | cut -d: -f2)"
          print_issue major "$feature/DATA.json missing datasets: $missing_sets"
        else
          print_ok "$feature/DATA.json datasets complete"
        fi
      fi
    done <<< "$feature_dirs"
  fi
else
  print_issue major "design/screens/ missing"
fi

echo ""
total=$((critical + major + minor))
echo "ISSUES: $total (critical: $critical, major: $major, minor: $minor)"

if [ "$critical" -gt 0 ] || [ "$major" -gt 0 ]; then
  exit 1
fi
