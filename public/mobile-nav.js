// eslint-disable-next-line no-unused-vars
function toggleMobileMenu() {
  const mobileNav = document.getElementById("mobile-nav");
  const menuIcon = document.getElementById("menu-icon");
  const toggleBtn = document.querySelector(".mobile-menu-toggle");
  if (mobileNav && menuIcon && toggleBtn) {
    mobileNav.classList.toggle("active");
    const isActive = mobileNav.classList.contains("active");
    menuIcon.textContent = isActive ? "✕" : "☰";
    toggleBtn.setAttribute("aria-expanded", isActive);
    document.body.style.overflow = isActive ? "hidden" : "";
    document.dispatchEvent(
      new CustomEvent("mobile-menu-toggle", { detail: { isActive } }),
    );
  }
}

function initMobileNav() {
  const toggleBtn = document.querySelector(".mobile-menu-toggle");
  if (toggleBtn) {
    toggleBtn.setAttribute("aria-controls", "mobile-nav");
    toggleBtn.setAttribute("aria-expanded", "false");
  }

  document.querySelectorAll(".mobile-nav a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = link.getAttribute("href");
      e.preventDefault();
      setTimeout(() => {
        const mobileNav = document.getElementById("mobile-nav");
        if (mobileNav && mobileNav.classList.contains("active")) {
          toggleMobileMenu();
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
      toggleMobileMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    const mobileNav = document.getElementById("mobile-nav");
    if (
      e.key === "Escape" &&
      mobileNav &&
      mobileNav.classList.contains("active")
    ) {
      toggleMobileMenu();
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMobileNav);
} else {
  initMobileNav();
}
