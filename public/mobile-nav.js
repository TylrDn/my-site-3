// public/mobile-nav.js
(function () {
  function qs(sel) { return document.querySelector(sel); }

  function setupMenu() {
    const btn   = qs('#menu-toggle');
    const panel = qs('#mobile-nav');
    if (!btn || !panel) return;

    let open = false;

    function setState(next) {
      open = next;
      panel.hidden = !open;
      document.documentElement.classList.toggle('nav-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');

      // Announce state (analytics/hooks can listen)
      try {
        document.dispatchEvent(
          new CustomEvent('mobile-menu-toggle', { detail: { isActive: open } })
        );
      } catch (e) {}

      // iOS-friendly scroll lock
      document.body.style.overflow = open ? 'hidden' : '';
      document.body.style.touchAction = open ? 'none' : '';

      // Keep focus on toggle for accessibility
      btn.focus();
    }

    // Close on link click inside panel
    panel.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link) setState(false);
    });

    btn.addEventListener('click', () => setState(!open));
    document.addEventListener('keydown', (e) => {
      if (open && e.key === 'Escape') setState(false);
    });

    // Collapse when resizing to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && open) setState(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupMenu);
  } else {
    setupMenu();
  }
})();
