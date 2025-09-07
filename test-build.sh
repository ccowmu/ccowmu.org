#!/usr/bin/env bash
set -euo pipefail

# Ensure we're in the correct directory
cd "$(dirname "$0")"

# Guard: ensure root site does not have its own /minutes/ content
if [ -d content/minutes ]; then
	if find content/minutes -type f ! -name '.gitkeep' -print -quit | grep -q .; then
		echo "Error: root content/minutes/ contains files. Remove them so the minutes subsite owns /minutes/." >&2
		echo "Offending files:" >&2
		find content/minutes -type f ! -name '.gitkeep' >&2
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
        
        # Validate date format (YYYYMMDD)
        if [[ ! "$date" =~ ^[0-9]{8}$ ]]; then
            echo "Warning: Invalid date format in filename: $name" >&2
            continue
        fi
        
        year=${date:0:4}
        month=${date:4:2}
        day=${date:6:2}
        
        # Validate date components (remove leading zeros to avoid octal interpretation)
        year_num=$((10#$year))
        month_num=$((10#$month))
        day_num=$((10#$day))
        
        if (( year_num < 1900 || year_num > 2100 || month_num < 1 || month_num > 12 || day_num < 1 || day_num > 31 )); then
            echo "Warning: Invalid date in filename: $name" >&2
            continue
        fi
        
        # Create proper front matter for Hugo
        echo "---" > "minutes/content/$name"
        
        # Cross-platform date parsing (macOS vs Linux)
        # Detect OS type more reliably
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS (BSD date)
            formatted_date=$(date -j -f '%Y%m%d' "$date" '+%m/%d/%Y' 2>/dev/null || echo "Invalid Date ($date)")
            iso_date=$(date -j -f '%Y%m%d' "$date" '+%Y-%m-%d' 2>/dev/null || echo "$year-$month-$day")
        else
            # Linux and other systems (GNU date)
            formatted_date=$(date -d "$year-$month-$day" '+%m/%d/%Y' 2>/dev/null || echo "Invalid Date ($date)")
            iso_date=$(date -d "$year-$month-$day" '+%Y-%m-%d' 2>/dev/null || echo "$year-$month-$day")
        fi
        
        echo "title: \"Meeting Minutes – $formatted_date\"" >> "minutes/content/$name"
        echo "date: $iso_date" >> "minutes/content/$name"
        echo "---" >> "minutes/content/$name"
        
        # Add the content - handle files with or without existing front matter
        if grep -q "^---$" "$f"; then
            # File has front matter, skip it
            awk '/^---$/{if(++c==2) f=1; next} f' "$f" >> "minutes/content/$name"
        else
            # File has no front matter, copy entire content
            cat "$f" >> "minutes/content/$name"
        fi
        
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
