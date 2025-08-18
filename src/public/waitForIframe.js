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
    try {
      const doc = iframe.contentWindow && iframe.contentWindow.document;
      if (doc && (doc.readyState === 'complete' || doc.readyState === 'interactive')) {
        Promise.resolve().then(onLoad);
      }
    } catch {
      // cross-origin: cannot read, rely on 'load' event
    }
  });
}
