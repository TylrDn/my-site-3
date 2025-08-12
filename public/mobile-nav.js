// public/mobile-nav.js
// Dispatches a 'mobile-menu-toggle' CustomEvent with { detail: { isActive: boolean } }
// so other scripts can react to mobile menu state changes.
(function () {
  function qs(sel) {
    return document.querySelector(sel);
  }

  function setupMenu() {
    const btn = qs("#menu-toggle");
    const panel = qs("#mobile-nav");
    const closeBtn = panel ? panel.querySelector(".close-nav") : null;
    if (!btn || !panel) return;

    let open = false;
    let focusables = [];

    function trapFocus(e) {
      if (e.key !== "Tab" || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    function setState(next) {
      open = next;
      panel.hidden = !open;
      document.documentElement.classList.toggle("nav-open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation",
      );

      // Announce state to any listeners (analytics or page scripts)
      // Custom event payload: { detail: { isActive: boolean } }
      // Consumers can listen on `document` for 'mobile-menu-toggle'
      try {
        document.dispatchEvent(
          new CustomEvent("mobile-menu-toggle", { detail: { isActive: open } }),
        );
      } catch (e) {}

      // iOS-friendly scroll lock
      document.body.style.overflow = open ? "hidden" : "";
      document.body.style.touchAction = open ? "none" : "";

      if (open) {
        focusables = panel.querySelectorAll(
          "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])",
        );
        if (focusables.length) focusables[0].focus();
      } else {
        btn.focus();
      }
    }

    // Close when a nav link is tapped or backdrop clicked
    panel.addEventListener("click", (e) => {
      if (e.target === panel) return setState(false);
      const link = e.target.closest("a");
      if (link) setState(false);
    });

    btn.addEventListener("click", () => setState(!open));
    closeBtn && closeBtn.addEventListener("click", () => setState(false));
    document.addEventListener("keydown", (e) => {
      if (!open) return;
      if (e.key === "Escape") return setState(false);
      trapFocus(e);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024 && open) setState(false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupMenu);
  } else {
    setupMenu();
  }
})();
