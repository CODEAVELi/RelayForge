#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

npm run package

rm -rf deploy/chrome deploy/firefox
mkdir -p deploy/chrome deploy/firefox
unzip -oq release/RelayForge-chrome.zip -d deploy/chrome
unzip -oq release/RelayForge-firefox.zip -d deploy/firefox

echo "✅ Local deploy artifacts ready:"
echo "  - $ROOT/deploy/chrome"
echo "  - $ROOT/deploy/firefox"
echo
echo "Chrome: open chrome://extensions -> Load unpacked -> deploy/chrome"
echo "Firefox: about:debugging -> This Firefox -> Load Temporary Add-on -> deploy/firefox/manifest.json"
