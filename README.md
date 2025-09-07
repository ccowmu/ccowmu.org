# Computer Club at Western Michigan University Website

Static website built with Hugo. This repo contains two Hugo sites:
- Main site (root) - uses `config.toml`
- Minutes subsite in `minutes/` (published at `/minutes/`) - uses `minutes/config.toml`

The build stitches them together into a single static export in `public/`.

## Local development

Prereqs
- Install Hugo (extended): https://gohugo.io/installation/

Run
- Main site: `hugo server`
- Minutes only: `hugo server -s minutes`
- Visit http://localhost:1313

Notes
- We use `relativeURLs = true` and Hugo’s `relURL` helpers so links work at root domains (cclub.cs.wmich.edu) and subpaths (GitHub Pages).
- The minutes subsite owns `/minutes/`. Do not place content under `content/minutes/` in the main site.

## Repository layout

- `content/` – Main site content (Markdown)
- `layouts/` – Main site templates and partials
- `static/` – Global static assets (CSS, JS, images)
- `minutes/` – Standalone Hugo site for meeting minutes
- `public/` – Build output (generated)

## Minutes subsite

- Built separately with its own theme/templates and then published under `/minutes/` in the main export.
- Breadcrumbs and assets use relative paths, so pages work both at root and subpath hosting.
- RSS is at `index.xml` (not `rss.xml`).

## Adding new meeting minutes

To add new meeting minutes:

1. **Add to the minutes repository**: https://github.com/ccowmu/minutes
   - Create a new file in the `minutes/` directory with the naming format `YYYYMMDD.md` (e.g., `20250116.md`)
   - Use standard Markdown format (front matter will be generated automatically)

2. **Update this site**:
   ```bash
   # The test-build script automatically pulls latest minutes
   ./test-build.sh
   ```

**Note**: Minutes content is pulled from the separate [ccowmu/minutes](https://github.com/ccowmu/minutes) repository during build.

## Build and deploy

Manual build
```bash
# From repo root
./build.sh
```
The script:
- Pulls latest minutes from https://github.com/ccowmu/minutes
- Processes minutes content and generates Hugo front matter automatically
- Fails fast if the main site has any files under `content/minutes/` (the minutes subsite must own `/minutes/`)
- Builds minutes and main with `--cleanDestinationDir` to avoid stale files
- Replaces `public/minutes` with the minutes build output

Deploy
- Publish `public/` to your web root: `rsync -av public/ /var/www/ccowmu/_site/`

## Server Deployment

To deploy the site on the server:

1. Run the pull script to update the repository:
   ```bash
   ~/server-rebuild/containers$ ./pull-website.sh
   ```

2. Navigate to the site directory and build:
   ```bash
   cd ~/server-rebuild/containers/ccowmu.org
   ./build.sh
   ```

That's it! The site will be built and deployed automatically.


## Making changes

- Edit content: `content/`
- Templating/partials: `layouts/`
- Styles/JS: `static/` and `themes/ccawmu/`
- Minutes content is automatically pulled from the [ccowmu/minutes repository](https://github.com/ccowmu/minutes) during build

## Troubleshooting

- Minutes page shows raw front matter (e.g., a page titled “Meeting Minutes” with YAML/TOML text):
	- Remove any files under `content/minutes/` in the main site; re-run `./test-build.sh` (it will fail and list offending files).
- Broken links to minutes like `/minutes/minutes/...`:
	- Ensure you haven’t hard-coded absolute paths in templates; we use relative links in the minutes templates.
- RSS feed location:
	- Use `index.xml` for feeds (root: `/index.xml`, minutes: `/minutes/index.xml`).

