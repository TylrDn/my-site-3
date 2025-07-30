// @ts-nocheck
import { fetch } from 'wix-fetch';

// ✅ Use production-safe Netlify domain with valid CORS headers
const base = "https://macrosight.netlify.app";

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

  // 🔄 Show loading placeholder while fetch happens
  $comp.postMessage(`<div style="padding:2em;text-align:center;color:#888;">${loadingMsg}</div>`);

  fetch(`${base}/${fileSlug}.html`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.text();
    })
    .then(html => {
      // 🔒 Sanitize: block <script> and <style> for safety
      if (/<(script|style)[\s>]/i.test(html)) {
        $comp.postMessage('<div style="padding:2em;text-align:center;color:#c00;">Invalid content.</div>');
        return;
      }
      // ✅ Inject content if safe
      $comp.postMessage(html);
    })
    .catch(err => {
      console.error(`❌ Failed to inject ${fileSlug}.html into #${componentId}`, err);
      $comp.postMessage(`<div style="padding:2em;text-align:center;color:#c00;">Sorry, content failed to load. Please try again later.</div>`);
    });
}
