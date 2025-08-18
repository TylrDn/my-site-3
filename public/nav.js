(function () {
  const doc = document.documentElement;
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggle || !nav) return;

  const firstLink = nav.querySelector("a");

  function openMenu() {
    doc.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    nav.hidden = false;
    firstLink && firstLink.focus();
  }

  function closeMenu(returnFocus = true) {
    doc.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    nav.hidden = true;
    if (returnFocus) toggle.focus();
  }

  function toggleMenu() {
    if (toggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
    } else {
      openMenu();
    }
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", (e) => {
    if (nav.hidden) return;
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      closeMenu();
    }
  });

  const mq = window.matchMedia("(min-width: 900px)");
  function handleMQ(e) {
    if (e.matches) {
      closeMenu(false);
      nav.hidden = false;
      toggle.hidden = true;
    } else {
      toggle.hidden = false;
      nav.hidden = true;
    }
  }
  handleMQ(mq);
  mq.addEventListener("change", handleMQ);

  if (header && header.dataset.sticky !== undefined) {
    let lastY = window.scrollY;
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      header.classList.toggle("scrolled", y > 8);
      if (y > lastY && y - lastY > 120) {
        header.classList.add("hide");
      } else if (y < lastY) {
        header.classList.remove("hide");
      }
      lastY = y;
    });
  }
})();
