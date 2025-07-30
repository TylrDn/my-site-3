import { injectGlobalStyles } from 'public/globalStyles';

$w.onReady(function () {
  injectGlobalStyles();

  // 🔁 Sticky Header (optional behavior — uncomment if desired)
  // $w("#siteHeader").onViewportLeave(() => {
  //   $w("#siteHeader").collapse();
  // });
  // $w("#siteHeader").onViewportEnter(() => {
  //   $w("#siteHeader").expand();
  // });

  // 🕒 Auto-update footer year
  const currentYear = new Date().getFullYear();
  if ($w('#footerYear')) {
    $w('#footerYear').text = `${currentYear}`;
  }

  // 💡 Shared scroll behavior / page-level interactions can be added here
});
