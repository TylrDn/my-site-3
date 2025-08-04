# MacroSight Deployment Checklist

## Pre-Deployment Validation

### ✅ Static Files Check
- [ ] All static HTML files are in `public/` directory
- [ ] No JavaScript files in `public/` (they belong in `src/`)
- [ ] Only `embed.html` contains postMessage listeners
- [ ] All HTML files are valid and properly formatted

### ✅ Netlify Configuration
- [ ] `netlify.toml` has `publish = "public"`
- [ ] CORS headers configured: `/embed.html` gets `*`, others get specific domain
- [ ] Security headers present: HSTS, CSP, X-Frame-Options, etc.
- [ ] Redirects configured for clean URLs

### ✅ Wix Integration Files
- [ ] `src/public/wix-velo-integration.js` exists and exports `injectHtml` function (WEB MODULE)
- [ ] All page files in `src/pages/` import from `public/wix-velo-integration` (not backend)
- [ ] `embed.html` has proper postMessage handling with whitelisted origins

## Post-Deployment Testing

### 🌐 CORS Headers Test
```bash
# embed.html should return CORS: *
curl -I https://www.macrosight.net/embed.html | grep -i access-control-allow-origin

# Other HTML files should return CORS: https://www.macrosight.net
curl -I https://www.macrosight.net/home.html | grep -i access-control-allow-origin
```

### 🔒 Security Headers Test
```bash
# Check HSTS, CSP, X-Frame-Options
curl -I https://www.macrosight.net/home.html | grep -i "strict-transport-security\|content-security-policy\|x-frame-options"
```

### 📱 Wix Integration Test
1. Open Wix Editor
2. Preview any page with HTML Component
3. Should see: Loading spinner → Content injection
4. Check browser console for errors

## Common Issues & Fixes

### Issue: `embed.html` gets wrong CORS header
**Solution**: Check netlify.toml header order - specific rules must come before general ones

### Issue: Wix pages show "Failed to load"
**Solutions**: 
- Verify the HTML Component ID matches the one in page JS
- Check browser network tab for fetch failures
- Ensure Netlify site is accessible

### Issue: CI fails CORS validation
**Solution**: Wait for Netlify propagation (can take 5-10 minutes) before re-running

## File Change Patterns

### Adding a new static page:
1. Create `public/newpage.html` (pure HTML, no JS)
2. Add redirect rule in `netlify.toml`
3. Create `src/pages/NewPage.xxxxx.js` with injectHtml call
4. Update CI workflow to test the new page

### Updating integration logic:
1. Modify `src/public/wix-velo-integration.js` (WEB MODULE)
2. Test in Wix Preview
3. No changes needed to static files

## Related Documentation
- [TESTING-GUIDE.md](TESTING-GUIDE.md) – step-by-step commands to verify headers and pages
- [DNS-FIX-GUIDE.md](DNS-FIX-GUIDE.md) – instructions for pointing the domain to Netlify
- [WIX-FIX-SUMMARY.md](WIX-FIX-SUMMARY.md) – background on the Wix module relocation

---
**Generated**: $(date)
**Next Review**: Every major deployment
