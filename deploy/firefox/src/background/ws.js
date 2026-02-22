import { MSG, RELAY_VERSION } from '../shared/constants.js';
import { backoff } from '../core/retry.js';
import { state } from './state.js';

export function connect({ wsUrl, onExec, onOpen, onClose, telemetry }) {
  cleanup();
  const ws = new WebSocket(wsUrl);
  state.ws = ws;

  ws.onopen = () => {
    state.reconnectAttempt = 0;
    telemetry?.push('wsOpen');
    ws.send(JSON.stringify({ type: 'HELLO', version: RELAY_VERSION }));
    onOpen?.();
  };

  ws.onmessage = async (event) => {
    let msg;
    try { msg = JSON.parse(event.data); } catch { return; }

    if (msg.type === MSG.PING) {
      return safeSend({ type: MSG.PONG, ts: Date.now() });
    }

    if (msg.type === MSG.EXEC) {
      const result = await onExec(msg);
      safeSend({ type: MSG.EXEC_RESULT, id: msg.id, result });
    }
  };

  ws.onclose = () => {
    telemetry?.push('wsClose');
    onClose?.();
    scheduleReconnect({ wsUrl, onExec, onOpen, onClose, telemetry });
  };

  ws.onerror = () => {
    telemetry?.push('wsError');
    ws.close();
  };
}

function scheduleReconnect(args) {
  cleanupTimer();
  const delay = backoff(state.reconnectAttempt++);
  state.reconnectTimer = setTimeout(() => connect(args), delay);
}

function cleanupTimer() {
  if (state.reconnectTimer) clearTimeout(state.reconnectTimer);
  state.reconnectTimer = null;
}

function cleanup() {
  cleanupTimer();
  if (state.ws) {
    try { state.ws.close(); } catch {}
    state.ws = null;
  }
}

export function safeSend(obj) {
  if (!state.ws || state.ws.readyState !== WebSocket.OPEN) return false;
  state.ws.send(JSON.stringify(obj));
  return true;
}
