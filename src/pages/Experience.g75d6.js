import { injectGlobalStyles } from 'public/globalStyles';
import { injectHtml } from 'public/wix-velo-integration';


$w.onReady(function () {
  injectGlobalStyles();
  injectHtml('experienceHtml', 'experience');
});
