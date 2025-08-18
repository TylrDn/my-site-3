(function () {
  function patternToRegex(pattern) {
    const escaped = pattern
      .replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      .replace(/\\\*/g, '[^.]+');
    return new RegExp(`^${escaped}$`);
  }
  const root = (window.__MYAPP__ = window.__MYAPP__ || {});
  root.patternToRegex = patternToRegex;
})();
