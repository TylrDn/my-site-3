// public/include-header.js
(async function () {
  const placeholder = document.getElementById("header-placeholder");
  if (!placeholder) return;
  try {
    const res = await fetch("header.html");
    if (!res.ok) throw new Error(`Failed to fetch header: ${res.status}`);
    const headerHtml = await res.text();
    placeholder.insertAdjacentHTML("beforebegin", headerHtml);
    placeholder.remove();

    // Highlight active navigation link
    let path = window.location.pathname.replace(/\/$/, "");
    if (path === "" || path === "/" || path === "/index.html") {
      path = "/index.html";
    }
    document
      .querySelectorAll("#site-menu a, #mobile-nav a")
      .forEach((link) => {
        const linkPath = new URL(
          link.getAttribute("href"),
          window.location,
        )
          .pathname.replace(/\/$/, "");
        if (linkPath === path) {
          link.classList.add("active");
        }
      });

    // Simple mobile navigation
    const htmlEl = document.documentElement;
    const btn = document.getElementById("menu-toggle");
    const panel = document.getElementById("mobile-nav");
    const close = panel?.querySelector(".close-nav");
    if (btn && panel && close) {
      const openNav = () => {
        htmlEl.classList.add("nav-open");
        panel.hidden = false;
        btn.setAttribute("aria-expanded", "true");
        btn.setAttribute("aria-label", "Close navigation");
        close.focus();
      };
      const closeNav = () => {
        htmlEl.classList.remove("nav-open");
        panel.hidden = true;
        btn.setAttribute("aria-expanded", "false");
        btn.setAttribute("aria-label", "Open navigation");
        btn.focus();
      };
      btn.addEventListener("click", () =>
        htmlEl.classList.contains("nav-open") ? closeNav() : openNav(),
      );
      close.addEventListener("click", closeNav);
      panel.addEventListener("click", (e) => {
        if (e.target.tagName === "A") closeNav();
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeNav();
      });
    }
  } catch (err) {
    console.error("Failed to load header:", err);
  }
})();
