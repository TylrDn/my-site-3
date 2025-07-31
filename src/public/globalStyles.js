export function injectGlobalStyles() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // Exit if not running in a browser (e.g. during SSR)
    return;
  }

  // Prevent duplicate injection
  if (document.getElementById('global-style-tag')) return;

  const style = document.createElement('style');
  style.id = 'global-style-tag';
  style.innerHTML = `
    :root {
      --charcoal: #1C1C1C;
      --white: #FFFFFF;
      --blue: #0084FF;
      --emerald: #2ECC71;
      --gray: #F5F5F5;
      --font: 'Inter', sans-serif;
    }

    body {
      font-family: var(--font);
      color: var(--charcoal);
      background-color: #fdfdfd;
    }

    .page-heading {
      font-size: 28px;
      font-weight: 600;
      text-align: center;
      margin: 48px 0 24px;
    }

    .cta-button {
      padding: 12px 24px;
      font-size: 16px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .cta-button:hover {
      transform: scale(1.05);
    }

    .btn-dark {
      background-color: var(--charcoal);
      color: var(--white);
    }

    .centered-flex {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .page-heading {
        font-size: 22px;
        margin: 32px 0 16px;
      }

      .cta-button {
        font-size: 15px;
        padding: 10px 20px;
      }
    }
  `;
  document.head.appendChild(style);
}
