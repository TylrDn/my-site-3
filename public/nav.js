(function () {
  const body = document.body;
  const toggle = document.querySelector('[data-menu-toggle]');
  const overlay = document.querySelector('[data-menu-overlay]');
  const header = document.querySelector('.site-header');
  if (!toggle || !overlay) return;

  const focusableSelectors =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const focusable = overlay.querySelectorAll(focusableSelectors);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') closeMenu();
  }

  function openMenu() {
    lastFocused = document.activeElement;
    overlay.hidden = false;
    body.classList.add('scroll-lock');
    toggle.setAttribute('aria-expanded', 'true');
    const first = overlay.querySelector(focusableSelectors);
    first && first.focus();
    document.addEventListener('keydown', onKeydown);
    overlay.addEventListener('keydown', trapFocus);
  }

  function closeMenu(returnFocus = true) {
    overlay.hidden = true;
    body.classList.remove('scroll-lock');
    toggle.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKeydown);
    overlay.removeEventListener('keydown', trapFocus);
    if (returnFocus && lastFocused) {
      lastFocused.focus();
    }
  }

  toggle.addEventListener('click', () => {
    if (overlay.hidden) {
      openMenu();
    } else {
      closeMenu();
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.tagName === 'A') {
      closeMenu();
    }
  });

  const mq = window.matchMedia('(min-width: 900px)');
  mq.addEventListener('change', (e) => {
    if (e.matches) {
      closeMenu(false);
    }
  });

  if (header && header.dataset.sticky !== undefined) {
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.classList.toggle('scrolled', y > 8);
      if (y > lastY && y - lastY > 120) {
        header.classList.add('hide');
      } else if (y < lastY) {
        header.classList.remove('hide');
      }
      lastY = y;
    });
  }
})();

