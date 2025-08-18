// public/include-header.js
(async function () {
  const placeholder = document.getElementById("header-placeholder");
  if (!placeholder) return;
  try {
    const res = await fetch("header.html");
    if (!res.ok) throw new Error(`Failed to fetch header: ${res.status}`);
    const html = await res.text();
    placeholder.insertAdjacentHTML("beforebegin", html);
    placeholder.remove();

    // Highlight active navigation link
    let path = window.location.pathname.replace(/\/$/, "");
    if (path === "" || path === "/" || path === "/index.html") {
      path = "/home.html";
    }
    document.querySelectorAll("#site-menu a, #mobile-nav a").forEach((link) => {
      const linkPath = new URL(link.getAttribute("href"), window.location).pathname.replace(/\/$/, "");
      if (linkPath === path) {
        link.classList.add("active");
      }
    });

    // Load mobile navigation script after header is injected
    const script = document.createElement("script");
    script.src = "mobile-nav.js";
    script.defer = true;
    document.body.appendChild(script);
  } catch (err) {
    console.error("Failed to load header:", err);
  }
})();
