import { injectGlobalStyles } from 'public/globalStyles';

$w.onReady(function () {
  injectGlobalStyles();

  $w("#projectsBox").html = `
    <section class="section-spacing">
      <h1 class="page-heading">Selected Projects</h1>

      <div class="flex-column">

        <div class="card">
          <h3>AI Integration Strategy</h3>
          <p>
            <strong>Problem:</strong> Disconnected data silos and slow model deployment.<br>
            <strong>Solution:</strong> Built unified API + inference layer across cloud functions.<br>
            <strong>Outcome:</strong> Reduced model delivery cycle by 60%.
          </p>
        </div>

        <div class="card">
          <h3>Enterprise UX Redesign</h3>
          <p>
            <strong>Problem:</strong> High churn from complex onboarding.<br>
            <strong>Solution:</strong> Applied user-centered design to refactor workflows.<br>
            <strong>Outcome:</strong> Increased retention by 25%, NPS +18pts.
          </p>
        </div>

        <div class="card">
          <h3>B2B SaaS Optimization Platform</h3>
          <p>
            <strong>Problem:</strong> Legacy backend failing at scale.<br>
            <strong>Solution:</strong> Re-architected for microservices + added FinOps controls.<br>
            <strong>Outcome:</strong> 40% infra cost savings, 3× faster load times.
          </p>
        </div>

      </div>
    </section>
  `;
});

