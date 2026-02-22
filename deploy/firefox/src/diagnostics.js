const out = document.getElementById('out');
const allowEl = document.getElementById('allowlist');
const webhookEl = document.getElementById('webhook');
let latest = null;

async function load() {
  const res = await chrome.runtime.sendMessage({ type: 'RELAY_DIAGNOSTICS' });
  latest = res;
  allowEl.value = (res.allowlist || []).join('\n');
  webhookEl.value = res.crashWebhook || '';
  out.textContent = JSON.stringify(res, null, 2);
}

document.getElementById('refresh').onclick = load;
document.getElementById('copy').onclick = async () => {
  if (!latest) return;
  await navigator.clipboard.writeText(JSON.stringify(latest, null, 2));
};

document.getElementById('saveAllowlist').onclick = async () => {
  const allowlist = allowEl.value.split('\n').map((s) => s.trim()).filter(Boolean);
  await chrome.runtime.sendMessage({ type: 'RELAY_SET_ALLOWLIST', allowlist });
  await load();
};

document.getElementById('saveWebhook').onclick = async () => {
  await chrome.runtime.sendMessage({ type: 'RELAY_SET_CRASH_WEBHOOK', url: webhookEl.value });
  await load();
};

load();
