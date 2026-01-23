#!/bin/bash
# Comprehensive Security Test for macrosight.net

echo "🔐 Security Audit for macrosight.net"
echo "====================================="
echo ""

URL="https://macrosight.net"

echo "📋 Testing Security Headers..."
echo "------------------------------"

# Function to check header
check_header() {
  HEADER=$1
  DESCRIPTION=$2
  if curl -sI "$URL" | grep -qi "$HEADER"; then
    echo "✅ $DESCRIPTION"
  else
    echo "❌ $DESCRIPTION - MISSING"
  fi
}

check_header "strict-transport-security" "HSTS (HTTP Strict Transport Security)"
check_header "content-security-policy" "CSP (Content Security Policy)"
check_header "x-frame-options" "X-Frame-Options (Clickjacking Protection)"
check_header "x-content-type-options" "X-Content-Type-Options (MIME Sniffing Protection)"
check_header "x-xss-protection" "X-XSS-Protection"
check_header "referrer-policy" "Referrer-Policy"

echo ""
echo "🔒 SSL/TLS Configuration..."
echo "---------------------------"

# Check TLS version
echo "Supported protocols:"
echo | openssl s_client -connect macrosight.net:443 -tls1_2 2>/dev/null | grep -q "Protocol" && echo "✅ TLS 1.2 supported"
echo | openssl s_client -connect macrosight.net:443 -tls1_3 2>/dev/null | grep -q "Protocol" && echo "✅ TLS 1.3 supported"

echo ""
echo "Certificate issuer:"
echo | openssl s_client -connect macrosight.net:443 -servername macrosight.net 2>/dev/null | openssl x509 -noout -issuer | cut -d= -f2-

echo ""
echo "🌐 DNS & Domain Security..."
echo "---------------------------"

# Check CAA records
echo "CAA Records (Certificate Authority Authorization):"
CAA=$(dig macrosight.net CAA +short 2>/dev/null)
if [ -z "$CAA" ]; then
  echo "⚠️  No CAA records found (recommended to add for extra security)"
else
  echo "✅ CAA records configured:"
  echo "$CAA"
fi

echo ""
echo "🚀 HTTP to HTTPS Redirect..."
echo "----------------------------"

HTTP_REDIRECT=$(curl -sI http://macrosight.net | head -n 1)
if echo "$HTTP_REDIRECT" | grep -q "301\|302"; then
  echo "✅ HTTP redirects to HTTPS"
else
  echo "⚠️  HTTP redirect may not be configured"
fi

echo ""
echo "🔍 Site Accessibility..."
echo "------------------------"

# Check main domain
if curl -sI "$URL" | head -n 1 | grep -q "200"; then
  echo "✅ macrosight.net is accessible"
else
  echo "❌ macrosight.net is not accessible"
fi

# Check www subdomain
if curl -sI "https://www.macrosight.net" | head -n 1 | grep -q "200\|301"; then
  echo "✅ www.macrosight.net is accessible"
else
  echo "❌ www.macrosight.net is not accessible"
fi

echo ""
echo "✅ Security audit complete!"
echo ""
echo "💡 Recommendations:"
echo "- Run this script monthly to monitor security posture"
echo "- Check https://securityheaders.com/?q=macrosight.net for detailed analysis"
echo "- Check https://www.ssllabs.com/ssltest/analyze.html?d=macrosight.net for SSL rating"
