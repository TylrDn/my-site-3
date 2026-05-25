/**
 * Server-side proxy for trade-alert dashboard API.
 * Injects DASHBOARD_API_KEY from Netlify env — never exposed to the browser.
 *
 * Netlify env (Site settings → Environment variables):
 *   DASHBOARD_API_KEY          — required
 *   TRADE_ALERT_API_BASE       — optional, default https://trade-alert-api.macrosight.net
 */

const API_BASE_DEFAULT = 'https://trade-alert-api.macrosight.net';

/** Read-only dashboard routes (GET only). */
const ALLOWED = new Set([
  'summary',
  'kpis',
  'health',
  'winrate',
  'frequency',
  'symbols',
  'alerts',
  'session-stats',
  'circuit-breaker',
]);

function parseRoute(event) {
  let rest = '';

  // Direct function URL: /.netlify/functions/trade-alert/summary
  const fnPrefix = '/.netlify/functions/trade-alert/';
  if (event.path.startsWith(fnPrefix)) {
    rest = event.path.slice(fnPrefix.length);
  }

  // Rewrite from netlify.toml: /trade-alert/api/summary → function (path stays original)
  if (!rest) {
    const apiPrefix = '/trade-alert/api/';
    if (event.path.startsWith(apiPrefix)) {
      rest = event.path.slice(apiPrefix.length);
    }
  }

  // Splat param from some redirect configurations
  if (!rest && event.pathParameters?.splat) {
    rest = String(event.pathParameters.splat).replace(/^\//, '');
  }

  if (!rest && event.queryStringParameters?.path) {
    rest = event.queryStringParameters.path.replace(/^\//, '');
  }

  if (!rest || rest.includes('..') || /^https?:/i.test(rest)) {
    return null;
  }
  const qIdx = rest.indexOf('?');
  const pathPart = qIdx >= 0 ? rest.slice(0, qIdx) : rest;
  const query = qIdx >= 0 ? rest.slice(qIdx) : '';
  const segment = pathPart.split('/')[0];
  if (!ALLOWED.has(segment)) {
    return null;
  }
  return { pathPart, query };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.DASHBOARD_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 503,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ detail: 'Dashboard proxy not configured (set DASHBOARD_API_KEY in Netlify)' }),
    };
  }

  const route = parseRoute(event);
  if (!route) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ detail: 'Not found' }),
    };
  }

  const apiBase = (process.env.TRADE_ALERT_API_BASE || API_BASE_DEFAULT).replace(/\/$/, '');
  const url = `${apiBase}/api/${route.pathPart}${route.query}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'X-API-Key': apiKey },
    });
    const body = await res.text();
    return {
      statusCode: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
        'Cache-Control': 'no-store',
      },
      body,
    };
  } catch {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ detail: 'Upstream API unavailable' }),
    };
  }
};
