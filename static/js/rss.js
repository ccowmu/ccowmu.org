/**
 * RSS Feed Generator for CCOWMU
 * Dynamically generates RSS content from site data
 */

class RSSGenerator {
    constructor() {
        this.siteData = {
            title: "CCOWMU - Computer Club of Western Michigan University",
            description: "Latest updates from the Computer Club of Western Michigan University",
            link: window.location.origin,
            language: "en-us",
            webMaster: "contact@ccowmu.org (CCOWMU)",
            managingEditor: "contact@ccowmu.org (CCOWMU)",
            image: {
                url: `${window.location.origin}/images/logo-mark-primary.svg`,
                title: "CCOWMU",
                link: window.location.origin
            }
        };
        
        this.items = [];
    }

    // Add an RSS item
    addItem(item) {
        const rssItem = {
            title: item.title,
            description: item.description,
            link: item.link,
            guid: item.guid || item.link,
            pubDate: item.pubDate || new Date().toUTCString(),
            category: item.category || "General"
        };
        
        this.items.unshift(rssItem); // Add to beginning
        
        // Keep only the latest 20 items
        if (this.items.length > 20) {
            this.items = this.items.slice(0, 20);
        }
        
        this.updateFeed();
    }

    // Generate RSS XML
    generateRSS() {
        const lastBuildDate = new Date().toUTCString();
        
        let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${this.siteData.title}</title>
    <description>${this.siteData.description}</description>
    <link>${this.siteData.link}</link>
    <atom:link href="${this.siteData.link}/rss.xml" rel="self" type="application/rss+xml" />
    <language>${this.siteData.language}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>CCOWMU Dynamic RSS</generator>
    <webMaster>${this.siteData.webMaster}</webMaster>
    <managingEditor>${this.siteData.managingEditor}</managingEditor>
    <image>
      <url>${this.siteData.image.url}</url>
      <title>${this.siteData.image.title}</title>
      <link>${this.siteData.image.link}</link>
    </image>

`;

        // Add items
        this.items.forEach(item => {
            rss += `    <item>
      <title>${this.escapeXML(item.title)}</title>
      <description>${this.escapeXML(item.description)}</description>
      <link>${item.link}</link>
      <guid>${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <category>${item.category}</category>
    </item>

`;
        });

        rss += `  </channel>
</rss>`;

        return rss;
    }

    // Escape XML special characters
    escapeXML(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    // Update the RSS feed (you'd need server-side for this to persist)
    updateFeed() {
        const rssContent = this.generateRSS();
        
        // For demonstration, log the RSS content
        console.log('Generated RSS:', rssContent);
        
        // In a real implementation, you'd send this to a server endpoint
        // or use a static site generator to update the RSS file
    }

    // Load existing items (from localStorage for demo)
    loadItems() {
        const stored = localStorage.getItem('ccowmu-rss-items');
        if (stored) {
            this.items = JSON.parse(stored);
        }
    }

    // Save items (to localStorage for demo)
    saveItems() {
        localStorage.setItem('ccowmu-rss-items', JSON.stringify(this.items));
    }

    // Initialize with some default content
    initializeDefaults() {
        this.loadItems();
        
        // If no items exist, add some defaults
        if (this.items.length === 0) {
            this.addDefaultItems();
        }
    }

    addDefaultItems() {
        const defaultItems = [
            {
                title: "New Meeting Minutes Available - July 2025",
                description: "Meeting minutes from our July 2025 general meeting are now available.",
                link: `${window.location.origin}/minutes.html`,
                category: "Minutes",
                pubDate: new Date('2025-07-12T19:00:00Z').toUTCString()
            },
            {
                title: "Election Night 2025 Results",
                description: "Check out the results and photos from our 2025 election night event.",
                link: `${window.location.origin}/events.html`,
                category: "Events",
                pubDate: new Date('2025-07-11T20:00:00Z').toUTCString()
            },
            {
                title: "Join Our Matrix Chat Server",
                description: "Connect with fellow club members on our Matrix chat server for real-time discussions.",
                link: `${window.location.origin}/connect.html`,
                category: "Announcements",
                pubDate: new Date('2025-07-08T12:00:00Z').toUTCString()
            }
        ];

        defaultItems.forEach(item => {
            this.items.push(item);
        });
        
        this.saveItems();
    }
}

// Create global RSS generator instance
window.rssGenerator = new RSSGenerator();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.rssGenerator.initializeDefaults();
});

// Utility function to add RSS items from anywhere in your site
window.addRSSItem = function(item) {
    window.rssGenerator.addItem(item);
    window.rssGenerator.saveItems();
};

// Example usage:
// addRSSItem({
//     title: "New Event Posted",
//     description: "We've added a new event to our calendar",
//     link: "https://ccowmu.org/events.html#new-event",
//     category: "Events"
// });
