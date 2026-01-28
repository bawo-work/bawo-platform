#!/usr/bin/env bash
set -euo pipefail

if [ ! -f "REQUIREMENTS.md" ]; then
  echo "Error: REQUIREMENTS.md not found"
  exit 1
fi

if [ ! -f "design/system/SYSTEM_COMPLETE.md" ]; then
  echo "Error: design system not approved"
  echo "Complete design/system/SYSTEM_COMPLETE.md first"
  exit 1
fi

slugify() {
  echo "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | tr -cs 'a-z0-9' '-' \
    | sed 's/^-//;s/-$//'
}

list_features() {
  local lines
  local feature
  local id
  local name

  lines="$(rg "^- \\[ \\] FR-" REQUIREMENTS.md || true)"
  if [ -z "$lines" ]; then
    echo "No FR-* items found in REQUIREMENTS.md"
    exit 0
  fi

  echo "Features from REQUIREMENTS.md:"
  echo ""
  while IFS= read -r line; do
    id="$(echo "$line" | awk '{for(i=1;i<=NF;i++){if($i ~ /^FR-[0-9]+:/){gsub(/:/,"",$i); print $i; exit}}}')"
    name="$(echo "$line" | sed -n 's/^.*FR-[0-9]\\+:[[:space:]]*//p')"
    if [ -z "$name" ]; then
      name="$(echo "$line" | awk -F 'FR-[0-9]+:' '{print $2}' | sed 's/^ *//')"
    fi
    if [ -z "$name" ]; then
      name="$id"
    fi
    feature="$(slugify "$name")"
    if [ -z "$feature" ]; then
      feature="$(slugify "$id")"
    fi
    printf '%s\n' "- $name ($feature)"
  done <<< "$lines"
}

create_feature() {
  local feature_name="$1"
  local feature_slug
  local template_dir
  local target_dir

  feature_slug="$(slugify "$feature_name")"
  if [ -z "$feature_slug" ]; then
    echo "Error: invalid feature name"
    exit 1
  fi

  target_dir="design/screens/$feature_slug"
  mkdir -p "$target_dir"

  template_dir="${SHIP_OS:-}/templates/design/screens"
  if [ -d "$template_dir" ]; then
    if [ -f "$template_dir/FLOWS.template.md" ] && [ ! -f "$target_dir/FLOWS.md" ]; then
      cp "$template_dir/FLOWS.template.md" "$target_dir/FLOWS.md"
    fi
    if [ -f "$template_dir/STATES.template.md" ] && [ ! -f "$target_dir/STATES.md" ]; then
      cp "$template_dir/STATES.template.md" "$target_dir/STATES.md"
    fi
    if [ -f "$template_dir/SCREENS.template.md" ] && [ ! -f "$target_dir/SCREENS.md" ]; then
      cp "$template_dir/SCREENS.template.md" "$target_dir/SCREENS.md"
    fi
    if [ -f "$template_dir/DATA.template.json" ] && [ ! -f "$target_dir/DATA.json" ]; then
      sed -e "s/{{FEATURE_NAME}}/$feature_slug/g" \
        "$template_dir/DATA.template.json" > "$target_dir/DATA.json"
    fi
  else
    touch "$target_dir/FLOWS.md" "$target_dir/STATES.md" "$target_dir/SCREENS.md" "$target_dir/DATA.json"
  fi

  echo "✅ Created design/screens/$feature_slug"
}

case "${1:-}" in
  ""|--list)
    list_features
    ;;
  *)
    create_feature "$1"
    ;;
esac
