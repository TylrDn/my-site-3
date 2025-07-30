import { fetch } from 'wix-fetch';

const base = "https://effervescent-salamander-34f5c7.netlify.app";


/**
 * Injects HTML from Netlify into a Wix HTML Component with loader and error fallback.
 * @param {string} componentId - The Wix HTML Component ID (without #)
 * @param {string} fileSlug - The HTML file name (without .html)
 * @param {string} [loadingMsg] - Optional loading message
 */
export function injectHtml(componentId, fileSlug, loadingMsg = "Loading...") {
  const $comp = $w(`#${componentId}`);
  if (!$comp) {
    console.warn(`Component #${componentId} not found on this page.`);
    return;
  }
  // Show loader
  $comp.postMessage(`<div style=\"padding:2em;text-align:center;color:#888;\">${loadingMsg}</div>`);
  fetch(`${base}/${fileSlug}.html`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then(html => {
      $comp.postMessage(html);
    })
    .catch(err => {
      console.error(`Failed to inject ${fileSlug}.html into #${componentId}`, err);
      $comp.postMessage(`<div style=\"padding:2em;text-align:center;color:#c00;\">Sorry, content failed to load. Please try again later.</div>`);
    });
}
