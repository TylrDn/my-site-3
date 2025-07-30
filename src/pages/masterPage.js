$w.onReady(function () {
  injectGlobalStyles();
  // All site-wide elements (e.g., sticky header, footer, overlays) should be placed inside #siteFrameContainer
  // Example (uncomment and adapt as needed):
  // $w('#siteFrameContainer').add($w('#siteHeader'));
  // $w('#siteFrameContainer').add($w('#siteFooter'));
  // $w('#siteFrameContainer').add($w('#siteOverlay'));

  // Remove any floating/unwrapped elements and ensure all are inside #siteFrameContainer

  // 💡 Shared scroll behavior / page-level interactions can be added here
});
