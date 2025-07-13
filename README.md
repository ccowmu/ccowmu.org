# Computer Club at Western Michigan University Website

Static website built with HTML, CSS, and vanilla JavaScript. No build tools required.

## How to run locally

1. Open `index.html` in your browser
2. Or use a local server: `python -m http.server 8000`

## File structure

- `index.html` - Main page
- `css/style.css` - All styles
- `js/` - JavaScript files
- `includes/` - Header and footer components
- `hugo-minutes/` - Meeting minutes archive (Hugo-based)

## Minutes system IN DEVELOPMENT

The minutes archive uses Hugo and updates automatically via GitHub Actions.

To work on minutes locally:
1. Install Hugo
2. Run `hugo server` in the `hugo-minutes/` directory

## Making changes

- Edit HTML files directly
- All CSS is in one file with clear sections
- JavaScript is split into logical files
- Shared header/footer in `includes/`

## Contributing

1. Fork the repository
2. Make your changes
3. Test locally
4. Submit a pull request

Keep it simple!
