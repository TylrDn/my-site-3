(async function () {
  const placeholder = document.getElementById('header-placeholder');
  if (!placeholder) return;
  try {
    const res = await fetch('header.html');
    if (!res.ok) throw new Error(`Failed to fetch header: ${res.status}`);
    const html = await res.text();
    placeholder.insertAdjacentHTML('beforebegin', html);
    placeholder.remove();
  } catch (err) {
    console.error('Failed to load header:', err);
    return;
  }

  const body = document.body;
  const toggle = document.querySelector('[data-menu-toggle]');
  const overlay = document.querySelector('[data-menu-overlay]');
  const header = document.querySelector('.site-header');
  if (!toggle || !overlay) return;

  let path = window.location.pathname.replace(/\/$/, '');
  if (!path || path === '/') path = '/index.html';
  document
    .querySelectorAll('#primary-nav a, [data-menu-overlay] a')
    .forEach((link) => {
      const linkPath = new URL(link.getAttribute('href'), window.location)
        .pathname.replace(/\/$/, '');
      if (linkPath === path) link.classList.add('active');
    });

  const focusableSelectors =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;
  let isOpen = false;

  function trapFocus(e) {
    if (!isOpen || e.key !== 'Tab') return;
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
    if (!isOpen) return;
    if (e.key === 'Escape') closeMenu();
  }

  function openMenu() {
    if (isOpen) return;
    isOpen = true;
    lastFocused = document.activeElement;
    overlay.hidden = false;
    body.classList.add('scroll-lock');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    const first = overlay.querySelector(focusableSelectors);
    first && first.focus();
  }

  function closeMenu(returnFocus = true) {
    if (!isOpen) return;
    isOpen = false;
    overlay.hidden = true;
    body.classList.remove('scroll-lock');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    if (returnFocus && lastFocused) {
      lastFocused.focus();
    }
  }

  toggle.addEventListener('click', () => {
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.tagName === 'A') {
      closeMenu();
    }
  });

  document.addEventListener('keydown', onKeydown);
  overlay.addEventListener('keydown', trapFocus);

  const mq = window.matchMedia('(min-width: 900px)');
  function handleMQ(e) {
    if (e.matches) {
      closeMenu(false);
    }
  }
  mq.addEventListener('change', handleMQ);
  handleMQ(mq);

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
