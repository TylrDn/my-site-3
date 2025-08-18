export const BASE_ORIGIN = 'https://macrosight.net';

export const ALLOWED_ORIGIN_PATTERNS = [
  'https://www.wix.com',
  'https://*.wix.com',
  'https://*.wixsite.com',
  'https://editor.wix.com',
  'https://editor.wixstudio.com',
  'https://manage.wix.com',
];

export function patternToRegex(pattern) {
  const escaped = pattern.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\\\*/g, '[^.]+');
  return new RegExp(`^${escaped}$`);
}

export function isAllowedOrigin(origin, patterns = ALLOWED_ORIGIN_PATTERNS) {
  try {
    const url = new URL(origin);
    const normalized = `${url.protocol}//${url.host}`;
    return patterns.some((p) => patternToRegex(p).test(normalized));
  } catch {
    return false;
  }
}
