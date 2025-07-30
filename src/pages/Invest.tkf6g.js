import { injectGlobalStyles } from 'public/globalStyles';


$w.onReady(function () {
  injectGlobalStyles();
  $w('#investContainer').html = `
    <div class="centered-flex flex-column section-spacing" style="max-width:1200px;padding:48px;width:100%;box-sizing:border-box;">
      <h1 class="page-heading">Support Future Systems Thinking</h1>
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
