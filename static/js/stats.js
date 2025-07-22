// ===== ANIMATED STATS =====
// Handles the animated counters and fun statistics

let statsAnimated = false;

function initStats() {
    // Observe stats section for intersection
    const statsGrid = document.querySelector('.stats-grid');
    
    if (!statsGrid) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                animateStats();
                statsAnimated = true;
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(statsGrid);
}

function animateStats() {
    // Animate packets sniffed counter
    animateCounter('packets-sniffed', 0, 13337, 2000, (val) => {
        return val.toLocaleString();
    });
    
    // Animate bugs squashed counter
    animateCounter('bugs-squashed', 0, 2048, 1500, (val) => {
        return val.toLocaleString();
    });
    
    // Coffee counter stays at infinity but adds a fun animation
    const coffeeElement = document.getElementById('coffee-consumed');
    if (coffeeElement) {
        coffeeElement.style.animation = 'pulse 2s ease-in-out infinite';
    }
    
    // Start the random stat updates
    startRandomStatUpdates();
}

function animateCounter(elementId, start, end, duration, formatter) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startTime = performance.now();
    const range = end - start;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(start + (range * easeOutQuart));
        
        element.textContent = formatter ? formatter(currentValue) : currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function startRandomStatUpdates() {
    // Periodically update stats with small random increments
    setInterval(() => {
        updatePacketsSniffed();
    }, 5000 + Math.random() * 10000); // Every 5-15 seconds
    
    setInterval(() => {
        updateBugsSquashed();
    }, 8000 + Math.random() * 12000); // Every 8-20 seconds
}

function updatePacketsSniffed() {
    const element = document.getElementById('packets-sniffed');
    if (!element) return;
    
    const currentValue = parseInt(element.textContent.replace(/,/g, ''));
    const increment = Math.floor(Math.random() * 50) + 1;
    const newValue = currentValue + increment;
    
    // Animate the increment
    animateCounter('packets-sniffed', currentValue, newValue, 500, (val) => {
        return val.toLocaleString();
    });
}

function updateBugsSquashed() {
    const element = document.getElementById('bugs-squashed');
    if (!element) return;
    
    const currentValue = parseInt(element.textContent.replace(/,/g, ''));
    
    // Sometimes bugs multiply instead of getting squashed (programmer humor)
    const shouldMultiply = Math.random() < 0.1; // 10% chance
    let newValue;
    
    if (shouldMultiply) {
        newValue = currentValue + Math.floor(Math.random() * 20) + 10;
        // Show a toast about new bugs
        setTimeout(() => {
            if (window.showToast) {
                window.showToast('🐛 New bugs detected!', 'info');
            }
        }, 600);
    } else {
        newValue = currentValue + Math.floor(Math.random() * 5) + 1;
    }
    
    animateCounter('bugs-squashed', currentValue, newValue, 500, (val) => {
        return val.toLocaleString();
    });
}

// Fun additional stats that can appear in footer
function updateFooterStats() {
    const uptimeElement = document.getElementById('uptime-counter');
    if (uptimeElement) {
        // Calculate "uptime" since page load
        const pageLoadTime = performance.timeOrigin + performance.now();
        const now = Date.now();
        const uptimeMs = now - pageLoadTime;
        const uptimeDays = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
        const uptimeHours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const uptimeMinutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (uptimeDays > 0) {
            uptimeElement.textContent = `${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m`;
        } else if (uptimeHours > 0) {
            uptimeElement.textContent = `${uptimeHours}h ${uptimeMinutes}m`;
        } else {
            uptimeElement.textContent = `${uptimeMinutes}m`;
        }
    }
}

// Coffee level animation
function animateCoffeeLevel() {
    const coffeeMeter = document.querySelector('.coffee-meter');
    if (!coffeeMeter) return;
    
    // Random coffee level between 60-100%
    const level = Math.floor(Math.random() * 40) + 60;
    const filled = Math.floor(level / 10);
    const empty = 10 - filled;
    
    const meter = '█'.repeat(filled) + '░'.repeat(empty);
    coffeeMeter.textContent = meter;
    
    // Update percentage
    const percentSpan = coffeeMeter.parentElement.querySelector('.stat-value');
    if (percentSpan) {
        const fullText = percentSpan.textContent;
        percentSpan.innerHTML = meter + ` ${level}%`;
    }
}

// System status randomizer
function randomizeSystemStatus() {
    const vibeElement = document.querySelector('.stat-line:last-child .stat-value');
    if (!vibeElement) return;
    
    const vibes = [
        { text: 'EXCELLENT', class: 'terminal-green' },
        { text: 'OPTIMAL', class: 'terminal-green' },
        { text: 'CAFFEINATED', class: 'text-yellow' },
        { text: 'DEBUGGING', class: 'text-cyan' },
        { text: 'COMPILING', class: 'text-yellow' },
        { text: 'HACKING', class: 'text-green' },
        { text: 'LEARNING', class: 'text-cyan' }
    ];
    
    const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];
    vibeElement.textContent = randomVibe.text;
    vibeElement.className = randomVibe.class;
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initStats();
    
    // Update footer stats every minute
    setInterval(updateFooterStats, 60000);
    updateFooterStats();
    
    // Animate coffee level every 30 seconds
    setInterval(animateCoffeeLevel, 30000);
    
    // Randomize system status every 15 seconds
    setInterval(randomizeSystemStatus, 15000);
});

// Add CSS for pulse animation
const statsStyle = document.createElement('style');
statsStyle.textContent = `
    @keyframes pulse {
        0%, 100% { 
            transform: scale(1);
            color: var(--accent-yellow);
        }
        50% { 
            transform: scale(1.05);
            color: var(--accent-pink);
            text-shadow: 0 0 10px currentColor;
        }
    }
    
    @keyframes countUp {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .stat-number {
        animation: countUp 0.5s ease-out;
    }
    
    .text-yellow { color: var(--accent-yellow); }
    .text-cyan { color: var(--accent-cyan); }
    .text-green { color: var(--accent-green); }
`;
document.head.appendChild(statsStyle);
