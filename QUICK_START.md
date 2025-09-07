# Quick Start Guide

## Adding New Meeting Minutes

1. **Create the file:**
   ```bash
   # Navigate to minutes content directory
   cd minutes/content/
   
   # Create new file with date format YYYYMMDD.md
   touch 20250123.md  # example for January 23, 2025
   ```

2. **Add front matter:**
   ```yaml
   ---
   title: "Meeting Minutes – 01/23/2025"
   date: 2025-01-23
   ---
   ```

3. **Add content:**
   ```markdown
   # Computer Club at WMU meeting minutes for January 23rd, 2025
   Minutes taken by [your name]
   
   ## Attendance
   * member1
   * member2
   
   ## Topics Discussed
   ...
   ```

4. **Build and test:**
   ```bash
   # From repo root
   ./test-build.sh
   
   # Serve locally to test
   hugo server
   # Visit http://localhost:1313
   ```

## Local Development Commands

```bash
# Main site only
hugo server

# Minutes only  
hugo server -s minutes

# Full build for deployment
./test-build.sh
```

## Publishing to Production

1. Set `underConstruction = false` in both `config.toml` and `minutes/config.toml`
2. Update `baseURL` in `config.toml` to `https://cclub.cs.wmich.edu/`
3. Run `./test-build.sh`
4. Deploy `public/` folder to web server
