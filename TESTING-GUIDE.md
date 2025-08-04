# 🧪 MacroSight Testing Guide

## 📋 **Pre-Testing Checklist**

1. **Ensure Latest Changes Are Deployed**
   ```bash
   # Check if our changes are committed and pushed
   git log --oneline -1
   git status
   ```

2. **Wait for Netlify Propagation** (5-10 minutes after push)
   - Changes need time to propagate through Netlify's CDN
   - Check [Netlify Dashboard](https://app.netlify.com) for deployment status

3. **Run lint checks locally**
   ```bash
   npm test
   ```

## 🌐 **1. Testing CORS Headers**

### **Test embed.html (Should have CORS: *)**
```bash
# Test Netlify deployment directly
curl -I https://macrosight.netlify.app/embed.html | grep access-control-allow-origin

# Expected result: access-control-allow-origin: *
```

### **Test other HTML files (Should have CORS: *)**
```bash
# Test home page
curl -I https://macrosight.netlify.app/home.html | grep access-control-allow-origin

# Expected result: access-control-allow-origin: *
```

### **Test asset files (Should have restricted CORS)**
```bash
# Test CSS file
curl -I https://macrosight.netlify.app/styles.css | grep access-control-allow-origin

# Expected result: access-control-allow-origin: https://www.macrosight.net
```

## 🔒 **2. Testing Security Headers**

```bash
# Test security headers on main pages
curl -I https://macrosight.netlify.app/home.html | grep -E "strict-transport-security|x-frame-options|content-security-policy"

# Expected results:
# strict-transport-security: max-age=63072000; includeSubDomains; preload
# x-frame-options: DENY
# content-security-policy: default-src 'self' https://www.macrosight.net https://macrosight.netlify.app
```

## 📱 **3. Testing Static Pages**

### **Test all pages load correctly**
```bash
# Test each page returns 200 OK
for page in home about projects resume contact invest experience embed; do
  echo "Testing ${page}.html..."
  curl -s -I https://macrosight.netlify.app/${page}.html | head -n 1
done
```

### **Test redirects work**
```bash
# Test clean URL redirects
curl -I https://macrosight.netlify.app/home  # Should redirect to home.html
curl -I https://macrosight.netlify.app/      # Should redirect to home.html
```

## 🎯 **4. Testing Wix Integration**

### **Method 1: Browser Developer Tools**
1. Open browser developer tools (F12)
2. Go to Network tab
3. Visit: https://macrosight.netlify.app/embed.html
4. Check Response Headers for `access-control-allow-origin: *`

### **Method 2: Test postMessage Functionality**
Open browser console on any page and run:
```javascript
// Test postMessage to embed.html
const iframe = document.createElement('iframe');
iframe.src = 'https://macrosight.netlify.app/embed.html';
document.body.appendChild(iframe);

// Wait 2 seconds, then send test message
setTimeout(() => {
  iframe.contentWindow.postMessage(
    '<div style="padding:2em;text-align:center;background:#f0f8ff;border:2px solid #0084ff;border-radius:8px;"><h2>🎉 Test Successful!</h2><p>postMessage integration is working correctly.</p></div>',
    'https://macrosight.netlify.app'
  );
}, 2000);
```

### **Method 3: Wix Editor Testing**
1. Open Wix Editor
2. Go to any page with HTML Component
3. Click Preview
4. Check browser console for errors
5. Verify content loads (spinner → content)

## 🚨 **5. Testing Error Conditions**

### **Test invalid origins (should be rejected)**
```javascript
// This should be rejected by embed.html
iframe.contentWindow.postMessage('test', 'https://malicious-site.com');
```

### **Test malicious content (should be sanitized)**
```javascript
// This should be rejected by safeInject
iframe.contentWindow.postMessage('<script>alert("xss")</script>', 'https://macrosight.netlify.app');
```

## 🔧 **6. Automated Testing with CI**

Run the GitHub Actions workflow:
```bash
# Trigger CI manually
git commit --allow-empty -m "Test deployment"
git push origin main
```

Check the workflow results at:
`https://github.com/TylrDn/my-site-3/actions`

## 📊 **7. Quick Health Check Script**

Save this as `test-deployment.sh`:
```bash
#!/bin/bash
echo "🧪 MacroSight Deployment Health Check"
echo "====================================="

# Test embed.html CORS
echo "📍 Testing embed.html CORS..."
EMBED_CORS=$(curl -s -I https://macrosight.netlify.app/embed.html | grep -i access-control-allow-origin | cut -d' ' -f2-)
if [[ "$EMBED_CORS" == "*" ]]; then
  echo "✅ embed.html CORS: $EMBED_CORS (CORRECT)"
else
  echo "❌ embed.html CORS: $EMBED_CORS (EXPECTED: *)"
fi

# Test home.html CORS  
echo "📍 Testing home.html CORS..."
HOME_CORS=$(curl -s -I https://macrosight.netlify.app/home.html | grep -i access-control-allow-origin | cut -d' ' -f2-)
if [[ "$HOME_CORS" == "*" ]]; then
  echo "✅ home.html CORS: $HOME_CORS (CORRECT)"
else
  echo "❌ home.html CORS: $HOME_CORS (EXPECTED: *)"
fi

# Test CSS CORS (should be restricted)
echo "📍 Testing styles.css CORS..."
CSS_CORS=$(curl -s -I https://macrosight.netlify.app/styles.css | grep -i access-control-allow-origin | cut -d' ' -f2-)
if [[ "$CSS_CORS" == "https://www.macrosight.net" ]]; then
  echo "✅ styles.css CORS: $CSS_CORS (CORRECT)"
else
  echo "❌ styles.css CORS: $CSS_CORS (EXPECTED: https://www.macrosight.net)"
fi

echo "====================================="
echo "🏁 Health check complete!"
```

Run with: `bash test-deployment.sh`

## 🎯 **Expected Results Summary**

| Test | Expected Result | Status |
|------|----------------|--------|
| embed.html CORS | `access-control-allow-origin: *` | ⏳ Waiting for propagation |
| *.html CORS | `access-control-allow-origin: *` | ⏳ Waiting for propagation |
| assets CORS | `access-control-allow-origin: https://www.macrosight.net` | ⏳ Waiting for propagation |
| Security headers | HSTS, CSP, X-Frame-Options present | ✅ Expected to work |
| Wix embedding | Spinner → Content injection | ✅ Expected to work |

## 🔄 **If Tests Fail**

1. **Wait longer** - Netlify can take up to 10 minutes to propagate
2. **Check Netlify Dashboard** for deployment errors
3. **Clear browser cache** if testing in browser
4. **Check domain DNS** - ensure it points to Netlify
5. **Review netlify.toml** syntax for any errors

---
**Last Updated**: July 31, 2025  
**Next Check**: After Netlify propagation completes
