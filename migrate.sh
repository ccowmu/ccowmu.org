#!/bin/bash

# Migration script for CCaWMU website to Hugo
# This script helps migrate the existing static site to Hugo structure

echo "CCaWMU Hugo Migration Script"
echo "============================"

# Move static assets to Hugo static directory
echo "Moving static assets..."

# Copy CSS files
cp -r css/ static/
echo "✓ CSS files moved to static/css/"

# Copy JavaScript files  
cp -r js/ static/
echo "✓ JavaScript files moved to static/js/"

# Copy images
cp -r images/ static/
echo "✓ Images moved to static/images/"

# Copy other static files
cp favicon.ico static/
cp manifest.json static/
cp robots.txt static/
cp sw.js static/
echo "✓ Static files (favicon, manifest, robots.txt, sw.js) moved"

# Move existing minutes content
echo "Processing minutes content..."

if [ -d "minutes/content" ]; then
    # Copy minute files to new content structure
    for file in minutes/content/*.md; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            if [ "$filename" != "_index.md" ]; then
                # Add front matter and copy to new location
                echo "Processing $filename..."
                cp "$file" "content/minutes/"
            fi
        fi
    done
    echo "✓ Minutes content migrated"
else
    echo "! Minutes content directory not found, skipping..."
fi

echo ""
echo "Migration completed!"
echo ""
echo "Next steps:"
echo "1. Review the migrated content in content/ directory"
echo "2. Test the site with: hugo server"
echo "3. Build the site with: hugo"
echo "4. Update any remaining hardcoded paths in templates"
echo ""
echo "Hugo site structure created:"
echo "├── config.toml          # Site configuration"
echo "├── content/             # Page content (Markdown)"
echo "├── static/              # Static assets (CSS, JS, images)"  
echo "├── themes/ccawmu/       # Custom theme"
echo "└── archetypes/          # Content templates"
