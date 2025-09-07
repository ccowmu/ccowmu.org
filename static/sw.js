// Service Worker for CCaWMU.org
// Provides caching, offline support, and performance optimizations

const CACHE_NAME = 'ccawmu-v1.0.0';
const STATIC_CACHE = 'ccawmu-static-v1.0.0';
const DYNAMIC_CACHE = 'ccawmu-dynamic-v1.0.0';

// Resources to cache immediately
const STATIC_ASSETS = [
    './',
    './index.html',
    './join.html',
    './connect.html',
    './css/style.css',
    './js/main.js',
    './js/clock.js',
    './js/stats.js',
    './includes/header.html',
    './includes/footer.html',
    './images/group_photo_2025.webp',
    './images/election_night_2025.webp',
    './favicon.ico',
    './images/icon.png',
    './images/icon-16x16.png',
    './images/icon-32x32.png',
    './images/icon-48x48.png',
    './images/icon-192x192.png',
    './images/icon-192x192.webp',
    './images/icon-512x512.png',
    './images/icon-512x512.webp',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Inter:wght@300;400;500&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Service Worker: Static assets cached');
                return self.skipWaiting();
            })
            .catch(err => {
                console.error('Service Worker: Error caching static assets:', err);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external requests (except fonts)
    const url = new URL(request.url);
    const isExternal = url.origin !== location.origin;
    const isFonts = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
    
    if (isExternal && !isFonts) {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // Clone the request because it's a stream
                const fetchRequest = request.clone();
                
                return fetch(fetchRequest)
                    .then(response => {
                        // Check if valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response because it's a stream
                        const responseToCache = response.clone();
                        
                        // Cache dynamic content
                        caches.open(DYNAMIC_CACHE)
                            .then(cache => {
                                cache.put(request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // Return offline fallback for HTML pages
                        if (request.headers.get('Accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// Background sync for form submissions (future enhancement)
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        console.log('Service Worker: Background sync triggered');
        // Handle background sync logic here
    }
});

// Push notifications (future enhancement)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: 'ccawmu-notification'
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});
