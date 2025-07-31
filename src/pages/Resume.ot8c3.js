
import { injectGlobalStyles } from 'public/globalStyles';
import { injectHtml } from 'public/injectHtml';


$w.onReady(function () {
  injectGlobalStyles();
  injectHtml('resumeHtml', 'resume');
});
