// ===== MAIN JAVASCRIPT FILE =====
// Handles header/footer loading, navigation, theme toggling, and general site functionality

// Use immediate execution for better async loading
(function() {
    'use strict';
    
    // Check if DOM is already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
    
    function initializeApp() {
        // Load header and footer with high priority
        loadHeaderAndFooter();
        
        // Initialize theme system immediately
        initTheme();
        
        // Defer non-critical initializations
        requestIdleCallback(() => {
            initNavigation();
            initSmoothScrolling();
            initPageFeatures();
            
            // Lazy load non-critical scripts
            lazyLoadScripts();
        });
    }
})();

// ===== HEADER & FOOTER LOADING =====
async function loadHeaderAndFooter() {
    try {
        // Check if we're running from file:// protocol
        if (window.location.protocol === 'file:') {
            console.warn('Running from file:// protocol, using fallback navigation');
            showFallbackNavigation();
            showFallbackFooter();
            return;
        }
        
        // Load header and footer in parallel for better performance
        const [headerResponse, footerResponse] = await Promise.all([
            fetch('/ccowmu.org/includes/header.html'),
            fetch('/ccowmu.org/includes/footer.html')
        ]);
        
        const [headerHtml, footerHtml] = await Promise.all([
            headerResponse.text(),
            footerResponse.text()
        ]);
        
        // Update DOM in batch to minimize reflows
        requestAnimationFrame(() => {
            document.getElementById('header-container').innerHTML = headerHtml;
            document.getElementById('footer-container').innerHTML = footerHtml;
            
            // Initialize components that depend on loaded content
            initClock();
            initTheme();
            initNavigation();
        });
        
    } catch (error) {
        console.error('Error loading header/footer:', error);
        showFallbackNavigation();
        showFallbackFooter();
    }
}

// ===== THEME SYSTEM =====
function initTheme() {
    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // Add event listener to theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// ===== NAVIGATION =====
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
    
    // Highlight current page
    highlightCurrentPage();
}

function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ===== PAGE-SPECIFIC FEATURES =====
function initPageFeatures() {
    // Initialize clock
    initClock();
    
    // Initialize window animations on home page
    if (document.querySelector('.windows-grid')) {
        initWindowAnimations();
        initGroupPhotoClick();
    // Keep the live stream window the same height as the about.sh window
    syncStreamHeightToAbout();
    // Recalculate on resize (debounced)
    const resizeHandler = debounce(syncStreamHeightToAbout, 150);
    window.addEventListener('resize', resizeHandler);
    // Re-run after fonts/layout settle
    setTimeout(syncStreamHeightToAbout, 250);
    }
    
    // Initialize meeting date calculations
    if (document.getElementById('next-meeting')) {
        updateNextMeeting();
    }
}

// ===== CLOCK FUNCTIONALITY =====
function initClock() {
    const clockDisplay = document.getElementById('current-time');
    
    if (!clockDisplay) {
        setTimeout(initClock, 100);
        return;
    }
    
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        const timeString = `${hours}:${minutes}:${seconds}`;
        clockDisplay.textContent = timeString;
    }
    
    // Update immediately and then every second
    updateClock();
    setInterval(updateClock, 1000);
}

// ===== WINDOW ANIMATIONS =====
function initWindowAnimations() {
    const windows = document.querySelectorAll('.window-frame');
    
    // Stagger window animations
    windows.forEach((window, index) => {
        window.style.animationDelay = `${index * 0.1}s`;
        
        // Add hover effects for terminal windows
        if (window.querySelector('.terminal')) {
            addTerminalEffects(window);
        }
    });
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });
    
    windows.forEach(window => observer.observe(window));
}

function addTerminalEffects(windowElement) {
    const terminal = windowElement.querySelector('.terminal');
    if (!terminal) return;
    
    // Add typing effect to terminal content
    const lines = terminal.querySelectorAll('.terminal-line, .terminal-output p');
    lines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.animation = `fadeIn 0.5s ease-out ${index * 0.3}s forwards`;
    });
}

