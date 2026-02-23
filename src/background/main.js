import { MSG } from '../shared/constants.js';
import { ActionQueue } from '../core/queue.js';
import { connect, safeSend } from './ws.js';
import { loadConfig, saveAllowlist, saveAudit, saveBinding, saveCrashWebhook, saveQueue } from './storage.js';
import { state, LOCK_TTL_MS, hasValidLock, now } from './state.js';
import { executeInTab } from './executor.js';
import { Telemetry } from './telemetry.js';
import { AuditLog } from './audit.js';
import { isAllowedUrl } from '../shared/policy.js';

let queue = new ActionQueue();
const telemetry = new Telemetry();
let audit = new AuditLog();
let allowlist = [];
let crashWebhook = '';
const seenIds = new Set();
const seenOrder = [];

function checksum(items) {
  const str = JSON.stringify(items);
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h.toString(16);
}

function markSeen(id) {
  if (!id || seenIds.has(id)) return;
  seenIds.add(id);
  seenOrder.push(id);
  if (seenOrder.length > 500) {
    const old = seenOrder.shift();
    seenIds.delete(old);
  }
}

async function persistQueue() {
  const serialized = queue.serialize();
  await saveQueue({ queue: serialized.items, inflight: serialized.inflight, queueVersion: 2 });
  setBadge();
}

async function persistAudit() {
  await saveAudit(audit.items);
}

function setBadge() {
  const n = queue.size();
  chrome.action.setBadgeText({ text: n ? String(Math.min(n, 99)) : '' });
  chrome.action.setBadgeBackgroundColor({ color: n ? '#D97706' : '#2563EB' });
}

async function reportCrash(kind, detail) {
  if (!crashWebhook) return;
  try {
    await fetch(crashWebhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ts: Date.now(), kind, detail })
    });
  } catch {}
}

function renewLock() {
  state.lock = {
    tabId: state.activeTabId,
    token: crypto.randomUUID(),
    expiresAt: now() + LOCK_TTL_MS
  };
  saveBinding({ boundTabId: state.activeTabId, lock: state.lock });
}

async function boot() {
  const cfg = await loadConfig();
  state.wsUrl = cfg.wsUrl;
  state.activeTabId = cfg.boundTabId;
  state.lock = cfg.lock;
  allowlist = cfg.allowlist;
  audit = new AuditLog(cfg.audit);
  crashWebhook = cfg.crashWebhook || '';

  queue = new ActionQueue({ items: cfg.queue, inflight: cfg.inflight });
  if (queue.size()) {
    queue.requeueInflight();
    telemetry.push('requeue', { reason: 'boot' });
    await persistQueue();
  }

  connect({
    wsUrl: cfg.wsUrl,
    onExec: handleExec,
    onOpen: () => safeSend({ type: 'STATUS', status: 'connected', tabId: state.activeTabId }),
    onClose: async () => {
      queue.requeueInflight();
      telemetry.push('requeue', { reason: 'disconnect' });
      await persistQueue();
    },
    telemetry
  });

  setBadge();
}

async function currentTabUrl() {
  if (!state.activeTabId) return null;
  try {
    const tab = await chrome.tabs.get(state.activeTabId);
    return tab?.url || null;
  } catch {
    return null;
  }
}

async function handleExec(msg) {
  if (msg?.id && seenIds.has(msg.id)) return { ok: true, deduped: true, id: msg.id };

  if (msg.action === MSG.BIND_TAB) {
    state.activeTabId = Number(msg.tabId);
    renewLock();
    audit.add({ type: 'bind', tabId: state.activeTabId });
    await persistAudit();
    return { ok: true, activeTabId: state.activeTabId, lock: state.lock };
  }

  if (!state.activeTabId) return { ok: false, error: 'No bound tab' };
  if (!hasValidLock()) renewLock();

  const url = await currentTabUrl();
  if (!isAllowedUrl(url, allowlist)) {
    audit.add({ type: 'blocked_by_allowlist', url, action: msg.action || msg.kind || 'unknown' });
    await persistAudit();
    return { ok: false, error: `Blocked by allowlist: ${url}` };
  }

  markSeen(msg.id);
  const action = { id: msg.id, payload: msg, createdAt: now() };
  queue.enqueue(action);
  await persistQueue();
  return processQueue();
}

async function processQueue() {
  const next = queue.next();
  if (!next) return { ok: true, queued: 0 };

  await persistQueue();
  const result = await executeInTab(state.activeTabId, next.payload);

  if (result.ok) {
    queue.ack(next.id);
    telemetry.push('execOk', { id: next.id });
    audit.add({ type: 'exec_ok', id: next.id });
  } else {
    queue.requeueInflight();
    telemetry.push('execFail', { id: next.id, error: result.error });
    telemetry.push('requeue', { reason: 'exec-fail' });
    audit.add({ type: 'exec_fail', id: next.id, error: result.error });
    reportCrash('exec_fail', { id: next.id, error: result.error });
  }

  await persistQueue();
  await persistAudit();
  return result;
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === 'RELAY_DIAGNOSTICS') {
    sendResponse(
      telemetry.snapshot({
        wsUrl: state.wsUrl,
        connected: !!state.ws && state.ws.readyState === WebSocket.OPEN,
        activeTabId: state.activeTabId,
        lock: state.lock,
        allowlist,
        crashWebhook,
        queue: { ...queue.serialize(), checksum: checksum(queue.serialize()) },
        audit: audit.list(100)
      })
    );
    return true;
  }

  if (msg?.type === 'RELAY_SET_ALLOWLIST') {
    allowlist = Array.isArray(msg.allowlist) ? msg.allowlist : allowlist;
    saveAllowlist(allowlist).then(() => sendResponse({ ok: true, allowlist }));
    return true;
  }

  if (msg?.type === 'RELAY_SET_CRASH_WEBHOOK') {
    crashWebhook = typeof msg.url === 'string' ? msg.url.trim() : crashWebhook;
    saveCrashWebhook(crashWebhook).then(() => sendResponse({ ok: true, crashWebhook }));
    return true;
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  state.activeTabId = tab.id;
  renewLock();
  audit.add({ type: 'bind', tabId: tab.id, url: tab.url });
  persistAudit();
  safeSend({ type: 'TAB_BOUND', tabId: tab.id, url: tab.url, lock: state.lock });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === state.activeTabId) {
    state.activeTabId = null;
    state.lock = null;
    saveBinding({ boundTabId: null, lock: null });
    safeSend({ type: 'TAB_UNBOUND' });
  }
});

boot();
