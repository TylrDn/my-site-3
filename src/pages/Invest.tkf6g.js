import { injectGlobalStyles } from 'public/globalStyles';

$w.onReady(function () {
  injectGlobalStyles();

  $w('#investBox').html = `
    <h1 class="page-heading">Support Future Systems Thinking</h1>

    <div class="flex-column section-spacing">
      <p class="card">
        Help advance systems innovation, open design, and strategic infrastructure for a more resilient digital future.
        Your support enables independent research, collaboration, and sustainable tools.
      </p>

      <div class="centered-flex">
        <button class="cta-button btn-emerald" onclick="window.location.href='https://buymeacoffee.com/yourlink'">Invest</button>
        <button class="cta-button btn-dark" onclick="window.location.href='/contact'">Contact for Collaboration</button>
      </div>
    </div>
  `;
});
