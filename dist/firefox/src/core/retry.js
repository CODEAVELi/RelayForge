export function backoff(attempt) {
  const base = Math.min(1000 * 2 ** attempt, 15000);
  const jitter = Math.floor(Math.random() * 400);
  return base + jitter;
}
