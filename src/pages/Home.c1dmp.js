import { injectGlobalStyles } from 'public/globalStyles';


$w.onReady(function () {
  injectGlobalStyles();
  // Fetch the full HTML template and inject it into the HTML Component
  fetch('/wix-injections/home.html')
    .then(res => res.text())
    .then(html => {
      $w('#homeHtml').postMessage(html);
    })
    .catch(err => {
      console.error('Failed to load home.html:', err);
      // Fallback: show a minimal message
      $w('#homeHtml').postMessage('<div style="padding:48px;text-align:center;">Unable to load content.</div>');
    });
});
