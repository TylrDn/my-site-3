# MacroSight

Simple static website built with vanilla HTML, CSS, and JavaScript.

## Usage

Open `public/index.html` directly in your browser or serve the `public/` directory with any static file server.

## Mobile navigation

Mobile navigation is implemented as an accessible full-screen overlay. The header markup lives in `public/header.html` and is injected by `public/nav.js`. Each page should include a `<div id="header-placeholder"></div>` at the start of the `<body>` and load `nav.js` just before the closing `</body>` tag. The script locks background scrolling, respects safe-area insets, and traps focus until closed.
