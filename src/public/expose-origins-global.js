import { patternToRegex } from '../config/origins.js';

(function attach() {
  const root = (window.__MYAPP__ = window.__MYAPP__ || {});
  root.patternToRegex = patternToRegex;
})();
