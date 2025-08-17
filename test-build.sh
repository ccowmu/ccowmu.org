#!/usr/bin/env bash
set -euo pipefail

# Guard: ensure root site does not have its own /minutes/ content
if [ -d content/minutes ]; then
	if find content/minutes -type f \( ! -name '.gitkeep' \) | grep -q .; then
		echo "Error: root content/minutes/ contains files. Remove them so the minutes subsite owns /minutes/." >&2
		echo "Offending files:" >&2
		find content/minutes -type f \( ! -name '.gitkeep' \) >&2
		exit 1
	fi
fi

# Build minutes first
echo "Building minutes..."
hugo --minify --cleanDestinationDir -s minutes

# Build main site
echo "Building main site..."
hugo --minify --cleanDestinationDir -b "http://localhost:1313/ccowmu.org/"

# Copy minutes into main public
echo "Copying minutes into public/minutes..."
rm -rf public/minutes
mkdir -p public/minutes
cp -r minutes/public/* public/minutes/

# Minimal verification
echo "Verifying outputs..."
test -f public/index.html || { echo "Missing public/index.html"; exit 1; }
test -d public/minutes || { echo "Missing public/minutes"; exit 1; }

echo "Build OK: see ./public"
