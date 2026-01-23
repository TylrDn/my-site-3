#!/bin/bash
# SSL Certificate Health Check for macrosight.net

echo "🔒 SSL Certificate Status Check"
echo "================================="
echo ""

DOMAIN="macrosight.net"
WWW_DOMAIN="www.macrosight.net"

# Check main domain certificate
echo "Checking $DOMAIN..."
EXPIRY=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)

if [ -z "$EXPIRY" ]; then
  echo "❌ Failed to retrieve certificate for $DOMAIN"
  exit 1
fi

echo "Certificate expires: $EXPIRY"

# Calculate days until expiration
EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y %Z" "$EXPIRY" +%s 2>/dev/null)
NOW_EPOCH=$(date +%s)
DAYS_LEFT=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))

echo "Days until expiration: $DAYS_LEFT"
echo ""

# Status check
if [ $DAYS_LEFT -lt 30 ]; then
  echo "⚠️  WARNING: Certificate expires in less than 30 days!"
  echo "Action: Check Netlify dashboard for renewal status"
elif [ $DAYS_LEFT -lt 60 ]; then
  echo "⚡ Certificate should auto-renew soon (Netlify renews 30 days before expiry)"
else
  echo "✅ Certificate is healthy"
fi

echo ""

# Check if certificate is valid and trusted
echo "Verifying certificate trust chain..."
if echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | grep -q "Verify return code: 0"; then
  echo "✅ Certificate is valid and trusted"
else
  echo "❌ Certificate validation failed"
fi

echo ""

# Check issuer
echo "Certificate details:"
echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -issuer -subject 2>/dev/null

echo ""

# Check www subdomain
echo "Checking $WWW_DOMAIN..."
if curl -sI https://$WWW_DOMAIN | head -n 1 | grep -q "200\|301"; then
  echo "✅ www subdomain is accessible"
else
  echo "⚠️  www subdomain may have issues"
fi

echo ""
echo "✅ SSL check complete!"
