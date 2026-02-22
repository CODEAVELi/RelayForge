function byRef(ref) {
  if (!ref) return null;
  return document.querySelector(`[data-relay-ref="${ref}"]`) || document.getElementById(ref);
}

async function run(payload) {
  const { kind, ref, text } = payload;
  const el = byRef(ref);

  if (kind === 'click') {
    if (!el) return { ok: false, error: 'element not found' };
    el.click();
    return { ok: true };
  }

  if (kind === 'type') {
    if (!el) return { ok: false, error: 'element not found' };
    el.focus();
    el.value = text ?? '';
    el.dispatchEvent(new Event('input', { bubbles: true }));
    return { ok: true };
  }

  if (kind === 'snapshot') {
    return {
      ok: true,
      title: document.title,
      url: location.href
    };
  }

  return { ok: false, error: `Unknown kind: ${kind}` };
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type !== 'RELAY_EXEC') return;
  run(msg.payload)
    .then(sendResponse)
    .catch((e) => sendResponse({ ok: false, error: String(e?.message || e) }));
  return true;
});
