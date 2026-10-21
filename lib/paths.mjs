export function normalizeBasePath(value = '') {
  const path = value.trim().replace(/\/+$/,'');
  if (!path || path === '/') return '';
  if (!/^\/[a-zA-Z0-9_./-]+$/.test(path) || path.includes('..')) throw new Error('Invalid NEXT_PUBLIC_BASE_PATH');
  return path;
}
export function withBasePath(value, base = '') {
  const prefix = normalizeBasePath(base);
  if (!value || !value.startsWith('/') || value.startsWith('//') || !prefix || value === prefix || value.startsWith(prefix + '/')) return value;
  return prefix + value;
}
