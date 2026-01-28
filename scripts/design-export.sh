#!/usr/bin/env bash
set -euo pipefail

if [ ! -d "design" ]; then
  echo "Error: design/ directory not found"
  exit 1
fi

validate_script="./scripts/design-validate.sh"
if [ ! -x "$validate_script" ] && [ -n "${SHIP_OS:-}" ] && [ -x "$SHIP_OS/scripts/design-validate.sh" ]; then
  validate_script="$SHIP_OS/scripts/design-validate.sh"
fi

if [ -x "$validate_script" ]; then
  "$validate_script" || { echo "❌ Design validation failed"; exit 1; }
else
  echo "Error: scripts/design-validate.sh not found"
  exit 1
fi

mkdir -p design/export

project_name="$(basename "$(pwd)")"
generated_at="$(date -Iseconds)"

if command -v python >/dev/null 2>&1; then
  python - <<'PY' "$project_name" "$generated_at"
import json
import os
import sys

project_name = sys.argv[1]
generated_at = sys.argv[2]

def rel(path):
    return path if os.path.exists(path) else ""

strategy = {
    "positioning": rel("design/strategy/POSITIONING.md"),
    "audience": rel("design/strategy/AUDIENCE.md"),
    "personality": rel("design/strategy/PERSONALITY.md"),
    "complete": rel("design/strategy/STRATEGY_COMPLETE.md"),
}

identity = {
    "moodboards": rel("design/identity/MOODBOARDS"),
    "logo": rel("design/identity/LOGO.md"),
    "voice": rel("design/identity/VOICE.md"),
    "complete": rel("design/identity/IDENTITY_COMPLETE.md"),
}

tokens = {
    "tokens": rel("design/system/tokens/tokens.json"),
    "colors": rel("design/system/tokens/colors.json"),
    "typography": rel("design/system/tokens/typography.json"),
    "spacing": rel("design/system/tokens/spacing.json"),
    "system": rel("design/system/SYSTEM_COMPLETE.md"),
}

screens = []
screens_root = "design/screens"
if os.path.isdir(screens_root):
    for entry in sorted(os.listdir(screens_root)):
        path = os.path.join(screens_root, entry)
        if not os.path.isdir(path):
            continue
        screens.append({
            "name": entry,
            "specification": rel(os.path.join(path, "SCREENS.md")),
            "states": rel(os.path.join(path, "STATES.md")),
            "data": rel(os.path.join(path, "DATA.json")),
            "flows": rel(os.path.join(path, "FLOWS.md")),
            "edge_cases": rel(os.path.join(path, "EDGE_CASES.md")),
        })

handoff = {
    "version": "1.0.0",
    "project": project_name,
    "strategy": strategy,
    "identity": identity,
    "tokens": tokens,
    "screens": screens,
    "metadata": {
        "generated": generated_at,
        "completeness": 100,
    },
}

with open("design/export/HANDOFF.json", "w", encoding="utf-8") as f:
    json.dump(handoff, f, indent=2)
    f.write("\n")
PY
elif command -v node >/dev/null 2>&1; then
  node - <<'NODE' "$project_name" "$generated_at"
const fs = require("fs");
const path = require("path");

const projectName = process.argv[2];
const generatedAt = process.argv[3];

const rel = (p) => (fs.existsSync(p) ? p : "");

const strategy = {
  positioning: rel("design/strategy/POSITIONING.md"),
  audience: rel("design/strategy/AUDIENCE.md"),
  personality: rel("design/strategy/PERSONALITY.md"),
  complete: rel("design/strategy/STRATEGY_COMPLETE.md"),
};

const identity = {
  moodboards: rel("design/identity/MOODBOARDS"),
  logo: rel("design/identity/LOGO.md"),
  voice: rel("design/identity/VOICE.md"),
  complete: rel("design/identity/IDENTITY_COMPLETE.md"),
};

const tokens = {
  tokens: rel("design/system/tokens/tokens.json"),
  colors: rel("design/system/tokens/colors.json"),
  typography: rel("design/system/tokens/typography.json"),
  spacing: rel("design/system/tokens/spacing.json"),
  system: rel("design/system/SYSTEM_COMPLETE.md"),
};

const screens = [];
const screensRoot = "design/screens";
if (fs.existsSync(screensRoot) && fs.statSync(screensRoot).isDirectory()) {
  for (const entry of fs.readdirSync(screensRoot).sort()) {
    const entryPath = path.join(screensRoot, entry);
    if (!fs.statSync(entryPath).isDirectory()) continue;
    screens.push({
      name: entry,
      specification: rel(path.join(entryPath, "SCREENS.md")),
      states: rel(path.join(entryPath, "STATES.md")),
      data: rel(path.join(entryPath, "DATA.json")),
      flows: rel(path.join(entryPath, "FLOWS.md")),
      edge_cases: rel(path.join(entryPath, "EDGE_CASES.md")),
    });
  }
}

const handoff = {
  version: "1.0.0",
  project: projectName,
  strategy,
  identity,
  tokens,
  screens,
  metadata: {
    generated: generatedAt,
    completeness: 100,
  },
};

fs.writeFileSync("design/export/HANDOFF.json", JSON.stringify(handoff, null, 2) + "\n");
NODE
else
  echo "Error: python or node is required to generate HANDOFF.json"
  exit 1
fi

echo "✅ Generated design/export/HANDOFF.json"
