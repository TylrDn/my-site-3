#!/bin/bash

echo "🧪 MacroSight Deployment Quick Test"
echo "===================================="
echo ""

# Check if we're testing the right domain
echo "🔍 Testing production deployment..."
echo ""

# Function to extract header value
get_header() {
    local url=$1
    local header=$2
    curl -s -I "$url" | grep -i "$header" | cut -d' ' -f2- | tr -d '\r\n'
}

# Test embed.html CORS
echo "📍 Testing embed.html CORS header..."
EMBED_CORS=$(get_header "https://macrosight.net/embed.html" "access-control-allow-origin")
echo "   Result: $EMBED_CORS"
if [[ "$EMBED_CORS" == "*" ]]; then
    echo "   ✅ CORRECT (allows Wix embedding)"
else
    echo "   ❌ INCORRECT (should be '*' for Wix embedding)"
    echo "   🔄 Changes may still be propagating..."
fi
echo ""

# Test home.html CORS
echo "📍 Testing home.html CORS header..."
HOME_CORS=$(get_header "https://macrosight.net/home.html" "access-control-allow-origin")
echo "   Result: $HOME_CORS"
if [[ "$HOME_CORS" == "*" ]]; then
    echo "   ✅ CORRECT (allows cross-origin fetching)"
else
    echo "   ❌ INCORRECT (should be '*' for fetching)"
    echo "   🔄 Changes may still be propagating..."
fi
echo ""

# Test CSS CORS (should be restricted)
echo "📍 Testing styles.css CORS header..."
CSS_CORS=$(get_header "https://macrosight.net/styles.css" "access-control-allow-origin")
echo "   Result: $CSS_CORS"
if [[ "$CSS_CORS" == "https://macrosight.net" ]]; then
    echo "   ✅ CORRECT (properly restricted)"
else
    echo "   ❌ INCORRECT (should be 'https://macrosight.net')"
    echo "   🔄 Changes may still be propagating..."
fi
echo ""

# Test page availability
echo "📍 Testing page availability..."
STATUS=$(curl -s -I https://macrosight.net/embed.html | head -n 1 | awk '{print $2}')
if [[ "$STATUS" == "200" ]]; then
    echo "   ✅ Pages loading correctly (HTTP 200)"
else
    echo "   ❌ Page load issue (HTTP $STATUS)"
fi
echo ""

# Test security headers
echo "📍 Testing security headers..."
HSTS=$(get_header "https://macrosight.net/home.html" "strict-transport-security")
if [[ -n "$HSTS" ]]; then
    echo "   ✅ HSTS enabled: $HSTS"
else
    echo "   ❌ HSTS missing"
fi

CSP=$(get_header "https://macrosight.net/home.html" "content-security-policy")
if [[ -n "$CSP" ]]; then
    echo "   ✅ CSP enabled: ${CSP:0:50}..."
else
    echo "   ❌ CSP missing"
fi
echo ""

echo "===================================="
echo "🏁 Quick test complete!"
echo ""
echo "📝 Next steps:"
echo "   1. If headers are wrong, wait 5-10 minutes for propagation"
echo "   2. Test Wix integration in Editor Preview"
echo "   3. Check GitHub Actions for full validation"
echo ""
echo "📚 For detailed testing, see: TESTING-GUIDE.md"
