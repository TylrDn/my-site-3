#!/bin/bash
set -e

echo "Running basic lint checks..."
npm run lint
npm run lint:html
echo "All checks passed."
