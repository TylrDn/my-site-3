// @ts-nocheck
import { fetch } from 'wix-fetch';
import { BASE_ORIGIN } from '../config/origins.js';

/**
 * Injects HTML from Netlify into a Wix HTML Component with loader and error fallback.
 * @param {string} componentId - The Wix HTML Component ID (without #)
 * @param {string} fileSlug - The HTML file name (without .html)
 * @param {string} [loadingMsg] - Optional loading message
 */
export function injectHtml(componentId, fileSlug, loadingMsg = 'Loading...') {
  const $comp = $w(`#${componentId}`);
  if (!$comp) {
    console.warn(`Component #${componentId} not found on this page.`);
    return;
  }

  // 🔄 Show loading placeholder while fetch happens
  $comp.postMessage(`<div style="padding:2em;text-align:center;color:#888;">${loadingMsg}</div>`);

  Promise.all([
    fetch(`${BASE_ORIGIN}/${fileSlug}.html`).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    }),
    fetch(`${BASE_ORIGIN}/styles.css`).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    }),
  ])
    .then(([html, css]) => {
      if (/<(script|style)[\s>]/i.test(html)) {
        $comp.postMessage(
          '<div style="padding:2em;text-align:center;color:#c00;">Invalid content.</div>'
        );
        return;
      }
      $comp.postMessage({ type: 'INJECT', html, css });
    })
    .catch((err) => {
      console.error(`❌ Failed to inject ${fileSlug}.html into #${componentId}`, err);
      $comp.postMessage(
        `<div style="padding:2em;text-align:center;color:#c00;">Sorry, content failed to load. Please try again later.</div>`
      );
    });
}
