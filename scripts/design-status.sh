#!/usr/bin/env bash
set -euo pipefail

project_name="$(basename "$(pwd)")"

printf "Design Status\n"
printf "═════════════\n\n"

if [ ! -d "design" ]; then
  echo "design/ directory not found"
  echo "NEXT ACTION: Run \"ceo design init\""
  exit 0
fi

status_file() {
  if [ -f "$1" ]; then
    echo "✓ Complete"
  else
    echo "○ Not started"
  fi
}

status_dir() {
  if [ -d "$1" ] && [ "$(ls -A "$1" 2>/dev/null)" ]; then
    echo "✓ Complete"
  else
    echo "○ Not started"
  fi
}

strategy_positioning="$(status_file design/strategy/POSITIONING.md)"
strategy_audience="$(status_file design/strategy/AUDIENCE.md)"
strategy_personality="$(status_file design/strategy/PERSONALITY.md)"
strategy_complete="$(status_file design/strategy/STRATEGY_COMPLETE.md)"

identity_moodboards="$(status_dir design/identity/MOODBOARDS)"
identity_logo="$(status_file design/identity/LOGO.md)"
identity_voice="$(status_file design/identity/VOICE.md)"
identity_complete="$(status_file design/identity/IDENTITY_COMPLETE.md)"

system_colors="$(status_file design/system/tokens/colors.json)"
system_typography="$(status_file design/system/tokens/typography.json)"
system_spacing="$(status_file design/system/tokens/spacing.json)"
system_complete="$(status_file design/system/SYSTEM_COMPLETE.md)"

screen_dirs_count="$(find design/screens -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')"
screen_features=$((screen_dirs_count - 1))

printf "Phase 1: Strategy\n"
printf "  ├── POSITIONING.md     %s\n" "$strategy_positioning"
printf "  ├── AUDIENCE.md        %s\n" "$strategy_audience"
printf "  ├── PERSONALITY.md     %s\n" "$strategy_personality"
printf "  └── STRATEGY_COMPLETE  %s\n\n" "$strategy_complete"

printf "Phase 2: Identity (Brand Projects Only)\n"
printf "  ├── MOODBOARDS/        %s\n" "$identity_moodboards"
printf "  ├── LOGO.md            %s\n" "$identity_logo"
printf "  ├── VOICE.md           %s\n" "$identity_voice"
printf "  └── IDENTITY_COMPLETE  %s\n\n" "$identity_complete"

printf "Phase 3: System\n"
printf "  ├── colors.json        %s\n" "$system_colors"
printf "  ├── typography.json    %s\n" "$system_typography"
printf "  ├── spacing.json       %s\n" "$system_spacing"
printf "  └── SYSTEM_COMPLETE    %s\n\n" "$system_complete"

printf "Phase 4: Screens\n"
if [ "$screen_features" -le 0 ]; then
  printf "  ○ No features designed yet\n\n"
else
  printf "  ✓ %s feature(s) designed\n\n" "$screen_features"
fi

next_action=""
if [ "$strategy_complete" != "✓ Complete" ]; then
  next_action="Run \"ceo design strategy\""
elif [ "$system_complete" != "✓ Complete" ]; then
  next_action="Run \"ceo design system\""
elif [ "$screen_features" -le 0 ]; then
  next_action="Run \"ceo design screens\""
else
  next_action="Ready for \"ceo design export\""
fi

printf "NEXT ACTION: %s\n" "$next_action"
