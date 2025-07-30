import { injectGlobalStyles } from "public/globalStyles";

$w.onReady(function () {
  injectGlobalStyles();

  $w("#contactBox").html = `
    <h1 class="page-heading">Let’s Build Something Resilient</h1>

    <div class="flex-column">
      <p class="card">
        Interested in collaborating, consulting, or hiring? Reach out using the form below,
        and I’ll be in touch promptly.
      </p>
    </div>
  `;
});
