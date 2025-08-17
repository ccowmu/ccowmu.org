#!/usr/bin/env bash
set -euo pipefail

# Build minutes first
echo "Building minutes..."
hugo --minify -s minutes

# Build main site
echo "Building main site..."
hugo --minify

# Copy minutes into main public
echo "Copying minutes into public/minutes..."
mkdir -p public/minutes
cp -r minutes/public/* public/minutes/

# Minimal verification
echo "Verifying outputs..."
test -f public/index.html || { echo "Missing public/index.html"; exit 1; }
test -d public/minutes || { echo "Missing public/minutes"; exit 1; }

echo "Build OK: see ./public"
