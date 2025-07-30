import { injectGlobalStyles } from 'public/globalStyles.js';


$w.onReady(function () {
  injectGlobalStyles();
  $w('#resumeBox').html = `
    <div class="centered-flex flex-column section-spacing" style="max-width:1200px;padding:48px;width:100%;box-sizing:border-box;">
      <h1 class="page-heading">Résumé & Core Capabilities</h1>
      <div class="flex-column">
        <p class="card">
          A snapshot of cross-functional expertise — systems strategy, product leadership,
          and infrastructure design.
        </p>
        <a
          href="https://static.wixstatic.com/media/your-resume.pdf"
          target="_blank"
          class="cta-button btn-dark"
        >
          Download Resume
        </a>
      </div>
    </div>
  `;
});
