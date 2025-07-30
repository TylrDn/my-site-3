import { injectGlobalStyles } from 'public/globalStyles';


$w.onReady(function () {
  injectGlobalStyles();
  $w('#contactContainer').html = `
    <div class="centered-flex flex-column section-spacing" style="max-width:1200px;padding:48px;width:100%;box-sizing:border-box;">
      <h1 class="page-heading">Let’s Build Something Resilient</h1>
      <div class="flex-column">
        <p class="card">
          Interested in collaborating, consulting, or hiring? Reach out using the form below,
          and I’ll be in touch promptly.
        </p>
      </div>
    </div>
  `;
});
