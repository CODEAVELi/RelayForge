export async function executeInTab(tabId, payload) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, {
      type: 'RELAY_EXEC',
      payload
    });
    return { ok: true, response };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}
