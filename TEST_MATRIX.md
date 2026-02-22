# Compatibility Test Matrix

## Browsers
- Chrome Stable (MV3)
- Chrome Beta (MV3)
- Firefox Stable (MV3)
- Firefox Developer Edition
- Safari (WebExtension wrapper) — pending packaging

## Core tests
1. Bind tab persists across extension reload
2. WS reconnect after gateway restart
3. In-flight queue replay after disconnect
4. Duplicate action ID is deduped
5. Allowlist blocks non-approved domains
6. Audit log records bind/blocked/exec events
7. Diagnostics JSON export contains counts + queue checksum

## Regression checks
- No context jump to wrong tab
- No silent drop of actions
- No duplicate click/type on replay
- Queue badge reflects real pending count

## Pass criteria
- 0 critical failures
- <1% action replay error under induced disconnect tests
- 100% deterministic dedupe behavior for duplicated IDs
