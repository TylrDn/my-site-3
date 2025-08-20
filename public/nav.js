(function () {
  const placeholder = document.getElementById('header-placeholder');
  if (!placeholder) return;

  const headerHTML = `\
<header class="site-header" data-sticky>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="container navbar">
    <a class="brand" href="index.html">MacroSight</a>
    <button
      class="nav-toggle"
      type="button"
      aria-controls="mobile-nav"
      aria-expanded="false"
      aria-label="Open menu"
      data-menu-toggle
    >
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </button>
    <nav id="primary-nav" class="nav" data-collapsible>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="experience.html">Experience</a></li>
        <li><a href="projects.html">Projects</a></li>
        <li><a href="resume.html">Resume</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="invest.html">Invest</a></li>
      </ul>
    </nav>
  </div>
</header>

<div
  id="mobile-nav"
  class="menu-overlay"
  role="dialog"
  aria-modal="true"
  hidden
  data-menu-overlay
>
  <nav class="nav" aria-label="Primary">
    <ul>
      <li><a href="index.html">Home</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="experience.html">Experience</a></li>
      <li><a href="projects.html">Projects</a></li>
      <li><a href="resume.html">Resume</a></li>
      <li><a href="contact.html">Contact</a></li>
      <li><a href="invest.html">Invest</a></li>
    </ul>
  </nav>
</div>
`;

  placeholder.insertAdjacentHTML('beforebegin', headerHTML);
  placeholder.remove();

  const body = document.body;
  const toggle = document.querySelector('[data-menu-toggle]');
  const overlay = document.querySelector('[data-menu-overlay]');
  const header = document.querySelector('.site-header');
  if (!toggle || !overlay) return;

  let path = window.location.pathname;
  if (path.endsWith('/')) path += 'index.html';
  else if (!path.split('/').pop().includes('.')) path += '.html';
  document
    .querySelectorAll('#primary-nav a, [data-menu-overlay] a')
    .forEach((link) => {
      let linkPath = new URL(link.getAttribute('href'), window.location).pathname;
      if (linkPath.endsWith('/')) linkPath += 'index.html';
      else if (!linkPath.split('/').pop().includes('.')) linkPath += '.html';
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
    if (e.target === overlay) {
      closeMenu();
    } else if (e.target.tagName === 'A') {
      const href = e.target.getAttribute('href');
      if (
        href &&
        !href.startsWith('#') &&
        ((href.startsWith('http') && href !== window.location.href) ||
          (!href.startsWith('http') && href !== window.location.pathname))
      ) {
        closeMenu();
      }
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
