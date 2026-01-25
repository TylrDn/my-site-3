# MacroSight

Taylor Dean's professional portfolio website - a static site built with vanilla HTML, CSS, and JavaScript.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start a local dev server:

   ```bash
   npm start
   ```

   This serves the `public/` directory at `http://localhost:4173`.

## Usage

Open `public/index.html` directly in your browser or serve the `public/` directory with any static file server.

## Mobile navigation

Mobile navigation is implemented as an accessible full-screen overlay. `public/nav.js` injects the header markup from an embedded template. Each page should include a `<div id="header-placeholder"></div>` at the start of the `<body>` and load `nav.js` just before the closing `</body>` tag. The script locks background scrolling, respects safe-area insets, and traps focus until closed.
