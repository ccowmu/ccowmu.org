# Computer Club at Western Michigan Univers## 🌟 Features

- **Asymmetrical Windows Layout**: Modern, sophisticated design that flows naturally
- **Light/Dark Theme Toggle**: Automatic theme switching with localStorage persistence
- **Real-time Clock**: Live updating time display in navigation
- **Responsive Design**: Works seamlessly on all device sizes
- **Terminal Aesthetics**: Professional computing club vibe with monospace fonts
- **Live Stats**: Dynamic member count and system status
- **Clickable Group Photo**: Links to club's Flickr gallery
- **External Integrations**: Links to GitHub minutes, WMU events, and club wiki
- **Hugo Minutes System**: Automated meeting minutes archive with search and pagination

## 📝 Meeting Minutes System

The club maintains an extensive archive of meeting minutes dating back to 1996. This system has been migrated from Jekyll to Hugo for better performance and maintainability.

### Features
- **Meeting Minutes**: Complete archive from 1996-Now
- **Automated Pagination**: 20 minutes per pag
- **Search Functionality**: Search by date, content, or keywords
- **Year Filtering**: Filter minutes by specific years
- **Responsive Design**: Mobile-friendly interface
- **RSS Feed**: Stay updated with new minutes
- **Automated Deployment**: GitHub Actions workflow for daily updates

### Technical Details
- **Built with Hugo**: Static site generator for fast, reliable performance
- **Source Repository**: Pulls from `ccowmu/minutes` repository daily
- **Custom Theme**: Designed to match the main site aesthetic
- **Markdown Content**: All minutes stored as structured Markdown files
- **Client-side Search**: Fast filtering without server requests

### Accessing Minutes
- **Main Interface**: Available at `/minutes` on the live site
- **Local Development**: Run `hugo server` in the `hugo-minutes/` directory
- **Source Files**: Original minutes in the `ccowmu/minutes` repository

### GitHub Actions Workflow
The minutes system automatically updates daily via GitHub Actions:
1. Pulls latest minutes from the `ccowmu/minutes` repository
2. Builds the Hugo site with updated content
3. Commits generated static files to the main repository
4. Deploys updates to the live site

This ensures the minutes archive stays current without manual intervention.U) Website

A sophisticated, modern website for the Computer Club at WMU, featuring a window-based interface and professional aesthetic.

## 🚀 Quick Start

You can open `index.html` directly in your browser to view the website. The site includes fallback navigation that works even when opened locally.

## 🛠️ Tech Stack

- **HTML5** - Semantic structure  
- **CSS3** - Custom styling with CSS Grid/Flexbox
- **Vanilla JavaScript** - No frameworks, just pure JS
- **No build tools** - Simple development workflow

## 📁 Project Structure

```
ccawmu.org/
├── index.html          # Main landing page
├── minutes.html        # Meeting minutes page
├── events.html         # Events and workshops
├── wiki.html           # Knowledge base (under construction)
├── chat.html           # Community chat info
├── css/
│   └── style.css       # All site styles
├── js/
│   ├── main.js         # Core functionality & navigation
│   ├── clock.js        # Real-time clock widget
│   └── stats.js        # Animated counters
├── includes/
│   ├── header.html     # Shared header component
│   └── footer.html     # Shared footer component
├── hugo-minutes/       # Hugo-powered minutes system
│   ├── content/        # Markdown minutes files (791 files)
│   ├── themes/         # Custom minutes theme
│   ├── public/         # Generated static site
│   └── hugo.toml       # Hugo configuration
└── .github/
    └── workflows/
        └── minutes.yml # Automated minutes deployment
```

## � Features

- **Asymmetrical Windows Layout**: Modern, sophisticated design that flows naturally
- **Light/Dark Theme Toggle**: Automatic theme switching with localStorage persistence
- **Real-time Clock**: Live updating time display in navigation
- **Responsive Design**: Works seamlessly on all device sizes
- **Terminal Aesthetics**: Professional computing club vibe with monospace fonts
- **Live Stats**: Dynamic member count and system status
- **Clickable Group Photo**: Links to club's Flickr gallery
- **External Integrations**: Links to GitHub minutes, WMU events, and club wiki

## 🔧 Development

### Getting Started
1. Clone or download the repository
2. Open `index.html` in a web browser
3. For development, use a local server (VS Code Live Server, Python's `http.server`, etc.)

### Minutes System Development
To work on the Hugo minutes system:
1. Install Hugo: `brew install hugo` (macOS) or download from [gohugo.io](https://gohugo.io)
2. Navigate to `hugo-minutes/` directory
3. Run `hugo server` for live development
4. Edit templates in `themes/minutes-theme/layouts/`
5. Build with `hugo --minify` for production

### Making Changes
- **Content**: Edit the HTML files directly
- **Styling**: All CSS is in `css/style.css` with clear sections
- **Functionality**: JavaScript is split across three files in `js/`
- **Header/Footer**: Shared components in `includes/`
- **Minutes**: Hugo templates in `hugo-minutes/themes/minutes-theme/`

### File Organization
- CSS is organized with clear section comments (`/* ===== SECTION ===== */`)
- JavaScript functions are well-documented
- HTML uses semantic structure and clear class names
- All external links open in new tabs with `rel="noopener"`

## 📱 Responsive Design

The site works on all device sizes:
- **Desktop**: Full feature set with animations
- **Tablet**: Optimized layouts, touch-friendly
- **Mobile**: Hamburger menu, stacked layouts
- **Accessibility**: High contrast mode support

## 🔗 External Links

- **GitHub Minutes**: https://github.com/ccowmu/minutes/tree/master/minutes
- **WMU Events**: https://experiencewmu.wmich.edu/organization/computer-club-at-wmu/events  
- **Club Wiki**: https://cclub.cs.wmich.edu/wiki/Main_Page
- **Flickr Gallery**: https://www.flickr.com/photos/129058274@N06/
- **Twitch Stream**: https://www.twitch.tv/ccawmu

## 🚀 Deployment

This is a static site that can be hosted anywhere:
- **GitHub Pages**: Simple and free
- **Netlify**: Easy deployment with forms
- **Vercel**: Fast global CDN
- **Traditional hosting**: Just upload files

No build process required for the main site - all files are production-ready.

### Minutes System Deployment
The Hugo minutes system deploys automatically via GitHub Actions:
- **Trigger**: Daily at 6 AM UTC, or manual workflow dispatch
- **Source**: Latest content from `ccowmu/minutes` repository
- **Output**: Static files generated in `hugo-minutes/public/`
- **Integration**: Seamlessly integrated with main site at `/minutes`

To manually deploy minutes:
1. Run `hugo --minify` in `hugo-minutes/` directory
2. Copy `public/` contents to your web server's `/minutes` directory

## 📝 Content Management

### Modifying Navigation
Update both `includes/header.html` and ensure all pages load the header correctly.

### Changing Colors/Branding
All colors are defined as CSS custom properties in `:root` at the top of `style.css`.

## 🎨 Customization Tips


### Typography
- Headers: JetBrains Mono (monospaced, terminal feel)
- Body: Inter (clean, readable sans-serif)
- Code: Inherits JetBrains Mono

### Animations
- Most animations respect `prefers-reduced-motion`
- Durations defined in CSS variables for consistency
- GPU-accelerated transforms for smooth performance


## 📚 Resources Used

- [JetBrains Mono Font](https://fonts.google.com/specimen/JetBrains+Mono)
- [Inter Font](https://fonts.google.com/specimen/Inter)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Built with ❤️, caffeine, and way too many late nights by CCoWMU**