function updateNextMeeting() {
    const nextMeetingElement = document.getElementById('next-meeting');
    if (!nextMeetingElement) return;
    
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 4 = Thursday
    
    // Calculate days until next Thursday
    let daysUntilThursday;
    if (currentDay <= 4) {
        daysUntilThursday = 4 - currentDay;
    } else {
        daysUntilThursday = 7 - currentDay + 4;
    }
    
    // If it's Thursday and after 6 PM, get next Thursday
    if (currentDay === 4 && today.getHours() >= 18) {
        daysUntilThursday = 7;
    }
    
    const nextThursday = new Date(today);
    nextThursday.setDate(today.getDate() + daysUntilThursday);
    
    const options = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
    };
    
    nextMeetingElement.textContent = nextThursday.toLocaleDateString('en-US', options);
}

// ===== GROUP PHOTO CLICK HANDLER =====
function initGroupPhotoClick() {
    const groupPhoto = document.querySelector('.window-frame[data-window="group-photo"] .image-placeholder');
    if (groupPhoto) {
        groupPhoto.addEventListener('click', function() {
            window.open('https://www.flickr.com/photos/ccawmu/', '_blank');
        });
    }
}


// ===== UTILITY FUNCTIONS =====
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? 'var(--success)' : 
                   type === 'error' ? 'var(--error)' : 'var(--accent-primary)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '4px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.9rem',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
    });
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function showComingSoon(feature) {
    showToast(`${feature} coming soon!`, 'info');
}

function showFallbackNavigation() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = `
            <header class="site-header">
                <nav class="navbar">
                    <div class="nav-container">
                        <div class="nav-brand">
                            <a href="index.html" class="brand-link">
                                <div class="brand-icon">⌨️</div>
                                <span class="brand-text">CCaWMU</span>
                            </a>
                        </div>
                        <ul class="nav-menu" id="nav-menu">
                            <li class="nav-item"><a href="index.html" class="nav-link">Home</a></li>
                            <li class="nav-item"><a href="https://github.com/ccowmu/minutes/tree/master/minutes" class="nav-link" target="_blank">Minutes</a></li>
                            <li class="nav-item"><a href="chat.html" class="nav-link">Chat</a></li>
                            <li class="nav-item"><a href="https://experiencewmu.wmich.edu/organization/computer-club-at-wmu/events" class="nav-link" target="_blank">Events</a></li>
                            <li class="nav-item"><a href="https://cclub.cs.wmich.edu/wiki/Main_Page" class="nav-link" target="_blank">Wiki</a></li>
                        </ul>
                        <div class="nav-controls">
                            <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
                                <span class="theme-icon light">☀️</span>
                                <span class="theme-icon dark">🌙</span>
                            </button>
                            <div class="nav-clock" id="nav-clock">
                                <span id="current-time">--:--:--</span>
                            </div>
                            <a href="join.html" class="nav-join-btn">Join</a>
                        </div>
                        <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
                            <span class="bar"></span>
                            <span class="bar"></span>
                            <span class="bar"></span>
                        </button>
                    </div>
                </nav>
            </header>
        `;
        
        // Initialize components after DOM is ready
        setTimeout(() => {
            initClock();
            initTheme();
            initNavigation();
        }, 100);
    }
}

function showFallbackFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = `
            <footer class="site-footer">
                <div class="container">
                    <div class="footer-content">
                        <!-- Contact Info -->
                        <div class="footer-section">
                            <h3>Connect With Us</h3>
                            <div class="contact-links">
                                <a href="mailto:rso_cclub@wmich.edu" class="contact-link">
                                    <span class="contact-icon">📧</span>
                                    <span>rso_cclub@wmich.edu</span>
                                </a>
                                <a href="https://github.com/ccowmu" class="contact-link" target="_blank" rel="noopener">
                                    <span class="contact-icon">🐙</span>
                                    <span>GitHub</span>
                                </a>
                                <a href="chat.html" class="contact-link">
                                    <span class="contact-icon">💬</span>
                                    <span>Element/Matrix Chat</span>
                                </a>
                            </div>
                        </div>

                        <!-- Quick Links -->
                        <div class="footer-section footer-buttons-section">
                            <h3>Quick Links</h3>
                            <div class="footer-buttons">
                                <a href="https://github.com/ccowmu/minutes/tree/master/minutes" target="_blank" class="footer-button">
                                    <span class="button-icon">📋</span>
                                    <span>Meeting Minutes</span>
                                </a>
                                <a href="https://experiencewmu.wmich.edu/organization/computer-club-at-wmu/events" target="_blank" class="footer-button">
                                    <span class="button-icon">📅</span>
                                    <span>Upcoming Events</span>
                                </a>
                                <a href="https://cclub.cs.wmich.edu/wiki/Main_Page" target="_blank" class="footer-button">
                                    <span class="button-icon">📚</span>
                                    <span>Club Wiki</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Footer Bottom -->
                    <div class="footer-bottom">
                        <div class="footer-text">
                            <p>&copy; 2025 Computer Club at Western Michigan University</p>
                            <p class="footer-motto">Built with ❤️, caffeine, and way too many late nights</p>
                        </div>
                        <div class="footer-ascii">
                            <pre class="ascii-art">
 ██████╗ ██████╗ █████╗ ██╗    ██╗███╗   ███╗██╗   ██╗
██╔════╝██╔════╝██╔══██╗██║    ██║████╗ ████║██║   ██║
██║     ██║     ███████║██║ █╗ ██║██╔████╔██║██║   ██║
██║     ██║     ██╔══██║██║███╗██║██║╚██╔╝██║██║   ██║
╚██████╗╚██████╗██║  ██║╚███╔███╔╝██║ ╚═╝ ██║╚██████╔╝
 ╚═════╝ ╚═════╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝     ╚═╝ ╚═════╝ 
                                                      
                            </pre>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Alt + H = Home
    if (e.altKey && e.code === 'KeyH') {
        e.preventDefault();
        window.location.href = 'index.html';
    }
    
    // Alt + M = Minutes
    if (e.altKey && e.code === 'KeyM') {
        e.preventDefault();
        window.open('https://github.com/ccowmu/minutes/tree/master/minutes', '_blank');
    }
    
    // Alt + C = Chat
    if (e.altKey && e.code === 'KeyC') {
        e.preventDefault();
        window.location.href = 'chat.html';
    }
    
    // Alt + J = Join
    if (e.altKey && e.code === 'KeyJ') {
        e.preventDefault();
        window.location.href = 'join.html';
    }
    
    // Alt + T = Toggle Theme
    if (e.altKey && e.code === 'KeyT') {
        e.preventDefault();
        toggleTheme();
    }
});

// ===== LAZY LOADING =====
function lazyLoadScripts() {
    // Only load stats.js if we're on the index page
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        const statsScript = document.createElement('script');
        statsScript.src = 'js/stats.js';
        statsScript.defer = true;
        document.head.appendChild(statsScript);
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Preload critical resources on hover
function addPreloadOnHover() {
    const links = document.querySelectorAll('a[href*=".html"]');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            const href = link.getAttribute('href');
            if (href && !document.querySelector(`link[href="${href}"]`)) {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'prefetch';
                preloadLink.href = href;
                document.head.appendChild(preloadLink);
            }
        }, { once: true });
    });
}

// Add performance optimizations after page load
requestIdleCallback(() => {
    addPreloadOnHover();
});

// ===== CSS ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .toast {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
`;
document.head.appendChild(style);

// ===== STREAM HEIGHT SYNC =====
function syncStreamHeightToAbout() {
    // Only apply on wider viewports where windows are side-by-side
    const isWide = window.matchMedia('(min-width: 769px)').matches;
    const aboutContent = document.querySelector('.window-frame[data-window="about"] .window-content');
    const streamContent = document.querySelector('.window-frame[data-window="stream"] .window-content');
    if (!streamContent) return;

    if (!isWide || !aboutContent) {
        // On small screens or if about is missing, let stream auto-size
        streamContent.style.height = '';
        return;
    }

    // Measure about window content height and apply to stream content
    const aboutHeight = aboutContent.getBoundingClientRect().height;
    if (aboutHeight > 0) {
        streamContent.style.height = `${aboutHeight}px`;
    }
}

// Simple debounce utility
function debounce(fn, wait = 100) {
    let t;
    return function(...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}
