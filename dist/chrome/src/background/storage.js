import { DEFAULT_WS_URL, STORAGE_KEYS } from '../shared/constants.js';
import { DEFAULT_ALLOWLIST } from '../shared/policy.js';

const EXTRA_KEYS = {
  queue: 'relay.queue',
  inflight: 'relay.inflight',
  boundTabId: 'relay.boundTabId',
  lock: 'relay.lock',
  allowlist: 'relay.allowlist',
  audit: 'relay.audit',
  queueVersion: 'relay.queueVersion',
  crashWebhook: 'relay.crashWebhook'
};

export async function loadConfig() {
  const data = await chrome.storage.local.get([
    STORAGE_KEYS.wsUrl,
    STORAGE_KEYS.enabled,
    STORAGE_KEYS.session,
    EXTRA_KEYS.queue,
    EXTRA_KEYS.inflight,
    EXTRA_KEYS.boundTabId,
    EXTRA_KEYS.lock,
    EXTRA_KEYS.allowlist,
    EXTRA_KEYS.audit,
    EXTRA_KEYS.queueVersion,
    EXTRA_KEYS.crashWebhook
  ]);
  return {
    wsUrl: data[STORAGE_KEYS.wsUrl] || DEFAULT_WS_URL,
    enabled: data[STORAGE_KEYS.enabled] ?? true,
    session: data[STORAGE_KEYS.session] || null,
    queue: data[EXTRA_KEYS.queue] || [],
    inflight: data[EXTRA_KEYS.inflight] || [],
    boundTabId: data[EXTRA_KEYS.boundTabId] ?? null,
    lock: data[EXTRA_KEYS.lock] ?? null,
    allowlist: data[EXTRA_KEYS.allowlist] || DEFAULT_ALLOWLIST,
    audit: data[EXTRA_KEYS.audit] || [],
    queueVersion: data[EXTRA_KEYS.queueVersion] || 1,
    crashWebhook: data[EXTRA_KEYS.crashWebhook] || ''
  };
}

export async function saveSession(session) {
  await chrome.storage.local.set({ [STORAGE_KEYS.session]: session });
}

export async function saveQueue({ queue, inflight, queueVersion = 2 }) {
  await chrome.storage.local.set({
    [EXTRA_KEYS.queue]: queue,
    [EXTRA_KEYS.inflight]: inflight,
    [EXTRA_KEYS.queueVersion]: queueVersion
  });
}

export async function saveBinding({ boundTabId, lock }) {
  await chrome.storage.local.set({
    [EXTRA_KEYS.boundTabId]: boundTabId,
    [EXTRA_KEYS.lock]: lock
  });
}

export async function saveAudit(audit) {
  await chrome.storage.local.set({ [EXTRA_KEYS.audit]: audit });
}

export async function saveAllowlist(allowlist) {
  await chrome.storage.local.set({ [EXTRA_KEYS.allowlist]: allowlist });
}

export async function saveCrashWebhook(url) {
  await chrome.storage.local.set({ [EXTRA_KEYS.crashWebhook]: url || '' });
}

export { EXTRA_KEYS };
