export function injectGlobalStyles() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // Skip if not in a browser environment
    return;
  }

  // Prevent multiple injections
  if (document.getElementById('global-styles-injected')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'global-styles-injected';
  style.innerHTML = `
    :root {
      --charcoal: #1C1C1C;
      --white: #FFFFFF;
      --blue: #0084FF;
      --emerald: #2ECC71;
      --gray: #F5F5F5;
      --font: 'Inter', sans-serif;
      --border-radius: 8px;
      --shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      --transition: transform 0.2s ease;
    }

    body {
      font-family: var(--font);
      color: var(--charcoal);
      background-color: #fdfdfd;
      transition: background 0.2s, color 0.2s;
    }

    body.theme-dark {
      --charcoal: #F5F5F5;
      --white: #23272F;
      --blue: #3399FF;
      --emerald: #27AE60;
      --gray: #23272F;
      color: var(--charcoal);
      background-color: #181A20;
    }

    .tagline {
      font-size: 32px;
      color: var(--charcoal);
      margin-bottom: 24px;
      text-align: center;
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
      transition: var(--transition);
    }

    .cta-button:hover {
      transform: scale(1.05);
    }

    .btn-blue {
      background-color: var(--blue);
      color: var(--white);
    }

    .btn-emerald {
      background-color: var(--emerald);
      color: var(--white);
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

    .flex-column {
      display: flex;
      flex-direction: column;
      gap: 32px;
      align-items: center;
      justify-content: center;
    }

    .section-spacing {
      margin: 64px 0;
    }

    .card {
      background: var(--white);
      border: 1px solid #ddd;
      border-radius: var(--border-radius);
      padding: 24px;
      box-shadow: var(--shadow);
      max-width: 800px;
      margin: 0 auto;
      transition: background 0.2s, color 0.2s;
    }

    .card h3 {
      margin: 0 0 8px 0;
      font-size: 20px;
      color: var(--charcoal);
    }

    .card p {
      font-size: 16px;
      line-height: 1.6;
      margin: 0;
    }

    .tag {
      background-color: var(--gray);
      color: var(--charcoal);
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 14px;
      display: inline-block;
    }

    .badge {
      background-color: var(--blue);
      color: var(--white);
      font-size: 12px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 12px;
      display: inline-block;
      text-transform: uppercase;
    }

    .highlight {
      color: var(--blue);
      font-weight: 600;
    }

    @media (max-width: 1024px) {
      .card {
        max-width: 95vw;
      }
    }

    @media (max-width: 768px) {
      .tagline {
        font-size: 24px;
      }
      .page-heading {
        font-size: 22px;
        margin: 32px 0 16px;
      }
      .card {
        padding: 16px;
        max-width: 100vw;
      }
      .cta-button {
        font-size: 15px;
        padding: 10px 20px;
      }
      .flex-column {
        gap: 20px;
      }
    }

    @media (max-width: 480px) {
      .tagline {
        font-size: 18px;
      }
      .page-heading {
        font-size: 16px;
      }
      .card {
        padding: 8px;
      }
    }
  `;
  document.head.appendChild(style);
}
