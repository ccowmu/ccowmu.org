# CCaWMU Website - Hugo Implementation

This repository has been converted from a static HTML site to a Hugo-based static site generator implementation, providing a more maintainable and scalable structure for creating new pages and managing content.

## 🚀 Quick Start

### Prerequisites
- [Hugo Extended](https://gohugo.io/installation/) (v0.100.0 or later)
- Git

### Development

```bash
# Clone the repository
git clone https://github.com/ccowmu/ccowmu.org.git
cd ccowmu.org

# Start the development server
hugo server -D

# Build for production
hugo
```

The site will be available at `http://localhost:1313`

## 📁 Project Structure

```
ccowmu.org/
├── config.toml              # Site configuration
├── content/                 # Page content (Markdown files)
│   ├── _index.md           # Homepage content
│   ├── join.md             # Join page
│   ├── chat.md             # Chat page
│   └── minutes/            # Meeting minutes
│       ├── _index.md       # Minutes listing page
│       └── *.md            # Individual minute files
├── static/                  # Static assets
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript files
│   ├── images/             # Images and icons
│   └── *.ico, *.json, etc. # Root-level static files
├── themes/ccawmu/          # Custom theme
│   └── layouts/            # Hugo templates
│       ├── _default/       # Default page templates
│       ├── partials/       # Reusable template components
│       └── section/        # Section-specific templates
└── archetypes/             # Content templates for new pages
```

## ✨ Creating New Pages

### Basic Page

```bash
# Create a new page
hugo new about.md

# This creates content/about.md with front matter:
---
title: "About"
description: ""
date: 2025-07-14T...
draft: false
---

# About

Content goes here...
```

### Meeting Minutes

```bash
# Create new meeting minutes
hugo new minutes/20250717.md

# This creates a properly formatted minutes file with template
```

### Blog Posts (Future)

```bash
# Create a new blog post
hugo new posts/my-post.md
```

## 🎨 Customizing the Site

### Site Configuration

Edit `config.toml` to modify:
- Site title and description
- Navigation menu items
- Contact information
- Social media links
- Meeting times and locations

### Adding Menu Items

```toml
# In config.toml
[[menu.main]]
  name = "New Page"
  url = "/new-page/"
  weight = 60
```

### Modifying Templates

Templates are located in `themes/ccawmu/layouts/`:
- `_default/baseof.html` - Base template with head/footer
- `partials/header.html` - Site header/navigation
- `partials/footer.html` - Site footer
- `index.html` - Homepage template
- `section/minutes.html` - Minutes listing page

### Styling

CSS files are in `static/css/`:
- `style.css` - Main stylesheet (preserves original design)
- `minutes.css` - Minutes-specific styles

## 📝 Content Management

### Front Matter

All content files use YAML front matter:

```yaml
---
title: "Page Title"
description: "Page description for SEO"
date: 2025-07-14T12:00:00-05:00
draft: false
type: "page"  # Optional: overrides default type
layout: "custom"  # Optional: custom layout
---
```

### Variables

Use site variables in content:
- `{{ .Site.Params.email }}` - Contact email
- `{{ .Site.Params.meetingTime }}` - Meeting time
- `{{ .Site.Params.meetingLocation }}` - Meeting location

### Shortcodes (Future Enhancement)

Create reusable content components:

```markdown
{{< meeting-info >}}
{{< member-spotlight name="John Doe" >}}
{{< event-calendar >}}
```

## 🔧 Migration from Static Site

The original static HTML files have been converted to:

1. **Templates**: HTML structure moved to Hugo layouts
2. **Content**: Page content extracted to Markdown files
3. **Assets**: CSS, JS, images moved to `static/` directory
4. **Configuration**: Site settings centralized in `config.toml`

### Key Benefits

- **Content Management**: Write pages in Markdown instead of HTML
- **Template Reuse**: Consistent header/footer across all pages
- **Easy Updates**: Modify site-wide settings in one place
- **SEO**: Automatic meta tags and structured data
- **Performance**: Optimized static site generation
- **Maintenance**: Cleaner separation of content and presentation

## 🚢 Deployment

### GitHub Pages

```bash
# Build the site
hugo

# The public/ directory contains the built site
# Deploy the contents of public/ to your web server
```

### Automated Deployment

Set up GitHub Actions for automatic deployment:

```yaml
# .github/workflows/hugo.yml
name: Deploy Hugo site to Pages
on:
  push:
    branches: ["master"]
  workflow_dispatch:
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'
          extended: true
      - run: hugo --minify
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

## 🔍 Advanced Features

### Search Functionality

The minutes section includes search functionality:
- FlexSearch integration for fast client-side search
- Filter by year, content, or keywords
- Multiple view modes (card, list, timeline)

### Performance Optimizations

- Critical CSS inlined in `<head>`
- Progressive font loading
- Image optimization with WebP support
- Service Worker for offline functionality

### Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- ARIA labels where appropriate

## 📚 Adding New Features

### Custom Page Types

1. Create new archetype in `archetypes/`
2. Add custom template in `themes/ccawmu/layouts/`
3. Configure in `config.toml` if needed

### Extending Functionality

- **Blog System**: Add `posts/` section with pagination
- **Event Calendar**: Integration with external calendar APIs
- **Member Directory**: Database of current/past members
- **Project Showcase**: Portfolio of club projects
- **Photo Gallery**: Integration with Flickr API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `hugo server`
5. Submit a pull request

### Content Guidelines

- Use Markdown for all content
- Include proper front matter
- Add descriptive commit messages
- Test responsive design
- Verify accessibility

## 📞 Support

For questions about the Hugo implementation:
- **Technical Issues**: Create an issue on GitHub
- **Content Updates**: Contact club officers
- **Hugo Documentation**: https://gohugo.io/documentation/

---

*This Hugo implementation maintains the original design and functionality while providing a modern, maintainable foundation for future development.*
