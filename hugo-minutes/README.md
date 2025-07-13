# CCaWMU Meeting Minutes Archive

A Hugo-powered static site generator for the Computer Club at WMU's meeting minutes archive, featuring 791 meeting minutes from 1996-2025.

## 🚀 Quick Start

```bash
# Install Hugo
brew install hugo  # macOS
# or download from https://gohugo.io

# Start development server
hugo server

# Build for production
hugo --minify
```

## 📊 Statistics

- **791 Total Minutes**: Complete archive from January 1996 to present
- **29 Years of History**: Continuous meeting documentation
- **40 Paginated Pages**: 20 minutes per page for optimal performance
- **Automated Updates**: Daily sync from source repository

## 🏗️ Architecture

### Hugo Configuration
- **Static Site Generator**: Hugo v0.148.1+
- **Theme**: Custom `minutes-theme`
- **Pagination**: 20 items per page
- **Markup**: Goldmark with unsafe HTML enabled
- **Base URL**: `/minutes` (subpath deployment)

### Content Structure
```
content/
├── 19960118.md    # January 18, 1996
├── 19960125.md    # January 25, 1996
├── ...
└── 20250417.md    # April 17, 2025 (latest)
```

### Theme Components
```
themes/minutes-theme/
├── layouts/
│   ├── _default/
│   │   ├── baseof.html     # Base template
│   │   ├── list.html       # Archive listing
│   │   └── single.html     # Individual minute page
│   └── index.html          # Homepage with pagination
└── static/
    └── css/
        └── style.css       # Theme styles
```

## 🎨 Features

### Search & Filtering
- **Client-side Search**: Real-time filtering by content or date
- **Year Filter**: Dropdown to filter by specific years
- **Responsive Results**: Instant feedback as you type

### Pagination
- **Chronological Order**: Latest minutes first
- **Page Navigation**: Previous/Next with numbered pages
- **URL-friendly**: Clean URLs for each page (`/page/2/`, etc.)

### Performance
- **Static Generation**: Pre-built HTML for fast loading
- **Minified Output**: Compressed CSS and HTML
- **Responsive Images**: Optimized for all screen sizes

### Navigation
- **Breadcrumb Navigation**: Clear page hierarchy
- **Header Integration**: Matches main site design
- **External Links**: Links to main site and GitHub source

## 🔄 Automated Deployment

The minutes system updates automatically via GitHub Actions:

### Workflow Triggers
- **Daily Schedule**: 6:00 AM UTC every day
- **Manual Dispatch**: Can be triggered manually from GitHub
- **Content Changes**: When source repository updates

### Process
1. **Checkout**: Clone both repositories
2. **Content Sync**: Copy latest minutes from `ccowmu/minutes`
3. **Hugo Build**: Generate static site with `hugo --minify`
4. **Deploy**: Commit generated files to main repository
5. **Notification**: Success/failure status in GitHub

### Workflow File
Located at `.github/workflows/minutes.yml` with full automation setup.

## 🛠️ Development

### Local Setup
```bash
# Clone the repository
git clone https://github.com/lochlanmcelroy/ccowmu.org.git
cd ccowmu.org/hugo-minutes

# Install Hugo (if not already installed)
brew install hugo

# Start development server
hugo server --bind 0.0.0.0 --port 8080

# Open in browser
open http://localhost:8080/minutes
```

### Making Changes

#### Content Updates
Content automatically syncs from the source repository. To manually update:
```bash
# Sync content from source repository
# (This happens automatically in production)
```

#### Theme Modifications
```bash
# Edit templates
vim themes/minutes-theme/layouts/index.html

# Edit styles  
vim themes/minutes-theme/static/css/style.css

# Test changes
hugo server

# Build for production
hugo --minify
```

#### Configuration Changes
```bash
# Edit Hugo configuration
vim hugo.toml

# Common settings:
# - baseURL: Site base path
# - pagination.pagerSize: Items per page
# - params: Custom parameters
```

### File Structure
```
hugo-minutes/
├── archetypes/         # Content templates
├── content/            # Meeting minutes (791+ files)
├── public/             # Generated static site
├── themes/
│   └── minutes-theme/  # Custom theme
├── config.yaml         # Hugo configuration (YAML)
├── hugo.toml          # Hugo configuration (TOML)
└── .hugo_build.lock   # Build lock file
```

## 🎯 Customization

### Adding New Features
1. **Search Enhancement**: Modify JavaScript in `index.html`
2. **Style Updates**: Edit `themes/minutes-theme/static/css/style.css`
3. **Layout Changes**: Update templates in `themes/minutes-theme/layouts/`
4. **New Content Types**: Add to `archetypes/` directory

### Configuration Options
```toml
# hugo.toml
baseURL = '/minutes'
title = 'CCaWMU Meeting Minutes'
theme = 'minutes-theme'

[pagination]
  pagerSize = 20

[params]
  description = "Meeting minutes archive for the CCaWMU organization"
  clubName = "CCaWMU"
```

## 🔍 Search Implementation

The search system uses client-side JavaScript for instant results:

### Features
- **Real-time Filtering**: Updates as you type
- **Multiple Fields**: Searches titles, dates, and content
- **Case Insensitive**: Flexible search terms
- **Minimum Length**: Requires 2+ characters to activate

### Technical Details
```javascript
// Search implementation
document.getElementById('search').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.minute-card');
    
    if (searchTerm.length < 2) {
        cards.forEach(card => card.style.display = 'block');
        return;
    }
    
    cards.forEach(card => {
        const title = card.dataset.title.toLowerCase();
        const content = card.textContent.toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (stacked layout)
- **Tablet**: 768px - 1024px (grid layout)
- **Desktop**: > 1024px (full feature set)

### Mobile Optimizations
- **Touch-friendly**: Large tap targets
- **Readable Text**: Optimized font sizes
- **Fast Loading**: Minimal JavaScript
- **Offline Capable**: Static assets cache well

## 🤝 Contributing

### Guidelines
1. **Keep it Fast**: Static site should load quickly
2. **Mobile First**: Design for mobile, enhance for desktop
3. **Accessible**: Follow WCAG guidelines
4. **Consistent**: Match main site design patterns

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes in `hugo-minutes/`
4. Test locally with `hugo server`
5. Submit PR with clear description

## 📚 Resources

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Hugo Themes Guide](https://gohugo.io/themes/)
- [Markdown Syntax](https://www.markdownguide.org/)
- [GitHub Actions](https://docs.github.com/actions)

## 🐛 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check Hugo version
hugo version

# Verify configuration
hugo config

# Build with verbose output
hugo --verbose
```

#### Content Not Showing
```bash
# Check content format
head content/20250101.md

# Verify frontmatter
hugo list all
```

#### Theme Issues
```bash
# Verify theme structure
ls -la themes/minutes-theme/layouts/

# Check template syntax
hugo --debug
```

### Getting Help
- **GitHub Issues**: Report bugs and request features
- **Hugo Community**: [discourse.gohugo.io](https://discourse.gohugo.io)
- **Club Discord**: Ask in #tech-support channel

---

**Built with Hugo, automated with GitHub Actions, and maintained by CCaWMU members**

*Preserving 29 years of club history, one commit at a time* 🚀
