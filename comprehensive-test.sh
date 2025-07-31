#!/bin/bash

echo "🧪 COMPREHENSIVE MacroSight Test Suite"
echo "======================================"
echo "📅 $(date)"
echo ""

# Function to check URL with retry
test_url_with_retry() {
    local url=$1
    local expected_cors=$2
    local description=$3
    local max_attempts=3
    local attempt=1
    
    echo "🔍 Testing: $description"
    echo "   URL: $url"
    
    while [ $attempt -le $max_attempts ]; do
        echo "   Attempt $attempt/$max_attempts..."
        
        # Get response
        response=$(curl -s -I "$url" 2>/dev/null)
        status_code=$(echo "$response" | head -n 1 | awk '{print $2}')
        cors_header=$(echo "$response" | grep -i "access-control-allow-origin" | cut -d' ' -f2- | tr -d '\r\n')
        
        if [[ "$status_code" == "200" ]]; then
            echo "   ✅ Status: $status_code OK"
            echo "   📋 CORS: $cors_header"
            
            if [[ "$cors_header" == "$expected_cors" ]]; then
                echo "   ✅ CORS CORRECT: Expected '$expected_cors', Got '$cors_header'"
                return 0
            else
                echo "   ❌ CORS INCORRECT: Expected '$expected_cors', Got '$cors_header'"
                if [ $attempt -eq $max_attempts ]; then
                    return 1
                fi
            fi
        else
            echo "   ❌ Status: $status_code (Expected 200)"
            if [ $attempt -eq $max_attempts ]; then
                return 1
            fi
        fi
        
        if [ $attempt -lt $max_attempts ]; then
            echo "   ⏳ Waiting 10 seconds before retry..."
            sleep 10
        fi
        
        ((attempt++))
    done
    
    return 1
}

# Test results tracking
total_tests=0
passed_tests=0

echo "🌐 NETLIFY DEPLOYMENT TESTS"
echo "==========================="

# Test 1: embed.html (critical for Wix)
((total_tests++))
if test_url_with_retry "https://macrosight.netlify.app/embed.html" "*" "embed.html (Wix embedding)"; then
    ((passed_tests++))
fi
echo ""

# Test 2: home.html (general HTML)
((total_tests++))
if test_url_with_retry "https://macrosight.netlify.app/home.html" "*" "home.html (HTML files)"; then
    ((passed_tests++))
fi
echo ""

# Test 3: styles.css (assets - should be restricted)
((total_tests++))
if test_url_with_retry "https://macrosight.netlify.app/styles.css" "https://www.macrosight.net" "styles.css (assets)"; then
    ((passed_tests++))
fi
echo ""

echo "🛡️ SECURITY HEADERS TEST"
echo "========================"

# Test security headers
echo "🔍 Testing security headers on home.html..."
security_response=$(curl -s -I "https://macrosight.netlify.app/home.html" 2>/dev/null)

((total_tests++))
if echo "$security_response" | grep -qi "strict-transport-security"; then
    echo "   ✅ HSTS: Present"
    ((passed_tests++))
else
    echo "   ❌ HSTS: Missing"
fi

((total_tests++))
if echo "$security_response" | grep -qi "content-security-policy"; then
    echo "   ✅ CSP: Present"
    ((passed_tests++))
else
    echo "   ❌ CSP: Missing"
fi

((total_tests++))
if echo "$security_response" | grep -qi "x-frame-options"; then
    echo "   ✅ X-Frame-Options: Present"
    ((passed_tests++))
else
    echo "   ❌ X-Frame-Options: Missing"
fi

echo ""

echo "📁 FILE STRUCTURE TEST"
echo "======================"

# Test critical files exist
critical_files=("home.html" "about.html" "embed.html" "projects.html" "contact.html")
for file in "${critical_files[@]}"; do
    ((total_tests++))
    status=$(curl -s -I "https://macrosight.netlify.app/$file" | head -n 1 | awk '{print $2}')
    if [[ "$status" == "200" ]]; then
        echo "   ✅ $file: Available (200)"
        ((passed_tests++))
    else
        echo "   ❌ $file: Error ($status)"
    fi
done

echo ""

echo "🎯 WIX INTEGRATION TEST"
echo "======================="

# Check if module structure is correct locally
if [[ -f "src/public/wix-velo-integration.js" ]]; then
    echo "   ✅ wix-velo-integration.js: Located in src/public/ (web module)"
    ((passed_tests++))
else
    echo "   ❌ wix-velo-integration.js: Not found in src/public/"
fi
((total_tests++))

# Check page imports (exclude masterPage.js as it doesn't need the integration)
page_files=($(find src/pages/ -name "*.js" -not -name "masterPage.js" 2>/dev/null))
correct_imports=0
total_page_files=${#page_files[@]}

if [[ $total_page_files -gt 0 ]]; then
    ((total_tests++))
    for page_file in "${page_files[@]}"; do
        if grep -q "from 'public/wix-velo-integration'" "$page_file"; then
            ((correct_imports++))
        fi
    done
    
    if [[ $correct_imports -eq $total_page_files ]]; then
        echo "   ✅ Page imports: All $total_page_files content pages use correct imports"
        ((passed_tests++))
    else
        echo "   ❌ Page imports: Only $correct_imports/$total_page_files files have correct imports"
    fi
else
    echo "   ⚠️  Page imports: No page files found"
fi

echo ""

echo "📊 TEST SUMMARY"
echo "==============="
echo "   Total Tests: $total_tests"
echo "   Passed: $passed_tests"
echo "   Failed: $((total_tests - passed_tests))"

if [[ $passed_tests -eq $total_tests ]]; then
    echo "   🎉 ALL TESTS PASSED!"
    echo ""
    echo "✅ DEPLOYMENT STATUS: Ready for Wix integration"
    echo "✅ NEXT STEPS:"
    echo "   1. Test in Wix Editor Preview"
    echo "   2. Check for any Wix deployment errors"
    echo "   3. Verify content loads in HTML components"
else
    echo "   ⚠️  SOME TESTS FAILED"
    echo ""
    echo "📋 TROUBLESHOOTING:"
    echo "   1. Wait for Netlify propagation (can take 10+ minutes)"
    echo "   2. Check netlify.toml syntax"
    echo "   3. Verify domain DNS settings"
    echo "   4. Clear browser cache"
fi

echo ""
echo "🔗 USEFUL LINKS:"
echo "   Netlify Dashboard: https://app.netlify.com"
echo "   Live Site: https://macrosight.netlify.app"
echo "   GitHub Actions: https://github.com/TylrDn/my-site-3/actions"
echo ""
echo "📝 For detailed testing: see TESTING-GUIDE.md"
echo "======================================"
