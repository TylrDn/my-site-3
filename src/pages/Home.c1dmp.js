import { injectGlobalStyles } from 'public/globalStyles';

$w.onReady(function () {
  injectGlobalStyles();

  $w('#homeBox').html = `
    <h1 class="tagline">Strategic Foresight Meets Creative Execution</h1>

    <div class="flex-column section-spacing">
      <p class="card">
        Solving complex problems with a systems approach to innovation, growth,
        and real-world implementation.
      </p>

      <div class="centered-flex">
        <button class="cta-button btn-blue" onclick="window.location.href='/resume'">View Resume</button>
        <button class="cta-button btn-emerald" onclick="window.location.href='/projects'">Explore Projects</button>
        <button class="cta-button btn-dark" onclick="window.location.href='/contact'">Contact</button>
      </div>
    </div>
  `;
});
