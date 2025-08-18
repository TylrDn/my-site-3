export function waitForIframe(iframe, { timeoutMs = 10000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!iframe) {
      reject(new Error('Iframe element not found'));
      return;
    }

    const onLoad = () => {
      clearTimeout(timer);
      iframe.removeEventListener('load', onLoad);
      resolve(iframe.contentWindow);
    };

    const timer = setTimeout(() => {
      iframe.removeEventListener('load', onLoad);
      reject(new Error('Iframe did not load within timeout'));
    }, timeoutMs);

    iframe.addEventListener('load', onLoad, { once: true });

    // If iframe already loaded (cached)
    if (iframe.contentWindow && iframe.complete) {
      onLoad();
    }
  });
}
