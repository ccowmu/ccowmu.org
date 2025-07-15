# Quick Start Guide: Hugo Template for CCaWMU

## 🚀 Creating New Pages

### 1. Basic Pages

```bash
# Create a new page
hugo new about-us.md

# This creates: content/about-us.md
# URL will be: /about-us/
```

### 2. Blog Posts

```bash
# Create a new blog post
hugo new posts/welcome-to-hugo.md

# This creates: content/posts/welcome-to-hugo.md
# URL will be: /posts/welcome-to-hugo/
```

### 3. Meeting Minutes

```bash
# Create new meeting minutes (uses special template)
hugo new minutes/20250717.md

# This creates: content/minutes/20250717.md
# URL will be: /minutes/20250717/
```

## ✏️ Editing Content

### Front Matter (Page Metadata)

Every page starts with YAML front matter:

```yaml
---
title: "Page Title"
description: "SEO description"
date: 2025-07-14T12:00:00-05:00
draft: false
---

# Page Content

Write your content here using Markdown...
```

### Homepage Customization

Edit `content/_index.md` to customize:
- Hero section title and subtitle
- About section content
- Member count and uptime stats

Example:
```yaml
---
title: "Computer Club @ WMU"
description: "Your description here"
memberCount: 500
uptime: "50 years"
about: |
  Custom about text here...
  
  **What we do:**
  • Custom activities list
---
```

## 🎨 Customizing the Theme

### Site-wide Settings

Edit `config.toml`:

```toml
# Basic info
title = "Your Site Title"
baseURL = "https://yoursite.com"

# Club information
[params]
  email = "contact@yourclub.org"
  meetingTime = "Wednesdays 7:00 PM"
  meetingLocation = "Room 123"
  twitch = "your-twitch-channel"
```

### Navigation Menu

```toml
# Add new menu items
[[menu.main]]
  name = "Projects"
  url = "/projects/"
  weight = 35
```

### Colors and Styling

Edit `static/css/style.css` to change:
- Color scheme
- Fonts
- Layout spacing
- Window styling

## 📁 Content Organization

```
content/
├── _index.md           # Homepage
├── join.md             # Join page
├── chat.md             # Chat page
├── minutes/            # Meeting minutes
│   ├── _index.md      # Minutes listing
│   └── *.md           # Individual minutes
└── posts/             # Blog posts (optional)
    ├── _index.md      # Blog listing
    └── *.md           # Individual posts
```

## 🔧 Development Workflow

### 1. Start Development Server

```bash
hugo server --buildDrafts
# Site available at: http://localhost:1313
# Auto-reloads when files change
```

### 2. Create Content

```bash
# Create new content with proper template
hugo new section/page-name.md

# Edit the file in your editor
# Save and see changes instantly in browser
```

### 3. Build for Production

```bash
# Build static site
hugo

# Output goes to: public/
# Upload public/ folder to your web server
```

## 📝 Content Templates

### Standard Page Template

```markdown
---
title: "Page Title"
description: "Description for SEO"
date: 2025-07-14T12:00:00-05:00
draft: false
---

# Page Title

Your content here using standard Markdown.

## Subsection

- Bullet points
- **Bold text**
- *Italic text*
- [Links](https://example.com)

```

### Minutes Template

```markdown
---
title: "Meeting Minutes - July 17, 2025"
description: "Meeting minutes from July 17, 2025"
date: 2025-07-17T18:00:00-05:00
draft: false
type: "minutes"
---

# Meeting Minutes - July 17, 2025

## Attendance
- Member 1
- Member 2

## Topics Discussed
1. First topic
2. Second topic

## Decisions Made
- Decision 1
- Decision 2

## Action Items
- [ ] Task 1 (assigned to Person A)
- [ ] Task 2 (assigned to Person B)

## Next Meeting
Thursday, July 24, 2025 at 6:00 PM
```

## 🎯 Tips for Success

### Content Writing
- Use descriptive titles
- Add meta descriptions for SEO
- Organize content with headers
- Include images with alt text
- Link to related content

### Performance
- Optimize images (use WebP when possible)
- Keep file sizes reasonable
- Use descriptive filenames
- Test on mobile devices

### Maintenance
- Regular content updates
- Monitor for broken links
- Update meeting information
- Archive old content when needed

## 🆘 Common Issues

### Page Not Showing
- Check front matter formatting
- Ensure `draft: false`
- Verify file is in correct directory
- Check Hugo server logs

### Styling Issues
- Clear browser cache
- Check CSS file paths in templates
- Verify static files are in correct locations
- Test with Hugo server restart

### Menu Not Updating
- Check `config.toml` syntax
- Restart Hugo server
- Verify menu item configuration

## 📚 Next Steps

1. **Learn Markdown**: Master the content format
2. **Customize Styling**: Modify CSS for your needs  
3. **Add Features**: Implement additional functionality
4. **Optimize Performance**: Improve loading speeds
5. **Setup Automation**: Deploy automatically with GitHub Actions

---

Happy building! 🚀
