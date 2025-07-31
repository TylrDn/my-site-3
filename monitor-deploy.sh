#!/bin/bash

echo "🔄 MONITORING NETLIFY REDEPLOY"
echo "=============================="
echo "⏰ Started: $(date)"
echo ""

check_count=0
max_checks=20  # 10 minutes of checking

while [ $check_count -lt $max_checks ]; do
    ((check_count++))
    echo "🔍 Check #$check_count at $(date '+%H:%M:%S')"
    
    # Get headers
    response=$(curl -s -I https://macrosight.netlify.app/embed.html)
    cors_header=$(echo "$response" | grep -i "access-control-allow-origin" | cut -d' ' -f2- | tr -d '\r\n')
    cache_status=$(echo "$response" | grep -i "cache-status" | tr -d '\r\n')
    age=$(echo "$response" | grep -i "^age:" | cut -d' ' -f2- | tr -d '\r\n')
    
    echo "   CORS: $cors_header"
    echo "   Cache: $cache_status"
    echo "   Age: $age"
    
    # Check if we got the expected CORS header
    if [[ "$cors_header" == "*" ]]; then
        echo ""
        echo "🎉 SUCCESS! CORS headers updated!"
        echo "✅ embed.html now has: access-control-allow-origin: *"
        echo "✅ Wix embedding should now work!"
        echo ""
        echo "🧪 NEXT STEPS:"
        echo "1. Test Wix integration in Editor Preview"
        echo "2. Run ./quick-test.sh for full validation"
        echo "3. Check that content loads without CORS errors"
        exit 0
    fi
    
    # Check if cache is fresh
    if [[ "$cache_status" == *"hit"* ]] && [[ "$age" == "0" ]]; then
        echo "   ✅ Fresh cache detected, but CORS still old value"
    elif [[ "$cache_status" == *"stale"* ]]; then
        echo "   ⏳ Cache still stale, waiting for fresh deploy..."
    fi
    
    echo ""
    
    if [ $check_count -lt $max_checks ]; then
        echo "   ⏳ Waiting 30 seconds before next check..."
        sleep 30
    fi
done

echo "⚠️  Still waiting for CORS headers to update after $max_checks checks"
echo "💡 This is normal - CDN propagation can take longer sometimes"
echo ""
echo "🔄 MANUAL CHECK:"
echo "curl -I https://macrosight.netlify.app/embed.html | grep access-control-allow-origin"
echo ""
echo "🎯 EXPECTED RESULT:"
echo "access-control-allow-origin: *"
