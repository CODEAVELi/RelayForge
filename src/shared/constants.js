export const RELAY_VERSION = '0.1.1';
export const DEFAULT_WS_URL = 'ws://127.0.0.1:18792/relay';

export const STORAGE_KEYS = {
  wsUrl: 'relay.wsUrl',
  session: 'relay.session',
  enabled: 'relay.enabled'
};

export const MSG = {
  PING: 'PING',
  PONG: 'PONG',
  EXEC: 'EXEC',
  EXEC_RESULT: 'EXEC_RESULT',
  BIND_TAB: 'BIND_TAB',
  TAB_EVENT: 'TAB_EVENT',
  ERROR: 'ERROR'
};
