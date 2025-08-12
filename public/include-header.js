// public/include-header.js
(async function () {
  const placeholder = document.getElementById("header-placeholder");
  if (!placeholder) return;
  try {
    const res = await fetch("/header.html");
    if (!res.ok) throw new Error(`Failed to fetch header: ${res.status}`);
    const html = await res.text();
    placeholder.insertAdjacentHTML("beforebegin", html);
    placeholder.remove();

    // Highlight active navigation link
    let path = window.location.pathname
      .replace(/\/$/, "")
      .replace(/\.html$/, "");
    if (path === "" || path === "/") path = "/home";
    document.querySelectorAll("#site-menu a, #mobile-nav a").forEach((link) => {
      if (link.getAttribute("href") === path) {
        link.classList.add("active");
      }
    });

    // Load mobile navigation script after header is injected
    const script = document.createElement("script");
    script.src = "/mobile-nav.js";
    script.defer = true;
    document.body.appendChild(script);
  } catch (err) {
    console.error("Failed to load header:", err);
  }
})();
