import { fetch } from 'wix-fetch';

const base = "https://effervescent-salamander-34f5c7.netlify.app";

export function injectHtml(componentId, fileSlug) {
  fetch(`${base}/${fileSlug}.html`)
    .then(res => res.ok ? res.text() : Promise.reject(`HTTP ${res.status}`))
    .then(html => $w(`#${componentId}`).postMessage(html))
    .catch(err => console.error(`Failed to load ${fileSlug}.html into #${componentId}`, err));
}
