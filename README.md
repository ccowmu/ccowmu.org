# Computer Club at Western Michigan University Website

Static website built with Hugo. The site includes the main website and an integrated minutes archive.

## How to run locally

### Prerequisites
- Install Hugo (extended version): https://gohugo.io/installation/

### Development
1. Clone the repository
2. Run `hugo server` for the main site
3. Or run `hugo server -s minutes` for the minutes only
4. Visit `http://localhost:1313`

## File structure

- `content/` - Main site content (Markdown)
- `layouts/` - Hugo templates
- `static/` - Static assets (CSS, JS, images)
- `themes/ccawmu/` - Custom Hugo theme
- `minutes/` - Separate Hugo site for meeting minutes
- `public/` - Generated static files (created by Hugo build)

## Minutes system

The minutes archive automatically pulls from the [ccowmu/minutes](https://github.com/ccowmu/minutes) repository and builds them into the site. This happens automatically via GitHub Actions.

## Building for production

The site is automatically built and deployed via GitHub Actions when changes are pushed to the master branch.

To build manually:
```bash
# Build minutes first
hugo --minify -s minutes

# Build main site
hugo --minify

# Copy minutes to main site
mkdir -p public/minutes
cp -r minutes/public/* public/minutes/
```

## Making changes

- Edit Markdown files in `content/` for page content
- Modify templates in `layouts/` for structure changes
- Update styles in `themes/ccawmu/` or `static/css/`
- Minutes are automatically synced from the separate minutes repository

## Contributing

1. Fork the repository
2. Make your changes
3. Test locally
4. Submit a pull request

## Troubleshooting

If you see 404 errors for images when testing locally, make sure you're serving the site from a local server rather than opening the HTML file directly in your browser.

Keep it simple!
