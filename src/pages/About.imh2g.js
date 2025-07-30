import { injectGlobalStyles } from 'public/globalStyles';

$w.onReady(function () {
  injectGlobalStyles();

  $w("#aboutBox").html = `
    <h1 class="page-heading">Strategy + Systems + Impact</h1>

    <div class="flex-column section-spacing">
      <p class="card">
        Taylor Dean is a cross-disciplinary strategist, systems designer, and product leader
        working at the intersection of infrastructure, innovation, and human-centered technology.
        With a background spanning cloud architecture, sustainable energy, and digital transformation,
        Taylor brings a systems approach to problem-solving and measurable impact to every engagement.
      </p>

      <div class="centered-flex">
        <button class="cta-button btn-blue" onclick="window.location.href='/resume'">View Resume</button>
        <button class="cta-button btn-dark" onclick="window.location.href='/projects'">Explore Projects</button>
      </div>
    </div>
  `;
});

