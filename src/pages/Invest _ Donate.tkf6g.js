
import { injectGlobalStyles } from 'public/globalStyles';
import { injectHtml } from 'backend/wix-velo-integration';

$w.onReady(function () {
  injectGlobalStyles();
  injectHtml('investHtml', 'invest');
});
