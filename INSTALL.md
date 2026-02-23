# Relay Next — Install Guide (Sprint 4)

## Chrome (unpacked)
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select: `RelayForge/dist/chrome`
5. Click extension icon once on target tab to bind.
6. Open extension **Options** for diagnostics + allowlist.

## Firefox (temporary add-on)
1. Open `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on**
3. Select: `RelayForge/dist/firefox/manifest.json`
4. Click extension icon once on target tab to bind.

## Release ZIP install
- Chrome ZIP: `RelayForge/release/RelayForge-chrome.zip`
- Firefox ZIP: `RelayForge/release/RelayForge-firefox.zip`

## First-run checklist
- Verify WebSocket endpoint reachable (`ws://127.0.0.1:18792/extension` by default)
- Bind tab via toolbar icon
- Run one action and confirm diagnostics updates
- Confirm allowlist includes your target domain
