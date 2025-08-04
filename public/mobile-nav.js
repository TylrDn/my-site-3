// eslint-disable-next-line no-unused-vars
function toggleMobileMenu() {
  const mobileNav = document.getElementById("mobile-nav");
  const menuIcon = document.getElementById("menu-icon");
  if (mobileNav && menuIcon) {
    mobileNav.classList.toggle("active");
    const isActive = mobileNav.classList.contains("active");
    menuIcon.textContent = isActive ? "✕" : "☰";
    document.dispatchEvent(
      new CustomEvent("mobile-menu-toggle", { detail: { isActive } }),
    );
  }
}

function initMobileNav() {
  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      setTimeout(() => {
        const mobileNav = document.getElementById("mobile-nav");
        const menuIcon = document.getElementById("menu-icon");
        if (mobileNav && menuIcon) {
          mobileNav.classList.remove("active");
          menuIcon.textContent = "☰";
          document.dispatchEvent(
            new CustomEvent("mobile-menu-toggle", {
              detail: { isActive: false },
            }),
          );
        }
      }, 100);
    });
  });

  document.addEventListener("click", (e) => {
    const mobileNav = document.getElementById("mobile-nav");
    const header = document.querySelector("header");
    if (
      mobileNav &&
      mobileNav.classList.contains("active") &&
      !header.contains(e.target)
    ) {
      mobileNav.classList.remove("active");
      document.getElementById("menu-icon").textContent = "☰";
      document.dispatchEvent(
        new CustomEvent("mobile-menu-toggle", { detail: { isActive: false } }),
      );
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMobileNav);
} else {
  initMobileNav();
}
