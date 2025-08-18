// public/placeholder-img.js
// Injects a shared placeholder image for elements with `data-placeholder-img`.
// Uses an optional `data-alt` attribute for the image's alt text.
(function () {
  function init() {
    document.querySelectorAll("[data-placeholder-img]").forEach((el) => {
      const alt = el.getAttribute("data-alt") || "";
      el.innerHTML = `
          <picture>
            <img src="img/Placeholder.jpg" width="300" height="200" alt="${alt}" loading="lazy" decoding="async" class="placeholder-img" />
          </picture>`;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
