# Computer Club at Western Michigan University Website

Static website built with Hugo. This repo contains two Hugo sites:
- Main site (root)
- Minutes subsite in `minutes/` (published at `/minutes/`)

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

## Build and deploy

CI
- GitHub Actions builds minutes first, then main, then copies `minutes/public` to `public/minutes`.

Manual build
```bash
# From repo root
./test-build.sh
```
The script:
- Fails fast if the main site has any files under `content/minutes/` (the minutes subsite must own `/minutes/`).
- Builds minutes and main with `--cleanDestinationDir` to avoid stale files.
- Replaces `public/minutes` with the minutes build output.

Deploy
- Publish `public/` to your web root (e.g., rsync to cclub.cs.wmich.edu or push via GitHub Pages).

## Under construction mode

- Controlled via `params.underConstruction` in `config.toml` (main) and `minutes/config.toml`.
- While enabled, pages include a site-wide banner and `<meta name="robots" content="noindex, nofollow">`.
- Toggle off by removing or setting `underConstruction = false` in both configs when ready to launch.

## Making changes

- Edit content: `content/`
- Templating/partials: `layouts/`
- Styles/JS: `static/` and `themes/ccawmu/`
- Minutes content lives in the separate minutes repo; the minutes site here is the renderer/UI.

## Troubleshooting

- Minutes page shows raw front matter (e.g., a page titled “Meeting Minutes” with YAML/TOML text):
	- Remove any files under `content/minutes/` in the main site; re-run `./test-build.sh` (it will fail and list offending files).
- Broken links to minutes like `/minutes/minutes/...`:
	- Ensure you haven’t hard-coded absolute paths in templates; we use relative links in the minutes templates.
- RSS feed location:
	- Use `index.xml` for feeds (root: `/index.xml`, minutes: `/minutes/index.xml`).

## Deployment targets

- GitHub Pages: built from `master` via `.github/workflows/deploy-site.yml`. Minutes are bundled under `public/minutes/`.
- cclub.cs.wmich.edu: rsync or copy the `public/` folder to the web root.

