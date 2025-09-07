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

# Pull latest minutes from ccowmu/minutes repository
echo "Pulling latest minutes from ccowmu/minutes repository..."
if [ -d "minutes_src" ]; then
    rm -rf minutes_src
fi
git clone https://github.com/ccowmu/minutes.git minutes_src

# Copy minutes content
echo "Updating minutes content..."
mkdir -p minutes/content
rm -f minutes/content/*.md
for f in minutes_src/minutes/*.md; do
    if [ -f "$f" ]; then
        name=$(basename "$f")
        date=${name%.*}
        year=${date:0:4}
        
        # Create proper front matter for Hugo
        echo "---" > "minutes/content/$name"
        # Cross-platform date parsing (macOS vs Linux)
        if date --version >/dev/null 2>&1; then
            # GNU date (Linux)
            formatted_date=$(date -d "${date:0:4}-${date:4:2}-${date:6:2}" '+%m/%d/%Y' 2>/dev/null || echo 'Unknown Date')
            iso_date=$(date -d "${date:0:4}-${date:4:2}-${date:6:2}" '+%Y-%m-%d' 2>/dev/null || echo '1970-01-01')
        else
            # BSD date (macOS)
            formatted_date=$(date -j -f '%Y%m%d' "$date" '+%m/%d/%Y' 2>/dev/null || echo 'Unknown Date')
            iso_date=$(date -j -f '%Y%m%d' "$date" '+%Y-%m-%d' 2>/dev/null || echo '1970-01-01')
        fi
        echo "title: \"Meeting Minutes – $formatted_date\"" >> "minutes/content/$name"
        echo "date: $iso_date" >> "minutes/content/$name"
        echo "---" >> "minutes/content/$name"
        
        # Add the content (skip any existing front matter)
        awk '/^---$/{if(++c==2) f=1; next} f' "$f" >> "minutes/content/$name"
        
        echo "Processed: $name"
    fi
done

# Clean up temporary directory
rm -rf minutes_src
echo "Minutes update complete."

# Build minutes first
echo "Building minutes..."
hugo --minify --cleanDestinationDir -s minutes

# Build main site
echo "Building main site..."
hugo --minify --cleanDestinationDir

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
