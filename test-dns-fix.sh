#!/bin/bash

echo "🔍 Testing DNS Configuration After Nameserver Change"
echo "=================================================="
echo ""

echo "1️⃣ Checking nameservers:"
dig NS macrosight.net | grep -A2 "ANSWER SECTION"
echo ""

echo "2️⃣ Checking root domain resolution:"
dig +short macrosight.net
echo ""

echo "3️⃣ Checking www subdomain resolution:"
dig +short www.macrosight.net
echo ""

echo "4️⃣ Testing Netlify connectivity:"
curl -I https://www.macrosight.net/embed.html 2>/dev/null | head -5
echo ""

echo "✅ Expected nameservers: dns1.p01.nsone.net, dns2.p01.nsone.net"
echo "✅ Expected root domain: 75.2.60.5"  
echo "✅ Expected www domain: macrosight.netlify.app"
echo "✅ Expected server header: Netlify"
