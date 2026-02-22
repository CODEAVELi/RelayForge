export const DEFAULT_ALLOWLIST = [
  '*.google.com',
  '*.linkedin.com',
  '*.greenhouse.io',
  '*.rippling.com'
];

export function hostnameFromUrl(url) {
  try { return new URL(url).hostname; } catch { return ''; }
}

export function matchHost(host, pattern) {
  if (!host || !pattern) return false;
  if (pattern.startsWith('*.')) return host === pattern.slice(2) || host.endsWith(pattern.slice(1));
  return host === pattern;
}

export function isAllowedUrl(url, allowlist = DEFAULT_ALLOWLIST) {
  const host = hostnameFromUrl(url);
  return allowlist.some((p) => matchHost(host, p));
}
