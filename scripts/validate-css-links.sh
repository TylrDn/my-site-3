#!/bin/bash
set -euo pipefail
missing=$(grep -L '<link rel="stylesheet" href="/styles.css"' public/*.html | grep -v 'public/header.html' || true)
if [ -n "$missing" ]; then
  echo "❌ Missing /styles.css link in:"
  echo "$missing"
  exit 1
fi
echo "✅ All pages include /styles.css"
