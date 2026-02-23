// Firefox MV3 compatibility fallback:
// If Firefox does not support service_worker in current channel,
// it can run this background script instead.
(async () => {
  try {
    await import('./main.js');
  } catch (err) {
    console.error('RelayForge Firefox fallback failed to load main.js', err);
  }
})();
