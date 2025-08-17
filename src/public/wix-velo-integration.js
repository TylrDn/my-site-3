// Wix Velo integration for MacroSight.net - WEB MODULE
// This module provides the injectHtml function for embedding static content
//
// DEPLOYMENT NOTE: This file works with the postMessage architecture in embed.html
// - Step 1: Points iframe to embed.html (shows loading spinner)
// - Step 2: Fetches the target static HTML and CSS from the site
// - Step 3: Posts `{ type: 'INJECT', html, css }` via postMessage to embed.html iframe
// - Step 4: embed.html safeInject() validates and displays content
//
// SECURITY: Only whitelisted origins can receive postMessages (see embed.html)
// Note: $w is a Wix Velo global variable available in the Wix environment
// Note: This is a WEB MODULE - can be imported by both backend and frontend code

import { fetch } from 'wix-fetch';

/**
 * Injects HTML content into a Wix HTML Component via embed.html iframe
 * @param {string} componentId - The Wix HTML Component ID (without #)
 * @param {string} pageName - The page name to load (e.g., 'home', 'about')
 */
export async function injectHtml(componentId, pageName) {
  try {
    // Find the HTML component
    const htmlComponent = $w(`#${componentId}`);
    if (!htmlComponent) {
      console.warn(`Component #${componentId} not found on this page.`);
      return;
    }

    // Set the iframe source to embed.html with loading spinner
    htmlComponent.src = 'https://macrosight.net/embed.html';

    // Wait for the iframe to load
    await new Promise((resolve) => {
      const checkIframe = () => {
        if (htmlComponent.contentWindow) {
          resolve();
        } else {
          setTimeout(checkIframe, 100);
        }
      };
      checkIframe();
    });

    // Give the iframe a moment to fully initialize
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Fetch the page content
    const [htmlContent, css] = await Promise.all([
      fetch(`https://macrosight.net/${pageName}.html`).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      }),
      fetch('https://macrosight.net/styles.css').then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      }),
    ]);

    const iframe = htmlComponent.contentWindow;
    iframe.postMessage({ type: 'INJECT', html: htmlContent, css }, 'https://macrosight.net');
  } catch (error) {
    console.error(`Failed to inject ${pageName}.html into #${componentId}:`, error);

    // Fallback - try to load embed.html directly
    const htmlComponent = $w(`#${componentId}`);
    if (htmlComponent) {
      htmlComponent.src = `https://macrosight.net/embed.html`;
    }
  }
}
