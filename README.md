# Computer Club at Western Michigan University (CCoWMU) Website

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
└── includes/
    ├── header.html     # Shared header component
    └── footer.html     # Shared footer component
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

### Making Changes
- **Content**: Edit the HTML files directly
- **Styling**: All CSS is in `css/style.css` with clear sections
- **Functionality**: JavaScript is split across three files in `js/`
- **Header/Footer**: Shared components in `includes/`

### File Organization
- CSS is organized with clear section comments (`/* ===== SECTION ===== */`)
- JavaScript functions are well-documented
- HTML uses semantic structure and clear class names
- All external links open in new tabs with `rel="noopener"`

## 🎮 Easter Eggs & Fun Features

- **Konami Code**: Arrow keys sequence triggers glitch effect
- **Logo Clicking**: Click the logo 10 times for spin animation
- **Matrix Mode**: Ctrl+Shift+M for terminal rain effect
- **Clock Interactions**: Click clock for different time formats
- **Animated Stats**: Real-time counters that occasionally get "bugs"
- **Terminal Windows**: Fake command prompts throughout the site

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

No build process required - all files are production-ready.

## 📝 Content Management

### Modifying Navigation
Update both `includes/header.html` and ensure all pages load the header correctly.

### Changing Colors/Branding
All colors are defined as CSS custom properties in `:root` at the top of `style.css`.

## 🎨 Customization Tips

### Color Scheme
```css
--accent-green: #00ff41;    /* Terminal green */
--accent-cyan: #00ffff;     /* Bright cyan */
--accent-pink: #ff1493;     /* Glitch pink */
--accent-yellow: #ffff00;   /* Warning yellow */
```

### Typography
- Headers: JetBrains Mono (monospaced, terminal feel)
- Body: Inter (clean, readable sans-serif)
- Code: Inherits JetBrains Mono

### Animations
- Most animations respect `prefers-reduced-motion`
- Durations defined in CSS variables for consistency
- GPU-accelerated transforms for smooth performance

## 🤝 Contributing

This site is built by students, for students. When making changes:

1. **Keep it simple** - No complex build tools or frameworks
2. **Comment your code** - Help future maintainers understand
3. **Test on mobile** - Ensure responsive design works
4. **Maintain the vibe** - Retro geek aesthetic with personality
5. **Accessibility first** - Ensure everyone can use the site

## 📚 Resources Used

- [JetBrains Mono Font](https://fonts.google.com/specimen/JetBrains+Mono)
- [Inter Font](https://fonts.google.com/specimen/Inter)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🎯 Future Enhancements

- [ ] More interactive animations
- [ ] Performance optimizations

---

**Built with ❤️, caffeine, and way too many late nights by CCoWMU**

*"Where nerds unite to code, hack, and build impossibly cool stuff"*
