# MacroSight

Simple static website built with vanilla HTML, CSS, and JavaScript.

## Usage

Open `public/index.html` directly in your browser or serve the `public/` directory with any static file server.

## Mobile navigation

Mobile navigation is implemented as an accessible full-screen overlay. It locks body scrolling, respects safe-area insets, and traps focus until closed. The toggle button and overlay live in `public/nav.js` and `public/styles.css`. Include `nav.js` on each page just before the closing `</body>` tag.
