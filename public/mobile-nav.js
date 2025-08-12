// public/mobile-nav.js
(function () {
  function qs(sel) { return document.querySelector(sel); }

  function setupMenu() {
    const btn = qs('#menu-toggle');
    const panel = qs('#mobile-nav');
    const close = panel ? panel.querySelector('.close-nav') : null;
    if (!btn || !panel || !close) return;

    let open = false;

    function trapFocus(e) {
      if (!open || e.key !== 'Tab') return;
      const focusables = panel.querySelectorAll('a, button');
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

      if (open) {
        close.focus();
      } else {
        btn.focus();
      }
    }

    // Close on link click or overlay click inside panel
    panel.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link || e.target === panel) setState(false);
    });

    panel.addEventListener('keydown', trapFocus);

    btn.addEventListener('click', () => setState(!open));
    close.addEventListener('click', () => setState(false));
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
