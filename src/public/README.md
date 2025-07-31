# Public Directory — Global Styling for MacroSight.net

## SEO & Launch Files

This site includes:
- `/robots.txt` (allows all, points to sitemap)
- `/sitemap.xml` (lists all public pages)

Both are in `/public` and will be live at the root of your deployed site for search engines and best practice.

This `/public` directory contains globally scoped utility logic that can be reused across the entire MacroSight site.

---

## 📦 Contents

### `globalStyles.js`
Injects all global CSS styles into the DOM using Velo JavaScript, because Wix does **not** support `global.css` uploads.

This file defines:
- Global color variables (`:root`)
- Typography rules
- Layout utilities (flex/grid helpers)
- Reusable UI classes (buttons, cards, section spacing)
- Hover/transition effects
- Mobile-responsive overrides

---

## ✅ Usage


## Usage with Wix Velo

All page scripts should import global styles like this for Wix/Velo compatibility:

```js
import { injectGlobalStyles } from "public/globalStyles";

$w.onReady(function () {
  injectGlobalStyles();
  // Additional page logic here...
});
```

### Use HTML like real frontend developers:

```html
<div class="card">
  <h3>Project Title</h3>
  <p>Solution details here</p>
</div>

<div class="centered-flex">
  <button class="cta-button btn-blue">Call to Action</button>
</div>
```

---

## 🧠 Why This Pattern?

Wix does not support native CSS files across pages. This file uses a JavaScript-based injection pattern to apply consistent styles site-wide.

**Benefits:**

* Define once, use everywhere
* Maintain a true design system across injected `.html`
* Eliminate inline style clutter
* Enable semantic, responsive development within Wix constraints

---

## 🛠 Maintenance Notes

* Extend with new utility classes as needed (e.g., `.badge`, `.tag`, `.grid-lg`)
* Stick to mobile-first and semantic naming conventions
* Avoid inline styles — update here and reuse

---

## 🌱 Optional V2 Enhancements (Not Required for V1)

These are additional style patterns or utilities you may want to include in `globalStyles.js` for future growth:

| Feature                  | Suggested Class or Pattern         |
| ------------------------ | ---------------------------------- |
| Badge / Tag UI           | `.badge`, `.tag`                   |
| Grid layout helpers      | `.grid-lg`, `.grid-2`, `.grid-3`   |
| Scroll fade/hover motion | `.reveal`, `.fade-in`, `.slide-up` |
| Dark mode support        | `data-theme`, dark color vars      |
| Visual filters or chips  | `.filter-chip`, `.pill`            |
| Icon layout blocks       | `.icon-set`, `.icon-label`         |
| Nav / footer animations  | `.sticky`, `.fade-footer`          |
| Global typography tokens | `.heading-sm`, `.body-md`          |

These additions should only be added as needed — the current setup is already V1-complete and fully functional.

---

© 2025 MacroSight. Built with Velo + Class-Driven Styling.

