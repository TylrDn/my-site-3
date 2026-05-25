# Trade Alert dashboard (Netlify)

Public page: `/trade-alert/` — loads live data with **no browser API key**.

## How it works

```
Browser  →  /trade-alert/api/*  →  Netlify Function  →  trade-alert-api.macrosight.net
                              (DASHBOARD_API_KEY in Netlify env only)
```

## Required Netlify environment variables

Site settings → Environment variables → **Production** (and Deploy previews if needed):

| Variable | Value |
|----------|--------|
| `DASHBOARD_API_KEY` | Same as `DASHBOARD_API_KEY` on Hetzner (`~/trade-alert/.env`) |
| `TRADE_ALERT_API_BASE` | `https://trade-alert-api.macrosight.net` (optional; this is the default) |

Redeploy after setting variables.

## Local dev

```bash
netlify dev
# open http://localhost:8888/trade-alert/
```

Or point at a local API (direct, no proxy):

`/trade-alert/?api=http://localhost:8080`

## Security note

Anyone who can view `/trade-alert/` can read dashboard data through the proxy. For a private dashboard, add [Netlify password protection](https://docs.netlify.com/visitor-access/password-protection/) or Identity on that path.
