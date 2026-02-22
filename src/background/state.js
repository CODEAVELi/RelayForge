export const LOCK_TTL_MS = 30_000;

export const state = {
  ws: null,
  wsUrl: null,
  sessionId: null,
  reconnectAttempt: 0,
  reconnectTimer: null,
  activeTabId: null,
  lock: null,
  pendingResolvers: new Map()
};

export function now() {
  return Date.now();
}

export function hasValidLock(lock = state.lock) {
  return !!(lock && lock.expiresAt && lock.expiresAt > now());
}
