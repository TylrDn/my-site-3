/** Liveness probe — proxies GET /health (no API key required upstream). */
exports.handler = async () => {
  const apiBase = (process.env.TRADE_ALERT_API_BASE || 'https://trade-alert-api.macrosight.net').replace(/\/$/, '');

  try {
    const res = await fetch(`${apiBase}/health`, { method: 'GET' });
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
      body: JSON.stringify({ status: 'unavailable' }),
    };
  }
};
