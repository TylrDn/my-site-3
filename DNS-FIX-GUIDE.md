# 🚨 DNS CONFIGURATION ISSUE - SOLUTION GUIDE

## 🔍 **PROBLEM IDENTIFIED**
Your `www.macrosight.net` domain is pointing to **Wix DNS** instead of **Netlify**.

**Current DNS:**
- `www.macrosight.net` → `cdn1.wixdns.net` (WIX) ❌
- `macrosight.netlify.app` → Netlify (WORKING) ✅

## 🎯 **SOLUTION: Fix DNS Configuration**

### **Option 1: Use Netlify DNS (Recommended)**

1. **In Netlify Dashboard:**
   - Go to your site settings
   - Click "Domain settings"
   - Look for your domain `macrosight.net`
   - Click "Options" → "Use Netlify DNS"

2. **Update Your Domain Registrar:**
   - Go to where you bought `macrosight.net` (GoDaddy, Namecheap, etc.)
   - Change nameservers to Netlify's:
     ```
     dns1.p01.nsone.net
     dns2.p01.nsone.net
     dns3.p01.nsone.net
     dns4.p01.nsone.net
     ```

### **Option 2: Manual DNS Records**

If you want to keep your current DNS provider:

1. **In your DNS provider, set these records:**
   ```
   Type: CNAME
   Name: www
   Value: macrosight.netlify.app
   
   Type: A (or ALIAS/ANAME)
   Name: @ (or blank for root domain)
   Value: 75.2.60.5 (or use CNAME to macrosight.netlify.app if supported)
   ```

## 🧪 **IMMEDIATE WORKAROUND**

While DNS propagates, you can test using:
- ✅ `https://macrosight.netlify.app/embed.html` (always works)
- ✅ Use this URL in your Wix integration for now

**Update your Wix integration to use:**
```javascript
const response = await fetch('https://macrosight.netlify.app/home.html');
```

## ⏰ **TIMELINE**
- **DNS Change**: 5 minutes in registrar
- **Propagation**: 2-24 hours globally  
- **Netlify Recognition**: 5-15 minutes after propagation

## 🔍 **HOW TO VERIFY FIX**

**Test command:**
```bash
dig www.macrosight.net
```

**Expected result after fix:**
```
www.macrosight.net. IN CNAME macrosight.netlify.app.
```

**NOT:**
```
www.macrosight.net. IN CNAME cdn1.wixdns.net. ❌
```

## 🎯 **NEXT STEPS**
1. Fix DNS configuration (above)
2. Wait for propagation  
3. Test: `curl -I https://www.macrosight.net/embed.html`
4. Should see `server: Netlify` instead of `server: Pepyaka`

---
**🚀 Once DNS is fixed, your CORS headers and Wix integration will work perfectly!**
