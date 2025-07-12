#!/usr/bin/env node

/**
 * RSS Management Script for CCOWMU
 * Usage: node rss-manager.js [command] [options]
 * 
 * Commands:
 *   add     - Add a new RSS item
 *   build   - Rebuild RSS feed from data
 *   validate - Validate RSS feed
 */

const fs = require('fs');
const path = require('path');

class RSSManager {
    constructor() {
        this.rssPath = path.join(__dirname, 'rss.xml');
        this.dataPath = path.join(__dirname, 'rss-data.json');
        
        this.siteData = {
            title: "CCOWMU - Computer Club of Western Michigan University",
            description: "Latest updates from the Computer Club of Western Michigan University",
            link: "https://ccowmu.org",
            language: "en-us",
            webMaster: "contact@ccowmu.org (CCOWMU)",
            managingEditor: "contact@ccowmu.org (CCOWMU)",
            image: {
                url: "https://ccowmu.org/images/logo-mark-primary.svg",
                title: "CCOWMU",
                link: "https://ccowmu.org"
            }
        };
    }

    // Load RSS data from JSON file
    loadData() {
        try {
            if (fs.existsSync(this.dataPath)) {
                const data = JSON.parse(fs.readFileSync(this.dataPath, 'utf8'));
                return data.items || [];
            }
        } catch (error) {
            console.warn('Warning: Could not load RSS data, starting fresh');
        }
        return [];
    }

    // Save RSS data to JSON file
    saveData(items) {
        const data = {
            lastUpdated: new Date().toISOString(),
            items: items
        };
        fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
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

    // Generate RSS XML
    generateRSS(items) {
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
    <generator>CCOWMU RSS Manager</generator>
    <webMaster>${this.siteData.webMaster}</webMaster>
    <managingEditor>${this.siteData.managingEditor}</managingEditor>
    <image>
      <url>${this.siteData.image.url}</url>
      <title>${this.siteData.image.title}</title>
      <link>${this.siteData.image.link}</link>
    </image>

`;

        // Sort items by date (newest first)
        const sortedItems = items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        // Add items
        sortedItems.forEach(item => {
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

    // Add a new RSS item
    addItem(itemData) {
        const items = this.loadData();
        
        const newItem = {
            title: itemData.title,
            description: itemData.description,
            link: itemData.link,
            guid: itemData.guid || itemData.link,
            pubDate: itemData.pubDate || new Date().toUTCString(),
            category: itemData.category || "General",
            id: Date.now() // Simple ID for uniqueness
        };

        items.unshift(newItem);
        
        // Keep only the latest 20 items
        if (items.length > 20) {
            items.splice(20);
        }

        this.saveData(items);
        this.buildFeed();
        
        console.log(`✅ Added RSS item: "${newItem.title}"`);
        return newItem;
    }

    // Build the RSS feed
    buildFeed() {
        const items = this.loadData();
        const rssContent = this.generateRSS(items);
        
        fs.writeFileSync(this.rssPath, rssContent);
        console.log(`✅ RSS feed built with ${items.length} items`);
    }

    // Validate RSS feed
    validateFeed() {
        try {
            if (!fs.existsSync(this.rssPath)) {
                console.error('❌ RSS file not found');
                return false;
            }

            const content = fs.readFileSync(this.rssPath, 'utf8');
            
            // Basic XML validation
            if (!content.includes('<?xml') || !content.includes('<rss')) {
                console.error('❌ Invalid RSS format');
                return false;
            }

            console.log('✅ RSS feed is valid');
            console.log(`📄 File: ${this.rssPath}`);
            console.log(`📊 Size: ${Math.round(content.length / 1024 * 100) / 100} KB`);
            
            return true;
        } catch (error) {
            console.error('❌ Error validating RSS:', error.message);
            return false;
        }
    }

    // Interactive CLI
    async runCLI() {
        const args = process.argv.slice(2);
        const command = args[0];

        switch (command) {
            case 'add':
                this.runAddCommand();
                break;
            case 'build':
                this.buildFeed();
                break;
            case 'validate':
                this.validateFeed();
                break;
            default:
                this.showHelp();
        }
    }

    runAddCommand() {
        console.log('🚀 Adding new RSS item...\n');
        
        // Simple prompts (in a real app, you'd use a proper CLI library)
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const questions = [
            'Title: ',
            'Description: ',
            'Link (relative to https://ccowmu.org): ',
            'Category (optional): '
        ];

        let answers = [];
        let currentQuestion = 0;

        const ask = () => {
            if (currentQuestion < questions.length) {
                rl.question(questions[currentQuestion], (answer) => {
                    answers.push(answer);
                    currentQuestion++;
                    ask();
                });
            } else {
                rl.close();
                
                const [title, description, linkPath, category] = answers;
                const link = linkPath.startsWith('http') ? linkPath : `https://ccowmu.org/${linkPath.replace(/^\//, '')}`;
                
                this.addItem({
                    title,
                    description,
                    link,
                    category: category || 'General'
                });
            }
        };

        ask();
    }

    showHelp() {
        console.log(`
🔧 CCOWMU RSS Manager

Usage: node rss-manager.js [command]

Commands:
  add      - Add a new RSS item (interactive)
  build    - Rebuild RSS feed from stored data
  validate - Validate the current RSS feed

Examples:
  node rss-manager.js add
  node rss-manager.js build
  node rss-manager.js validate
`);
    }
}

// Run CLI if called directly
if (require.main === module) {
    const manager = new RSSManager();
    manager.runCLI();
}

module.exports = RSSManager;
