import { injectGlobalStyles } from 'public/globalStyles';


$w.onReady(function () {
  injectGlobalStyles();
  $w('#experienceContainer').html = `
    <div class="centered-flex flex-column section-spacing" style="max-width:1200px;padding:48px;width:100%;box-sizing:border-box;">
      <h1 class="page-heading">A Timeline of Systems Thinking in Action</h1>
      <div class="card">
        <ul class="experience-list">
          <li><strong>2024–Now</strong> — Strategic Systems Consultant, Cross-sector Innovation (Energy, AI, FinOps)</li>
          <li><strong>2022–2024</strong> — Senior Product Strategist, Grid-Scale SaaS Optimization (Enterprise)</li>
          <li><strong>2020–2022</strong> — Cloud Infrastructure Lead, Sustainable Energy Projects</li>
          <li><strong>2018–2020</strong> — UX & Ops Designer, AI/ML Platform Integration</li>
          <li><strong>2016–2018</strong> — Systems Analyst, Smart Cities + Edge Deployment Architectures</li>
        </ul>
      </div>
    </div>
  `;
});
