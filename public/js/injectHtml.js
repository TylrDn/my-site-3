

import { fetch } from 'wix-fetch';

// Set to your Netlify production domain
const base = "https://www.macrosight.net";

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
  const url = fileSlug === 'home' ? `${base}/` : `${base}/${fileSlug}.html`;
  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then(html => {
      // Block <script> and <style> injection for security
      if (/<(script|style)[\s>]/i.test(html)) {
        $comp.postMessage('<div style="padding:2em;text-align:center;color:#c00;">Invalid content.</div>');
        return;
      }
      $comp.postMessage(html);
    })
    .catch(err => {
      console.error(`Failed to inject ${fileSlug}.html into #${componentId}`, err);
      $comp.postMessage(`<div style=\"padding:2em;text-align:center;color:#c00;\">Sorry, content failed to load. Please try again later.</div>`);
    });
}
