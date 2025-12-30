# MacroSight

Simple static website built with vanilla HTML, CSS, and JavaScript.

## Setup

1. Install dependencies (Langflow HTTP client helper and the static server):

   ```bash
   npm install
   ```

2. Configure the Langflow endpoint the site should call by editing `public/langflow-config.js`:

   - `baseUrl`: Base URL where your Langflow instance is reachable (e.g., `http://localhost:7860`).
   - `flowId`: The flow ID you want to run.
   - `apiPath`: Path prefix for the run endpoint (defaults to `/api/v1/run`).
   - `defaultHeaders`: Public-only headers to send with each request. Do **not** place API keys or secrets here; if you must add a key, keep it server-side or inject it at build time from an environment file that is not committed (for example, via your hosting platform's build-time environment variables).

   The file ships with placeholder values so you can drop in your own configuration without touching the rest of the codebase.

3. Start a local dev server:

   ```bash
   npm start
   ```

   This serves the `public/` directory at `http://localhost:4173`.

4. Optional: If your deployment process supports `.env` files or build-time substitution, you can map `LANGFLOW_BASE_URL`, `LANGFLOW_FLOW_ID`, and related settings into `public/langflow-config.js` during your build step instead of committing live endpoints.

## Usage

Open `public/index.html` directly in your browser or serve the `public/` directory with any static file server. Use `npm start` during development to serve the site and test Langflow connectivity locally.

## Mobile navigation

Mobile navigation is implemented as an accessible full-screen overlay. `public/nav.js` injects the header markup from an embedded template. Each page should include a `<div id="header-placeholder"></div>` at the start of the `<body>` and load `nav.js` just before the closing `</body>` tag. The script locks background scrolling, respects safe-area insets, and traps focus until closed.
